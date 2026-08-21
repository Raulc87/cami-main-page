# 01 — Stack Técnico

## Frontend (actual)

| Capa | Elección | Notas |
|---|---|---|
| Framework | React 18.3 | `react`, `react-dom` |
| Build tool | Vite 7 | `@vitejs/plugin-react` |
| Lenguaje | JS/JSX | No TypeScript |
| Routing | Ninguno | Sitio de una sola página, navegación por anchor links (`#contact`) |
| State management | Ninguno (sin librería) | `useState`/`useEffect` locales (ver [useReveal](../../src/hooks/useReveal.js)) + un React Context nativo para el idioma global (ver [LanguageContext](../../src/context/LanguageContext.jsx) y [04-architecture.md](04-architecture.md)). Sin Redux/Zustand/etc. |
| CSS | CSS plano | [global.css](../../src/styles/global.css) + inline styles por componente (ver [02-design-system.md](02-design-system.md)) |
| Fuentes | Google Fonts vía `@import` en global.css | Outfit, Cormorant Garamond, JetBrains Mono |
| Testing | No configurado | — |

## Scripts (`package.json`)

```bash
npm run dev       # vite — localhost:5173
npm run build     # vite build → dist/
npm run preview   # sirve dist/ localmente
```

## Backend

**No existe todavía.** Cuando se implemente (ver [05-roadmap.md](05-roadmap.md) — formularios,
leads, integraciones), la elección planeada es **Node.js**. Ese será su propio spec
(`06-backend-architecture.md` o similar) cuando arranque el ticket correspondiente — no
inventar esa arquitectura de antemano en specs que no la necesitan.

## Hosting / Deploy

- **GoDaddy shared hosting.**
- `npm run build` genera `dist/`.
- El contenido de `dist/` se sube manualmente a `public_html/`.
- No hay CI/CD todavía — deploy manual.
- Cuando exista backend en Node.js, este modelo de hosting (shared hosting estático) puede no
  alcanzar — es una decisión pendiente, no asumir que GoDaddy shared hosting sirve para eso.

## Convenciones de repo

- Git, rama principal `main`.
- Convención de ramas y tickets: `CMP-XXX-slug` — ver [AGENTS.md](../../AGENTS.md) y
  [TICKETS.md](../../TICKETS.md).
