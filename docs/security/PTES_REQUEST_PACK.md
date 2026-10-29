# PTES_REQUEST_PACK

Request for a penetration test of the Cami Hernandez website and its event registration backend.
The owner sends this page, unchanged, to each tester the owner contacts, with the plan it points to
([`PENTEST_PLAN.md`](PENTEST_PLAN.md), which holds the scope, the rules of engagement and the
authorization form in its Appendix A). Written for CMP-095. The owner's own checklist (staging setup, cleanup, where to look for a tester) is
[`PTES_STAGING_SETUP.md`](PTES_STAGING_SETUP.md) and is not sent.

A Spanish copy for local testers: [`PTES_REQUEST_PACK.es.md`](PTES_REQUEST_PACK.es.md) (the plan it points to is in English).

Nothing in this page is private: no address, ID, contact or personal data. The tester receives
those separately, after the authorization is signed (section 5).

## 1. The request

Raul Casanas, owner of `camihernandez.com`, asks for a **penetration test following the
Penetration Testing Execution Standard (PTES)** of:

- the website `https://camihernandez.com` (a static React site on shared hosting), and
- its events registration backend, a Google Apps Script web app with three actions: `events`
  (GET), `coupon` and `register` (POST), in two copies: **production** and **staging**.

The system has no user accounts. It handles personal data (name, email, WhatsApp number, consent)
and payment-proof screenshots (SINPE Móvil receipts), and it sends emails. The code, the design
documents and the security baseline are public in the GitHub repository `Raulc87/cami-main-page`.

What to test, how, and what is off limits: [`PENTEST_PLAN.md`](PENTEST_PLAN.md) §1 (scope and
rules of engagement), §3 (assets and threats), §4 (methods and target level: OWASP ASVS 5.0.0
level 2). Please read it before quoting.

## 2. Dates

| Item | Date |
|---|---|
| Deadline: the test has run | **2026-12-26** (time zone `America/Costa_Rica`, UTC-6, no daylight saving) |
| Test window | Agreed with you and written on the authorization form (item 4): inside the period from the signing to the deadline |
| Report delivery | Agreed on the form (item 9), early enough that critical and high findings can be fixed and retested before the deadline |
| Retest of critical and high fixes | After the fixes, on dates agreed then |

The window avoids the 12 hours before an event starts and any backend deploy; the owner tells you
the exact hours when the window is agreed.

## 3. Rules of engagement (summary)

The plan (§1) is the rule; this is the short version.

- Application-level testing only, by hand or with an intercepting proxy. Any automated tool is
  named on the form, runs at the agreed rate, and does not crawl or fuzz without pauses.
- Staging is for every test that writes data, uploads files or sends email. Production is for
  configuration checks and a small number of marked test registrations, for test events named as
  tests that are public while published.
- The backend limits all callers together, and both copies share the owner's Google quotas. You
  stay at or under the request rate and the daily volumes written on the form, and stop when an
  answer reports a rate or upload limit.
- Only your own email inboxes (listed on the form) and invented WhatsApp numbers; payment
  screenshots are synthetic images you make. Every registration you submit carries the marker
  given on the form.
- No denial of service or load testing. Out of scope: Google's and GoDaddy's own systems, the
  owner's and Cami's accounts, the GitHub repository and its workflows (you may read the public
  code), SINPE Móvil and real payments, social engineering.
- If you meet real personal data: stop that line of testing, do not download or keep it, and tell
  the owner the same day.
- The owner can stop the test at any time by message; you stop at once and confirm.
- Findings, severities, and the retest follow the plan §7 and §8.

## 4. Authorization

No test traffic is sent before the **authorization form** (plan, Appendix A) is signed by the
owner and by you. It names you, the systems, the window, the limits, your tools, the report date
and the emergency contact. The owner keeps the signed copy privately.

## 5. What you receive, and when

| Received | When |
|---|---|
| This page, the plan, and the public documents listed in the plan §2 | With this request |
| The filled-in authorization form to sign | When the owner chooses a tester |
| Privately, after both signatures: the production and staging backend addresses, the test event codes and test coupon codes, the marker, the limits for the window, the owner's emergency contact | Before the window opens |

## 6. What the report must contain

As in the plan, §7:

- an executive summary for the owner, in plain language;
- each finding with its severity (CVSS v4.0, mapped to critical, high, medium or low), the
  evidence, the affected OWASP ASVS 5.0.0 requirement (versioned ID such as `v5.0.0-2.3.4`) or
  OWASP Top 10 2025 / API Security Top 10 2023 risk, the steps to reproduce limited to what a fix
  needs, and the recommended fix;
- the tests run with no finding (the ASVS areas covered);
- the cleanup list: everything you created, by environment, with time and reference.

Delivery is private (never in a public place). A critical finding is reported the same day, before
the report. You delete any data you captured once the report is accepted, and confirm it in
writing.

## 7. What we need from you in the reply

1. Your name or company, and a contact. Experience with PTES and with web and API testing.
2. A sample (redacted) report, or a description of its format.
3. Availability for a window before the deadline, and the time you need for the test and the report.
4. The tools you plan to use.
5. The price, and whether one retest of the critical and high fixes is included.
6. Whether you can sign the confidentiality terms on the form (item 10).

The owner chooses the tester and decides about cost; nothing is agreed until the form is signed.
