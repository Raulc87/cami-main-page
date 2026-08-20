import { C } from '../constants/colors'

export default function CTA({ r }) {
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
          Ready to Begin?
        </div>
        <h2
          style={{ fontWeight: 900, fontSize: 44, letterSpacing: '-0.035em', color: C.navy, marginBottom: 20, lineHeight: 1.08 }}
        >
          Your next chapter{' '}
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 600, fontSize: 52, color: C.rose }}>
            starts here.
          </span>
        </h2>
        <p style={{ fontSize: 16, lineHeight: 1.75, color: C.navyLight, marginBottom: 44 }}>
          Whether you want Cami on your stage, in your corner as a coach, or guiding you through
          your spiritual growth — the first step is a conversation.
        </p>
        <a href="mailto:contact@camihernandez.com" className="cta-btn">
          Connect with Cami
        </a>
        <div style={{ marginTop: 20, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: C.textMuted }}>
          contact@camihernandez.com
        </div>
      </div>
    </section>
  )
}
