# SPRINT_PLAN — Sprint 03

## Metadata
- Sprint: 03
- Status: Planned (the plan is approved on merge of the PR that adds it; the sprint starts at the
  owner's go-ahead, Entry Gate 4)
- Start: 2026-10-28 (Wednesday), or the first business day after the go-ahead if it comes later
- End: 2026-11-05 (Thursday); if the start moves, the 7th business day counted from the actual
  start
- Duration: 7 business days
- Saturdays and Sundays excluded
- Final human reviewer: Raul Casanas
- Plan from the kit's `SPRINT_PLAN_TEMPLATE.md` at the kit ref in
  [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md); agent prompts in
  [`SPRINT_03_AGENT_PROMPTS.md`](SPRINT_03_AGENT_PROMPTS.md)

## Entry Gates
Run [`SPRINT_READINESS_CHECKLIST.md`](../checklists/SPRINT_READINESS_CHECKLIST.md) first
(detail below).

| # | Gate | Status |
|---|---|---|
| 1 | [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md) paths resolve | Pass: docs link check on this PR's head, 0 broken. The three planned documents (security baseline, pen-test plan, developer guide) are not written yet and are stories of this sprint (CMP-056, CMP-062, CMP-057), as the CMP-057 row says |
| 2 | Readiness checklist has no open blocking items | Pass, except item 8 (the go-ahead), which is gate 4 |
| 3 | Integration contracts locked | Pass: [`EVENTS_API_CONTRACT.md`](../specs/EVENTS_API_CONTRACT.md) v1.5, locked. CMP-061 changes §9 (alert recipients) in a docs PR that merges before CMP-052 (Foundation) |
| 4 | Final go-ahead from the human owner | Pending |

### Readiness checklist result (2026-10-26)
| Item | Result |
|---|---|
| 1. Paths in `PROJECT_CONTEXT.md` exist **(blocking)** | Pass; the three planned documents are covered by this sprint's stories, not missing (gate 1) |
| 1. `AGENTS.md`/`CLAUDE.md` match the kit, differences documented **(blocking)** | Pass: synced to kit v1.2.0 in CMP-055 (PR #51); kept rules in [ADR-006 → Kit disposition](../decisions/ADR-006-adopt-sdd-starter-kit.md#kit-disposition) |
| 1. `PROJECT_CONTEXT.md` URL, status, active sprint | Pass (updated in this PR) |
| 1. `README.md` status matches | Pass (live site; events not released) |
| 1. Project key and planned branch names **(blocking)** | Pass: CMP; branches in Selected tickets |
| 2. Docs agree on scope, names, behavior **(blocking)** | Pass: FEATURE_SPEC v1.10, contract v1.5, EVENTS_EMAILS_AND_PRIVACY (approved by Cami) |
| 2. Field naming convention | Pass: contract §3, §6 (camelCase fields and columns) |
| 2. Languages / locales | Pass: EN/ES, global toggle (ADR-004) |
| 2. Every FR maps to a story | Pass (unchanged since Sprint 02) |
| 3. Testable acceptance criteria **(blocking)** | Pass: each ticket below lists its checks; no new user stories this sprint |
| 3. Every story has an owner | Pass |
| 4. Locked contracts for shared interfaces **(blocking)** | Pass (gate 3) |
| 4. Integration failure behavior | Pass: FFR-004, FFR-033, FFR-032 |
| 4. Credentials rule | Pass: contract §9, TECH_STACK §11, ADR-009 |
| 5. Personal data: jurisdiction, consent, notice **(blocking)** | Pass: Costa Rica Law 8968; notice and consent approved by Cami as the legal review (owner decision, FEATURE_SPEC §20); optional contact consent (contract v1.5) |
| 5. Abuse/spam protection | Pass: in place (FFR-029); captcha rule tracked |
| 5. Security baseline approved | Not blocking this sprint: the project already wrote code when it adopted the baseline (CMP-055), so it is a story here (CMP-056) and this item blocks from Sprint 04 |
| 5. Stories touching an OWASP risk have verifying ACs **(blocking)** | Pass: CMP-052 and CMP-053 carry their security checks below; CMP-056 adds the Top 10 ACs to the events stories for Sprint 04 |
| 5. Secret and dependency scanning | Planned in this sprint (CMP-056 §6; CMP-050 for the deploy tool) |
| 5. Pen test before a production release | Not a release sprint: no production release in Sprint 03. The PTES test, its retest and the go-live are Sprint 04 (owner decision below); this sprint writes the plan and scope (CMP-062) |
| 5.1 Visual identity status | Pass: UX_UI_DIRECTION (approved palette, tokens) |
| 5.1 Tokens, not literals | Pass |
| 5.1 Brand assets **(go-live only)** | Not a go-live sprint. The Lifetools logo is still a release gate (Cami) |
| 6. Hosting runtime confirmed | Pass: ADR-002 (GoDaddy static), ADR-008 (Apps Script) |
| 6. Local development defined | Pass: [`README.md`](../../README.md) |
| 6. Formatter and linter named and run in CI | Not set up; not blocking; left for a later sprint |
| 6. Developer guide **(first sprint that runs code)** | Story in this sprint (CMP-057), so it exists by the sprint's end |
| 6. Test, lint and CI checks named; required on `main` | Pass: `apps-script-check` and `docs-link-check` run on every PR |
| 6. Branching ADR and deployment runbook **(deploying sprint)** | Pass: [ADR-007](../decisions/ADR-007-branching-and-release-model.md), [`events-backend-runbook.md`](../process/events-backend-runbook.md), ADR-009 |
| 6. Release runbook **(go-live only)** | Exists: [`release-checklist.md`](../process/release-checklist.md) |
| 6. Previews and tests use their own data | Pass: the staging spreadsheet, folder and project; production gets only the marked smoke submissions of CMP-064 |
| 6. Real-delivery email test | Done in Sprint 02 (Gmail and Outlook); CMP-052 repeats it for the alert email |
| 7. Workstreams assigned, ≤ 3 agents **(blocking)** | Pass: Agents 1, 2 and 3 below |
| 7. Ownership map **(blocking)** | Pass |
| 7. Foundation sequenced | Pass: CMP-061 (coordinator) before CMP-052 |
| 7. Merge order and integration owner | Pass: Agent 3 (CMP-066) |
| 7. No dependency cycle **(blocking)** | Pass (checked: Merge / Integration Order) |
| 7. Conflict-resolution rule | Pass |
| 7.1 Prompts: no merge or approve **(blocking)** | Pass ([`SPRINT_03_AGENT_PROMPTS.md`](SPRINT_03_AGENT_PROMPTS.md)) |
| 7.1 Reviewer independence in its own session **(blocking)** | Pass |
| 7.1 Attribution line in every prompt **(blocking)** | Pass |
| 7.1 Review flow in every prompt | Pass |
| 7.1 `main` protected | Required by ADR-009 (a merge deploys staging; runbook §5.1 setup); owner to confirm in GitHub settings (not blocking) |
| 7.1 `release/*` branches | N/A (ADR-007) |
| 7.1 Coordinator follows AGENTS.md | Pass |
| 8. Go-ahead **(blocking)** | Pending (gate 4) |

## Sprint Goal
- Make the events feature release-ready, everything except the penetration test: security
  baseline and pen-test plan approved and a tester booked, the production backend deployed and
  smoke-tested (not yet linked from the live site), the real-iPhone check done, and the
  backlog fixes Sprint 02 left on staging.

## Required Deliverable
- A demo on staging and production-backend smoke results, with evidence in
  `docs/sprints/SPRINT_03_VERIFICATION.md` (CMP-066):
  - the approved security baseline and pen-test plan, and the tester's signed authorization or
    the booking date;
  - the production Apps Script project deployed through the approved workflow run, smoke PASS;
  - the real-iPhone check result and the test site taken down;
  - the alert email reaching both addresses, exact counters under a burst, the favicon, the
    developer guide.
- No production release of the site in this sprint: the go-live is Sprint 04, after the PTES
  test and its retest (owner decision, Sprint Review Notes).

## Selected tickets
No new user stories: Sprint 03 is release work and backlog fixes on US-017..US-025.

| Ticket | Work | Agent | Waits for | Branch | Status |
|---|---|---|---|---|---|
| CMP-060 | This plan, the agent prompts, the Sprint 02 close and the pending decision records | Coordinator | — | `cmp-014-sdd-starter-kit-homologation-rqviz9` (assigned session branch) | review |
| CMP-061 | Contract v1.6 and FFR-029: alert recipients (`ALERT_TO`) | Coordinator | CMP-060 | coordinator branch | todo |
| CMP-056 | Security baseline (`docs/security/SECURITY_BASELINE.md`) | Agent 2 | — | `CMP-056-security-baseline` | todo |
| CMP-062 | Pen-test plan and written scope (`docs/security/PENTEST_PLAN.md`) | Agent 2 | CMP-056 | `CMP-062-pentest-plan` | todo |
| CMP-063 | Pre-test security review: ASVS code review and an owner-authorized, staging-only scan; findings become tickets | Agent 2 | CMP-056 | `CMP-063-pretest-security-review` | todo |
| CMP-052 | Alert email to more than one address | Agent 1 | CMP-061 | `CMP-052-alert-recipients` | todo |
| CMP-053 | Exact daily counters and per-minute limiters under parallel requests | Agent 1 | — | `CMP-053-exact-counters` | todo |
| CMP-050 | Deploy tool dependencies: `npm audit` in `.github/clasp`, bump `clasp` if a fixed release exists | Agent 1 | — | `CMP-050-clasp-audit` | todo |
| CMP-064 | Production backend setup and first approved deploy | Agent 1 + owner | CMP-052, CMP-053 | `CMP-064-production-backend` | todo |
| CMP-057 | Developer guide (`CONTRIBUTING.md`) | Agent 3 | — | `CMP-057-developer-guide` | todo |
| CMP-054 | Missing `/favicon.svg` | Agent 3 | — | `CMP-054-favicon` | todo |
| CMP-065 | Real-iPhone check on staging, then the test-site takedown | Agent 3 + owner | CMP-052, CMP-053 on staging | `CMP-065-real-iphone-check` | todo |
| CMP-066 | Sprint 03 verification and the staging cleanup list | Agent 3 | every PR above | `CMP-066-sprint-03-verification` | todo |

### Ticket checks (acceptance criteria)
- **CMP-061 (coordinator):** contract §9 gets an `ALERT_TO` script property (comma-separated
  addresses, defaulting to `MAIL_REPLY_TO` when empty); FFR-029 and EVENTS_EMAILS_AND_PRIVACY
  §2b say the alert goes to every address in it; contract v1.6.
- **CMP-052:** the daily alert email goes to every address in `ALERT_TO` (the owner and
  camila@), still at most once a day; with `ALERT_TO` empty it goes to `MAIL_REPLY_TO` as
  today. Security: the addresses come only from script properties, never from a request, the
  repo or the logs; an invalid address is skipped and logged without the address. Verified on
  staging with a Gmail and an Outlook address.
- **CMP-053:** a burst of parallel requests records exactly as many `throttled`,
  `honeypotHits` and `couponFailures` as answers given, and the per-minute limits hold exactly;
  no request fails because of the counters (FFR-029, CMP-033 observation 7). Evidence: the
  Sprint 02 burst repeated on staging with the counts compared, run with the owner's alert
  settings as in Sprint 02.
- **CMP-050:** `npm audit` in `.github/clasp` reported; if a `clasp` release fixes the 3 high
  warnings, the pin is bumped and the staging deploy stays green; otherwise the row records why
  it waits.
- **CMP-056:** the baseline from the kit's `SECURITY_BASELINE_TEMPLATE.md`: classification
  (personal data and payment receipts); OWASP ASVS 5.0.0 level and the full inventory for that
  level, each requirement covered (AC, test or configuration check) or not applicable with a
  reason; the OWASP Top 10 (2025) and API Security Top 10 (2023) risks that apply, written as
  acceptance criteria for the events stories (added to USER_STORIES → Security through a
  coordinator docs PR); the NIST SSDF mapping; secret scanning and dependency scanning (set up,
  or a dated story); the PTES requirement before the events release (owner decision); OSSTMM
  only if the classification is high-risk. Approved by the owner on merge.
- **CMP-062:** `PENTEST_PLAN.md` from the kit's template: scope (staging and/or production
  backend, the site, the form, Drive and the sheet as read by the backend), out of scope,
  rules of engagement within GoDaddy's and Google's terms, timing, the written authorization
  form for the tester, the report format and the retest of critical and high findings. The
  owner finds and books the tester (Sprint Review Notes).
- **CMP-063:** an ASVS-based code review of `apps-script/` and the form, and a scan of
  **staging only**, run only after the owner authorizes it in writing in the PR (scope, tool,
  time window), never against production; findings with a severity in
  `docs/security/PRETEST_REVIEW.md`, each proposed as a ticket. No
  attack on production; this is not the penetration test.
- **CMP-064:** following runbook §2, §3 and §5.1 with the owner:
  - the production project `cami-events-production`, first upload, web-app deployment;
  - production script properties with the real SINPE values;
  - the `production` environment secrets;
  - the first deploy through the workflow with the owner's approval click, smoke PASS;
  - both time triggers installed;
  - the production build's `VITE_EVENTS_API_URL` prepared for Sprint 04, not uploaded.
  - The runbook gets the token-expiry note: the staging login expired after 4 days on
    2026-10-26 and was renewed; if it recurs, check the Workspace "Google Cloud session control"
    setting.
- **CMP-057:** `CONTRIBUTING.md` from the kit's `DEVELOPER_GUIDE_TEMPLATE.md`: setup,
  commands (`npm run dev`, `npm run build`, the Apps Script check and deploy workflows),
  structure, conventions; `README.md` links to it.
- **CMP-054:** the `/favicon.svg` link in `index.html` resolves (an icon from the existing brand
  assets), or the link is removed if no icon is approved; no 404 on page load.
- **CMP-065:** with an iPhone (owner), through the manual Pages test site (TECH_STACK §10; test
  SINPE values during the window), register with a Camera photo, the same photo from Files,
  and a screenshot, each with a different test email; record what is stored (`.jpg` or
  `.heic` with the note) and the check result; then unpublish the site, restore the real SINPE
  values on staging and delete the `STAGING_EVENTS_API_URL` secret. The owner then decides the
  HEIC follow-up (CMP-033 observation 6).
- **CMP-066:** `docs/sprints/SPRINT_03_VERIFICATION.md` with the evidence of every ticket; the
  staging cleanup list (test rows, files, coupons, Pages secret) for the owner.

## Parallel Workstreams
### Agent 1 — Events backend (fresh session)
- CMP-053 and CMP-050 at the go-ahead; CMP-052 once CMP-061 is merged; CMP-064 once CMP-052
  and CMP-053 are merged (production gets the final code).

### Agent 2 — Security (fresh session)
- CMP-056 at the go-ahead; then CMP-062 and CMP-063 (both need the baseline merged).
- Never runs a penetration test or attack tools, and never scans production.

### Agent 3 — Site, iPhone check and integration (fresh session)
- CMP-057 and CMP-054 at the go-ahead; CMP-065 when the owner has the iPhone and CMP-052 and
  CMP-053 are on staging; CMP-066 last.

Maximum implementation agents in parallel: 3.

## Foundation (before parallel work)
- CMP-061 (coordinator): contract v1.6 for `ALERT_TO`, merged before CMP-052.

## File Ownership Map
Agents edit only files they own; changes elsewhere are requested from the owner of the file.

| Path | Owner |
|---|---|
| `apps-script/**`, `.github/clasp/**`, `.github/scripts/deploy-apps-script.sh` and the other deploy scripts, `.github/workflows/deploy-apps-script.yml`, `.github/workflows/apps-script-check.yml`, [`docs/process/events-backend-runbook.md`](../process/events-backend-runbook.md) | Agent 1 |
| `docs/security/**` | Agent 2 |
| `src/**`, `public/**`, `index.html`, `CONTRIBUTING.md`, [`README.md`](../../README.md), `.github/workflows/pages-staging.yml`, `docs/sprints/SPRINT_03_VERIFICATION.md`, `docs/sprints/evidence/sprint-03/**` | Agent 3 |
| [`TICKETS.md`](../../TICKETS.md) | Shared: each agent updates only its own rows; the coordinator adds rows |
| `docs/specs/**`, [`docs/process/release-checklist.md`](../process/release-checklist.md) and the other process docs, `docs/sprints/SPRINT_03_*.md` except the verification, [`AGENTS.md`](../../AGENTS.md), [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md), `docs/decisions/**`, `docs/ux/**` | Coordinator (docs PRs) |

## Integration Contracts
- [`EVENTS_API_CONTRACT.md`](../specs/EVENTS_API_CONTRACT.md) v1.5, locked; v1.6 (CMP-061)
  changes only §9 (`ALERT_TO`).

## Merge / Integration Order
Each line names what the PR waits for.

1. CMP-060 (this plan) — nothing.
2. CMP-061 (contract v1.6) — CMP-060.
3. CMP-056 (baseline), CMP-053, CMP-050, CMP-057, CMP-054 — nothing beyond the go-ahead.
4. CMP-052 — CMP-061.
5. CMP-062 and CMP-063 — CMP-056.
6. CMP-064 (production) — CMP-052, CMP-053.
7. CMP-065 (iPhone check) — CMP-052, CMP-053 deployed to staging.
8. CMP-066 (verification, integration owner Agent 3) — every PR above.

Cycle check: every arrow points to a PR earlier in this list, so no PR waits, directly or
through others, on a PR that waits on it.

## Conflict Resolution
- Merge conflicts are resolved when found, by the human owner together with the agent that owns
  the conflicting file.
- An agent must not rewrite another agent's files to resolve a conflict.

## Review-only Agent
A fresh review-only session (Opus) reviews each PR when its author asks after a push, or when
the owner or the coordinator asks ([`AGENTS.md`](../../AGENTS.md) → Review flow). Scope:
spec compliance, acceptance criteria, regressions, code quality and readability, security (the
baseline once merged), integration risk. It does not implement anything. Codex reviews every PR
automatically.

## Human Review
The human reviewer is the final approver.

## Verification
- Each PR: `npm run build` (and `node --check` for `apps-script/`), its checks above against
  staging (production only for the CMP-064 smoke), evidence in the PR body.
- CMP-066 collects the evidence in `SPRINT_03_VERIFICATION.md`; the owner checks inbox and sheet
  items as in Sprint 02.

## Risks
- **The penetration tester.** Finding and authorizing a tester (and its cost, against the
  zero-cost rule NFR-003) may take longer than the sprint; the go-live waits for it.
- **The staging login token** expired after 4 days once (2026-10-26). If it recurs, every
  deploy stops until the owner logs in again (CMP-064 note).
- **The iPhone window** depends on the owner having a device during the sprint; while the test
  site is up, anyone can use staging (TECH_STACK §10), so it is published only for the check.
- **Production setup** touches the real SINPE values and the owner's account; Agent 1 prepares
  every step so the owner's part takes minutes, and no value goes in the repo.

## Sprint Definition of Done
- Every selected ticket `done`, or moved to Sprint 04 by the owner.
- The Required Deliverable demonstrated and its evidence approved (merging CMP-066).
- [`TICKETS.md`](../../TICKETS.md), [`USER_STORIES.md`](../specs/USER_STORIES.md) and
  [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md) updated; the Sprint 04 (go-live) plan drafted
  when the tester's date is known.

## Sprint Review Notes
- Owner answers (2026-10-26), questions as asked:
  - "The penetration test (PTES) must be done by a human you authorize in writing, before the
    events go live. Do you already have someone, and is there a budget? This decides whether
    the go-live fits in Sprint 03." — options: find one, release next sprint; I have a tester
    now. Owner: **"Find one; release next sprint (Recommended)"**.
  - "Which backlog tickets go into Sprint 03 besides the release work?" — options: CMP-052
    alerts to you too; CMP-054 favicon; CMP-053 counter fix; CMP-050 clasp audit (several
    allowed). Owner: **"CMP-052 alerts to you too, CMP-054 favicon, CMP-053 counter fix,
    CMP-050 clasp audit"**.
  - "When can you get an iPhone for the real-iPhone check on staging (about 15 minutes, any
    iPhone)?" — options: during Sprint 03; not sure yet. Owner: **"During Sprint 03"**.
  - "Sprint 02 is done (all stories Done). Close it and start Sprint 03 as soon as its plan is
    merged?" — options: yes, close Sprint 02; not yet. Owner: **"Yes, close Sprint 02
    (Recommended)"**.
