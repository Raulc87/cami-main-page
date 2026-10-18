# Model and token-saving policy

This document defines **which model runs each type of work in this repo** and which practices to
follow so AI-assisted development doesn't cost more than it's worth. It applies to agents and to
humans who direct agents.

It is the development-cost counterpart of the rule [AGENTS.md](../../AGENTS.md) already has for
the product ("prioritize zero cost / free tier"): this is a personal project with no budget, and
sending everything to the most expensive model is the biggest and easiest waste to avoid.

**The criterion is not the perceived difficulty of the task, but the cost of being wrong.** A
one-line change in a spec that other threads will treat as the source of truth deserves more model
than a 200-line refactor in an isolated component.

## 1. The three models

| Model | ID | Input $/MTok | Output $/MTok | Use for |
|---|---|---|---|---|
| Claude Opus | `claude-opus-5` | $5.00 | $25.00 | Deep reasoning before acting: planning, designing, deciding |
| Claude Sonnet | `claude-sonnet-5` | $3.00 | $15.00 | The workhorse: implementing, debugging, reviewing |
| Claude Haiku | `claude-haiku-4-5` | $1.00 | $5.00 | Fast and narrow: targeted edits, reading, mechanical checks |

**Prices verified: 2026-08-21.** They are a **reference, not a contract** — the catalog and
prices change. If this table is more than a few months old, verify it before basing a decision on
the exact figures; the relationship between models (Haiku ≈ 5x cheaper than Opus, Sonnet ≈ 1.7x
cheaper than Opus) is more stable than the absolute numbers.

Mind that relationship: the real gap between Opus and Sonnet is **smaller** than is usually
assumed. That's why the criterion for escalating to Opus rests on the risk of the error, not on the
idea that Sonnet is "several times" cheaper.

## 2. Task → model, in this repo

| Task | Model | Why |
|---|---|---|
| Plan a new ticket, especially if it touches a spec | Opus | Deciding which spec changes and how is expensive to reverse |
| Design something from the backlog ([user stories](../specs/USER_STORIES.md) US-010..US-016: backend, leads, integrations) | Opus | There is no feature spec yet: the source of truth is being created |
| Refactor that crosses `src/components/`, `src/constants/` and specs | Opus | Many interdependencies, more specs to keep in sync |
| Implement an already-specified feature | Sonnet | The spec already settled the hard decisions |
| Debug browser behavior | Sonnet | Needs context, not planning |
| Add copy to `UI_TEXT` (`src/constants/i18n.js`) or to `src/constants/data.jsx` | Haiku | Known file, established pattern — see the [content model](../specs/ARCHITECTURE_SPEC.md#9-logical-data-architecture-content-model) |
| Style tweaks within the `src/constants/colors.js` palette | Haiku | Well defined by [UX_UI_DIRECTION.md](../ux/UX_UI_DIRECTION.md) |
| Exploration questions ("where does X live?", "which component uses Y?") | Haiku | Reading, not writing |
| Run the build, check `git status`, verify links | Haiku | Mechanical check |
| `/code-review` before the PR | Depends | See §5 |
| Review-only agent (dedicated reviewer session, [AGENTS.md](../../AGENTS.md#review-only-agent)) | Opus | Finding spec deviations is where a stronger model pays off; reviews are read-heavy with short output |

## 3. If you are planning a ticket

Every agent that plans a ticket **must state a position on the model**. Don't leave it implicit.

1. **Declare the model for the planning itself**, on the first line of the plan:
   `Planning model: Opus — deciding which specs change.` If the ticket is trivial, say so too:
   `Planning model: Haiku — one file, known pattern.`

2. **Annotate the model per step.** A ticket is almost never homogeneous. The plan carries a
   `Model` column in the step list:

   | # | Step | Model | Why |
   |---|---|---|---|
   | 1 | Register `CMP-XXX` in [TICKETS.md](../../TICKETS.md) | Haiku | One table row, known format |
   | 2 | Write the new spec | Opus | Defining criteria that others will follow |
   | 3 | Hook the links into `AGENTS.md` | Sonnet | Small edits in the entry point everyone reads |
   | 4 | Verify links and run the precheck | Haiku | Mechanical check |

3. **Order the steps so a single model switch is enough:** expensive first, cheap after. A plan
   that alternates Opus → Haiku → Opus → Haiku is badly ordered.

4. **Close the plan with an explicit verdict, and say it in prose to the user**, not only inside
   the plan file:
   - If one model is enough: *"Recommendation: run the whole ticket on Sonnet."*
   - If it's heterogeneous: *"I planned on Opus. To execute, switch to Sonnet with `/model sonnet`;
     I'm delegating steps 1 and 4 to Haiku subagents."*

### What the agent can and cannot do

- **It cannot change its own session's model.** `/model` is a user action. An agent that announces
  "switching to Sonnet" and keeps running on Opus is misreporting — it has to **request** the
  switch, not simulate it.
- **It can delegate to a cheaper model** by launching subagents with a model override. There the
  savings are real and automatic, with no user action. Rule of thumb: if a step is mechanical and
  well defined (finding where something lives, reading and summarizing, applying a known pattern
  across several files), it goes to a Haiku or Sonnet subagent instead of being spent on the
  expensive model of the main session.
- **It can reorder the work** to group the expensive parts and minimize model switches.

## 4. Context hygiene — where the big savings are

Choosing the right model helps, but **bloated context costs more**: every turn resends the entire
history, so dirty context is paid for on every message, not once.

- **One session per ticket.** Don't carry one ticket's context into the next.
- **Read the spec that applies, not all of them.** The doc map in
  [PROJECT_CONTEXT.md](../../PROJECT_CONTEXT.md) ("Active documentation") is the index: open
  only the documents your change touches, per [AGENTS.md](../../AGENTS.md) → Before
  implementing, instead of reading all of `docs/specs/`.
- **Plan on Opus, execute on Sonnet.** The expensive reasoning is paid once, not on every edit.
- **Use subagents for broad searches.** A subagent returns the conclusion without dumping every
  file it read into the main context.
- **Read ranges, not whole files**, when you already know which part matters.
- **New session (or compact) when the work moves to another phase.** The previous phase's context
  no longer contributes and keeps being paid for.
- **Don't ask an expensive model to run the build or read `git status`.** That's Haiku's job.

## 5. Hooks into the PR workflow

- **Automated reviewers before an extra Opus pass by the author.** Copilot and Codex review
  every PR automatically ([pr-workflow.md](pr-workflow.md) §3) and don't consume project
  tokens. The *author* doesn't run an extra Opus `/code-review` "just in case" when they
  already covered the diff. This does not apply to the review-only agent: it always does its
  own full review, independent of automated reviewers' coverage
  ([AGENTS.md → Review-only agent](../../AGENTS.md#review-only-agent)).
- **`/code-review` level and model** according to the risk of the change — this adds to what
  [pr-precheck.md](pr-precheck.md) §5 already says about `medium` vs `high`:

  | Type of change | Model | Level |
  |---|---|---|
  | Documentation or copy only | Haiku, or leave it directly to Copilot | `low` |
  | Narrow UI/components | Sonnet | `medium` (the default) |
  | Forms, lead data, external integrations | Opus | `high` |

- **Answering Copilot/Codex/reviewer comments** is Sonnet work — or Haiku if the comment is about formatting or
  naming. Escalate to Opus only if the comment questions a design decision.

## 6. When to escalate mid-task

Escalating is cheaper than cleaning up the mess of a model that fell short. Clear signs it's time
to go up a tier:

- Two failed attempts in a row with the same approach.
- Dependencies between files appear that the plan didn't anticipate.
- A spec outside the ticket's scope has to be modified.

When that happens, say so explicitly and request the model switch — don't keep pushing silently.

## 7. When this policy doesn't apply

If the user explicitly asks for a model, **the user wins**. This document is the reasonable
default, not a restriction.

## 8. Versioned config (`.claude/settings.json`)

This repo versions `.claude/settings.json` with `"model": "sonnet"` as the project default — not
Opus. It's the literal application of §1-§2: most real work (implementing, debugging, reviewing)
is Sonnet's job, and an expensive default is paid for in every session that starts without anyone
deciding it on purpose.

- **When to ask for the switch to Opus:** when planning a ticket that touches specs, or when
  designing something from the backlog that has no spec yet — see §2. The agent can't change its
  own session; it has to ask for it (`/model opus`) as §3 says.
- **Personal override:** if you want to always start on a different model, use
  `.claude/settings.local.json` (explicitly ignored in `.gitignore`) instead of touching the
  versioned `settings.json` — precedence is `user < project < local`.
- **Cheap subagents already defined** in `.claude/agents/`, so the delegation in §3 is a real
  mechanism and not just an intention:
  - `mechanical-check` (Haiku): runs `npm run build` ([pr-precheck.md](pr-precheck.md) §3,
    item 1) and shows `git status --short` ([pr-precheck.md](pr-precheck.md) §1, item 3) — two of
    the checklist items. It also verifies that markdown links between specs/docs aren't broken, an
    extra check that is **not** part of that checklist. The rest of
    [pr-precheck.md](pr-precheck.md) §1 (single-ticket scope, scratch files, whether the
    per-step model recommendation was followed) and §3 (browser test, console warnings, new
    dependencies) needs judgment and remains the responsibility of whoever executes the ticket,
    not of this subagent.
  - `repo-explorer` (Haiku): "where does X live?" questions — reading, not writing.

  Launching them doesn't require the user to change anything; the savings are automatic as soon as
  a plan step is mechanical or read-only.
