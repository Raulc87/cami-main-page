import { useRef, useState } from 'react'
import { C } from '../constants/colors'
import { UI_TEXT } from '../constants/i18n'
import { useLanguage } from '../context/LanguageContext'
import EventRegistration from './EventRegistration'

const LOGO = '/images/lifetools-logo.svg'

export function formatEventDate(date, lang) {
  const [y, m, d] = date.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString(lang === 'es' ? 'es-CR' : 'en-US', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export function cardId(eventCode) {
  return `evt-${eventCode}`
}

// No `r()` scroll-reveal here: the section mounts after useReveal has scanned the page
// (ARCHITECTURE_SPEC §7).
export default function Events({ events, sinpe }) {
  const { lang } = useLanguage()
  const t = UI_TEXT.events
  const [selected, setSelected] = useState(null)
  const [imgFailed, setImgFailed] = useState({})
  const triggerRef = useRef(null)

  const open = (ev, e) => {
    triggerRef.current = e.currentTarget
    setSelected(ev)
  }
  const close = () => {
    setSelected(null)
    triggerRef.current?.focus()
  }

  return (
    <section
      id="events"
      className="section-pad"
      style={{ padding: '80px 56px', background: C.bg, position: 'relative', zIndex: 1 }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ marginBottom: 52 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.rose, fontWeight: 700, marginBottom: 12 }}>
            {t.kicker[lang]}
          </div>
          <h2 style={{ fontWeight: 900, fontSize: 36, letterSpacing: '-0.03em', color: C.navy }}>
            {t.heading[lang]}
          </h2>
        </div>

        <div className="evt-grid">
          {events.map((ev) => {
            const hasImage = ev.imageUrl && !imgFailed[ev.eventCode]
            const disabled = !ev.registrationOpen || ev.soldOut
            const status = ev.soldOut ? t.soldOut[lang] : !ev.registrationOpen ? t.registrationClosed[lang] : null
            const price = ev.priceCrc === 0
              ? t.free[lang]
              : `₡${ev.priceCrc.toLocaleString(lang === 'es' ? 'es-CR' : 'en-US')}`
            return (
              <article key={ev.eventCode} id={cardId(ev.eventCode)} className="evt-card">
                <img
                  className={hasImage ? 'evt-card-img' : 'evt-card-img evt-card-img-logo'}
                  src={hasImage ? ev.imageUrl : LOGO}
                  alt={hasImage ? ev.name : t.logoAlt[lang]}
                  onError={hasImage ? () => setImgFailed((f) => ({ ...f, [ev.eventCode]: true })) : undefined}
                />
                <div className="evt-card-body">
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.textMuted, marginBottom: 10 }}>
                    {formatEventDate(ev.date, lang)} · {ev.time}
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: 19, color: C.navy, marginBottom: 10 }}>{ev.name}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.75, color: C.navyLight, marginBottom: 18, flex: 1 }}>{ev.description}</p>
                  <span className="evt-price" style={{ marginBottom: 18 }}>{price}</span>
                  {status && <div className="evt-status" style={{ marginBottom: 10 }}>{status}</div>}
                  <button
                    type="button"
                    className="cta-btn cta-btn-sm"
                    disabled={disabled}
                    onClick={(e) => open(ev, e)}
                  >
                    {t.register[lang]}
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </div>

      {selected && <EventRegistration event={selected} sinpe={sinpe} onClose={close} />}
    </section>
  )
}
