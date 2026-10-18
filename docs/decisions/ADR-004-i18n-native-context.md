# ADR-004 — Bilingual UI with a native React Context (no i18n library)

- Status: Accepted (recorded retroactively in CMP-014)
- Date: 2026-08-20 (CMP-003)
- Decision owner: Raul Casanas
- Related specs: [ARCHITECTURE_SPEC §7](../specs/ARCHITECTURE_SPEC.md#global-language-languagecontext), [US-006](../specs/USER_STORIES.md#us-006--global-englishspanish-toggle)

## Decision Request
How does the site support English and Spanish with a single global toggle?

## Context
CMP-002 introduced a per-testimonial language switch; the requirement grew to the whole
interface (PROJECT_SPEC FR-009) with two languages only.

## Decision Drivers
- Two fixed languages, static copy, no pluralization or formatting needs.
- No new dependencies (ADR-001).

## Options Considered

### Option A — `LanguageContext` + `useLanguage()`, copy in `UI_TEXT` (`i18n.js`) and `*Es` fields in `data.jsx`
Pros:
- No dependency; trivial to read; default from `navigator.language`, persisted in
  `localStorage`.
Cons:
- Manual `{ en, es }` pairs; no tooling for missing translations.
Risks:
- A missing `es` key renders `undefined`.

### Option B — react-i18next (or similar)
Pros:
- Mature tooling, fallbacks, interpolation.
Cons:
- New dependency and config for a two-language page.
Risks:
- Over-engineering.

## Decision
Option A.

## Rationale
- Covers the whole requirement with ~one small file of code.

## Consequences
### Positive
- One global toggle in the nav; everything translatable lives in `i18n.js` or `data.jsx`.

### Negative / Trade-offs
- Adding a third language means touching every `{ en, es }` pair and `*Es` field.

## Architecture Impact
- `LanguageProvider` wraps `<App />` in `main.jsx`.

## Implementation Impact
- Fixed Spanish brand accents stay hardcoded and are never translated (PROJECT_SPEC BR-001).

## Validation
- US-006 acceptance criteria.

## Review Trigger
- A third language, or translations managed by non-developers.
