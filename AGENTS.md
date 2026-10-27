# AGENTS.md

Mandatory entry point for any agent (or person) working in this repo. Read it first, then use
[`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md) as the map of the active documentation.

## Purpose

This repository follows Spec-Driven Development (SDD), adopted from the owner's SDD Starter Kit
([ADR-006](docs/decisions/ADR-006-adopt-sdd-starter-kit.md); kit version in
[`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md)).

The goal is not to write code as quickly as possible. The goal is to deliver software that
conforms to approved specifications and acceptance criteria.

## What this project is

Personal brand website for **Cami Hernandez** (motivational speaker, lifestyle coach,
spiritual coach): a bilingual one-pager in React + Vite, live at `camihernandez.com`, with an
events and registration feature backed by Google Apps Script
([ADR-008](docs/decisions/ADR-008-events-backend-google-apps-script.md)). It will evolve toward
lead capture, a service catalog and targeted marketing: see the backlog in
[`USER_STORIES.md`](docs/specs/USER_STORIES.md). Full detail:
[`PROJECT_SPEC.md`](docs/specs/PROJECT_SPEC.md).

## Mandatory workflow

Requirement -> Discovery -> Specs -> User Stories -> Architecture/UX/Stack -> Plan -> Sprint -> Implementation -> Review -> Verification

Do not skip required stages. The project is classified **Standard** since the events feature
added a backend (TECH_STACK v1.2, CMP-021; see
[`TECH_STACK.md` §1](TECH_STACK.md#1-complexity-assessment)).

## Source-of-truth priority

When sources conflict, use this order:

1. Approved specification (including feature specs and integration contracts)
2. Approved ADR
3. Approved implementation plan
4. Sprint plan
5. User story and acceptance criteria
6. Existing code
7. Informal comments or assumptions

If code conflicts with an approved spec, the spec wins unless the spec is explicitly changed.

## Document map

[`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md) is the authoritative list of the active documents and
their paths. This repo's locations (where they differ from the kit, the kept rules in
[ADR-006 → Kit disposition](docs/decisions/ADR-006-adopt-sdd-starter-kit.md#kit-disposition)
say why):

| Document | Path | Required |
|---|---|---|
| Project context | [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md) | Always |
| Project spec | [`docs/specs/PROJECT_SPEC.md`](docs/specs/PROJECT_SPEC.md) | Always |
| User stories | [`docs/specs/USER_STORIES.md`](docs/specs/USER_STORIES.md) | Always |
| Feature specs | `docs/specs/FEATURE_SPEC_<topic>.md` | When a story changes architecture (Standard project), or when listed in [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md) |
| Architecture spec | [`docs/specs/ARCHITECTURE_SPEC.md`](docs/specs/ARCHITECTURE_SPEC.md) (includes the content model, §9) | Always |
| Integration contracts | `docs/specs/<NAME>_CONTRACT.md` | Whenever two workstreams share an interface |
| UX/UI direction | [`docs/ux/UX_UI_DIRECTION.md`](docs/ux/UX_UI_DIRECTION.md) | Always |
| Content (copy) | [`src/constants/i18n.js`](src/constants/i18n.js) (`UI_TEXT`) and [`src/constants/data.jsx`](src/constants/data.jsx), per ARCHITECTURE_SPEC §9 (kept rule: no `docs/ux/CONTENT.md`) | Always |
| Tech stack | [`TECH_STACK.md`](TECH_STACK.md) | Always |
| ADRs | `docs/decisions/ADR-<NNN>-<kebab-title>.md` | When a decision needs recording |
| Implementation plan | [`docs/plans/IMPLEMENTATION_PLAN.md`](docs/plans/IMPLEMENTATION_PLAN.md) | Always |
| Sprint plans | `docs/sprints/SPRINT_<NN>_PLAN.md` (the active one is named in [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md)) | Always |
| Agent prompts | `docs/sprints/SPRINT_<NN>_AGENT_PROMPTS.md` (from the kit's `SPRINT_AGENT_PROMPTS_TEMPLATE.md`) | Sprints that use agent sessions |
| Readiness checklist | [`docs/checklists/SPRINT_READINESS_CHECKLIST.md`](docs/checklists/SPRINT_READINESS_CHECKLIST.md) | Before every sprint |
| Release / deployment runbook | [`docs/process/release-checklist.md`](docs/process/release-checklist.md) (kept rule: no `docs/runbooks/`) | Always (the site is live) |
| Events backend deploy runbook | [`docs/process/events-backend-runbook.md`](docs/process/events-backend-runbook.md) | While the events backend exists (ADR-008, ADR-009) |
| Branching and release ADR | [ADR-007](docs/decisions/ADR-007-branching-and-release-model.md) | Always (the site is live) |
| Local development | [`README.md`](README.md) until the developer guide exists | Always |
| Security baseline | `docs/security/SECURITY_BASELINE.md` (from the kit's `SECURITY_BASELINE_TEMPLATE.md`) | Always. The project already writes code, so the baseline is a story in its next sprint (CMP-056) and is approved by the end of that sprint; until then its absence does not stop implementation |
| Penetration-test plan | `docs/security/PENTEST_PLAN.md` (from the kit's `PENTEST_PLAN_TEMPLATE.md`) | When the security baseline requires a penetration test; approved before the sprint that releases to production while the test is due |
| Developer guide | `CONTRIBUTING.md` at the repository root (from the kit's `docs/DEVELOPER_GUIDE_TEMPLATE.md`) | A story in the next sprint (CMP-057); until then [`README.md`](README.md) covers local development |

**The project carries the kit's output, not the kit.** This repo keeps
[`AGENTS.md`](AGENTS.md), [`CLAUDE.md`](CLAUDE.md), [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md),
its own documents (the paths above) and the CI it runs. It carries no kit templates
(`*_TEMPLATE.md`), kit skills (`project-kickoff`, `project-adopt`, `ux-proposals`), kit-only
workflows or kit process guides. When the project needs one (a new sprint plan, agent prompts,
an ADR, a feature spec, a guide or a kit skill such as `/ux-proposals`), the session reads it from
the kit at the kit ref recorded in [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md) (a release tag,
never the kit's moving `main`), and never copies it back into the project. The kit is private:
the owner attaches it to every session that needs it (coordinator, agent and reviewer sessions).
References in this file to the kit's `docs/process/` point to the kit; this repo's own
[`docs/process/`](docs/process/) holds CMP's process documents.

If a path listed in [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md) does not exist, or a required
document is missing, stop and report it before implementing.

### References to files

A reference to a file or folder that exists in this repository, and that means that file, is a
relative Markdown link with the path as its text, for example
[`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md); the docs link check then keeps it valid. Backticks
stay for branch names, repository names, commands and skill commands, placeholders
(`docs/specs/FEATURE_SPEC_<topic>.md`), patterns (`*_TEMPLATE.md`), and paths that do not exist
in this repository or mean a file elsewhere (a file that stays in the kit, such as
`.github/pull_request_template.md`, or a document not written yet).

## Before implementing

Read:

1. [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md)
2. [`docs/specs/PROJECT_SPEC.md`](docs/specs/PROJECT_SPEC.md)
3. the relevant feature specs and integration contracts listed in
   [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md)
4. [`docs/specs/USER_STORIES.md`](docs/specs/USER_STORIES.md)
5. the specs your change touches: [`docs/specs/ARCHITECTURE_SPEC.md`](docs/specs/ARCHITECTURE_SPEC.md),
   [`docs/ux/UX_UI_DIRECTION.md`](docs/ux/UX_UI_DIRECTION.md), and the copy source
   ([`src/constants/i18n.js`](src/constants/i18n.js), [`src/constants/data.jsx`](src/constants/data.jsx))
   when the change touches visitor-facing copy
6. [`TECH_STACK.md`](TECH_STACK.md)
7. [`docs/security/SECURITY_BASELINE.md`](docs/security/SECURITY_BASELINE.md) and its
   [ASVS inventory](docs/security/ASVS_INVENTORY.md)
8. relevant ADRs in [`docs/decisions/`](docs/decisions/)
9. [`docs/plans/IMPLEMENTATION_PLAN.md`](docs/plans/IMPLEMENTATION_PLAN.md) (or the story's own plan)
10. the active sprint plan in [`docs/sprints/`](docs/sprints/)

Agents read only the documents that apply to their ticket; the review-only agent reads them all
(kept rule, ADR-006).

Do not invent business requirements.

If ambiguity materially changes behavior, scope, security, cost, data handling, or
architecture, stop and request clarification.

Small implementation details may be decided autonomously when they do not alter the approved
behavior.

## Project rules

- **No new libraries/frameworks** (router, state management, CSS framework, TypeScript, test
  runner, etc.) without updating [`TECH_STACK.md`](TECH_STACK.md) and recording an ADR: the
  stack is intentionally minimal ([ADR-001](docs/decisions/ADR-001-minimal-static-react-stack.md)).
- **List content (services, steps, values, testimonials, stats) goes in
  [`src/constants/data.jsx`](src/constants/data.jsx)**, colors in
  [`src/constants/colors.js`](src/constants/colors.js). Translatable UI copy (headlines,
  kickers, CTA, badges, nav) lives in `UI_TEXT` ([`src/constants/i18n.js`](src/constants/i18n.js))
  and changes with the global language toggle. Only non-translatable text (wordmark, contact
  email, footer brand words/URL, fixed Spanish brand accents) stays hardcoded inline per
  component: exact detail in
  [ARCHITECTURE_SPEC.md §9](docs/specs/ARCHITECTURE_SPEC.md#9-logical-data-architecture-content-model).
  Do not hardcode colors outside the palette ([`UX_UI_DIRECTION.md`](docs/ux/UX_UI_DIRECTION.md)).
- **Placeholder content must never be treated as real data** (PROJECT_SPEC BR-002).
- **Backlog stories (`Proposed`) are not built**: they are direction, not tasks ready to
  implement. Each needs refinement to `Ready`, a ticket and, if it changes architecture, a
  feature spec (from the kit's `FEATURE_SPEC_TEMPLATE.md`) before coding.
- **Zero cost / free tier first** for any new tool (analytics, email marketing, DB).
- Local development: `npm run dev` (port 5173). Build: `npm run build` → `dist/` (manual
  deploy to GoDaddy `public_html/`, see [`release-checklist.md`](docs/process/release-checklist.md)).
  The events backend is deployed by a GitHub workflow
  ([ADR-009](docs/decisions/ADR-009-apps-script-deploy-from-github.md)).

## Tickets and branches

Kept rule (ADR-006 → Kit disposition): no external tracker
([ADR-005](docs/decisions/ADR-005-in-repo-tracking.md)); the project key is **CMP**.

- Every unit of work is a `CMP-XXX` ticket in [`TICKETS.md`](TICKETS.md) (source of truth for
  sequential numbering). A ticket implements one or more user stories, or is process /
  tech-debt work.
- Branch: `CMP-XXX-short-slug` (e.g. `CMP-001-sdd-foundation`). PR title: `CMP-XXX: <summary>`.
  Commit subject: `CMP-XXX: ...` recommended, not required
  ([`pr-workflow.md` §1](docs/process/pr-workflow.md#1-commit-and-push)).
- Before starting, check [`TICKETS.md`](TICKETS.md), take the next free number, and add the row
  in the first commit of the branch. **Exception:** a ticket planned in a sprint already has a
  `todo` row (added by the sprint plan PR, see [Sprint readiness](#sprint-readiness)); take that
  number and update the row instead of adding one. Detail in the header of
  [`TICKETS.md`](TICKETS.md).
- **Assigned session branches.** Some environments start a session on a branch they assign
  (for example `claude/<something>`). Here such a branch may be used: the ticket row names it and
  the PR body says so. Never commit directly to `main`.

## Model choice

Pick the model by task, not by default. [`.claude/settings.json`](.claude/settings.json) sets
Sonnet as the project default (implementing, debugging, answering review comments); the
review-only agent runs on Opus in its own session. Planning/architecture → Opus; scoped edits and
copy → Haiku; mechanical checks (build, `git status`, link checks) and read-only exploration
→ the subagents in [`.claude/agents/`](.claude/agents/) (`mechanical-check` and `repo-explorer`).
`repo-explorer` has no write tools: not editing is a technical guarantee. `mechanical-check` does
have `Bash` (it needs it for the build): there "do not edit" is a prompt instruction, not
something the tool prevents. **A plan must state which model runs each step** and recommend
`/model ...` switches to the user when useful: an agent cannot change its own session's model,
but it can delegate mechanical steps to cheaper subagents. Full criteria and context-hygiene
practices: [`model-cost-policy.md`](docs/process/model-cost-policy.md); read it when starting a
ticket.

## Scrum

- Sprints of **7 business days** (Saturdays and Sundays excluded), planned in
  [`docs/sprints/`](docs/sprints/) from the kit's `SPRINT_PLAN_TEMPLATE.md`.
- Every sprint must end with a demonstrable deliverable.
- Agents start sprint work only after the sprint plan is approved by the owner (see
  [Sprint readiness](#sprint-readiness)).
- **Unplanned work** (production hotfixes, small copy/content changes) may proceed outside the
  sprint as a normal ticket when the owner explicitly asks for it; note it in the active sprint
  plan's review notes.

## Sprint readiness

- A sprint starts only after its readiness check
  ([`SPRINT_READINESS_CHECKLIST.md`](docs/checklists/SPRINT_READINESS_CHECKLIST.md)) has no open
  blocking items and the human owner gives an explicit go-ahead. Record the result in the
  sprint plan's "Entry Gates" section.
- Agents do not start a sprint on their own initiative.
- **Ticket numbers for the plan.** The checklist asks for each story's planned branch name.
  Here that means a `CMP-XXX` number: the sprint plan PR adds one `todo` row per planned
  ticket to [`TICKETS.md`](TICKETS.md), which allocates the numbers (a recorded row is not a
  "reserved" number). The implementing agent then updates that row instead of adding one.
- The readiness checklist applies from Sprint 02 on; Sprint 01 was planned before it existed.

## Parallel agent rules

- Maximum recommended implementation agents in parallel: 3.
- Agents must not knowingly modify the same responsibility without an explicit integration
  plan. In this repo `global.css`, `i18n.js`, `data.jsx` and [`TICKETS.md`](TICKETS.md) are
  shared files.
- Shared interfaces/contracts must be defined and locked before parallel implementation.
- Shared foundations (scaffold, configuration, shared conventions) are merged before parallel
  work starts.
- The sprint plan must include a file/directory ownership map. Each agent owns only its
  assigned scope and edits only files it owns; changes needed in another owner's files are
  requested, not made.
- The sprint plan's merge order names what each PR waits for, and is checked for dependency
  cycles before the sprint starts: no PR may wait, directly or through other PRs, on a PR that
  waits on it. A cycle is broken in the plan (reorder, or split a PR) before the go-ahead.
- **Each author agent follows its own PRs.** It subscribes to the activity of its own PRs, and
  only its own: an environment delivers a PR's events (CI results, automated-reviewer findings,
  review comments) to one session only, so the author is the session that receives them, and it
  acts on them.
- **Each author agent keeps its own PRs current.** Whenever a PR falls behind its base branch,
  or a new required check appears, the author merges the base branch into the PR with a merge
  commit (no rebase or force-push), resolves conflicts in files it owns, and pushes. Nobody
  updates the branch for it.
- **After every push to its PR** (the first push, each fix, each merge of the base branch), the
  author asks the review-only agent for a review at the new head commit
  ([Review flow](#review-flow)).
- Merge conflicts are resolved when found, by the human owner together with the agent that
  owns the conflicting file. An agent must not rewrite another agent's files to resolve a
  conflict.
- Integration must be verified after merging parallel work.
- A change is not complete merely because its own tests pass; it must not break already
  accepted functionality.

## Pull requests

Kept rule (ADR-006 → Kit disposition): this repo uses its own PR body, the five mandatory
sections in [`pr-workflow.md` §2](docs/process/pr-workflow.md#2-create-the-pr-with-gh), not the
kit's `.github/pull_request_template.md`. Ownership (the owning agent/workstream, the owned paths
changed, and any change outside that scope with who approved it) goes under `Files` when a
sprint has an ownership map. Each implementation agent should:

1. Work on an isolated branch named as above.
2. Reference the related user stories and acceptance criteria.
3. Keep the PR focused.
4. Include verification evidence.
5. Call out risks, assumptions, and unresolved items.
6. Avoid unrelated refactors.

Before opening any PR, follow without skipping steps:

0. [`model-cost-policy.md`](docs/process/model-cost-policy.md): which model for which work.
1. [`pr-precheck.md`](docs/process/pr-precheck.md): self-review checklist (specs updated,
   clean build, `/code-review` run).
2. [`pr-workflow.md`](docs/process/pr-workflow.md): creating the PR with `gh` (title with the
   ticket ID, mandatory body sections), the review flow, and the merge criteria
   (0 unresolved line comments, ≤ 3 dismissed).

## Attribution of agent posts

Agents usually post on GitHub under the human owner's account, so GitHub cannot tell an agent's
post from the owner's. Every agent (implementation, review-only and coordinator) ends every
comment, review, review reply, PR body and issue body it posts with an attribution line saying
an agent wrote it. The tool's own footer is enough when it says so (for example "Generated by
Claude Code").

## Merging and approval

**Agents never merge pull requests.** Only the human owner merges, and only after the human
owner has approved the PR.

This applies to every agent (implementation, review-only and coordinator). Agents must not:

- merge a PR, or enable auto-merge on it
- approve a PR (the review-only agent posts comment-only reviews)
- push or commit directly to `main` or any other protected/base branch
- close or reopen PRs they do not own, or delete other agents' branches

Agents keep their **own** PR branch up to date (merge the base branch into it and resolve
conflicts in files they own: [Parallel agent rules](#parallel-agent-rules)). When a PR is ready
per the merge criteria in [`pr-workflow.md` §5](docs/process/pr-workflow.md#5-merge-criteria)
(in a sprint with a review-only agent, its verdict reaches the owner through the
[Review flow](#review-flow)), the agent says so and stops; merging is the owner's decision.
Before reporting it ready, the agent records in the PR the statuses that become true on merge
(approved specs and ADRs, its own ticket `done`), so there is no step left between approval and
merge.

Recommended enforcement in GitHub: protect `main` (pull request required, no force pushes or
deletions; done for ADR-009). Agents act through the owner's GitHub account, so GitHub cannot
tell them apart from the owner: this rule must also be stated in every agent prompt, together
with the attribution line ([Attribution of agent posts](#attribution-of-agent-posts)).

## Review-only agent

A dedicated Claude Code session acts as the review-only agent (owner decision, 2026-10-18;
prompt in the active sprint's `SPRINT_<NN>_AGENT_PROMPTS.md`). Authors still run `/code-review`
before opening a PR. The reviewer may inspect PRs but must not implement features, approve PRs,
or merge PRs; it posts comment-only reviews. It reviews when a PR's author agent asks after a
push, or when the human owner, or the coordinator session on the owner's behalf, asks; it does
not poll for PRs or subscribe to PR events. Codex is an automated reviewer, not the review-only
agent ([Automated PR reviewers](#automated-pr-reviewers)).

### Review flow

Sessions reach each other through **a one-off scheduled message, or a direct message where the
environment supports one**: a single message to the other session, sent about a minute ahead
when it is scheduled. A PR's events reach only its author ([Parallel agent
rules](#parallel-agent-rules)), so review requests and verdicts travel this way:

1. **The author asks.** After every push to its PR, the author sends the review-only agent one
   such message naming the PR, its head commit and what changed since the last review. It sends
   the reviewer nothing else.
2. **The reviewer reviews and posts on the PR.** It reviews the whole PR at that head commit
   (the newest one, if the head has moved) and posts a comment-only review on the PR. The
   author, subscribed to the PR, receives it there and fixes the findings with new commits; each
   push starts the flow again at step 1.
3. **The reviewer reports readiness.** When its verdict is "ready for human approval", it sends
   the coordinator one such message naming the PR, the head commit and any merge-order
   condition (the PRs that must merge first). Without a coordinator, its review on the PR is the
   report to the owner.
4. **The coordinator tells the owner** that the PR is waiting for their approval, with the
   merge order ([Coordinator session](#coordinator-session)).

**Owner questions reach the coordinator directly.** When an agent (author or reviewer) needs an
owner decision, or a verdict depends on one, it posts the question on the issue or PR it
concerns and also sends the coordinator one such message naming that issue or PR and the
question. A question posted only on GitHub can wait unseen. Without a coordinator, the question
on the issue or PR goes to the owner directly.

The reviewer still never subscribes, polls, edits, approves or merges.

### Reviewer independence

A reviewer that changes the code it reviews becomes a co-author: it starts defending its own
fixes, stops seeing the PR with fresh eyes, and loses impartiality. To keep reviews independent:

- The review-only agent **never changes code or any other file**: no fixes, not even small
  ones, in the PR under review, on a follow-up branch, or anywhere else in the repository. It
  never commits, pushes, or opens PRs.
- It does not post ready-to-apply patches (no GitHub "suggested changes" blocks, no diffs). A
  finding states the problem, the evidence, the violated spec or acceptance criterion, and the
  expected outcome. How to fix it is the author's decision.
- It does not resolve review threads on the author's behalf.
- It may run the code, the build, the site and checks locally to gather evidence, without
  committing anything.
- Fixes are always made by the owning implementation agent (or the coordinator, for its own
  docs PRs). The reviewer then reviews the new commits as a fresh review.
- A session that has written code for the project must not review that code. The review-only
  agent always runs in its own session, separate from every implementation agent.

Automated reviewers can post "suggested changes" blocks; the author treats them as findings,
not as patches to apply blindly.

It should verify:

- spec compliance
- acceptance criteria
- code quality and readability ([Code readability](#code-readability)), and the developer guide
  updated when setup, commands or structure change
- regressions
- security: the OWASP criteria in the project's security baseline and in the stories'
  acceptance criteria (ASVS requirements, Top 10 / API Top 10 risks), secrets, and new or
  updated dependencies
- stack compliance
- tests
- integration risks

The human reviewer (the owner) remains the final approver.

## Coordinator session

The project uses one coordinator session. It is a messenger and tracker, not an author of code
or an approver.

- **Who it is.** In a new project created from the kit, the session that ran `/project-kickoff`
  stays on as the coordinator. This repo is brownfield: it was adopted into the kit by CMP-014
  (the role `/project-adopt` plays today), with no kickoff; CMP-014 covered the Discovery and
  Specs stages (specs reconstructed from the code and approved by the owner) and recorded the
  backlog source ([`TICKETS.md`](TICKETS.md) and [`USER_STORIES.md`](docs/specs/USER_STORIES.md),
  [ADR-005](docs/decisions/ADR-005-in-repo-tracking.md)). The owner starts a dedicated
  coordinator session on `main`. It does not repeat discovery: it builds its picture from
  [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md), [`TICKETS.md`](TICKETS.md),
  [`USER_STORIES.md`](docs/specs/USER_STORIES.md) and the active sprint plan. When its context
  is summarized, it re-reads those documents instead of relying on memory.
- **It may:** draft sprint plans and agent prompts (from the kit's
  `SPRINT_AGENT_PROMPTS_TEMPLATE.md`) as docs PRs; launch the agent sessions with their approved
  prompts after the owner's go-ahead; relay the owner's decisions verbatim; schedule check-ins
  and report changes to the owner; re-queue stories paused by usage limits; and ask the
  review-only agent for a review on the owner's behalf.
- **Docs PRs are the coordinator's own work** (kept rule, owner decision 2026-10-18): it
  authors and drives docs-only PRs (process docs, [`TICKETS.md`](TICKETS.md), sprint plans,
  spec/backlog refinement) itself, follows them as their author and asks the review-only agent
  after every push. Any PR that involves code is delegated to an implementation agent session.
- When the review-only agent reports a PR ready for human approval ([Review flow](#review-flow)),
  the coordinator tells the owner straight away, with the merge order. Its periodic check-ins
  are a fallback for messages that do not arrive, not the channel.
- When an agent sends it an owner question ([Review flow](#review-flow)), the coordinator puts
  it to the owner straight away and relays the answer verbatim to the agent that asked,
  recording it on that issue or PR.
- It never writes application code, never reviews code, and never merges, approves, or enables
  auto-merge (same rules as every agent).
- It records every owner decision it relays in a docs PR ([`TICKETS.md`](TICKETS.md), the
  sprint plan or the affected spec), so the decision is in the repository, not only in chat.
- A coordinator message that quotes the owner counts as the owner's instruction only inside the
  receiving agent's existing ticket and scope. Anything that changes scope, a spec, a contract,
  or another agent's files goes back to the owner, and follows
  [Change management](#change-management).
- PR events go to the PR's author agent only; the coordinator follows only its own docs PRs;
  the review-only agent follows none and reviews when the PR's author, the owner or the
  coordinator asks.
- Agent sessions stay on one sprint each and are archived after it; the coordinator is
  long-lived.

## Automated PR reviewers

The Codex GitHub integration reviews every PR automatically when it opens: it is the automated
reviewer that actually runs on this repo's PRs, recorded in ADR-006 → Kit disposition. GitHub
Copilot code review is not relied on (requests in Sprint 02 produced no reviews). Treat Codex as
an additional, independent reviewer:

- Every finding gets a visible outcome. The PR's author (the owning agent, or the coordinator
  for docs PRs) checks it against the current head and the specs, then either pushes a fix or
  replies on the thread explaining why no change is needed (for example: already fixed,
  reviewed an older commit, or contradicts an approved spec). No finding is left without an
  answer.
- **At most two asks per PR.** The PR's author asks Codex for a review (an `@codex review`
  comment) at most twice per PR, beyond its automatic review when the PR opens. After that,
  re-reviews come only from the review-only agent ([Review flow](#review-flow)). Every finding
  Codex posts still gets an outcome, as above.
- Give feedback on each finding when the tool asks for it (👍 useful and correct, 👎 wrong or
  not useful). This tunes the reviewer for the project. When a fix was pushed, name its commit in
  the reply; otherwise the reply states the reason instead.
- It does not outrank the specs. A finding that needs a requirement or contract change goes
  through [Change management](#change-management), and the owner decides.
- Its comments are never an approval, and it does not replace the review-only agent or the
  owner.
- The review-only agent may triage its findings (valid, obsolete, invalid) in its own review,
  but under reviewer independence it never fixes them.
- Resolving threads (kept rule): per
  [`pr-workflow.md` §4](docs/process/pr-workflow.md#4-handle-review-comments) the author replies
  to and resolves each thread it addressed (the merge criteria count unresolved threads). The
  owner may resolve any thread themselves.

## Kept project rules (adopted projects)

This repo was adopted into the kit (CMP-014), so it may keep its own rules instead of the kit's,
on two conditions:

1. **Stated and recorded.** Each kept rule is a row, with its reason, in the kit disposition
   table of the adoption ADR:
   [ADR-006 → Kit disposition](docs/decisions/ADR-006-adopt-sdd-starter-kit.md#kit-disposition).
   That table is the project's only list of kept rules and their reasons;
   [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md) and this file link to it instead of repeating
   them. [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md) still lists the active document paths,
   including the copy source and document locations that a kept rule changed. A project rule
   that is not in the table does not apply: the kit's rule does. Adding, changing or dropping a
   kept rule later is a docs PR that updates the table, approved by the human owner.
2. **Consistent with the kit's SDD and TDD priorities.** A kept rule may change how the work is
   done, never what decides it.

What a kept rule may never override:

- **Source-of-truth priority** (above): the approved spec wins over code.
- **Spec first:** requirement changes follow [Change management](#change-management); behavior
  never changes silently in code.
- **Tests from acceptance criteria:** tests derive from the spec and the acceptance criteria
  ([Testing](#testing)).
- **Merge control:** [Merging and approval](#merging-and-approval) applies unchanged. Only the
  human owner merges, after approving; no agent merges, approves, enables auto-merge or pushes
  to the base branch.
- **Reviewer independence:** any reviewer the project keeps, agent or automated, follows
  [Reviewer independence](#reviewer-independence), and an automated reviewer's findings are
  handled as in [Automated PR reviewers](#automated-pr-reviewers).
- **Minimum review:** at least one independent reviewer in addition to the human owner's
  approval before merge. Here: the review-only agent on every PR, plus Codex as the automated
  reviewer that runs on every PR (ADR-006 → Kit disposition). The owner's approval alone is
  never enough.
- **Security baseline:** [Security baseline](#security-baseline) applies here as it does to new
  projects.

## Security baseline

Every project, new or adopted, follows the kit's security baseline and records how in
[`docs/security/SECURITY_BASELINE.md`](docs/security/SECURITY_BASELINE.md) (here: approved on
merge of PR #58, CMP-056):

- **OWASP first.** The project chooses an OWASP ASVS level (5.0.0) and records an ASVS inventory
  in the baseline, scaled to the project: a simple project at ASVS level 1 that handles no
  personal data, authentication or payments lists one row per ASVS chapter (applies or not,
  naming the applicable requirements); a project at level 2 or 3, or one that handles personal
  data, authentication or payments, lists every requirement of its level, each covered
  (acceptance criterion, test or configuration check) or marked not applicable with the reason.
  The events feature handles personal data and payment receipts, so this repo's inventory is the
  full list for its level. Every OWASP Top 10 (2025) or API Security Top 10 (2023) risk that
  applies becomes testable acceptance criteria in the stories that touch it. OWASP takes
  priority when security guidance conflicts.
- **NIST SSDF (SP 800-218 v1.1)** for secure development: the baseline maps the workflow to the
  SSDF practice groups (PO, PS, PW, RV) and lists what the project adds, such as secret
  scanning, dependency scanning and how vulnerabilities are reported and fixed.
- **Penetration tests**, both before the first production release and each on its own
  condition: a **PTES** test when the project handles personal data, authentication or
  payments; an **OSSTMM 3** test only when the baseline classifies the project as high-risk or
  complex, and again before any later release that adds a major new attack surface. A project
  that meets both conditions runs one test that follows both. Planned in
  `docs/security/PENTEST_PLAN.md`. This repo is already in production, so it runs the required
  test before its next production release, unless the owner records a dated deadline in the
  baseline instead; once the deadline passes, the test gates every release.
- **Who tests.** Penetration tests are run only by people the owner authorizes in writing,
  under a written scope. An implementation agent never runs a penetration test, attack tools or
  security scans against production.
- **No certification claims.** Documents, copy and PRs never say the project is certified,
  compliant or secure because it follows these standards; they say which requirements were
  verified, how and when.

## Code readability

Code is read far more often than it is written, by people and by agents. Every change follows
these rules; the review-only agent checks them.

- **The project's formatter and linter are the rule.** [`TECH_STACK.md`](TECH_STACK.md) names
  them; CI runs them. This repo has none yet: until a story sets them up, match the surrounding
  code and keep `npm run build` (and `node --check` for `apps-script/`) clean. Style questions
  they settle are not review findings, and their configuration changes only through a PR.
- **Names say what things are and do.** No abbreviations a newcomer would have to guess; the
  domain terms from the spec, spelled the same way.
- **Small, focused functions and modules.** One reason to change each. Split a function when it
  needs a comment to explain its sections.
- **Comments explain why, not what.** A comment records a reason, a constraint, a link to the
  spec or ADR it implements; it does not restate the code. Public interfaces (modules, exported
  functions, endpoints) say what they expect and return.
- **No dead code.** No commented-out code, unused files or flags left behind; Git keeps the
  history.
- **No magic values.** Numbers, strings and limits with a meaning get a named constant or come
  from configuration, with the spec reference when the spec sets them.
- **Errors are handled where they can be acted on**, with a message that says what failed and
  what to do; never swallowed silently.
- **Match the surrounding code.** Follow the patterns already in the project before introducing
  a new one; a new pattern is a decision (ADR when it has real alternatives).
- **The developer guide stays true.** A change to setup, commands or structure updates
  `CONTRIBUTING.md` (once it exists; [`README.md`](README.md) until then) in the same PR.

## Testing

Tests must derive from the spec and acceptance criteria. No test runner exists yet
([`TECH_STACK.md` §8](TECH_STACK.md#8-testing)): verify manually in the dev server (and against
staging for the events backend) and record the evidence in the PR.

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
- documentation is updated if needed, including the developer guide (`CONTRIBUTING.md`, or
  [`README.md`](README.md) until it exists) when setup, commands or structure change
- the code follows [Code readability](#code-readability) (and, once set up, the formatter and
  linter pass)
- the review-only agent has completed its review, and Codex's findings each have an outcome
  ([Kept project rules](#kept-project-rules-adopted-projects) → Minimum review)
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

`main` is never red. If a test enforces that code matches a document, a docs-only PR would fail
it. Then the implementation PR targets the docs branch and merges into it first, and the docs PR
merges to `main` carrying both. Make sure CI also runs on that stacked PR (CI on all pull
requests, not only those to `main`), or run the same checks locally and paste the results in the
PR, so the implementation is checked before it reaches the docs branch. Today this repo's CI
checks the backend syntax (`apps-script-check`) and the docs links (`docs-link-check`), both on
every pull request; `npm run build` before each PR stands in for a site build check
([`pr-precheck.md`](docs/process/pr-precheck.md)).

## About this AGENTS.md

This file ports the kit's `AGENTS.md` at the kit ref in
[`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md), with this repo's kept rules merged in (listed, with
their reasons, only in [ADR-006 → Kit disposition](docs/decisions/ADR-006-adopt-sdd-starter-kit.md#kit-disposition)).
If something here becomes outdated (new ticket convention, new specs, rules that no longer
apply), fix it as part of the ticket that made it obsolete.
