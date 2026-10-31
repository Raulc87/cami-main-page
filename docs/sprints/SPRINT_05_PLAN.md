# SPRINT_PLAN — Sprint 05

## Metadata
- Sprint: 05
- Status: Proposed (approved on merge of the CMP-111 PR; the owner's go-ahead is Entry Gate 4)
- Start: the day of the go-ahead
- End: three working days after the go-ahead. A one-off exception to the 7-business-day cadence
  (AGENTS.md, PROJECT_SPEC §14, ADR-006), for this sprint only; the rule itself is unchanged
  (owner, 2026-10-31: "3 days, one-off exception"; Review Notes)
- Final human reviewer: Raul Casanas
- Plan from the kit's `SPRINT_PLAN_TEMPLATE.md` at the kit ref in
  [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md); agent prompts in
  [`SPRINT_05_AGENT_PROMPTS.md`](SPRINT_05_AGENT_PROMPTS.md)

## Entry Gates
Run [`SPRINT_READINESS_CHECKLIST.md`](../checklists/SPRINT_READINESS_CHECKLIST.md) first
(detail below).

| # | Gate | Status |
|---|---|---|
| 1 | [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md) paths resolve | Pass: docs link check on this PR's head |
| 2 | Readiness checklist has no open blocking items | Pass, except item 8 (the go-ahead), which is gate 4 |
| 3 | Integration contracts locked | Pass on merge: [`EVENTS_API_CONTRACT.md`](../specs/EVENTS_API_CONTRACT.md) v1.10 (this PR) adds one script property; the API's requests and responses do not change |
| 4 | Final go-ahead from the human owner | Pending |

### Readiness checklist result (2026-10-31)
| Item | Result |
|---|---|
| 1. Paths, `AGENTS.md`/`CLAUDE.md`, project key, branch names **(blocking)** | Pass (unchanged since Sprint 04; branches in Selected tickets) |
| 2. Docs agree on scope, names, behavior **(blocking)** | Pass: FEATURE_SPEC v1.14 (FFR-034), contract v1.10, US-026, EVENTS_EMAILS_AND_PRIVACY §2c, all in this PR; the sprint length is the owner's one-off exception (Metadata) |
| 3. Testable acceptance criteria **(blocking)** | Pass: US-026 AC1–AC5 and the ticket checks below |
| 4. Locked contracts for shared interfaces **(blocking)** | Pass (gate 3) |
| 4. Credentials rule | Pass: TECH_STACK §11, ADR-009; the new property holds an address, not a credential, typed by the owner |
| 5. Personal data **(blocking)** | Pass: nothing new is collected. The notice carries only the participant's name, the event and the payment status to Cami, who already holds the row; it never carries the email, WhatsApp number, coupon code or screenshot (FFR-034) |
| 5. Security baseline approved | Pass: approved (CMP-056); PTES due by 2026-12-26 (CMP-099) |
| 5. Stories touching an OWASP risk have verifying ACs **(blocking)** | Pass: US-026 AC3 (no sensitive data in the email), AC4 (no address in logs, the registration unaffected) |
| 5. Secret and dependency scanning | Pass: secret scanning on; dependency checks run on every PR (CMP-071) |
| 5. Pen test before a production release | Not yet due: the PTES deadline is 2026-12-26. This sprint changes the production backend before it (CMP-114) |
| 5. Pre-release security agent **(blocking: production change)** | Pass: its session stays open since Sprint 04 (step 5); its review of the backend changes merged in this sprint (`5d52c59` → the deploy commit) is planned before CMP-114 |
| 5. Written approval per agent scan **(blocking: production change)** | Pending, not blocking the go-ahead: the owner decides before CMP-114, as for v1.1.1 and v1.1.2 (a signed window, or leaving it to the PTES test); CMP-114 waits for it |
| 6. Hosting runtime, local development, developer guide | Pass: ADR-008, ADR-009, [`CONTRIBUTING.md`](../../CONTRIBUTING.md) |
| 6. Test, lint and CI checks; required on `main` | Pass: `apps-script-check`, `docs-link-check`, dependency audit |
| 6. Branching ADR and deployment runbook **(deploying sprint)** | Pass: ADR-007, ADR-009, the events-backend runbook |
| 6. Previews and tests use their own data | Pass: the staging backend and spreadsheet; `NOTIFY_REGISTRATION_TO` on staging holds the owner's test inbox during the check, then is emptied |
| 6. Real-delivery email test | Pass: the staging check reads the notice in a real inbox (CMP-112), and production's first real notice is confirmed by Cami (CMP-114) |
| 7. Workstreams assigned, ≤ 3 agents **(blocking)** | Pass: one implementation agent (Agent 1) |
| 7. Ownership map, no dependency cycle **(blocking)** | Pass |
| 7.1 Prompts: no merge or approve; reviewer independence; attribution **(blocking)** | Pass ([`SPRINT_05_AGENT_PROMPTS.md`](SPRINT_05_AGENT_PROMPTS.md)) |
| 8. Go-ahead **(blocking)** | Pending (gate 4) |

## Sprint Goal
Cami gets a short email each time someone registers to an event (US-026, FFR-034), and the
trigger failure email is seen arriving at least once.

## Required Deliverable
- The registration notice live on the production backend (CMP-114), the first real notice
  received by Cami.
- The time triggers' failure email seen in a real inbox (CMP-113).
- Evidence in `docs/sprints/SPRINT_05_VERIFICATION.md` (CMP-115).

No site release: the website does not change.

## Selected tickets
| Ticket | Work | Agent | Waits for | Branch | Status |
|---|---|---|---|---|---|
| CMP-111 | This plan, the agent prompts, FEATURE_SPEC v1.14 (FFR-034), contract v1.10, US-026, the notice text | Coordinator | — | `cmp-014-sdd-starter-kit-homologation-rqviz9` (coordinator's assigned branch) | done |
| CMP-112 | Registration notice to Cami (FFR-034, US-026) | Agent 1 | CMP-111 | `CMP-112-registration-notice` | todo |
| CMP-113 | Trigger failure email seen in a real inbox (staging) | Agent 1 + owner | — | `CMP-113-failure-email-check` (docs only, if the runbook changes) | todo |
| CMP-114 | Production backend deploy of CMP-112 | Agent 1 + owner | CMP-112's staging check and Cami's OK of the notice text; the security agent's review; the owner's scan decision | — (no code; evidence in CMP-115) | todo |
| CMP-115 | Sprint 05 verification | Agent 1 | every ticket above | `CMP-115-sprint-05-verification` | todo |

Outside this sprint (next sprint, with the owner): the five open Dependabot PRs (#104–#107,
#109), a first real rollback run of the site-upload workflow, the clasp audit exception expiring
2026-11-20, the PTES tester search (check-in 2026-11-13).

### Ticket checks (acceptance criteria)
- **CMP-111:** FFR-034, contract §9/§10 v1.10, US-026 and EVENTS_EMAILS_AND_PRIVACY §2c agree;
  the owner's three answers quoted (Review Notes).
- **CMP-112:** US-026 AC1–AC5 and contract §10 (v1.10):
  - one notice per newly stored registration (paid, ₡0, flagged under FFR-024), sent as the
    request's last step (after the participant's email and, when paid, the in-request payment
    check and its "not validated" email), to `NOTIFY_REGISTRATION_TO` only; the exact text and
    values of §2c, both languages; `pending` only when the check was deferred, and no second
    notice when the retry trigger finishes it;
  - none on a retry with the same `submissionId`, a duplicate email, a validation error, ₡0 sold
    out, a rate limit or a honeypot hit;
  - never the participant's email, WhatsApp number, coupon code, screenshot or a link to it;
  - empty property → no notice; invalid address → skipped, logged without the address; a send
    failure or a quota below `NOTIFY_QUOTA_RESERVE` → logged by error name only; the
    registration, its response, the participant's email and `needsReview` are never affected;
  - time: on staging, the `register` response time of a ₡0 registration measured three times
    with `NOTIFY_REGISTRATION_TO` set and three times with it empty; the PR reports both
    medians. If the notice adds more than 2 seconds, Agent 1 reports it to the coordinator,
    who changes the spec first (Change management); the agent does not move the notice on its
    own;
  - runbook §2.4 lists `NOTIFY_REGISTRATION_TO` (empty on staging, Cami's address on
    production, typed by the owner);
  - staging check after the merge (staging deploys on merge, ADR-009), with
    `NOTIFY_REGISTRATION_TO` set to the owner's test inbox: a ₡0 registration and a paid one
    (each one notice, readable, no personal data beyond the name), a retry (no notice), a
    duplicate email (no notice), the property emptied (no notice); Cami reads one notice and
    gives her OK of the text (or asks for changes: a coordinator docs PR, then a code PR,
    before CMP-114); then the cleanup. The row stays `review` until then.
- **CMP-113:** on staging, one time trigger with its "Failure notification settings" set to
  "Notify me immediately", `TRIGGER_FAIL_ALERT_AFTER` at 1, a deliberate failure (wrong
  `SPREADSHEET_ID`), and Google's failure email seen in the owner's inbox (sender and subject
  noted, no addresses in the evidence); then everything restored and the trigger deleted. The
  owner may combine it with CMP-112's staging check. If the email does not arrive, the runbook
  says where Google sends it (the account that created the trigger) and the owner decides what
  to change in production.
- **CMP-114:** Cami's OK of the notice text (CMP-112's staging check); the pre-release security
  agent's code review of the sprint's backend changes
  (`5d52c59` → the deploy commit) with no open critical or high finding; the owner's scan
  decision recorded; the owner adds `NOTIFY_REGISTRATION_TO` (Cami's address) in the production
  script properties, then runs the approved production deploy (runbook §5.1); smoke request
  green; both triggers present; the next real registration's notice confirmed by Cami (or the
  owner's own ₡0 test registration, deleted afterwards and marked as a test).
- **CMP-115:** `docs/sprints/SPRINT_05_VERIFICATION.md` with the evidence of every ticket and
  the staging cleanup list.

## Parallel Workstreams
### Agent 1 — Events backend (fresh session)
- CMP-112 at the go-ahead; CMP-113's steps for the owner at the same time; CMP-114 after
  CMP-112's staging check; CMP-115 last.

### Pre-release security agent (its Sprint 04 session)
- Reviews CMP-112's merged code before CMP-114 and reports to the coordinator only.

Maximum implementation agents in parallel: 1.

## Foundation (before parallel work)
CMP-111 (this PR): the spec and contract the code follows.

## File Ownership Map
Agents edit only files they own; changes elsewhere are requested from the owner of the file.

| Path | Owner |
|---|---|
| `apps-script/**`, `.github/clasp/**` (except Dependabot's own pull requests), `.github/scripts/**` except `check_doc_links.py`, `.github/workflows/deploy-apps-script.yml`, `.github/workflows/apps-script-check.yml`, [`docs/process/events-backend-runbook.md`](../process/events-backend-runbook.md), `docs/sprints/SPRINT_05_VERIFICATION.md`, `docs/sprints/evidence/sprint-05/**` | Agent 1 |
| `docs/security/**` | Pre-release security agent (only with the owner's OK per PR, as in Sprint 04) |
| [`TICKETS.md`](../../TICKETS.md) | Shared: each agent updates only its own rows; the coordinator adds rows |
| `docs/specs/**`, `docs/ux/**`, `docs/sprints/SPRINT_05_*.md` except the verification, the process docs, [`AGENTS.md`](../../AGENTS.md), [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md), [`TECH_STACK.md`](../../TECH_STACK.md), `docs/decisions/**` | Coordinator (docs PRs) |

Nobody edits the site (`src/**`, `public/**`, `index.html`, `package.json`) this sprint.

## Integration Contracts
[`EVENTS_API_CONTRACT.md`](../specs/EVENTS_API_CONTRACT.md) v1.10: §9 `NOTIFY_REGISTRATION_TO`
and the §10 test obligation. The site is not a party to this change.

## Merge / Integration Order
Each line names what the PR waits for.

1. CMP-111 (this plan and the spec) — nothing.
2. CMP-112 (registration notice) — CMP-111. CMP-113 (failure email check) — nothing; its docs
   PR, if any, after CMP-112's merge to keep the runbook edits in order.
3. CMP-114 (production deploy) — CMP-112's staging check; the security agent's review; the
   owner's scan decision.
4. CMP-115 (verification) — every PR above.

Cycle check: every arrow points to a PR earlier in this list.

## Conflict Resolution
- Merge conflicts are resolved when found, by the human owner together with the agent that owns
  the conflicting file.
- An agent must not rewrite another agent's files to resolve a conflict.

## Review-only Agent
A fresh review-only session (Opus) reviews each PR when its author asks after a push, or when
the owner or the coordinator asks ([`AGENTS.md`](../../AGENTS.md) → Review flow). Codex reviews
every PR automatically.

## Human Review
The human reviewer is the final approver.

## Verification
- Each PR: `npm run build` and `node --check` on changed `apps-script/` files, its checks above,
  evidence in the PR body.
- CMP-112 deploys staging on merge (ADR-009): its staging check runs after the merge, and its
  row stays `review` until then.
- CMP-115 collects the evidence.

## Risks
- Gmail's daily sending quota: each registration now sends two emails. At today's volumes this
  is far below the Workspace quota; FFR-034 skips the notice first when the quota runs low.
- The notice adds a little time to `register` (one more email after the payment check). CMP-112
  measures it; more than 2 seconds goes back to the coordinator for a spec change, not an
  agent's choice.
- The failure email may go to the Google account that created the trigger, not the owner's
  usual inbox (CMP-113 finds out).
- Production gets a backend change before the PTES test (due 2026-12-26): reviewed by the
  pre-release security agent first.

## Sprint Definition of Done
- Every selected ticket `done`, or moved to the next sprint by the owner.
- The Required Deliverable demonstrated and its evidence approved: merging CMP-115.
- [`TICKETS.md`](../../TICKETS.md) and [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md)
  updated.

## Sprint Review Notes
- Owner's request, 2026-10-31, verbatim: "actually we have a small request that I think it's
  only BE, Cami needs an email notification when someone registers to an event. what do you
  think? we can do it before the dependencies Sprint". Questions as asked and answers:
  - "How often should Cami be told about new registrations?" Owner: **"One email per
    registration (Recommended)"** (the other option: one daily summary).
  - "What should the email contain?" Owner: **"Short: event, name, payment status
    (Recommended)"** (the other option: everything in the row).
  - "Who should receive it?" Owner: **"Cami only"** (the other option: the same people as the
    daily alert, `ALERT_TO`). Hence a separate property, `NOTIFY_REGISTRATION_TO`.
- The staging trigger failure email from Sprint 04's check (CMP-101) did not arrive (owner,
  2026-10-31: "the failure email did not arrived"); likely because the staging triggers were
  deleted in the cleanup before Google's daily summary. CMP-113 checks it with immediate
  notification.
- Review of this plan (PR #125), owner's answers 2026-10-31, as asked:
  - "When a paid registration arrives, the backend first saves it, emails the participant, then
    checks the payment screenshot. When should Cami's notice go out?" Owner: **"After the
    payment check (Recommended)"** (the other option: right after saving, always `pending` for
    paid rows). FFR-034 → When.
  - "Our rules set every sprint at 7 business days. The plan said 3 days for this small sprint.
    Which do you prefer?" Owner: **"3 days, one-off exception"** (the other option: keep 7
    days, may end early). Recorded in Metadata; the rule is unchanged.
