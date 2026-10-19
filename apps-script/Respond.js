// Response envelope (EVENTS_API_CONTRACT §7). HTTP status is always 200.

function jsonOut(body) {
  return ContentService.createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}

function ok(data) {
  return jsonOut({ ok: true, data: data, error: null });
}

function fail(code, fields) {
  var error = { code: code };
  if (fields) error.fields = fields;
  return jsonOut({ ok: false, data: null, error: error });
}
