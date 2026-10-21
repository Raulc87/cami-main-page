# TECH_STACK

## Metadata
- Version: 1.5 (homologated in CMP-014; §9 reviewer setup in CMP-016; v1.2: events backend —
  §1, §5–7, §10–14 — in CMP-021; v1.3: §10 two Apps Script projects — CMP-035;
  v1.4: §11 script permissions — CMP-036; v1.5: §11 full Drive scope named — CMP-037;
  v1.6: §9/§10 temporary GitHub Pages test site — CMP-044)
- Status: Approved by the product owner (2026-10-18, CMP-014 PR #14 merged; v1.2 Approved on
  merge of PR #21; v1.3 Approved on merge of PR #26; v1.4 Approved on merge of PR #30;
  v1.5 Approved on merge of PR #32; v1.6 Approved (on merge of PR #43))
- Owner: Raul Casanas

## 1. Complexity Assessment
**Standard** (since v1.2, CMP-021).

Reasoning: still one page and one developer, but the events feature (FR-011) adds a backend
(Google Apps Script), persistence (Sheets/Drive), personal data, email and an integration
contract. Before v1.2 the project was **Simple** (static page, no backend).

## 2. Hosting and Environment Constraints
- Hosting provider: GoDaddy **Web Hosting** (shared hosting, cPanel) — not the Airo site
  builder product (see [release-checklist.md](docs/process/release-checklist.md)).
- Control panel/runtime: cPanel File Manager; static files only for this project.
- Deployment restrictions: manual upload of `dist/` to `public_html/`; no CI/CD.
- Cost constraints: zero license budget — free tier first (PROJECT_SPEC NFR-003).
- Portability constraints: output is plain static files, portable to any static host.

Decision record: [ADR-002](docs/decisions/ADR-002-godaddy-static-hosting.md).

## 3. Selection Principle
Prefer the least-complex stack that satisfies approved requirements and constraints. No new
library or framework (router, state management, CSS framework, TypeScript, etc.) without
updating this file and recording an ADR (see
[ADR-001](docs/decisions/ADR-001-minimal-static-react-stack.md)).

## 4. Frontend

| Layer | Choice | Notes |
|---|---|---|
| Framework | React 18.3 | `react`, `react-dom` |
| Build tool | Vite 7 | `@vitejs/plugin-react` |
| Language | JS/JSX | No TypeScript |
| Routing | None | Single page; anchor-link navigation (`#contact`) |
| State management | None (no library) | Local `useState`/`useEffect` (see [useReveal](src/hooks/useReveal.js)) + one native React Context for the global language (see [LanguageContext](src/context/LanguageContext.jsx), [ADR-004](docs/decisions/ADR-004-i18n-native-context.md)) |
| CSS | Plain CSS | [global.css](src/styles/global.css) + per-component inline styles (see [ADR-003](docs/decisions/ADR-003-inline-styles-plus-global-css.md)) |
| Fonts | Google Fonts via `@import` in global.css | Outfit, Cormorant Garamond, JetBrains Mono |

- Why: smallest stack that renders a bilingual, animated one-pager.
- Alternatives considered: plain HTML/CSS (no components, harder to keep the bilingual copy
  in one place); Next.js/Astro (SSR/routing not needed, heavier build).
- Why alternatives were not selected: see ADR-001.

### Scripts (`package.json`)

```bash
npm run dev       # vite — localhost:5173
npm run build     # vite build → dist/
npm run preview   # serves dist/ locally
```

## 5. Backend
- Technology: **Google Apps Script web app** in the `lifetoolscr.com` Workspace
  ([ADR-008](docs/decisions/ADR-008-events-backend-google-apps-script.md)), plain JavaScript
  (V8 runtime). Services: `SpreadsheetApp`, `DriveApp`, Advanced Drive Service (OCR),
  `GmailApp`/`MailApp`, `LanguageApp`, `LockService`, `CacheService`, `PropertiesService`.
- Code: in the repo under `apps-script/`; deployed by the owner with `clasp` or by pasting into
  the script editor, following the deploy runbook (Sprint 02).
- Interface: [EVENTS_API_CONTRACT.md](docs/specs/EVENTS_API_CONTRACT.md).
- Alternatives considered: serverless functions + Google APIs, Google Forms, Node.js (ADR-008).
  Node.js stays the upgrade path (§14).

## 6. Persistence
- Google Sheets (events, coupons, one registrations tab per event, metrics) and Google Drive
  (payment screenshots, one subfolder per event) — contract §6. A separate staging spreadsheet
  and folder for development and tests (ADR-007 decision 6).
- Browser: only the language preference in `localStorage` (`cmp-lang`).

## 7. Integrations
- Google Fonts CDN.
- Events backend (Apps Script web app) called from the browser with `fetch`
  (`VITE_EVENTS_API_URL`).
- Cloudflare Turnstile only if the captcha rule triggers (FEATURE_SPEC FFR-029).
- No analytics (backlog: US-013..US-016).

## 8. Testing
- No automated tests configured. For the events feature (Standard complexity), each PR runs the
  manual test checklist of [EVENTS_API_CONTRACT.md §10](docs/specs/EVENTS_API_CONTRACT.md#10-test-obligations)
  against the staging deployment and records the evidence; adopting a runner (e.g. Vitest) needs
  an ADR (§14).
- Verification today: `npm run build` + manual browser check of the golden path and the
  mobile breakpoint (see [pr-precheck.md](docs/process/pr-precheck.md)).
- Acceptance criteria in [USER_STORIES.md](docs/specs/USER_STORIES.md) are verified manually
  until a test runner is adopted (that adoption requires an ADR).

## 9. CI/CD
- No CI on push. One manual-only workflow, `.github/workflows/pages-staging.yml`
  (`workflow_dispatch`, CMP-043), builds `main` against the staging backend for the temporary
  test site in §10. Code review: a dedicated Claude Code review-only session (owner decision
  2026-10-18, CMP-016), plus GitHub Copilot code review and Codex as automated reviewers on
  every PR, plus `/code-review` before opening a PR (see
  [pr-workflow.md](docs/process/pr-workflow.md) and
  [AGENTS.md → Review-only agent](AGENTS.md#review-only-agent)).

## 10. Hosting / Deployment
- `npm run build` generates `dist/`; its contents are uploaded manually to `public_html/`.
- The events backend is deployed separately: two standalone Apps Script projects (staging and
  production), each with one web-app deployment, by the owner, per
  [events-backend-runbook.md](docs/process/events-backend-runbook.md) (ADR-008).
- Temporary test site (owner decision, 2026-10-21, CMP-033): GitHub Pages
  (`raulc87.github.io/cami-main-page/`, `noindex`), deployed only by running the manual workflow
  in §9, so a real phone can test the full flow against **staging**. The staging `/exec` URL is
  a repository Actions secret (`STAGING_EVENTS_API_URL`), never in a file; while the site is up
  it is visible in the public test bundle (accepted by the owner: staging holds test data and
  has the abuse limits). After CMP-033 the owner unpublishes Pages and deletes the secret
  (optionally redeploys staging under a new URL). Production stays on GoDaddy only. Question as
  asked: "GitHub Pages works (the repo is public, so it's free). The catch: the test site's code is public, so the staging backend address becomes visible to anyone who looks at it, for as long as the test site is up. Staging only holds test data and has the abuse limits, and we take the test site down right after the check. OK?" — options: yes, temporary Pages site; no, keep staging private. Owner:
  "Yes, temporary Pages site (Recommended)".
- Full release process (versioning, upload, tag + GitHub Release):
  [release-checklist.md](docs/process/release-checklist.md).

## 11. Security and Secrets
- Never commit credentials, tokens, spreadsheet/folder IDs or SINPE data.
- Backend configuration and secrets live in Apps Script script properties (contract §9). The
  only backend value in the client bundle is the public `/exec` URL.
- Script permissions: the OAuth scopes are those in `apps-script/appsscript.json` (`oauthScopes`). Besides Sheets,
  Drive (full access to the owning account's files, needed to create folders and files and run
  OCR), Docs, external requests and sending mail, the script holds a Gmail settings scope so it
  can send as `no-reply@lifetoolscr.com` (owner, 2026-10-20); that scope lets it read and change
  the owning account's Gmail settings. The spike's alias test confirmed `gmail.settings.basic` is
  enough (2026-10-20); any scope broader than the one the owner accepted (e.g. full mailbox
  `https://mail.google.com/`) goes back to the owner before it is deployed.

## 12. Observability
- Events backend: daily `Metrics` tab and alert emails to camila@ (FFR-029); Apps Script
  execution log for errors (no personal data logged).
- Site analytics: none (backlog US-014).

## 13. Risks
- Apps Script limits: no client IP/headers (global throttling only), quotas, redirect-based
  responses (ADR-008).
- Manual deploy with no CI — a broken build can only be caught by the precheck.
- No tests — regressions rely on manual verification.

## 14. Upgrade / Scaling Path
What would cause this stack to change?
- Events volume or features outgrowing Apps Script, or US-011/US-012 needs → Node.js backend and
  new hosting (ADR).
- A growing number of pages → reconsider routing.
- Frequent regressions → adopt a test runner (e.g. Vitest) via ADR.
- More than one regular contributor → CI for build checks.

## Repo conventions
- Git, main branch `main`.
- Branches and tickets: `CMP-XXX-slug` — see [AGENTS.md](AGENTS.md) and
  [TICKETS.md](TICKETS.md).
- `.claude/settings.json` is versioned with `"model": "sonnet"` as the project default, plus
  cheap subagents in `.claude/agents/` for mechanical checks and exploration — see
  [model-cost-policy.md §8](docs/process/model-cost-policy.md#8-versioned-config-claudesettingsjson).
