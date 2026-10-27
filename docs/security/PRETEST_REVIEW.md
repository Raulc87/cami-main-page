# PRETEST_REVIEW

Pre-test security review (CMP-063): an OWASP ASVS 5.0.0 level 2 review of the events backend
([`apps-script/`](../../apps-script/)) and the registration form
([`src/components/EventRegistration.jsx`](../../src/components/EventRegistration.jsx),
[`src/api/events.js`](../../src/api/events.js)), against the security acceptance criteria
SAC-01..SAC-17 of [`SECURITY_BASELINE.md`](SECURITY_BASELINE.md) §3 and the rows of
[`ASVS_INVENTORY.md`](ASVS_INVENTORY.md) marked "Planned (CMP-063)". It is **not** the
penetration test (`docs/security/PENTEST_PLAN.md`, CMP-062), and nothing in it was run against
production or the live site.

## Metadata
- Reviewer: Implementation Agent 2 (security), Sprint 03
- Status: In progress: code review done; the staging check waits for the owner's written
  authorization on the CMP-063 PR (§3)
- Code reviewed: `main` at commit `5566e56` (2026-10-27), which includes CMP-053 and CMP-050
- Last updated: 2026-10-27

## 1. How findings are recorded

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
network traffic to the project's systems). Results: **Met in code** means the code does what the
criterion asks; **Staging** means the behavior is confirmed by the staging check (§3);
**Owner check** means a setting only the owner can see.

| Criterion | Code review result | Still to do |
|---|---|---|
| SAC-01 Server-side validation | Met in code: every field re-validated on the server against contract §3.3 (`RegisterValidate.js`, `Coupons.js`); unknown fields ignored; `contactOptIn` true only for the JSON boolean; honeypot answered as a success with nothing stored; sheet rows validated (`Validate.js`) | Staging |
| SAC-02 No formulas from input | Met in code: `neutralize` (`Sheets.js`) prefixes values starting with `=`, `+`, `-`, `@`, tab, CR or a digit; applied to name, email, WhatsApp and coupon; the other cells are server values | Staging |
| SAC-03 Untrusted text shown as text | Met in code: React text nodes only, no `dangerouslySetInnerHTML`, `innerHTML` or `eval` in `src/`; emails are plain text (`Mail.js`) | Staging (one event with markup) |
| SAC-04 Safe image links | Met in code: `imageUrl` kept only when it matches `https://` (`Validate.js`), otherwise `null` and the logo | Staging |
| SAC-05 Upload checks | Met in code: size checked before and after decoding, type from the first bytes (`detectImageType_`), file name from BR-E04 (`fileSafeName_`), uploaded name ignored, private folder | Staging |
| SAC-06 Abuse limits | Met in code: per-minute windows and daily caps (`Limits.js`), counted exactly since CMP-053. SEC-002 | Staging (below the limits only); the CMP-053 burst covers the limits themselves |
| SAC-07 No double booking, no partial records | Met in code: capacity, duplicate and coupon checks and the append under the script lock, coupon re-read under the lock, file trashed when the row fails (`Register.js`) | Staging (two parallel requests for a last place) |
| SAC-08 Only the data each answer needs | Met in code: answers carry only the contract §7 fields; no coupon list; a stored `submissionId` returns only its reference and flag. SEC-005, SEC-006 | Staging |
| SAC-09 Only the public actions are reachable | Met in code: `doGet`/`doPost` route only `events`, `coupon`, `register`, anything else `SERVER_ERROR` (`Code.js`); editor-only functions are not routed. SEC-003 | Staging |
| SAC-10 Safe failure | Met in code: top-level `try`/`catch` returns `SERVER_ERROR` with a fixed log line; after-store steps never fail a stored registration | Staging (malformed bodies) |
| SAC-11 Logs without personal data | Met in code for web-app requests: log lines carry fixed text and error names (and Google's lock messages, CMP-053). SEC-003 | — |
| SAC-12 No secrets in the code or the bundle | Met: no secret, ID or SINPE value in the repository; the production build has no source maps (`dist/` checked locally); `VITE_EVENTS_API_URL` comes from the environment | Release check (CMP-068) |
| SAC-13 HTTPS and browser protections on the site | Not checkable from the code (GoDaddy settings) | Owner check of the live site in the browser's developer tools (baseline §7) |
| SAC-14 Known, current dependencies | Lockfiles committed; actions pinned by commit; deploy only from `main` (ADR-009). SEC-001; the deploy tool's audit is CMP-050 (the pin waits for a fixed `clasp` release) | Fix of SEC-001 |
| SAC-15 Private storage and minimal data in the browser | Met in code: `localStorage` holds only `cmp-lang`; no analytics or trackers; consent required, opt-in false by default | Owner check of the sharing of the spreadsheet and folder |
| SAC-16 No email abuse beyond the accepted risk | Met in code: one address per registration (`EMAIL_RE` allows a single `@`, no spaces or line breaks), fixed templates, plain text | Staging |
| SAC-17 Known endpoints | Matches the baseline §6 inventory | Release check (CMP-068) |

Scopes and editor-only code (baseline §7 item "script scopes and editor-only helpers"): reviewed;
see SEC-003 and SEC-004.

## 3. Staging check (waiting for the owner's written authorization)

Proposed, for the owner to authorize, change or refuse **in writing on the CMP-063 PR**. Nothing
is sent before that authorization.

- **Scope:** the **staging** Apps Script web app only, its three actions. Never production, the
  live site, the GitHub Pages test site, or Google's or GoDaddy's systems.
- **Tool:** a short script of the security agent (Node.js `fetch`, no third-party scanner), kept
  outside the repository, that sends hand-written requests for the "Staging" items of §2. The
  staging URL is given privately (through the coordinator) and never written to a tracked file,
  a log or GitHub.
- **Rate and volume:** at most 6 requests a minute and 120 in total; at most 15 registrations,
  only on test events, and at most 8 uploads (small synthetic images, one near 5 MB). No request
  is sent to pass a rate limit (the CMP-053 burst covers the limits).
- **Emails:** registrations use only the test inbox the owner gives privately; at most 15
  confirmation emails.
- **Test data:** test events and one test coupon the owner creates on staging (codes given
  privately): one free event, one paid, one paid with capacity 1. Afterwards the security agent
  sends the list of every submission, and the owner deletes the rows, files and coupon use (also
  in the CMP-066 cleanup list).
- **Time window:** one window of up to 2 hours chosen by the owner, never during the CMP-064
  deploy and smoke, the CMP-053 burst or the CMP-065 iPhone check.
- **SINPE values:** the staging `events` answer shows the SINPE number and account name set on
  staging, so for the window the owner sets the test values (as for the GitHub Pages test window,
  TECH_STACK §10) and restores the real ones after; the security agent never receives real SINPE
  data.
- **Alert settings:** before the window the owner raises the staging alert thresholds
  (`ALERT_HONEYPOT_PER_DAY`, `ALERT_THROTTLED_PER_DAY`), as for the Sprint 02 burst; right after,
  the owner restores them.
- **Quotas:** staging shares the owner's Google quotas with production; the volumes above are a
  small part of the daily limits, and the check stops at the first sign of a quota or limit
  error.

## 4. Findings

| Finding | Status |
|---|---|
| SEC-001: security fix, tracked privately | Proposed ticket sent to the coordinator |
| SEC-002: security fix, tracked privately | Proposed ticket sent to the coordinator |
| SEC-003: security fix, tracked privately | Proposed ticket sent to the coordinator |
| SEC-004: security fix, tracked privately | Proposed ticket sent to the coordinator |
| SEC-005: security fix, tracked privately | Proposed ticket sent to the coordinator |
| SEC-006: security fix, tracked privately | Proposed ticket sent to the coordinator |

Before the go-live (CMP-068), every finding the private record rates critical or high is fixed
or accepted by the owner in writing; the others have a ticket or a written acceptance.

## 5. Inventory update

When the staging check is done, the rows of [`ASVS_INVENTORY.md`](ASVS_INVENTORY.md) marked
"Planned (CMP-063)" that this review confirmed become "Verified <date> (CMP-063)", and the rest
keep "Planned" with the reason, in this PR.
