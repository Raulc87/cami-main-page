// Spike helpers (CMP-024), run from the editor. Remove or keep out of production use once the
// findings are recorded in docs/sprints/SPRINT_02_SPIKE.md.

// Drive OCR on one image file: returns the extracted text and deletes the temporary Doc.
function ocrText(fileId) {
  var blob = DriveApp.getFileById(fileId).getBlob();
  var t0 = Date.now();
  var doc = Drive.Files.insert(
    { title: 'ocr-tmp-' + Date.now(), mimeType: 'application/vnd.google-apps.document' },
    blob,
    { ocr: true, ocrLanguage: 'es' }
  );
  try {
    var text = DocumentApp.openById(doc.id).getBody().getText();
    return { text: text, ms: Date.now() - t0 };
  } finally {
    DriveApp.getFileById(doc.id).setTrashed(true);
  }
}

// Compares OCR text against the account and an exact amount. The amount must appear as a whole
// number (thousands separators `.`, `,` or space allowed), not as part of a longer number.
function compareOcr(text, accountNumber, accountName, amountCrc) {
  var grouped = String(amountCrc).replace(/\B(?=(\d{3})+(?!\d))/g, '[., ]?');
  var amountFound = new RegExp('(^|\\D)' + grouped + '(\\D|$)').test(text);
  var squash = function (v) { return String(v).replace(/[\s-]/g, '').toLowerCase(); };
  var haystack = squash(text);
  var accountFound = (!!accountNumber && haystack.indexOf(squash(accountNumber)) !== -1) ||
    (!!accountName && haystack.indexOf(squash(accountName)) !== -1);
  return { checkResult: amountFound && accountFound ? 'ok' : 'mismatch', accountFound: accountFound, amountFound: amountFound };
}

// Expected amount from a sample file name `<name>_<amountCrc>.jpg`; null if it does not match.
function amountFromFileName(name) {
  var m = /_(\d+)\.[A-Za-z0-9]+$/.exec(name);
  return m ? Number(m[1]) : null;
}

// Runs OCR over every file in the `samples` subfolder of the staging root folder. The expected
// account comes from the SINPE_* script properties and the amount from each file name, so no
// receipt data passes through chat or the repo. Logs only ok/mismatch and timings.
function runOcrSamples() {
  var root = DriveApp.getFolderById(getProp('DRIVE_ROOT_FOLDER_ID'));
  var folders = root.getFoldersByName('samples');
  if (!folders.hasNext()) throw new Error('No `samples` subfolder in the staging root folder');
  var files = folders.next().getFiles();
  var results = [];
  while (files.hasNext()) {
    var f = files.next();
    var amount = amountFromFileName(f.getName());
    if (amount === null) { results.push({ file: f.getName(), error: 'name must be <name>_<amountCrc>.jpg' }); continue; }
    var r = ocrText(f.getId());
    var c = compareOcr(r.text, getProp('SINPE_NUMBER'), getProp('SINPE_ACCOUNT_NAME'), amount);
    results.push({ file: f.getName(), ms: r.ms, checkResult: c.checkResult, accountFound: c.accountFound, amountFound: c.amountFound });
  }
  console.log(JSON.stringify(results));
  return results;
}
