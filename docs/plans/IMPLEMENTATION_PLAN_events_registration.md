# IMPLEMENTATION_PLAN — Upcoming events and paid registration

## Metadata
- Version: 1.0 (CMP-022)
- Status: Approved (on merge of PR #22)
- Related specs: [FEATURE_SPEC_events_registration.md](../specs/FEATURE_SPEC_events_registration.md)
  (v1.0), [EVENTS_API_CONTRACT.md](../specs/EVENTS_API_CONTRACT.md) (v1.0, locked),
  [ARCHITECTURE_SPEC.md](../specs/ARCHITECTURE_SPEC.md) (v1.2),
  [UX_UI_DIRECTION.md](../ux/UX_UI_DIRECTION.md) (v1.1), [TECH_STACK.md](../../TECH_STACK.md)
  (v1.2), [ADR-008](../decisions/ADR-008-events-backend-google-apps-script.md)
- Related user stories: US-017..US-025 (`Ready`), plus the Sprint 01 carry-overs US-002 (AC2
  defect) and US-005 (AC2 check)
- Sprint: [SPRINT_02_PLAN.md](../sprints/SPRINT_02_PLAN.md)

## 1. Purpose
Turn the approved events feature into ordered, owned tickets: what is built, where, in which
order, by which agent and model, and how each acceptance criterion is verified without a test
runner.

## 2. Technical Scope
- **Backend:** a Google Apps Script web app in `apps-script/` (ADR-008) that implements the
  three contract actions (`events`, `coupon`, `register`), the Sheets/Drive storage, the OCR
  check, the participant and alert emails, the abuse limits and the daily metrics.
- **Frontend:** an API client, an events data hook, the events section, the ticker and the
  registration form with coupons, plus the `UI_TEXT.events` copy (EN/ES).
- **Runbook:** how the owner deploys the script to staging and production.
- **Not in scope:** the production release of the feature. It waits for the release gates in
  [release-checklist.md §3b](../process/release-checklist.md#3b-events-feature-release-gates-feature_spec_events_registration-br-e11)
  (real SINPE values, lawyer-reviewed privacy notice, Cami-approved emails, the logo); see §17.

## 3. Traceability
Project Requirement → User Story → Acceptance Criterion → Implementation step (§11) → Test

| Requirement | Story | AC | Step | Test (manual, against staging — contract §10) |
|---|---|---|---|---|
| FFR-019, FFR-020, FFR-028 | US-023 | AC1–AC5 | 4 | Edit staging `Events`/`Coupons`; reload; invalid rows hidden and listed in the alert |
| FFR-001..FFR-004, FFR-025, BR-E09 | US-017 | AC1–AC5 | 4, 9 | Cards at 1280/900/375 px, EN/ES; closed/sold-out buttons; backend down → hidden |
| FFR-005, FFR-006 | US-018 | AC1–AC5 | 9 | Ticker moves, pauses on hover/focus, static with reduced motion, click scrolls |
| FFR-007..FFR-011, FFR-018, FFR-022, FFR-023, FFR-027 | US-019 | AC1–AC8 | 5, 11 | Form validation cases, paid and free submits, retry, duplicate email |
| FFR-012, FFR-013, FFR-021, FFR-024 | US-020 | AC1–AC7 | 6, 11 | Coupon valid / invalid / exhausted / used / changed after apply; throttle |
| FFR-014..FFR-016, FFR-024, FFR-025, FFR-030, BR-E13 | US-021 | AC1–AC6 | 5 | Drive file name and folder, row columns, `SOLD_OUT` vs flagged, idempotent retry |
| FFR-017 | US-022 | AC1–AC5 | 7 | Cami's samples → `ok`; altered amount → `mismatch`; blank image → `unreadable` |
| FFR-029 | US-024 | AC1–AC3 | 6 | `Metrics` row values; alert email once per day; honeypot fake success |
| FFR-026, BR-E11 | US-025 | AC1–AC5 | 7 | Confirmation / received / not-validated emails in ES and EN, Gmail and Outlook inboxes |
| FR-003 | US-002 | AC2 | 10 | Hover shift at 1280 px after reveal; other sections still reveal |
| FR-007, BR-003 | US-005 | AC2 | 12 | Spanish→English long-quote fallback with test data (not committed) |

## 4. Current State
- Static one-pager (v1.0.1), no backend, no runtime data.
- The events feature is specified and its contract locked (CMP-021, PR #21).
- No `apps-script/` folder, no staging spreadsheet or folder yet (the owner creates them when the
  spike needs them).

## 5. Target State
- `main` holds the events backend source and the events UI. The UI renders only when
  `VITE_EVENTS_API_URL` is set and the backend answers in ≤ 3 s; otherwise the page is exactly
  today's page (FFR-004). A hotfix release from `main` before the gates pass therefore ships no
  visible events feature.
- A **staging** Apps Script deployment, spreadsheet and folder run the full flow end to end, with
  verification evidence in `docs/sprints/SPRINT_02_VERIFICATION.md`.
- A deploy runbook lets the owner create and update the staging and production deployments.

## 6. Technical Approach
- **Backend first, contract-driven.** The spike (step 2) proves the ADR-008 assumptions and leaves
  the backend skeleton (router for `action`, the contract response envelope, script-property
  config, sheet helpers). Each later backend step adds one contract area and is deployed to
  staging by the owner after merge.
- **Frontend against the contract.** The frontend foundation (step 8) adds the API client
  (`src/api/events.js`: `getEvents(lang)`, `checkCoupon(...)`, `register(...)`, all following
  contract §2: `text/plain` POST, `redirect: "follow"`, no custom headers, 3 s timeout for
  `events`) and the `useEvents` hook. Until the staging `events` action is deployed, frontend
  agents may use a local fixture that matches contract §7 **that is never committed**; final
  verification is always against staging.
- **Copy.** Strings quoted in the spec or the stories are used verbatim. Other labels (field
  names, buttons) are drafted in EN and ES and listed in the PR body for the owner's approval.
  The privacy notice uses the draft in
  [EVENTS_EMAILS_AND_PRIVACY.md](../ux/EVENTS_EMAILS_AND_PRIVACY.md) §3, marked as a draft in
  code (BR-002) until the lawyer review.
- **Layout and interaction** follow [UX_UI_DIRECTION.md §13](../ux/UX_UI_DIRECTION.md#13-events-ui).

## 7. Components / Files Affected
| Area | Files | Owner (Sprint 02) |
|---|---|---|
| Backend | `apps-script/**` (new) | Agent 1 |
| Deploy runbook | `docs/process/events-backend-runbook.md` (new) | Agent 1 |
| Spike findings | `docs/sprints/SPRINT_02_SPIKE.md` (new) | Agent 1 |
| API client, data hook | `src/api/events.js`, `src/hooks/useEvents.js` (new) | Agent 2 |
| Section, ticker | `src/components/Events.jsx`, `src/components/EventsTicker.jsx` (new) | Agent 2 |
| Page composition | `src/App.jsx` | Agent 2 |
| Copy | `src/constants/i18n.js` (`UI_TEXT.events`) | Agent 2 (foundation); Agent 3 adds form keys after it merges |
| Styles | `src/styles/global.css` | Agent 2 (foundation); Agent 3 appends form classes after it merges |
| Logo fallback | `public/images/lifetools-logo.*` (Cami's file when it arrives; a marked placeholder until then) | Agent 2 |
| Registration form | `src/components/EventRegistration.jsx` (new; stub created in CMP-029) | Agent 3 |
| Hover fix (US-002) | `src/hooks/useReveal.js`, `src/components/Services.jsx` and/or `global.css` | Agent 2 |
| Config example | `.env.example` (new, `VITE_EVENTS_API_URL=` empty) | Agent 2 |

## 8. Data Changes
- New staging and production spreadsheets with the contract §6 tabs, and Drive root folders. The
  owner creates them; the runbook says how.

## 9. API / Integration Changes
- New: the events web app, per [EVENTS_API_CONTRACT.md](../specs/EVENTS_API_CONTRACT.md) v1.0.
  Any change follows the contract's change rule (spec first, version bump, both owners told).

## 10. Configuration / Secrets
- Frontend: `VITE_EVENTS_API_URL` in `.env.local` (git-ignored); `.env.example` documents it
  with an empty value.
- Backend: script properties from contract §9, set by the owner per the runbook. Never in Git.

## 11. Implementation Steps
Planning model: Opus — this plan sequences a new backend and three workstreams (see
[model-cost-policy.md](../process/model-cost-policy.md)).

| # | Ticket | Step | Agent | Model | Why |
|---|---|---|---|---|---|
| 1 | CMP-023 | Deploy runbook v1: create the Apps Script project, set script properties, deploy as web app (execute as owner, access "Anyone"), update a deployment keeping its URL, staging vs production, rollback to a previous version | Agent 1 | Sonnet | Specified procedure |
| 2 | CMP-024 | Backend spike (ADR-008 → Validation) and backend skeleton; findings in `SPRINT_02_SPIKE.md`: browser→script path from a page on a site-like origin, Drive/Sheets writes, OCR on Cami's samples, HEIC → JPEG method, mail alias, timing | Agent 1 | Sonnet | Implementing and measuring; decisions it reveals go to the owner |
| 3 | — | Owner deploys the skeleton to staging with the runbook; the runbook is corrected from what happened | Owner + Agent 1 | — | — |
| 4 | CMP-025 | US-023 and the `events` action: read and validate `Events`/`Coupons`, translation with overrides, `registrationOpen`/`soldOut`, `sinpe` object | Agent 1 | Sonnet | Specified |
| 5 | CMP-026 | US-021: `register` — validation, lock, capacity and duplicate checks, BR-E13 flags, Drive file, row, idempotency | Agent 1 | Sonnet | Specified; the hardest backend step |
| 6 | CMP-027 | US-020 (server) and US-024: `coupon` action, coupon at `register`, counting rule, `LIMIT_*` throttles, upload cap, honeypot, `Metrics`, alerts | Agent 1 | Sonnet | Specified |
| 7 | CMP-028 | US-022 and US-025: OCR check after the lock, `checkResult`/`checkDetails`/`needsReview`, the three participant emails from the drafts | Agent 1 | Sonnet | Specified |
| 8 | CMP-029 | Frontend foundation: API client, `useEvents`, `UI_TEXT.events` (section, ticker, statuses), `global.css` events block, `App.jsx` slots, logo placeholder, `.env.example` | Agent 2 | Sonnet | Shared files; must merge before steps 9 and 11 |
| 9 | CMP-030 | US-017 and US-018: `Events.jsx`, `EventsTicker.jsx` | Agent 2 | Sonnet | Specified |
| 10 | CMP-031 | US-002 AC2 fix: hover shift not overridden by the reveal transform, no change to other sections' reveal | Agent 2 | Sonnet | Browser debugging |
| 11 | CMP-032 | US-019 and US-020 (client): `EventRegistration.jsx`, coupon field, SINPE instructions, validation, submit and retry, consent | Agent 3 | Sonnet | Specified; largest frontend step |
| 12 | CMP-033 | Integration verification on staging: contract §10 end-to-end list, emails delivered to a Gmail and an Outlook inbox, 1280/900/375 px × EN/ES, US-005 AC2 check; results in `SPRINT_02_VERIFICATION.md` | Agent 3 | Sonnet | Running checks and recording evidence |

Mechanical checks (build, links, `git status`) in every step go to the `mechanical-check`
subagent.

## 12. Parallelization Plan
Three agents, at most. File ownership and merge order are in
[SPRINT_02_PLAN.md](../sprints/SPRINT_02_PLAN.md). Agent 1 (backend) runs steps 1–7 in order.
Agent 2 runs step 8 first, then steps 9 and 10. Agent 3 starts step 11 once step 8 is merged,
then runs step 12 once everything else is merged and deployed to staging.

## 13. Testing Strategy
- No test runner (TECH_STACK §8). Every PR records a manual checklist run against the **staging**
  deployment: case, input, response, and a screenshot of the row or file where relevant
  (contract §10).
- Backend PRs cover every validation rule they add (one valid and one invalid case) and every
  error code they can return.
- Frontend PRs cover their ACs at 1280, 900 and 375 px in EN and ES, keyboard use, and the
  regression of the existing sections.
- `npm run build` passes on every PR.

## 14. Acceptance Verification
Step 12 (CMP-033) runs the whole contract §10 end-to-end list on the merged `main` against
staging. A story moves to `Done` only when all its ACs pass there and the owner approves the
evidence.

## 15. Error Handling
As specified: contract §7 error codes and consumer behavior; FFR-004 (hide on failure or > 3 s);
FFR-022 (same `submissionId` on retry); BR-E13 (store and flag a paid registration whose state
changed); `email failed` flag (US-025 AC3).

## 16. Migration
- None for existing content. The spreadsheets start empty with headers.

## 17. Rollback
- Backend: redeploy the previous Apps Script version on the same deployment (runbook).
- Frontend: until the release gates pass, production builds leave `VITE_EVENTS_API_URL` empty, so
  the feature is off. After release, the release-checklist §7 rollback applies.

## 18. Risks
- An ADR-008 assumption fails in the spike (OCR on real screenshots, HEIC, the redirect path).
  The agent stops and reports; the owner decides (Change management). US-022 is the most exposed.
- The owner is on the critical path for every staging deploy and for the staging data; slow
  deploys stall Agents 2 and 3. Mitigation: deploy batches agreed in the sprint plan.
- `i18n.js` and `global.css` are shared by Agents 2 and 3; mitigated by the foundation-first
  order and append-only rules.

## 19. Dependencies
- Owner: staging spreadsheet and folder, Workspace alias check, every deploy.
- Cami: 2–3 sample SINPE screenshots (spike), the Lifetools logo, the SINPE values and the email
  approval (release gates).
- Lawyer (Cinthia): privacy notice review (release gate).

## 20. Open Technical Questions
- HEIC → JPEG conversion method (spike decides; a new frontend library needs TECH_STACK + ADR).
- Whether a Workspace alias can send without a paid seat (spike; fallback camila@, decided).

## 21. Definition of Done
See [AGENTS.md](../../AGENTS.md#definition-of-done). For this feature also: the contract §10
checklist recorded against staging and the owner's approval of the evidence.
