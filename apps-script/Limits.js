// Abuse controls and daily metrics (EVENTS_API_CONTRACT §9, FEATURE_SPEC FFR-029, US-024).
// The endpoint is anonymous and sees no client address, so every limit is global.

var METRIC_HEADERS = ['date', 'accepted', 'honeypotHits', 'throttled', 'couponFailures', 'uploadedMb', 'spamMarked'];
var DAILY_UPLOADS_PREFIX = 'DAILY_UPLOADS_';
var DAILY_BYTES_PREFIX = 'DAILY_BYTES_';
var DAILY_CAPHIT_PREFIX = 'DAILY_CAPHIT_';

// Costa Rica calendar day, `YYYY-MM-DD`.
function crDate_(epochMs) {
  return crIso_(epochMs).slice(0, 10);
}

// A date cell as `YYYY-MM-DD` text (a leading text marker is dropped).
function plainDate_(value) {
  return String(value).replace(/^'/, '');
}

// Briefly takes the script lock; returns a function that releases it (a no-op if it was busy:
// a limit that is slightly off is better than a request that fails).
function tryShortLock_(waitMs) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(waitMs);
    return function () { lock.releaseLock(); };
  } catch (err) {
    return function () {};
  }
}

// Like tryShortLock_ but returns null when the lock stayed busy.
function takeShortLock_(waitMs) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(waitMs);
    return function () { lock.releaseLock(); };
  } catch (err) {
    return null;
  }
}

function windowKey_(name, epochMs) {
  return 'RL_' + name + '_' + Math.floor(epochMs / 60000);
}

// Fixed one-minute window counter (CacheService): returns the count including this call.
function bumpWindow_(name) {
  var release = tryShortLock_(3000);
  try {
    var cache = CacheService.getScriptCache();
    var key = windowKey_(name, Date.now());
    var n = Number(cache.get(key) || 0) + 1;
    cache.put(key, String(n), 120);
    return n;
  } finally {
    release();
  }
}

function readWindow_(name) {
  return Number(CacheService.getScriptCache().get(windowKey_(name, Date.now())) || 0);
}

function readDaily_(prefix, date) {
  return Number(getProp(prefix + date) || 0);
}

// Daily counters for the upload caps live in script properties; call with the script lock held.
function addDaily_(prefix, date, amount) {
  PropertiesService.getScriptProperties().setProperty(prefix + date, String(readDaily_(prefix, date) + amount));
}

// Drops daily counters older than three days.
function pruneDaily_(todayDate) {
  var props = PropertiesService.getScriptProperties();
  var keep = [todayDate];
  for (var i = 1; i <= 3; i++) keep.push(crDate_(Date.now() - i * 86400000));
  Object.keys(props.getProperties()).forEach(function (k) {
    [DAILY_UPLOADS_PREFIX, DAILY_BYTES_PREFIX, DAILY_CAPHIT_PREFIX].forEach(function (p) {
      if (k.indexOf(p) === 0 && keep.indexOf(k.slice(p.length)) < 0) props.deleteProperty(k);
    });
  });
}

// True when storing `bytes` more would pass the daily screenshot count or MB cap (contract §9).
function uploadCapReached_(date, bytes) {
  var maxUploads = getNumberProp('LIMIT_UPLOADS_PER_DAY');
  var maxBytes = getNumberProp('LIMIT_UPLOAD_MB_PER_DAY') * 1024 * 1024;
  return readDaily_(DAILY_UPLOADS_PREFIX, date) >= maxUploads || readDaily_(DAILY_BYTES_PREFIX, date) + bytes > maxBytes;
}

// Adds to one column of today's `Metrics` row (created on first use). Never throws.
function bumpMetric_(field, amount) {
  var release = tryShortLock_(5000);
  try {
    var date = crDate_(Date.now());
    var sheet = getOrCreateSheet('Metrics', METRIC_HEADERS);
    var last = sheet.getLastRow();
    var dates = last > 1 ? sheet.getRange(2, 1, last - 1, 1).getValues() : [];
    var rowIndex = -1;
    for (var i = 0; i < dates.length; i++) {
      if (plainDate_(dates[i][0]) === date) { rowIndex = i + 2; break; }
    }
    if (rowIndex < 0) {
      rowIndex = last + 1;
      sheet.getRange(rowIndex, 1, 1, METRIC_HEADERS.length).setValues([["'" + date, 0, 0, 0, 0, 0, 0]]);
    }
    var cell = sheet.getRange(rowIndex, METRIC_HEADERS.indexOf(field) + 1);
    cell.setValue(Math.round((Number(cell.getValue() || 0) + amount) * 100) / 100);
  } catch (err) {
    console.error('metric ' + field + ' failed: ' + err.name);
  } finally {
    release();
  }
}

// Today's metrics as numbers (zeros when there is no row yet).
function readMetrics_(date) {
  var out = {};
  METRIC_HEADERS.slice(1).forEach(function (h) { out[h] = 0; });
  var rows = readTable('Metrics');
  for (var i = 0; i < rows.length; i++) {
    if (plainDate_(rows[i].v.date) === date) {
      // A row created twice by concurrent first events of the day counts once, summed.
      METRIC_HEADERS.slice(1).forEach(function (h) { out[h] += Number(rows[i].v[h] || 0); });
    }
  }
  return out;
}

// `spamMarked` per registration day: registrations Cami has marked `spam`. Cami marks them by
// hand, so this is recounted from the event tabs (run with the events refresh).
function updateSpamMetrics_() {
  var perDay = {};
  registrationSheetNames_().forEach(function (name) {
    readTable(name).forEach(function (r) {
      if (str_(r.v.status).trim().toLowerCase() !== 'spam') return;
      var day = str_(r.v.timestamp).replace(/^'/, '').slice(0, 10);
      if (day) perDay[day] = (perDay[day] || 0) + 1;
    });
  });
  var sheet = getSpreadsheet().getSheetByName('Metrics');
  if (!sheet || sheet.getLastRow() < 2) return;
  var col = METRIC_HEADERS.indexOf('spamMarked') + 1;
  var n = sheet.getLastRow() - 1;
  var dates = sheet.getRange(2, 1, n, 1).getValues();
  var counts = sheet.getRange(2, col, n, 1).getValues();
  var changed = false;
  var written = {}; // a date with several Metrics rows (concurrent first events) carries the total once
  for (var i = 0; i < dates.length; i++) {
    var day = plainDate_(dates[i][0]);
    var count = written[day] ? 0 : (perDay[day] || 0);
    written[day] = true;
    if (Number(counts[i][0] || 0) !== count) { counts[i][0] = count; changed = true; }
  }
  if (changed) sheet.getRange(2, col, n, 1).setValues(counts);
}
