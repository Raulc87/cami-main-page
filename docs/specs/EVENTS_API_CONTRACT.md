# EVENTS_API_CONTRACT

Contract between the site (consumer, React) and the events backend (provider, Google Apps
Script web app, [ADR-008](../decisions/ADR-008-events-backend-google-apps-script.md)). It must be
locked before the frontend and backend workstreams start in parallel. Changes follow AGENTS.md →
Change management: update this document first, bump the version, notify both owners.

## Metadata
- Version: 1.0
- Status: Approved — LOCKED (on merge of PR #N)
- Related spec / requirements: [FEATURE_SPEC_events_registration.md](FEATURE_SPEC_events_registration.md)
  (FFR-001..FFR-030)
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
| Methods | `GET` (read: `action=events`, `action=coupon`); `POST` (write: `action=register`) |
| Request content type | `GET`: query string. `POST`: `text/plain;charset=utf-8` whose body is a JSON string (avoids a CORS preflight, which Apps Script cannot answer) |
| Response content type | `application/json` (Apps Script `ContentService`, served through the `script.googleusercontent.com` redirect; the consumer uses `fetch` with `redirect: "follow"`) |
| HTTP status | **Always 200** — Apps Script cannot set status codes. Success or failure is in the body (`ok`) |
| Max request size | 8 MB body (a 5 MB file encodes to ≈ 6.7 MB of base64) |
| Authentication | None (anonymous). Abuse controls in FEATURE_SPEC §12 |
| CORS / origin | Not enforceable (ADR-008). The consumer must not send custom headers |

## 3. Requests

### 3.1 `GET ?action=events&lang=es|en`
Returns published events that are still open for registration or sold out, ordered by start.
`lang` selects the language of `name`/`description` (default `es`).

### 3.2 `GET ?action=coupon&eventCode=EV1&couponCode=XXXX&email=a@b.cr`
Checks one coupon for one event and one email. Throttled globally.

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
| `website` | string | yes | honeypot: must be `""` | — | not stored |
| `file` | object/null | when amount due > ₡0 | image, ≤ 5 MB decoded; types JPEG, PNG, WebP, HEIC/HEIF (detected from content, not name) | stored as JPEG (`.jpg`) — conversion method decided in the spike | Drive file → `screenshotUrl` |

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
| `needsReview` | `TRUE` when `checkResult` ≠ `ok`/`not-required`, or `checkDetails` has a flag (FFR-024, FFR-019) |

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
  `checkResult`, `checkDetails`, `needsReview`, `status`, `consentAt`, `notes`.
- `Metrics`: one row per day — `date`, `accepted`, `honeypotHits`, `throttled`,
  `couponFailures`, `uploadedMb`, `spamMarked`.

Counting rule (capacity and coupon uses): rows with status `new` or `confirmed`, flagged or not,
count; `refund/cancelled` and `spam` do not.

Drive: `<root folder>/<eventCode>/<ParticipantName>_<YYYY-MM-DD>_<eventCode>.jpg` (registration
date; BR-E04 normalization; `_2`, `_3`… on collision).

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
| `REGISTRATION_CLOSED` | Event closed or unpublished **before** the form was shown (coupon/precheck) | Message; registrations after payment are stored and flagged instead (FFR-024) |
| `SOLD_OUT` | Capacity reached | Show "Agotado / Sold out" |
| `ALREADY_REGISTERED` | Same email already has a counting row for this event | Show message (FFR-027) |
| `COUPON_INVALID` | Unknown, inactive, expired or other event | Show message, full price |
| `COUPON_EXHAUSTED` | `maxUses` reached | Show message, full price |
| `COUPON_ALREADY_USED` | This email already used this coupon | Show message, full price |
| `RATE_LIMITED` | Global throttle reached | "Try again in a few minutes" |
| `UPLOAD_CAP_REACHED` | Daily upload cap reached | "Try again later / contact Cami" |
| `SERVER_ERROR` | Anything else | Retry message, keep data, same `submissionId` |

Note: `SOLD_OUT` after payment follows FFR-024 (stored and flagged), because the visitor may
have paid; only a `register` that arrives when the event was already sold out before the form
opened is refused — the frontend never shows payment instructions for a sold-out event.

## 8. Field error codes
| Code | Meaning |
|---|---|
| `required` | Missing value |
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
| `LIMITS_*` | Script property | Throttle, daily upload cap, alert thresholds (FEATURE_SPEC §12) |

The SINPE number and account name reach the browser only inside the `events` response
(`sinpe` object), never in the repo. Local development: the frontend points
`VITE_EVENTS_API_URL` at the **staging** deployment (staging spreadsheet and folder, ADR-007
decision 6); there is no local Apps Script runtime.

## 10. Test obligations
- Every validation rule: at least one valid and one invalid case, on both sides.
- Every error code the provider can return.
- End-to-end from a browser on the site origin against staging: happy path (paid, coupon, free
  event), one validation failure, sold out, duplicate email, retry with the same
  `submissionId`, event closed after the form opened (stored and flagged).
