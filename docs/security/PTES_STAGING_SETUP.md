# PTES_STAGING_SETUP

The owner's checklist for the PTES penetration test (CMP-095): what to set up on staging (and the
few production items) before the test window, what to watch during it, and the cleanup after. It
follows [`PENTEST_PLAN.md`](PENTEST_PLAN.md) §1 and the backend settings in the
[events backend runbook](../process/events-backend-runbook.md) §2.4, §2.6 and §2.7. It is not sent
to testers; the request they get is [`PTES_REQUEST_PACK.md`](PTES_REQUEST_PACK.md).

This repository is public: nothing below is a value. Addresses, IDs, SINPE values, coupon codes,
the marker and the signed form are typed by the owner in the places named here and kept
privately. Agents do none of this: the owner (or the tester, within the signed form) does.

Deadline: the test has run by **2026-12-26** ([`SECURITY_BASELINE.md`](SECURITY_BASELINE.md) §5).

## 1. Before the window

| # | Step | Where | Done |
|---|---|---|---|
| 1 | Choose the tester; fill in and sign the authorization form with them (plan, Appendix A: window, limits, tools, marker, inboxes, emergency contact). Keep the signed copy privately | Private | |
| 2 | Check Google's terms (Terms of Service, Acceptable Use Policy, Workspace and Apps Script terms) and GoDaddy's terms for security testing of your own web app and site; if either needs notice or permission, get it in writing and record it on the form (item 11) | Provider pages | |
| 3 | Tell Cami the window | Message | |
| 4 | Pick the window: not in the 12 hours before an event starts, and no backend deploy in it. Hold merges of `apps-script/**` and `.github/scripts/**` until the window closes | Calendar, GitHub | |
| 5 | **Staging SINPE values:** set test values in `SINPE_NUMBER` and `SINPE_ACCOUNT_NAME` (invented, clearly fake) so the tester never sees the real ones. Restore the real ones after (section 3) | Staging script properties | |
| 6 | **Staging test events:** as many as the tester needs, free and paid (₡0 and above), published for the window | Staging spreadsheet, `Events` tab | |
| 7 | **Test coupon codes** for staging (and for the production events, if the form lists any); give them to the tester privately, never write them here | Staging `Coupons` tab | |
| 8 | **Production test events:** only those listed on the form, at most. Each named as a test in both languages ("PRUEBA — no inscribirse / TEST — do not register") with a description saying so; **published only for the agreed production slot** and unpublished right after, because a published event shows on `camihernandez.com` in both languages and a real visitor could register | Production spreadsheet, `Events` tab | |
| 9 | **Alert settings:** test traffic triggers the daily alert email. Raise `ALERT_HONEYPOT_PER_DAY` and `ALERT_THROTTLED_PER_DAY` for the window, and point `ALERT_TO` at your own address only (on both environments) so Cami receives no test alerts. Write the original values privately first, to restore them | Script properties (runbook §2.4, §2.6) | |
| 10 | **Mail:** set `MAIL_REPLY_TO` to your own address during the window (runbook §2.7), so replies never reach a participant | Script properties | |
| 11 | **Limits:** the backend's own limits (`LIMIT_REGISTER_PER_MIN` 20, `LIMIT_COUPON_CHECKS_PER_MIN` 30, `LIMIT_COUPON_FAILS_PER_MIN` 10, `LIMIT_UPLOADS_PER_DAY` 100, `LIMIT_UPLOAD_MB_PER_DAY` 300) stay as they are. Write on the form, **well below** them, the requests per minute, the production registrations and uploads, the staging registrations and MB per day, and the email volume. These numbers are yours to choose; both environments share your Google quotas | Form, item 5 | |
| 12 | **Triggers on staging:** staging has none while no feature is tested. If the tester should reach payment-check retries, create `refreshEventsCache` (5 min) and `retryPendingChecks` (10 min) for the window (runbook §2.6, §2.7) and delete them after. Otherwise leave them off and say so on the form | Staging script editor | |
| 13 | Send the tester, privately and only after both signatures: the production and staging backend addresses, the test event and coupon codes, the marker, the limits and your emergency contact | Private channel | |
| 14 | Confirm the request pack ([`PTES_REQUEST_PACK.md`](PTES_REQUEST_PACK.md)) went out with the plan and nothing private was added to it | | |

## 2. During the window

- The tester stops at once, and you start the stop procedure, on any of the plan's stop
  conditions (real personal data reached, real visitors getting errors, a quota or limit reached
  on production, email sent to an address the tester does not control, a sign of impact outside
  the scope).
- Watch: the `Metrics` tab, the Apps Script **Executions** list, and your inbox for the alert and
  the registration emails. If production misbehaves, follow the runbook (remove the time
  triggers, redeploy a known version) and the release checklist §7 (rollback).
- If a registration that is not the tester's appears on a production test event (it lacks the
  marker), keep it and contact that person; do not delete it.

## 3. After the window: cleanup

The tester sends the list of everything created (registrations, uploads, coupon uses, by
environment, time and reference). Then:

| # | Step | Done |
|---|---|---|
| 1 | Unpublish the production test events; check each test event's tab for any registration without the marker before deleting anything | |
| 2 | Delete the marked registration rows and their screenshot files, on staging and on production, from the tester's list | |
| 3 | Delete the test events and the test coupons (or their uses) | |
| 4 | Delete the `Metrics` rows of the window's days (test counts only) | |
| 5 | Restore the real `SINPE_NUMBER` and `SINPE_ACCOUNT_NAME` on staging | |
| 6 | Restore `ALERT_TO`, `ALERT_HONEYPOT_PER_DAY`, `ALERT_THROTTLED_PER_DAY` and `MAIL_REPLY_TO` on both environments | |
| 7 | Delete the staging triggers again, if you created them | |
| 8 | Get the tester's written confirmation that they deleted any data captured, once the report is accepted | |
| 9 | Confirm the cleanup in writing (the plan asks for it) and keep it with the signed form, privately | |
| 10 | Store the report privately; findings go to the coordinator, who creates the remediation work; this repository gets only neutral IDs ("SEC-00N: security fix, tracked privately") until a fix is released | |
