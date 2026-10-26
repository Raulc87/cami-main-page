# EVENTS_API_CONTRACT

Contract between the site (consumer, React) and the events backend (provider, Google Apps
Script web app, [ADR-008](../decisions/ADR-008-events-backend-google-apps-script.md)). It must be
locked before the frontend and backend workstreams start in parallel. Changes follow AGENTS.md →
Change management: update this document first, bump the version, notify both owners.

## Metadata
- Version: 1.5 (v1.1: §6 validation applies to published `Events` rows only, owner 2026-10-20
  — CMP-038; v1.2: §3.3 original-format fallback for the screenshot, owner 2026-10-20, and §8
  scope of `required` — CMP-039; v1.3: §6 reserved event codes, codes stored as text, and ₡0
  on a duplicated code — CMP-040; v1.4: §6 `Translations` tab and reserved name — CMP-046; v1.5: §3.3/§6 optional
  `contactOptIn`, owner 2026-10-26 — CMP-058)
- Status: Approved — LOCKED (v1.0 on merge of PR #21; v1.1 on merge of PR #34; v1.2 on merge of
  PR #35; v1.3 on merge of PR #37; v1.4 on merge of PR #45; v1.5 Approved (on merge of PR #52))
- Related spec / requirements: [FEATURE_SPEC_events_registration.md](FEATURE_SPEC_events_registration.md)
  (FFR-001..FFR-033)
- Related stories: US-017..US-025
- Related ADRs: ADR-008
- Consumer (owner): frontend workstream (Sprint 02 plan)
- Provider (owner): backend workstream (Sprint 02 plan)

## 1. Conventions
- Field naming: `camelCase` in JSON; spreadsheet column headers as listed in §6.
- Identifiers and codes: English, upper snake case for error codes (`SOLD_OUT`), lower snake
  case for field error codes (`invalid_email`).
- User-facing text: the consumer localizes every message from the codes in §4/§8 through
  `UI_TEXT` (EN/ES). The provider never returns display text, except event `name` and
  `description`, which it returns in the requested language (§3.1).
- Encoding: UTF-8. Dates `YYYY-MM-DD`, times `HH:mm` (24 h), instants ISO 8601 with offset
  `-06:00` (`America/Costa_Rica`, no DST). Money: integer colones (`priceCrc`, `amountDueCrc`).

## 2. Endpoint / Interface
| Item | Value |
|---|---|
| Base URL | The web app `/exec` URL (config `VITE_EVENTS_API_URL`) |
| Methods | `GET` (`action=events`, no personal data); `POST` (`action=coupon`, `action=register` — anything carrying an email goes in the body, never the URL) |
| Request content type | `GET`: query string. `POST`: `text/plain;charset=utf-8` whose body is a JSON string (avoids a CORS preflight, which Apps Script cannot answer) |
| Response content type | `application/json` (Apps Script `ContentService`, served through the `script.googleusercontent.com` redirect; the consumer uses `fetch` with `redirect: "follow"`) |
| HTTP status | **Always 200** — Apps Script cannot set status codes. Success or failure is in the body (`ok`) |
| Max request size | 8 MB body (a 5 MB file encodes to ≈ 6.7 MB of base64) |
| Authentication | None (anonymous). Abuse controls in FEATURE_SPEC §12 |
| CORS / origin | Not enforceable (ADR-008). The consumer must not send custom headers |

## 3. Requests

### 3.1 `GET ?action=events&lang=es|en`
Returns every published event that has not started (BR-E09), ordered by start, each with the
`registrationOpen` and `soldOut` flags (a closed or sold-out event is still listed, with its
button disabled). `lang` selects the language of `name`/`description` (default `es`).

### 3.2 `POST` body `{"action":"coupon","eventCode":"EV1","couponCode":"XXXXXXXX","email":"a@b.cr"}`
Checks one coupon for one event and one email. Sent as a `text/plain` POST like `register` so the
email never appears in a URL (FNFR-001). Throttled globally.

### 3.3 `POST` body (`action=register`)

```json
{
  "action": "register",
  "submissionId": "7b1e2c1e-5f1a-4d6e-9c2b-0b9a3f1d2e44",
  "eventCode": "EV1",
  "participantName": "María Pérez",
  "email": "maria@example.com",
  "whatsapp": "+50684104791",
  "couponCode": "PROMO10AB",
  "lang": "es",
  "consent": true,
  "contactOptIn": false,
  "website": "",
  "file": { "name": "IMG_1234.HEIC", "mimeType": "image/heic", "base64": "..." }
}
```

| Field | Type | Required | Validation rules (client AND server) | Normalization | Stored as |
|---|---|---|---|---|---|
| `action` | string | yes | `register` | — | — |
| `submissionId` | string | yes | UUID v4 | lowercase | `submissionId` |
| `eventCode` | string | yes | `^[A-Z0-9-]{2,20}$`, exists in `Events` | trim, upper | `eventCode` |
| `participantName` | string | yes | 2–80 chars after trim | trim, collapse spaces | `participantName` (formula-neutralized) |
| `email` | string | yes | valid email, ≤ 254 chars | trim, lowercase | `email` |
| `whatsapp` | string | yes | E.164: `^\+[1-9]\d{7,14}$` | strip spaces, `-`, `(`, `)` | `whatsapp` |
| `couponCode` | string | no | `^[A-Z0-9]{8,20}$` when present | trim, upper; empty → none | `couponCode` |
| `lang` | string | yes | `es` or `en` | — | `lang` |
| `consent` | boolean | yes | must be `true` | — | `consentAt` (server time) |
| `contactOptIn` | boolean | no | `true` or `false`; missing → `false` (the optional, unticked second checkbox, FFR-018) | — | `contactOptIn` (`TRUE` / `FALSE`) |
| `website` | string | yes | honeypot: must be `""` | — | not stored |
| `file` | object/null | when amount due > ₡0 | image, ≤ 5 MB decoded; types JPEG, PNG, WebP, HEIC/HEIF (detected from content, not name) | stored as JPEG (`.jpg`), converted with `Blob.getAs` (spike); if conversion fails, the original is stored with its own extension (`.png`, `.webp`, `.heic`) and `checkDetails` gets the note `stored as original format: <ext>` (a note, not a flag; if OCR then cannot read it, `checkResult` is `unreadable` with no retries and no "not validated" email, FFR-017; owner, 2026-10-20) | Drive file → `screenshotUrl` |

Unknown fields: ignored. A request with a non-empty `website` returns `ok: true` with a fake
reference and stores nothing (do not tell bots they were caught); it is counted in `Metrics`.

## 4. Enumerations / codes
| Code | Meaning / labels per language |
|---|---|
| `status` `new` | New registration (set by the server) |
| `status` `confirmed` | Payment confirmed by Cami |
| `status` `refund/cancelled` | Refunded or cancelled by Cami; frees the place and the coupon use |
| `status` `spam` | Junk registration marked by Cami; frees the place, counted in metrics |
| `checkResult` `ok` | Account and exact amount found |
| `checkResult` `mismatch` | Account or amount not found/different (details in `checkDetails`) |
| `checkResult` `unreadable` | No usable text extracted |
| `checkResult` `not-required` | Amount due ₡0 |
| `checkResult` `pending` | Not checked yet |

## 5. Server-generated fields
| Field | Value, format, timezone |
|---|---|
| `timestamp` | ISO 8601, `-06:00` |
| `reference` | `<eventCode>-<YYMMDD>-<4 random A-Z0-9>`, e.g. `EV1-261105-K7Q2` |
| `amountDueCrc` | `round(priceCrc × (1 − discountPercent/100))`, nearest colón |
| `screenshotUrl` | Drive file URL in `<root>/<eventCode>/` |
| `needsReview` | FFR-030: `TRUE` iff `checkResult` is `mismatch`/`unreadable`, or `checkDetails` holds a flag (`event closed at submit`, `sold out at submit`, `coupon changed`, `duplicate event code`, `email failed`); `pending`, `ok`, `not-required` alone → `FALSE` |

## 6. Persistence mapping
Spreadsheet (Workspace `lifetoolscr.com`), tabs:
- `Events`: `eventCode`, `name`, `description`, `nameEn`, `descriptionEn`, `date`, `time`,
  `priceCrc`, `capacity`, `imageUrl`, `published` (`nameEn`/`descriptionEn` optional
  overrides of the automatic translation).
- `Coupons`: `eventCode`, `couponCode`, `discountPercent` (1–100), `maxUses`, `active`,
  `expiresOn` (optional).
- `<eventCode>` (one per event, created on first registration), columns in order:
  `timestamp`, `submissionId`, `reference`, `eventCode`, `participantName`, `email`,
  `whatsapp`, `lang`, `couponCode`, `discountPercent`, `amountDueCrc`, `screenshotUrl`,
  `checkResult`, `checkDetails`, `needsReview`, `status`, `consentAt`, `notes`, `contactOptIn`
  (v1.5; added last so existing tabs keep their columns: the script adds the header to a tab
  that lacks it, and older rows stay blank, read as `FALSE`).
- `Metrics`: one row per day — `date`, `accepted`, `honeypotHits`, `throttled`,
  `couponFailures`, `uploadedMb`, `spamMarked`.
- `Translations` (created by the script, CMP-045): `hash`, `text` — the automatic English
  translation of an event text, keyed by a hash of the Spanish text (FFR-028); rows no valid event
  uses are pruned.

Validation of rows Cami edits (applied each time the backend reads them; an invalid row is
skipped and listed in the next alert email). Unpublished `Events` rows (drafts) are not
validated or listed, except that a code shared with a published row is reported as duplicated
(FFR-019; owner, 2026-10-20):

| Tab.column | Rule |
|---|---|
| `Events.eventCode` | required, `^[A-Z0-9-]{2,20}$`, unique (duplicates: all rows skipped, FFR-019); not the name of any non-event tab (currently `EVENTS`, `COUPONS`, `METRICS`, `TRANSLATIONS`; tab names match case-insensitively); written to registration cells as text, so Sheets never reads a code like `2026-11` or `1E5` as a date or number; the code columns of `Events` and `Coupons` are formatted as plain text. A paid registration for a duplicated code uses the first valid published row of that code, or, if none is published, the first valid row (FFR-019) |
| `Events.name`, `Events.description` | required text, ≤ 120 / ≤ 600 characters |
| `Events.nameEn`, `Events.descriptionEn` | optional, same limits |
| `Events.date` | required, a valid date (Sheets date or `YYYY-MM-DD`) |
| `Events.time` | required, `HH:mm` 24 h |
| `Events.priceCrc` | required integer ≥ 0 (0 = free) |
| `Events.capacity` | required integer ≥ 1 |
| `Events.imageUrl` | optional `https://` URL; empty or invalid → Lifetools logo |
| `Events.published` | checkbox/boolean; only `TRUE` publishes |
| `Coupons.eventCode` | required, must match a valid event |
| `Coupons.couponCode` | required, `^[A-Z0-9]{8,20}$`, unique per event |
| `Coupons.discountPercent` | required integer 1–100 (`10` or `10%` accepted) |
| `Coupons.maxUses` | required integer ≥ 1 |
| `Coupons.active` | checkbox/boolean; only `TRUE` is usable |
| `Coupons.expiresOn` | optional date; usable through 23:59:59 Costa Rica time of that date (inclusive) |

Counting rule (capacity and coupon uses): rows with status `new` or `confirmed`, flagged or not,
count; `refund/cancelled` and `spam` do not.

Drive: `<root folder>/<eventCode>/<ParticipantName>_<YYYY-MM-DD>_<eventCode>.<ext>` (`ext` = `jpg`,
or the original extension when conversion fails, §3.3; registration date; BR-E04
normalization; `_2`, `_3`… on collision).

## 7. Responses
Same keys always:

```json
{ "ok": true, "data": { }, "error": null }
{ "ok": false, "data": null, "error": { "code": "VALIDATION_ERROR", "fields": { "email": "invalid_email" } } }
```

| Request | `data` on success |
|---|---|
| `events` | `{ "sinpe": { "number", "accountName", "isPlaceholder" }, "events": [ { "eventCode", "name", "description", "date", "time", "startsAt", "registrationClosesAt", "priceCrc", "imageUrl" (or null → logo), "soldOut", "registrationOpen" } ] }` |
| `coupon` | `{ "discountPercent", "amountDueCrc" }` |
| `register` | `{ "reference", "flagged": bool, "duplicateSubmission": bool }` |

| Error code | When | Consumer behavior |
|---|---|---|
| `VALIDATION_ERROR` | Any field rule fails (§8 per field) | Show field messages, keep data |
| `EVENT_NOT_FOUND` | Unknown or duplicated event code with no row to flag | Message, reload events |
| `REGISTRATION_CLOSED` | `coupon` check on a closed event; or a `register` **without** a file (₡0) for a closed/unpublished event (BR-E13) | Message; a `register` **with** a file is stored and flagged instead (FFR-024) |
| `SOLD_OUT` | `register` **without** a file (₡0) when capacity is reached (BR-E13) | Show "Agotado / Sold out"; with a file → stored and flagged |
| `ALREADY_REGISTERED` | Same email already has a counting row for this event | Show message (FFR-027) |
| `COUPON_INVALID` | `coupon` check: unknown, inactive, expired or other event. `register`: unknown code for the event (any request) | Show message, full price |
| `COUPON_EXHAUSTED` | `coupon` check, or `register` without a file (₡0): `maxUses` reached | Show message, full price |
| `COUPON_ALREADY_USED` | `coupon` check, or `register` without a file: this email already used this coupon | Show message, full price |
| `RATE_LIMITED` | Global throttle reached | "Try again in a few minutes" |
| `UPLOAD_CAP_REACHED` | Daily upload cap reached | "Try again later / contact Cami" |
| `SERVER_ERROR` | Anything else | Retry message, keep data, same `submissionId` |

For a `register` **with** a file whose coupon exists for the event but is no longer valid
(inactive, expired, exhausted, already used by this email), the server keeps the discount, stores
the row and flags `coupon changed` (BR-E13, FFR-024).

Rule BR-E13: the server does not need to know when the form opened. A `register` with a file
is never refused for state that changed (closed, unpublished, sold out, coupon); it is stored and
flagged. A `register` without a file (₡0) is refused with the matching code. The frontend never
shows the form for an event the last `events` response marked closed or sold out.

## 8. Field error codes
| Code | Meaning |
|---|---|
| `required` | Missing value; also a missing or malformed value the form never sends (`submissionId`, `eventCode`, `lang`, `participantName` outside 2–80 characters) |
| `invalid_email` | Not a valid email |
| `invalid_phone` | Not E.164 (`+` and country code) |
| `invalid_coupon_format` | Coupon not `A-Z0-9`, 8–20 chars |
| `invalid_file_type` | Not an accepted image type |
| `file_too_large` | Over 5 MB |
| `consent_required` | Consent not given |

## 9. Configuration
| Variable | Side | Purpose |
|---|---|---|
| `VITE_EVENTS_API_URL` | Frontend (build time, public) | Web app `/exec` URL (staging vs production build) |
| `SPREADSHEET_ID` | Script property | Events/registrations spreadsheet |
| `DRIVE_ROOT_FOLDER_ID` | Script property | Root folder for screenshots |
| `SINPE_NUMBER`, `SINPE_ACCOUNT_NAME` | Script property | Shown in instructions and used by the check (placeholder until Cami confirms, BR-E01) |
| `MAIL_FROM_ALIAS`, `MAIL_REPLY_TO` | Script property | Sender alias (if available) and `camila@lifetoolscr.com` |
| `LIMIT_REGISTER_PER_MIN` = 20 | Script property | Max `register` calls per minute, all clients (fixed 1-minute window, `CacheService`); over → `RATE_LIMITED` |
| `LIMIT_COUPON_CHECKS_PER_MIN` = 30 | Script property | Max `coupon` calls per minute, all clients; over → `RATE_LIMITED` |
| `LIMIT_COUPON_FAILS_PER_MIN` = 10 | Script property | Max failed coupon checks per minute; over → `RATE_LIMITED` for coupon checks until the minute ends |
| `LIMIT_UPLOADS_PER_DAY` = 100 | Script property | Max stored screenshots per day (Costa Rica day, resets 00:00); over → `UPLOAD_CAP_REACHED` (₡0 registrations unaffected) |
| `LIMIT_UPLOAD_MB_PER_DAY` = 300 | Script property | Max MB stored per day; over → `UPLOAD_CAP_REACHED` |
| `ALERT_HONEYPOT_PER_DAY` = 10 | Script property | Alert email when the day's honeypot hits exceed it (FFR-029) |
| `ALERT_THROTTLED_PER_DAY` = 20 | Script property | Alert email when the day's throttled requests exceed it |

Initial values above; the owner may change them in script properties without a contract change
(the names are the contract). A paid `register` refused by `RATE_LIMITED` or
`UPLOAD_CAP_REACHED` keeps the visitor's data and `submissionId` for a retry.

The SINPE number and account name reach the browser only inside the `events` response
(`sinpe` object), never in the repo. Local development: the frontend points
`VITE_EVENTS_API_URL` at the **staging** deployment (staging spreadsheet and folder, ADR-007
decision 6); there is no local Apps Script runtime.

## 10. Test obligations
How they are met: there is no test runner yet (TECH_STACK §8). Each PR that implements a side of
this contract runs a **manual test checklist against the staging deployment** from a browser on
the site origin and records the evidence (case, input, response, row/file screenshot) in the PR
body or in `docs/sprints/SPRINT_<NN>_VERIFICATION.md`. Adopting an automated runner needs an ADR.

The checklist must cover:
- Every validation rule: at least one valid and one invalid case, on both sides.
- Every error code the provider can return.
- End-to-end: happy path (paid, coupon, free event); one validation failure; sold out (₡0
  refused, paid stored and flagged); duplicate email; retry with the same `submissionId`; event
  closed after the form opened (paid stored and flagged); coupon changed after apply (paid
  stored and flagged).
