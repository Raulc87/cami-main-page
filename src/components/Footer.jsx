import { C } from '../constants/colors'

const WORDS = ['Elegancia', 'Calma', 'Equilibrio', 'Feminidad']

export default function Footer() {
  return (
    <footer
      style={{
        padding: '28px 56px',
        background: C.navy,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16,
      }}
    >
      {/* Wordmark */}
      <div style={{ fontWeight: 800, fontSize: 16, color: C.white }}>
        Cami{' '}
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 600, color: C.rose, fontSize: 20 }}>
          Hernandez
        </span>
      </div>

      {/* Brand words */}
      <div style={{ display: 'flex', gap: 20 }}>
        {WORDS.map((w) => (
          <span key={w} style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)' }}>
            {w}
          </span>
        ))}
      </div>

      {/* URL */}
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.30)' }}>
        camihernandez.com
      </div>
    </footer>
  )
}
