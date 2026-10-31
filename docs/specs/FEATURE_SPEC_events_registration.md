# FEATURE_SPEC — Upcoming events and paid registration

## Metadata
- Feature ID: FS-001
- Feature: Upcoming events, registration with SINPE Móvil payment proof, coupons, capacity,
  participant emails, events ticker
- Version: 1.14 (refined with the owner's answers of 2026-10-19, CMP-021; Discovery draft 0.1 in
  CMP-019; v1.1: §20 #17 alias to test, owner 2026-10-20 — CMP-035; v1.2: FFR-031, §20 form
  decisions, form order in FFR-008 and §9 steps 4–6, 24-hour times in FFR-002, FFR-004 refresh
  rule, FFR-032 OCR retry, FFR-029 action alerts, §20 sender alias, owner 2026-10-20 —
  CMP-036; v1.3: FFR-033 events cache refreshed every 5 minutes, owner 2026-10-20 — CMP-037;
  v1.4: `events` client wait raised from 3 s to 5 s (FFR-004, FNFR-003) and drafts not
  validated (FFR-019), owner 2026-10-20 — CMP-038; v1.5: FFR-014 original-format fallback
  and its FFR-017 payment check, owner 2026-10-20 — CMP-039; v1.6: FFR-019 reserved codes,
  codes as text, ₡0 on a duplicated code — CMP-040; v1.7: BR-E11 names the alert email and
  reason phrases — CMP-041; v1.8: BR-E11 adds the form wording, owner 2026-10-21 — CMP-042;
  v1.9: FFR-028 translations in a sheet tab, FFR-019 reserved name — CMP-046; v1.10: Cami's
  review of the texts, BR-E11 legal review by Cami (owner decision), amount format, optional
  contact checkbox (FFR-018, contract v1.5) — CMP-058; v1.11: FFR-029 alert email to every
  address in `ALERT_TO`, owner 2026-10-22, and the `Metrics` row up to 5 minutes behind, owner
  2026-10-27 — CMP-061; v1.12: FFR-033 the payment re-check works 06:00–22:00 Costa Rica time and
  the triggers report a failure only after 10 in a row, owner 2026-10-28/29 — CMP-100; v1.13:
  FFR-004 the room reserved while events load, owner 2026-10-29 — CMP-106; v1.14: FFR-034
  registration notice to Cami, owner 2026-10-31 — CMP-111)
- Status: Approved (v1.0 on merge of PR #21; v1.1 on merge of PR #26; v1.2 on merge of PR #30;
  v1.3 on merge of PR #32; v1.4 on merge of PR #34; v1.5 on merge of PR #35; v1.6 on merge of
  PR #37; v1.7 on merge of PR #40; v1.8 on merge of PR #41; v1.9 on merge of PR #45; v1.10 on merge of PR #52; v1.11 on merge of PR #57; v1.12 on merge of PR #93; v1.13 on merge of PR #101; v1.14 Approved on merge of the CMP-111 PR)
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
| US-020 | Discount coupon at registration | FFR-012, FFR-013, FFR-021, FFR-024 (coupon changed), FFR-031, BR-E13 |
| US-021 | Registrations stored in Google Drive and Sheets | FFR-014..FFR-016, FFR-024, FFR-025, FFR-030, BR-E13 |
| US-022 | Automatic check of the payment screenshot | FFR-017, FFR-032 |
| US-023 | Cami manages events, capacity and coupons without a deploy | FFR-019, FFR-020, FFR-033 |
| US-024 | Abuse metrics and alerts | FFR-029 |
| US-025 | Participant emails (confirmation, payment not validated) | FFR-026 |
| US-026 | Cami is told about each new registration | FFR-034 |

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
- FFR-002: Each card shows the event name, date and time (24-hour `HH:mm` in both languages),
  brief description, price (or "Gratis / Free") and the event art image; when an event has no
  image, the Lifetools logo.
- FFR-003: Each card has a register button; it is disabled when registration is closed
  (12 h before start, BR-E09) or the event is sold out (FFR-025).
- FFR-004: When the page loads and there are no upcoming events, or the backend is unavailable
  or slower than 5 s, the section and the ticker are hidden (Q-10) and the rest of the page
  renders normally. While the request is pending, their room is reserved, so the page does not
  jump when events arrive; when none come back, the room closes smoothly, with no visible text
  (CMP-102, owner 2026-10-29). A later refresh (language change, or a stale-event refresh from the form)
  that fails keeps the events already shown, so an open registration form and its typed data
  are not lost; the backend re-checks every registration anyway (BR-E13). Owner, 2026-10-20:
  "(a)" (keep the events shown on a failed refresh).
- FFR-025: Capacity: each event has a capacity in the `Events` tab. When the count of counting
  registrations (BR-E10) reaches it, the card shows "Agotado / Sold out" and the register button
  is disabled. At `register` time the server applies BR-E13: a ₡0 registration is refused
  (`SOLD_OUT`); a paid one (screenshot attached) is stored and flagged (FFR-024). The capacity and
  duplicate check plus the row append are serialized with `LockService` so two people cannot take
  the last place; OCR and emails run after the lock is released.
- FFR-028: Event name and description are written in Spanish by Cami (Q-1). When the site is in
  English, the backend returns an English version: the optional `nameEn`/`descriptionEn` columns
  if filled, otherwise an automatic translation (Apps Script `LanguageApp`, free), stored in
  the `Translations` tab keyed by a hash of the Spanish text, so it is recomputed only when that
  text changes; rows no valid event uses are pruned (CMP-045: script properties hit the
  Apps Script settings page's 50-entry limit).

Ticker banner
- FFR-005: A banner at the top of the page scrolls right-to-left continuously, showing up to the
  N closest upcoming events (N = 2 by default) with name and date; selecting an item scrolls to
  that event's card.
- FFR-006: The banner pauses on hover/focus, is static when the visitor's system requests
  reduced motion, and is hidden when there are no upcoming events.

Registration
- FFR-007: The register button opens the form for that event only (name, date, time, price at
  the top).
- FFR-008: For paid events the form shows the payment instructions after the contact fields and
  the coupon, and before the screenshot field: method "SINPE Móvil", Cami's number and account
  name, and the amount to pay (after any coupon). No transfer
  description is required (Q-4: the screenshot is attached in the same form).
- FFR-009: Fields: Participant name, Email, WhatsApp number (with country code), payment
  screenshot (paid events only), consent. All required. One registration = one participant = one
  payment (Q-22).
- FFR-010: Client-side validation (repeated on the server, contract §3.3): valid email; WhatsApp
  in international format `+<country code><number>`, e.g. `+50688880000` (Q-6); the screenshot
  may be any common image format, including iPhone HEIC/HEIF (Q-14), up to 5 MB.
- FFR-011: On submit the participant sees a confirmation with a registration reference, or a
  clear error that keeps the entered data. Each form attempt carries a client-generated
  submission ID (UUID) (FFR-022).
- FFR-018: The form shows a privacy notice (generic, Ley 8968-based draft in
  [EVENTS_EMAILS_AND_PRIVACY.md](../ux/EVENTS_EMAILS_AND_PRIVACY.md) §3, approved by Cami as the
  legal review, 2026-10-26 — BR-E11) and requires an explicit consent checkbox. Below it, an
  optional, unticked second checkbox asks whether the person wants Cami to contact them about
  other events and news; it is stored as `contactOptIn` and never blocks the registration
  (contract v1.5; owner, 2026-10-26, CMP-058).
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
- FFR-031: A coupon code typed but not applied blocks submit with a message asking the visitor to
  apply the coupon or clear the field (EN/ES), so the amount paid always matches the amount shown
  (owner, 2026-10-20).
- FFR-013: A coupon is a percentage discount (1–100%) tied to one event, with a maximum number of
  uses set by Cami and **one use per email** (Q-24). Unknown, inactive, expired, exhausted or
  already-used coupons are refused with a message and the full price stays. A use counts while
  the registration counts (BR-E10) and is freed if Cami marks it `refund/cancelled` or `spam`.
- FFR-021: Coupon codes are never sent to the browser in bulk.

Storage (server side)
- FFR-014: The server re-validates every field, converts the screenshot to JPEG, stores it as
  `<root>/<eventCode>/<ParticipantName>_<YYYY-MM-DD>_<eventCode>.<ext>` (`ext` = `jpg`, or the
  original extension when conversion fails; registration date, BR-E04),
  creating the event's subfolder if it is new (Q-5), and appends a row to the event's tab. Every
  user-controlled value written to a cell is neutralized as text (a leading `=`, `+`, `-`, `@`,
  tab or CR is prefixed with `'`). If the screenshot cannot be converted, the original is stored
  with its own extension and `checkDetails` notes `stored as original format: <ext>`; the
  registration is not refused and the note alone does not set `needsReview` (contract §3.3
  v1.2). Owner, 2026-10-20: "Save the original (Recommended)".
- FFR-015: Each event has its own tab named by event code, created with the header row on its
  first registration.
- FFR-016: Row columns and order: contract §6 (timestamp, submission ID, reference, event code,
  name, email, WhatsApp, language, coupon, discount %, amount due, screenshot URL, check result,
  check details, needsReview, status, consent time, notes, contact opt-in). Status is `new` on creation; only Cami
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
  OCR Google Doc is deleted right after reading. For a screenshot stored in its original format
  (FFR-014) that Drive OCR cannot read (the import fails or finds no usable text), the result is `unreadable` at once, with no retries
  (not a service failure under FFR-032); it sets `needsReview` so Cami checks it by hand, and the
  participant gets **no** "payment not validated" email. Owner, 2026-10-20: "Cami checks by hand
  (Recommended)".
- FFR-032: If the OCR call fails for a service reason (e.g. Google's per-user OCR rate limit)
  after its in-execution retries, the row keeps check result `pending`. Only the "payment not
  validated" email waits for the check; the confirmation or "registration received" email is
  still sent when the row is saved (FFR-026). A time-driven trigger retries the `pending` rows
  every 10 minutes; when a retry gets `ok`, `mismatch` or `unreadable`, it writes the result and
  sends the "not validated" email if FFR-017 requires it. A row still `pending` 24 hours after
  it was saved is no longer retried and triggers that day's alert email (FFR-029),
  which lists it for Cami to check by hand; its participant gets no "not validated" email. `pending` alone
  never sets `needsReview` (FFR-030). Owner, 2026-10-20 (spike finding, CMP-024); the
  10-minute interval and the 24-hour limit approved by the owner, 2026-10-20: "OK on the retry
  proposal".

Participant emails
- FFR-026: The backend sends, in the participant's site language (`lang`), with reply-to
  `camila@lifetoolscr.com` and sender a Workspace alias (e.g. `eventos@`/`no-reply@`) if the
  spike confirms it works without a paid seat, otherwise `camila@lifetoolscr.com` written in
  Cami's voice (Q-8, #17):
  - a **confirmation email** for every stored registration that is not flagged under FFR-024
    (event, date/time, amount, reference; for paid events: "Cami will confirm your payment");
  - a **"registration received" email** instead of the confirmation for registrations stored and
    flagged under FFR-024: it does not promise a place and says Cami will contact them;
  - a **"payment not validated" email** when the check result is `mismatch` or `unreadable`
    (except an original-format screenshot OCR cannot read, FFR-017):
    "The payment for <event> could not be validated", with a short explanation that the SINPE
    screenshot does not show the expected account or exact amount, and a request to reply to
    camila@lifetoolscr.com with the correct proof (Q-3, Q-26).
  Templates (ES/EN): [EVENTS_EMAILS_AND_PRIVACY.md](../ux/EVENTS_EMAILS_AND_PRIVACY.md)
  (draft), approved by Cami before release (BR-E11). The owner accepts the risk of false "not validated" emails; if they happen too
  often, sending moves behind a manual action in the spreadsheet (#19).

Administration (Cami)
- FFR-019: `Events` tab: code, name, description, optional `nameEn`/`descriptionEn`, date, time
  (required), price CRC (0 = free), capacity, image URL, published. Codes unique,
  `[A-Z0-9-]{2,20}`, not the name of any non-event tab (currently `Events`, `Coupons`, `Translations`,
  `Metrics`, case-insensitive), and always written to registration cells as text so Sheets
  never turns one into a date or number (contract §6). The code columns of the `Events` and
  `Coupons` tabs are formatted as plain text (runbook §2.1), so a code Cami types, like
  `2026-11`, is not turned into a date and rejected. Rows with a duplicated code are unpublished; under
  BR-E13 a paid registration that arrives for one is stored and flagged (`checkDetails`:
  `duplicate event code`) and a ₡0 one is refused (`REGISTRATION_CLOSED`). The stored row,
  the amount due, the payment check and the emails use the first valid published row of that
  code (top-most in the tab), or, if none is published, the first valid row; if no row of that code is valid, `EVENT_NOT_FOUND`. Only published
  rows are validated and queued for the alert email; drafts (published unchecked) are ignored
  until published, except that a code shared with a published row is still reported as
  duplicated (contract §6, v1.1). Owner, 2026-10-20: "No, only published".
- FFR-020: `Coupons` tab: event code, coupon code, discount %, max uses, active, optional expiry
  (Q-2). Cami adds or edits rows; no deploy. Coupon codes are 8–20 characters, `A-Z` and `0-9`
  only (hard to guess, §12); rows with an invalid code, discount or max uses are ignored and
  listed in the alert email so Cami can fix them.
- FFR-033: To answer within the 5 s limit (FNFR-003), the backend serves the `events` response
  from a cache that a time-driven trigger refreshes every 5 minutes (one entry per language).
  Changes Cami makes in the `Events`/`Coupons` tabs therefore show on the site within 5 minutes.
  This refresh runs around the clock, so an event's registration closes on the site on time,
  also at night. Only the pending payment re-check (FFR-032) works just from 06:00 to 22:00 Costa
  Rica time (contract §9 `RETRY_CHECK_HOURS`, owner 2026-10-28 and 2026-10-29): a payment check
  still pending at night is retried after 06:00. A time trigger's failure is reported (Google's
  email) only after 10 failed runs in a row (`TRIGGER_FAIL_ALERT_AFTER`).
  A registration that changes an event's availability (e.g. sells it out) rebuilds the cache
  after the lock is released (like OCR and emails, FFR-025) and before it answers, rather than
  clearing it, so the next visitor never waits for a cold
  request; the rebuild adds a few seconds to that registration's own request. The
  clock-based fields (`registrationOpen`, 12 h before start, BR-E09; an event dropped once it
  starts, contract §3.1) may lag by up to 5 minutes; a registration sent in that window is
  handled by BR-E13 on the server. Tests (CMP-025, CMP-033) check these boundaries against a
  5-minute tolerance. Owner, 2026-10-20 (spike and CMP-025 timing: a cold `events` request
  took about 5 s). If a refresh fails, the last good answer is served for up to 20 minutes (the
  failed run shows in Executions); the backend still re-checks every registration (BR-E13).

Abuse metrics
- FFR-029: A `Metrics` tab gets one row per day (accepted registrations, honeypot hits,
  throttled requests, failed coupon checks, MB uploaded, rows marked `spam`). The backend emails
  every address in the `ALERT_TO` script property (the owner and camila@; empty → camila@ through
  `MAIL_REPLY_TO`; contract §9 v1.6, owner suggestion 2026-10-22: "it's possible we would need
  that alert email to reach me as well", CMP-052) when a day exceeds a threshold (initially: > 10 honeypot hits, > 20 throttled
  requests, or the daily upload cap reached), and also when there is something Cami must act
  on: an invalid `Events`/`Coupons` row (FFR-019, US-023 AC5) or a check stuck `pending` past
  its limit (FFR-032). At most one alert email per day: it is sent at the first trigger of the
  day (Costa Rica time) and lists everything found so far; anything found after it goes into,
  and triggers, the next day's email (owner, 2026-10-20: "OK on the retry proposal").
  The `Metrics` row may lag the requests by up to 5 minutes: the daily counters are written by
  the 5-minute trigger (owner, 2026-10-27: "OK, 5 minutes is fine", CMP-053).
  **Captcha rule (Q-19):** no captcha at launch;
  enable Cloudflare Turnstile (free, verified server side) if alerts fire on 3+ days in a week or
  Cami marks more than 2 `spam` rows in a week.
- FFR-034: Registration notice to Cami (owner, 2026-10-31: "Cami needs an email notification
  when someone registers to an event"; asked how often, what it contains and who receives it:
  "One email per registration (Recommended)", "Short: event, name, payment status
  (Recommended)", "Cami only"). For every newly stored registration, counting or flagged under
  FFR-024, the backend sends one short email to the address in the `NOTIFY_REGISTRATION_TO`
  script property (contract §9 v1.10):
  - **When:** after the row is saved and after the participant's email (FFR-026), once per
    stored row: a retry with the same submission ID (FFR-022) sends nothing; a refused request
    (validation, duplicate email, `SOLD_OUT` for ₡0, rate limits, honeypot) sends nothing.
  - **Content** (one message in Spanish and English, like the alert email, FFR-029; text in
    [EVENTS_EMAILS_AND_PRIVACY.md](../ux/EVENTS_EMAILS_AND_PRIVACY.md) §2c): the event name
    and date, the participant's name, the amount (₡0 shown as free), the payment check result
    at the time of saving (`checkResult`), whether the row needs review (`needsReview`, with the
    FFR-024 reason when flagged), and the registration reference. **Never** the participant's
    email, WhatsApp number, coupon code, screenshot or a link to it: Cami reads those in the
    spreadsheet.
  - **Recipient:** only the addresses in `NOTIFY_REGISTRATION_TO` (Cami's; the owner types it,
    it is never in the repo). Empty → no notice is sent (the default on staging unless a test
    sets it); an invalid address is skipped and logged without the address. It does not fall
    back to `ALERT_TO` or `MAIL_REPLY_TO`.
  - **Failure:** sending it never delays, fails or changes the registration, its response or
    the participant's email; a failure is logged by error name only and does not set
    `needsReview` (the row is still in the sheet). The participant emails come first: when
    Google's remaining daily email quota is below a reserve of 20, the notice is skipped and
    logged (error name only), and the registration is unaffected.

## 6. Business Rules
- BR-E01: Until Cami provides her SINPE Móvil number and account name, the instructions show
  `0000-0000 (POR CONFIRMAR / TO BE CONFIRMED)` and "Nombre por confirmar" with a visible
  placeholder marker (PROJECT_SPEC BR-002). Release gate: never release with placeholder values.
- BR-E02: Prices in Costa Rican colones (₡, CRC), whole colones; 0 = free event.
- BR-E03: Amount due = price × (1 − discount%), rounded to the nearest colón (Q-13).
- BR-E04: File name = participant name (accents removed, spaces → `_`, only `[A-Za-z0-9_-]`) +
  `_` + registration date `YYYY-MM-DD` + `_` + event code + `.jpg` (or the original extension,
  FFR-014); `_2`, `_3`… on collision.
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
  (BR-E01); privacy notice reviewed (by Cami, as the legal review, owner decision 2026-10-26;
  Q-11/Q-25); email templates approved by Cami
  (the three participant emails with their reason phrases and the internal alert email); the
  registration form's wording (EN/ES labels and messages, PR #29) reviewed by the owner and
  Cami; Lifetools logo in place.
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
- Drive: one JPEG per paid registration (the original format if conversion fails, FFR-014), in
  the event's subfolder.
- Sheets: one row per registration; `Metrics` daily rows.
- Email: confirmation and "payment not validated" to participants; abuse alerts to the `ALERT_TO` addresses (FFR-029); one registration notice per stored registration to `NOTIFY_REGISTRATION_TO` (FFR-034).

## 9. Main Flow
1. The site loads and requests events in the active language.
2. The ticker shows the closest events; the section shows one card each.
3. The visitor selects "Register" (or a ticker item, then the card's button).
4. The form shows the event and its price; the visitor fills in name, email and WhatsApp.
5. Optionally the visitor applies a coupon (checked for that email); the amount updates.
6. Paid event: the form shows the SINPE instructions with the amount to pay; the visitor pays by
   SINPE Móvil and attaches the screenshot. Free event or ₡0: no payment part.
7. The site validates and sends the registration.
8. The backend re-validates; under a lock it checks capacity and duplicates and appends the row
   (`new`); it stores the file (paid), returns the reference, then runs the check and sends the
   emails (confirmation or "registration received", and "not validated" when applicable).
9. Cami reviews rows (`needsReview` first) and sets `confirmed`, `refund/cancelled` or `spam`.

## 10. Alternate Flows
- Coupon refused: message, full price, the visitor can continue without it.
- Check `mismatch`/`unreadable`: stored, `needsReview` TRUE, "not validated" email sent (except
  an original-format screenshot OCR cannot read: no email, FFR-017).
- Sold out / closed before the form opened: button disabled, no form.
- Already registered with that email: message, nothing stored.
- Refund or cancellation: Cami handles it outside the site and sets `refund/cancelled`.

## 11. Edge Cases
- Event closes or sells out between form open and submit → stored and flagged (FFR-024).
- Two participants with the same name on the same day → file suffix (BR-E04).
- Non-image renamed `.jpg` → rejected (type from content).
- HEIC screenshot → converted to JPEG before storage/OCR (method chosen in the spike); if the
  conversion fails, the original is stored and noted (FFR-014).
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
  camila@); final review by Cami before production, standing as the legal review (owner decision
  2026-10-26, BR-E11). No personal data in logs or the
  repo.
- FNFR-002 Secrets: script properties only; the public `/exec` URL is the only backend value in
  the client bundle.
- FNFR-003 Performance: the events request never blocks first paint; > 5 s or failure hides the
  section. The limit was 3 s until 2026-10-20; the owner raised it to 5 s after CMP-025 staging
  timing showed about 1 in 10 cached answers taking 3.4–4.6 s (Apps Script start-up).
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
| Q-11, Q-25 | Generic notice from standard practice; reviewed by Cami before production (owner decision 2026-10-26, replacing the lawyer review; see the CMP-058 rows below) |
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
| #17 | Sender alias if free, else camila@ in Cami's voice. Alias to test: `no-reply@lifetoolscr.com` (owner, 2026-10-20) |
| #18 | Automatic translation with overrides |
| #19 | Risk of false "not validated" emails accepted |
| Spam status | Keep `spam` as a status Cami can set (frees the place and the coupon use; counted in `Metrics` for the captcha rule) — owner, 2026-10-19: "keep spam status" |
| BR-E13 | Approved, including its trade-off — owner, 2026-10-19: "BR-E13 approved" |
| Form order | The coupon comes before the SINPE instructions and the screenshot (§9 steps 5–6) — owner, 2026-10-20, answer 2 to "coupon before the screenshot?": "yes" |
| Unapplied coupon | Submit is blocked until the coupon is applied or cleared (FFR-031) — owner, 2026-10-20, answer 3: "a" |
| Time format | 24-hour times in both languages — owner, 2026-10-20, answer 4: "24h" |
| Form wording (BR-E11) | Merge the registration form (PR #29) with its draft EN/ES wording; the owner and Cami review it before release, as a release gate — owner, 2026-10-21, asked "How do you want to handle the sign-up form's wording (labels, messages, the two new texts above)?" (options: merge now, review later; approve it now; review before merging): "Merge now, review later (Recommended)" |
| Legal review (BR-E11, CMP-058) | Cami's review of the privacy notice counts as the legal review; no lawyer review before release — owner, 2026-10-26, asked "Cami filled in Part B herself (the legal approval is signed 'Camila Hernandez'), not a lawyer. Our release rule (BR-E11) says a LAWYER reviews the privacy notice before going live. Her changes also widen it: she wants to use participants' emails for 'other topics' too, which under Costa Rica's Law 8968 may need separate consent. How do we proceed?" (options: still get a lawyer; Cami's review is enough): "Cami's review is enough" |
| WhatsApp example (CMP-058) | The form's WhatsApp example is the neutral `+50688880000`, not Cami's number — owner, 2026-10-26, asked "Cami wants the WhatsApp example in the form to be [Cami's number, omitted]. That's her real SINPE number, and our rule says SINPE data never goes in the repo (the form text lives in the public code). It would also be shown publicly on the site. OK to use it?" (options: use a neutral example; use Cami's number): "Use a neutral example (Recommended)". The number is omitted from the quote on purpose: SINPE data never goes in the repo (FNFR-001/002, BR-E01) |
| Amount format (CMP-058) | `₡15,000` (comma) in both languages, in the emails and on the site — owner, 2026-10-26, asked "Cami wants amounts with a comma in both languages (₡15,000). Today Spanish emails AND the website show ₡15 000. Change where?" (options: emails and website; emails only): "Emails and website (Recommended)" |
| Reason phrases (CMP-058) | "Registration received" email: "…, pero {motivo}." with the phrases in EVENTS_EMAILS_AND_PRIVACY §1b — owner, 2026-10-26, asked whether to use the proposed rewording of Cami's comments (options: yes, use that; ask Cami first): "Yes, use that (Recommended)" |
| Contact consent (FFR-018, CMP-058) | Keep the required consent checkbox for the registration and add an optional, unticked second checkbox for other contact ("Quiero que Cami me contacte sobre otros eventos y novedades." / "I'd like Cami to contact me about other events and news."), stored as `contactOptIn` (contract v1.5) — owner, 2026-10-26, asked "The new privacy notice lets Cami contact people beyond the event (Cami's change), but the checkbox still says 'I authorize the use of my data for this registration' — so people only agree to the narrower use. How should the consent work?" (options: add optional 2nd box; widen the one box; keep as is): "Add optional 2nd box (Recommended)" |
| Events wait (FFR-004, FNFR-003) | The site waits up to 5 s (was 3 s) for the `events` answer before hiding the section and the ticker; the page itself never waits — owner, 2026-10-20, asked "On staging, about 1 in 10 loads of the event list took longer than the site's 3-second wait (3.4 s and 4.6 s), so for those visitors the events section and ticker stay hidden. The page itself is never slowed down; the events just load in after it. How should we handle it?" (options: wait up to 5 s; accept for now; retry once; remember the last list): "Wait up to 5 s" |
| Screenshot format (FFR-014) | If conversion to JPEG fails, store the original with its own extension and a `checkDetails` note; never refuse the registration for it — owner, 2026-10-20, asked "When someone pays and uploads their SINPE screenshot, the backend saves it as a JPEG. If Google can't convert an unusual image type (WebP or iPhone HEIC; most phones send JPEG anyway), what should happen?" (options: save the original; refuse the upload): "Save the original (Recommended)" |
| Original-format payment check (FFR-017) | A screenshot kept in its original format that OCR cannot read → `unreadable`, no retries, flagged for Cami, no "not validated" email — owner, 2026-10-20, asked "Follow-up to 'Save the original': when a screenshot is kept in its original format (rare WebP/HEIC), Google's automatic payment check may not be able to read it. What should happen then?" (options: Cami checks by hand; normal "not validated" email): "Cami checks by hand (Recommended)" |
| Draft rows (FFR-019) | Only published `Events` rows are validated and queued for the alert email; drafts are ignored (a code shared with a published row is still reported) — owner, 2026-10-20, asked "Should the daily alert email also flag mistakes in event rows Cami hasn't published yet …?": "No, only published" |
| Failed refresh (FFR-004) | Keep the events already shown when a later refresh fails; hide only at page load — owner, 2026-10-20: "(a)" |
| OCR rate limit (FFR-032) | Leave the check `pending` and retry it with a time-driven trigger; only the "not validated" email waits — owner, 2026-10-20: "(a)" |
| OCR retry bound and action alerts (FFR-032, FFR-029) | Retry every 10 minutes; after 24 h still `pending`, stop and list the row in the alert email; invalid sheet rows and limit-reached checks trigger the alert email, at most one per day, sent at the first trigger — owner, 2026-10-20: "OK on the retry proposal" |
| Sender alias (FFR-026, #17) | Send from `no-reply@lifetoolscr.com`; the script gets the Gmail scope `gmail.settings.basic` (it can read and change the owning account's Gmail settings), accepted by the owner — 2026-10-20: "add the permission for no-reply@"; the spike's alias test confirmed it is enough (the test email arrived From no-reply@lifetoolscr.com). A broader scope (e.g. full mailbox) goes back to the owner before deploy (ARCHITECTURE §12, TECH_STACK §11) |
| Events cache (FFR-033) | Cache the `events` response, refreshed by a time-driven trigger every 5 minutes; sheet changes show within about 5 minutes — owner, 2026-10-20: "OK on the cache" (first, a 60 s cache), then "b" (the 5-minute refresh, chosen because on a low-traffic site most visitors would otherwise hit an expired cache and a ~5 s answer) |

## 21. Approval
- Approved by: Raul Casanas (product owner), on merge of PR #21.
