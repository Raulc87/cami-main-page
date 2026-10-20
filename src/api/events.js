// Client for the events backend (Google Apps Script web app, ADR-008).
// Contract: docs/specs/EVENTS_API_CONTRACT.md (§2 transport, §7 envelope).
//
// Every function resolves to the §7 envelope `{ ok, data, error }` and never rejects: a network
// failure, a timeout or an unreadable response becomes `SERVER_ERROR`.

const BASE_URL = (import.meta.env.VITE_EVENTS_API_URL || '').trim()

const EVENTS_TIMEOUT_MS = 5000 // FFR-004: slower than this hides the section (5 s, CMP-038)
const POST_TIMEOUT_MS = 60000 // uploads of up to ~6.7 MB of base64 on a slow connection

const serverError = () => ({ ok: false, data: null, error: { code: 'SERVER_ERROR' } })

export const isEventsApiConfigured = () => BASE_URL !== ''

async function request(url, init, timeoutMs) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, { ...init, redirect: 'follow', signal: controller.signal })
    const body = await res.json()
    if (body && typeof body === 'object' && typeof body.ok === 'boolean') return body
    return serverError()
  } catch {
    return serverError()
  } finally {
    clearTimeout(timer)
  }
}

// text/plain with a JSON string body avoids a CORS preflight (Apps Script cannot answer one),
// so no custom headers may be added.
function post(payload) {
  if (!BASE_URL) return Promise.resolve(serverError())
  return request(
    BASE_URL,
    {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    },
    POST_TIMEOUT_MS,
  )
}

/** GET ?action=events&lang=es|en — contract §3.1. No personal data in the URL. */
export function getEvents(lang) {
  if (!BASE_URL) return Promise.resolve(serverError())
  const url = `${BASE_URL}?action=events&lang=${lang === 'en' ? 'en' : 'es'}`
  return request(url, { method: 'GET' }, EVENTS_TIMEOUT_MS)
}

/** POST action=coupon — contract §3.2. */
export function checkCoupon({ eventCode, couponCode, email }) {
  return post({ action: 'coupon', eventCode, couponCode, email })
}

/** POST action=register — contract §3.3. `payload` carries every field except `action`. */
export function register(payload) {
  return post({ ...payload, action: 'register' })
}
