# CMP-123 production deploy of CMP-121 and CMP-130

Run by the owner on 2026-11-03 (Costa Rica time) through the approved workflow, step by step through
the coordinator, who relayed the answers (quoted where they were quoted to me). Agent 1 ran none of it.
No URL, ID, address or personal data is recorded.

Gates before the deploy: CMP-121's and CMP-130's staging checks passed
([CMP-121-CMP-130-staging-check.md](CMP-121-CMP-130-staging-check.md)); the pre-release security
agent reviewed the backend changes since `31f1db3` (commits `16bc5e9` and `d092aa5`, and the deploy
tool's lockfile after CMP-122) and found nothing new (observation only: the trigger takes the script
lock briefly per tab and per notice, waits of at most 20 s); no agent scan (owner, 2026-11-03: "Same as
before: tester (Recommended)"); Cami approved the "pendiente: revísalo a mano" wording (2026-11-03).

| Step | Check | Result (owner) |
|---|---|---|
| 1 | `NOTIFY_REGISTRATION_TO` is Cami's address; `RETRY_CHECK_HOURS` is `06-22` | "yes both" |
| 2 | Both triggers present on Head | "both triggers completed" (`refreshEventsCache` and `retryPendingChecks`, last runs Completed) |
| 3 | Version the deployment served before | Version 4 (deployed 2026-10-31, run 28): the way back |
| 4 | Rows still `pending` in the production tabs | "none pending" |
| 5 | Production dry run (login and project check, nothing pushed) | "Green" |
| 6 | Real deploy | "green, version 5": target the production project; version served before: 4; pushed 17 files at 11:55 PM UTC; "The project holds no file that the repo does not have."; deployed @5; smoke: events list ok, invalid registration refused (`VALIDATION_ERROR`) |
| 7 | Executions after the deploy | `retryPendingChecks` 5:55:14 pm, 4.434 s, Completed (right after the push); `refreshEventsCache` 5:58:38 pm, 5.971 s, Completed |
| 8 | The production tabs | "noticeSentAt with -": the column is last, existing rows have `-`; no row was `pending`, so no notice question arose |
| 9 | The live site | "site loads both languages" |
| 10 | First real paid sign-up: participant email at once, Cami's notice after the check, Cami confirms | **Pending**: waits for a real participant |

Found during the deploy: GitHub did not ask for an approval, because the "Required reviewers" protection
was off on the `production` and `site-production` environments. The owner checked on 2026-11-04 and
turned it on for both, with the owner as reviewer. Before that date the deploy "approvals" were the
owner starting the runs (no environment gate existed). Rollback was not needed.
