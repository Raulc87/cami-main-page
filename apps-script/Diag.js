// Temporary diagnostic for CMP-025 staging checks; run from the editor. No personal data is
// logged: only event rows (which are public on the site), header names, cell types and the names
// of failing fields. Removed once the staging checks pass.

function diagEvents() {
  console.log('Code.js is the new version: ' + (typeof handleEventsSpike_ === 'undefined' && typeof handleEvents_ === 'function'));
  var sheet = getSpreadsheet().getSheetByName('Events');
  console.log('Events tab found: ' + !!sheet + (sheet ? ', rows: ' + sheet.getLastRow() + ', columns: ' + sheet.getLastColumn() : ''));
  if (!sheet || sheet.getLastRow() < 2) return;
  var values = sheet.getDataRange().getValues();
  var display = sheet.getDataRange().getDisplayValues();
  console.log('Header row: ' + JSON.stringify(values[0]));
  var h = values[0].map(function (x) { return String(x).trim(); });
  ['eventCode', 'date', 'time', 'published', 'priceCrc', 'capacity'].forEach(function (name) {
    var i = h.indexOf(name);
    if (i < 0) { console.log(name + ': COLUMN NOT FOUND'); return; }
    var v = values[1][i];
    console.log(name + ' (row 2): type=' + Object.prototype.toString.call(v) + ' value=' + String(v) + ' displayed=' + display[1][i]);
  });
  var events = readEvents();
  console.log('Valid published events: ' + events.valid.length + ', invalid rows: ' + events.invalid.length);
  events.invalid.forEach(function (i) { console.log('Invalid row ' + i.row + ': ' + i.problems.join(', ')); });
  var res = JSON.parse(handleEvents_({ lang: 'es' }).getContent());
  console.log('handleEvents_ returned ok=' + res.ok + ', events=' + (res.data ? res.data.events.length : 'none'));
  var props = PropertiesService.getScriptProperties();
  console.log('ALERT_INVALID_EVENTS: ' + props.getProperty(INVALID_EVENTS_KEY));
  console.log('ALERT_INVALID_COUPONS: ' + props.getProperty(INVALID_COUPONS_KEY));
}
