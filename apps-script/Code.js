// Entry points. Router on `action` (EVENTS_API_CONTRACT §2, §3).
// `events` is implemented in Events.js (CMP-025) and `register` in Register.js (CMP-026).

function doGet(e) {
  try {
    var params = (e && e.parameter) || {};
    if (params.action === 'events') return handleEvents_(params);
    return fail('SERVER_ERROR');
  } catch (err) {
    console.error('doGet failed: ' + err.name);
    return fail('SERVER_ERROR');
  }
}

function doPost(e) {
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (body.action === 'register') return handleRegister_(body);
    if (body.action === 'coupon') return handleCoupon_(body);
    return fail('SERVER_ERROR');
  } catch (err) {
    // Fixed message: error text can echo request content (personal data must stay out of logs).
    console.error('doPost failed: ' + err.name);
    return fail('SERVER_ERROR');
  }
}

// Run from the editor after deploying: checks configuration without touching data.
function smokeCheck() {
  var missing = missingProperties();
  console.log(missing.length ? 'Missing script properties: ' + missing.join(', ') : 'Script properties OK');
  console.log('Drive advanced service: ' + (typeof Drive !== 'undefined' && Drive.Files ? 'OK' : 'MISSING'));
}
