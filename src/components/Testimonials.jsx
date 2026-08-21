import { useState } from 'react'
import { C } from '../constants/colors'
import { TESTIMONIALS } from '../constants/data'
import { UI_TEXT } from '../constants/i18n'
import { useLanguage } from '../context/LanguageContext'

const featured = TESTIMONIALS.find((t) => t.featured)
const grid = TESTIMONIALS.filter((t) => !t.featured)

export default function Testimonials({ r }) {
  const [expanded, setExpanded] = useState(false)
  const [failedImages, setFailedImages] = useState(() => new Set())
  const { lang } = useLanguage()
  const isEs = lang === 'es'
  const t = UI_TEXT.testimonials

  const shortQuote = isEs ? featured?.quoteEs || featured?.quote : featured?.quote
  const longQuote = isEs ? featured?.quoteLongEs || featured?.quoteLong : featured?.quoteLong
  const featuredQuote = expanded ? longQuote || shortQuote : shortQuote
  const hasLongQuote = Boolean(featured?.quoteLong || featured?.quoteLongEs)
  const seeMoreLabel = expanded ? t.seeLess[lang] : t.seeMore[lang]

  return (
    <section className="section-pad" style={{ padding: '80px 56px', background: C.bg, position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Heading */}
        <div {...r('test-hd')} style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.rose, fontWeight: 700, marginBottom: 12 }}>
            {t.kicker[lang]}
          </div>
          <h2 style={{ fontWeight: 900, fontSize: 36, letterSpacing: '-0.03em', color: C.navy, marginBottom: 14 }}>
            {t.headingPre[lang]}{' '}
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 600, color: C.rose }}>
              {t.headingEm[lang]}
            </span>
          </h2>
          <div style={{ display: 'inline-block', background: C.roseLight, borderRadius: 8, padding: '7px 16px', fontSize: 12, color: C.navyLight, fontStyle: 'italic' }}>
            {t.empty[lang]}
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

              {hasLongQuote && (
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
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="tests-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
          {grid.map((item, i) => (
            <div key={i} {...r(`test-${i}`, i * 80)} className="test-small">
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 15, lineHeight: 1.75, color: C.navyLight, marginBottom: 22 }}>
                "{isEs ? item.quoteEs || item.quote : item.quote}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {item.image && !failedImages.has(item.image) ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={() => setFailedImages((prev) => new Set(prev).add(item.image))}
                    style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, background: `linear-gradient(135deg, ${C.roseLight}, ${C.navyLight})` }} />
                )}
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: C.navy }}>{item.name}</div>
                  <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{item.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
