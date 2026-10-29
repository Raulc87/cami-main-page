# CMP-103 live checks: release v1.1.1

Results of the v1.1.1 release on 2026-10-29, as the owner reported them and the coordinator
relayed them to Agent 3 (the PR #110 walk-through, release-checklist §4.1, §5, §6, §6a). Agent 3
ran none of these checks itself. No URL, ID, host, user, password, participant or event name is
recorded here.

Release: tag `v1.1.1` on `main` commit `72417e6` (PR #110), GitHub Release `v1.1.1` with
`site-v1.1.1.zip` attached by the upload workflow.

## Gates before the tag

| Gate | Record |
|---|---|
| CMP-101 and CMP-107 staging checks | Passed 2026-10-29, recorded in [CMP-101-CMP-107-staging-check.md](CMP-101-CMP-107-staging-check.md) (PR #112) |
| Site-production setup (FTP account, `site-production` environment, five secrets) | Done by the owner |
| Pre-release security review covering the release commit | Second review and the `a8622cc..df27a20` delta recorded in PR #111. Final delta `df27a20`..`72417e6`, run by the pre-release security agent **before the tag** (trees compared, because `72417e6` is the squash merge of PR #110): no new finding; the delta was documentation only, with no code, configuration, workflow, lockfile or `package.json` change apart from the version. The coordinator checked that the tag `v1.1.1` points to `72417e6` |
| The owner's dated statement | "No critical or high security finding is open. — Raul Casanas, 2026-10-29": [PR #110 comment 6510436964](https://github.com/Raulc87/cami-main-page/pull/110#issuecomment-6510436964) |
| The owner's signed scan approval and window (release-checklist §6b) | [PR #110 comment 6510039175](https://github.com/Raulc87/cami-main-page/pull/110#issuecomment-6510039175), recorded in PENTEST_PLAN §1.1 run 2 by PR #113. The scan did not run (see the end of this file) |
| Production script properties and backend deploy | Done by the owner before the merge (row 1 below) |

## Live checks

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

## Decisions and outcome

- **Mobile PageSpeed target.** The owner's later runs were 86, 89 and 89 on mobile (desktop 99).
  Question as asked (2026-10-29): "Mobile PageSpeed came out 86, 89 and 89: just under the 90 target.
  Desktop is 99. Agent 3's fix shrinks our own photos for phones and makes the menu dot animation
  lighter, with no visible change. It would ship as a small update (v1.1.2) using the same release
  steps as today, but much shorter. Should we do it?" Owner: **"Yes, small fix v1.1.2
  (Recommended)"**; the rejected option was "No, 89 is good enough". The mobile 90 or more target
  therefore moves to CMP-108 (release v1.1.2): CMP-103 (the v1.1.1 release) is done, and CMP-102
  stays `review` until mobile reaches 90 or more after v1.1.2 (recorded by the coordinator in PR #116).
- **CMP-104, the production scan after the release: not run.** The pre-release security agent's
  session safety controls blocked the scan step, so no scan ran and the approved window went
  unused. Owner: "Leave it to the tester (Recommended)": the passive baseline is covered by the PTES
  test (PR #114, PR #116). The GitHub Release carries the security agent's line instead of a scan
  date (added by the owner).

Result: v1.1.1 is live and the release-checklist live checks passed. The mobile PageSpeed target
(90 or more) was not reached; it moves to CMP-108 / v1.1.2.
