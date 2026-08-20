# Flujo de creación de PRs

Este documento define cómo se crea, revisa y mergea un PR en este repo. Aplica a agentes y a
humanos por igual — el objetivo es que cualquier hilo que retome el trabajo pueda abrir un PR
consistente sin tener que preguntar cómo se hace.

## 0. Antes de abrir el PR

Correr completo [pr-precheck.md](pr-precheck.md). No se abre PR sin haberlo pasado.

## 1. Commit y push

- Rama ya debe existir como `CMP-XXX-slug` (ver [TICKETS.md](../../TICKETS.md)).
- Mensajes de commit: imperativo, corto, en español o inglés (consistente con el resto del
  repo), sin necesidad de prefijo tipo Conventional Commits salvo que el equipo lo adopte más
  adelante como spec propio.
- Push con `git push -u origin CMP-XXX-slug`.

## 2. Crear el PR con `gh`

```bash
gh pr create --title "CMP-XXX: <resumen corto>" --body "$(cat <<'EOF'
## Resumen
<Qué se hizo y por qué, 2-4 líneas. No repitas el diff, explica el "por qué".>

## Archivos
<Lista de archivos creados/modificados con una frase de qué cambió en cada uno.>

## Test
<Cómo se validó (npm run build, prueba manual en browser, N/A si no aplica y por qué).>

## Riesgos
<Qué podría romperse, qué queda pendiente, findings de /code-review que se decidió no
resolver y por qué. "Ninguno identificado" si de verdad no hay.>
EOF
)"
```

**El título siempre debe empezar con el ID del ticket** (`CMP-XXX:`) — es lo que permite
cruzar PRs con [TICKETS.md](../../TICKETS.md) sin un tracker externo.

Las 4 secciones del body (`Resumen`, `Archivos`, `Test`, `Riesgos`) son obligatorias en ese
orden. Si `Test` no aplica (ej. cambio de solo documentación), decirlo explícitamente en vez
de omitir la sección.

## 3. Pedir revisión de Copilot (modo balanced)

Después de crear el PR, se solicita revisión automática de GitHub Copilot code review en modo
**balanced** (ni el más superficial ni el más exhaustivo — balance entre ruido y cobertura).

```bash
gh pr edit <PR_NUMBER> --add-reviewer @copilot
```

El identificador correcto es `@copilot` (soportado desde GitHub CLI 2.88.0) — `Copilot` o
`copilot-pull-request-reviewer[bot]` fallan porque `gh` no los resuelve como usuario vía
GraphQL, aunque ese mismo reviewer sí es asignable a mano desde "Request review" en la UI de
GitHub. Si `gh pr edit --add-reviewer @copilot` falla igual (versión vieja de `gh`, o la app
de Copilot code review no está instalada/habilitada en el repo), pedir la review manualmente
desde la UI y avisar al usuario.

El modo de verbosidad de Copilot code review (`balanced`) se configura a nivel de
repositorio/organización en GitHub (Settings → Code review → Copilot), no vía `gh` por PR. Si
el repo todavía no tiene ese modo configurado, es un paso manual de configuración de GitHub
que hay que hacer una vez desde la UI — avisar al usuario si no hay certeza de que el modo
esté en `balanced`.

## 4. Esperar comentarios

El agente **no revisa el PR proactivamente en loop** — el usuario avisa cuando hay comentarios
de Copilot (u otros) listos para revisar. Cuando eso pase:

1. Leer cada comentario de línea.
2. Decidir: ¿se corrige, o se justifica por qué no aplica?
3. Ajustar el código si corresponde, hacer commit adicional en la misma rama.
4. Responder/resolver el hilo de comentario correspondiente en GitHub.

## 5. Criterio de merge

Un PR está listo para mergear solo si:

- **Cero comentarios de línea sin resolver** en el PR (ya sea de Copilot o de un humano).
- **Los comentarios suprimidos/descartados (`dismissed`) son ≤ 3.**

Cuando se cumple esa condición, antes de recomendar el merge se debe **enumerar cada
comentario suprimido** con una explicación corta de por qué se descartó y si de verdad no
necesita resolverse o si quedó como deuda técnica consciente (en ese caso, considerar abrir un
ticket nuevo en [TICKETS.md](../../TICKETS.md) en vez de perder el hallazgo).

Si hay más de 3 comentarios suprimidos, o queda algún comentario de línea sin resolver, el PR
**no** está listo — hay que resolver o justificar más antes de mergear.
