# PR Precheck

Checklist que cualquier agente (o persona) debe correr **antes de abrir un PR**, sin
excepción. El objetivo es que los problemas obvios se atrapen antes de pedirle revisión a
Copilot o al usuario, no después.

## 1. Alcance

- [ ] El diff corresponde a **un solo ticket** (`CMP-XXX`). Si aparece trabajo de otro ticket
      mezclado, sepáralo.
- [ ] No hay archivos de scratch, debug, o temporales colados (`*.log`, prints de debug,
      archivos sueltos de prueba).
- [ ] `git status` revisado — nada inesperado quedó sin trackear ni se agregó sin querer con un
      `git add` amplio.

## 2. Specs actualizados

- [ ] Si el cambio toca paleta, tipografía o patrones visuales →
      [docs/specs/02-design-system.md](../specs/02-design-system.md) actualizado.
- [ ] Si el cambio toca estructura de contenido/copy →
      [docs/specs/03-content-model.md](../specs/03-content-model.md) actualizado.
- [ ] Si el cambio toca estructura de componentes, carpetas o el stack →
      [docs/specs/04-architecture.md](../specs/04-architecture.md) o
      [docs/specs/01-tech-stack.md](../specs/01-tech-stack.md) actualizado.
- [ ] Si el cambio construye algo descrito en el roadmap →
      [docs/specs/05-roadmap.md](../specs/05-roadmap.md) refleja que ese ítem ya no es backlog.
- [ ] La fila del ticket en [TICKETS.md](../../TICKETS.md) tiene el estado correcto.

Un spec desactualizado es un bug tan real como uno de código — no lo dejes para "después".

## 3. Build y correctitud

- [ ] `npm run build` corre sin errores.
- [ ] Si el cambio es de UI: se probó en el browser (dev server), no solo se asumió que
      compila. Revisar el golden path y, si aplica, algún edge case obvio (mobile breakpoint,
      estado vacío, etc.).
- [ ] Sin console errors/warnings nuevos en el navegador.
- [ ] No se introdujeron dependencias/librerías nuevas sin que quede documentado en
      [docs/specs/01-tech-stack.md](../specs/01-tech-stack.md) (ver regla en
      [AGENTS.md](../../AGENTS.md)).

## 4. Seguridad / higiene

- [ ] Nada de secretos, tokens o credenciales en el diff (revisar contenido real de cualquier
      archivo nuevo, no solo el nombre).
- [ ] Sin `console.log` de debug olvidados, sin código comentado "por si acaso".

## 5. Auto-revisión de código

- [ ] Correr **`/code-review`** sobre el diff antes de abrir el PR (nivel `medium` como
      default; usar `high` si el cambio toca algo sensible — formularios, datos de leads,
      integraciones externas cuando existan). Resolver o justificar cada finding antes de
      continuar.
- [ ] Si `/code-review` marca algo que se decide **no** resolver, dejar la justificación en la
      descripción del PR (sección "Riesgos" — ver
      [pr-workflow.md](pr-workflow.md)), no en silencio.

## 6. Listo para abrir el PR

Solo cuando todo lo anterior está en verde, se sigue el flujo de
[pr-workflow.md](pr-workflow.md) para crear el PR.
