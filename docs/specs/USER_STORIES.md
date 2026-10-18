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

## Shipped (Review — pending Sprint 01 verification)

### US-001 — Brand hero with credibility stats
- Priority: Critical
- Story Points: — (retroactive)
- Status: Review
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
- Status: Review
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
- Status: Review
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
- Status: Review
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
- Status: Review
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
- Status: Review
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
- Status: Review
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
- Status: Review
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
- Status: Review
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
