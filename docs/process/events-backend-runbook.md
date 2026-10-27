# Events Backend Runbook

How the owner creates, deploys, updates and rolls back the events backend (Google Apps Script web
app, [ADR-008](../decisions/ADR-008-events-backend-google-apps-script.md)) for **staging** and
**production**, and how the site build points at it. Written for CMP-023 (Sprint 02); it is
corrected from what actually happens at the first staging deploy (implementation plan §11 step 3).

Interface and names: [EVENTS_API_CONTRACT.md](../specs/EVENTS_API_CONTRACT.md) (§9 lists every
script property and the frontend variable). The site release itself stays in
[release-checklist.md](release-checklist.md).

**Code status.** The `apps-script/` folder does not exist yet; CMP-024 creates it. Where this
runbook mentions `appsscript.json` or a smoke function, that is a requirement CMP-024 must meet
(and CMP-024 checks it). Until it is merged, sections 2.2 onward cannot be run end to end.

**Who does what.** The owner (Raul Casanas) deploys; agents never hold deploy credentials. An
agent says which steps of this runbook a merged PR needs and confirms the deploy with a smoke
request (section 8).

**Never in Git:** spreadsheet or folder IDs, the SINPE number and account name, script
properties, `.clasp.json`, `.env.local`, screenshots, personal data.

## 1. Environments

| | Staging | Production |
|---|---|---|
| Apps Script project | `cami-events-staging` | `cami-events-production` |
| Spreadsheet | staging copy (contract §6 tabs) | the real one |
| Drive root folder | staging folder | the real one |
| Script properties | staging values | production values (real SINPE data, BR-E01) |
| Site build | `.env.local` while developing | `VITE_EVENTS_API_URL` at release time |

Use **two separate projects with the same code**. Script properties belong to the project, so a
single project with two deployments would share one spreadsheet, folder and SINPE data; staging
could then write to production data. The code is identical: both projects receive the same
`apps-script/` files from the repo.

Both projects live in the `lifetoolscr.com` Google Workspace account that owns the spreadsheet
and folder, because the web app runs as that account (section 3).

## 2. One-time setup (per environment)

Do this once for staging, and again for production when the release gates pass
([release-checklist.md §3b](release-checklist.md#3b-events-feature-release-gates-feature_spec_events_registration-br-e11)).

### 2.1 Data store
Format the `eventCode` column of `Events` and the `eventCode` and `couponCode` columns of
`Coupons` as plain text (select the column, Format → Number → Plain text), so that a code such as
`2026-11` or `1E5` stays text and is not turned into a date or a number. Event codes cannot be
`EVENTS`, `COUPONS`, `METRICS` or `TRANSLATIONS` (the names of system tabs): such a row is ignored and listed in
the alert email.
Times in the `Events` tab are written in 24 h `HH:mm` (for example `18:30`); a time shown as
`6:30 PM` is treated as invalid and the event is not shown (it is listed in the alert email).
1. In Google Drive (Workspace account), create the spreadsheet with the tabs from contract §6:
   `Events`, `Coupons`, `Metrics`, with the column headers exactly as listed there. Registration
   tabs (`<eventCode>`) are created by the script on the first registration.
2. Create the Drive root folder for screenshots. The script creates `<eventCode>/` subfolders.
3. Copy the IDs (the long string in each URL: `.../d/<SPREADSHEET_ID>/edit` and
   `.../folders/<DRIVE_ROOT_FOLDER_ID>`). Keep them out of the repo and out of chat history you
   do not control; they go only into script properties (2.4).

### 2.2 Create the Apps Script project
The project is a **standalone** script; it reaches the spreadsheet through `SPREADSHEET_ID`, so the
same code works in both environments (owner decision 2026-10-20, ADR-008). The code is never typed
or pasted into the editor: it is uploaded by `clasp`, first by hand from your computer (below), then
by the GitHub workflow (section 5.1). Create one project per environment.
1. Open <https://script.google.com> signed in as the Workspace account → **New project**, name it
   per section 1 (`cami-events-staging` / `cami-events-production`: the workflow checks the name).
2. **Project Settings** (gear) → copy the **Script ID** (kept private, never in the repo).
3. Do the one-time setup of section 5.1 steps 1 and 2 (Apps Script API on, `clasp login`).
4. First upload, once per environment, from the repo folder:
   `cp .clasp.example.json .clasp.json`, put the script ID in `.clasp.json` (never commit it; it is
   in `.gitignore`), then `.github/clasp/node_modules/.bin/clasp push --force`. This replaces the
   default file of the new project with the files of `apps-script/`, including the manifest.
5. Create the first web-app deployment by hand (section 3), then add the environment's secrets
   (section 5.1). From then on the workflow uploads and deploys.

### 2.3 Enable the Advanced Drive Service (OCR)
Required by the payment check (US-022).
1. In the editor, left sidebar **Services** (+) → **Drive API** → version **v2** → identifier
   `Drive` → **Add**.
2. CMP-024's `apps-script/appsscript.json` must list it under
   `dependencies.enabledAdvancedServices`; with `clasp push` it is then set from the manifest.
   Confirm it shows under Services.
3. If the call fails later with "Drive API has not been used in project…", open the Google Cloud
   project linked to the script (Project Settings → Google Cloud Platform project) and enable
   **Google Drive API** there.

### 2.4 Script properties
**Project Settings** → **Script Properties** → **Edit script properties** → add each row. Names
and initial values are the contract (§9); do not rename them.

| Property | Value |
|---|---|
| `SPREADSHEET_ID` | the spreadsheet ID for this environment |
| `DRIVE_ROOT_FOLDER_ID` | the folder ID for this environment |
| `SINPE_NUMBER` | until Cami confirms (staging, and production before release): `0000-0000 (POR CONFIRMAR / TO BE CONFIRMED)` (BR-E01); then the real number |
| `SINPE_ACCOUNT_NAME` | until Cami confirms: `Nombre por confirmar` (BR-E01); then the real name |
| `MAIL_FROM_ALIAS` | `no-reply@lifetoolscr.com`; the account that owns the project must have it as a verified "Send mail as" alias in Gmail (Settings → Accounts → Send mail as), (checked in the spike, step e); if sending from it fails, the fallback is `camila@lifetoolscr.com` |
| `MAIL_REPLY_TO` | `camila@lifetoolscr.com` |
| `LIMIT_REGISTER_PER_MIN` | `20` |
| `LIMIT_COUPON_CHECKS_PER_MIN` | `30` |
| `LIMIT_COUPON_FAILS_PER_MIN` | `10` |
| `LIMIT_UPLOADS_PER_DAY` | `100` |
| `LIMIT_UPLOAD_MB_PER_DAY` | `300` |
| `ALERT_HONEYPOT_PER_DAY` | `10` |
| `ALERT_THROTTLED_PER_DAY` | `20` |

The `SPIKE_ENABLED` property of the CMP-024 spike is gone with the spike `register` stub (CMP-026);
delete it from the staging project if it is still there. The limits above are enforced from
CMP-027: over a per-minute limit the answer is `RATE_LIMITED`, over the daily screenshot count or
MB cap a paid registration gets `UPLOAD_CAP_REACHED` (₡0 ones are unaffected). The `ALERT_*`
values decide when the day's alert email is sent. All of them can be changed here without a
deploy.
**Create the production project only after CMP-026 and CMP-027 are merged** (validated `register`,
throttling and daily caps); until then `main` holds a backend that must not be public.

A placeholder SINPE value is shown to visitors with the placeholder marker
(`isPlaceholder`, BR-E01). Production must never keep it
([release-checklist.md §3b](release-checklist.md#3b-events-feature-release-gates-feature_spec_events_registration-br-e11)).
The limits can be changed here later without a contract change.

### 2.5 Authorize the script
The first run asks for the permissions the code needs (Sheets, Drive, mail, external requests).
1. In the editor, select any function (for example the smoke function the code provides) and
   press **Run**.
2. **Review permissions** → pick the Workspace account → **Advanced** → **Go to <project>
   (unsafe)** → **Allow**. The "unsafe" warning appears because the script is not verified by
   Google; it is your own script.
3. Scopes are listed in `apps-script/appsscript.json` (`oauthScopes`, required from CMP-024).
   `gmail.settings.basic` is there only so the script may send from the `MAIL_FROM_ALIAS` address
   (Apps Script checks it against the account's "Send mail as" list); it also allows reading and
   changing Gmail settings, so run only this repo's code in the project.
   If a later PR adds a
   scope, you will have to repeat this step and create a **new version** (section 5) for the web
   app to use it.

### 2.6 Events cache trigger
Do this once in **each** environment: staging, and production before it is released.
The `events` answer is kept in a cache and rebuilt every 5 minutes, so the page never waits for
the spreadsheet (a rebuild takes about 5 s and the site gives up after 3 s). A change Cami makes
in the sheet shows within about 5 minutes (owner decision 2026-10-20). Without the trigger the
page still works, but the first visitor after the cache expires (6 minutes) waits about 5 s and
may not see the events section.
1. In the script editor, click the clock icon (**Triggers**) in the left sidebar.
2. **Add Trigger** (bottom right).
3. Choose which function to run: `refreshEventsCache`. Choose which deployment should run:
   **Head**. Select event source: **Time-driven**. Select type of time based trigger:
   **Minutes timer**. Select minute interval: **Every 5 minutes**.
4. **Save**. If Google asks for permission, allow it (same account, **Advanced** → **Go to
   project (unsafe)** → **Allow**).
5. Check: after about 6 minutes, open **Executions** (sidebar): a `refreshEventsCache` run
   appears about every 5 minutes with status **Completed**. A **Failed** run: open it and read the
   log; the site keeps working from the last cache or rebuilds on demand.
The same run also writes the day's counters (accepted, honeypot hits, throttled, failed coupon
checks, MB uploaded) to the `Metrics` tab, so the row can be up to 5 minutes behind (the alert
already counts what is waiting), recounts the registrations Cami has marked `spam` in it, drops
old daily counters, and sends the **daily alert email** to `MAIL_REPLY_TO` when something new
needs Cami's attention (an invalid `Events` or `Coupons` row, or a daily threshold crossed); at
most one per day, and findings made after it go into the next day's email. While testing, point
`MAIL_REPLY_TO` at your own address so that Cami does not receive test alerts, and set it back
afterwards.
If a rebuild fails, that run is shown as **Failed** (the other language is still attempted). The
last good answer is also kept in script properties and used for up to 20 minutes if Google drops
the cache early, so a short outage does not empty the page. That copy fits while the event list is
under about 9 KB (roughly 6 to 8 events with full-length texts); beyond that the run is reported
as **Failed** with "last-good copy too large", and the cache keeps working without the fallback.
After bumping `EVENTS_CACHE_VERSION` in `Events.js`, deploy a New version right away (section 5):
the trigger fills the new keys at once while the deployed version still reads the old ones.
Triggers run the **saved** code (Head), not the deployed version: after changing `Events.js`,
saving is enough for the trigger, while visitors still need a **New version** (section 5).
The automatic English translations are kept in the `Translations` tab (created by the script;
columns `hash` and `text`, one row per translated text). The 5-minute run deletes the rows no
published event uses any more (the translation of a draft event is dropped on each run and made again when it is published), so the tab stays as small as the event list. To change a
translation by hand, fill the `nameEn`/`descriptionEn` columns of the event instead (they win), or
delete its row from `Translations` to have it translated again. Earlier versions kept them as
`TR_<hash>` script properties; see "Script properties page is read-only" below.
Quota: about 290 runs a day of 5 to 10 s each, well inside the Workspace limits.

### 2.7 Pending payment checks trigger
Do this once in **each** environment (staging, and production before release), after the Events cache
trigger (2.6). The payment screenshot is read with Drive OCR right after a registration is saved. If
Google refuses the call (for example its per-user OCR rate limit) the row keeps the check result
`pending`; this trigger tries those rows again every 10 minutes and writes the result (and sends the
"payment not validated" email when it applies). A row still `pending` 24 hours after it was saved is
no longer retried and is listed in that day's alert email (at most one per day).
1. **Triggers** (clock icon) → **Add Trigger**.
2. Function: `retryPendingChecks`. Deployment: **Head**. Event source: **Time-driven**. Type:
   **Minutes timer**. Interval: **Every 10 minutes**. **Save** (allow the permissions if asked).
3. Check: after about 10 minutes **Executions** shows a `retryPendingChecks` run with status
   **Completed** (it ends at once when no row is `pending`).
The check needs `SINPE_NUMBER` and/or `SINPE_ACCOUNT_NAME` in the script properties (2.4). While
`SINPE_NUMBER` still holds the placeholder and no account name is set, no check runs and rows stay
`pending`. Participant emails go from `MAIL_FROM_ALIAS` (or the account itself if the alias fails)
with reply-to `MAIL_REPLY_TO`; while testing, set `MAIL_REPLY_TO` to your own address, and use test
registrations with your own email address, so that no real participant is written to.
Triggers run the saved code (Head); visitors need a **New version** (section 5).

### 2.8 Script properties page is read-only (more than 50 properties)
The Apps Script settings page lets you edit script properties only while there are 50 or fewer.
The script itself keeps about 30 (the settings in 2.4 plus the cache copy, alert state and the
counters of today and yesterday), so it normally stays well below. If the page ever says the
properties are read-only:
1. In the editor run `showPropertyUsage`: the log shows how many properties exist and which kinds
   (names only, no values).
2. If many are `TR_<hash>` (left by an earlier version), run `deleteTranslationProperties`. The
   translations now live in the `Translations` tab and are rebuilt by themselves.
   If a tab named `Translations` holds anything but the `hash` and `text` columns, the script leaves it alone and translates without storing (one translation call per text on every 5-minute run): rename that tab.
3. Open the settings page again. Do this in each environment, and before editing `SINPE_*` or
   `MAIL_REPLY_TO` when the page is read-only.

## 3. Deploy as a web app (first time)
1. Editor → **Deploy** → **New deployment** → gear → **Web app**.
2. Description: the version note (for example `staging – skeleton`).
3. **Execute as: Me** (the Workspace owner account). This lets the script write to the owner's
   Sheets and Drive with no per-visitor sign-in.
4. **Who has access: Anyone** (anonymous). The site calls it from the browser without login. The
   endpoint is therefore public: abuse controls are in the code (contract §9, FEATURE_SPEC §12).
5. **Deploy**. Copy the **Web app URL** (ends in `/exec`). This is the value of
   `VITE_EVENTS_API_URL` for this environment.
6. Record, somewhere private (not the repo), each environment's URL and the **Deployment ID**
   (in **Deploy → Manage deployments**): the ID goes into the `APPS_SCRIPT_DEPLOYMENT_ID` secret of
   that environment (section 5.1).

CMP-024's `apps-script/appsscript.json` must set `webapp.executeAs` = `USER_DEPLOYING` and
`webapp.access` = `ANYONE_ANONYMOUS`. Do not rely on it for the first deployment: `clasp`
does not apply these to a deployment it creates (it defaults to access "Only myself"). Always
create the first deployment in the editor with the selections above, for `clasp` users too.
After any `clasp deploy`, check **Manage deployments** still shows Execute as: Me and Anyone.

If your Workspace admin restricts "Anyone" access for scripts, the deploy dialog will not offer
it; ask the Workspace admin to allow it, or stop and report (the site cannot call an endpoint
that requires sign-in).

## 4. Why the URL matters
The `/exec` URL is baked into the site build. **A new deployment gets a new URL**; an updated
deployment keeps it. Always update (section 5); create a new deployment only for a new
environment. Never use the `/dev` URL (**Test deployment**): it runs the last saved code but only
for signed-in editors, so the site cannot call it.

## 5. Update an existing deployment (keep the `/exec` URL)
Routine updates are made by the GitHub workflow (5.1): it uploads `apps-script/` and puts a new
version on the **existing** deployment, so the `/exec` URL does not change. Never create a second
deployment for an environment that already has one: a new deployment gets a new URL.

**Emergency only**, when the workflow cannot be used (for example the token has to be renewed
first), the same can be done by hand from the owner's computer, with the login file and a
`.clasp.json` (section 5.1, "Local use"). The other use of `clasp` from the computer is the
one-time first upload of a new project (section 2.2). Routine deploys are never made by hand. The
emergency commands:
```bash
.github/clasp/node_modules/.bin/clasp push --force
.github/clasp/node_modules/.bin/clasp deploy --deploymentId <DEPLOYMENT_ID> --description "CMP-025 events read"
.github/clasp/node_modules/.bin/clasp deployments   # confirm the same ID now points to the new version
```
`clasp deploy` **without** `--deploymentId` creates a new deployment with a new URL: do not do
that for an environment that already exists. Do not edit or paste code in the online editor.

Saving code does **not** change the deployed web app: only a new version on the deployment does.
The time triggers are the exception: they run the **saved** code (Head), so a push changes what
they run at once.

### 5.1 Automatic deploy from GitHub (CMP-047, ADR-009)
After the one-time setup below, a merge to `main` that changes `apps-script/` deploys **staging**
by itself, and **production** is deployed by hand with the owner's approval click. The workflow
uploads the whole `apps-script/` folder (so the project always equals the repo: no file can be
missing or wrong), puts it on the **existing** deployment (the `/exec` URL does not change) and
then sends a smoke request. Anything edited by hand in the online editor is overwritten at the next
deploy, so do not edit there.

The job installs **only** `clasp`, locked, from its own `.github/clasp/package-lock.json` and
without install scripts, never the site's dependencies. The Google login is written to a file only
inside `.github/scripts/deploy-apps-script.sh` and removed when that script ends, whatever happens;
nothing prints it.

**What the workflow does** (`.github/workflows/deploy-apps-script.yml`)
1. Reads the three secrets of the environment (below). Nothing prints them.
2. Asks Google for the project's title and stops unless it contains `staging` (or `production`)
   and not the other word (guards against swapped secrets), so name the projects like
   `cami-events-staging` and `cami-events-production`. It prints the title. An expired or revoked
   token stops here, before anything is pushed. It also notes which version the deployment serves
   now.
3. `clasp push` of the folder, then `clasp deploy` onto the existing deployment ID.
4. Smoke request on the `/exec` URL: the events list must answer ok, and a registration with an
   invalid email must be refused with `VALIDATION_ERROR` (`RATE_LIMITED` is also accepted when the
   registration limit is hit at that moment). Neither writes to the sheet, Drive or email; the
   second adds one request to the register counters, also in production. The events list can come
   from the cache of the previous version (the registration request always runs the new code): a
   broken events build shows within five minutes as a **Failed** `refreshEventsCache` run in
   **Executions**, so check it after each deploy.
   If the smoke request fails, the deployment is put back on the version it served before and the
   job still ends red. **Putting the deployment back does NOT roll back Head: the time triggers keep
   running the faulty code (they run the saved code).** Revert the pull request and deploy the
   reverted code. If the faulty code could harm data (wrong rows, emails to participants), delete
   both triggers meanwhile and add them again afterwards (sections 2.6 and 2.7).
5. If the permissions (`oauthScopes` in `appsscript.json`) differ from the project's, the job
   summary says so: the owner must approve the new permissions (open the project, run any
   function once, allow) before the web app and the triggers work again.
A `dry_run` option (manual run) does the checks (it still needs the real secrets: it logs in and
reads the project) and lists the files, and pushes nothing. A change to `apps-script/`, to the
scripts under `.github/scripts/`, to `.github/clasp/` or to the workflow on `main` deploys staging.

**One-time setup (owner, plain words)**
1. Turn on the **Google Apps Script API** for the Workspace account that owns the projects:
   <https://script.google.com/home/usersettings>. A Workspace admin may have to allow it. Google
   needs a few minutes to apply it: a run right after can fail with "User has not enabled the Apps
   Script API"; wait and re-run.
2. On your computer, in the repo folder: `cd .github/clasp`, `npm ci --ignore-scripts`, then
   `./node_modules/.bin/clasp login` (a browser sign-in as that account). This writes the login file
   `~/.clasprc.json`. Treat it like a password. **On Google's consent screen, write down every
   permission it lists** (tick-by-tick, or a screenshot) and send the list to the coordinator, who
   records it in ADR-009: it is the full reach of this token. (`npx @google/clasp@3.4.1 login`
   also works and was used at the first setup, but it does not use the repo's lockfile and it runs
   install scripts; prefer the repo route above for rotations.)
3. GitHub → repo **Settings → Environments**: create `staging` and `production`. For both, under
   *Deployment branches* choose **Selected branches → main**. For `production` also tick
   **Required reviewers** and add the owner.
4. In **each** environment add three *environment secrets* (not repository secrets):
   - `CLASP_CREDENTIALS`: the whole contents of the login file. On a Mac, `pbcopy < ~/.clasprc.json`
     copies it without showing it; paste it into the secret, then clear the clipboard with
     `echo -n | pbcopy`. The same login serves both environments.
   - `APPS_SCRIPT_ID`: the script ID of that environment's project (Project Settings → IDs).
   - `APPS_SCRIPT_DEPLOYMENT_ID`: the ID of the existing web-app deployment whose `/exec` URL the
     site uses (**Deploy → Manage deployments**, the ID under the active web app; not the
     "Head / test" deployment).
   The production project and its first web-app deployment are created by hand once (sections 2 and 3);
   then add the production secrets.
5. **Settings → Actions → General**: *Workflow permissions* = **Read repository contents**; *Fork pull
   request workflows* = require approval for outside collaborators. **Protect `main`** (**Settings →
   Branches**: pull request required; required approvals **0**, because every pull request here is
   opened under the owner's own account and GitHub does not let an author approve their own pull
   request), because a merge to `main` now deploys staging. Turn on two-factor sign-in for the
   GitHub account (**Settings → Password and authentication**).
6. First run: **Actions → Deploy Apps Script → Run workflow** with environment `staging` and
   **dry run** on, then once without dry run. Read the printed project title and the smoke result.

**Who can deploy**: anyone who can merge into `main` deploys staging; only the owner's approval
click lets a production run start. No workflow that runs on pull requests can read the secrets.

**Token care**
- The login token reaches far (full list in ADR-009): every Apps Script project the account can
  edit and their deployments, Drive file access and the Google Cloud platform scope. Code pushed
  with it runs as the Workspace owner: it **sends email as the owner** and reads and writes **all**
  of the owner's Drive. A leaked staging secret can change production too (same account). Keep the
  GitHub account protected with two-factor sign-in, and read ADR-009 before the first setup.
- If anything looks wrong, or when a person with access to the repository settings leaves: revoke
  it at <https://myaccount.google.com/permissions> (the clasp app), run `clasp login` again (runbook 5.1) and
  replace `CLASP_CREDENTIALS` in **both** environments. Do the same every 6 months, and after changing
  the Google account password.
- When the token has expired or been revoked the deploy stops at step 2 with
  "Google rejected the login token": renew it as above and run the workflow again. Nothing was pushed.
- Optional hardening later: sign in with your own Google Cloud OAuth client that has only the
  Apps Script scopes (`clasp login --creds ...`).

**Local use (first upload and emergencies only)**: with the login file on your computer and a
`.clasp.json` made from `.clasp.example.json` (never committed), `.github/clasp/node_modules/.bin/clasp
push` and `... clasp deploy --deploymentId ...` do by hand what the workflow does. Use it for the
one-time first upload of a new project (section 2.2) and when the workflow cannot run (for example
while the token is being renewed); say so in the pull request or the deployment description. Do not
use both for the same change.

## 6. Roll back to a previous version
The deployment keeps its URL; only the version it serves changes.
1. **Deploy** → **Manage deployments** → pencil on the active deployment.
2. **Version** → pick the previous numbered version (see **Project history** / `clasp versions`
   if unsure which) → **Deploy**.
3. Repeat the smoke request (section 8).

Choosing a previous version changes only what the web app serves. **It does not roll back Head:
the time triggers run the saved code.** Revert the change in the repository and deploy the reverted
code (section 5.1); if the faulty code could harm data, delete both triggers until then.

With `clasp`: `clasp deploy --deploymentId <DEPLOYMENT_ID> --versionNumber <N>`.

Data is not rolled back: rows and files already written stay. If a bad version wrote bad rows,
fix them in the sheet by hand (status `spam` or `refund/cancelled` frees capacity and coupon uses,
contract §6).

## 7. Point the site build at an environment
The URL is read at **build time** (`import.meta.env.VITE_EVENTS_API_URL`, public, no secret).

| Situation | How |
|---|---|
| Local development against staging | `.env.local` (git-ignored): `VITE_EVENTS_API_URL=<staging /exec URL>`, then `npm run dev` |
| Check a production-like build | `VITE_EVENTS_API_URL=<url> npm run build && npm run preview` |
| Release without the events feature | variable empty or unset **and no `.env.local` supplying one** (delete or empty it): the events section and ticker stay hidden and the page is unchanged (FFR-004) |
| Production release | `VITE_EVENTS_API_URL=<production /exec URL> npm run build`, then upload `dist/` per [release-checklist.md](release-checklist.md); only after the §3b gates pass |

Vite reads `.env.local` too, so check it is **empty or points at the right environment** before
every release build. After changing the variable, rebuild; it is not read at runtime.

## 8. Smoke request (after every deploy)
Run from a directory outside the repo (no personal data):
```bash
curl -sL -o events.json -w 'HTTP %{http_code}\n' "<EXEC_URL>?action=events&lang=en"
head -c 1500 events.json
rm events.json
```
The status line prints first, so it is never cut off. Expected: `HTTP 200` and JSON with the same
keys always: `{"ok":true,"data":{...},"error":null}` (contract §7).

Apps Script also answers 200 for its sign-in and error pages, so read the body, not just the
code. `-L` is needed because Apps Script answers through a `script.googleusercontent.com`
redirect.

Common failures:

| Symptom | Likely cause |
|---|---|
| An HTML sign-in page | "Who has access" is not **Anyone**, or you used the `/dev` URL |
| `Authorization required` / permission error | section 2.5 not done, or a new scope needs re-authorization and a new version |
| Old behaviour after a deploy | saved code but no **New version** (section 5) |
| `ok:false`, `SERVER_ERROR` | open **Executions** in the editor sidebar and read the log |

## 9. Release-time checklist (events)
Everything in [release-checklist.md §3b](release-checklist.md#3b-events-feature-release-gates-feature_spec_events_registration-br-e11)
plus: production project updated by section 5, smoke request passes against the production URL,
and the production build used the production URL.
In each environment the section 2.6 trigger is installed (Executions shows it running).

## 10. Correct this runbook
Record at the first deploy: the `clasp` version used, and what `clasp create` wrote into
`apps-script/`.

Anything that differs from what happens in the Google UI (menu names change) is fixed in the PR
that finds it. The first staging deploy is the formal check (implementation plan §11 step 3).
