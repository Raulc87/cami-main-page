# USER_STORIES

This file is the product backlog source (no Jira/Linear yet — see
[ADR-005](../decisions/ADR-005-in-repo-tracking.md)). Work units are `CMP-XXX` tickets in
[TICKETS.md](../../TICKETS.md); a product ticket implements one or more stories from here,
while process/tech-debt tickets may have no story (`—` in TICKETS.md).

- **US-001..US-009** were reconstructed retroactively in CMP-014 from the features already
  shipped in v1.0.x. Their acceptance criteria were reconstructed from the code and still
  need a browser check (Sprint 01 verification) before they count as a verified baseline, so
  they stay in `Review` until that check passes and only then move to `Done`. Story
  points are not estimated retroactively.
- **US-010..US-016** come from the former roadmap (`05-roadmap.md`). They are `Proposed`:
  direction, not ready for implementation. Before a sprint can select one, it must be refined
  to `Ready` (acceptance criteria written, points estimated, FEATURE_SPEC created if it
  changes architecture).

## Story format

### US-XXX — Title
- Priority: Critical / High / Medium / Low
- Story Points:
- Status: Proposed / Ready / In Progress / Review / Done
- Related Spec:
- Related Requirements:

**User Story**

As a ...
I want ...
So that ...

**Acceptance Criteria**

1. Given ...
   When ...
   Then ...

**Dependencies**
-

**Notes**
-

**Jira**
- Jira Key: TBD

---

## Shipped (verified in Sprint 01, CMP-017)

### US-001 — Brand hero with credibility stats
- Priority: Critical
- Story Points: — (retroactive)
- Status: Done (verified in CMP-017; evidence approved by merging PR #17; recorded in
  CMP-020)
- Related Spec: [PROJECT_SPEC](PROJECT_SPEC.md), [ARCHITECTURE_SPEC §22](ARCHITECTURE_SPEC.md#22-feature-to-component-impact)
- Related Requirements: FR-001, FR-002, BR-001
- Tickets: CMP-011

**User Story**

As a prospective client
I want to immediately see who Cami is and proof of her track record
So that I trust her enough to keep reading

**Acceptance Criteria**

1. Given the page loads
   When the hero is visible
   Then it shows the headline, sub-headline, role badge, Cami's real photo and a booking CTA.
2. Given the hero is visible
   When I look at the stats bar
   Then it shows 4 stats (100 Lives Transformed, 25 Speaking Events, 6+ Years of Practice,
   4 Pillars of Change) with labels in the active language.
3. Given any language is active
   When I read the hero tagline and photo quote
   Then they are always in Spanish: the tagline reads "Disciplina hoy, libertad mañana." and
   the photo quote reads "Tu mejor versión empieza aquí."

**Dependencies**
- US-006 (translated labels)

**Jira**
- Jira Key: TBD

### US-002 — Service pillars overview
- Priority: Critical
- Story Points: — (retroactive)
- Status: Review — AC2 defect: hover shift overridden by the scroll-reveal inline transform
  (CMP-017); fix ticket pending owner approval
- Related Spec: [ARCHITECTURE_SPEC §9](ARCHITECTURE_SPEC.md#9-logical-data-architecture-content-model)
- Related Requirements: FR-003
- Tickets: (initial build, before CMP-001)

**User Story**

As a prospective client or event organizer
I want to see the three services Cami offers and whether each is available
So that I know what I can book

**Acceptance Criteria**

1. Given the services section
   When it renders
   Then it shows 3 cards — motivational speaking, lifestyle coaching, spiritual coaching —
   each with icon, kicker, title, description and availability note.
2. Given a pointer device
   When I hover a card
   Then it shifts right, its left border changes color and gains a shadow.

**Notes**
- Two services say `Catalog coming soon` until US-010.

**Jira**
- Jira Key: TBD

### US-003 — Photo gallery
- Priority: High
- Story Points: — (retroactive)
- Status: Done (verified in CMP-017; evidence approved by merging PR #17; recorded in
  CMP-020)
- Related Spec: [UX_UI_DIRECTION §7](../ux/UX_UI_DIRECTION.md#7-imagery)
- Related Requirements: FR-004, BR-002, NFR-006
- Tickets: CMP-002, CMP-010

**User Story**

As an event organizer
I want to see real photos of Cami on stage, in workshops and with her community
So that I can picture her at my event

**Acceptance Criteria**

1. Given the gallery section
   When it renders
   Then it shows 5 real photos (On Stage, Workshop, 1-on-1 Session, Community, Behind the
   Scenes), each with an accessible image label (`alt` text) in the active language, and no
   gradient placeholder slot remains. The label is shown visibly only if a photo fails to
   load.
2. Given the gallery photos in `public/images/`
   When their files are inspected (e.g. `file public/images/*.jpg`)
   Then each is a JPEG resized for the web, no larger than 1200px on its longest side (the
   size the shipped photos were resized to) — NFR-006.

**Jira**
- Jira Key: TBD

### US-004 — Process and values
- Priority: Medium
- Story Points: — (retroactive)
- Status: Done (verified in CMP-017; evidence approved by merging PR #17; recorded in
  CMP-020)
- Related Spec: [ARCHITECTURE_SPEC §9](ARCHITECTURE_SPEC.md#9-logical-data-architecture-content-model)
- Related Requirements: FR-005, FR-006, BR-001
- Tickets: (initial build, before CMP-001)

**User Story**

As a prospective client
I want to understand how working with Cami goes and what she stands for
So that I know whether her approach fits me

**Acceptance Criteria**

1. Given the process section
   When it renders
   Then it shows 3 steps with the middle step highlighted: Discover → Transform → Thrive in
   English, Descubre → Transforma → Florece in Spanish.
2. Given the values section
   When it renders
   Then it shows 4 value chips, each with its Spanish and English name shown together,
   regardless of the active language.

**Jira**
- Jira Key: TBD

### US-005 — Real client testimonials
- Priority: High
- Story Points: — (retroactive)
- Status: Review — AC2's Spanish-to-English long-quote fallback is not exercised by current
  data (every long quote has a Spanish version); needs one check with test data (CMP-017
  observation, CMP-020)
- Related Spec: [ARCHITECTURE_SPEC §9](ARCHITECTURE_SPEC.md#9-logical-data-architecture-content-model)
- Related Requirements: FR-007, BR-003
- Tickets: CMP-002, CMP-008, CMP-009

**User Story**

As a prospective client
I want to read what real clients say about Cami
So that I trust the results she promises

**Acceptance Criteria**

1. Given the testimonials section
   When it renders
   Then it shows 4 real testimonials (one featured, three in a grid), each with name and
   photo, and a role line only when a role exists.
2. Given a testimonial with a long version for the active language (Spanish falls back to the
   English long version)
   When I click "see more"/"ver más"
   Then only that testimonial expands, and "see less"/"ver menos" collapses it.
3. Given a testimonial with no long version available
   When it renders
   Then no "see more" control is shown.

**Jira**
- Jira Key: TBD

### US-006 — Global English/Spanish toggle
- Priority: Critical
- Story Points: — (retroactive)
- Status: Done (verified in CMP-017; evidence approved by merging PR #17; recorded in
  CMP-020)
- Related Spec: [ARCHITECTURE_SPEC §7](ARCHITECTURE_SPEC.md#global-language-languagecontext), [ADR-004](../decisions/ADR-004-i18n-native-context.md)
- Related Requirements: FR-009, BR-001, BR-005
- Tickets: CMP-003

**User Story**

As a Spanish- or English-speaking visitor
I want the whole site in my language and to switch it with one control
So that I understand everything without effort

**Acceptance Criteria**

1. Given a first visit with a browser language starting with `es`
   When the page loads
   Then the interface is in Spanish; otherwise it is in English.
2. Given the nav toggle
   When I switch language
   Then all translatable copy changes instantly, and `document.documentElement.lang` is
   updated.
3. Given I chose a language before
   When I come back
   Then the page loads in my last choice (`localStorage` key `cmp-lang`).
4. Given any language
   When the page renders
   Then fixed Spanish brand accents and the wordmark do not change.

**Jira**
- Jira Key: TBD

### US-007 — Booking contact by email
- Priority: Critical
- Story Points: — (retroactive)
- Status: Review — AC1 mail-client handoff needs one manual click on the live site (CMP-017
  open manual check)
- Related Spec: [ARCHITECTURE_SPEC §9](ARCHITECTURE_SPEC.md#9-logical-data-architecture-content-model)
- Related Requirements: FR-008, BR-004
- Tickets: CMP-006

**User Story**

As a prospective client or event organizer
I want an obvious way to contact Cami
So that I can book her

**Acceptance Criteria**

1. Given the final CTA section
   When I click the booking button
   Then my mail client opens addressed to `camila@lifetoolscr.com`, and the address is also
   shown as text under the button.
2. Given the nav
   When I click "Book Cami"
   Then I am taken to the contact section.

**Jira**
- Jira Key: TBD

### US-008 — Mobile-friendly layout
- Priority: High
- Story Points: — (retroactive)
- Status: Done (verified in CMP-017; evidence approved by merging PR #17; recorded in
  CMP-020)
- Related Spec: [UX_UI_DIRECTION §8](../ux/UX_UI_DIRECTION.md#8-responsive-behavior)
- Related Requirements: NFR-002
- Tickets: CMP-013

**User Story**

As a visitor on a phone
I want every section, including all photos, to display correctly
So that I get the same experience as on desktop

**Acceptance Criteria**

1. Given a viewport ≤ 640px wide
   When the page renders
   Then sections stack vertically, and the hero photo, all 5 gallery photos and all 4
   testimonial photos are visible (non-zero size).
2. Given a viewport between 641px and 900px wide
   When the services section renders
   Then the grid uses 2 columns.

**Jira**
- Jira Key: TBD

### US-009 — Site live on the production domain
- Priority: Critical
- Story Points: — (retroactive)
- Status: Review — AC2 needs one social-preview run on the live site (CMP-017 open manual
  check); AC1's outcome is verified (an optional checklist re-run remains)
- Related Spec: [TECH_STACK §10](../../TECH_STACK.md#10-hosting--deployment), [ADR-002](../decisions/ADR-002-godaddy-static-hosting.md)
- Related Requirements: NFR-001, NFR-005, FR-010
- Tickets: CMP-012

**User Story**

As the site owner
I want the site published at `camihernandez.com` with a repeatable release process
So that visitors can find it and every update ships the same way

**Acceptance Criteria**

1. Given a release
   When the checklist in [release-checklist.md](../process/release-checklist.md) is followed
   Then `camihernandez.com` serves the new build, and a `vX.Y.Z` tag and GitHub Release exist.
2. Given the page is shared on social media
   When the link preview is generated
   Then it uses the `title`, `description` and `og:*` metadata from `index.html`.

**Jira**
- Jira Key: TBD

---

## Backlog (Proposed)

Dependencies between backlog items:
- US-011 and US-012 need a **backend + database** (none exists today).
- US-015 depends on US-012 (it needs captured leads first).
- US-016 depends on US-014 and/or US-012 (it needs demographic data).
- US-013 is independent, but its scope should be decided *after* knowing what US-012 needs
  (does the form replace or complement manual booking?).

Cost rule for all of them: free tier sufficient for current volume, avoid strong vendor
lock-in (e.g. leads must be easy to export) — PROJECT_SPEC NFR-003.

### US-010 — Service catalog
- Priority: TBD (owner)
- Story Points: TBD
- Status: Proposed
- Related Spec: PROJECT_SPEC §15
- Related Requirements: G-002, G-005

**User Story**

As a prospective client
I want to browse Cami's services in detail, with packages
So that I can choose what to buy or book

**Acceptance Criteria**
- To be defined during refinement (listing/detail UI, probably prices/packages).

**Notes**
- `SERVICES` already announces `Catalog coming soon` for 2 of 3 services.

**Jira**
- Jira Key: TBD

### US-011 — Intake questionnaire
- Priority: TBD (owner)
- Story Points: TBD
- Status: Proposed
- Related Spec: PROJECT_SPEC §15 — needs FEATURE_SPEC + backend ADR
- Related Requirements: G-005

**User Story**

As a prospective client
I want to answer a short questionnaire before my first session
So that Cami understands my situation in advance

**Acceptance Criteria**
- To be defined during refinement.

**Dependencies**
- Backend + database (TECH_STACK §5).

**Jira**
- Jira Key: TBD

### US-012 — Lead capture form
- Priority: TBD (owner)
- Story Points: TBD
- Status: Proposed
- Related Spec: PROJECT_SPEC §15 — needs FEATURE_SPEC + backend ADR
- Related Requirements: G-005, NFR-003

**User Story**

As the site owner
I want visitors to leave their name, contact and questionnaire answers in a form that is
stored in a database
So that I can follow up with every lead

**Acceptance Criteria**
- To be defined during refinement.

**Dependencies**
- Backend + database; US-011 for the questionnaire answers.

**Jira**
- Jira Key: TBD

### US-013 — Google Workspace integrations
- Priority: TBD (owner)
- Story Points: TBD
- Status: Proposed
- Related Spec: PROJECT_SPEC §15
- Related Requirements: G-005

**User Story**

As the site owner
I want the site connected to my Google Workspace
So that bookings and leads flow into the tools I already use

**Acceptance Criteria**
- To be defined. Scope is open — candidates: Calendar for booking, Sheets as a light CRM /
  export, Gmail for notifications. Do not decide the exact scope here.

**Jira**
- Jira Key: TBD

### US-014 — Site analytics
- Priority: TBD (owner)
- Story Points: TBD
- Status: Proposed
- Related Spec: PROJECT_SPEC §15
- Related Requirements: G-005, NFR-003

**User Story**

As the site owner
I want to understand the demographics and behavior of visitors
So that I can make marketing decisions with data

**Acceptance Criteria**
- To be defined. Obvious low-cost candidate: Google Analytics 4 (free); also evaluate Meta
  Pixel if the goal is feeding ads (US-016).

**Jira**
- Jira Key: TBD

### US-015 — Email marketing campaigns
- Priority: TBD (owner)
- Story Points: TBD
- Status: Proposed
- Related Spec: PROJECT_SPEC §15
- Related Requirements: G-005, NFR-003

**User Story**

As the site owner
I want to send marketing emails to captured leads
So that I can turn them into clients

**Acceptance Criteria**
- To be defined. Evaluate free-tier tools (e.g. Brevo, Mailchimp free tier) before any paid
  option.

**Dependencies**
- US-012.

**Jira**
- Jira Key: TBD

### US-016 — Demographic social media ads
- Priority: TBD (owner)
- Story Points: TBD
- Status: Proposed
- Related Spec: PROJECT_SPEC §15
- Related Requirements: G-005

**User Story**

As the site owner
I want to target paid social ads using analytics and lead data
So that ad spend reaches the right audience

**Acceptance Criteria**
- To be defined.

**Dependencies**
- US-014 and/or US-012.

**Jira**
- Jira Key: TBD

## Events and registration (Ready — refined in CMP-021)

From the owner's requirement and answers of 2026-10-19. Feature spec:
[FEATURE_SPEC_events_registration.md](FEATURE_SPEC_events_registration.md); contract:
[EVENTS_API_CONTRACT.md](EVENTS_API_CONTRACT.md); backend:
[ADR-008](../decisions/ADR-008-events-backend-google-apps-script.md). Story points use a 1–2–3–5–8
scale.

Dependencies:
- A backend spike (Sprint 02, first) proves the browser → Apps Script path, Drive/Sheets writes,
  OCR on Cami's samples, HEIC conversion and the mail alias.
- US-023 (sheet structure) and the contract come before US-017..US-022.
- US-018 depends on US-017. US-021 does not depend on US-022 (check result `pending` until
  then). US-025 and US-022 run after US-021 stores the row.

### US-017 — Upcoming events section
- Priority: High
- Story Points: 3
- Status: Ready
- Related Spec: FEATURE_SPEC_events_registration (FFR-001..FFR-004, FFR-025, FFR-028, BR-E09)
- Related Requirements: FR-011, FR-009, NFR-002

**User Story**

As a visitor
I want to see Cami's upcoming events with their date, description, price and art
So that I can choose one to attend

**Acceptance Criteria**

1. Given published events that have not started (BR-E09)
   When the page loads
   Then an "Upcoming Events" / "Próximos eventos" section shows one card per event, ordered by
   start, each with name, date and time (24-hour `HH:mm` in both languages), brief description,
   price (or "Gratis" / "Free") and a register button.
2. Given an event with no image URL
   When its card renders
   Then the Lifetools logo is shown in place of the art.
3. Given an event whose registration has closed (less than 12 h before start) or that is sold
   out
   When its card renders
   Then the button is disabled and the card shows "Inscripciones cerradas" / "Registration
   closed" or "Agotado" / "Sold out".
4. Given the site in English
   When the cards render
   Then name and description are in English (`nameEn`/`descriptionEn` if filled, otherwise the
   automatic translation).
5. Given no upcoming events, or the backend slow (> 5 s) or down
   When the page loads
   Then the section and the ticker are hidden and the rest of the page renders normally.

**Dependencies**
- US-023, contract, backend spike.

**Jira**
- Jira Key: TBD

### US-018 — Upcoming-events ticker banner
- Priority: Medium
- Story Points: 2
- Status: Ready
- Related Spec: FEATURE_SPEC_events_registration (FFR-005, FFR-006)
- Related Requirements: FR-011, NFR-002

**User Story**

As a visitor
I want a moving banner at the top of the page announcing the next events
So that I notice them right away

**Acceptance Criteria**

1. Given at least one upcoming event
   When the page loads
   Then a banner at the top scrolls right-to-left showing up to the N closest events (N = 2 by
   default) with name and date, in the active language.
2. Given a ticker item
   When I select it (click or keyboard)
   Then the page scrolls to that event's card.
3. Given the pointer or keyboard focus is on the banner
   When it is hovered/focused
   Then the movement pauses.
4. Given my system requests reduced motion
   When the page loads
   Then the banner is static.
5. Given no upcoming events
   When the page loads
   Then no banner is shown.

**Dependencies**
- US-017.

**Jira**
- Jira Key: TBD

### US-019 — Event registration form with SINPE Móvil payment proof
- Priority: High
- Story Points: 5
- Status: Ready
- Related Spec: FEATURE_SPEC_events_registration (FFR-007..FFR-011, FFR-018, FFR-022, FFR-023,
  FFR-027), BR-E01..BR-E03, BR-E09
- Related Requirements: FR-011, FR-009

**User Story**

As a visitor who chose an event
I want to see how to pay and send my details with the payment screenshot
So that my place is reserved

**Acceptance Criteria**

1. Given I select a paid event's register button
   When the form opens
   Then it shows the event's name, date, time and price at the top, and the SINPE Móvil
   instructions (number, account name, amount to pay after any coupon) before the screenshot
   field; while the SINPE values are placeholders they carry a visible "placeholder / por
   confirmar" marker (BR-E01). (Reworded 2026-10-20, CMP-036: the coupon, which needs the email,
   comes before the payment part; UX_UI_DIRECTION §13.)
2. Given a free event, or an amount due of ₡0 after a coupon
   When the form shows
   Then the payment instructions and the screenshot field are hidden and I can submit without a
   file.
3. Given the form
   When I submit with participant name, email, WhatsApp, screenshot (paid) or consent missing
   Then submit is blocked and each missing field shows a message in the active language.
4. Given an invalid email, a WhatsApp number not in `+<country code><number>` format, or a file
   that is not an image or is over 5 MB
   When I submit
   Then the matching error is shown and nothing is sent.
5. Given a valid paid registration with a JPEG, PNG, WebP or HEIC screenshot
   When I submit
   Then I see a confirmation with my registration reference.
6. Given a backend error
   When I submit
   Then I see a retry message, my data is kept, and retrying does not create a second
   registration (same submission ID).
7. Given my email already has a registration for this event
   When I submit
   Then I see "Ya existe una inscripción con este correo para este evento" / "You are already
   registered for this event" and nothing is stored.
8. Given the form
   When it renders
   Then it shows the privacy notice and a consent checkbox that must be checked to submit.

**Dependencies**
- US-021, US-017.

**Jira**
- Jira Key: TBD

### US-020 — Discount coupon at registration
- Priority: Medium
- Story Points: 3
- Status: Ready
- Related Spec: FEATURE_SPEC_events_registration (FFR-012, FFR-013, FFR-021, FFR-024, FFR-031, §12),
  BR-E03, BR-E10, BR-E13
- Related Requirements: FR-011

**User Story**

As a visitor with a promo code
I want to apply it to my registration
So that I pay the discounted price

**Acceptance Criteria**

1. Given an active coupon for this event, under its max uses and not yet used by my email
   When I apply it
   Then the amount to pay updates to price × (1 − discount%) rounded to the nearest colón, and
   the coupon is saved with my registration.
2. Given an unknown, inactive, expired or other-event coupon
   When I apply it
   Then I see "invalid coupon" in the active language and the full price stays.
3. Given a coupon that reached its max uses, or that my email already used
   When I apply it
   Then I see the matching message and the full price stays.
4. Given a registration that used a coupon is marked `refund/cancelled` or `spam`
   When the coupon is checked again
   Then that use no longer counts.
5. Given a coupon that was valid when I applied it but became inactive, expired or exhausted
   before I submitted
   When I submit a paid registration
   Then it is stored with the discount I saw, `needsReview` TRUE and `checkDetails`
   `coupon changed`; a ₡0 registration in the same case is refused with the coupon message.
6. Given many failed coupon checks in a short time (any client)
   When the global limit is reached
   Then further checks are refused with "try again later".
7. Given any visitor
   When the page loads
   Then no list of coupons is sent to the browser.
8. Given I typed a coupon code but did not apply it
   When I submit
   Then submit is blocked and I see a message asking me to apply the coupon or clear the field
   (FFR-031, owner 2026-10-20).

**Dependencies**
- US-019, US-023.

**Jira**
- Jira Key: TBD

### US-021 — Registrations stored in Google Drive and Sheets
- Priority: High
- Story Points: 5
- Status: Ready
- Related Spec: FEATURE_SPEC_events_registration (FFR-014..FFR-016, FFR-022, FFR-024, FFR-025,
  FFR-030), BR-E04, BR-E05, BR-E10, BR-E13; contract §6
- Related Requirements: FR-011, NFR-003

**User Story**

As Cami
I want every registration saved in my Google Sheets, one tab per event, with the payment
screenshot in a Drive subfolder per event
So that I can manage participants and payments in one place

**Acceptance Criteria**

1. Given a valid paid registration
   When the backend receives it
   Then the screenshot is stored as JPEG in `<root>/<eventCode>/` named
   `<ParticipantName>_<YYYY-MM-DD>_<eventCode>.jpg` (registration date; the subfolder is created
   if new; `_2` on collision). A ₡0 registration stores no file. If the image cannot be converted,
   it is stored in its original format with that extension and a `checkDetails` note (FFR-014).
2. Given a valid registration
   When it is stored
   Then a row with the contract §6 columns is appended to the event's tab (created with headers
   if new), status `new`, check result `pending` (or `not-required` for ₡0), every user value
   stored as text (no formulas).
3. Given an event at capacity (counting rule BR-E10)
   When a ₡0 registration (no file) arrives
   Then it is refused with `SOLD_OUT`; two simultaneous registrations for the last place never
   both succeed.
4. Given an event that is closed, unpublished or at capacity
   When a paid registration (with a screenshot) arrives
   Then it is stored with status `new`, `needsReview` TRUE and `checkDetails` naming the reason
   (BR-E13), and the visitor is told Cami will contact them.
5. Given invalid data or an unknown event code
   When it is received
   Then it is rejected and nothing is stored.
6. Given a retry with a submission ID already stored
   When it is received
   Then the original reference is returned and nothing new is stored.

**Dependencies**
- ADR-008 backend spike, US-023.

**Jira**
- Jira Key: TBD

### US-022 — Automatic check of the payment screenshot
- Priority: Medium
- Story Points: 5
- Status: Ready
- Related Spec: FEATURE_SPEC_events_registration (FFR-017, FFR-032, FFR-030), BR-E06
- Related Requirements: FR-011

**User Story**

As Cami
I want each payment screenshot checked automatically for my SINPE number or name and the exact
amount
So that I spot wrong payments before confirming

**Acceptance Criteria**

1. Given a screenshot showing Cami's SINPE number or account name and exactly the amount due
   When it is checked
   Then the row's check result is `ok` and `needsReview` stays FALSE.
2. Given a screenshot where the account or the exact amount is missing or different
   When it is checked
   Then the result is `mismatch`, `checkDetails` lists the failing fields, `needsReview` is TRUE
   and the "payment not validated" email is sent (US-025).
3. Given an unreadable image
   When it is checked
   Then the result is `unreadable`, `needsReview` is TRUE and the email is sent.
4. Given any result
   When it is written
   Then the status stays `new` and the temporary OCR Doc is deleted.
5. Given Cami's sample screenshots (2–3 banks)
   When the check runs on them in the spike
   Then it returns `ok` for valid ones and `mismatch` for an altered amount.
6. Given the OCR service refuses the call (e.g. the per-user rate limit) after the retries
   When the check runs
   Then the row stays `pending` and no "payment not validated" email is sent yet (the
   confirmation is still sent at save time); a retry every 10 minutes writes the final result
   and sends that email if needed; after 24 hours still `pending`, retries stop and the row is
   listed in that day's alert email to camila@, which it triggers (FFR-029, FFR-032, owner
   2026-10-20).

**Dependencies**
- US-021; Cami's samples (spike).

**Jira**
- Jira Key: TBD

### US-023 — Cami manages events, capacity and coupons without a deploy
- Priority: High
- Story Points: 3
- Status: Ready
- Related Spec: FEATURE_SPEC_events_registration (FFR-019, FFR-020, FFR-033, FFR-028); contract §6
- Related Requirements: FR-011

**User Story**

As Cami
I want to add or edit events, capacity and coupons in my spreadsheet
So that the site reflects them without waiting for a developer

**Acceptance Criteria**

1. Given a new `Events` row, published, with a future start, price and capacity
   When the site is loaded within 5 minutes (the events cache refresh, FFR-033)
   Then the event appears in the section and the ticker.
2. Given a row with a missing or invalid required field (code, name, date, time, price,
   capacity) or a duplicated code
   When events are loaded within 5 minutes (FFR-033)
   Then that event (all rows of a duplicated code) is not shown and the others still are.
3. Given a `Coupons` row added or its discount or max uses changed
   When the next coupon check runs
   Then it uses the new values (coupon checks read the sheet directly, not the events cache).
4. Given `nameEn`/`descriptionEn` filled for an event
   When the site is in English, within 5 minutes of the edit (FFR-033)
   Then those texts are shown instead of the automatic translation.
5. Given a `Coupons` row with a code that is not 8–20 characters `A-Z0-9`, or an invalid
   discount or max uses
   When coupons are read
   Then that row is ignored and listed in that day's alert email to camila@, which it triggers
   on its own (at most one per day, FFR-029).

**Dependencies**
- ADR-008 backend spike.

**Jira**
- Jira Key: TBD

### US-024 — Abuse metrics and alerts
- Priority: Medium
- Story Points: 2
- Status: Ready
- Related Spec: FEATURE_SPEC_events_registration (FFR-029, §12)
- Related Requirements: FR-011, NFR-003

**User Story**

As Cami
I want daily numbers on registrations and blocked requests, and an email when something looks
like spam
So that we know when to add a captcha

**Acceptance Criteria**

1. Given activity on a day
   When the day's metrics are written
   Then the `Metrics` row has accepted registrations, honeypot hits, throttled requests, failed
   coupon checks, MB uploaded and rows marked `spam`.
2. Given a day over a threshold (> 10 honeypot hits, > 20 throttled requests, or the upload cap
   reached)
   When it is crossed
   Then one alert email goes to camila@lifetoolscr.com for that day; an invalid sheet row or a
   check stuck `pending` past its limit also triggers it, still at most one per day (FFR-029,
   FFR-032).
3. Given a request with the honeypot field filled
   When it is received
   Then it gets a normal-looking success response, nothing is stored and the hit is counted.

**Dependencies**
- US-021.

**Jira**
- Jira Key: TBD

### US-025 — Participant emails (confirmation, payment not validated)
- Priority: High
- Story Points: 3
- Status: Ready
- Related Spec: FEATURE_SPEC_events_registration (FFR-026), BR-E11
- Related Requirements: FR-011, FR-009

**User Story**

As a participant
I want an email confirming my registration, and to be told if my payment could not be
validated
So that I know my place is reserved or what to fix

**Acceptance Criteria**

1. Given a stored registration that is not flagged under FFR-024
   When it is saved
   Then the participant receives a confirmation email in the language they used on the site,
   with event, date/time, amount and reference, reply-to camila@lifetoolscr.com.
2. Given a check result `mismatch` or `unreadable`
   When it is written
   Then the participant receives "The payment for <event> could not be validated" / "El pago
   para <evento> no pudo ser validado" with a short explanation and a request to reply to
   camila@lifetoolscr.com with the correct proof.
3. Given the email cannot be sent
   When sending fails
   Then the registration stays stored, `checkDetails` gets `email failed` and `needsReview` is
   TRUE.
4. Given the templates
   When the feature is prepared for release
   Then they are the versions approved by Cami (BR-E11 release gate).
5. Given a registration stored and flagged under FFR-024 (closed, sold out or coupon changed at
   submit)
   When it is saved
   Then the participant receives the "registration received" email, which does not promise a
   place and says Cami will contact them, instead of the confirmation.

**Dependencies**
- US-021, US-022.

**Jira**
- Jira Key: TBD
