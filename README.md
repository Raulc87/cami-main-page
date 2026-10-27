# Cami Hernandez — Personal Brand Website

One-pager landing site for **Cami Hernandez** (motivational speaker, lifestyle coach, spiritual
coach). React + Vite, 100% static frontend — no backend yet. Bilingual (English/Spanish) via a
global language toggle in the nav.

**Status:** live at [camihernandez.com](https://camihernandez.com) (v1.0.1); Sprint 01 closed,
Sprint 02 (events) active — see [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md).

## Quick start

Setup, commands, checks and conventions: [CONTRIBUTING.md](CONTRIBUTING.md). In short:

```bash
npm install
npm run dev       # http://localhost:5173
```

```bash
npm run build     # → dist/
npm run preview   # serve dist/ locally
```

## Stack

React 18, Vite 7, plain JS/JSX (no TypeScript), plain CSS + inline styles, no router, no state
library beyond a small React Context for the language toggle. No tests configured yet. Full
detail in [TECH_STACK.md](TECH_STACK.md).

## Project structure

```
public/images/    # real photos (hero, gallery, testimonials)
src/
  api/            # events.js — client for the events backend
  components/     # one component per page section
  constants/      # data.jsx (list content), i18n.js (UI_TEXT translations), colors.js (palette)
  context/        # LanguageContext.jsx — global EN/ES toggle state
  hooks/          # useReveal.js — scroll-reveal; useEvents.js — events data
  styles/         # global.css
  App.jsx         # page composition
  main.jsx        # entry point
```

Full breakdown in [docs/specs/ARCHITECTURE_SPEC.md](docs/specs/ARCHITECTURE_SPEC.md).

## Deploy

Manual: `npm run build` generates `dist/`, upload its contents to GoDaddy shared hosting
(`public_html/`). No CI/CD yet. Detail in
[TECH_STACK.md](TECH_STACK.md).

## Working on this repo

This project follows the **SDD starter kit** (Spec Driven Development + Scrum with user stories) —
the specs in `docs/specs/` are the source of truth for decisions already made, not the code
itself. **Read [AGENTS.md](AGENTS.md) first** — it's the entry point for any agent or contributor
and links to every spec, the user stories, the ADRs in `docs/decisions/`, the sprint plans in
`docs/sprints/`, and the ticket/PR workflow in `docs/process/`. [CLAUDE.md](CLAUDE.md) and
[PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) give the quick project context and doc map.

Work is tracked as `CMP-XXX` tickets in [TICKETS.md](TICKETS.md). Product tickets implement one or
more user stories from [docs/specs/USER_STORIES.md](docs/specs/USER_STORIES.md); process/tech-debt
tickets may have none. There's no external tracker yet.
