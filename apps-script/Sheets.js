// Spreadsheet helpers.

var spreadsheetInRun_ = null;

// Opened once per execution: every openById call costs hundreds of milliseconds.
function getSpreadsheet() {
  if (!spreadsheetInRun_) spreadsheetInRun_ = SpreadsheetApp.openById(getProp('SPREADSHEET_ID'));
  return spreadsheetInRun_;
}

function getOrCreateSheet(name, headers) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (headers) sheet.appendRow(headers);
  }
  return sheet;
}

// Rows of a tab as objects keyed by the header row. Empty tab -> [].
function readRows(name) {
  var sheet = getSpreadsheet().getSheetByName(name);
  if (!sheet || sheet.getLastRow() < 2) return [];
  var values = sheet.getDataRange().getValues();
  var headers = values[0];
  return values.slice(1).map(function (row) {
    var obj = {};
    headers.forEach(function (h, i) { obj[h] = row[i]; });
    return obj;
  });
}

// Prefix values that start a formula so Sheets stores them as text (contract §6, FFR-014).
function neutralize(value) {
  var s = String(value);
  // Also digits-only text, so Sheets keeps it as text instead of a number.
  return /^[=+\-@\t\r]/.test(s) || /^\d[\d.,]*$/.test(s) ? "'" + s : s;
}

// A tab as rows of { row: sheet row number, v: {header: value}, d: {header: displayed text} }.
// Empty or missing tab -> []. Fully blank rows are skipped.
function readTable(name) {
  var sheet = getSpreadsheet().getSheetByName(name);
  if (!sheet || sheet.getLastRow() < 2) return [];
  var range = sheet.getDataRange();
  var values = range.getValues();
  var display = range.getDisplayValues();
  var headers = values[0].map(function (h) { return String(h).trim(); });
  var rows = [];
  for (var i = 1; i < values.length; i++) {
    var blank = values[i].every(function (c) { return c === '' || c === null; });
    if (blank) continue;
    var v = {};
    var d = {};
    headers.forEach(function (h, j) { if (h) { v[h] = values[i][j]; d[h] = display[i][j]; } });
    rows.push({ row: i + 1, v: v, d: d });
  }
  return rows;
}

// Number of counting registrations in an event's tab (BR-E10: status `new` or `confirmed`,
// flagged or not). A missing tab has none.
function countRegistrations(eventCode) {
  var sheet = getSpreadsheet().getSheetByName(eventCode);
  if (!sheet || sheet.getLastRow() < 2) return 0;
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var col = headers.map(function (h) { return String(h).trim(); }).indexOf('status') + 1;
  if (!col) return 0;
  var statuses = sheet.getRange(2, col, sheet.getLastRow() - 1, 1).getValues();
  return statuses.filter(function (r) {
    var s = String(r[0]).trim().toLowerCase();
    return s === 'new' || s === 'confirmed';
  }).length;
}
