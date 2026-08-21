# 04 — Arquitectura de Componentes

## Estructura de carpetas

```
public/
  images/         # fotos reales (hero, galería, testimonios) — servidas como /images/archivo.jpg
src/
  components/     # un componente por sección de la página
  constants/      # data.jsx (copy de listas), i18n.js (UI_TEXT) y colors.js (paleta) — ver 02 y 03
  context/        # LanguageContext.jsx — estado global de idioma (ver abajo)
  hooks/          # useReveal.js — scroll-reveal
  styles/         # global.css — reset, fonts, animaciones, hover, responsive
  App.jsx         # composición de la página
  main.jsx        # entry point de React
```

## Composición de la página

[App.jsx](../../src/App.jsx) renderiza las secciones en este orden fijo (todas reciben la prop
`r` del hook `useReveal`, excepto `Nav` y `Footer`, que no la reciben porque no tienen
animación de scroll-reveal — `Nav` sí es dinámico vía `LanguageContext`, ver abajo):

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

## Idioma global (`LanguageContext`)

[src/context/LanguageContext.jsx](../../src/context/LanguageContext.jsx) expone un
`LanguageProvider` (React Context, sin librería externa — ver
[01-tech-stack.md](01-tech-stack.md)) que envuelve `<App />` en
[main.jsx](../../src/main.jsx). Cualquier componente lee el idioma actual con el hook
`useLanguage()`:

```js
const { lang, setLang, toggleLang } = useLanguage()   // lang: 'en' | 'es'
```

- **Default**: si hay un valor guardado en `localStorage` (`cmp-lang`) se usa ese; si no,
  `navigator.language` — arranca en `'es'` si empieza con `es`, si no en `'en'`.
- **Persistencia**: cada cambio de `lang` se guarda en `localStorage` y se refleja en
  `document.documentElement.lang`.
- **Toggle**: vive en [Nav.jsx](../../src/components/Nav.jsx), junto al CTA "Book Cami" — es el
  único punto de control del idioma en toda la página (reemplaza el switch que en CMP-002 vivía
  solo dentro de `Testimonials.jsx` para un testimonio).
- Los componentes traducibles combinan `lang` con `UI_TEXT` de
  [constants/i18n.js](../../src/constants/i18n.js) (copy de UI) o con los campos `*Es` de
  `constants/data.jsx` (contenido de listas) — ver [03-content-model.md](03-content-model.md).
- Patrón hermano de `useReveal`: hook simple, sin dependencias externas, sin routing.

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
