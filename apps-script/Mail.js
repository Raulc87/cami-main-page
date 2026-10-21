// Participant emails (FEATURE_SPEC FFR-026, US-025) and the shared sender. Texts are the drafts of
// docs/ux/EVENTS_EMAILS_AND_PRIVACY.md; Cami approves the final versions before release (BR-E11).
// Plain text, in the participant's site language, reply-to MAIL_REPLY_TO (camila@lifetoolscr.com).

var MONTHS_ES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
var MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Sends from the Workspace alias when it works, otherwise from the account itself (spike step e).
// Throws if both fail.
function sendMail_(to, subject, body) {
  var replyTo = getProp('MAIL_REPLY_TO') || '';
  var alias = getProp('MAIL_FROM_ALIAS');
  var options = { name: 'Lifetools' };
  if (replyTo) options.replyTo = replyTo;
  if (alias) {
    try {
      GmailApp.sendEmail(to, subject, body, Object.assign({ from: alias }, options));
      return;
    } catch (err) {
      console.error('mail from alias failed, sending from the account: ' + (err && err.name));
    }
  }
  GmailApp.sendEmail(to, subject, body, options);
}

function formatEventDate_(startsAtMs, lang) {
  var iso = crIso_(startsAtMs); // Costa Rica time, YYYY-MM-DDTHH:mm...
  var year = iso.slice(0, 4);
  var month = Number(iso.slice(5, 7)) - 1;
  var day = Number(iso.slice(8, 10));
  var time = iso.slice(11, 16);
  return lang === 'en'
    ? { date: MONTHS_EN[month] + ' ' + day + ', ' + year, time: time }
    : { date: day + ' de ' + MONTHS_ES[month] + ' de ' + year, time: time };
}

function formatAmount_(amountCrc, lang) {
  if (!amountCrc) return lang === 'en' ? 'Free' : 'Gratis';
  var grouped = String(amountCrc).replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'en' ? ',' : ' ');
  return '₡' + grouped;
}

var RECEIVED_REASONS = {
  es: {
    'sold out at submit': 'estaba lleno',
    'event closed at submit': 'había cerrado inscripciones',
    'coupon changed': 'el cupón ya no estaba disponible',
    'duplicate event code': 'tenía un problema en su configuración'
  },
  en: {
    'sold out at submit': 'was full',
    'event closed at submit': 'had closed registrations',
    'coupon changed': 'the coupon was no longer available',
    'duplicate event code': 'had a setup problem'
  }
};

function joinReasons_(reasons, lang) {
  var map = RECEIVED_REASONS[lang];
  var phrases = reasons.map(function (r) { return map[r]; }).filter(Boolean);
  if (!phrases.length) phrases = [lang === 'en' ? 'needed a review' : 'necesitaba una revisión'];
  return phrases.join(lang === 'en' ? ' and ' : ' y ');
}

// ctx: { kind: 'confirmation' | 'received' | 'notValidated', lang, name, eventName, startsAtMs,
//        reference, amountDueCrc, couponCode, paid, reasons }
function buildParticipantMail_(ctx) {
  var en = ctx.lang === 'en';
  var when = formatEventDate_(ctx.startsAtMs, ctx.lang);
  var amount = formatAmount_(ctx.amountDueCrc, ctx.lang);
  var coupon = ctx.couponCode || (en ? 'none' : 'ninguno');
  if (ctx.kind === 'confirmation') {
    if (en) {
      return {
        subject: 'Your registration for ' + ctx.eventName + ' is in',
        body: 'Hi ' + ctx.name + ',\n\nThank you for registering for ' + ctx.eventName + '! See you on ' + when.date + ' at ' + when.time + '.\n\n' +
          '- Reference: ' + ctx.reference + '\n- Amount: ' + amount + ' (coupon: ' + coupon + ')\n\n' +
          (ctx.paid ? "I'll review your SINPE Móvil receipt and confirm your payment as soon as it's validated.\n\n" : '') +
          'If you have any questions, just reply to this email.\n\nWarmly,\nCami'
      };
    }
    return {
      subject: 'Tu inscripción a ' + ctx.eventName + ' está registrada',
      body: 'Hola ' + ctx.name + ':\n\n¡Gracias por inscribirte a ' + ctx.eventName + '! Te espero el ' + when.date + ' a las ' + when.time + '.\n\n' +
        '- Referencia: ' + ctx.reference + '\n- Monto: ' + amount + ' (cupón: ' + coupon + ')\n\n' +
        (ctx.paid ? 'Voy a revisar tu comprobante de SINPE Móvil y te confirmo el pago en cuanto lo valide.\n\n' : '') +
        'Si tienes alguna pregunta, responde a este correo.\n\nCon cariño,\nCami'
    };
  }
  if (ctx.kind === 'received') {
    var why = joinReasons_(ctx.reasons || [], ctx.lang);
    if (en) {
      return {
        subject: 'We received your registration for ' + ctx.eventName,
        body: 'Hi ' + ctx.name + ',\n\nWe received your registration for ' + ctx.eventName + ' (reference ' + ctx.reference + '), but it arrived after the event ' +
          why + '. Cami will review it and write to you soon to confirm whether there is a place or to arrange a refund of your payment.\n\n' +
          'If you have any questions, just reply to this email.\n\nCami'
      };
    }
    return {
      subject: 'Recibimos tu inscripción a ' + ctx.eventName,
      body: 'Hola ' + ctx.name + ':\n\nRecibimos tu inscripción a ' + ctx.eventName + ' (referencia ' + ctx.reference + '), pero llegó cuando el evento ya ' +
        why + '. Cami va a revisar tu caso y te escribirá pronto para confirmarte si hay espacio o para coordinar la devolución de tu pago.\n\n' +
        'Si tienes alguna pregunta, responde a este correo.\n\nCami'
    };
  }
  // notValidated
  if (en) {
    return {
      subject: "We couldn't validate your payment for " + ctx.eventName,
      body: 'Hi ' + ctx.name + ',\n\nThe payment for ' + ctx.eventName + " could not be validated. The SINPE Móvil receipt you sent doesn't show Cami's account or the exact amount of " +
        amount + '.\n\nPlease reply to this email (camila@lifetoolscr.com) with the correct receipt, or let us know if something went wrong with the transfer. ' +
        'Your registration (' + ctx.reference + ') stays on file while we check.\n\nThanks,\nCami'
    };
  }
  return {
    subject: 'No pudimos validar el pago para ' + ctx.eventName,
    body: 'Hola ' + ctx.name + ':\n\nEl pago para ' + ctx.eventName + ' no pudo ser validado. El comprobante de SINPE Móvil que enviaste no muestra la cuenta de Cami o el monto exacto de ' +
      amount + '.\n\nPor favor responde a este correo (camila@lifetoolscr.com) con el comprobante correcto, o cuéntanos si hubo algún problema con la transferencia. ' +
      'Tu inscripción (' + ctx.reference + ') queda registrada mientras lo revisamos.\n\nGracias,\nCami'
  };
}

// The event name in the participant's language (Cami's `nameEn`, else the cached translation).
function eventNameFor_(ev, lang) {
  if (lang !== 'en') return ev.name;
  return englishText_(ev.name, ev.nameEn, PropertiesService.getScriptProperties().getProperties());
}

// Sends one participant email. Returns true when sent. On failure marks the row `email failed`.
function sendParticipantMail_(kind, row, ev, eventCode, extra) {
  try {
    var lang = str_(row.lang) === 'en' ? 'en' : 'es';
    var ctx = {
      kind: kind, lang: lang, name: str_(row.participantName).replace(/^'/, ''), eventName: ev ? eventNameFor_(ev, lang) : eventCode,
      startsAtMs: ev ? ev.startsAtMs : Date.now(), reference: str_(row.reference),
      amountDueCrc: Number(row.amountDueCrc) || 0, couponCode: str_(row.couponCode).replace(/^'/, ''),
      paid: (Number(row.amountDueCrc) || 0) > 0, reasons: (extra && extra.reasons) || []
    };
    var mail = buildParticipantMail_(ctx);
    sendMail_(str_(row.email).replace(/^'/, ''), mail.subject, mail.body); // a sheet cell may carry the text marker
    return true;
  } catch (err) {
    console.error('participant email failed: ' + (err && err.name));
    try { markEmailFailed_(eventCode, str_(row.submissionId)); } catch (e) { console.error('email failed mark failed'); }
    return false;
  }
}

// The "payment not validated" email for a stored row (also used by the retry trigger).
function sendNotValidatedEmail_(eventCode, row) {
  var found = lookupEventForRegister_(eventCode);
  return sendParticipantMail_('notValidated', row, found ? found.event : null, eventCode);
}
