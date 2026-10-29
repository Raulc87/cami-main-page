# SPRINT_PLAN — Sprint 04

## Metadata
- Sprint: 04
- Status: Draft (approved on merge of this PR, CMP-091; starts at the owner's go-ahead, Entry
  Gate 4)
- Start: 2026-10-28 (Wednesday), or the day of the go-ahead
- End: 2026-11-04 (Wednesday)
- Duration: 1 week (owner, 2026-10-28: "1 week (Recommended)"); Saturdays and Sundays excluded
- Final human reviewer: Raul Casanas
- Plan from the kit's `SPRINT_PLAN_TEMPLATE.md` at the kit ref in
  [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md); agent prompts in
  [`SPRINT_04_AGENT_PROMPTS.md`](SPRINT_04_AGENT_PROMPTS.md)

## Entry Gates
Run [`SPRINT_READINESS_CHECKLIST.md`](../checklists/SPRINT_READINESS_CHECKLIST.md) first
(detail below).

| # | Gate | Status |
|---|---|---|
| 1 | [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md) paths resolve | Pass: docs link check on this PR's head |
| 2 | Readiness checklist has no open blocking items | Pass, except item 8 (the go-ahead), which is gate 4 |
| 3 | Integration contracts locked | Pass: [`EVENTS_API_CONTRACT.md`](../specs/EVENTS_API_CONTRACT.md) v1.9, locked (CMP-100 adds two trigger settings to §9 before CMP-101); CMP-094 changes only the look of the event tabs, not their columns or values |
| 4 | Final go-ahead from the human owner | Pending |

### Readiness checklist result (2026-10-28)
| Item | Result |
|---|---|
| 1. Paths, `AGENTS.md`/`CLAUDE.md`, project key, branch names **(blocking)** | Pass (unchanged since Sprint 03; branches in Selected tickets) |
| 2. Docs agree on scope, names, behavior **(blocking)** | Pass: FEATURE_SPEC v1.12, contract v1.9 (CMP-100) |
| 3. Testable acceptance criteria **(blocking)** | Pass: each ticket below lists its checks; no new user stories |
| 4. Locked contracts for shared interfaces **(blocking)** | Pass (gate 3) |
| 4. Credentials rule | Pass: TECH_STACK §11, ADR-009; CMP-092 (ADR-010) sets the rule for the site-upload credentials before CMP-093 |
| 5. Personal data **(blocking)** | Pass: no change to what is collected or shown |
| 5. Security baseline approved | Pass: approved (CMP-056), PTES deadline 2026-12-26 (CMP-069) |
| 5. Stories touching an OWASP risk have verifying ACs **(blocking)** | Pass: CMP-093 (credentials, supply chain) and CMP-071 carry their security checks below |
| 5. Secret and dependency scanning | Secret scanning on (owner, 2026-10-27); dependency checks are CMP-071 in this sprint |
| 5. Pen test before a production release | Not yet due: the PTES deadline is 2026-12-26; after it, no release other than a security hotfix until the test has run. CMP-095 prepares it |
| 5. Pre-release security agent's first three steps (kit v1.3.0, CMP-097) | Not blocking: Sprint 04 releases nothing to production (owner, 2026-10-28, Sprint Review Notes). CMP-093's approved run re-uploads exactly the live v1.1.0 site, and CMP-094 stays on staging this sprint. The agent's run goes with CMP's next real release (CMP-098, CMP-099), or by the 2026-12-26 deadline |
| 5. Written approval per agent scan; tester's authorization | Not blocking, for the same reason; planned in CMP-099 |
| 6. Hosting runtime, local development, developer guide | Pass: ADR-002, ADR-008, [`CONTRIBUTING.md`](../../CONTRIBUTING.md) |
| 6. Test, lint and CI checks; required on `main` | Pass: `apps-script-check`, `docs-link-check`; CMP-071 adds the dependency check |
| 6. Branching ADR and deployment runbook **(deploying sprint)** | Pass: ADR-007, ADR-009, the events-backend runbook; the site-upload decision is CMP-092 (ADR-010), merged before CMP-093 |
| 6. Previews and tests use their own data | Pass: staging for the backend; CMP-093's first run is a dry run; its first real run uploads the same v1.1.0 site that is live |
| 7. Workstreams assigned, ≤ 3 agents **(blocking)** | Pass: Agents 1 and 2 below |
| 7. Ownership map, no dependency cycle **(blocking)** | Pass |
| 7.1 Prompts: no merge or approve; reviewer independence; attribution **(blocking)** | Pass ([`SPRINT_04_AGENT_PROMPTS.md`](SPRINT_04_AGENT_PROMPTS.md)) |
| 8. Go-ahead **(blocking)** | Pending (gate 4) |

## Sprint Goal
- Make releases safer and lighter after the events go-live: the site uploads to GoDaddy from
  GitHub after the owner's approval, with a way back; dependency checks on every PR; new event
  tabs come with the status dropdown and the check-result colors; and the PTES penetration test
  is ready to hand to a tester before its 2026-12-26 deadline.

## Required Deliverable
- The site-upload workflow (CMP-093) run once for real, with the owner's approval, uploading the
  current `main` (the same site as v1.1.0); the live checks of CMP-068 steps 7–9 repeated and
  passed.
- Dependency checks running on every PR (CMP-071), and the two warnings in the deploy tools
  handled or recorded.
- A new event tab on staging created with the dropdown, colors and highlight (CMP-094).
- The PTES request pack ready for the owner to send (CMP-095).
- Evidence in `docs/sprints/SPRINT_04_VERIFICATION.md` (CMP-096).

## Selected tickets
| Ticket | Work | Agent | Waits for | Branch | Status |
|---|---|---|---|---|---|
| CMP-091 | This plan, the agent prompts, the Sprint 03 close | Coordinator | — | `cmp-014-sdd-starter-kit-homologation-rqviz9` (assigned session branch) | done |
| CMP-092 | ADR-010: upload the site from GitHub to GoDaddy (protocol, credentials, approval, backup and rollback) | Coordinator | CMP-091 | coordinator branch | todo |
| CMP-093 | Site-upload workflow (ADR-010) | Agent 1 | CMP-092 | `CMP-093-site-upload-workflow` | todo |
| CMP-094 | New event tabs get the status dropdown, the check-result colors and the needs-review highlight | Agent 1 | — | `CMP-094-event-tab-format` | todo |
| CMP-071 | Dependency checks: `npm audit` on pull requests, Dependabot version updates, an SBOM | Agent 2 | — | `CMP-071-dependency-checks` | todo |
| CMP-095 | PTES test preparation: the request pack for testers and the staging setup for the test | Agent 2 | — | `CMP-095-ptes-preparation` | todo |
| CMP-100 | Contract v1.9: the payment re-check's working hours and the time triggers' failure threshold (`RETRY_CHECK_HOURS`, `TRIGGER_FAIL_ALERT_AFTER`) | Coordinator | — | coordinator branch | done |
| CMP-101 | The payment re-check works only in working hours; the time triggers report a failure only after 10 failed runs in a row (contract v1.9) | Agent 1 | CMP-100 | `CMP-101-trigger-hours-and-failures` | todo |
| CMP-096 | Sprint 04 verification | Agent 1 | every PR above, or the owner moving it | `CMP-096-sprint-04-verification` | todo |

Outside the sprint goal: CMP-065, the real-iPhone check, runs whenever an iPhone is available
(owner, 2026-10-28: "Do it when an iPhone appears"); the HEIC decision follows it.

### Ticket checks (acceptance criteria)
- **CMP-092 (coordinator):** ADR-010 in `docs/decisions/` with the options and the owner's
  choices, quoted:
  - the protocol: FTPS (FTP over TLS) or SFTP, never plain FTP;
  - a cPanel FTP account limited to `public_html/`, its password only as a GitHub environment
    secret;
  - a `site-production` GitHub environment with the owner as required reviewer;
  - the production events URL as a secret of that environment, never in the repo or a log;
  - any third-party action pinned to a full commit SHA;
  - the backup and the rollback: the previous release's build kept, and a rollback that
    re-uploads it;
  - which files the workflow may delete on the server (only those of an earlier upload,
    never the server's own files or the backup);
  - how `.htaccess` is uploaded.
  TECH_STACK and the release checklist point to it. Merged before CMP-093.
- **CMP-093:** a workflow (`.github/workflows/deploy-site.yml`) as ADR-010 says, started
  only by hand (`workflow_dispatch`, with a dry-run input), never on a push or a merge:
  - it builds `main` with the production URL from the environment secret;
  - it checks that the bundle points at production, not staging, printing only masked values;
  - it waits for the owner's approval, then uploads.
  - A dry-run mode lists what would change and uploads nothing.
  - Evidence: one dry run, then one approved real run that uploads the current `main`. Then
    the owner's live checks: the site loads, the 301 to https, the four headers, no cookies,
    the events in EN and ES.
  - The release checklist §4 and §7 describe the new way and keep the manual upload as the
    fallback.
  - No secret, URL or ID in the repo, the logs or the PR.
- **CMP-094:** when the backend creates an event's tab (`getOrCreateSheet`), it also adds:
  - a dropdown on `status` (`new`, `confirmed`, `refund/cancelled`, `spam`), in "show a
    warning" mode, never "reject input";
  - colors on `checkResult`: `ok` green, `mismatch` red, `unreadable` orange, `pending`
    yellow, `not-required` grey;
  - a light-red row when `needsReview` is TRUE.
  - Columns, headers and values stay exactly as in the contract.
  - Staging check after merge: a registration for a new test event creates the tab with all
    three; the existing tabs are unchanged (the owner formats those by hand).
  - The runbook says what the backend adds.
- **CMP-071:** Dependabot version updates for the site (`/`) and the deploy tools
  (`/.github/clasp`), and an `npm audit` check on every PR for both.
  - It runs at the level the security baseline §6 sets, and fails on a high or critical
    advisory, except one recorded as an accepted exception: an allowlist entry in Agent 2's
    files with the advisory ID, the package, the reason and a review date, accepted by the
    owner in writing on the PR. The known `zod`/`@google/clasp` warnings in the CI-only deploy
    tools (CMP-050, no fixed release yet) are proposed as the first entries; an expired review
    date fails the check.
  - It also produces an SBOM for each release.
  - The two warnings in the deploy tools (CMP-050 notes): fixed if a release fixes them;
    otherwise recorded with the reason and a review date.
  - The baseline §6 and §7 rows are updated.
- **CMP-095:** a short request pack the owner can send to testers, unchanged:
  - what to test (from `PENTEST_PLAN.md`), the dates, and the deadline 2026-12-26;
  - the rules of engagement and the authorization form to sign;
  - what the tester gets privately, and what the report must contain;
  - where to look for a tester in Costa Rica or remotely, with the cost question (NFR-003)
    left to the owner.
  - It also states what staging needs for the test: test SINPE values and a test event during
    the window, the alert settings, and the cleanup afterwards.
  - No staging URL, IDs or personal data in it.
- **CMP-101:** `refreshEventsCache` and `retryPendingChecks` follow contract v1.9 §9:
  - outside `RETRY_CHECK_HOURS` (Costa Rica time) a `retryPendingChecks` run ends at once with no
    work and no error, leaving its failure count unchanged; `refreshEventsCache` runs at every
    hour, as now;
  - a failed run is reported (Google's failure email) only at `TRIGGER_FAIL_ALERT_AFTER` failures
    in a row of that function; earlier ones are logged by error name only; a success resets the
    count;
  - empty or invalid values fall back as the contract says;
  - each function keeps its own failure count in a script property;
  - The runbook §2.4 lists both properties with their initial values (06-22, 10); the owner adds
    them on staging and production.
  - Staging check after the merge (contract §10), with the staging triggers re-created for the
    check and deleted again afterwards (owner, 2026-10-28: staging triggers deleted while no
    feature is tested). Like CMP-094, it stays on staging this sprint and reaches production with
    the next release.
- **CMP-096:** `docs/sprints/SPRINT_04_VERIFICATION.md` with the evidence of every ticket and
  the staging cleanup list.

## Parallel Workstreams
### Agent 1 — Events backend and deploys (fresh session)
- CMP-094 and CMP-101 at the go-ahead; CMP-093 once CMP-092 is merged; CMP-096 last.

### Agent 2 — Security (fresh session)
- CMP-071 and CMP-095 at the go-ahead.
- Never runs a penetration test or attack tools, and never scans production.

Maximum implementation agents in parallel: 2.

## Foundation (before parallel work)
- CMP-092 (coordinator): ADR-010, merged before CMP-093.

## File Ownership Map
Agents edit only files they own; changes elsewhere are requested from the owner of the file.

| Path | Owner |
|---|---|
| `apps-script/**`, `.github/clasp/**` (except Dependabot's own pull requests), `.github/scripts/**` except `check_doc_links.py`, `.github/workflows/deploy-apps-script.yml`, `.github/workflows/apps-script-check.yml`, `.github/workflows/deploy-site.yml` (new), [`docs/process/events-backend-runbook.md`](../process/events-backend-runbook.md), `docs/sprints/SPRINT_04_VERIFICATION.md`, `docs/sprints/evidence/sprint-04/**` | Agent 1 |
| `docs/security/**`, `.github/dependabot.yml` (new), `.github/workflows/dependency-audit.yml` (new) | Agent 2 |
| `src/**`, `public/**`, `index.html`, `package.json` and `package-lock.json`, `CONTRIBUTING.md`, [`README.md`](../../README.md) | No agent this sprint: a change goes through the coordinator to the owner |
| [`TICKETS.md`](../../TICKETS.md) | Shared: each agent updates only its own rows; the coordinator adds rows |
| `.github/workflows/docs-link-check.yml`, `.github/scripts/check_doc_links.py`, `docs/specs/**`, [`docs/process/release-checklist.md`](../process/release-checklist.md) and the other process docs, `docs/sprints/SPRINT_04_*.md` except the verification, [`AGENTS.md`](../../AGENTS.md), [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md), [`TECH_STACK.md`](../../TECH_STACK.md), `docs/decisions/**`, `docs/ux/**` | Coordinator (docs PRs) |

CMP-071 does not edit lockfiles or manifests: a fix in `.github/clasp` is Agent 1's (Agent 2
asks through the coordinator); a fix in the site's `package.json`/`package-lock.json` comes
only as a Dependabot pull request, which the owner merges after review.

CMP-093 needs release-checklist §4 and §7 changed: Agent 1 sends the text to the coordinator,
who changes it in a docs PR merged with or right after CMP-093.

## Integration Contracts
- [`EVENTS_API_CONTRACT.md`](../specs/EVENTS_API_CONTRACT.md) v1.9, locked: CMP-100 adds the
  two trigger settings to §9 and their test to §10, merged before CMP-101.

## Merge / Integration Order
Each line names what the PR waits for.

1. CMP-091 (this plan) — nothing.
2. CMP-092 (ADR-010) — CMP-091.
3. CMP-094, CMP-071, CMP-095 — nothing beyond the go-ahead; CMP-101 — CMP-100 (merged).
4. CMP-093 (site upload) — CMP-092.
5. CMP-096 (verification) — every PR above, except one the owner moved to the next sprint.

Cycle check: every arrow points to a PR earlier in this list.

## Conflict Resolution
- Merge conflicts are resolved when found, by the human owner together with the agent that owns
  the conflicting file.
- An agent must not rewrite another agent's files to resolve a conflict.

## Review-only Agent
A fresh review-only session (Opus) reviews each PR when its author asks after a push, or when
the owner or the coordinator asks ([`AGENTS.md`](../../AGENTS.md) → Review flow). Codex reviews
every PR automatically.

## Human Review
The human reviewer is the final approver.

## Verification
- Each PR: `npm run build` (and `node --check` for `apps-script/`), its checks above, evidence
  in the PR body.
- CMP-094 deploys staging on merge (ADR-009): its staging check runs after the merge, and its
  row stays `review` until then (as in Sprint 03).
- CMP-093: a dry run before the merge is not possible from a branch if the workflow runs only
  from `main`; the PR merges after review, then the dry run and the approved run follow, and
  the row stays `review` until the owner's live checks.
- CMP-096 collects the evidence.

## Risks
- **The upload credentials.** An FTP password in GitHub can change the live site. Mitigations
  (ADR-010): an account limited to `public_html/`, an encrypted protocol, the secret only in an
  environment that needs the owner's approval, pinned actions, secret scanning on.
- **A bad upload breaks the live site.** Mitigations: the dry run first, the approval click,
  the kept previous build and a tested rollback, the manual upload as the fallback.
- **The PTES deadline (2026-12-26).** Finding a tester may take time and cost money (NFR-003).
  After the deadline, no release until the test is done. CMP-095 makes the request ready to
  send this week.
- **The staging login token** can expire again (CMP-064 note); every backend deploy then stops
  until the owner logs in.

## Sprint Definition of Done
- Every selected ticket `done`, or moved to Sprint 05 by the owner.
- The Required Deliverable demonstrated and its evidence approved: merging CMP-096.
- [`TICKETS.md`](../../TICKETS.md) and [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md)
  updated.

## Sprint Review Notes
- Owner decisions, 2026-10-28, questions as asked:
  - "What should Sprint 04 include?" Owner: **"Automatic site upload, Dependency checks
    (CMP-071), Tidy new event tabs, PTES test preparation"**.
  - "How long should Sprint 04 be?" Owner: **"1 week (Recommended)"** ("2026-10-28 to
    2026-11-04").
  - "The real-iPhone test and the HEIC photo decision: how should Sprint 04 handle them?"
    Owner: **"Do it when an iPhone appears"** (stays CMP-065, outside the goal; no code until
    the test).
- The automatic site upload was the owner's proposal during the v1.1.0 upload (2026-10-27):
  "why don't we use FTP to load the version from a github release? maybe we could do that for
  next release".
- The event-tab dropdown and colors were the owner's idea (2026-10-28); until CMP-094 the owner
  formats the existing tabs by hand.
</content>
</invoke>
- Owner decision after the kit v1.3.0 sync (CMP-097, PR #92), 2026-10-28. Question as asked:
  "Does Sprint 04 count as a production release under the new kit rules? The reviewer asks
  because the PTES test is still due." Options: "No, not a release (Recommended)": the first run
  of the upload workflow re-uploads exactly the live v1.1.0 site, and the event-tab change stays
  on staging this sprint, reaching production with the next real release; "Yes, a release".
  Owner: **"No, not a release (Recommended)"**. So Sprint 04 needs no pre-release security agent;
  no production backend deploy runs this sprint, and CMP-094 reaches production with the next
  release, which triggers CMP-098 and CMP-099 (or the 2026-12-26 deadline does, whichever comes
  first).
- Staging time triggers deleted by the owner (2026-10-28), after two one-off Google server errors
  in staging's `refreshEventsCache` (2026-10-26 21:56 and 2026-10-27 11:41, Costa Rica time):
  "since we are not actively working on a feature for cami besides being aware of any bug
  happening. can we stop staging triggers to avoid this?" … "staging triggers deleted". Staging
  answers `events` from its last saved list meanwhile; the triggers are re-created for each
  staging check that needs them (CMP-101, the PTES window) and deleted again after. Production
  keeps both triggers.
- Owner decisions, 2026-10-28, questions as asked: "… Both need a small backend change. The
  backend would (1) send the failure email only after N failures in a row, and (2) skip its work
  outside working hours … Do you want it?" Owner: **"Add to Sprint 04 (Recommended)"**. "If we do
  it: which hours should the triggers work (Costa Rica time)? …" Owner: **"6:00 to 22:00
  (Recommended)"**. "And the failure email: after how many failures in a row?" Owner: **"10 in a
  row (your number)"** (about 50 minutes with the 5-minute trigger). Contract v1.9 (CMP-100),
  backend CMP-101; like CMP-094 it stays on staging this sprint, so Sprint 04 is still not a
  production release.
- Owner decision, 2026-10-29, after the review of PR #93 found that pausing the events refresh at
  night would keep showing "Register" for an event whose registration closes overnight. Question
  as asked: "… How should we handle it?" Options: "Keep events refresh on 24h (Recommended)",
  "Re-check closing time per request", "Accept it". Owner: **"Keep events refresh on 24h
  (Recommended)"**. Only the payment re-check pauses from 22:00 to 06:00 (`RETRY_CHECK_HOURS`);
  the 10-failures rule applies to both triggers.
