# 03 — Modelo de Contenido

## Regla general

**El contenido repetido/estructurado (listas) vive en
[src/constants/data.jsx](../../src/constants/data.jsx).** Servicios, pasos del proceso,
valores, testimonios y stats se editan ahí — no hay que tocar componentes para cambiar esos
textos.

**El copy de UI traducible (headlines, kickers, CTA, badges, labels de nav) vive en
[src/constants/i18n.js](../../src/constants/i18n.js)**, como `UI_TEXT` — un objeto anidado por
sección con pares `{ en, es }` (ej. `UI_TEXT.hero.h1a.en` / `.es`). Este archivo es la fuente de
verdad para todo el copy que cambia con el toggle de idioma global (ver
[04-architecture.md](04-architecture.md) — `LanguageContext` / `useLanguage()`). Los
componentes leen `lang` de `useLanguage()` y seleccionan `UI_TEXT.<seccion>.<key>[lang]`.

**Lo que sigue sin centralizar (y no es candidato a `i18n.js`):** texto que **no** cambia con el
idioma — nombres propios (wordmark "Cami Hernandez"), el email de contacto, y los **acentos de
marca en español fijos** (la tagline del Hero "Disciplina hoy, libertad mañana.", la quote sobre
la foto del hero, las `WORDS` del Footer) — estos son flourishes intencionales en español
siempre, sin importar el toggle (ver [00-vision.md](00-vision.md)). Siguen **hardcodeados
inline** en su componente. Para cambiar ese texto hay que editar el componente directamente, por
ejemplo:

- Wordmark "Cami Hernandez" → [Nav.jsx](../../src/components/Nav.jsx) y
  [Footer.jsx](../../src/components/Footer.jsx) (mismo texto en ambos, hardcodeado por
  separado en cada uno — no se traduce, es el nombre de la marca).
- Tagline en español fijo del hero ("Disciplina hoy, libertad mañana.") y la quote sobre la
  foto ("Tu mejor versión empieza aquí.") → [Hero.jsx](../../src/components/Hero.jsx).
- Email de contacto → [CTA.jsx](../../src/components/CTA.jsx).
- Brand words (`WORDS`) y URL → [Footer.jsx](../../src/components/Footer.jsx).

Todo lo demás que antes estaba en esta lista (headline/sub del hero, badges, copy de CTA,
kickers/headings de cada sección) **ya no está hardcodeado inline** — se movió a `UI_TEXT` en
[src/constants/i18n.js](../../src/constants/i18n.js), ver arriba.

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
{ label, labelEs, title, titleEs, desc, descEs, note, noteEs, icon }
```
- `label`: kicker en mayúsculas (ej. `MOTIVATIONAL SPEAKING`).
- `icon`: JSX de un `<svg>` inline (no archivos de imagen separados).
- `note`: estado de disponibilidad — actualmente 1 dice `Booking available`, 2 dicen
  `Catalog coming soon` (relevante para [05-roadmap.md](05-roadmap.md), catálogo de productos).
- Cada campo tiene su par `*Es` (`labelEs`, `titleEs`, `descEs`, `noteEs`) para el toggle de
  idioma global.

### `STEPS` (array, 3 items)

Usado por [Process.jsx](../../src/components/Process.jsx). Proceso de 3 pasos:
`Discover → Transform → Thrive`. `{ num, title, titleEs, desc, descEs, featured? }` —
`featured: true` en el paso del medio (Transform) le da estilo destacado. `num` (`'01'`, `'02'`,
`'03'`) no se traduce.

### `VALUES` (array, 4 items)

Usado por [Values.jsx](../../src/components/Values.jsx). Cada valor tiene nombre en español e
inglés: `{ es, en, icon }` — ej. `Confianza` / `Trust`.

### `TESTIMONIALS` (array, 4 items)

Usado por [Testimonials.jsx](../../src/components/Testimonials.jsx). `{ quote, quoteEs, name,
role, featured?, image?, quoteLong?, quoteLongEs? }` — el primero (`featured: true`) se
muestra destacado/más grande. Los 4 items tienen `quote`/`quoteEs` (idioma controlado por el
toggle global, ver [04-architecture.md](04-architecture.md)); `name`/`role` no se traducen.

- `image` (opcional): ruta a una foto real en `/images/` (ver
  [04-architecture.md](04-architecture.md)). Si no está presente, se muestra un avatar
  placeholder con gradiente (igual que hoy).
- `quoteLong`/`quoteLongEs` (opcionales, solo en el testimonio destacado): versión larga que se
  muestra al hacer click en el link "see more"/"ver más". El botón/link "see more" solo se
  renderiza si el testimonio destacado trae `quoteLong` y/o `quoteLongEs` — si no trae ninguno
  de los dos, no aparece ningún control de expandir (no hay fallback a un botón que no haga
  nada).

**El primer testimonio (Ana Lu) es contenido real**, con foto y copy bilingüe (extraído/
traducido de un documento aportado por el cliente). **Los otros 3 siguen siendo ficticios**
(ver [00-vision.md](00-vision.md)) pero también tienen `quoteEs` para que la sección respete el
toggle de idioma sin excepciones.

### `STATS` (array, 4 items)

Usado por [Hero.jsx](../../src/components/Hero.jsx) en la barra de stats. `{ num, label,
labelEs }` — ej. `500+` / `Lives Transformed` / `Vidas Transformadas`. `num` no se traduce.

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
