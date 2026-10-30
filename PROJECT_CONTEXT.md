# Project Context

## Project
- Name: cami-main-page — personal brand website for Cami Hernandez
- Project key: CMP (tickets, branches, PR titles; see [AGENTS.md](AGENTS.md#tickets-and-branches))
- Repository: https://github.com/Raulc87/cami-main-page
- Starter Kit: https://github.com/Raulc87/sdd_starter_kit (private: attach it to the sessions
  that read its templates, guides and skills) · Edition: Full · Synced to kit v1.3.0 (tag on
  commit `c01c098`, CMP-097; before: v1.2.0, CMP-055). Templates, guides and kit skills are read at this ref; each kit
  sync PR updates it.
- Repository visibility: public (kept public as the owner's portfolio, kit #16) · current
  setting public (only the owner changes it)
- Kept project rules (instead of the kit's), with their reasons:
  [ADR-006 → Kit disposition](docs/decisions/ADR-006-adopt-sdd-starter-kit.md#kit-disposition)
- Status: Live at `camihernandez.com` (v1.1.2 since 2026-10-29, PageSpeed mobile 90–97 and
  desktop 99; v1.1.1 the same day was the first release uploaded by the site-upload workflow; the events feature live since 2026-10-27);
  documentation homologated to the SDD starter kit in CMP-014
- Product owner / final reviewer: Raul Casanas

## Active documentation
- Project spec: [docs/specs/PROJECT_SPEC.md](docs/specs/PROJECT_SPEC.md)
- User stories: [docs/specs/USER_STORIES.md](docs/specs/USER_STORIES.md)
- Feature specs: [FEATURE_SPEC_events_registration.md](docs/specs/FEATURE_SPEC_events_registration.md)
  (v1.13 — events and registration, US-017..US-025); new ones from the kit's
  `FEATURE_SPEC_TEMPLATE.md` (at the kit ref above) as `docs/specs/FEATURE_SPEC_<topic>.md`
- Integration contracts: [EVENTS_API_CONTRACT.md](docs/specs/EVENTS_API_CONTRACT.md) (v1.9,
  locked) — site ↔ events backend
- Events emails and privacy notice (approved by Cami 2026-10-26, CMP-058):
  [EVENTS_EMAILS_AND_PRIVACY.md](docs/ux/EVENTS_EMAILS_AND_PRIVACY.md)
- Architecture spec: [docs/specs/ARCHITECTURE_SPEC.md](docs/specs/ARCHITECTURE_SPEC.md)
  (includes the content model, §9)
- UX/UI direction: [docs/ux/UX_UI_DIRECTION.md](docs/ux/UX_UI_DIRECTION.md)
- Tech stack: [TECH_STACK.md](TECH_STACK.md)
- ADRs: [docs/decisions/](docs/decisions/) — ADR-001..ADR-010
- Implementation plans: [docs/plans/IMPLEMENTATION_PLAN.md](docs/plans/IMPLEMENTATION_PLAN.md)
  (baseline + traceability);
  [IMPLEMENTATION_PLAN_events_registration.md](docs/plans/IMPLEMENTATION_PLAN_events_registration.md)
  (events, US-017..US-025)
- Active sprint plan: [SPRINT_04_PLAN.md](docs/sprints/SPRINT_04_PLAN.md) (Active since the
  owner's go-ahead, 2026-10-29); Sprints 01 to 03 are closed
  ([SPRINT_01_PLAN.md](docs/sprints/SPRINT_01_PLAN.md),
  [SPRINT_02_PLAN.md](docs/sprints/SPRINT_02_PLAN.md),
  [SPRINT_03_PLAN.md](docs/sprints/SPRINT_03_PLAN.md), kept for their reviews)
- Work log and backlog source: [TICKETS.md](TICKETS.md) (tickets) +
  [USER_STORIES.md](docs/specs/USER_STORIES.md) (stories); no external tracker
  ([ADR-005](docs/decisions/ADR-005-in-repo-tracking.md))
- Readiness checklist:
  [docs/checklists/SPRINT_READINESS_CHECKLIST.md](docs/checklists/SPRINT_READINESS_CHECKLIST.md)
- Content (visitor-facing copy): `src/constants/i18n.js` (`UI_TEXT`) and
  `src/constants/data.jsx` (ARCHITECTURE_SPEC §9); no `CONTENT.md`
- Runbooks: release and deployment —
  [release-checklist.md](docs/process/release-checklist.md); events backend (Apps Script)
  deploy — [events-backend-runbook.md](docs/process/events-backend-runbook.md); local
  development — [README.md](README.md)
- Process: [docs/process/](docs/process/) — pr-precheck, pr-workflow, model-cost-policy,
  release-checklist, events-backend-runbook
- Branching and release model:
  [ADR-007](docs/decisions/ADR-007-branching-and-release-model.md) (Accepted)
- Security baseline: [docs/security/SECURITY_BASELINE.md](docs/security/SECURITY_BASELINE.md)
  (approved on merge of PR #58, CMP-056; ASVS 5.0.0 level 2, not high-risk) with its
  [ASVS inventory](docs/security/ASVS_INVENTORY.md); security acceptance criteria SAC-01..SAC-17
  in [USER_STORIES.md → Security](docs/specs/USER_STORIES.md#security)
- Penetration-test plan: [docs/security/PENTEST_PLAN.md](docs/security/PENTEST_PLAN.md)
  (approved on merge of PR #60, CMP-062), required because the site is live and the events
  feature handles personal data and payment receipts;
  the PTES test, run by a tester the owner authorizes in writing, is due 60 days after the
  events go-live, a dated deadline recorded in the baseline; after it, the test gates every
  release (owner decisions, SPRINT_03_PLAN → Sprint Review Notes)
- Developer guide: [CONTRIBUTING.md](CONTRIBUTING.md) (CMP-057, PR #64): setup, commands,
  structure and conventions
- Docs link check: [.github/workflows/docs-link-check.yml](.github/workflows/docs-link-check.yml)
  (every pull request; run locally with `python3 .github/scripts/check_doc_links.py`)
- Templates: none in this repo; read from the kit at the kit ref above

Former spec file names (before CMP-014) are mapped in
[ADR-006 → Implementation Impact](docs/decisions/ADR-006-adopt-sdd-starter-kit.md#implementation-impact);
they are not active paths.

## Current sprint
- Sprint: 04 — site upload from GitHub (ADR-010), dependency checks (CMP-071), event-tab
  format, PTES test preparation. Sprint 03 closed 2026-10-28 with the events live (v1.1.0;
  review in its plan).
- Goal: safer, lighter releases after the go-live; the PTES test ready to hand to a tester
  before its deadline (2026-12-26)
- Start: 2026-10-29
- End: 2026-11-05
- Agent prompts: [docs/sprints/SPRINT_04_AGENT_PROMPTS.md](docs/sprints/SPRINT_04_AGENT_PROMPTS.md)
- Deliverable: release v1.1.1 live (PageSpeed 90+), uploaded by the site-upload workflow if ready
  or by hand; the pre-release security agent's production scan; evidence in
  `SPRINT_04_VERIFICATION.md`. v1.1.1 live 2026-10-29 (desktop 99, mobile 86–89); the mobile
  target moves to v1.1.2 (CMP-108); the production scan did not run and is covered by the PTES
  test (owner, 2026-10-29; plan Review Notes)
- Status: Closed 2026-10-29 (owner: "merged 123, yes close sprint 04"); evidence in
  [docs/sprints/SPRINT_04_VERIFICATION.md](docs/sprints/SPRINT_04_VERIFICATION.md). The next
  sprint is planned with the owner; until then, open items are in the verification's §4

## Agent allocation
- Sprint 04 sessions (Agents 1–3, review-only agent) archived at closing, 2026-10-29
- Implementation Agent 1: events backend and deploys — CMP-094, CMP-101, CMP-093, CMP-096
  (session launched 2026-10-29)
- Implementation Agent 2: security — CMP-071, CMP-095 (session launched 2026-10-29)
- Implementation Agent 3: site performance and release — CMP-102, CMP-103 (session launched
  2026-10-29)
- Pre-release security agent: CMP-098, CMP-104, own session (launched 2026-10-29, before the
  go-ahead)
- Review-only Agent: a fresh Claude Code reviewer session (Opus) for Sprint 04, launched
  2026-10-29; Codex runs as
  the automated reviewer on every PR (ADR-006 → Kit disposition, kept rule Reviewers)
- Coordinator: Claude Code session started by the owner after CMP-015 merged; authors docs PRs
  itself and delegates any code to an implementation agent
  ([AGENTS.md → Coordinator session](AGENTS.md#coordinator-session)). Current: CMP-092, CMP-105
- Conflict resolution: the owner together with the agent that owns the conflicting file
  ([AGENTS.md → Parallel agent rules](AGENTS.md#parallel-agent-rules))

## Important constraints
- Zero additional licensing cost — free tier first for any new tool (hosting and ad spend
  excepted, see PROJECT_SPEC NFR-003).
- Static GoDaddy shared hosting, manual deploy; the events backend runs on Google Apps Script
  (ADR-008), deployed from GitHub by a workflow; production runs need the owner's approval
  (ADR-009).
- Minimal stack — no new library without TECH_STACK update + ADR.
- Bilingual EN/ES; fixed Spanish brand accents never translate.

## Open questions
- Accessibility target (PROJECT_SPEC §16).
- Backend hosting for US-011/US-012, if Apps Script does not fit them (ADR-008 review trigger).
