// Entry points. Router on `action` (EVENTS_API_CONTRACT §2, §3).
// `events` is implemented in Events.js (CMP-025); `register` is still the CMP-024 spike stub
// that CMP-026 replaces.

function doGet(e) {
  try {
    var params = (e && e.parameter) || {};
    if (params.action === 'events') return handleEvents_(params);
    return fail('SERVER_ERROR');
  } catch (err) {
    console.error('doGet failed: ' + err.name);
    return fail('SERVER_ERROR');
  }
}

function doPost(e) {
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (body.action === 'register') return handleRegisterSpike_(body);
    return fail('SERVER_ERROR');
  } catch (err) {
    // Fixed message: error text can echo request content (personal data must stay out of logs).
    console.error('doPost failed: ' + err.name);
    return fail('SERVER_ERROR');
  }
}

// Run from the editor after deploying: checks configuration without touching data.
function smokeCheck() {
  var missing = missingProperties();
  console.log(missing.length ? 'Missing script properties: ' + missing.join(', ') : 'Script properties OK');
  console.log('Drive advanced service: ' + (typeof Drive !== 'undefined' && Drive.Files ? 'OK' : 'MISSING'));
}

// Spike only: refuses unless the script property SPIKE_ENABLED is `true` (set it on staging only;
// never on production). CMP-026 replaces this stub with the validated `register`.
var SPIKE_MAX_BASE64_CHARS = 7000000;

function handleRegisterSpike_(body) {
  if (getProp('SPIKE_ENABLED') !== 'true') return fail('SERVER_ERROR');
  var file = body.file;
  if (!file || !file.base64) return fail('VALIDATION_ERROR', { file: 'required' });
  if (String(file.base64).length > SPIKE_MAX_BASE64_CHARS) return fail('VALIDATION_ERROR', { file: 'file_too_large' });
  if (!/^image\/(jpeg|png|webp|heic|heif)$/.test(String(file.mimeType))) return fail('VALIDATION_ERROR', { file: 'invalid_file_type' });
  var started = Date.now();
  var blob = Utilities.newBlob(Utilities.base64Decode(file.base64), file.mimeType, 'spike_' + Date.now());
  var folder = DriveApp.getFolderById(getProp('DRIVE_ROOT_FOLDER_ID'));
  var saved = folder.createFile(blob);
  var sheet = getOrCreateSheet('SpikeLog', ['timestamp', 'fileName', 'mimeType', 'bytes', 'ms']);
  sheet.appendRow([new Date(), neutralize(saved.getName()), file.mimeType, blob.getBytes().length, Date.now() - started]);
  return ok({ reference: 'SPIKE-' + saved.getId().slice(0, 4).toUpperCase(), flagged: false, duplicateSubmission: false });
}
