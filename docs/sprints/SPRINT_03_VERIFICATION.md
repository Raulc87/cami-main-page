# SPRINT_03_VERIFICATION — Events go-live preparation (CMP-066)

Verification of Sprint 03 ([`SPRINT_03_PLAN.md`](SPRINT_03_PLAN.md) → Ticket checks), written by
Implementation Agent 3 (CMP-066). A Fail is not fixed in this PR: it is classified (check wording
or defect) and a ticket is proposed. Story statuses are not changed here; the coordinator does
that after the owner approves the evidence. No acceptance criteria of a user story changed this
sprint (the plan says "no new user stories"), so there is no story table.

**Status of this document: complete.** CMP-067 (PR #86) and CMP-069 (PR #85, Agent 2) merged on
2026-10-27. CMP-068 (the release, PR #88) was uploaded and checked live by the owner on 2026-10-27
(its results are in §2, CMP-068) and v1.1.0 was published on 2026-10-28 00:06 UTC. **CMP-065 is moved
after the go-live** (owner, 2026-10-27).

## 1. Method

| Item | Detail |
|---|---|
| What this document is | A compilation of each ticket's recorded checks (the merged PR, its review and the ticket row in [`TICKETS.md`](../../TICKETS.md)) with a result per check. Agent 3 ran the checks of CMP-054, CMP-057, CMP-067, CMP-072 and CMP-079 itself; every other result is as recorded by the agent, reviewer or owner named in the Source column, and was not re-run here |
| Code under test | `main` at `7a9142d` (after PR #86, CMP-067); the other tickets' rows were checked on the `main` of the day they merged |
| Staging | The staging Apps Script deployment, spreadsheet and Drive folder; production was touched only by CMP-064 with the owner (masked results below). The staging and production `/exec` URLs, spreadsheet and folder IDs, SINPE values and test inboxes are never written here |
| Browser checks | Chromium (Playwright) at 1280 / 900 / 375 px, `es` and `en`, against the built site (`dist/`) |
| Evidence | Masked JPEGs in [`evidence/sprint-03/`](evidence/sprint-03/) (7 files, under 200 KB in total). The staging evidence of the other tickets is in their PR bodies and ticket rows, in words with no personal data |
| Public repository | Findings of the pre-test review appear only as neutral IDs ("SEC-00N, tracked privately"); no severity or detail is written here |

Legend: **Pass**, **Fail**, **N/A** (cannot be exercised, with the reason), **Moved** (owner
decision), **Pending** (waits on something not yet done).

## 2. Results per ticket

### CMP-052 — Alert email to every address in `ALERT_TO` (US-024; PR #59, evidence PR #70)
| Check | Result | Source |
|---|---|---|
| The daily alert goes to every address in `ALERT_TO`, still at most once a day | Pass | Staging, owner, 2026-10-27: arrived in both a Gmail and an Outlook inbox |
| An invalid address is skipped and logged without the address | Pass | The sending run's execution log showed the skipped entry as a count, no address |
| With one address, the alert reaches it | Pass | First alert after the CMP-053 burst |
| With `ALERT_TO` empty, the alert goes to `MAIL_REPLY_TO` | Pass (mock run only) | A live test would email Cami; checked with a mock run (ticket row) |
| Addresses come only from script properties, never from a request, the repo or the logs | Pass | `apps-script/Alerts.js` (read by Agent 3): `ALERT_TO` is read only from the script property; an invalid address is skipped and only a count is logged |

### CMP-053 — Exact counters and limiters under parallel requests (US-024; PR #55, evidence PR #70)
| Check | Result | Source |
|---|---|---|
| Burst of parallel requests, no request fails because of the counters | Pass | Staging burst of 118 requests after the merge: no server or network error, slowest answer 9.8 s |
| Per-minute limits hold exactly | Pass | `register` 20 answered / 25 `RATE_LIMITED`; coupon checks per minute 30 / 2 |
| `throttled`, `honeypotHits`, `couponFailures` equal the answers given | Pass | `Metrics` row after the flush: honeypotHits 11, throttled 27 (25 + 2); the other counters matched |
| Legitimate registrations inside a burst are accepted | Pass | 2 free registrations accepted inside a register burst |

### CMP-050 — Deploy tool dependencies (PR #56, evidence PR #70)
| Check | Result | Source |
|---|---|---|
| `npm audit` in `.github/clasp` reported | Pass | 3 high on 2026-10-27 |
| A `clasp` release fixes the 3 warnings and the pin is bumped, or the row records why it waits | Pass (waits, recorded) | `body-parser` fixed by a lockfile-only update; the other 2 (`zod`, `@google/clasp` through `zod`) wait: no clasp release past 3.4.1 moves `zod`, and the only forced fix is a downgrade the deploy scripts do not support. Re-check when clasp > 3.4.1 is published (CMP-071 sets the cadence) |
| The staging deploy stays green | Pass | Deploy run on the merge installed clasp from the refreshed lock, smoke request included |

### CMP-054 — `/favicon.svg` (PR #65)
| Check | Result | Source / evidence |
|---|---|---|
| The `/favicon.svg` link resolves (an icon the owner approved) | Pass | Owner chose the proposed navy tile with a rose "C" (2026-10-27); `GET /favicon.svg` returns 200 `image/svg+xml` at 1280, 900 and 375 px; [`CMP-054-favicon-render.jpg`](evidence/sprint-03/CMP-054-favicon-render.jpg) |
| No 404 on page load | Pass | No response with status 400 or above in the load, dev server. The live site got the icon with the release upload (CMP-068, 2026-10-27) |

### CMP-057 — Developer guide (PR #64)
| Check | Result | Source |
|---|---|---|
| `CONTRIBUTING.md` from the kit's developer-guide template: setup, commands, structure, conventions | Pass | Reviewed against the kit template at v1.2.0 by the review agent; the template reached the session through the coordinator (the kit could not be attached) |
| Commands in the guide match the repo (`npm run dev`, `npm run build`, `node --check`, docs link check, the deploy workflows) | Pass | Reviewer re-ran the build and the link check; the Node range matches Vite 7 (`^20.19.0 \|\| >=22.12.0`) |
| `README.md` links to it and its status lines are true | Pass | README description and status match `PROJECT_CONTEXT.md`; the Deploy line no longer says "No CI/CD yet" |

### CMP-056 — Security baseline (PR #58)
| Check | Result | Source |
|---|---|---|
| Baseline from the kit template: classification, ASVS 5.0.0 level and inventory, OWASP Top 10 / API Top 10 risks as acceptance criteria, NIST SSDF mapping, secret and dependency scanning, PTES deadline rule | Pass | Merged with the owner's approval on merge (ticket row); the Top 10 criteria are SAC-01..SAC-17 in USER_STORIES → Security (CMP-070) |
| The PTES deadline written as a date | Pass | CMP-069 (PR #85, merged 2026-10-27): deadline **2026-12-26** in baseline §5 (go-live date 2026-10-27 plus 60 days) |

### CMP-062 — Pen-test plan (PR #60)
| Check | Result | Source |
|---|---|---|
| `PENTEST_PLAN.md`: scope (covers production, since the test runs after the go-live), out of scope, rules of engagement, timing, the written authorization form, report format, retest | Pass | Merged (PR #60); no URLs, IDs or secrets in it. The owner finds and books the tester before the deadline |

### CMP-063 — Pre-test security review (PR #62)
| Check | Result | Source |
|---|---|---|
| ASVS-based code review of `apps-script/` and the form | Pass | `docs/security/PRETEST_REVIEW.md`; findings tracked privately, each as a ticket (SEC-001..SEC-005 → CMP-072..CMP-076) |
| Scan of staging, only after the owner's written authorization | Moved | Owner decision (2026-10-27): the staging scan is not run here; its checks wait for the PTES test (CMP-062) |
| Owner's SAC-13 check (site headers) | Fail, then fixed | The owner found no HTTP→HTTPS redirect and none of the four headers; classified as a defect, ticket CMP-079 (below) |
| Owner's SAC-15 check (sharing settings) | Pass | Staging met (2026-10-27); production met after CMP-064; the cookie question was resolved by the owner (GoDaddy visitor statistics off, no cookies; CMP-087, CMP-088) |

### CMP-072 to CMP-076 — Security fixes found by CMP-063 (tracked privately)
No detail here, by design. The checks recorded on each ticket:
| Ticket | Check | Result | Source |
|---|---|---|---|
| CMP-072 (PR #66) | Dependency updates; `npm audit` reports 0 vulnerabilities after the fix; build passes | Pass | Reviewer re-ran `npm audit`, `npm ci` and the build. The owner confirms against the private record that the change is the whole fix (CMP-068 §3b statement) |
| CMP-073 (PR #72) | Checked on staging after the merge | Pass | Answers as expected; `Metrics` before and after matched them (couponFailures +21, throttled +4) |
| CMP-074 (PR #76) | Checked on staging after the merge | Pass | The staging project still held the removed file until CMP-084's deploy removed it; the owner confirmed in the editor |
| CMP-075 (PR #73) | Checked on staging after the merge | Pass | The owner ran the permissions step; events in both languages and an invalid registration gave the usual answers; the 5-minute trigger completed |
| CMP-076 (PR #74, evidence PR #79) | Checked on staging after the merge, with a test row added and removed by the owner | Pass | Answers as expected for the test row, an unknown code and a published event |

### Owner settings of the security baseline §7 (CMP-086, CMP-088; release-checklist §3b)
| Check | Result | Source |
|---|---|---|
| GitHub secret scanning, push protection, Dependabot alerts and private vulnerability reporting on the repository (the four switches) | Pass | Owner, 2026-10-27: "repo: all 4 on" (recorded in baseline §7, CMP-086) |
| Two-factor sign-in on the owner's Google, GitHub and GoDaddy accounts and on Cami's Google account | Pass | Owner, 2026-10-27: "2FA: GitHub, Google, GoDaddy on; Cami on" |
| No cookie set by a fresh visit to the live site (GoDaddy visitor statistics off) | Pass | Owner, 2026-10-27 (CMP-087, CMP-088); checked again before the CMP-068 upload |

### CMP-084 — Deploy checks the project's files against the repo (PR #78)
| Check | Result | Source |
|---|---|---|
| A deploy forces a full push when the project holds files the repo lacks, logs the count only, and warns after the push if any is left | Pass | Staging deploy of the merge (run 14): forced full push, 15 files pushed, "holds no file that the repo does not have", version 29, smoke PASS; the owner confirmed the editor shows no extra file |

### CMP-079 — HTTPS redirect and security headers (PR #69; SAC-13)
| Check | Result | Source |
|---|---|---|
| `public/.htaccess` is emitted to `dist/` | Pass | `npm run build` |
| 301 to HTTPS, HSTS (plain `max-age=31536000`, no `includeSubDomains`/`preload`), `nosniff`, `Referrer-Policy`, no directory listing | Pass (file reviewed; not run on Apache) | The reviewer checked each directive against SAC-13 and the plan; Apache is not available here |
| CSP allows only the site, Google Fonts, the events backend and its redirect host, `https:` images, with `frame-ancestors 'none'` | Pass | Same file |
| The whole page under exactly this CSP, no violation: events and ticker, a coupon check, a registration with an upload against staging, both languages, 1280/900/375 px | Pass | Local serve of `dist/` with the header (a small local server, not committed), headless Chromium: 7 staging events (one with an external `https:` picture) and the ticker, "Cupón no válido" for an invalid coupon, one test registration reaching "Inscripción recibida" (375 px), a duplicate refused on resubmit; console clean, no failed request. The events API was also mocked for the other widths. A control with `default-src 'none'` logs violations, so the check detects them |
| After the CMP-068 upload: the redirect, the four headers and a clean console on the live site | Pass | Owner, 2026-10-27, on the live site (CMP-068 step 8): "307 yes, 4 headers yes, console clean, no listing". The 307 was the browser's own HTTPS upgrade (HSTS); the server's redirect, checked with `curl -sI http://camihernandez.com`, is a 301 with an `https` location |

### CMP-064 — Production backend setup and first approved deploy (PR #63, with the owner)
| Check | Result | Source |
|---|---|---|
| Production project, first upload (15 files, manifest applied, Drive service present), one web-app deployment (Execute as Me, access Anyone, serving the deployed version) | Pass | Owner, masked results, 2026-10-27 |
| Production script properties set; the 7 `LIMIT_*`/`ALERT_*` values match runbook §2.4; the real SINPE values typed by the owner only | Pass | Owner: "values are correct all 7 numbers match" |
| `production` environment with a required reviewer and the 3 secrets; the first dry run stopped at a wrong secret, the second passed; the approved deploy pushed 15 files, smoke PASS | Pass | Workflow runs 40556849005 (dry run, stopped), 40557305479 (dry run, passed), 40558004554 (deploy) |
| Both triggers installed (`refreshEventsCache` 5 min, `retryPendingChecks` 10 min), first runs Completed | Pass | Owner |
| Production spreadsheet and Drive folder restricted, no link sharing, access for the owner and Cami only (SAC-15) | Pass | Owner |
| The runbook has the token-expiry note | Pass | Runbook §5.1 and §2.5 |
| The production `/exec` URL handed to the owner privately for CMP-068 | Pass | Never committed |

### CMP-065 — Real-iPhone check on staging (US-019, US-022): **Moved**
Owner decision, 2026-10-27: go live first, and test with the first iPhone available afterwards, on
production with a live event: a Camera photo, the same photo from Files and a screenshot, each with
a different test email; the test rows and files are deleted afterwards; a problem becomes a bug
ticket ([`release-checklist.md`](../process/release-checklist.md) §3b, CMP-089). The one risk
the check would have caught is an iPhone that cannot upload at all; a camera photo in HEIC is
already accepted and stored but is not auto-checked, so Cami reviews that payment by hand. The
HEIC follow-up decision (CMP-033 observation 6) moves with it. The test-site takedown items are in
the cleanup list below.

### CMP-067 — Lifetools logo (US-017; PR #86)
| Check | Result | Evidence |
|---|---|---|
| Cami's logo (from the owner, not from the web) replaces the marked placeholder for events without their own picture | Pass | The owner attached it in chat; `public/images/lifetools-logo.png` (the placeholder SVG removed); used as received, not redrawn or recolored |
| Checked at 1280 / 900 / 375 px in EN and ES: loads, not cropped (`object-fit: contain` on the cream tile), the alt text is "Lifetools logo" / "Logo de Lifetools" | Pass | [1280 ES](evidence/sprint-03/CMP-067-logo-card-1280-es.jpg), [1280 EN](evidence/sprint-03/CMP-067-logo-card-1280-en.jpg), [900 ES](evidence/sprint-03/CMP-067-logo-card-900-es.jpg), [900 EN](evidence/sprint-03/CMP-067-logo-card-900-en.jpg), [375 ES](evidence/sprint-03/CMP-067-logo-card-375-es.jpg), [375 EN](evidence/sprint-03/CMP-067-logo-card-375-en.jpg) (a mocked event without a picture; the text on the cards is test data) |

### CMP-069 — PTES deadline date (Agent 2; PR #85)
| Check | Result | Source |
|---|---|---|
| Once the owner sets the go-live date, the baseline states the PTES deadline as a date (go-live plus 60 days), merged before the upload | Pass | Go-live date 2026-10-27 (owner: "go live TODAY if possible"); baseline §5 and §7 give 2026-12-26. If the upload slips past that Costa Rica date, CMP-068 states the actual upload date and Agent 2 moves the deadline |

### CMP-059 — Cami's approved copy changes (US-019, US-025; Agent 1)
| Check | Result | Source |
|---|---|---|
| The approved emails, form wording, amount format (`₡15,000` in both languages) and the optional `contactOptIn` checkbox work on staging | Pass | Owner's staging check, 2026-10-26 ("all OK", staging v21), recorded in the CMP-060 row |

### CMP-068 — Events go-live: release v1.1.0 (US-017..US-025; PR #88)
Owner's reports, verbatim, 2026-10-27 (Costa Rica time; the upload was before 18:06, so the go-live date
stays 2026-10-27 and the PTES deadline 2026-12-26 is unchanged), relayed by the coordinator. No URL,
ID, participant or event name is recorded here.
| Step | Check | Result | Owner's words |
|---|---|---|---|
| 1-2 | Clean `main` with version 1.1.0; production URL in an untracked file | Pass | "steps 1-2 ok" |
| 3-4 | Build; the bundle holds exactly one production URL (last six characters compared by eye) and the file is deleted | Pass | "build ok, 1, one line, matches production, file deleted" |
| 5 | Cookie gate on the live site before the upload; backup saved outside `public_html/` and downloaded | Pass | "no cookies"; "backup saved and downloaded" |
| 6-7 | Upload (with `.htaccess`) and a first look | Pass | "uploaded, site loads" |
| 8 | HTTPS redirect, the four headers, clean console, no directory listing (SAC-13) | Pass | "307 yes, 4 headers yes, console clean, no listing"; the owner ran `curl -sI http://camihernandez.com | head -n 3` on their own computer: "301 with https location"; the review agent's own read-only requests on 2026-10-28 00:08 UTC confirm it: `http://` answers 301 with an `https` location, `https://` carries `Strict-Transport-Security: max-age=31536000`, `X-Content-Type-Options: nosniff`, the `Referrer-Policy` and the CSP of PR #69 with no `Set-Cookie`, and `/assets/` answers 403 (no listing) |
| 9 | Events section and ticker on the live site, EN and ES, phone and computer | Pass | "event shown and everything seems to work"; "email yes, EN/ES and phone yes". Before the check the owner added a real upcoming event of Cami's (published); it was first hidden because its date was in the past and shown once the owner fixed the date |
| 10 | One real registration by the owner, with a coupon and a test receipt; cleanup | Pass | "I was able to subscribe to an event, apply coupons and validate a receipt (testing receipt of course)". **Deviation from the walk-through:** the registration went on that real event, not a separate test event. Cleanup, asked by the coordinator in three points and answered by the owner (2026-10-27/28): (a) the test registration row(s) deleted from the event's tab, (b) the receipt file(s) deleted from its Drive folder, (c) which coupon was used. Owner: "a yes, b yes, c real coupon, deleted"; asked whether "deleted" meant the coupon row was removed from the `Coupons` tab: "coupon row still there, te registrations are also real so nothing to delete, no worries about that". Read as: the test rows and files are gone, the real coupon row is intact, and the other registrations on that event are real ones. Capacity and coupon uses are counted from the live rows (contract), so nothing else needs restoring |
| 11 | Tag and GitHub Release | Pass | "release published"; the coordinator verified `v1.1.0` exists on GitHub (published 2026-10-28 00:06 UTC) |

Gates, risks and the moved iPhone check are in the PR #88 body. Live traffic from this check is in the
production `Metrics` row of 2026-10-27.

### Docs-only tickets
CMP-055, CMP-058, CMP-060, CMP-061, CMP-070, CMP-077, CMP-078, CMP-080, CMP-081, CMP-083 and
CMP-085 to CMP-089 are docs PRs by the coordinator, and CMP-082 and CMP-088 are docs PRs by Agent 2.
They carry no behavior to verify beyond the docs link check, which passed on each PR.

## 3. Fails and observations

| # | Item | Class | Proposal |
|---|---|---|---|
| 1 | The owner's SAC-13 check found no HTTPS redirect and no security headers on the live site | Defect found by the check | Fixed by CMP-079; the live check after the CMP-068 upload passed (2026-10-27): closed |
| 2 | CMP-050: 2 high `npm audit` warnings in the CI-only deploy tool remain (no fixed `clasp` release) | Accepted, recorded in the row | Re-check when `clasp` > 3.4.1 is published; cadence in CMP-071 (Sprint 04 proposal) |
| 3 | `ARCHITECTURE_SPEC.md` and the events implementation plan still call the logo a placeholder | Doc lag | The coordinator updates them after PR #86 merges (coordinator, 2026-10-27) |
| 4 | `.htaccess` was not run on Apache (none available here); a host that disallows `Options` overrides answers every page with a 500 | Residual risk, closed | The live site loaded and the headers were present after the upload (CMP-068 steps 7 and 8) |
| 5 | The CMP-068 test registration went on a real event of Cami's instead of a separate test event | Deviation from the walk-through; cleaned up, confirmed by the owner (step 10) | None; for the next release, add a test event before the check (walk-through step 10) |
| 6 | The owner proposes automated site deploys (GitHub Actions to GoDaddy over FTP, with approval and a backup) | Improvement | A Sprint 04 ticket (the coordinator adds it) |

No Fail in the sprint's own checks is open.

For the Sprint Review, the items that move on: the real-iPhone check and its HEIC follow-up decision
(CMP-065, after the go-live), the PTES test (CMP-062, within 60 days of the go-live), and the
dependency checks, Dependabot updates and SBOM proposed for Sprint 04 (CMP-071).

## 4. Staging cleanup list (for the owner)

Items 1 to 6 were done by the owner on 2026-10-27 (owner, relayed by the coordinator: "Pages
unpublished, secret deleted, SINPE restored, rows deleted", and, asked about the Drive file and the
Metrics rows, "yes, both").

| # | Item | Status |
|---|---|---|
| 1 | Unpublish the GitHub Pages test site | Done (owner) |
| 2 | Delete the repository secret `STAGING_EVENTS_API_URL` | Done (owner) |
| 3 | Real SINPE values back in the staging script properties | Done (owner) |
| 4 | Delete the `TPAID` row of the CMP-079 test registration (a masked `example.com` email) and its screenshot file in the staging Drive folder | Done (owner) |
| 5 | Delete the `TFREE` rows "Burst legit 0" and "Burst legit 1" (CMP-053 burst; no files) | Done (owner) |
| 6 | Delete the `Metrics` rows of 2026-10-26 and 2026-10-27 (test counts only) | Done (owner) |

Other tests of the sprint left nothing to delete beyond what is listed: the CMP-052 alert test
sent emails to the owner's inboxes only; the CMP-076 test row was removed by the owner (ticket
row). The coupon checks of the CMP-079 run used an invalid code, so Agent 3 created no coupons;
the owner confirmed (2026-10-27, relayed by the coordinator) that the staging `Coupons` tab holds no
test coupon from the sprint's tests: "no test coupons at all, I removed them all". Production
holds no test data from this sprint: CMP-064 sent only a smoke request (read-only). The production
test registration by the owner (CMP-068 step 10) was cleaned up by the owner (rows and receipt files deleted, the real coupon row intact; owner's words in §2, CMP-068, step 10).

After the go-live, the iPhone check (CMP-065, moved) adds its own test rows and files on production,
to be deleted by the owner afterwards.
