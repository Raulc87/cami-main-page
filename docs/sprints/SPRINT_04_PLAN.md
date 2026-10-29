# SPRINT_PLAN — Sprint 04

## Metadata
- Sprint: 04
- Status: Active (plan approved on merge of PR #91, CMP-091; owner's go-ahead 2026-10-29, Entry
  Gate 4)
- Start: 2026-10-29 (Thursday), the day of the go-ahead
- End: 2026-11-05 (Thursday), one week from the go-ahead (the owner's "1 week")
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
| 4 | Final go-ahead from the human owner | Pass: "merged 94, go ahead with Sprint 04" (owner, 2026-10-29) |

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
| 5. Pen test before a production release | Not yet due: the PTES deadline is 2026-12-26; after it, no release other than a security hotfix until the test has run. Sprint 04 releases v1.1.1 (CMP-103) before the deadline; the owner keeps the deadline route for it (2026-10-29, Sprint Review Notes). CMP-095 prepares the test |
| 5. Pre-release security agent's first three steps (kit v1.3.0, CMP-097) **(blocking: Sprint 04 releases v1.1.1)** | Pass: PR #94 merged 2026-10-29 (baseline and pen-test plan updated; first review 5566e56..fe72b17, no new findings). Before the go-ahead, as planned: CMP-098, run by the pre-release security agent in its own session, started before the go-ahead (owner, 2026-10-29: "Follow the kit"). Steps 1 and 3 build on the baseline and pen-test plan updated in CMP-097; step 2 reviews the changes since CMP-063's review, then, before CMP-103, the changes merged in this sprint. The go-ahead waited for steps 1–3 |
| 5. Written approval per agent scan; tester's authorization **(blocking: release sprint)** | The owner's written approval for the production scan right after v1.1.1 (CMP-104), signed before CMP-103, with the owner named as the person who can stop it; release-checklist §6b. The PTES tester's authorization is not needed for v1.1.1: the human test stays due by 2026-12-26 (CMP-099), as the kit allows for the human test only |
| 6. Hosting runtime, local development, developer guide | Pass: ADR-002, ADR-008, [`CONTRIBUTING.md`](../../CONTRIBUTING.md) |
| 6. Test, lint and CI checks; required on `main` | Pass: `apps-script-check`, `docs-link-check`; CMP-071 adds the dependency check |
| 6. Branching ADR and deployment runbook **(deploying sprint)** | Pass: ADR-007, ADR-009, the events-backend runbook; the site-upload decision is CMP-092 (ADR-010), merged before CMP-093 |
| 6. Previews and tests use their own data | Pass: staging for the backend; the site's changes are checked on a local build (CMP-102); CMP-093's first run is a dry run |
| 7. Workstreams assigned, ≤ 3 agents **(blocking)** | Pass: Agents 1, 2 and 3 below |
| 7. Ownership map, no dependency cycle **(blocking)** | Pass |
| 7.1 Prompts: no merge or approve; reviewer independence; attribution **(blocking)** | Pass ([`SPRINT_04_AGENT_PROMPTS.md`](SPRINT_04_AGENT_PROMPTS.md)) |
| 8. Go-ahead **(blocking)** | Pass (gate 4) |

## Sprint Goal
- Make the site fast again after the events go-live (PageSpeed 90+ on desktop and mobile, no
  layout jump; owner, 2026-10-29: "REALLY important"), released as v1.1.1; and make releases
  safer and lighter: the site uploads to GoDaddy from
  GitHub after the owner's approval, with a way back; dependency checks on every PR; new event
  tabs come with the status dropdown and the check-result colors; and the PTES penetration test
  is ready to hand to a tester before its 2026-12-26 deadline.

## Required Deliverable
- Release v1.1.1 live (CMP-103): the performance fixes (CMP-102), with PageSpeed 90+ on desktop
  and mobile on the live site, and the event-tab and trigger changes (CMP-094, CMP-101) deployed
  to production with the owner's approval. Uploaded by the site-upload workflow (CMP-093) if it is
  ready and its dry run passed, otherwise by hand as for v1.1.0; the live checks of the release
  checklist passed.
- Dependency checks running on every PR (CMP-071), and the two warnings in the deploy tools
  handled or recorded.
- A new event tab on staging created with the dropdown, colors and highlight (CMP-094).
- The PTES request pack ready for the owner to send (CMP-095).
- Evidence in `docs/sprints/SPRINT_04_VERIFICATION.md` (CMP-096).

## Selected tickets
| Ticket | Work | Agent | Waits for | Branch | Status |
|---|---|---|---|---|---|
| CMP-091 | This plan, the agent prompts, the Sprint 03 close | Coordinator | — | `cmp-014-sdd-starter-kit-homologation-rqviz9` (assigned session branch) | done |
| CMP-092 | ADR-010: upload the site from GitHub to GoDaddy (protocol, credentials, approval, backup and rollback) | Coordinator | CMP-091 | `cmp-014-sdd-starter-kit-homologation-rqviz9` | done |
| CMP-093 | Site-upload workflow (ADR-010) | Agent 1 | CMP-092 | `CMP-093-site-upload-workflow` | todo |
| CMP-094 | New event tabs get the status dropdown, the check-result colors and the needs-review highlight | Agent 1 | — | `CMP-094-event-tab-format` | todo |
| CMP-071 | Dependency checks: `npm audit` on pull requests, Dependabot version updates, an SBOM | Agent 2 | — | `CMP-071-dependency-checks` | todo |
| CMP-095 | PTES test preparation: the request pack for testers and the staging setup for the test | Agent 2 | — | `CMP-095-ptes-preparation` | todo |
| CMP-100 | Contract v1.9: the payment re-check's working hours and the time triggers' failure threshold (`RETRY_CHECK_HOURS`, `TRIGGER_FAIL_ALERT_AFTER`) | Coordinator | — | coordinator branch | done |
| CMP-101 | The payment re-check works only in working hours; the time triggers report a failure only after 10 failed runs in a row (contract v1.9) | Agent 1 | CMP-100 | `CMP-101-trigger-hours-and-failures` | todo |
| CMP-102 | Site performance: no layout jump, the main photo first, resized modern images, browser caching, early connections, text contrast | Agent 3 | — | `CMP-102-site-performance` | todo |
| CMP-103 | Release v1.1.1 | Agent 3 + owner | CMP-102, CMP-094, CMP-101, CMP-071; CMP-093 if used | `CMP-103-release-v1-1-1` | todo |
| CMP-098 | Pre-release security agent, steps 1–3, for v1.1.1 (before the go-ahead; step 2's second review before CMP-103) | Pre-release security agent | — | `CMP-098-release-security` (docs PR, if its documents change) | todo |
| CMP-104 | Pre-release security agent: passive production scan right after v1.1.1, then re-checks of any fixes | Pre-release security agent | CMP-103's live checks; the owner's signed approval for the run | — (findings to the coordinator) | todo |
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
  only by hand (`workflow_dispatch`: a tag, dry run, and `build` or `rollback` mode), never on a
  push or a merge:
  - it waits for the owner's approval (the `site-production` environment) before anything runs
    with production values, so a dry run needs the approval click too;
  - in `build` mode it builds the tag with the production URL from the environment secret,
    checks that the bundle points at production, not staging, printing only masked values,
    uploads, and keeps the `dist` zip on that tag's GitHub Release;
  - in `rollback` mode it re-uploads a tag's kept zip, without building;
  - a dry run lists what would change and uploads nothing.
  - Evidence: one dry run; the first real run is release v1.1.1 (CMP-103), or, if v1.1.1 goes
    by hand, one approved run of the v1.1.1 tag after it (the same files). Then
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
    feature is tested). Like CMP-094, it reaches production with release v1.1.1 (CMP-103), after
    its staging check.
- **CMP-102:** measured with Lighthouse on a local production build (`npm run build` and
  `npm run preview`) before and after each change, desktop and mobile presets, results in the PR;
  the owner's PageSpeed run on the live site after CMP-103 is the final check.
  - Cumulative Layout Shift under 0.1 on desktop and mobile: the events ticker and section keep
    their space while the events load (today 0.60 on desktop, from the events arriving after the
    page), and when no event is listed the space closes without a jump users see (FFR-004).
  - The main photo (the LCP element) loads first: preloaded or `fetchpriority="high"`, never
    lazy; images below the fold load lazily.
  - Images resized to the sizes they are shown at (with `srcset` where the size changes by width)
    and served as WebP with a JPEG/PNG fallback; Cami's logo included; no visible quality loss,
    checked at 1280/900/375 px.
  - Long browser caching in `public/.htaccess` for the hashed `assets/` files and the images
    (for example one year, `immutable` for hashed files), and no caching of `index.html`; the
    CMP-079 security headers unchanged.
  - `preconnect` to the font hosts and the events backend host.
  - Text contrast passes WCAG AA (4.5:1) for the labels Lighthouse lists (the menu, the event
    cards, a section heading), with the colors approved in UX_UI_DIRECTION (a new color goes to
    the owner first).
  - Lighthouse on the local build: Performance 90+ desktop and mobile, Accessibility 100 or every
    remaining item explained, Best practices and SEO stay 100.
  - No new library (NFR-004) unless TECH_STACK and an ADR say so; the image conversion is a
    one-time step whose files are committed.
- **CMP-103:** `package.json` 1.1.1, the release checklist walked with the owner, the production
  backend deployed through the approved workflow first (CMP-094, CMP-101; the owner adds the two
  v1.9 script properties to production before), then the site. Live checks: the release
  checklist's, the cookie gate, and PageSpeed 90+ desktop and mobile by the owner. Tag and
  GitHub Release. Followed by the post-release security step (release-checklist §6b): the
  agent's production scan (CMP-104); the human PTES test stays due by 2026-12-26 (CMP-099).
  Before it is cut: CMP-098's review covers the release commit, and the owner's scan approval is
  signed.
- **CMP-098** (no staging scan for v1.1.1: owner, 2026-10-29, Sprint Review Notes)**:** the pre-release security agent ([`AGENTS.md`](../../AGENTS.md) → Pre-release
  security agent), in its own session, running the kit's `/release-security`: 1. the security
  baseline updated (most of it done in CMP-097: §5.1, every host passive baseline only); 2. a
  security code review of the changes since CMP-063's review, before the go-ahead, and of the
  changes merged in this sprint (CMP-094, CMP-101, CMP-102, CMP-071, CMP-093), before CMP-103 is
  cut; 3. the pen-test plan kept current (the PTES test by 2026-12-26). Findings go to the
  coordinator only (public repository); it never changes code. In step 1 it also points the
  baseline §5 and the pen-test plan at the release checklist §6b. Its documents are Agent 2's
  files: the agent sends the text to Agent 2, or writes them in its own docs PR with the owner's
  OK, so no two sessions edit them at once.
- **CMP-104:** right after CMP-103's live checks pass, inside the window of the owner's signed
  approval: a passive, rate-limited baseline scan (for example OWASP ZAP baseline, at most 1
  request per second) of the live site and the production web app, never active (baseline
  §5.1); the owner can stop it; findings to the coordinator; the scan date in the v1.1.1 GitHub
  Release (release-checklist §6b).
- **CMP-096:** `docs/sprints/SPRINT_04_VERIFICATION.md` with the evidence of every ticket and
  the staging cleanup list.

## Parallel Workstreams
### Agent 1 — Events backend and deploys (fresh session)
- CMP-094 and CMP-101 at the go-ahead; CMP-093 once CMP-092 is merged; CMP-096 last.

### Agent 3 — Site performance and release (fresh session)
- CMP-102 at the go-ahead; CMP-103 last, after CMP-102, CMP-094, CMP-101 and CMP-071 are
  merged (and CMP-093, if the release uses it).

### Agent 2 — Security (fresh session)
- CMP-071 and CMP-095 at the go-ahead.
- Never runs a penetration test or attack tools, and never scans production.

### Pre-release security agent (own session, started before the go-ahead)
- CMP-098 steps 1–3 now; step 2's second review before CMP-103; CMP-104 right after v1.1.1; the
  re-checks of any fixes. Its session stays until its re-checks are done.

Maximum implementation agents in parallel: 3 (the pre-release security agent is not one of
them).

## Foundation (before parallel work)
- CMP-092 (coordinator): ADR-010, merged before CMP-093.

## File Ownership Map
Agents edit only files they own; changes elsewhere are requested from the owner of the file.

| Path | Owner |
|---|---|
| `apps-script/**`, `.github/clasp/**` (except Dependabot's own pull requests), `.github/scripts/**` except `check_doc_links.py`, `.github/workflows/deploy-apps-script.yml`, `.github/workflows/apps-script-check.yml`, `.github/workflows/deploy-site.yml` (new), [`docs/process/events-backend-runbook.md`](../process/events-backend-runbook.md), `docs/sprints/SPRINT_04_VERIFICATION.md`, `docs/sprints/evidence/sprint-04/**` | Agent 1 |
| `docs/security/**`, `.github/dependabot.yml` (new), `.github/workflows/dependency-audit.yml` (new) | Agent 2 |
| `src/**`, `public/**` (including `public/.htaccess`), `index.html`, `package.json` and `package-lock.json`, `CONTRIBUTING.md`, [`README.md`](../../README.md) | Agent 3 |
| [`TICKETS.md`](../../TICKETS.md) | Shared: each agent updates only its own rows; the coordinator adds rows |
| `.github/workflows/docs-link-check.yml`, `.github/scripts/check_doc_links.py`, `docs/specs/**`, [`docs/process/release-checklist.md`](../process/release-checklist.md) and the other process docs, `docs/sprints/SPRINT_04_*.md` except the verification, [`AGENTS.md`](../../AGENTS.md), [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md), [`TECH_STACK.md`](../../TECH_STACK.md), `docs/decisions/**`, `docs/ux/**` | Coordinator (docs PRs) |

CMP-071 does not edit lockfiles or manifests: a fix in `.github/clasp` is Agent 1's (Agent 2
asks through the coordinator); a fix in the site's `package.json`/`package-lock.json` is Agent
3's, or a Dependabot pull request the owner merges after review.

CMP-093 needs release-checklist §4 and §7 changed: Agent 1 sends the text to the coordinator,
who changes it in a docs PR merged with or right after CMP-093.

## Integration Contracts
- [`EVENTS_API_CONTRACT.md`](../specs/EVENTS_API_CONTRACT.md) v1.9, locked: CMP-100 adds the
  two trigger settings to §9 and their test to §10, merged before CMP-101.

## Merge / Integration Order
Each line names what the PR waits for.

0. CMP-098 steps 1–3 (pre-release security agent) — nothing; before the go-ahead.
1. CMP-091 (this plan) — nothing.
2. CMP-092 (ADR-010) — CMP-091.
3. CMP-094, CMP-071, CMP-095 — nothing beyond the go-ahead; CMP-101 — CMP-100 (merged).
4. CMP-093 (site upload) — CMP-092. CMP-102 (site performance) — nothing beyond the go-ahead.
5. CMP-103 (release v1.1.1) — CMP-102, CMP-094, CMP-101, CMP-071, and CMP-093 if the release
   uses it; CMP-098 (its review reaches the release commit) and the owner's scan approval.
   CMP-104 (production scan) — CMP-103's live checks.
6. CMP-096 (verification) — every PR above, except one the owner moved to the next sprint;
   CMP-103's live evidence follows it, as in Sprint 03.

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
- Owner, 2026-10-29: "we have to add something REALLY important to sprint 04. … this is alarming,
  76 performance in desktop? 1/2 agentic searches? we need to take care of this" (PageSpeed for
  `camihernandez.com`, desktop). The coordinator's Lighthouse run that day on the live site:
  Performance 52 desktop and 85 mobile; Accessibility 96, Best practices 100, SEO 100 on both.
  Desktop's main cause is a layout shift of 0.60 when the events arrive after the page; then
  oversized JPEG/PNG images (about 0.5 MB), no browser caching, a late main photo, late
  connections to the font and backend hosts, and a few low-contrast labels. Questions as asked:
  - "Add a site-performance ticket to Sprint 04? …" Owner: **"Yes, release v1.1.1
    (Recommended)"**.
  - "Under the new kit rules, does v1.1.1 (a performance-only release, plus the event-tab and
    trigger changes) start the security agent's run and the PTES test right after it?" Owner:
    **"No, keep the deadline (Recommended)"**.
  So CMP-102 and CMP-103 join (Agent 3), the release is v1.1.1, CMP-094 and CMP-101 reach
  production with it, and the 2026-10-28 answer that Sprint 04 is not a production release is
  superseded. The agentic-browsing item the owner saw is pending their details.
- Owner decision, 2026-10-29, after the review of PR #93 found that the "keep the deadline" route
  covers only the human test under the kit rules adopted in CMP-097. Question as asked: "The
  reviewer is right about the kit rules we adopted yesterday. Before each production release (so
  before v1.1.1), the security agent must review the code. Right after the release, it runs a
  gentle passive scan of the live site, with your written OK for that scan. Only the outside
  tester's PTES test may wait for the 26 Dec deadline. How should we handle v1.1.1?" Owner:
  **"Follow the kit (Recommended)"**. CMP-098 (steps 1–3, before the go-ahead) and CMP-104 (the
  passive production scan right after v1.1.1) join Sprint 04; the PTES test stays due by
  2026-12-26 (CMP-099); the release checklist gets the post-release security step (§6b).
- Live measurements of the site are the owner's PageSpeed runs from now on. The coordinator's
  one Lighthouse run on the live site (2026-10-29, above) was a single page load to read the
  owner's report, not a scan; agents measure local builds only.
- Owner decision, 2026-10-29, on the staging scan before v1.1.1 (the baseline §5.1 says the
  staging backend can be scanned, passive baseline only). Question as asked: "Before v1.1.1,
  should the security agent also run a gentle passive scan of the STAGING backend? …" Owner:
  **"Skip staging for v1.1.1"**, with the reason given in the question: no staging site, and
  v1.1.1's backend changes are small (CMP-094, CMP-101). Only the production scan right after
  the release runs (CMP-104); PENTEST_PLAN §1.1 run 1 is not used for v1.1.1.
- Owner, 2026-10-29: "merged 94, go ahead with Sprint 04" (Entry Gate 4). Before it, the
  pre-release security agent (session `session_01DVcaZw7gF9nG9af7Am5D6U`, own session, started
  2026-10-29) did CMP-098 steps 1–3 in PR #94. Owner decision for that PR, question as asked: "The
  security agent will update two security documents (the baseline and the pen-test plan), which
  normally belong to the security implementation agent. That agent doesn't start until your
  Sprint 04 go-ahead. May the security agent write them in its own docs PR now?" Owner: **"Yes,
  its own docs PR (Recommended)"**.
- Sessions at the go-ahead (2026-10-29). Archived by the coordinator (AGENTS.md → Coordinator
  session), the Sprint 03 sessions: review-only agent `session_018VMrV4fuHbq5b2CzSFR4xW`, Agent 1
  `session_012BaqhPUZdKuTrG7MkkurQW`, Agent 2 `session_01Nsk2BjjvxoFJjyDLAqJYjY`, Agent 3
  `session_01Pr8Ladhxoja6rX7qyF3ecu`. Launched for Sprint 04: review-only agent
  `session_01DVcaZyq7AycK36TTJwaZjT`, Agent 1 `session_01DVcaZvnBj2T3yLKjGx6HP6`, Agent 2
  `session_01DVcaa1B5ypo6v1jPbeL1SX`, Agent 3 `session_01DVcaZzEni9vpxJadMkvcD9`; the
  pre-release security agent stays until its re-checks are done.
- ADR-010 (CMP-092), owner's answers of 2026-10-29: "FTPS, restricted account (Recommended)";
  "Keep each release's build (Recommended)" (questions as asked in the ADR).
- The "Agentic Browsing" section of the owner's PageSpeed run (1/2) fails on the same layout shift
  (CLS 0.596); CMP-102's fix must bring it to 2/2 (told to Agent 3 at launch).
- Owner decisions, 2026-10-29, questions as asked:
  - PTES (CMP-095): "PTES test (due by 26 Dec): will the project pay a tester? …" Owner: **"Free
    options first"** ("Try a university program, a volunteer or community tester, or a friend
    who's a certified tester first; decide on paying only if none is found by mid-November").
    The coordinator checks back on 2026-11-13. "The request pack is in English. Do you want a
    Spanish copy for local testers in Costa Rica?" Owner: **"Yes, add Spanish (Recommended)"**.
  - Site performance (CMP-102, PR #100): the dusty-rose text → **"New darker rose
    (Recommended)"** (`C.roseText` `#965965`; the shade's approval by the owner and Cami on
    PR #100's preview is pending); no events → **"Find a no-jump way (Recommended)"**; the registration form labels →
    **"Yes, same PR (Recommended)"**.
  - Dependabot titles: "Dependabot … opens PRs with its own titles … Allow that exception in our
    PR rules?" Owner: **"Yes, allow it (Recommended)"** (pr-workflow §2).
- The deploy login (`CLASP_CREDENTIALS`) expired again: staging deploys #19 (2026-10-28) and #20
  (2026-10-29, CMP-094) stopped at the login check, nothing pushed; the owner renewed it in both
  environments and re-ran #20 (owner, 2026-10-29: "login renewed, deploy re-run"). The coordinator
  asked the owner to check the Workspace "Google Cloud session control" setting (runbook §5.1).
- Staging scan for v1.1.1: skipped (above); the docs/security pointers to release-checklist §6b
  were done by the pre-release security agent in PR #94.
