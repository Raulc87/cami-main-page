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

// Compares OCR text against an account and an exact amount; amount digits must match exactly.
function compareOcr(text, accountNeedle, amountCrc) {
  var digits = text.replace(/[^\d]/g, ' ');
  var amountFound = new RegExp('(^|\\D)' + String(amountCrc).replace(/\B(?=(\d{3})+(?!\d))/g, '[., ]?') + '(\\D|$)').test(text);
  var accountFound = accountNeedle ? text.replace(/[\s-]/g, '').indexOf(String(accountNeedle).replace(/[\s-]/g, '')) !== -1 : false;
  return { checkResult: amountFound && accountFound ? 'ok' : 'mismatch', accountFound: accountFound, amountFound: amountFound, digits: digits.length };
}

// Runs OCR over every file in the `samples` subfolder of the staging root folder.
function runOcrSamples(accountNeedle, amountCrc) {
  var root = DriveApp.getFolderById(getProp('DRIVE_ROOT_FOLDER_ID'));
  var folders = root.getFoldersByName('samples');
  if (!folders.hasNext()) throw new Error('No `samples` subfolder in the staging root folder');
  var files = folders.next().getFiles();
  var results = [];
  while (files.hasNext()) {
    var f = files.next();
    var r = ocrText(f.getId());
    var c = compareOcr(r.text, accountNeedle, amountCrc);
    results.push({ file: f.getName(), ms: r.ms, checkResult: c.checkResult, accountFound: c.accountFound, amountFound: c.amountFound });
  }
  console.log(JSON.stringify(results));
  return results;
}
