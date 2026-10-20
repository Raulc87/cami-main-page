# SPRINT_PLAN — Sprint 02

## Metadata
- Sprint: 02
- Status: Active (plan approved on merge of PR #22; owner's go-ahead 2026-10-19, Entry Gate 4)
- Start: 2026-10-20 (Tuesday), the first business day after the go-ahead
- End: 2026-10-28 (Wednesday); if the start moves, the 7th business day counted from the actual
  start
- Duration: 7 business days
- Saturdays and Sundays excluded
- Final human reviewer: Raul Casanas
- Implementation plan: [IMPLEMENTATION_PLAN_events_registration.md](../plans/IMPLEMENTATION_PLAN_events_registration.md)

## Entry Gates
Run [SPRINT_READINESS_CHECKLIST.md](../checklists/SPRINT_READINESS_CHECKLIST.md) first (detail
below).

| # | Gate | Status |
|---|---|---|
| 1 | `PROJECT_CONTEXT.md` paths resolve | Pass (link check on this PR's head: 0 broken) |
| 2 | Readiness checklist has no open blocking items | Pass (item 8, the go-ahead, passed with gate 4) |
| 3 | Integration contracts locked (or N/A) | Pass — [EVENTS_API_CONTRACT.md](../specs/EVENTS_API_CONTRACT.md) v1.0, locked in PR #21 |
| 4 | Final go-ahead from the human owner | Pass — owner, 2026-10-19: "merged, go ahead with Sprint 02" |

### Readiness checklist result (2026-10-19)
| Item | Result |
|---|---|
| 1. Paths in `PROJECT_CONTEXT.md` exist **(blocking)** | Pass |
| 1. `AGENTS.md`/`CLAUDE.md` match the kit or differences documented **(blocking)** | Pass — AGENTS.md → Differences from the Starter Kit |
| 1. `PROJECT_CONTEXT.md` URL, status, active sprint | Pass (updated in this PR) |
| 1. `README.md` status matches | Pass (updated in this PR) |
| 1. Project key and planned branch per story **(blocking)** | Pass — CMP; branches in Selected User Stories; `todo` rows in `TICKETS.md` |
| 2. Spec, stories, UX, stack, plan and sprint plan agree **(blocking)** | Pass — UX_UI_DIRECTION v1.1 (§13 Events UI) and ARCHITECTURE_SPEC v1.2 (page order, `src/api/`) close the two gaps found |
| 2. Field naming stated | Pass — `camelCase` JSON, contract §1 |
| 2. Languages stated | Pass — EN/ES, global toggle (FR-009); event text per FFR-028 |
| 2. Every FR maps to a story | Pass — FR-011 → US-017..US-025 |
| 3. Testable ACs **(blocking)** | Pass — US-017..US-025 refined in CMP-021, reviewed |
| 3. Every story has an owner | Pass — Selected User Stories |
| 4. Shared interfaces locked **(blocking)** | Pass — contract v1.0 |
| 4. Failure behavior per integration | Pass — backend down/slow → hidden (FFR-004); OCR → `unreadable`; mail → `email failed` flag; Drive/Sheets → `SERVER_ERROR` + retry |
| 4. Credentials: owner, storage, never in Git | Pass — script properties, owner (TECH_STACK §11) |
| 5. Personal data: jurisdiction, consent, notice **(blocking)** | Pass — Costa Rica, Ley 8968; consent checkbox; draft notice, lawyer review is a release gate |
| 5. Abuse protection in scope | Pass — US-024 and contract §9 limits in this sprint |
| 5.1 Visual identity status | Pass — UX_UI_DIRECTION approved v1.0; events UI in v1.1 |
| 5.1 Tokens, not literals | Pass — `C` palette rule (UX_UI_DIRECTION §2) |
| 5.1 Brand assets for go-live **(blocking for go-live)** | N/A — not a go-live sprint. Logo: Cami, by the release |
| 6. Hosting runtime confirmed or ADR | Pass — ADR-008; the spike validates it first (CMP-024) |
| 6. Local environment defined | Pass — `npm run dev` with `VITE_EVENTS_API_URL` → staging (contract §9) |
| 6. Test tools, lint, CI named | Pass — manual checklist (contract §10), `npm run build`; no CI, no runner (TECH_STACK §8–9) |
| 6. Branching model + deploy runbook before first deploy **(blocking for a deploying sprint)** | Pass — ADR-007; runbook is CMP-023, ordered before the first staging deploy |
| 6. Release runbook **(blocking for go-live)** | N/A — not a go-live sprint |
| 6. Previews/tests use their own data store | Pass — staging spreadsheet and folder (owner creates them, ADR-007 decision 6) |
| 6. Real-delivery email test planned | Pass — CMP-033 (Gmail and Outlook inboxes) |
| 7. Workstreams assigned, max 3 **(blocking)** | Pass |
| 7. Ownership map **(blocking)** | Pass |
| 7. Foundation and owner sequenced | Pass — CMP-024 (backend skeleton), CMP-029 (frontend foundation) |
| 7. Merge order and integration owner | Pass — Agent 3 (CMP-033) |
| 7. Conflict rule | Pass |
| 7.1 Prompts say agents never merge **(blocking)** | Pass — [SPRINT_02_AGENT_PROMPTS.md](SPRINT_02_AGENT_PROMPTS.md) |
| 7.1 Reviewer in its own session, independence rule **(blocking)** | Pass |
| 7.1 `main` protected | Owner to confirm in GitHub settings (not blocking) |
| 7.1 `release/*` protection | N/A — no `release/*` branches |
| 7.1 Coordinator follows AGENTS.md | Pass |
| 8. Explicit go-ahead **(blocking)** | Pass — owner, 2026-10-19: "merged, go ahead with Sprint 02" |

## Sprint Goal
- The events feature works end to end on **staging**: a visitor sees upcoming events and the
  ticker, registers (paid with a screenshot, free, with a coupon), and Cami finds the row, the
  file, the check result and the emails in her Workspace.

## Required Deliverable
Every sprint must end with a demonstrable deliverable.

- A demo on the site running locally against the staging backend, covering the contract §10
  end-to-end list, with evidence in `docs/sprints/SPRINT_02_VERIFICATION.md` (CMP-033).
- The deploy runbook used for every staging deploy of the sprint.
- **Not** a production release: that waits for the release-checklist §3b gates (real SINPE
  values, lawyer-reviewed notice, Cami-approved emails, logo). Until then production builds
  leave `VITE_EVENTS_API_URL` empty and the page is unchanged.

## Selected User Stories
| Story | Points | Agent | Dependencies | Ticket / branch (`CMP-XXX-slug`) | Status |
|---|---:|---|---|---|---|
| — (deploy runbook) | — | Agent 1 | — | CMP-023 `CMP-023-events-backend-runbook` | todo |
| — (backend spike + skeleton) | — | Agent 1 | CMP-023; staging sheet/folder (owner); Cami's samples | CMP-024 `CMP-024-events-backend-spike` | todo |
| US-023 (+ `events` action for US-017) | 3 | Agent 1 | CMP-024 | CMP-025 `CMP-025-events-read-and-sheet-validation` | todo |
| US-021 | 5 | Agent 1 | CMP-025 | CMP-026 `CMP-026-registration-storage` | todo |
| US-020 (server), US-024 | 2 + 2 | Agent 1 | CMP-026 | CMP-027 `CMP-027-coupons-limits-metrics` | todo |
| US-022, US-025 | 5 + 3 | Agent 1 | CMP-026 (CMP-027 merged first, same files) | CMP-028 `CMP-028-payment-check-and-emails` | todo |
| — (frontend foundation) | — | Agent 2 | — | CMP-029 `CMP-029-events-frontend-foundation` | todo |
| US-017, US-018 | 3 + 2 | Agent 2 | CMP-029; CMP-025 on staging | CMP-030 `CMP-030-events-section-and-ticker` | todo |
| US-002 (AC2 defect) | — | Agent 2 | CMP-029 (shared `global.css`) | CMP-031 `CMP-031-service-card-hover-fix` | todo |
| US-019, US-020 (client) | 5 + 1 | Agent 3 | CMP-029; CMP-026/027 on staging | CMP-032 `CMP-032-event-registration-form` | todo |
| — (integration verification; US-005 AC2 check) | — | Agent 3 | everything above merged and on staging | CMP-033 `CMP-033-sprint-02-integration-verification` | todo |

US-020's 3 points are split 2 (server) + 1 (client). Total: 31 points.

## Parallel Workstreams
### Agent 1 — Events backend (`apps-script/`)
- CMP-023 → CMP-024 → CMP-025 → CMP-026 → CMP-027 → CMP-028, in order. After each merge the
  owner deploys to staging with the runbook; Agent 1 guides the deploy and confirms it with a
  smoke request.

### Agent 2 — Events section, ticker and foundation
- CMP-029 first (foundation, shared files). Then CMP-030 and CMP-031.

### Agent 3 — Registration form and integration
- CMP-032 once CMP-029 is merged. CMP-033 once every other ticket is merged and deployed.

### Owner
- Before CMP-024: create the staging spreadsheet and Drive folder; ask Cami for 2–3 sample SINPE
  screenshots from different banks; check whether a free Workspace alias exists for sending.
- Each backend merge: deploy to staging with the runbook.
- Carry-overs: US-007 AC1 (one click on the live booking CTA) and US-009 AC2 (one social-preview
  run); the coordinator records the results in a docs PR.

### Coordinator
- Relays the owner's decisions, records them in docs PRs, triggers reviews, tracks the board.

Maximum implementation agents in parallel: 3.

## Foundation (before parallel work)
- **Backend skeleton** — CMP-024 (Agent 1): router, contract envelope, config, sheet helpers.
- **Frontend foundation** — CMP-029 (Agent 2): `src/api/events.js`, `src/hooks/useEvents.js`,
  the `UI_TEXT.events` keys for the section, ticker and statuses, the events block in
  `global.css`, the `App.jsx` slots for `EventsTicker` and `Events`, the logo placeholder and
  `.env.example`. Must merge before CMP-030, CMP-031 and CMP-032 start editing.

## File Ownership Map
Agents edit only files they own; changes elsewhere are requested from the owner.

| Path | Owner |
|---|---|
| `apps-script/**` | Agent 1 |
| `.gitignore` — the `.clasp.json` entry only (CMP-024) | Agent 1 (owner, 2026-10-20) |
| `docs/process/events-backend-runbook.md`, `docs/sprints/SPRINT_02_SPIKE.md` | Agent 1 |
| `src/api/**`, `src/hooks/useEvents.js` | Agent 2 |
| `src/components/Events.jsx`, `src/components/EventsTicker.jsx`, `src/components/eventsShared.js`, `src/App.jsx` | Agent 2 |
| `src/hooks/useReveal.js`, `src/components/Services.jsx` (CMP-031 only) | Agent 2 |
| `public/images/lifetools-logo.*`, `.env.example` | Agent 2 |
| `src/components/EventRegistration.jsx` | Agent 3 (Agent 2 creates the stub in CMP-029 only) |
| `docs/sprints/SPRINT_02_VERIFICATION.md`, `docs/sprints/evidence/sprint-02/**` | Agent 3 |
| `src/constants/i18n.js` | Shared: Agent 2 writes the `events` block in CMP-029; after it merges, Agent 3 adds keys **only** inside `UI_TEXT.events.form` (EN and ES) |
| `src/styles/global.css` | Shared: Agent 2 writes the events block in CMP-029 and the CMP-031 fix; Agent 3 **appends** `.evt-form*` classes after CMP-029 merges, editing no existing rule |
| `TICKETS.md` | Shared: each agent edits only its own rows; the coordinator all others |
| `docs/specs/**`, `docs/ux/**`, `docs/plans/**`, `docs/decisions/**`, `docs/process/**` (except the runbook), `docs/sprints/SPRINT_02_PLAN.md`, `..._AGENT_PROMPTS.md`, `AGENTS.md`, `PROJECT_CONTEXT.md`, `README.md` | Coordinator (docs PRs). An agent that finds a spec gap stops and reports it |
| `src/constants/data.jsx`, `colors.js`, every other existing component | Nobody this sprint |

## Integration Contracts
- [EVENTS_API_CONTRACT.md](../specs/EVENTS_API_CONTRACT.md) v1.0, locked: Agent 1 is the provider,
  Agents 2 and 3 the consumers. A change follows its change rule (coordinator docs PR first,
  version bump, both sides told) before any code relies on it.
- Inside the frontend: `useEvents()` returns `{ status: "loading" | "ready" | "hidden", sinpe,
  events }` and `src/api/events.js` exports `getEvents(lang)`, `checkCoupon({ eventCode,
  couponCode, email })` and `register(payload)`, each resolving to the contract §7 envelope
  (`{ ok, data, error }`, with a network failure or timeout mapped to `SERVER_ERROR`). Agent 2
  owns this interface; Agent 3 consumes it.
- Form mount: `Events.jsx` renders `<EventRegistration event={...} sinpe={...}
  onClose={...} onStale={...} />` for the event whose register button was selected.
  `useEvents()` also returns `refetch()`, passed as `onStale`; the form calls `onStale?.()` after
  showing `EVENT_NOT_FOUND`, `REGISTRATION_CLOSED` or `SOLD_OUT`. A failed refetch keeps the last
  good events (their text may stay in the previous language until the next successful load), and
  the open form stays mounted until `onClose` even if a refetch drops its event (added during
  CMP-030/CMP-032 review, 2026-10-20). CMP-029 creates
  `EventRegistration.jsx` as a stub that renders nothing; from CMP-029's merge the file belongs
  to Agent 3, who replaces the stub in CMP-032 and keeps these props.

## Merge / Integration Order
1. This plan (CMP-022).
2. CMP-023 (runbook) and CMP-029 (frontend foundation), in parallel.
3. CMP-024 (spike + skeleton) → owner deploys staging. CMP-031 (hover fix) any time after CMP-029.
4. CMP-025 → staging. Then CMP-030 and CMP-032 can verify against staging.
5. CMP-026 → staging; CMP-027 → staging; CMP-028 → staging.
6. CMP-030 and CMP-032 merge when their ACs pass on staging.
7. Integration check — owner: Agent 3, CMP-033, on `main` after all of the above.

## Conflict Resolution
- Merge conflicts are resolved when found, by the human owner together with the agent that owns
  the conflicting file.
- An agent must not rewrite another agent's files to resolve a conflict.

## Review-only Agent
Dedicated Claude Code reviewer session (Opus), relaunched for Sprint 02 from
[SPRINT_02_AGENT_PROMPTS.md](SPRINT_02_AGENT_PROMPTS.md), triggered by the owner or the
coordinator. Copilot and Codex run as automated reviewers on every PR; authors run
`/code-review` before each PR.

Scope:
- spec compliance
- acceptance criteria
- regressions
- code quality
- security
- integration risk

The review-only agent does not implement features.

## Human Review
The human reviewer is the final approver.

## Verification
- Each PR: `npm run build`, its manual checklist against staging (contract §10), evidence in the
  PR body.
- CMP-033: the full contract §10 end-to-end list on `main` against staging; each email received
  in a Gmail and an Outlook inbox; layouts at 1280/900/375 px in EN and ES; regression of the
  existing sections; the US-005 AC2 fallback with test data (not committed).
- A story moves to `Done` only when all its ACs pass and the owner approves the evidence; the
  coordinator records it.

## Risks
- **Spike failure** (OCR, HEIC, redirect path): the agent stops and reports; the owner decides.
  US-022 can slip to Sprint 03 without blocking the rest (check result stays `pending`).
- **Owner on the critical path** for staging data and every deploy. Batch deploys where
  possible; Agent 1 prepares each deploy so it takes minutes.
- **Backend load:** Agent 1 carries 20 of 31 points in sequence. If it falls behind, CMP-028 is
  the first to move to Sprint 03.
- **Shared files** (`i18n.js`, `global.css`): foundation first, then append-only rules.

## Sprint Definition of Done
- Every selected ticket `done` or explicitly moved to Sprint 03 by the owner.
- The Required Deliverable demonstrated and its evidence approved.
- `TICKETS.md`, `USER_STORIES.md` statuses and `PROJECT_CONTEXT.md` updated; the Sprint 03 plan
  (release) drafted if the gates are in sight.

## Sprint Review Notes
- Go-ahead (owner, 2026-10-19, after merging PR #22): "merged, go ahead with Sprint 02". The coordinator launched, from
  [SPRINT_02_AGENT_PROMPTS.md](SPRINT_02_AGENT_PROMPTS.md), the review-only session (Opus) and
  Agents 1 and 2 (Sonnet), tagged `cmp-sprint-02`. Agent 3 starts when CMP-029 is merged
  (launch order). The Sprint 01 reviewer session is archived.
- Owner answers (2026-10-20), verbatim: "1. Yes 2. Yes 3. Yes 4. Yes
  5. no-reply@lifetoolscr.com 6. I need help to do this". The coordinator's questions, as asked:
  1. Two separate Apps Script projects for staging and production? → **Yes**: two standalone
     projects with the same code (ADR-008; ARCHITECTURE §13, TECH_STACK §10 in CMP-035).
  2. Standalone scripts (not bound to the spreadsheet)? → **Yes** (ADR-008 Option A wording).
  3. Agent 1 adds the `.clasp.json` line to the root `.gitignore` in CMP-024? → **Yes**
     (ownership map).
  4. Cami's samples in a non-shared `samples` subfolder of the staging folder, named
     `<name>_<amountCrc>.jpg`, plus one copy with the amount altered? → **Yes**.
  5. Which Workspace alias to test for sending in the spike? → `no-reply@lifetoolscr.com`
     (FEATURE_SPEC §20 #17).
  6. The staging spreadsheet, folder, script properties and first deploy? → the owner asked
     for help; the coordinator guided the setup step by step from the runbook.
- Agent 3 launched 2026-10-20 after CMP-029 (PR #25) merged.
- Owner answers (2026-10-20), verbatim: "both OK, samples uploaded. 2. yes 3. a 4. 24h". The
  questions, as asked: "both OK" — the staging `smokeCheck` log lines (properties, Drive service);
  "samples uploaded" — Cami's samples in `samples`; 2. coupon before the screenshot? → **yes**;
  3. a coupon typed but not applied: (a) block Submit or (b) submit without it? → **(a)**;
  4. English event times: 24-hour or 12-hour? → **24h**. Recorded in FEATURE_SPEC v1.2 (FFR-031,
  §20) and UX_UI_DIRECTION v1.2 (§13) in CMP-036.
- Staging: the owner set up the staging project, spreadsheet and folder from the runbook, with
  the coordinator's step-by-step guide, and deployed the CMP-024 skeleton (2026-10-20). Spike
  steps a and §8 smoke passed (Agent 1).
- Owner answers (2026-10-20), verbatim: "(a) for both, mapping confirmed". The questions, as
  asked: FFR-004 — (a) keep the events shown when a later refresh fails, or (b) hide on any
  failure? → **(a)**; OCR rate limit (spike finding: Google's per-user OCR limit) — (a) leave the
  check `pending` and retry it with a time-driven trigger, or (b) mark it `unreadable` and send
  the "not validated" email? → **(a)** (FFR-032, US-022 AC6). "mapping confirmed": the owner
  confirms the question-to-answer mapping of "both OK, samples uploaded. 2. yes 3. a 4. 24h"
  above.
- Spike results (CMP-024, 2026-10-20, run by the owner on staging): OCR on Cami's samples — 3 `ok`,
  the altered copy `mismatch` on amount; Google's per-user OCR rate limit hit, handled by
  backoff (→ FFR-032). A `.heic` already converted to JPEG on upload reads fine; a raw HEIC was
  not tested. The alias send failed for lack of a Gmail scope; the fallback sent from
  camila@lifetoolscr.com.
- Owner answers (2026-10-20), verbatim: "1. add the permission for no-reply@ 2. the fallback was
  camila@lifetoolscr.com" — questions as asked: (1) sender alias: (a) add the Gmail permission
  for no-reply@ or (b) send from the account as "Lifetools"? → **(a)**; (2) the From line of the
  fallback test email → camila@lifetoolscr.com. Then: "OK on the retry proposal, skip the raw HEIC
  test" — (1) the 10-minute retry, 24-hour limit and FFR-029 action alerts → **OK**; (2) a test
  with an unconverted iPhone HEIC → **skipped**; iPhone uploads are checked with a real iPhone in
  CMP-033 instead.
- Alias test (owner, 2026-10-20, after adding `gmail.settings.basic`), verbatim: "1. yes it is
  2. I did 3. permissions allowed 4. [log: Sent from alias no-reply@lifetoolscr.com to the running
  account … Remaining daily email quota: 1484] 5. the from says no-reply@ now". The steps, as
  asked: 1. no-reply@ listed and verified under Gmail "Send mail as"? → yes; 2. re-pasted
  `appsscript.json` and `Spike.js`? → done; 3. ran `emailAliasTest` and allowed the permission?
  → allowed; 4. the log lines → as quoted; 5. the From line of the test email → no-reply@.
  Spike step e passes with that scope.

