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
**C — automatic from GitHub** (owner, 2026-10-22: "C: automatic from GitHub"). Re-confirmed after the
token's full reach was explained (owner, 2026-10-22), question as asked: "Before Agent 1 builds
the GitHub deploy: the reviewer clarified the token's reach. The Google login stored in GitHub
can change ANY Apps Script project you can edit (not just these two), and code pushed with it
can send email as you and read/write all of your Google Drive. Mitigations stay: production
needs your approval click, secrets only usable from main, 2FA, revoke anytime. Still go with
C?" — options: yes, keep C; switch to B. Owner: "Yes, keep C". A GitHub Actions
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
  `CLASP_CREDENTIALS`). It is not limited to these two projects: `clasp login` grants broad
  scopes (read/write of **every** Apps Script project the owner can edit, their deployments,
  access to the Drive files used with the app (`drive.file`) and Drive metadata, and
  `cloud-platform`; the exact list is read
  off the consent screen at setup and recorded below). Code pushed with it runs as the
  owner with the backend's own scopes: it **sends email as the owner**, reads and writes **all**
  of the owner's Drive (full Drive scope, TECH_STACK §11), the events spreadsheet, and can
  change time triggers. Mitigations: secrets only in the `staging`/`production`
  environments, deployable only from `main`; production needs the owner's approval; no workflow
  with secrets runs on pull requests; actions pinned by commit SHA and `clasp` locked; two-factor
  on GitHub; `main` protected (pull request required), since a merge now deploys staging;
  revoke the token at once if anything looks wrong (runbook), rotate it every 6 months or after
  a Google password change.
- **The production approval protects against accidental deploys, not a stolen token.** Both
  environments hold a login token for the same Google account, and that token can change any
  project the account edits, production included. Whoever obtains the staging secret (e.g.
  through code merged to `main` that runs in the staging job) can change production without the
  approval click. Acknowledged by the owner (2026-10-22), question as asked: "One more point
  on the automatic deploy before Agent 1's setup: if someone stole the STAGING login stored in
  GitHub, they could also change PRODUCTION without your approval click, because both use the
  same Google account. The approval click only stops accidental deploys. The defence is that the
  login never leaks: only code you merge into main can use it. Is that OK as is, or set up a
  separate staging-only Google account now (more setup; staging might then send its emails from
  that account)?" — options: OK as is; separate staging account. Owner: "OK as is
  (Recommended)". The defense is to keep
  the secret from leaking (protected `main`, reviewed merges, the supply-chain measures below,
  revocation). Revisit: a separate Google account that can edit only the staging project, so
  the staging secret cannot reach production (Follow-up).
- **Supply chain:** any code that runs in the deploy job could read the token. Mitigation
  (CMP-047): the deploy job installs only `@google/clasp` (pinned, with install scripts off or
  from its own lockfile), not the site's dev dependencies; the credentials file is written only
  in the step that runs `clasp` and deleted after; actions are pinned by commit SHA.
- The token can expire (password change, long disuse): deploys then stop with a clear message
  before anything is pushed; the owner logs in again and replaces the secret.
- Hand edits in the online editor are overwritten by the next deploy; nobody edits there.
- From the owner's computer, `clasp` is used only for the first upload into a new project
  (before its secrets exist) and in an emergency when the workflow cannot run (runbook); every
  routine deploy goes through the workflow. Nothing is ever pasted into the editor.
- Time-driven triggers run the newest pushed code as soon as it is pushed (they run Head).
- If the smoke request fails, the new code is already in the project. The workflow puts the
  web-app deployment back on the version it served before, but that does **not** roll back the
  saved code (Head), which the two time triggers keep running (they can write the sheet, Drive
  and send emails). So a failed smoke request is handled at once: revert the PR and let the
  workflow redeploy the reverted code (staging runs on the merge; production needs a manual,
  approved run); until then, if the faulty code could harm data, delete both triggers in the
  project's Triggers page (Apps Script cannot pause them) and create them again after the
  redeploy (runbook). Selecting a previous
  version alone is never a sufficient rollback.
- A change of `oauthScopes` in `appsscript.json` needs the owner to re-approve permissions
  before the backend works; the job summary says so.

## Follow-up
- CMP-047 (Agent 1): the workflows, `@google/clasp` pinned as a dev dependency (installed alone
  in the deploy job), `.clasp.example.json`, and the runbook section with the owner's one-time
  setup: Apps Script API on; `clasp login` and **record the scopes shown on the consent screen**;
  GitHub two-factor on; `main` protected (pull request required); `staging` and `production`
  environments limited to `main`, with the owner as required reviewer on `production`; the three
  secrets; Actions workflow permissions read-only; a first `dry_run`; token revocation and
  rotation.
- Scopes granted at the owner's `clasp login` (2026-10-22, `clasp` 3.4.1; Google's account
  permissions page, nine items, read by the coordinator from the owner's screenshot, in Spanish
  in the original): see your profile information; see, edit, create and delete only the specific
  Google Drive files used with this app; see information about your Google Drive files; create
  and update Google Apps Script projects; create and update Google Apps Script deployments; view
  the projects' log data; publish this app as a web app or a service that can share your data;
  see, edit, configure and delete your Google Cloud data and see your account's email address;
  manage your Google API service configuration. The token itself holds no full-Drive or Gmail
  scope; code it pushes still runs with the backend's own scopes (above).
- First runs (2026-10-22): the staging dry run reached `cami-events-staging` and listed the 16
  files; the first real run failed with "User has not enabled the Apps Script API" right after the
  API was turned on (Google needs a few minutes to apply it) and passed on a re-run: 16 files
  pushed, version 20 on the existing deployment, smoke request PASS (events ok, invalid
  registration `VALIDATION_ERROR`). Production setup pending (release-checklist §3b).
- Revisit later: an own OAuth client with minimal scopes for the token, and a separate Google
  account (editor of the staging project only) for the staging secret, so a leaked staging
  secret cannot reach production.
