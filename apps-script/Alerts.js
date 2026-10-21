// The daily alert email to Cami (FFR-029, US-024 AC2): at most one per day, sent at the first
// trigger of the day, listing everything outstanding; what is found after it triggers the next
// day's email. Triggers: a threshold crossed, an invalid Events/Coupons row (US-023 AC5).
// A payment check still `pending` past its 24-hour limit is a trigger too (FFR-032).

var ALERT_REPORTED_KEY = 'ALERT_REPORTED';
var ALERT_LAST_SENT_KEY = 'ALERT_LAST_SENT_DATE';

// Everything Cami should look at now: [{ key, text }]. A key identifies one finding, so a
// finding already reported does not trigger another email.
function outstandingAlertItems_(nowMs) {
  var items = [];
  var date = crDate_(nowMs);
  [INVALID_EVENTS_KEY, INVALID_COUPONS_KEY].forEach(function (key) {
    var raw = getProp(key);
    if (!raw) return;
    var queue = JSON.parse(raw);
    (queue.entries || []).forEach(function (entry) { items.push({ key: entry, text: entry }); });
    if (queue.more) items.push({ key: key + ':more', text: '… +' + queue.more + ' / and ' + queue.more + ' more' });
  });
  var stuck = JSON.parse(getProp(PENDING_STUCK_KEY) || '{"refs":[],"more":0}');
  if (stuck.more) items.push({ key: 'pending:more', text: '… +' + stuck.more + ' / and ' + stuck.more + ' more payment checks pending after 24 h' });
  (stuck.refs || []).forEach(function (ref) {
    items.push({ key: 'pending:' + ref, text: 'Pago sin verificar tras 24 h / payment check still pending after 24 h: ' + ref });
  });
  // Threshold findings of today and yesterday: one made after a day's email waits for the next
  // day's email (FFR-029). The key carries the date, so a finding is reported once.
  [date, crDate_(nowMs - 86400000)].forEach(function (day) {
    var m = readMetrics_(day);
    var maxHoney = getNumberProp('ALERT_HONEYPOT_PER_DAY');
    var maxThrottled = getNumberProp('ALERT_THROTTLED_PER_DAY');
    if (m.honeypotHits > maxHoney) {
      items.push({ key: 'honeypot:' + day, text: day + ' Honeypot: ' + m.honeypotHits + ' (límite / limit ' + maxHoney + ')' });
    }
    if (m.throttled > maxThrottled) {
      items.push({ key: 'throttled:' + day, text: day + ' Throttled requests / solicitudes limitadas: ' + m.throttled + ' (' + maxThrottled + ')' });
    }
    if (readDaily_(DAILY_CAPHIT_PREFIX, day) > 0 || readDaily_(DAILY_UPLOADS_PREFIX, day) >= getNumberProp('LIMIT_UPLOADS_PER_DAY') ||
        readDaily_(DAILY_BYTES_PREFIX, day) >= getNumberProp('LIMIT_UPLOAD_MB_PER_DAY') * 1024 * 1024) {
      items.push({ key: 'uploadcap:' + day, text: day + ' Daily upload cap reached / límite diario de capturas alcanzado' });
    }
  });
  return items;
}

function sendAlertEmail_(items, date) {
  var to = getProp('MAIL_REPLY_TO');
  var subject = 'Eventos: avisos del ' + date + ' / Events alerts for ' + date;
  var lines = items.map(function (i) { return '- ' + i.text; }).join('\n');
  var body = 'Hola Cami,\n\nHay cosas que revisar en el sistema de eventos:\n\n' + lines +
    '\n\nLas filas inválidas de las hojas Events y Coupons se ignoran hasta que las corrijas.\n\n' +
    'Hi Cami,\n\nThese need a look in the events system (above). Invalid rows of the Events and ' +
    'Coupons tabs are ignored until fixed.\n\nLifetools';
  sendMail_(to, subject, body);
}

// Sends the day's alert email when there is something new and none has gone out today.
// Returns true when an email was sent.
// `full` is the 5-minute trigger: it always refreshes which findings are still present. A request
// (rejected or capped) skips that work once today's email has gone out.
function checkAlerts_(nowMs, full) {
  var date = crDate_(nowMs);
  if (!full && getProp(ALERT_LAST_SENT_KEY) === date) return false;
  var items = outstandingAlertItems_(nowMs);
  var current = {};
  items.forEach(function (i) { current[i.key] = true; });
  var reportedBefore = JSON.parse(getProp(ALERT_REPORTED_KEY) || '[]');
  var reported = reportedBefore.filter(function (k) { return current[k]; }); // a fixed finding can come back
  var fresh = items.filter(function (i) { return reported.indexOf(i.key) < 0; });
  var props = PropertiesService.getScriptProperties();
  if (reported.length !== reportedBefore.length) props.setProperty(ALERT_REPORTED_KEY, JSON.stringify(reported));
  if (!fresh.length || getProp(ALERT_LAST_SENT_KEY) === date) return false;

  // Without the lock two requests could both send; a busy lock just means the next check sends.
  var release = takeShortLock_(5000);
  if (!release) return false;
  try {
    if (getProp(ALERT_LAST_SENT_KEY) === date) return false; // another request sent it meanwhile
    sendAlertEmail_(items, date);
    props.setProperty(ALERT_LAST_SENT_KEY, date);
    props.setProperty(ALERT_REPORTED_KEY, JSON.stringify(items.map(function (i) { return i.key; })));
    return true;
  } finally {
    release();
  }
}

function checkAlertsSafely_(full) {
  try {
    checkAlerts_(Date.now(), !!full);
  } catch (err) {
    console.error('alert check failed: ' + err.name);
  }
}
