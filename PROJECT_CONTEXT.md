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
  (v1.0 — events and registration, US-017..US-025); new ones from
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
- Implementation plan: [docs/plans/IMPLEMENTATION_PLAN.md](docs/plans/IMPLEMENTATION_PLAN.md)
  (baseline + traceability)
- Active sprint plan: **none** — Sprint 01 is closed
  ([SPRINT_01_PLAN.md](docs/sprints/SPRINT_01_PLAN.md), kept for its review); Sprint 02 (events)
  is in planning and its plan will be listed here when it is drafted
- Work log and backlog source: [TICKETS.md](TICKETS.md) (tickets) +
  [USER_STORIES.md](docs/specs/USER_STORIES.md) (stories); no external tracker
  ([ADR-005](docs/decisions/ADR-005-in-repo-tracking.md))
- Readiness checklist:
  [docs/checklists/SPRINT_READINESS_CHECKLIST.md](docs/checklists/SPRINT_READINESS_CHECKLIST.md)
- Content (visitor-facing copy): `src/constants/i18n.js` (`UI_TEXT`) and
  `src/constants/data.jsx` (ARCHITECTURE_SPEC §9); no `CONTENT.md`
- Runbooks: release and deployment —
  [release-checklist.md](docs/process/release-checklist.md); local development —
  [README.md](README.md)
- Process: [docs/process/](docs/process/) — pr-precheck, pr-workflow, model-cost-policy,
  release-checklist
- Branching and release model:
  [ADR-007](docs/decisions/ADR-007-branching-and-release-model.md) (Accepted)
- Templates: [docs/templates/](docs/templates/)

Former spec file names (before CMP-014) are mapped in
[ADR-006 → Implementation Impact](docs/decisions/ADR-006-adopt-sdd-starter-kit.md#implementation-impact);
they are not active paths.

## Current sprint
- Sprint: 01 — **Closed 2026-10-19** (early, owner decision; review in the sprint plan).
  Sprint 02 (events feature) is in planning: US-017..US-025 are `Ready` (CMP-021); the Sprint 02
  plan is next.
- Goal (Sprint 01): approve the SDD baseline (CMP-014) and refine at least one backlog story to
  `Ready`
- Start: 2026-10-19
- End: 2026-10-27
- Agent prompts: [docs/sprints/SPRINT_01_AGENT_PROMPTS.md](docs/sprints/SPRINT_01_AGENT_PROMPTS.md)
- Deliverable: CMP-014 merged with approved specs (merged 2026-10-18; approvals recorded in
  CMP-015); one story `Ready` for Sprint 02
- Status: Closed (2026-10-19)

## Agent allocation
- Implementation Agent 1: unassigned (Sprint 01's CMP-017 is done; its session is archived when
  Sprint 01 closes)
- Implementation Agent 2: unassigned
- Implementation Agent 3: unassigned
- Review-only Agent: dedicated Claude Code reviewer session (Opus); Copilot and Codex run as
  automated reviewers on every PR
- Coordinator: Claude Code session started by the owner after CMP-015 merged; authors docs PRs
  itself and delegates any code to an implementation agent
  ([AGENTS.md → Coordinator session](AGENTS.md#coordinator-session)). Current: CMP-021
- Conflict resolution: the owner together with the agent that owns the conflicting file
  ([AGENTS.md → Parallel agent rules](AGENTS.md#parallel-agent-rules))

## Important constraints
- Zero additional licensing cost — free tier first for any new tool (hosting and ad spend
  excepted, see PROJECT_SPEC NFR-003).
- Static GoDaddy shared hosting, manual deploy; no backend yet.
- Minimal stack — no new library without TECH_STACK update + ADR.
- Bilingual EN/ES; fixed Spanish brand accents never translate.

## Open questions
- Accessibility target (PROJECT_SPEC §16).
- Backend hosting once US-011/US-012 start.
- Which backlog story goes first (owner decision in Sprint 01).
