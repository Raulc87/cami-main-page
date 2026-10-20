import { UI_TEXT } from '../constants/i18n'
import { useLanguage } from '../context/LanguageContext'
import { cardId, formatEventDate } from './Events'

const TICKER_EVENTS = 2 // FFR-005: N closest events
const SET_REPEATS = 4 // copies of the item set per track, so one track is wider than the bar
const TRACKS = 2 // identical tracks side by side: each moves one full width, so the loop is seamless

function goToCard(eventCode) {
  const card = document.getElementById(cardId(eventCode))
  if (!card) return
  card.scrollIntoView({ behavior: 'smooth', block: 'center' })
  card.querySelector('button:not([disabled])')?.focus({ preventScroll: true })
}

// No `r()` scroll-reveal: mounts after useReveal has scanned the page (ARCHITECTURE_SPEC §7).
export default function EventsTicker({ events }) {
  const { lang } = useLanguage()
  const t = UI_TEXT.events
  const items = events.slice(0, TICKER_EVENTS)

  return (
    <div className="evt-ticker" role="region" aria-label={t.tickerLabel[lang]}>
      {Array.from({ length: TRACKS }, (_, track) => (
        <div
          key={track}
          className={track === 0 ? 'evt-ticker-track' : 'evt-ticker-track evt-ticker-dup'}
          aria-hidden={track === 0 ? undefined : true}
        >
          {Array.from({ length: SET_REPEATS }, (_, rep) =>
            items.map((ev) => {
              const primary = track === 0 && rep === 0
              return (
                <span key={`${rep}-${ev.eventCode}`} style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <button
                    type="button"
                    className={primary ? 'evt-ticker-item' : 'evt-ticker-item evt-ticker-item-copy'}
                    tabIndex={primary ? 0 : -1}
                    onClick={() => goToCard(ev.eventCode)}
                  >
                    {ev.name} · {formatEventDate(ev.date, lang)}
                  </button>
                  <span className="evt-ticker-dot" aria-hidden="true" />
                </span>
              )
            }),
          )}
        </div>
      ))}
    </div>
  )
}
