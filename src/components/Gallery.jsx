import { useState } from 'react'
import { C } from '../constants/colors'
import { UI_TEXT } from '../constants/i18n'
import { useLanguage } from '../context/LanguageContext'

// ─────────────────────────────────────────────────────────────────────────────
// Gallery — image placeholders
// To replace a slot with a real photo:
//   1. Put the image in /public/images/
//   2. Add an `image: '/images/your-photo.jpg'` field to that slot below
// ─────────────────────────────────────────────────────────────────────────────

const SLOTS = [
  { label: 'On Stage',          labelEs: 'En el Escenario',   bg: `linear-gradient(155deg, ${C.navyLight} 0%, ${C.navy} 100%)`,      tall: true,  image: '/images/on-stage.jpg' },
  { label: 'Workshop',          labelEs: 'Taller',            bg: `linear-gradient(145deg, ${C.roseLight} 0%, ${C.rose} 100%)`,      tall: false, image: '/images/workshop.jpg' },
  { label: '1-on-1 Session',    labelEs: 'Sesión Individual', bg: `linear-gradient(145deg, ${C.cream} 0%, ${C.roseLight} 100%)`,     tall: false, image: '/images/one-on-one-session.jpg' },
  { label: 'Community',         labelEs: 'Comunidad',         bg: `linear-gradient(145deg, ${C.navyLight} 0%, ${C.navyMid} 100%)`,   tall: false, image: '/images/community.jpg' },
  { label: 'Behind the Scenes', labelEs: 'Detrás de Cámaras', bg: `linear-gradient(145deg, ${C.roseLight} 0%, ${C.navyLight} 100%)`, tall: false, image: '/images/behind-the-scenes.jpg' },
]

export default function Gallery({ r }) {
  const [failedImages, setFailedImages] = useState(() => new Set())
  const { lang } = useLanguage()
  const isEs = lang === 'es'
  const t = UI_TEXT.gallery

  return (
    <section className="section-pad" style={{ padding: '80px 56px', background: C.bg, position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Heading */}
        <div
          {...r('gal-hd')}
          style={{ marginBottom: 36, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}
        >
          <div>
            <div style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.rose, fontWeight: 700, marginBottom: 10 }}>
              {t.kicker[lang]}
            </div>
            <h2 style={{ fontWeight: 900, fontSize: 36, letterSpacing: '-0.03em', color: C.navy }}>
              {t.headingPre[lang]}{' '}
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 600, color: C.rose }}>
                {t.headingEm[lang]}
              </span>
            </h2>
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.textMuted, paddingBottom: 4 }}>
            {t.empty[lang]}
          </span>
        </div>

        {/* Grid */}
        <div
          {...r('gal', 60)}
          className="gallery-grid"
          style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gridTemplateRows: '220px 220px', gap: 14 }}
        >
          {SLOTS.map((slot, i) => (
            <div
              key={i}
              className={slot.tall ? 'gallery-tall' : ''}
              style={{
                borderRadius: 14, overflow: 'hidden', position: 'relative',
                background: slot.bg,
                ...(slot.tall ? { gridRow: '1 / 3' } : {}),
              }}
            >
              {slot.image && !failedImages.has(slot.image) ? (
                <img
                  src={slot.image}
                  alt={isEs ? slot.labelEs || slot.label : slot.label}
                  loading="lazy"
                  onError={() => setFailedImages((prev) => new Set(prev).add(slot.image))}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.30)', letterSpacing: '0.10em' }}>
                    [ {isEs ? slot.labelEs || slot.label : slot.label} ]
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
