import { C } from '../constants/colors'
import { SERVICES } from '../constants/data'
import { UI_TEXT } from '../constants/i18n'
import { useLanguage } from '../context/LanguageContext'

export default function Services({ r }) {
  const { lang } = useLanguage()
  const isEs = lang === 'es'
  const t = UI_TEXT.services

  return (
    <section className="section-pad" style={{ padding: '80px 56px', background: C.white, position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Heading */}
        <div {...r('svc-hd')} style={{ marginBottom: 52 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.rose, fontWeight: 700, marginBottom: 12 }}>
            {t.kicker[lang]}
          </div>
          <h2 style={{ fontWeight: 900, fontSize: 36, letterSpacing: '-0.03em', color: C.navy }}>
            {t.headingPre[lang]}{' '}
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 600, color: C.rose }}>
              {t.headingEm[lang]}
            </span>
          </h2>
        </div>

        {/* Cards */}
        <div className="svc-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22 }}>
          {SERVICES.map((s, i) => (
            <div key={i} {...r(`svc-${i}`, i * 80)} className="svc-card">
              {/* Icon */}
              <div
                style={{
                  width: 46, height: 46, borderRadius: 12,
                  background: `linear-gradient(135deg, ${C.roseLight}, rgba(201,164,171,0.25))`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: C.navy, marginBottom: 20,
                }}
              >
                {s.icon}
              </div>

              <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.rose, fontWeight: 700, marginBottom: 10 }}>
                {isEs ? s.labelEs || s.label : s.label}
              </div>
              <h3 style={{ fontWeight: 700, fontSize: 19, color: C.navy, marginBottom: 12 }}>{isEs ? s.titleEs || s.title : s.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.75, color: C.navyLight, marginBottom: 20 }}>{isEs ? s.descEs || s.desc : s.desc}</p>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.textMuted }}>{isEs ? s.noteEs || s.note : s.note}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
