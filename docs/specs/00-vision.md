# 00 — Visión & Producto

## Quién

**Cami Hernandez** — motivational speaker, lifestyle coach y spiritual coach. El sitio es su
marca personal.

## Qué es este proyecto hoy

Un **one-pager** (landing de una sola página) construido en React + Vite, 100% frontend
estático, sin backend, sin base de datos, sin formularios funcionales todavía. Ver
[01-tech-stack.md](01-tech-stack.md).

Objetivo actual del sitio:

- Presencia digital / credibilidad de marca.
- Presentar los 3 pilares de servicio: speaking, lifestyle coaching, spiritual coaching (ver
  [03-content-model.md](03-content-model.md)).
- Punto de contacto para booking (`#contact`, actualmente sin formulario real).

## Audiencia

Hombres y mujeres 25+ que buscan transformación personal ("done playing small" — copy actual
del hero). Bilingüe: la interfaz completa cambia entre inglés y español con un toggle global en
el `Nav` (ver [04-architecture.md](04-architecture.md) y
[03-content-model.md](03-content-model.md)), con default según `navigator.language` del
visitante. Además hay acentos en español que son fijos por diseño y **no** cambian con el
toggle — flourishes de marca, no copy funcional (`Disciplina hoy, libertad mañana.`, la quote
sobre la foto del hero, los nombres de valores mostrados en `es`/`en` simultáneo, las brand
words del footer).

## Hacia dónde va (no implementado aún)

El sitio va a evolucionar de landing estática a una plataforma con captura de leads,
catálogo de servicios y marketing dirigido. El detalle completo de eso vive en
[05-roadmap.md](05-roadmap.md) — trátalo como backlog/contexto, no como algo ya construido.

## Estado del contenido (importante para cualquier agente)

Parte del copy e imágenes sigue siendo **placeholder**, marcado explícitamente en el código:

- Foto de Cami en el Hero y el slot "1-on-1 Session" de Gallery ya son fotos reales
  ([Hero.jsx](../../src/components/Hero.jsx), [Gallery.jsx](../../src/components/Gallery.jsx));
  los otros 4 slots de Gallery siguen siendo gradientes de color con labels (`On Stage`,
  `Workshop`, `Community`, `Behind the Scenes`), no fotos reales.
- Los 4 testimonios en [data.jsx](../../src/constants/data.jsx) (Ana Lu, Melissa, Rocío,
  Stefanny) ya son contenido real, con foto — ver [03-content-model.md](03-content-model.md).
- Dos de los tres servicios dicen `note: 'Catalog coming soon'`.

No asumas que el resto de estos datos son reales al construir features nuevas sobre ellos.
