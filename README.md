# Cami Hernandez — Personal Brand Website

One-pager landing site for **Cami Hernandez** (motivational speaker, lifestyle coach, spiritual
coach). React + Vite, 100% static frontend — no backend yet. Bilingual (English/Spanish) via a
global language toggle in the nav.

## Quick start

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
detail in [docs/specs/01-tech-stack.md](docs/specs/01-tech-stack.md).

## Project structure

```
public/images/    # real photos (hero, gallery, testimonials)
src/
  components/     # one component per page section
  constants/      # data.jsx (list content), i18n.js (UI_TEXT translations), colors.js (palette)
  context/        # LanguageContext.jsx — global EN/ES toggle state
  hooks/          # useReveal.js — scroll-reveal
  styles/         # global.css
  App.jsx         # page composition
  main.jsx        # entry point
```

Full breakdown in [docs/specs/04-architecture.md](docs/specs/04-architecture.md).

## Deploy

Manual: `npm run build` generates `dist/`, upload its contents to GoDaddy shared hosting
(`public_html/`). No CI/CD yet. Detail in
[docs/specs/01-tech-stack.md](docs/specs/01-tech-stack.md).

## Working on this repo

This project uses **Spec Driven Development** — specs in `docs/specs/` are the source of truth
for decisions already made, not the code itself. **Read [AGENTS.md](AGENTS.md) first** — it's
the entry point for any agent or contributor and links to every spec and to the ticket/PR
workflow in `docs/process/`.

Work is tracked as `CMP-XXX` tickets in [TICKETS.md](TICKETS.md); there's no external tracker
yet.
