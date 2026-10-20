import { UI_TEXT } from '../constants/i18n'
import { useLanguage } from '../context/LanguageContext'
import { cardId, formatEventDate } from './eventsShared'

const TICKER_EVENTS = 2 // FFR-005: N closest events
const MIN_ITEMS_PER_TRACK = 8 // item copies per track, so one track is wider than the bar
const TRACKS = 2 // identical tracks side by side: each moves one full width, so the loop is seamless

function goToCard(eventCode) {
  const card = document.getElementById(cardId(eventCode))
  if (!card) return
  card.scrollIntoView({ behavior: 'smooth', block: 'center' })
  // A closed or sold-out card has no enabled button: focus the card itself instead.
  ;(card.querySelector('button:not([disabled])') ?? card).focus({ preventScroll: true })
}

// No `r()` scroll-reveal: mounts after useReveal has scanned the page (ARCHITECTURE_SPEC §7).
export default function EventsTicker({ events }) {
  const { lang } = useLanguage()
  const t = UI_TEXT.events
  const items = events.slice(0, TICKER_EVENTS)
  const repeats = Math.ceil(MIN_ITEMS_PER_TRACK / items.length)

  return (
    <div className="evt-ticker" role="region" aria-label={t.tickerLabel[lang]}>
      {Array.from({ length: TRACKS }, (_, track) => (
        <div
          key={track}
          className={track === 0 ? 'evt-ticker-track' : 'evt-ticker-track evt-ticker-dup'}
          aria-hidden={track === 0 ? undefined : true}
        >
          {Array.from({ length: repeats }, (_, rep) =>
            items.map((ev) => {
              const primary = track === 0 && rep === 0
              return (
                <span
                  key={`${rep}-${ev.eventCode}`}
                  aria-hidden={primary ? undefined : true}
                  style={{ display: 'inline-flex', alignItems: 'center' }}
                >
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
