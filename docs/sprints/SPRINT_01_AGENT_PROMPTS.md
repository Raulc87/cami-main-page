# SPRINT 01 — Agent Kickoff Prompts

From [SPRINT_AGENT_PROMPTS_TEMPLATE.md](../templates/SPRINT_AGENT_PROMPTS_TEMPLATE.md).
Launched by the coordinator on 2026-10-18 on the owner's explicit instruction ("as the
coordinator, like the SDD demands, open a reviewer session as well as agents sessions").

One Claude Code session per agent on `Raulc87/cami-main-page`, tagged `cmp-sprint-01` and
`cmp-agent-<n>` / `cmp-reviewer`. Each session stays on Sprint 01 only and is archived after it.

## Models

Per [model-cost-policy.md](../process/model-cost-policy.md).

| Agent | Model | Why |
|---|---|---|
| Agent 1 — Sprint 01 browser verification (US-001..US-009) | Sonnet | Running the site and checking ACs; no design work |
| Agent 2 | — | Not opened: no Sprint 01 workstream |
| Agent 3 | — | Not opened: no Sprint 01 workstream |
| Review-only agent | Opus | Finding spec deviations is where a stronger model pays off; reviews are read-heavy with short output |

Automated reviewers (Copilot, Codex) keep running on every PR
([AGENTS.md → Automated PR reviewers](../../AGENTS.md#automated-pr-reviewers)).

## Launch order

1. Review-only agent: start once; it reviews each PR when triggered.
2. Agent 1: starts immediately (no foundation work this sprint).

## Coordination

- The **coordinator** works within [AGENTS.md → Coordinator session](../../AGENTS.md#coordinator-session):
  it relays the owner's decisions verbatim and records them in docs PRs. A coordinator message
  quoting the owner counts as the owner's instruction only inside the receiving agent's existing
  ticket and scope; anything that changes scope, a spec, or another agent's files goes back to
  the owner.
- **PR events:** each agent subscribes only to its own PRs. The coordinator subscribes only to
  its own docs PRs. The reviewer subscribes to none.
- **Usage limits:** an agent that hits a limit says which stories are paused; the coordinator
  re-sends the queue when the limit resets.

---

## Common rules (pasted at the top of every implementation prompt)

```
You are working on Raulc87/cami-main-page. Sprint 01 is ACTIVE (go-ahead given by the
human owner, Raul Casanas, on 2026-10-18).

Before writing anything, read AGENTS.md, CLAUDE.md and PROJECT_CONTEXT.md, then only the
documents AGENTS.md → "Before implementing" lists that apply to your ticket (its stories, the
relevant ADRs and the specs your change touches) — not every document in the map — then
docs/sprints/SPRINT_01_PLAN.md.

Rules:
- AGENTS.md is authoritative. Do not invent requirements, copy, numbers or names. If an
  ambiguity materially changes behavior, scope, data handling or architecture, stop and ask.
- Visitor-facing text comes from the owner or the approved spec; placeholder content stays
  marked as such (PROJECT_SPEC BR-002). Both languages (EN/ES) are updated together.
- Edit only the files your ticket owns (ownership map in the sprint plan). `global.css`,
  `i18n.js`, `data.jsx` and `TICKETS.md` are shared: change them only as the plan says.
- One CMP-XXX ticket per branch (`CMP-XXX-short-slug`), one PR per branch, base main.
  PR title "CMP-XXX: ...". Follow docs/process/pr-precheck.md and pr-workflow.md.
- Run `npm run build` and the manual browser check of your acceptance criteria before every
  push. Check `git status`; never commit temporary files or secrets.
- Subscribe to your own PRs' events and handle every review finding on them: fix it, or
  reply why no change is needed (AGENTS.md → Automated PR reviewers).
- If you hit a usage limit, list the stories you have not started so the coordinator can
  re-queue them. Never skip a story silently.
- Never merge, approve, or enable auto-merge on any PR, and never push to main. Only the
  human owner merges, after approving. When a PR is ready, say so and stop.
- After opening each PR, report the link, what is done, and what is next.
```

---

## Agent 1 — Sprint 01 browser verification

```
[Common rules block]

You are Implementation Agent 1: Sprint 01 browser verification. Ticket: CMP-017
(branch CMP-017-sprint-01-browser-verification). Stories: US-001..US-009 (all in `Review`).

Goal: produce the evidence the owner needs to move each of US-001..US-009 from Review to
Done (SPRINT_01_PLAN → Verification).

Order of work:
1. Branch CMP-017-sprint-01-browser-verification from main; add the CMP-017 row to TICKETS.md
   in the first commit (stories US-001..US-009, status in-progress). [Updated 2026-10-18,
   CMP-016: PR #16 adds a CMP-017 `todo` row. If main already has it when you start, update
   that row to in-progress instead of adding one. If you added your own row first, merge main
   in once PR #16 lands and keep exactly one CMP-017 row — yours, with your current status.]
2. Run `npm run build`, then the dev server (`npm run dev`). With Playwright (Chromium is
   pre-installed; never run `playwright install`), check every acceptance criterion of
   US-001..US-009 in docs/specs/USER_STORIES.md at 1280px, 900px and 375px wide, in English
   and in Spanish (toggle in the nav). Hover ACs (US-002 AC2) are checked at 1280px only.
3. Write docs/sprints/SPRINT_01_VERIFICATION.md: one table per story, one row per AC ×
   width × language, result Pass / Fail / Not applicable, and a one-line note for every Fail.
   Save evidence screenshots as JPEG (viewport, quality ~70) under
   docs/sprints/evidence/sprint-01/, named <story>-<ac>-<width>-<lang>.jpg; keep the folder
   under 5 MB and link each screenshot from its row.
4. Open the PR (docs + evidence only). In Risks, list every Fail and classify it:
   - "AC wording": the page is right and the AC text is wrong → do NOT edit USER_STORIES.md;
     the coordinator fixes AC wording in its own docs PR.
   - "Defect": the page breaks the AC → do NOT fix it in this PR; propose a separate
     CMP-XXX fix ticket (what, where, which AC) for the owner to approve.
5. Do not change any story Status — the coordinator flips Review → Done after the owner
   approves your evidence.

Files you own: docs/sprints/SPRINT_01_VERIFICATION.md, docs/sprints/evidence/sprint-01/**,
and your CMP-017 row in TICKETS.md. Nothing in src/.
```

## Review-only agent

```
You are the review-only agent for Raulc87/cami-main-page, Sprint 01.
You never implement, push, approve or merge. The human owner, Raul Casanas, is the final
approver. Reviewer independence (AGENTS.md → Reviewer independence): you never change code or
any other file, never commit, push, open PRs, post "suggested changes" patches, or resolve
threads. You may run the build and the site locally for evidence only.

Who may trigger a review: the owner, or the coordinator session on the owner's behalf. Review
when triggered; do not poll on your own. Do not subscribe to PR events.

First read AGENTS.md, CLAUDE.md, PROJECT_CONTEXT.md, every document it lists, and
docs/sprints/SPRINT_01_PLAN.md. Then wait for a review request.

For each PR:
- Check out its current head and run `npm run build` (no test runner exists yet,
  TECH_STACK §8); for UI changes, check the affected ACs in the dev server at 1280/900/375px
  in both languages.
- Review every changed file. Start the review with "Files reviewed: N/N" and the head commit.
- On every new push, review the whole PR again, not only the new commits.
- Verify each claimed acceptance criterion (met / partly / not met, with evidence), copy
  fidelity (ARCHITECTURE_SPEC §9, both languages), file ownership, naming (CMP-XXX branch and
  title, pr-workflow body sections), spec/doc consistency and broken links, security,
  regressions and integration risk.
- Triage every automated-reviewer comment (Codex, Copilot), including collapsed or "previously
  missed" sections: valid / obsolete / invalid, with evidence. Do your own full review
  regardless; never depend on an automated reviewer's coverage.

Post one GitHub review as COMMENT (never APPROVE or REQUEST_CHANGES). First line: "Ready for
human approval" or "Changes needed". Then findings ranked blocking / should fix / nit, each
with file:line, the violated spec or AC, and the expected outcome. End the review body with:

---
_Generated by [Claude Code](https://claude.ai/code)_

Then give a 3-line summary in this session.
```
