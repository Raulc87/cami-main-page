# AGENTS.md — Entry point para agentes e IAs

Este archivo es el punto de entrada obligatorio para cualquier hilo de agente (o persona) que
empiece a trabajar en este repo. Léelo primero. Después, lee el/los spec(s) relevantes en
`docs/specs/` **antes** de tocar código — este proyecto usa Spec Driven Development: los specs
son la fuente de verdad sobre decisiones ya tomadas, no el código en sí.

## Qué es este proyecto

Sitio web de marca personal para **Cami Hernandez** (motivational speaker, lifestyle coach,
spiritual coach). Hoy es un one-pager estático en React + Vite, sin backend. Va a evolucionar
hacia captura de leads, catálogo de servicios y marketing dirigido — ver el roadmap.
Detalle completo: [docs/specs/00-vision.md](docs/specs/00-vision.md).

## Specs — léelos antes de implementar

| Spec | Cuándo consultarlo |
|---|---|
| [00-vision.md](docs/specs/00-vision.md) | Para qué existe el sitio, audiencia, qué contenido es placeholder |
| [01-tech-stack.md](docs/specs/01-tech-stack.md) | Stack, scripts, deploy (GoDaddy shared hosting), qué NO hay todavía (backend, tests, CI) |
| [02-design-system.md](docs/specs/02-design-system.md) | Paleta de colores, tipografía, patrones visuales, breakpoints |
| [03-content-model.md](docs/specs/03-content-model.md) | En qué archivo va cada tipo de copy/contenido |
| [04-architecture.md](docs/specs/04-architecture.md) | Estructura de carpetas, composición de `App.jsx`, patrón del hook `useReveal` |
| [05-roadmap.md](docs/specs/05-roadmap.md) | Features futuras (catálogo, cuestionarios, integraciones, analytics, DB de leads, email marketing, ads) — **backlog, no implementado** |

Si tu tarea cambia algo que un spec describe (paleta, estructura de carpetas, modelo de
contenido, stack), **actualiza el spec en la misma rama/PR** que el código. Un spec
desactualizado es peor que no tener spec.

## Cómo trabajamos: tickets y ramas

No usamos un sistema externo (Jira/Linear) todavía — el acrónimo del proyecto es **CMP**.

- Cada unidad de trabajo es un ticket `CMP-XXX` registrado en [TICKETS.md](TICKETS.md), que es
  la fuente de verdad para la numeración secuencial.
- Rama: `CMP-XXX-slug-corto` (ej. `CMP-001-sdd-foundation`).
- Antes de empezar, revisa `TICKETS.md`, toma el siguiente número libre, y agrega la fila ahí
  mismo al arrancar el trabajo.
- Detalle completo del flujo: ver el encabezado de [TICKETS.md](TICKETS.md).

## Cómo abrimos un PR

Antes de abrir cualquier PR, seguir sin saltarse pasos:

1. [docs/process/pr-precheck.md](docs/process/pr-precheck.md) — checklist de auto-revisión
   (specs actualizados, build limpio, `/code-review` corrido).
2. [docs/process/pr-workflow.md](docs/process/pr-workflow.md) — cómo crear el PR con `gh`
   (título con el ID del ticket, body con las 4 secciones obligatorias), cómo se pide revisión
   de Copilot, y el criterio de merge (0 comentarios de línea sin resolver, ≤ 3 suprimidos).

## Reglas rápidas para cualquier agente

- **No introduzcas librerías/frameworks nuevos** (router, state management, CSS framework,
  TypeScript, etc.) sin dejarlo explícito en el spec correspondiente — hoy el stack es
  intencionalmente mínimo (ver [01-tech-stack.md](docs/specs/01-tech-stack.md)).
- **Todo el copy va en `src/constants/data.jsx`**, los colores en `src/constants/colors.js` —
  no hardcodear contenido nuevo directo en componentes ni colores nuevos fuera de la paleta
  (ver [03-content-model.md](docs/specs/03-content-model.md) y
  [02-design-system.md](docs/specs/02-design-system.md)).
- **Mucho del contenido actual es placeholder** (testimonios ficticios, foto de Cami, fotos de
  galería) — no lo trates como dato real al construir sobre él.
- **El roadmap ([05-roadmap.md](docs/specs/05-roadmap.md)) no está construido** — es contexto
  de dirección, no una lista de tareas listas para implementar directo. Cada ítem necesita su
  propio ticket y, si aplica, su propio spec antes de codear.
- **Prioriza costo cero / free tier** al elegir herramientas para features nuevas (analytics,
  email marketing, DB) — es un proyecto personal sin presupuesto de licencias.
- Desarrollo local: `npm run dev` (puerto 5173). Build: `npm run build` → `dist/` (deploy
  manual a GoDaddy `public_html/`, ver [01-tech-stack.md](docs/specs/01-tech-stack.md)).

## Sobre este propio AGENTS.md

Si algo aquí queda desactualizado (nueva convención de tickets, specs nuevos agregados,
reglas que ya no aplican), corrígelo como parte del ticket que lo hizo obsoleto.
