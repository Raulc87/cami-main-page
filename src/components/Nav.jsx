import { C } from '../constants/colors'

export default function Nav() {
  return (
    <nav
      className="nav-pad"
      style={{
        padding: '24px 56px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
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
          Available for 2026
        </span>
      </div>

      {/* CTA */}
      <a href="#contact" className="cta-btn cta-btn-sm">
        Book Cami
      </a>
    </nav>
  )
}
