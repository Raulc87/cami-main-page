# Events — participant emails and privacy notice

- Status: **Approved by Cami, with her changes** (review document, 2026-10-26; recorded in
  CMP-058). Emails, amount format, form wording and the privacy notice. Per the owner's decision of
  2026-10-26, Cami's review stands as the legal review of the privacy notice (FEATURE_SPEC
  BR-E11 and §20). The code applies these texts in CMP-059.
- Related: [FEATURE_SPEC_events_registration.md](../specs/FEATURE_SPEC_events_registration.md)
  (FFR-018, FFR-026, FFR-034), US-019, US-025, US-026.
- Placeholders in `{braces}` are filled by the backend. Sender: Workspace alias if available,
  otherwise `camila@lifetoolscr.com`; reply-to always `camila@lifetoolscr.com`.

## 1. Confirmation email

### ES
**Asunto:** Tu inscripción a {evento} está registrada

Hola {nombre}:

¡Gracias por inscribirte a **{evento}**! Te espero el {fecha} a las {hora}.

- Referencia: {referencia}
- Monto: {monto} (cupón: {cupón o "ninguno"})

{Solo eventos pagados:} Voy a revisar tu comprobante de SINPE Móvil y te confirmo el pago en
cuanto lo valide.

Si tienes alguna pregunta, responde a este correo.

Con cariño,
Cami

### EN
**Subject:** Your registration for {event} is in

Hi {name},

Thank you for registering for **{event}**! See you on {date} at {time}.

- Reference: {reference}
- Amount: {amount} (coupon: {coupon or "none"})

{Paid events only:} I'll review your SINPE Móvil receipt and confirm your payment as soon as
it's validated.

If you have any questions, just reply to this email.

Warmly,
Cami

## 1b. "Registration received" email (flagged late registrations, FFR-024)

### ES
**Asunto:** Recibimos tu inscripción a {evento}

Hola {nombre}:

Recibimos tu inscripción a **{evento}** (referencia {referencia}), pero {motivo}. Cami va a
revisar tu caso y te escribirá pronto para confirmarte si hay espacio o para coordinar la
devolución de tu pago.

Si tienes alguna pregunta, responde a este correo.

Cami

### EN
**Subject:** We received your registration for {event}

Hi {name},

We received your registration for **{event}** (reference {reference}), but {reason}. Cami will
review it and write to you soon to confirm whether there is a place or to arrange a refund of
your payment.

If you have any questions, just reply to this email.

Cami

### Reason phrases (both languages)
The `{motivo}` / `{reason}` is one or more of these, joined by "y" / "and" when several flags
apply (code: `apps-script/Mail.js`; reworded by Cami, 2026-10-26, applied in CMP-059):

| Flag (`checkDetails`) | ES | EN |
|---|---|---|
| `sold out at submit` | llegó cuando el evento estaba lleno | it arrived when the event was full |
| `event closed at submit` | llegó cuando el evento había cerrado inscripciones | it arrived after the event had closed registrations |
| `coupon changed` | el cupón ya no estaba disponible | the coupon was no longer available |
| `duplicate event code` | el evento tenía un problema en su configuración | the event had a setup problem |
| (no known flag) | necesitaba una revisión | it needed a review |

## 2. "Payment not validated" email

### ES
**Asunto:** No pudimos validar el pago para {evento}

Hola {nombre}:

El pago para **{evento}** no pudo ser validado. El comprobante de SINPE Móvil que enviaste no
muestra la cuenta de Cami o el monto exacto de {monto}.

Por favor responde a este correo (camila@lifetoolscr.com) con el comprobante correcto, o
cuéntanos si hubo algún problema con la transferencia. Tu inscripción ({referencia}) queda
registrada mientras lo revisamos.

Gracias,
Cami

### EN
**Subject:** We couldn't validate your payment for {event}

Hi {name},

The payment for **{event}** could not be validated. The SINPE Móvil receipt you sent doesn't
show Cami's account or the exact amount of {amount}.

Please reply to this email (camila@lifetoolscr.com) with the correct receipt, or let us know if
something went wrong with the transfer. Your registration ({reference}) stays on file while we
check.

Thanks,
Cami

## 2b. Alert email to Cami (internal, FFR-029)

Sent to every address in `ALERT_TO` (the owner and camila@; empty → `MAIL_REPLY_TO`, camila@;
contract §9 v1.6, CMP-061), at most once a day, only when there is something to act on. The
text is the same for every recipient.
Current text (code: `apps-script/Alerts.js`, CMP-027); one message in both languages:

**Asunto / Subject:** Eventos: avisos del {fecha} / Events alerts for {date}

Hola Cami,

Hay cosas que revisar en el sistema de eventos:

- {one line per finding, e.g. an invalid `Events`/`Coupons` row, honeypot or throttled counts
  over the limit, the daily upload cap reached, or a payment check still pending after 24 h}

Las filas inválidas de las hojas Events y Coupons se ignoran hasta que las corrijas.

Hi Cami,

These need a look in the events system (above). Invalid rows of the Events and Coupons tabs are
ignored until fixed.

Lifetools

## 2c. Registration notice to Cami (internal, FFR-034)

Sent to the address(es) in `NOTIFY_REGISTRATION_TO` (Cami's; empty → none; contract §9 v1.10,
CMP-111), once per newly stored registration, after the participant's email. One message in
both languages. Proposed text (coordinator, CMP-111; Cami sees it in the staging check and can
ask for changes before production):

**Asunto / Subject:** Nueva inscripción: {evento} / New registration: {event}

Hola Cami,

Nueva inscripción a **{evento}** ({fecha}):

- Nombre: {nombre}
- Monto: {monto} (o "Gratis")
- Revisión del pago: {checkResult en palabras: pendiente, ok, no coincide, ilegible, no requerida}
- Necesita revisión: {sí, con el motivo de FFR-024 si aplica / no}
- Referencia: {referencia}

Los demás datos (correo, WhatsApp, comprobante) están en la hoja de {evento}.

Hi Cami,

New registration for **{event}** ({date}), {name}: amount {amount}, payment check {checkResult},
needs review {yes/no}, reference {reference}. The other details are in the {event} tab.

Lifetools

The notice never contains the participant's email, WhatsApp number, coupon code, screenshot or
a link to it.

## Amount format
Both languages show amounts with a comma, `₡15,000`, in the emails and on the site (Cami,
2026-10-26: "utilicemos coma en ambos"; the owner extended it to the site; applied in CMP-059).

## 3. Privacy notice (form)

Approved by Cami, 2026-10-26, as the legal review (owner decision, BR-E11). Her answers to the
review questions:
- **Retention period:** not stated ("no hace falta poner tiempo de conservacion de datos").
- **Provider:** Google is not named ("quiza podemos no nombrar al proveedor, solo decir que tus
  datos son guardados mas no mencionar a Google"); the storage sentence is dropped.
- **Purpose:** "about it" is dropped so the email can be used to contact the person on other
  topics too ("podriamos quitar esto para permitir que se pueda usar el correo para comunicarse
  con la persona otros temas tambien, no solo este evento").
- **Captcha (Turnstile):** revisited when it is enabled ("lo veremos al momento de usar captcha").
- **Registering someone else:** no change; one registration per person, each with its own email
  ("no creo que haga falta, con que sea una inscripcion por persona con un correo distinto por
  cada una"). Several people under one email may be evaluated later.
- **Consent checkbox:** unchanged ("asi esta bien"). Because the notice now allows contact beyond
  the event, the owner added an optional, unticked second checkbox for that (2026-10-26,
  FEATURE_SPEC §20 "Contact consent"); see below.

### ES
**Aviso de privacidad.** Cami Hernandez (Lifetools, camila@lifetoolscr.com) recopila tu nombre,
correo, número de WhatsApp y, si aplica, el comprobante de pago, únicamente para gestionar tu
inscripción a este evento y comunicarse contigo. Tus datos no se comparten con terceros ni se
usan para publicidad sin tu consentimiento.
Puedes pedir acceso, corrección o eliminación de tus datos escribiendo a
camila@lifetoolscr.com, conforme a la Ley N.° 8968 de Costa Rica.

☐ Acepto el aviso de privacidad y autorizo el uso de mis datos para esta inscripción.

☐ *(opcional)* Quiero que Cami me contacte sobre otros eventos y novedades.

### EN
**Privacy notice.** Cami Hernandez (Lifetools, camila@lifetoolscr.com) collects your name,
email, WhatsApp number and, when applicable, your payment receipt only to manage your
registration for this event and to contact you. Your data is not shared with third parties or
used for advertising without your consent.
You can request access, correction or deletion of your data by writing to
camila@lifetoolscr.com, under Costa Rica's Law No. 8968.

☐ I accept the privacy notice and authorize the use of my data for this registration.

☐ *(optional)* I'd like Cami to contact me about other events and news.

## 4. Form wording (BR-E11)

The registration form's EN/ES texts in `UI_TEXT.events.form`
([`src/constants/i18n.js`](../../src/constants/i18n.js)) are approved by Cami as listed in the
review document (2026-10-26), with one change: the WhatsApp example number in the field hint
and the phone error message is the neutral `+50688880000`. Cami asked for her own number; the
owner chose a neutral example so no real number goes in the public repository (CMP-058).
