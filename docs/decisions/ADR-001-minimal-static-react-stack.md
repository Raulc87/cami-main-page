# ADR-001 — Minimal static React + Vite stack

- Status: Accepted (recorded retroactively in CMP-014)
- Date: 2026-08-20 (decision in effect since the initial build; first documented in CMP-001)
- Decision owner: Raul Casanas
- Related specs: [TECH_STACK](../../TECH_STACK.md), [ARCHITECTURE_SPEC](../specs/ARCHITECTURE_SPEC.md)

## Decision Request
Which frontend stack should the brand one-pager use?

## Context
A single bilingual landing page with scroll animations, built by one developer with AI agents,
hosted as static files, with no budget (PROJECT_SPEC NFR-001, NFR-003).

## Decision Drivers
- Least complexity that satisfies the requirements.
- Static output for shared hosting.
- Components to keep copy and translations centralized.

## Options Considered

### Option A — React 18 + Vite, plain JS, no router/state/i18n libraries
Pros:
- Tiny dependency surface (2 runtime deps), fast builds, static `dist/`.
Cons:
- No type checking; global CSS class names must be kept unique by hand.
Risks:
- Without TypeScript, data-shape mistakes in `data.jsx` surface only at runtime.

### Option B — Plain HTML/CSS/JS
Pros:
- No build step.
Cons:
- Duplicated markup for two languages; harder to keep content in one place.
Risks:
- Content drift between languages.

### Option C — Next.js / Astro
Pros:
- Routing, SSR/SSG, image optimization.
Cons:
- More concepts and config than a one-pager needs.
Risks:
- Over-engineering; SSR features unusable on static shared hosting.

## Decision
Option A. No TypeScript, no router, no state-management or CSS framework.

## Rationale
- Smallest stack that renders the page; matches the hosting and cost constraints.

## Consequences
### Positive
- Simple onboarding for agents; trivial deploy.

### Negative / Trade-offs
- Any new library requires updating TECH_STACK.md and a new ADR (AGENTS.md rule).

## Architecture Impact
- Component-per-section structure, constants for content (ARCHITECTURE_SPEC §6–§9).

## Implementation Impact
- `package.json` depends only on `react`, `react-dom`, `vite`, `@vitejs/plugin-react`.

## Validation
- `npm run build` produces a working static `dist/` served from GoDaddy.

## Review Trigger
- Multi-page needs, a backend (US-011/US-012), or recurring type-related bugs.
