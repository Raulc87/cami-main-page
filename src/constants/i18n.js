// ── UI copy translations (EN/ES) ────────────────────────────────────────────
// Source of truth for the translatable headline/CTA/nav/kicker copy driven by
// the global language toggle (see src/context/LanguageContext.jsx). Footer
// has no entries here — its visible copy (wordmark, brand words, URL) is
// never translated, see the note below.
// List content (services, steps, testimonials, stats) keeps its own `*Es`
// fields in src/constants/data.jsx instead of living here — see
// docs/specs/03-content-model.md.
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
}
