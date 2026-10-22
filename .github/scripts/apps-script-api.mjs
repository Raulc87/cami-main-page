// Shared helpers for the deploy scripts (CMP-047): a Google access token from the clasp login
// file and a GET against the Apps Script API. Nothing here prints a token or an ID.
import { readFileSync } from 'node:fs';

export function stop(message) {
  console.error('::error::' + message);
  process.exit(1);
}

export async function accessToken(authFile) {
  let credential;
  try {
    const store = JSON.parse(readFileSync(authFile, 'utf8'));
    credential = store.tokens && store.tokens.default;
  } catch {
    stop('CLASP_CREDENTIALS is not valid JSON. Paste the whole contents of the clasp login file.');
  }
  if (!credential || !credential.refresh_token || !credential.client_id || !credential.client_secret) {
    stop('CLASP_CREDENTIALS has no usable login. Run "clasp login" again (runbook section 5.1) and replace the secret.');
  }
  // A fresh access token from the refresh token (the stored access token is usually expired).
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: credential.client_id,
      client_secret: credential.client_secret,
      refresh_token: credential.refresh_token,
      grant_type: 'refresh_token'
    })
  });
  if (!response.ok) {
    stop('Google rejected the login token (revoked or expired). Run "clasp login" (runbook section 5.1) and replace CLASP_CREDENTIALS in this environment.');
  }
  return (await response.json()).access_token;
}

// GET https://script.googleapis.com/v1/<path>; returns the parsed answer or null when Google
// does not return one (the caller decides whether that matters).
export async function scriptApi(token, path) {
  const response = await fetch('https://script.googleapis.com/v1/' + path, { headers: { Authorization: 'Bearer ' + token } });
  return response.ok ? response.json() : { __status: response.status };
}
