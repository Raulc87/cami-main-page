// Script-property configuration (EVENTS_API_CONTRACT §9). Values live only in script properties.

var REQUIRED_PROPERTIES = [
  'SPREADSHEET_ID',
  'DRIVE_ROOT_FOLDER_ID',
  'SINPE_NUMBER',
  'SINPE_ACCOUNT_NAME',
  'MAIL_REPLY_TO'
];

var NUMERIC_DEFAULTS = {
  LIMIT_REGISTER_PER_MIN: 20,
  LIMIT_COUPON_CHECKS_PER_MIN: 30,
  LIMIT_COUPON_FAILS_PER_MIN: 10,
  LIMIT_UPLOADS_PER_DAY: 100,
  LIMIT_UPLOAD_MB_PER_DAY: 300,
  ALERT_HONEYPOT_PER_DAY: 10,
  ALERT_THROTTLED_PER_DAY: 20
};

var SINPE_PLACEHOLDER_NUMBER = '0000-0000 (POR CONFIRMAR / TO BE CONFIRMED)';

function getProp(name) {
  return PropertiesService.getScriptProperties().getProperty(name);
}

function getNumberProp(name) {
  var raw = getProp(name);
  var n = raw === null || raw === '' ? NaN : Number(raw);
  return isFinite(n) ? n : NUMERIC_DEFAULTS[name];
}

// Returns the names of required properties that are missing (for the smoke check).
function missingProperties() {
  return REQUIRED_PROPERTIES.filter(function (name) {
    return !getProp(name);
  });
}

function getSinpe() {
  var number = getProp('SINPE_NUMBER') || '';
  return {
    number: number,
    accountName: getProp('SINPE_ACCOUNT_NAME') || '',
    isPlaceholder: number === SINPE_PLACEHOLDER_NUMBER
  };
}
