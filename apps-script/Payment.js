// Payment screenshot check (EVENTS_API_CONTRACT §5; FEATURE_SPEC FFR-017, FFR-030, FFR-032; US-022).
// Drive OCR reads the stored screenshot; the text must show Cami's SINPE number or account name and
// exactly the amount due. The result goes to the registration row; the participant email for a
// failed check is in Mail.js. A check that cannot run for a service reason stays `pending` and the
// 10-minute trigger `retryPendingChecks` runs it again until it is 24 hours old.

var CHECK_REVIEW_FLAGS = ['event closed at submit', 'sold out at submit', 'coupon changed', 'duplicate event code', 'email failed'];
var PENDING_MAX_AGE_MS = 24 * 3600000;
var PENDING_STUCK_KEY = 'PENDING_STUCK';
var OCR_WAITS_REQUEST = [5000];                // in a visitor's request: one retry, then `pending`
var OCR_WAITS_TRIGGER = [5000, 10000, 20000];
var RETRY_RUN_MS = 4.5 * 60000;                // stay inside the 6-minute limit

// `needsReview` (FFR-030): TRUE for a `mismatch` or `unreadable` result or any flag in the details.
function needsReviewFor_(checkResult, details) {
  if (checkResult === 'mismatch' || checkResult === 'unreadable') return true;
  var text = str_(details);
  return CHECK_REVIEW_FLAGS.some(function (flag) { return text.indexOf(flag) !== -1; });
}

function appendDetail_(details, extra) {
  var current = str_(details).trim();
  return current ? current + '; ' + extra : extra;
}

// OCR of one stored file: { text } or { service: true } when Google refuses for a service reason
// (per-user OCR rate limit, quota, backend trouble) or { failed: true } when the file cannot be
// imported. The temporary Doc is always trashed.
function ocrFileText_(fileId, waits) {
  var doc = null;
  try {
    var blob = DriveApp.getFileById(fileId).getBlob();
    doc = insertWithBackoff_(blob, waits);
    return { text: DocumentApp.openById(doc.id).getBody().getText() };
  } catch (err) {
    var message = String(err && err.message);
    console.error('ocr failed: ' + (err && err.name));
    if (/rate limit|quota|too many|backend|timed? ?out|try again|internal error|unavailable/i.test(message)) return { service: true };
    return { failed: true };
  } finally {
    if (doc) {
      try { DriveApp.getFileById(doc.id).setTrashed(true); } catch (err) { console.error('ocr doc cleanup failed'); }
    }
  }
}

// Drive limits OCR per user. Retries with the given pauses, then rethrows.
function insertWithBackoff_(blob, waits) {
  for (var attempt = 0; ; attempt++) {
    try {
      return Drive.Files.insert(
        { title: 'ocr-tmp-' + Date.now(), mimeType: blob.getContentType() },
        blob,
        { ocr: true, ocrLanguage: 'es' }
      );
    } catch (e) {
      if (!/rate limit/i.test(String(e.message)) || attempt >= waits.length) throw e;
      Utilities.sleep(waits[attempt]);
    }
  }
}

// The text a spike or test run needs: { text, ms } (throws on failure).
function ocrText(fileId) {
  var t0 = Date.now();
  var r = ocrFileText_(fileId, OCR_WAITS_TRIGGER);
  if (r.text === undefined) throw new Error('OCR failed');
  return { text: r.text, ms: Date.now() - t0 };
}

// Compares OCR text against the account and an exact amount. The amount must appear as a whole
// number: thousands separators `.`, `,`, space and non-breaking space are allowed inside it, and
// the same separators make a match inside a larger number impossible. No match inside `3,500`,
// `3 500`, `500,000` or `500 000` when the amount is 500; a decimal part like `500,00` is fine.
// Test data: docs/sprints/SPRINT_02_SPIKE.md. A line break between digit groups is not a separator.
function compareOcr(text, accountNumber, accountName, amountCrc) {
  var plain = String(text).replace(/[\u00a0\u202f]/g, ' ');
  var grouped = String(amountCrc).replace(/\B(?=(\d{3})+(?!\d))/g, '[., ]?');
  var before = '(?<!\\d)(?<!(?<!\\d)\\d{1,3}[., ])';
  var after = '(?!\\d)(?![., ]\\d{3}(?!\\d))';
  var amountFound = new RegExp(before + grouped + after).test(plain);
  var squash = function (v) { return String(v).replace(/[\s-]/g, '').toLowerCase(); };
  var haystack = squash(plain);
  var accountFound = (!!accountNumber && haystack.indexOf(squash(accountNumber)) !== -1) ||
    (!!accountName && haystack.indexOf(squash(accountName)) !== -1);
  return { checkResult: amountFound && accountFound ? 'ok' : 'mismatch', accountFound: accountFound, amountFound: amountFound };
}

// Runs the check for one stored screenshot.
// Returns { pending: true } or { checkResult, details, email } where `email` says whether the
// participant gets the "payment not validated" email (not for an original-format file that OCR
// cannot read, US-022 AC7).
function runPaymentCheck_(fileId, amountDueCrc, originalFormat, waits) {
  var sinpe = getSinpe();
  if (sinpe.isPlaceholder || (!sinpe.number && !sinpe.accountName)) {
    console.error('payment check skipped: SINPE properties not set');
    return { pending: true };
  }
  var ocr = ocrFileText_(fileId, waits);
  if (ocr.service) return { pending: true };
  if (ocr.failed || !/\S/.test(ocr.text)) {
    return { checkResult: 'unreadable', details: originalFormat ? 'unreadable original format' : 'no text found', email: !originalFormat };
  }
  var c = compareOcr(ocr.text, sinpe.number, sinpe.accountName, amountDueCrc);
  if (c.checkResult === 'ok') return { checkResult: 'ok', details: '', email: false };
  var failing = [];
  if (!c.accountFound) failing.push('account not found');
  if (!c.amountFound) failing.push('amount not found');
  return { checkResult: 'mismatch', details: failing.join(', '), email: true };
}

// Writes a check result into the registration row (under the script lock). Returns true if written.
function applyCheckResult_(eventCode, submissionId, result) {
  var release = takeShortLock_(20000);
  if (!release) return false;
  try {
    var sheet = getSpreadsheet().getSheetByName(eventCode);
    if (!sheet) return false;
    var rows = readTable(eventCode);
    for (var i = 0; i < rows.length; i++) {
      if (str_(rows[i].v.submissionId) !== submissionId) continue;
      var details = result.details ? appendDetail_(rows[i].v.checkDetails, result.details) : str_(rows[i].v.checkDetails);
      var col = REGISTRATION_HEADERS.indexOf('checkResult') + 1;
      sheet.getRange(rows[i].row, col, 1, 3).setValues([[result.checkResult, details, needsReviewFor_(result.checkResult, details)]]);
      return true;
    }
    return false;
  } finally {
    release();
  }
}

// Notes that an email could not be sent: `email failed` in the details and needsReview TRUE (US-025 AC3).
function markEmailFailed_(eventCode, submissionId) {
  var release = takeShortLock_(20000);
  if (!release) return;
  try {
    var sheet = getSpreadsheet().getSheetByName(eventCode);
    var rows = readTable(eventCode);
    for (var i = 0; sheet && i < rows.length; i++) {
      if (str_(rows[i].v.submissionId) !== submissionId) continue;
      var details = str_(rows[i].v.checkDetails);
      if (details.indexOf('email failed') === -1) details = appendDetail_(details, 'email failed');
      var col = REGISTRATION_HEADERS.indexOf('checkDetails') + 1;
      sheet.getRange(rows[i].row, col, 1, 2).setValues([[details, true]]);
      return;
    }
  } finally {
    release();
  }
}

// Names of the registration tabs (everything that is not a system tab).
function registrationSheetNames_() {
  return getSpreadsheet().getSheets().map(function (s) { return s.getName(); }).filter(function (name) {
    return RESERVED_EVENT_CODES.indexOf(name.toUpperCase()) === -1;
  });
}

function fileIdFromUrl_(url) {
  var m = /\/d\/([\w-]+)/.exec(str_(url));
  return m ? m[1] : '';
}

// Time-driven trigger (every 10 minutes): runs the check again for rows still `pending`
// (FFR-032). A row older than 24 hours is no longer retried; it is listed for the day's alert email.
function retryPendingChecks() {
  var started = Date.now();
  var stuck = [];
  var outOfTime = false;
  var serviceBusy = false;
  registrationSheetNames_().forEach(function (name) {
    readTable(name).forEach(function (r) {
      if (str_(r.v.checkResult).trim() !== 'pending' || !str_(r.v.screenshotUrl)) return;
      var savedMs = Date.parse(str_(r.v.timestamp).replace(/^'/, ''));
      if (isFinite(savedMs) && started - savedMs > PENDING_MAX_AGE_MS) { stuck.push(str_(r.v.reference)); return; }
      if (outOfTime || serviceBusy) return;
      if (Date.now() - started > RETRY_RUN_MS) { outOfTime = true; return; }
      var fileId = fileIdFromUrl_(r.v.screenshotUrl);
      if (!fileId) return;
      var original = str_(r.v.checkDetails).indexOf('stored as original format') !== -1;
      var result = runPaymentCheck_(fileId, Number(r.v.amountDueCrc), original, OCR_WAITS_TRIGGER);
      if (result.pending) { serviceBusy = true; return; } // the limit still holds: try again in 10 minutes
      if (!applyCheckResult_(name, str_(r.v.submissionId), result)) return;
      if (result.email) sendNotValidatedEmail_(name, r.v);
      Utilities.sleep(3000);
    });
  });
  PropertiesService.getScriptProperties().setProperty(PENDING_STUCK_KEY, JSON.stringify(stuck.slice(0, 50)));
}
