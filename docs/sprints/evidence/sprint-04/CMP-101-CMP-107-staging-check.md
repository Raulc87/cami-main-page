# CMP-101 and CMP-107 staging check

Run by the owner on 2026-10-29 on staging, after the staging deploys of PR #96 (run 21, re-run after
the login renewal) and PR #108 (run 23, green). The steps were sent through the coordinator as one
numbered list; the owner's answers below are quoted where they were quoted to me, the rest is the
coordinator's summary of what the owner reported. No URL, ID, email or personal data is recorded.
The test event was `ZTEST2` (₡0), registered with `curl`, as in CMP-094.

| Step | Check | Result |
|---|---|---|
| 1 | Both staging triggers re-created on Head (`refreshEventsCache` every 5 minutes, `retryPendingChecks` every 10 minutes) | "ok" |
| 2 | `RETRY_CHECK_HOURS` = `06-22`, `TRIGGER_FAIL_ALERT_AFTER` = `2` set | "ok" |
| 3 | `ZTEST2` added (₡0, future date); the events list on staging includes it | "ok, ZTEST2 is there" |
| 4 | Registration by `curl` | "ok, got ok:true with a reference" |
| 5 | CMP-107: (a) `status` dropdown, (b) `checkResult` dropdown and colors, grey `not-required` on the ₡0 row, (c) `needsReview` checkbox turns the row light red | "a ok, b ok, c ok" |
| 6 | First registration in row 2, second (another email) in row 3 | "row 2 ok, row 3 ok" |
| 7 | Stray `FALSE` in an empty row (optional) | Skipped |
| 8 | An older tab is unchanged | "ok, old tab unchanged" |
| 9 | CMP-101 hours: `RETRY_CHECK_HOURS` set to a window without the current Costa Rica hour; `retryPendingChecks` run | "ok, completed with no error, set back to 06-22" |
| 10 | CMP-101 failures: wrong `SPREADSHEET_ID` | See below |
| 11 | `SPREADSHEET_ID` restored; next run succeeds and the count is reset | "ok, completed and property gone" |
| 12 | Cleanup: `ZTEST2` row and tab, both staging triggers, `TRIGGER_FAILS_retryPendingChecks`, test emails deleted; `TRIGGER_FAIL_ALERT_AFTER` back to `10`; `RETRY_CHECK_HOURS` stays `06-22`; `SPREADSHEET_ID` original | "cleanup done" |

Step 10, as reported: the 3:48 pm (Costa Rica) `refreshEventsCache` run showed Completed (failure 1,
only logged); the 3:53, 3:58 and 4:03 pm runs showed Failed. The failure-count properties then read
`TRIGGER_FAILS_refreshEventsCache` = 4 and `TRIGGER_FAILS_retryPendingChecks` = 2, with
`TRIGGER_FAIL_ALERT_AFTER` = 2: the first failure is not reported and the following ones are,
as contract §9 says; each function counts on its own. No email arrived at once because the trigger's
failure notification setting was "Notify me daily"; the owner will confirm the email in the daily
summary tomorrow (it is a Google setting per trigger, now in the runbook §2.4).

Result: CMP-101 met on staging (the arrival of the daily failure email is the owner's follow-up
confirmation); CMP-107 met on staging except the optional step 7. Both reach production with v1.1.1
(CMP-103), where the owner adds `RETRY_CHECK_HOURS` = `06-22` and `TRIGGER_FAIL_ALERT_AFTER` = `10`
and chooses the trigger failure notification setting.
