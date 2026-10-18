# SPRINT_PLAN — Sprint 01

## Metadata
- Sprint: 01
- Status: Active (owner go-ahead 2026-10-18)
- Start: 2026-10-19 (Monday)
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
1. CMP-014 (merged).
2. Refinement PR for the selected story (if docs change).

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
  both languages); fix any AC that doesn't match the rendered page, then move each verified
  story from `Review` to `Done`.
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
