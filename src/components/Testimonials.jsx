import { useState } from 'react'
import { C } from '../constants/colors'
import { TESTIMONIALS } from '../constants/data'

const featured = TESTIMONIALS.find((t) => t.featured)
const grid = TESTIMONIALS.filter((t) => !t.featured)

export default function Testimonials({ r }) {
  const [lang, setLang] = useState('en')
  const [expanded, setExpanded] = useState(false)
  const [failedImages, setFailedImages] = useState(() => new Set())

  const bilingual = Boolean(featured?.quoteEs)
  const isEs = lang === 'es'
  const featuredQuote = bilingual
    ? (isEs
        ? (expanded ? featured.quoteLongEs || featured.quoteEs : featured.quoteEs)
        : (expanded ? featured.quoteLong || featured.quote : featured.quote))
    : featured?.quote
  const seeMoreLabel = isEs
    ? (expanded ? 'ver menos' : 'ver más')
    : (expanded ? 'see less' : 'see more')

  return (
    <section className="section-pad" style={{ padding: '80px 56px', background: C.bg, position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Heading */}
        <div {...r('test-hd')} style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.rose, fontWeight: 700, marginBottom: 12 }}>
            Real Transformations
          </div>
          <h2 style={{ fontWeight: 900, fontSize: 36, letterSpacing: '-0.03em', color: C.navy, marginBottom: 14 }}>
            Words from{' '}
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 600, color: C.rose }}>
              Those Who've Walked This Path
            </span>
          </h2>
          <div style={{ display: 'inline-block', background: C.roseLight, borderRadius: 8, padding: '7px 16px', fontSize: 12, color: C.navyLight, fontStyle: 'italic' }}>
            More testimonials being added — check back soon
          </div>
        </div>

        {/* Featured */}
        {featured && (
          <div
            {...r('test-feat')}
            style={{
              background: C.navy, borderRadius: 18, padding: '48px 52px',
              position: 'relative', overflow: 'hidden', marginBottom: 22,
            }}
          >
            {/* Decorative quote mark */}
            <div
              style={{
                position: 'absolute', top: 16, left: 36, fontSize: 140, lineHeight: 1,
                color: 'rgba(201,164,171,0.10)',
                fontFamily: "'Cormorant Garamond', serif",
                pointerEvents: 'none', userSelect: 'none',
              }}
            >"</div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 22, lineHeight: 1.65, color: 'rgba(255,255,255,0.90)', marginBottom: 12, maxWidth: 680, whiteSpace: 'pre-line' }}>
                "{featuredQuote}"
              </p>

              {bilingual && (
                <button
                  type="button"
                  onClick={() => setExpanded((e) => !e)}
                  style={{
                    background: 'none', border: 'none', padding: 0, marginBottom: 28,
                    fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', color: C.rose,
                    cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3,
                  }}
                >
                  {seeMoreLabel}
                </button>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  {featured.image && !failedImages.has(featured.image) ? (
                    <img
                      src={featured.image}
                      alt={featured.name}
                      onError={() => setFailedImages((prev) => new Set(prev).add(featured.image))}
                      style={{ width: 46, height: 46, borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ width: 46, height: 46, borderRadius: '50%', background: `linear-gradient(135deg, ${C.rose}, ${C.roseLight})` }} />
                  )}
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: C.white }}>{featured.name}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 3 }}>{featured.role}</div>
                  </div>
                </div>

                {bilingual && (
                  <div
                    onClick={() => setLang((l) => (l === 'en' ? 'es' : 'en'))}
                    role="switch"
                    aria-checked={isEs}
                    aria-label="Toggle testimonial language between English and Spanish"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) {
                        e.preventDefault()
                        setLang((l) => (l === 'en' ? 'es' : 'en'))
                      }
                    }}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                      userSelect: 'none',
                    }}
                  >
                    <span style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700, color: isEs ? 'rgba(255,255,255,0.35)' : C.rose }}>
                      English Version
                    </span>
                    <span
                      style={{
                        position: 'relative', width: 40, height: 22, borderRadius: 100,
                        background: 'rgba(255,255,255,0.18)', border: `1px solid ${C.rose}`,
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute', top: 2, left: isEs ? 20 : 2, width: 16, height: 16,
                          borderRadius: '50%', background: C.rose, transition: 'left 0.18s ease',
                        }}
                      />
                    </span>
                    <span style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700, color: isEs ? C.rose : 'rgba(255,255,255,0.35)' }}>
                      Spanish Version
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="tests-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
          {grid.map((t, i) => (
            <div key={i} {...r(`test-${i}`, i * 80)} className="test-small">
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 15, lineHeight: 1.75, color: C.navyLight, marginBottom: 22 }}>
                "{t.quote}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {t.image && !failedImages.has(t.image) ? (
                  <img
                    src={t.image}
                    alt={t.name}
                    onError={() => setFailedImages((prev) => new Set(prev).add(t.image))}
                    style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, background: `linear-gradient(135deg, ${C.roseLight}, ${C.navyLight})` }} />
                )}
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: C.navy }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
