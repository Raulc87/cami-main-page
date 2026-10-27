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

// Sheet writes are buffered: they must reach the spreadsheet before the lock is released, or the
// next holder can read the row as it was before (two runs then both act on the same row).
function releaseAfterFlush_(lock) {
  try {
    SpreadsheetApp.flush();
  } catch (err) {
    console.error('flush before unlock failed: ' + (err && err.name));
  }
  lock.releaseLock();
}

// Counter updates take the user lock, not the script lock that registrations hold while they store
// a row and a screenshot, so the counters never queue behind a registration (CMP-053). Everything
// under it is a cache or script-property write of a few milliseconds, so a short wait is enough.
// ASSUMED, not documented by Google: for an "execute as me" web app every anonymous request, and the
// owner's trigger, resolve to the same user, hence one shared user lock. The CMP-053 burst on staging
// must prove it (exact counts) before this code goes to production; a lock that is not shared fails
// the burst and the counters go back to the script lock.
var COUNTER_LOCK_WAIT_MS = 10000;

// Takes the counter lock; returns a function that releases it, or null when it was not taken
// (the log says whether it timed out or failed, with the error name and message). Callers that
// must not fail a request carry on without it; the miss stays visible in Executions.
function takeCounterLock_(what) {
  try {
    var lock = LockService.getUserLock();
    lock.waitLock(COUNTER_LOCK_WAIT_MS);
    return function () { lock.releaseLock(); };
  } catch (err) {
    console.error('counter lock not taken (' + err.name + ': ' + err.message + '), update may be missed: ' + what);
    return null;
  }
}

function releaseNothing_() {}

// Briefly takes the script lock; returns null when it stayed busy.
function takeShortLock_(waitMs) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(waitMs);
    return function () { releaseAfterFlush_(lock); };
  } catch (err) {
    return null;
  }
}

function windowKey_(name, epochMs) {
  return 'RL_' + name + '_' + Math.floor(epochMs / 60000);
}

// Fixed one-minute window counter (CacheService): returns the count including this call. The
// window is chosen on arrival, so a request that waits for the lock still counts in its own minute.
function bumpWindow_(name) {
  var key = windowKey_(name, Date.now());
  var release = takeCounterLock_('window ' + name) || releaseNothing_;
  try {
    var cache = CacheService.getScriptCache();
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

// Drops daily counters older than yesterday (the alert looks at today and yesterday).
function pruneDaily_(todayDate) {
  var props = PropertiesService.getScriptProperties();
  var keep = [todayDate];
  keep.push(crDate_(Date.now() - 86400000));
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

// Daily metric increments are kept in script properties and written to the `Metrics` row by the
// 5-minute trigger (`flushMetrics_`), so a request never waits for a sheet write (CMP-053).
var METRIC_PENDING_PREFIX = 'METRIC_PENDING_';

function pendingMetricKey_(date, field) {
  return METRIC_PENDING_PREFIX + date + ':' + field;
}

function roundMetric_(value) {
  return Math.round(value * 100) / 100;
}

// Adds to one metric of today. Never throws.
function bumpMetric_(field, amount) {
  var release = takeCounterLock_('metric ' + field) || releaseNothing_;
  try {
    var key = pendingMetricKey_(crDate_(Date.now()), field);
    var props = PropertiesService.getScriptProperties();
    props.setProperty(key, String(roundMetric_(Number(props.getProperty(key) || 0) + amount)));
  } catch (err) {
    console.error('metric ' + field + ' failed: ' + err.name);
  } finally {
    release();
  }
}

// Pending increments as { date: { field: amount } }.
function readPendingMetrics_() {
  var pending = {};
  var all = PropertiesService.getScriptProperties().getProperties();
  Object.keys(all).forEach(function (k) {
    if (k.indexOf(METRIC_PENDING_PREFIX) !== 0) return;
    var parts = k.slice(METRIC_PENDING_PREFIX.length).split(':');
    pending[parts[0]] = pending[parts[0]] || {};
    pending[parts[0]][parts[1]] = Number(all[k]) || 0;
  });
  return pending;
}

// Row of `date` in `Metrics` (created when missing), as a sheet row number.
function metricsRowFor_(sheet, date) {
  var last = sheet.getLastRow();
  var dates = last > 1 ? sheet.getRange(2, 1, last - 1, 1).getValues() : [];
  for (var i = 0; i < dates.length; i++) {
    if (plainDate_(dates[i][0]) === date) return i + 2;
  }
  sheet.getRange(last + 1, 1, 1, METRIC_HEADERS.length).setValues([["'" + date, 0, 0, 0, 0, 0, 0]]);
  return last + 1;
}

// Writes the pending increments into the `Metrics` rows, then takes exactly what was written off
// the pending values (increments that arrived meanwhile stay for the next run). Run by the
// 5-minute trigger; a busy script lock just means the next run does it.
function flushMetrics_() {
  var pending = readPendingMetrics_();
  var dates = Object.keys(pending);
  if (!dates.length) return;
  var release = takeShortLock_(30000);
  if (!release) return;
  var written = [];
  try {
    var sheet = getOrCreateSheet('Metrics', METRIC_HEADERS);
    dates.forEach(function (date) {
      var row = metricsRowFor_(sheet, date);
      Object.keys(pending[date]).forEach(function (field) {
        var column = METRIC_HEADERS.indexOf(field) + 1;
        if (column < 2) return; // not a metric column: leave it, it is never written
        var cell = sheet.getRange(row, column);
        cell.setValue(roundMetric_(Number(cell.getValue() || 0) + pending[date][field]));
        written.push({ key: pendingMetricKey_(date, field), amount: pending[date][field] });
      });
    });
  } finally {
    release();
    subtractWritten_(written); // also after a failure partway: what reached the sheet must not be added again
  }
}

// Takes what was written to the sheet off the pending values. Skipped when the counter lock was not
// taken: the sheet then keeps an over-count for one run instead of an increment being lost.
function subtractWritten_(written) {
  if (!written.length) return;
  var unlock = takeCounterLock_('metrics flush');
  if (!unlock) return;
  try {
    var props = PropertiesService.getScriptProperties();
    written.forEach(function (w) {
      var left = roundMetric_(Number(props.getProperty(w.key) || 0) - w.amount);
      if (left > 0) props.setProperty(w.key, String(left)); else props.deleteProperty(w.key);
    });
  } finally {
    unlock();
  }
}

// Today's metrics as numbers (zeros when there is no row yet): the sheet row plus what is still
// waiting for the next flush.
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
  var waiting = readPendingMetrics_()[date] || {};
  Object.keys(waiting).forEach(function (h) { if (h in out) out[h] += waiting[h]; });
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
