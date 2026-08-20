# 03 — Modelo de Contenido

## Regla general

**Todo el copy editable vive en [src/constants/data.jsx](../../src/constants/data.jsx).**
Para cambiar textos, servicios, testimonios, stats o valores, se edita ese archivo — no hay
que tocar componentes salvo que cambie la *estructura* de la sección.

Los colores de marca viven aparte, en
[src/constants/colors.js](../../src/constants/colors.js) (ver
[02-design-system.md](02-design-system.md)).

Metadata de SEO/social (`title`, `description`, `og:*`) vive en [index.html](../../index.html),
no en `data.jsx`.

## Exports de `data.jsx`

### `SERVICES` (array, 3 items)

Usado por [Services.jsx](../../src/components/Services.jsx).

```js
{ label, title, desc, note, icon }
```
- `label`: kicker en mayúsculas (ej. `MOTIVATIONAL SPEAKING`).
- `icon`: JSX de un `<svg>` inline (no archivos de imagen separados).
- `note`: estado de disponibilidad — actualmente 1 dice `Booking available`, 2 dicen
  `Catalog coming soon` (relevante para [05-roadmap.md](05-roadmap.md), catálogo de productos).

### `STEPS` (array, 3 items)

Usado por [Process.jsx](../../src/components/Process.jsx). Proceso de 3 pasos:
`Discover → Transform → Thrive`. `{ num, title, desc, featured? }` — `featured: true` en el
paso del medio (Transform) le da estilo destacado.

### `VALUES` (array, 4 items)

Usado por [Values.jsx](../../src/components/Values.jsx). Cada valor tiene nombre en español e
inglés: `{ es, en, icon }` — ej. `Confianza` / `Trust`.

### `TESTIMONIALS` (array, 4 items)

Usado por [Testimonials.jsx](../../src/components/Testimonials.jsx). `{ quote, name, role,
featured? }` — el primero (`featured: true`) se muestra destacado/más grande. **Contenido
ficticio actualmente**, ver [00-vision.md](00-vision.md).

### `STATS` (array, 4 items)

Usado por [Hero.jsx](../../src/components/Hero.jsx) en la barra de stats. `{ num, label }` —
ej. `500+` / `Lives Transformed`.

### `GALLERY_SLOTS` (array, 5 items)

Usado por [Gallery.jsx](../../src/components/Gallery.jsx). `{ label, style, tall? }` — `style`
es un string CSS crudo (gradiente placeholder); `tall: true` en el primer slot le da
`grid-row: 1 / 3`. Pendiente de reemplazar por fotos reales.

## Cuando agregues contenido nuevo

Si una feature nueva necesita datos que hoy no existen como estructura (ej. catálogo de
productos con precio, cuestionario con preguntas dinámicas), **no lo fuerces dentro de
`data.jsx`** como si fuera copy estático — eso es para contenido de marketing de la landing
actual. Datos que vienen de un formulario, backend o base de datos (leads, respuestas de
cuestionario) pertenecen a la capa que se defina en el spec de arquitectura de backend
correspondiente (ver [05-roadmap.md](05-roadmap.md)), no a `src/constants/`.
