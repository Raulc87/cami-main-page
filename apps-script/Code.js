// Entry points. Router on `action` (EVENTS_API_CONTRACT §2, §3).
// Spike (CMP-024): `events` and `register` are minimal stubs that prove ADR-008 → Validation;
// CMP-025 and CMP-026 replace them with the specified behavior.

function doGet(e) {
  try {
    var params = (e && e.parameter) || {};
    if (params.action === 'events') return handleEventsSpike_(params);
    return fail('SERVER_ERROR');
  } catch (err) {
    console.error(err);
    return fail('SERVER_ERROR');
  }
}

function doPost(e) {
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (body.action === 'register') return handleRegisterSpike_(body);
    return fail('SERVER_ERROR');
  } catch (err) {
    console.error(err);
    return fail('SERVER_ERROR');
  }
}

// Run from the editor after deploying: checks configuration without touching data.
function smokeCheck() {
  var missing = missingProperties();
  console.log(missing.length ? 'Missing script properties: ' + missing.join(', ') : 'Script properties OK');
  console.log('Drive advanced service: ' + (typeof Drive !== 'undefined' && Drive.Files ? 'OK' : 'MISSING'));
}

function handleEventsSpike_() {
  return ok({ sinpe: getSinpe(), events: [] });
}

function handleRegisterSpike_(body) {
  var file = body.file;
  if (!file || !file.base64) return fail('VALIDATION_ERROR', { file: 'required' });
  var started = Date.now();
  var blob = Utilities.newBlob(Utilities.base64Decode(file.base64), file.mimeType, 'spike_' + Date.now());
  var folder = DriveApp.getFolderById(getProp('DRIVE_ROOT_FOLDER_ID'));
  var saved = folder.createFile(blob);
  var sheet = getOrCreateSheet('SpikeLog', ['timestamp', 'fileName', 'mimeType', 'bytes', 'ms']);
  sheet.appendRow([new Date(), neutralize(saved.getName()), file.mimeType, blob.getBytes().length, Date.now() - started]);
  return ok({ reference: 'SPIKE-' + saved.getId().slice(0, 4).toUpperCase(), flagged: false, duplicateSubmission: false });
}
