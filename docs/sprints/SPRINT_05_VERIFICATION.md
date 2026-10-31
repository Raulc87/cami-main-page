# SPRINT_05_VERIFICATION — Registration notice to Cami and the trigger failure email (CMP-115)

Verification of Sprint 05 ([`SPRINT_05_PLAN.md`](SPRINT_05_PLAN.md) → Ticket checks), written by
Implementation Agent 1 (CMP-115). It compiles each ticket's recorded checks: the merged PR, its
review, the ticket row in [`TICKETS.md`](../../TICKETS.md) and the evidence file in
[`evidence/sprint-05/`](evidence/sprint-05/). Agent 1 ran none of the staging and production checks
itself: the owner ran them, Cami read the notice, and the coordinator relayed the answers (quoted where
they were quoted to me). A Fail is not fixed in this PR: it is classified and a ticket is proposed.
Story statuses are not changed here; the coordinator does that after the owner approves the evidence.

**Status of this document: PENDING one item.** Every Sprint 05 PR is merged and production runs the
registration notice; the one open check is Cami's confirmation of the first real notice (CMP-114, §2).

## 1. Method

| Item | Detail |
|---|---|
| What this document is | A compilation of the recorded checks, with a result per check and its source. No new check was run for it |
| Code under test | `main` at `31f1db3` (PR #128) for `apps-script/`; every later commit changes documents only |
| Staging | The staging Apps Script deployment, spreadsheet and Drive folder (deployed on merge: run 25 version 35 for PR #127, run 26 version 36 for PR #128) |
| Production | The production web app, deployed by the owner through the approved workflow (CMP-114) |
| Public repository | No URL, ID, address, host, user, participant or event name beyond the test codes is recorded; the security agent's review appears only as a neutral statement |

Legend: **Pass**, **Pass (code)** (not provoked live; the code and the review show it), **Fail**,
**N/A**, **Moved**, **Dropped**, **Pending**.

## 2. Results per ticket

### CMP-111 — Sprint 05 plan and spec (coordinator; PR #125)
| Check | Result | Source |
|---|---|---|
| FFR-034, contract §9/§10 v1.10, US-026 and EVENTS_EMAILS_AND_PRIVACY §2c agree; the owner's three answers quoted | Pass | PR #125; plan → Review Notes |

### CMP-112 — Registration notice to Cami (PR #127; US-026, FFR-034, contract v1.10)
Staging check of 2026-10-31: [CMP-112-CMP-113-staging-check.md](evidence/sprint-05/CMP-112-CMP-113-staging-check.md).

| Check | Result | Source |
|---|---|---|
| AC1 One notice per newly stored registration (₡0, paid, flagged), after the participant's email and, when paid, the in-request payment check, to `NOTIFY_REGISTRATION_TO` only, with the §2c text and values in both languages | Pass | Steps 3, 4, 4c; the paid notices showed the real check result; a `pending` check was shown as pending in steps 4 and 4b |
| `pending` only when the check was deferred, and no second notice when the retry trigger finishes it | Pass | Steps 4, 4b (notice said pending, the hand-run retry sent nothing), 4c |
| AC1 reasons line: every FFR-030 reason in §2c order | Pass for `mismatch`; Pass (code) for the other six | Step 4c in a real inbox; the others by the builder's local run and the review (not provoked on staging) |
| AC2 No notice on a retry with the same `submissionId`, or a duplicate email | Pass | Steps 5 and 6 |
| AC2 No notice on a validation error, ₡0 `SOLD_OUT`, rate limit, honeypot | Pass (code) | Each returns before the notice is called (`Register.js`); the reviewer checked it |
| AC3 No participant email, WhatsApp number, coupon code, screenshot or link | Pass | Owner and Cami read the notice ("notice looks right"; "Cami approved the text as it is"); the builder takes only the name, event, amount, check result, reasons and reference |
| AC4 Empty property → no notice; the registration, response and participant email unaffected | Pass | Step 7 |
| AC4 Invalid address, or a send failure → skipped or logged by error name only, never an address; `needsReview` unaffected | Pass (code) | Not provoked on staging; reviewer's checks of `parseAddressList_` and `sendRegistrationNoticeSafely_` |
| AC5 Quota below `NOTIFY_QUOTA_RESERVE` → skipped and logged | Pass (code) | Cannot be provoked on staging; `noticeQuotaAllows_` reviewed; an unreadable quota counts as low |
| Time added to `register` (plan: more than 2 s goes back to the coordinator) | Pass | Step 8: medians 7.002 s with the notice, 5.926 s without; difference 1.076 s. The spread (5.9 to 7.4 s) is as large as the difference, so the cost is "about one second, within noise" |
| Runbook §2.4 lists `NOTIFY_REGISTRATION_TO` (empty on staging, Cami's address on production, typed by the owner) and `NOTIFY_QUOTA_RESERVE` | Pass | Runbook §2.4 |
| Cami's OK of the notice text | Pass | Step 9: "Cami approved the text as it is" (the §2c text as changed by PR #126: the last line names the event-code tab) |
| Review | Pass | Review-only agent: ready at `d944f9b` after S1, S2, N1 and B1 were fixed; Codex: no findings |
| Cleanup | Pass | Step 14 and §3 |

### CMP-113 — Trigger failure email seen in a real inbox (PR #130)
| Check | Result | Source |
|---|---|---|
| A staging trigger with "Notify me immediately", `TRIGGER_FAIL_ALERT_AFTER` 1, a wrong `SPREADSHEET_ID`; the run Failed | Pass | Steps 10–12 |
| Google's failure email seen in a real inbox; sender and subject noted without addresses | Pass, subject partly | "arrived, sender Apps Script, subject about failure": the sender is noted; the exact subject line was not given |
| Everything restored and the trigger deleted | Pass | Step 14, "cleanup done" |
| Where Google sends it | Pass | To the account that created the trigger, at that trigger's frequency (runbook §2.4); the Sprint 04 staging email most likely never came because those triggers were deleted before the daily summary |
| Owner's decision for production | Recorded | Asked whose inbox production failure emails should reach: "Leave as is" (the account that created the production triggers, "daily") |

### CMP-117 — OCR failure reason in the log (unplanned, owner's OK; PR #128)
| Check | Result | Source |
|---|---|---|
| The log line adds Google's HTTP status and reason code, never the message; a "daily limit" error counts as a service problem (`pending`); runbook §2.7 says how to read it | Pass | PR #128 and its review; local stub run (status and reason kept only when they match a safe pattern; a throwing detail returns empty) |
| After its staging deploy, a paid registration with a text screenshot before CMP-114 | Pass | Step 4c: the check read the image (`mismatch`, needs review), so no `ocr failed` line appeared |
| The cause of the two earlier `pending` checks (steps 4 and 4b) | Unknown, transient | Not a code change of this sprint: `Payment.js`'s OCR call and `appsscript.json` were unchanged since 2026-10-26; the web app runs as the same account and the Drive v2 service is present (owner's checks). Owner, asked whether a passing retry is enough before CMP-114: "Yes, the passing retry is enough (Recommended)". If it recurs, the new log line names the status and reason |
| Google retiring OCR through Drive v2 `files.insert` | No sign | Google's v2 reference still lists `ocr` and `ocrLanguage`; no v2 shutdown date in the Drive release notes; Apps Script's own behavior not confirmed from documentation |

### CMP-114 — Production backend deploy of CMP-112 and CMP-117 (Agent 1 with the owner)
| Check | Result | Source |
|---|---|---|
| Cami's OK of the notice text | Pass | CMP-112 step 9 |
| Pre-release security agent's code review of the sprint's backend changes (`5d52c59` → `31f1db3`), no open critical or high finding | Pass | Coordinator: "found nothing new" |
| The owner's scan decision recorded | Pass | "Same as v1.1.1: tester (Recommended)": no agent scan; covered by the PTES test due by 2026-12-26 |
| Production login renewed | Pass | The owner renewed the deploy login on 2026-10-31 and replaced `CLASP_CREDENTIALS` in both environments (staging deploy of PR #127 had failed on the expired token) |
| Step 1: `NOTIFY_REGISTRATION_TO` set to Cami's address in the production script properties | Pass | Owner: "production step 1 ok" |
| Step 2: production dry run: the project title says production | Pass | Owner: "green, title production" |
| Step 3: approved production deploy | Pass | Owner: "green, deployed" |
| Step 4: smoke request, both triggers present, a `refreshEventsCache` run Completed after the deploy | Pass | Owner: "PASS lines seen, triggers there, completed". The `apps-script/` folder deployed equals `31f1db3` |
| Step 5: the next real registration's notice confirmed by Cami (the owner chose this over a test registration in production) | **Pending** | Waits for the next real registration; the coordinator relays Cami's confirmation |

## 3. Staging cleanup list

State of the staging environment at the end of the sprint, from the owner's "cleanup done"
(CMP-112/CMP-113 step 14):

| Item | State |
|---|---|
| Test events and tabs `ZTEST3` and `ZTEST4`, their registrations and test inbox messages | Deleted |
| Staging `refreshEventsCache` trigger (re-created for CMP-113) | Deleted after a Completed run; `retryPendingChecks` was not re-created |
| Script properties `TRIGGER_FAILS_*` | Deleted |
| `TRIGGER_FAIL_ALERT_AFTER` | Back to `10` (the check used `1`) |
| `SPREADSHEET_ID`, `MAIL_REPLY_TO` | The original values |
| `NOTIFY_REGISTRATION_TO` | Empty (staging default); `NOTIFY_QUOTA_RESERVE` unset |

Production keeps its two triggers (the "daily" failure notification setting unchanged) and has
`NOTIFY_REGISTRATION_TO` set to Cami's address, typed by the owner and never written in the repo.

## 4. Open items and follow-ups

| Item | Owner | Note |
|---|---|---|
| Cami's confirmation of the first real production notice (CMP-114 step 5) | Coordinator / Cami | The only check pending in this sprint |
| PTES test by 2026-12-26 (CMP-099); the tester check-in on 2026-11-13 | Owner / coordinator | Also covers what an agent scan of production would have |
| Allowlist review of the accepted deploy-tool advisory by 2026-11-20 | Owner / Agent 2 | CMP-071 |
| Exact subject line of Google's failure email | Owner | Optional; the sender and the arrival are recorded |
| The cause of the two transient staging OCR failures | Owner | Unknown; if a paid check stays `pending` again, read the `ocr failed` line in Executions (runbook §2.7) |
| The five open Dependabot PRs (#104–#107, #109), a first real `rollback` run of the site-upload workflow | Owner | Next sprint (plan → Selected tickets) |
| The deploy login (`CLASP_CREDENTIALS`) expired again | Owner | Renewed 2026-10-31 in both environments; it also expired twice in Sprint 04 (runbook §5.1: ask the Workspace admin to check the Google Cloud session control setting) |

## 5. Summary

All Sprint 05 deliverables are met except the last confirmation: the registration notice to Cami works
on staging (one notice per stored registration, none on a retry, a duplicate email or an emptied
property; about one second added to `register`; Cami approved the text unchanged), the trigger failure
email was seen arriving and the runbook says where Google sends it, an OCR failure now logs Google's
status and reason (CMP-117, unplanned, approved by the owner), and production runs all of it (CMP-114
steps 1 to 4). The first real notice, confirmed by Cami, is the one pending item.
