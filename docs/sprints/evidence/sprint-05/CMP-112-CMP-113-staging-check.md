# CMP-112 and CMP-113 staging check (with CMP-117's re-check)

Run by the owner on 2026-10-31 on staging, after the staging deploys of PR #127 (run 25, re-run after
the login renewal, deployed version 35) and PR #128 (run 26, version 36); both smoke requests passed.
The steps were sent through the coordinator as one numbered list and relayed one at a time; the owner's
answers are quoted where they were quoted to me, the rest is the coordinator's summary. No URL, ID,
address or personal data is recorded. The test events were `ZTEST3` (₡0) and `ZTEST4` (₡1,000), the
registrations were sent with `curl` as in CMP-094, each with a test inbox address of the owner.

| Step | Check | Result (owner) |
|---|---|---|
| 1 | `NOTIFY_REGISTRATION_TO` and `MAIL_REPLY_TO` set to the owner's test inbox; `NOTIFY_QUOTA_RESERVE` left empty | "ok" |
| 2 | `ZTEST3` and `ZTEST4` added, published, listed by the events answer | "ok" |
| 3 | ₡0 registration to `ZTEST3`: participant email and one notice | "ok, both emails arrived, notice looks right" |
| 4 | Paid registration to `ZTEST4` with a PNG made from a system icon, then `retryPendingChecks` run by hand | The notice said payment check "pendiente (se revisa de nuevo más tarde)"; the log said `ocr failed: GoogleJsonResponseException` and the run completed (the row stayed `pending`, FFR-032) |
| 4b | Same with a plain-text screenshot of a web page | The notice again said `pending`; same log line |
| 4c | After PR #128 (CMP-117) was deployed: the same paid check with the plain-text screenshot | "no ocr failed line but the row says mismatch and needs review so it worked now". The notice said "Revisión del pago: el pago no coincide", "Necesita revisión: sí: el pago no coincide" (EN "payment does not match", "yes: the payment does not match"), the reference and the `ZTEST4` tab line correct; "yes, not validated email arrived" |
| 5 | Retry with the same `submissionId` | "ok, same reference, duplicateSubmission true, no new notice" |
| 6 | Same email again on `ZTEST3` | "step 6 success" (`ALREADY_REGISTERED`, no notice) |
| 7 | `NOTIFY_REGISTRATION_TO` emptied, a ₡0 registration | "step 7 ok, no notice" (the participant email still came); the property was then set back to the test inbox |
| 8 | Response time of `register`, ₡0, `ZTEST3`, three runs each, in seconds | With the property set: 6.677, 7.002, 7.447 (median 7.002). Empty: 5.875, 5.926, 7.272 (median 5.926). Difference 1.076 s, under the plan's 2 s limit |
| 9 | Cami reads one notice (both languages, with the event-code tab line) | "Cami approved the text as it is" |
| 10–12 | CMP-113: the staging `refreshEventsCache` trigger re-created on Head, every 5 minutes, "Notify me immediately", from Cami's laptop (so created by the account signed in there); `TRIGGER_FAIL_ALERT_AFTER` 1; `SPREADSHEET_ID` set to a wrong value | The run Failed and Google's email arrived: "arrived, sender Apps Script, subject about failure" (in the inbox of the account that created the trigger; the exact subject line was not given) |
| 13 | `SPREADSHEET_ID` restored; next run | Completed |
| 14 | Cleanup | "cleanup done": `SPREADSHEET_ID` original, `TRIGGER_FAIL_ALERT_AFTER` back to `10`, `NOTIFY_REGISTRATION_TO` empty, `MAIL_REPLY_TO` original, `TRIGGER_FAILS_*` deleted, the staging `refreshEventsCache` trigger deleted after a Completed run, `ZTEST3`/`ZTEST4` rows and tabs deleted, test emails and local test files removed |

Notes:
- Steps 4 and 4b: two paid checks left `pending` with the log naming only the error type, before CMP-117.
  Step 4c, after the CMP-117 deploy, read the image, so the log line never appeared and the cause of
  the two earlier failures stays unknown (transient). The owner accepted the passing re-check in place
  of a read reason (SPRINT_05_PLAN → Review Notes).
- The reasons line was read in a real inbox for one reason only (`mismatch`). The other reasons of §2c
  (`unreadable`, `event closed at submit`, `sold out at submit`, `coupon changed`,
  `duplicate event code`, `email failed`) were not provoked on staging; they are covered by the local run of the text builder
  and the review.
- A validation error, a ₡0 `SOLD_OUT`, a rate limit and a honeypot hit were not run on staging for the
  notice; in the code each returns before the notice is called (reviewer, [`apps-script/Register.js`](../../../../apps-script/Register.js)). An invalid
  address, a send failure and a quota below the reserve were not provoked on staging either (covered by
  the code review).
