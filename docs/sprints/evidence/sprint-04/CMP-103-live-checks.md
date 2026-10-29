# CMP-103 live checks: release v1.1.1

Results of the v1.1.1 release on 2026-10-29, as the owner reported them and the coordinator
relayed them to Agent 3 (the PR #110 walk-through, release-checklist §4.1, §5, §6, §6a). Agent 3
ran none of these checks itself. No URL, ID, host, user, password, participant or event name is
recorded here.

Release: tag `v1.1.1` on `main` commit `72417e6` (PR #110), GitHub Release `v1.1.1` with
`site-v1.1.1.zip` attached by the upload workflow.

| Step | Check | Result (owner) |
|---|---|---|
| 1 | Production backend first: the two script properties added (`RETRY_CHECK_HOURS`, `TRIGGER_FAIL_ALERT_AFTER`), production deploy through the approved workflow, smoke request, both time triggers present, a `refreshEventsCache` run completed, failure notifications set to daily | Pass (before the merge) |
| 2 | Tag and Release created by the owner in GitHub's web UI on `72417e6` | Pass |
| 3 | Deploy site, dry run (tag `v1.1.1`, mode build): bundle check, manifest, plan; manual cPanel backup of `public_html` taken and downloaded first; the backup zip removed from `public_html` | Pass: green, 32 to add, 0 to change, 0 to delete |
| 4 | Deploy site, real run | Pass: green; `site-v1.1.1.zip` attached to the Release |
| 5a | `http://` answers 301 to `https` | Pass |
| 5b | The four security headers | Pass |
| 5c | Cache headers (§6a): `index.html` `no-cache`; a file under `assets/` one year, immutable; an image one year | Pass |
| 5d | `/.deploy-site-manifest` answers 403; `/assets/` answers 403 (no listing) | Pass |
| 5e | Browser: new look and events in ES and EN on computer and phone; cookies empty in a private window (cookie gate); console clean | Pass |
| 6 | PageSpeed on the live site, run by the owner | Desktop 99. Mobile 86, 89 and 89 on three runs (target 90): not met |

Mobile insights in PageSpeed: render-blocking requests (est. 220 ms), network dependency tree,
image delivery (est. 92 KiB), unused JavaScript (22 KiB), one non-composited animation. Desktop
insights: image delivery (45 KiB) and render-blocking. Agent 3's local analysis (no change to the
live site) traced the image delivery to the site's own gallery, hero and logo images and the
non-composited animation to the nav's pulsing dot; the owner chose a small follow-up release,
v1.1.2 (CMP-108). The fonts stylesheet was ruled out by a local test.

Not part of these checks: the production scan after the release (CMP-104). The security agent
records its outcome separately.

Result: v1.1.1 is live and the release-checklist live checks passed. The mobile PageSpeed target
(90 or more) was not reached: CMP-102 stays `review` until it is, after v1.1.2.
