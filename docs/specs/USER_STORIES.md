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
- Status: Done (verified in CMP-017; evidence approved by merging PR #17; recorded in
  CMP-020)
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
- Status: Review — AC1/AC2 need the owner's manual checks: live deploy outcome and one
  social-preview run (CMP-017 open manual checks)
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

## Backlog — Events and registration (Proposed, Discovery CMP-019)

From the owner's requirement of 2026-10-19. Feature spec:
[FEATURE_SPEC_events_registration.md](FEATURE_SPEC_events_registration.md) (Draft); proposed
backend: [ADR-008](../decisions/ADR-008-events-backend-google-apps-script.md). Acceptance
criteria below are drafts: they become final when the open questions (FEATURE_SPEC §20) are
answered and each story is refined to `Ready`.

Dependencies between these stories:
- US-023 (events and coupons in the spreadsheet) and the backend spike come first: US-017,
  US-018, US-019 and US-020 read from it.
- US-019 needs US-021 (storage) to be useful. US-021 writes check result `pending`; US-022
  later replaces it with the real result, so US-021 does not depend on US-022.
- US-018 depends on US-017 (same events data and the card to scroll to).

### US-017 — Upcoming events section
- Priority: High
- Story Points: TBD
- Status: Proposed
- Related Spec: FEATURE_SPEC_events_registration §5 (FFR-001..FFR-004)
- Related Requirements: G-005, FR-009, NFR-002

**User Story**

As a visitor
I want to see Cami's upcoming events with their date, description and art
So that I can choose one to attend

**Acceptance Criteria**

1. Given published events that are still open (BR-E09)
   When the page loads
   Then an "Upcoming Events" / "Próximos eventos" section shows one card per event that is still
   open (BR-E09: Costa Rica time, open until its start time or the end of its date), ordered by
   date and time, each with name, date (and time if set), brief description and a register
   button.
2. Given an event with no image
   When its card renders
   Then the Lifetools logo is shown in place of the art.
3. Given past events (BR-E09) or unpublished events
   When the page loads
   Then they are not shown.
4. Given no upcoming events, or the backend unavailable
   When the page loads
   Then the section shows the agreed empty/fallback state (Q-10) and the rest of the page still
   renders.

**Dependencies**
- US-023 (events data), ADR-008 backend.

**Jira**
- Jira Key: TBD

### US-018 — Upcoming-events ticker banner
- Priority: Medium
- Story Points: TBD
- Status: Proposed
- Related Spec: FEATURE_SPEC_events_registration §5 (FFR-005, FFR-006)
- Related Requirements: G-005, NFR-002

**User Story**

As a visitor
I want a moving banner at the top of the page announcing the next events
So that I notice them right away

**Acceptance Criteria**

1. Given at least one upcoming event
   When the page loads
   Then a banner at the top scrolls right-to-left showing up to the N closest events (N = 2 by
   default, configurable), with name and date.
2. Given a ticker item
   When I select it
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
- Story Points: TBD
- Status: Proposed
- Related Spec: FEATURE_SPEC_events_registration §5 (FFR-007..FFR-011, FFR-018, FFR-022,
  FFR-023), BR-E01, BR-E02
- Related Requirements: G-005, FR-009

**User Story**

As a visitor who chose an event
I want to see how to pay and send my details with the payment screenshot
So that my place is reserved

**Acceptance Criteria**

1. Given I select an event's register button
   When the form opens
   Then it shows that event's name, date and price, and the SINPE Móvil instructions (number,
   account name, amount, required description) before the fields.
2. Given the form
   When I submit with any of Participant name, Email, WhatsApp number, payment file or consent
   missing
   Then submit is blocked and each missing field shows a message in the active language.
3. Given an invalid email, an invalid WhatsApp number (Q-6) or a file that is not a JPEG/PNG
   image up to 5 MB
   When I submit
   Then the form shows the matching error and sends nothing.
4. Given valid data
   When I submit
   Then I see a confirmation with a registration reference; on a backend error I see a retry
   message and my entered data is kept.
5. Given the configured SINPE number and account name
   When the form opens
   Then the instructions show exactly those values; while they are placeholders (BR-E01) they
   carry a visible "placeholder / por confirmar" marker. (Releasing with a placeholder is
   blocked by the BR-E01 release gate, not by this AC.)
6. Given the amount due is ₡0 (free event or 100% coupon)
   When the form shows
   Then the payment instructions and the screenshot field are hidden and I can submit without a
   file (FFR-023).

**Dependencies**
- US-021 (storage), US-017.

**Jira**
- Jira Key: TBD

### US-020 — Discount coupon at registration
- Priority: Medium
- Story Points: TBD
- Status: Proposed
- Related Spec: FEATURE_SPEC_events_registration §5 (FFR-012, FFR-013, FFR-021), §12, BR-E03
- Related Requirements: G-005

**User Story**

As a visitor with a promo code
I want to apply it to my registration
So that I pay the discounted price

**Acceptance Criteria**

1. Given an active coupon for this event
   When I apply it
   Then the amount to pay updates to price × (1 − discount%) (rounding per Q-13) and the coupon
   is saved with my registration.
2. Given an unknown, inactive, expired coupon, or one for another event
   When I apply it
   Then I see "invalid coupon" and the full price stays.
3. Given any visitor
   When the page loads
   Then no list of coupons is sent to the browser.
4. Given many failed coupon checks in a short time (from any client)
   When the global limit (§12) is reached
   Then further checks are refused for a while with a "try again later" message.

**Dependencies**
- US-019, US-023.

**Jira**
- Jira Key: TBD

### US-021 — Registrations stored in Google Drive and Sheets
- Priority: High
- Story Points: TBD
- Status: Proposed
- Related Spec: FEATURE_SPEC_events_registration §5 (FFR-014..FFR-016, FFR-022, FFR-024), §13,
  BR-E04, BR-E05
- Related Requirements: G-005, NFR-003

**User Story**

As Cami
I want every registration saved in my Google Sheets, one tab per event, with the payment
screenshot in my Drive
So that I can manage participants and payments in one place

**Acceptance Criteria**

1. Given a valid registration with an amount due above ₡0
   When the backend receives it
   Then the screenshot is saved in the configured Drive folder as
   `<ParticipantName>_<YYYY-MM-DD>_<EventCode>.<ext>` (BR-E04, Q-5). A ₡0 registration (FFR-023)
   stores no file.
2. Given a valid registration
   When it is stored
   Then a row is appended to the event's tab with timestamp, submission ID, reference, event
   code, name, email, WhatsApp, coupon, discount %, amount due, screenshot URL, check result
   (`pending` until US-022 ships), check details, status `new` and an empty notes column
   (FFR-016), with every user value stored as text (no formulas).
3. Given an event without a tab yet
   When its first registration arrives
   Then the tab is created with the header row.
4. Given invalid data or an unknown event code sent directly to the backend
   When it is received
   Then it is rejected and nothing is stored.
5. Given a valid registration for an event that closed or was unpublished after the form opened
   When it is received
   Then it is stored with status `new` and check details `event closed at submit` (FFR-024).
6. Given a retry with a submission ID already stored
   When it is received
   Then the original reference is returned and no new file or row is created.

**Dependencies**
- ADR-008 backend, US-023.

**Jira**
- Jira Key: TBD

### US-022 — Automatic check of the payment screenshot
- Priority: Medium
- Story Points: TBD
- Status: Proposed
- Related Spec: FEATURE_SPEC_events_registration §5 (FFR-017), BR-E06 (amount match rule: Q-26)
- Related Requirements: G-005

**User Story**

As Cami
I want each payment screenshot checked automatically for my SINPE number, the amount and the
description
So that I spot wrong or suspicious payments before confirming

**Acceptance Criteria**

1. Given a screenshot showing Cami's number or account name, the amount due and the expected
   description
   When it is checked
   Then the row's check result is `ok`.
2. Given a screenshot where any of those is missing or different
   When it is checked
   Then the result is `mismatch` with the failing fields listed (or the registration is
   rejected, if Q-3 decides so).
3. Given an unreadable image
   When it is checked
   Then the result is `unreadable`.
4. Given any result
   When it is written
   Then the status stays `new` until Cami changes it, and the temporary OCR Doc is deleted.
5. Given Cami's sample screenshots (Q-18)
   When the spike runs
   Then the check reads them correctly before this story is `Ready`.

**Dependencies**
- US-021; OCR spike with Cami's samples.

**Jira**
- Jira Key: TBD

### US-023 — Cami manages events and coupons without a deploy
- Priority: High
- Story Points: TBD
- Status: Proposed
- Related Spec: FEATURE_SPEC_events_registration §5 (FFR-019, FFR-020), §13
- Related Requirements: G-005

**User Story**

As Cami
I want to add or edit events and coupons in my spreadsheet
So that the site shows them without waiting for a developer

**Acceptance Criteria**

1. Given a new row in `Events` with the published flag on and a future date
   When the site is next loaded
   Then the event appears in the section and the ticker.
2. Given a row in `Coupons` for an event
   When Cami adds it or changes its discount
   Then the next coupon check uses the new value.
3. Given a row with a missing required field (code, name, date, price)
   When the site loads events
   Then that event is skipped and the others still show.

**Dependencies**
- ADR-008 backend.

**Jira**
- Jira Key: TBD
