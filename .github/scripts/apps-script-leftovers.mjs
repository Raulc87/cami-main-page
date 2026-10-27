// Files the Apps Script project holds that the `apps-script/` folder does not have (CMP-084).
// `clasp push` sends nothing when no file of the repo differs from the project, so a deploy whose
// only change is a removed file leaves that file in the project; the next push that changes a file
// replaces the whole file set and removes it. The deploy script uses this twice:
//   `count`   (before the push) prints the number of such files, so the deploy can force a full push;
//   `warn`    (after the push) warns when files are still left.
// It prints how many such files there are, never their names, and never fails the deploy.
//
// Environment: CLASP_AUTH_FILE, APPS_SCRIPT_ID; GITHUB_STEP_SUMMARY when run by Actions.
import { appendFileSync } from 'node:fs';
import { accessToken, scriptApi } from './apps-script-api.mjs';
import { filesOnlyInProject, localFileNames } from './apps-script-files.mjs';

const mode = process.argv[2] === 'count' ? 'count' : 'warn';
const authFile = process.env.CLASP_AUTH_FILE;
const scriptId = (process.env.APPS_SCRIPT_ID || '').trim();

// In `count` mode stdout carries only the number; messages go to stderr.
const say = mode === 'count' ? console.error : console.log;

async function extraFileCount() {
  if (!authFile || !scriptId) throw new Error('missing CLASP_AUTH_FILE or APPS_SCRIPT_ID');
  const token = await accessToken(authFile);
  const content = await scriptApi(token, 'projects/' + encodeURIComponent(scriptId) + '/content');
  if (content.__status) throw new Error('content ' + content.__status);
  return filesOnlyInProject(content.files || [], localFileNames('apps-script')).length;
}

try {
  const extra = await extraFileCount();
  if (mode === 'count') {
    console.log(String(extra));
  } else if (extra) {
    const note = '## Files not in the repo\n\nAfter this push the project still holds ' + extra + ' file(s) that the `apps-script/` folder does not have. Compare the Files list in the Apps Script editor with the folder and remove the extra file(s) there (Files > the three dots next to it > Remove).\n';
    say('::warning::After the push the project still holds ' + extra + ' file(s) that the repo does not have: compare the editor Files list with apps-script/ and remove the extra ones.');
    if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, note);
  } else {
    say('The project holds no file that the repo does not have.');
  }
} catch {
  say('::warning::Could not compare the project files with the repo (Google did not answer). Compare the editor Files list with apps-script/ by hand.');
  if (mode === 'count') console.log('0');
}
