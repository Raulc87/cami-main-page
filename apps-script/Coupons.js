// `coupon` action (EVENTS_API_CONTRACT §3.2; US-020) and the coupon rules shared with `register`.

// Amount to pay: price x (1 - discount/100), rounded to the nearest colón (BR-E03).
function amountDue_(priceCrc, discountPercent) {
  return Math.round(priceCrc * (1 - discountPercent / 100));
}

// Why a coupon cannot be used now, or null when it can (US-020 AC2, AC3). `uses` counts the
// registrations that hold the coupon (BR-E10); `emailUsed` says this email already holds it.
function couponProblem_(def, uses, emailUsed, nowMs) {
  if (!def.active) return 'COUPON_INVALID';
  if (def.expiresOn && nowMs > crEndOfDay_(def.expiresOn)) return 'COUPON_INVALID';
  if (emailUsed) return 'COUPON_ALREADY_USED';
  if (uses >= def.maxUses) return 'COUPON_EXHAUSTED';
  return null;
}

// The coupon row for an event and code, or null (the codes are never listed to the browser).
function findCoupon_(eventCode, couponCode) {
  var valid = {};
  valid[eventCode] = true;
  var coupons = readCoupons(valid).valid;
  for (var i = 0; i < coupons.length; i++) {
    if (coupons[i].eventCode === eventCode && coupons[i].couponCode === couponCode) return coupons[i];
  }
  return null;
}

// Counting registrations (new or confirmed) of an event tab, as rows.
function countingRows_(rows) {
  return rows.filter(function (r) {
    var s = str_(r.v.status).trim().toLowerCase();
    return s === 'new' || s === 'confirmed';
  });
}

function usesOf_(counting, couponCode) {
  return counting.filter(function (r) { return str_(r.v.couponCode).trim().toUpperCase() === couponCode; });
}

function couponCheckFailed_(code) {
  bumpWindow_('couponfail');
  bumpMetric_('couponFailures', 1);
  return fail(code);
}

function handleCoupon_(body) {
  var maxChecks = getNumberProp('LIMIT_COUPON_CHECKS_PER_MIN');
  var maxFails = getNumberProp('LIMIT_COUPON_FAILS_PER_MIN');
  if (bumpWindow_('coupon') > maxChecks || readWindow_('couponfail') >= maxFails) {
    bumpMetric_('throttled', 1);
    checkAlertsSafely_();
    return fail('RATE_LIMITED');
  }

  var fields = {};
  var eventCode = str_(body.eventCode).trim().toUpperCase();
  if (!EVENT_CODE_RE.test(eventCode)) fields.eventCode = 'required';
  var email = str_(body.email).trim().toLowerCase();
  if (!email) fields.email = 'required';
  else if (email.length > 254 || !EMAIL_RE.test(email)) fields.email = 'invalid_email';
  var couponCode = str_(body.couponCode).trim().toUpperCase();
  if (!COUPON_CODE_RE.test(couponCode)) fields.couponCode = 'invalid_coupon_format';
  if (Object.keys(fields).length) return fail('VALIDATION_ERROR', fields);

  var found = lookupEventForRegister_(eventCode);
  if (!found) return fail('EVENT_NOT_FOUND');
  var nowMs = Date.now();
  if (!found.published || nowMs >= found.event.startsAtMs - REGISTRATION_CLOSES_HOURS * 3600000) {
    return fail('REGISTRATION_CLOSED');
  }

  var def = findCoupon_(eventCode, couponCode);
  if (!def) return couponCheckFailed_('COUPON_INVALID');
  var counting = countingRows_(readTable(eventCode));
  var holders = usesOf_(counting, couponCode);
  var emailUsed = holders.some(function (r) { return str_(r.v.email).trim().toLowerCase() === email; });
  var problem = couponProblem_(def, holders.length, emailUsed, nowMs);
  if (problem) return couponCheckFailed_(problem);
  return ok({ discountPercent: def.discountPercent, amountDueCrc: amountDue_(found.event.priceCrc, def.discountPercent) });
}
