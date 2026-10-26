// ── UI copy translations (EN/ES) ────────────────────────────────────────────
// Source of truth for the translatable headline/CTA/nav/kicker copy driven by
// the global language toggle (see src/context/LanguageContext.jsx). Footer
// has no entries here — its visible copy (wordmark, brand words, URL) is
// never translated, see the note below.
// List content (services, steps, testimonials, stats) keeps its own `*Es`
// fields in src/constants/data.jsx instead of living here — see
// docs/specs/ARCHITECTURE_SPEC.md (§9).
//
// Intentionally NOT here: the fixed Spanish "brand accent" strings (Hero
// taglines, Footer WORDS, the VALUES es/en pairs) — those are permanent
// stylistic flourishes, not translated copy, and stay hardcoded inline.

export const UI_TEXT = {
  nav: {
    badge: { en: 'Available for 2026', es: 'Disponible para 2026' },
    cta: { en: 'Book Cami', es: 'Reservar a Cami' },
    langToggleLabel: {
      en: 'Switch site language to Spanish',
      es: 'Cambiar el idioma del sitio a inglés',
    },
  },
  hero: {
    badge: { en: 'Speaker · Life Coach · Spiritual Guide', es: 'Conferencista · Coach de Vida · Guía Espiritual' },
    h1a: { en: 'Transform Your Beliefs.', es: 'Transforma Tus Creencias.' },
    h1bEm: { en: 'Live', es: 'Vive' },
    h1bRest: { en: 'Your Truth.', es: 'Tu Verdad.' },
    sub: {
      en: 'For men and women 25 and up who are done playing small. Through speaking, coaching, and spiritual guidance — Cami meets you where you are and walks with you into who you are becoming.',
      es: 'Para hombres y mujeres de 25 años en adelante que ya no quieren jugar en pequeño. A través de conferencias, coaching y guía espiritual — Cami te encuentra donde estás y camina contigo hacia quien te estás convirtiendo.',
    },
    cta: { en: 'Work with Cami', es: 'Trabaja con Cami' },
  },
  services: {
    kicker: { en: 'How I Can Help', es: 'Cómo Puedo Ayudar' },
    headingPre: { en: 'Three Paths to', es: 'Tres Caminos a la' },
    headingEm: { en: 'Transformation', es: 'Transformación' },
  },
  gallery: {
    kicker: { en: 'Moments', es: 'Momentos' },
    headingPre: { en: 'Cami in', es: 'Cami en' },
    headingEm: { en: 'Action', es: 'Acción' },
    empty: { en: 'More photos coming soon', es: 'Más fotos próximamente' },
  },
  process: {
    kicker: { en: 'The Journey', es: 'El Recorrido' },
    headingPre: { en: 'How the', es: 'Cómo Funciona' },
    headingEm: { en: 'Process', es: 'el Proceso' },
    headingPost: { en: 'Works', es: '' },
  },
  values: {
    kicker: { en: 'What Drives Everything', es: 'Lo Que Impulsa Todo' },
    heading: { en: 'Core Values', es: 'Valores Fundamentales' },
  },
  testimonials: {
    kicker: { en: 'Real Transformations', es: 'Transformaciones Reales' },
    headingPre: { en: 'Words from', es: 'Palabras de' },
    headingEm: { en: "Those Who've Walked This Path", es: 'Quienes Han Recorrido Este Camino' },
    empty: {
      en: 'More testimonials being added — check back soon',
      es: 'Se están agregando más testimonios — vuelve pronto',
    },
    seeMore: { en: 'see more', es: 'ver más' },
    seeLess: { en: 'see less', es: 'ver menos' },
  },
  cta: {
    kicker: { en: 'Ready to Begin?', es: '¿Es Hora de Empezar?' },
    headingPre: { en: 'Your next chapter', es: 'Tu próximo capítulo' },
    headingEm: { en: 'starts here.', es: 'comienza aquí.' },
    body: {
      en: 'Whether you want Cami on your stage, in your corner as a coach, or guiding you through your spiritual growth — the first step is a conversation.',
      es: 'Ya sea que quieras a Cami en tu escenario, en tu esquina como coach, o guiándote en tu crecimiento espiritual — el primer paso es una conversación.',
    },
    link: { en: 'Connect with Cami', es: 'Conecta con Cami' },
  },
  events: {
    // Strings quoted by the spec/stories (heading, free, closed, sold out) are verbatim; kicker,
    // button and ticker label are drafts pending the owner's approval (CMP-029 PR).
    kicker: { en: 'Join Cami', es: 'Acompaña a Cami' },
    heading: { en: 'Upcoming Events', es: 'Próximos eventos' },
    free: { en: 'Free', es: 'Gratis' },
    registrationClosed: { en: 'Registration closed', es: 'Inscripciones cerradas' },
    soldOut: { en: 'Sold out', es: 'Agotado' },
    register: { en: 'Register', es: 'Inscribirme' },
    tickerLabel: { en: 'Upcoming events', es: 'Próximos eventos' },
    logoAlt: { en: 'Lifetools logo', es: 'Logo de Lifetools' },
    // Registration form copy (US-019/US-020, CMP-032). Verbatim from the spec/stories:
    // alreadyRegistered, the placeholder marker, the privacy notice and consent (EVENTS_EMAILS_AND_PRIVACY §3,
    // draft), and the "invalid coupon" / "try again" wording. Every other label is a draft
    // listed in the CMP-032 PR for the owner's approval.
    form: {
      close: { en: 'Close', es: 'Cerrar' },
      closeLabel: { en: 'Close registration form', es: 'Cerrar el formulario de inscripción' },
      summaryDate: { en: 'Date', es: 'Fecha' },
      summaryTime: { en: 'Time', es: 'Hora' },
      summaryPrice: { en: 'Price', es: 'Precio' },
      // SINPE Móvil instructions (BR-E01: placeholder marker while the values are placeholders)
      payTitle: { en: 'Pay with SINPE Móvil', es: 'Paga con SINPE Móvil' },
      payIntro: {
        en: 'Make the transfer first, then attach the screenshot below.',
        es: 'Haz primero la transferencia y luego adjunta la captura abajo.',
      },
      payNumber: { en: 'SINPE Móvil number', es: 'Número SINPE Móvil' },
      payAccount: { en: 'Account name', es: 'Nombre de la cuenta' },
      payAmount: { en: 'Amount to pay', es: 'Monto a pagar' },
      placeholderMarker: { en: 'placeholder / por confirmar', es: 'placeholder / por confirmar' },
      // Fields
      name: { en: 'Participant name', es: 'Nombre del participante' },
      email: { en: 'Email', es: 'Correo electrónico' },
      whatsapp: { en: 'WhatsApp number (with country code)', es: 'Número de WhatsApp (con código de país)' },
      whatsappHint: { en: 'Example: +50688880000', es: 'Ejemplo: +50688880000' },
      file: { en: 'Payment screenshot', es: 'Captura del comprobante de pago' },
      fileHint: {
        en: 'JPEG, PNG, WebP or HEIC image, up to 5 MB.',
        es: 'Imagen JPEG, PNG, WebP o HEIC, hasta 5 MB.',
      },
      fileSelected: { en: 'Selected file', es: 'Archivo seleccionado' },
      // Coupon (US-020)
      coupon: { en: 'Coupon (optional)', es: 'Cupón (opcional)' },
      couponApply: { en: 'Apply', es: 'Aplicar' },
      couponChecking: { en: 'Checking…', es: 'Verificando…' },
      couponRemove: { en: 'Remove coupon', es: 'Quitar cupón' },
      couponApplied: { en: 'Coupon applied', es: 'Cupón aplicado' },
      couponNeedsEmail: {
        en: 'Enter a valid email first: the coupon is checked for your email.',
        es: 'Primero escribe un correo válido: el cupón se verifica para tu correo.',
      },
      couponPending: {
        en: 'Apply the coupon or clear the field.',
        es: 'Aplica el cupón o borra el campo.',
      },
      // Privacy notice (draft, BR-E11) and consent: verbatim from EVENTS_EMAILS_AND_PRIVACY §3
      privacyTitle: { en: 'Privacy notice', es: 'Aviso de privacidad' },
      privacyNotice: {
        en: 'Cami Hernandez (Lifetools, camila@lifetoolscr.com) collects your name, email, WhatsApp number and, when applicable, your payment receipt only to manage your registration for this event and to contact you. Your data is not shared with third parties or used for advertising without your consent. You can request access, correction or deletion of your data by writing to camila@lifetoolscr.com, under Costa Rica’s Law No. 8968.',
        es: 'Cami Hernandez (Lifetools, camila@lifetoolscr.com) recopila tu nombre, correo, número de WhatsApp y, si aplica, el comprobante de pago, únicamente para gestionar tu inscripción a este evento y comunicarse contigo. Tus datos no se comparten con terceros ni se usan para publicidad sin tu consentimiento. Puedes pedir acceso, corrección o eliminación de tus datos escribiendo a camila@lifetoolscr.com, conforme a la Ley N.° 8968 de Costa Rica.',
      },
      consent: {
        en: 'I accept the privacy notice and authorize the use of my data for this registration.',
        es: 'Acepto el aviso de privacidad y autorizo el uso de mis datos para esta inscripción.',
      },
      // Optional second checkbox, never required (contract v1.5, FFR-018)
      contactOptIn: {
        en: "I'd like Cami to contact me about other events and news.",
        es: 'Quiero que Cami me contacte sobre otros eventos y novedades.',
      },
      submit: { en: 'Register', es: 'Inscribirme' },
      submitting: { en: 'Sending…', es: 'Enviando…' },
      sendingNote: {
        en: 'Sending your registration. This can take up to a minute: please keep this window open.',
        es: 'Enviando tu inscripción. Puede tardar hasta un minuto: mantén esta ventana abierta.',
      },
      // Field errors (contract §8 codes, plus client-only name_invalid)
      fieldErrors: {
        required: { en: 'This field is required.', es: 'Este campo es obligatorio.' },
        name_invalid: {
          en: 'Enter a name of 2 to 80 characters.',
          es: 'Escribe un nombre de 2 a 80 caracteres.',
        },
        invalid_email: { en: 'Enter a valid email address.', es: 'Escribe un correo electrónico válido.' },
        invalid_phone: {
          en: 'Use the format +<country code><number>, e.g. +50688880000.',
          es: 'Usa el formato +<código de país><número>, por ejemplo +50688880000.',
        },
        invalid_coupon_format: {
          en: 'The coupon must be 8 to 20 letters and numbers.',
          es: 'El cupón debe tener de 8 a 20 letras y números.',
        },
        invalid_file_type: {
          en: 'The file must be a JPEG, PNG, WebP or HEIC image.',
          es: 'El archivo debe ser una imagen JPEG, PNG, WebP o HEIC.',
        },
        file_too_large: { en: 'The file is over 5 MB.', es: 'El archivo pesa más de 5 MB.' },
        consent_required: {
          en: 'You must accept the privacy notice to register.',
          es: 'Debes aceptar el aviso de privacidad para inscribirte.',
        },
      },
      // Backend error codes (contract §7)
      errors: {
        VALIDATION_ERROR: {
          en: 'Please check the highlighted fields.',
          es: 'Revisa los campos marcados.',
        },
        EVENT_NOT_FOUND: {
          en: 'This event is no longer available.',
          es: 'Este evento ya no está disponible.',
        },
        REGISTRATION_CLOSED: { en: 'Registration closed', es: 'Inscripciones cerradas' },
        SOLD_OUT: { en: 'Sold out', es: 'Agotado' },
        ALREADY_REGISTERED: {
          en: 'You are already registered for this event',
          es: 'Ya existe una inscripción con este correo para este evento',
        },
        COUPON_INVALID: { en: 'Invalid coupon', es: 'Cupón no válido' },
        COUPON_EXHAUSTED: {
          en: 'This coupon has reached its maximum number of uses.',
          es: 'Este cupón alcanzó su máximo de usos.',
        },
        COUPON_ALREADY_USED: {
          en: 'This email has already used this coupon.',
          es: 'Este correo ya usó este cupón.',
        },
        RATE_LIMITED: {
          en: 'Try again in a few minutes.',
          es: 'Inténtalo de nuevo en unos minutos.',
        },
        UPLOAD_CAP_REACHED: {
          en: 'We cannot receive more screenshots right now. Try again later or contact Cami at camila@lifetoolscr.com.',
          es: 'No podemos recibir más capturas por ahora. Inténtalo más tarde o escribe a Cami a camila@lifetoolscr.com.',
        },
        SERVER_ERROR: {
          en: 'Something went wrong. Your data is kept: please try again.',
          es: 'Algo salió mal. Tus datos se conservan: inténtalo de nuevo.',
        },
      },
      // Confirmation (FFR-011, FFR-024)
      doneTitle: { en: 'Registration received', es: 'Inscripción recibida' },
      doneReference: { en: 'Your reference', es: 'Tu referencia' },
      doneBody: {
        en: 'We sent you an email with the details. Cami will confirm your payment.',
        es: 'Te enviamos un correo con los detalles. Cami confirmará tu pago.',
      },
      doneBodyFree: {
        en: 'We sent you an email with the details.',
        es: 'Te enviamos un correo con los detalles.',
      },
      doneFlagged: {
        en: 'Your registration was received, but we need to review it. Cami will contact you.',
        es: 'Recibimos tu inscripción, pero necesitamos revisarla. Cami se pondrá en contacto contigo.',
      },
    },
  },
}
