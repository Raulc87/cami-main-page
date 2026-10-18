# PR Precheck

Checklist that any agent (or person) must run **before opening a PR**, no exceptions. The goal is
to catch the obvious problems before asking Copilot or the user for review, not after.

## 1. Scope

- [ ] The diff corresponds to **a single ticket** (`CMP-XXX`). If work from another ticket is
      mixed in, split it out.
- [ ] No scratch, debug, or temporary files slipped in (`*.log`, debug prints, loose test files).
- [ ] `git status` reviewed — nothing unexpected left untracked or added by accident with a broad
      `git add`.
- [ ] If there was a plan, the per-step model recommendation was followed — or the PR notes why
      everything ran on a different model. See [model-cost-policy.md](model-cost-policy.md).

## 2. Specs and docs updated

- [ ] If the change touches goals, requirements, or business rules →
      [docs/specs/PROJECT_SPEC.md](../specs/PROJECT_SPEC.md) updated.
- [ ] If the change touches palette, typography, visual patterns, or breakpoints →
      [docs/ux/UX_UI_DIRECTION.md](../ux/UX_UI_DIRECTION.md) updated.
- [ ] If the change touches folders, components, or the content/copy model →
      [docs/specs/ARCHITECTURE_SPEC.md](../specs/ARCHITECTURE_SPEC.md) updated.
- [ ] If the change touches the stack or dependencies → [TECH_STACK.md](../../TECH_STACK.md)
      updated.
- [ ] Story status and acceptance criteria in
      [docs/specs/USER_STORIES.md](../specs/USER_STORIES.md) updated (this includes backlog items
      US-010..US-016 that the change builds — they are no longer `Proposed`).
- [ ] If the change makes a decision worth recording → a new ADR in
      [docs/decisions/](../decisions/).
- [ ] If the active sprint or the doc map changed → [PROJECT_CONTEXT.md](../../PROJECT_CONTEXT.md)
      updated.
- [ ] If the ticket belongs to the active sprint → its status in the sprint plan in
      [docs/sprints/](../sprints/) is updated.
- [ ] If the PR is where specs or ADRs get approved → their `Status` fields are set
      (`Approved` / `Accepted`, plus PROJECT_SPEC §17 sign-off) once the owner approves, before
      merging.
- [ ] The ticket's row in [TICKETS.md](../../TICKETS.md) has the correct status.

An outdated spec is as real a bug as a code one — don't leave it for "later".

## 3. Build and correctness

- [ ] `npm run build` runs without errors.
- [ ] If the change is UI: it was tested in the browser (dev server), not just assumed to compile.
      Check the golden path and, if applicable, any obvious edge case (mobile breakpoint, empty
      state, etc.).
- [ ] No new console errors/warnings in the browser.
- [ ] No new dependencies/libraries were introduced without documenting them in
      [TECH_STACK.md](../../TECH_STACK.md) (see the rule in [AGENTS.md](../../AGENTS.md)).
- [ ] Acceptance criteria of the referenced user stories were verified (Definition of Done in
      [AGENTS.md](../../AGENTS.md)).

## 4. Security / hygiene

- [ ] No secrets, tokens, or credentials in the diff (check the actual contents of any new file,
      not just its name).
- [ ] No forgotten debug `console.log`s, no code commented out "just in case".

## 5. Code self-review

- [ ] Run **`/code-review`** on the diff before opening the PR (`medium` level as the default; use
      `high` if the change touches something sensitive — forms, lead data, external integrations
      once they exist). Resolve or justify every finding before continuing.
- [ ] The **model** used to run `/code-review` goes with the level: docs/copy only → Haiku (or
      leave it to Copilot); narrow UI → Sonnet; forms, lead data, or external integrations → Opus.
      Full table in [model-cost-policy.md](model-cost-policy.md) §5.
- [ ] If `/code-review` flags something you decide **not** to resolve, leave the justification in
      the PR description ("Risks" section — see [pr-workflow.md](pr-workflow.md)), not in silence.

## 6. Ready to open the PR

Only when everything above is green, follow the [pr-workflow.md](pr-workflow.md) flow to create
the PR.
