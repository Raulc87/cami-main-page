# ADR-007 — Branching and release model

- Status: Accepted (owner approved and merged PR #16, 2026-10-18; status recorded in CMP-018)
- Date: 2026-10-18
- Decision owner: Raul Casanas
- Related specs: [AGENTS.md](../../AGENTS.md) (tickets and branches, merging),
  [ADR-002](ADR-002-godaddy-static-hosting.md) (hosting),
  [release-checklist.md](../process/release-checklist.md) (release and deployment runbook)

From the Starter Kit's `ADR_BRANCHING_AND_RELEASE_TEMPLATE.md`, adapted to this repo. It
records the model the project already follows (v1.0.0 and v1.0.1 were released this way), so
the readiness checklist §6 gate ("branching and release model is recorded (ADR)") can pass.

## Decision Request
How does work reach production, does the project need a long-lived `develop` branch, and how
are urgent fixes kept apart from unreleased work?

## Context
- Static site on GoDaddy shared hosting; a deploy is a manual upload of `dist/` to
  `public_html/` (ADR-002, release-checklist).
- No CI and no preview site: the check before a release is `npm run build` plus
  `npm run preview` locally, and a smoke test of the live site right after the upload.
- `main` receives changes only through PRs reviewed by the review-only agent and the
  automated reviewers, approved and merged by the owner.
- One owner plus agents; small, infrequent releases.

## Options Considered

### Option A — Trunk-based on `main`, releases from tags (Starter Kit default)
Pros:
- One integration branch; nothing to keep in sync.
Cons:
- `main` must stay releasable.

### Option B — `develop` + `main`
Pros:
- Unreleased work is visibly separate.
Cons:
- Every change merges twice; the branches drift; a second target for agents and runbooks.

## Decision
Option A:
1. `main` is the only long-lived branch. Ticket branches (`CMP-XXX-slug`, AGENTS.md) merge
   back through reviewed PRs.
2. `main` is always releasable: a story merges only when it is ready to go live. (No build
   flags exist yet; adopt them with an ADR if a story ever needs to merge unfinished.)
3. Production = SemVer release tags (`vMAJOR.MINOR.PATCH`) on a `main` commit, published as a
   GitHub Release, with the `dist/` of that commit uploaded per release-checklist.md. The tag
   and release are created only after the live site has been verified
   ([release-checklist.md §6](../process/release-checklist.md#6-tag--github-release)).
4. Urgent fix: because `main` is kept releasable, the fix is a normal `CMP-XXX` ticket
   against `main`, released as a patch. A `release/vMAJOR.MINOR.x` branch is created only if
   `main` ever holds unreleased work that must not go live; it then gets the same protection
   as `main`.
5. Rollback: restore the cPanel backup `.zip` taken before the upload; if none exists, build
   the previous release tag and upload that `dist/`
   ([release-checklist.md §7](../process/release-checklist.md#7-rollback),
   [IMPLEMENTATION_PLAN §17](../plans/IMPLEMENTATION_PLAN.md#17-rollback)).
6. Backends and data (when US-011/US-012 arrive) follow the same rule, with a staging data
   store for previews and tests — to be detailed in the backend ADR.

## Consequences
### Positive
- Matches how v1.0.0 and v1.0.1 were shipped; nothing changes in practice.
### Negative / Trade-offs
- No preview environment: the local `npm run preview` is the only pre-release check.

## Review Trigger
- A preview/staging site, CI, or a backend is introduced; several agents need long-running
  unreleased work on `main`.
