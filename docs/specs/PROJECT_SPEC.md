# PROJECT_SPEC

## Metadata
- Project: cami-main-page (personal brand website for Cami Hernandez)
- Version: 1.0 (baseline homologated from `00-vision.md` + `05-roadmap.md` in CMP-014)
- Status: Approved by the product owner (2026-10-18, CMP-014 PR #14 merged)
- Owner: Raul Casanas (product owner / final reviewer)
- Last updated: 2026-10-18

## 1. Problem Statement

Cami Hernandez — motivational speaker, lifestyle coach and spiritual coach — needs a digital
presence that builds credibility for her personal brand, presents what she offers, and gives
potential clients and event organizers a clear way to contact her for bookings.

## 2. Product Vision

Today the site is a bilingual (English/Spanish) **one-pager**: a 100% static landing page with
no backend, no database and no working forms. It lives at `camihernandez.com`.

The site is expected to evolve from a static landing page into a platform with lead capture,
a service catalog and targeted marketing (see the backlog stories US-010..US-016 in
[USER_STORIES.md](USER_STORIES.md)). Those are direction, not built features.

## 3. Goals
- G-001: Establish a credible digital presence for Cami's personal brand.
- G-002: Present the three service pillars: motivational speaking, lifestyle coaching and
  spiritual coaching.
- G-003: Give visitors a single, clear contact point for booking (`#contact`).
- G-004: Serve both English- and Spanish-speaking visitors with a fully translated interface.
- G-005 (future): Capture and nurture leads, and use visitor data to target marketing — see
  backlog stories US-010..US-016.

## 4. Non-Goals
- No user accounts, login or member area.
- No online payments or e-commerce today (a catalog is backlog, see US-010).
- No CMS: content is edited in code (see
  [ARCHITECTURE_SPEC.md §9](ARCHITECTURE_SPEC.md#9-logical-data-architecture-content-model)).
- No blog or multi-page routing.

## 5. Users / Actors
- **Prospective client** (men and women 25+ seeking personal transformation — "done playing
  small", current hero copy):
  - Need: understand who Cami is, what she offers, and trust her (testimonials, stats).
  - Context: arrives from social media or referrals, often on mobile; English or Spanish.
- **Event organizer**:
  - Need: evaluate Cami as a speaker and book her.
  - Context: looks for stage photos, credibility signals and a contact channel.
- **Site owner (Cami / product owner)**:
  - Need: keep content accurate and the site online at minimal cost.
  - Context: no budget for licenses; content changes go through tickets.

## 6. Functional Requirements
- FR-001: The page presents Cami's brand identity in a hero section: headline, sub-headline,
  photo, role badge and a primary booking CTA.
- FR-002: The page shows a stats bar with key credibility numbers.
- FR-003: The page presents the three service pillars, each with a description and an
  availability note (e.g. `Booking available`, `Catalog coming soon`).
- FR-004: The page shows a gallery of real photos (on stage, workshop, 1-on-1, community,
  behind the scenes).
- FR-005: The page explains a 3-step process (Discover → Transform → Thrive).
- FR-006: The page shows Cami's core values, each with its Spanish and English name.
- FR-007: The page shows real client testimonials, with photo when available and an optional
  long version expandable via "see more"/"ver más".
- FR-008: Visitors can contact Cami for booking via an email CTA.
- FR-009: The whole interface switches between English and Spanish with one global toggle in
  the nav; the default follows the visitor's browser language and the choice persists across
  visits.
- FR-010: The page exposes SEO and social-sharing metadata (`title`, `description`, `og:*`).

## 7. Non-Functional Requirements
- NFR-001: Hosting is static files on GoDaddy shared hosting — no server runtime is
  available for the current site (see [ADR-002](../decisions/ADR-002-godaddy-static-hosting.md)).
- NFR-002: The layout is responsive: desktop, a tablet breakpoint at 900px and a mobile
  breakpoint at 640px; all images stay visible on mobile.
- NFR-003: Zero additional licensing cost — free tier first for any newly selected tool or
  service. The existing paid GoDaddy hosting
  ([ADR-002](../decisions/ADR-002-godaddy-static-hosting.md)) is a pre-existing cost, and
  advertising spend (e.g. US-016) is a product-owner budget decision outside this requirement.
- NFR-004: Minimal stack — no new library or framework without updating
  [TECH_STACK.md](../../TECH_STACK.md) and recording an ADR.
- NFR-005: `npm run build` must succeed with no errors before any deploy.
- NFR-006: Images are optimized for the web (resized JPEG) before being added to
  `public/images/`.

## 8. Business Rules
- BR-001: Fixed Spanish brand accents never change with the language toggle: the hero tagline
  "Disciplina hoy, libertad mañana.", the quote over the hero photo, the bilingual value
  names, and the footer brand words.
- BR-002: Placeholder content must be clearly marked as such; agents must never treat
  placeholder content as real data.
- BR-003: Testimonials are only published from real, client-provided content (no fictional
  testimonials).
- BR-004: The booking/contact email is `camila@lifetoolscr.com`.
- BR-005: The brand wordmark "Cami Hernandez" is never translated.

## 9. Main Product Flow

1. A visitor lands on the page (default language from the browser, or from their last
   choice).
2. They read the hero, stats and services, browse the gallery, process, values and
   testimonials (sections reveal on scroll).
3. They optionally switch the language with the nav toggle.
4. They click "Book Cami" (nav) or the final CTA and send an email to book.

## 10. Data and Integrations
- Content: static marketing content bundled in the code (services, steps, values,
  testimonials, stats, translations).
- Persistence: none today. Language preference is stored in the visitor's browser only.
- External systems: Google Fonts (CDN). No analytics, forms or third-party APIs today.
- Future (backlog): lead database, Google Workspace, analytics, email marketing, social ads —
  see US-010..US-016.

## 11. Constraints
- Budget: personal project, no license budget — free tier first (NFR-003).
- Hosting: GoDaddy shared hosting, manual upload to `public_html/` (NFR-001).
- Team: one developer plus AI agents; the product owner is the final approver.
- Process: Spec-Driven Development with Scrum sprints of 7 business days (see
  [AGENTS.md](../../AGENTS.md)).

## 12. Assumptions
- The visitor audience is mostly Spanish- and English-speaking.
- Email is an acceptable booking channel until a lead-capture form exists (US-012).
- A future backend will be Node.js, which may require hosting beyond static shared hosting
  (see [TECH_STACK.md §14](../../TECH_STACK.md#14-upgrade--scaling-path)).

## 13. Risks
- Shared hosting may not support the planned backend (lead capture, questionnaire).
- Content drift: `global.css` repeats palette hex values by hand (see
  [UX_UI_DIRECTION.md](../ux/UX_UI_DIRECTION.md)).
- No automated tests — regressions are caught only by build + manual browser checks.
- Manual deploy is error-prone (see [release-checklist.md](../process/release-checklist.md)).

## 14. Success Criteria
- The site is live at `camihernandez.com` and serves all sections in both languages. (Met at
  v1.0.0.)
- Photos, testimonials and stats are real — no placeholder photos or fictional testimonials.
  (Met as of CMP-011 for the hero photo, all 5 gallery photos, all 4 testimonials and the
  stats.) Other copy (services, process, values) is not certified as verified data; see
  [ARCHITECTURE_SPEC — Content state](ARCHITECTURE_SPEC.md#content-state) and BR-002.
- Booking requests arrive through the contact email.
- Future: measurable leads captured and visitor demographics available (US-012, US-014).

## 15. Out of Scope
Not part of the current release; tracked as backlog in [USER_STORIES.md](USER_STORIES.md):
- Service catalog (US-010)
- Intake questionnaire (US-011)
- Lead capture with persistence (US-012)
- Google Workspace integrations (US-013)
- Site analytics (US-014)
- Email marketing campaigns (US-015)
- Demographic social ads (US-016)
- Upcoming events and paid registration (US-017..US-023), Discovery in progress —
  [FEATURE_SPEC_events_registration.md](FEATURE_SPEC_events_registration.md) (Draft)

Each one needs its own ticket and, when it changes architecture, its own FEATURE_SPEC (from
[docs/templates/FEATURE_SPEC_TEMPLATE.md](../templates/FEATURE_SPEC_TEMPLATE.md)) before
implementation.

## 16. Open Questions
- Accessibility target (e.g. WCAG 2.1 AA) has never been defined — should it become an NFR?
- Where will the backend be hosted once US-011/US-012 start?
- Should two of three services keep `Catalog coming soon` until US-010 is scheduled?

## 17. Approval
- Approved by: Raul Casanas (product owner), by merging the CMP-014 PR (#14)
- Date: 2026-10-18
