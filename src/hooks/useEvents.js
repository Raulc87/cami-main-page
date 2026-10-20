import { useState, useEffect } from 'react'
import { getEvents, isEventsApiConfigured } from '../api/events'
import { useLanguage } from '../context/LanguageContext'

/**
 * useEvents — upcoming events from the events backend (EVENTS_API_CONTRACT §3.1)
 *
 * Returns { status: 'loading' | 'ready' | 'hidden', sinpe, events }.
 * 'hidden' when VITE_EVENTS_API_URL is empty, or on error, timeout or zero events (FFR-004);
 * the page then renders exactly as it did without events. Refetches when the language changes
 * (event name and description come back in the requested language, FFR-028).
 *
 * Call it once, in App.jsx, so the page makes a single `events` request.
 */
export function useEvents() {
  const { lang } = useLanguage()
  const configured = isEventsApiConfigured()
  const [state, setState] = useState(
    configured
      ? { status: 'loading', sinpe: null, events: [] }
      : { status: 'hidden', sinpe: null, events: [] },
  )

  useEffect(() => {
    if (!configured) return undefined
    let cancelled = false

    getEvents(lang).then((res) => {
      if (cancelled) return
      const events = res.ok && Array.isArray(res.data?.events) ? res.data.events : []
      if (events.length === 0) {
        setState({ status: 'hidden', sinpe: null, events: [] })
      } else {
        setState({ status: 'ready', sinpe: res.data.sinpe ?? null, events })
      }
    })

    return () => {
      cancelled = true
    }
  }, [lang, configured])

  return state
}
