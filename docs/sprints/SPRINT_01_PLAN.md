# SPRINT_PLAN — Sprint 01

## Metadata
- Sprint: 01
- Status: Active (owner go-ahead 2026-10-18)
- Start: 2026-10-19 (Monday); agent sessions launched early, 2026-10-18, on the owner's
  go-ahead (see Sprint Review Notes)
- End: 2026-10-27 (Tuesday)
- Duration: 7 business days
- Saturdays and Sundays excluded
- Final human reviewer: Raul Casanas

## Sprint Goal
- Approve the SDD baseline (CMP-014) and get the backlog ready so Sprint 02 can start feature
  work.

## Required Deliverable
Every sprint must end with a demonstrable deliverable.

- CMP-014 merged: specs, ADR-001..ADR-006, IMPLEMENTATION_PLAN and this plan approved by the
  owner (each spec's `Status` set to `Approved`, PROJECT_SPEC §17 signed).
- At least one backlog story (owner's choice among US-010..US-016) refined to `Ready`:
  priority, story points, acceptance criteria, and a FEATURE_SPEC if it changes architecture.

## Selected User Stories
| Story | Points | Agent | Dependencies | Status |
|---|---:|---|---|---|
| — (CMP-014, process work) | — | Agent 1 | — | Done (PR #14 merged) |
| Backlog refinement: owner picks US-0XX | — | Owner + Coordinator (docs PR) | CMP-014 merged | Planned |
| US-001..US-009 browser verification (CMP-017, `CMP-017-sprint-01-browser-verification`) | — | Agent 1 | — | In Progress |

## Parallel Workstreams
### Agent 1
- CMP-014: done (PR #14 merged 2026-10-18).
- CMP-017: browser verification of US-001..US-009 (see Verification). Owns
  `docs/sprints/SPRINT_01_VERIFICATION.md`, `docs/sprints/evidence/sprint-01/**` and its
  `TICKETS.md` row; nothing in `src/`. Prompt:
  [SPRINT_01_AGENT_PROMPTS.md](SPRINT_01_AGENT_PROMPTS.md).

### Coordinator
- Refinement docs PR for the story the owner picks; AC wording fixes found by CMP-017; story
  status flips after the owner approves the evidence.

### Agent 2
- Unassigned.

### Agent 3
- Unassigned.

Maximum implementation agents in parallel: 3.

## Integration Contracts
- Not applicable (no parallel code work this sprint).

## Merge / Integration Order
1. CMP-014 (merged), CMP-015 (merged).
2. CMP-016 — coordinator docs PR #16 (AGENTS.md alignment, reviewer/agent setup, ADR-007);
   merged 2026-10-18. CMP-018 records its post-merge Status bookkeeping.
3. CMP-017 — Agent 1 verification evidence (docs only); independent of CMP-016 except
   `TICKETS.md`: after CMP-016 merges, Agent 1 merges `main` in and keeps exactly one CMP-017
   row (its own, with its current status).
4. Coordinator docs PR: AC wording fixes from CMP-017 and Review → Done flips, after the owner
   approves the evidence.
5. Refinement PR for the selected story.

## File Ownership Map
Agents edit only files they own; changes elsewhere are requested from the owner.

| Path | Owner |
|---|---|
| `docs/sprints/SPRINT_01_VERIFICATION.md`, `docs/sprints/evidence/sprint-01/**` | Agent 1 (CMP-017) |
| `TICKETS.md` — CMP-017 row | Agent 1 |
| `TICKETS.md` — all other rows, `docs/specs/USER_STORIES.md`, `docs/sprints/**` (except Agent 1's files), `AGENTS.md`, `PROJECT_CONTEXT.md`, `docs/process/**`, `docs/templates/**`, `docs/decisions/**` | Coordinator (docs PRs) |
| `src/**`, `public/**` | Nobody this sprint — any change needs a new CMP ticket approved by the owner |

## Conflict Resolution
- Merge conflicts are resolved when found, by the human owner together with the agent that owns
  the conflicting file.
- An agent must not rewrite another agent's files to resolve a conflict.

## Review-only Agent
Dedicated Claude Code reviewer session (Opus), triggered by the owner or the coordinator; prompt
in [SPRINT_01_AGENT_PROMPTS.md](SPRINT_01_AGENT_PROMPTS.md). Copilot and Codex run as automated
reviewers on every PR; authors run `/code-review` before each PR.

Scope:
- spec compliance
- acceptance criteria
- regressions
- code quality
- security
- integration risk

The review-only agent does not implement features.

## Human Review
The human reviewer is the final approver.

## Verification
- `mechanical-check` subagent: `npm run build` passes and every markdown link resolves.
- Browser check of the retroactive acceptance criteria US-001..US-009 (desktop, 900px, 375px,
  both languages), CMP-017. Each failure is classified: **AC wording** (the page is right, the
  AC text is wrong) → the coordinator fixes the AC in a docs PR; **defect** (the page breaks
  the AC) → the AC stays as is, a separate fix ticket is proposed to the owner, and the story
  stays in `Review` until the fix ships. Only stories whose ACs all pass move from `Review` to
  `Done`, after the owner approves the evidence.
- Owner reads PROJECT_CONTEXT.md and confirms the documentation map is complete.

## Risks
- The owner's review time is the bottleneck for both deliverables.

## Sprint Definition of Done
- Both deliverables met; TICKETS.md and PROJECT_CONTEXT.md updated; Sprint 02 plan drafted.

## Sprint Review Notes
- Unplanned work (owner request, 2026-10-18, before the sprint start): CMP-015 records the
  CMP-014 spec/ADR approvals and PROJECT_SPEC §17 sign-off and marks CMP-014 `done` (PR #15).
- Unplanned work (owner request, 2026-10-18): CMP-016 aligns AGENTS.md with the current SDD
  Starter Kit and adds the sprint readiness checklist (used from Sprint 02). Owner decision
  recorded there: the coordinator authors docs PRs itself; any PR with code goes to an
  implementation agent.
- Owner decision (2026-10-18): "as the coordinator, like the SDD demands, open a reviewer
  session as well as agents sessions". The coordinator launched the review-only session and
  Agent 1 (CMP-017) from [SPRINT_01_AGENT_PROMPTS.md](SPRINT_01_AGENT_PROMPTS.md); Agents 2
  and 3 were not opened (no Sprint 01 workstream for them).
- Unplanned work (coordinator, 2026-10-18): CMP-018 sets ADR-007 to Accepted and CMP-016 to
  `done` after PR #16 merged before the pr-workflow §5 Status step ran.
