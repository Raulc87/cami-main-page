import { useState, useEffect, useCallback } from 'react'
import { getEvents, isEventsApiConfigured } from '../api/events'
import { useLanguage } from '../context/LanguageContext'

/**
 * useEvents — upcoming events from the events backend (EVENTS_API_CONTRACT §3.1)
 *
 * Returns { status: 'loading' | 'ready' | 'hidden', sinpe, events, refetch }.
 * 'hidden' when VITE_EVENTS_API_URL is empty, or on error, timeout or zero events (FFR-004);
 * the page then renders exactly as it did without events. Refetches when the language changes
 * (event name and description come back in the requested language, FFR-028); if that refetch
 * fails the last good events stay shown (in the previous language) instead of hiding the section.
 *
 * `refetch()` reloads the events on demand (the registration form calls it through `onStale` when
 * the server reports the event closed, sold out or unknown). Once events have been shown, a
 * refetch never hides the section: a failure keeps the last good events, and an answer with zero
 * events leaves `status: 'ready'` with an empty list (Events then renders only an open form, if
 * any, so the visitor can read its message).
 *
 * Call it once, in App.jsx, so the page makes a single `events` request.
 */
export function useEvents() {
  const { lang } = useLanguage()
  const configured = isEventsApiConfigured()
  const [reloadKey, setReloadKey] = useState(0)
  const refetch = useCallback(() => setReloadKey((k) => k + 1), [])
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
        // After a refetch, never hide what was shown: an open registration form would be
        // unmounted and its data lost. FFR-004 hides the section at page load only.
        if (prev.status === 'ready') return res.ok ? { ...prev, events: [] } : prev
        return { status: 'hidden', sinpe: null, events: [] }
      })
    })

    return () => {
      cancelled = true
    }
  }, [lang, configured, reloadKey])

  return { ...state, refetch }
}
