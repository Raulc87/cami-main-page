# Release Checklist

Cómo se hace un release de **cami-main-page**: build de producción, subida a GoDaddy shared
hosting (`public_html/` de `camihernandez.com`), y el tag + GitHub Release correspondiente.
Ver [01-tech-stack.md](../specs/01-tech-stack.md) para el resto del stack/hosting.

No hay CI/CD — todo el proceso es manual. Este documento existe para que cualquier persona
(o agente) pueda repetirlo sin tener que redescubrir los pasos cada vez.

## 1. Pre-requisitos (una sola vez)

- Acceso a GoDaddy con **hosting activo** para `camihernandez.com` (no alcanza con tener el
  dominio registrado — hay que tener un plan de hosting contratado y el dominio apuntando a
  ese hosting). Verificar en el panel de GoDaddy → "Mis productos": debe aparecer un producto
  de **Web Hosting** (o similar) asociado al dominio, no solo el dominio en sí.
  - **Ojo con "Websites + Marketing" (Airo)**: GoDaddy suele dar de entrada un sitio gratis
    hecho con su constructor visual ("Airo") en el mismo dominio. Ese producto **no tiene
    cPanel/File Manager** y no acepta subir un build propio — no sirve para este proyecto. Si
    es lo único que aparece en la cuenta, hay que contratar **Web Hosting** (el plan con
    cPanel) por separado; no confundir uno con el otro.
- `gh` (GitHub CLI) instalado y autenticado (`gh auth login`) en la máquina desde la que se
  hace el release.
- `npm install` corrido al menos una vez (`node_modules/` presente).

## 2. Versionado

Se usa [SemVer](https://semver.org/) simple: `vMAJOR.MINOR.PATCH`.

- El primer release productivo del sitio es **`v1.0.0`**.
- Releases posteriores: `PATCH` para copy/fixes chicos, `MINOR` para secciones/features nuevas
  visibles, `MAJOR` reservado para rediseños grandes o cambios de arquitectura (ej. cuando
  entre el backend del [roadmap](../specs/05-roadmap.md)).
- La versión se refleja en `version` de [package.json](../../package.json) — actualizarla en el
  mismo commit que dispara el release.

## 3. Build

```bash
npm run build
```

Genera `dist/`. Antes de subir:

- [ ] El build corrió sin errores ni warnings nuevos.
- [ ] `npm run preview` sirve `dist/` localmente y se probó el golden path en el browser.
- [ ] No quedó ningún placeholder obvio que debiera ser contenido real y no lo es (ver
      [00-vision.md](../specs/00-vision.md) sobre qué contenido sigue siendo placeholder a
      propósito).

## 4. Subida a GoDaddy (cPanel File Manager)

Shared hosting de GoDaddy, sin FTP/SSH configurado — se sube desde el navegador.

1. Comprimir el **contenido** de `dist/` (no la carpeta `dist/` en sí) en un `.zip`:
   ```bash
   cd dist && zip -r ../release.zip . && cd ..
   ```
2. Entrar al panel de GoDaddy → **"Mis productos"** → el producto de **Web Hosting** de
   `camihernandez.com` → **"Administrar"** → botón **"cPanel Admin"**.
   - Justo después de contratar el hosting, GoDaddy puede mostrar un asistente de
     **"Set up your migration"** pidiendo la URL de un sitio existente para migrarlo. No
     aplica acá (no hay nada que migrar) — no lo completes, entra directo a "Mis productos"
     → el hosting → cPanel Admin en otra pestaña en su lugar.
   - Si acabas de comprar el hosting, cPanel puede tardar unos minutos en aprovisionar del
     todo — si File Manager carga en blanco o queda sin responder, prueba refresco duro
     (`Cmd+Shift+R`), una ventana de incógnito, o reintenta en 15-20 minutos.
3. Abrir **File Manager** → navegar a `public_html/`.
4. Una cuenta de hosting recién creada trae archivos placeholder de GoDaddy por defecto
   (`404.shtml`, `home.html`, `layout-styles.css`) — no son contenido real, se pueden borrar
   sin respaldo. Si en cambio ya hay un release previo real ahí, sí hacer respaldo antes de
   sobrescribir: seleccionar todo, comprimir a un `.zip` de backup (ej.
   `backup-pre-v1.0.0.zip`) y dejarlo fuera de `public_html/` (ej. en la carpeta home) o
   descargarlo. **Nunca reemplazar sin respaldo un sitio que ya está en producción.**
5. Subir `release.zip` a `public_html/` (botón **Upload**).
6. Una vez subido, click derecho sobre `release.zip` → **Extract**, extrayendo directo dentro
   de `public_html/`.
7. Borrar `release.zip` de `public_html/` después de extraer (no debe quedar servido
   públicamente).
8. Confirmar que `public_html/index.html` existe y es el `index.html` nuevo (fecha de
   modificación reciente).

## 5. Dominio → hosting

Si el dominio y el hosting están contratados en la misma cuenta de GoDaddy, GoDaddy suele
apuntar el DNS automáticamente al conectar ambos productos — verificar en el panel que el
dominio esté **"conectado"** al hosting antes de asumir que ya funciona. Si el hosting está en
otro proveedor, hay que apuntar los nameservers o el registro A/CNAME de `camihernandez.com`
hacia ese proveedor desde el panel de DNS de GoDaddy (paso manual fuera del alcance de este
repo — seguir la guía específica del proveedor de hosting elegido).

- [ ] `https://camihernandez.com` carga el sitio (no la página placeholder de GoDaddy).
- [ ] `https://www.camihernandez.com` también resuelve (redirect o mismo contenido), si aplica.
- [ ] HTTPS activo (candado en el browser) — GoDaddy shared hosting suele traer SSL gratis
      (AutoSSL/Let's Encrypt) pero puede tardar unos minutos en activarse tras el primer deploy.

## 6. Tag + GitHub Release

Con el sitio ya verificado en producción:

```bash
git tag -a v1.0.0 -m "v1.0.0 — primer release productivo"
git push origin v1.0.0

gh release create v1.0.0 \
  --title "v1.0.0 — Primer release" \
  --notes "Primer release productivo de camihernandez.com. Ver TICKETS.md para el detalle de tickets incluidos."
```

- El tag se crea sobre el commit de `main` que corresponde exactamente a lo que está subido en
  `public_html/` — si hubo cambios sin commitear entre el build y el deploy, commitearlos
  primero.
- Las notas del release pueden generarse listando los tickets `done`/`review` en
  [TICKETS.md](../../TICKETS.md) incluidos desde el release anterior (o todos, si es el
  primero).

## 7. Rollback

Si algo sale mal después de extraer en `public_html/`:

1. Borrar el contenido nuevo de `public_html/`.
2. Volver a subir y extraer el `.zip` de respaldo del paso 4.4.
3. Si el release ya se había tageado en GitHub, no se borra el tag/release — se documenta como
   conocido y se corrige con un release siguiente (`v1.0.1`), salvo que el tag apunte a un
   commit roto que nunca debió publicarse.

## 8. Releases futuros

Repetir desde el paso 2 (bump de versión). El paso 1 (pre-requisitos) y buena parte del paso 4
(acceso al panel) ya quedan resueltos después del primer release.

## 9. Historial

- **`v1.0.0`** — 2026-09-04. Primer release productivo, siguiendo exactamente este proceso
  (incluyendo las trampas de Airo y el asistente de migración documentadas arriba). Ver
  [release en GitHub](https://github.com/Raulc87/cami-main-page/releases/tag/v1.0.0).
