import { C } from '../constants/colors'
import { UI_TEXT } from '../constants/i18n'
import { useLanguage } from '../context/LanguageContext'

export default function Nav() {
  const { lang, toggleLang } = useLanguage()
  const isEs = lang === 'es'
  const t = UI_TEXT.nav

  return (
    <nav
      className="nav-pad"
      style={{
        padding: '24px 56px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16,
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* Logo / wordmark */}
      <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em', color: C.navy }}>
        Cami{' '}
        <span
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontWeight: 600,
            color: C.rose,
            fontSize: 22,
          }}
        >
          Hernandez
        </span>
      </div>

      {/* Availability badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: C.rose,
            animation: 'dot-pulse 2.2s ease-in-out infinite',
          }}
        />
        <span
          style={{
            fontSize: 10,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: C.navyLight,
            fontWeight: 700,
          }}
        >
          {t.badge[lang]}
        </span>
      </div>

      {/* Language toggle + CTA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <div
          onClick={toggleLang}
          role="switch"
          aria-checked={isEs}
          aria-label={t.langToggleLabel[lang]}
          tabIndex={0}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) {
              e.preventDefault()
              toggleLang()
            }
          }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', color: isEs ? 'rgba(15,25,40,0.32)' : C.rose }}>
            EN
          </span>
          <span
            style={{
              position: 'relative', width: 36, height: 20, borderRadius: 100,
              background: 'rgba(15,25,40,0.08)', border: `1px solid ${C.rose}`,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                position: 'absolute', top: 1.5, left: isEs ? 17 : 1.5, width: 15, height: 15,
                borderRadius: '50%', background: C.rose, transition: 'left 0.18s ease',
              }}
            />
          </span>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', color: isEs ? C.rose : 'rgba(15,25,40,0.32)' }}>
            ES
          </span>
        </div>

        <a href="#contact" className="cta-btn cta-btn-sm">
          {t.cta[lang]}
        </a>
      </div>
    </nav>
  )
}
