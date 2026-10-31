// Registration notice to Cami (FEATURE_SPEC FFR-034, US-026, EVENTS_API_CONTRACT §9 v1.10). One short
// email per newly stored registration, sent as the last step of the `register` request to the
// addresses in NOTIFY_REGISTRATION_TO. Text: docs/ux/EVENTS_EMAILS_AND_PRIVACY.md §2c.
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
  'pending': ['pendiente (se revisa de nuevo más tarde)', 'pending (checked again later)'],
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

// ctx: { eventNameEs, eventNameEn, startsAtMs, name, amountDueCrc, reference, state } (state: noticeRowState_)
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
      'Los demás datos (correo, WhatsApp, comprobante) están en la pestaña de ' + ctx.eventNameEs + '.\n\n' +
      'Hi Cami,\n\nNew registration for ' + ctx.eventNameEn + ' (' + dateEn + '):\n\n' +
      '- Name: ' + ctx.name + '\n- Amount: ' + formatAmount_(ctx.amountDueCrc, 'en') + '\n' +
      '- Payment check: ' + checkText[1] + '\n- Needs review: ' + needsEn + '\n- Reference: ' + ctx.reference + '\n\n' +
      'The other details (email, WhatsApp, receipt) are in the ' + ctx.eventNameEn + ' tab.\n\nLifetools'
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

// Sends the notice for a registration stored by this request. Never throws and never touches the
// row: a problem is logged by error name only (FFR-034, US-026 AC4, AC5).
function sendRegistrationNoticeSafely_(v, found, amountDue, outcome) {
  try {
    var list = parseAddressList_(getProp('NOTIFY_REGISTRATION_TO'));
    if (list.skipped) console.error('NOTIFY_REGISTRATION_TO: ' + list.skipped + ' invalid address(es) skipped');
    if (!list.valid.length) return;
    if (!noticeQuotaAllows_()) {
      console.error('registration notice skipped: remaining email quota below NOTIFY_QUOTA_RESERVE');
      return;
    }
    // The row as the request left it: the payment check may have changed it since it was stored.
    var stored = readTable(v.eventCode).filter(function (r) { return str_(r.v.submissionId) === v.submissionId; })[0];
    if (!stored) return;
    var mail = buildRegistrationNotice_({
      eventNameEs: found.event.name, eventNameEn: eventNameFor_(found.event, 'en'), startsAtMs: found.event.startsAtMs,
      name: v.participantName, amountDueCrc: amountDue, reference: outcome.reference, state: noticeRowState_(stored.v)
    });
    sendMail_(list.valid.join(','), mail.subject, mail.body);
  } catch (err) {
    console.error('registration notice failed: ' + (err && err.name));
  }
}
