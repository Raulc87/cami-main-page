// `register` action (EVENTS_API_CONTRACT §3.3, §5-§7; US-021, US-020, US-024). Coupons, abuse limits and
// metrics live in Coupons.js, Limits.js and Alerts.js; the payment check and the participant emails are CMP-028.

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
  var best = null;
  for (var i = 0; i < rows.length; i++) {
    var res = validateEventRow_(rawEventFrom_(rows[i]));
    if (res.problems.length) continue;
    var published = isTrue_(rows[i].v.published);
    if (!best || (published && !best.published)) { // a published row wins over a draft of the same code
      best = { event: res.event, published: published, duplicated: rows.length > 1 };
    }
  }
  return best;
}

// Decodes and checks the screenshot, and converts it to JPEG when the platform can. A type that
// cannot be converted is kept as it is with its own extension. Returns { error } or
// { blob, extension }.
function prepareScreenshot_(file) {
  var bytes;
  try {
    // Tolerate a `data:image/...;base64,` prefix and line breaks from the client.
    bytes = Utilities.base64Decode(normalizeBase64_(file.base64));
  } catch (err) {
    return { error: 'invalid_file_type' };
  }
  if (bytes.length > MAX_FILE_BYTES) return { error: 'file_too_large' };
  var type = detectImageType_(bytes);
  if (!type) return { error: 'invalid_file_type' };
  var mime = { jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', heic: 'image/heic' }[type];
  var blob = Utilities.newBlob(bytes, mime, 'screenshot');
  if (type === 'jpeg') return { blob: blob, extension: 'jpg' };
  try {
    var jpeg = blob.getAs('image/jpeg');
    if (jpeg.getBytes().length > 0) return { blob: jpeg, extension: 'jpg' };
  } catch (err) {
    console.error('jpeg conversion failed for ' + type);
  }
  return { blob: blob, extension: type };
}

function eventFolder_(eventCode) {
  var root = DriveApp.getFolderById(getProp('DRIVE_ROOT_FOLDER_ID'));
  var existing = root.getFoldersByName(eventCode);
  return existing.hasNext() ? existing.next() : root.createFolder(eventCode);
}

function handleRegister_(body) {
  // Global throttle first: it applies to every write, flagged or not (FEATURE_SPEC §12).
  if (bumpWindow_('register') > getNumberProp('LIMIT_REGISTER_PER_MIN')) {
    bumpMetric_('throttled', 1);
    checkAlertsSafely_();
    return fail('RATE_LIMITED');
  }
  var input = validateRegisterInput_(body);
  if (input.honeypot) {
    // A bot filled the hidden field: answer as if it worked and store nothing (contract §3.3).
    var code = EVENT_CODE_RE.test(str_(body.eventCode).trim().toUpperCase()) ? str_(body.eventCode).trim().toUpperCase() : 'EV';
    bumpMetric_('honeypotHits', 1);
    checkAlertsSafely_();
    return ok({ reference: makeReference_(code, Date.now(), Math.random), flagged: false, duplicateSubmission: false });
  }
  if (Object.keys(input.fields).length) return fail('VALIDATION_ERROR', input.fields);
  var v = input.value;

  // A retry of a stored registration returns its original reference even if the event row has
  // since been removed or become invalid (FFR-022, US-021 AC6).
  var stored = findStoredSubmission_(v.eventCode, v.submissionId);
  if (stored) return ok(stored);

  var found = lookupEventForRegister_(v.eventCode);
  if (!found) return fail('EVENT_NOT_FOUND');
  var ev = found.event;

  // The coupon must exist for this event (any request); whether it is still usable is decided
  // under the lock, because that depends on the registrations at that moment (BR-E13).
  var coupon = null;
  if (v.couponCode) {
    coupon = findCoupon_(v.eventCode, v.couponCode);
    if (!coupon) {
      bumpMetric_('couponFailures', 1);
      return fail('COUPON_INVALID');
    }
  }

  var amountDue = coupon ? amountDue_(ev.priceCrc, coupon.discountPercent) : ev.priceCrc;
  var screenshot = null;
  if (amountDue > 0) {
    if (!input.hasFile) return fail('VALIDATION_ERROR', { file: 'required' });
    if (uploadCapReached_(crDate_(Date.now()), 0)) return fail('UPLOAD_CAP_REACHED');
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
    outcome = storeRegistration_(v, found, coupon, amountDue, screenshot);
  } finally {
    lock.releaseLock();
  }
  if (outcome.error) {
    if (outcome.error.indexOf('COUPON_') === 0) bumpMetric_('couponFailures', 1);
    if (outcome.error === 'UPLOAD_CAP_REACHED') checkAlertsSafely_();
    return fail(outcome.error);
  }

  if (!outcome.duplicateSubmission) {
    bumpMetric_('accepted', 1);
    if (outcome.bytes) bumpMetric_('uploadedMb', outcome.bytes / (1024 * 1024));
    if (outcome.capReached) checkAlertsSafely_();
  }
  // The registration took the last place: rebuild the events answer before replying (FFR-033).
  if (outcome.soldOutNow) {
    try {
      rebuildEventsCache_();
    } catch (err) {
      console.error('events refresh after registration failed: ' + err.name);
    }
  }
  return ok({ reference: outcome.reference, flagged: outcome.flagged, duplicateSubmission: outcome.duplicateSubmission });
}

// The answer for a submissionId already stored in the event's tab, or null. Creates no tab.
function findStoredSubmission_(eventCode, submissionId) {
  if (RESERVED_EVENT_CODES.indexOf(eventCode) !== -1) return null;
  var rows = readTable(eventCode);
  for (var i = 0; i < rows.length; i++) {
    if (str_(rows[i].v.submissionId) === submissionId) {
      var nr = rows[i].v.needsReview;
      return { reference: str_(rows[i].v.reference), flagged: nr === true || str_(nr).toUpperCase() === 'TRUE', duplicateSubmission: true };
    }
  }
  return null;
}

// Everything that must not interleave between two registrations: the duplicate, capacity,
// coupon and upload-cap checks, the file and the row. Runs with the script lock held.
function storeRegistration_(v, found, coupon, amountDue, screenshot) {
  var ev = found.event;
  var nowMs = Date.now();
  var today = crDate_(nowMs);
  var rows = readTable(v.eventCode); // [] while the event has no tab yet: a refused request creates none

  for (var i = 0; i < rows.length; i++) {
    if (str_(rows[i].v.submissionId) === v.submissionId) {
      return { reference: str_(rows[i].v.reference), flagged: rows[i].v.needsReview === true || str_(rows[i].v.needsReview).toUpperCase() === 'TRUE', duplicateSubmission: true };
    }
  }
  var counting = countingRows_(rows);
  var already = counting.some(function (r) { return str_(r.v.email).trim().toLowerCase() === v.email; });
  if (already) return { error: 'ALREADY_REGISTERED' };

  var decision = registrationDecision_({
    published: found.published,
    closed: nowMs >= ev.startsAtMs - REGISTRATION_CLOSES_HOURS * 3600000,
    soldOut: counting.length >= ev.capacity,
    duplicateCode: found.duplicated
  }, !!screenshot);
  if (decision.refuse) return { error: decision.refuse };

  // A coupon that stopped being usable after the visitor applied it: a paid registration keeps
  // the discount and is flagged, a ₡0 one is refused with the coupon message (US-020 AC5).
  var flags = decision.flags.slice();
  if (coupon) {
    var problem = couponProblem_(coupon, usesOf_(counting, coupon.couponCode).length, false, nowMs);
    if (problem) {
      if (!screenshot) return { error: problem };
      flags.push('coupon changed');
    }
  }

  // Daily upload caps, exact now that registrations are serialized (₡0 ones are unaffected).
  if (screenshot && uploadCapReached_(today, screenshot.blob.getBytes().length)) return { error: 'UPLOAD_CAP_REACHED' };

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
  var bytes = 0;
  try {
    if (screenshot) {
      var folder = eventFolder_(v.eventCode);
      var name = uniqueFileName_(v.participantName, today, v.eventCode, screenshot.extension, function (n) {
        return folder.getFilesByName(n).hasNext();
      });
      bytes = screenshot.blob.getBytes().length;
      createdFile = folder.createFile(screenshot.blob.setName(name));
      screenshotUrl = createdFile.getUrl();
    }
    // A screenshot kept in its own format is noted for Cami; it is not a review flag (FFR-030).
    var notes = flags.slice();
    if (screenshot && screenshot.extension !== 'jpg') notes.push('stored as original format: ' + screenshot.extension);
    var timestamp = crIso_(nowMs);
    var values = [
      "'" + timestamp, v.submissionId, reference, "'" + v.eventCode, neutralize(v.participantName), neutralize(v.email),
      neutralize(v.whatsapp), v.lang, neutralize(v.couponCode), coupon ? coupon.discountPercent : '', amountDue, screenshotUrl,
      screenshot ? 'pending' : 'not-required', notes.join('; '), flags.length > 0, 'new',
      "'" + timestamp, ''
    ];
    var sheet = getOrCreateSheet(v.eventCode, REGISTRATION_HEADERS);
    var row = sheet.getLastRow() + 1;
    sheet.getRange(row, 1, 1, values.length).setValues([values]);
    if (screenshot) {
      addDaily_(DAILY_UPLOADS_PREFIX, today, 1);
      addDaily_(DAILY_BYTES_PREFIX, today, bytes);
    }
  } catch (err) {
    if (createdFile) createdFile.setTrashed(true); // no orphan file when the row could not be written
    throw err;
  }
  return {
    reference: reference, flagged: flags.length > 0, duplicateSubmission: false, bytes: bytes,
    capReached: !!screenshot && uploadCapReached_(today, 0),
    // Only the registration that takes the last place changes what visitors see (FFR-033).
    soldOutNow: counting.length < ev.capacity && counting.length + 1 >= ev.capacity
  };
}
