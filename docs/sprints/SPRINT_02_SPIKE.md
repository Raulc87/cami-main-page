# Sprint 02 Spike — Events backend (ADR-008 → Validation)

Ticket: CMP-024. Status: **in progress** — skeleton deployed to staging by the owner; step a measured; steps b to f
wait for the owner to run editor functions and for Cami's samples.

| Step | What is proven | Result | Evidence |
|---|---|---|---|
| a | `events` GET and `text/plain` POST with a sample image from a page on a site-like origin (`npm run preview`), through the `script.googleusercontent.com` redirect, JSON parsed by the page, no CORS preflight | **Pass** (2026-10-20). From a page on `http://localhost:4173` (a different origin) in Chromium: GET `events` → 200 through the `script.googleusercontent.com/macros/echo` redirect, JSON parsed by the page (1.7 s); POST `text/plain` with a 12 KB synthetic JPEG → 200 through the same redirect, `{ok:true, data:{reference, flagged, duplicateSubmission}}` parsed by the page (4.4 s). The page's request log shows only a GET, a GET (redirect), a POST and a GET (redirect): no OPTIONS request and no CORS error. Unknown action → `ok:false`, `SERVER_ERROR`, HTTP 200. | Page and script in the session scratchpad (not committed); URL omitted |
| b | Image saved to the staging folder and a row appended | pending: the POST returned a reference; the owner confirms a `spike_*` file in the staging folder and a `SpikeLog` row | |
| c | Drive OCR on each sample finds account and exact amount; altered-amount copy reports `mismatch` (US-022 AC5); temporary Doc deleted | pending | |
| d | HEIC → JPEG method (server or client); a new frontend library needs TECH_STACK + ADR and the owner's decision | pending | |
| e | Sending from a Workspace alias without a paid seat (fallback `camila@` already decided) | pending | |
| f | Timing of each step against the 6-minute limit | pending | |

Owner answers (2026-10-20, via the coordinator): two standalone projects (staging, production); samples in a non-shared `samples` subfolder of the staging folder, named `<name>_<amountCrc>.jpg`, plus one altered copy; step e tests the alias `no-reply@lifetoolscr.com`. Expected account and amount are read from the SINPE_* script properties and the file names, so no receipt data passes through chat or the repo.

Any failed assumption is reported with options; no spec is worked around.

## Findings so far

- **OCR works on a real sample** (sample1: `ok`, account and amount found, 4.3 s). The three other files hit `User rate limit exceeded for OCR` when run back to back, so Drive limits OCR per user (the account that owns the script). The spike now retries with a pause of 5, 10, 20, 40 s and waits 3 s between files.
- **Production implication (FFR-017 runs OCR per registration after the lock):** a burst of registrations can hit the same limit. In-execution backoff fits inside the 6-minute limit for small bursts. If the retries are exhausted, FFR-017 and the contract define only `ok`, `mismatch` and `unreadable`, and `pending`; marking such a row `unreadable` would send the participant a "payment not validated" email for a service limit. Leaving it `pending` and retrying later by a time trigger is not in the spec. **Owner decision (2026-10-20, via the coordinator, option a):** after the in-execution retries, leave the check `pending`, send no email, and retry the pending rows with a time-driven trigger. The coordinator records it as FFR-032 and US-022 AC6 (PR #30) and adds it to CMP-028's scope, including a runbook step to install the trigger.

## Skeleton (this PR)
`apps-script/`: `appsscript.json` (V8, Drive v2 advanced service, web app executes as the owner,
access anonymous), `Code.js` (router on `action`; `events` and `register` are spike stubs),
`Config.js` (script properties, contract §9), `Respond.js` (§7 envelope, always HTTP 200),
`Sheets.js` (helpers, formula neutralization), `Spike.js` (OCR helpers run from the editor).
CMP-025/026 replace the stubs.
