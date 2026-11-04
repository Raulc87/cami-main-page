# SPRINT_PLAN — Sprint 06

## Metadata
- Sprint: 06
- Status: Closed 2026-11-04 (owner: "Close now (Recommended)"); Active from the owner's go-ahead
  2026-11-03 (plan approved on merge of PR #133, CMP-120; Entry
  Gate 4: "go ahead")
- Start: 2026-11-03 (Tuesday), the day of the go-ahead
- End: 2026-11-11 (Wednesday), the seventh business day counting the start day (the standard
  cadence; Saturdays and Sundays excluded)
- Final human reviewer: Raul Casanas
- Plan from the kit's `SPRINT_PLAN_TEMPLATE.md` at the kit ref in
  [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md); agent prompts in
  [`SPRINT_06_AGENT_PROMPTS.md`](SPRINT_06_AGENT_PROMPTS.md)

## Entry Gates
Run [`SPRINT_READINESS_CHECKLIST.md`](../checklists/SPRINT_READINESS_CHECKLIST.md) first
(detail below).

| # | Gate | Status |
|---|---|---|
| 1 | [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md) paths resolve | Pass: docs link check on the head of PR #133 (CMP-120) |
| 2 | Readiness checklist has no open blocking items | Pass |
| 3 | Integration contracts locked | Pass on merge: [`EVENTS_API_CONTRACT.md`](../specs/EVENTS_API_CONTRACT.md) v1.11 (PR #133, CMP-120) adds the `noticeSentAt` column (§6) and the check-after-answer test (§10); the API's requests and responses do not change |
| 4 | Final go-ahead from the human owner | Pass: "go ahead" (owner, 2026-11-03, after merging PR #133) |

### Readiness checklist result (2026-11-01)
| Item | Result |
|---|---|
| 1. Paths, `AGENTS.md`/`CLAUDE.md`, project key, branch names **(blocking)** | Pass (unchanged; branches in Selected tickets) |
| 2. Docs agree on scope, names, behavior **(blocking)** | Pass: FEATURE_SPEC v1.15 (FFR-035, FFR-034 timing), contract v1.11, US-022 AC8, US-026 AC1, EVENTS_EMAILS_AND_PRIVACY §2c timing, all in PR #133 (CMP-120) |
| 3. Testable acceptance criteria **(blocking)** | Pass: US-022 AC8, US-026 AC1 and the ticket checks below |
| 4. Locked contracts for shared interfaces **(blocking)** | Pass (gate 3) |
| 4. Credentials rule | Pass: unchanged (TECH_STACK §11, ADR-009, ADR-010) |
| 5. Personal data **(blocking)** | Pass: nothing new is collected; `noticeSentAt` is a timestamp |
| 5. Security baseline approved | Pass: approved (CMP-056); PTES due by 2026-12-26 (CMP-099) |
| 5. Stories touching an OWASP risk have verifying ACs **(blocking)** | Pass: CMP-124 (dependency upgrade) carries the audit and build checks; CMP-121 keeps US-026 AC3/AC4 |
| 5. Secret and dependency scanning | Pass: secret scanning on; dependency checks on every PR (CMP-071) |
| 5. Pen test before a production release | Not yet due: the PTES deadline is 2026-12-26; this sprint releases v1.2.0 (CMP-125) and a backend change (CMP-123) before it |
| 5. Pre-release security agent **(blocking: release sprint)** | Pass: its session stays open since Sprint 04; its review of the backend changes since `31f1db3` (the code deployed in CMP-114) is planned before CMP-123, and of the site changes since `5d52c59` (v1.1.2) before CMP-125's tag |
| 5. Written approval per agent scan **(blocking: release sprint)** | Pass: decided before the sprint for both production changes (CMP-123, CMP-125), owner 2026-11-03: "Same as before: tester (Recommended)": no agent scan, covered by the PTES test due by 2026-12-26 (Review Notes) |
| 5.1 User interface | Pass: the visual identity is approved (UX_UI_DIRECTION); CMP-124 must not change it (checked at three widths); not a go-live sprint |
| 6. Hosting runtime, local development, developer guide | Pass: ADR-002, ADR-008, [`CONTRIBUTING.md`](../../CONTRIBUTING.md) (Agent 3 updates it in CMP-124 if commands change) |
| 6. Test, lint and CI checks; required on `main` | Pass: build, `apps-script-check`, docs link check, dependency audit |
| 6. Branching ADR and deployment/release runbooks **(deploying sprint)** | Pass: ADR-007, ADR-009, ADR-010, the events-backend runbook, the release checklist |
| 6. Previews and tests use their own data | Pass: the staging backend and spreadsheet; the site upgrade is checked on a local build |
| 7. Workstreams assigned, ≤ 3 agents **(blocking)** | Pass: Agent 1 (backend) and Agent 3 (site) |
| 7. Ownership map, no dependency cycle **(blocking)** | Pass |
| 7.1 Prompts: no merge or approve; reviewer independence; attribution **(blocking)** | Pass ([`SPRINT_06_AGENT_PROMPTS.md`](SPRINT_06_AGENT_PROMPTS.md)) |
| 8. Go-ahead **(blocking)** | Pass (gate 4) |

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
| CMP-121 | Payment check after the answer; notice after the check (FFR-035, FFR-034) | Agent 1 | CMP-120 | `CMP-121-check-after-answer` | done |
| CMP-129 | Spec: FFR-014 JPEG/PNG stored as received, FFR-035 timing goal 2 s, contract v1.12 (owner, 2026-11-03) | Coordinator | — | `cmp-014-sdd-starter-kit-homologation-rqviz9` | done |
| CMP-135 | Close Sprint 06 | Coordinator | CMP-126 | `cmp-014-sdd-starter-kit-homologation-rqviz9` | done |
| CMP-131 | Records: FFR-035 goal in server time, CMP-122 override, the deploy login's expiry, CMP-124 Lighthouse acceptance | Coordinator | — | `cmp-014-sdd-starter-kit-homologation-rqviz9` | done |
| CMP-134 | Sprint 06 records: v1.2.0 live, production backend v5, plan statuses, environments' required reviewer | Coordinator | — | `cmp-014-sdd-starter-kit-homologation-rqviz9` | done |
| CMP-130 | PNG screenshot stored as received (FFR-014 v1.16, contract §3.3 v1.12), timed on staging | Agent 1 | CMP-129 | `CMP-130-png-as-is` | done |
| CMP-122 | clasp audit exception (zod, GHSA-mrhx-c7xc-m3w5) before 2026-11-20: a fixed clasp release, or the owner's renewal | Agent 1 | — | `CMP-122-clasp-audit-exception` | done |
| CMP-123 | Production backend deploy of CMP-121 and CMP-130 | Agent 1 + owner | CMP-121's and CMP-130's staging checks; the security agent's review (scan: decided, Review Notes) | — (evidence in CMP-126) | in-progress, carried (steps 1–9 passed; the first real paid notice confirmed by Cami is open) |
| CMP-124 | Site libraries: React 19, React DOM 19, Vite 8, `@vitejs/plugin-react` 6 (replaces Dependabot PRs #104–#107) | Agent 3 | — | `CMP-124-react19-vite8` | done (PR #136) |
| CMP-127 | TECH_STACK and docs for CMP-124 | Coordinator | — | coordinator's branch | dropped (folded into CMP-124: Agent 3 changes TECH_STACK's two lines in the same PR, AGENTS.md → Change management; review notes) |
| CMP-125 | Release v1.2.0 | Agent 3 + owner | CMP-124; the security agent's review (scan: decided, Review Notes) | `CMP-125-release-v1-2-0` | done (v1.2.0 live 2026-11-03, PR #142, records PR #143) |
| CMP-126 | Sprint 06 verification | Agent 1 | every ticket above | `CMP-126-sprint-06-verification` | done |

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
    gets its notice at the first trigger run after the limit, saying `pending`; nothing is sent
    twice;
  - a ₡0 registration still gets its notice in the request, and its `noticeSentAt` set;
  - `noticeSentAt` is added last to an older tab that lacks it (as `contactOptIn` was), with
    `-` in its older rows, which are never notified; `skipped` when a notice is not sent;
    §2c's new `pending` wording;
  - the trigger's run stays well inside Apps Script's 6-minute limit (a cap on rows per run if
    needed, said in the PR);
  - runbook updated (what Cami sees, the delay, night sign-ups after 06:00);
  - staging check after the merge: three paid and three ₡0 registrations timed (paid median
    within 1 s of ₡0; measured 2026-11-03: ₡0 6.4 s, paid PNG 13.3 s, paid JPEG 8.3 s server
    time, the PNG conversion costing ~5 s; the timing moves to CMP-130 with the 2 s goal, owner
    2026-11-03), a paid one checked by the next trigger run (result, "not validated"
    email, one notice), a second run sends nothing, a night-hours case simulated with
    `RETRY_CHECK_HOURS`; then the cleanup. The row stays `review` until then.
- **CMP-129:** FFR-014, FFR-017, FFR-035, BR-E04, §8 outputs, contract §3.3/§6/§10 v1.12 agree;
  the owner's answers quoted (Review Notes and FEATURE_SPEC §20).
- **CMP-130:** FFR-014 v1.16 and contract §3.3/§10 v1.12:
  - a JPEG or PNG is stored as received (`.jpg`, `.png`), no original-format note for them;
    WebP/HEIC still converted, with the existing fallback;
  - an unreadable PNG behaves like any unreadable image (`unreadable`, `needsReview`, the "not
    validated" email);
  - staging: a paid PNG is stored as `.png` and the trigger's check gives `ok` or `mismatch`
    (Drive OCR reads PNG); three paid PNG and three ₡0 registrations timed in the same session,
    paid median at most 2 s above ₡0 (server time from Executions and curl's total, both in the
    PR); a JPEG unchanged;
  - safe trims in the same function allowed (one base64 pass, no repeated reads), no other
    behaviour change.
- **CMP-122:** if a clasp release now pulls a fixed zod, `.github/clasp` moves to it (deploy
  checked on staging); otherwise the allowlist entry's renewal goes to the owner with the
  reason, and its new review date, at most 30 days later, with the owner's written acceptance
  on the PR. Either way the dependency audit is green after 2026-11-20. Neither existed on
  2026-11-03 (no fixed clasp; the audit check rejects a review date past 2026-11-21), so the
  owner accepted a third path: an npm override installing zod 4.6.7 under clasp 3.4.1, the
  allowlist entry removed, proven by the staging deploy (Review Notes).
- **CMP-123:** the security agent's review of the backend changes since `31f1db3` (CMP-121 and
  CMP-130) with no open critical or high finding; Cami's OK of the new `pending` wording (§2c),
  read at CMP-121's staging check; no agent scan (owner, 2026-11-03); the approved production deploy; smoke
  green; both triggers present; the next real paid sign-up's notice confirmed by Cami (it now
  arrives after the check).
- **CMP-124:**
  - React and React DOM 19, Vite 8, `@vitejs/plugin-react` 6, lockfile regenerated with npm;
    Dependabot's #104–#107 closed with a pointer to this PR (by the owner, or the agent with the
    owner's OK);
  - build green; dependency audit green; no new runtime library;
  - no visible change, checked at 1280/900/375 px in both languages (events, form, gallery);
    no console errors; the events, coupon and register calls work against staging;
  - local Lighthouse mobile 90+, desktop 95+, CLS ≤ 0.1 (the plan also said "not worse than
    v1.1.2's"; React 19's larger runtime costs mobile 96–97 → 91–94, accepted by the owner,
    Review Notes);
  - TECH_STACK's framework and build-tool lines changed in the same PR (Agent 3 owns those two
    lines for this ticket, AGENTS.md → Change management), and CONTRIBUTING if commands change.
- **CMP-125:** release v1.2.0 as for v1.1.2: version bump PR, the security agent's delta review
  to the tagged commit, the owner's statement (no agent scan, owner 2026-11-03), tag and Release, dry run, real
  upload, the release checklist's live checks, PageSpeed (three mobile runs).
- **CMP-126:** `docs/sprints/SPRINT_06_VERIFICATION.md` with the evidence of every ticket and the
  staging cleanup list.

## Parallel Workstreams
### Agent 1 — Events backend (fresh session)
- CMP-121 and CMP-122 at the go-ahead; CMP-130 after CMP-129 (assigned by the coordinator's message, 2026-11-03; not in the agent prompts, which predate it); CMP-123 after CMP-121's and CMP-130's staging checks; CMP-126 last.

### Agent 3 — Site libraries and release (fresh session)
- CMP-124 at the go-ahead; CMP-125 after CMP-124.

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
| `src/**`, `public/**`, `index.html`, `package.json` and `package-lock.json`, `vite.config.*`, `CONTRIBUTING.md`, [`README.md`](../../README.md), and TECH_STACK's framework and build-tool lines (CMP-124 only) | Agent 3 |
| [`TICKETS.md`](../../TICKETS.md) | Shared: each agent updates only its own rows; the coordinator adds rows |
| `docs/specs/**`, `docs/ux/**`, `docs/sprints/SPRINT_06_*.md` except the verification, the process docs except the events-backend runbook, [`AGENTS.md`](../../AGENTS.md), [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md), [`TECH_STACK.md`](../../TECH_STACK.md) (except those two lines), `docs/decisions/**` | Coordinator (docs PRs) |
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
   CMP-129 (spec: PNG stored as received, timing goal) — nothing.
3. CMP-130 (PNG stored as received) — CMP-129.
4. CMP-123 (production backend) — CMP-121's and CMP-130's staging checks; the security agent's
   review (including PNG metadata now kept as received, see Risks). CMP-125 (release v1.2.0) — CMP-124; the security agent's
   delta review.
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
- A PNG stored as received keeps its metadata chunks (for example `eXIf`, `tEXt`), as JPEGs already do; the conversion used to drop them. Low exposure (Cami's private Drive folder, type checked from the content, SAC-05); the security agent looks at it in its review before CMP-123 (#138 review).
- React 19 and Vite 8 are major versions: hidden behavior changes. Mitigated by the visual and
  functional checks and Lighthouse on a local build before the release, and by the release's
  kept build of v1.1.2 as the way back.
- The deploy login (`CLASP_CREDENTIALS`): its expiry was settled 2026-11-03 by an owner decision
  on a Workspace setting (ADR-009); the token now lasts until it is revoked or rotated, so its
  care matters more.
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
- Review of this plan (PR #133): "With the check moving after the answer, Cami's notice will only
  say 'pending' in a rare case: Google couldn't read the receipt for 24 hours, so it stops
  retrying and Cami must check it by hand. The approved wording says 'pendiente (se revisa de
  nuevo más tarde) / pending (checked again later)', which would then be wrong. What should it
  say?" Owner: **"pendiente: revísalo a mano (Recommended)"** (EN "pending: check it by hand";
  the other option: keep it). Cami sees it at CMP-121's staging check.
- Also from the review of PR #133: CMP-127 (a separate TECH_STACK PR) is dropped. AGENTS.md →
  Change management wants a stack change in the same PR as the code, so Agent 3 changes
  TECH_STACK's framework and build-tool lines in CMP-124, and the reviewer checks them.
- Scan decision for Sprint 06, before the go-ahead (readiness §5): "Sprint 06 changes production
  twice (the backend change and site release v1.2.0). Our checklist wants the scan decision
  recorded before the sprint starts, not later. As before, the security agent can't run a scan
  from its session. For both Sprint 06 production changes, how should we handle it?" Owner
  (2026-11-03): **"Same as before: tester (Recommended)"**.
- Go-ahead, 2026-11-03 (owner, verbatim, after merging PR #133): "go ahead". Sessions:
  Implementation Agent 1 `session_01DVcaZvgjJz7JVS7Uhyjjce` and Implementation Agent 3
  `session_01DVcaZyRTd2SMJPZ32HXU3j` (Sonnet, launched at the go-ahead); review-only agent
  `session_01DVcaZzgzHrLLTRjxSEcRgq` (Opus, launched to review this plan); the pre-release
  security agent keeps its Sprint 04 session `session_01DVcaZw7gF9nG9af7Am5D6U`. Sprint 05
  sessions archived after its closing: Agent 1 `session_01DVcaZxBZvRq8tBwr1wDFo4`, review-only
  agent `session_01DVcaZzhjSRSDQbHi3cDcNx`.
- CMP-121 staging check, 2026-11-03 (owner): ₡0 `register` 8.98/7.28/6.78 s (curl) and
  8.0/6.4/5.9 s (server); paid with a 215 KB PNG 16.06/14.65/13.39 s (curl) and 14.1/13.3/11.1 s
  (server), no notice yet as specified; the same screenshot as JPEG 9.54 s (curl), 8.26 s
  (server). The ~5 s gap is the PNG → JPEG conversion (Agent 1's analysis; the OCR is no longer
  reachable from `register`). Questions as asked and answers:
  - "Paid sign-ups now skip the receipt check, but turning a PNG screenshot into a JPEG still
    adds about 5 seconds (paid PNG ~13 s vs free ~6.4 s; paid JPEG ~8.3 s). Phone screenshots
    are usually PNG. What should we do?" Owner: **"Keep PNG as is (Recommended)"** (other
    options: convert later in the job; convert in the browser; accept as it is). → FFR-014
    v1.16, contract v1.12, CMP-130.
  - "Even with PNG kept as is, a paid sign-up will be about 2 s slower than a free one (it still
    saves the image to Drive). The plan's goal says 'within 1 s of free', which we can't meet.
    What should the new goal say?" Owner: **"Within 2 s of free (Recommended)"** (other
    options: paid under 10 s; keep 'within 1 s'). → FFR-035, contract §10, CMP-130's check.
- Also recorded by CMP-129 (reviews of #133 and #135): FFR-034's ₡0 notice recovery by the
  trigger; the `noticeSentAt` set-up under the script lock (contract §10); the CMP-121 check
  wording on the 24-hour notice; Cami's OK of the `pending` wording as a CMP-123 gate.
- After CMP-130's staging check (2026-11-03): server time ₡0 6.13/6.63/6.80 s, paid PNG
  9.83/8.22/7.98 s (medians 6.63 and 8.22: +1.59 s); curl ₡0 7.04/7.53/7.70 s, paid PNG
  11.86/9.58/10.34 s (+2.81 s, the image upload included); the PNG files stored as `.png`, the
  check read them (`mismatch`). Asked: "Paid PNG sign-ups now take 8.2 s on the server vs 6.6 s
  for free ones: 1.6 s more, inside your 2 s goal. Timed from your laptop (which adds sending
  the ~200 KB image) it's 10.3 s vs 7.5 s: 2.8 s more. No server change can remove that upload
  time. Which number should the goal count?" Owner: **"Server time (Recommended)"** (other
  option: the visitor's total wait). → FFR-035 v1.17, contract §10 v1.13.
- CMP-122 (PR #137), asked: "PR #137: the deploy tool (clasp) uses an old library (zod) with a
  known warning. Our exception for it ends Nov 20, after which CI goes red. No fixed clasp
  exists yet. How should we fix it?" Owner: **"Force newer zod (Recommended)"** (other options:
  change the exception rule; older clasp 2.5). On timing ("after the production deploy
  (Recommended)" or now), the owner answered: "Merged, if staging deploy fails, revert it"
  (merged 2026-11-03). Its staging deploy first failed on the expired login (not on #137: the
  failing step refreshes the token directly, without clasp), then passed after the renewal.
- The deploy login kept expiring (2026-10-26, 2026-11-02, 2026-11-03). The owner found the cause
  in a Workspace setting and chose a fix that applies to the deploy login only (2026-11-03; the
  question, the options and the setting are kept with the owner, not in this public repository,
  owner 2026-11-03: "Word it vaguely (Recommended)"). The login was renewed in both environments
  (ADR-009 Consequences).
- CMP-124 (PR #136), asked: "PR #136 upgrades the site to React 19 and Vite 8. The site looks
  identical, but React 19 is bigger, so the phone speed score drops from 96–97 to 91–94 (still
  above our 90 minimum; the page shows ~0.4 s later on a slow phone). What should we do?" Owner:
  **"Accept React 19 (Recommended)"** (other options: Vite 8 only, React 18 for now;
  investigate first). CMP-125's live PageSpeed runs confirm the score.
- v1.2.0 released 2026-11-03 (CMP-125): tag on `7f8518e`, the security agent's delta review with no
  new finding (comment on #142), the owner's statement on #142, dry run then upload, live checks
  (records PR #143), PageSpeed mobile 97/97/97.
- CMP-123, 2026-11-03: production properties and both triggers checked, version 4 noted as the way
  back, no `pending` rows; the production deploy (dry run, then real) served version 5 with both
  smoke checks passing; the first trigger runs after the push completed; the event tabs got
  `noticeSentAt` with `-` in older rows; the site loads in both languages. Open: the first real
  paid sign-up's notice, confirmed by Cami.
- Found 2026-11-03/04: the deploy workflows never asked for the owner's approval. The `production`
  and `site-production` GitHub environments had no required reviewer, which ADR-009 and ADR-010
  assume. The owner turned it on for both (2026-11-04), as the only reviewer.
  The security agent read the run history (read-only): every deploy run since ADR-009 was started
  from `main` by the owner's account and matches a known deploy. The release checklist now checks
  the setting before each deploy (§4.1 step 0, §3b).
- Carried to the next sprint: CMP-123 step 10, the first real paid sign-up's notice confirmed by
  Cami (owner, 2026-11-04, asked "The production backend is live. Its last check needs a real
  paid sign-up, so Cami can confirm her notice arrives after the payment check. That may not
  happen before the sprint ends on Nov 11. If no paid sign-up comes by then, what should we do?":
  **"Close with it open (Recommended)"**); CMP-133, the moderate advisories in the deploy tool's
  tree (GitHub Dependabot alert, 90 days from 2026-11-03); Dependabot #109 (GitHub Actions
  versions), still open; the first real rollback run of the site-upload workflow; the PTES tester
  search (check-in 2026-11-13). A dated SECURITY_BASELINE line on the environments' required
  reviewer is the security agent's CMP-136 (owner, 2026-11-04: "Yes (Recommended)").
- Sprint closed 2026-11-04, ahead of its 2026-11-11 end. Owner asked "Everything in Sprint 06 is
  done except Cami's confirmation on a real paid sign-up (carried over, as you decided). Close
  Sprint 06 now, a week early?": **"Close now (Recommended)"** (other option: wait until Nov 10).
  Definition of Done: every selected ticket `done` except CMP-123, carried with one step open by
  the owner's decision; the Required Deliverable shown (the check after the answer live in
  production v5, v1.2.0 live, the clasp exception settled) and its evidence approved by merging
  CMP-126 (#145, [`SPRINT_06_VERIFICATION.md`](SPRINT_06_VERIFICATION.md)). Sessions archived
  after this record merges: Agent 1 `session_01DVcaZvgjJz7JVS7Uhyjjce`, Agent 3
  `session_01DVcaZyRTd2SMJPZ32HXU3j`, review-only agent `session_01DVcaZzgzHrLLTRjxSEcRgq`; the
  pre-release security agent `session_01DVcaZw7gF9nG9af7Am5D6U` stays (CMP-136, PTES re-checks).
