// Which files the Apps Script project holds that the repo does not (CMP-084).
// `clasp push` sends nothing when no file of the repo differs from the project ("Script is already
// up to date"), so a deploy whose only change is a file removed from `apps-script/` leaves that file
// in the project, where it keeps being served and run until the next push that changes a file
// (that push replaces the whole file set). The deploy therefore forces a full push when the project
// holds files that the repo does not have, and warns if any are still left afterwards.
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
