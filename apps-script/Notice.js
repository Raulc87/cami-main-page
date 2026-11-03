// Registration notice to Cami (FEATURE_SPEC FFR-034, US-026, EVENTS_API_CONTRACT §9 v1.10). One short
// email per newly stored registration to the addresses in NOTIFY_REGISTRATION_TO: the last step of the
// `register` request for ₡0, and the trigger run that writes the payment check's result for a paid
// one (FFR-035, contract §6 v1.11). Text: docs/ux/EVENTS_EMAILS_AND_PRIVACY.md §2c.
// It carries the participant's name only: never their email, WhatsApp number, coupon code,
// screenshot or a link to it. Nothing here may change the registration or its response, and no
// log line names an address.

// FFR-030 reasons in the order of §2c: [checkResult or checkDetails flag, ES, EN].
var NOTICE_REASONS = [
  ['mismatch', 'el pago no coincide', 'the payment does not match'],
  ['unreadable', 'no se pudo leer el comprobante', 'the receipt could not be read'],
  ['event closed at submit', 'llegó con el evento cerrado', 'arrived after the event closed'],
  ['sold out at submit', 'llegó con el evento lleno', 'arrived when the event was full'],
  ['coupon changed', 'el cupón ya no estaba disponible', 'the coupon was no longer available'],
  ['duplicate event code', 'el código del evento está repetido en Events', 'the event code is repeated in Events'],
  ['email failed', 'no se pudo enviar el correo a la persona', 'the email to the participant could not be sent']
];

var NOTICE_CHECK_TEXT = {
  'ok': ['el pago coincide', 'payment matches'],
  'mismatch': ['el pago no coincide', 'payment does not match'],
  'unreadable': ['no se pudo leer el comprobante', 'the receipt could not be read'],
  'pending': ['pendiente: revísalo a mano', 'pending: check it by hand'], // only a row the check gave up on after 24 hours (FFR-032, §2c)
  'not-required': ['no requerida (gratis)', 'not needed (free)']
};

// The values the notice shows for a stored row: { checkResult, needsReview, reasons: [index into NOTICE_REASONS] }.
function noticeRowState_(storedRow) {
  var checkResult = str_(storedRow.checkResult).trim();
  var details = str_(storedRow.checkDetails);
  var reasonIndexes = [];
  NOTICE_REASONS.forEach(function (reason, index) {
    var applies = reason[0] === checkResult || details.split('; ').indexOf(reason[0]) !== -1;
    if (applies) reasonIndexes.push(index);
  });
  var flagged = storedRow.needsReview === true || str_(storedRow.needsReview).toUpperCase() === 'TRUE';
  return { checkResult: checkResult, needsReview: flagged, reasons: reasonIndexes };
}

// ctx: { eventCode (the event's tab, FFR-015), eventNameEs, eventNameEn, startsAtMs, name, amountDueCrc, reference, state } (state: noticeRowState_)
function buildRegistrationNotice_(ctx) {
  var dateEs = formatEventDate_(ctx.startsAtMs, 'es').date;
  var dateEn = formatEventDate_(ctx.startsAtMs, 'en').date;
  var checkText = NOTICE_CHECK_TEXT[ctx.state.checkResult] || [ctx.state.checkResult, ctx.state.checkResult];
  var needsEs = 'no';
  var needsEn = 'no';
  if (ctx.state.needsReview) {
    var reasons = ctx.state.reasons.map(function (i) { return NOTICE_REASONS[i]; });
    // A flagged row whose flags match no listed reason (for example a flag added later) must not end the line empty.
    needsEs = reasons.length ? 'sí: ' + reasons.map(function (r) { return r[1]; }).join(', ') : 'sí';
    needsEn = reasons.length ? 'yes: ' + reasons.map(function (r) { return r[2]; }).join(', ') : 'yes';
  }
  return {
    subject: 'Nueva inscripción: ' + ctx.eventNameEs + ' / New registration: ' + ctx.eventNameEn,
    body: 'Hola Cami,\n\nNueva inscripción a ' + ctx.eventNameEs + ' (' + dateEs + '):\n\n' +
      '- Nombre: ' + ctx.name + '\n- Monto: ' + formatAmount_(ctx.amountDueCrc, 'es') + '\n' +
      '- Revisión del pago: ' + checkText[0] + '\n- Necesita revisión: ' + needsEs + '\n- Referencia: ' + ctx.reference + '\n\n' +
      'Los demás datos (correo, WhatsApp, comprobante) están en la pestaña ' + ctx.eventCode + ' de la hoja.\n\n' +
      'Hi Cami,\n\nNew registration for ' + ctx.eventNameEn + ' (' + dateEn + '):\n\n' +
      '- Name: ' + ctx.name + '\n- Amount: ' + formatAmount_(ctx.amountDueCrc, 'en') + '\n' +
      '- Payment check: ' + checkText[1] + '\n- Needs review: ' + needsEn + '\n- Reference: ' + ctx.reference + '\n\n' +
      'The other details (email, WhatsApp, receipt) are in the ' + ctx.eventCode + ' tab of the sheet.\n\nLifetools'
  };
}

// True when Google's remaining daily email quota is at least NOTIFY_QUOTA_RESERVE, so the
// participants' emails keep the rest (contract §9). A quota that cannot be read counts as low.
function noticeQuotaAllows_() {
  try {
    return MailApp.getRemainingDailyQuota() >= getNumberProp('NOTIFY_QUOTA_RESERVE');
  } catch (err) {
    console.error('registration notice: quota unreadable: ' + (err && err.name));
    return false;
  }
}

// The row's `noticeSentAt` is blank (the notice is due) and its tab has the column. A row with no column
// (headers that differ from ours) or any other value is never noticed (contract §6 v1.11).
function noticeIsDue_(storedRow) {
  return storedRow.noticeSentAt !== undefined && str_(storedRow.noticeSentAt).trim() === '';
}

function writeNoticeSentAt_(sheet, rowNumber, value) {
  sheet.getRange(rowNumber, REGISTRATION_HEADERS.indexOf('noticeSentAt') + 1).setValue(value);
}

// Decides and records, under the lock, what happens to a due notice, so two runs (the request and a
// trigger run, or two trigger runs) never both send it: the first writes the time and sends, the other
// finds it written. Returns { row } to send, or null when there is nothing to send (not due, a
// `pending` row that is not yet at its limit, or `skipped` written: no valid address, quota below the
// reserve). A crash between this write and the send loses the notice rather than sending it twice.
function claimRegistrationNotice_(eventCode, submissionId, options) {
  var release = takeShortLock_(20000);
  if (!release) {
    console.error('registration notice not claimed: lock busy'); // stays blank: a later trigger run takes it
    return null;
  }
  try {
    var sheet = getSpreadsheet().getSheetByName(eventCode);
    var stored = readTable(eventCode).filter(function (r) { return str_(r.v.submissionId) === submissionId; })[0];
    if (!sheet || !stored || !noticeIsDue_(stored.v)) return null;
    if (str_(stored.v.checkResult).trim() === 'pending' && !options.allowPending) return null;
    var list = parseAddressList_(getProp('NOTIFY_REGISTRATION_TO'));
    if (list.skipped) console.error('NOTIFY_REGISTRATION_TO: ' + list.skipped + ' invalid address(es) skipped');
    if (!list.valid.length) {
      writeNoticeSentAt_(sheet, stored.row, NOTICE_SKIPPED);
      return null;
    }
    if (!noticeQuotaAllows_()) {
      console.error('registration notice skipped: remaining email quota below NOTIFY_QUOTA_RESERVE');
      writeNoticeSentAt_(sheet, stored.row, NOTICE_SKIPPED);
      return null;
    }
    writeNoticeSentAt_(sheet, stored.row, "'" + crIso_(Date.now()));
    return { row: stored.v, to: list.valid.join(',') };
  } finally {
    release();
  }
}

function markNoticeSendFailed_(eventCode, submissionId) {
  var release = takeShortLock_(20000);
  if (!release) return;
  try {
    var sheet = getSpreadsheet().getSheetByName(eventCode);
    var stored = readTable(eventCode).filter(function (r) { return str_(r.v.submissionId) === submissionId; })[0];
    if (sheet && stored) writeNoticeSentAt_(sheet, stored.row, NOTICE_SKIPPED);
  } finally {
    release();
  }
}

// Sends the notice of one stored registration if it is due, showing the row as it is now (the
// payment check has written its result by then). `options.allowPending`: the trigger sets it only for
// a row the check gave up on after 24 hours. Never throws and never touches the registration, its
// response or `needsReview`: a problem is logged by error name only (FFR-034, US-026 AC4, AC5).
function sendRegistrationNoticeSafely_(eventCode, submissionId, options) {
  var claimed = null;
  try {
    claimed = claimRegistrationNotice_(eventCode, submissionId, options);
    if (!claimed) return;
    var found = lookupEventForRegister_(eventCode);
    if (!found) throw new Error('event not found');
    var row = claimed.row;
    var mail = buildRegistrationNotice_({
      eventCode: eventCode, eventNameEs: found.event.name, eventNameEn: eventNameFor_(found.event, 'en'), startsAtMs: found.event.startsAtMs,
      name: str_(row.participantName).replace(/^'/, ''), amountDueCrc: Number(row.amountDueCrc) || 0, reference: str_(row.reference),
      state: noticeRowState_(row)
    });
    sendMail_(claimed.to, mail.subject, mail.body);
  } catch (err) {
    console.error('registration notice failed: ' + (err && err.name));
    if (claimed) {
      try { markNoticeSendFailed_(eventCode, submissionId); } catch (markErr) { console.error('registration notice mark failed: ' + (markErr && markErr.name)); }
    }
  }
}
