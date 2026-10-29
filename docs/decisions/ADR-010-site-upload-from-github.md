# ADR-010 — Upload the site from GitHub to GoDaddy

- Status: Accepted (on merge of the CMP-092 PR)
- Date: 2026-10-29
- Decision owner: Raul Casanas
- Related: [ADR-002](ADR-002-godaddy-static-hosting.md) (GoDaddy static hosting),
  [ADR-007](ADR-007-branching-and-release-model.md) (branching and releases),
  [ADR-009](ADR-009-apps-script-deploy-from-github.md) (backend deploy from GitHub),
  [release-checklist.md](../process/release-checklist.md) §4, §6, §6b and §7,
  [TECH_STACK.md §9–§10](../../TECH_STACK.md#9-cicd); implementation CMP-093

## Decision Request
How should a release of the site (`dist/` built from a tagged `main` commit) get from GitHub into
GoDaddy's `public_html/`, instead of the manual build, zip and cPanel upload?

## Context
- Until v1.1.0 the owner built the site on their computer with the production events URL in an
  untracked file, checked the bundle, zipped `dist/`, took a cPanel backup, and uploaded and
  extracted it in cPanel's File Manager (release-checklist §3–§4, CMP-068). It works, but every
  release takes 30–45 minutes of the owner's time and has manual steps that can go wrong.
- The owner proposed the change during the v1.1.0 upload (2026-10-27): "why don't we use FTP to load
  the version from a github release? maybe we could do that for next release".
- The site is static (ADR-002); GoDaddy's shared hosting offers FTP accounts in cPanel; the
  backend already deploys from GitHub with the owner's approval (ADR-009).
- The repository is public; secret scanning with push protection is on (CMP-086).

## Decision Drivers
- What is live must be exactly a tagged, reviewed `main` commit.
- An upload needs the owner's explicit approval, every time.
- A leaked credential must expose as little as possible.
- A bad upload must be easy to undo.
- Keep the production events URL and every credential out of the repository and the logs.
- Few third-party moving parts (supply chain).

## Options Considered (as asked of the owner, 2026-10-29)
1. **Protocol.** Question as asked: "How should GitHub connect to GoDaddy to upload the site?
   Both options are encrypted. Plain FTP (unencrypted) is never an option."
   - **FTPS, restricted account (Recommended):** a new cPanel FTP account limited to
     `public_html`, used over FTP with TLS encryption; a leak exposes only the site files.
   - SFTP (SSH): may need SSH switched on; usually logs in as the main cPanel user, with access to
     the whole hosting account.
   Owner: **"FTPS, restricted account (Recommended)"**.
2. **Rollback.** Question as asked: "How should we keep a way back if an upload breaks the
   site?"
   - **Keep each release's build (Recommended):** each release's built site is saved on GitHub
     with that version; a rollback runs the upload again with the previous version, with the same
     approval click; one manual cPanel backup before the very first automatic upload.
   - Server backup every time: download the whole live site before every upload.
   Owner: **"Keep each release's build (Recommended)"**.

## Decision
A manual GitHub Actions workflow, `.github/workflows/deploy-site.yml` (Agent 1, CMP-093):

1. **Trigger:** `workflow_dispatch` only, with two inputs: the **tag** to deploy (for example
   `v1.1.1`) and **dry run** (default on). Never on a push, a merge or a schedule.
2. **Approval:** the job runs in a GitHub environment `site-production` whose required reviewer is
   the owner; nothing is built with the production URL or uploaded before the owner's approval
   click.
3. **Build:** checks out the tag (not `main`'s head), runs `npm ci` and `npm run build` with
   `VITE_EVENTS_API_URL` from the environment secret, and checks the bundle as release-checklist §3
   does, printing only masked values (the production id's last six characters; the staging id
   must not appear).
4. **Upload:** FTPS (explicit TLS) to a cPanel FTP account limited to `public_html/`, with its
   host, user and password only as `site-production` environment secrets. Plain FTP is refused;
   certificate checks stay on.
5. **What it may delete:** only files that an earlier run of this workflow uploaded and that the
   new build no longer has (tracked by a state file the upload keeps on the server). It never
   deletes anything else in `public_html/` (the server's own files, a manual backup, other
   folders).
6. **`.htaccess`:** uploaded from `dist/` like any other file (it comes from `public/`), so the
   CMP-079 security headers and the CMP-102 caching rules ship with each release.
7. **Dry run:** builds and checks as above, then lists the files the upload would add, change or
   delete, and uploads nothing.
8. **Rollback:** each run attaches the built `dist/` as a zip to that tag's GitHub Release. To roll
   back, run the workflow with the previous tag (same approval). The owner makes one manual cPanel
   backup (release-checklist §4) before the first real run. The manual upload stays as the
   fallback (release-checklist §4, §7).
9. **Third-party code:** any action used is pinned to a full commit SHA, chosen and named in the
   CMP-093 PR (a maintained FTP deploy action that keeps a state file, or `lftp` from the runner's
   packages); Dependabot (CMP-071) proposes its updates.
10. **After the upload:** the release checklist's live checks, then §6b (post-release security),
    as for a manual release.

## Consequences
- A release takes a few minutes of the owner's time: run the workflow (dry run first), approve,
  check the live site.
- The FTP password in GitHub can change the live site: mitigated by the `public_html`-only
  account, TLS, the environment's required reviewer, secret scanning, and the owner changing the
  password if a leak is suspected (and the run log never printing it).
- The production events URL becomes a GitHub environment secret instead of only the owner's local
  file. It is not a credential (the browser receives it), but it stays out of the repository and
  logs as before.
- A file changed by hand on the server is not backed up by the workflow; the manual backup covers
  the first run, and later hand changes should not happen (the repository is the source).
- The first real run is release v1.1.1 (CMP-103), if CMP-093 is merged and its dry run passed;
  otherwise v1.1.1 is uploaded by hand.

## Follow-up
- CMP-093 (Agent 1): the workflow; the owner creates the FTP account and the `site-production`
  environment with its secrets (Agent 1 walks them through it; the values are never sent to an
  agent); a dry run.
- The coordinator updates release-checklist §4 and §7 with the text Agent 1 sends, and TECH_STACK
  §9–§10.
</content>
</invoke>
