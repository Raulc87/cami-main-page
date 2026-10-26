# IMPLEMENTATION_PLAN

## Metadata
- Version: 1.0 — baseline (as-built v1.0.1), created in CMP-014; story-status metadata updated
  in CMP-020 (2026-10-19)
- Status: Approved by the product owner (2026-10-18, CMP-014 PR #14 merged)
- Related specs: [PROJECT_SPEC](../specs/PROJECT_SPEC.md), [ARCHITECTURE_SPEC](../specs/ARCHITECTURE_SPEC.md), [UX_UI_DIRECTION](../ux/UX_UI_DIRECTION.md), [TECH_STACK](../../TECH_STACK.md)
- Related user stories: US-001..US-009 (shipped; verified in Sprint 01 — US-001, US-003,
  US-004, US-006, US-008 Done; US-002, US-005, US-007, US-009 Review, see USER_STORIES);
  US-010..US-016 (Proposed, not planned here); US-017..US-025 (events, `Ready` — planned in
  [IMPLEMENTATION_PLAN_events_registration.md](IMPLEMENTATION_PLAN_events_registration.md))

## 1. Purpose
Record how the shipped site (v1.0.1) implements the approved requirements, so new work starts
from a traced baseline. New features get their own plan from
[IMPLEMENTATION_PLAN_TEMPLATE.md](https://github.com/Raulc87/sdd_starter_kit/blob/v1.2.0/docs/plans/IMPLEMENTATION_PLAN_TEMPLATE.md) (e.g.
`docs/plans/IMPLEMENTATION_PLAN_US-012.md`).

## 2. Technical Scope
The static one-pager: 9 section components, `LanguageContext`, `useReveal`, constants and
`global.css`.

## 3. Traceability
Project Requirement → User Story → Acceptance Criterion → Implementation → Verification

| Requirement | Story | AC | Implementation | Verification (manual until a test runner exists) |
|---|---|---|---|---|
| FR-001, BR-001 | US-001 | AC1, AC3 | `Hero.jsx`, `UI_TEXT.hero` | Browser: hero renders, tagline in Spanish in both languages |
| FR-002 | US-001 | AC2 | `STATS` in `data.jsx`, `Hero.jsx` | Browser: 4 stats, labels follow toggle |
| FR-003 | US-002 | AC1, AC2 | `Services.jsx`, `SERVICES`, `.svc-card` | Browser: 3 cards, hover effect |
| FR-004, NFR-006 | US-003 | AC1, AC2 | `Gallery.jsx` `SLOTS`, `public/images/` | Browser: 5 photos load; `file public/images/*.jpg` |
| FR-005, FR-006 | US-004 | AC1, AC2 | `Process.jsx`, `Values.jsx`, `STEPS`, `VALUES` | Browser |
| FR-007, BR-003 | US-005 | AC1–AC3 | `Testimonials.jsx` (`resolveQuote`), `TESTIMONIALS` | Browser: see more/less per card, both languages |
| FR-009, BR-005 | US-006 | AC1–AC4 | `LanguageContext.jsx`, `Nav.jsx`, `i18n.js` | Browser: toggle, reload persists, `<html lang>` |
| FR-008, BR-004 | US-007 | AC1, AC2 | `CTA.jsx`, `Nav.jsx` | Browser: `mailto:` link, `#contact` anchor |
| NFR-002 | US-008 | AC1, AC2 | `global.css` breakpoints 900/640 | Browser at 375px and 900px widths |
| NFR-001, NFR-005, FR-010 | US-009 | AC1, AC2 | `index.html` meta, release checklist | `npm run build`; production check |

## 4. Current State
v1.0.1 live at `camihernandez.com`. Verified real content: hero photo, all 5 gallery photos,
all 4 testimonials and the stats. Services, process and values copy is not certified (two
services still say `Catalog coming soon`); see
[ARCHITECTURE_SPEC — Content state](../specs/ARCHITECTURE_SPEC.md#content-state).

## 5. Target State
Unchanged code. Documentation homologated to the SDD starter kit (CMP-014).

## 6. Technical Approach
See ARCHITECTURE_SPEC §6–§9.

## 7. Components / Files Affected
See ARCHITECTURE_SPEC §22.

## 8. Data Changes
- None.

## 9. API / Integration Changes
- None.

## 10. Configuration / Secrets
- None.

## 11. Implementation Steps
Already implemented (tickets CMP-001..CMP-013, see [TICKETS.md](../../TICKETS.md)).

Every future plan must say which model runs each step (see
[model-cost-policy.md](../process/model-cost-policy.md)).

## 12. Parallelization Plan
Not applicable to the baseline. Future plans: at most 3 implementation agents; define shared
contracts first; components are independent per section, but `global.css`, `i18n.js` and
`data.jsx` are shared files — only one agent may edit each at a time, or the sprint plan
must define the merge order.

## 13. Testing Strategy
- `npm run build` + manual browser verification of the traced acceptance criteria.
- Adopting a test runner (e.g. Vitest + Testing Library) requires an ADR; the table in §3 is
  the starting list of cases.

## 14. Acceptance Verification
Each AC in §3 is checked in the dev server (`npm run dev`) and, for releases, in production.

## 15. Error Handling
- `localStorage` unavailable → language falls back to `navigator.language`.
- Missing testimonial image → gradient avatar placeholder.

## 16. Migration
- None.

## 17. Rollback
- Restore the cPanel backup `.zip` taken before the upload (see
  [release-checklist.md §7](../process/release-checklist.md#7-rollback)). If no backup exists,
  check out the previous release tag, run `npm run build` and upload that `dist/` — `dist/` is
  not committed and GitHub Releases carry no build artifact.

## 18. Risks
- See PROJECT_SPEC §13 and ARCHITECTURE_SPEC §20.

## 19. Dependencies
- GoDaddy hosting, Google Fonts CDN.

## 20. Open Technical Questions
- Remove or wire `GALLERY_SLOTS` (tech debt, ARCHITECTURE_SPEC §9).

## 21. Definition of Done
See [AGENTS.md](../../AGENTS.md#definition-of-done).
