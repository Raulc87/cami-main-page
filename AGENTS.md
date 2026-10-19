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

Do not skip required stages. The project is classified **Standard** since the events feature
added a backend (TECH_STACK v1.2, CMP-021; see
[TECH_STACK.md §1](TECH_STACK.md#1-complexity-assessment)).

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

## Document map

[PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) is the authoritative list of the active documents and
their paths. This repo's locations (where they differ from the Starter Kit, see
[Differences from the Starter Kit](#differences-from-the-starter-kit)):

| Document | Path | Required |
|---|---|---|
| Project context | `PROJECT_CONTEXT.md` | Always |
| Project spec | `docs/specs/PROJECT_SPEC.md` | Always |
| User stories | `docs/specs/USER_STORIES.md` | Always |
| Feature specs | `docs/specs/FEATURE_SPEC_<topic>.md` | When a story changes architecture |
| Architecture spec | `docs/specs/ARCHITECTURE_SPEC.md` (includes the content model, §9) | Always |
| Integration contracts | `docs/specs/<NAME>_CONTRACT.md` (from `docs/templates/INTEGRATION_CONTRACT_TEMPLATE.md`) | Whenever two workstreams share an interface |
| UX/UI direction | `docs/ux/UX_UI_DIRECTION.md` | Always |
| Content (copy) | `src/constants/i18n.js` (`UI_TEXT`) and `src/constants/data.jsx`, per ARCHITECTURE_SPEC §9 — no `CONTENT.md` | Always |
| Tech stack | `TECH_STACK.md` | Always |
| ADRs | `docs/decisions/ADR-<NNN>-<kebab-title>.md` | When a decision needs recording |
| Implementation plan | `docs/plans/IMPLEMENTATION_PLAN.md` | Always |
| Sprint plans | `docs/sprints/SPRINT_<NN>_PLAN.md` (the active one is named in `PROJECT_CONTEXT.md`) | Always |
| Agent prompts | `docs/sprints/SPRINT_<NN>_AGENT_PROMPTS.md` | Sprints that use agent sessions |
| Readiness checklist | `docs/checklists/SPRINT_READINESS_CHECKLIST.md` | Before every sprint |
| Release / deployment runbook | `docs/process/release-checklist.md` | Always (the site is live) |
| Branching and release ADR | `docs/decisions/ADR-007-branching-and-release-model.md` | Always (the site is live) |
| Local development | `README.md` | Always |
| Templates | `docs/templates/*_TEMPLATE.md` | — |

If a path listed in `PROJECT_CONTEXT.md` does not exist, or a required document is missing,
stop and report it before implementing.

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
  first commit of the branch. **Exception:** a ticket planned in a sprint already has a `todo`
  row (added by the sprint plan PR, see [Sprint readiness](#sprint-readiness)); take that
  number and update the row instead of adding one. Detail in the header of
  [TICKETS.md](TICKETS.md).

## Model choice

Pick the model by task, not by default. `.claude/settings.json` sets Sonnet as the project
default (implementing, debugging, answering review comments); the review-only agent runs on
Opus in its own session. Planning/architecture → Opus; scoped edits and
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
- Agents start sprint work only after the sprint plan is approved by the owner (see
  [Sprint readiness](#sprint-readiness)).
- **Unplanned work** (production hotfixes, small copy/content changes) may proceed outside the
  sprint as a normal ticket when the owner explicitly asks for it; note it in the active sprint
  plan's review notes.

## Sprint readiness

- A sprint starts only after its readiness check
  ([SPRINT_READINESS_CHECKLIST.md](docs/checklists/SPRINT_READINESS_CHECKLIST.md)) has no open
  blocking items and the human owner gives an explicit go-ahead. Record the result in the
  sprint plan's "Entry Gates" section.
- Agents do not start a sprint on their own initiative.
- **Ticket numbers for the plan.** The checklist asks for each story's planned branch name.
  Here that means a `CMP-XXX` number: the sprint plan PR adds one `todo` row per planned
  ticket to [TICKETS.md](TICKETS.md), which allocates the numbers (a recorded row is not a
  "reserved" number). The implementing agent then updates that row instead of adding one.
- The readiness checklist applies from Sprint 02 on; Sprint 01 was planned before it existed.
  The ticket-number rule above applies from now on (CMP-017's row was added in CMP-016).

## Parallel agent rules

- Maximum recommended implementation agents in parallel: 3.
- Agents must not knowingly modify the same responsibility without an explicit integration
  plan. In this repo `global.css`, `i18n.js`, `data.jsx` and `TICKETS.md` are shared files.
- Shared interfaces/contracts must be defined and locked before parallel implementation.
- Shared foundations (scaffold, configuration, shared conventions) are merged before parallel
  work starts.
- The sprint plan must include a file/directory ownership map. Each agent owns only its
  assigned scope and edits only files it owns; changes needed in another owner's files are
  requested, not made.
- Merge conflicts are resolved when found, by the human owner together with the agent that
  owns the conflicting file. An agent must not rewrite another agent's files to resolve a
  conflict.
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

## Merging and approval

**Agents never merge pull requests.** Only the human owner merges, and only after the human
owner has approved the PR.

This applies to every agent (implementation, review-only and coordinator). Agents must not:

- merge a PR, or enable auto-merge on it
- approve a PR (the review-only agent posts comment-only reviews)
- push or commit directly to `main`
- close or reopen PRs they do not own, or delete other agents' branches

Agents may keep their **own** PR branch up to date (for example, merge `main` into it and
resolve conflicts in files they own), then report to the owner that the PR is ready per the
merge criteria in [pr-workflow.md §5](docs/process/pr-workflow.md#5-merge-criteria). When a PR
is ready, the agent says so and stops; merging is the owner's decision. Before reporting it
ready, the agent records in the PR the statuses that become true on merge (approved specs and
ADRs, its own ticket `done`), so there is no step left between approval and merge
([pr-workflow.md §5](docs/process/pr-workflow.md#5-merge-criteria)).

Agents act through the owner's GitHub account, so GitHub cannot tell them apart from the
owner: this rule must also be stated in every agent prompt. Recommended: protect `main` in
GitHub (pull request required, no force pushes or deletions).

## Review-only agent

A dedicated Claude Code session acts as the review-only agent (owner decision, 2026-10-18;
prompt in the active sprint's `SPRINT_<NN>_AGENT_PROMPTS.md`). Authors still run
`/code-review` before opening a PR. The reviewer may inspect PRs but must not implement
features, approve PRs, or merge PRs; it posts comment-only reviews. It reviews when the owner,
or the coordinator on the owner's behalf, requests it; it does not poll or subscribe to PR
events. Copilot and Codex are automated reviewers, not the review-only agent (see
[Automated PR reviewers](#automated-pr-reviewers)).

### Reviewer independence

A reviewer that changes the code it reviews becomes a co-author and loses impartiality:

- It never changes code or any other file, never commits, pushes, or opens PRs.
- It posts no ready-to-apply patches (no "suggested changes" blocks, no diffs). A finding
  states the problem, the evidence, the violated spec or acceptance criterion, and the
  expected outcome; how to fix it is the author's decision.
- It does not resolve review threads on the author's behalf.
- It may run the build and the site locally to gather evidence, without committing anything.
- A session that has written code for the project must not review that code: the reviewer
  always runs in its own session.

Automated reviewers can post "suggested changes" blocks; the author treats them as findings,
not as patches to apply blindly.

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

## Coordinator session

The project may use one coordinator session. It is a messenger and tracker, not an author or
an approver.

- **Who it is.** In a new project created from the SDD Starter Kit, the session that ran
  `/project-kickoff` stays on as the coordinator. This repo is brownfield: it was adopted into
  the kit by CMP-014, with no kickoff; CMP-014 covered the Discovery and Specs stages (specs
  reconstructed from the code and approved by the owner). Here the owner starts a dedicated
  coordinator session on `main` after the adoption PR is merged. It does not repeat discovery:
  it builds its picture from
  [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md), [TICKETS.md](TICKETS.md),
  [USER_STORIES.md](docs/specs/USER_STORIES.md) and the active sprint plan.
- **It may:** draft sprint plans and agent prompts (from
  [SPRINT_AGENT_PROMPTS_TEMPLATE.md](docs/templates/SPRINT_AGENT_PROMPTS_TEMPLATE.md)) as docs
  PRs; launch the agent sessions with their approved prompts after the owner's go-ahead; relay
  the owner's decisions verbatim; schedule check-ins and report changes to the owner; re-queue
  stories paused by usage limits; and request the review-only review on the owner's behalf
  ([pr-workflow.md](docs/process/pr-workflow.md)).
- **Docs PRs are the coordinator's own work** (owner decision, 2026-10-18): it authors and
  drives docs-only PRs (process docs, `TICKETS.md`, sprint plans, spec/backlog refinement)
  itself. Any PR that involves code is delegated to an implementation agent session.
- It never writes application code, never reviews code, and never merges, approves, or enables
  auto-merge (same rules as every agent).
- It records every owner decision it relays in a docs PR (`TICKETS.md`, the sprint plan or the
  affected spec), so the decision is in the repository, not only in chat.
- A coordinator message that quotes the owner counts as the owner's instruction only inside the
  receiving agent's existing ticket and scope. Anything that changes scope, a spec, or another
  agent's files goes back to the owner, and follows Change management.
- PR events go to the PR's author agent only; the coordinator follows only its own docs PRs;
  the review-only agent follows none and reviews when the owner or the coordinator asks.
- Agent sessions stay on one sprint each and are archived after it. The coordinator is
  long-lived: when its context is summarized, it re-reads the documents above instead of
  relying on memory.

## Automated PR reviewers

Two automated reviewers run on every PR: GitHub Copilot code review (requested per
[pr-workflow.md §3](docs/process/pr-workflow.md#3-request-copilot-review-balanced-mode)) and the
Codex GitHub integration (reviews automatically when a PR opens). Treat each as an additional,
independent reviewer:

- Every finding gets a visible outcome. The PR's author (the owning agent, or the coordinator
  for docs PRs) checks it against the current head and the specs, then either pushes a fix or
  replies on the thread explaining why no change is needed (already fixed, reviewed an older
  commit, contradicts an approved spec). When a fix was pushed, the reply names its commit.
- Give feedback on each finding when the tool asks for it (👍 useful and correct, 👎 wrong or
  not useful).
- It does not outrank the specs. A finding that needs a requirement change goes through
  [Change management](#change-management), and the owner decides.
- Its comments are never an approval and do not replace the review-only agent or the owner.
- The review-only agent may triage its findings (valid, obsolete, invalid) in its own review,
  but under reviewer independence it never fixes them.
- Resolving threads: per [pr-workflow.md §4](docs/process/pr-workflow.md#4-handle-review-comments)
  the author replies to and resolves each thread it addressed (the merge criteria count
  unresolved threads). The owner may resolve any thread themselves.

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

## Differences from the Starter Kit

This file follows the [SDD Starter Kit](https://github.com/Raulc87/sdd_starter_kit)
`AGENTS.md` (last aligned in CMP-016, 2026-10-18). These differences are intentional:

- **Naming.** Branches, PR titles and tickets use the CMP ticket number, not the story
  number: branch `CMP-XXX-short-slug`, PR title `CMP-XXX: <summary>`
  ([ADR-005](docs/decisions/ADR-005-in-repo-tracking.md), [TICKETS.md](TICKETS.md)). The kit's
  `[<KEY>-<NNN>]` titles and `<KEY>-<TYPE>-` branches are not used. Branches assigned by an
  agent harness are allowed and noted in the ticket row.
- **File names.** Sprint plans are `SPRINT_<NN>_PLAN.md`; ADRs are `ADR-<NNN>-<kebab-title>.md`;
  templates live in `docs/templates/`; `TECH_STACK.md` stays at the root.
- **Copy source.** No `docs/ux/CONTENT.md`: visitor-facing copy lives in
  `src/constants/i18n.js` and `src/constants/data.jsx` (ARCHITECTURE_SPEC §9).
- **Runbooks.** `docs/process/release-checklist.md` is the release and deployment runbook
  (manual GoDaddy deploy, [ADR-002](docs/decisions/ADR-002-godaddy-static-hosting.md));
  `README.md` covers local development. No `docs/runbooks/`. The branching and release model
  is [ADR-007](docs/decisions/ADR-007-branching-and-release-model.md).
- **PR body.** No `.github/pull_request_template.md`; the five mandatory sections in
  [pr-workflow.md §2](docs/process/pr-workflow.md#2-create-the-pr-with-gh) apply. Ownership
  (owned paths, changes outside scope) goes under `Files` when a sprint has an ownership map.
- **Commit messages.** The kit requires a `<KEY>-NNN: ` subject prefix; here it is
  recommended (`CMP-XXX: ...`) but not required
  ([pr-workflow.md §1](docs/process/pr-workflow.md#1-commit-and-push)).
- **Agent reading scope.** The kit's agent prompts read every document `PROJECT_CONTEXT.md`
  lists; here agents read only the documents that apply to their ticket (Before
  implementing), to save context ([model-cost-policy.md](docs/process/model-cost-policy.md)).
  The review-only agent still reads them all.
- **Docs-PR author.** In the kit the human owner authors docs PRs; here the coordinator does
  (owner decision 2026-10-18, [Coordinator session](#coordinator-session)).
- **Thread resolution.** The author resolves the threads it addressed (pr-workflow §4); the kit
  default leaves that to the owner.
- **No CI yet**, so the kit's "`main` is never red" stacked-PR rule has nothing to enforce;
  `npm run build` before each PR stands in for it ([pr-precheck.md](docs/process/pr-precheck.md)).

## About this AGENTS.md

If something here becomes outdated (new ticket convention, new specs, rules that no longer
apply), fix it as part of the ticket that made it obsolete.
