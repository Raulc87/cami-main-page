# SPRINT_02_VERIFICATION — Events feature on staging (CMP-033)

Integration verification of Sprint 02 (US-017..US-025, US-005 AC2) against the staging
backend. Written by Implementation Agent 3 (CMP-033). A Fail is not fixed in this PR: it is
classified (AC wording or defect) and a ticket is proposed. Story statuses are not changed here;
the coordinator does that after the owner approves the evidence.

**Status of this document: DRAFT.** Lines marked `Pending (owner)` need the owner's view of the
staging sheet, Drive folder or inbox, or a live edit by the owner; they are replaced by Pass/Fail
before the PR is reported ready.

## 1. Method

| Item | Detail |
|---|---|
| Code under test | `main` after PR #29 (form), #28 (section and ticker) and the backend PRs; the staging scripts were re-pasted from PR #44 (CMP-045) during the run |
| Backend | Staging Apps Script deployment, staging spreadsheet and Drive folder (never production); the `/exec` URL is kept out of the repository |
| Browser | Chromium (Playwright), `es-CR` and `en-US`, 1280 / 900 / 375 px; iPhone 13 emulation for the HEIC check; the site runs from the Vite dev server with `VITE_EVENTS_API_URL` pointing at staging, so every `events`, `coupon` and `register` call is a real browser `fetch` through the Apps Script redirect |
| Test data | Synthetic images only; participant emails are plus-tags of the owner's Gmail (and Outlook) addresses and are not recorded here; references are not recorded here |
| Rows, files, emails | Seen only by the owner; evidence screenshots are masked JPEGs in `docs/sprints/evidence/sprint-02/` (total under 5 MB) |
| Not done | Real-iPhone Safari picker/HEIC check: **deferred to a pre-release check (owner, no device available)**. The substitute (a real HEIC file and an iPhone-style PNG through the form in a phone-sized viewport) is evidence for the client side only |

Legend: **Pass**, **Fail**, **N/A** (cannot be exercised, with the reason), **Pending (owner)**.

## 2. Results per story

### US-017 — Upcoming events section
| AC | Case | Result | Evidence |
|---|---|---|---|
| 1 | Cards in start order with name, date, time (24 h `HH:mm`), description, price or "Gratis/Free", register button; ES and EN | Pass | `page-events-{es,en}-{1280,900,375}.jpg` |
| 2 | Event without image shows the Lifetools logo; event with an image URL (TART) shows the art | Pass | `page-events-*` (logo); art: see final re-shoot note in §4 |
| 3 | Closed (registration closes 12 h before start) and sold-out events: button disabled, "Inscripciones cerradas" / "Agotado" (EN "Registration closed" / "Sold out") | Pass | cards of the closed event, the one-seat free event and the one-seat paid event |
| 4 | EN site shows English name and description: automatic translation, and `nameEn`/`descriptionEn` override (TART shows the override) | Pass | `events?lang=en` listing, EN screenshots |
| 5 | Backend down (requests aborted): no section, no ticker, page renders | Pass | scripted check |
| 5 | Backend slow: answer after 4.5 s is shown; after 5.5 s the section and ticker stay hidden (5 s limit) | Pass | CLS run (§3.3) and scripted check with a 6.5 s answer |
| 5 | `VITE_EVENTS_API_URL` empty: page identical to the pre-events page, no section, no ticker | Pass | `page-noevents-{es,en}-{1280,900,375}.jpg` |

### US-018 — Upcoming-events ticker
| AC | Case | Result | Evidence |
|---|---|---|---|
| 1 | Banner shows up to 2 closest events (name · date), scrolls right-to-left (about 79 px/s) in the active language | Pass | scripted check, `page-events-*` |
| 2 | Selecting an item (click, or Enter with keyboard focus) scrolls to that event's card | Pass | scripted check |
| 3 | Hover pauses; keyboard focus pauses | Pass | scripted check |
| 4 | `prefers-reduced-motion`: static banner | Pass | scripted check |
| 5 | No upcoming events: no banner | Pass | `page-noevents-*` |

### US-019 — Registration form with SINPE proof
Form-side runs on staging (CMP-032 pass and this run).
| AC | Case | Result | Evidence |
|---|---|---|---|
| 1 | Paid event: summary, then (after name, email, WhatsApp and coupon) SINPE number, account name and amount; the amount follows the coupon | Pass | `form-es-1280-paid.jpg`, `form-es-375-paid.jpg`, `form-en-900-paid.jpg` |
| 1 | "placeholder / por confirmar" marker while the values are placeholders | N/A on staging (real values set); Pass against a fixture in CMP-032 and in the reviewer's run | `mobile-iphone13-heic-form.jpg` shows the staging test values at the time |
| 2 | Free event and ₡0 after a 100% coupon: no payment block, no screenshot field, submit works without a file | Pass | scripted checks |
| 3 | Missing name / email / WhatsApp / screenshot / consent: submit blocked, one message per field in the active language | Pass | scripted check |
| 4 | Invalid email, phone, non-image renamed `.jpg`, file over 5 MB: matching error, nothing sent | Pass | scripted check; also on the server, see §3.1 |
| 5 | Valid paid registration with JPEG, PNG, WebP: confirmation with reference | Pass | `form-es-1280-confirmation.jpg` |
| 5 | HEIC: the form accepts a real HEIC (brand `heic`, about 516 KB) and sends it as `image/heic`; reference returned | Pass (client). Stored file, check result and emails: **Pending (owner)** | `mobile-iphone13-heic-done.jpg` |
| 6 | Backend error: retry message, data kept; a dropped response followed by a retry reuses the same `submissionId` and returns the reference | Pass | scripted check |
| 7 | Email already registered: the exact ES/EN text, nothing stored | Pass | scripted check |
| 8 | Privacy notice (marked draft) and a required consent checkbox | Pass | form screenshots |

### US-020 — Coupon at registration (client side)
| AC | Case | Result | Evidence |
|---|---|---|---|
| 1 | 10% coupon: amount to pay becomes ₡22 500 and the coupon is saved with the registration | Pass | scripted check |
| 1 | Rounding to the nearest colón: 15% on ₡12 345 gives ₡10 493 | Pass (server answer); stored amount **Pending (owner)** | API case C07b |
| 1 | Coupon expiring today is still valid (inclusive) | Pass | API case C07a |
| 2 | Unknown, inactive, expired, other-event coupon: "Cupón no válido", full price stays | Pass | scripted check, API cases C06/C08 |
| 3 | Exhausted coupon, coupon already used by the email: matching message, full price stays | Pass | scripted check |
| 4 | A registration marked `spam` frees the coupon use: a one-use coupon answered `COUPON_EXHAUSTED` for another email; after the owner set the registration that held it to `spam`, the next check answered 20% and ₡20 000 (no cache) | Pass | live edit 4 |
| 5 | Coupon deactivated after apply, then a paid registration: stored with the discount, flagged `coupon changed`; the visitor sees the review message | Pass (visitor side); row **Pending (owner)** | `form-es-1280-flagged-coupon-changed.jpg` |
| 6 | Many failed coupon checks: refusal "try again later" | Pending: abuse burst |  |
| 7 | No coupon list is sent to the browser | Pass | the `events` response carries no coupon data |
| 8 | A coupon typed but not applied blocks Submit with "Aplica el cupón o borra el campo."; no request is sent | Pass | CMP-032 mock run and the reviewer's run |

### US-021 — Registrations in Drive and Sheets
| AC | Case | Result | Evidence |
|---|---|---|---|
| 1 | Paid registration: JPEG named `<Name>_<date>_<eventCode>.jpg` in `<root>/<eventCode>/`, `_2` on collision, subfolder created if new; ₡0 stores no file | Pending (owner) | Drive listing |
| 2 | Row with the §6 columns, status `new`, check result `pending`/`not-required`, values stored as text (a name starting `=` stays text) | Pending (owner) | sheet screenshot |
| 3 | At capacity, a ₡0 registration is refused `SOLD_OUT`; two simultaneous ₡0 registrations for the last place never both succeed | Pass | API case R18: one `ok`, the other `SERVER_ERROR` (busy lock); a retry then gave `SOLD_OUT` |
| 3 | A registration set to `refund/cancelled` frees the place (BR-E10): the event stopped showing as sold out within about 3 minutes (events cache); a new ₡0 registration was accepted and the next one was refused `SOLD_OUT` again | Pass | live edit 3 |
| 4 | Closed, unpublished or full event with a paid registration: stored, flagged, the visitor is told Cami will contact them | Pass (visitor side); rows **Pending (owner)** | `form-es-1280-flagged-event-unpublished.jpg` |
| 5 | Invalid data or unknown event code rejected, nothing stored | Pass (responses); nothing stored: **Pending (owner)** | API cases R01–R16 |
| 6 | Retry with a stored `submissionId` returns the original reference, nothing new | Pass | scripted check; one row per participant: **Pending (owner)** |

### US-022 — Automatic check of the payment screenshot
| AC | Case | Result | Evidence |
|---|---|---|---|
| 1 | Receipt with the real account and the exact amount: `ok`, `needsReview` FALSE | Pending (owner) | rows from the `okES` and `roundOK` registrations |
| 2 | Wrong account or amount: `mismatch`, failing fields in `checkDetails`, review flag, "not validated" email | Pending (owner) | `mismES` registrations |
| 3 | Unreadable image: `unreadable`, review flag, email | Pending (owner) | `unreadEN` registrations |
| 4 | Status stays `new`; temporary OCR Doc deleted | Pending (owner) | sheet and Drive |
| 5 | Cami's sample screenshots in the spike | N/A here (done in CMP-024, `SPRINT_02_SPIKE.md`) |  |
| 6 | OCR service refuses the call (rate limit) | N/A: cannot be provoked from the client |  |
| 7 | Original-format screenshot that OCR cannot read: `unreadable`, no "not validated" email | Pending (owner): depends on the HEIC result |  |

### US-023 — Cami manages events, capacity and coupons without a deploy
| AC | Case | Result | Evidence |
|---|---|---|---|
| 1 | A new published event appears within 5 minutes (TNEW) | Pass. First attempt: not listed after 7 minutes because the owner's row was incomplete (owner: "I missed it before"). After the owner completed it, it was listed 2.3 minutes after my first check (name, date, time, price and `registrationOpen` correct); the owner's exact save time was not recorded, so this is an upper bound of about 2.3 minutes plus the owner's delay | listing poll |
| 2 | Invalid row (blank name, invalid time) and a duplicated code are not shown; the others still are | Pass | listing before and after the owner's fixes; the duplicated code stayed hidden throughout |
| 3 | A changed coupon discount applies on the next check (no cache): PROMO10AB changed from 10% to 20% answered 20% and ₡20 000 on the first check after the owner's saved edit. The first attempt answered 10% only because the owner had edited another coupon by mistake (owner confirmed); the code reads the sheet on every coupon check | Pass | live edit 2 |
| 4 | `nameEn`/`descriptionEn` override the automatic translation | Pass | `events?lang=en` for TART |
| 5 | Coupon row with an invalid code, discount or max uses is ignored | Pass (ignored: `COUPON_INVALID`); alert email **Pending (owner)** | API cases C04/C06 |
| — | A past event (started) is not listed (BR-E09); the two closed test events disappeared from the listing after their start time passed | Pass | listing |
| — | A deleted event (TNEW) leaves the listing within about 6 minutes of the owner's delete (events cache up to 5 minutes) | Pass | live edit 1 restore |

### US-024 — Abuse metrics and alerts
| AC | Case | Result | Evidence |
|---|---|---|---|
| 1 | Metrics row for the day: accepted, honeypot hits, throttled, failed coupon checks, MB uploaded, spam marked | Pending (owner) | Metrics tab |
| 2 | Over a threshold: one alert email to camila@ for the day | Pending: abuse burst, run last |  |
| 3 | Honeypot filled: normal-looking success, nothing stored, hit counted | Pass (response); count **Pending (owner)** | API case R14 |

### US-025 — Participant emails
| AC | Case | Result | Evidence |
|---|---|---|---|
| 1 | Confirmation (ES and EN) with event, date/time, amount, reference, reply-to camila@; Gmail and Outlook | Pending (owner) | inbox screenshots |
| 2 | "Payment not validated" for `mismatch` and `unreadable` (ES and EN); Gmail and Outlook | Pending (owner) |  |
| 3 | Email cannot be sent: row stays, `email failed`, review flag | N/A: cannot be provoked from the client |  |
| 4 | Templates approved by Cami | N/A: release gate (BR-E11), not part of this verification |  |
| 5 | "Registration received" for a stored-and-flagged registration (ES and EN); Gmail and Outlook | Pending (owner) |  |

### US-005 — Real client testimonials (AC2 check carried over from CMP-017)
| AC | Case | Result | Evidence |
|---|---|---|---|
| 2 | A testimonial with no Spanish long version shows the English long version under "ver más"; only that testimonial expands; "ver menos" collapses it. Test data not committed (reverted) | Pass | `us005-ac2-featured-expanded-es.jpg` |
| 3 | No "ver más" where there is no long version | Pass | same run: 2 controls for 4 testimonials |
| 1 | The four testimonials still render with the events section present | Pass | `page-events-*`, `page-noevents-*` |

## 3. Integration checks

### 3.1 Contract §10 end-to-end list (API level, staging)
27 of 27 cases pass: `events` shape (§7) and the `-06:00` instants; every validation rule with a valid
and an invalid case (submissionId, eventCode, name length, email, WhatsApp, coupon format, file
type, file over 5 MB, consent, lang, missing file for a paid event); `EVENT_NOT_FOUND`,
`REGISTRATION_CLOSED` (coupon check, and a ₡0 registration on a closed free event),
`COUPON_INVALID` (unknown, other-event, invalid sheet rows), `SOLD_OUT`, `ALREADY_REGISTERED`,
honeypot fake success; the simultaneous-registration race. Codes not exercised: `RATE_LIMITED` and
`UPLOAD_CAP_REACHED` (abuse burst, pending), `SERVER_ERROR` (seen as the busy-lock answer in the
race and as a network failure, see §3.4).

### 3.2 Real browser to staging (CORS and redirect path)
Pass. Every call of the form run (events, coupon, register, with a 7 MB base64 body) went through
the browser `fetch` to the staging `/exec` URL, followed the `script.googleusercontent.com`
redirect and parsed as JSON, with no preflight and no console error. A dropped response was handled
as designed.

### 3.3 Layout shift (CLS) while the events answer takes up to 5 s (FFR-004)
Chromium, 1280 and 375 px; the captured staging answer served after a fixed delay.
| Case | 1280 px | 375 px |
|---|---|---|
| Events off (baseline) | 0.001 | 0.006 |
| Answer at 1 s | 0.032 | 0.058 |
| Answer at 4.5 s | 0.032 | 0.056 |
| Answer at 5.5 s (over the 5 s limit) | ticker and section hidden, 0.001 | hidden, 0.006 |

The single shift (0.031 / 0.050) is the 40 px ticker pushing the nav and hero down when it appears.
It stays under the 0.1 "good" threshold; avoiding it would need the ticker's height reserved.
Result: Pass (observation recorded in §5).

### 3.4 Timings and the intermittent 30 s failures (watch item)
Coupon check 4–12 s; register: free 3–10 s, paid 10–27 s (the client POST timeout is 60 s).
Observed twice: one paid registration got `net::ERR_FAILED` about 30 s after the POST with no
response (the form kept the data and showed the retry message; the owner found no row for it, so no
duplicate), and one `events` request timed out at 30 s with no bytes and then answered normally.
Likely cause: Apps Script cold start or load. Not reproduced afterwards.

### 3.5 Regression of the existing sections
Pass. Full-page captures at 1280 / 900 / 375 px in ES and EN, with and without events: the existing
sections are identical in both, no horizontal scroll, no page errors.
`page-{events,noevents}-{es,en}-{1280,900,375}.jpg`.

### 3.6 HEIC and PNG substitute check (no iPhone available)
A real HEIC (brand `heic`, HEVC, about 516 KB) and an iPhone-sized PNG (1170×2532) through the form in
iPhone 13 emulation: both accepted, sent as `image/heic` and `image/png`, references returned.
Stored file type, check result and emails: Pending (owner).
**Real-iPhone Safari picker/HEIC check deferred to a pre-release check (owner, no device available).**

## 4. Evidence index
All files are in `docs/sprints/evidence/sprint-02/` (JPEG, masked, under 5 MB in total):
`page-*` (layout and regression), `form-*` (form states on staging), `mobile-iphone13-heic-*`,
`us005-ac2-featured-expanded-es.jpg`. Sheet, Drive and inbox screenshots from the owner are added
here when received. A final re-shoot of the events section (with the art event) is added after the live edits.

## 5. Failures, observations and proposed tickets
| # | Item | Class | Proposal |
|---|---|---|---|
| 1 | TNEW not listed after 7 minutes in the first attempt (US-023 AC1) | Not a defect: the row was incomplete (owner confirmed); listed after the fix | none |
| 2 | The ticker's appearance shifts the page down by 40 px (CLS 0.03–0.06) | Observation | optional ticket to reserve the ticker height |
| 3 | `index.html` links `/favicon.svg`, which is not in `public/` (404 on every page load, also in production) | Observation, pre-existing | small ticket: add the favicon or remove the link |
| 4 | Intermittent 30 s hangs on staging (§3.4) | Observation | keep watching; no ticket yet |
| 5 | Staging script properties reached the 50-property UI limit (reported by Agent 1) | Observation | PR #44 (CMP-045) is the lasting fix |
