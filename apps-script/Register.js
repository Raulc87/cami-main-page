// `register` action (EVENTS_API_CONTRACT §3.3, §5-§7; US-021). Coupons, abuse limits and
// metrics are CMP-027; the payment check and the participant emails are CMP-028.

var REGISTRATION_HEADERS = [
  'timestamp', 'submissionId', 'reference', 'eventCode', 'participantName', 'email', 'whatsapp', 'lang',
  'couponCode', 'discountPercent', 'amountDueCrc', 'screenshotUrl', 'checkResult', 'checkDetails',
  'needsReview', 'status', 'consentAt', 'notes'
];

// The event for a registration: the first row of its code that passes validation, wherever it is
// published or not (a late paid registration is stored and flagged, BR-E13). `duplicated` is true
// when the code appears in more than one row (FFR-019). null when no valid row exists.
function lookupEventForRegister_(eventCode) {
  var rows = readTable('Events').filter(function (r) { return str_(r.v.eventCode).trim() === eventCode; });
  if (!rows.length) return null;
  for (var i = 0; i < rows.length; i++) {
    var res = validateEventRow_(rawEventFrom_(rows[i]));
    if (!res.problems.length) {
      return { event: res.event, published: isTrue_(rows[i].v.published), duplicated: rows.length > 1 };
    }
  }
  return null;
}

// Decodes and checks the screenshot, and converts it to JPEG when the platform can. A type that
// cannot be converted is kept as it is with its own extension. Returns { error } or
// { blob, extension, converted }.
function prepareScreenshot_(file) {
  var bytes;
  try {
    bytes = Utilities.base64Decode(str_(file.base64));
  } catch (err) {
    return { error: 'invalid_file_type' };
  }
  if (bytes.length > MAX_FILE_BYTES) return { error: 'file_too_large' };
  var type = detectImageType_(bytes);
  if (!type) return { error: 'invalid_file_type' };
  var mime = { jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', heic: 'image/heic' }[type];
  var blob = Utilities.newBlob(bytes, mime, 'screenshot');
  if (type === 'jpeg') return { blob: blob, extension: 'jpg', converted: false };
  try {
    var jpeg = blob.getAs('image/jpeg');
    if (jpeg.getBytes().length > 0) return { blob: jpeg, extension: 'jpg', converted: true };
  } catch (err) {
    console.error('jpeg conversion failed for ' + type);
  }
  return { blob: blob, extension: type === 'heic' ? 'heic' : type, converted: false };
}

function eventFolder_(eventCode) {
  var root = DriveApp.getFolderById(getProp('DRIVE_ROOT_FOLDER_ID'));
  var existing = root.getFoldersByName(eventCode);
  return existing.hasNext() ? existing.next() : root.createFolder(eventCode);
}

function handleRegister_(body) {
  var input = validateRegisterInput_(body);
  if (input.honeypot) {
    // A bot filled the hidden field: answer as if it worked and store nothing (contract §3.3).
    var code = EVENT_CODE_RE.test(str_(body.eventCode).trim().toUpperCase()) ? str_(body.eventCode).trim().toUpperCase() : 'EV';
    return ok({ reference: makeReference_(code, Date.now(), Math.random), flagged: false, duplicateSubmission: false });
  }
  if (Object.keys(input.fields).length) return fail('VALIDATION_ERROR', input.fields);
  var v = input.value;

  var found = lookupEventForRegister_(v.eventCode);
  if (!found) return fail('EVENT_NOT_FOUND');
  var ev = found.event;
  // Coupons are CMP-027: until then a code is not accepted and the visitor pays the full price.
  if (v.couponCode) return fail('COUPON_INVALID');

  var amountDue = ev.priceCrc;
  var screenshot = null;
  if (amountDue > 0) {
    if (!input.hasFile) return fail('VALIDATION_ERROR', { file: 'required' });
    screenshot = prepareScreenshot_(body.file);
    if (screenshot.error) return fail('VALIDATION_ERROR', { file: screenshot.error });
  }

  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
  } catch (err) {
    return fail('SERVER_ERROR'); // busy: the visitor retries with the same submissionId
  }
  var outcome;
  try {
    outcome = storeRegistration_(v, found, amountDue, screenshot);
  } finally {
    lock.releaseLock();
  }
  if (outcome.error) return fail(outcome.error);

  // The registration took the last place: rebuild the events answer before replying (FFR-033).
  if (outcome.soldOutNow) {
    try {
      refreshEventsCache();
    } catch (err) {
      console.error('events refresh after registration failed: ' + err.name);
    }
  }
  return ok({ reference: outcome.reference, flagged: outcome.flagged, duplicateSubmission: outcome.duplicateSubmission });
}

// Everything that must not interleave between two registrations: the duplicate and capacity
// checks, the file and the row. Runs with the script lock held.
function storeRegistration_(v, found, amountDue, screenshot) {
  var ev = found.event;
  var nowMs = Date.now();
  var rows = readTable(v.eventCode); // [] while the event has no tab yet: a refused request creates none

  for (var i = 0; i < rows.length; i++) {
    if (str_(rows[i].v.submissionId) === v.submissionId) {
      return { reference: str_(rows[i].v.reference), flagged: rows[i].v.needsReview === true || str_(rows[i].v.needsReview).toUpperCase() === 'TRUE', duplicateSubmission: true };
    }
  }
  var counting = rows.filter(function (r) {
    var s = str_(r.v.status).trim().toLowerCase();
    return s === 'new' || s === 'confirmed';
  });
  var already = counting.some(function (r) { return str_(r.v.email).trim().toLowerCase() === v.email; });
  if (already) return { error: 'ALREADY_REGISTERED' };

  var decision = registrationDecision_({
    published: found.published,
    closed: nowMs >= ev.startsAtMs - REGISTRATION_CLOSES_HOURS * 3600000,
    soldOut: counting.length >= ev.capacity,
    duplicateCode: found.duplicated
  }, !!screenshot);
  if (decision.refuse) return { error: decision.refuse };

  var used = {};
  rows.forEach(function (r) { used[str_(r.v.reference)] = true; });
  var reference;
  for (var attempt = 0; ; attempt++) {
    reference = makeReference_(v.eventCode, nowMs, Math.random);
    if (!used[reference]) break;
    if (attempt >= 50) throw new Error('no free reference'); // practically impossible: 1.6 million per day
  }

  var createdFile = null;
  var screenshotUrl = '';
  try {
    if (screenshot) {
      var folder = eventFolder_(v.eventCode);
      var dateText = crIso_(nowMs).slice(0, 10);
      var name = uniqueFileName_(v.participantName, dateText, v.eventCode, screenshot.extension, function (n) {
        return folder.getFilesByName(n).hasNext();
      });
      createdFile = folder.createFile(screenshot.blob.setName(name));
      screenshotUrl = createdFile.getUrl();
    }
    // A screenshot kept in its own format is noted for Cami; it is not a review flag (FFR-030).
    var notes = decision.flags.slice();
    if (screenshot && screenshot.extension !== 'jpg') notes.push('stored as original format: ' + screenshot.extension);
    var timestamp = crIso_(nowMs);
    var values = [
      "'" + timestamp, v.submissionId, reference, v.eventCode, neutralize(v.participantName), neutralize(v.email),
      neutralize(v.whatsapp), v.lang, neutralize(v.couponCode), '', amountDue, screenshotUrl,
      screenshot ? 'pending' : 'not-required', notes.join('; '), decision.flags.length > 0, 'new',
      "'" + timestamp, ''
    ];
    var sheet = getOrCreateSheet(v.eventCode, REGISTRATION_HEADERS);
    var row = sheet.getLastRow() + 1;
    sheet.getRange(row, 1, 1, values.length).setValues([values]);
  } catch (err) {
    if (createdFile) createdFile.setTrashed(true); // no orphan file when the row could not be written
    throw err;
  }
  return {
    reference: reference, flagged: decision.flags.length > 0, duplicateSubmission: false,
    // Only the registration that takes the last place changes what visitors see (FFR-033).
    soldOutNow: counting.length < ev.capacity && counting.length + 1 >= ev.capacity
  };
}
