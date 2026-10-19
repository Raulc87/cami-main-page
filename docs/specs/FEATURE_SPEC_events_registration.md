# FEATURE_SPEC — Upcoming events and paid registration

## Metadata
- Feature ID: FS-001
- Feature: Upcoming events, registration with SINPE Móvil payment proof, coupons, capacity,
  participant emails, events ticker
- Version: 1.0 (refined with the owner's answers of 2026-10-19, CMP-021; Discovery draft 0.1 in
  CMP-019)
- Status: Approved (on merge of PR #21)
- Parent PROJECT_SPEC: [PROJECT_SPEC.md](PROJECT_SPEC.md) (v1.1, FR-011)
- Related project requirements: G-005; FR-009 (bilingual UI), FR-011; NFR-001 (hosting),
  NFR-002 (responsive), NFR-003 (free tier first), NFR-004 (minimal stack); BR-002
- Related backlog: US-012 and US-013 stay in the backlog; revisit them after this feature ships
  (owner, 2026-10-19)
- Architecture: [ADR-008](../decisions/ADR-008-events-backend-google-apps-script.md);
  contract: [EVENTS_API_CONTRACT.md](EVENTS_API_CONTRACT.md)
- Source: owner requirement and answers, 2026-10-19 (Cami's request, relayed by Raul Casanas)

## 1. Objective
Let visitors discover Cami's upcoming events on the site and register for one — paying by SINPE
Móvil and uploading the payment screenshot, or without payment for free events. Each
registration is stored for Cami in Google Sheets (one tab per event) with the screenshot in
Google Drive (one subfolder per event); participants get a confirmation email, and an automatic
check flags payments that do not match. Cami manages events, capacity and coupons in the
spreadsheet, and a moving banner at the top of the page announces the closest events.

## 2. Context
Until now the site was a static one-pager with an email CTA, no backend and no persistence.
Cami runs paid and free events and handles sign-ups and SINPE payments by hand. This feature
moves that flow onto the site while keeping her data in her Google Workspace
(`lifetoolscr.com`) at zero license cost.

PROJECT_SPEC changes approved by the owner (Q-20, 2026-10-19; "this could change in the future
if we decide to use another pay platform"), applied in PROJECT_SPEC v1.1 in the same PR:
- §4 Non-goals: "no online payments" now allows event registration with a manual SINPE Móvil
  transfer and proof upload (no payment gateway).
- §4 Non-goals: "no CMS" now allows the events spreadsheet as a runtime content source.
- §10: registrations persist in Google Sheets and Drive.
- FR-008 stays (email booking); new FR-011 covers events and registration.
- NFR-001: the static site stays on GoDaddy; the events backend runs on Google Apps Script
  (ADR-008).

The project moves from **Simple** to **Standard** complexity (TECH_STACK §1).

## 3. User Stories
Full stories with acceptance criteria are in [USER_STORIES.md](USER_STORIES.md):

| Story | Title | Requirements |
|---|---|---|
| US-017 | Upcoming events section | FFR-001..FFR-004, FFR-025, FFR-028, BR-E09 |
| US-018 | Upcoming-events ticker banner | FFR-005, FFR-006 |
| US-019 | Event registration form with SINPE Móvil payment proof | FFR-007..FFR-011, FFR-018, FFR-022, FFR-023, FFR-027 |
| US-020 | Discount coupon at registration | FFR-012, FFR-013, FFR-021, FFR-024 (coupon changed), BR-E13 |
| US-021 | Registrations stored in Google Drive and Sheets | FFR-014..FFR-016, FFR-024, FFR-025, FFR-030, BR-E13 |
| US-022 | Automatic check of the payment screenshot | FFR-017 |
| US-023 | Cami manages events, capacity and coupons without a deploy | FFR-019, FFR-020 |
| US-024 | Abuse metrics and alerts | FFR-029 |
| US-025 | Participant emails (confirmation, payment not validated) | FFR-026 |

## 4. Preconditions
- The `lifetoolscr.com` Google Workspace owns the spreadsheet, the Drive folder and the backend
  script (Q-7). The owner deploys the script, helped by the agents and a runbook.
- A staging spreadsheet and Drive folder exist for development and tests (created by the owner
  when needed; ADR-007 decision 6).
- Cami's SINPE Móvil number and account name (placeholder until then, BR-E01).
- Lifetools logo and 2–3 sample SINPE screenshots from different banks: provided by Cami during
  development (Q-9, Q-18).

## 5. Functional Requirements
Events section
- FFR-001: The page shows an "Upcoming Events" / "Próximos eventos" section with one card per
  published event that has not started (BR-E09), ordered by start ascending.
- FFR-002: Each card shows the event name, date and time, brief description, price (or
  "Gratis / Free") and the event art image; when an event has no image, the Lifetools logo.
- FFR-003: Each card has a register button; it is disabled when registration is closed
  (12 h before start, BR-E09) or the event is sold out (FFR-025).
- FFR-004: When there are no upcoming events, or the backend is unavailable, the section and
  the ticker are hidden (Q-10) and the rest of the page renders normally.
- FFR-025: Capacity: each event has a capacity in the `Events` tab. When the count of counting
  registrations (BR-E10) reaches it, the card shows "Agotado / Sold out" and the register button
  is disabled. At `register` time the server applies BR-E13: a ₡0 registration is refused
  (`SOLD_OUT`); a paid one (screenshot attached) is stored and flagged (FFR-024). The capacity and
  duplicate check plus the row append are serialized with `LockService` so two people cannot take
  the last place; OCR and emails run after the lock is released.
- FFR-028: Event name and description are written in Spanish by Cami (Q-1). When the site is in
  English, the backend returns an English version: the optional `nameEn`/`descriptionEn` columns
  if filled, otherwise an automatic translation (Apps Script `LanguageApp`, free), stored in
  script properties keyed by a hash of the Spanish text, so it is recomputed only when that text
  changes.

Ticker banner
- FFR-005: A banner at the top of the page scrolls right-to-left continuously, showing up to the
  N closest upcoming events (N = 2 by default) with name and date; selecting an item scrolls to
  that event's card.
- FFR-006: The banner pauses on hover/focus, is static when the visitor's system requests
  reduced motion, and is hidden when there are no upcoming events.

Registration
- FFR-007: The register button opens the form for that event only (name, date, time, price at
  the top).
- FFR-008: For paid events the form first shows the payment instructions: method "SINPE Móvil",
  Cami's number and account name, and the amount to pay (after any coupon). No transfer
  description is required (Q-4: the screenshot is attached in the same form).
- FFR-009: Fields: Participant name, Email, WhatsApp number (with country code), payment
  screenshot (paid events only), consent. All required. One registration = one participant = one
  payment (Q-22).
- FFR-010: Client-side validation (repeated on the server, contract §3.3): valid email; WhatsApp
  in international format `+<country code><number>`, e.g. `+50684104791` (Q-6); the screenshot
  may be any common image format, including iPhone HEIC/HEIF (Q-14), up to 5 MB.
- FFR-011: On submit the participant sees a confirmation with a registration reference, or a
  clear error that keeps the entered data. Each form attempt carries a client-generated
  submission ID (UUID) (FFR-022).
- FFR-018: The form shows a privacy notice (generic, Ley 8968-based draft in
  [EVENTS_EMAILS_AND_PRIVACY.md](../ux/EVENTS_EMAILS_AND_PRIVACY.md); reviewed by a lawyer before
  release — BR-E11) and requires an explicit consent checkbox.
- FFR-022: Idempotency: a request whose submission ID is already stored returns that row's
  reference and stores nothing new.
- FFR-023: Free events and ₡0 totals (a free event or a 100% coupon): same form and data
  **without** the payment instructions and screenshot; the row is stored with check result
  `not-required` and no Drive file (Q-16).
- FFR-027: One registration per email per event: if the email already has a counting
  registration (BR-E10) for the event, the backend refuses it and the form shows "Ya existe una
  inscripción con este correo para este evento / You are already registered for this event"
  (Q-15).

Coupons
- FFR-012: Optional coupon field; applying it checks the code for **that event and that email**
  on the server and shows the discounted amount before payment. Checks are throttled globally
  (§12).
- FFR-013: A coupon is a percentage discount (1–100%) tied to one event, with a maximum number of
  uses set by Cami and **one use per email** (Q-24). Unknown, inactive, expired, exhausted or
  already-used coupons are refused with a message and the full price stays. A use counts while
  the registration counts (BR-E10) and is freed if Cami marks it `refund/cancelled` or `spam`.
- FFR-021: Coupon codes are never sent to the browser in bulk.

Storage (server side)
- FFR-014: The server re-validates every field, converts the screenshot to JPEG, stores it as
  `<root>/<eventCode>/<ParticipantName>_<YYYY-MM-DD>_<eventCode>.jpg` (registration date, BR-E04),
  creating the event's subfolder if it is new (Q-5), and appends a row to the event's tab. Every
  user-controlled value written to a cell is neutralized as text (a leading `=`, `+`, `-`, `@`,
  tab or CR is prefixed with `'`).
- FFR-015: Each event has its own tab named by event code, created with the header row on its
  first registration.
- FFR-016: Row columns and order: contract §6 (timestamp, submission ID, reference, event code,
  name, email, WhatsApp, language, coupon, discount %, amount due, screenshot URL, check result,
  check details, needsReview, status, consent time, notes). Status is `new` on creation; only Cami
  sets `confirmed`, `refund/cancelled` or `spam`. Check result is `pending` until US-022 ships.
- FFR-024: Late changes to a paid registration (BR-E13): if, when `register` arrives with a
  screenshot, the event is closed, unpublished or sold out, or the coupon the visitor applied is
  no longer valid, the visitor may already have paid, so the backend **still stores** the
  registration (file and row) with status `new`, `needsReview` TRUE and `checkDetails` naming the
  reason (`event closed at submit`, `sold out at submit`, `coupon changed`), sends the
  "registration received" email instead of the confirmation (FFR-026), and tells the visitor Cami
  will contact them. For a changed coupon the discount the visitor saw is kept (the code must
  exist for that event). Unknown event codes, unknown coupon codes and invalid data are rejected.
- FFR-030: `needsReview` (TRUE/FALSE) tells Cami a row needs her attention (Q-3). It is TRUE if
  and only if the check result is `mismatch` or `unreadable`, or `checkDetails` holds a flag:
  `event closed at submit`, `sold out at submit`, `coupon changed`, `duplicate event code` or
  `email failed`. `pending`, `ok` and `not-required` alone leave it FALSE. (Single definition,
  used by contract §5 and the ACs.)

Payment screenshot check
- FFR-017: After storing the screenshot the server extracts its text with Drive OCR and checks
  that it shows **Cami's SINPE number or account name** and **exactly** the amount due (Q-26; no
  description check, Q-4). Result `ok` / `mismatch` (with the failing fields in `checkDetails`) /
  `unreadable`. A non-`ok` result sets `needsReview` and sends the participant the
  "payment not validated" email (FFR-026). The check never changes the status. The temporary
  OCR Google Doc is deleted right after reading.

Participant emails
- FFR-026: The backend sends, in the participant's site language (`lang`), with reply-to
  `camila@lifetoolscr.com` and sender a Workspace alias (e.g. `eventos@`/`no-reply@`) if the
  spike confirms it works without a paid seat, otherwise `camila@lifetoolscr.com` written in
  Cami's voice (Q-8, #17):
  - a **confirmation email** for every stored registration that is not flagged under FFR-024
    (event, date/time, amount, reference; for paid events: "Cami will confirm your payment");
  - a **"registration received" email** instead of the confirmation for registrations stored and
    flagged under FFR-024: it does not promise a place and says Cami will contact them;
  - a **"payment not validated" email** when the check result is `mismatch` or `unreadable`:
    "The payment for <event> could not be validated", with a short explanation that the SINPE
    screenshot does not show the expected account or exact amount, and a request to reply to
    camila@lifetoolscr.com with the correct proof (Q-3, Q-26).
  Templates (ES/EN): [EVENTS_EMAILS_AND_PRIVACY.md](../ux/EVENTS_EMAILS_AND_PRIVACY.md)
  (draft), approved by Cami before release (BR-E11). The owner accepts the risk of false "not validated" emails; if they happen too
  often, sending moves behind a manual action in the spreadsheet (#19).

Administration (Cami)
- FFR-019: `Events` tab: code, name, description, optional `nameEn`/`descriptionEn`, date, time
  (required), price CRC (0 = free), capacity, image URL, published. Codes unique,
  `[A-Z0-9-]{2,20}`; rows with a duplicated code are unpublished, and a registration that
  arrives for one is stored and flagged (`checkDetails`: `duplicate event code`).
- FFR-020: `Coupons` tab: event code, coupon code, discount %, max uses, active, optional expiry
  (Q-2). Cami adds or edits rows; no deploy. Coupon codes are 8–20 characters, `A-Z` and `0-9`
  only (hard to guess, §12); rows with an invalid code, discount or max uses are ignored and
  listed in the alert email so Cami can fix them.

Abuse metrics
- FFR-029: A `Metrics` tab gets one row per day (accepted registrations, honeypot hits,
  throttled requests, failed coupon checks, MB uploaded, rows marked `spam`). The backend emails
  camila@ when a day exceeds a threshold (initially: > 10 honeypot hits, > 20 throttled
  requests, or the daily upload cap reached). **Captcha rule (Q-19):** no captcha at launch;
  enable Cloudflare Turnstile (free, verified server side) if alerts fire on 3+ days in a week or
  Cami marks more than 2 `spam` rows in a week.

## 6. Business Rules
- BR-E01: Until Cami provides her SINPE Móvil number and account name, the instructions show
  `0000-0000 (POR CONFIRMAR / TO BE CONFIRMED)` and "Nombre por confirmar" with a visible
  placeholder marker (PROJECT_SPEC BR-002). Release gate: never release with placeholder values.
- BR-E02: Prices in Costa Rican colones (₡, CRC), whole colones; 0 = free event.
- BR-E03: Amount due = price × (1 − discount%), rounded to the nearest colón (Q-13).
- BR-E04: File name = participant name (accents removed, spaces → `_`, only `[A-Za-z0-9_-]`) +
  `_` + registration date `YYYY-MM-DD` + `_` + event code + `.jpg`; `_2`, `_3`… on collision.
- BR-E05: Registrations are created `new`; `confirmed`, `refund/cancelled` and `spam` are set only
  by Cami.
- BR-E06: The automatic check is an aid, not proof of payment; Cami confirms against her bank.
- BR-E07: Only published events still open for registration (BR-E09) and not sold out show
  payment instructions; late arrivals are stored and flagged (FFR-024).
- BR-E08: Personal data is used only to manage the registration and contact the participant
  about the event.
- BR-E09: Times are Costa Rica time (`America/Costa_Rica`), evaluated on the server. Every event
  has a start time. **Registration closes 12 hours before the start** (Q-21); the event stays
  listed (button disabled, "Inscripciones cerradas / Registration closed") until it starts.
- BR-E10: Counting registrations (capacity, one-per-email, coupon uses) are rows with status
  `new` or `confirmed`, flagged or not; `refund/cancelled` and `spam` free the place and the
  coupon use (#14, #15).
- BR-E11: Release gates (checked in the release checklist): real SINPE values configured
  (BR-E01); privacy notice reviewed by a lawyer (Q-11/Q-25); email templates approved by Cami;
  Lifetools logo in place.
- BR-E12: Minors are not handled specially; Cami deals with any case herself (Q-23).
- BR-E13: When state changes between the visitor seeing the form and `register` arriving (event
  closed, unpublished or sold out; coupon no longer valid): if a payment screenshot is attached
  (the visitor may have paid), store and flag (FFR-024) — never refuse; if nothing was paid
  (₡0), refuse with the matching error. The server needs no record of when the form opened.
  Accepted trade-off: anyone who attaches any image can get past a full or closed event; such
  rows are stored flagged (`needsReview`), never confirmed automatically, count against the
  global throttles and daily upload cap (§12), and Cami can refund, cancel or mark them `spam`.

## 7. Inputs
- Visitor: event, name, email, WhatsApp (international), coupon (optional), screenshot (paid
  events), consent, site language.
- Cami: `Events`, `Coupons` rows; status and notes on registration rows.
- Configuration: script properties (contract §9), never in the repo.

## 8. Outputs
- Site: cards, ticker, form, discounted amount, confirmation reference or error.
- Drive: one JPEG per paid registration, in the event's subfolder.
- Sheets: one row per registration; `Metrics` daily rows.
- Email: confirmation and "payment not validated" to participants; abuse alerts to camila@.

## 9. Main Flow
1. The site loads and requests events in the active language.
2. The ticker shows the closest events; the section shows one card each.
3. The visitor selects "Register" (or a ticker item, then the card's button).
4. Paid event: the form shows price and SINPE instructions; free event: no payment part.
5. Optionally the visitor applies a coupon; the amount updates.
6. Paid event: the visitor pays by SINPE Móvil, then fills the form and attaches the screenshot.
7. The site validates and sends the registration.
8. The backend re-validates; under a lock it checks capacity and duplicates and appends the row
   (`new`); it stores the file (paid), returns the reference, then runs the check and sends the
   emails (confirmation or "registration received", and "not validated" when applicable).
9. Cami reviews rows (`needsReview` first) and sets `confirmed`, `refund/cancelled` or `spam`.

## 10. Alternate Flows
- Coupon refused: message, full price, the visitor can continue without it.
- Check `mismatch`/`unreadable`: stored, `needsReview` TRUE, "not validated" email sent.
- Sold out / closed before the form opened: button disabled, no form.
- Already registered with that email: message, nothing stored.
- Refund or cancellation: Cami handles it outside the site and sets `refund/cancelled`.

## 11. Edge Cases
- Event closes or sells out between form open and submit → stored and flagged (FFR-024).
- Two participants with the same name on the same day → file suffix (BR-E04).
- Non-image renamed `.jpg` → rejected (type from content).
- HEIC screenshot → converted to JPEG before storage/OCR (method chosen in the spike).
- Backend unavailable → section and ticker hidden; form shows retry.
- Email sending fails → the registration is still stored; `checkDetails` gets `email failed` and
  `needsReview` is TRUE.

## 12. Error Scenarios and abuse controls
- Validation errors: field messages in the active language (contract §8).
- Backend quota/timeout: retry message, same submission ID (FFR-022).
- Abuse: the endpoint is anonymous and receives no client IP or headers (ADR-008), so controls
  are global: `CacheService`/`LockService` throttling of registrations and coupon checks, a daily
  upload cap (count and MB), coupon codes of 8+ random characters, a honeypot field, metrics and
  alerts (FFR-029), and Turnstile when the captcha rule triggers. Limits apply to every write,
  including flagged ones.

## 13. Data
Exact tabs, columns, codes and Drive layout: [EVENTS_API_CONTRACT.md §6](EVENTS_API_CONTRACT.md#6-persistence-mapping).

## 14. External Dependencies
- Google Apps Script (web app, `SpreadsheetApp`, `DriveApp`, Advanced Drive Service OCR,
  `GmailApp`/`MailApp`, `LanguageApp`, `LockService`, `CacheService`) in the `lifetoolscr.com`
  Workspace — free within quotas.
- Cloudflare Turnstile (only if the captcha rule triggers).
- SINPE Móvil — outside the system.

## 15. Permissions
- Visitors: anonymous; read published events, check one coupon, create a registration.
- Cami / owner: edit the spreadsheet and Drive folder; the owner deploys the script.
- The script runs as the owning Workspace account; files and the spreadsheet are not public.

## 16. Feature-specific NFRs
- FNFR-001 Privacy: Ley 8968 baseline (notice, consent, purpose, access/deletion on request to
  camila@); final review by a lawyer before production (BR-E11). No personal data in logs or the
  repo.
- FNFR-002 Secrets: script properties only; the public `/exec` URL is the only backend value in
  the client bundle.
- FNFR-003 Performance: the events request never blocks first paint; > 3 s or failure hides the
  section.
- FNFR-004 Accessibility: keyboard-usable cards and form, labelled fields, ticker pausable and
  `prefers-reduced-motion` aware.
- FNFR-005 Bilingual: all UI strings EN/ES; event text per FFR-028; emails per `lang`.
- FNFR-006 Responsive: desktop, 900px, 640px (NFR-002).
- FNFR-007 Cost: ₡0 recurring (NFR-003).

## 17. Acceptance Criteria
Per story in [USER_STORIES.md](USER_STORIES.md) (US-017..US-025).

## 18. Out of Scope
- Payment gateways, card payments, refunds through the site; automatic bank confirmation.
- Participant accounts; editing/cancelling a registration from the site.
- An admin web panel (Cami uses the spreadsheet).
- Group/proxy registrations (Q-22); electronic invoices and SINPE limits (Q-27, revisit later).
- WhatsApp messages.

## 19. Assumptions
- Apps Script is the first backend (ADR-008); Node.js remains the path if needs outgrow it.
- Drive OCR reads the common Costa Rican banks' SINPE screenshots; proved in the spike with
  Cami's samples before US-022 is implemented.
- A Workspace alias can send mail from the script without a paid seat; proved in the spike,
  fallback camila@ (FFR-026).
- HEIC can be converted to JPEG without a new frontend library; if not, a library is proposed
  through TECH_STACK + ADR (NFR-004).

## 20. Decisions (open questions answered 2026-10-19)
| # | Decision |
|---|---|
| Q-1 | Spanish in the sheet; English by automatic translation with optional overrides (FFR-028); emails in the participant's language |
| Q-2 | `Coupons` tab |
| Q-3 | Store, flag (`needsReview`) and email the participant "payment not validated", reply to camila@ |
| Q-4 | No transfer description needed |
| Q-5 | Registration date; one subfolder per event, created when new |
| Q-6 | International numbers with country code |
| Q-7 | `lifetoolscr.com` Workspace |
| Q-8 | Confirmation email to participants |
| Q-9 | Logo from Cami during development |
| Q-10 | Hide section and ticker when there are no events |
| Q-11, Q-25 | Generic notice from standard practice; lawyer review before production |
| Q-12 | US-012/US-013 stay; revisit after this feature |
| Q-13 | Nearest colón |
| Q-14 | Accept all screenshot formats |
| Q-15 | One registration per email per event, with a message |
| Q-16 | Free events supported, same form without payment |
| Q-17 | Capacity in the sheet; "Agotado / Sold out" |
| Q-18 | Samples from Cami during development |
| Q-19 | No captcha at launch; metrics, alerts and the Turnstile rule (FFR-029) |
| Q-20 | PROJECT_SPEC changes approved (could change with another payment platform) |
| Q-21 | Registration closes 12 h before start |
| Q-22 | One payment per participant |
| Q-23 | No special handling of minors |
| Q-24 | Max uses per coupon set in the data; one use per email |
| Q-26 | Exact amount; otherwise flag + email |
| Q-27 | Not now; revisit with more/expensive events |
| #14/#15 | Counting rule BR-E10; status renamed `refund/cancelled` |
| #16 | Unreadable → also emailed and flagged |
| #17 | Sender alias if free, else camila@ in Cami's voice |
| #18 | Automatic translation with overrides |
| #19 | Risk of false "not validated" emails accepted |
| Spam status | Keep `spam` as a status Cami can set (frees the place and the coupon use; counted in `Metrics` for the captcha rule) — owner, 2026-10-19: "keep spam status" |
| BR-E13 | Approved, including its trade-off — owner, 2026-10-19: "BR-E13 approved" |

## 21. Approval
- Approved by: Raul Casanas (product owner), on merge of PR #21.
