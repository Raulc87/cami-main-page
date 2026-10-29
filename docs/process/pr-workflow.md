# PR creation workflow

This document defines how a PR is created, reviewed, and merged in this repo. It applies to agents
and humans alike — the goal is that any thread picking up the work can open a consistent PR
without having to ask how it's done.

## 0. Before opening the PR

Run [pr-precheck.md](pr-precheck.md) in full. No PR is opened without having passed it.

## 1. Commit and push

- The branch must already exist as `CMP-XXX-slug` (see [TICKETS.md](../../TICKETS.md)).
- Commit messages: imperative, short, in Spanish or English (consistent with the rest of the
  repo). Starting the subject with the ticket ID (`CMP-XXX: ...`) is recommended but not
  required (AGENTS.md → Differences from the Starter Kit).
- Push with `git push -u origin CMP-XXX-slug`.

## 2. Create the PR with `gh`

```bash
gh pr create --title "CMP-XXX: <short summary>" --body "$(cat <<'EOF'
## Summary
<What was done and why, 2-4 lines. Don't repeat the diff, explain the "why".>

## User stories & acceptance criteria
<List the US-XXX ids (from docs/specs/USER_STORIES.md) and which acceptance criteria this PR
satisfies. If there is no story, write "N/A — process/docs only" with a reason.>

## Files
<List of files created/modified with one sentence on what changed in each.>

## Verification
<Evidence the change works: npm run build output, browser check (golden path + edge cases),
screenshots for UI changes. State explicitly if something could not be verified and why.>

## Risks
<What could break, what remains pending, /code-review findings you decided not to resolve and
why. "None identified" if there truly are none.>
EOF
)"
```

**The title must always start with the ticket ID** (`CMP-XXX:`) — that's what lets PRs be
cross-referenced with [TICKETS.md](../../TICKETS.md) without an external tracker. **Exception:**
Dependabot's own pull requests (CMP-071, [`.github/dependabot.yml`](../../.github/dependabot.yml)) keep Dependabot's titles and get no ticket row; the
checks and the review-only agent still apply, and the owner merges them as usual (owner,
2026-10-29: "Yes, allow it").

The 5 body sections (`Summary`, `User stories & acceptance criteria`, `Files`, `Verification`,
`Risks`) are mandatory, in that order. If one doesn't apply (e.g. a documentation-only change has
no UI to verify, or no user story), say so explicitly instead of omitting the section.
`Verification` replaces the former "Test" section: it asks for evidence (build output, browser
check, screenshots), not just a statement that it was tested.

## 3. Ask for reviews

Two independent reviewers look at every PR before the owner approves it
([AGENTS.md → Kept project rules](../../AGENTS.md#kept-project-rules-adopted-projects), minimum
review):

- **Codex** (the Codex GitHub integration) reviews automatically when the PR opens; nothing to
  request. The author may ask it again with an `@codex review` comment **at most twice per PR**;
  after that, re-reviews come only from the review-only agent
  ([AGENTS.md → Automated PR reviewers](../../AGENTS.md#automated-pr-reviewers)).
- **The review-only agent** (a dedicated Claude Code session) reviews when the author asks:
  after **every push** to the PR (the first push, each fix, each merge of the base branch), the
  author sends it one message naming the PR, its head commit and what changed since the last
  review. Its "ready for human approval" verdict goes to the coordinator, who tells the owner
  with the merge order ([AGENTS.md → Review flow](../../AGENTS.md#review-flow)).

GitHub Copilot code review is not part of this flow: requests in Sprint 02 produced no reviews
(ADR-006 → Kit disposition, kept rule Reviewers). The human owner is the final approver of every
PR.

## 4. Handle review comments

The author agent subscribes to its own PR's events (comments, reviews) and acts when they
arrive; it does not poll the PR in a loop. Comments come from Codex
([AGENTS.md → Automated PR reviewers](../../AGENTS.md#automated-pr-reviewers)), from the
review-only agent's COMMENT review (asked for by the author after every push, or by the owner or
the coordinator), and from the owner. For each one:

1. Read each line comment and each review finding.
2. Decide: fix it, or justify why it doesn't apply?
3. Adjust the code if appropriate, make an additional commit on the same branch.
4. Reply to/resolve the corresponding comment thread on GitHub.

## 5. Merge criteria

A PR is ready to merge only if:

- **Zero unresolved line comments** on the PR (whether from Codex, the review-only agent or a
  human).
- **The latest review-only agent review reads "Ready for human approval"**, or every finding
  in it (they are in the review body, not in line threads) has a visible reply from the author:
  fixed (with the commit) or why no change is needed.
- **Suppressed/dismissed (`dismissed`) comments are ≤ 3.**
- **Final statuses are already in the PR (no step after approval).** Before reporting the PR
  ready, the author records in the PR itself every status that becomes true when it merges:
  - each spec or ADR the PR asks the owner to approve: `Status: Approved` / `Accepted`, worded
    "on merge of PR #N" (plus the PROJECT_SPEC §17 sign-off when the PR approves the spec);
  - the ticket's own row in [TICKETS.md](../../TICKETS.md): `done`.

  Merging the PR **is** the owner's approval, so nothing is left to do after it; if the owner
  does not merge, these statuses never reach `main`. The PR body lists them under Risks as
  "Statuses recorded on merge" so the owner sees what merging approves. (Before CMP-018 the
  rule was a commit after approval and before merge; it was missed for CMP-014 and CMP-016.)

When those conditions are met, before recommending the merge you must **list every dismissed
comment** with a short explanation of why it was dismissed and whether it truly doesn't need
resolving or was left as conscious technical debt (in which case, consider opening a new ticket in
[TICKETS.md](../../TICKETS.md) instead of losing the finding).

If there are more than 3 dismissed comments, or any line comment remains unresolved, the PR is
**not** ready — resolve or justify more before merging.
