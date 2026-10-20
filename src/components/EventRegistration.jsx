import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { C } from '../constants/colors'
import { UI_TEXT } from '../constants/i18n'
import { useLanguage } from '../context/LanguageContext'
import { checkCoupon, register } from '../api/events'

// Registration form for one event (US-019, US-020 client side).
// Contract: docs/specs/EVENTS_API_CONTRACT.md (§3.2 coupon, §3.3 register, §7 errors, §8 fields).
// Props: event (one item of the `events` response), sinpe ({ number, accountName, isPlaceholder }),
// onClose (called when the visitor dismisses the dialog), onStale (optional: called after
// EVENT_NOT_FOUND, REGISTRATION_CLOSED or SOLD_OUT so the page refetches the events).

const MAX_FILE_BYTES = 5 * 1024 * 1024
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^\+[1-9]\d{7,14}$/
const COUPON_RE = /^[A-Z0-9]{8,20}$/

// Coupon codes whose server answer means "this code cannot be used"; the applied discount is dropped.
const COUPON_ERRORS = ['COUPON_INVALID', 'COUPON_EXHAUSTED', 'COUPON_ALREADY_USED']
// Answers that mean the event state changed since the list was fetched.
const STALE_ERRORS = ['EVENT_NOT_FOUND', 'REGISTRATION_CLOSED', 'SOLD_OUT']
// Server field names → form field names.
const FIELD_KEYS = {
  participantName: 'name',
  email: 'email',
  whatsapp: 'whatsapp',
  couponCode: 'coupon',
  file: 'file',
  consent: 'consent',
}

const newSubmissionId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  // crypto.randomUUID needs a secure context; getRandomValues is available more widely.
  const b = crypto.getRandomValues(new Uint8Array(16))
  b[6] = (b[6] & 0x0f) | 0x40
  b[8] = (b[8] & 0x3f) | 0x80
  const h = Array.from(b, (x) => x.toString(16).padStart(2, '0'))
  return `${h.slice(0, 4).join('')}-${h.slice(4, 6).join('')}-${h.slice(6, 8).join('')}-${h
    .slice(8, 10)
    .join('')}-${h.slice(10).join('')}`
}

const ascii = (bytes, from, to) => String.fromCharCode(...bytes.slice(from, to))

// Image type from the file content, not its name or the browser-reported type (contract §3.3).
const HEIC_BRANDS = ['heic', 'heix', 'hevc', 'hevx', 'heim', 'heis', 'hevm', 'hevs']
async function sniffImage(file) {
  const bytes = new Uint8Array(await file.slice(0, 64).arrayBuffer())
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg'
  if (ascii(bytes, 0, 8) === '\x89PNG\r\n\x1a\n') return 'image/png'
  if (ascii(bytes, 0, 4) === 'RIFF' && ascii(bytes, 8, 12) === 'WEBP') return 'image/webp'
  if (ascii(bytes, 4, 8) === 'ftyp') {
    // Major brand plus the compatible brands that fit in the slice. mif1/msf1 are also used by AVIF,
    // so they only count as HEIF when a HEIC brand is listed and no AVIF brand is.
    const brands = [ascii(bytes, 8, 12)]
    for (let i = 16; i + 4 <= bytes.length; i += 4) brands.push(ascii(bytes, i, i + 4))
    if (brands.includes('avif') || brands.includes('avis')) return null
    if (brands.some((x) => HEIC_BRANDS.includes(x))) return 'image/heic'
    if (brands[0] === 'heif') return 'image/heif'
  }
  return null
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '')
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

const formatCrc = (n, lang) => `₡${Number(n).toLocaleString(lang === 'es' ? 'es-CR' : 'en-US')}`

function formatDate(date, lang) {
  const [y, m, d] = String(date).split('-').map(Number)
  if (!y || !m || !d) return String(date)
  return new Date(y, m - 1, d).toLocaleDateString(lang === 'es' ? 'es-CR' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function EventRegistration(props) {
  return props.event ? <RegistrationDialog {...props} /> : null
}

function RegistrationDialog({ event, sinpe, onClose, onStale }) {
  const { lang } = useLanguage()
  const t = UI_TEXT.events.form

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [website, setWebsite] = useState('') // honeypot: real visitors never see or fill it
  const [consent, setConsent] = useState(false)
  const [couponText, setCouponText] = useState('')
  const [coupon, setCoupon] = useState(null) // { code, discountPercent, amountDueCrc } once applied
  const [couponBusy, setCouponBusy] = useState(false)
  const [file, setFile] = useState(null) // { file, mimeType } once it passed the client checks
  const [errors, setErrors] = useState({}) // form field → error code (keys of t.fieldErrors)
  const [couponError, setCouponError] = useState(null) // an API error code or a field error code
  const [formError, setFormError] = useState(null) // an API error code for the whole form
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(null) // { reference, flagged }

  // One id per form attempt, kept across retries so the server stores at most one row (FFR-022).
  const submissionId = useRef(null)
  if (submissionId.current === null) submissionId.current = newSubmissionId()

  const dialogRef = useRef(null)
  const titleRef = useRef(null)
  const submittingRef = useRef(false) // synchronous guard against a double submit
  const couponRequest = useRef(0) // answers of superseded coupon checks are ignored
  const fileRequest = useRef(0) // same for the async file sniff

  const price = Number.isFinite(event?.priceCrc) ? event.priceCrc : 0
  const amountDue = coupon ? coupon.amountDueCrc : price
  const needsPayment = amountDue > 0

  // The parent may pass a new onClose on every render; the open/close effect below must not re-run
  // for that (it would pull focus out of the field being typed in).
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose
  const close = useCallback(() => {
    if (!submittingRef.current) onCloseRef.current?.()
  }, [])

  // Focus moves into the dialog on open and returns to the card's button on close; the page behind
  // does not scroll; Esc dismisses; Tab stays inside the dialog.
  useEffect(() => {
    const opener = document.activeElement
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    titleRef.current?.focus()

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        close()
        return
      }
      if (e.key !== 'Tab' || !dialogRef.current) return
      const items = dialogRef.current.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), [tabindex="0"]',
      )
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && (document.activeElement === first || document.activeElement === titleRef.current)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
      if (opener && typeof opener.focus === 'function') opener.focus()
    }
  }, [close])

  // After a confirmation or a whole-form error, bring the message into view for keyboard users.
  useEffect(() => {
    if (done) titleRef.current?.focus()
  }, [done])

  const fieldError = (key) => t.fieldErrors[errors[key]]?.[lang] || t.fieldErrors.required[lang]

  const setFieldError = (key, code) => setErrors((prev) => ({ ...prev, [key]: code }))
  const clearFieldError = (key) =>
    setErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })

  const normalizedEmail = email.trim().toLowerCase()
  const emailValid = EMAIL_RE.test(normalizedEmail) && normalizedEmail.length <= 254
  const normalizedCoupon = couponText.trim().toUpperCase()

  // The applied coupon was checked for one email and one code; changing either invalidates it.
  const dropCoupon = () => {
    couponRequest.current += 1
    setCouponBusy(false)
    setCoupon(null)
    setCouponError(null)
  }

  const onFileChange = async (e) => {
    const picked = e.target.files?.[0]
    const requestId = ++fileRequest.current
    setFile(null)
    clearFieldError('file')
    if (!picked) return
    if (picked.size > MAX_FILE_BYTES) {
      setFieldError('file', 'file_too_large')
      return
    }
    let mimeType = null
    try {
      mimeType = await sniffImage(picked)
    } catch {
      mimeType = null
    }
    if (requestId !== fileRequest.current) return // a newer pick replaced this one
    if (!mimeType) {
      setFieldError('file', 'invalid_file_type')
      return
    }
    setFile({ file: picked, mimeType })
  }

  const applyCoupon = async () => {
    setCouponError(null)
    if (!COUPON_RE.test(normalizedCoupon)) {
      setCouponError('invalid_coupon_format')
      return
    }
    if (!emailValid) {
      setCouponError('needs_email')
      return
    }
    setCouponBusy(true)
    const requestId = ++couponRequest.current
    const res = await checkCoupon({
      eventCode: event.eventCode,
      couponCode: normalizedCoupon,
      email: normalizedEmail,
    })
    if (requestId !== couponRequest.current) return // email or code changed meanwhile
    setCouponBusy(false)
    if (res.ok) {
      const { discountPercent, amountDueCrc } = res.data || {}
      if (!Number.isFinite(discountPercent) || !Number.isFinite(amountDueCrc) || amountDueCrc < 0) {
        setCouponError('SERVER_ERROR')
        return
      }
      setCoupon({
        code: normalizedCoupon,
        discountPercent,
        amountDueCrc,
      })
      return
    }
    const code = res.error?.code || 'SERVER_ERROR'
    setCouponError(code === 'VALIDATION_ERROR' ? res.error?.fields?.couponCode || 'invalid_coupon_format' : code)
  }

  const validate = () => {
    const next = {}
    const cleanName = name.trim().replace(/\s+/g, ' ')
    if (!cleanName) next.name = 'required'
    else if (cleanName.length < 2 || cleanName.length > 80) next.name = 'name_invalid'
    if (!normalizedEmail) next.email = 'required'
    else if (!emailValid) next.email = 'invalid_email'
    const phone = whatsapp.replace(/[\s\-()]/g, '')
    if (!phone) next.whatsapp = 'required'
    else if (!PHONE_RE.test(phone)) next.whatsapp = 'invalid_phone'
    if (needsPayment) {
      if (errors.file) next.file = errors.file
      else if (!file) next.file = 'required'
    }
    if (!consent) next.consent = 'consent_required'
    return next
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (submittingRef.current) return
    submittingRef.current = true
    setFormError(null)

    const found = validate()
    // A coupon typed but not applied would silently be dropped: ask the visitor to decide.
    const couponPending = normalizedCoupon !== '' && !coupon
    setErrors(found)
    setCouponError(couponPending ? 'pending' : null)
    if (Object.keys(found).length > 0 || couponPending) {
      submittingRef.current = false
      return
    }

    setSubmitting(true)
    let filePayload = null
    if (needsPayment) {
      try {
        filePayload = {
          name: file.file.name,
          mimeType: file.mimeType,
          base64: await toBase64(file.file),
        }
      } catch {
        submittingRef.current = false
        setSubmitting(false)
        setFormError('SERVER_ERROR')
        return
      }
    }

    const res = await register({
      submissionId: submissionId.current,
      eventCode: event.eventCode,
      participantName: name.trim().replace(/\s+/g, ' '),
      email: normalizedEmail,
      whatsapp: whatsapp.replace(/[\s\-()]/g, ''),
      couponCode: coupon ? coupon.code : '',
      lang,
      consent: true,
      website,
      file: filePayload,
    })
    submittingRef.current = false
    setSubmitting(false)

    if (res.ok) {
      setDone({ reference: res.data.reference, flagged: !!res.data.flagged, paid: needsPayment })
      return
    }

    const code = res.error?.code || 'SERVER_ERROR'
    if (code === 'VALIDATION_ERROR') {
      const mapped = {}
      let shown = false
      for (const [serverField, fieldCode] of Object.entries(res.error?.fields || {})) {
        const key = FIELD_KEYS[serverField]
        if (key === 'coupon' && price > 0) {
          setCouponError(fieldCode)
          shown = true
        } else if (key && key !== 'coupon' && (key !== 'file' || needsPayment)) {
          mapped[key] = fieldCode
          shown = true
        }
      }
      setErrors(mapped)
      // Nothing visible to point at (an unknown or hidden field): say so instead of "check the fields".
      setFormError(shown ? 'VALIDATION_ERROR' : 'SERVER_ERROR')
      return
    }
    if (COUPON_ERRORS.includes(code)) {
      // The code stopped working: back to the full price, the visitor decides what to do next.
      setCoupon(null)
      setFormError(code)
      return
    }
    setFormError(t.errors[code] ? code : 'SERVER_ERROR')
    // The events list is out of date: ask the page to refetch it (contract §7).
    if (STALE_ERRORS.includes(code)) onStale?.()
  }

  const apiMessage = (code) => t.errors[code]?.[lang] || t.errors.SERVER_ERROR[lang]
  const couponMessage = (code) => {
    if (code === 'needs_email') return t.couponNeedsEmail[lang]
    if (code === 'pending') return t.couponPending[lang]
    if (t.fieldErrors[code]) return t.fieldErrors[code][lang]
    return apiMessage(code)
  }

  const field = (key, id, label, input, hint) => (
    <div className="evt-form-field">
      <label htmlFor={id} className="evt-form-label">
        {label}
      </label>
      {input}
      {hint && (
        <p id={`${id}-hint`} className="evt-form-hint">
          {hint}
        </p>
      )}
      {errors[key] && (
        <p id={`${id}-err`} className="evt-form-error" role="alert">
          {fieldError(key)}
        </p>
      )}
    </div>
  )

  const describedBy = (key, id, hasHint) =>
    [hasHint ? `${id}-hint` : null, errors[key] ? `${id}-err` : null].filter(Boolean).join(' ') || undefined

  const summary = (
    <div className="evt-form-summary">
      <h2 id="evt-form-title" ref={titleRef} tabIndex={-1} className="evt-form-title">
        {event.name}
      </h2>
      <dl className="evt-form-facts">
        <div>
          <dt>{t.summaryDate[lang]}</dt>
          <dd>{formatDate(event.date, lang)}</dd>
        </div>
        <div>
          <dt>{t.summaryTime[lang]}</dt>
          <dd>{event.time}</dd>
        </div>
        <div>
          <dt>{t.summaryPrice[lang]}</dt>
          <dd>{price > 0 ? formatCrc(price, lang) : UI_TEXT.events.free[lang]}</dd>
        </div>
      </dl>
    </div>
  )

  let body
  if (done) {
    body = (
      <div className="evt-form-done" role="status">
        <p className="evt-form-done-title">{t.doneTitle[lang]}</p>
        <p className="evt-form-hint">{t.doneReference[lang]}</p>
        <p className="evt-form-ref">{done.reference}</p>
        <p className="evt-form-body">
          {done.flagged ? t.doneFlagged[lang] : done.paid ? t.doneBody[lang] : t.doneBodyFree[lang]}
        </p>
        <button type="button" className="cta-btn cta-btn-sm" onClick={close}>
          {t.close[lang]}
        </button>
      </div>
    )
  } else {
    body = (
      <form onSubmit={onSubmit} noValidate>
        {field(
          'name',
          'evt-name',
          t.name[lang],
          <input
            id="evt-name"
            className="evt-form-input"
            type="text"
            autoComplete="name"
            maxLength={80}
            value={name}
            aria-invalid={!!errors.name}
            aria-describedby={describedBy('name', 'evt-name', false)}
            onChange={(e) => {
              setName(e.target.value)
              clearFieldError('name')
            }}
          />,
        )}
        {field(
          'email',
          'evt-email',
          t.email[lang],
          <input
            id="evt-email"
            className="evt-form-input"
            type="email"
            autoComplete="email"
            maxLength={254}
            value={email}
            aria-invalid={!!errors.email}
            aria-describedby={describedBy('email', 'evt-email', false)}
            onChange={(e) => {
              setEmail(e.target.value)
              clearFieldError('email')
              if (coupon) dropCoupon()
            }}
          />,
        )}
        {field(
          'whatsapp',
          'evt-whatsapp',
          t.whatsapp[lang],
          <input
            id="evt-whatsapp"
            className="evt-form-input"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            value={whatsapp}
            aria-invalid={!!errors.whatsapp}
            aria-describedby={describedBy('whatsapp', 'evt-whatsapp', true)}
            onChange={(e) => {
              setWhatsapp(e.target.value)
              clearFieldError('whatsapp')
            }}
          />,
          t.whatsappHint[lang],
        )}

        {price > 0 && (
          <div className="evt-form-field">
            <label htmlFor="evt-coupon" className="evt-form-label">
              {t.coupon[lang]}
            </label>
            <div className="evt-form-coupon-row">
              <input
                id="evt-coupon"
                className="evt-form-input"
                type="text"
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                maxLength={20}
                value={couponText}
                readOnly={!!coupon}
                aria-invalid={!!couponError && !coupon}
                aria-describedby={couponError || coupon ? 'evt-coupon-msg' : undefined}
                onChange={(e) => {
                  couponRequest.current += 1
                  setCouponBusy(false)
                  setCouponText(e.target.value)
                  setCouponError(null)
                }}
              />
              {coupon ? (
                <button
                  type="button"
                  className="evt-form-btn-ghost"
                  onClick={() => {
                    dropCoupon()
                    setCouponText('')
                  }}
                >
                  {t.couponRemove[lang]}
                </button>
              ) : (
                <button
                  type="button"
                  className="evt-form-btn-ghost"
                  disabled={couponBusy || normalizedCoupon === ''}
                  onClick={applyCoupon}
                >
                  {couponBusy ? t.couponChecking[lang] : t.couponApply[lang]}
                </button>
              )}
            </div>
            <p
              id="evt-coupon-msg"
              className={coupon ? 'evt-form-ok' : 'evt-form-error'}
              role={coupon ? 'status' : 'alert'}
            >
              {coupon
                ? `${t.couponApplied[lang]}: −${coupon.discountPercent}%`
                : couponError
                  ? couponMessage(couponError)
                  : null}
            </p>
          </div>
        )}

        {needsPayment && (
          <section className="evt-form-pay" aria-labelledby="evt-form-pay-title">
            <h3 id="evt-form-pay-title" className="evt-form-section-title">
              {t.payTitle[lang]}
            </h3>
            <p className="evt-form-hint">{t.payIntro[lang]}</p>
            <dl className="evt-form-pay-list">
              <div>
                <dt>{t.payNumber[lang]}</dt>
                <dd>{sinpe?.number ?? '—'}</dd>
              </div>
              <div>
                <dt>{t.payAccount[lang]}</dt>
                <dd>{sinpe?.accountName ?? '—'}</dd>
              </div>
              <div>
                <dt>{t.payAmount[lang]}</dt>
                <dd className="evt-form-amount">
                  {formatCrc(amountDue, lang)}
                  {coupon && <span className="evt-form-discount"> −{coupon.discountPercent}%</span>}
                </dd>
              </div>
            </dl>
            {sinpe?.isPlaceholder && <p className="evt-form-placeholder">{t.placeholderMarker[lang]}</p>}
          </section>
        )}

        {needsPayment &&
          field(
            'file',
            'evt-file',
            t.file[lang],
            <input
              id="evt-file"
              className="evt-form-input evt-form-file"
              type="file"
              accept="image/*,.heic,.heif"
              aria-invalid={!!errors.file}
              aria-describedby={describedBy('file', 'evt-file', true)}
              onChange={onFileChange}
            />,
            file ? `${t.fileSelected[lang]}: ${file.file.name}` : t.fileHint[lang],
          )}

        {/* Honeypot (contract §3.3): hidden from people and assistive tech, bots fill it in. */}
        <div className="evt-form-hp" aria-hidden="true">
          <label htmlFor="evt-website">Website</label>
          <input
            id="evt-website"
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <section className="evt-form-privacy" aria-labelledby="evt-form-privacy-title">
          <h3 id="evt-form-privacy-title" className="evt-form-section-title">
            {t.privacyTitle[lang]} <span className="evt-form-draft">{t.privacyDraft[lang]}</span>
          </h3>
          <p className="evt-form-notice">{t.privacyNotice[lang]}</p>
        </section>

        <div className="evt-form-field">
          <label className="evt-form-consent" htmlFor="evt-consent">
            <input
              id="evt-consent"
              type="checkbox"
              checked={consent}
              aria-invalid={!!errors.consent}
              aria-describedby={describedBy('consent', 'evt-consent', false)}
              onChange={(e) => {
                setConsent(e.target.checked)
                clearFieldError('consent')
              }}
            />
            <span>{t.consent[lang]}</span>
          </label>
          {errors.consent && (
            <p id="evt-consent-err" className="evt-form-error" role="alert">
              {fieldError('consent')}
            </p>
          )}
        </div>

        {formError && (
          <p className="evt-form-error evt-form-error-box" role="alert">
            {apiMessage(formError)}
          </p>
        )}

        <button type="submit" className="cta-btn evt-form-submit" disabled={submitting}>
          {submitting ? t.submitting[lang] : t.submit[lang]}
        </button>
      </form>
    )
  }

  return createPortal(
    <div className="evt-form-overlay">
      <div
        ref={dialogRef}
        className="evt-form-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="evt-form-title"
        style={{ color: C.navy }}
      >
        <button type="button" className="evt-form-close" aria-label={t.closeLabel[lang]} onClick={close}>
          ×
        </button>
        {summary}
        {body}
      </div>
    </div>,
    document.body,
  )
}
