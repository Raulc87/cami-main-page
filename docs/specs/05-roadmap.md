# 05 — Roadmap / Backlog de Features

**Nada de lo descrito en este documento está implementado.** Es contexto de dirección para
que cualquier agente/persona entienda hacia dónde va el proyecto al tomar decisiones hoy (ej.
no cerrar puertas innecesariamente en el diseño actual). Cada ítem debe convertirse en su
propio ticket `CMP-XXX` (ver [TICKETS.md](../../TICKETS.md)) y, si cambia arquitectura, su
propio spec detallado antes de implementarse — no implementar directo desde esta lista.

## Ítems identificados

1. **Catálogo de productos/servicios** — hoy `SERVICES` en
   [data.jsx](../../src/constants/data.jsx) ya anuncia `"Catalog coming soon"` para 2 de 3
   servicios. Implica UI de listado/detalle y probablemente precios/paquetes.
2. **Cuestionario inicial de sondeo** — intake/formulario de preguntas antes de la primera
   sesión con un cliente potencial.
3. **Formulario de captura de leads** — nombre, contacto, respuestas del cuestionario →
   persistidos en una base de datos. Requiere backend (ver
   [01-tech-stack.md](01-tech-stack.md), Node.js planeado).
4. **Integraciones con Google Workspace** — alcance por definir (candidatos: Calendar para
   booking, Sheets como CRM ligero/export, Gmail para notificaciones). No decidir el alcance
   exacto aquí; definirlo en el ticket correspondiente.
5. **Analytics del sitio** — entender demografía y comportamiento de quienes visitan la
   página. Candidato obvio de bajo costo: Google Analytics 4 (gratis). Evaluar también Meta
   Pixel si el objetivo final es alimentar ads (ítem 7).
6. **Email marketing / campañas** — usar los leads capturados (ítem 3) para enviar correos de
   marketing. Evaluar herramientas con free tier (ej. Brevo, Mailchimp free tier) antes de
   comprometerse a algo pago, dado el criterio de minimizar costos del proyecto.
7. **Ads en redes sociales basados en datos demográficos** — usar la data de analytics (ítem
   5) y/o leads (ítem 3) para segmentar campañas pagas en redes sociales.

## Dependencias entre ítems

- Ítems 2 y 3 dependen de tener **backend + base de datos** (no existen hoy).
- Ítem 6 depende de ítem 3 (necesita leads capturados primero).
- Ítem 7 depende de ítems 5 y/o 3 (necesita data demográfica).
- Ítem 4 (Google Workspace) es independiente pero su alcance debería decidirse *después* de
  saber qué necesita ítem 3 (¿el formulario reemplaza o complementa booking manual?).

## Criterio de costos

Proyecto personal, sin presupuesto de licencias por ahora. Al evaluar herramientas para
cualquiera de estos ítems, priorizar:

- Free tier suficiente para el volumen actual (tráfico bajo, marca personal).
- Sin vendor lock-in fuerte si se puede evitar (ej. exportar leads fácilmente).
- Mismo criterio que se aplicó a la gestión de tickets: usar lo mínimo necesario en vez de
  adoptar herramientas pagas "porque es lo estándar" — ver [AGENTS.md](../../AGENTS.md).
