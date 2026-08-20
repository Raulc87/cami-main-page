# 04 — Arquitectura de Componentes

## Estructura de carpetas

```
public/
  images/         # fotos reales (hero, galería, testimonios) — servidas como /images/archivo.jpg
src/
  components/     # un componente por sección de la página
  constants/      # data.jsx (copy) y colors.js (paleta) — ver 02 y 03
  hooks/          # useReveal.js — scroll-reveal
  styles/         # global.css — reset, fonts, animaciones, hover, responsive
  App.jsx         # composición de la página
  main.jsx        # entry point de React
```

## Composición de la página

[App.jsx](../../src/App.jsx) renderiza las secciones en este orden fijo (todas reciben la prop
`r` del hook `useReveal`, excepto `Nav` y `Footer` que son estáticas):

1. `Nav` — logo, badge "Available for 2026", CTA "Book Cami".
2. `Hero` — headline, sub, CTA, imagen placeholder, barra de stats.
3. `Services` — 3 cards de servicios (`SERVICES`).
4. `Gallery` — grid de 5 slots con gradientes placeholder.
5. `Process` — 3 pasos (`STEPS`).
6. `Values` — 4 chips de valores (`VALUES`).
7. `Testimonials` — 4 testimonios (`TESTIMONIALS`).
8. `CTA` — llamado a la acción final.
9. `Footer` — wordmark, brand words, URL.

Cada componente es dueño de su propia sección: importa lo que necesita de `constants/` y no
recibe props de contenido desde `App.jsx` (solo recibe `r`).

## Patrón de scroll-reveal (`useReveal`)

[src/hooks/useReveal.js](../../src/hooks/useReveal.js) crea **un solo** `IntersectionObserver`
para toda la página (no uno por componente). Se usa así:

```js
const r = useReveal()          // en App.jsx, una sola vez
<div {...r('unique-id', delayMs)}>...</div>   // en cualquier componente hijo
```

Reglas:

- La prop `r` se pasa hacia abajo desde `App.jsx` a cada sección que la necesite.
- El `id` pasado a `r(id, delay)` (vía `data-rid`) **debe ser único en toda la página**, no
  solo dentro del componente — el observer vive a nivel global.
- `delay` es opcional, en milisegundos, para escalonar animaciones dentro de una misma sección.

## Estilos

Ver [02-design-system.md](02-design-system.md) — mezcla de inline styles + clases en
`global.css`. No hay CSS Modules ni scoping automático; los nombres de clase deben mantenerse
únicos manualmente (ej. `.hero-flex`, `.svc-card`, `.step-circle`).

## Testing / build

- Sin tests automatizados configurados todavía.
- `npm run build` es el único gate antes de deploy manual (ver
  [01-tech-stack.md](01-tech-stack.md)).
