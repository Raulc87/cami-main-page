# SPRINT_PLAN — Sprint 06

## Metadata
- Sprint: 06
- Status: Proposed (approved on merge of the CMP-120 PR; the owner's go-ahead is Entry Gate 4)
- Start: the day of the go-ahead
- End: seven business days after the go-ahead (the standard cadence; Saturdays and Sundays
  excluded)
- Final human reviewer: Raul Casanas
- Plan from the kit's `SPRINT_PLAN_TEMPLATE.md` at the kit ref in
  [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md); agent prompts in
  [`SPRINT_06_AGENT_PROMPTS.md`](SPRINT_06_AGENT_PROMPTS.md)

## Entry Gates
Run [`SPRINT_READINESS_CHECKLIST.md`](../checklists/SPRINT_READINESS_CHECKLIST.md) first
(detail below).

| # | Gate | Status |
|---|---|---|
| 1 | [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md) paths resolve | Pass: docs link check on the head of the CMP-120 PR |
| 2 | Readiness checklist has no open blocking items | Pass, except item 8 (the go-ahead), which is gate 4 |
| 3 | Integration contracts locked | Pass on merge: [`EVENTS_API_CONTRACT.md`](../specs/EVENTS_API_CONTRACT.md) v1.11 (CMP-120) adds the `noticeSentAt` column (§6) and the check-after-answer test (§10); the API's requests and responses do not change |
| 4 | Final go-ahead from the human owner | Pending |

### Readiness checklist result (2026-11-01)
| Item | Result |
|---|---|
| 1. Paths, `AGENTS.md`/`CLAUDE.md`, project key, branch names **(blocking)** | Pass (unchanged; branches in Selected tickets) |
| 2. Docs agree on scope, names, behavior **(blocking)** | Pass: FEATURE_SPEC v1.15 (FFR-035, FFR-034 timing), contract v1.11, US-022 AC8, US-026 AC1, EVENTS_EMAILS_AND_PRIVACY §2c timing, all in the CMP-120 PR |
| 3. Testable acceptance criteria **(blocking)** | Pass: US-022 AC8, US-026 AC1 and the ticket checks below |
| 4. Locked contracts for shared interfaces **(blocking)** | Pass (gate 3) |
| 4. Credentials rule | Pass: unchanged (TECH_STACK §11, ADR-009, ADR-010) |
| 5. Personal data **(blocking)** | Pass: nothing new is collected; `noticeSentAt` is a timestamp |
| 5. Security baseline approved | Pass: approved (CMP-056); PTES due by 2026-12-26 (CMP-099) |
| 5. Stories touching an OWASP risk have verifying ACs **(blocking)** | Pass: CMP-124 (dependency upgrade) carries the audit and build checks; CMP-121 keeps US-026 AC3/AC4 |
| 5. Secret and dependency scanning | Pass: secret scanning on; dependency checks on every PR (CMP-071) |
| 5. Pen test before a production release | Not yet due: the PTES deadline is 2026-12-26; this sprint releases v1.2.0 (CMP-125) and a backend change (CMP-123) before it |
| 5. Pre-release security agent **(blocking: release sprint)** | Pass: its session stays open since Sprint 04; its review of the backend changes since `31f1db3` (the code deployed in CMP-114) is planned before CMP-123, and of the site changes since `5d52c59` (v1.1.2) before CMP-125's tag |
| 5. Written approval per agent scan **(blocking: release sprint)** | Pending, not blocking the go-ahead: the owner decides before CMP-123/CMP-125, as before; those tickets wait for it |
| 6. Hosting runtime, local development, developer guide | Pass: ADR-002, ADR-008, [`CONTRIBUTING.md`](../../CONTRIBUTING.md) (CMP-124 updates it if commands change) |
| 6. Test, lint and CI checks; required on `main` | Pass: build, `apps-script-check`, docs link check, dependency audit |
| 6. Branching ADR and deployment/release runbooks **(deploying sprint)** | Pass: ADR-007, ADR-009, ADR-010, the events-backend runbook, the release checklist |
| 6. Previews and tests use their own data | Pass: the staging backend and spreadsheet; the site upgrade is checked on a local build |
| 7. Workstreams assigned, ≤ 3 agents **(blocking)** | Pass: Agent 1 (backend) and Agent 3 (site) |
| 7. Ownership map, no dependency cycle **(blocking)** | Pass |
| 7.1 Prompts: no merge or approve; reviewer independence; attribution **(blocking)** | Pass ([`SPRINT_06_AGENT_PROMPTS.md`](SPRINT_06_AGENT_PROMPTS.md)) |
| 8. Go-ahead **(blocking)** | Pending (gate 4) |

## Sprint Goal
Paid sign-ups answer as fast as free ones (the payment check runs after the answer, FFR-035),
and the site moves to React 19 and Vite 8 in release v1.2.0.

## Required Deliverable
- The check after the answer live on the production backend (CMP-123), with Cami's notice after
  the check (FFR-034).
- Release v1.2.0 live (CMP-125), uploaded by the site-upload workflow, the site unchanged to the
  eye and PageSpeed at least as good as v1.1.2.
- The clasp audit exception settled before its 2026-11-20 review date (CMP-122).
- Evidence in `docs/sprints/SPRINT_06_VERIFICATION.md` (CMP-126).

## Selected tickets
| Ticket | Work | Agent | Waits for | Branch | Status |
|---|---|---|---|---|---|
| CMP-120 | This plan, the agent prompts, FEATURE_SPEC v1.15 (FFR-035), contract v1.11, US-022 AC8, US-026 AC1 | Coordinator | — | `cmp-014-sdd-starter-kit-homologation-rqviz9` (coordinator's assigned branch) | done |
| CMP-121 | Payment check after the answer; notice after the check (FFR-035, FFR-034) | Agent 1 | CMP-120 | `CMP-121-check-after-answer` | todo |
| CMP-122 | clasp audit exception (zod, GHSA-mrhx-c7xc-m3w5) before 2026-11-20: a fixed clasp release, or the owner's renewal | Agent 1 | — | `CMP-122-clasp-audit-exception` | todo |
| CMP-123 | Production backend deploy of CMP-121 | Agent 1 + owner | CMP-121's staging check; the security agent's review; the owner's scan decision | — (evidence in CMP-126) | todo |
| CMP-124 | Site libraries: React 19, React DOM 19, Vite 8, `@vitejs/plugin-react` 6 (replaces Dependabot PRs #104–#107) | Agent 3 | — | `CMP-124-react19-vite8` | todo |
| CMP-127 | TECH_STACK and docs for CMP-124 | Coordinator | CMP-124 (text from Agent 3) | coordinator's branch | todo |
| CMP-125 | Release v1.2.0 | Agent 3 + owner | CMP-124, CMP-127; the security agent's review; the owner's scan decision | `CMP-125-release-v1-2-0` | todo |
| CMP-126 | Sprint 06 verification | Agent 1 | every ticket above | `CMP-126-sprint-06-verification` | todo |

Dependabot PR #109 (GitHub Actions versions) keeps Dependabot's title and has no ticket
(pr-workflow §2): the review-only agent reviews it, then the owner merges it.

Not in this sprint (owner, 2026-11-01): the rollback rehearsal of the site-upload workflow
("No, skip it"); HEIC camera photos stay as they are ("Leave as is", Sprint 05).

### Ticket checks (acceptance criteria)
- **CMP-120:** FFR-035, FFR-034's new timing, contract §6/§10 v1.11, US-022 AC8, US-026 AC1 and
  §2c agree; the owner's answers quoted (Review Notes).
- **CMP-121:** US-022 AC8, US-026 AC1–AC5 and contract §10 (v1.11):
  - `register` never runs the OCR: a paid row is saved `pending`, the confirmation or "registration
    received" email goes out, the answer returns;
  - `retryPendingChecks` (every 10 minutes, inside `RETRY_CHECK_HOURS`) checks each `pending`
    row, writes the result, sends the "not validated" email when FFR-017 requires it, then the
    notice (FFR-034), and sets `noticeSentAt`; a row still `pending` at FFR-032's 24-hour limit
    gets its notice then, saying `pending`; nothing is sent twice;
  - a ₡0 registration still gets its notice in the request, and its `noticeSentAt` set;
  - `noticeSentAt` is added last to an older tab that lacks it (as `contactOptIn` was); rows
    saved before this change are never notified;
  - the trigger's run stays well inside Apps Script's 6-minute limit (a cap on rows per run if
    needed, said in the PR);
  - runbook updated (what Cami sees, the delay, night sign-ups after 06:00);
  - staging check after the merge: three paid and three ₡0 registrations timed (paid median
    within 1 s of ₡0), a paid one checked by the next trigger run (result, "not validated"
    email, one notice), a second run sends nothing, a night-hours case simulated with
    `RETRY_CHECK_HOURS`; then the cleanup. The row stays `review` until then.
- **CMP-122:** if a clasp release now pulls a fixed zod, `.github/clasp` moves to it (deploy
  checked on staging); otherwise the allowlist entry's renewal goes to the owner with the
  reason, and its new review date, at most 30 days later, with the owner's written acceptance
  on the PR. Either way the dependency audit is green after 2026-11-20.
- **CMP-123:** the security agent's review of the backend changes since `31f1db3` with no open
  critical or high finding; the owner's scan decision; the approved production deploy; smoke
  green; both triggers present; the next real paid sign-up's notice confirmed by Cami (it now
  arrives after the check).
- **CMP-124:**
  - React and React DOM 19, Vite 8, `@vitejs/plugin-react` 6, lockfile regenerated with npm;
    Dependabot's #104–#107 closed with a pointer to this PR (by the owner, or the agent with the
    owner's OK);
  - build green; dependency audit green; no new runtime library;
  - no visible change, checked at 1280/900/375 px in both languages (events, form, gallery);
    no console errors; the events, coupon and register calls work against staging;
  - local Lighthouse not worse than v1.1.2's (mobile 90+, desktop 95+, CLS ≤ 0.1);
  - the text for TECH_STACK (and CONTRIBUTING, if anything changes) sent to the coordinator.
- **CMP-127:** TECH_STACK's framework and build-tool lines, merged with or right after CMP-124.
- **CMP-125:** release v1.2.0 as for v1.1.2: version bump PR, the security agent's delta review
  to the tagged commit, the owner's statement and scan decision, tag and Release, dry run, real
  upload, the release checklist's live checks, PageSpeed (three mobile runs).
- **CMP-126:** `docs/sprints/SPRINT_06_VERIFICATION.md` with the evidence of every ticket and the
  staging cleanup list.

## Parallel Workstreams
### Agent 1 — Events backend (fresh session)
- CMP-121 and CMP-122 at the go-ahead; CMP-123 after CMP-121's staging check; CMP-126 last.

### Agent 3 — Site libraries and release (fresh session)
- CMP-124 at the go-ahead; CMP-125 after CMP-124 and CMP-127.

### Pre-release security agent (its Sprint 04 session)
- Reviews the merged backend changes before CMP-123, and the release commit before CMP-125's
  tag; reports to the coordinator only.

Maximum implementation agents in parallel: 2.

## Foundation (before parallel work)
CMP-120 (this PR): the spec and contract the code follows.

## File Ownership Map
Agents edit only files they own; changes elsewhere are requested from the owner of the file.

| Path | Owner |
|---|---|
| `apps-script/**`, `.github/clasp/**` (except Dependabot's own pull requests), `.github/scripts/**` except `check_doc_links.py`, `.github/workflows/deploy-apps-script.yml`, `.github/workflows/apps-script-check.yml`, [`docs/process/events-backend-runbook.md`](../process/events-backend-runbook.md), [`docs/security/audit-allowlist.json`](../security/audit-allowlist.json) (CMP-122 only), `docs/sprints/SPRINT_06_VERIFICATION.md`, `docs/sprints/evidence/sprint-06/**` | Agent 1 |
| `src/**`, `public/**`, `index.html`, `package.json` and `package-lock.json`, `vite.config.*`, `CONTRIBUTING.md`, [`README.md`](../../README.md) | Agent 3 |
| [`TICKETS.md`](../../TICKETS.md) | Shared: each agent updates only its own rows; the coordinator adds rows |
| `docs/specs/**`, `docs/ux/**`, `docs/sprints/SPRINT_06_*.md` except the verification, the process docs except the events-backend runbook, [`AGENTS.md`](../../AGENTS.md), [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md), [`TECH_STACK.md`](../../TECH_STACK.md), `docs/decisions/**` | Coordinator (docs PRs) |
| `docs/security/**` except the allowlist | Pre-release security agent (only with the owner's OK per PR) |

## Integration Contracts
[`EVENTS_API_CONTRACT.md`](../specs/EVENTS_API_CONTRACT.md) v1.11: §6 `noticeSentAt`, §10 the
check after the answer. The site is not a party to this change: requests and responses are
unchanged (CMP-124 does not change any call).

## Merge / Integration Order
Each line names what the PR waits for.

1. CMP-120 (this plan and the spec) — nothing.
2. CMP-121 (check after the answer) — CMP-120. CMP-122 (clasp exception) — nothing; before
   2026-11-20. CMP-124 (site libraries) — nothing. Dependabot #109 — the reviewer's verdict.
3. CMP-127 (TECH_STACK) — CMP-124's text; merged with or right after CMP-124.
4. CMP-123 (production backend) — CMP-121's staging check; the security agent's review; the
   owner's scan decision. CMP-125 (release v1.2.0) — CMP-124, CMP-127; the security agent's
   delta review; the owner's scan decision.
5. CMP-126 (verification) — every PR above.

Cycle check: every arrow points to a PR earlier in this list.

## Conflict Resolution
- Merge conflicts are resolved when found, by the human owner together with the agent that owns
  the conflicting file. `TICKETS.md` conflicts are resolved by the author of the PR merged
  second, keeping every row.
- An agent must not rewrite another agent's files to resolve a conflict.

## Review-only Agent
A fresh review-only session (Opus) reviews each PR when its author asks after a push, or when
the owner or the coordinator asks ([`AGENTS.md`](../../AGENTS.md) → Review flow). Codex reviews
every PR automatically.

## Human Review
The human reviewer is the final approver.

## Verification
- Each PR: `npm run build`, `node --check` on changed `apps-script/` files, its checks above,
  evidence in the PR body.
- CMP-121 and CMP-122 deploy staging on merge (ADR-009): their staging checks run after the
  merge, and their rows stay `review` until then.
- CMP-126 collects the evidence.

## Risks
- Paid sign-ups get their check up to 10 minutes later (after 06:00 at night): the participant's
  "not validated" email and Cami's notice move with it (owner's choice).
- React 19 and Vite 8 are major versions: hidden behavior changes. Mitigated by the visual and
  functional checks and Lighthouse on a local build before the release, and by the release's
  kept build of v1.1.2 as the way back.
- The deploy login (`CLASP_CREDENTIALS`) keeps expiring; the Workspace session-control setting
  is still to be checked by the owner.
- Production changes before the PTES test (due 2026-12-26): reviewed by the pre-release security
  agent first.

## Sprint Definition of Done
- Every selected ticket `done`, or moved to the next sprint by the owner.
- The Required Deliverable demonstrated and its evidence approved: merging CMP-126.
- [`TICKETS.md`](../../TICKETS.md) and [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md)
  updated.

## Sprint Review Notes
- Owner, 2026-11-01, verbatim: "are we going to do something about the slowness? I was thinking
  of doing the OCR asynchronously", then "yes, plan Sprint 06 that way". Questions as asked and
  answers:
  - "With the receipt read after answering, when should Cami's notice go out?" Owner: **"After
    the check finishes (Recommended)"** (the other option: right away, saying 'pending').
  - "The timed job that would read receipts runs every 10 minutes, only 06:00–22:00. For the
    first reading of a new receipt, should that change?" Owner: **"Keep every 10 min,
    06:00–22:00"** (other options: every 5 minutes in those hours, or around the clock).
  - "The library updates (React 19, Vite 8 and the React plugin) are big version jumps. How
    should they ship?" Owner: **"One site release v1.2.0 (Recommended)"** (the other option:
    only the small Actions update now).
  - "Also include a rehearsal of the site's 'roll back' upload (put the previous version back,
    then forward again) right after the v1.2.0 release?" Owner: **"No, skip it"**.
