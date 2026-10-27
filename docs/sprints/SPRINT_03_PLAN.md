# SPRINT_PLAN — Sprint 03

## Metadata
- Sprint: 03
- Status: Active (plan approved on merge of PR #54; owner's go-ahead 2026-10-27, Entry Gate 4)
- Start: 2026-10-27 (Tuesday), the day of the go-ahead and the launch of the sessions (planned
  2026-10-28)
- End: 2026-11-04 (Wednesday), the 7th business day from the actual start
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
| 4 | Final go-ahead from the human owner | Pass: "go ahead" (owner, 2026-10-27, after merging PR #54). The earlier "go ahead with Sprint 03" (2026-10-26) asked for this plan |

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
| 5. Security baseline approved | Not blocking the start: the project already wrote code when it adopted the baseline (CMP-055), so it is a story here (CMP-056). It blocks the go-live (CMP-068), since it records the penetration-test deadline |
| 5. Stories touching an OWASP risk have verifying ACs **(blocking)** | Pass: CMP-052 and CMP-053 carry their security checks below; CMP-056 adds the Top 10 ACs to the events stories, verified before the go-live by CMP-063 |
| 5. Secret and dependency scanning | Planned in this sprint (CMP-056 §6; CMP-050 for the deploy tool) |
| 5. Pen test before a production release | The events go live in this sprint (CMP-068) before the PTES test: the owner chose a dated deadline instead, 60 days after the go-live, recorded in the security baseline (CMP-056), as AGENTS.md → Security baseline allows for a project already in production. After the deadline the test gates every release. This sprint writes the plan and scope (CMP-062); the test runs in a later sprint (owner decisions below). The checklist's pen-test item (blocking for a go-live sprint, or for a release "while a live project's penetration test is still due") is read with AGENTS.md's deadline rule: the site went live with v1.0.0, so this is a release of a live project, not its go-live, and the test is "still due" only once the recorded deadline has passed. Owner accepted this reading (Sprint Review Notes). If CMP-056 classifies the project as high-risk or complex, the OSSTMM 3 test AGENTS.md requires before a release that adds a major new attack surface is not covered by the 60-day deadline: CMP-068 then waits for that test or for a new owner decision |
| 5.1 Visual identity status | Pass: UX_UI_DIRECTION (approved palette, tokens) |
| 5.1 Tokens, not literals | Pass |
| 5.1 Brand assets **(go-live only)** | Not the project's go-live (live since v1.0.0), but the events release needs the Lifetools logo (release-checklist §3b): Cami sends it during the sprint (owner, below), added in CMP-067 |
| 6. Hosting runtime confirmed | Pass: ADR-002 (GoDaddy static), ADR-008 (Apps Script) |
| 6. Local development defined | Pass: [`README.md`](../../README.md) |
| 6. Formatter and linter named and run in CI | Not set up; not blocking; left for a later sprint |
| 6. Developer guide **(first sprint that runs code)** | Story in this sprint (CMP-057), so it exists by the sprint's end |
| 6. Test, lint and CI checks named; required on `main` | Pass: `apps-script-check` and `docs-link-check` run on every PR |
| 6. Branching ADR and deployment runbook **(deploying sprint)** | Pass: [ADR-007](../decisions/ADR-007-branching-and-release-model.md), [`events-backend-runbook.md`](../process/events-backend-runbook.md), ADR-009 |
| 6. Release runbook **(go-live only)** | Pass: [`release-checklist.md`](../process/release-checklist.md), with the events gates in §3b |
| 6. Previews and tests use their own data | Pass: the staging spreadsheet, folder and project; production gets only the marked smoke submissions of CMP-064 and the owner's one test registration in CMP-068, deleted afterwards |
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
| 8. Go-ahead **(blocking)** | Pass (gate 4) |

## Sprint Goal
- Put the events feature live on `camihernandez.com` so Cami can use it: security baseline
  approved with the penetration-test deadline, pre-test security review done, the production
  backend deployed and smoke-tested, the real-iPhone check done, the Lifetools logo in place,
  the backlog fixes Sprint 02 left, and the release (v1.1.0) with every release-checklist §3b
  gate checked. The PTES test follows by its deadline (owner decision).

## Required Deliverable
- A demo on staging and production-backend smoke results, with evidence in
  `docs/sprints/SPRINT_03_VERIFICATION.md` (CMP-066):
  - the approved security baseline (with the PTES deadline), the pen-test plan and the
    pre-test review, with no open critical or high finding;
  - the production Apps Script project deployed through the approved workflow run, smoke PASS;
  - the real-iPhone check result and the test site taken down;
  - the alert email reaching both addresses, exact counters under a burst, the favicon, the
    Lifetools logo, the developer guide.
- The production release v1.1.0 with the events live (CMP-068): every release-checklist §3b
  gate checked, the live smoke test passed, tag and GitHub Release.
- The PTES test is not in this sprint: it runs by its deadline, 60 days after the go-live
  (owner decision, Sprint Review Notes).

## Selected tickets
No new user stories: Sprint 03 is release work and backlog fixes on US-017..US-025.

| Ticket | Work | Agent | Waits for | Branch | Status |
|---|---|---|---|---|---|
| CMP-060 | This plan, the agent prompts, the Sprint 02 close and the pending decision records | Coordinator | — | `cmp-014-sdd-starter-kit-homologation-rqviz9` (assigned session branch) | done |
| CMP-061 | Contract v1.6 and FFR-029: alert recipients (`ALERT_TO`) | Coordinator | CMP-060 | coordinator branch | done |
| CMP-056 | Security baseline (`docs/security/SECURITY_BASELINE.md`) | Agent 2 | — | `CMP-056-security-baseline` | done |
| CMP-062 | Pen-test plan and written scope (`docs/security/PENTEST_PLAN.md`) | Agent 2 | CMP-056 | `CMP-062-pentest-plan` | done |
| CMP-063 | Pre-test security review: ASVS code review and an owner-authorized, staging-only scan; findings become tickets | Agent 2 | CMP-056 | `CMP-063-pretest-security-review` | todo |
| CMP-052 | Alert email to more than one address | Agent 1 | CMP-061 | `CMP-052-alert-recipients` | review (merged; staging check after merge) |
| CMP-053 | Exact daily counters and per-minute limiters under parallel requests | Agent 1 | — | `CMP-053-exact-counters` | review (merged; staging check after merge) |
| CMP-050 | Deploy tool dependencies: `npm audit` in `.github/clasp`, bump `clasp` if a fixed release exists | Agent 1 | — | `CMP-050-clasp-audit` | review (merged; staging check after merge) |
| CMP-064 | Production backend setup and first approved deploy | Agent 1 + owner | CMP-052, CMP-053 | `CMP-064-production-backend` | todo |
| CMP-057 | Developer guide (`CONTRIBUTING.md`) | Agent 3 | — | `CMP-057-developer-guide` | done |
| CMP-054 | Missing `/favicon.svg` | Agent 3 | — | `CMP-054-favicon` | done |
| CMP-065 | Real-iPhone check on staging, then the test-site takedown | Agent 3 + owner | CMP-052, CMP-053 on staging | `CMP-065-real-iphone-check` | todo |
| CMP-067 | Lifetools logo for events without their own picture | Agent 3 | Cami's logo file | `CMP-067-lifetools-logo` | todo |
| CMP-069 | The PTES deadline date in the security baseline | Agent 2 | CMP-056, the go-live date set by the owner | `CMP-069-ptes-deadline-date` | todo |
| CMP-066 | Sprint 03 verification and the staging cleanup list | Agent 3 | every PR above, or the owner moving it | `CMP-066-sprint-03-verification` | todo |
| CMP-072 | SEC-001: security fix, tracked privately | Agent 3 | CMP-063 finding | `CMP-072-sec-001` | done |
| CMP-079 | HTTPS redirect and security headers on the live site (SAC-13): an `.htaccess` in `public/` | Agent 3 | — | `CMP-079-https-and-headers` | todo |
| CMP-073..CMP-076 | SEC-002..SEC-005: security fixes, tracked privately (one PR each) | Agent 1 | CMP-063 findings | `CMP-07N-sec-00M` | todo |
| CMP-068 | Events go-live: release v1.1.0 | Agent 3 + owner | CMP-066, CMP-069, CMP-072..CMP-076, CMP-079, and every §3b gate | `CMP-068-events-release` | todo |

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
- **CMP-056:** merged before the go-live. The baseline from the kit's `SECURITY_BASELINE_TEMPLATE.md`: classification
  (personal data and payment receipts); OWASP ASVS 5.0.0 level and the full inventory for that
  level, each requirement covered (AC, test or configuration check) or not applicable with a
  reason; the OWASP Top 10 (2025) and API Security Top 10 (2023) risks that apply, written as
  acceptance criteria for the events stories (added to USER_STORIES → Security through a
  coordinator docs PR); the NIST SSDF mapping; secret scanning and dependency scanning (set up,
  or a dated story); the PTES deadline: 60 days after the events go-live, with the date written in once the go-live
  date is known (owner decision); after it, the test gates every release; OSSTMM
  only if the classification is high-risk. Approved by the owner on merge.
- **CMP-062:** `PENTEST_PLAN.md` from the kit's template: scope (staging and/or production
  backend, the site, the form, Drive and the sheet as read by the backend), out of scope,
  rules of engagement within GoDaddy's and Google's terms, timing, the written authorization
  form for the tester, the report format and the retest of critical and high findings. Scope
  covers production, since the test runs after the go-live, within the providers' terms. The
  owner finds and books the tester before the deadline (Sprint Review Notes).
- **CMP-063:** an ASVS-based code review of `apps-script/` and the form, and a scan of
  **staging only**, run only after the owner authorizes it in writing in the PR (scope, tool,
  time window), never against production. The repository is public, so
  `docs/security/PRETEST_REVIEW.md` names an unfixed finding only by a neutral ID and wording
  ("SEC-00N: security fix, tracked privately", no severity until the fix is released, as the
  kit's security templates require); the details go to the coordinator privately and are
  tracked outside the repository with the owner; each finding is proposed as a ticket. No
  attack on production; this is not the penetration test. Every critical or high finding is
  fixed (or the owner accepts it in writing) before the go-live (CMP-068). Staging and production share the
  owner's Google account quotas (MailApp, Drive, OCR, fetch) and a scan's hits trigger the
  alert email, so the scan is low-rate, application-level checks only, within Google's terms,
  never during the CMP-064 deploy and smoke, with the alert settings switched before and
  restored after as in the Sprint 02 burst; the owner's authorization names all of these.
  **Changed (owner, 2026-10-27, Sprint Review Notes):** the staging scan is not run in
  CMP-063; its checks wait for the PTES test (CMP-062). CMP-063 closes on the code review plus
  the owner's checks of SAC-13 (site headers) and SAC-15 (sharing settings).
- **CMP-079:** the owner's SAC-13 check (2026-10-27) found that `http://camihernandez.com` does
  not redirect to HTTPS and that the live site sends none of `Strict-Transport-Security`,
  `Content-Security-Policy`, `X-Content-Type-Options` and `Referrer-Policy`. An `.htaccess`
  in `public/` (copied to `dist/` and uploaded with the site; GoDaddy runs Apache) adds the
  301 redirect to HTTPS and the four headers as SAC-13 describes; the CSP allows only the site,
  Google Fonts, the events backend and its redirect host, and `https:` images, with
  `frame-ancestors`; HSTS is a plain `max-age` of at least one year, without
  `includeSubDomains` or `preload`. Before the upload (`vite preview` does not read
  `.htaccess`): the same headers are applied to a local serve of `dist/` (for example a small
  local server or Apache container, not committed), and the whole page is exercised with the
  browser console showing no CSP violation: the events section and ticker, the registration
  form with a coupon check and a submission against staging, both languages, at 1280/900/375
  px. Right after the CMP-068 upload: the redirect, the four headers and a clean console on the
  live site; a server error or a broken page means restoring the backup.
- **CMP-064:** following runbook §2, §3 and §5.1 with the owner:
  - the production project `cami-events-production`, first upload, web-app deployment;
  - production script properties with the real SINPE values;
  - the `production` environment secrets;
  - the first deploy through the workflow with the owner's approval click, smoke PASS;
  - both time triggers installed;
  - the production build's `VITE_EVENTS_API_URL` value handed to the owner privately for
    CMP-068 (never committed).
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
- **CMP-067:** Cami's Lifetools logo (from the owner, not from the web) in `public/images/`
  replaces the marked placeholder for events without their own picture; checked at
  1280/900/375 px in EN and ES.
- **CMP-069:** once the owner sets the go-live date (the first step of CMP-068), the baseline
  states the PTES deadline as a date (the go-live date plus 60 days); merged before the upload.
- **CMP-066:** `docs/sprints/SPRINT_03_VERIFICATION.md` with the evidence of every ticket; the
  staging cleanup list (test rows, files, coupons, Pages secret) for the owner. A ticket the
  owner moved to the next sprint (for example CMP-065 or CMP-067, if the iPhone or the logo
  does not come) is recorded as moved, and CMP-066 merges without it.
- **CMP-068 first step:** the owner sets the go-live date, and the coordinator asks Agent 2 for
  CMP-069.
- **CMP-068:** the PR sets `package.json` to `1.1.0` and walks the owner through
  [`release-checklist.md`](../process/release-checklist.md): every §3b gate checked (each with
  its ticket), the build with the production `VITE_EVENTS_API_URL` (the owner's local setting,
  never committed), the upload with a backup of the current site, then on the live site one
  real registration by the owner on a test event (hidden afterwards, row and file deleted), the
  events section and ticker in EN and ES, then the tag and GitHub Release. Rollback: restore
  the backup. Before the upload, the owner writes in the PR a dated statement that no critical
  or high security finding is open (no details), after checking the private notes with the
  coordinator (release-checklist §3b, owner 2026-10-27).

## Parallel Workstreams
### Agent 1 — Events backend (fresh session)
- CMP-053 and CMP-050 at the go-ahead; CMP-052 once CMP-061 is merged; CMP-064 once CMP-052
  and CMP-053 are merged (production gets the final code).

### Agent 2 — Security (fresh session)
- CMP-056 at the go-ahead; then CMP-062 and CMP-063 (both need the baseline merged); CMP-069
  when the owner sets the go-live date.
- Never runs a penetration test or attack tools, and never scans production.

### Agent 3 — Site, iPhone check and integration (fresh session)
- CMP-057 and CMP-054 at the go-ahead; CMP-067 when Cami's logo arrives; CMP-065 when the
  owner has the iPhone and CMP-052 and CMP-053 are on staging; CMP-066, then CMP-068 last.

Maximum implementation agents in parallel: 3.

## Foundation (before parallel work)
- CMP-061 (coordinator): contract v1.6 for `ALERT_TO`, merged before CMP-052.

## File Ownership Map
Agents edit only files they own; changes elsewhere are requested from the owner of the file.

| Path | Owner |
|---|---|
| `apps-script/**`, `.github/clasp/**`, `.github/scripts/deploy-apps-script.sh` and the other deploy scripts, `.github/workflows/deploy-apps-script.yml`, `.github/workflows/apps-script-check.yml`, [`docs/process/events-backend-runbook.md`](../process/events-backend-runbook.md) | Agent 1 |
| `docs/security/**` | Agent 2 |
| `src/**`, `public/**`, `index.html`, `package.json` and `package-lock.json`, `CONTRIBUTING.md`, [`README.md`](../../README.md), `.github/workflows/pages-staging.yml`, `docs/sprints/SPRINT_03_VERIFICATION.md`, `docs/sprints/evidence/sprint-03/**` | Agent 3 |
| [`TICKETS.md`](../../TICKETS.md) | Shared: each agent updates only its own rows; the coordinator adds rows |
| `.github/workflows/docs-link-check.yml`, `.github/scripts/check_doc_links.py`, `docs/specs/**`, [`docs/process/release-checklist.md`](../process/release-checklist.md) and the other process docs, `docs/sprints/SPRINT_03_*.md` except the verification, [`AGENTS.md`](../../AGENTS.md), [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md), `docs/decisions/**`, `docs/ux/**` | Coordinator (docs PRs) |

## Integration Contracts
- [`EVENTS_API_CONTRACT.md`](../specs/EVENTS_API_CONTRACT.md) v1.5, locked; v1.6 (CMP-061)
  changes only §9 (`ALERT_TO`) and adds its §10 test; v1.7 (CMP-070) adds the all-invalid
  `ALERT_TO` fallback to §9.

## Merge / Integration Order
Each line names what the PR waits for.

1. CMP-060 (this plan) — nothing.
2. CMP-061 (contract v1.6) — CMP-060.
3. CMP-056 (baseline), CMP-053, CMP-050, CMP-057, CMP-054 — nothing beyond the go-ahead.
4. CMP-052 — CMP-061.
5. CMP-062 and CMP-063 — CMP-056.
6. CMP-064 (production) — CMP-052, CMP-053.
7. CMP-065 (iPhone check) — CMP-052, CMP-053 deployed to staging.
8. CMP-067 (logo) — Cami's file only.
9. CMP-066 (verification, integration owner Agent 3) — every PR above, except one the owner
   moved to the next sprint.
10. CMP-069 (deadline date) — CMP-056 and the go-live date from the owner.
11. CMP-072..CMP-076 (security fixes, tracked privately) — nothing but the private details;
    CMP-079 (HTTPS and headers) — nothing.
12. CMP-068 (go-live) — CMP-066, CMP-069, CMP-072..CMP-076, CMP-079 and every release-checklist §3b gate (so a moved
    CMP-065 or CMP-067 also moves CMP-068).

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
- PRs that deploy staging on merge (ADR-009: changes under `apps-script/**`,
  `.github/clasp/**`, `.github/scripts/**` or the deploy workflow): staging deploys only from
  `main`, so their staging checks run after the merge (owner decision, Sprint Review Notes). The PR merges after review
  with its ticket row at `review`; after the automatic deploy the owning agent runs the checks
  on staging and records the evidence and `done` in its next PR (the last ones in CMP-066). A
  failed check becomes a new ticket. CMP-064 does not wait for the CMP-053 staging burst (owner,
  2026-10-27: "No, don't wait", Sprint Review Notes); a fix found later reaches production like
  any other change.
- CMP-066 collects the evidence in `SPRINT_03_VERIFICATION.md`; the owner checks inbox and sheet
  items as in Sprint 02.

## Risks
- **Live before the penetration test.** Real people's data and payment screenshots are stored
  before an outside tester has checked the form. Mitigations: the security baseline, the
  pre-test review with critical and high findings fixed before the go-live, the abuse limits
  and alerts already in place, and the test by its deadline. Finding a tester (and its cost,
  against the zero-cost rule NFR-003) may take time; after the deadline every release waits
  for it.
- **The go-live depends on outside items:** Cami's logo, the owner's iPhone and the production
  setup with the owner. If one slips, the owner moves it and CMP-068 to the next sprint;
  CMP-066 records it as moved and still merges.
- **The staging login token** expired after 4 days once (2026-10-26). If it recurs, every
  deploy stops until the owner logs in again (CMP-064 note).
- **The iPhone window** depends on the owner having a device during the sprint; while the test
  site is up, anyone can use staging (TECH_STACK §10), so it is published only for the check.
- **Production setup** touches the real SINPE values and the owner's account; Agent 1 prepares
  every step so the owner's part takes minutes, and no value goes in the repo.

## Sprint Definition of Done
- Every selected ticket `done`, or moved to Sprint 04 by the owner.
- The Required Deliverable demonstrated and its evidence approved: merging CMP-066 (the
  verification) and CMP-068 (the release and the live smoke test, in its PR).
- [`TICKETS.md`](../../TICKETS.md), [`USER_STORIES.md`](../specs/USER_STORIES.md) and
  [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md) updated; the PTES deadline date in the
  baseline (CMP-069).

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
- Owner change (2026-10-26, before this plan merged): the coordinator explained the go-live
  waits for the tester and offered to go live at the end of Sprint 03 with the test by a set
  date. Owner: **"I think I will switch to that, I don't have a PTES tester yet and I don't
  want to wait for Cami to use this in the meantime."** This replaces the first answer above:
  the events go live in Sprint 03 (CMP-068) and the PTES test follows by a deadline. Follow-up
  questions as asked:
  - "Under the kit's rules, launching before the security test means you set a deadline for
    it, written into the security rules. Once the deadline passes, nothing else can be
    released until the test is done. Which deadline?" — options: 60, 30 or 90 days after
    launch. Owner: **"60 days after launch (Recommended)"**.
  - "One release item is still open: Cami's Lifetools logo, shown on events that have no
    picture of their own. Can Cami send it during Sprint 03?" — options: yes, Cami will send
    it; launch without it. Owner: **"Yes, Cami will send it"** (CMP-067).
  - Coordinator addition, approved with this plan: critical and high findings of the pre-test
    review (CMP-063) are fixed, or accepted by the owner in writing, before the go-live.
  - Question as asked (2026-10-26): "The kit's sprint-readiness checklist has a rule that
    could block launching before the security test: it blocks a release 'while a live
    project's penetration test is still due'. The kit's main rules say a live project may
    instead set a deadline, and the test blocks releases only after that deadline passes. I'd
    record that 'still due' means 'past the recorded deadline', so this launch is allowed. Do
    you accept that reading?" — options: yes, accept it; no, test first. Owner: **"Yes, accept
    it (Recommended)"** (Entry Gates → readiness item 5, pen test).
- Go-ahead (owner, 2026-10-27, after merging PR #54): "go ahead". The coordinator launched, from
  [SPRINT_03_AGENT_PROMPTS.md](SPRINT_03_AGENT_PROMPTS.md), the review-only session (Opus),
  Agent 1 (Sonnet), Agent 2 (Opus) and Agent 3 (Sonnet), tagged `cmp-sprint-03`. Agent 2's
  attempt to attach the private kit was blocked by its session's permissions, so the
  coordinator sent Agents 2 and 3 the kit templates they need verbatim from its checkout at
  v1.2.0 (`bd756f9`). The Sprint 02
  sessions are archived.
- Question as asked (2026-10-27, from the reviewer on PR #55): "Backend changes only reach the
  test copy (staging) after you merge them, because staging updates automatically from main.
  So the backend agent can't show its staging test results before you merge. How should that
  work this sprint?" — options: merge, then test; test before merging (by hand, runbook
  emergency path). Owner: **"Merge, then test (Recommended)"** (Verification).
- Questions as asked (2026-10-27, from the reviewer and Agent 1 on PR #55):
  - "The counter fix (PR #55) relies on a Google behaviour we haven't proven yet. If it doesn't
    hold, the counters get slightly worse, not better. Since we test after merging, should the
    real (production) backend wait until the staging test of this fix passes, with a revert or
    a fix first if it fails?" — options: yes, wait for the test; no, don't wait. Owner: **"No,
    don't wait"**. CMP-064 does not wait for the CMP-053 staging burst; a failed burst becomes
    a fix ticket, deployed to production like any other change.
  - "The counter fix also means the daily Metrics row in the sheet can be up to 5 minutes
    behind (it's updated by the 5-minute background job instead of on every request). The
    alerts still work the same way. OK?" — options: OK, 5 minutes is fine; no, must be
    instant. Owner: **"OK, 5 minutes is fine (Recommended)"** (FFR-029, FEATURE_SPEC v1.11).
  - "Security problems found before launch are kept private (not in the public repo). So
    before launch, who confirms that no serious problem is still open?" — options: I confirm
    it in writing; the security agent confirms. Owner: **"I confirm it in writing
    (Recommended)"** (release-checklist §3b, CMP-068).
- CMP-063 findings (2026-10-27): tracked privately outside the repository (public repository;
  kit security templates); here they appear only as "SEC-00N: security fix, tracked privately".
  The owner chose where the details are kept (privately) and the fix schedule: CMP-072 (Agent
  3) and CMP-073..CMP-076 (Agent 1) are fixed in this sprint, before the go-live (CMP-068); one
  finding is handled as recorded privately. The questions and answers are in the private
  record.
  - "The security agent asks for permission to run a gentle, slow check against STAGING only
    [...]. Never against the live site. Allow it?" — Owner: **"Yes, allow it (Recommended)"**;
    the written authorization with its window is on PR #62.
  - Later: the security agent's session blocked the script for the staging check, so no request
    was sent. Question as asked: "The security agent couldn't run the gentle staging check: its
    session's safety controls blocked the script, so it sent nothing. What should happen to that
    check?" — options: leave it to the tester; I'll run it by hand. Owner: **"Leave it to the
    tester (Recommended)"**. The staging checks wait for the PTES test (CMP-062); CMP-063
    closes on the code review plus the owner's checks of SAC-13 and SAC-15.
- Owner checks for CMP-063 (2026-10-27): SAC-13 on the live site failed: `http://` stays on
  HTTP and none of the four security headers is sent (CMP-079, before the go-live). SAC-15 on
  staging passed: the spreadsheet and the screenshots folder are Restricted to the owner's
  account; production is checked after CMP-064.
