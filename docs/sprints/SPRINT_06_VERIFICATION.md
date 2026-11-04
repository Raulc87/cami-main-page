# SPRINT_06_VERIFICATION — The payment check after the answer and release v1.2.0 (CMP-126)

Verification of Sprint 06 ([`SPRINT_06_PLAN.md`](SPRINT_06_PLAN.md) → Ticket checks), written by
Implementation Agent 1 (CMP-126). It compiles each ticket's recorded checks: the merged PR, its
review, the ticket row in [`TICKETS.md`](../../TICKETS.md) and the evidence files in
[`evidence/sprint-06/`](evidence/sprint-06/). Agent 1 ran none of the staging and production checks
itself: the owner ran them, Cami read the notices, and the coordinator relayed the answers (quoted where
they were quoted to me). The site tickets (CMP-124, CMP-125) are Agent 3's: they are listed from their
rows and records, not re-checked here. A Fail is not fixed in this PR: it is classified and a ticket is
proposed. Story statuses are not changed here; the coordinator does that after the owner approves the
evidence.

**Status of this document: complete except one check, which the owner chose to carry over (§4).** Every Sprint 06 PR is merged and production runs
the check after the answer (Version 5), but CMP-123's last step, Cami confirming the first real paid
notice, waits for a real participant (§4). Release v1.2.0 is live.

## 1. Method

| Item | Detail |
|---|---|
| What this document is | A compilation of the recorded checks, with a result per check and its source. No new check was run for it |
| Code under test | `main` at `d092aa5` (PR #139) for [`apps-script/`](../../apps-script/); the backend changes of the sprint are two commits, `16bc5e9` (PR #135) and `d092aa5` (PR #139) |
| Staging | The staging Apps Script deployment, spreadsheet and Drive folder (deployed on merge: Version 37 for PR #135, Version 38 for PR #139) |
| Production | The production web app, deployed by the owner through the approved workflow (CMP-123): Version 5, from Version 4 |
| Public repository | No URL, ID, address, host, user, participant or event name beyond the test codes is recorded; the security agent's review appears only as a neutral statement; the Workspace setting behind the deploy login's expiry is not named (owner, 2026-11-03: "Word it vaguely (Recommended)") |

Legend: **Pass**, **Pass (code)** (not provoked live; the code and the review show it), **Fail**,
**N/A**, **Moved**, **Dropped**, **Pending**.

## 2. Results per ticket

### CMP-120 — Sprint 06 plan and spec (coordinator; PR #133)
| Check | Result | Source |
|---|---|---|
| FFR-035, FFR-034's timing, contract §6/§10 v1.11, US-022 AC8, US-026 AC1 and EVENTS_EMAILS_AND_PRIVACY §2c agree; the owner's answers quoted | Pass | PR #133; plan → Review Notes |

### CMP-121 — The payment check after the answer (PR #135; US-022 AC8, US-026 AC1–AC5, FFR-035, FFR-034)
Staging check of 2026-11-03: [CMP-121-CMP-130-staging-check.md](evidence/sprint-06/CMP-121-CMP-130-staging-check.md).

| Check (plan → CMP-121) | Result | Source |
|---|---|---|
| `register` never runs the OCR: a paid row is saved `pending`, the participant email goes out, the answer returns | Pass | Step 5: each paid registration produced only the participant email and a `pending` row (step 6); the OCR is not reachable from `register` (code, reviewer) |
| The trigger checks each `pending` row, writes the result, sends the "not validated" email, then the notice, and sets `noticeSentAt` | Pass | Steps 7 and 10: four `mismatch` rows, four "not validated" emails, four notices, `noticeSentAt` filled |
| Nothing is sent twice | Pass | Step 8 (a second run: nothing new), step 12 (the same `submissionId`: no notice) |
| A row still `pending` at the 24-hour limit gets its notice, saying `pending` | Pass | Step 10: one notice, "pendiente: revísalo a mano", the row was not checked; Cami approved the wording |
| A ₡0 registration still gets its notice in the request, with `noticeSentAt` set; a blank one is recovered by the trigger once | Pass | Step 5 (each ₡0: participant email and notice), step 11 (blanked cell: one notice, then none) |
| `noticeSentAt` is added last to an older tab with `-` in its older rows, never notified; `skipped` when no notice is sent | Pass (production), Pass (code) for `skipped` | No older tab on staging; production tabs got the column with `-` in the existing rows (CMP-123 step 8); `skipped`, the interrupted migration and the busy lock by the mock-service run in the PR and the reviews |
| The trigger's run stays well inside Apps Script's 6-minute limit | Pass | No new row starts after 3 minutes (about 10 to 60 s per row); the production runs took 4.4 s and 6.0 s (CMP-123 step 7) |
| A night-hours case with `RETRY_CHECK_HOURS` | Pass | Step 9: Completed, the row stays `pending`, no email, no notice |
| Runbook updated (what Cami sees, the delay, night sign-ups after 06:00) | Pass | [`events-backend-runbook.md`](../process/events-backend-runbook.md) §2.7 |
| Paid median within 1 s of ₡0 | **Fail, moved to CMP-130** | Server time paid PNG 13.267 s vs ₡0 6.385 s: the PNG → JPEG conversion costs about 5 s (a JPEG took 8.256 s). The owner changed the goal to "within 2 s of free", counted in server time |

### CMP-130 — PNG stored as received (PR #139; US-021, US-022, FFR-014 v1.16, contract §3.3 v1.12)
Added to the sprint on 2026-11-03 after the CMP-121 timing (spec first: CMP-129, PR #138).

| Check (plan → CMP-130) | Result | Source |
|---|---|---|
| A JPEG or PNG is stored as received (`.jpg`, `.png`), with no original-format note; WebP/HEIC still converted, with the existing fallback | Pass | Step C6 (three `.png` files, no note); the mock-service run through the real `register` for JPEG, PNG, WebP, and a failing conversion; the review |
| An unreadable PNG behaves like any unreadable image (`unreadable`, `needsReview`, the "not validated" email) | Pass (code) | Mock-service run; the review (`runPaymentCheck_`, the note-based original-format rule) |
| Staging: a paid PNG is stored as `.png` and the trigger's check gives `ok` or `mismatch` (Drive OCR reads PNG) | Pass | Steps C6 and C7: three `mismatch` rows, three "not validated" emails, three notices |
| Three paid PNG and three ₡0 timed: paid median at most 2 s above ₡0 (server time and curl's total, both recorded) | **Pass on server time** | Server: ₡0 median 6.631 s, paid PNG 8.221 s: **+1.59 s**. curl: 7.534 s and 10.345 s: +2.81 s (it includes sending the image, which no server change can remove). Owner: the goal counts server time ("Server time (Recommended)") |
| A JPEG unchanged | Pass (code) | Not run on staging (skipped); a JPEG is stored as received, as before; the mock-service run and the review |
| Safe trims only | Pass | One base64 pass, one byte count; the review |

### CMP-122 — The deploy tool's advisory (PR #137)
| Check | Result | Source |
|---|---|---|
| A clasp release that pulls a fixed zod | None exists (clasp 3.4.1 is the newest and requires `zod ^3.25.76`; no zod 3.x is fixed) | PR #137 |
| The owner's renewal, with a new review date at most 30 days later | Not possible: the audit check and baseline §4 reject a review date more than 30 days after the first report (2026-11-21) | PR #137 |
| The path taken: `.github/clasp` moves to a fixed zod with an npm override (4.6.7), the allowlist entry removed | Pass | Owner's choice, 2026-11-03: "Force newer zod (Recommended)", merged with "if staging deploy fails, revert it"; the dependency audit reports 0 high and 0 critical; the staging deploy first failed on the expired login (not on #137: that step refreshes the token without clasp) and the re-run after the renewal was green with clasp 3.4.1 and zod 4.6.7 |

### CMP-123 — Production backend deploy of CMP-121 and CMP-130
Record: [CMP-123-production-deploy.md](evidence/sprint-06/CMP-123-production-deploy.md).

| Check (plan → CMP-123) | Result | Source |
|---|---|---|
| The security agent's review of the backend changes since `31f1db3` with no open critical or high finding; no agent scan | Pass | The agent's report through the coordinator (no new finding; one observation about short lock waits); no agent scan (owner, 2026-11-03: "Same as before: tester (Recommended)") |
| The approved production deploy; smoke green | Pass | Steps 5 and 6: dry run green, real deploy "green, version 5", events list ok and the invalid registration refused |
| Both triggers present | Pass | Steps 1, 2 and 7: `refreshEventsCache` and `retryPendingChecks`, both Completed after the deploy |
| The older tabs migrated; no notice for older rows | Pass | Step 8: `noticeSentAt` last, `-` in the existing rows; no row was `pending` |
| The next real paid sign-up's notice confirmed by Cami (it now arrives after the check) | **Pending** | Step 10 waits for a real participant (§4) |

### CMP-124 and CMP-125 — React 19 / Vite 8 and release v1.2.0 (Agent 3; PRs #136, #142, #143)
Not re-checked here. Their rows in [`TICKETS.md`](../../TICKETS.md) record the results: CMP-124 (PR #136) passed
its checks, with the owner's acceptance of the mobile PageSpeed change (2026-11-03); CMP-125 released
v1.2.0 on 2026-11-03 (tag `v1.2.0` on `7f8518e`, uploaded by the site-upload workflow, live checks passed,
live PageSpeed mobile 97, 97, 97). The release's live checks are in PR #143. No site cleanup was needed.

### CMP-127 to CMP-133 — Records
| Ticket | Result | Source |
|---|---|---|
| CMP-127 (TECH_STACK for CMP-124) | Dropped: folded into CMP-124 | Plan; TICKETS |
| CMP-128 (go-ahead records), CMP-129 (spec for PNG as received and the 2 s goal), CMP-131 (records: server-time goal, the zod override, the deploy login, the Lighthouse acceptance) | Done | PRs #134, #138, #140 |
| CMP-132 (security baseline after CMP-122 and CMP-124) | Done | PR #141 |
| CMP-133 (moderate advisories in the deploy tool's tree) | Backlog, not in Sprint 06 | TICKETS; baseline §4's 90 days apply |

## 3. Staging cleanup list

State of the staging environment at the end of the sprint, from the owner's "cleanup done"
(CMP-121 step 13 and CMP-130 step D9):

| Item | State |
|---|---|
| Test events and tabs `ZTEST5` and `ZTEST6`, their registrations, Drive test files, leftover OCR Docs and test inbox messages | Deleted (CMP-121 step 13: "cleanup done"; the one "pendiente" notice was kept for Cami's reading of the wording, and the test screenshots on the owner's laptop were kept for the CMP-130 run; CMP-130 step D9: "cleanup done") |
| Script properties `NOTIFY_REGISTRATION_TO`, `MAIL_REPLY_TO`, `RETRY_CHECK_HOURS` | Back to their staging values (`NOTIFY_REGISTRATION_TO` empty, `MAIL_REPLY_TO` the original, `RETRY_CHECK_HOURS` `06-22`) |
| Staging triggers | `retryPendingChecks` absent (run by hand). A time-based `refreshEventsCache` run on Head (12.4 s) was seen during the CMP-130 check, so a trigger for it exists on staging; the Sprint 05 end state was no staging trigger. Whether it stays is the owner's call (§4) |

Production keeps its two triggers (the "daily" failure notification setting unchanged), has
`NOTIFY_REGISTRATION_TO` set to Cami's address and `RETRY_CHECK_HOURS` `06-22`, and serves Version 5.

## 4. Open items and follow-ups

| Item | Owner | Note |
|---|---|---|
| CMP-123 step 10: the first real paid sign-up after the deploy, Cami's notice and how long it took | Owner / Cami | Pending a real participant; no test registration in production (plan). Owner's decision, 2026-11-04, asked "The production backend is live. Its last check needs a real paid sign-up, so Cami can confirm her notice arrives after the payment check. That may not happen before the sprint ends on Nov 11. If no paid sign-up comes by then, what should we do?" (other option: keep the sprint open): **"Close with it open (Recommended)"**. So this one step is the open item carried to the next sprint: the CMP-123 row stays `in-progress` until Cami confirms a real notice, and a small records PR then closes it |
| PTES test by 2026-12-26 (CMP-099) | Owner / coordinator | Covers what an agent scan of production would have |
| Moderate advisories in the deploy tool's tree (CMP-133) | Owner | Backlog; baseline §4's 90 days |
| GitHub's "Required reviewers" on `production` and `site-production` | Owner | Found off on 2026-11-03, turned on for both by the owner on 2026-11-04. Before that date the deploy "approvals" were the owner starting the runs (no environment gate existed) |
| The staging `refreshEventsCache` trigger seen on 2026-11-03 | Owner | Not in the Sprint 05 end state (deleted then); say whether it stays or is deleted, so the staging list is unambiguous |
| The deploy login (`CLASP_CREDENTIALS`) | Owner | It kept expiring within a day because of a Workspace setting; the owner changed it for the deploy login only (2026-11-03) and renewed the login in both environments. If deploys fail again with "Google rejected the login token", renew it and tell the owner (runbook §5.1, ADR-009) |
| What a paid sign-up still costs over a free one (Drive folder lookups, the file create and the counters under the lock) | Owner | About 1.6 s of server time, within the goal; a possible trim later, not planned |

## 5. Summary

The sprint goal is met: a paid sign-up now answers without waiting for the receipt check (server time
8.2 s against 6.6 s for a free one, +1.59 s, inside the owner's 2 s goal; before, paid PNG took 13.3 s),
Cami's notice for a paid sign-up arrives after the check (staging: result, "not validated" email and
one notice per row, nothing sent twice, the 24-hour `pending` notice with the approved wording), the
production backend runs it (Version 5; both triggers Completed; older tabs migrated), the deploy tool's
advisory is gone (CMP-122), and the site runs React 19 and Vite 8 in release v1.2.0 (CMP-124, CMP-125).
One check is pending: Cami's confirmation of the first real paid notice (CMP-123 step 10).
