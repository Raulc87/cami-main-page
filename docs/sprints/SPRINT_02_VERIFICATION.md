# SPRINT_02_VERIFICATION — Events feature on staging (CMP-033)

Integration verification of Sprint 02 (US-017..US-025, US-005 AC2) against the staging
backend. Written by Implementation Agent 3 (CMP-033). A Fail is not fixed in this PR: it is
classified (AC wording or defect) and a ticket is proposed. Story statuses are not changed here;
the coordinator does that after the owner approves the evidence.

**Status of this document: complete, for the owner's review.** Every line is now Pass, N/A with a
reason, or the deferred real-iPhone check; `Pending (owner)` is kept in the legend only.

## 1. Method

| Item | Detail |
|---|---|
| Code under test | Front end: `main` at `5f6cf9c` (PR #29 form, #28 section and ticker merged) at the start of the run; later merges into `main` during the run did not change application code. Backend: the staging deployment pasted by the owner from `main` with the backend PRs #33, #36, #38 and #39 (lock flush) included (the coordinator's go message of 2026-10-21 ~16:00Z). During the run the owner re-pasted the staging scripts from PR #44 (CMP-045), at about 00:15Z on 2026-10-22; see the table below |
| Backend | Staging Apps Script deployment, staging spreadsheet and Drive folder (never production); the `/exec` URL is kept out of the repository |
| Browser | Chromium (Playwright), `es-CR` and `en-US`, 1280 / 900 / 375 px; iPhone 13 emulation for the HEIC check; the site runs from the Vite dev server with `VITE_EVENTS_API_URL` pointing at staging, so every `events`, `coupon` and `register` call is a real browser `fetch` through the Apps Script redirect |
| Test data | Synthetic images only; participant emails are plus-tags of the owner's Gmail (and Outlook) addresses and are not recorded here; registration references shown in screenshots are masked; the SINPE blocks in the form screenshots show test values (the pictures were taken with the `events` answer intercepted so that no real SINPE number or account name is in the repository) |
| Rows, files, emails | Seen only by the owner; evidence screenshots are masked JPEGs in `docs/sprints/evidence/sprint-02/` (total under 5 MB) |
| Not done | Real-iPhone Safari picker/HEIC check: **deferred to a pre-release check (owner, no device available)**. The substitute (a real HEIC file and an iPhone-style PNG through the form in a phone-sized viewport) is evidence for the client side only |

Which results ran before and after the re-paste of PR #44 on staging (about 00:15Z, 2026-10-22):

| Before the re-paste (backend #33/#36/#38/#39) | After the re-paste (backend incl. #44) |
|---|---|
| Form runs, live edits (a) and (b) of the form, the 27 API cases and the race (R18), the 15 + 4 email registrations, the HEIC/PNG substitute (first run, test values), CLS and regression captures | The HEIC re-run with the real values, the TNEW listing and removal, live edits 2 to 4 (coupon change, cancelled place, spam), the ticker/US-017 AC5/accessibility scripted checks (front-end only), the final evidence re-shoots |

Legend: **Pass**, **Fail**, **N/A** (cannot be exercised, with the reason), **Pending (owner)**.

## 2. Results per story

### US-017 — Upcoming events section
| AC | Case | Result | Evidence |
|---|---|---|---|
| 1 | Cards in start order with name, date, time (24 h `HH:mm`), description, price or "Gratis/Free", register button; ES and EN | Pass | `page-events-{es,en}-{1280,900,375}.jpg` |
| 2 | Event without image shows the Lifetools logo; event with an image URL (TART) shows the art | Pass | `page-events-*` (logo), `page-events-art-{es,en}-1280.jpg` (art) |
| 3 | Closed (registration closes 12 h before start) and sold-out events: button disabled, "Inscripciones cerradas" / "Agotado" (EN "Registration closed" / "Sold out") | Pass | cards of the closed event, the one-seat free event and the one-seat paid event |
| 4 | EN site shows English name and description: automatic translation, and `nameEn`/`descriptionEn` override (TART shows the override) | Pass | `events?lang=en` listing, EN screenshots |
| 5 | Backend down (requests aborted): no section, no ticker, page renders | Pass | scripted check |
| 5 | Backend slow: answer after 4.5 s is shown; after 5.5 s the section and ticker stay hidden (5 s limit) | Pass | CLS run (§3.3) and scripted check with a 6.5 s answer |
| 5 | `VITE_EVENTS_API_URL` empty: page identical to the pre-events page, no section, no ticker | Pass | `page-noevents-{es,en}-{1280,900,375}.jpg` |

### US-018 — Upcoming-events ticker
| AC | Case | Result | Evidence |
|---|---|---|---|
| 1 | Banner shows up to 2 closest events (name · date), scrolls right-to-left (about 79 px/s) in the active language | Pass | scripted check, `page-events-*` |
| 2 | Selecting an item (click, or Enter with keyboard focus) scrolls to that event's card | Pass | scripted check |
| 3 | Hover pauses; keyboard focus pauses | Pass | scripted check |
| 4 | `prefers-reduced-motion`: static banner | Pass | scripted check |
| 5 | No upcoming events: no banner | Pass | `page-noevents-*` |

### US-019 — Registration form with SINPE proof
Form-side runs on staging (CMP-032 pass and this run).
| AC | Case | Result | Evidence |
|---|---|---|---|
| 1 | Paid event: summary, then (after name, email, WhatsApp and coupon) SINPE number, account name and amount; the amount follows the coupon | Pass | `form-es-1280-paid.jpg`, `form-es-375-paid.jpg`, `form-en-900-paid.jpg` |
| 1 | "placeholder / por confirmar" marker while the values are placeholders | N/A on staging (real values set); Pass against a fixture in CMP-032 and in the reviewer's run | `mobile-iphone13-heic-form.jpg` shows the staging test values at the time |
| 2 | Free event and ₡0 after a 100% coupon: no payment block, no screenshot field, submit works without a file | Pass | scripted checks |
| 3 | Missing name / email / WhatsApp / screenshot / consent: submit blocked, one message per field in the active language | Pass | scripted check |
| 4 | Invalid email, phone, non-image renamed `.jpg`, file over 5 MB: matching error, nothing sent | Pass | scripted check; also on the server, see §3.1 |
| 5 | Valid paid registration with JPEG, PNG, WebP: confirmation with reference | Pass | `form-es-1280-confirmation.jpg` |
| 5 | HEIC: the form accepts a real HEIC (brand `heic`, about 516 KB) and sends it as `image/heic`; reference returned | Pass (client). Stored: both HEIC rows were stored in the original `.heic` format (conversion fell back, FFR-014; owner-checked in Drive), the PNG row as `.jpg`. Check result and emails for the HEIC rows: see US-022 AC7 | `mobile-iphone13-heic-done.jpg` |
| 6 | Backend error: retry message, data kept; a dropped response followed by a retry reuses the same `submissionId` and returns the reference | Pass | scripted check |
| 7 | Email already registered: the exact ES/EN text, nothing stored | Pass | scripted check |
| 8 | Privacy notice (marked draft) and a required consent checkbox | Pass | form screenshots |

### US-020 — Coupon at registration (client side)
| AC | Case | Result | Evidence |
|---|---|---|---|
| 1 | 10% coupon: amount to pay becomes ₡22 500 and the coupon is saved with the registration | Pass | scripted check |
| 1 | Rounding to the nearest colón: 15% on ₡12 345 gives ₡10 493 | Pass (server answer and stored amount `10493`, owner-checked in the sheet) | API case C07b |
| 1 | Coupon expiring today is still valid (inclusive) | Pass | API case C07a |
| 2 | Unknown, inactive, expired, other-event coupon: "Cupón no válido", full price stays | Pass | scripted check, API cases C06/C08 |
| 3 | Exhausted coupon, coupon already used by the email: matching message, full price stays | Pass | scripted check |
| 4 | A registration marked `spam` frees the coupon use: a one-use coupon answered `COUPON_EXHAUSTED` for another email; after the owner set the registration that held it to `spam`, the next check answered 20% and ₡20 000 (no cache) | Pass | live edit 4 |
| 5 | Coupon deactivated after apply, then a paid registration: stored with the discount, flagged `coupon changed`; the visitor sees the review message | Pass (visitor side; row owner-checked: `coupon changed`, coupon PROMO10AB at 10%, ₡22 500) | `form-es-1280-flagged-coupon-changed.jpg` |
| 6 | Many failed coupon checks: refusal "try again later" | Pass: after 10 failed checks in a minute the next checks, including a valid coupon, got `RATE_LIMITED` until the minute ended; the next minute the valid coupon worked again (§3.8) | burst run |
| 7 | No coupon list is sent to the browser | Pass | the `events` response carries no coupon data |
| 8 | A coupon typed but not applied blocks Submit with "Aplica el cupón o borra el campo."; no request is sent | Pass | CMP-032 mock run and the reviewer's run |

### US-021 — Registrations in Drive and Sheets
| AC | Case | Result | Evidence |
|---|---|---|---|
| 1 | Paid registration: JPEG named `<Name>_<date>_<eventCode>.jpg` in `<root>/<eventCode>/`, `_2` on collision, subfolder created if new; ₡0 stores no file | Pass (owner-checked in Drive: folders TPAID, TSOLD1 and TROUND only, none for the free events; `.jpg` files; the two same-name registrations are `Maria_Perez_Nandu_<date>_TPAID.jpg` and the `_2` file). The PNG upload was converted to `.jpg`; the HEIC uploads were stored in their original `.heic` format with a note, which this AC allows | owner, Drive listing |
| 2 | Row with the §6 columns, status `new`, check result `not-required` for ₡0, values stored as text (a name starting `=` stays text) | Pass (owner-checked in the sheet: TFREE rows `not-required`, no file; the `=1+1 …` name shows as text) | owner, sheet rows |
| 3 | At capacity, a ₡0 registration is refused `SOLD_OUT`; two simultaneous ₡0 registrations for the last place never both succeed | Pass (owner-checked in the sheet: exactly one row for the two simultaneous requests, and only the second request of the cancel test was rejected without a row) | API case R18: one `ok`, the other `SERVER_ERROR` (busy lock); a retry then gave `SOLD_OUT` |
| 3 | A registration set to `refund/cancelled` frees the place (BR-E10): the event stopped showing as sold out within about 3 minutes (events cache); a new ₡0 registration was accepted and the next one was refused `SOLD_OUT` again | Pass | live edit 3 |
| 4 | Closed, unpublished or full event with a paid registration: stored, flagged, the visitor is told Cami will contact them | Pass (visitor side). Rows for a full event: owner-checked (`sold out at submit`, needsReview TRUE, file stored); rows for the unpublished event (`event closed at submit`, ₡25 000) and the changed coupon (`coupon changed`) from the form run: owner-checked | `form-es-1280-flagged-event-unpublished.jpg` |
| 5 | Invalid data or unknown event code rejected, nothing stored | Pass (responses; owner-checked: no row in any tab for the rejected requests, only the valid registrations and the honeypot request left rows or counts) | API cases R01–R16 |
| 6 | Retry with a stored `submissionId` returns the original reference, nothing new | Pass | scripted check; one row per participant (owner-checked) |

### US-022 — Automatic check of the payment screenshot
| AC | Case | Result | Evidence |
|---|---|---|---|
| 1 | Receipt with the real account and the exact amount: `ok`, `needsReview` FALSE | Pass (owner-checked: `okES` ok with ₡25 000, `roundOK` ok with ₡10 493) | owner, sheet rows |
| 2 | Wrong account or amount: `mismatch`, failing fields in `checkDetails`, review flag, "not validated" email | Pass for the row (owner-checked: `mismES` mismatch, needsReview TRUE); the email is Pass under US-025 AC2 (owner-checked) | owner, sheet rows |
| 3 | Unreadable image: `unreadable`, review flag, email | Pass for the row (owner-checked: `unreadEN` unreadable, needsReview TRUE); the email is Pass under US-025 AC2 (owner-checked) | owner, sheet rows |
| 4 | Status stays `new`; temporary OCR Doc deleted | Status `new` on the checked rows: Pass (owner-checked); temporary Docs deleted: Pass (owner-checked: no leftover OCR Docs in Drive) | owner |
| 5 | Cami's sample screenshots in the spike | N/A here (done in CMP-024, `SPRINT_02_SPIKE.md`) |  |
| 6 | OCR service refuses the call (rate limit): the row stays `pending`, no "not validated" email yet, the retry trigger writes the result and email later | Pass, shown live on staging in PR #39's Verification (two checks hit the per-user OCR limit and were finished by the trigger about 9 minutes later); not repeated here | PR #39 |
| 7 | Original-format screenshot that OCR cannot read: `unreadable`, no "not validated" email | Pass (owner-checked: both HEIC rows, stored in the original `.heic` format after the conversion fell back, are `unreadable` with the note "stored as original format: heic"; no "not validated" email arrived for them) | owner, sheet rows and inboxes |

### US-023 — Cami manages events, capacity and coupons without a deploy
| AC | Case | Result | Evidence |
|---|---|---|---|
| 1 | A new published event appears within 5 minutes (TNEW) | Pass. First attempt: not listed after 7 minutes because the owner's row was incomplete (owner: "I missed it before"). After the owner completed it, it was listed 2.3 minutes after my first check (name, date, time, price and `registrationOpen` correct); the owner's exact save time was not recorded, so this is an upper bound of about 2.3 minutes plus the owner's delay | listing poll |
| 2 | Invalid row (blank name, invalid time) and a duplicated code are not shown; the others still are | Pass | listing before and after the owner's fixes; the duplicated code stayed hidden throughout |
| 3 | A changed coupon discount applies on the next check (no cache): PROMO10AB changed from 10% to 20% answered 20% and ₡20 000 on the first check after the owner's saved edit. The first attempt answered 10% only because the owner had edited another coupon by mistake (owner confirmed); the code reads the sheet on every coupon check | Pass | live edit 2 |
| 4 | `nameEn`/`descriptionEn` override the automatic translation | Pass | `events?lang=en` for TART |
| 5 | Coupon row with an invalid code, discount or max uses is ignored | Pass (ignored: `COUPON_INVALID`; owner-checked: the alert email lists the invalid sheet rows) | API cases C04/C06 |
| — | A past event (started) is not listed (BR-E09); the two closed test events disappeared from the listing after their start time passed | Pass | listing |
| — | A deleted event (TNEW) leaves the listing within about 6 minutes of the owner's delete (events cache up to 5 minutes) | Pass | live edit 1 restore |

### US-024 — Abuse metrics and alerts
| AC | Case | Result | Evidence |
|---|---|---|---|
| 1 | Metrics row for the day: accepted, honeypot hits, throttled, failed coupon checks, MB uploaded, spam marked | Pass (owner-checked, Metrics row of 2026-10-21 after the burst: accepted 39, honeypotHits 12, throttled 23, couponFailures 39, uploadedMb 1.3, spamMarked 1). The `throttled` value is lower than the 30 the burst should have produced: see observation 7 in §5 | owner, Metrics tab |
| 2 | Over a threshold: one alert email for the day (at most one per Costa Rica day; a finding made after the day's email waits for the next day's email, FFR-029). Thresholds crossed with `MAIL_REPLY_TO` on the owner's test address and `LIMIT_UPLOADS_PER_DAY` lowered to 2 (§3.8) | Pass (owner-checked: the alert email, sent after midnight Costa Rica time as designed, lists the burst findings: honeypot 12 (limit 10), throttled requests 23 (limit 20), daily upload cap reached, together with the invalid sheet rows) | burst run, owner, inbox |
| 3 | Honeypot filled: normal-looking success, nothing stored, hit counted | Pass (response; owner-checked: the hit is counted in Metrics); 11 more honeypot posts all answered `ok` (§3.8) | API case R14, burst run |

### US-025 — Participant emails
| AC | Case | Result | Evidence |
|---|---|---|---|
| 1 | Confirmation (ES and EN) with event, date/time, amount, reference, reply-to camila@; Gmail and Outlook | Pass (owner-checked in both inboxes: confirmation in ES and EN for the free-event registrations; `okES` and `roundOK` got a confirmation only; sender `no-reply@`, Reply-To camila@, amounts as ₡25 000 (ES) and ₡25,000 (EN)) | owner, inboxes |
| 2 | "Payment not validated" for `mismatch` and `unreadable` (ES and EN); Gmail and Outlook | Pass (owner-checked in both inboxes: `mismES` ES and `unreadEN` EN each got the "not validated" email besides the confirmation; the PNG row, whose check was a mismatch, got one too) | owner, inboxes |
| 3 | Email cannot be sent: row stays, `email failed`, review flag | N/A on staging (cannot be provoked from the client); covered by the local tests in PR #39 | PR #39 |
| 4 | Templates approved by Cami | N/A: release gate (BR-E11), not part of this verification |  |
| 5 | "Registration received" for a stored-and-flagged registration (ES and EN); Gmail and Outlook | Pass (owner-checked in both inboxes: `recvES`/`recvEN` and the two form-run rows got "registration received", which does not promise a place) | owner, inboxes |

### US-005 — Real client testimonials (AC2 check carried over from CMP-017)
| AC | Case | Result | Evidence |
|---|---|---|---|
| 2 | A testimonial with no Spanish long version shows the English long version under "ver más"; only that testimonial expands; "ver menos" collapses it. Test data not committed (reverted) | Pass | `us005-ac2-featured-expanded-es.jpg` |
| 3 | No "ver más" where there is no long version | Pass | same run: 2 controls for 4 testimonials |
| 1 | The four testimonials still render with the events section present | Pass | `page-events-*`, `page-noevents-*` |

## 3. Integration checks

### 3.1 Contract §10 end-to-end list (API level, staging)
27 of 27 cases pass (run before the re-paste of PR #44). The requests are `events`, `coupon` and `register`
posted as `text/plain` JSON from a script; "valid" cases use a distinct synthetic participant.
| ID | Request | Expected | Result |
|---|---|---|---|
| C01 | `events` (es) | `data.sinpe` with number, accountName, isPlaceholder; each event with eventCode, name, description, date, time, startsAt (`-06:00`), registrationClosesAt, priceCrc, imageUrl, soldOut, registrationOpen | Pass |
| C02 | coupon, unknown event code | `EVENT_NOT_FOUND` | Pass |
| C03 | coupon on a closed event | `REGISTRATION_CLOSED` | Pass |
| C04 | coupon, code too short | `VALIDATION_ERROR` couponCode `invalid_coupon_format` | Pass |
| C05 | coupon, bad email | `VALIDATION_ERROR` email `invalid_email` | Pass |
| C06 | coupon rows with discount 150 and max uses 0 | `COUPON_INVALID` (rows ignored) | Pass (2 cases) |
| C07a | coupon whose `expiresOn` is today (Costa Rica) | valid, 10% | Pass |
| C07b | coupon 15% on ₡12 345 | ₡10 493 (nearest colón) | Pass |
| C08 | coupon of another event | `COUPON_INVALID` | Pass |
| R01 | register, `submissionId` not a UUID | `VALIDATION_ERROR` submissionId `required` | Pass |
| R02 | register, `eventCode` `x` | `VALIDATION_ERROR` eventCode `required` | Pass |
| R03 | participantName 1 character | `VALIDATION_ERROR` participantName | Pass |
| R04 | participantName 81 characters | `VALIDATION_ERROR` participantName | Pass |
| R05 | email `bad` | `invalid_email` | Pass |
| R06 | WhatsApp without `+` and country code | `invalid_phone` | Pass |
| R07 | couponCode `ab` | `invalid_coupon_format` | Pass |
| R08 | file that is not an image (JPEG name and type) | `invalid_file_type` | Pass |
| R09 | image over 5 MB (about 7.3 MB of base64) | `file_too_large` | Pass |
| R10 | consent false | `consent_required` | Pass |
| R11 | lang `fr` | `VALIDATION_ERROR` lang `required` | Pass |
| R12 | paid event without a file | `VALIDATION_ERROR` file `required` | Pass |
| R13 | unknown event `NOPE1` | `EVENT_NOT_FOUND` | Pass |
| R14 | honeypot `website` filled | `ok: true` with a fake reference, nothing stored | Pass |
| R15 | unknown coupon code at register (with file) | `COUPON_INVALID` | Pass |
| R16 | ₡0 registration on a closed free event | `REGISTRATION_CLOSED` | Pass |
| R18 | two simultaneous ₡0 registrations for the last place | not both `ok` | Pass: one `ok`, one `SERVER_ERROR` (busy lock); a third request then got `SOLD_OUT` |

The race ran against the backend with PR #39's lock flush (see §1). `RATE_LIMITED` and `UPLOAD_CAP_REACHED` were exercised by the abuse burst (§3.8). `SERVER_ERROR` was seen only as the busy-lock answer and as a network failure (§3.4).

### 3.2 Real browser to staging (CORS and redirect path)
Pass. Every call of the form run (events, coupon, register, with a 7 MB base64 body) went through
the browser `fetch` to the staging `/exec` URL, followed the `script.googleusercontent.com`
redirect and parsed as JSON, with no preflight and no console error. A dropped response was handled
as designed.

### 3.3 Layout shift (CLS) while the events answer takes up to 5 s (FFR-004)
Chromium, 1280 and 375 px; the captured staging answer served after a fixed delay.
| Case | 1280 px | 375 px |
|---|---|---|
| Events off (baseline) | 0.001 | 0.006 |
| Answer at 1 s | 0.032 | 0.058 |
| Answer at 4.5 s | 0.032 | 0.056 |
| Answer at 5.5 s (over the 5 s limit) | ticker and section hidden, 0.001 | hidden, 0.006 |

The single shift (0.031 / 0.050) is the 40 px ticker pushing the nav and hero down when it appears.
It stays under the 0.1 "good" threshold; avoiding it would need the ticker's height reserved.
Result: Pass (observation recorded in §5).

### 3.4 Timings and the intermittent 30 s failures (watch item)
Coupon check 4–12 s; register: free 3–10 s, paid 10–27 s (the client POST timeout is 60 s).
Observed twice: one paid registration got `net::ERR_FAILED` about 30 s after the POST with no
response (the form kept the data and showed the retry message; the owner found no row for it, so no
duplicate), and one `events` request timed out at 30 s with no bytes and then answered normally.
Likely cause: Apps Script cold start or load. Not reproduced afterwards.

### 3.5 Regression of the existing sections
Pass. Full-page captures at 1280 / 900 / 375 px in ES and EN, with and without events: the existing
sections are identical in both, no horizontal scroll, no page errors.
`page-{events,noevents}-{es,en}-{1280,900,375}.jpg`.

### 3.6 HEIC and PNG substitute check (no iPhone available)
A real HEIC (brand `heic`, HEVC, about 516 KB) and an iPhone-sized PNG (1170×2532) through the form in
iPhone 13 emulation: both accepted, sent as `image/heic` and `image/png`, references returned.
Stored: the HEIC files in their original `.heic` format (the conversion fell back, FFR-014) and `unreadable` with the note, the PNG converted to `.jpg` (owner-checked in Drive and the sheet). No "not validated" email for the HEIC rows (US-022 AC7).
**Real-iPhone Safari picker/HEIC check deferred to a pre-release check (owner, no device available).**

### 3.7 Checks for PR #44 (CMP-045), owner-checked
Merged with these checks pending; the owner confirmed them after the staging re-paste:
- the English listing and the English confirmation email for the free test event read "Free trial workshop" (automatic translation, the `Translations` entries used);
- the `Translations` tab holds one row per text with `hash` and `text` as plain text;
- the removed TNEW event's text is no longer in the tab (one pruning cycle seen).

### 3.8 Abuse burst (US-020 AC6, US-024 AC2/AC3, `RATE_LIMITED`, `UPLOAD_CAP_REACHED`)
Run last, against the staging backend with `MAIL_REPLY_TO` on the owner's test address and
`LIMIT_UPLOADS_PER_DAY` lowered to 2 by the owner (so no test alert reaches camila@), one fresh
one-minute window per case, requests as in §3.1 with test tags only:
| Case | Requests | Expected | Result |
|---|---|---|---|
| Honeypot | 11 `register` with the hidden field filled | all `ok`, nothing stored, 11 hits counted | Pass: 11 × `ok` |
| Register throttle (`LIMIT_REGISTER_PER_MIN` 20) | 45 `register` with an invalid email in one minute (3 waves of 15) | 20 answered normally, the rest `RATE_LIMITED` | Pass: 20 × `VALIDATION_ERROR`, 25 × `RATE_LIMITED` |
| Failed coupon checks (`LIMIT_COUPON_FAILS_PER_MIN` 10) | 12 checks with unknown codes in one minute, then a valid coupon in the same minute | 10 × `COUPON_INVALID`, then `RATE_LIMITED` for coupon checks until the minute ends | Pass: 10 × `COUPON_INVALID`, 2 × `RATE_LIMITED`; the valid coupon in that minute `RATE_LIMITED`; in the next minute `ok` |
| Coupon checks per minute (`LIMIT_COUPON_CHECKS_PER_MIN` 30) | 32 valid checks in one minute | 30 answered, the rest `RATE_LIMITED` | Pass: 30 × `ok`, 2 × `RATE_LIMITED` |
| Daily upload cap (`LIMIT_UPLOADS_PER_DAY` lowered to 2; many screenshots already stored that day) | a paid `register` with a screenshot; then a ₡0 `register` | paid: `UPLOAD_CAP_REACHED`; ₡0: unaffected | Pass: `UPLOAD_CAP_REACHED`; the free registration `ok` |
In the form the cap answer reads "No podemos recibir más capturas por ahora. Inténtalo más tarde o escribe a Cami a camila@lifetoolscr.com.", with the typed data and the chosen file kept (`form-es-1280-upload-cap.jpg`, the email is masked).
Alert email (US-024 AC2): the thresholds were crossed, and the backend sent its one alert email for the Costa Rica day after midnight (a finding made after that day's email waits for the next day's, FFR-029; the email already sent that day had listed the invalid sheet rows). Owner decision (2026-10-22), asked whether to keep the test settings until the alert arrives or restore them now: "Keep until the alert (Recommended)". The owner-checked email lists, in Spanish and English: the invalid Events rows (a name, a time and the duplicated event code), the invalid Coupons rows (a code, a discount and a max uses), `2026-10-21 Honeypot: 12 (límite / limit 10)`, `2026-10-21 Throttled requests / solicitudes limitadas: 23 (20)` and `2026-10-21 Daily upload cap reached / límite diario de capturas alcanzado`, with the footer that invalid rows are ignored until fixed. The owner then restored `MAIL_REPLY_TO` (camila@) and `LIMIT_UPLOADS_PER_DAY` (100) and read the Metrics row: accepted 39, honeypotHits 12, throttled 23, couponFailures 39, uploadedMb 1.3, spamMarked 1.
Counter check: the honeypot count is exact (11 sequential posts plus the earlier one: 12). `throttled` is 23 where the burst should have produced 30 (25 `RATE_LIMITED` answers to `register` plus 5 to `coupon`); see observation 7 in §5.

## 4. Evidence index
All files are in `docs/sprints/evidence/sprint-02/` (JPEG, masked, under 5 MB in total):
`form-es-1280-upload-cap.jpg` (the upload-cap answer in the form), `page-*` (layout and regression; `page-events-art-*` shows the event with an image, in EN with the `nameEn`/`descriptionEn` override), `form-*` (form states; the SINPE blocks show test values and registration references are masked), `mobile-iphone13-heic-*` (test values shown, reference masked),
`us005-ac2-featured-expanded-es.jpg`. Sheet, Drive and inbox results were checked by the owner and are recorded in the tables; no screenshots of them are committed. Every image that can show the payment block or a reference was checked on a contact sheet before the last push: the SINPE blocks show test values or are masked, references are masked, and no email address or participant name appears.

Note: `form-es-1280-flagged-event-unpublished.jpg` and `form-es-1280-flagged-coupon-changed.jpg` look the same on purpose: the visitor sees the same message whichever flag the backend sets (event closed/unpublished, or coupon changed); the difference is only in the sheet row.

## 5. Failures, observations and proposed tickets
| # | Item | Class | Proposal |
|---|---|---|---|
| 1 | TNEW not listed after 7 minutes in the first attempt (US-023 AC1) | Not a defect: the row was incomplete (owner confirmed); listed after the fix | none |
| 2 | The ticker's appearance shifts the page down by 40 px (CLS 0.03–0.06) | Observation | optional ticket to reserve the ticker height |
| 3 | `index.html` links `/favicon.svg`, which is not in `public/` (404 on every page load, also in production) | Observation, pre-existing | small ticket: add the favicon or remove the link |
| 4 | Intermittent 30 s hangs on staging (§3.4) | Observation | keep watching; no ticket yet |
| 5 | Staging script properties reached the 50-property UI limit (reported by Agent 1) | Observation | PR #44 (CMP-045) is the lasting fix |
| 6 | Raw HEIC uploads are stored in their original `.heic` format (the server's JPEG conversion falls back): this is the first raw-HEIC test (the spike did not run one). US-021 AC1 allows the fallback, so it is not a Fail, but a payment photo taken with an iPhone camera is then not readable by the OCR check (needs manual review), while an iPhone screenshot (PNG) is converted and checked | AC wording is satisfied; user-impact observation | decide whether a ticket is needed: client-side conversion needs a library (TECH_STACK + ADR), or tell visitors to upload a screenshot; the real-iPhone picker may already convert to JPEG (deferred check) |
| 7 | The `throttled` counter of the `Metrics` row is lower than the number of `RATE_LIMITED` answers: 23 recorded for a burst that produced 30 (25 for `register`, 5 for `coupon`). From the code (not reproduced, so as not to send another alert to camila@): `bumpMetric_` adds to the cell by reading it and writing it back under `tryShortLock_(5000)`, which, when the script lock stays busy for 5 s, silently carries on WITHOUT the lock (the comment says a slightly wrong limit is better than a failing request). The `register` wave sent 15 requests at once, so several increments collide and one is lost; the sequential honeypot count is exact. The 23 still crossed the threshold of 20 and the alert went out, but under a burst the counters can read low and an alert near its threshold could be missed. Not a Fail of US-024 (AC1 does not promise exact counts) | Observation / low-severity defect | ticket: make the daily counters robust under parallel requests (for example keep them in a script property updated under a longer lock wait, or retry, or write them from the 5-minute trigger), or document the tolerance and set the thresholds with a margin. `bumpWindow_` (the per-minute limit counters) uses the same pattern with a 3 s wait (`tryShortLock_(3000)`), so the per-minute limiters could drift under the same parallel load too; the burst's limits were exact (20/25, 30/2), so this is not a finding here, but the ticket should cover it |
