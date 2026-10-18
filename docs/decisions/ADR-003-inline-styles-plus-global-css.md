# ADR-003 — Inline styles + global.css utility classes

- Status: Accepted (recorded retroactively in CMP-014)
- Date: 2026-08-20 (pattern in place since the initial build; documented in CMP-001)
- Decision owner: Raul Casanas
- Related specs: [UX_UI_DIRECTION §6](../ux/UX_UI_DIRECTION.md#6-component-direction)

## Decision Request
How are components styled?

## Context
Components need values from the `C` palette object and from props, but also `:hover`,
`@media`, `@keyframes` and pseudo-elements, which inline styles cannot express.

## Decision Drivers
- No CSS framework or extra dependency (ADR-001).
- Palette consumed from a single JS source (`colors.js`).

## Options Considered

### Option A — Inline styles for layout/values + utility classes in `global.css`
Pros:
- No dependencies; direct access to `C` in JSX.
Cons:
- Two patterns side by side; palette hex values repeated by hand in `global.css`.
Risks:
- Color drift between `colors.js` and `global.css`.

### Option B — CSS Modules / Tailwind / styled-components
Pros:
- Scoping, one consistent pattern.
Cons:
- New tooling or dependency; migration of every component.
Risks:
- Mixing a third pattern during a partial migration.

## Decision
Option A. Both patterns are valid; migrating to another approach needs a new ADR first.

## Rationale
- Zero dependencies and good enough for one page.

## Consequences
### Positive
- Simple; no build configuration.

### Negative / Trade-offs
- Changing a palette color requires updating `global.css` by hand. Class names are global and
  must be kept unique manually.

## Architecture Impact
- None beyond ARCHITECTURE_SPEC §7 "Styles".

## Implementation Impact
- New hover/media rules go in `global.css`; values derived from `C` go inline.

## Validation
- Visual check on desktop and at the 900px/640px breakpoints.

## Review Trigger
- Repeated color drift or class-name collisions; growth beyond one page.
