# ADR-008 — Backend for events and registrations: Google Apps Script web app

- Status: Proposed (CMP-019 Discovery; not accepted by that PR). The refinement PR that makes
  the events stories `Ready` sets it to "Accepted (on merge of PR #N)" or replaces it
  (pr-workflow §5).
- Date: 2026-10-19
- Decision owner: Raul Casanas
- Related specs: [FEATURE_SPEC_events_registration.md](../specs/FEATURE_SPEC_events_registration.md),
  [TECH_STACK.md §5–7](../../TECH_STACK.md#5-backend), [ADR-002](ADR-002-godaddy-static-hosting.md)

## Decision Request
The events feature (US-017..US-023) needs server-side code to read events and coupons, accept a
registration with an image upload, save the image to Google Drive, append rows to Google Sheets
and read text from the image. What runs that code?

## Context
- The site is static on GoDaddy shared hosting with no server runtime (NFR-001, ADR-002).
- Zero license cost, free tier first (NFR-003).
- All data must end up in Cami's Google Drive and Sheets, which she already uses.
- TECH_STACK §5 anticipated a Node.js backend "when the backlog requires it" without choosing a
  host.

## Decision Drivers
- ₡0 recurring cost.
- Native, low-setup access to Drive, Sheets and OCR.
- No secrets in the browser or the repo.
- Cami can see and fix data without a developer.
- Small operational surface for a one-developer project.

## Options Considered

### Option A — Google Apps Script web app (recommended)
A script bound to the events spreadsheet, deployed as a web app (`doGet` for events/coupon
check, `doPost` for registrations), running as the owning Google account.
Pros:
- Free; built-in `SpreadsheetApp`, `DriveApp` and Drive OCR (Advanced Drive Service) with no
  credentials to manage.
- Data and code live next to each other in Cami's Google account.
- No server to host or patch.
Cons:
- Web-app quirks: POST from the browser must avoid a CORS preflight (e.g. `text/plain` body
  with JSON), responses come through a redirect; no custom domain.
- Quotas (execution time 6 min/run, daily triggers/URL fetch limits) and ~50 MB payload — fine
  for this volume.
- The request event carries **no client IP and no request headers**: per-client rate limits
  are impossible, and the script cannot read `Origin` or set CORS headers, so it cannot restrict
  which sites call it. The endpoint is anonymous, callable from anywhere, and runs as Cami's
  account with write access to her Drive.
- Code lives outside the repo unless synced with `clasp` (to be decided in the plan).
Risks:
- Deployment URL changes if redeployed incorrectly; mitigated by a documented deploy runbook.
- Abuse of the anonymous endpoint: coupon-code enumeration, or uploads filling the storage
  shared with Cami's Gmail/Drive and exhausting daily quotas. Mitigations available on Apps
  Script: global throttling (`CacheService` + `LockService`), a daily upload cap, long random
  coupon codes, a honeypot, and optionally a server-verified captcha (FEATURE_SPEC §12, Q-19).

### Option B — Serverless functions (Cloudflare Workers / Netlify / Vercel free tier) + Google APIs
Pros:
- Code in the repo, standard JS tooling, real CORS control.
Cons:
- Needs a Google Cloud project, service account and secret management; Drive OCR or Cloud
  Vision setup; another provider account.
Risks:
- Free-tier terms change; more moving parts for one developer.

### Option C — Google Forms (embedded or linked)
Pros:
- Zero code, native Sheets/Drive storage.
Cons:
- File upload requires the participant to sign in to Google; no per-event pricing or coupon
  logic; cannot match the site design; no OCR check.

### Option D — Node.js server
Pros:
- The backend TECH_STACK §5 anticipated.
Cons:
- Not possible on the current shared hosting; needs a paid or new host (conflicts with NFR-001
  and NFR-003 today).

## Decision
Proposed: **Option A**, to be confirmed when the stories are refined. The site calls the web
app over HTTPS; the contract is defined in `docs/specs/EVENTS_API_CONTRACT.md` before
implementation.

## Rationale
- It is the only option that is both free and native to where the data must live, with no
  secrets to manage.

## Consequences
### Positive
- First backend with no hosting change; Cami's data stays in her Google account.
### Negative / Trade-offs
- Apps Script tooling is weaker than a normal JS backend (testing, local runs).
- The project moves from **Simple** to **Standard** complexity (TECH_STACK §1).

## Architecture Impact
- New external system in ARCHITECTURE_SPEC §5/§10; new runtime data flow (events fetched at
  runtime instead of bundled).

## Implementation Impact
- TECH_STACK §5–7, §11 updated; a deploy runbook for the script; a staging copy of the
  spreadsheet and folder for previews and tests (ADR-007 decision 6).

## Validation
- A spike proves: events read from Sheets, an upload of a SINPE sample saved to Drive, a row
  appended, and Drive OCR extracting number/amount/description from Cami's sample screenshots.

## Review Trigger
- Volume or features outgrow Apps Script quotas, or a payment gateway is introduced.
