import { useCallback, useRef, useState } from 'react'
import { C } from '../constants/colors'
import { UI_TEXT } from '../constants/i18n'
import { useLanguage } from '../context/LanguageContext'
import EventRegistration from './EventRegistration'
import { cardId, formatEventDate } from './eventsShared'

const LOGO = '/images/lifetools-logo.svg'

// No `r()` scroll-reveal here: the section mounts after useReveal has scanned the page
// (ARCHITECTURE_SPEC §7).
export default function Events({ events, sinpe, onRefetch }) {
  const { lang } = useLanguage()
  const t = UI_TEXT.events
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [imgFailed, setImgFailed] = useState({})
  const triggerRef = useRef(null)

  // The open form follows `events` (a language refetch updates its event), and keeps the event
  // it was opened with when a refetch no longer lists it, so the visitor can read its message
  // until onClose.
  const selected = selectedEvent
    && (events.find((ev) => ev.eventCode === selectedEvent.eventCode) ?? selectedEvent)

  const open = (ev, e) => {
    triggerRef.current = e.currentTarget
    setSelectedEvent(ev)
  }
  // Stable identity: a new function on every render would re-run effects in the form that
  // depend on onClose (and steal focus). onStale (`onRefetch`) is stable too, from useEvents.
  const close = useCallback(() => {
    setSelectedEvent(null)
    // Back to the card's button; when a refetch removed that card or disabled its button
    // (closed or sold out), to the section instead (UX_UI_DIRECTION §13).
    const trigger = triggerRef.current
    if (trigger?.isConnected && !trigger.disabled) trigger.focus()
    else document.getElementById('events')?.focus()
  }, [])

  // After a refetch with no events the section goes away, but an open form stays (see above).
  return (
    <>
      {events.length > 0 && (
        <section
          id="events"
          className="section-pad"
          tabIndex={-1}
          style={{ padding: '80px 56px', background: C.bg, position: 'relative', zIndex: 1, outline: 'none' }}
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
                  <article key={ev.eventCode} id={cardId(ev.eventCode)} className="evt-card" tabIndex={-1}>
                    <img
                      className={hasImage ? 'evt-card-img' : 'evt-card-img evt-card-img-logo'}
                      src={hasImage ? ev.imageUrl : LOGO}
                      // The art is decorative: the event name is the card's heading.
                      alt={hasImage ? '' : t.logoAlt[lang]}
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
        </section>
      )}
      {selected && (
        <EventRegistration event={selected} sinpe={sinpe} onClose={close} onStale={onRefetch} />
      )}
    </>
  )
}
