# CMP-109 live checks: release v1.1.2

Results of the v1.1.2 release on 2026-10-29, as the owner reported them and the coordinator
relayed them to Agent 3 (the PR #119 walk-through, release-checklist §4.1, §5, §6, §6a). Agent 3
ran none of these checks itself. No URL, ID, host, user, password, participant or event name is
recorded here.

Release: tag `v1.1.2` on `main` commit `5d52c59` (PR #119; the coordinator checked the tag with
`git ls-remote`), GitHub Release `v1.1.2` with `site-v1.1.2.zip` attached by the upload workflow.
It ships CMP-108 (PR #118): smaller WebP sizes for phones and a nav dot animation that runs off the
main thread. No backend change: no production backend step, no new script property.

## Decisions (owner, 2026-10-29, relayed by the coordinator)

- **Whether to release.** After the live mobile PageSpeed of 86, 89 and 89 (desktop 99), the owner
  chose **"Yes, small fix v1.1.2 (Recommended)"**; the rejected option was "No, 89 is good enough"
  (recorded in PR #116 and PR #115).
- **The scan.** Question as asked: "For the v1.1.2 release (the mobile fix: images and one
  animation), the kit again asks for a read-only scan of the live site afterwards. The security
  agent can't run it from its session, as we saw today. How should we handle it?" Options: "Same as
  v1.1.1: tester (Recommended)" and "Sign a new approval anyway". Owner: **"Same as v1.1.1: tester
  (Recommended)"**. No new approval and no scan: the passive baseline is left to the PTES test due
  by 2026-12-26 (CMP-099). The Release says so.
- **Timing.** Question as asked: "Do you want to do the short v1.1.2 release now …, or another
  day?" Options: "Now" and "Another day". Owner: **"Now"**.

## Gates before the tag

| Gate | Record |
|---|---|
| Reviewer's verdict on PR #119 | "Ready for human approval" at `2e5e5a1`; Codex: no findings |
| The owner's dated statement | "No critical or high security finding is open. — Raul Casanas, 2026-10-29": [PR #119 comment 6511089759](https://github.com/Raulc87/cami-main-page/pull/119#issuecomment-6511089759) (the owner confirmed to the coordinator that they posted it) |
| Pre-release security review covering the release commit | The pre-release security agent checked the chain of commits `72417e6` → `4957717` (PR #118, the only code change) → `5d52c59` (PR #119, the version bump) before the tag: no finding. The coordinator checked that the tag points to `5d52c59` |
| Scan decision | The owner's answer above; recorded in PENTEST_PLAN §1.1 by the coordinator's records PR |
| Site-production environment, secrets, production backend and script properties | In place since v1.1.1 (see [CMP-103-live-checks.md](CMP-103-live-checks.md)) |

## Live checks

| Step | Check | Result (owner) |
|---|---|---|
| 1 | Tag `v1.1.2` on `5d52c59` and the GitHub Release, published (not a draft), created by the owner in GitHub's web UI | Pass |
| 2 | Deploy site, dry run (tag `v1.1.2`, mode build): bundle check, manifest, plan | Pass: green, 10 to add, 1 to change, 4 to delete, 29 unchanged. Agent 3 compared it with a hash-by-hash diff of the v1.1.1 and v1.1.2 builds before the real run: the 10 added are the two renamed hashed assets and eight new images; the changed one is `index.html`; the 4 deleted are the two old hashed assets and the old `community-480.webp` and `community-960.webp`; `.htaccess` unchanged |
| 3 | Deploy site, real run | Pass: green; `site-v1.1.2.zip` attached to the Release |
| 4a | `http://` answers 301 to `https`; the four security headers | Pass |
| 4b | Cache headers (§6a): `index.html` `no-cache`; the new hashed script under `assets/` one year, immutable; `images/community-320.webp` one year | Pass |
| 4c | `/.deploy-site-manifest` answers 403; the old `images/community-480.webp` answers 404 (deleted by the upload) | Pass |
| 4d | Browser, private window: the site looks the same, events in ES and EN, no cookies (the cookie gate), console clean | Pass |
| 4e | Phone: the gallery photos are sharp | Pass |
| 5 | PageSpeed on the live site, run by the owner | Mobile 97, 90 and 97; desktop 99. Target (mobile 90 or more): met on all three runs, with the lowest at the limit. PageSpeed varies from run to run, so it is the result of three runs, not a guarantee |

Before v1.1.2 (v1.1.1, 2026-10-29): mobile 86, 89 and 89; desktop 99
([CMP-103-live-checks.md](CMP-103-live-checks.md)).

Not part of these checks: a production scan (not run, by the owner's decision above).

Result: v1.1.2 is live, the release-checklist live checks passed, and the mobile PageSpeed target
(90 or more) is reached. CMP-108, CMP-109 and CMP-102 close.
