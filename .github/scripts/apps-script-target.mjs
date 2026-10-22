// Checks the Apps Script project the deploy is about to change (CMP-047).
//
// 1. Asks Google for the project's title and stops unless it contains the environment name and
//    not the other one (a guard against swapped secrets). Prints only the title.
// 2. Records the version the deployment serves now (output `previous_version`), so a failed smoke
//    request can put it back.
// 3. Compares the permissions (`oauthScopes`) of the project as it is now with the repo's
//    appsscript.json, and writes a note to the job summary when they differ.
//
// Environment: CLASP_AUTH_FILE, APPS_SCRIPT_ID, APPS_SCRIPT_DEPLOYMENT_ID, EXPECTED_ENV
// ("staging" or "production"); GITHUB_OUTPUT and GITHUB_STEP_SUMMARY when run by Actions.
import { appendFileSync, readFileSync } from 'node:fs';
import { accessToken, scriptApi, stop } from './apps-script-api.mjs';

const authFile = process.env.CLASP_AUTH_FILE;
const scriptId = (process.env.APPS_SCRIPT_ID || '').trim();
const deploymentId = (process.env.APPS_SCRIPT_DEPLOYMENT_ID || '').trim();
const expected = (process.env.EXPECTED_ENV || '').toLowerCase();
if (!authFile || !scriptId || !expected) stop('Missing CLASP_AUTH_FILE, APPS_SCRIPT_ID or EXPECTED_ENV.');
const other = expected === 'staging' ? 'production' : 'staging';

const token = await accessToken(authFile);
const project = await scriptApi(token, 'projects/' + encodeURIComponent(scriptId));
if (project.__status) {
  stop('Google did not return the project (HTTP ' + project.__status + '). Check APPS_SCRIPT_ID and that the Apps Script API is on for the login account.');
}
const title = String(project.title || '');
if (!title.toLowerCase().includes(expected) || title.toLowerCase().includes(other)) {
  stop('The project title must contain "' + expected + '" and not "' + other + '": the secrets may belong to another environment. Nothing was pushed.');
}
console.log('Target project: ' + title + ' (environment ' + expected + ')');

// The version the deployment serves now.
// The deployment must exist in this project and serve a numbered version (the web-app deployment,
// not the "Head / test" one): otherwise the deploy would change the saved code and then fail.
if (!deploymentId) stop('Missing APPS_SCRIPT_DEPLOYMENT_ID.');
const deployment = await scriptApi(token, 'projects/' + encodeURIComponent(scriptId) + '/deployments/' + encodeURIComponent(deploymentId));
if (deployment.__status) {
  stop('Google did not return the deployment (HTTP ' + deployment.__status + '). Check APPS_SCRIPT_DEPLOYMENT_ID: it must be the web-app deployment of this project. Nothing was pushed.');
}
const version = deployment.deploymentConfig && deployment.deploymentConfig.versionNumber;
if (!version) {
  stop('The deployment has no numbered version: it looks like the "Head / test" deployment. Use the ID of the web-app deployment (Deploy > Manage deployments). Nothing was pushed.');
}
const previous = String(version);
console.log('Version served now: ' + previous);
if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, 'previous_version=' + previous + '\n');

// Permissions: project as it is now against the repo.
try {
  const content = await scriptApi(token, 'projects/' + encodeURIComponent(scriptId) + '/content');
  if (content.__status) throw new Error('content ' + content.__status);
  const manifest = (content.files || []).find((f) => f.name === 'appsscript');
  const remote = manifest ? (JSON.parse(manifest.source).oauthScopes || []) : null;
  const local = JSON.parse(readFileSync('apps-script/appsscript.json', 'utf8')).oauthScopes || [];
  if (remote && JSON.stringify([...remote].sort()) !== JSON.stringify([...local].sort())) {
    const added = local.filter((s) => !remote.includes(s));
    const note = '## Permissions change\n\nThe `oauthScopes` of `appsscript.json` differ from the project now' +
      (added.length ? ' (new: ' + added.map((s) => '`' + s.replace('https://www.googleapis.com/auth/', '') + '`').join(', ') + ')' : '') +
      '. **The owner must approve the new permissions** (open the project in the Apps Script editor, run any function once, allow) before the web app and the triggers work again.\n';
    console.log('::warning::Permissions change: the owner must approve the new permissions after this deploy.');
    if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, note);
  }
} catch {
  const note = '## Permissions not compared\n\nThe permissions of `appsscript.json` could not be compared with the project (Google did not answer). If this commit adds permissions, **the owner must approve them** (open the project in the Apps Script editor, run any function once, allow) before the web app and the triggers work.\n';
  console.log('::warning::Could not compare the permissions with the project: if this commit adds permissions, the owner must approve them after the deploy.');
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, note);
}
