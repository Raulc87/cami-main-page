// Which files the Apps Script project holds that the repo does not (CMP-084).
// `clasp push` only sends the files the repo has: a file removed from `apps-script/` stays in the
// project, and would keep being served and run. The deploy warns when it finds any.
import { readdirSync } from 'node:fs';

// The name Google gives a file: `Code.js` is `Code`, `appsscript.json` is `appsscript`.
export function localFileNames(directory) {
  return readdirSync(directory)
    .filter((name) => /\.(js|gs|html|json)$/.test(name))
    .map((name) => name.replace(/\.[^.]+$/, ''));
}

// Names in the project that the repo does not have, sorted.
export function filesOnlyInProject(projectFiles, localNames) {
  const known = new Set(localNames);
  return projectFiles.map((file) => file.name).filter((name) => !known.has(name)).sort();
}
