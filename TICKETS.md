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
