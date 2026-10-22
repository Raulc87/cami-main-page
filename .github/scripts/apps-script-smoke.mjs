// Smoke request after a deploy (CMP-047). The events list can come from the cache of the previous
// version; the registration request always runs the new code. A broken events build shows within
// five minutes as a Failed `refreshEventsCache` run (runbook 5.1).
// Two requests that write nothing to the sheet, Drive or
// email: the events list must answer ok, and a registration with an invalid email must be
// refused with VALIDATION_ERROR (or RATE_LIMITED when the registration limit is hit at that moment).
// The second one adds one request to the register counters. The /exec URL is built from the
// deployment ID and only the answer codes are printed.
//
// Environment: APPS_SCRIPT_DEPLOYMENT_ID.
const id = process.env.APPS_SCRIPT_DEPLOYMENT_ID;
if (!id) {
  console.error('::error::Missing APPS_SCRIPT_DEPLOYMENT_ID.');
  process.exit(1);
}
const url = 'https://script.google.com/macros/s/' + id + '/exec';

async function answer(request) {
  try {
    const response = await request();
    return JSON.parse(await response.text());
  } catch {
    return null; // not JSON (for example Google's HTML error page) or no connection
  }
}

const checks = [
  {
    name: 'events list',
    run: () => answer(() => fetch(url + '?action=events&lang=es')),
    ok: (r) => r && r.ok === true && Array.isArray(r.data && r.data.events)
  },
  {
    name: 'invalid registration is refused',
    run: () => answer(() => fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'register', submissionId: '00000000-0000-4000-8000-000000000000', eventCode: 'SMOKE',
        participantName: 'Smoke', email: 'not-an-email', whatsapp: '+50688880000', lang: 'es', consent: true, website: ''
      })
    })),
    // RATE_LIMITED also proves the register path runs (the throttle answers before the validation).
    ok: (r) => r && r.ok === false && r.error && (r.error.code === 'VALIDATION_ERROR' || r.error.code === 'RATE_LIMITED')
  }
];

let failed = false;
for (const check of checks) {
  let good = false;
  let seen = null;
  // The new version can take a few seconds to answer.
  for (let attempt = 1; attempt <= 6 && !good; attempt++) {
    seen = await check.run();
    good = !!check.ok(seen);
    if (!good) await new Promise((resolve) => setTimeout(resolve, 5000));
  }
  const code = seen ? (seen.ok ? 'ok' : (seen.error && seen.error.code) || 'error') : 'no JSON answer';
  console.log((good ? 'PASS' : 'FAIL') + ': ' + check.name + ' (' + code + ')');
  if (!good) failed = true;
}
if (failed) {
  console.error('::error::The smoke request failed. The new version is already live: roll back to the previous version (runbook section 6).');
  process.exit(1);
}
