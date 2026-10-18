# TECH_STACK

## Metadata
- Version: 1.0 (homologated from `docs/specs/01-tech-stack.md` in CMP-014)
- Status: Approved by the product owner (2026-10-18, CMP-014 PR #14 merged)
- Owner: Raul Casanas

## 1. Complexity Assessment
**Simple.**

Reasoning: a single static page, no backend, no persistence, no authentication, one developer.
The backlog (lead capture, questionnaire, integrations) would move the project to
**Standard** — re-assess this section when the first of those stories starts.

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
- Technology: **none yet.**
- Planned: **Node.js**, when the backlog requires it (US-011 questionnaire, US-012 lead
  capture). It will get its own ARCHITECTURE_SPEC section / FEATURE_SPEC and ADR when the
  ticket starts — do not design it in advance.
- Alternatives considered: not yet evaluated (serverless functions, form services with a free
  tier) — to be evaluated in that ticket.

## 6. Persistence
- None. The only stored value is the visitor's language preference in `localStorage`
  (`cmp-lang`).

## 7. Integrations
- Google Fonts CDN.
- No analytics, forms or third-party APIs (backlog: US-013, US-014, US-015, US-016).

## 8. Testing
- No automated tests configured.
- Verification today: `npm run build` + manual browser check of the golden path and the
  mobile breakpoint (see [pr-precheck.md](docs/process/pr-precheck.md)).
- Acceptance criteria in [USER_STORIES.md](docs/specs/USER_STORIES.md) are verified manually
  until a test runner is adopted (that adoption requires an ADR).

## 9. CI/CD
- No CI. Code review: a dedicated Claude Code review-only session (owner decision
  2026-10-18, CMP-016), plus GitHub Copilot code review and Codex as automated reviewers on
  every PR, plus `/code-review` before opening a PR (see
  [pr-workflow.md](docs/process/pr-workflow.md) and
  [AGENTS.md → Review-only agent](AGENTS.md#review-only-agent)).

## 10. Hosting / Deployment
- `npm run build` generates `dist/`; its contents are uploaded manually to `public_html/`.
- Full release process (versioning, upload, tag + GitHub Release):
  [release-checklist.md](docs/process/release-checklist.md).

## 11. Security and Secrets
- No secrets exist in the current site. Never commit credentials or tokens.
- When a backend arrives, secrets management must be defined in its ADR.

## 12. Observability
- None (backlog: US-014 analytics).

## 13. Risks
- Shared hosting likely cannot run the planned Node.js backend.
- Manual deploy with no CI — a broken build can only be caught by the precheck.
- No tests — regressions rely on manual verification.

## 14. Upgrade / Scaling Path
What would cause this stack to change?
- Starting US-011/US-012 → backend (Node.js), persistence and probably new hosting.
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
