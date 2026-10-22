# ADR-009 — Deploy the Apps Script backend automatically from GitHub

- Status: Accepted (on merge of PR #46, CMP-048)
- Date: 2026-10-22
- Decision owner: Raul Casanas
- Related: [ADR-008](ADR-008-events-backend-google-apps-script.md),
  [TECH_STACK.md §9–§11](../../TECH_STACK.md#9-cicd),
  [events-backend-runbook.md](../process/events-backend-runbook.md); implementation CMP-047

## Decision Request
How should the Apps Script backend code (the `apps-script/` folder) get from `main` into the
staging and production Apps Script projects?

## Context
- Until now the owner copied each of ~16 files by hand into the online editor and created a new
  version of the existing deployment (runbook, ADR-008).
- During Sprint 02 staging testing (CMP-025..CMP-033, 2026-10-20/21) a manual paste broke the
  whole backend four times (a file overwritten with another's content, files swapped, a mangled
  file); each time the code in the repo was correct and every request failed until the owner
  found the wrong file.
- Production will have real participants; the same mistake there would stop registrations.

## Decision Drivers
- The deployed project must equal the reviewed code on `main`.
- A bad deploy must be caught at once, not by visitors.
- Production changes need the owner's explicit approval.
- Keep secrets out of the repo; keep the setup understandable for a one-developer project.

## Options Considered (as asked of the owner, 2026-10-22)
The question as asked: "How should backend updates be done from now on (staging first, then
production)?"

### A — Keep copy-paste
"No setup; keep the risk of a bad paste breaking the backend."

### B — `clasp push` from the owner's computer
"One-time ~40 min setup (needs Node.js on your computer and the Apps Script API turned on);
then one command uploads all files exactly." The login token stays on the owner's computer.

### C — Automatic from GitHub
"Deploys after each merge; your Google login token stored in GitHub. More setup, more risk."

## Decision
**C — automatic from GitHub** (owner, 2026-10-22: "C: automatic from GitHub"). A GitHub Actions
workflow runs Google's `clasp` tool (exact version pinned in `package-lock.json`):

- **Staging** deploys automatically on a push to `main` that changes `apps-script/**` (and on
  manual run).
- **Production** deploys only on a manual run from `main`, and the job waits for the owner's
  approval click (required reviewer on the `production` GitHub environment).
- Each run pushes the whole `apps-script/` folder (the project then equals the repo), creates a
  new version on the **existing** web-app deployment (the `/exec` URL does not change), and runs
  a smoke request (`events` must answer `ok`; a `register` with an invalid email must answer
  `VALIDATION_ERROR`; neither writes data, but the second bumps the throttle/metrics counters
  slightly).
- A separate check workflow runs on pull requests with **no secrets** (`node --check` on every
  backend file).

## Consequences
Positive:
- No manual paste: the project always equals `main`; a broken deploy fails the smoke request in
  the job log instead of reaching visitors unnoticed.
- A record of every deploy (run, commit) in GitHub.

Negative / risks (accepted by the owner):
- **The owner's Google login token is stored in GitHub** (environment secret
  `CLASP_CREDENTIALS`). Whoever can use it can change code that runs as the owner with Drive,
  Sheets and Gmail-settings access. Mitigations: secrets only in the `staging`/`production`
  environments, deployable only from `main`; production needs the owner's approval; no workflow
  with secrets runs on pull requests; actions pinned by commit SHA and `clasp` locked; two-factor
  on GitHub; `main` protected (pull request required), since a merge now deploys staging;
  revoke the token at once if anything looks wrong (runbook), rotate it every 6 months or after
  a Google password change.
- The token can expire (password change, long disuse): deploys then stop with a clear message
  before anything is pushed; the owner logs in again and replaces the secret.
- Hand edits in the online editor are overwritten by the next deploy; nobody edits there.
- Time-driven triggers run the newest pushed code as soon as it is pushed (they run Head).
- If the smoke request fails, the new version is already live; roll back by selecting the
  previous version in Deploy → Manage deployments, or revert the PR and redeploy.
- A change of `oauthScopes` in `appsscript.json` needs the owner to re-approve permissions
  before the backend works; the job summary says so.

## Follow-up
- CMP-047 (Agent 1): the workflows, the pinned `clasp`, `.clasp.example.json`, the runbook
  section with the owner's one-time setup (Apps Script API on, `clasp login`, environments,
  secrets, first `dry_run`), token revocation and rotation.
- Revisit later: an own OAuth client with minimal scopes for the token.
