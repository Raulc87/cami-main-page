// Checks a built site before it is uploaded (CMP-093, ADR-010 decision 3; release-checklist §3b).
//
// The bundle must point at the production events backend and only at it: every
// `/macros/s/<id>/exec` address in the JavaScript files must carry the production id, and the
// staging id must not appear anywhere. Prints only masked values (the last six characters of the
// production id), never an address.
//
// Usage: node site-bundle-check.mjs <site folder>
// Environment: VITE_EVENTS_API_URL (the production /exec URL), STAGING_EVENTS_ID (the staging id).
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

function stop(message) {
  console.error('::error::' + message);
  process.exit(1);
}

const siteDir = process.argv[2];
if (!siteDir) stop('Usage: site-bundle-check.mjs <site folder>');

const productionUrl = (process.env.VITE_EVENTS_API_URL || '').trim();
const stagingId = (process.env.STAGING_EVENTS_ID || '').trim();
const productionId = /\/macros\/s\/([\w-]+)\/exec$/.exec(productionUrl)?.[1];
if (!productionId) stop('VITE_EVENTS_API_URL must be the production /exec address (https://script.google.com/macros/s/<id>/exec).');
if (!stagingId) stop('STAGING_EVENTS_ID is missing: it is needed to prove the staging backend is not in the bundle.');
if (stagingId === productionId) stop('STAGING_EVENTS_ID and the production address carry the same id.');

function filesUnder(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? filesUnder(path) : [path];
  });
}

const files = filesUnder(siteDir);
const scripts = files.filter((f) => /\.(m?js)$/.test(f));
if (!files.some((f) => f === join(siteDir, 'index.html'))) stop('The site has no index.html.');
if (!scripts.length) stop('The site has no JavaScript files.');

const idsFound = new Set();
for (const file of files) {
  const text = readFileSync(file, 'utf8');
  if (text.includes(stagingId)) stop('The staging backend id appears in a built file. Nothing was uploaded.');
  if (!scripts.includes(file)) continue;
  for (const match of text.matchAll(/\/macros\/s\/([\w-]+)\/exec/g)) idsFound.add(match[1]);
}

if (idsFound.size !== 1 || !idsFound.has(productionId)) {
  stop('The bundle must contain the production backend address and no other (found ' + idsFound.size + ' distinct backend id(s)). Nothing was uploaded.');
}
console.log('Bundle check passed: production backend id ending ...' + productionId.slice(-6) + ', no staging id, ' + files.length + ' files.');
