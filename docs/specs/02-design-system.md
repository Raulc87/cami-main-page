# 02 — Sistema de Diseño

Fuente: moodboard de marca — *Elegancia · Calma · Equilibrio · Feminidad*.

## Paleta de colores

Definida en [src/constants/colors.js](../../src/constants/colors.js) como el objeto `C`.
**En JSX/inline styles, toda la UI debe consumir estos valores desde `C`, no hardcodear hex
nuevos** salvo casos puntuales (overlays con alpha, gradientes) donde ya se deriva de estos
mismos colores.

**Excepción inevitable — `global.css`:** CSS no puede importar el objeto `C` (es JS), así que
[global.css](../../src/styles/global.css) repite los mismos valores hex a mano (ej. `#f9f4f2`
en `body`, `#1e2d42` en `.cta-btn`, `#e8d4d8` en `.svc-card`, etc.). Esto es esperado, no un
error — pero significa que **si cambia un color en `colors.js`, hay que actualizar a mano las
apariciones equivalentes en `global.css`** para que no se desincronicen.

| Token | Hex | Uso |
|---|---|---|
| `C.bg` | `#f9f4f2` | Fondo general de página (crema cálido) |
| `C.white` | `#ffffff` | Cards, fondos claros |
| `C.navy` | `#1e2d42` | Color primario oscuro (texto principal, botones, footer) |
| `C.navyMid` | `#2c3e5a` | Navy intermedio (hover borders, gradientes) |
| `C.navyLight` | `#4a6178` | Texto de cuerpo, navy claro |
| `C.rose` | `#c9a4ab` | Acento "dusty rose" (badges, dots, italics) |
| `C.roseLight` | `#e8d4d8` | Rose claro (bordes, fondos de stats bar) |
| `C.cream` | `#f5ede8` | Alternancia de secciones |
| `C.textMuted` | `#8a9aaa` | Labels/mono text apagado |

## Tipografía

Importada vía Google Fonts CDN en [global.css](../../src/styles/global.css) (línea 1):

- **Outfit** (300–900) — fuente principal para body y headings. `font-family: 'Outfit', sans-serif`.
- **Cormorant Garamond** italic (400/600/700) — acentos emocionales: palabras destacadas en
  headlines (`Live`), quotes, taglines en español (`Disciplina hoy, libertad mañana.`).
  `font-family: "'Cormorant Garamond', serif"`, siempre con `fontStyle: 'italic'`.
- **JetBrains Mono** (400/500) — labels técnicos/mono: placeholders de imagen, URL en footer.

## Patrones visuales

- **Bordes redondeados** grandes: 10–20px en cards/botones, `100px`/`50%` para pills y círculos.
- **Grain texture overlay**: `body::before` con SVG de ruido (`feTurbulence`), opacity 0.028,
  fixed, z-index 200 — textura sutil sobre todo el sitio.
- **Glow orbs**: dos círculos `radial-gradient` `position: fixed` definidos inline en
  [App.jsx](../../src/App.jsx), no en CSS — decoración de fondo global, z-index 0.
- **Scroll-reveal**: fade + slide-up al entrar en viewport, vía el hook
  [useReveal](../../src/hooks/useReveal.js) — ver [04-architecture.md](04-architecture.md).
- **Hover states**:
  - `.svc-card` → `translateX(5px)` + cambia color de `border-left` + sombra.
  - `.val-chip` → invierte a fondo navy + texto blanco.
  - `.cta-btn` → `translateY(-3px)` + sombra más pronunciada.
- **Botones CTA** (`.cta-btn`): fondo navy, texto blanco, uppercase, `letter-spacing: 0.14em`,
  `border-radius: 10px`, padding generoso (`18px 56px`; variante `.cta-btn-sm` más compacta).

## Estilo de implementación (mezcla intencional)

El proyecto mezcla dos enfoques y **ambos son válidos actualmente**:

1. **Inline styles** (`style={{...}}`) por componente — usado para layout, posicionamiento y
   valores que dependen de `C` o de props.
2. **Clases utilitarias en `global.css`** — usadas para `:hover`, `@media`, `@keyframes` y
   cualquier cosa que CSS-in-JS inline no puede expresar (pseudo-clases, pseudo-elementos).

Si se decide migrar a otro enfoque (CSS Modules, Tailwind, styled-components, etc.), documentar
esa decisión como spec/ADR nuevo antes de mezclar un tercer patrón.

## Breakpoints responsive

Definidos en `global.css` (`@media`):

- `max-width: 900px` — ajusta grid de servicios a 2 columnas.
- `max-width: 640px` — mobile: stacks verticales, grids a 1–2 columnas, tipografía reducida,
  padding de secciones reducido. Ver clases `.hero-flex`, `.stats-grid`, `.svc-grid`,
  `.steps-flex`, `.vals-flex`, `.tests-grid`, `.gallery-grid`, `.section-pad`, `.nav-pad`.
