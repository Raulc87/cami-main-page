// Plans a site upload from the files of the build and the server's manifest (CMP-093, ADR-010
// decision 5). The manifest is the list of files an earlier run of the workflow uploaded, one
// line each: `<sha256>  <path>`. The plan is:
//   add     a file the manifest does not list (an existing file with the same name is overwritten)
//   change  a file the manifest lists with another hash
//   delete  a file the manifest lists and the build no longer has
// Nothing else on the server is ever touched. Paths are public file names of the site.
//
// Usage: node site-plan.mjs <site folder> <manifest file or "-" for none> <plan output folder>
// Writes <plan>/upload.txt (paths, in upload order), <plan>/delete.txt, <plan>/manifest.new,
// manifest.pending (see below) and prints the plan.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

function stop(message) {
  console.error('::error::' + message);
  process.exit(1);
}

const SAFE_PATH = /^[A-Za-z0-9._\/-]+$/;
// The page and the rules go last: the files they refer to are in place first.
const LAST = ['index.html', '.htaccess'];

const [siteDir, manifestFile, planDir] = process.argv.slice(2);
if (!siteDir || !manifestFile || !planDir) stop('Usage: site-plan.mjs <site folder> <manifest file or -> <plan folder>');

function filesUnder(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? filesUnder(path) : [path];
  });
}

const built = new Map();
for (const file of filesUnder(siteDir)) {
  const path = relative(siteDir, file).split(sep).join('/');
  if (!SAFE_PATH.test(path) || path.split('/').includes('..')) stop('A file name in the build has characters the upload does not accept: ' + path);
  built.set(path, createHash('sha256').update(readFileSync(file)).digest('hex'));
}
if (!built.has('index.html')) stop('The build has no index.html.');

const uploaded = new Map();
if (manifestFile !== '-' && existsSync(manifestFile)) {
  for (const line of readFileSync(manifestFile, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    const match = /^([0-9a-f]{64}) {2}(.+)$/.exec(line);
    if (!match || !SAFE_PATH.test(match[2]) || match[2].split('/').includes('..')) stop('The manifest on the server is not in the expected format; nothing was changed.');
    uploaded.set(match[2], match[1]);
  }
}

const add = [];
const change = [];
for (const [path, hash] of built) {
  if (!uploaded.has(path)) add.push(path);
  else if (uploaded.get(path) !== hash) change.push(path);
}
const remove = [...uploaded.keys()].filter((path) => !built.has(path)).sort();

const order = (a, b) => (LAST.includes(a) - LAST.includes(b)) || a.localeCompare(b);
const toUpload = [...add, ...change].sort(order);

mkdirSync(planDir, { recursive: true });
writeFileSync(join(planDir, 'upload.txt'), toUpload.map((p) => p + '\n').join(''));
writeFileSync(join(planDir, 'delete.txt'), remove.map((p) => p + '\n').join(''));
// Written to the server BEFORE any file changes: every name of both builds, with no usable hash.
// If the run stops half-way, the server's files match neither build, so no later run (a rollback
// included) may trust a hash: it uploads everything again, and still knows which names to delete.
const NO_HASH = '0'.repeat(64);
const everyName = new Set([...built.keys(), ...uploaded.keys()]);
writeFileSync(
  join(planDir, 'manifest.pending'),
  [...everyName].sort().map((path) => NO_HASH + '  ' + path + '\n').join('')
);
writeFileSync(
  join(planDir, 'manifest.new'),
  [...built].sort(([a], [b]) => a.localeCompare(b)).map(([path, hash]) => hash + '  ' + path + '\n').join('')
);

console.log('Upload plan: ' + add.length + ' to add, ' + change.length + ' to change, ' + remove.length + ' to delete, ' + (built.size - add.length - change.length) + ' unchanged.');
for (const p of add) console.log('  add     ' + p);
for (const p of change) console.log('  change  ' + p);
for (const p of remove) console.log('  delete  ' + p);
