// Spreadsheet helpers.

function getSpreadsheet() {
  return SpreadsheetApp.openById(getProp('SPREADSHEET_ID'));
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
  return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
}
