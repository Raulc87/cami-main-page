# Contributing to Cami Hernandez — Personal Brand Website

This is the page a developer reads first: how to set up, run, check and change the project, and
where things live. It links to the specs and runbooks instead of repeating them. Agents start at
[`AGENTS.md`](AGENTS.md).

- Last updated: 2026-10-27 · Applies to: v1.0.1 plus Sprint 03 (events not yet released)
- Maintainer: the human owner (Raul Casanas)

## What this project is

A bilingual (English/Spanish) one-pager for Cami Hernandez, motivational speaker and life coach,
built with React + Vite and live at `camihernandez.com`. It has an events and registration
feature backed by Google Apps Script. Details are in
[`docs/specs/PROJECT_SPEC.md`](docs/specs/PROJECT_SPEC.md); the document list is in
[`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md).

## Values to have ready

| Value | Where to get it |
|---|---|
| Node.js 20.19 or newer (or 22.12 or newer) and npm (Vite 7 requires it; CI uses Node 20) | [nodejs.org](https://nodejs.org); the stack is in [`TECH_STACK.md`](TECH_STACK.md) |
| `VITE_EVENTS_API_URL` (the events backend `/exec` URL) | Optional. Create `.env.local` from [`.env.example`](.env.example) (git-ignored). Use the **staging** URL, from the owner. Never commit it, paste it in an issue, PR or chat |

Without `VITE_EVENTS_API_URL` the site builds and runs without the events section and ticker,
which is the expected result for most work.

## Set up

1. Clone the repository and enter it.
   ```bash
   git clone https://github.com/Raulc87/cami-main-page.git
   cd cami-main-page
   ```
   Expected: the folder contains `package.json`.
2. Install the dependencies.
   ```bash
   npm install
   ```
   Expected: finishes without errors and creates `node_modules/`.
3. Optional, only to work on events: create the local configuration.
   ```bash
   cp .env.example .env.local
   ```
   Expected: `.env.local` exists; set `VITE_EVENTS_API_URL` in it to the staging URL.

Windows (PowerShell): the same commands, except step 3 is `Copy-Item .env.example .env.local`.

## Run locally

```bash
npm run dev
```

Expected: Vite prints `http://localhost:5173`; the site opens there and the EN/ES toggle in the
nav switches the language.

To check the production build locally:

```bash
npm run build     # writes dist/
npm run preview   # serves dist/ locally
```

Expected: `npm run build` ends without errors; `preview` prints a local URL.

Windows (PowerShell): same commands.

## Test and check

No test runner, linter, formatter or type checker is set up (see
[`TECH_STACK.md` §8](TECH_STACK.md)); adopting one needs an ADR. Acceptance criteria are checked
by hand.

| What | Command | Expected |
|---|---|---|
| Site build | `npm run build` | Finishes without errors |
| Apps Script syntax | `node --check apps-script/<file>.js` for each file you changed | No output (CI runs it on every file) |
| Docs link check | `python3 .github/scripts/check_doc_links.py` | `0 broken` |
| Manual check | `npm run dev`, then the golden path in EN and ES at 1280, 900 and 375 px | Matches the acceptance criteria of the story |

CI runs the Apps Script check and the docs link check on every pull request; the required ones
must be green before merge.

The events backend (`apps-script/`) is deployed by a workflow, not from your machine: staging on
each merge to `main` that changes `apps-script/`, `.github/clasp/`, `.github/scripts/` or the deploy workflow, production only by a manual run the owner approves. Steps:
[`docs/process/events-backend-runbook.md`](docs/process/events-backend-runbook.md). The site
itself is built locally and uploaded by hand:
[`docs/process/release-checklist.md`](docs/process/release-checklist.md).

## Where things live

| Path | What it holds |
|---|---|
| `src/components/` | One component per page section (plus the events components) |
| `src/constants/` | `data.jsx` (list content), `i18n.js` (`UI_TEXT` translations), `colors.js` (palette) |
| `src/api/`, `src/hooks/`, `src/context/` | Events API client, hooks, the language context |
| `src/styles/` | `global.css` |
| `public/images/` | Photos; the Lifetools logo is a marked placeholder until CMP-067 |
| `apps-script/` | The events backend (Google Apps Script) |
| `.github/workflows/`, `.github/scripts/` | CI, deploy and check workflows and their scripts |
| `docs/specs/` | Specs and user stories: the source of truth for behavior |
| `docs/decisions/` | ADRs: why the stack and structure are what they are |
| `docs/process/` | PR workflow, pre-check, release and backend runbooks |
| `docs/sprints/` | Sprint plans and verification |
| [`TICKETS.md`](TICKETS.md) | The `CMP-XXX` ticket list |

Full breakdown: [`docs/specs/ARCHITECTURE_SPEC.md`](docs/specs/ARCHITECTURE_SPEC.md).

## How to make a change

1. Find or write the user story and its acceptance criteria
   ([`docs/specs/USER_STORIES.md`](docs/specs/USER_STORIES.md)). Behavior changes start in the
   spec ([`AGENTS.md` → Change management](AGENTS.md#change-management)).
2. One `CMP-XXX` ticket per branch (`CMP-XXX-short-slug`) and per pull request, titled
   `CMP-XXX: ...`: [`AGENTS.md` → Tickets and branches](AGENTS.md#tickets-and-branches).
3. Write the code following [`AGENTS.md` → Code readability](AGENTS.md#code-readability). List
   content goes in `src/constants/data.jsx`, translatable copy in `UI_TEXT`, colors only from
   `colors.js`.
4. Run the checks above, then [`docs/process/pr-precheck.md`](docs/process/pr-precheck.md), and
   open the pull request as [`docs/process/pr-workflow.md`](docs/process/pr-workflow.md)
   describes. Only the human owner merges.
5. If the change alters setup, commands or structure, update this file in the same pull request.

Never commit secrets, deployment or spreadsheet IDs, or personal data.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| The site shows no events section or ticker | `VITE_EVENTS_API_URL` is empty, or the backend failed or has no events | Expected without the variable. To test events, set it in `.env.local` and restart `npm run dev` |
| A change to `.env.local` has no effect | Vite reads it at start | Stop and restart `npm run dev` |
| `npm install` fails on the Node version | Node older than 20.19, or 21.x (Vite 7 supports `^20.19.0 \|\| >=22.12.0`) | Install Node 20.19 or newer, or 22.12 or newer |
| Port 5173 is busy | Another dev server is running | Stop it, or Vite picks the next port and prints it |
| Docs link check reports a broken link | A moved or renamed file or heading | Fix the link; run the check again |
