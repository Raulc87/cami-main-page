# ADR-006 — Adopt the SDD starter kit structure and Scrum process

- Status: Proposed (accepted when the CMP-014 PR is approved and merged)
- Date: 2026-10-17
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
  no longer exist (mapping recorded in [PROJECT_CONTEXT.md](../../PROJECT_CONTEXT.md)).

## Architecture Impact
- None to the code.

## Implementation Impact
- File mapping: `00-vision` → `PROJECT_SPEC`; `01-tech-stack` → `TECH_STACK.md`;
  `02-design-system` → `docs/ux/UX_UI_DIRECTION.md`; `03-content-model` + `04-architecture`
  → `ARCHITECTURE_SPEC`; `05-roadmap` → `USER_STORIES` (US-010..US-016).

## Validation
- `mechanical-check` link check passes; Sprint 01 runs with the new artifacts.

## Review Trigger
- End of Sprint 02: is the Scrum overhead paying off for a solo project?
