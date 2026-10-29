// Time-trigger guards (EVENTS_API_CONTRACT §9 `RETRY_CHECK_HOURS`, `TRIGGER_FAIL_ALERT_AFTER`; CMP-101, FFR-033).

var TRIGGER_FAILURE_COUNT_PREFIX = 'TRIGGER_FAILS_';
var DEFAULT_TRIGGER_FAIL_ALERT_AFTER = 1; // contract §9: empty or invalid -> every failure is reported

// `RETRY_CHECK_HOURS` ("06-22": start hour inclusive, end hour exclusive, Costa Rica time) as
// { start, end }, or null when empty or invalid (then the check runs at every hour).
function parseRetryCheckHours_(raw) {
  var m = /^\s*(\d{1,2})\s*-\s*(\d{1,2})\s*$/.exec(str_(raw));
  if (!m) return null;
  var start = Number(m[1]);
  var end = Number(m[2]);
  // A range that wraps past midnight (22-06) is not in the contract: treated as invalid.
  return start < end && end <= 24 ? { start: start, end: end } : null;
}

// True when `retryPendingChecks` may work now. An empty or invalid setting is logged (no value) and never fails the run.
function insideRetryCheckHours_(nowMs) {
  var raw = getProp('RETRY_CHECK_HOURS');
  var hours = parseRetryCheckHours_(raw);
  if (!hours) {
    console.error('RETRY_CHECK_HOURS is empty or invalid; the payment re-check runs at every hour');
    return true;
  }
  var hour = new Date(nowMs - CR_OFFSET_HOURS * 3600000).getUTCHours();
  return hour >= hours.start && hour < hours.end;
}

function triggerFailAlertAfter_() {
  var n = Number(getProp('TRIGGER_FAIL_ALERT_AFTER'));
  return isFinite(n) && n >= 1 && Math.floor(n) === n ? n : DEFAULT_TRIGGER_FAIL_ALERT_AFTER;
}

// Runs a trigger function. A failure is rethrown (so Google sends its failure email) only once this
// function has failed `TRIGGER_FAIL_ALERT_AFTER` runs in a row; earlier ones are logged by error
// name and counted. A success resets the count. Each function counts on its own.
function runTriggerGuarded_(functionName, run) {
  var props = PropertiesService.getScriptProperties();
  var key = TRIGGER_FAILURE_COUNT_PREFIX + functionName;
  try {
    run();
  } catch (err) {
    var failures = 1;
    try {
      failures = (Number(props.getProperty(key)) || 0) + 1;
      props.setProperty(key, String(failures));
    } catch (countErr) {
      console.error(functionName + ' failure count not saved: ' + countErr.name); // report rather than hide
      throw err;
    }
    if (failures >= triggerFailAlertAfter_()) throw err;
    console.error(functionName + ' failed (' + failures + ' in a row, not reported yet): ' + err.name);
    return;
  }
  try {
    props.deleteProperty(key);
  } catch (resetErr) {
    console.error(functionName + ' failure count not reset: ' + resetErr.name);
  }
}
