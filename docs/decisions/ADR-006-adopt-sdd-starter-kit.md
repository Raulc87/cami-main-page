# ADR-006 — Adopt the SDD starter kit structure and Scrum process

- Status: Accepted (CMP-014 PR #14 approved and merged, 2026-10-18); Kit disposition table
  added in CMP-055 (sync to kit v1.2.0)
- Date: 2026-10-17 (amended 2026-10-26)
- Decision owner: Raul Casanas
- Related specs: all — see [PROJECT_CONTEXT.md](../../PROJECT_CONTEXT.md)

## Decision Request
Should cami-main-page align its documentation and process with the owner's reusable SDD
starter kit (`sdd_starter_kit`)?

## Context
The repo already followed a home-grown Spec-Driven Development process (Spanish specs
`00-vision` … `05-roadmap`, CMP tickets, PR precheck/workflow). The starter kit defines a
standard set of artifacts (PROJECT_SPEC, USER_STORIES, TECH_STACK, UX_UI_DIRECTION,
ARCHITECTURE_SPEC, ADRs, IMPLEMENTATION_PLAN, SPRINT_PLAN), English docs and a Scrum process.

## Decision Drivers
- Same structure across the owner's projects.
- Traceability: requirement → story → acceptance criterion → ticket → test.
- The roadmap (lead capture, backend) will need feature specs and ADRs anyway.

## Options Considered

### Option A — Full rename to the kit layout, English docs, full Scrum
Pros:
- Identical structure to the kit; explicit IDs (FR/NFR/BR/US/AC).
Cons:
- Large docs-only diff; old spec links in merged PRs no longer resolve on `main`.
Risks:
- Process overhead for a one-person project.

### Option B — Hybrid (keep `00`–`05`, add missing artifacts)
Pros:
- Smaller diff, no broken links.
Cons:
- Two naming schemes coexist.

### Option C — Minimal (only AGENTS/CLAUDE/PROJECT_CONTEXT)
Pros:
- Smallest change.
Cons:
- No stories, no traceability.

## Decision
Option A (chosen by the owner on 2026-10-17). Project-specific process docs (PR workflow,
precheck, model-cost policy, release checklist) are kept and translated; they are not pushed
back to the starter kit.

## Rationale
- The owner wants the project homologated with the kit, not just annotated.

## Consequences
### Positive
- One documentation map (PROJECT_CONTEXT.md), story-based backlog, sprint cadence.

### Negative / Trade-offs
- Sprints of 7 business days for a mostly solo project; sprint goals must stay small.
- Historical references to `docs/specs/0X-*.md` in old PRs/TICKETS notes point to files that
  no longer exist (mapping recorded under Implementation Impact below).

## Architecture Impact
- None to the code.

## Implementation Impact
- Former names: file mapping (old PRs and ticket notes reference these files, which no longer exist;
  moved here from PROJECT_CONTEXT.md in CMP-016 so it only lists active paths):

| Old file | Now |
|---|---|
| `docs/specs/00-vision.md` | `docs/specs/PROJECT_SPEC.md` |
| `docs/specs/01-tech-stack.md` | `TECH_STACK.md` |
| `docs/specs/02-design-system.md` | `docs/ux/UX_UI_DIRECTION.md` |
| `docs/specs/03-content-model.md` | `docs/specs/ARCHITECTURE_SPEC.md` §9 |
| `docs/specs/04-architecture.md` | `docs/specs/ARCHITECTURE_SPEC.md` |
| `docs/specs/05-roadmap.md` | `docs/specs/USER_STORIES.md` (US-010..US-016) |

## Kit disposition

Added in CMP-055, when the project synced to kit `v1.2.0` (kit issue #62; kit ref in
[`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md)). It marks every kit file and every kit
`AGENTS.md` section **keep**, **adapt** or **skip**, with the reason. Per the kit's
`AGENTS.md` → Kept project rules, the **Kept project rules** table below is this project's
**only** list of the rules it keeps instead of the kit's; [`AGENTS.md`](../../AGENTS.md) and
[`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md) link here instead of repeating them. A project
rule that is not in that table does not apply: the kit's rule does. Adding, changing or dropping
a kept rule is a docs PR that updates the table, approved by the owner.

### Kit files

| Kit file | Disposition | Reason |
|---|---|---|
| `AGENTS.md` | adapt | The kit's `v1.2.0` text is ported entirely, with the kept rules below merged in. |
| `CLAUDE.md` | keep (kit text) | Points to [`AGENTS.md`](../../AGENTS.md) and [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md); now with links, as in the kit. |
| `PROJECT_CONTEXT.md` | adapt | Written for this project from the kit's layout; Starter Kit line "Edition: Full · Synced to kit v1.2.0" and the repository visibility line. |
| `docs/checklists/SPRINT_READINESS_CHECKLIST.md` | keep (kit text) | Taken unchanged from `v1.2.0`. The kept rules below say how its items map here (`CMP-XXX` branch names, PR body). |
| `.github/pull_request_template.md` | skip | Kept rule **PR body**, below. |
| `.github/scripts/check_doc_links.py` and `.github/workflows/docs-link-check.yml` | keep (kit text) | Added unchanged from `v1.2.0` in CMP-055 (optional item of kit #62); the repo's links already passed it. |
| `*_TEMPLATE.md` (`docs/specs/`, `docs/sprints/`, `docs/decisions/`, `docs/plans/`, `docs/runbooks/`, `docs/security/`, `docs/ux/`, `TECH_STACK_TEMPLATE.md`, `docs/DEVELOPER_GUIDE_TEMPLATE.md`) | skip: read from the kit | Kit-only (kit #29, #38). The former copies in `docs/templates/` were removed in CMP-055; they remain readable in the Git history, which cannot be recalled. |
| Kit skills (`.claude/skills/project-kickoff`, `project-adopt`, `ux-proposals`) | skip: read from the kit | Kit-only; this repo never carried them. |
| Kit process guides (`docs/process/` in the kit) | skip: read from the kit | Kit-only. This repo's own [`docs/process/`](../process/) holds CMP's process documents (kept rules below). |
| `.github/workflows/new-project.yml`, `install-kit.yml`, `basic-edition.yml` | skip | Kit-only workflows, for new and not-yet-adopted repositories (kit #53, #55). |
| `editions/`, the kit's `README.md` | skip | Kit-only. This repo keeps its own [`README.md`](../../README.md). |

### Kit `AGENTS.md` sections

| Section | Disposition | Reason |
|---|---|---|
| Purpose, Mandatory workflow, Source-of-truth priority | keep | Kit text, plus the project description and its Standard classification. |
| Document map, References to files | adapt | This repo's paths (kept rules **File names**, **Copy source**, **Runbooks**); planned security baseline (CMP-056) and developer guide (CMP-057). |
| Before implementing | adapt | Kit order; kept rule **Agent reading scope**. |
| Sprint readiness | adapt | Kit text, plus how `CMP-XXX` numbers are allocated for a plan. |
| Parallel agent rules | keep | Kit text (review flow, merge-order cycle check), plus this repo's shared files. |
| Branch, PR, and commit naming | adapt | Kept rule **Naming**. |
| Pull requests | adapt | Kept rule **PR body**; the PR precheck and workflow steps. |
| Attribution of agent posts | keep | Kit text. |
| Merging and approval | adapt | Kit text, plus kept rule **Merge criteria**. |
| Review-only agent (Review flow, Reviewer independence) | keep | Kit text; kept rule **Reviewers** names who runs. |
| Coordinator session | adapt | Kit text; kept rule **Docs-PR author**; adopted by CMP-014 (the role `/project-adopt` plays today). |
| Automated PR reviewers | adapt | Kit text; kept rules **Reviewers** and **Thread resolution**. |
| Kept project rules | keep | Kit text; this table is the list it points to. |
| Security baseline, Code readability, Testing, Definition of Done, Change management | keep | Kit text, plus this repo's state (no test runner, formatter or linter yet; baseline planned as CMP-056). |

### Kept project rules

| Kept rule | Instead of the kit's | Reason |
|---|---|---|
| **Naming.** Tickets `CMP-XXX` in [`TICKETS.md`](../../TICKETS.md); branch `CMP-XXX-short-slug`; PR title `CMP-XXX: <summary>`; commit subject `CMP-XXX: ...` recommended, not required ([`pr-workflow.md` §1](../process/pr-workflow.md#1-commit-and-push)); a branch assigned by an agent environment may be used when the ticket row names it and the PR body says so. | `<KEY>-<NNN>-` / `<KEY>-<TYPE>-` branches, `[<KEY>-<NNN>]` titles, required commit prefix, story-numbered branches. | One sequential numbering since CMP-001 ([ADR-005](ADR-005-in-repo-tracking.md)); old PRs, branches and ticket notes keep resolving. |
| **Backlog.** [`TICKETS.md`](../../TICKETS.md) (tickets) plus [`USER_STORIES.md`](../../docs/specs/USER_STORIES.md) (stories); no external tracker. | — (the kit leaves the backlog source to the project) | [ADR-005](ADR-005-in-repo-tracking.md). |
| **File names.** Sprint plans `docs/sprints/SPRINT_<NN>_PLAN.md`; ADRs `docs/decisions/ADR-<NNN>-<kebab-title>.md`. | `SPRINT_<NNN>.md`; `ADR-<NNN>_<TITLE>.md`. | Existing history and links (former names: Implementation Impact, above). |
| **Copy source.** Visitor-facing copy lives in [`src/constants/i18n.js`](../../src/constants/i18n.js) (`UI_TEXT`) and [`src/constants/data.jsx`](../../src/constants/data.jsx), per ARCHITECTURE_SPEC §9. | `docs/ux/CONTENT.md`. | The content model predates the kit; one source, no duplicate copy. |
| **Runbooks.** [`docs/process/release-checklist.md`](../process/release-checklist.md) (release and site deploy), [`docs/process/events-backend-runbook.md`](../process/events-backend-runbook.md) (Apps Script deploy) and [`README.md`](../../README.md) (local development, until `CONTRIBUTING.md`); branching and release model in [ADR-007](ADR-007-branching-and-release-model.md). | `docs/runbooks/RELEASE.md`, `DEPLOYMENT.md`, `LOCAL_DEVELOPMENT.md`. | Existing, used documents; moving them breaks links for no gain. |
| **PR body.** The five mandatory sections in [`pr-workflow.md` §2](../process/pr-workflow.md#2-create-the-pr-with-gh) (Summary, User stories & acceptance criteria, Files, Verification, Risks); ownership goes under Files when a sprint has an ownership map. | `.github/pull_request_template.md` (its Ownership and optional security lines). | The project's own body predates the kit template and carries the same content; no template file in the repo. |
| **Merge criteria.** [`pr-workflow.md` §5](../process/pr-workflow.md#5-merge-criteria): zero unresolved line comments, ≤ 3 dismissed, and every status that becomes true on merge recorded in the PR before it is reported ready. | — (additional conditions; the kit's merge control is unchanged) | Approval is the merge; nothing is left after it (CMP-018). |
| **Agent reading scope.** Implementation agents read only the documents that apply to their ticket; the review-only agent reads them all. | Every agent reads every listed document. | Context cost ([`model-cost-policy.md`](../process/model-cost-policy.md)). |
| **Docs-PR author.** The coordinator authors and drives docs-only PRs; any PR with code goes to an implementation agent. | The human owner authors docs PRs. | Owner decision, 2026-10-18 (CMP-016). |
| **Thread resolution.** The author replies to and resolves each review thread it addressed ([`pr-workflow.md` §4](../process/pr-workflow.md#4-handle-review-comments)); the owner may resolve any. | Resolving automated-reviewer threads is left to the owner. | The merge criteria count unresolved threads. |
| **Reviewers.** Minimum review: the kit's review-only agent, a dedicated Claude Code session (owner decision, 2026-10-18), on every PR. The independent automated reviewer that actually runs on this repo's PRs is **Codex** (the Codex GitHub integration, automatic review when a PR opens; at most two further asks per PR). GitHub Copilot code review is not relied on: requests in Sprint 02 produced no reviews. | Copilot as the default named automated reviewer. | Records the reviewers that actually run (kit #31, #38). |

## Validation
- `mechanical-check` link check passes; Sprint 01 runs with the new artifacts.

## Review Trigger
- End of Sprint 02: is the Scrum overhead paying off for a solo project?
