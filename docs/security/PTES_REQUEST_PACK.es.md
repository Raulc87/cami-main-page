# PTES_REQUEST_PACK (español)

Copia en español de [`PTES_REQUEST_PACK.md`](PTES_REQUEST_PACK.md) para testers locales. Si hay
diferencias, manda la versión en inglés. El dueño envía esta página, sin cambios, a cada tester
que contacte, junto con el plan al que remite ([`PENTEST_PLAN.md`](PENTEST_PLAN.md), en inglés, que
contiene el alcance, las reglas de participación y el formulario de autorización en su Apéndice A).
La lista de pasos del dueño para el entorno de pruebas no se envía
([`PTES_STAGING_SETUP.md`](PTES_STAGING_SETUP.md)).

Nada de esta página es privado: no hay direcciones, identificadores, contactos ni datos
personales. El tester los recibe por separado, después de firmar la autorización (sección 5).

## 1. La solicitud

Raul Casanas, dueño de `camihernandez.com`, solicita una **prueba de penetración según el
Penetration Testing Execution Standard (PTES)** de:

- el sitio web `https://camihernandez.com` (un sitio estático en React, en hosting compartido), y
- su backend de registro a eventos, una aplicación web de Google Apps Script con tres acciones:
  `events` (GET), `coupon` y `register` (POST), en dos copias: **producción** y **pruebas
  (staging)**.

El sistema no tiene cuentas de usuario. Maneja datos personales (nombre, correo, número de
WhatsApp, consentimiento) y capturas de comprobantes de pago (SINPE Móvil), y envía correos. El
código, los documentos de diseño y la línea base de seguridad son públicos en el repositorio de
GitHub `Raulc87/cami-main-page`.

Qué probar, cómo y qué queda fuera: [`PENTEST_PLAN.md`](PENTEST_PLAN.md) §1 (alcance y reglas de
participación), §3 (activos y amenazas), §4 (métodos y nivel objetivo: OWASP ASVS 5.0.0 nivel 2).
Léalo antes de cotizar.

## 2. Fechas

| Elemento | Fecha |
|---|---|
| Fecha límite: la prueba debe haberse realizado | **2026-12-26** (zona horaria `America/Costa_Rica`, UTC-6, sin horario de verano) |
| Ventana de prueba | Acordada con usted y escrita en el formulario de autorización (punto 4): entre la firma y la fecha límite |
| Entrega del informe | Acordada en el formulario (punto 9), con tiempo para corregir y volver a probar los hallazgos críticos y altos antes de la fecha límite |
| Nueva prueba de las correcciones críticas y altas | Después de las correcciones, en fechas acordadas entonces |

La ventana evita las 12 horas previas al inicio de un evento y cualquier despliegue del backend;
el dueño le indica las horas exactas al acordar la ventana.

## 3. Reglas de participación (resumen)

La regla es el plan (§1); esto es la versión corta.

- Solo pruebas a nivel de aplicación, a mano o con un proxy de interceptación. Toda herramienta
  automática se nombra en el formulario, se usa al ritmo acordado y no rastrea ni hace fuzzing sin
  pausas.
- Staging es para toda prueba que escriba datos, suba archivos o envíe correo. Producción es para
  verificaciones de configuración y pocos registros de prueba marcados, en eventos de prueba
  nombrados como tales, que son públicos mientras estén publicados.
- El backend limita a todos los llamantes en conjunto, y ambas copias comparten las cuotas de
  Google del dueño. Usted se mantiene en o por debajo del ritmo de solicitudes y de los volúmenes
  diarios del formulario, y se detiene cuando una respuesta indique un límite de ritmo o de cargas.
- Solo sus propios buzones de correo (listados en el formulario) y números de WhatsApp inventados;
  las capturas de pago son imágenes sintéticas hechas por usted. Cada registro que envíe lleva la
  marca indicada en el formulario.
- Sin denegación de servicio ni pruebas de carga. Fuera de alcance: los sistemas propios de Google
  y GoDaddy, las cuentas del dueño y de Cami, el repositorio de GitHub y sus workflows (puede leer
  el código público), SINPE Móvil y pagos reales, ingeniería social.
- Si encuentra datos personales reales: detenga esa línea de prueba, no los descargue ni los
  conserve, y avise al dueño el mismo día.
- El dueño puede detener la prueba en cualquier momento por mensaje; usted se detiene de inmediato
  y lo confirma.
- Los hallazgos, severidades y la nueva prueba siguen el plan §7 y §8.

## 4. Autorización

No se envía tráfico de prueba antes de que el **formulario de autorización** (plan, Apéndice A)
esté firmado por el dueño y por usted. Nombra al tester, los sistemas, la ventana, los límites,
las herramientas, la fecha del informe y el contacto de emergencia. El dueño guarda la copia
firmada de forma privada.

## 5. Qué recibe usted, y cuándo

| Recibe | Cuándo |
|---|---|
| Esta página, el plan y los documentos públicos del plan §2 | Con esta solicitud |
| El formulario de autorización completo, para firmar | Cuando el dueño elija tester |
| De forma privada, tras ambas firmas: las direcciones del backend de producción y staging, los códigos de los eventos y cupones de prueba, la marca, los límites de la ventana y el contacto de emergencia del dueño | Antes de abrir la ventana |

## 6. Qué debe contener el informe

Como en el plan, §7:

- un resumen ejecutivo para el dueño, en lenguaje claro;
- cada hallazgo con su severidad (CVSS v4.0, convertida a crítica, alta, media o baja), la
  evidencia, el requisito OWASP ASVS 5.0.0 afectado (ID con versión, como `v5.0.0-2.3.4`) o el
  riesgo del OWASP Top 10 2025 / API Security Top 10 2023, los pasos para reproducir limitados a lo
  que una corrección necesita, y la corrección recomendada;
- las pruebas realizadas sin hallazgo (las áreas ASVS cubiertas);
- la lista de limpieza: todo lo que usted creó, por entorno, con hora y referencia.

La entrega es privada (nunca en un lugar público). Un hallazgo crítico se reporta el mismo día,
antes del informe. Usted elimina los datos que haya capturado una vez aceptado el informe, y lo
confirma por escrito.

## 7. Qué necesitamos en su respuesta

1. Su nombre o empresa, y un contacto. Experiencia con PTES y con pruebas web y de APIs.
2. Un informe de muestra (editado), o la descripción de su formato.
3. Disponibilidad para una ventana antes de la fecha límite, y el tiempo que necesita para la
   prueba y el informe.
4. Las herramientas que piensa usar.
5. El precio, y si incluye una nueva prueba de las correcciones críticas y altas.
6. Si puede firmar los términos de confidencialidad del formulario (punto 10).

El dueño elige al tester y decide sobre el costo; nada queda acordado hasta firmar el formulario.
