import { useState } from 'react'
import { C } from '../constants/colors'
import { STATS } from '../constants/data'

export default function Hero({ r }) {
  const [heroImgError, setHeroImgError] = useState(false)

  return (
    <section
      className="section-pad"
      style={{ padding: '48px 56px 80px', position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto' }}
    >
      {/* Diagonal stripe */}
      <div
        style={{
          position: 'absolute',
          top: 0, right: '28%', bottom: 0, left: 0,
          background: 'linear-gradient(165deg, transparent 40%, rgba(201,164,171,0.07) 70%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      <div className="hero-flex" style={{ display: 'flex', gap: 64, alignItems: 'center' }}>
        {/* ── Copy ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Badge */}
          <div
            {...r('hero-badge')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              border: `1.5px solid ${C.roseLight}`, borderRadius: 100,
              padding: '6px 16px', marginBottom: 32,
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.rose }} />
            <span style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.navyLight, fontWeight: 700 }}>
              Speaker · Life Coach · Spiritual Guide
            </span>
          </div>

          {/* Headline */}
          <h1 {...r('hero-h1a', 60)} className="hero-h1" style={{ fontWeight: 900, fontSize: 50, lineHeight: 1.06, letterSpacing: '-0.035em', color: C.navy, marginBottom: 4 }}>
            Transform Your Beliefs.
          </h1>
          <h1 {...r('hero-h1b', 110)} style={{ fontWeight: 900, fontSize: 50, lineHeight: 1.06, letterSpacing: '-0.035em', marginBottom: 28, color: C.navy }}>
            <span
              className="hero-h1-em"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 600, fontSize: 60, color: C.rose }}
            >
              Live
            </span>{' '}
            Your Truth.
          </h1>

          {/* Sub */}
          <p {...r('hero-sub', 150)} style={{ fontSize: 16, lineHeight: 1.75, color: C.navyLight, maxWidth: 500, marginBottom: 36 }}>
            For men and women 25 and up who are done playing small. Through speaking, coaching,
            and spiritual guidance — Cami meets you where you are and walks with you into who you
            are becoming.
          </p>

          {/* CTA row */}
          <div {...r('hero-cta', 190)} style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
            <a href="#contact" className="cta-btn">Work with Cami</a>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 16, color: C.rose }}>
              Disciplina hoy, libertad mañana.
            </span>
          </div>
        </div>

        {/* ── Hero image ── */}
        <div {...r('hero-img', 80)} style={{ flex: '0 0 360px', maxWidth: '100%' }}>
          <div
            style={{
              height: 460, borderRadius: 20, overflow: 'hidden', position: 'relative',
              background: `linear-gradient(155deg, ${C.roseLight} 0%, ${C.navyLight} 55%, ${C.navy} 100%)`,
            }}
          >
            <div
              style={{
                position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)',
                width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.06)',
              }}
            />
            {!heroImgError && (
              <img
                src="/images/cami-hero.jpg"
                alt="Cami Hernandez"
                width={1200}
                height={799}
                onError={() => setHeroImgError(true)}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}
            <div
              style={{
                position: 'absolute', bottom: 20, left: 20, right: 20,
                background: 'rgba(255,255,255,0.13)', backdropFilter: 'blur(10px)',
                borderRadius: 10, padding: '14px 18px',
                border: '1px solid rgba(255,255,255,0.18)',
              }}
            >
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 14, color: 'rgba(255,255,255,0.88)', lineHeight: 1.5 }}>
                "Tu mejor versión empieza aquí."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div
        {...r('hero-stats', 220)}
        className="stats-grid"
        style={{
          display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
          gap: 1, background: C.roseLight, borderRadius: 18, overflow: 'hidden', marginTop: 64,
        }}
      >
        {STATS.map((s, i) => (
          <div key={i} style={{ background: C.bg, padding: '28px 20px', textAlign: 'center' }}>
            <div style={{ fontWeight: 900, fontSize: 34, color: C.navy, letterSpacing: '-0.03em' }}>{s.num}</div>
            <div style={{ fontSize: 11, letterSpacing: '0.13em', textTransform: 'uppercase', color: C.navyLight, marginTop: 5 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
