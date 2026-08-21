# Política de modelos y ahorro de tokens

Este documento define **con qué modelo se corre cada tipo de trabajo en este repo** y qué
prácticas seguir para que el desarrollo asistido no cueste más de lo que vale. Aplica a agentes
y a humanos que dirigen agentes.

Es el equivalente, para el costo del desarrollo, de la regla que [AGENTS.md](../../AGENTS.md) ya
tiene para el producto ("prioriza costo cero / free tier"): este es un proyecto personal sin
presupuesto, y mandar todo al modelo más caro es el desperdicio más grande y más fácil de evitar.

**El criterio no es la dificultad percibida de la tarea, sino el costo de equivocarse.** Un
cambio de una línea en un spec que otros hilos van a tratar como fuente de verdad merece más
modelo que un refactor de 200 líneas en un componente aislado.

## 1. Los tres modelos

| Modelo | ID | Input $/MTok | Output $/MTok | Para qué |
|---|---|---|---|---|
| Claude Opus | `claude-opus-5` | $5.00 | $25.00 | Razonamiento profundo antes de actuar: planificar, diseñar, decidir |
| Claude Sonnet | `claude-sonnet-5` | $3.00 | $15.00 | El caballo de batalla: implementar, debuggear, revisar |
| Claude Haiku | `claude-haiku-4-5` | $1.00 | $5.00 | Lo rápido y acotado: edits puntuales, lectura, chequeos mecánicos |

**Precios verificados: 2026-08-21.** Son **referencia, no contrato** — el catálogo y los precios
cambian. Si esta tabla tiene más de unos meses, verifícala antes de apoyar una decisión en las
cifras exactas; la relación entre modelos (Haiku ≈ 5x más barato que Opus, Sonnet ≈ 1.7x más
barato que Opus) es más estable que los números absolutos.

Ojo con esa relación: la brecha real entre Opus y Sonnet es **menor** de lo que suele asumirse.
Por eso el criterio para escalar a Opus se apoya en el riesgo del error, no en la idea de que
Sonnet sea "varias veces" más barato.

## 2. Tarea → modelo, en este repo

| Tarea | Modelo | Por qué |
|---|---|---|
| Planificar un ticket nuevo, sobre todo si toca un spec | Opus | Decidir qué spec cambia y cómo es una decisión cara de revertir |
| Diseñar algo del [roadmap](../specs/05-roadmap.md) (backend, leads, integraciones) | Opus | No hay spec todavía: se está creando la fuente de verdad |
| Refactor que cruza `src/components/`, `src/constants/` y specs | Opus | Muchas interdependencias, más specs que sincronizar |
| Implementar una feature ya especificada | Sonnet | El spec ya resolvió las decisiones difíciles |
| Debug de comportamiento en el browser | Sonnet | Necesita contexto, no planificación |
| Agregar copy a `UI_TEXT` (`src/constants/i18n.js`) o a `src/constants/data.jsx` | Haiku | Archivo conocido, patrón establecido — ver [03-content-model.md](../specs/03-content-model.md) |
| Ajustes de estilo dentro de la paleta de `src/constants/colors.js` | Haiku | Bien definido por [02-design-system.md](../specs/02-design-system.md) |
| Preguntas de exploración ("¿dónde vive X?", "¿qué componente usa Y?") | Haiku | Lectura, no escritura |
| Correr el build, revisar `git status`, verificar links | Haiku | Chequeo mecánico |
| `/code-review` antes del PR | Depende | Ver §5 |

## 3. Si estás planificando un ticket

Todo agente que planifique un ticket **debe pronunciarse sobre el modelo**. No dejarlo implícito.

1. **Declara el modelo de la planificación misma**, en la primera línea del plan:
   `Modelo de planificación: Opus — se está decidiendo qué specs cambian.` Si el ticket es
   trivial, decirlo también: `Modelo de planificación: Haiku — un archivo, patrón conocido.`

2. **Anota el modelo por paso.** Un ticket casi nunca es homogéneo. El plan lleva una columna
   `Modelo` en la lista de pasos:

   | # | Paso | Modelo | Por qué |
   |---|---|---|---|
   | 1 | Registrar `CMP-XXX` en [TICKETS.md](../../TICKETS.md) | Haiku | Una fila en una tabla, formato conocido |
   | 2 | Escribir el spec nuevo | Opus | Está definiendo criterio que otros van a seguir |
   | 3 | Enganchar los links en `AGENTS.md` | Sonnet | Edits chicos en el entry point que todos leen |
   | 4 | Verificar links y correr el precheck | Haiku | Chequeo mecánico |

3. **Ordena los pasos para que un solo cambio de modelo alcance:** lo caro al principio, lo
   barato después. Un plan que alterna Opus → Haiku → Opus → Haiku está mal ordenado.

4. **Cierra el plan con un veredicto explícito, y dilo en prosa al usuario**, no solo dentro del
   archivo del plan:
   - Si un solo modelo alcanza: *"Recomendación: corre todo el ticket en Sonnet."*
   - Si es heterogéneo: *"Planifiqué en Opus. Para ejecutar, cambia a Sonnet con `/model sonnet`;
     los pasos 1 y 4 los delego a subagentes en Haiku."*

### Qué puede y qué no puede hacer el agente

- **No puede cambiar el modelo de su propia sesión.** `/model` es una acción del usuario. Un
  agente que anuncia "cambio a Sonnet" y sigue corriendo en Opus está informando mal — tiene que
  **pedir** el cambio, no simularlo.
- **Sí puede delegar a un modelo más barato** lanzando subagentes con override de modelo. Ahí el
  ahorro es real y automático, sin que el usuario toque nada. Regla práctica: si un paso es
  mecánico y bien definido (buscar dónde vive algo, leer y resumir, aplicar un patrón ya conocido
  en varios archivos), va a un subagente en Haiku o Sonnet en vez de gastarse en el modelo caro
  de la sesión principal.
- **Sí puede reordenar el trabajo** para agrupar lo caro y minimizar los cambios de modelo.

## 4. Higiene de contexto — donde está el ahorro grande

Elegir bien el modelo ayuda, pero **el contexto inflado cuesta más**: cada turno reenvía todo el
historial, así que un contexto sucio se paga en cada mensaje, no una sola vez.

- **Una sesión por ticket.** No arrastrar el contexto de un ticket dentro del siguiente.
- **Lee el spec que aplica, no los seis.** La tabla de [AGENTS.md](../../AGENTS.md) existe
  justamente para usarla como índice en vez de leer `docs/specs/` completo.
- **Planifica en Opus, ejecuta en Sonnet.** El razonamiento caro se paga una vez, no en cada edit.
- **Usa subagentes para búsquedas amplias.** Un subagente devuelve la conclusión sin volcar cada
  archivo que leyó en el contexto principal.
- **Lee rangos, no archivos enteros**, cuando ya sabes qué parte importa.
- **Sesión nueva (o compactar) cuando el trabajo pasa a otra fase.** El contexto de la fase
  anterior ya no aporta y se sigue pagando.
- **No le pidas a un modelo caro que corra el build o lea `git status`.** Eso es trabajo de Haiku.

## 5. Ganchos con el flujo de PR

- **Copilot antes que un modelo caro.** La review automática de Copilot ya está en el flujo
  ([pr-workflow.md](pr-workflow.md) §3) y no consume tokens del proyecto. No corras una segunda
  pasada en Opus "por si acaso" si Copilot ya cubrió el diff.
- **Nivel y modelo de `/code-review`** según el riesgo del cambio — se suma a lo que
  [pr-precheck.md](pr-precheck.md) §5 ya dice sobre `medium` vs `high`:

  | Tipo de cambio | Modelo | Nivel |
  |---|---|---|
  | Solo documentación o copy | Haiku, o dejarlo directamente a Copilot | `low` |
  | UI/componentes acotado | Sonnet | `medium` (el default) |
  | Formularios, datos de leads, integraciones externas | Opus | `high` |

- **Responder comentarios de Copilot** es trabajo de Sonnet — o de Haiku si el comentario es de
  formato o naming. Escala a Opus solo si el comentario cuestiona una decisión de diseño.

## 6. Cuándo escalar a mitad de tarea

Escalar es más barato que arreglar el desastre de un modelo que se quedó corto. Señales claras
de que hay que subir de tier:

- Dos intentos fallidos seguidos con el mismo enfoque.
- Aparecen dependencias entre archivos que el plan no anticipó.
- Hay que modificar un spec que no estaba en el alcance del ticket.

Cuando pase, dilo explícitamente y pide el cambio de modelo — no sigas empujando en silencio.

## 7. Cuándo esta política no aplica

Si el usuario pide explícitamente un modelo, **gana el usuario**. Este documento es el default
razonable, no una restricción.
