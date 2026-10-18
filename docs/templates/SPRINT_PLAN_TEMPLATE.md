# SPRINT_PLAN

## Metadata
- Sprint:
- Status: Planned / Active / Review / Closed
- Start:
- End:
- Duration: 7 business days
- Saturdays and Sundays excluded
- Final human reviewer:

## Entry Gates
Run [SPRINT_READINESS_CHECKLIST.md](../checklists/SPRINT_READINESS_CHECKLIST.md) first.

| # | Gate | Status |
|---|---|---|
| 1 | `PROJECT_CONTEXT.md` paths resolve | |
| 2 | Readiness checklist has no open blocking items | |
| 3 | Integration contracts locked (or N/A) | |
| 4 | Final go-ahead from the human owner | |

## Sprint Goal
-

## Required Deliverable
Every sprint must end with a demonstrable deliverable.

-

## Selected User Stories
| Story | Points | Agent | Dependencies | Ticket / branch (`CMP-XXX-slug`) | Status |
|---|---:|---|---|---|---|

## Parallel Workstreams
### Agent 1
-

### Agent 2
-

### Agent 3
-

Maximum implementation agents in parallel: 3.

## Foundation (before parallel work)
Shared work that must merge first (e.g. new keys in `global.css`, `i18n.js`, `data.jsx`), and
its owner.

-

## File Ownership Map
Agents edit only files they own; changes elsewhere are requested from the owner.

| Path | Owner |
|---|---|
| | |

## Integration Contracts
Define interfaces before parallel implementation begins.

-

## Merge / Integration Order
1. Foundation
2. Parallel workstream PRs (each with a clean `npm run build`)
3. Integration check — owner:

## Conflict Resolution
- Merge conflicts are resolved when found, by the human owner together with the agent that owns
  the conflicting file.
- An agent must not rewrite another agent's files to resolve a conflict.

## Review-only Agent
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
-

## Risks
-

## Sprint Definition of Done
-

## Sprint Review Notes
-
