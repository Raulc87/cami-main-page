# Project Context

## Project
- Name: cami-main-page — personal brand website for Cami Hernandez
- Project key: CMP (tickets, branches, PR titles; see [AGENTS.md](AGENTS.md#tickets-and-branches))
- Repository: https://github.com/Raulc87/cami-main-page
- Starter Kit: https://github.com/Raulc87/sdd_starter_kit (AGENTS.md last aligned in CMP-016)
- Status: Live at `camihernandez.com` (v1.0.1); documentation homologated to the SDD starter
  kit in CMP-014
- Product owner / final reviewer: Raul Casanas

## Active documentation
- Project spec: [docs/specs/PROJECT_SPEC.md](docs/specs/PROJECT_SPEC.md)
- User stories: [docs/specs/USER_STORIES.md](docs/specs/USER_STORIES.md)
- Feature specs: [FEATURE_SPEC_events_registration.md](docs/specs/FEATURE_SPEC_events_registration.md)
  (v1.4 — events and registration, US-017..US-025); new ones from
  [docs/templates/FEATURE_SPEC_TEMPLATE.md](docs/templates/FEATURE_SPEC_TEMPLATE.md) as
  `docs/specs/FEATURE_SPEC_<topic>.md`
- Integration contracts: [EVENTS_API_CONTRACT.md](docs/specs/EVENTS_API_CONTRACT.md) (v1.0,
  locked) — site ↔ events backend
- Events emails and privacy notice (drafts, release gates):
  [EVENTS_EMAILS_AND_PRIVACY.md](docs/ux/EVENTS_EMAILS_AND_PRIVACY.md)
- Architecture spec: [docs/specs/ARCHITECTURE_SPEC.md](docs/specs/ARCHITECTURE_SPEC.md)
  (includes the content model, §9)
- UX/UI direction: [docs/ux/UX_UI_DIRECTION.md](docs/ux/UX_UI_DIRECTION.md)
- Tech stack: [TECH_STACK.md](TECH_STACK.md)
- ADRs: [docs/decisions/](docs/decisions/) — ADR-001..ADR-008
- Implementation plans: [docs/plans/IMPLEMENTATION_PLAN.md](docs/plans/IMPLEMENTATION_PLAN.md)
  (baseline + traceability);
  [IMPLEMENTATION_PLAN_events_registration.md](docs/plans/IMPLEMENTATION_PLAN_events_registration.md)
  (events, US-017..US-025)
- Active sprint plan: [SPRINT_02_PLAN.md](docs/sprints/SPRINT_02_PLAN.md) (Active since the
  owner's go-ahead, 2026-10-19); Sprint 01 is closed
  ([SPRINT_01_PLAN.md](docs/sprints/SPRINT_01_PLAN.md), kept for its review)
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
- Templates: [docs/templates/](docs/templates/)

Former spec file names (before CMP-014) are mapped in
[ADR-006 → Implementation Impact](docs/decisions/ADR-006-adopt-sdd-starter-kit.md#implementation-impact);
they are not active paths.

## Current sprint
- Sprint: 02 — events feature (US-017..US-025, 31 points) plus the US-002 fix and US-005 check.
  Sprint 01 closed 2026-10-19 (review in its plan).
- Goal: the events feature works end to end on staging
- Start: 2026-10-20
- End: 2026-10-28 (if the start moves: the 7th business day from the actual start)
- Agent prompts: [docs/sprints/SPRINT_02_AGENT_PROMPTS.md](docs/sprints/SPRINT_02_AGENT_PROMPTS.md)
- Deliverable: staging demo of the contract §10 end-to-end list, with evidence
  (`SPRINT_02_VERIFICATION.md`); no production release until the release-checklist §3b gates
  pass
- Status: Active — owner's go-ahead 2026-10-19: "merged, go ahead with Sprint 02"

## Agent allocation
- Implementation Agent 1: events backend — CMP-023..CMP-028 (session launched 2026-10-19)
- Implementation Agent 2: events section, ticker, frontend foundation, US-002 fix — CMP-029..CMP-031
  (session launched 2026-10-19)
- Implementation Agent 3: registration form, integration verification — CMP-032, CMP-033
  (launched when CMP-029 is merged)
- Review-only Agent: dedicated Claude Code reviewer session (Opus); Copilot and Codex run as
  automated reviewers on every PR
- Coordinator: Claude Code session started by the owner after CMP-015 merged; authors docs PRs
  itself and delegates any code to an implementation agent
  ([AGENTS.md → Coordinator session](AGENTS.md#coordinator-session)). Current: CMP-038
- Conflict resolution: the owner together with the agent that owns the conflicting file
  ([AGENTS.md → Parallel agent rules](AGENTS.md#parallel-agent-rules))

## Important constraints
- Zero additional licensing cost — free tier first for any new tool (hosting and ad spend
  excepted, see PROJECT_SPEC NFR-003).
- Static GoDaddy shared hosting, manual deploy; the events backend runs on Google Apps Script
  (ADR-008), deployed by the owner.
- Minimal stack — no new library without TECH_STACK update + ADR.
- Bilingual EN/ES; fixed Spanish brand accents never translate.

## Open questions
- Accessibility target (PROJECT_SPEC §16).
- Backend hosting for US-011/US-012, if Apps Script does not fit them (ADR-008 review trigger).
