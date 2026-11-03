// `register` action (EVENTS_API_CONTRACT §3.3, §5-§7; US-021, US-020, US-024). Coupons, abuse limits and
// metrics live in Coupons.js, Limits.js and Alerts.js; the payment check and the participant emails are Payment.js and Mail.js (CMP-028).

var REGISTRATION_HEADERS = [
  'timestamp', 'submissionId', 'reference', 'eventCode', 'participantName', 'email', 'whatsapp', 'lang',
  'couponCode', 'discountPercent', 'amountDueCrc', 'screenshotUrl', 'checkResult', 'checkDetails',
  'needsReview', 'status', 'consentAt', 'notes', 'contactOptIn', 'noticeSentAt'
];

// `noticeSentAt` (contract §6 v1.11): blank = the registration notice is still due; a timestamp = sent;
// `skipped` = not sent and never retried; `-` = a row saved before v1.11, never notified.
var NOTICE_SKIPPED = 'skipped';
var NOTICE_NEVER = '-';

// A tab created before a column was added lacks its header: add the missing trailing headers (older
// rows stay blank in them, read as FALSE). Only when the existing header row is a prefix of ours.
// Older rows get `-` in `noticeSentAt`, so they are never notified (contract §6 v1.11). The caller
// holds the script lock, so no new row is appended while the older ones are marked. The marks are
// written before the headers: if a Sheets call fails in between, the headers are still missing, so the
// next run finishes the migration instead of finding a tab that looks complete with unmarked rows.
function ensureRegistrationHeaders_(sheet) {
  var existing = existingRegistrationHeaders_(sheet);
  var have = existing.length;
  if (have >= REGISTRATION_HEADERS.length || have < 1) return;
  var isPrefix = existing.every(function (h, i) { return h === REGISTRATION_HEADERS[i]; });
  if (!isPrefix) { console.error('registration tab headers differ from the expected ones; missing headers not added'); return; }
  var missing = REGISTRATION_HEADERS.slice(have);
  if (missing.indexOf('noticeSentAt') !== -1) markOlderRowsNeverNotified_(sheet);
  sheet.getRange(1, have + 1, 1, missing.length).setValues([missing]);
}

// The header cells from the first one up to the first blank cell, trimmed.
function existingRegistrationHeaders_(sheet) {
  var width = Math.min(Math.max(sheet.getLastColumn(), 1), REGISTRATION_HEADERS.length);
  var cells = sheet.getRange(1, 1, 1, width).getValues()[0].map(function (h) { return String(h).trim(); });
  var blank = cells.indexOf('');
  return blank === -1 ? cells : cells.slice(0, blank);
}

// Writes `-` in `noticeSentAt` of every row with content (blank rows stay blank). Safe to repeat.
function markOlderRowsNeverNotified_(sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return;
  var rows = sheet.getRange(2, 1, lastRow - 1, REGISTRATION_HEADERS.length - 1).getValues();
  var marks = rows.map(function (row) {
    var hasContent = row.some(function (cell) { return cell !== '' && cell !== null; });
    return [hasContent ? NOTICE_NEVER : ''];
  });
  sheet.getRange(2, REGISTRATION_HEADERS.indexOf('noticeSentAt') + 1, marks.length, 1).setValues(marks);
}

// The trigger's turn at the same migration, so a tab with no `register` since the deploy is ready
// before any row is handled (contract §6 v1.11). A busy lock only delays it to the next run.
function ensureRegistrationHeadersInAllTabs_() {
  var release = takeShortLock_(20000);
  if (!release) {
    console.error('registration headers check skipped: lock busy');
    return;
  }
  try {
    registrationSheetNames_().forEach(function (name) { ensureRegistrationHeaders_(getSpreadsheet().getSheetByName(name)); });
  } finally {
    release();
  }
}

// Colors of `checkResult` values and the row highlight for `needsReview` (CMP-094). Looks only:
// columns, headers and values stay as in the contract (§7).
var CHECK_RESULT_COLORS = {
  'ok': '#b7e1cd', 'mismatch': '#f4c7c3', 'unreadable': '#fce5cd', 'pending': '#fff2cc', 'not-required': '#d9d9d9'
};
var NEEDS_REVIEW_ROW_COLOR = '#fdeaea';
var REGISTRATION_STATUSES = ['new', 'confirmed', 'refund/cancelled', 'spam'];
var CHECK_RESULT_VALUES = Object.keys(CHECK_RESULT_COLORS);

// Formatting a new event tab (CMP-094, CMP-107): `status` and `checkResult` dropdowns in warning mode
// (a value outside the list is accepted with a warning, never rejected), `checkResult` colors, a
// `needsReview` checkbox and a light-red row when `needsReview` is TRUE. The backend keeps writing
// and reading booleans and plain `checkResult` words, which the checkbox and the dropdown accept.
// Applied only when the tab is created; existing tabs are formatted by hand.
function formatNewEventTab_(sheet) {
  var maxRows = sheet.getMaxRows();
  if (maxRows < 2) return;
  var rowCount = maxRows - 1;
  var columnLetter = function (header) { return columnLetterOf_(REGISTRATION_HEADERS.indexOf(header) + 1); };
  var statusRange = sheet.getRange(2, REGISTRATION_HEADERS.indexOf('status') + 1, rowCount, 1);
  statusRange.setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(REGISTRATION_STATUSES, true).setAllowInvalid(true).build()
  );
  var checkResultRange = sheet.getRange(2, REGISTRATION_HEADERS.indexOf('checkResult') + 1, rowCount, 1);
  checkResultRange.setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(CHECK_RESULT_VALUES, true).setAllowInvalid(true).build()
  );
  sheet.getRange(2, REGISTRATION_HEADERS.indexOf('needsReview') + 1, rowCount, 1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireCheckbox().setAllowInvalid(true).build()
  );
  var rules = Object.keys(CHECK_RESULT_COLORS).map(function (value) {
    return SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(value).setBackground(CHECK_RESULT_COLORS[value]).setRanges([checkResultRange]).build();
  });
  var rowRange = sheet.getRange(2, 1, rowCount, REGISTRATION_HEADERS.length);
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$' + columnLetter('needsReview') + '2=TRUE')
      .setBackground(NEEDS_REVIEW_ROW_COLOR).setRanges([rowRange]).build()
  );
  sheet.setConditionalFormatRules(rules);
  // The tab is new, so it holds only its header row. If the checkboxes wrote FALSE into the empty cells,
  // getLastRow() would point past the data area and registrations would land at the bottom: clear them.
  if (sheet.getLastRow() > 1) sheet.getRange(2, 1, rowCount, REGISTRATION_HEADERS.length).clearContent();
}

// 1 -> A, 26 -> Z, 27 -> AA.
function columnLetterOf_(columnNumber) {
  var letters = '';
  for (var n = columnNumber; n > 0; n = Math.floor((n - 1) / 26)) {
    letters = String.fromCharCode(65 + ((n - 1) % 26)) + letters;
  }
  return letters;
}

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

// Decodes and checks the screenshot (`fileBase64`: the file's base64 text already normalized by
// validateRegisterInput_). A JPEG or PNG is stored as received: converting a PNG costs about 5 s of
// the visitor's wait (FFR-014 v1.16, contract §3.3 v1.12). A WebP or HEIC/HEIF is converted to JPEG;
// when the platform cannot, it is kept as it is with its own extension and `keptOriginalFormat`
// is set (FFR-017: that file gets no retries and no "not validated" email if OCR cannot read it).
// Returns { error } or { blob, extension, byteLength, keptOriginalFormat }.
function prepareScreenshot_(fileBase64) {
  var bytes;
  try {
    bytes = Utilities.base64Decode(fileBase64);
  } catch (err) {
    return { error: 'invalid_file_type' };
  }
  if (bytes.length > MAX_FILE_BYTES) return { error: 'file_too_large' };
  var type = detectImageType_(bytes);
  if (!type) return { error: 'invalid_file_type' };
  var mime = { jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', heic: 'image/heic' }[type];
  var blob = Utilities.newBlob(bytes, mime, 'screenshot');
  if (type === 'jpeg') return { blob: blob, extension: 'jpg', byteLength: bytes.length, keptOriginalFormat: false };
  if (type === 'png') return { blob: blob, extension: 'png', byteLength: bytes.length, keptOriginalFormat: false };
  try {
    var jpegBytes = blob.getAs('image/jpeg').getBytes();
    if (jpegBytes.length > 0) {
      return { blob: Utilities.newBlob(jpegBytes, 'image/jpeg', 'screenshot'), extension: 'jpg', byteLength: jpegBytes.length, keptOriginalFormat: false };
    }
  } catch (err) {
    console.error('jpeg conversion failed for ' + type);
  }
  return { blob: blob, extension: type, byteLength: bytes.length, keptOriginalFormat: true };
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
    var slot = takeCouponFailureSlot_();
    if (slot === null) {
      bumpMetric_('throttled', 1);
      checkAlertsSafely_();
      return fail('RATE_LIMITED');
    }
    coupon = findCoupon_(v.eventCode, v.couponCode);
    if (!coupon) {
      bumpMetric_('couponFailures', 1);
      return fail('COUPON_INVALID');
    }
    giveBackCouponFailureSlot_(slot); // the code exists: a later refusal below counts it again
  }

  var amountDue = coupon ? amountDue_(ev.priceCrc, coupon.discountPercent) : ev.priceCrc;
  var screenshot = null;
  if (amountDue > 0) {
    if (!input.hasFile) return fail('VALIDATION_ERROR', { file: 'required' });
    if (uploadCapReached_(crDate_(Date.now()), 0)) return fail('UPLOAD_CAP_REACHED');
    screenshot = prepareScreenshot_(input.fileBase64);
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
    releaseAfterFlush_(lock);
  }
  if (outcome.error) {
    if (outcome.error.indexOf('COUPON_') === 0) {
      bumpMetric_('couponFailures', 1);
      bumpWindow_('couponfail');
    }
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
  if (!outcome.duplicateSubmission) {
    afterStore_(v, found, outcome);
    // A ₡0 registration has no check to wait for: its notice is the last step (FFR-034). A paid one
    // is noticed by the trigger once the check has written its result (FFR-035).
    if (!outcome.fileId) sendRegistrationNoticeSafely_(v.eventCode, v.submissionId, { allowPending: false });
  }
  return ok({ reference: outcome.reference, flagged: outcome.flagged, duplicateSubmission: outcome.duplicateSubmission });
}

// After the registration is stored and the lock is released: the participant email (US-025). The
// payment check is not run here: the row stays `pending` for the trigger (FFR-035). Nothing here
// may fail the registration; problems are written to the row.
function afterStore_(v, found, outcome) {
  try {
    var row = {
      participantName: v.participantName, email: v.email, lang: v.lang, reference: outcome.reference,
      amountDueCrc: outcome.amountDueCrc, couponCode: v.couponCode, submissionId: v.submissionId
    };
    var kind = outcome.flags.length ? 'received' : 'confirmation';
    sendParticipantMail_(kind, row, found.event, v.eventCode, { reasons: outcome.flags });
  } catch (err) {
    console.error('after-store steps failed: ' + (err && err.name));
  }
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
    // Read again: Cami may have changed the coupon since the check, while this request waited for the lock.
    var currentCoupon = findCoupon_(v.eventCode, coupon.couponCode);
    var problem = currentCoupon ? couponProblem_(currentCoupon, usesOf_(counting, coupon.couponCode).length, false, nowMs) : 'COUPON_INVALID';
    if (problem) {
      if (!screenshot) return { error: problem };
      flags.push('coupon changed');
    }
  }

  // Daily upload caps, exact now that registrations are serialized (₡0 ones are unaffected).
  if (screenshot && uploadCapReached_(today, screenshot.byteLength)) {
    addDaily_(DAILY_CAPHIT_PREFIX, today, 1); // the alert sees a refused upload even when the stored total is below the cap
    return { error: 'UPLOAD_CAP_REACHED' };
  }

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
      bytes = screenshot.byteLength;
      createdFile = folder.createFile(screenshot.blob.setName(name));
      screenshotUrl = createdFile.getUrl();
    }
    // A WebP or HEIC kept in its own format is noted for Cami; it is not a review flag (FFR-030).
    var notes = flags.slice();
    if (screenshot && screenshot.keptOriginalFormat) notes.push('stored as original format: ' + screenshot.extension);
    var timestamp = crIso_(nowMs);
    var values = [
      "'" + timestamp, v.submissionId, reference, "'" + v.eventCode, neutralize(v.participantName), neutralize(v.email),
      neutralize(v.whatsapp), v.lang, neutralize(v.couponCode), coupon ? coupon.discountPercent : '', amountDue, screenshotUrl,
      screenshot ? 'pending' : 'not-required', notes.join('; '), flags.length > 0, 'new',
      "'" + timestamp, '', v.contactOptIn === true, ''
    ];
    var tabExisted = getSpreadsheet().getSheetByName(v.eventCode) !== null;
    var sheet = getOrCreateSheet(v.eventCode, REGISTRATION_HEADERS);
    if (!tabExisted) {
      // Looks only: a formatting failure must not lose the registration.
      try { formatNewEventTab_(sheet); } catch (formatErr) { console.error('event tab format failed: ' + (formatErr && formatErr.name)); }
    }
    ensureRegistrationHeaders_(sheet);
    var row = sheet.getLastRow() + 1;
    sheet.getRange(row, 1, 1, values.length).setValues([values]);
  } catch (err) {
    if (createdFile) createdFile.setTrashed(true); // no orphan file when the row could not be written
    throw err;
  }
  // The registration is stored; a counter that cannot be updated must not undo it or trash its file.
  if (screenshot) {
    try {
      addDaily_(DAILY_UPLOADS_PREFIX, today, 1);
      addDaily_(DAILY_BYTES_PREFIX, today, bytes);
    } catch (err) {
      console.error('upload counters failed: ' + (err && err.name));
    }
  }
  return {
    reference: reference, flagged: flags.length > 0, duplicateSubmission: false, bytes: bytes, amountDueCrc: amountDue,
    flags: flags, fileId: createdFile ? createdFile.getId() : '',
    capReached: !!screenshot && uploadCapReached_(today, 0),
    // Only the registration that takes the last place changes what visitors see (FFR-033).
    soldOutNow: counting.length < ev.capacity && counting.length + 1 >= ev.capacity
  };
}
