# SECURITY_BASELINE

How this project applies the SDD Starter Kit's security baseline
([`AGENTS.md`](../../AGENTS.md) → Security baseline): which OWASP requirements its acceptance
criteria use, what it adds to the kit's secure-development practice, and the penetration test it
needs. Written from the kit's `SECURITY_BASELINE_TEMPLATE.md` at the kit ref in
[`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md) (CMP-056).

The baseline follows these standards, cited by these names and versions:

| Standard | Version | Used for |
|---|---|---|
| OWASP Application Security Verification Standard (ASVS) | 5.0.0 | Verifiable security requirements, chosen by level (§2) |
| OWASP Top 10 | 2025 | Web application risks the acceptance criteria must cover (§3) |
| OWASP API Security Top 10 | 2023 | API risks: the events backend is a public API (§3) |
| NIST SP 800-218, Secure Software Development Framework (SSDF) | Version 1.1 | Secure-development practices (PO, PS, PW, RV) (§4) |
| Penetration Testing Execution Standard (PTES) | Technical guidelines | Penetration test, by its deadline (§5) |
| ISECOM Open Source Security Testing Methodology Manual (OSSTMM) | 3 | Only for a high-risk or complex project (§5): not required here |

Checked 2026-10-27: these are the versions AGENTS.md and the kit name, and the latest published
ones of ASVS (5.0.0), the Top 10 (2025), the API Top 10 (2023) and the SSDF (1.1, NIST CSRC). A
newer version is adopted through a change to this baseline.

Following these standards is a practice, not a certification. Nothing here says the project is
"certified", "compliant" or "secure"; it says which requirements are covered, how, and when they
were verified.

## Metadata
- Project: cami-main-page — personal brand website for Cami Hernandez, with events and
  registration (FR-011, [FEATURE_SPEC_events_registration.md](../specs/FEATURE_SPEC_events_registration.md))
- Status: Approved (on merge of PR #58)
- Owner: Raul Casanas (product owner, final approver)
- Last updated: 2026-10-27 (CMP-056, Implementation Agent 2)
- Versions used: ASVS 5.0.0 · Top 10 2025 · API Top 10 2023 · SSDF 1.1
- Inventory appendix: [`ASVS_INVENTORY.md`](ASVS_INVENTORY.md)

## 1. Classification

Answered from the specs ([PROJECT_SPEC](../specs/PROJECT_SPEC.md) §4, §10; FEATURE_SPEC §15, §16;
[EVENTS_API_CONTRACT](../specs/EVENTS_API_CONTRACT.md)). The answers decide the ASVS level (§2)
and the penetration test (§5).

| Question | Answer | Source |
|---|---|---|
| Personal data collected or stored (which, from whom) | **Yes.** From event participants: name, email, WhatsApp number, site language, consent time, the optional contact consent (`contactOptIn`) and, for paid events, the SINPE Móvil payment screenshot. Stored in the events spreadsheet (one tab per event) and a Drive folder in the `lifetoolscr.com` Google Workspace; sent in the participant emails. Costa Rica Law 8968 applies (privacy notice approved by Cami as the legal review, BR-E11) | PROJECT_SPEC §10; FEATURE_SPEC FFR-009, FFR-014, FFR-018, FNFR-001; contract §3.3, §6 |
| Authentication (accounts, logins, admin areas, API keys issued to users) | **No**, in the application: visitors are anonymous, there are no accounts or admin area, and the API issues no keys. Administration happens outside it, with the owner's and Cami's Google accounts (spreadsheet, Drive, Apps Script) and the owner's GitHub account (deploy secrets) | PROJECT_SPEC §4 (no user accounts); FEATURE_SPEC §15; ADR-009 |
| Payments (card data, payment provider, invoices) | **No card data and no payment provider.** The visitor pays by a manual SINPE Móvil transfer outside the system; the system stores the amount due and the payment screenshot (proof of the transfer, which can show the payer's name, phone or account details) and checks it by OCR. No invoices (Q-27) | PROJECT_SPEC §4 (exception since v1.1); FEATURE_SPEC FFR-008, FFR-017, §18 |
| Exposure (public internet, internal only, API consumed by third parties) | **Public site and public anonymous API.** The site is static on GoDaddy; the events backend is a Google Apps Script web app that anyone can call, with no client address or headers and no origin check (ADR-008); abuse limits are global | ADR-002, ADR-008; contract §2, §9 |
| High-risk or complex (documentation level "Complex", or the owner classifies it high-risk: health, financial, children's or other sensitive data, critical operations) | **No (proposed; the owner decides on merge).** The project is **Standard**, not Complex (TECH_STACK §1). It holds no card data, credentials, health data or data of a group at special risk, runs no critical operation, and handles a small volume of registrations. The payment screenshots are financial-related personal data: they get the strictest protection in §6, which this baseline treats as raised protection, not as a high-risk classification. If the owner classifies the project high-risk, the OSSTMM 3 test applies (§5) and the go-live waits for it or for a new owner decision (SPRINT_03_PLAN → readiness item 5) | [TECH_STACK.md §1](../../TECH_STACK.md#1-complexity-assessment); AGENTS.md (Standard); proposal of Agent 2, 2026-10-27; owner, on merge |

## 2. OWASP ASVS level

- Level chosen: **L2** (proposed by Agent 2, 2026-10-27; the owner decides on merge)
- Why: the project handles personal data and payment screenshots (§1), for which the kit
  suggests L2. L3 is for high-risk projects, which this one is not (§1). L1 alone would leave out
  requirements that matter here: business-logic limits and locking (capacity, coupons), file
  handling, data protection and security logging.

The kit suggests, as guidance only: L1 as the minimum for every project; L2 when the project
handles personal data, authentication or payments; L3 when it is high-risk. ASVS 5.0.0 gives the
official definition of each level. The level is never lower than what the classification calls for
without a recorded reason.

**ASVS inventory.** The project handles personal data, so the inventory lists **every L1 and L2
requirement of ASVS 5.0.0, one row each** (253 requirements), with its coverage or the reason it
does not apply. It is in the appendix [`ASVS_INVENTORY.md`](ASVS_INVENTORY.md), with the
requirement text quoted from the official OWASP list. Summary by chapter:

| ASVS chapter | Applies | Coverage |
|---|---|---|
| `v5.0.0-1` Encoding and Sanitization | Partly | Output as text, formula neutralization, safe URL protocols: SAC-02, SAC-03, SAC-04, SAC-16. Not applicable: OS, LDAP, XPath, LaTeX, JNDI, XML, memory-unsafe code |
| `v5.0.0-2` Validation and Business Logic | Yes | Server-side validation, limits and locking: SAC-01, SAC-06, SAC-07 |
| `v5.0.0-3` Web Frontend Security | Partly | Text rendering and site headers: SAC-03, SAC-13. Not applicable: cookies (none), `postMessage`. Accepted: CORS and origin checks the provider does not allow (ADR-008) |
| `v5.0.0-4` API and Web Service | Partly | Content type, HTTPS: SAC-13. Not applicable: GraphQL, WebSockets |
| `v5.0.0-5` File Handling | Yes | Upload type, size and storage: SAC-05, SAC-15. Not applicable: archives, downloads. Accepted: no antivirus run by the project |
| `v5.0.0-6` Authentication | No | No authentication in the application (§1) |
| `v5.0.0-7` Session Management | No | No sessions |
| `v5.0.0-8` Authorization | Partly | Anonymous functions only; no data exposure: SAC-08, SAC-09. Not applicable: multi-tenancy |
| `v5.0.0-9` Self-contained Tokens | No | No tokens issued or accepted |
| `v5.0.0-10` OAuth and OIDC | No | Not an OAuth party for its users; the deploy token is in §4 and §6 |
| `v5.0.0-11` Cryptography | Partly | No own cryptography; inventory in §6; random IDs from Web Crypto |
| `v5.0.0-12` Secure Communication | Yes | TLS on the site and the API: SAC-13 |
| `v5.0.0-13` Configuration | Yes | Secrets, deployed content, least privilege: SAC-12, SAC-13, SAC-17. Accepted: full Drive scope (TECH_STACK §11) |
| `v5.0.0-14` Data Protection | Yes | Data classes (§6), no personal data in URLs or caches: SAC-08, SAC-15 |
| `v5.0.0-15` Secure Coding and Architecture | Yes | Dependencies, resource limits, extraneous code: SAC-06, SAC-09, SAC-14 |
| `v5.0.0-16` Security Logging and Error Handling | Yes | Logs without personal data, counted security events, generic errors: SAC-10, SAC-11 |
| `v5.0.0-17` WebRTC | No | No WebRTC |

Totals: 82 requirements planned (designed in the specs or the code, verified by the pre-test
security review CMP-063), 13 verified by document review, 13 accepted risks (provider-controlled
or accepted gaps, §7) and 145 not applicable. The review-only agent and the sprint readiness
check use this inventory.

## 3. OWASP Top 10 and API Top 10 as acceptance criteria

Each risk that applies becomes acceptance criteria in the stories it touches. They are written
below as testable Given/When/Then statements (`SAC-NN`, security acceptance criteria) that name
the ASVS requirements they verify by versioned ID. The coordinator adds them to
[`USER_STORIES.md`](../specs/USER_STORIES.md) → Security in a docs PR, keeping these IDs so the
inventory's references stay valid. CMP-063 verifies them against the code and on staging before
the go-live (CMP-068).

| Risk (Top 10:2025 / API Top 10:2023 ID and name) | Applies | Where it is covered (stories, ASVS requirements) | Reason if not |
|---|---|---|---|
| A01:2025 Broken Access Control | Yes | SAC-08, SAC-09, SAC-15 (US-017, US-020, US-021); `v5.0.0-8.2.1`, `v5.0.0-8.2.2`, `v5.0.0-8.2.3`, `v5.0.0-8.3.1` | |
| A02:2025 Security Misconfiguration | Yes | SAC-12, SAC-13, SAC-17 (all events stories); `v5.0.0-3.4.1`, `v5.0.0-3.4.3`, `v5.0.0-13.4.1`, `v5.0.0-13.4.3` | |
| A03:2025 Software Supply Chain Failures | Yes | SAC-14; §4 PO and PS, §6 (dependency scanning); `v5.0.0-15.1.1`, `v5.0.0-15.1.2`, `v5.0.0-15.2.1` | |
| A04:2025 Cryptographic Failures | Yes (transport only) | SAC-13; inventory in §6; `v5.0.0-12.1.1`, `v5.0.0-12.2.1`, `v5.0.0-11.4.1` | The application encrypts and hashes nothing for a security purpose itself |
| A05:2025 Injection | Yes | SAC-01, SAC-02, SAC-03, SAC-04, SAC-16 (US-017, US-019, US-021, US-023, US-025); `v5.0.0-1.2.1`, `v5.0.0-1.2.2`, `v5.0.0-1.3.3`, `v5.0.0-1.3.11`, `v5.0.0-2.2.1` | |
| A06:2025 Insecure Design | Yes | SAC-06, SAC-07; the threat model in the pen-test plan (CMP-062); BR-E13 trade-off (§7); `v5.0.0-2.3.2`, `v5.0.0-2.3.4`, `v5.0.0-2.4.1` | |
| A07:2025 Authentication Failures | No (application) | Admin accounts outside the application: two-factor on the Google and GitHub accounts (§4 PO, configuration check) | No authentication in the application (§1) |
| A08:2025 Software or Data Integrity Failures | Yes | SAC-14 (deploy only from `main` through the workflow, ADR-009); SAC-07 (no partial registrations); `v5.0.0-2.3.3`, `v5.0.0-15.2.1` | |
| A09:2025 Security Logging and Alerting Failures | Yes | SAC-11 (US-024); §6 logging inventory; `v5.0.0-16.2.5`, `v5.0.0-16.3.3`, `v5.0.0-16.4.1` | |
| A10:2025 Mishandling of Exceptional Conditions | Yes | SAC-10 (US-019, US-021, US-022, US-025); `v5.0.0-16.5.1`, `v5.0.0-16.5.2`, `v5.0.0-16.5.3` | |
| API1:2023 Broken Object Level Authorization | Yes | SAC-08 (US-021): no request returns another participant's data | |
| API2:2023 Broken Authentication | No | | The API has no authentication by design (anonymous, contract §2) |
| API3:2023 Broken Object Property Level Authorization | Yes | SAC-08, SAC-01 (US-017, US-020, US-021): only contract §7 fields out, only validated fields in; `v5.0.0-15.3.1`, `v5.0.0-15.3.3` | |
| API4:2023 Unrestricted Resource Consumption | Yes | SAC-05, SAC-06 (US-019, US-020, US-024): size, rate and daily caps; `v5.0.0-5.2.1`, `v5.0.0-2.4.1`, `v5.0.0-15.2.2` | |
| API5:2023 Broken Function Level Authorization | Yes | SAC-09: only `events`, `coupon` and `register` reachable; `v5.0.0-8.2.1`, `v5.0.0-15.2.3` | |
| API6:2023 Unrestricted Access to Sensitive Business Flows | Yes | SAC-06, SAC-07, SAC-16 (US-020, US-021, US-025): coupon guessing, taking every place, sending email to any address; `v5.0.0-2.3.2`, `v5.0.0-2.4.1` | |
| API7:2023 Server Side Request Forgery | No | SAC-04 (the image URL is loaded by the browser, `https://` only) | The backend makes no outbound request built from input (`v5.0.0-1.3.6`) |
| API8:2023 Security Misconfiguration | Yes | SAC-12, SAC-13, SAC-17; script scopes (TECH_STACK §11); `v5.0.0-13.2.2`, `v5.0.0-13.4.2` | |
| API9:2023 Improper Inventory Management | Yes | SAC-17: the endpoints and deployments in §6 | |
| API10:2023 Unsafe Consumption of APIs | Yes | SAC-01 (sheet rows Cami types are validated, contract §6), SAC-03 (OCR and translation text treated as untrusted) | |

The review-only agent checks every PR against these criteria ([`AGENTS.md`](../../AGENTS.md) →
Review-only agent).

### Security acceptance criteria (proposed for USER_STORIES → Security)

Verified against staging (never production) by CMP-063, with test data only.

- **SAC-01 Server-side validation** (US-019, US-020, US-021, US-023; A05, API3, API10;
  `v5.0.0-2.2.1`, `v5.0.0-2.2.2`, `v5.0.0-2.2.3`, `v5.0.0-1.1.1`, `v5.0.0-15.3.3`)
  Given a `register` or `coupon` request sent directly to the backend, not through the form, with
  a field outside its contract §3.3 rule (wrong type, too long, wrong format, missing) or with
  extra fields
  When it is received
  Then it is refused with `VALIDATION_ERROR` and the field code (contract §8), nothing is stored,
  and extra fields are ignored; an `Events` or `Coupons` row that breaks a contract §6 rule is
  skipped and listed in the alert email.
- **SAC-02 No formulas from input** (US-021; A05; `v5.0.0-1.2.4`, `v5.0.0-1.3.3`)
  Given a registration whose name, email, WhatsApp or coupon value starts with `=`, `+`, `-`,
  `@`, a tab, a carriage return or a digit
  When it is stored
  Then the cell holds the literal text and Sheets evaluates no formula (FFR-014).
- **SAC-03 Untrusted text shown as text** (US-017, US-018, US-025; A05, API10; `v5.0.0-1.2.1`,
  `v5.0.0-1.2.3`, `v5.0.0-3.2.2`)
  Given an event name or description (or its automatic translation) containing HTML or script
  markup, and a participant name containing markup
  When the cards, the ticker, the form and the emails show them
  Then they appear as literal text, no script runs, and the emails stay plain text.
- **SAC-04 Safe image links** (US-017, US-023; A05; `v5.0.0-1.2.2`)
  Given an `Events.imageUrl` that is not an `https://` URL (for example `javascript:`, `data:`
  or `http:`)
  When the events load
  Then the API returns `imageUrl: null` and the card shows the Lifetools logo.
- **SAC-05 Upload checks** (US-019, US-021; A05, API4; `v5.0.0-5.2.1`, `v5.0.0-5.2.2`,
  `v5.0.0-5.3.1`, `v5.0.0-5.3.2`)
  Given a file that is not a JPEG, PNG, WebP or HEIC/HEIF image (also one renamed `.jpg`), or an
  image over 5 MB
  When it is submitted
  Then it is refused with `invalid_file_type` or `file_too_large` and no file is created in Drive;
  an accepted file is stored in the private event folder under the BR-E04 name, never under the
  name it was uploaded with.
- **SAC-06 Abuse limits** (US-020, US-021, US-024; A06, API4, API6; `v5.0.0-2.3.2`,
  `v5.0.0-2.4.1`, `v5.0.0-15.2.2`)
  Given more `register` calls, coupon checks or failed coupon checks in a minute than the
  contract §9 limits, or more uploads in a day than the daily caps
  When the limit is passed
  Then further requests get `RATE_LIMITED` or `UPLOAD_CAP_REACHED`, each one is counted in
  `Metrics` exactly (CMP-053), and the day's alert email lists it (FFR-029); coupon codes Cami
  creates are random strings of at least 8 characters from a password generator, never words
  (FFR-020).
- **SAC-07 No double booking, no partial records** (US-020, US-021; A06, A08, API6;
  `v5.0.0-2.3.1`, `v5.0.0-2.3.3`, `v5.0.0-2.3.4`)
  Given parallel registrations for the last place, or parallel uses of a coupon's last use
  When they are processed
  Then at most capacity (or `maxUses`) of them count (BR-E10, BR-E13 for paid ones), a registration
  sent without the coupon check is re-checked in full, and a registration whose row cannot be
  written leaves no file behind.
- **SAC-08 Only the data each answer needs** (US-017, US-020, US-021; A01, API1, API3;
  `v5.0.0-8.2.2`, `v5.0.0-8.2.3`, `v5.0.0-14.2.1`, `v5.0.0-15.3.1`)
  Given any anonymous request
  When `events`, `coupon` or `register` answers
  Then the answer holds only the contract §7 fields: no participant data, no coupon list
  (FFR-021), no spreadsheet, folder or file IDs or URLs; a retry with a stored `submissionId`
  returns only that registration's reference and flag; personal data travels only in POST bodies,
  never in a URL.
- **SAC-09 Only the public actions are reachable** (all events stories; A01, API5;
  `v5.0.0-8.2.1`, `v5.0.0-3.5.3`, `v5.0.0-13.4.5`, `v5.0.0-15.2.3`)
  Given a GET or POST with any `action` other than `events` (GET) or `coupon` and `register`
  (POST)
  When it is received
  Then it answers `SERVER_ERROR` and changes nothing; the editor-only functions (the smoke check,
  the time-driven triggers, the spike helpers) cannot be started through the web app.
- **SAC-10 Safe failure** (US-019, US-021, US-022, US-025; A10; `v5.0.0-16.5.1`,
  `v5.0.0-16.5.2`, `v5.0.0-16.5.3`)
  Given a malformed body, an unexpected exception, or a Sheets, Drive, OCR or mail failure
  When the request is processed
  Then the answer is a contract §7 error code with no stack trace, ID or personal data; no
  registration is stored half-way; an OCR or email failure never loses a stored registration
  (FFR-032, US-025 AC3); the form keeps the visitor's data for a retry.
- **SAC-11 Logs without personal data** (US-024; A09; `v5.0.0-16.2.5`, `v5.0.0-16.3.3`,
  `v5.0.0-16.3.4`, `v5.0.0-16.4.1`)
  Given any request, valid or not
  When the backend logs it
  Then the Apps Script execution log holds only fixed messages and error names: no request
  content, personal data, SINPE data, IDs or secrets; honeypot hits, throttled requests, failed
  coupon checks and upload-cap hits are counted in `Metrics` (FFR-029).
- **SAC-12 No secrets in the code or the bundle** (all events stories; A02, API8;
  `v5.0.0-13.3.1`, `v5.0.0-13.4.1`, `v5.0.0-13.4.2`)
  Given the repository, the production build (`dist/`) and the files uploaded to GoDaddy
  When they are inspected before each release
  Then they hold no token, credential, spreadsheet, folder or deployment ID, staging URL or real
  SINPE data, only the public production `/exec` URL in the bundle (FNFR-002); no source maps,
  `.git` folder or `.env` file is uploaded; the SINPE values reach the browser only in the
  `events` answer (contract §9).
- **SAC-13 HTTPS and browser protections on the site** (US-017..US-025; A02, A04;
  `v5.0.0-3.4.1`, `v5.0.0-3.4.3`, `v5.0.0-3.4.4`, `v5.0.0-3.4.5`, `v5.0.0-3.4.6`,
  `v5.0.0-4.1.2`, `v5.0.0-12.1.1`, `v5.0.0-12.2.1`, `v5.0.0-12.2.2`, `v5.0.0-13.4.3`)
  Given the production site
  When it is opened over HTTP or HTTPS
  Then HTTP redirects to HTTPS with a valid public certificate on TLS 1.2 or 1.3; responses carry
  `Strict-Transport-Security` (at least one year), a `Content-Security-Policy` that allows only
  the site, Google Fonts, the events backend and its redirect host, and `https:` images, with
  `frame-ancestors`, plus `X-Content-Type-Options: nosniff` and a `Referrer-Policy`; folders show
  no listing. Checked by the owner in the browser's developer tools (no scan of production); a
  missing header becomes a ticket (proposed, §7).
- **SAC-14 Known, current dependencies** (all stories; A03, A08; `v5.0.0-15.1.1`,
  `v5.0.0-15.1.2`, `v5.0.0-15.2.1`, `v5.0.0-3.7.1`)
  Given a release or a deploy
  When it is prepared
  Then the site's and the deploy tool's dependencies come from their lockfiles, `npm audit` shows
  no critical or high finding past the §4 remediation times (CMP-050 for `.github/clasp`), GitHub
  actions are pinned by commit, and the backend reaches staging or production only through the
  deploy workflow from `main` (ADR-009).
- **SAC-15 Private storage and minimal data in the browser** (US-019, US-021; A01;
  `v5.0.0-5.3.1`, `v5.0.0-14.2.3`, `v5.0.0-14.3.3`)
  Given the events spreadsheet and the screenshots folder (staging and production)
  When their sharing settings are checked
  Then they are shared only with Cami's and the owner's accounts (no "anyone with the link");
  the site loads no analytics or tracker and keeps only the language in `localStorage`; consent is
  required and the contact opt-in defaults to `FALSE` (FFR-018).
- **SAC-16 No email abuse beyond the accepted risk** (US-025; A05, API6; `v5.0.0-1.3.11`)
  Given a registration request
  When the backend sends an email
  Then it goes only to the one validated address of a stored registration (no spaces, line
  breaks, commas or second addresses), with the approved templates, plain text, and the
  participant's name as the only text the visitor controls.
- **SAC-17 Known endpoints** (all events stories; API9, A02; `v5.0.0-13.1.1`)
  Given the endpoint inventory in §6
  When a release is prepared (release-checklist §3b)
  Then each listed endpoint exists and nothing else answers for the project: one web-app
  deployment per Apps Script project, the GitHub Pages test site unpublished after CMP-065 and
  its staging URL secret deleted, and the staging URL in no tracked file.

## 4. Secure development (NIST SSDF SP 800-218 v1.1)

| SSDF practice group | Covered by the kit's workflow ([`AGENTS.md`](../../AGENTS.md)) | This project adds |
|---|---|---|
| **PO** Prepare the Organization (security requirements, roles, toolchains, check criteria, secure environments) | Security requirements recorded in the spec and this baseline before implementation; roles (owner, implementation agents, review-only agent, coordinator); sprint readiness gates | This baseline and the SAC criteria (§3); a security agent role per sprint (Sprint 03: Agent 2) that writes documents and reviews code but never tests production. **Credentials:** the owner holds the Google login used by the deploy (`CLASP_CREDENTIALS`, GitHub `staging`/`production` environment secrets only) and the GoDaddy cPanel login; Cami and the owner edit the spreadsheet and Drive. **Configuration checks (owner, before the go-live):** two-factor on the owner's Google, GitHub and GoDaddy accounts and on Cami's Google account; GitHub secret scanning with push protection, Dependabot alerts and private vulnerability reporting enabled on the repository (§6). Separate staging and production data, projects and secrets (ADR-007 decision 6, ADR-008) |
| **PS** Protect the Software (code and release integrity, archived releases) | Protected `main` (pull request required, no force pushes); only the owner merges; releases are tags on checked commits ([`release-checklist.md`](../process/release-checklist.md)) | The backend reaches staging and production only through the deploy workflow from `main`, production behind the owner's approval click, with actions pinned by commit and `clasp` locked (ADR-009); a backup of the live site before each upload (release-checklist); the deploy token revoked at once if anything looks wrong, rotated every 6 months or after a Google password change (ADR-009) |
| **PW** Produce Well-Secured Software (design to requirements, design review, reuse, secure coding, build configuration, code review, testing, secure defaults) | Spec first; tests from acceptance criteria; review by an independent reviewer; least-complex stack | A locked integration contract with validation rules on both sides (contract §3.3, §6); the threat model in the pen-test plan (CMP-062); the ASVS-based pre-test review of `apps-script/` and the form (CMP-063); secure defaults in the specs (anonymous endpoint with global limits, private storage, formula neutralization, `contactOptIn` false unless the box is ticked); `node --check` on the backend and the docs link check in CI; the review-only agent checks the SAC criteria on every PR. Dependency policy: lockfiles committed, updates through a PR, scanned as in §6 |
| **RV** Respond to Vulnerabilities (identify, remediate, root cause) | Findings become stories through change management | **Reporting:** GitHub private vulnerability reporting on the repository (owner setting, §6) is the channel for outside reporters; agents report findings to the coordinator privately, never on GitHub (§7). **Triage:** the owner, helped by the security agent; a severity on the CVSS v4.0 scale (or the tester's scale mapped to critical / high / medium / low). **Target fix times (proposed; the owner decides on merge):** critical 7 days, high 30 days, medium 90 days, low in a planned sprint or accepted by the owner in writing; before the go-live every critical or high finding of CMP-063 is fixed or accepted in writing (owner decision, SPRINT_03_PLAN). Dependency alerts follow the same times by their severity. **Root cause:** each fixed finding's ticket says what let it in and whether a SAC criterion or a check is added |

## 5. Penetration test

| Condition (owner decision, kit issue #26) | Applies to this project | Required test |
|---|---|---|
| The project handles personal data, authentication or payments (§1) | **Yes**: personal data and payment screenshots | A PTES penetration test (here by a dated deadline, below) |
| The project is high-risk or complex (§1), whether or not it handles personal data, authentication or payments | **No** (proposed, §1; the owner decides on merge) | None. If the owner classifies the project high-risk, an OSSTMM 3 test before the go-live and before any release that adds a major new attack surface |

- Required: **PTES**.
- OSSTMM re-test triggers: not applicable while the project is not high-risk. Major new attack
  surfaces that would reopen this baseline (a new classification, ASVS rows and SAC criteria, and
  a new test scope) if they are built: lead capture or the intake questionnaire with persistence
  (US-011, US-012), a payment gateway or card payments, user accounts or an admin web panel, and
  the captcha (Cloudflare Turnstile, FFR-029) as a new outside service.
- Plan: `docs/security/PENTEST_PLAN.md` (CMP-062, not written yet; from the kit's
  `PENTEST_PLAN_TEMPLATE.md`; its scope covers production, since the test runs after the go-live).
- Planned before release: **the PTES deadline is 60 days after the events go-live** (release
  v1.1.0, CMP-068), owner decision 2026-10-26 ("60 days after launch", SPRINT_03_PLAN → Sprint
  Review Notes). **Deadline date:** written here by CMP-069 as the go-live date plus 60 days, once
  the owner sets the go-live date (the first step of CMP-068), and merged before the upload.
- Already in production when this baseline was adopted: **yes** (v1.0.0 at `camihernandez.com`,
  before the events feature). Under [`AGENTS.md`](../../AGENTS.md) → Security baseline, the owner
  recorded the dated deadline above instead of testing before the events release. **Once the
  deadline passes without a completed test, the test gates every release** until it is done, its
  critical and high findings are fixed and retested, and every other finding has a story or a
  risk the owner accepted in writing (the pen-test plan's release gate). Until the deadline,
  releases follow the release checklist, with the CMP-063 critical and high findings fixed or
  accepted before the go-live.

Penetration tests are run only by people the owner authorizes in writing, under a written scope
signed by the owner (the pen-test plan). An implementation agent never runs a penetration test,
and never runs attack tools or security scans against production. The security agent prepares
and assists: the plan, the threat model, the ASVS review, and a low-rate, application-level scan
of **staging only**, after the owner authorizes it in writing on the CMP-063 PR (scope, tool,
rate, time window and alert settings).

## 6. Secrets, dependencies and data

- **Secret scanning:** GitHub secret scanning with push protection on the repository (free for
  public repositories; the owner enables it, or confirms it is on, in the repository's security
  settings before the go-live upload, CMP-068). Every PR's precheck looks at the diff for secrets
  ([`pr-precheck.md`](../process/pr-precheck.md) §4). No secrets in Git or client-side code: the
  backend's configuration is in script properties (contract §9), the deploy credentials only in
  GitHub environment secrets (ADR-009); the only backend value in the bundle is the public `/exec`
  URL (FNFR-002). A leaked secret is revoked first, then removed (the deploy token per ADR-009).
- **Dependency scanning and update policy:** Dependabot alerts on the repository (owner setting,
  same date as above) cover the site's `package-lock.json` and the deploy tool's
  `.github/clasp/package-lock.json`; `npm audit` results are recorded with each release and for
  `.github/clasp` in CMP-050. Alerts are fixed within the §4 times by the agent that owns the
  file (Sprint 03 ownership map), merged by the owner. **Proposed story (Sprint 04, at the latest
  by the PTES deadline):** a pull-request check that runs `npm audit --audit-level=high` on both
  lockfiles, Dependabot version updates for npm and GitHub Actions, and an exported SBOM
  (`v5.0.0-15.1.2`); its files belong to the workflow owners, so the coordinator allocates it.
- **Personal data handling:** data classes and their protection (`v5.0.0-14.1.1`,
  `v5.0.0-14.1.2`):

  | Data | Class | Where it is stored | Who can read it | Protection |
  |---|---|---|---|---|
  | Participant name, email, WhatsApp, language, consent time, `contactOptIn` | Personal (Law 8968) | The event's tab in the events spreadsheet (Workspace `lifetoolscr.com`); the participant emails | Cami and the owner | Private spreadsheet (SAC-15); sent only in POST bodies (SAC-08); never in logs (SAC-11) or the repository; used only as the privacy notice says (BR-E08, EVENTS_EMAILS_AND_PRIVACY §3); access, correction or deletion on request to camila@ |
  | Payment screenshot (SINPE Móvil receipt) | Personal and financial-related: may show the payer's name, phone or account details and the amount | The event's subfolder of the private Drive folder | Cami and the owner | Highest in this project: private folder (SAC-15), type and size checked (SAC-05), never emailed or returned by the API, the temporary OCR document trashed right after reading (FFR-017); only the check result is kept, not the OCR text |
  | Coupon codes | Confidential (business) | `Coupons` tab | Cami and the owner | Never sent to the browser in bulk (FFR-021); checked one at a time under rate limits (SAC-06) |
  | SINPE number and account name | Public to payers by design; kept out of the repository | Script properties | Shown in the `events` answer (contract §9) | Never in Git, the bundle, issues or PRs (BR-E01, FNFR-002) |
  | Spreadsheet, folder, deployment and script IDs; the staging `/exec` URL | Confidential configuration | Script properties; GitHub environment secrets | The owner | Never in a tracked file (TECH_STACK §11); the staging URL only as a GitHub secret during the Pages test window (TECH_STACK §10) |
  | The owner's deploy login token (`CLASP_CREDENTIALS`) | Secret: reaches every Apps Script project the owner can edit (ADR-009) | GitHub `staging` and `production` environment secrets | The deploy workflow on `main` | Environment secrets only, production behind approval, revocation and rotation (ADR-009) |
  | Events, prices, dates, images | Public | `Events` tab; the `events` answer | Anyone | Validated rows only (contract §6) |
  | Daily metrics, alert contents | Internal | `Metrics` tab; the alert email | Cami and the owner | No personal data beyond registration references (FFR-029) |

  Retention: the privacy notice states no retention period (Cami's decision, 2026-10-26,
  EVENTS_EMAILS_AND_PRIVACY §3); Cami deletes data on request. Test data: staging holds only test
  registrations, cleaned up through the CMP-066 list; production gets only the marked smoke
  submissions of CMP-064 and the owner's one test registration in CMP-068, deleted afterwards.
- **Logging:** the logging inventory (`v5.0.0-16.1.1`):

  | Log | What it records | Where, who reads it |
  |---|---|---|
  | Apps Script execution log | Unexpected errors and failed steps, as fixed messages and error names only (no request content or personal data, SAC-11); trigger runs | Google Cloud Logging of the owner's account; project editors |
  | `Metrics` tab | Daily counts: accepted registrations, honeypot hits, throttled requests, failed coupon checks, MB uploaded, rows marked `spam` (FFR-029) | Events spreadsheet; Cami and the owner |
  | Alert email | At most one a day: thresholds crossed, invalid sheet rows (row numbers and field names), checks stuck `pending` (registration references) (FFR-029) | Cami's address, and the `ALERT_TO` addresses after CMP-052 |
  | GitHub Actions logs | Deploy and check runs; secrets masked by GitHub | The repository's Actions tab |
  | Google Workspace audit and Drive activity | Access to the spreadsheet and the folder (provider) | Workspace admin |

  No secrets or personal data in logs beyond what the privacy notice allows; no client address
  exists to log (ADR-008).
- **Cryptographic inventory** (`v5.0.0-11.1.2`): the project implements no cryptography.
  TLS on the site (GoDaddy's certificate; issuer and renewal confirmed by the owner, SAC-13) and
  on the API (Google's); `submissionId` UUIDs from the browser's Web Crypto
  (`crypto.randomUUID`, or `getRandomValues`); registration references from `Math.random`, not
  secrets (contract §5); MD5 only as a cache key for translations (not a security use); the deploy
  token is a Google OAuth credential (ADR-009).
- **Endpoint inventory** (SAC-17, API9): the production site `camihernandez.com` (GoDaddy); the
  production Apps Script web app (`/exec`, from CMP-064; its URL goes only into the production
  build); the staging web app (`/exec`, its URL never in a tracked file); the temporary GitHub
  Pages test site, only during the CMP-065 window; each Apps Script project's `/dev` test URL,
  which answers only project editors. No other deployment, host or API belongs to the project.

## 7. Open items and accepted risks

This repository is **public**: an unfixed, exploitable vulnerability is never recorded here or in
any other tracked file, issue or PR. Findings of the pre-test review (CMP-063) and of the
penetration test are sent privately to the coordinator, who arranges private tracking with the
owner; only a neutral reference such as "SEC-001: security fix, tracked privately", with no
severity, appears in a tracked file until the fix is released. No such finding is recorded today.

| Item | Owner | Decision / due |
|---|---|---|
| Classification "not high-risk" (§1), ASVS level L2 (§2) and the target fix times (§4 RV) | Owner | Proposed; decided on merge of this PR |
| PTES deadline date (§5) | Agent 2 (CMP-069), from the owner's go-live date | Before the go-live upload |
| GitHub secret scanning with push protection, Dependabot alerts and private vulnerability reporting enabled; two-factor on the owner's and Cami's accounts (§4, §6) | Owner (repository and account settings) | Before the go-live upload (CMP-068); recorded in the CMP-066 verification |
| Site HTTPS and security headers (SAC-13): the owner checks the live site in the browser; any missing control becomes a ticket for the site owner (Agent 3, `public/`) | Owner, Agent 3 | Checked in CMP-063; a fix of a missing header is not a go-live blocker unless CMP-063 rates it critical or high |
| Story: dependency audit check, Dependabot version updates and SBOM (§6) | Coordinator (allocates) | Sprint 04 (proposed), at the latest by the PTES deadline |
| Script scopes and editor-only helpers in production (`v5.0.0-13.2.2`, `v5.0.0-15.2.3`) | Agent 2 (CMP-063 review), Agent 1 (any fix) | Reviewed in CMP-063 |
| Accepted (ADR-008): the endpoint is anonymous and receives no client address or headers, so limits are global and the origin cannot be checked; one heavy client can use up the shared limits for everyone | Owner | Accepted 2026-10-19 (ADR-008); revisit with the captcha rule (FFR-029) |
| Accepted (BR-E13): anyone who attaches any image can get past a full or closed event; such rows are stored flagged and never confirmed automatically | Owner | Accepted 2026-10-19 (FEATURE_SPEC §20) |
| The registration form is anonymous by design (ADR-008), so anyone can make production, once live, send the registration emails from the alias to any address, within the limits (SAC-16); TECH_STACK §10 records the same for staging during the test-site window | Owner | Staging: accepted 2026-10-21; production: proposed for acceptance on merge of this PR; watched through `Metrics` and the alert email |
| Accepted (TECH_STACK §11, ADR-009): the script holds full Drive and Gmail settings scopes and runs as the owner; the deploy token reaches every Apps Script project the owner can edit, and a leaked staging secret can change production | Owner | Accepted 2026-10-20 and 2026-10-22; revisit: a staging-only Google account and an own OAuth client (ADR-009 follow-up) |
| Accepted (provider): headers, CORS, cache control, HTTP parsing, TLS clients and logs of the Apps Script answers are Google's and cannot be configured; no antivirus run by the project on screenshots, which only Cami opens inside Google Drive ([`ASVS_INVENTORY.md`](ASVS_INVENTORY.md), rows marked Accepted risk) | Owner | Proposed for acceptance on merge of this PR |
| Accepted (Cami, 2026-10-26): no retention period in the privacy notice | Owner, Cami | Recorded in EVENTS_EMAILS_AND_PRIVACY §3; revisit if a lawyer reviews the notice |
| Live before the penetration test (SPRINT_03_PLAN → Risks): real participants' data and payment screenshots are stored before an outside tester has checked the system | Owner | Accepted 2026-10-26 with the 60-day deadline (§5) and the CMP-063 gate |

## 8. Approval
- Approved by: Raul Casanas (product owner), on merge of PR #58
- Date: on merge
