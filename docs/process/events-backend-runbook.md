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
Pick one of the two paths. The project is a **standalone** script (script.google.com → New
project); it reaches the spreadsheet through `SPREADSHEET_ID`, so the same code works in both
environments (owner decision 2026-10-20, recorded in ADR-008).

**Path A — paste in the editor (no tooling)**
1. Open <https://script.google.com> signed in as the Workspace account → **New project**, name it
   per section 1.
2. Replace the default `Code.gs` content with the repo files from `apps-script/`: one editor
   file per repo file (same names, `.gs` for `.js`).
3. **Project Settings** (gear) → tick **Show "appsscript.json" manifest file in editor**, then
   paste `apps-script/appsscript.json` into it.

**Path B — `clasp` (recommended once you push more than twice)**
1. One time per computer: `npm install -g @google/clasp` (note the version with
   `clasp --version` in §10 at the first deploy: command names differ between 2.x and 3.x),
   then `clasp login` (signed in as the Workspace account).
2. Turn on the Apps Script API for that account: <https://script.google.com/home/usersettings>
   → **Google Apps Script API** → On.
3. Create the project in an **empty** scratch directory outside the repo, never with `rootDir`
   pointing at `apps-script/`: `clasp create` creates a default project and pulls its default
   files into the directory, which would overwrite the repo's `appsscript.json`.
   `mkdir ~/cami-events-staging && cd ~/cami-events-staging`
   `clasp create --type standalone --title "cami-events-staging"`
   This writes `.clasp.json` (contains the script ID) and the default files; delete the default
   files and keep only `.clasp.json`.
4. `clasp` needs `rootDir` inside the directory that holds `.clasp.json`, so the file goes at the
   **repo root** (the `.gitignore` entry comes with CMP-024, as the coordinator
   assigned; until it merges do not `git add` it). Copy `.clasp.json`
   there and add
   `"rootDir": "apps-script"`. Run `git status` to confirm.
5. Push the code from the repo root: `clasp push` (accept the manifest overwrite prompt the
   first time).

Keep one `.clasp.json` per environment outside the repo (for example
`~/cami-events-staging/.clasp.json`, with `rootDir` added) and copy the one you need to the repo
root before each `clasp` command. Never `git add` or commit `.clasp.json`.

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
The same run also recounts the registrations Cami has marked `spam` in the `Metrics` tab, drops
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
The automatic English translations are kept in script properties named `TR_<hash>` (one per
changed text). They are not pruned; if the properties page ever fills up, they can all be deleted
and are rebuilt on demand.
Quota: about 290 runs a day of 5 to 10 s each, well inside the Workspace limits.

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
   (in **Deploy → Manage deployments**), since you need the ID for `clasp deploy` below.

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

### Editor
1. Paste the changed files (or `clasp push` first, Path B).
2. **Deploy** → **Manage deployments** → select the active deployment → pencil (**Edit**).
3. **Version: New version**, add a description (for example `CMP-025 events read`), **Deploy**.
4. Check the URL in the dialog is unchanged.

### `clasp`
```bash
clasp push
clasp deploy --deploymentId <DEPLOYMENT_ID> --description "CMP-025 events read"
clasp deployments   # confirm the same ID now points to the new version
```
`clasp deploy` **without** `--deploymentId` creates a new deployment with a new URL: do not do
that for an environment that already exists.

Saving code in the editor does **not** change the deployed web app: only a new version on the
deployment does.

## 6. Roll back to a previous version
The deployment keeps its URL; only the version it serves changes.
1. **Deploy** → **Manage deployments** → pencil on the active deployment.
2. **Version** → pick the previous numbered version (see **Project history** / `clasp versions`
   if unsure which) → **Deploy**.
3. Repeat the smoke request (section 8).

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
