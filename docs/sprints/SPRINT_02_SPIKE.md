# Sprint 02 Spike — Events backend (ADR-008 → Validation)

Ticket: CMP-024. Status: **in progress** — skeleton written; measurements wait for the staging
spreadsheet and folder and Cami's sample screenshots (owner). No result below is measured yet.

| Step | What is proven | Result | Evidence |
|---|---|---|---|
| a | `events` GET and `text/plain` POST with a sample image from a page on a site-like origin (`npm run preview`), through the `script.googleusercontent.com` redirect, JSON parsed by the page, no CORS preflight | pending | |
| b | Image saved to the staging folder and a row appended | pending | |
| c | Drive OCR on each sample finds account and exact amount; altered-amount copy reports `mismatch` (US-022 AC5); temporary Doc deleted | pending | |
| d | HEIC → JPEG method (server or client); a new frontend library needs TECH_STACK + ADR and the owner's decision | pending | |
| e | Sending from a Workspace alias without a paid seat (fallback `camila@` already decided) | pending | |
| f | Timing of each step against the 6-minute limit | pending | |

Owner answers (2026-10-20, via the coordinator): two standalone projects (staging, production); samples in a non-shared `samples` subfolder of the staging folder, named `<name>_<amountCrc>.jpg`, plus one altered copy; step e tests the alias `no-reply@lifetoolscr.com`. Expected account and amount are read from the SINPE_* script properties and the file names, so no receipt data passes through chat or the repo.

Any failed assumption is reported with options; no spec is worked around.

## Skeleton (this PR)
`apps-script/`: `appsscript.json` (V8, Drive v2 advanced service, web app executes as the owner,
access anonymous), `Code.js` (router on `action`; `events` and `register` are spike stubs),
`Config.js` (script properties, contract §9), `Respond.js` (§7 envelope, always HTTP 200),
`Sheets.js` (helpers, formula neutralization), `Spike.js` (OCR helpers run from the editor).
CMP-025/026 replace the stubs.
