# CMP-094 staging check

Run by the owner on 2026-10-29 on the staging spreadsheet, after the staging deploy of PR #95
(Deploy Apps Script run 20, re-run after the login renewal; smoke request passed in run 21).
Steps as sent through the coordinator: a test event `ZTEST1` (₡0, so no payment screenshot), one
registration sent with a `curl` POST, then the checks on the new `ZTEST1` tab. No URL, ID, email or
personal data is recorded here.

| Step | Check | Owner's result (verbatim) |
|---|---|---|
| 1 | `status` column has the dropdown (`new`, `confirmed`, `refund/cancelled`, `spam`); another value gives a warning and is accepted | "ok" |
| 2 | `checkResult` of the ₡0 registration is grey (`not-required`) | "ok, we would need this as a drop as well" (follow-up CMP-107) |
| 3 | Typing `ok`, `mismatch`, `unreadable`, `pending` in `checkResult` gives green, red, orange, yellow | "ok" |
| 4 | `needsReview` TRUE turns the row light red | "ok, needs to be a dropdown or a check" (follow-up CMP-107) |
| 5 | An existing older tab is unchanged | "ok" |
| Cleanup | Test event row, `ZTEST1` tab and the test inbox message removed | "clean up done" |

Result: CMP-094 met on staging. The owner asked for a `checkResult` dropdown and a `needsReview`
checkbox on new tabs: CMP-107.
