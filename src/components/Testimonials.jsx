import { useState } from 'react'
import { C } from '../constants/colors'
import { TESTIMONIALS } from '../constants/data'
import { UI_TEXT } from '../constants/i18n'
import { useLanguage } from '../context/LanguageContext'

const featured = TESTIMONIALS.find((t) => t.featured)
const grid = TESTIMONIALS.filter((t) => !t.featured)

// Given a testimonial and the active language, resolves the short quote,
// the long quote (if any), and which one to display for the current
// expand state. Falls back to the English long quote when a Spanish long
// quote is missing, and to the short quote when there's no long quote at
// all — the see more/less control only renders when `hasLong` is true.
function resolveQuote(item, isEs, expanded) {
  const short = isEs ? item?.quoteEs || item?.quote : item?.quote
  const long = isEs ? item?.quoteLongEs || item?.quoteLong : item?.quoteLong
  return { text: expanded && long ? long : short, hasLong: Boolean(long) }
}

// Shared see more/see less link for a testimonial's long-quote toggle.
// `size` distinguishes the larger featured-card treatment from the
// smaller grid-card one.
function SeeMoreButton({ expanded, onClick, lang, size = 'grid' }) {
  const t = UI_TEXT.testimonials
  const isFeatured = size === 'featured'
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={expanded}
      style={{
        background: 'none', border: 'none', padding: 0,
        marginBottom: isFeatured ? 28 : 18,
        fontSize: isFeatured ? 12 : 11,
        fontWeight: 700, letterSpacing: '0.04em', color: C.rose,
        cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3,
      }}
    >
      {expanded ? t.seeLess[lang] : t.seeMore[lang]}
    </button>
  )
}

export default function Testimonials({ r }) {
  const [expandedFeatured, setExpandedFeatured] = useState(false)
  const [expandedGrid, setExpandedGrid] = useState(() => new Set())
  const [failedImages, setFailedImages] = useState(() => new Set())
  const { lang } = useLanguage()
  const isEs = lang === 'es'
  const t = UI_TEXT.testimonials

  const { text: featuredQuote, hasLong: featuredHasLong } = resolveQuote(featured, isEs, expandedFeatured)

  const toggleGridExpanded = (i) => {
    setExpandedGrid((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

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

              {featuredHasLong && (
                <SeeMoreButton
                  expanded={expandedFeatured}
                  onClick={() => setExpandedFeatured((e) => !e)}
                  lang={lang}
                  size="featured"
                />
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
                  {featured.role && (
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 3 }}>{featured.role}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="tests-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18, alignItems: 'start' }}>
          {grid.map((item, i) => {
            const isExpanded = expandedGrid.has(i)
            const { text: itemQuote, hasLong: itemHasLong } = resolveQuote(item, isEs, isExpanded)
            return (
              <div key={i} {...r(`test-${i}`, i * 80)} className="test-small">
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 15, lineHeight: 1.75, color: C.navyLight, marginBottom: itemHasLong ? 10 : 22, whiteSpace: 'pre-line' }}>
                  "{itemQuote}"
                </p>

                {itemHasLong && (
                  <SeeMoreButton
                    expanded={isExpanded}
                    onClick={() => toggleGridExpanded(i)}
                    lang={lang}
                  />
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {item.image && !failedImages.has(item.image) ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      onError={() => setFailedImages((prev) => new Set(prev).add(item.image))}
                      style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, background: `linear-gradient(135deg, ${C.roseLight}, ${C.navyLight})` }} />
                  )}
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: C.navy }}>{item.name}</div>
                    {item.role && (
                      <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{item.role}</div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
