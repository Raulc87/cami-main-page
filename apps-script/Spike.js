// Editor-run helpers from the CMP-024 spike, kept to re-check new bank screenshot formats
// (`runOcrSamples`) and to test a raw HEIC file (`heicProbe`, CMP-033). The OCR and the amount
// comparison they call live in Payment.js. Never called by the web app.

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
    if (f.getMimeType().indexOf('image/') !== 0) {
      results.push({ file: f.getName(), skipped: 'not an image (' + f.getMimeType() + ')' });
      continue;
    }
    if (/\.(heic|heif)$/i.test(f.getName())) {
      results.push({ file: f.getName(), skipped: 'HEIC: use heicProbe' });
      continue;
    }
    var amount = amountFromFileName(f.getName());
    if (amount === null) { results.push({ file: f.getName(), error: 'name must be <name>_<amountCrc>.jpg' }); continue; }
    try {
      var r = ocrText(f.getId());
      var c = compareOcr(r.text, getProp('SINPE_NUMBER'), getProp('SINPE_ACCOUNT_NAME'), amount);
      results.push({ file: f.getName(), ms: r.ms, checkResult: c.checkResult, accountFound: c.accountFound, amountFound: c.amountFound });
    } catch (e) {
      results.push({ file: f.getName(), error: String(e.message).slice(0, 160) });
    }
    Utilities.sleep(3000);
  }
  console.log(JSON.stringify(results));
  return results;
}

// Spike step d: tries to turn each .heic/.heif file in `samples` into JPEG on the server and to
// run OCR on it directly. Logs which method works; no image content is logged.
function heicProbe() {
  var root = DriveApp.getFolderById(getProp('DRIVE_ROOT_FOLDER_ID'));
  var folders = root.getFoldersByName('samples');
  if (!folders.hasNext()) throw new Error('No `samples` subfolder in the staging root folder');
  var files = folders.next().getFiles();
  var found = 0;
  while (files.hasNext()) {
    var f = files.next();
    if (!/\.(heic|heif)$/i.test(f.getName())) continue;
    found++;
    var head = f.getBlob().getBytes().slice(0, 12);
    var res = {
      file: f.getName(), mime: f.getMimeType(), size: head.length && f.getSize(),
      // HEIC/HEIF files carry `ftyp` plus a brand such as heic at bytes 4-11; JPEG starts ff d8.
      signature: String.fromCharCode.apply(null, head.slice(4, 12).map(function (b) { return b >= 32 && b < 127 ? b : 46; })),
      startsWithJpegMarker: head[0] === 255 && head[1] === 216
    };
    try { res.getAsJpeg = f.getBlob().getAs('image/jpeg').getBytes().length > 0; } catch (e) { res.getAsJpeg = 'FAILED: ' + e.message; }
    try { var o = ocrText(f.getId()); res.directOcr = o.text.length > 0 ? 'text found (' + o.ms + ' ms)' : 'no text'; } catch (e) { res.directOcr = 'FAILED: ' + e.message; }
    console.log(JSON.stringify(res));
  }
  if (!found) console.log('No .heic/.heif file in `samples`.');
}
