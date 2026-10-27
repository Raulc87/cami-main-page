# PRETEST_REVIEW

Pre-test security review (CMP-063): an OWASP ASVS 5.0.0 level 2 review of the events backend
([`apps-script/`](../../apps-script/)) and the registration form
([`src/components/EventRegistration.jsx`](../../src/components/EventRegistration.jsx),
[`src/api/events.js`](../../src/api/events.js)), against the security acceptance criteria
SAC-01..SAC-17 of [`SECURITY_BASELINE.md`](SECURITY_BASELINE.md) §3 and the rows of
[`ASVS_INVENTORY.md`](ASVS_INVENTORY.md) marked "Planned (CMP-063)". It is **not** the
penetration test ([`PENTEST_PLAN.md`](PENTEST_PLAN.md), CMP-062), and nothing in it was run against
production or the live site.

## Metadata
- Reviewer: Implementation Agent 2 (security), Sprint 03
- Status: Done. Code review done; the staging check was not run and its items move to the PTES
  test (§3, owner decision 2026-10-27); the owner's checks of SAC-13 and SAC-15 done 2026-10-27
  (§2b)
- Code reviewed: `main` at commit `5566e56` (2026-10-27), which includes CMP-053 and CMP-050
- Last updated: 2026-10-27

## 1. How findings are recorded

The owner keeps the private record (a private document outside the repository, owner decision
2026-10-27).

This repository is **public**. Until a finding is fixed and the fix is released, it appears here
only as a neutral ID and wording ("SEC-00N: security fix, tracked privately"), **with no
severity**. Its details, severity and proposed fix go to the coordinator privately, who arranges
private tracking with the owner (coordinator decision for CMP-063; the kit's rule, baseline §7).
Every critical or high finding is fixed, or accepted by the owner in writing, before the go-live
(CMP-068). After a fix is released, its entry here may say what it was.

## 2. Code review (2026-10-27)

Method: reading every backend file and the form against each criterion and its ASVS rows; a
search of [`src/`](../../src/) and [`apps-script/`](../../apps-script/) for dynamic code, HTML
injection points, outbound requests and logging; `npm audit` on both lockfiles (local, no
network traffic to the project's systems).

While findings are open, this public table records only **what was reviewed and what is left**,
not whether each criterion is met: the result per criterion is in the private record (§1), and it
is published here once the fixes are released. **PTES test** means the behavior on a running
system is checked by the penetration test (§3); **Owner check** means a setting only the owner can see; **Release check**
means it is checked when a release is prepared.

| Criterion | Code review | Still to do |
|---|---|---|
| SAC-01 Server-side validation | Reviewed 2026-10-27 | PTES test |
| SAC-02 No formulas from input | Reviewed 2026-10-27 | PTES test |
| SAC-03 Untrusted text shown as text | Reviewed 2026-10-27 | PTES test |
| SAC-04 Safe image links | Reviewed 2026-10-27 | PTES test |
| SAC-05 Upload checks | Reviewed 2026-10-27 | PTES test |
| SAC-06 Abuse limits | Reviewed 2026-10-27 | PTES test (the CMP-053 burst on staging covers the limits themselves) |
| SAC-07 No double booking, no partial records | Reviewed 2026-10-27 | PTES test |
| SAC-08 Only the data each answer needs | Reviewed 2026-10-27 | PTES test |
| SAC-09 Only the public actions are reachable | Reviewed 2026-10-27 | PTES test |
| SAC-10 Safe failure | Reviewed 2026-10-27 | PTES test |
| SAC-11 Logs without personal data | Reviewed 2026-10-27 | — |
| SAC-12 No secrets in the code or the bundle | Reviewed 2026-10-27 | Release check (CMP-068) |
| SAC-13 HTTPS and browser protections on the site | Not checkable from the code (GoDaddy settings) | Owner check done 2026-10-27: **not met**, see §2b; fix CMP-079 before the go-live |
| SAC-14 Known, current dependencies | Reviewed 2026-10-27 (the deploy tool's audit is CMP-050) | Release check (CMP-068) |
| SAC-15 Private storage and minimal data in the browser | Reviewed 2026-10-27 | Owner check of staging done 2026-10-27: sharing met, see §2b; production met 2026-10-27 (CMP-064); cookies resolved 2026-10-27 (§2b), checked again after the go-live upload |
| SAC-16 No email abuse beyond the accepted risk | Reviewed 2026-10-27 | PTES test |
| SAC-17 Known endpoints | Reviewed 2026-10-27 | Release check (CMP-068) |

The baseline §7 item on script scopes and editor-only helpers was reviewed too.

## 2b. Owner checks (2026-10-27)

The owner checked these in a normal browser (no scan), relayed by the coordinator. They concern
the live site's public configuration, which anyone can see, so they are recorded here in full.

- **SAC-13, the live site (`camihernandez.com`): not met.** `http://` does not redirect to
  `https://`, and the responses carry none of `Strict-Transport-Security`,
  `Content-Security-Policy`, `X-Content-Type-Options` or `Referrer-Policy` (only the standard
  Apache headers). Fix: CMP-079 (Agent 3, an `.htaccess` file with the redirect and the headers),
  before the go-live (CMP-068); the go-live release checklist confirms the headers on the live
  site after the upload.
- **SAC-15, staging: met.** The staging events spreadsheet and the screenshots folder are
  "Restricted", shared only with the owner's account.
- **SAC-15, production: met 2026-10-27** (CMP-064, PR #63). The owner checked the production
  events spreadsheet and screenshots folder: access only for the owner and Cami.
- **SAC-15, open question: cookies on `camihernandez.com`.** The owner's browser sent three cookies
  to the site (`_tccl_visitor`, `_tccl_visit`, `_scc_session`). The site's code sets no cookie and
  loads no script except its own bundle (fonts come from Google Fonts' stylesheet), and the
  responses the owner saw carried no `Set-Cookie`, so these were set by something else for that
  domain: most likely a GoDaddy feature, now or from an earlier GoDaddy page on the domain. The
  owner checks in a private browser window whether a fresh visit creates them (developer tools →
  Application → Cookies, and any `Set-Cookie` header). If it does not, they are leftovers and change
  nothing. If it does, the owner finds and turns off the GoDaddy feature that sets them (for example
  site statistics or a site builder in the GoDaddy or cPanel settings); if it cannot be turned off,
  the privacy notice may need to mention it, which goes to Cami (BR-E11), and SAC-15 is updated.
  Tracked by the coordinator before the go-live.

  **Resolved 2026-10-27.** The owner's private-window check: a fresh visit still created
  `_scc_session`, `_tccl_visit` and `_tccl_visitor`, all three set for `.camihernandez.com` and
  marked HttpOnly (so sent by the server, not by the site's code). They belong to GoDaddy's visitor
  statistics, which the owner turned off in GoDaddy (its message, as the owner shared it: "Real User
  Metrics tracking disabled for camihernandez.com"; GoDaddy says the change can take up to 24
  hours). A new private-window check right after showed no cookies (owner: "it shows no cookies
  now"). SAC-15 needs no exception and the privacy notice no change; the release-checklist §3b
  cookie gate is checked again after the go-live upload (CMP-068).

## 3. Staging check: not run, moved to the PTES test

A low-rate check of staging was proposed here for the owner's written authorization. The owner
agreed to it in principle, but it was **not run**. Exactly what happened: after the owner's yes
(relayed by the coordinator) and before any written authorization on this PR, the security agent
began writing the check script locally, to be run only once the authorization was posted and the
window had begun. The session's safety controls stopped it while it was being written; it was
never executed, no request was sent to staging or production, and the partial script was deleted.
The owner then posted no authorization. Decision: Owner, 2026-10-27 (relayed by the coordinator), question as asked: "The security agent couldn't run the gentle staging check: its session's safety controls blocked the script, so it sent nothing. What should happen to that check?" (options: leave it to the tester; I'll run it by hand). Owner: "Leave it to the tester (Recommended)". So:

- the "PTES test" items of §2 are checked by the human tester under
  [`PENTEST_PLAN.md`](PENTEST_PLAN.md) (CMP-062), which already covers them (its §3 threat model and §4
  methods), before the PTES deadline;
- CMP-063 closes on the code review (§2) plus the owner's two checks: SAC-13 (the live site's HTTPS
  and security headers, in the browser's developer tools) and SAC-15 (the spreadsheet and the
  screenshots folder shared only with the owner's and Cami's accounts);
- optionally, the owner may run the plain checklist in Appendix A by hand on staging before the
  go-live; it is not required.

## 4. Findings

| Finding | Status |
|---|---|
| SEC-001: security fix, tracked privately | Tracked privately; fix planned (owner decision 2026-10-27) |
| SEC-002: security fix, tracked privately | Tracked privately; fix planned (owner decision 2026-10-27) |
| SEC-003: security fix, tracked privately | Tracked privately; fix planned (owner decision 2026-10-27) |
| SEC-004: security fix, tracked privately | Tracked privately; fix planned (owner decision 2026-10-27) |
| SEC-005: security fix, tracked privately | Tracked privately; fix planned (owner decision 2026-10-27) |
| SEC-006: tracked privately | Accepted by the owner 2026-10-27 |

Before the go-live (CMP-068), every finding the private record rates critical or high is fixed
or accepted by the owner in writing; the others have a ticket or a written acceptance.

## 5. Inventory update

The rows of [`ASVS_INVENTORY.md`](ASVS_INVENTORY.md) that this review covered now read
"Planned (PTES test)": their code was reviewed here on 2026-10-27, and their behavior on a running
system is verified by the penetration test (§3). The test, or a later review, records the date
each one is verified.

## Appendix A. Optional hand checklist for the owner (staging only)

Nothing here is required (§3). If the owner wants an early look before the go-live, these are
the checks a person can do in a normal browser on the GitHub Pages test site or a local
`npm run dev` pointed at staging, with the test SINPE values set and the test events only. Write
down what happened; do not post results that show a problem on GitHub (send them to the
coordinator privately).

1. Register for a free test event with a name that starts with `=` (for example `=1+1 Test`): the
   row shows the text exactly as typed, not a calculated value (SAC-02).
2. Register with a name containing `<b>Test</b>`: the confirmation email shows the characters as
   typed, not bold text (SAC-03, SAC-16).
3. Try to upload a text file renamed to `.jpg`, and a picture over 5 MB: the form refuses both, and
   nothing appears in the Drive folder (SAC-05).
4. Register twice with the same email for the same test event: the second time shows "You are
   already registered for this event" (FFR-027).
5. In the browser's developer tools (Network), open the answer of the events request: it lists
   only the event fields and the SINPE block, with no email addresses, IDs or coupon codes (SAC-08).
6. Afterwards, delete the test rows and files, unpublish the test events and restore the real SINPE
   values on staging.
