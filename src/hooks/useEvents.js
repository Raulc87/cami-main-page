import { useState, useEffect } from 'react'
import { getEvents, isEventsApiConfigured } from '../api/events'
import { useLanguage } from '../context/LanguageContext'

/**
 * useEvents — upcoming events from the events backend (EVENTS_API_CONTRACT §3.1)
 *
 * Returns { status: 'loading' | 'ready' | 'hidden', sinpe, events }.
 * 'hidden' when VITE_EVENTS_API_URL is empty, or on error, timeout or zero events (FFR-004);
 * the page then renders exactly as it did without events. Refetches when the language changes
 * (event name and description come back in the requested language, FFR-028); if that refetch
 * fails the last good events stay shown (in the previous language) instead of hiding the section.
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
      setState((prev) => {
        if (events.length > 0) return { status: 'ready', sinpe: res.data.sinpe ?? null, events }
        // A failed refetch (language change) keeps the last good events, so an open registration
        // form is not unmounted and its data lost. FFR-004 applies to the page load: with nothing
        // shown yet, or when the backend answers with no events, the section stays hidden.
        if (!res.ok && prev.status === 'ready') return prev
        return { status: 'hidden', sinpe: null, events: [] }
      })
    })

    return () => {
      cancelled = true
    }
  }, [lang, configured])

  return state
}
