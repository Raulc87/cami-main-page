# ADR-005 — In-repo work tracking (TICKETS.md + USER_STORIES.md)

- Status: Accepted (recorded retroactively in CMP-014; extended with USER_STORIES.md)
- Date: 2026-08-20 (CMP-001); extended 2026-10-17 (CMP-014)
- Decision owner: Raul Casanas
- Related specs: [TICKETS.md](../../TICKETS.md), [USER_STORIES.md](../specs/USER_STORIES.md)

## Decision Request
Where are the backlog and units of work tracked?

## Context
One developer plus AI agents; no budget for paid tools (PROJECT_SPEC NFR-003). Agents need
to read and update the backlog from the repo.

## Decision Drivers
- Zero cost; readable by agents without integrations.
- Traceability between stories, tickets, branches and PRs.

## Options Considered

### Option A — Markdown in the repo
`USER_STORIES.md` is the product backlog; `TICKETS.md` is the sequential `CMP-XXX` work log
(ticket → branch `CMP-XXX-slug` → PR titled `CMP-XXX: ...`).
Pros:
- Free, versioned with the code, editable by agents.
Cons:
- Manual numbering can collide between parallel branches (happened with CMP-004/005 and
  CMP-012/013).
Risks:
- Collisions grow with more parallel agents.

### Option B — Linear (free tier) or Jira
Pros:
- Boards, automation, reporting.
Cons:
- Agents need an integration; another tool to maintain.
Risks:
- Free-tier limits.

## Decision
Option A. The `Jira Key: TBD` field in each story keeps a migration path open.

## Rationale
- Fits a one-person project; consistent with the cost criterion.

## Consequences
### Positive
- Everything an agent needs is in the repo.

### Negative / Trade-offs
- Add the TICKETS.md row in the first commit of a branch to reduce collisions.

## Architecture Impact
- None.

## Implementation Impact
- PRs reference ticket ids and user stories (see [pr-workflow.md](../process/pr-workflow.md)).

## Validation
- Every merged PR maps to a TICKETS.md row; every Done story lists its tickets.

## Review Trigger
- More than one regular human contributor, or recurring numbering collisions.
