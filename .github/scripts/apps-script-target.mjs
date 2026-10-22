// Checks the Apps Script project the deploy is about to change (CMP-047).
//
// Reads the clasp login file and the script ID from the environment, asks Google for the
// project's title and stops unless the title contains the environment name (a guard against
// swapped secrets). Prints only the title and the environment, never a token or an ID.
//
// Environment: CLASP_AUTH_FILE (path of the login file), APPS_SCRIPT_ID, EXPECTED_ENV
// ("staging" or "production").
import { readFileSync } from 'node:fs';

function stop(message) {
  console.error('::error::' + message);
  process.exit(1);
}

const authFile = process.env.CLASP_AUTH_FILE;
const scriptId = process.env.APPS_SCRIPT_ID;
const expected = (process.env.EXPECTED_ENV || '').toLowerCase();
if (!authFile || !scriptId || !expected) stop('Missing CLASP_AUTH_FILE, APPS_SCRIPT_ID or EXPECTED_ENV.');

let credential;
try {
  const store = JSON.parse(readFileSync(authFile, 'utf8'));
  credential = store.tokens && store.tokens.default;
} catch {
  stop('CLASP_CREDENTIALS is not valid JSON. Paste the whole contents of the clasp login file.');
}
if (!credential || !credential.refresh_token || !credential.client_id || !credential.client_secret) {
  stop('CLASP_CREDENTIALS has no usable login. Run "npx clasp login" again and replace the secret.');
}

// A fresh access token from the refresh token (the stored access token is usually expired).
const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    client_id: credential.client_id,
    client_secret: credential.client_secret,
    refresh_token: credential.refresh_token,
    grant_type: 'refresh_token'
  })
});
if (!tokenResponse.ok) {
  stop('Google rejected the login token (revoked or expired). Run "npx clasp login" and replace CLASP_CREDENTIALS in this environment.');
}
const { access_token: accessToken } = await tokenResponse.json();

const projectResponse = await fetch('https://script.googleapis.com/v1/projects/' + encodeURIComponent(scriptId), {
  headers: { Authorization: 'Bearer ' + accessToken }
});
if (!projectResponse.ok) {
  stop('Google did not return the project (HTTP ' + projectResponse.status + '). Check APPS_SCRIPT_ID and that the Apps Script API is on for the login account.');
}
const { title } = await projectResponse.json();
if (!title || !title.toLowerCase().includes(expected)) {
  stop('The project title does not contain "' + expected + '": the secrets may belong to another environment. Nothing was pushed.');
}
console.log('Target project: ' + title + ' (environment ' + expected + ')');
