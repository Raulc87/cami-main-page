# AGENTS.md

Mandatory entry point for any agent (or person) working in this repo. Read it first, then use
[PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) as the map of the active documentation.

## Purpose

This repository follows Spec-Driven Development (SDD), homologated to the owner's SDD starter
kit (see [ADR-006](docs/decisions/ADR-006-adopt-sdd-starter-kit.md)).

The goal is not to write code as quickly as possible. The goal is to deliver software that
conforms to approved specifications and acceptance criteria.

## What this project is

Personal brand website for **Cami Hernandez** (motivational speaker, lifestyle coach,
spiritual coach). Today it is a static bilingual one-pager in React + Vite with no backend,
live at `camihernandez.com`. It will evolve toward lead capture, a service catalog and
targeted marketing — see the backlog in [USER_STORIES.md](docs/specs/USER_STORIES.md). Full
detail: [PROJECT_SPEC.md](docs/specs/PROJECT_SPEC.md).

## Mandatory workflow

Requirement -> Discovery -> Specs -> User Stories -> Architecture/UX/Stack -> Plan -> Sprint -> Implementation -> Review -> Verification

Do not skip required stages. The project is classified **Simple** (see
[TECH_STACK.md §1](TECH_STACK.md#1-complexity-assessment)); re-assess when a backlog story
introduces a backend.

## Source-of-truth priority

When sources conflict, use this order:

1. Approved specification
2. Approved ADR
3. Approved implementation plan
4. Sprint plan
5. User story and acceptance criteria
6. Existing code
7. Informal comments or assumptions

If code conflicts with an approved spec, the spec wins unless the spec is explicitly changed.

## Before implementing

Read:

- [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md)
- [PROJECT_SPEC.md](docs/specs/PROJECT_SPEC.md)
- the relevant FEATURE_SPEC (when one exists)
- [USER_STORIES.md](docs/specs/USER_STORIES.md)
- [TECH_STACK.md](TECH_STACK.md)
- relevant ADRs in [docs/decisions/](docs/decisions/)
- [IMPLEMENTATION_PLAN.md](docs/plans/IMPLEMENTATION_PLAN.md) (or the story's own plan)
- the active sprint plan in [docs/sprints/](docs/sprints/)
- the specs your change touches: [ARCHITECTURE_SPEC.md](docs/specs/ARCHITECTURE_SPEC.md),
  [UX_UI_DIRECTION.md](docs/ux/UX_UI_DIRECTION.md)

Do not invent business requirements.

If ambiguity materially changes behavior, scope, security, cost, data handling, or
architecture, stop and request clarification.

Small implementation details may be decided autonomously when they do not alter the approved
behavior.

## Project rules

- **No new libraries/frameworks** (router, state management, CSS framework, TypeScript, test
  runner, etc.) without updating [TECH_STACK.md](TECH_STACK.md) and recording an ADR — the
  stack is intentionally minimal ([ADR-001](docs/decisions/ADR-001-minimal-static-react-stack.md)).
- **List content (services, steps, values, testimonials, stats) goes in
  `src/constants/data.jsx`**, colors in `src/constants/colors.js`. Translatable UI copy
  (headlines, kickers, CTA, badges, nav) lives in `UI_TEXT` (`src/constants/i18n.js`) and
  changes with the global language toggle. Only non-translatable text (wordmark, contact
  email, footer brand words/URL, fixed Spanish brand accents) stays hardcoded inline per
  component — exact detail in
  [ARCHITECTURE_SPEC.md §9](docs/specs/ARCHITECTURE_SPEC.md#9-logical-data-architecture-content-model).
  Do not hardcode colors outside the palette ([UX_UI_DIRECTION.md](docs/ux/UX_UI_DIRECTION.md)).
- **Placeholder content must never be treated as real data** (PROJECT_SPEC BR-002).
- **Backlog stories (`Proposed`) are not built** — they are direction, not tasks ready to
  implement. Each needs refinement to `Ready`, a ticket and, if it changes architecture, a
  FEATURE_SPEC (from [docs/templates/](docs/templates/)) before coding.
- **Zero cost / free tier first** for any new tool (analytics, email marketing, DB).
- Local development: `npm run dev` (port 5173). Build: `npm run build` → `dist/` (manual
  deploy to GoDaddy `public_html/`, see [release-checklist.md](docs/process/release-checklist.md)).

## Tickets and branches

No external tracker yet ([ADR-005](docs/decisions/ADR-005-in-repo-tracking.md)) — the project
acronym is **CMP**.

- Every unit of work is a `CMP-XXX` ticket in [TICKETS.md](TICKETS.md) (source of truth for
  sequential numbering). A ticket implements one or more user stories, or is process /
  tech-debt work.
- Branch: `CMP-XXX-short-slug` (e.g. `CMP-001-sdd-foundation`).
- Before starting, check `TICKETS.md`, take the next free number, and add the row in the
  first commit of the branch. Detail in the header of [TICKETS.md](TICKETS.md).

## Model choice

Pick the model by task, not by default. `.claude/settings.json` sets Sonnet as the project
default (implementing, debugging, reviewing). Planning/architecture → Opus; scoped edits and
copy → Haiku; mechanical checks (build, `git status`, link checks) and read-only exploration
→ the subagents in `.claude/agents/` (`mechanical-check` and `repo-explorer`). `repo-explorer`
has no write tools — not editing is a technical guarantee. `mechanical-check` does have `Bash`
(it needs it for the build) — there "do not edit" is a prompt instruction, not something the
tool prevents. **A plan must state which model runs each step** and recommend `/model ...`
switches to the user when useful — an agent cannot change its own session's model, but it can
delegate mechanical steps to cheaper subagents. Full criteria and context-hygiene practices:
[model-cost-policy.md](docs/process/model-cost-policy.md) — read it when starting a ticket.

## Scrum

- Sprints of **7 business days** (Saturdays and Sundays excluded), planned in
  [docs/sprints/](docs/sprints/) from
  [SPRINT_PLAN_TEMPLATE.md](docs/templates/SPRINT_PLAN_TEMPLATE.md).
- Every sprint must end with a demonstrable deliverable.
- Agents start implementation only after the sprint plan is approved by the owner.

## Parallel agent rules

- Maximum recommended implementation agents in parallel: 3.
- Agents must not knowingly modify the same responsibility without an explicit integration
  plan. In this repo `global.css`, `i18n.js`, `data.jsx` and `TICKETS.md` are shared files.
- Shared interfaces/contracts must be defined before parallel implementation.
- Each agent owns only its assigned scope.
- Integration must be verified after merging parallel work.
- A change is not complete merely because its own tests pass; it must not break already
  accepted functionality.

## Pull requests

Each implementation agent should:

1. Work on an isolated branch.
2. Reference the related user stories and acceptance criteria.
3. Keep the PR focused.
4. Include verification evidence.
5. Call out risks, assumptions, and unresolved items.
6. Avoid unrelated refactors.

Before opening any PR, follow without skipping steps:

0. [model-cost-policy.md](docs/process/model-cost-policy.md) — which model for which work.
1. [pr-precheck.md](docs/process/pr-precheck.md) — self-review checklist (specs updated,
   clean build, `/code-review` run).
2. [pr-workflow.md](docs/process/pr-workflow.md) — creating the PR with `gh` (title with the
   ticket ID, mandatory body sections), requesting Copilot review, and the merge criteria
   (0 unresolved line comments, ≤ 3 dismissed).

## Review-only agent

GitHub Copilot code review acts as the review-only agent (plus `/code-review` before opening
a PR). It may inspect PRs but must not implement features.

It should verify:

- spec compliance
- acceptance criteria
- code quality
- regressions
- security concerns
- stack compliance
- tests
- integration risks

The human reviewer (the owner) remains the final approver.

## Testing

Tests must derive from the spec and acceptance criteria. No test runner exists yet
([TECH_STACK.md §8](TECH_STACK.md#8-testing)) — verify manually in the dev server and record
the evidence in the PR.

At minimum, verify:

- happy path
- validation/error path
- critical integration behavior
- regression risk for touched areas (including the 640px mobile breakpoint and both
  languages)

## Definition of Done

Work is done only when:

- implementation matches approved specs
- acceptance criteria pass
- tests pass (today: `npm run build` + manual verification)
- integration remains healthy
- documentation is updated if needed
- review-only agent has completed review when configured
- final human reviewer approves

## Change management

If implementation reveals a requirement change:

1. Update the spec first.
2. Update user stories/acceptance criteria if required.
3. Update plan/sprint scope if required.
4. Then update code.

Never silently change product behavior in code. If your change alters something a spec
describes (palette, folder structure, content model, stack), **update the spec in the same
branch/PR** as the code. An outdated spec is worse than no spec.

## About this AGENTS.md

If something here becomes outdated (new ticket convention, new specs, rules that no longer
apply), fix it as part of the ticket that made it obsolete.
