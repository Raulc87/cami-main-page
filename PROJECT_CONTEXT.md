# Project Context

## Project
- Name: cami-main-page — personal brand website for Cami Hernandez
- Project key: CMP (tickets, branches, PR titles; see [AGENTS.md](AGENTS.md#tickets-and-branches))
- Repository: https://github.com/Raulc87/cami-main-page
- Starter Kit: https://github.com/Raulc87/sdd_starter_kit (private: attach it to the sessions
  that read its templates, guides and skills) · Edition: Full · Synced to kit v1.2.0 (tag on
  commit `bd756f9`, CMP-055). Templates, guides and kit skills are read at this ref; each kit
  sync PR updates it.
- Repository visibility: public (kept public as the owner's portfolio, kit #16) · current
  setting public (only the owner changes it)
- Kept project rules (instead of the kit's), with their reasons:
  [ADR-006 → Kit disposition](docs/decisions/ADR-006-adopt-sdd-starter-kit.md#kit-disposition)
- Status: Live at `camihernandez.com` (v1.0.1); documentation homologated to the SDD starter
  kit in CMP-014
- Product owner / final reviewer: Raul Casanas

## Active documentation
- Project spec: [docs/specs/PROJECT_SPEC.md](docs/specs/PROJECT_SPEC.md)
- User stories: [docs/specs/USER_STORIES.md](docs/specs/USER_STORIES.md)
- Feature specs: [FEATURE_SPEC_events_registration.md](docs/specs/FEATURE_SPEC_events_registration.md)
  (v1.10 — events and registration, US-017..US-025); new ones from the kit's
  `FEATURE_SPEC_TEMPLATE.md` (at the kit ref above) as `docs/specs/FEATURE_SPEC_<topic>.md`
- Integration contracts: [EVENTS_API_CONTRACT.md](docs/specs/EVENTS_API_CONTRACT.md) (v1.5,
  locked) — site ↔ events backend
- Events emails and privacy notice (approved by Cami 2026-10-26, CMP-058):
  [EVENTS_EMAILS_AND_PRIVACY.md](docs/ux/EVENTS_EMAILS_AND_PRIVACY.md)
- Architecture spec: [docs/specs/ARCHITECTURE_SPEC.md](docs/specs/ARCHITECTURE_SPEC.md)
  (includes the content model, §9)
- UX/UI direction: [docs/ux/UX_UI_DIRECTION.md](docs/ux/UX_UI_DIRECTION.md)
- Tech stack: [TECH_STACK.md](TECH_STACK.md)
- ADRs: [docs/decisions/](docs/decisions/) — ADR-001..ADR-009
- Implementation plans: [docs/plans/IMPLEMENTATION_PLAN.md](docs/plans/IMPLEMENTATION_PLAN.md)
  (baseline + traceability);
  [IMPLEMENTATION_PLAN_events_registration.md](docs/plans/IMPLEMENTATION_PLAN_events_registration.md)
  (events, US-017..US-025)
- Active sprint plan: [SPRINT_03_PLAN.md](docs/sprints/SPRINT_03_PLAN.md) (Planned; active at
  the owner's go-ahead); Sprints 01 and 02 are closed
  ([SPRINT_01_PLAN.md](docs/sprints/SPRINT_01_PLAN.md),
  [SPRINT_02_PLAN.md](docs/sprints/SPRINT_02_PLAN.md), kept for their reviews)
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
- Security baseline: `docs/security/SECURITY_BASELINE.md`, not written yet: planned as
  CMP-056 in Sprint 03, approved by its end (AGENTS.md → Security baseline)
- Penetration-test plan: `docs/security/PENTEST_PLAN.md`, required (the site is live and the
  events feature handles personal data and payment receipts): written in Sprint 03 (CMP-062);
  the PTES test, run by a tester the owner authorizes in writing, comes before the events
  production release, in Sprint 04 (owner decisions, CMP-056 and SPRINT_03_PLAN)
- Developer guide: `CONTRIBUTING.md`, not written yet: planned as CMP-057 in
  Sprint 03; until then
  [README.md](README.md) covers local development
- Docs link check: [.github/workflows/docs-link-check.yml](.github/workflows/docs-link-check.yml)
  (every pull request; run locally with `python3 .github/scripts/check_doc_links.py`)
- Templates: none in this repo; read from the kit at the kit ref above

Former spec file names (before CMP-014) are mapped in
[ADR-006 → Implementation Impact](docs/decisions/ADR-006-adopt-sdd-starter-kit.md#implementation-impact);
they are not active paths.

## Current sprint
- Sprint: 03 — release preparation for the events feature (security baseline, pen-test plan,
  production backend, real-iPhone check) and backlog fixes CMP-050, CMP-052..CMP-054. Sprint 02
  closed 2026-10-26 (review in its plan).
- Goal: the events feature is release-ready except for the penetration test
- Start: 2026-10-28
- End: 2026-11-05 (if the start moves: the 7th business day from the actual start)
- Agent prompts: [docs/sprints/SPRINT_03_AGENT_PROMPTS.md](docs/sprints/SPRINT_03_AGENT_PROMPTS.md)
- Deliverable: staging demo and production-backend smoke results, with evidence
  (`SPRINT_03_VERIFICATION.md`); no production release of the events in Sprint 03: the PTES
  test and the go-live are Sprint 04 (owner: "Find one; release next sprint")
- Status: Planned — waiting for the plan's merge and the owner's go-ahead

## Agent allocation
- Implementation Agent 1: events backend and production setup — CMP-053, CMP-050, CMP-052,
  CMP-064 (fresh session at the go-ahead)
- Implementation Agent 2: security — CMP-056, CMP-062, CMP-063 (fresh session at the go-ahead)
- Implementation Agent 3: site, developer guide, iPhone check, verification — CMP-057, CMP-054,
  CMP-065, CMP-066 (fresh session at the go-ahead)
- Review-only Agent: a fresh Claude Code reviewer session (Opus) for Sprint 03; Codex runs as
  the automated reviewer on every PR (ADR-006 → Kit disposition, kept rule Reviewers)
- Coordinator: Claude Code session started by the owner after CMP-015 merged; authors docs PRs
  itself and delegates any code to an implementation agent
  ([AGENTS.md → Coordinator session](AGENTS.md#coordinator-session)). Current: CMP-060
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
