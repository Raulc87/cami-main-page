# ARCHITECTURE_SPEC

## Metadata
- Version: 1.5 (homologated in CMP-014; v1.1 adds the events backend — §5, §10–15, §18, §21,
  §22 — in CMP-021; v1.2 adds `src/api/` and the events sections to §6, §7 and §22 — CMP-022;
  v1.3: §7 ticker props, §9 events placeholders, §13 two projects — CMP-035; v1.4: §7
  scroll-reveal wrapper rule, §12 script scopes — CMP-036; v1.5: §12 full Drive scope named,
  §18 events cache — CMP-037; v1.6: §18 events wait 5 s — CMP-038)
- Status: Approved by the product owner (2026-10-18, CMP-014 PR #14 merged; v1.1 Approved on
  merge of PR #21; v1.2 Approved on merge of PR #22; v1.3 Approved on merge of PR #26; v1.4
  Approved on merge of PR #30; v1.5 Approved on merge of PR #32; v1.6 Approved (on merge of
  PR #XX))
- Owner: Raul Casanas

## 1. Purpose
Define the architectural frame of the site: folder structure, component boundaries, the two
global hooks/contexts, and where every kind of content lives.

## 2. Architectural Scope
The current static one-pager (v1.x). The future backend (US-011/US-012) is out of scope and
gets its own section/FEATURE_SPEC and ADR when it starts.

## 3. Architecture Drivers
- PROJECT_SPEC FR-001..FR-010 (sections, bilingual UI, contact CTA, metadata).
- NFR-001 static hosting, NFR-002 responsive, NFR-004 minimal stack.
- BR-001 fixed Spanish brand accents, BR-002 placeholder marking.

## 4. Architecture Principles
- One component per page section; each section owns its content imports.
- Content lives in `src/constants/`, not in components (except non-translatable brand text,
  §9).
- No external libraries for state, routing or i18n (ADR-001, ADR-004).
- One global observer for animations, one global context for language.

## 5. System Context
- Actor: visitor's browser. Loads static assets from GoDaddy (`camihernandez.com`) and fonts
  from Google Fonts.
- Outbound: `mailto:` link to the contact email.
- Events backend (since v1.1): the browser calls a Google Apps Script web app in the
  `lifetoolscr.com` Workspace ([ADR-008](../decisions/ADR-008-events-backend-google-apps-script.md))
  to list events, check coupons and register. The script reads/writes Google Sheets and Drive,
  runs Drive OCR, sends email (Gmail) and translates event text (`LanguageApp`). The interface
  is [EVENTS_API_CONTRACT.md](EVENTS_API_CONTRACT.md).

## 6. High-Level Architecture

```
apps-script/      # events backend (Google Apps Script web app, ADR-008) — deployed by the owner
public/
  images/         # real photos (hero, gallery, testimonials) — served as /images/file.jpg
src/
  api/            # events.js — client for the events backend (EVENTS_API_CONTRACT)
  components/     # one component per page section (+ Events, EventsTicker, EventRegistration)
  constants/      # data.jsx (list content), i18n.js (UI_TEXT) and colors.js (palette) — see §9 and UX_UI_DIRECTION
  context/        # LanguageContext.jsx — global language state (see §7)
  hooks/          # useReveal.js — scroll-reveal; useEvents.js — events data
  styles/         # global.css — reset, fonts, animations, hover, responsive
  App.jsx         # page composition
  main.jsx        # React entry point
index.html        # SEO/social metadata
```

## 7. Component Boundaries

[App.jsx](../../src/App.jsx) renders the sections in this fixed order (all receive the `r`
prop from the `useReveal` hook, except `Nav` and `Footer`, which don't because they have no
scroll-reveal animation — `Nav` is still dynamic via `LanguageContext`, see below — and
`EventsTicker` and `Events`, which mount only after the `events` request resolves, after
`useReveal` has looked for `[data-rid]` elements, so they render without scroll-reveal):

1. `EventsTicker` — moving banner with the closest events (US-018); not rendered when there are
   no upcoming events or the backend is unavailable.
2. `Nav` — logo, "Available for 2026" badge, language toggle, "Book Cami" CTA.
3. `Hero` — headline, sub, CTA, photo, stats bar.
4. `Events` — upcoming-event cards (US-017); mounts `EventRegistration` for the selected
   event (US-019/US-020); not rendered under the same conditions as the ticker.
5. `Services` — 3 service cards (`SERVICES`).
6. `Gallery` — grid of 5 slots with real photos.
7. `Process` — 3 steps (`STEPS`).
8. `Values` — 4 value chips (`VALUES`).
9. `Testimonials` — 4 testimonials (`TESTIMONIALS`).
10. `CTA` — final call to action.
11. `Footer` — wordmark, brand words, URL.

Each component owns its section: it imports what it needs from `constants/` and receives no
content props from `App.jsx` (only `r`). **Exception (events):** `App.jsx` calls `useEvents()`
once and passes `events` to `EventsTicker` and `events` and `sinpe` to `Events` (the ticker
does not need the SINPE data), so the page makes one `events` request. That data comes from the
backend at runtime, not from `constants/`.

### Global language (`LanguageContext`)

[src/context/LanguageContext.jsx](../../src/context/LanguageContext.jsx) exposes a
`LanguageProvider` (native React Context, no external library — see
[ADR-004](../decisions/ADR-004-i18n-native-context.md)) that wraps `<App />` in
[main.jsx](../../src/main.jsx). Any component reads the current language with the
`useLanguage()` hook:

```js
const { lang, setLang, toggleLang } = useLanguage()   // lang: 'en' | 'es'
```

- **Default**: if a value is stored in `localStorage` (`cmp-lang`) it is used; otherwise
  `navigator.language` — starts in `'es'` if it begins with `es`, otherwise `'en'`.
- **Persistence**: every change of `lang` is saved to `localStorage` and reflected in
  `document.documentElement.lang`.
- **Toggle**: lives in [Nav.jsx](../../src/components/Nav.jsx), next to the "Book Cami" CTA —
  it is the only language control on the whole page (it replaced the switch that in CMP-002
  lived only inside `Testimonials.jsx` for one testimonial).
- Translatable components combine `lang` with `UI_TEXT` from
  [constants/i18n.js](../../src/constants/i18n.js) (UI copy) or with the `*Es` fields in
  `constants/data.jsx` (list content) — see §9.
- Sibling pattern to `useReveal`: a simple hook, no external dependencies, no routing.

### Scroll-reveal pattern (`useReveal`)

[src/hooks/useReveal.js](../../src/hooks/useReveal.js) creates **a single**
`IntersectionObserver` for the whole page (not one per component). Usage:

```js
const r = useReveal()          // in App.jsx, once
<div {...r('unique-id', delayMs)}>...</div>   // in any child component
```

Rules:

- The `r` prop is passed down from `App.jsx` to every section that needs it.
- The `id` passed to `r(id, delay)` (via `data-rid`) **must be unique across the whole page**,
  not just within the component — the observer is global.
- `delay` is optional, in milliseconds, to stagger animations within a section.
- An element with its own `:hover` transform (e.g. `.svc-card`) gets `r()` on a wrapper, not on
  itself: the inline reveal transform would override the hover rule (CMP-031, US-002 AC2).

### Styles
See [UX_UI_DIRECTION.md](../ux/UX_UI_DIRECTION.md) — inline styles + classes in `global.css`.
There are no CSS Modules or automatic scoping; class names must be kept unique by hand (e.g.
`.hero-flex`, `.svc-card`, `.step-circle`).

## 8. Technology Decisions
See [TECH_STACK.md](../../TECH_STACK.md) and ADR-001..ADR-004 in
[docs/decisions/](../decisions/).

## 9. Logical Data Architecture (Content Model)

### General rule

**Repeated/structured content (lists) lives in
[src/constants/data.jsx](../../src/constants/data.jsx).** Services, process steps, values,
testimonials and stats are edited there — no component needs to change to edit those texts.

**Translatable UI copy (headlines, kickers, CTA, badges, nav labels) lives in
[src/constants/i18n.js](../../src/constants/i18n.js)** as `UI_TEXT` — an object nested by
section with `{ en, es }` pairs (e.g. `UI_TEXT.hero.h1a.en` / `.es`). This file is the source
of truth for all copy that changes with the global language toggle (see §7). Components read
`lang` from `useLanguage()` and select `UI_TEXT.<section>.<key>[lang]`.

**What is still not centralized (and is not a candidate for `i18n.js`):** text that does
**not** change with the language — proper names (the "Cami Hernandez" wordmark), the contact
email, and the **fixed Spanish brand accents** (the Hero tagline "Disciplina hoy, libertad
mañana.", the quote over the hero photo, the Footer `WORDS`) — these are intentional Spanish
flourishes regardless of the toggle (PROJECT_SPEC BR-001, BR-004, BR-005). They remain
**hardcoded inline** in their component. To change that text, edit the component directly:

- "Cami Hernandez" wordmark → [Nav.jsx](../../src/components/Nav.jsx) and
  [Footer.jsx](../../src/components/Footer.jsx) (same text in both, hardcoded separately — not
  translated, it's the brand name).
- Fixed Spanish hero tagline ("Disciplina hoy, libertad mañana.") and the photo quote ("Tu
  mejor versión empieza aquí.") → [Hero.jsx](../../src/components/Hero.jsx).
- Contact email → [CTA.jsx](../../src/components/CTA.jsx).
- Brand words (`WORDS`) and URL → [Footer.jsx](../../src/components/Footer.jsx).

Everything else that used to be on this list (hero headline/sub, badges, CTA copy, section
kickers/headings) **is no longer hardcoded inline** — it moved to `UI_TEXT` in
[src/constants/i18n.js](../../src/constants/i18n.js).

If a future task migrates this copy to `data.jsx`, update this section.

Brand colors live separately in [src/constants/colors.js](../../src/constants/colors.js) (see
[UX_UI_DIRECTION.md](../ux/UX_UI_DIRECTION.md)).

SEO/social metadata (`title`, `description`, `og:*`) lives in [index.html](../../index.html),
not in `data.jsx`.

### `data.jsx` exports

#### `SERVICES` (array, 3 items)

Used by [Services.jsx](../../src/components/Services.jsx).

```js
{ label, labelEs, title, titleEs, desc, descEs, note, noteEs, icon }
```
- `label`: uppercase kicker (e.g. `MOTIVATIONAL SPEAKING`).
- `icon`: JSX of an inline `<svg>` (no separate image files).
- `note`: availability status — currently 1 says `Booking available`, 2 say
  `Catalog coming soon` (relevant to US-010, service catalog).
- Each field has its `*Es` pair (`labelEs`, `titleEs`, `descEs`, `noteEs`) for the global
  language toggle.

#### `STEPS` (array, 3 items)

Used by [Process.jsx](../../src/components/Process.jsx). 3-step process:
`Discover → Transform → Thrive`. `{ num, title, titleEs, desc, descEs, featured? }` —
`featured: true` on the middle step (Transform) gives it a highlighted style. `num` (`'01'`,
`'02'`, `'03'`) is not translated.

#### `VALUES` (array, 4 items)

Used by [Values.jsx](../../src/components/Values.jsx). Each value has a Spanish and an English
name: `{ es, en, icon }` — e.g. `Confianza` / `Trust`.

#### `TESTIMONIALS` (array, 4 items)

Used by [Testimonials.jsx](../../src/components/Testimonials.jsx). `{ quote, quoteEs, name,
role?, featured?, image?, quoteLong?, quoteLongEs? }` — the first (`featured: true`) is shown
highlighted/larger, the other 3 in the 3-column grid. All 4 items have `quote`/`quoteEs`
(language controlled by the global toggle, see §7); `name` is not translated. `role` is
optional — if absent (some real testimonials have no role/title), that line is not rendered
instead of leaving an empty gap.

- `image` (optional): path to a real photo in `/images/`. If absent, a gradient placeholder
  avatar is shown. Applies to both the featured testimonial and the grid ones.
- `quoteLong`/`quoteLongEs` (optional, on **any** testimonial, featured or grid): long version
  shown when clicking the "see more"/"ver más" link — each grid testimonial has its own
  expanded state, independent of the rest. In Spanish, if `quoteLongEs` is missing it falls
  back to `quoteLong` (English) instead of showing nothing; in English there is no cross
  fallback (it would make no sense to show Spanish text under an English link). The
  button/link only renders when a long version is available for the active language
  (considering that fallback) — a control that changes nothing on click is never shown. The
  resolution logic lives in the `resolveQuote(item, isEs, expanded)` helper inside
  `Testimonials.jsx`, shared between the featured one and the grid.

**All 4 testimonials are real content** (Ana Lucía, Melissa, Rocío, Stefanny), with photo and
bilingual copy extracted/translated from client-provided documents — no fictional testimonial
remains (PROJECT_SPEC BR-003). Only Ana Lucía (featured) and Stefanny have
`quoteLong`/`quoteLongEs`; Melissa and Rocío have only the short version because the original
testimonial didn't include a separate long version.

#### `STATS` (array, 4 items)

Used by [Hero.jsx](../../src/components/Hero.jsx) in the stats bar. `{ num, label, labelEs }`
— e.g. `100` / `Lives Transformed` / `Vidas Transformadas`. `num` is not translated.

#### `GALLERY_SLOTS` (array, 5 items)

**⚠ Currently unused.** [Gallery.jsx](../../src/components/Gallery.jsx) defines its own local
`SLOTS` array (with a different shape: `{ label, labelEs, bg, tall, image? }` — `labelEs` is
the Spanish text shown by the global toggle; `bg` built from the `C` tokens instead of a raw
CSS string; `image` is optional — path to a real photo in `/images/`, same field name as
`TESTIMONIALS.image`) instead of importing `GALLERY_SLOTS` from here. Editing `GALLERY_SLOTS`
in `data.jsx` **has no effect** on what renders — it is dead code. To make the gallery editable
from `data.jsx` like the other sections, migrate `Gallery.jsx` to consume this export (or
delete the export if it's not worth it). Treat as pending tech debt, not as something already
wired.

### Content state
Real today: hero photo, all 5 gallery photos, all 4 testimonials, stats (CMP-011). Still
pending: two of three services say `Catalog coming soon`. Do not assume any other data is real
when building new features on top of it (PROJECT_SPEC BR-002).

Events placeholders (CMP-029 on; each is a release gate in
[release-checklist.md §3b](../process/release-checklist.md#3b-events-feature-release-gates-feature_spec_events_registration-br-e11)):
- `public/images/lifetools-logo.svg` — marked placeholder until Cami provides the Lifetools logo.
- SINPE Móvil number and account name — placeholders in script properties (`isPlaceholder`,
  BR-E01) until Cami confirms them; never in the repo.
- Privacy notice — the generic draft in
  [EVENTS_EMAILS_AND_PRIVACY.md](../ux/EVENTS_EMAILS_AND_PRIVACY.md) §3 until the lawyer review.
- Participant email templates (confirmation, registration received, payment not validated) —
  drafts in [EVENTS_EMAILS_AND_PRIVACY.md](../ux/EVENTS_EMAILS_AND_PRIVACY.md) §1–§2, used by the
  backend from CMP-028, until Cami approves them (BR-E11, US-025 AC4).

### When adding new content

If a new feature needs data that doesn't exist as a structure today (e.g. a product catalog
with prices, a questionnaire with dynamic questions), **don't force it into `data.jsx`** as if
it were static copy — that file is for the current landing's marketing content. Data coming
from a form, backend or database (leads, questionnaire answers) belongs to the layer defined in
that feature's FEATURE_SPEC/architecture section (see US-011, US-012), not to
`src/constants/`.

## 10. Interfaces and Integrations
- `mailto:` contact link (CTA, nav).
- Google Fonts CDN (`@import` in `global.css`).
- Events backend: [EVENTS_API_CONTRACT.md](EVENTS_API_CONTRACT.md) (locked before parallel
  work).

## 11. Authentication and Authorization
- Visitors: anonymous. The backend endpoint is anonymous too and runs as the Workspace account
  that owns it; only Cami and the owner can open the spreadsheet and Drive folder.

## 12. Security
- The site processes user input only in the events form; every field is re-validated on the
  backend, user text is written to Sheets as literal text (no formulas), file types are
  detected from content, and abuse is limited globally (FEATURE_SPEC_events_registration §12).
- No secrets in the repo or the client bundle; backend configuration in script properties.
- The script runs as the owning Workspace account behind an anonymous endpoint, so each scope it
  holds is exposed if it is misused: the OAuth scopes are those in `apps-script/appsscript.json` (`oauthScopes`). Besides Sheets,
  Drive (full access to the owning account's files, needed to create folders and files and run
  OCR), Docs, external requests and sending mail, the script holds a Gmail settings scope so it
  can send as `no-reply@lifetoolscr.com` (owner, 2026-10-20); that scope lets it read and change
  the owning account's Gmail settings. The spike's alias test confirmed `gmail.settings.basic` is
  enough (2026-10-20); any scope broader than the one the owner accepted (e.g. full mailbox
  `https://mail.google.com/`) goes back to the owner before it is deployed.

## 13. Deployment and Environments
- Local: `npm run dev` (port 5173). Production: `dist/` uploaded to GoDaddy `public_html/`.
  See [TECH_STACK.md](../../TECH_STACK.md) and
  [release-checklist.md](../process/release-checklist.md).
- Events backend: two standalone Apps Script projects, **staging** (staging spreadsheet and
  folder) and **production**, each with one web-app deployment (ADR-008); the site build points
  to one through `VITE_EVENTS_API_URL`. Deployed by the owner per the deploy runbook.

## 14. Configuration and Secrets
- Frontend: `VITE_EVENTS_API_URL` (build time, public).
- Backend: script properties (contract §9); no secrets in Git.
- Versioned config: `vite.config.js` (build-time: React plugin, production `outDir`) and
  `.claude/settings.json` (agent model default).

## 15. Observability
- Events backend: `Metrics` tab and alert emails (FFR-029). Site analytics: none (US-014).

## 16. Performance
- Single global `IntersectionObserver`; resized JPEG images; no runtime dependencies beyond
  React.

## 17. Scalability
- Static files; scales with the host. Not a concern at current traffic.

## 18. Resilience
- No runtime dependencies other than the static host and Google Fonts (text falls back to
  system fonts if the CDN fails), and the events backend: if it is slow (> 5 s) or down, the
  events section and ticker are hidden and the rest of the page is unaffected.
- The `events` response is cached and refreshed every 5 minutes by a time-driven trigger, so it
  answers well within 5 s (FFR-033). A registration that changes availability rebuilds it
  rather than clearing it, so no visitor gets a cold request.

## 19. Compatibility / Migration
- `localStorage` access must keep working if storage is unavailable (language falls back to
  `navigator.language`).

## 20. Risks
- Global class names and global `data-rid` ids can collide — keep them unique by hand.
- `GALLERY_SLOTS` dead code can mislead contributors (§9).
- Palette duplicated in `global.css` (see UX_UI_DIRECTION).

## 21. Related ADRs
- [ADR-001](../decisions/ADR-001-minimal-static-react-stack.md) — minimal static React stack
- [ADR-002](../decisions/ADR-002-godaddy-static-hosting.md) — GoDaddy static hosting
- [ADR-003](../decisions/ADR-003-inline-styles-plus-global-css.md) — inline styles + global.css
- [ADR-004](../decisions/ADR-004-i18n-native-context.md) — i18n with native React Context
- [ADR-008](../decisions/ADR-008-events-backend-google-apps-script.md) — events backend on Google
  Apps Script

## 22. Feature-to-Component Impact

| Story | Components / files |
|---|---|
| US-001 Hero & stats | `Hero.jsx`, `STATS`, `UI_TEXT.hero` |
| US-002 Services | `Services.jsx`, `SERVICES` |
| US-003 Gallery | `Gallery.jsx` (`SLOTS`), `public/images/` |
| US-004 Process & values | `Process.jsx`, `Values.jsx`, `STEPS`, `VALUES` |
| US-005 Testimonials | `Testimonials.jsx`, `TESTIMONIALS`, `public/images/` |
| US-006 Language toggle | `LanguageContext.jsx`, `Nav.jsx`, `i18n.js`, `*Es` fields |
| US-007 Booking contact | `CTA.jsx`, `Nav.jsx` |
| US-008 Mobile layout | `global.css` breakpoints |
| US-009 Production deploy | `package.json` version, `dist/`, release checklist |
| US-017 Events section | new `Events.jsx`, `useEvents.js`, `UI_TEXT.events`, `App.jsx` |
| US-018 Ticker | new `EventsTicker.jsx`, `global.css` (animation, reduced motion) |
| US-019/US-020 Form, coupon | new `EventRegistration.jsx`, `UI_TEXT.events.form`, `src/api/events.js` |
| US-021..US-025 Backend | `apps-script/` (web app), events spreadsheet, Drive folder |
