# Events — participant emails and privacy notice (drafts)

- Status: **Draft.** Email texts need Cami's approval; the privacy notice needs a lawyer's
  review (Cinthia or another lawyer) before production (FEATURE_SPEC BR-E11). Until then they
  are placeholders under PROJECT_SPEC BR-002.
- Related: [FEATURE_SPEC_events_registration.md](../specs/FEATURE_SPEC_events_registration.md)
  (FFR-018, FFR-026), US-019, US-025.
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

Recibimos tu inscripción a **{evento}** (referencia {referencia}), pero llegó cuando el evento ya
{estaba lleno / había cerrado inscripciones / el cupón ya no estaba disponible}. Cami va a revisar
tu caso y te escribirá pronto para confirmarte si hay espacio o para coordinar la devolución de
tu pago.

Si tienes alguna pregunta, responde a este correo.

Cami

### EN
**Subject:** We received your registration for {event}

Hi {name},

We received your registration for **{event}** (reference {reference}), but it arrived after the
event {was full / had closed registrations / the coupon was no longer available}. Cami will
review it and write to you soon to confirm whether there is a place or to arrange a refund of
your payment.

If you have any questions, just reply to this email.

Cami

### Reason phrases (both languages)
The `{…}` reason is one or more of these, joined by "and" / "y" when several flags apply (code:
`apps-script/Mail.js`, CMP-028):

| Flag (`checkDetails`) | ES | EN |
|---|---|---|
| `sold out at submit` | estaba lleno | was full |
| `event closed at submit` | había cerrado inscripciones | had closed registrations |
| `coupon changed` | el cupón ya no estaba disponible | the coupon was no longer available |
| `duplicate event code` | tenía un problema en su configuración | had a setup problem |
| (no known flag) | necesitaba una revisión | needed a review |

For Cami: the coupon phrase reads awkwardly after "llegó cuando el evento ya …" / "arrived after
the event …" (e.g. "arrived after the event the coupon was no longer available"). She can
approve it as is or give new wording; a wording change is a small code change.

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

Sent to `MAIL_REPLY_TO` (camila@), at most once a day, only when there is something to act on.
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

## Amount format
Emails show amounts as `₡15.000` (dot as thousands separator, the usual Costa Rican style); the
site shows `₡15 000`. Cami chooses one style when she approves the texts; aligning them is a
small code change.

## 3. Privacy notice (form) — generic draft

Open points for the lawyer review (BR-E11): the data **retention period** (Q-11; not stated
below), and the "not shared with third parties" sentence if Cloudflare Turnstile is enabled later
(FFR-029), since it processes visitor data for the captcha.

### ES
**Aviso de privacidad.** Cami Hernandez (Lifetools, camila@lifetoolscr.com) recopila tu nombre,
correo, número de WhatsApp y, si aplica, el comprobante de pago, únicamente para gestionar tu
inscripción a este evento y comunicarse contigo sobre él. Tus datos se guardan en Google
Workspace y no se comparten con terceros ni se usan para publicidad sin tu consentimiento.
Puedes pedir acceso, corrección o eliminación de tus datos escribiendo a
camila@lifetoolscr.com, conforme a la Ley N.° 8968 de Costa Rica.

☐ Acepto el aviso de privacidad y autorizo el uso de mis datos para esta inscripción.

### EN
**Privacy notice.** Cami Hernandez (Lifetools, camila@lifetoolscr.com) collects your name,
email, WhatsApp number and, when applicable, your payment receipt only to manage your
registration for this event and to contact you about it. Your data is stored in Google
Workspace and is not shared with third parties or used for advertising without your consent.
You can request access, correction or deletion of your data by writing to
camila@lifetoolscr.com, under Costa Rica's Law No. 8968.

☐ I accept the privacy notice and authorize the use of my data for this registration.
