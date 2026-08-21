# Tickets — CMP

Registro secuencial de trabajo del proyecto **cami-main-page**. Todavía no usamos un sistema
externo (Jira, Linear, etc.) — este archivo es la **fuente de verdad** para la numeración de
tickets mientras el proyecto sea de un solo desarrollador. Cuando el costo se justifique
(más gente, necesidad de reportes/automatización), se puede migrar a Linear (tiene free tier)
importando estas mismas filas.

## Cómo usar esto

1. Antes de empezar algo nuevo, revisa la tabla de abajo y toma el siguiente número disponible
   (el más alto + 1). No reutilices ni "reserves" números.
2. Crea la rama como `CMP-XXX-slug-corto` (inglés o español, lo que describa mejor el trabajo).
3. Agrega la fila a la tabla en el mismo commit donde arrancas el trabajo, para minimizar
   colisiones si en algún momento hay más de un hilo/agente trabajando en paralelo.
4. Actualiza el estado a medida que avanzas. Cuando el PR se mergea, estado = `done`.

**Estados:** `todo` · `in-progress` · `review` · `done` · `dropped`

## Tickets

| ID | Título | Estado | Rama | Fecha | Notas |
|----|--------|--------|------|-------|-------|
| CMP-001 | Fundación de Spec Driven Development (specs + AGENTS.md + este ticket log) | review | `CMP-001-sdd-foundation` | 2026-08-20 | Crea `docs/specs/`, `docs/process/` (pr-precheck, pr-workflow), `AGENTS.md` y este archivo. |
| CMP-002 | Fotos reales (Hero/Gallery) + primer testimonio real con toggle de idioma | review | `claude/cmp-testimonios-images-lang-toggle-4dca1a` | 2026-08-20 | Reemplaza 2 placeholders de foto, agrega testimonio real de Ana Lu con toggle Spanish/English y link see more/see less. Rama no sigue el patrón `CMP-XXX-slug` porque la asigna el harness del agente (worktree); ver PR. |
| CMP-003 | Toggle de idioma global en el banner (reemplaza el toggle por testimonio de CMP-002) | done | `claude/cmp-global-language-banner-5da139` | 2026-08-20 | Mueve el switch EN/ES de `Testimonials.jsx` al `Nav`; agrega `LanguageContext` + `useLanguage()`, `constants/i18n.js` (`UI_TEXT`) y traducciones para toda la página. Rama asignada por el harness del agente (worktree); ver PR. |
| CMP-004 | README del repo | review | `CMP-004-readme` | 2026-08-21 | Crea `README.md` en la raíz: qué es el proyecto, cómo correrlo localmente, scripts, deploy, y puntero a `AGENTS.md`/`docs/specs/` como fuente de verdad. |
| CMP-005 | Política de modelos y ahorro de tokens en desarrollo | review | `CMP-004-model-cost-policy` | 2026-08-21 | Crea `docs/process/model-cost-policy.md`; engancha la elección de modelo en `AGENTS.md` y `pr-precheck.md`. Solo documentación. La rama dice `CMP-004` porque se creó antes de que PR #4 mergeara y tomara ese número; se renumeró a CMP-005 al resolver la colisión, y la rama se dejó igual para no romper el PR ya abierto. |
| CMP-006 | Versiona `.claude/settings.json` con Sonnet como default del proyecto | review | `claude/settings-sonnet-default-e1fb14` | 2026-08-21 | Crea `.claude/settings.json` (model: sonnet) y subagentes baratos en `.claude/agents/` para delegar chequeos mecánicos y exploración a Haiku; agrega `.claude/worktrees/` a `.gitignore`; documenta en `model-cost-policy.md`. Rama asignada por el harness del agente (worktree), no sigue el patrón `CMP-XXX-slug`. |
