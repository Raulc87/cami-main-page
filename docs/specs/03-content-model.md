# 03 — Modelo de Contenido

## Regla general

**El contenido repetido/estructurado (listas) vive en
[src/constants/data.jsx](../../src/constants/data.jsx).** Servicios, pasos del proceso,
valores, testimonios y stats se editan ahí — no hay que tocar componentes para cambiar esos
textos.

**Lo que NO está centralizado todavía:** headlines, subtítulos, labels de sección, copy de
botones/CTA y texto de nav/footer siguen **hardcodeados inline** en cada componente. Para
cambiar ese texto hay que editar el componente directamente, por ejemplo:

- Headline y sub del hero, badge, tagline en español → [Hero.jsx](../../src/components/Hero.jsx)
- Copy del CTA final, email de contacto → [CTA.jsx](../../src/components/CTA.jsx)
- Wordmark, badge de disponibilidad → [Nav.jsx](../../src/components/Nav.jsx)
- Wordmark, brand words, URL → [Footer.jsx](../../src/components/Footer.jsx)
- Kickers/headings de cada sección (ej. "Moments", "Cami in Action") → dentro del componente
  de esa sección ([Gallery.jsx](../../src/components/Gallery.jsx),
  [Services.jsx](../../src/components/Services.jsx),
  [Process.jsx](../../src/components/Process.jsx),
  [Values.jsx](../../src/components/Values.jsx),
  [Testimonials.jsx](../../src/components/Testimonials.jsx))

Si una tarea futura migra este copy a `data.jsx`, actualizar esta sección para reflejarlo.

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
featured?, image?, quoteEs?, quoteLong?, quoteLongEs? }` — el primero (`featured: true`) se
muestra destacado/más grande.

- `image` (opcional): ruta a una foto real en `/images/` (ver
  [04-architecture.md](04-architecture.md)). Si no está presente, se muestra un avatar
  placeholder con gradiente (igual que hoy).
- `quoteEs`, `quoteLong`, `quoteLongEs` (opcionales, van juntos): solo cuando el testimonio
  tiene copy bilingüe real. `quote`/`quoteEs` son la versión corta (inglés/español); `quoteLong`/
  `quoteLongEs` son la versión larga que se muestra al hacer click en el link "see more" del
  testimonio destacado. Si un testimonio no trae `quoteEs`, no se le renderiza el toggle de
  idioma ni el link "see more" — sigue mostrando solo `quote`, igual que los demás.

**El primer testimonio (Ana Lu) es contenido real**, con foto y copy bilingüe (extraído/
traducido de un documento aportado por el cliente). **Los otros 3 siguen siendo ficticios**,
ver [00-vision.md](00-vision.md).

### `STATS` (array, 4 items)

Usado por [Hero.jsx](../../src/components/Hero.jsx) en la barra de stats. `{ num, label }` —
ej. `500+` / `Lives Transformed`.

### `GALLERY_SLOTS` (array, 5 items)

**⚠ Actualmente no se usa.** [Gallery.jsx](../../src/components/Gallery.jsx) define su propio
array local `SLOTS` (con forma distinta: `{ label, bg, tall, image? }`, `bg` construido con
los tokens de `C` en vez de un string CSS crudo; `image` es opcional — ruta a una foto real en
`/images/`, mismo nombre de campo que `TESTIMONIALS.image`) en vez de importar `GALLERY_SLOTS`
de aquí.
Editar `GALLERY_SLOTS` en `data.jsx` **no tiene ningún efecto** en lo que se renderiza — es
código muerto. Si se quiere que la galería sea editable desde `data.jsx` como el resto de las
secciones, hay que migrar `Gallery.jsx` para consumir este export (o eliminar el export si se
decide que no vale la pena). Tratar como deuda técnica pendiente, no como algo ya conectado.

## Cuando agregues contenido nuevo

Si una feature nueva necesita datos que hoy no existen como estructura (ej. catálogo de
productos con precio, cuestionario con preguntas dinámicas), **no lo fuerces dentro de
`data.jsx`** como si fuera copy estático — eso es para contenido de marketing de la landing
actual. Datos que vienen de un formulario, backend o base de datos (leads, respuestas de
cuestionario) pertenecen a la capa que se defina en el spec de arquitectura de backend
correspondiente (ver [05-roadmap.md](05-roadmap.md)), no a `src/constants/`.
