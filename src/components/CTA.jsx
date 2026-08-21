import { C } from '../constants/colors'
import { UI_TEXT } from '../constants/i18n'
import { useLanguage } from '../context/LanguageContext'

export default function CTA({ r }) {
  const { lang } = useLanguage()
  const t = UI_TEXT.cta

  return (
    <section
      id="contact"
      className="section-pad"
      style={{ padding: '100px 56px', background: C.white, textAlign: 'center', position: 'relative', zIndex: 1, overflow: 'hidden' }}
    >
      {/* Soft glow from above */}
      <div
        style={{
          position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)',
          width: 500, height: 200, borderRadius: '50%',
          background: 'rgba(201,164,171,0.07)', pointerEvents: 'none',
        }}
      />

      <div {...r('cta-sec')} style={{ maxWidth: 640, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.rose, fontWeight: 700, marginBottom: 20 }}>
          {t.kicker[lang]}
        </div>
        <h2
          style={{ fontWeight: 900, fontSize: 44, letterSpacing: '-0.035em', color: C.navy, marginBottom: 20, lineHeight: 1.08 }}
        >
          {t.headingPre[lang]}{' '}
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 600, fontSize: 52, color: C.rose }}>
            {t.headingEm[lang]}
          </span>
        </h2>
        <p style={{ fontSize: 16, lineHeight: 1.75, color: C.navyLight, marginBottom: 44 }}>
          {t.body[lang]}
        </p>
        <a href="mailto:camila@lifetoolscr.com" className="cta-btn">
          {t.link[lang]}
        </a>
        <div style={{ marginTop: 20, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: C.textMuted }}>
          camila@lifetoolscr.com
        </div>
      </div>
    </section>
  )
}
