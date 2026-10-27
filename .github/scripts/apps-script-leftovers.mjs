// After the push (CMP-084): warns when the Apps Script project still holds files that the
// `apps-script/` folder does not have. `clasp push` sends nothing when no file of the repo differs
// from the project, so a deploy whose only change is a removed file leaves that file in the
// project. It prints how many such files there are, never their names, and never fails the deploy.
//
// Environment: CLASP_AUTH_FILE, APPS_SCRIPT_ID; GITHUB_STEP_SUMMARY when run by Actions.
import { appendFileSync } from 'node:fs';
import { accessToken, scriptApi } from './apps-script-api.mjs';
import { filesOnlyInProject, localFileNames } from './apps-script-files.mjs';

const authFile = process.env.CLASP_AUTH_FILE;
const scriptId = (process.env.APPS_SCRIPT_ID || '').trim();
if (!authFile || !scriptId) {
  console.log('::warning::Could not compare the project files with the repo: missing CLASP_AUTH_FILE or APPS_SCRIPT_ID.');
  process.exit(0);
}

try {
  const token = await accessToken(authFile);
  const content = await scriptApi(token, 'projects/' + encodeURIComponent(scriptId) + '/content');
  if (content.__status) throw new Error('content ' + content.__status);
  const extra = filesOnlyInProject(content.files || [], localFileNames('apps-script'));
  if (extra.length) {
    const note = '## Files not in the repo\n\nAfter this push the project still holds ' + extra.length + ' file(s) that the `apps-script/` folder does not have. A push that changes no other file does not remove them. Compare the Files list in the Apps Script editor with the folder and remove the extra file(s) there (Files > the three dots next to it > Remove).\n';
    console.log('::warning::After the push the project still holds ' + extra.length + ' file(s) that the repo does not have: compare the editor Files list with apps-script/ and remove the extra ones.');
    if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, note);
  } else {
    console.log('The project holds no file that the repo does not have.');
  }
} catch {
  console.log('::warning::Could not compare the project files with the repo (Google did not answer). Compare the editor Files list with apps-script/ by hand.');
}
