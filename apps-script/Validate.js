// Pure validation and time helpers for the Events and Coupons tabs (EVENTS_API_CONTRACT §6).
// No Apps Script services are used here, so these functions are testable outside Google.

var CR_OFFSET_HOURS = 6;            // America/Costa_Rica is UTC-6 all year (no DST)
var REGISTRATION_CLOSES_HOURS = 12; // BR-E09

var EVENT_CODE_RE = /^[A-Z0-9-]{2,20}$/;
// A registration tab is named by the event code, so a code must not be the name of a system tab
// (tab names match without regard to case): contract v1.3 §6.
var RESERVED_EVENT_CODES = ['EVENTS', 'COUPONS', 'METRICS', 'TRANSLATIONS', 'SPIKELOG'];
var COUPON_CODE_RE = /^[A-Z0-9]{8,20}$/;

function isBlank_(v) {
  return v === '' || v === null || v === undefined;
}

function isTrue_(v) {
  return v === true || String(v).trim().toUpperCase() === 'TRUE';
}

// Integer from a number or a plain digit string; null otherwise.
function toInt_(v) {
  if (typeof v === 'number') return isFinite(v) && Math.floor(v) === v && v >= 0 ? v : null;
  var s = String(v).trim();
  return /^\d+$/.test(s) ? Number(s) : null;
}

function pad2_(n) {
  return (n < 10 ? '0' : '') + n;
}

// `YYYY-MM-DD` for a real calendar date, from a Date (already read in Costa Rica time by the
// caller as `dateText`) or a `YYYY-MM-DD` string; null when it is not a valid date.
function normalizeDate_(text) {
  var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(text).trim());
  if (!m) return null;
  var d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  var ok = d.getUTCFullYear() === Number(m[1]) && d.getUTCMonth() === Number(m[2]) - 1 && d.getUTCDate() === Number(m[3]);
  return ok ? m[1] + '-' + m[2] + '-' + m[3] : null;
}

// `HH:mm` 24 h (`H:mm` and `HH:mm:ss` accepted, seconds dropped); null otherwise.
function normalizeTime_(text) {
  var m = /^([01]?\d|2[0-3]):([0-5]\d)(?::[0-5]\d)?$/.exec(String(text).trim());
  return m ? pad2_(Number(m[1])) + ':' + m[2] : null;
}

// Epoch ms of a Costa Rica local date (YYYY-MM-DD) and time (HH:mm).
function crToEpoch_(dateText, timeText) {
  var d = dateText.split('-').map(Number);
  var t = timeText.split(':').map(Number);
  return Date.UTC(d[0], d[1] - 1, d[2], t[0] + CR_OFFSET_HOURS, t[1]);
}

// ISO 8601 with the Costa Rica offset for an epoch ms: `2026-11-05T18:00:00-06:00`.
function crIso_(epochMs) {
  var d = new Date(epochMs - CR_OFFSET_HOURS * 3600000);
  return d.getUTCFullYear() + '-' + pad2_(d.getUTCMonth() + 1) + '-' + pad2_(d.getUTCDate()) + 'T' +
    pad2_(d.getUTCHours()) + ':' + pad2_(d.getUTCMinutes()) + ':' + pad2_(d.getUTCSeconds()) + '-06:00';
}

// End of the (inclusive) expiry date, 23:59:59 Costa Rica time, as epoch ms.
function crEndOfDay_(dateText) {
  return crToEpoch_(dateText, '23:59') + 59000;
}

// Validates one `Events` row. `raw` holds the already-read cell values; `dateText` and
// `timeText` are the date and time as `YYYY-MM-DD` and `HH:mm` candidates.
// Returns { problems: [field names], event: {...} | null }.
function validateEventRow_(raw) {
  var problems = [];
  var code = String(raw.eventCode === undefined ? '' : raw.eventCode).trim();
  if (!EVENT_CODE_RE.test(code) || RESERVED_EVENT_CODES.indexOf(code.toUpperCase()) >= 0) problems.push('eventCode');

  var name = String(raw.name === undefined ? '' : raw.name).trim();
  if (!name || name.length > 120) problems.push('name');
  var description = String(raw.description === undefined ? '' : raw.description).trim();
  if (!description || description.length > 600) problems.push('description');

  var nameEn = isBlank_(raw.nameEn) ? '' : String(raw.nameEn).trim();
  if (nameEn.length > 120) problems.push('nameEn');
  var descriptionEn = isBlank_(raw.descriptionEn) ? '' : String(raw.descriptionEn).trim();
  if (descriptionEn.length > 600) problems.push('descriptionEn');

  var date = normalizeDate_(raw.dateText);
  if (!date) problems.push('date');
  var time = normalizeTime_(raw.timeText);
  if (!time) problems.push('time');

  var price = toInt_(raw.priceCrc);
  if (price === null) problems.push('priceCrc');
  var capacity = toInt_(raw.capacity);
  if (capacity === null || capacity < 1) problems.push('capacity');

  var imageUrl = null;
  if (!isBlank_(raw.imageUrl) && /^https:\/\/\S+$/.test(String(raw.imageUrl).trim())) {
    imageUrl = String(raw.imageUrl).trim();
  }

  if (problems.length) return { problems: problems, event: null };
  return {
    problems: [],
    event: {
      eventCode: code, name: name, description: description, nameEn: nameEn, descriptionEn: descriptionEn,
      date: date, time: time, priceCrc: price, capacity: capacity, imageUrl: imageUrl,
      startsAtMs: crToEpoch_(date, time)
    }
  };
}

// Applies the row rules to every `Events` row, then the duplicate-code rule (all rows of a
// duplicated code are skipped, FFR-019). Unpublished rows are ignored unless they share a code
// with a published one. `rows`: [{ row: sheet row number, raw: {...}, published: bool }].
// Returns { valid: [event + published], invalid: [{ row, problems }] }.
function validateEventRows_(rows) {
  var byCode = Object.create(null); // codes are free text: no inherited keys such as `constructor`
  rows.forEach(function (r) {
    var code = String(r.raw.eventCode === undefined ? '' : r.raw.eventCode).trim();
    if (code) (byCode[code] = byCode[code] || []).push(r);
  });
  var valid = [];
  var invalid = [];
  rows.forEach(function (r) {
    var code = String(r.raw.eventCode === undefined ? '' : r.raw.eventCode).trim();
    var group = code ? byCode[code] : [r];
    var duplicated = group.length > 1;
    var groupPublished = group.some(function (g) { return g.published; });
    if (!r.published && !(duplicated && groupPublished)) return;
    if (!r.published && duplicated) return; // the published row of the group reports the problem
    var res = validateEventRow_(r.raw);
    if (duplicated) {
      invalid.push({ row: r.row, problems: ['eventCode (duplicated)'].concat(res.problems) });
      return;
    }
    if (res.problems.length) { invalid.push({ row: r.row, problems: res.problems }); return; }
    res.event.row = r.row;
    valid.push(res.event);
  });
  return { valid: valid, invalid: invalid };
}

// A `10` or `10%` discount (as displayed in the cell) as an integer 1–100; null otherwise.
function parseDiscount_(display) {
  var m = /^(\d{1,3})\s*%?$/.exec(String(display).trim());
  if (!m) return null;
  var n = Number(m[1]);
  return n >= 1 && n <= 100 ? n : null;
}

// Validates every `Coupons` row against the valid event codes (a plain object keyed by code).
// `rows`: [{ row, raw: { eventCode, couponCode, discountDisplay, maxUses, active, expiresOnText } }].
// Returns { valid: [coupon], invalid: [{ row, problems }] }.
function validateCouponRows_(rows, validEventCodes) {
  var valid = [];
  var invalid = [];
  var counts = Object.create(null); // rows per event/coupon code: every row of a duplicate is skipped
  rows.forEach(function (r) {
    var key = String(r.raw.eventCode === undefined ? '' : r.raw.eventCode).trim() + '/' +
      String(r.raw.couponCode === undefined ? '' : r.raw.couponCode).trim();
    counts[key] = (counts[key] || 0) + 1;
  });
  rows.forEach(function (r) {
    var problems = [];
    var eventCode = String(r.raw.eventCode === undefined ? '' : r.raw.eventCode).trim();
    if (!validEventCodes[eventCode]) problems.push('eventCode');
    var couponCode = String(r.raw.couponCode === undefined ? '' : r.raw.couponCode).trim();
    if (!COUPON_CODE_RE.test(couponCode)) problems.push('couponCode');
    var discount = parseDiscount_(r.raw.discountDisplay);
    if (discount === null) problems.push('discountPercent');
    var maxUses = toInt_(r.raw.maxUses);
    if (maxUses === null || maxUses < 1) problems.push('maxUses');
    var expiresOn = null;
    if (!isBlank_(r.raw.expiresOnText)) {
      expiresOn = normalizeDate_(r.raw.expiresOnText);
      if (!expiresOn) problems.push('expiresOn');
    }
    if (counts[eventCode + '/' + couponCode] > 1) problems.push('couponCode (duplicated)');
    if (problems.length) { invalid.push({ row: r.row, problems: problems }); return; }
    valid.push({
      row: r.row, eventCode: eventCode, couponCode: couponCode, discountPercent: discount,
      maxUses: maxUses, active: isTrue_(r.raw.active), expiresOn: expiresOn
    });
  });
  return { valid: valid, invalid: invalid };
}

// Public shape of one event for the `events` response (contract §7), or null when the event
// has started. `counting` is the number of counting registrations (BR-E10).
function eventView_(ev, lang, counting, nowMs, texts) {
  if (ev.startsAtMs <= nowMs) return null;
  var closesAtMs = ev.startsAtMs - REGISTRATION_CLOSES_HOURS * 3600000;
  return {
    eventCode: ev.eventCode,
    name: texts.name,
    description: texts.description,
    date: ev.date,
    time: ev.time,
    startsAt: crIso_(ev.startsAtMs),
    registrationClosesAt: crIso_(closesAtMs),
    priceCrc: ev.priceCrc,
    imageUrl: ev.imageUrl,
    soldOut: counting >= ev.capacity,
    registrationOpen: nowMs < closesAtMs
  };
}
