# Project Context

## Project
- Name: cami-main-page — personal brand website for Cami Hernandez
- Repository: https://github.com/Raulc87/cami-main-page
- Status: Live at `camihernandez.com` (v1.0.1); documentation homologated to the SDD starter
  kit in CMP-014
- Product owner / final reviewer: Raul Casanas

## Active documentation
- Project spec: [docs/specs/PROJECT_SPEC.md](docs/specs/PROJECT_SPEC.md)
- User stories: [docs/specs/USER_STORIES.md](docs/specs/USER_STORIES.md)
- Feature specs: none yet — create from
  [docs/templates/FEATURE_SPEC_TEMPLATE.md](docs/templates/FEATURE_SPEC_TEMPLATE.md) as
  `docs/specs/FEATURE_SPEC_<topic>.md`
- Architecture spec: [docs/specs/ARCHITECTURE_SPEC.md](docs/specs/ARCHITECTURE_SPEC.md)
  (includes the content model, §9)
- UX/UI direction: [docs/ux/UX_UI_DIRECTION.md](docs/ux/UX_UI_DIRECTION.md)
- Tech stack: [TECH_STACK.md](TECH_STACK.md)
- ADRs: [docs/decisions/](docs/decisions/) — ADR-001..ADR-006
- Implementation plan: [docs/plans/IMPLEMENTATION_PLAN.md](docs/plans/IMPLEMENTATION_PLAN.md)
  (baseline + traceability)
- Active sprint plan: [docs/sprints/SPRINT_01_PLAN.md](docs/sprints/SPRINT_01_PLAN.md)
- Work log: [TICKETS.md](TICKETS.md)
- Process: [docs/process/](docs/process/) — pr-precheck, pr-workflow, model-cost-policy,
  release-checklist
- Templates: [docs/templates/](docs/templates/)

### Former spec names (before CMP-014)
Old PRs and ticket notes reference these files, which no longer exist:

| Old file | Now |
|---|---|
| `docs/specs/00-vision.md` | `docs/specs/PROJECT_SPEC.md` |
| `docs/specs/01-tech-stack.md` | `TECH_STACK.md` |
| `docs/specs/02-design-system.md` | `docs/ux/UX_UI_DIRECTION.md` |
| `docs/specs/03-content-model.md` | `docs/specs/ARCHITECTURE_SPEC.md` §9 |
| `docs/specs/04-architecture.md` | `docs/specs/ARCHITECTURE_SPEC.md` |
| `docs/specs/05-roadmap.md` | `docs/specs/USER_STORIES.md` (US-010..US-016) |

## Current sprint
- Sprint: 01
- Goal: approve the SDD baseline (CMP-014) and refine at least one backlog story to `Ready`
- Start: 2026-10-19
- End: 2026-10-27
- Deliverable: CMP-014 merged with approved specs; one story `Ready` for Sprint 02
- Status: Planned

## Agent allocation
- Implementation Agent 1: CMP-014 (Claude Code)
- Implementation Agent 2: unassigned
- Implementation Agent 3: unassigned
- Review-only Agent: GitHub Copilot code review

## Important constraints
- Zero / free-tier cost for every tool.
- Static GoDaddy shared hosting, manual deploy; no backend yet.
- Minimal stack — no new library without TECH_STACK update + ADR.
- Bilingual EN/ES; fixed Spanish brand accents never translate.

## Open questions
- Accessibility target (PROJECT_SPEC §16).
- Backend hosting once US-011/US-012 start.
- Which backlog story goes first (owner decision in Sprint 01).
