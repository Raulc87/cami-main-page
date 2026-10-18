# Tickets — CMP

Sequential work log for the **cami-main-page** project. We don't use an external system (Jira,
Linear, etc.) yet — this file is the **source of truth** for ticket numbering while the project
has a single developer. When the cost is justified (more people, need for reporting/automation),
it can be migrated to Linear (it has a free tier) by importing these same rows.

## How this fits the process

- A ticket `CMP-XXX` is the **unit of work**: one branch + one PR.
- A ticket implements one or more **user stories** from
  [docs/specs/USER_STORIES.md](docs/specs/USER_STORIES.md) (listed in the `Stories` column), or is
  process/tech-debt work with no story (`—`).
- Tickets are selected into **sprints** in [docs/sprints/](docs/sprints/).

## How to use this

1. Before starting something new, check the table below and take the next available number (the
   highest + 1). Don't reuse or "reserve" numbers.
2. Create the branch as `CMP-XXX-short-slug` (English or Spanish, whichever best describes the
   work).
3. Add the row to the table in the same commit where you start the work, to minimize collisions if
   at some point more than one thread/agent works in parallel.
4. Update the status as you go. When the PR is merged, status = `done`.

**States:** `todo` · `in-progress` · `review` · `done` · `dropped`

## Tickets

| ID | Title | Stories | Status | Branch | Date | Notes |
|----|-------|---------|--------|--------|------|-------|
| CMP-001 | Spec Driven Development foundation (specs + AGENTS.md + this ticket log) | — | done | `CMP-001-sdd-foundation` | 2026-08-20 | Creates `docs/specs/`, `docs/process/` (pr-precheck, pr-workflow), `AGENTS.md` and this file. |
| CMP-002 | Real photos (Hero/Gallery) + first real testimonial with language toggle | US-003, US-005 | done | `claude/cmp-testimonios-images-lang-toggle-4dca1a` | 2026-08-20 | Replaces 2 photo placeholders, adds Ana Lu's real testimonial with a Spanish/English toggle and a see more/see less link. Branch doesn't follow the `CMP-XXX-slug` pattern because the agent harness (worktree) assigns it; see PR. |
| CMP-003 | Global language toggle in the banner (replaces the per-testimonial toggle from CMP-002) | US-006 | done | `claude/cmp-global-language-banner-5da139` | 2026-08-20 | Moves the EN/ES switch from `Testimonials.jsx` to the `Nav`; adds `LanguageContext` + `useLanguage()`, `constants/i18n.js` (`UI_TEXT`) and translations for the whole page. Branch assigned by the agent harness (worktree); see PR. |
| CMP-004 | Repo README | — | done | `CMP-004-readme` | 2026-08-21 | Creates `README.md` at the root: what the project is, how to run it locally, scripts, deploy, and a pointer to `AGENTS.md`/`docs/specs/` as the source of truth. |
| CMP-005 | Model and token-saving policy for development | — | done | `CMP-004-model-cost-policy` | 2026-08-21 | Creates `docs/process/model-cost-policy.md`; hooks model choice into `AGENTS.md` and `pr-precheck.md`. Documentation only. The branch says `CMP-004` because it was created before PR #4 merged and took that number; it was renumbered to CMP-005 when resolving the collision, and the branch was left as is so as not to break the already-open PR. |
| CMP-006 | Update the CTA contact email to camila@lifetoolscr.com | US-007 | done | `CMP-006-cta-email-update` | 2026-08-21 | Changes the button's `mailto:` and the text below it in `CTA.jsx` (the only two places with the contact email — `Footer.jsx` has no email). No spec changes needed: `03-content-model.md` already points the contact email to `CTA.jsx`. |
| CMP-007 | Version `.claude/settings.json` with Sonnet as the project default | — | done | `claude/settings-sonnet-default-e1fb14` | 2026-08-21 | Creates `.claude/settings.json` (model: sonnet) and cheap subagents in `.claude/agents/` to delegate mechanical checks and exploration to Haiku; adds `.claude/worktrees/` to `.gitignore`; documents it in `model-cost-policy.md`. Branch assigned by the agent harness (worktree), doesn't follow the `CMP-XXX-slug` pattern. |
| CMP-008 | 3 real testimonials (Melissa, Rocío, Stefanny) with photo, replacing the last 3 fictitious ones | US-005 | done | `CMP-008-testimonios-melissa-rocio-stefanny` | 2026-09-03 | Replaces Diego R./Valentina P./Andrés C. — no fictitious testimonial remains. Extends the see more/see less mechanism (previously exclusive to the featured one) to any grid testimonial with `quoteLong`; Stefanny uses it. |
| CMP-009 | Ana Lucía's full name in her testimonial, no title | US-005 | done | `CMP-009-ana-lucia-nombre-completo` | 2026-09-03 | Changes `name: 'Ana Lu'` → `'Ana Lucía'` and removes `role: 'Photographer & Entrepreneur'` in `TESTIMONIALS[0]` (data.jsx). Copy only, no spec changes. |
| CMP-010 | Real photos for the 4 remaining Gallery slots (On Stage, Workshop, Community, Behind the Scenes) | US-003 | done | `CMP-010-galeria-fotos-reales` | 2026-09-04 | Adds `on-stage.jpg`, `workshop.jpg`, `community.jpg`, `behind-the-scenes.jpg` to `public/images/` (converted from PNG to JPEG, resized) and hooks them into `SLOTS` in `Gallery.jsx`. No slot is left as a placeholder gradient. |
| CMP-011 | Real numbers in the Hero stats bar | US-001 | done | `CMP-011-stats-numeros-reales` | 2026-09-04 | Changes `STATS` in `data.jsx`: Lives Transformed 500+→100, Conference Events 50+→25, Years of Experience 12+→6+, Pillars of Change 3→4. Copy only, updates the example in `03-content-model.md`. |
| CMP-012 | First release process (deploy to GoDaddy + GitHub Release) | US-009 | done | `CMP-012-primer-release-godaddy-github` | 2026-09-04 | Documents `docs/process/release-checklist.md` (versioning, build, manual upload to GoDaddy `public_html/` via cPanel File Manager, tag + `gh release create`), including the real pitfalls found (Airo product vs Web Hosting, migration wizard, default placeholder files). Bumps `package.json` to `1.0.0`. Runs the first real release: `camihernandez.com` now serves the site on GoDaddy Web Hosting, tag/release `v1.0.0` published on GitHub. |
| CMP-013 | Fix Hero and Gallery on mobile (invisible images at <640px) | US-008 | done | `CMP-012-fix-mobile-hero-gallery` | 2026-09-07 | The Hero image wrapper and the `.gallery-grid` cells depended on the parent layout (flex-row / grid with fixed rows) to give them size; when switching to column/auto at the 640px breakpoint, they collapsed to ~0 because their only content was `position: absolute`. Fix: `hero-img-wrap`/`hero-img-frame` with explicit width/height on mobile, and `.gallery-grid` with a fixed `grid-template-rows` instead of `auto`. Updates `02-design-system.md`. The branch says `CMP-012` because it was created before PR #12 (`CMP-012-primer-release-godaddy-github`) showed up in `main`'s `TICKETS.md` and took that number; it was renumbered to CMP-013 when resolving the collision, and the branch was left as is so as not to break the already-open PR (#13). |
| CMP-014 | Homologate the repo to the SDD starter kit (English docs, kit file structure, user stories, ADRs, Scrum sprints) | — | done | `CMP-014-sdd-starter-kit-homologation` | 2026-10-17 | Renames/restructures specs to the kit layout (PROJECT_SPEC, USER_STORIES, ARCHITECTURE_SPEC, UX_UI_DIRECTION, TECH_STACK), adds CLAUDE.md, PROJECT_CONTEXT.md, retroactive ADR-001..ADR-006, IMPLEMENTATION_PLAN, SPRINT_01_PLAN, kit templates and the Coordinator session rules (brownfield); translates all docs to English. |
