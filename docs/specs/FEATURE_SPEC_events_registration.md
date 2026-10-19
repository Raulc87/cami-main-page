# FEATURE_SPEC — Upcoming events and paid registration

## Metadata
- Feature ID: FS-001
- Feature: Upcoming events, registration with SINPE Móvil payment proof, coupons, events ticker
- Version: 0.1 (Discovery draft, CMP-019)
- Status: Draft — open questions in §20 must be answered before the stories reach `Ready`
- Parent PROJECT_SPEC: [PROJECT_SPEC.md](PROJECT_SPEC.md)
- Related project requirements: G-005; FR-009 (bilingual UI); NFR-001 (static hosting),
  NFR-002 (responsive), NFR-003 (free tier first), NFR-004 (minimal stack); BR-002
- Related backlog: realizes part of US-012 (lead capture with persistence) and US-013 (Google
  Workspace integration) for the events use case — see §19 and Q-12
- Proposed architecture: [ADR-008](../decisions/ADR-008-events-backend-google-apps-script.md)
  (Proposed)
- Source: owner requirement, 2026-10-19 (Cami's request, relayed by Raul Casanas)

## 1. Objective
Let visitors discover Cami's upcoming events on the site and register for one, paying by
SINPE Móvil and uploading the payment screenshot. Each registration is stored for Cami in Google
Sheets (one tab per event) with the screenshot in Google Drive. Cami can publish discount
coupons per event, and a moving banner at the top of the page announces the closest events.

## 2. Context
Today the site is a static one-pager with an email CTA (FR-008); there is no backend, form or
persistence (NFR-001, TECH_STACK §5–6). Cami runs paid events (talks, workshops) and handles
sign-ups and SINPE payments by hand. This feature moves that flow onto the site while keeping
Cami's data in tools she already uses (Google Drive and Sheets) and at zero license cost.

It conflicts with parts of the approved PROJECT_SPEC, which must change first (AGENTS → Change
management) in the PR that refines these stories, with the owner's approval (Q-20):
- §4 Non-goals "No online payments or e-commerce today": the site would sell event places (the
  payment itself stays a manual SINPE transfer, no gateway).
- §4 Non-goals "No CMS: content is edited in code": the `Events`/`Coupons` tabs become a runtime
  content source edited by Cami.
- §10 "Persistence: none today": registrations are stored in Google Sheets and Drive.
- FR-008 (email as the booking channel) and NFR-001 (static hosting, no server runtime): a
  backend outside GoDaddy is added (ADR-008); the static site itself stays on GoDaddy.

It also introduces the project's first backend, first personal-data collection and first
third-party API, so it also needs: an ADR for the backend (ADR-008), TECH_STACK §5–7 updates, an
integration contract between the site and the backend, a privacy notice, and re-classifying the
project from **Simple** to **Standard** (TECH_STACK §1).

## 3. User Stories
Full stories with acceptance criteria are in [USER_STORIES.md](USER_STORIES.md) (all
`Proposed`):

| Story | Title | Requirements |
|---|---|---|
| US-017 | Upcoming events section | FFR-001..FFR-004, BR-E09 |
| US-018 | Upcoming-events ticker banner | FFR-005, FFR-006 |
| US-019 | Event registration form with SINPE Móvil payment proof | FFR-007..FFR-011, FFR-018, FFR-022, FFR-023 |
| US-020 | Discount coupon at registration | FFR-012, FFR-013, FFR-021 |
| US-021 | Registrations stored in Google Drive and Sheets | FFR-014..FFR-016, FFR-024 |
| US-022 | Automatic check of the payment screenshot | FFR-017 |
| US-023 | Cami manages events and coupons without a deploy | FFR-019, FFR-020 |

## 4. Preconditions
- A Google account owned by Cami (or the Lifetools Workspace) holds the Drive folder, the
  spreadsheet and the backend script (Q-7).
- Cami's SINPE Móvil number and account holder name are known (placeholder until Cami confirms,
  BR-E01).
- The Lifetools logo is available as a web image (Q-9).

## 5. Functional Requirements
Events section
- FFR-001: The page shows an "Upcoming Events" section with one card per published event that is
  still open (BR-E09), ordered by date and time ascending.
- FFR-002: Each card shows the event name, date (and time, if set), a brief description and the
  event art image; when an event has no image, the card shows the Lifetools logo instead.
- FFR-003: Each card has a button to register for that event.
- FFR-004: When there are no upcoming events, the section shows an empty-state message (or is
  hidden — Q-10) instead of empty cards.

Ticker banner
- FFR-005: A banner at the top of the page scrolls right-to-left continuously, showing at least
  the two closest upcoming events (name and date); selecting an item takes the visitor to that
  event's card / registration.
- FFR-006: The banner pauses on hover/focus and is static (no animation) when the visitor's
  system requests reduced motion; it is hidden when there are no upcoming events.

Registration
- FFR-007: Selecting an event's register button opens the registration form for that event only
  (event name, date and price shown at the top).
- FFR-008: Before the fields, the form shows the payment instructions: method "SINPE Móvil",
  Cami's SINPE number and account name, the amount to pay (after any coupon) and the text to put
  in the transfer description (Q-4).
- FFR-009: The form asks for Participant name, Email, WhatsApp phone number and the payment
  screenshot file; all are required.
- FFR-010: Client-side validation: email must be a valid address; WhatsApp number must be a
  valid phone number (Costa Rica 8 digits by default, international `+` format allowed — Q-6);
  the file must be an image (JPEG/PNG; HEIC handling Q-14) no larger than 5 MB.
- FFR-011: On submit the participant sees a confirmation with a registration reference, or a
  clear error message that keeps the entered data so they can retry. Each form attempt carries
  a client-generated submission ID (UUID); retrying with the same ID returns the original
  reference instead of creating another file or row (FFR-022).
- FFR-022: Idempotency: the backend stores the submission ID with the row; a request whose ID is
  already stored returns that row's reference and stores nothing new.
- FFR-023: Zero total: when the amount due is ₡0 (a free event or a 100% coupon), the form hides
  the payment instructions and the screenshot field, the row is stored with check result
  `not-required`, and no Drive file is created (confirmation of free events: Q-16).
- FFR-018: The form shows a privacy notice and requires an explicit consent checkbox before
  submit (Costa Rica Ley 8968; Q-11).

Coupons
- FFR-012: The form has an optional coupon field; applying a coupon validates it for **that
  event** on the server and shows the discounted amount before payment. Coupon checks are
  throttled globally (§12) so codes cannot be enumerated.
- FFR-013: A coupon is a percentage discount (1–100%) tied to one event; unknown, inactive or
  expired coupons are rejected with a message and the full price stays.

Storage (server side)
- FFR-014: The server re-validates every field (never trusts the client), stores the screenshot
  in the configured Drive folder named `<ParticipantName>_<date>_<EventCode>.<ext>`
  (normalization rules and which date: BR-E04, Q-5) and appends a row to the event's tab in the
  registrations spreadsheet. Every user-controlled value written to a cell is neutralized as
  text (a leading `=`, `+`, `-`, `@`, tab or CR is prefixed with `'`), because `appendRow`
  otherwise stores such values as live formulas.
- FFR-024: Event closed after payment: the payment instructions are shown only after the server
  confirms the event is open, but the visitor pays before submitting, so the event may close in
  between. If the event code exists but the event is now closed or unpublished, the backend
  **still stores** the registration (file and row) with status `new` and `checkDetails`
  `event closed at submit`, and tells the visitor Cami will contact them; it rejects only
  unknown event codes and invalid data. Cami then refunds or moves the participant.
- FFR-015: Each event has its own tab in the spreadsheet (named by event code); the server
  creates the tab with the header row if it does not exist.
- FFR-016: Each row stores: timestamp, submission ID, registration reference, event code,
  participant name, email, WhatsApp, coupon code, discount %, amount due (CRC), screenshot Drive
  URL, automatic check result and details (US-022), status, notes. Until US-022 ships, the check
  result is `pending`. Status is one of `new` (set on create),
  `confirmed`, `refund`; only Cami changes it after creation.

Payment screenshot check
- FFR-017: After storing the screenshot, the server extracts its text (OCR) and checks that it
  shows: Cami's SINPE number or account name, the amount due, and the expected description
  (event code). The result (`ok` / `mismatch: <fields>` / `unreadable`) is written to the row.
  The check never changes the status by itself; Cami confirms (BR-E06; strictness Q-3). Drive
  OCR works by converting the image into a temporary Google Doc; the backend deletes that Doc
  right after reading it, so no text copy of payment receipts accumulates (FNFR-001).

Administration (Cami)
- FFR-019: Events are defined in an `Events` tab of the same spreadsheet (code, name, date,
  time, brief description, price CRC, image URL, published flag); the site reads them at
  runtime, so publishing or editing an event needs no deploy. Event codes must be unique and
  match `[A-Z0-9-]{2,20}` (they name the tab and the file); if two rows share a code, **all**
  rows with that code are unpublished until Cami fixes it. A registration that arrives for a
  duplicated code is stored and flagged (`checkDetails`: `duplicate event code`) like FFR-024,
  not rejected, because the visitor may already have paid.
- FFR-020: Coupons are defined in a `Coupons` tab (event code, coupon code, discount %, active,
  optional expiry) — recommended over a JSON file in Drive (Q-2); Cami can add a coupon or change
  its value by editing a row.
- FFR-021: Coupon codes are never sent to the browser in bulk; the site only learns whether one
  code is valid for one event and its discount.

## 6. Business Rules
- BR-E01: Until Cami provides her SINPE Móvil number and account name, the instructions show a
  value no one can pay to — `0000-0000 (POR CONFIRMAR / TO BE CONFIRMED)` and "Nombre por
  confirmar" — with a visible "placeholder" marker (PROJECT_SPEC BR-002). **Release gate:** the
  feature must not be released while any placeholder payment value is configured (checked in
  the release checklist, not by a visitor-facing AC).
- BR-E02: Prices are in Costa Rican colones (₡, CRC), whole colones.
- BR-E03: Amount due = price × (1 − discount%), rounded to the nearest colón (Q-13).
- BR-E04: Screenshot file name = participant name (accents removed, spaces removed or `_`,
  only `[A-Za-z0-9_-]`) + `_` + date `YYYY-MM-DD` + `_` + event code, plus extension; if the name
  exists, append `_2`, `_3`…
- BR-E05: A registration is created with status `new`; `confirmed` and `refund` are set only by
  Cami in the spreadsheet.
- BR-E06: The automatic screenshot check is an aid, not proof of payment: a screenshot can be
  edited. Cami confirms against her bank before setting `confirmed`.
- BR-E07: Only published events that are still open (BR-E09) appear on the site and show payment
  instructions; a registration that arrives after its event closed is stored and flagged, not
  dropped (FFR-024), because the visitor may already have paid.
- BR-E09: All event dates and times are Costa Rica time (`America/Costa_Rica`), evaluated on the
  server, never on the visitor's clock. An event is open until its start time, or until the end
  of its date (23:59) when it has no time; after that it is past (Q-21 may set an earlier
  registration cut-off).
- BR-E08: Personal data (name, email, WhatsApp, payment screenshot) is used only to manage the
  registration and contact the participant about the event (Q-11).

## 7. Inputs
- Visitor: event selection, participant name, email, WhatsApp number, coupon code (optional),
  payment screenshot (JPEG/PNG ≤ 5 MB), consent checkbox.
- Cami (spreadsheet): `Events` and `Coupons` rows; status changes on registration rows.
- Configuration (script properties, never in the repo): spreadsheet ID, Drive folder ID, SINPE
  number and account name, abuse limits (§12). (An "allowed site origin" cannot be enforced on an
  Apps Script web app: it cannot read the `Origin` header or set CORS headers — ADR-008.)

## 8. Outputs
- Site: events cards, ticker, form, discounted amount, confirmation reference or error.
- Drive: one screenshot file per registration.
- Sheets: one row per registration in the event's tab.
- Optional notifications (email to participant / Cami) — not requested; Q-8.

## 9. Main Flow
1. The site loads and requests the published upcoming events from the backend.
2. The ticker shows the two (or more) closest events; the Events section shows one card each.
3. The visitor selects "Register" on a card (or a ticker item, then the card's button).
4. The form shows the event, price and SINPE Móvil instructions.
5. Optionally the visitor applies a coupon; the backend validates it and the amount updates.
6. The visitor pays by SINPE Móvil in their bank app, then fills name, email, WhatsApp, attaches
   the screenshot and gives consent.
7. The site validates the fields and sends the registration (fields + image) to the backend.
8. The backend re-validates, stores the image in Drive, runs the screenshot check, appends the
   row (status `new`) and returns a reference.
9. The visitor sees the confirmation; Cami later reviews the row and sets `confirmed`.

## 10. Alternate Flows
- Coupon invalid or expired: message shown, full price kept, visitor can continue without it.
- Screenshot check `mismatch`/`unreadable`: registration is still stored (unless Q-3 decides to
  block) and flagged for Cami; the visitor may be told "we'll verify your payment".
- Refund: Cami refunds outside the site and sets status `refund`.

## 11. Edge Cases
- Event becomes past or unpublished between page load and submit → stored and flagged for Cami
  (FFR-024), since the visitor may already have paid.
- Same person registers twice for the same event → stored twice; flagged? (Q-15).
- Two participants with the same name on the same day → file name suffix (BR-E04).
- Very large or non-image file renamed `.jpg` → rejected (type checked from content, not name).
- Backend unavailable → Events section shows a fallback (e.g. "Contact Cami" CTA) instead of
  breaking the page; form shows a retry message.
- Amount due ₡0 (free event or 100% coupon) → no payment step (FFR-023; Q-16 confirms).

## 12. Error Scenarios
- Validation error (client or server): field-level message in the active language.
- Upload too large / wrong type: message before upload when possible.
- Backend quota or timeout: generic error with retry; nothing half-saved without a row
  (or the orphan file is reported — implementation detail for the contract).
- Spam / abuse: the backend is an anonymous endpoint, callable from anywhere, running as Cami's
  account (ADR-008). An Apps Script web app receives no client IP or request headers, so
  per-client rate limits and origin checks are **not possible**. Mitigations that work there:
  - global throttling with `CacheService` counters and `LockService` (e.g. max registrations
    and max coupon checks per minute across all clients);
  - a daily cap on stored uploads (count and MB) so storage shared with Cami's Gmail/Drive and
    daily quotas cannot be exhausted;
  - coupon codes long and random enough to resist guessing (≥ 8 characters), and a global cap
    on failed coupon checks per minute;
  - a honeypot field;
  - these limits apply to **every** write, including registrations stored and flagged under
    FFR-024 (closed or unpublished events) and FFR-019 (duplicate codes);
  - a captcha verified server side (e.g. Cloudflare Turnstile, free), decided in Q-19.

## 13. Data
- Spreadsheet `Cami — Eventos` (name TBD):
  - `Events`: eventCode, name, date, time, description, priceCRC, imageUrl, published.
  - `Coupons`: eventCode, couponCode, discountPercent, active, expiresOn.
  - `<eventCode>` (one per event): timestamp, submissionId, reference, eventCode,
    participantName, email, whatsapp, couponCode, discountPercent, amountDueCRC, screenshotUrl,
    checkResult, checkDetails, status, notes.
- Drive folder `Pagos eventos` (name TBD), optionally one subfolder per event (Q-5).
- Event names/descriptions: language of entry as written by Cami; bilingual event content is
  Q-1. All UI labels go through `UI_TEXT` (EN/ES, FR-009).
- Exact field types, formats and error codes go in the integration contract
  (`docs/specs/EVENTS_API_CONTRACT.md`, from the template) before implementation.

## 14. External Dependencies
- Google Apps Script web app (proposed backend, ADR-008), Google Sheets, Google Drive, Drive OCR
  (text extraction from images) — all free within Google quotas.
- Cami's bank app / SINPE Móvil — outside the system.

## 15. Permissions
- Visitors: anonymous; can only read published upcoming events, validate one coupon, and create
  a registration. They can never read registrations or the coupon list.
- Cami / owner: edit the spreadsheet and Drive folder directly.
- The backend script runs as the owning Google account; the Drive folder and spreadsheet are not
  shared publicly (screenshot URLs work only for accounts Cami shares with).

## 16. Feature-specific NFRs
- FNFR-001 Privacy: comply with Costa Rica Ley 8968 (consent, purpose, access/deletion
  requests); no personal data in the browser beyond the form, in logs, or in the repo.
- FNFR-002 Secrets: IDs, SINPE data and any keys live in script properties, never in Git or the
  client bundle (except the public backend URL).
- FNFR-003 Performance: the events request must not block first paint; the page renders without
  the events section if the backend is slow (> 3 s) or down.
- FNFR-004 Accessibility: cards and form keyboard-usable with labelled fields; the ticker honors
  `prefers-reduced-motion` and can be paused.
- FNFR-005 Bilingual: every new UI string in EN and ES.
- FNFR-006 Responsive: desktop, 900px and 640px breakpoints (NFR-002).
- FNFR-007 Cost: ₡0 recurring — Google free quotas only (NFR-003).

## 17. Acceptance Criteria
Written per story in [USER_STORIES.md](USER_STORIES.md) (US-017..US-023); they become final when
the stories are refined to `Ready`.

## 18. Out of Scope
- Online card payments or a payment gateway; refunds through the site.
- Automatic confirmation of payment against the bank (no bank API).
- A participant account/login area; editing or cancelling a registration from the site.
- An admin web panel (Cami uses the spreadsheet).
- Automated emails/WhatsApp messages (unless Q-8 adds them).

## 19. Assumptions
- Google Apps Script is acceptable as the first backend (ADR-008) instead of the Node.js backend
  TECH_STACK §5 anticipated; Node stays the path if needs outgrow Apps Script.
- This feature supersedes the events part of US-012/US-013; those backlog items remain for
  general lead capture and other Workspace integrations (Q-12).
- Text in SINPE screenshots is readable by Drive OCR for the common Costa Rican banks; to be
  proved with Cami's sample images in a spike before US-022 is `Ready`.

## 20. Open Questions
Blocking for refinement (owner/Cami):
- Q-1: Are event names/descriptions entered once (Spanish) or in both languages?
- Q-2: Coupons in a `Coupons` sheet tab (recommended: Cami edits rows, no JSON syntax errors) or
  in a JSON file in Drive as first proposed?
- Q-3: Screenshot check strictness: store everything and flag mismatches for Cami
  (recommended), or reject the registration when the check fails?
- Q-4: What must the transfer description contain (event code, participant name, both)?
- Q-5: File name date = submission date or event date? One Drive subfolder per event?
- Q-6: WhatsApp numbers: Costa Rica only, or international too?
- Q-7: Which Google account owns the script, Drive folder and spreadsheet (Cami's personal,
  `lifetoolscr.com` Workspace)?
- Q-8: Should the participant and/or Cami get an email when a registration is created?
- Q-9: Lifetools logo file (vector or transparent PNG) for the no-image fallback.
- Q-10: With no upcoming events: hide the section and ticker, or show "No upcoming events"?
- Q-11: Privacy notice text and contact for data requests (Ley 8968); data retention period.
- Q-12: Does this replace US-012/US-013, or do they stay as separate backlog items?
- Q-13: Rounding of discounted amounts (nearest colón, or round to ₡100/₡500)?
- Q-14: Accept iPhone HEIC screenshots (convert server side) or ask for JPG/PNG?
- Q-15: Allow duplicate registrations (same email + event)?
- Q-16: Free events (₡0): registration without the payment step?
- Q-17: Capacity limit per event / "sold out"?
- Q-18: Cami's sample SINPE screenshots (2–3 banks) for the OCR spike.
- Q-19: Spam protection: global throttling + daily upload cap + honeypot only, or also a
  server-verified captcha (e.g. Cloudflare Turnstile) from day one? (Per-client limits are not
  possible on Apps Script — §12.)
- Q-20: Approve the PROJECT_SPEC changes in §2 (non-goals "no online payments", "no CMS", §10
  persistence, FR-008/NFR-001) when the stories are refined?
- Q-21: Should registration close before the event starts (e.g. 24 h before)?
- Q-22: Group or proxy registrations: one SINPE transfer for several participants, or a payer
  who is not the participant? (Changes the form, the amount check and the row model.)
- Q-23: Minors: can participants be under 18, and does consent then need a parent/guardian?
- Q-24: Coupon usage limits: maximum uses per code, one use per email?
- Q-25: Ley 8968 duties beyond the notice: who besides Cami may access the sheet and folder; how
  access/deletion requests are handled in Sheets and Drive; whether the database must be
  registered with PRODHAB (owner to confirm — not asserted here).
- Q-26: Amount check: exact amount due, a tolerance, or "at least the amount due"?
- Q-27 (not blocking): does a paid registration require a Hacienda electronic invoice (*factura
  electrónica*)? Do SINPE Móvil per-transfer limits affect higher-priced events?

## 21. Approval
- Not approved. Discovery draft for the owner's review (CMP-019).
