// `events` action (EVENTS_API_CONTRACT §3.1, §6, §7) and reading of the Events and Coupons tabs.

var INVALID_EVENTS_KEY = 'ALERT_INVALID_EVENTS';
var INVALID_COUPONS_KEY = 'ALERT_INVALID_COUPONS';
var INVALID_QUEUE_MAX = 30;

function rawEventFrom_(r) {
  return {
    eventCode: r.v.eventCode, name: r.v.name, description: r.v.description,
    nameEn: r.v.nameEn, descriptionEn: r.v.descriptionEn,
    dateText: dateCellText_(r.v.date, r.d.date),
    timeText: r.d.time,
    priceCrc: r.v.priceCrc, capacity: r.v.capacity, imageUrl: r.v.imageUrl
  };
}

// A date cell is a Date (Sheets date) or text. Dates are formatted in Costa Rica time.
function dateCellText_(value, display) {
  if (Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value.getTime())) {
    return Utilities.formatDate(value, 'America/Costa_Rica', 'yyyy-MM-dd');
  }
  return String(display || value).trim();
}

// Reads the Events tab once. Returns { valid, invalid, validCodes }: `valid` holds the published
// events that passed validation, `invalid` the rows to report, `validCodes` the codes of every
// valid event whether published or not (a coupon may be prepared for a draft event).
function readEvents() {
  var rows = readTable('Events').map(function (r) {
    return { row: r.row, raw: rawEventFrom_(r), published: isTrue_(r.v.published) };
  });
  var result = validateEventRows_(rows);
  var published = {};
  rows.forEach(function (r) { published[r.row] = r.published; });
  var validCodes = {};
  validateEventRows_(rows.map(function (r) { return { row: r.row, raw: r.raw, published: true }; }))
    .valid.forEach(function (ev) { validCodes[ev.eventCode] = true; });
  return {
    valid: result.valid.filter(function (ev) { return published[ev.row]; }),
    invalid: result.invalid,
    validCodes: validCodes
  };
}

function readCoupons(validEventCodes) {
  var rows = readTable('Coupons').map(function (r) {
    return {
      row: r.row,
      raw: {
        eventCode: r.v.eventCode, couponCode: r.v.couponCode, discountDisplay: r.d.discountPercent,
        maxUses: r.v.maxUses, active: r.v.active,
        expiresOnText: isBlank_(r.v.expiresOn) ? '' : dateCellText_(r.v.expiresOn, r.d.expiresOn)
      }
    };
  });
  return validateCouponRows_(rows, validEventCodes);
}

// Remembers which rows are invalid right now, for the daily alert email (US-023 AC5, sent by
// CMP-027). The list is replaced on every read, so a row Cami has fixed drops out. No personal
// data is stored: only tab, row number and the names of the failing fields.
function queueInvalidRows_(key, tab, invalid) {
  var entries = invalid.slice(0, INVALID_QUEUE_MAX).map(function (i) {
    return tab + ' row ' + i.row + ': ' + i.problems.join(', ');
  });
  var payload = JSON.stringify({ count: invalid.length, entries: entries });
  var props = PropertiesService.getScriptProperties();
  if (props.getProperty(key) !== payload) {
    if (invalid.length || props.getProperty(key)) props.setProperty(key, payload);
  }
}

// The cache lives a little longer than the refresh interval, so with the time-driven trigger
// installed (runbook, "Events cache trigger") every visitor is served from it.
var EVENTS_CACHE_SECONDS = 360;
var EVENTS_REFRESH_MINUTES = 5;
var EVENTS_CACHE_PREFIX = 'EVENTS_';

// `events` is read on every page load and reads several tabs, which takes seconds in Apps Script
// (the site gives up after 3 s, FFR-004). The finished response is kept per language and
// refreshed every 5 minutes by a trigger, so a change in the sheet shows within about 5 minutes
// (owner decision, 2026-10-20). `register` clears the cache so a sold-out event shows at once
// (CMP-026). Without the trigger a request that finds the cache empty rebuilds it (about 5 s).
function handleEvents_(params) {
  var lang = params.lang === 'en' ? 'en' : 'es';
  var cache = CacheService.getScriptCache();
  try {
    var hit = cache.get(EVENTS_CACHE_PREFIX + lang);
    if (hit) return rawJson(hit);
  } catch (err) {
    console.error('cache read failed: ' + err.name);
  }
  var response = buildEventsResponse_(lang);
  try {
    cache.put(EVENTS_CACHE_PREFIX + lang, JSON.stringify(response), EVENTS_CACHE_SECONDS);
  } catch (err) {
    console.error('cache write failed: ' + err.name);
  }
  return ok(response.data);
}

// Run by the time-driven trigger every 5 minutes: rebuilds both languages.
function refreshEventsCache() {
  var cache = CacheService.getScriptCache();
  ['es', 'en'].forEach(function (lang) {
    cache.put(EVENTS_CACHE_PREFIX + lang, JSON.stringify(buildEventsResponse_(lang)), EVENTS_CACHE_SECONDS);
  });
}

function clearEventsCache() {
  CacheService.getScriptCache().removeAll([EVENTS_CACHE_PREFIX + 'es', EVENTS_CACHE_PREFIX + 'en']);
}

function buildEventsResponse_(lang) {
  var nowMs = Date.now();

  var events = readEvents();
  var coupons = readCoupons(events.validCodes);
  try {
    queueInvalidRows_(INVALID_EVENTS_KEY, 'Events', events.invalid);
    queueInvalidRows_(INVALID_COUPONS_KEY, 'Coupons', coupons.invalid);
  } catch (err) {
    console.error('queue failed: ' + err.name); // the listing must not depend on the alert queue
  }

  var translations = lang === 'en' ? PropertiesService.getScriptProperties().getProperties() : {};
  var list = [];
  events.valid.forEach(function (ev) {
    if (ev.startsAtMs <= nowMs) return;
    var texts = lang === 'en'
      ? { name: englishText_(ev.name, ev.nameEn, translations), description: englishText_(ev.description, ev.descriptionEn, translations) }
      : { name: ev.name, description: ev.description };
    list.push(eventView_(ev, lang, countRegistrations(ev.eventCode), nowMs, texts));
  });
  list.sort(function (a, b) { return a.startsAt < b.startsAt ? -1 : a.startsAt > b.startsAt ? 1 : 0; });
  return { ok: true, data: { sinpe: getSinpe(), events: list }, error: null };
}
