# ADR-008 — Backend for events and registrations: Google Apps Script web app

- Status: Accepted (on merge of PR #21, CMP-021; proposed in CMP-019)
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
A standalone script that reaches the events spreadsheet through `SPREADSHEET_ID` (owner,
2026-10-20; originally worded as a script bound to it), deployed as a web app (`doGet` for events,
`doPost` for the coupon check and registrations — EVENTS_API_CONTRACT §2), running as the
owning Google account.
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
- Code lives in the repo (`apps-script/`) and the owner deploys it with `clasp` or by pasting it
  into the script editor, following a deploy runbook.
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
**Option A**, in the `lifetoolscr.com` Google Workspace (owner, 2026-10-19). The owner
deploys the script, helped by the agents and a deploy runbook; the code lives in the repo.
Two standalone projects with the same code, one for staging and one for production, because
script properties belong to the project (owner, 2026-10-20, answering the CMP-023 questions:
"1. Yes 2. Yes 3. Yes 4. Yes 5. no-reply@lifetoolscr.com"; procedure in
[events-backend-runbook.md](../process/events-backend-runbook.md)). The site calls the web
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
- A spike proves, **from the real site origin in a browser** (a page served like the GoDaddy
  site, not the Apps Script editor): events fetched; a registration with a SINPE sample image
  submitted cross-origin without a CORS preflight, through the `script.googleusercontent.com`
  redirect, with the JSON reference parsed by the page; the image saved to Drive and the row
  appended; and Drive OCR extracting Cami's SINPE number or account name and the exact amount from her sample screenshots (no
  description check, FEATURE_SPEC Q-4)
  with the temporary Doc deleted.

## Review Trigger
- Volume or features outgrow Apps Script quotas, or a payment gateway is introduced.
