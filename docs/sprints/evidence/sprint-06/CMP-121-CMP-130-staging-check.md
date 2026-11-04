# CMP-121 and CMP-130 staging check

Run by the owner on 2026-11-03 on staging, step by step through the coordinator, who relayed the
answers (quoted where they were quoted to me). Agent 1 ran none of it. No URL, ID, address or personal
data is recorded. The test events were `ZTEST5` (₡0) and `ZTEST6` (₡1,000); registrations were sent
with `curl` to the owner's test inbox, one address per registration, with a Mac screenshot of a plain
web page (PNG) and the same picture as JPEG. `RETRY_CHECK_HOURS` was `06-22` except where a step says
otherwise; there is no staging `retryPendingChecks` trigger, so the owner ran it by hand from the editor.

## CMP-121 (PR #135, deployed as Version 37)

| Step | Check | Result (owner) |
|---|---|---|
| 1 | Staging deploy of PR #135 | First run failed at the step that asks Google for the project's title (the login token was rejected; nothing was pushed); after the login was renewed the re-run was "green", smoke request included |
| 2 | `retryPendingChecks` trigger on staging | "absent" (run by hand) |
| 3 | `NOTIFY_REGISTRATION_TO` and `MAIL_REPLY_TO` set to the test inbox; `RETRY_CHECK_HOURS` `06-22` | "done" |
| 4 | `ZTEST5` and `ZTEST6` published; any older test tab | "done, no old tabs" (so the older-tab migration was not run on staging; it ran on production, CMP-123 step 8) |
| 5 | Three ₡0 and three paid registrations, timed (curl total, seconds) | ₡0: 8.978, 7.281, 6.776. Paid (215 KB PNG): 16.062, 14.646, 13.392. Each ₡0: participant email and one notice ("all emails arrived"); each paid: "only participant arrived" (no notice yet, as specified) |
| 5b | Server time, Executions of `doPost` (Version 37) | ₡0: 8.016, 6.385, 5.872 (median 6.385). Paid PNG: 14.124, 13.267, 11.139 (median 13.267) |
| 5c | Same screenshot as JPEG, one paid run | curl 9.544 s, Executions 8.256 s: the PNG → JPEG conversion costs about 5 s, the rest of the paid path about 1.9 s over ₡0 (moved to CMP-130) |
| 6 | The paid rows | "pending and that last column is empty" (four rows: three PNG, one JPEG) |
| 7 | `retryPendingChecks` run by hand | "4 not validated, 4 notices, all mismatch, noticeSentAt filled" |
| 8 | Run again | "nothing new" |
| 9 | Night case: `RETRY_CHECK_HOURS` set to a window that excludes now (`06-07`), one paid JPEG (A), manual run | "completed, row A still pending, only participant email" |
| 10 | A second paid row (B) with its timestamp moved two days back, `RETRY_CHECK_HOURS` back to `06-22`, manual run | "A mismatch with notice" and "yes A got not validated"; "B one notice saying pendiente: revísalo a mano" (B was not checked). Cami approved the wording (2026-11-03: "Cami approved the pendiente wording") |
| 11 | `noticeSentAt` of one ₡0 row blanked, two manual runs | "one notice then nothing" |
| 12 | One paid registration sent again with the same `submissionId` | "duplicateSubmission true, same reference, nothing arrived" (a first try with a mistyped address reached nothing) |
| 13 | Cleanup | "cleanup done" (see the cleanup list in the verification) |

Not provoked on staging (checked by the local mock-service run in the PR and the reviews): the empty
or invalid `NOTIFY_REGISTRATION_TO` (`skipped`), a quota below the reserve, a send failure, the lock
busy, the interrupted header migration and the older-tab migration.

## CMP-130 (PR #139, deployed as Version 38; deploy run green, smoke included)

A new screenshot of the same kind: PNG 212 KB, JPEG 199 KB.

| Step | Check | Result (owner) |
|---|---|---|
| A | Properties and `ZTEST5` / `ZTEST6` set up again | done |
| B | Three ₡0 and three paid PNG, alternating, curl total (seconds) | ₡0: 7.041, 7.534, 7.701. Paid PNG: 11.860, 9.584, 10.345. Medians 7.534 and 10.345: +2.81 s (the upload of about 290 KB of base64 is included) |
| B | Server time, Executions of `doPost` (Version 38), same order | ₡0: 6.126, 6.631, 6.803. Paid PNG: 9.829, 8.221, 7.978. Medians 6.631 and 8.221: **+1.59 s** (before CMP-130: 13.267 vs 6.385, +6.9 s) |
| B5 | One paid JPEG | Skipped on staging (a JPEG was not converted before either; covered by the mock-service run and the review) |
| C6 | The three PNG rows | "pending, no original format note, 3 .png files, emails right" |
| C7 | `retryPendingChecks` by hand | "all 3 mismatch, 3 not validated, 3 notices": Drive OCR reads a PNG stored as received |
| D | Goal: which measure does "at most 2 s above free" mean? | Owner: "Server time (Recommended)". Met: +1.59 s |
| D9 | Cleanup | "cleanup done" |
