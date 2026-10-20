// `events` action (EVENTS_API_CONTRACT §3.1, §6, §7) and reading of the Events and Coupons tabs.

var INVALID_EVENTS_KEY = 'ALERT_INVALID_EVENTS';
var INVALID_COUPONS_KEY = 'ALERT_INVALID_COUPONS';
var INVALID_PAYLOAD_MAX = 8000; // a script property holds about 9 KB

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
  var validCodes = Object.create(null);
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
  var entries = invalid.map(function (i) {
    return tab + ' row ' + i.row + ': ' + i.problems.join(', ');
  });
  // Every row is kept while it fits; beyond that the alert says how many more there are.
  var payload = JSON.stringify({ count: invalid.length, entries: entries });
  while (payload.length > INVALID_PAYLOAD_MAX && entries.length) {
    entries.pop();
    payload = JSON.stringify({ count: invalid.length, entries: entries, more: invalid.length - entries.length });
  }
  var props = PropertiesService.getScriptProperties();
  if (props.getProperty(key) !== payload) {
    if (invalid.length || props.getProperty(key)) props.setProperty(key, payload);
  }
}

// The cache lives a little longer than the refresh interval, so with the time-driven trigger
// installed (runbook, "Events cache trigger") every visitor is served from it.
var EVENTS_CACHE_SECONDS = 360;
var EVENTS_REFRESH_MINUTES = 5;
// Bump the version whenever the answer's shape or logic changes: the trigger runs the saved
// code (Head) while visitors are served by the deployed version, and they share one cache.
var EVENTS_CACHE_VERSION = 'v1';
var EVENTS_CACHE_PREFIX = 'EVENTS_' + EVENTS_CACHE_VERSION + '_';
// CacheService entries may be evicted early, so the last good answer is also kept in script
// properties and served when it is younger than this (the trigger refreshes it every 5 minutes).
var EVENTS_LAST_PREFIX = 'EVENTS_LAST_' + EVENTS_CACHE_VERSION + '_';
var EVENTS_LAST_MAX_AGE_MS = 20 * 60000;

// `events` is read on every page load and reads several tabs, which takes seconds in Apps Script
// (the client gives up after its `events` timeout, FFR-004). The finished response is kept per language and
// refreshed every 5 minutes by a trigger, so a change in the sheet shows within about 5 minutes
// (owner decision, 2026-10-20, FFR-033). A registration that changes availability rebuilds the
// cache with `refreshEventsCache()` after the lock is released, so a sold-out event shows at once
// and no visitor meets a cold cache (CMP-026). Without the trigger a request that finds the cache
// empty rebuilds it (about 5 s).
function handleEvents_(params) {
  var lang = params.lang === 'en' ? 'en' : 'es';
  var cache = CacheService.getScriptCache();
  try {
    var hit = cache.get(EVENTS_CACHE_PREFIX + lang);
    if (hit) return rawJson(hit);
  } catch (err) {
    console.error('cache read failed: ' + err.name);
  }
  var last = readLastEvents_(lang);
  if (last) return rawJson(last);
  var response = buildEventsResponse_(lang);
  storeEvents_(lang, JSON.stringify(response));
  return ok(response.data);
}

// Returns { cache: bool, last: bool }. A script property holds about 9 KB, so the last-good copy
// stops fitting when the list has roughly 6 to 8 full-length events; the cache still works then,
// and the trigger run is reported as Failed so the owner sees that the fallback is gone.
function storeEvents_(lang, body) {
  var stored = { cache: true, last: true };
  try {
    CacheService.getScriptCache().put(EVENTS_CACHE_PREFIX + lang, body, EVENTS_CACHE_SECONDS);
  } catch (err) {
    console.error('cache write failed: ' + err.name);
    stored.cache = false;
  }
  try {
    PropertiesService.getScriptProperties().setProperty(EVENTS_LAST_PREFIX + lang, JSON.stringify({ at: Date.now(), body: body }));
  } catch (err) {
    console.error('last answer write failed: ' + err.name);
    stored.last = false;
  }
  return stored;
}

function readLastEvents_(lang) {
  try {
    var raw = PropertiesService.getScriptProperties().getProperty(EVENTS_LAST_PREFIX + lang);
    if (!raw) return null;
    var last = JSON.parse(raw);
    return Date.now() - last.at < EVENTS_LAST_MAX_AGE_MS ? last.body : null;
  } catch (err) {
    return null;
  }
}

// Run by the time-driven trigger every 5 minutes (FFR-033): rebuilds both languages. CMP-026's
// `register` calls it too when a registration changes availability.
// Both languages are attempted; if any fails the run ends as Failed so the owner sees it.
function refreshEventsCache() {
  var failed = [];
  ['es', 'en'].forEach(function (lang) {
    try {
      var stored = storeEvents_(lang, JSON.stringify(buildEventsResponse_(lang)));
      if (!stored.cache) failed.push(lang + ' (cache)');
      if (!stored.last) failed.push(lang + ' (last-good copy too large or not saved)');
    } catch (err) {
      console.error('refresh ' + lang + ' failed: ' + err.name);
      failed.push(lang);
    }
  });
  if (failed.length) throw new Error('refreshEventsCache failed for: ' + failed.join(', '));
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
