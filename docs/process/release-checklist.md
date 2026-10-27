# Release Checklist

How to do a release of **cami-main-page**: production build, upload to GoDaddy shared hosting
(`public_html/` of `camihernandez.com`), and the corresponding tag + GitHub Release.
See [TECH_STACK.md](../../TECH_STACK.md) for the rest of the stack/hosting.

There is no CI/CD — the whole process is manual. This document exists so anyone (or any agent) can
repeat it without having to rediscover the steps every time.

## 1. Prerequisites (one time only)

- Access to GoDaddy with **active hosting** for `camihernandez.com` (having the domain registered
  is not enough — you need a hosting plan purchased and the domain pointing to that hosting).
  Verify in the GoDaddy panel → "My Products": a **Web Hosting** product (or similar) associated
  with the domain must appear, not just the domain itself.
  - **Beware of "Websites + Marketing" (Airo)**: GoDaddy often gives a free site built with its
    visual builder ("Airo") on the same domain upfront. That product **has no cPanel/File
    Manager** and doesn't accept uploading your own build — it's no use for this project. If it's
    the only thing in the account, you have to buy **Web Hosting** (the plan with cPanel)
    separately; don't confuse one with the other.
- `gh` (GitHub CLI) installed and authenticated (`gh auth login`) on the machine the release is
  done from.
- `npm install` run at least once (`node_modules/` present).
- `zip` available on the command line (preinstalled on macOS/most Linux) — used in section 4 to
  build the package uploaded to GoDaddy.

## 2. Versioning

Simple [SemVer](https://semver.org/) is used: `vMAJOR.MINOR.PATCH`.

- The site's first production release is **`v1.0.0`**.
- Later releases: `PATCH` for copy/small fixes, `MINOR` for new visible sections/features, `MAJOR`
  reserved for big redesigns or architecture changes (e.g. when the backend from the
  [backlog user stories](../specs/USER_STORIES.md) lands).
- The version is reflected in `version` in [package.json](../../package.json) — update it in the
  same commit that triggers the release.

## 3. Build

```bash
npm run build
```

Generates `dist/`. Before uploading:

- [ ] The build ran without errors or new warnings.
- [ ] `npm run preview` serves `dist/` locally and the golden path was tested in the browser.
- [ ] No obvious placeholder is left that should be real content and isn't (see
      [PROJECT_SPEC.md](../specs/PROJECT_SPEC.md) on which content remains placeholder on
      purpose).

## 3b. Events feature release gates (FEATURE_SPEC_events_registration BR-E11)

For any release that ships or changes the events feature, all of these must be true before the
upload; if one is not, do not release:

- [ ] Real SINPE Móvil number and account name configured in the **production** script
      properties (no `0000-0000` placeholder, BR-E01).
- [ ] Privacy notice text reviewed: approved by Cami as the legal review, 2026-10-26 (owner
      decision, FEATURE_SPEC §20; no retention period stated), in
      [EVENTS_EMAILS_AND_PRIVACY.md](../ux/EVENTS_EMAILS_AND_PRIVACY.md) §3, and the approved
      text is what the site shows (CMP-059), with the "Draft" badge removed.
- [ ] Email templates (confirmation, registration received with its reason phrases, payment not
      validated, and the internal alert email; amount format `₡15,000` in both languages) approved
      by Cami (2026-10-26, with her changes, CMP-058) and in use by the production script.
- [ ] Registration form wording (EN/ES labels and messages in `UI_TEXT.events.form`, including
      the sending note and the "event no longer available" message) reviewed by the owner and
      Cami (BR-E11; Cami approved them 2026-10-26, applied in CMP-059).
- [ ] Real-iPhone check on staging (owner, 2026-10-21: no device was available for CMP-033):
      with any iPhone, through the manual Pages test site (TECH_STACK §10; test SINPE values
      during the window), register with a Camera photo (Photo Library), the same photo from
      Files, and a screenshot, each with a **different** test email (one registration per
      email per event, so a repeated email is refused as already registered before its file is
      stored); confirm what is stored (`.jpg` or `.heic` + note) and the check
      result; then unpublish the site, restore the real SINPE values and delete the
      `STAGING_EVENTS_API_URL` secret.
- [ ] Backend deploy to production through the approved deploy workflow (ADR-009), smoke
      request green; both time triggers installed once in production (runbook).
- [ ] Lifetools logo in place for events without art (CMP-067).
- [ ] Security baseline approved (`docs/security/SECURITY_BASELINE.md`, CMP-056) with the PTES
      deadline written in as a date (CMP-069; owner decision, 2026-10-26: 60 days after the
      events go-live);
      after that date, no release until the penetration test is done (AGENTS.md → Security
      baseline).
- [ ] Pre-test security review done (CMP-063): no open critical or high finding, unless the
      owner accepted it in writing. The findings are tracked privately (public repository), so
      the owner confirms this gate with a dated statement in the release PR (CMP-068), "No
      critical or high security finding is open", with no details, after checking the private
      notes with the coordinator (owner, 2026-10-27).
- [ ] Production Apps Script deployment updated per
      [events-backend-runbook.md](events-backend-runbook.md), and the site build points
      `VITE_EVENTS_API_URL` at the production `/exec` URL.
- [ ] The 5-minute `refreshEventsCache` trigger installed in the **production** script, with a
      Completed run in Executions (FFR-033; runbook "Events cache trigger").

## 4. Upload to GoDaddy (cPanel File Manager)

GoDaddy shared hosting, with no FTP/SSH configured — upload from the browser.

1. Compress the **contents** of `dist/` (not the `dist/` folder itself) into a `.zip`:
   ```bash
   cd dist && zip -r ../release.zip . && cd ..
   ```
2. Go to the GoDaddy panel → **"My Products"** → the **Web Hosting** product for
   `camihernandez.com` → **"Manage"** → **"cPanel Admin"** button.
   - Right after purchasing the hosting, GoDaddy may show a **"Set up your migration"** wizard
     asking for the URL of an existing site to migrate. It doesn't apply here (there's nothing to
     migrate) — don't complete it; go straight to "My Products" → the hosting → cPanel Admin in
     another tab instead.
   - If you just bought the hosting, cPanel may take a few minutes to fully provision — if File
     Manager loads blank or hangs, try a hard refresh (`Cmd+Shift+R`), an incognito window, or
     retry in 15-20 minutes.
3. Open **File Manager** → navigate to `public_html/`.
4. A freshly created hosting account comes with default GoDaddy placeholder files (`404.shtml`,
   `home.html`, `layout-styles.css`) — they are not real content and can be deleted without a
   backup. If instead there is already a real previous release there, do make a backup before
   overwriting: select everything, compress into a backup `.zip` (e.g. `backup-pre-v1.0.0.zip`)
   and leave it outside `public_html/` (e.g. in the home folder) or download it. **Never replace a
   site that's already in production without a backup.**
5. Upload `release.zip` to `public_html/` (**Upload** button).
6. Once uploaded, right-click `release.zip` → **Extract**, extracting directly inside
   `public_html/`.
7. Delete `release.zip` from `public_html/` after extracting (it must not remain publicly served).
8. Confirm that `public_html/index.html` exists and is the new `index.html` (recent modification
   date).

## 5. Domain → hosting

If the domain and the hosting are purchased in the same GoDaddy account, GoDaddy usually points
the DNS automatically when connecting both products — verify in the panel that the domain is
**"connected"** to the hosting before assuming it already works. If the hosting is with another
provider, you have to point the nameservers or the A/CNAME record of `camihernandez.com` to that
provider from GoDaddy's DNS panel (a manual step outside the scope of this repo — follow the
specific guide of the chosen hosting provider).

- [ ] `https://camihernandez.com` loads the site (not the GoDaddy placeholder page).
- [ ] `https://www.camihernandez.com` also resolves (redirect or same content), if applicable.
- [ ] HTTPS active (padlock in the browser) — GoDaddy shared hosting usually includes free SSL
      (AutoSSL/Let's Encrypt) but it may take a few minutes to activate after the first deploy.

## 6. Tag + GitHub Release

With the site already verified in production, change the `VERSION` value to the real tag (e.g.
`v1.0.1`) before running this — the commands below are a template; don't copy/paste literally
except for the first release (`v1.0.0`):

```bash
VERSION="v1.0.1"  # <- change on every release

git tag -a "$VERSION" -m "$VERSION"
git push origin "$VERSION"

gh release create "$VERSION" \
  --title "$VERSION" \
  --notes "See TICKETS.md for the details of the tickets included since the previous release."
```

- The tag is created on the `main` commit that corresponds exactly to what is uploaded in
  `public_html/` — if there were uncommitted changes between the build and the deploy, commit them
  first.
- The release notes can be generated by listing the `done`/`review` tickets in
  [TICKETS.md](../../TICKETS.md) included since the previous release (or all of them, if it's the
  first).

## 7. Rollback

If something goes wrong after extracting into `public_html/`:

1. Delete the new content of `public_html/`.
2. Re-upload and extract the backup `.zip` from step 4 of the "Upload to GoDaddy" section above.
3. If the release had already been tagged on GitHub, don't delete the tag/release — document it as
   known and fix it with a following release (`v1.0.1`), unless the tag points to a broken commit
   that should never have been published.

## 8. Future releases

Repeat from step 2 (version bump). Step 1 (prerequisites) and a good part of step 4 (panel access)
are already resolved after the first release.

## 9. History

- **`v1.0.0`** — 2026-09-04. First production release, following exactly this process (including
  the Airo pitfalls and the migration wizard documented above). See the
  [release on GitHub](https://github.com/Raulc87/cami-main-page/releases/tag/v1.0.0).
- **`v1.0.1`** — 2026-09-07. Mobile bugfix: CMP-013 (Hero and Gallery invisible at <640px). Since
  there was already a real release in `public_html/`, this cycle did include the step 4 backup
  before overwriting. See the
  [release on GitHub](https://github.com/Raulc87/cami-main-page/releases/tag/v1.0.1).
