// Pure helpers for the `register` action (EVENTS_API_CONTRACT §3.3, §5, §8): field validation,
// image type detection, file and reference naming. No Apps Script services are used here.

var UUID_V4_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
var E164_RE = /^\+[1-9]\d{7,14}$/;
var EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;
var MAX_FILE_BYTES = 5 * 1024 * 1024;
var MAX_BASE64_CHARS = 7000000; // a 5 MB file encodes to about 6.7 million characters

function str_(v) {
  return v === undefined || v === null ? '' : String(v);
}

// Validates and normalizes the register body (without the file content).
// Returns { fields: { name: code }, value: {...} | null, honeypot: bool, hasFile: bool }.
// Field codes are the contract §8 ones; a field with no specific code (event code, name, id,
// language) is reported as `required`.
function validateRegisterInput_(body) {
  var fields = {};
  var honeypot = str_(body.website) !== '';

  var submissionId = str_(body.submissionId).trim().toLowerCase();
  if (!UUID_V4_RE.test(submissionId)) fields.submissionId = 'required';

  var eventCode = str_(body.eventCode).trim().toUpperCase();
  if (!EVENT_CODE_RE.test(eventCode)) fields.eventCode = 'required';

  var participantName = str_(body.participantName).trim().replace(/\s+/g, ' ');
  if (participantName.length < 2 || participantName.length > 80) fields.participantName = 'required';

  var email = str_(body.email).trim().toLowerCase();
  if (!email) fields.email = 'required';
  else if (email.length > 254 || !EMAIL_RE.test(email)) fields.email = 'invalid_email';

  var whatsapp = str_(body.whatsapp).replace(/[\s\-()]/g, '');
  if (!whatsapp) fields.whatsapp = 'required';
  else if (!E164_RE.test(whatsapp)) fields.whatsapp = 'invalid_phone';

  var couponCode = str_(body.couponCode).trim().toUpperCase();
  if (couponCode && !COUPON_CODE_RE.test(couponCode)) fields.couponCode = 'invalid_coupon_format';

  var lang = str_(body.lang);
  if (lang !== 'es' && lang !== 'en') fields.lang = 'required';

  if (body.consent !== true) fields.consent = 'consent_required';

  // Optional second checkbox (contract v1.5): only the JSON boolean true opts in; missing or any other value is false, never refused.
  var contactOptIn = body.contactOptIn === true;

  var file = body.file;
  var hasFile = !!(file && typeof file === 'object' && str_(file.base64) !== '');
  // Measured after removing a data-URL prefix and whitespace, as prepareScreenshot_ will decode it.
  if (hasFile && normalizeBase64_(file.base64).length > MAX_BASE64_CHARS) fields.file = 'file_too_large';

  var hasErrors = Object.keys(fields).length > 0;
  return {
    fields: fields,
    honeypot: honeypot,
    hasFile: hasFile,
    value: hasErrors ? null : {
      submissionId: submissionId, eventCode: eventCode, participantName: participantName, email: email,
      whatsapp: whatsapp, couponCode: couponCode, lang: lang, contactOptIn: contactOptIn
    }
  };
}

// The base64 text as it is decoded: without a `data:...;base64,` prefix or whitespace.
function normalizeBase64_(text) {
  return str_(text).replace(/^data:[^,]*,/, '').replace(/\s+/g, '');
}

var HEIF_BRANDS = ['1pic', 'heic', 'heix', 'hevc', 'hevx', 'heim', 'heis', 'mif1', 'msf1'];

// Image type from the first bytes (signed or unsigned), not from the name or declared type:
// 'jpeg', 'png', 'webp', 'heic' or null. The generic HEIF brands mif1 and msf1 may also be an
// AVIF file; it is then stored as `.heic`, which is harmless (stored in its own format).
// HEIF is accepted when the major brand or any compatible brand in the ftyp box is one of
// HEIF_BRANDS (some files declare e.g. `heic` only as a compatible brand).
function detectImageType_(bytes) {
  var b = Array.prototype.slice.call(bytes, 0, 64).map(function (x) { return x < 0 ? x + 256 : x; });
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'jpeg';
  var pngSignature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (b.length >= 8 && pngSignature.every(function (x, i) { return b[i] === x; })) return 'png';
  var ascii = b.map(function (x) { return String.fromCharCode(x); }).join('');
  if (ascii.slice(0, 4) === 'RIFF' && ascii.slice(8, 12) === 'WEBP') return 'webp';
  if (ascii.slice(4, 8) === 'ftyp') {
    var boxSize = b[0] * 16777216 + b[1] * 65536 + b[2] * 256 + b[3];
    var end = Math.min(b.length, boxSize >= 16 ? boxSize : 16);
    if (HEIF_BRANDS.indexOf(ascii.slice(8, 12)) !== -1) return 'heic';
    for (var i = 16; i + 4 <= end; i += 4) { // 8-byte header, major brand, minor version, then compatible brands
      if (HEIF_BRANDS.indexOf(ascii.slice(i, i + 4)) !== -1) return 'heic';
    }
  }
  return null;
}

// BR-E04: accents removed, spaces to `_`, only [A-Za-z0-9_-].
function fileSafeName_(name) {
  var plain = str_(name).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '_').replace(/[^A-Za-z0-9_-]/g, '');
  return plain || 'participant';
}

// `<ParticipantName>_<YYYY-MM-DD>_<eventCode>` plus `_2`, `_3`... on collision; `exists` tells
// whether a file name (with extension) is already used.
function uniqueFileName_(participantName, dateText, eventCode, extension, exists) {
  var base = fileSafeName_(participantName) + '_' + dateText + '_' + eventCode;
  var name = base + '.' + extension;
  for (var n = 2; exists(name); n++) name = base + '_' + n + '.' + extension;
  return name;
}

// `<eventCode>-<YYMMDD>-<4 random A-Z0-9>` (contract §5); `rand` returns a number in [0, 1).
function makeReference_(eventCode, epochMs, rand) {
  var d = new Date(epochMs - CR_OFFSET_HOURS * 3600000);
  var yymmdd = String(d.getUTCFullYear()).slice(2) + pad2_(d.getUTCMonth() + 1) + pad2_(d.getUTCDate());
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var suffix = '';
  for (var i = 0; i < 4; i++) suffix += chars.charAt(Math.floor(rand() * chars.length));
  return eventCode + '-' + yymmdd + '-' + suffix;
}

// BR-E13 / FFR-024: what state the registration arrives in. `state` is
// { published, closed, soldOut, duplicateCode }; `hasFile` is true for a paid registration.
// Returns { refuse: code | null, flags: [checkDetails flags] }.
function registrationDecision_(state, hasFile) {
  var flags = [];
  if (state.duplicateCode) flags.push('duplicate event code');
  if (!state.published || state.closed) flags.push('event closed at submit');
  if (state.soldOut) flags.push('sold out at submit');
  if (!hasFile) {
    // Nothing was paid: refuse with the matching error (BR-E13). A duplicated code counts as
    // unpublished (FFR-019), so a ₡0 registration for it is refused as closed.
    if (state.duplicateCode || !state.published || state.closed) return { refuse: 'REGISTRATION_CLOSED', flags: [] };
    if (state.soldOut) return { refuse: 'SOLD_OUT', flags: [] };
    return { refuse: null, flags: [] };
  }
  return { refuse: null, flags: flags };
}
