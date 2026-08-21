import { C } from '../constants/colors'
import { STEPS } from '../constants/data'
import { UI_TEXT } from '../constants/i18n'
import { useLanguage } from '../context/LanguageContext'

export default function Process({ r }) {
  const { lang } = useLanguage()
  const isEs = lang === 'es'
  const t = UI_TEXT.process

  return (
    <section className="section-pad" style={{ padding: '80px 56px', background: C.white, position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Heading */}
        <div {...r('proc-hd')} style={{ marginBottom: 60 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.rose, fontWeight: 700, marginBottom: 12 }}>
            {t.kicker[lang]}
          </div>
          <h2 style={{ fontWeight: 900, fontSize: 36, letterSpacing: '-0.03em', color: C.navy }}>
            {t.headingPre[lang]}{' '}
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 600, color: C.rose }}>
              {t.headingEm[lang]}
            </span>
            {t.headingPost[lang] && <>{' '}{t.headingPost[lang]}</>}
          </h2>
        </div>

        {/* Steps */}
        <div className="steps-flex" style={{ display: 'flex', gap: 0, position: 'relative' }}>
          {/* Connector line */}
          <div
            style={{
              position: 'absolute', top: 38, left: '10%', right: '10%', height: 1,
              background: `linear-gradient(to right, transparent, ${C.roseLight} 30%, ${C.roseLight} 70%, transparent)`,
            }}
          />

          {STEPS.map((step, i) => (
            <div key={i} {...r(`step-${i}`, i * 100)} style={{ flex: 1, padding: '0 32px', textAlign: 'center' }}>
              <div
                className="step-circle"
                style={{
                  background: step.featured ? C.navy : C.white,
                  border: `2px solid ${step.featured ? C.navy : C.roseLight}`,
                  color: step.featured ? C.white : C.navy,
                }}
              >
                {step.num}
              </div>
              <h3 style={{ fontWeight: 700, fontSize: 19, color: C.navy, marginBottom: 10 }}>{isEs ? step.titleEs || step.title : step.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.75, color: C.navyLight }}>{isEs ? step.descEs || step.desc : step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
