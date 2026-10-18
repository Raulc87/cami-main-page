# ADR-002 — GoDaddy shared hosting with manual static deploy

- Status: Accepted (recorded retroactively in CMP-014)
- Date: 2026-09-04 (first production release, CMP-012)
- Decision owner: Raul Casanas
- Related specs: [TECH_STACK §2, §10](../../TECH_STACK.md), [release-checklist.md](../process/release-checklist.md)

## Decision Request
Where and how is the site hosted and deployed?

## Context
The domain `camihernandez.com` and a GoDaddy Web Hosting (shared, cPanel) plan are already
available. The site is fully static (ADR-001).

## Decision Drivers
- Reuse the hosting already paid for; no extra cost.
- Static files only.

## Options Considered

### Option A — GoDaddy Web Hosting, manual upload of `dist/` to `public_html/`
Pros:
- Already available; no new account or cost.
Cons:
- Manual, error-prone deploy; no CI/CD; no preview environments.
Risks:
- Cannot run the planned Node.js backend.

### Option B — Free static host (Netlify / Vercel / GitHub Pages) with Git-based deploy
Pros:
- Automatic deploys and previews on a free tier.
Cons:
- DNS migration away from the existing setup; another provider to manage.
Risks:
- Free-tier terms change.

## Decision
Option A, with the release process in `release-checklist.md` (version bump, build, upload via
cPanel File Manager, tag + `gh release create`).

## Rationale
- Zero additional cost and already proven in the v1.0.0 release.

## Consequences
### Positive
- The site is live and the process is documented, including known pitfalls (Airo vs Web
  Hosting, migration wizard, default placeholder files).

### Negative / Trade-offs
- Every deploy is manual.

## Architecture Impact
- No server runtime available (PROJECT_SPEC NFR-001).

## Implementation Impact
- `npm run build` is the only gate before deploy.

## Validation
- `camihernandez.com` serves the latest tagged release.

## Review Trigger
- Start of US-011/US-012 (backend), or deploys becoming frequent enough to justify CI.
