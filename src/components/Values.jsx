import { C } from '../constants/colors'
import { VALUES } from '../constants/data'
import { UI_TEXT } from '../constants/i18n'
import { useLanguage } from '../context/LanguageContext'

export default function Values({ r }) {
  const { lang } = useLanguage()
  const t = UI_TEXT.values

  return (
    <section
      className="section-pad"
      style={{ padding: '72px 56px', background: C.navy, position: 'relative', zIndex: 1, overflow: 'hidden' }}
    >
      {/* Subtle orb */}
      <div
        style={{
          position: 'absolute', top: -60, right: -40, width: 280, height: 280,
          borderRadius: '50%', background: 'rgba(201,164,171,0.07)', pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Heading */}
        <div {...r('val-hd')} style={{ textAlign: 'center', marginBottom: 44 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.rose, fontWeight: 700, marginBottom: 12 }}>
            {t.kicker[lang]}
          </div>
          <h2 style={{ fontWeight: 900, fontSize: 32, letterSpacing: '-0.025em', color: C.white }}>{t.heading[lang]}</h2>
        </div>

        {/* Chips */}
        <div className="vals-flex" style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
          {VALUES.map((v, i) => (
            <div key={i} {...r(`val-${i}`, i * 70)} className="val-chip" style={{ color: C.roseLight }}>
              <span style={{ color: C.rose }}>{v.icon}</span>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 20, fontWeight: 600, lineHeight: 1.1 }}>
                  {v.es}
                </div>
                <div
                  className="val-chip-sub"
                  style={{ fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginTop: 2, transition: 'color 0.22s' }}
                >
                  {v.en}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
