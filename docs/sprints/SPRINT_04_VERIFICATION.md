# SPRINT_04_VERIFICATION — Site upload from GitHub, dependency checks, event-tab format, performance (CMP-096)

Verification of Sprint 04 ([`SPRINT_04_PLAN.md`](SPRINT_04_PLAN.md) → Ticket checks), written by
Implementation Agent 1 (CMP-096). It compiles each ticket's recorded checks: the merged PR, its
review, the ticket row in [`TICKETS.md`](../../TICKETS.md) and the evidence files in
[`evidence/sprint-04/`](evidence/sprint-04/). Agent 1 ran none of the staging and live checks
itself: the owner ran them and the coordinator relayed the answers. A Fail is not fixed in this PR:
it is classified (check wording or defect) and a ticket is proposed. Story statuses are not
changed here; the coordinator does that after the owner approves the evidence. No acceptance
criteria of a user story changed this sprint, so there is no story table.

**Status of this document: complete.** Every Sprint 04 PR is merged. v1.1.1 and v1.1.2 are live
(2026-10-29). Open items are listed in §4.

## 1. Method

| Item | Detail |
|---|---|
| What this document is | A compilation of the recorded checks, with a result per check and its source. No new check was run for it |
| Code under test | `main` after PR #121 (`0d0cd5b`); the live site is v1.1.2 (`5d52c59`) |
| Staging | The staging Apps Script deployment, spreadsheet and Drive folder; the staging time triggers were deleted by the owner on 2026-10-28 and re-created only for the CMP-101/CMP-107 check |
| Live | `camihernandez.com` and the production web app, checked by the owner (release checklist §4.1, §5, §6, §6a) |
| Public repository | No URL, ID, host, user, password, participant or event name is recorded; findings of the security reviews appear only as neutral statements ("no critical or high finding is open"), details are tracked privately |

Legend: **Pass**, **Fail**, **N/A** (cannot be exercised, with the reason), **Moved** (owner
decision), **Dropped** (owner decision), **Pending** (waits on something not yet done).

## 2. Results per ticket

### CMP-092 — ADR-010: upload the site from GitHub (coordinator; PR #97)
| Check | Result | Source |
|---|---|---|
| ADR-010 with the options and the owner's choices quoted (FTPS with a restricted account; keep each release's build), merged before CMP-093 | Pass | [ADR-010](../decisions/ADR-010-site-upload-from-github.md), Accepted on merge of PR #97 |

### CMP-093 — Site-upload workflow (PR #102)
| Check | Result | Source |
|---|---|---|
| `deploy-site.yml` starts only by hand (`workflow_dispatch`: tag, mode build/rollback, dry run), never on a push or a merge | Pass | Workflow file; no other trigger |
| Nothing runs with production values before the owner's approval, dry run included | Pass | Both the build and the upload job use the `site-production` environment (two approval clicks per run); owner's dry runs and real runs below |
| `build` builds the tag with the production address from the environment secret, checks the bundle with masked output, uploads, keeps the zip on the tag's Release | Pass | v1.1.1: dry run green (32 to add), real run green, `site-v1.1.1.zip` on the Release ([CMP-103-live-checks.md](evidence/sprint-04/CMP-103-live-checks.md) steps 3–4); v1.1.2 the same ([CMP-109-live-checks.md](evidence/sprint-04/CMP-109-live-checks.md) steps 2–3) |
| A dry run lists what would change and uploads nothing | Pass | v1.1.1: 32 to add, 0 to change, 0 to delete; v1.1.2: 10 to add, 1 to change, 4 to delete, 29 unchanged; compared with a hash-by-hash diff of the two builds before the real run |
| Deletes only files an earlier run uploaded | Pass | v1.1.2 deleted exactly the 4 old files; the old `images/community-480.webp` then answered 404 (CMP-109 step 4c) |
| `rollback` re-uploads a tag's kept zip, without building | N/A | Not exercised live (no rollback was needed). Checked in the PR against a fake FTP folder: an interrupted deploy followed by a rollback re-uploads everything and ends equal to the kept build. The first real rollback is the first production test of this mode |
| Live checks: the site loads, 301 to https, four headers, no cookies, events in EN and ES | Pass | CMP-103 steps 5a–5e; CMP-109 steps 4a–4e |
| The state file is not served | Pass | `/.deploy-site-manifest` answers 403 (CMP-103 step 5d, CMP-109 step 4c); the bundle check refuses a build whose `.htaccess` lacks the deny rule |
| No secret, URL or ID in the repo, the logs or the PR; actions pinned to full commit SHAs | Pass | Review of PR #102 (reviewer, Codex: 3 findings, all fixed); the credentials are in separate jobs from the third-party build code, with a write token only in the last job |

### CMP-094 — New event tabs: status dropdown, check-result colors, needs-review highlight (PR #95)
| Check | Result | Source |
|---|---|---|
| `status` dropdown (`new`, `confirmed`, `refund/cancelled`, `spam`) in warning mode | Pass | Staging, owner, 2026-10-29, step 1 ([CMP-094-staging-check.md](evidence/sprint-04/CMP-094-staging-check.md)) |
| `checkResult` colors; `needsReview` TRUE gives a light-red row | Pass | Steps 2–4 of the same file |
| Existing tabs unchanged; columns, headers and values as in the contract | Pass | Step 5; code review |
| The runbook says what the backend adds | Pass | [events-backend-runbook.md §2.1](../process/events-backend-runbook.md) |
| Deployed to production | Pass | With v1.1.1 (CMP-103 step 1) |

### CMP-107 — `checkResult` dropdown and `needsReview` checkbox (owner's follow-up; PR #108)
| Check | Result | Source |
|---|---|---|
| `checkResult` dropdown in warning mode with the contract's values; `needsReview` checkbox | Pass | Staging, 2026-10-29, step 5 ([CMP-101-CMP-107-staging-check.md](evidence/sprint-04/CMP-101-CMP-107-staging-check.md)) |
| The first registration lands in row 2, the second in row 3 | Pass | Step 6 |
| Existing tab unchanged | Pass | Step 8 |
| A stray ticked-then-unticked box in an empty row | N/A | Step 7 was optional and skipped; the runbook documents the effect (the next registration lands below it, harmless) |
| Cleanup | Pass | Step 12 and §3 |

### CMP-101 — Payment re-check in working hours; failure threshold (PR #96, contract v1.9 from CMP-100, PR #93)
| Check | Result | Source |
|---|---|---|
| Outside `RETRY_CHECK_HOURS` the re-check ends at once, no work, no error; `refreshEventsCache` runs at every hour | Pass | Staging step 9: the re-check Completed with no error outside the window. The refresh has no hours guard (code, reviewer's review of PR #96) and kept running in step 10 |
| A failure is reported only after `TRIGGER_FAIL_ALERT_AFTER` failures in a row (threshold 2); earlier ones are only logged; a success resets the count; each function counts on its own | Pass | Step 10: first run Completed, the next ones Failed; counts `refreshEventsCache` 4 and `retryPendingChecks` 2; step 11: success and the count property gone |
| Failure count unchanged by a run skipped outside the hours | Pass (code) | The hours guard returns before the counter is touched (reviewer); not read off a staging property |
| The failure email follows each trigger's own notification setting | Pass | No email arrived at once: the staging trigger was "Notify me daily". Recorded in the runbook §2.4. The arrival in the daily summary is the owner's follow-up (§4) |
| Runbook §2.4 lists both properties (06-22 and 10) | Pass | Runbook |
| Deployed to production with the two properties | Pass | CMP-103 step 1; owner's choice for the production trigger notification: "daily" |

### CMP-071 — Dependency checks (Agent 2; PR #98)
| Check | Result | Source |
|---|---|---|
| Dependabot updates for `/` and `/.github/clasp`; an `npm audit` check on every PR that fails on high or critical except a recorded exception; an SBOM per release | Pass | PR #98; row in `TICKETS.md`; the check ran on every later PR of the sprint |
| The first allowlist entry (a deploy-tool advisory) accepted by the owner in writing, with a review date | Pass | Accepted on PR #98 (2026-10-29); review by 2026-11-20 |

### CMP-095 — PTES test preparation (Agent 2; PR #99)
| Check | Result | Source |
|---|---|---|
| A request pack the owner can send to testers unchanged, and the staging setup for the test | Pass | [PTES_REQUEST_PACK.md](../security/PTES_REQUEST_PACK.md), [PTES_STAGING_SETUP.md](../security/PTES_STAGING_SETUP.md); the owner's decisions (free options first, Spanish copy) are in the plan's Review Notes |
| The test itself | Pending | Due by 2026-12-26 (CMP-099); the tester, window and cost are the owner's |

### CMP-098 — Pre-release security agent, steps 1–3 (PR #94; the delta records in PR #111 and PR #115; the scan records in PR #113 and PR #114)
| Check | Result | Source |
|---|---|---|
| Baseline and pen-test plan updated; security code review before the go-ahead and again before each release up to the release commit | Pass | `TICKETS.md` row and baseline §7 (reviews `5566e56`..`fe72b17`, `fe72b17`..`a8622cc`, the deltas up to `72417e6`, and `72417e6`..`5d52c59` for v1.1.2): no new finding. Separately, the owner's dated statement "No critical or high security finding is open" on PR #110 and PR #119 |

### CMP-100 and CMP-106 — Contract v1.9; docs with CMP-102 (coordinator; PR #93, PR #101)
| Check | Result | Source |
|---|---|---|
| Contract §9/§10 describe the two trigger settings and their test | Pass | [EVENTS_API_CONTRACT.md](../specs/EVENTS_API_CONTRACT.md), used by CMP-101 |
| UX, architecture and feature-spec updates for the performance work | Pass | CMP-106 row |

### CMP-102 — Site performance (Agent 3; PR #100)
| Check | Result | Source |
|---|---|---|
| Local Lighthouse: Performance 90+ desktop and mobile, CLS under 0.1, Accessibility 100 | Pass | Row: 99–100 / 95–99, CLS 0.001 / 0.005, Accessibility 100 (numbers in the PR) |
| Live PageSpeed (owner): desktop and mobile 90+ | Pass after v1.1.2 | v1.1.1: desktop 99, mobile 86/89/89 (target not met on mobile); v1.1.2: mobile 97, 90, 97, desktop 99 ([CMP-103](evidence/sprint-04/CMP-103-live-checks.md), [CMP-109](evidence/sprint-04/CMP-109-live-checks.md)). PageSpeed varies from run to run: the lowest mobile run equals the limit |

### CMP-103 — Release v1.1.1 and CMP-109 — Release v1.1.2 (Agent 3 with the owner)
| Check | Result | Source |
|---|---|---|
| Production backend first (properties, approved deploy, smoke, triggers), then the site; tag and GitHub Release | Pass | [CMP-103-live-checks.md](evidence/sprint-04/CMP-103-live-checks.md) steps 1–4, [CMP-109-live-checks.md](evidence/sprint-04/CMP-109-live-checks.md) |
| Live checks: 301, four headers, cache headers, no listing, cookies empty, events in ES and EN | Pass | CMP-103 steps 5a–5e, CMP-109 steps 4a–4e |
| PageSpeed 90+ desktop and mobile by the owner | Pass after v1.1.2 | See CMP-102 |
| Security review of the release commit; the owner's dated statement | Pass | PR #110, PR #119 |

### CMP-104 — Production scan after v1.1.1
| Check | Result | Source |
|---|---|---|
| Passive scan of the live site and the production web app right after the release | Dropped | The security agent's session safety controls blocked the scan, so it did not run; the owner chose "Leave it to the tester": the passive baseline is covered by the PTES test due by 2026-12-26 (PR #114, PR #116). The same decision covered v1.1.2 |

### CMP-108 — Mobile image sizes and nav dot animation (Agent 3; PR #118)
| Check | Result | Source |
|---|---|---|
| More WebP widths with matching `sizes`; the nav dot animated with transform/opacity; no visual change | Pass | Row and PR; live: the gallery photos are sharp on a phone (CMP-109 step 4e) |
| Mobile PageSpeed 90 or more | Pass | Mobile 97, 90, 97 after v1.1.2 |

## 3. Staging cleanup list

State of the staging environment at the end of the sprint, from the owner's cleanup answers (CMP-094
step "clean up done"; CMP-101/CMP-107 step 12):

| Item | State |
|---|---|
| Test events and tabs `ZTEST1` and `ZTEST2`, their test registrations and test inbox messages | Deleted |
| Staging time triggers (`refreshEventsCache`, `retryPendingChecks`) | Deleted again (back to the state of 2026-10-28); re-create them only for a staging check that needs them, such as the PTES window |
| Script properties `TRIGGER_FAILS_refreshEventsCache` and `TRIGGER_FAILS_retryPendingChecks` | Deleted |
| `TRIGGER_FAIL_ALERT_AFTER` | Back to `10` (the check used `2`) |
| `RETRY_CHECK_HOURS` | `06-22` (stays) |
| `SPREADSHEET_ID` | The original value restored after the forced-failure test |
| Production | The manual cPanel backup zip of `public_html` was removed from `public_html` after the v1.1.1 dry run (CMP-103 step 3). Production keeps both triggers, the same two properties (`06-22`, `10`) and the "daily" failure notification setting |

## 4. Open items and follow-ups

| Item | Owner | Note |
|---|---|---|
| The daily trigger-failure email arriving in the summary | Owner | Not yet seen; the `Failed` status already shows the contract's report (CMP-101) |
| PTES test by 2026-12-26 (CMP-099); the coordinator checks back on 2026-11-13 about the tester | Owner / coordinator | The tester, window and cost are the owner's; it also covers the passive baseline CMP-104 would have run |
| Allowlist review of the accepted deploy-tool advisory by 2026-11-20 | Owner / Agent 2 | CMP-071 |
| First real `rollback` run of the upload workflow | Owner | Not exercised in production; logic checked only against a fake FTP folder |
| Deploy login (`CLASP_CREDENTIALS`) expired twice in two days | Owner | Renewed 2026-10-29; the coordinator asked the owner to check the Workspace "Google Cloud session control" setting (runbook §5.1) |
| CMP-065, the real-iPhone check and the HEIC decision | Owner | Outside the sprint goal, whenever an iPhone is available |

## 5. Summary

All Sprint 04 deliverables are met or consciously closed: the site uploads from GitHub after the
owner's approval (CMP-093, used for v1.1.1 and v1.1.2), dependency checks run on every PR
(CMP-071), new event tabs come with the status and check-result dropdowns, the colors, the
needs-review checkbox and the row highlight (CMP-094, CMP-107), the payment re-check pauses at
night and trigger failures are reported after a run of failures (CMP-101), the site reaches
PageSpeed 90+ on desktop and mobile (CMP-102, CMP-108, v1.1.2), and the PTES request pack is ready
(CMP-095). The only Dropped item is the production scan (CMP-104), by the owner's decision.
