# SPRINT_01_VERIFICATION — Browser verification of US-001..US-009 (CMP-017)

Evidence for moving US-001..US-009 from `Review` to `Done` (see
[SPRINT_01_PLAN → Verification](SPRINT_01_PLAN.md#verification)). This ticket does not change any
story status; the coordinator does that after the owner approves this evidence.

## Method

- Date: 2026-10-18. Build: `npm run build` OK on `main` @ `cc6cf74` (bundle `index-ABuFieRk.js`).
- App: `npm run dev` (Vite, `http://127.0.0.1:5173/`), driven with Playwright 1.56 + the pre-installed Chromium
  (headless). Viewports 1280×800, 900×800 and 375×740.
- Language: every width was run in English (browser locale `en-US`, empty `localStorage`) and then in Spanish
  by clicking the nav toggle. US-006 additionally uses fresh contexts with browser locales `es-ES`, `es-MX`
  and `fr-FR`, and reloads to check persistence.
- Each check reads the rendered DOM / computed styles (text, counts, image `naturalWidth` and rendered size,
  `getComputedStyle`, `document.documentElement.lang`, `localStorage`) and the screenshot shows the section.
  Scroll-reveal animations were waited out before each screenshot.
- No console errors or warnings in any run (1280, 900, 375).
- Screenshots: JPEG, viewport, quality 62, in [`evidence/sprint-01/`](evidence/sprint-01/) (total ≈ 4.5 MB).
  Names: `<story>-<ac>-<width>-<lang>.jpg`. A suffix `b` (e.g. `AC2b`) is a second state of the same AC.
- Result `Not applicable` = the AC itself restricts the viewport (US-008) or is checked at 1280px only
  (US-002 AC2 hover, per ticket instructions).
- Rows marked with `—` in width/language are file or network checks that do not depend on either. Rows
  labelled "extra" are additional checks beyond the AC × width × language grid.
- Limits: headless Chromium has no mail client (US-007 AC1 verifies the `mailto:` href, not the handoff); the
  manual GoDaddy upload (US-009 AC1) cannot be re-run, only its outcome is checked; social-network preview
  renderers were not run (US-009 AC2).

## Summary

Rows: 129 — Pass 115, Fail 2, Not applicable 12.

| Story | Result | Notes |
|---|---|---|
| US-001 — Brand hero with credibility stats | Pass | Pass 18, Fail 0, N/A 0 |
| US-002 — Service pillars overview | **Fail** (see below) | Pass 6, Fail 2, N/A 4 |
| US-003 — Photo gallery | Pass | Pass 13, Fail 0, N/A 0 |
| US-004 — Process and values | Pass | Pass 12, Fail 0, N/A 0 |
| US-005 — Real client testimonials | Pass | Pass 18, Fail 0, N/A 0 |
| US-006 — Global English/Spanish toggle | Pass | Pass 30, Fail 0, N/A 0 |
| US-007 — Booking contact by email | Pass | Pass 12, Fail 0, N/A 0 |
| US-008 — Mobile-friendly layout | Pass | Pass 4, Fail 0, N/A 8 |
| US-009 — Site live on the production domain | Pass | Pass 2, Fail 0, N/A 0 |

### Fails

| Story / AC | Width / language | Classification | Note |
|---|---|---|---|
| US-002 AC2 | 1280px / EN | Defect | Hover shift is not applied: the card stays at x=56 (computed `transform: matrix(1,0,0,1,0,0)`) while border colour and shadow do change. |
| US-002 AC2 | 1280px / ES | Defect | Hover shift is not applied: the card stays at x=56 (computed `transform: matrix(1,0,0,1,0,0)`) while border colour and shadow do change. |

Classification and the proposed fix ticket are in the PR → Risks. Detail: the scroll-reveal hook (`src/hooks/useReveal.js`) writes an inline `transform: translateY(0)` on every revealed card (`Services.jsx` spreads `r()` onto `.svc-card`), and an inline style beats the `.svc-card:hover { transform: translateX(5px) }` rule in `global.css`.

## Results per story

### US-001 — Brand hero with credibility stats

| AC | Width | Lang | Result | Note | Screenshot |
|---|---|---|---|---|---|
| AC1 | 1280px | EN | Pass | h1="Transform Your Beliefs." / "Live Your Truth.", badge="SPEAKER · LIFE COACH · SPIRITUAL GUIDE", CTA="WORK WITH CAMI" (link #contact), photo 1200px natural / 360x460 rendered | [US-001-AC1-1280-en.jpg](evidence/sprint-01/US-001-AC1-1280-en.jpg) |
| AC1 | 1280px | ES | Pass | h1="Transforma Tus Creencias." / "Vive Tu Verdad.", badge="CONFERENCISTA · COACH DE VIDA · GUÍA ESPIRITUAL", CTA="TRABAJA CON CAMI" (link #contact), photo 1200px natural / 360x460 rendered | [US-001-AC1-1280-es.jpg](evidence/sprint-01/US-001-AC1-1280-es.jpg) |
| AC1 | 900px | EN | Pass | h1="Transform Your Beliefs." / "Live Your Truth.", badge="SPEAKER · LIFE COACH · SPIRITUAL GUIDE", CTA="WORK WITH CAMI" (link #contact), photo 1200px natural / 360x460 rendered | [US-001-AC1-900-en.jpg](evidence/sprint-01/US-001-AC1-900-en.jpg) |
| AC1 | 900px | ES | Pass | h1="Transforma Tus Creencias." / "Vive Tu Verdad.", badge="CONFERENCISTA · COACH DE VIDA · GUÍA ESPIRITUAL", CTA="TRABAJA CON CAMI" (link #contact), photo 1200px natural / 360x460 rendered | [US-001-AC1-900-es.jpg](evidence/sprint-01/US-001-AC1-900-es.jpg) |
| AC1 | 375px | EN | Pass | h1="Transform Your Beliefs." / "Live Your Truth.", badge="SPEAKER · LIFE COACH · SPIRITUAL GUIDE", CTA="WORK WITH CAMI" (link #contact), photo 1200px natural / 320x300 rendered | [US-001-AC1-375-en.jpg](evidence/sprint-01/US-001-AC1-375-en.jpg) |
| AC1 | 375px | ES | Pass | h1="Transforma Tus Creencias." / "Vive Tu Verdad.", badge="CONFERENCISTA · COACH DE VIDA · GUÍA ESPIRITUAL", CTA="TRABAJA CON CAMI" (link #contact), photo 1200px natural / 320x300 rendered | [US-001-AC1-375-es.jpg](evidence/sprint-01/US-001-AC1-375-es.jpg) |
| AC2 | 1280px | EN | Pass | stats: 100 LIVES TRANSFORMED \| 25 SPEAKING EVENTS \| 6+ YEARS OF PRACTICE \| 4 PILLARS OF CHANGE | [US-001-AC2-1280-en.jpg](evidence/sprint-01/US-001-AC2-1280-en.jpg) |
| AC2 | 1280px | ES | Pass | stats: 100 VIDAS TRANSFORMADAS \| 25 EVENTOS DE CONFERENCIAS \| 6+ AÑOS DE EXPERIENCIA \| 4 PILARES DE CAMBIO | [US-001-AC2-1280-es.jpg](evidence/sprint-01/US-001-AC2-1280-es.jpg) |
| AC2 | 900px | EN | Pass | stats: 100 LIVES TRANSFORMED \| 25 SPEAKING EVENTS \| 6+ YEARS OF PRACTICE \| 4 PILLARS OF CHANGE | [US-001-AC2-900-en.jpg](evidence/sprint-01/US-001-AC2-900-en.jpg) |
| AC2 | 900px | ES | Pass | stats: 100 VIDAS TRANSFORMADAS \| 25 EVENTOS DE CONFERENCIAS \| 6+ AÑOS DE EXPERIENCIA \| 4 PILARES DE CAMBIO | [US-001-AC2-900-es.jpg](evidence/sprint-01/US-001-AC2-900-es.jpg) |
| AC2 | 375px | EN | Pass | stats: 100 LIVES TRANSFORMED \| 25 SPEAKING EVENTS \| 6+ YEARS OF PRACTICE \| 4 PILLARS OF CHANGE | [US-001-AC2-375-en.jpg](evidence/sprint-01/US-001-AC2-375-en.jpg) |
| AC2 | 375px | ES | Pass | stats: 100 VIDAS TRANSFORMADAS \| 25 EVENTOS DE CONFERENCIAS \| 6+ AÑOS DE EXPERIENCIA \| 4 PILARES DE CAMBIO | [US-001-AC2-375-es.jpg](evidence/sprint-01/US-001-AC2-375-es.jpg) |
| AC3 | 1280px | EN | Pass | tagline="Disciplina hoy, libertad mañana.", photo quote="Tu mejor versión empieza aquí." (quote is wrapped in straight double quotes in the page; AC text omits them) | [US-001-AC3-1280-en.jpg](evidence/sprint-01/US-001-AC3-1280-en.jpg) |
| AC3 | 1280px | ES | Pass | tagline="Disciplina hoy, libertad mañana.", photo quote="Tu mejor versión empieza aquí." (quote is wrapped in straight double quotes in the page; AC text omits them) | [US-001-AC3-1280-es.jpg](evidence/sprint-01/US-001-AC3-1280-es.jpg) |
| AC3 | 900px | EN | Pass | tagline="Disciplina hoy, libertad mañana.", photo quote="Tu mejor versión empieza aquí." (quote is wrapped in straight double quotes in the page; AC text omits them) | [US-001-AC3-900-en.jpg](evidence/sprint-01/US-001-AC3-900-en.jpg) |
| AC3 | 900px | ES | Pass | tagline="Disciplina hoy, libertad mañana.", photo quote="Tu mejor versión empieza aquí." (quote is wrapped in straight double quotes in the page; AC text omits them) | [US-001-AC3-900-es.jpg](evidence/sprint-01/US-001-AC3-900-es.jpg) |
| AC3 | 375px | EN | Pass | tagline="Disciplina hoy, libertad mañana.", photo quote="Tu mejor versión empieza aquí." (quote is wrapped in straight double quotes in the page; AC text omits them) | [US-001-AC3-375-en.jpg](evidence/sprint-01/US-001-AC3-375-en.jpg) |
| AC3 | 375px | ES | Pass | tagline="Disciplina hoy, libertad mañana.", photo quote="Tu mejor versión empieza aquí." (quote is wrapped in straight double quotes in the page; AC text omits them) | [US-001-AC3-375-es.jpg](evidence/sprint-01/US-001-AC3-375-es.jpg) |

### US-002 — Service pillars overview

| AC | Width | Lang | Result | Note | Screenshot |
|---|---|---|---|---|---|
| AC1 | 1280px | EN | Pass | 3 cards: Words That Break Walls / Design Your Ideal Life / Return to Your Inner Self; each has icon, kicker, title, description, note | [US-002-AC1-1280-en.jpg](evidence/sprint-01/US-002-AC1-1280-en.jpg) |
| AC1 | 1280px | ES | Pass | 3 cards: Palabras Que Rompen Muros / Diseña Tu Vida Ideal / Regresa a Tu Ser Interior; each has icon, kicker, title, description, note | [US-002-AC1-1280-es.jpg](evidence/sprint-01/US-002-AC1-1280-es.jpg) |
| AC1 | 900px | EN | Pass | 3 cards: Words That Break Walls / Design Your Ideal Life / Return to Your Inner Self; each has icon, kicker, title, description, note | [US-002-AC1-900-en.jpg](evidence/sprint-01/US-002-AC1-900-en.jpg) |
| AC1 | 900px | ES | Pass | 3 cards: Palabras Que Rompen Muros / Diseña Tu Vida Ideal / Regresa a Tu Ser Interior; each has icon, kicker, title, description, note | [US-002-AC1-900-es.jpg](evidence/sprint-01/US-002-AC1-900-es.jpg) |
| AC1 | 375px | EN | Pass | 3 cards: Words That Break Walls / Design Your Ideal Life / Return to Your Inner Self; each has icon, kicker, title, description, note | [US-002-AC1-375-en.jpg](evidence/sprint-01/US-002-AC1-375-en.jpg) |
| AC1 | 375px | ES | Pass | 3 cards: Palabras Que Rompen Muros / Diseña Tu Vida Ideal / Regresa a Tu Ser Interior; each has icon, kicker, title, description, note | [US-002-AC1-375-es.jpg](evidence/sprint-01/US-002-AC1-375-es.jpg) |
| AC2 | 1280px | EN | Fail | card 1 on hover: shift 0.0px (expected ~5px right; before x=56.0, after x=56.0, transform "matrix(1, 0, 0, 1, 0, 0)"), left border rgb(232, 212, 216) -> rgb(44, 62, 90) (changed: true), shadow none -> present | [US-002-AC2-1280-en.jpg](evidence/sprint-01/US-002-AC2-1280-en.jpg) |
| AC2 | 1280px | ES | Fail | card 1 on hover: shift 0.0px (expected ~5px right; before x=56.0, after x=56.0, transform "matrix(1, 0, 0, 1, 0, 0)"), left border rgb(232, 212, 216) -> rgb(44, 62, 90) (changed: true), shadow none -> present | [US-002-AC2-1280-es.jpg](evidence/sprint-01/US-002-AC2-1280-es.jpg) |
| AC2 | 900px | EN | Not applicable | Hover AC checked at 1280px only (per ticket instructions) | — |
| AC2 | 900px | ES | Not applicable | Hover AC checked at 1280px only (per ticket instructions) | — |
| AC2 | 375px | EN | Not applicable | Hover AC checked at 1280px only (per ticket instructions) | — |
| AC2 | 375px | ES | Not applicable | Hover AC checked at 1280px only (per ticket instructions) | — |

### US-003 — Photo gallery

| AC | Width | Lang | Result | Note | Screenshot |
|---|---|---|---|---|---|
| AC1 | 1280px | EN | Pass | 5 imgs, alts: On Stage / Workshop / 1-on-1 Session / Community / Behind the Scenes; all loaded (naturalWidth>0), 0 visible placeholder labels | [US-003-AC1-1280-en.jpg](evidence/sprint-01/US-003-AC1-1280-en.jpg) |
| AC1 | 1280px | ES | Pass | 5 imgs, alts: En el Escenario / Taller / Sesión Individual / Comunidad / Detrás de Cámaras; all loaded (naturalWidth>0), 0 visible placeholder labels | [US-003-AC1-1280-es.jpg](evidence/sprint-01/US-003-AC1-1280-es.jpg) |
| AC1 | 900px | EN | Pass | 5 imgs, alts: On Stage / Workshop / 1-on-1 Session / Community / Behind the Scenes; all loaded (naturalWidth>0), 0 visible placeholder labels | [US-003-AC1-900-en.jpg](evidence/sprint-01/US-003-AC1-900-en.jpg) |
| AC1 | 900px | ES | Pass | 5 imgs, alts: En el Escenario / Taller / Sesión Individual / Comunidad / Detrás de Cámaras; all loaded (naturalWidth>0), 0 visible placeholder labels | [US-003-AC1-900-es.jpg](evidence/sprint-01/US-003-AC1-900-es.jpg) |
| AC1 | 375px | EN | Pass | 5 imgs, alts: On Stage / Workshop / 1-on-1 Session / Community / Behind the Scenes; all loaded (naturalWidth>0), 0 visible placeholder labels | [US-003-AC1-375-en.jpg](evidence/sprint-01/US-003-AC1-375-en.jpg) |
| AC1 | 375px | ES | Pass | 5 imgs, alts: En el Escenario / Taller / Sesión Individual / Comunidad / Detrás de Cámaras; all loaded (naturalWidth>0), 0 visible placeholder labels | [US-003-AC1-375-es.jpg](evidence/sprint-01/US-003-AC1-375-es.jpg) |
| AC1 (extra) | 1280px | EN | Pass | fallback check (Workshop image blocked): visible label ["[ Workshop ]"]; label visible only for the failed photo | — |
| AC1 (extra) | 1280px | ES | Pass | fallback check (Workshop image blocked): visible label ["[ Taller ]"]; label visible only for the failed photo | — |
| AC1 (extra) | 900px | EN | Pass | fallback check (Workshop image blocked): visible label ["[ Workshop ]"]; label visible only for the failed photo | — |
| AC1 (extra) | 900px | ES | Pass | fallback check (Workshop image blocked): visible label ["[ Taller ]"]; label visible only for the failed photo | — |
| AC1 (extra) | 375px | EN | Pass | fallback check (Workshop image blocked): visible label ["[ Workshop ]"]; label visible only for the failed photo | — |
| AC1 (extra) | 375px | ES | Pass | fallback check (Workshop image blocked): visible label ["[ Taller ]"]; label visible only for the failed photo | — |
| AC2 | — | — | Pass | `file public/images/*.jpg`: all 10 files are JPEG (JFIF); longest side ≤ 1200px (max 1200: ana-lu 300x300, behind-the-scenes 1200x1006, cami-hero 1200x799, community 1200x900, melissa 68x120, on-stage 1200x800, one-on-one-session 666x1000, rocio 107x120, stefanny 120x120, workshop 1200x800). The 5 gallery photos are on-stage, workshop, one-on-one-session, community, behind-the-scenes. File check, independent of width and language. | — |

### US-004 — Process and values

| AC | Width | Lang | Result | Note | Screenshot |
|---|---|---|---|---|---|
| AC1 | 1280px | EN | Pass | steps: Discover → Transform → Thrive; circle backgrounds rgb(255, 255, 255) \| rgb(30, 45, 66) \| rgb(255, 255, 255) (middle = navy) | [US-004-AC1-1280-en.jpg](evidence/sprint-01/US-004-AC1-1280-en.jpg) |
| AC1 | 1280px | ES | Pass | steps: Descubre → Transforma → Florece; circle backgrounds rgb(255, 255, 255) \| rgb(30, 45, 66) \| rgb(255, 255, 255) (middle = navy) | [US-004-AC1-1280-es.jpg](evidence/sprint-01/US-004-AC1-1280-es.jpg) |
| AC1 | 900px | EN | Pass | steps: Discover → Transform → Thrive; circle backgrounds rgb(255, 255, 255) \| rgb(30, 45, 66) \| rgb(255, 255, 255) (middle = navy) | [US-004-AC1-900-en.jpg](evidence/sprint-01/US-004-AC1-900-en.jpg) |
| AC1 | 900px | ES | Pass | steps: Descubre → Transforma → Florece; circle backgrounds rgb(255, 255, 255) \| rgb(30, 45, 66) \| rgb(255, 255, 255) (middle = navy) | [US-004-AC1-900-es.jpg](evidence/sprint-01/US-004-AC1-900-es.jpg) |
| AC1 | 375px | EN | Pass | steps: Discover → Transform → Thrive; circle backgrounds rgb(255, 255, 255) \| rgb(30, 45, 66) \| rgb(255, 255, 255) (middle = navy) | [US-004-AC1-375-en.jpg](evidence/sprint-01/US-004-AC1-375-en.jpg) |
| AC1 | 375px | ES | Pass | steps: Descubre → Transforma → Florece; circle backgrounds rgb(255, 255, 255) \| rgb(30, 45, 66) \| rgb(255, 255, 255) (middle = navy) | [US-004-AC1-375-es.jpg](evidence/sprint-01/US-004-AC1-375-es.jpg) |
| AC2 | 1280px | EN | Pass | chips (innerText as rendered; the English name is uppercased by CSS): Confianza/TRUST, Equilibrio/BALANCE, Enfoque/FOCUS, Calidez/WARMTH | [US-004-AC2-1280-en.jpg](evidence/sprint-01/US-004-AC2-1280-en.jpg) |
| AC2 | 1280px | ES | Pass | chips (innerText as rendered; the English name is uppercased by CSS): Confianza/TRUST, Equilibrio/BALANCE, Enfoque/FOCUS, Calidez/WARMTH | [US-004-AC2-1280-es.jpg](evidence/sprint-01/US-004-AC2-1280-es.jpg) |
| AC2 | 900px | EN | Pass | chips (innerText as rendered; the English name is uppercased by CSS): Confianza/TRUST, Equilibrio/BALANCE, Enfoque/FOCUS, Calidez/WARMTH | [US-004-AC2-900-en.jpg](evidence/sprint-01/US-004-AC2-900-en.jpg) |
| AC2 | 900px | ES | Pass | chips (innerText as rendered; the English name is uppercased by CSS): Confianza/TRUST, Equilibrio/BALANCE, Enfoque/FOCUS, Calidez/WARMTH | [US-004-AC2-900-es.jpg](evidence/sprint-01/US-004-AC2-900-es.jpg) |
| AC2 | 375px | EN | Pass | chips (innerText as rendered; the English name is uppercased by CSS): Confianza/TRUST, Equilibrio/BALANCE, Enfoque/FOCUS, Calidez/WARMTH | [US-004-AC2-375-en.jpg](evidence/sprint-01/US-004-AC2-375-en.jpg) |
| AC2 | 375px | ES | Pass | chips (innerText as rendered; the English name is uppercased by CSS): Confianza/TRUST, Equilibrio/BALANCE, Enfoque/FOCUS, Calidez/WARMTH | [US-004-AC2-375-es.jpg](evidence/sprint-01/US-004-AC2-375-es.jpg) |

### US-005 — Real client testimonials

| AC | Width | Lang | Result | Note | Screenshot |
|---|---|---|---|---|---|
| AC1 | 1280px | EN | Pass | featured + 3 grid: Ana Lucía, Melissa, Rocío, Stefanny; all photos loaded; no role line rendered (no testimonial has a role) | [US-005-AC1-1280-en.jpg](evidence/sprint-01/US-005-AC1-1280-en.jpg) |
| AC1 | 1280px | ES | Pass | featured + 3 grid: Ana Lucía, Melissa, Rocío, Stefanny; all photos loaded; no role line rendered (no testimonial has a role) | [US-005-AC1-1280-es.jpg](evidence/sprint-01/US-005-AC1-1280-es.jpg) |
| AC1 | 900px | EN | Pass | featured + 3 grid: Ana Lucía, Melissa, Rocío, Stefanny; all photos loaded; no role line rendered (no testimonial has a role) | [US-005-AC1-900-en.jpg](evidence/sprint-01/US-005-AC1-900-en.jpg) |
| AC1 | 900px | ES | Pass | featured + 3 grid: Ana Lucía, Melissa, Rocío, Stefanny; all photos loaded; no role line rendered (no testimonial has a role) | [US-005-AC1-900-es.jpg](evidence/sprint-01/US-005-AC1-900-es.jpg) |
| AC1 | 375px | EN | Pass | featured + 3 grid: Ana Lucía, Melissa, Rocío, Stefanny; all photos loaded; no role line rendered (no testimonial has a role) | [US-005-AC1-375-en.jpg](evidence/sprint-01/US-005-AC1-375-en.jpg) |
| AC1 | 375px | ES | Pass | featured + 3 grid: Ana Lucía, Melissa, Rocío, Stefanny; all photos loaded; no role line rendered (no testimonial has a role) | [US-005-AC1-375-es.jpg](evidence/sprint-01/US-005-AC1-375-es.jpg) |
| AC2 | 1280px | EN | Pass | 2 toggles, labels ["see more","see more"]; featured expand true, collapse true; Stefanny expand true, collapse true; quote length 515→1679 (featured), 286→1097 (Stefanny) | [US-005-AC2-1280-en.jpg](evidence/sprint-01/US-005-AC2-1280-en.jpg), [US-005-AC2b-1280-en.jpg](evidence/sprint-01/US-005-AC2b-1280-en.jpg) |
| AC2 | 1280px | ES | Pass | 2 toggles, labels ["ver más","ver más"]; featured expand true, collapse true; Stefanny expand true, collapse true; quote length 569→1740 (featured), 270→1075 (Stefanny) | [US-005-AC2-1280-es.jpg](evidence/sprint-01/US-005-AC2-1280-es.jpg), [US-005-AC2b-1280-es.jpg](evidence/sprint-01/US-005-AC2b-1280-es.jpg) |
| AC2 | 900px | EN | Pass | 2 toggles, labels ["see more","see more"]; featured expand true, collapse true; Stefanny expand true, collapse true; quote length 515→1679 (featured), 286→1097 (Stefanny) | [US-005-AC2-900-en.jpg](evidence/sprint-01/US-005-AC2-900-en.jpg), [US-005-AC2b-900-en.jpg](evidence/sprint-01/US-005-AC2b-900-en.jpg) |
| AC2 | 900px | ES | Pass | 2 toggles, labels ["ver más","ver más"]; featured expand true, collapse true; Stefanny expand true, collapse true; quote length 569→1740 (featured), 270→1075 (Stefanny) | [US-005-AC2-900-es.jpg](evidence/sprint-01/US-005-AC2-900-es.jpg), [US-005-AC2b-900-es.jpg](evidence/sprint-01/US-005-AC2b-900-es.jpg) |
| AC2 | 375px | EN | Pass | 2 toggles, labels ["see more","see more"]; featured expand true, collapse true; Stefanny expand true, collapse true; quote length 515→1679 (featured), 286→1097 (Stefanny) | [US-005-AC2-375-en.jpg](evidence/sprint-01/US-005-AC2-375-en.jpg), [US-005-AC2b-375-en.jpg](evidence/sprint-01/US-005-AC2b-375-en.jpg) |
| AC2 | 375px | ES | Pass | 2 toggles, labels ["ver más","ver más"]; featured expand true, collapse true; Stefanny expand true, collapse true; quote length 569→1740 (featured), 270→1075 (Stefanny) | [US-005-AC2-375-es.jpg](evidence/sprint-01/US-005-AC2-375-es.jpg), [US-005-AC2b-375-es.jpg](evidence/sprint-01/US-005-AC2b-375-es.jpg) |
| AC3 | 1280px | EN | Pass | grid cards with a toggle: Melissa false, Rocío false, Stefanny true (Melissa and Rocío have no long version) | [US-005-AC3-1280-en.jpg](evidence/sprint-01/US-005-AC3-1280-en.jpg) |
| AC3 | 1280px | ES | Pass | grid cards with a toggle: Melissa false, Rocío false, Stefanny true (Melissa and Rocío have no long version) | [US-005-AC3-1280-es.jpg](evidence/sprint-01/US-005-AC3-1280-es.jpg) |
| AC3 | 900px | EN | Pass | grid cards with a toggle: Melissa false, Rocío false, Stefanny true (Melissa and Rocío have no long version) | [US-005-AC3-900-en.jpg](evidence/sprint-01/US-005-AC3-900-en.jpg) |
| AC3 | 900px | ES | Pass | grid cards with a toggle: Melissa false, Rocío false, Stefanny true (Melissa and Rocío have no long version) | [US-005-AC3-900-es.jpg](evidence/sprint-01/US-005-AC3-900-es.jpg) |
| AC3 | 375px | EN | Pass | grid cards with a toggle: Melissa false, Rocío false, Stefanny true (Melissa and Rocío have no long version) | [US-005-AC3-375-en.jpg](evidence/sprint-01/US-005-AC3-375-en.jpg) |
| AC3 | 375px | ES | Pass | grid cards with a toggle: Melissa false, Rocío false, Stefanny true (Melissa and Rocío have no long version) | [US-005-AC3-375-es.jpg](evidence/sprint-01/US-005-AC3-375-es.jpg) |

### US-006 — Global English/Spanish toggle

| AC | Width | Lang | Result | Note | Screenshot |
|---|---|---|---|---|---|
| AC1 | 1280px | EN | Pass | browser locale en-US, empty localStorage → html lang="en", h1 "Transform Your Beliefs." | [US-006-AC1-1280-en.jpg](evidence/sprint-01/US-006-AC1-1280-en.jpg) |
| AC1 | 1280px | ES | Pass | browser locale es-ES, empty localStorage → html lang="es", h1 "Transforma Tus Creencias." | [US-006-AC1-1280-es.jpg](evidence/sprint-01/US-006-AC1-1280-es.jpg) |
| AC1 | 900px | EN | Pass | browser locale en-US, empty localStorage → html lang="en", h1 "Transform Your Beliefs." | [US-006-AC1-900-en.jpg](evidence/sprint-01/US-006-AC1-900-en.jpg) |
| AC1 | 900px | ES | Pass | browser locale es-ES, empty localStorage → html lang="es", h1 "Transforma Tus Creencias." | [US-006-AC1-900-es.jpg](evidence/sprint-01/US-006-AC1-900-es.jpg) |
| AC1 | 375px | EN | Pass | browser locale en-US, empty localStorage → html lang="en", h1 "Transform Your Beliefs." | [US-006-AC1-375-en.jpg](evidence/sprint-01/US-006-AC1-375-en.jpg) |
| AC1 | 375px | ES | Pass | browser locale es-ES, empty localStorage → html lang="es", h1 "Transforma Tus Creencias." | [US-006-AC1-375-es.jpg](evidence/sprint-01/US-006-AC1-375-es.jpg) |
| AC1 (extra) | 1280px | EN | Pass | extra locale fr-FR → html lang="en" | — |
| AC1 (extra) | 1280px | ES | Pass | extra locale es-MX → html lang="es" | — |
| AC1 (extra) | 900px | EN | Pass | extra locale fr-FR → html lang="en" | — |
| AC1 (extra) | 900px | ES | Pass | extra locale es-MX → html lang="es" | — |
| AC1 (extra) | 375px | EN | Pass | extra locale fr-FR → html lang="en" | — |
| AC1 (extra) | 375px | ES | Pass | extra locale es-MX → html lang="es" | — |
| AC2 | 1280px | EN | Pass | ES→EN toggle: html lang="en", h1 "Transform Your Beliefs." read 50 ms after click, no reload, aria-checked=false | [US-006-AC2-1280-en.jpg](evidence/sprint-01/US-006-AC2-1280-en.jpg) |
| AC2 | 1280px | ES | Pass | EN→ES toggle: html lang="es", h1 "Transforma Tus Creencias." read 50 ms after click, no reload, aria-checked=true | [US-006-AC2-1280-es.jpg](evidence/sprint-01/US-006-AC2-1280-es.jpg) |
| AC2 | 900px | EN | Pass | ES→EN toggle: html lang="en", h1 "Transform Your Beliefs." read 50 ms after click, no reload, aria-checked=false | [US-006-AC2-900-en.jpg](evidence/sprint-01/US-006-AC2-900-en.jpg) |
| AC2 | 900px | ES | Pass | EN→ES toggle: html lang="es", h1 "Transforma Tus Creencias." read 50 ms after click, no reload, aria-checked=true | [US-006-AC2-900-es.jpg](evidence/sprint-01/US-006-AC2-900-es.jpg) |
| AC2 | 375px | EN | Pass | ES→EN toggle: html lang="en", h1 "Transform Your Beliefs." read 50 ms after click, no reload, aria-checked=false | [US-006-AC2-375-en.jpg](evidence/sprint-01/US-006-AC2-375-en.jpg) |
| AC2 | 375px | ES | Pass | EN→ES toggle: html lang="es", h1 "Transforma Tus Creencias." read 50 ms after click, no reload, aria-checked=true | [US-006-AC2-375-es.jpg](evidence/sprint-01/US-006-AC2-375-es.jpg) |
| AC3 | 1280px | EN | Pass | chose EN (browser locale es-ES) → localStorage cmp-lang="en"; after reload html lang="en", h1 "Transform Your Beliefs." (stored choice beats browser language) | [US-006-AC3-1280-en.jpg](evidence/sprint-01/US-006-AC3-1280-en.jpg) |
| AC3 | 1280px | ES | Pass | chose ES (browser locale en-US) → localStorage cmp-lang="es"; after reload html lang="es", h1 "Transforma Tus Creencias." | [US-006-AC3-1280-es.jpg](evidence/sprint-01/US-006-AC3-1280-es.jpg) |
| AC3 | 900px | EN | Pass | chose EN (browser locale es-ES) → localStorage cmp-lang="en"; after reload html lang="en", h1 "Transform Your Beliefs." (stored choice beats browser language) | [US-006-AC3-900-en.jpg](evidence/sprint-01/US-006-AC3-900-en.jpg) |
| AC3 | 900px | ES | Pass | chose ES (browser locale en-US) → localStorage cmp-lang="es"; after reload html lang="es", h1 "Transforma Tus Creencias." | [US-006-AC3-900-es.jpg](evidence/sprint-01/US-006-AC3-900-es.jpg) |
| AC3 | 375px | EN | Pass | chose EN (browser locale es-ES) → localStorage cmp-lang="en"; after reload html lang="en", h1 "Transform Your Beliefs." (stored choice beats browser language) | [US-006-AC3-375-en.jpg](evidence/sprint-01/US-006-AC3-375-en.jpg) |
| AC3 | 375px | ES | Pass | chose ES (browser locale en-US) → localStorage cmp-lang="es"; after reload html lang="es", h1 "Transforma Tus Creencias." | [US-006-AC3-375-es.jpg](evidence/sprint-01/US-006-AC3-375-es.jpg) |
| AC4 | 1280px | EN | Pass | nav wordmark "Cami Hernandez", footer "Cami Hernandez", brand words (uppercased by CSS) ELEGANCIA/CALMA/EQUILIBRIO/FEMINIDAD, URL camihernandez.com, tagline unchanged, value chips Confianza TRUST ; Equilibrio BALANCE ; Enfoque FOCUS ; Calidez WARMTH | [US-006-AC4-1280-en.jpg](evidence/sprint-01/US-006-AC4-1280-en.jpg) |
| AC4 | 1280px | ES | Pass | nav wordmark "Cami Hernandez", footer "Cami Hernandez", brand words (uppercased by CSS) ELEGANCIA/CALMA/EQUILIBRIO/FEMINIDAD, URL camihernandez.com, tagline unchanged, value chips Confianza TRUST ; Equilibrio BALANCE ; Enfoque FOCUS ; Calidez WARMTH | [US-006-AC4-1280-es.jpg](evidence/sprint-01/US-006-AC4-1280-es.jpg) |
| AC4 | 900px | EN | Pass | nav wordmark "Cami Hernandez", footer "Cami Hernandez", brand words (uppercased by CSS) ELEGANCIA/CALMA/EQUILIBRIO/FEMINIDAD, URL camihernandez.com, tagline unchanged, value chips Confianza TRUST ; Equilibrio BALANCE ; Enfoque FOCUS ; Calidez WARMTH | [US-006-AC4-900-en.jpg](evidence/sprint-01/US-006-AC4-900-en.jpg) |
| AC4 | 900px | ES | Pass | nav wordmark "Cami Hernandez", footer "Cami Hernandez", brand words (uppercased by CSS) ELEGANCIA/CALMA/EQUILIBRIO/FEMINIDAD, URL camihernandez.com, tagline unchanged, value chips Confianza TRUST ; Equilibrio BALANCE ; Enfoque FOCUS ; Calidez WARMTH | [US-006-AC4-900-es.jpg](evidence/sprint-01/US-006-AC4-900-es.jpg) |
| AC4 | 375px | EN | Pass | nav wordmark "Cami Hernandez", footer "Cami Hernandez", brand words (uppercased by CSS) ELEGANCIA/CALMA/EQUILIBRIO/FEMINIDAD, URL camihernandez.com, tagline unchanged, value chips Confianza TRUST ; Equilibrio BALANCE ; Enfoque FOCUS ; Calidez WARMTH | [US-006-AC4-375-en.jpg](evidence/sprint-01/US-006-AC4-375-en.jpg) |
| AC4 | 375px | ES | Pass | nav wordmark "Cami Hernandez", footer "Cami Hernandez", brand words (uppercased by CSS) ELEGANCIA/CALMA/EQUILIBRIO/FEMINIDAD, URL camihernandez.com, tagline unchanged, value chips Confianza TRUST ; Equilibrio BALANCE ; Enfoque FOCUS ; Calidez WARMTH | [US-006-AC4-375-es.jpg](evidence/sprint-01/US-006-AC4-375-es.jpg) |

### US-007 — Booking contact by email

| AC | Width | Lang | Result | Note | Screenshot |
|---|---|---|---|---|---|
| AC1 | 1280px | EN | Pass | button "CONNECT WITH CAMI" href=mailto:camila@lifetoolscr.com; text under button "camila@lifetoolscr.com". Headless Chromium has no mail client, so the mailto handoff itself is verified via the href only; page stayed on same URL | [US-007-AC1-1280-en.jpg](evidence/sprint-01/US-007-AC1-1280-en.jpg) |
| AC1 | 1280px | ES | Pass | button "CONECTA CON CAMI" href=mailto:camila@lifetoolscr.com; text under button "camila@lifetoolscr.com". Headless Chromium has no mail client, so the mailto handoff itself is verified via the href only; page stayed on same URL | [US-007-AC1-1280-es.jpg](evidence/sprint-01/US-007-AC1-1280-es.jpg) |
| AC1 | 900px | EN | Pass | button "CONNECT WITH CAMI" href=mailto:camila@lifetoolscr.com; text under button "camila@lifetoolscr.com". Headless Chromium has no mail client, so the mailto handoff itself is verified via the href only; page stayed on same URL | [US-007-AC1-900-en.jpg](evidence/sprint-01/US-007-AC1-900-en.jpg) |
| AC1 | 900px | ES | Pass | button "CONECTA CON CAMI" href=mailto:camila@lifetoolscr.com; text under button "camila@lifetoolscr.com". Headless Chromium has no mail client, so the mailto handoff itself is verified via the href only; page stayed on same URL | [US-007-AC1-900-es.jpg](evidence/sprint-01/US-007-AC1-900-es.jpg) |
| AC1 | 375px | EN | Pass | button "CONNECT WITH CAMI" href=mailto:camila@lifetoolscr.com; text under button "camila@lifetoolscr.com". Headless Chromium has no mail client, so the mailto handoff itself is verified via the href only; page stayed on same URL | [US-007-AC1-375-en.jpg](evidence/sprint-01/US-007-AC1-375-en.jpg) |
| AC1 | 375px | ES | Pass | button "CONECTA CON CAMI" href=mailto:camila@lifetoolscr.com; text under button "camila@lifetoolscr.com". Headless Chromium has no mail client, so the mailto handoff itself is verified via the href only; page stayed on same URL | [US-007-AC1-375-es.jpg](evidence/sprint-01/US-007-AC1-375-es.jpg) |
| AC2 | 1280px | EN | Pass | nav button "BOOK CAMI" (rendered uppercase by CSS) → url hash #contact, #contact section top at 223px from viewport top (viewport 800px; page cannot scroll further so the section is not flush with the top when it is near the page end) | [US-007-AC2-1280-en.jpg](evidence/sprint-01/US-007-AC2-1280-en.jpg) |
| AC2 | 1280px | ES | Pass | nav button "RESERVAR A CAMI" (rendered uppercase by CSS) → url hash #contact, #contact section top at 223px from viewport top (viewport 800px; page cannot scroll further so the section is not flush with the top when it is near the page end) | [US-007-AC2-1280-es.jpg](evidence/sprint-01/US-007-AC2-1280-es.jpg) |
| AC2 | 900px | EN | Pass | nav button "BOOK CAMI" (rendered uppercase by CSS) → url hash #contact, #contact section top at 223px from viewport top (viewport 800px; page cannot scroll further so the section is not flush with the top when it is near the page end) | [US-007-AC2-900-en.jpg](evidence/sprint-01/US-007-AC2-900-en.jpg) |
| AC2 | 900px | ES | Pass | nav button "RESERVAR A CAMI" (rendered uppercase by CSS) → url hash #contact, #contact section top at 223px from viewport top (viewport 800px; page cannot scroll further so the section is not flush with the top when it is near the page end) | [US-007-AC2-900-es.jpg](evidence/sprint-01/US-007-AC2-900-es.jpg) |
| AC2 | 375px | EN | Pass | nav button "BOOK CAMI" (rendered uppercase by CSS) → url hash #contact, #contact section top at 35px from viewport top (viewport 740px; page cannot scroll further so the section is not flush with the top when it is near the page end) | [US-007-AC2-375-en.jpg](evidence/sprint-01/US-007-AC2-375-en.jpg) |
| AC2 | 375px | ES | Pass | nav button "RESERVAR A CAMI" (rendered uppercase by CSS) → url hash #contact, #contact section top at 34px from viewport top (viewport 740px; page cannot scroll further so the section is not flush with the top when it is near the page end) | [US-007-AC2-375-es.jpg](evidence/sprint-01/US-007-AC2-375-es.jpg) |

### US-008 — Mobile-friendly layout

| AC | Width | Lang | Result | Note | Screenshot |
|---|---|---|---|---|---|
| AC1 | 1280px | EN | Not applicable | AC applies to viewports ≤ 640px; this run is 1280px | — |
| AC1 | 1280px | ES | Not applicable | AC applies to viewports ≤ 640px; this run is 1280px | — |
| AC1 | 900px | EN | Not applicable | AC applies to viewports ≤ 640px; this run is 900px | — |
| AC1 | 900px | ES | Not applicable | AC applies to viewports ≤ 640px; this run is 900px | — |
| AC1 | 375px | EN | Pass | hero flex-direction column, services 1 col, steps column, testimonials 1 col; hero photo 320x300, gallery 163x140 163x140 163x140 163x140 163x140, testimonial photos 46x46 36x36 36x36 36x36; horizontal overflow 0px | [US-008-AC1-375-en.jpg](evidence/sprint-01/US-008-AC1-375-en.jpg), [US-008-AC1b-375-en.jpg](evidence/sprint-01/US-008-AC1b-375-en.jpg) |
| AC1 | 375px | ES | Pass | hero flex-direction column, services 1 col, steps column, testimonials 1 col; hero photo 320x300, gallery 163x140 163x140 163x140 163x140 163x140, testimonial photos 46x46 36x36 36x36 36x36; horizontal overflow 0px | [US-008-AC1-375-es.jpg](evidence/sprint-01/US-008-AC1-375-es.jpg), [US-008-AC1b-375-es.jpg](evidence/sprint-01/US-008-AC1b-375-es.jpg) |
| AC1 (extra) | 640px | EN | Pass | Breakpoint boundary (media query is `max-width: 640px`): hero flex-direction column, services 1 col, steps column, testimonials 1 col; hero photo 320x300, gallery 295x140 295x140 295x140 295x140 295x140, testimonial photos 46x46 36x36 36x36 36x36; all images loaded; horizontal overflow 0px | [US-008-AC1-640-en.jpg](evidence/sprint-01/US-008-AC1-640-en.jpg), [US-008-AC1b-640-en.jpg](evidence/sprint-01/US-008-AC1b-640-en.jpg) |
| AC1 (extra) | 640px | ES | Pass | Breakpoint boundary (media query is `max-width: 640px`): hero flex-direction column, services 1 col, steps column, testimonials 1 col; hero photo 320x300, gallery 295x140 295x140 295x140 295x140 295x140, testimonial photos 46x46 36x36 36x36 36x36; all images loaded; horizontal overflow 0px | [US-008-AC1-640-es.jpg](evidence/sprint-01/US-008-AC1-640-es.jpg), [US-008-AC1b-640-es.jpg](evidence/sprint-01/US-008-AC1b-640-es.jpg) |
| AC2 | 1280px | EN | Not applicable | AC applies to 641–900px viewports; this run is 1280px | — |
| AC2 | 1280px | ES | Not applicable | AC applies to 641–900px viewports; this run is 1280px | — |
| AC2 | 900px | EN | Pass | services grid has 2 columns at 900px | [US-008-AC2-900-en.jpg](evidence/sprint-01/US-008-AC2-900-en.jpg) |
| AC2 | 900px | ES | Pass | services grid has 2 columns at 900px | [US-008-AC2-900-es.jpg](evidence/sprint-01/US-008-AC2-900-es.jpg) |
| AC2 | 375px | EN | Not applicable | AC applies to 641–900px viewports; this run is 375px | — |
| AC2 | 375px | ES | Not applicable | AC applies to 641–900px viewports; this run is 375px | — |

### US-009 — Site live on the production domain

| AC | Width | Lang | Result | Note | Screenshot |
|---|---|---|---|---|---|
| AC1 | — | — | Pass | Checked outcomes, not the manual upload itself (cannot be observed from here): `https://camihernandez.com/` returns HTTP 200 and serves `/assets/index-ABuFieRk.js` + `index-d6P26PaF.css`, the same bundle hashes produced by `npm run build` on `main` (cc6cf74) in this run; tags `v1.0.0` and `v1.0.1` exist and GitHub Releases `v1.0.0 — Primer release` (2026-09-04) and `v1.0.1` (2026-09-07) are published; `package.json` version is 1.0.1. Following the checklist step by step is not re-run here (it needs GoDaddy access). | — |
| AC2 | — | — | Pass | Live `index.html` and `dist/index.html` both contain `<title>Cami Hernandez — Speaker & Life Coach</title>`, `meta description`, `og:title`, `og:description` and `og:type=website`. A real link-preview render (Facebook/WhatsApp/LinkedIn debugger) was not run. Observation: there is no `og:image`, so previews will have no image; the AC does not require one. | — |
