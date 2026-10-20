# UX_UI_DIRECTION

## Metadata
- Version: 1.2 (homologated from `docs/specs/02-design-system.md` in CMP-014; v1.1 adds the events
  UI — §4, §13 — in CMP-022; v1.2: §13 form order and 24-hour times — CMP-036)
- Status: Approved by the product owner (2026-10-18, CMP-014 PR #14 merged; v1.1 Approved on
  merge of PR #22; v1.2 Approved (on merge of PR #30))
- Source: brand moodboard — *Elegance · Calm · Balance · Femininity*

## 1. Experience Goal
Visitors should feel calm, inspired and trusting, and leave knowing who Cami is, what she
offers and how to book her (PROJECT_SPEC G-001..G-003).

## 2. Visual Direction
- Tone: warm, serene, aspirational; emotional accents in Spanish.
- Brand qualities: elegance, calm, balance, femininity.
- Visual density: airy — generous padding, large rounded shapes, one idea per section.
- Accessibility considerations: navy text on cream/white backgrounds for contrast; no formal
  accessibility target defined yet (open question in
  [PROJECT_SPEC.md §16](../specs/PROJECT_SPEC.md#16-open-questions)).

### Color palette

Defined in [src/constants/colors.js](../../src/constants/colors.js) as the `C` object. **In
JSX/inline styles, all UI must read these values from `C` — do not hardcode new hex values**,
except for one-off cases (alpha overlays, gradients) that are already derived from these same
colors.

**Unavoidable exception — `global.css`:** CSS cannot import the `C` object (it is JS), so
[global.css](../../src/styles/global.css) repeats the same hex values by hand (e.g. `#f9f4f2`
in `body`, `#1e2d42` in `.cta-btn`, `#e8d4d8` in `.svc-card`). This is expected, not a bug —
but it means **if a color changes in `colors.js`, the equivalent occurrences in `global.css`
must be updated by hand** so they don't drift.

| Token | Hex | Usage |
|---|---|---|
| `C.bg` | `#f9f4f2` | General page background (warm cream) |
| `C.white` | `#ffffff` | Cards, light backgrounds |
| `C.navy` | `#1e2d42` | Primary dark color (main text, buttons, footer) |
| `C.navyMid` | `#2c3e5a` | Mid navy (hover borders, gradients) |
| `C.navyLight` | `#4a6178` | Body text, light navy |
| `C.rose` | `#c9a4ab` | "Dusty rose" accent (badges, dots, italics) |
| `C.roseLight` | `#e8d4d8` | Light rose (borders, stats bar backgrounds) |
| `C.cream` | `#f5ede8` | Intended for section alternation (`colors.js`); today used only in a gallery gradient |
| `C.textMuted` | `#8a9aaa` | Muted labels/mono text |

### Typography

Imported via the Google Fonts CDN in [global.css](../../src/styles/global.css) (line 1):

- **Outfit** (300–900) — main font for body and headings. `font-family: 'Outfit', sans-serif`.
- **Cormorant Garamond** italic (400/600/700) — emotional accents: highlighted words in
  headlines (`Live`), quotes, Spanish taglines (`Disciplina hoy, libertad mañana.`).
  `font-family: "'Cormorant Garamond', serif"`, always with `fontStyle: 'italic'`.
- **JetBrains Mono** (400/500) — technical/mono labels: image placeholders, footer URL.

## 3. Layout Principles
- Full-width sections stacked vertically; section backgrounds use `C.white`, `C.bg` or `C.navy`
  (`C.cream` is not used as a section background today).
- **Large rounded corners**: 10–20px on cards/buttons, `100px`/`50%` for pills and circles.
- Background decoration stays behind content: grain texture overlay and glow orbs (see §6).

## 4. Navigation / Page Structure
Single page, anchor navigation. Fixed section order (detail in
[ARCHITECTURE_SPEC.md §7](../specs/ARCHITECTURE_SPEC.md#7-component-boundaries)):
Events ticker → Nav → Hero → Events → Services → Gallery → Process → Values → Testimonials →
CTA → Footer. The ticker and the Events section appear only when there are upcoming events
(§13).

The nav holds the wordmark, the "Available for 2026" badge, the global EN/ES language toggle
and the "Book Cami" CTA.

## 5. Content Hierarchy
1. Hero headline + primary CTA (book).
2. Credibility: stats bar, gallery, testimonials.
3. Offer: services, process, values.
4. Final CTA with the contact email.

## 6. Component Direction
- **Grain texture overlay**: `body::before` with an SVG noise (`feTurbulence`), opacity
  0.028, fixed, z-index 200 — subtle texture over the whole site.
- **Glow orbs**: two `radial-gradient` circles, `position: fixed`, defined inline in
  [App.jsx](../../src/App.jsx), not in CSS — global background decoration, z-index 0.
- **CTA buttons** (`.cta-btn`): navy background, white text, uppercase,
  `letter-spacing: 0.14em`, `border-radius: 10px`, generous padding (`18px 56px`; the more
  compact `.cta-btn-sm` variant).
- **Service cards** (`.svc-card`), **value chips** (`.val-chip`), **step circles**
  (`.step-circle`) — hover behavior in §9.

### Implementation style (intentional mix)
The project mixes two approaches and **both are currently valid** (see
[ADR-003](../decisions/ADR-003-inline-styles-plus-global-css.md)):

1. **Inline styles** (`style={{...}}`) per component — used for layout, positioning and values
   that depend on `C` or props.
2. **Utility classes in `global.css`** — used for `:hover`, `@media`, `@keyframes` and anything
   inline CSS-in-JS cannot express (pseudo-classes, pseudo-elements).

Migrating to another approach (CSS Modules, Tailwind, styled-components, etc.) requires a new
ADR before mixing in a third pattern.

## 7. Imagery
- Real photos only, stored in `public/images/` and served as `/images/<file>.jpg` (hero,
  gallery, testimonials). Convert to JPEG and resize before adding (PROJECT_SPEC NFR-006).
- Testimonials without a photo fall back to a gradient placeholder avatar.

## 8. Responsive Behavior
Breakpoints defined in `global.css` (`@media`):

- `max-width: 900px` — service grid to 2 columns.
- `max-width: 640px` — mobile: vertical stacks, grids to 1–2 columns, smaller typography,
  smaller section padding. See classes `.hero-flex`, `.stats-grid`, `.svc-grid`,
  `.steps-flex`, `.vals-flex`, `.tests-grid`, `.gallery-grid`, `.section-pad`, `.nav-pad`.

**Watch out for `position: absolute` images inside containers with no size of their own:**
both the Hero image (`hero-img-wrap` → `hero-img-frame`) and each `.gallery-grid` cell position
their `<img>` with `position: absolute; inset: 0`, so they add no intrinsic width/height to
their container. On desktop the size comes from the parent layout (`flex-basis` in a row for
the Hero, fixed `grid-template-rows` for the Gallery), but when that layout switches at
`max-width: 640px` (column / `auto`) the container can collapse to 0 and the image disappears
even though it loads fine. That is why `.hero-img-wrap`/`.hero-img-frame` and `.gallery-grid`
set an explicit width/height inside the mobile breakpoint too — any new section using the same
pattern (absolute background image) needs the same kind of mobile override (see US-008).

## 9. Interaction Principles
- **Scroll-reveal**: fade + slide-up on entering the viewport, via the
  [useReveal](../../src/hooks/useReveal.js) hook — see
  [ARCHITECTURE_SPEC.md](../specs/ARCHITECTURE_SPEC.md#scroll-reveal-pattern-usereveal).
- **Hover states**:
  - `.svc-card` → `translateX(5px)` + `border-left` color change + shadow.
  - `.val-chip` → inverts to navy background + white text.
  - `.cta-btn` → `translateY(-3px)` + stronger shadow.
- **Language toggle**: one global control in the nav; switching updates all translatable copy
  instantly, with no reload.
- **See more / see less** on testimonials with a long version; the control appears only when
  it changes something.

## 10. Placeholder Policy
Use meaningful proposed content, not lorem ipsum. Any placeholder must be explicitly marked in
code and in [ARCHITECTURE_SPEC.md §9](../specs/ARCHITECTURE_SPEC.md#9-logical-data-architecture-content-model)
(PROJECT_SPEC BR-002). The current content state is tracked only in ARCHITECTURE_SPEC §9
("Content state").

## 11. Validation Items
- Owner sign-off on the palette and typography as the official brand system.
- Accessibility review (contrast, keyboard navigation of the toggle and "see more").

## 12. Open Questions
- Is a formal accessibility target required (see PROJECT_SPEC §16)?

## 13. Events UI
Direction for US-017..US-020 ([FEATURE_SPEC_events_registration.md](../specs/FEATURE_SPEC_events_registration.md)).
It reuses the palette, type and shapes above; no new colors or fonts.

- **Placement.** The Events section sits right after the Hero, so the ticker's items scroll to
  something near the top. Both are absent (not empty) when there are no upcoming events
  (FFR-004).
- **Ticker.** A full-width band above the nav, about 40 px tall, `C.navy` background, white
  Outfit text, items `name · date` separated by a `C.rose` dot, moving right to left at a
  calm, readable speed. It pauses on hover and focus, is static under
  `prefers-reduced-motion`, and each item is a keyboard-focusable control that scrolls to the
  event's card (US-018).
- **Section.** Kicker and headline in the style of the other sections; "Próximos eventos" /
  "Upcoming Events" from the spec. White cards with 16–20 px corners and the
  `C.roseLight` border used by `.svc-card`, in a grid of 3 columns on desktop, 2 at 900 px and
  1 at 640 px.
- **Card.** Image on top (16:9, `object-fit: cover`); the Lifetools logo, centered on
  `C.cream`, when there is no image. Then the date and time in `C.textMuted` mono, the name,
  the brief description, the price as a `C.rose` pill ("Gratis" / "Free" for ₡0), and the
  register button as `.cta-btn-sm`. A closed or sold-out event shows its status label
  ("Inscripciones cerradas" / "Registration closed", "Agotado" / "Sold out") above a disabled
  button (reduced opacity, no hover, `disabled`).
- **Form.** Opens as a modal dialog over the page (full screen at 640 px and below): focus moves
  into it, Esc and a close button dismiss it, and focus returns to the card's button, or to the
  Events section when that button is gone or disabled after a refresh. Order:
  event summary (name, date, time, price); name, email and WhatsApp fields; coupon (its check
  needs the email, FFR-012); SINPE Móvil instructions with the amount after the coupon (paid
  only); payment screenshot (paid only); privacy notice; consent; submit. The coupon comes
  before the payment part so the visitor pays the discounted amount (FEATURE_SPEC §9 steps
  5–6; owner, 2026-10-20). Labels sit above fields; errors appear under each field in the
  active language and are announced to screen readers. The confirmation replaces the form
  content and shows the reference. Times use the 24-hour format (`HH:mm`) in both languages
  (owner, 2026-10-20).
- **Placeholders.** The SINPE "placeholder / por confirmar" marker (BR-E01) and the draft
  privacy notice are visibly marked until the release gates pass (BR-002).
