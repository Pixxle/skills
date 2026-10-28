---
name: no-comments
description: Pre-PR comment hygiene. Spawn a comment-sicko review of the scoped diff, delete unjustified comments, fix accepted root-cause flags in scope, and offer encodings for claimed constraints. Use before review or before asking for a PR review.
---

# No comments

Session-wide pre-review gate. Strip narration, banners, commented-out corpses, and workaround sermons from the scoped diff. Keep only comments that earn a keep-list exception.

This is hygiene before review, not thermo's structural review and not `pr-comments` (which posts review findings to a PR).

## Scope

Use the caller's files or diff. Otherwise use the current diff against the base branch (default `main`), including the working tree.

## Keep list

Only these survive by default:

- Legal or license headers
- Non-obvious behavior forced by an external dependency, platform, vendor, or protocol you cannot reshape
- Tool directives such as prettier-ignore (lint suppressions survive only when the rule is faulty, pedantic, or style-only)
- Doc comments that define a public API contract
- Issue or RFC links that explain a constraint code cannot express

Surprises in our own code are not a keep. Delete the comment and flag the symbol for rename, extract, type, or reshape that makes the behavior obvious without prose.

Correctness or safety suppressions (`eslint-disable`, `@ts-ignore`, `@ts-expect-error`, and kin) stay actionable: prefer fixing the code over silencing the checker.

## Steps

1. **Review.** Spawn a read-only `comment-sicko` subagent with the scope when that subagent type is available. Otherwise apply the keep list yourself on the scoped diff. Do not restate the reviewer's persona rules in the brief; pass scope and the keep list.
2. **Triage.** Reject application-code edits from the reviewer, scope escapes, and keep reasons that treat intentional our-code surprises as sacred. A keep survives only with proof it is about something you cannot change. Audit missed scoped lint and TypeScript suppressions.
3. **Trivial fixes.** Delete dead paths, drop unused parameters, or call the real API when that is the smallest accepted fix.
4. **Root-cause fixes.** Implement the smallest in-scope fix for accepted reshape flags. Remove named workarounds. If the root cause is out of scope, land the smallest in-scope fix and report the rest open. Do not bolt on symptom guards. Guided by `principles` (fix root causes / laziness), not by widening the fence.
5. **Constraint comments.** Comments that say `do not remove`, `do not change wording`, or `talk to X before changing` need proof. Leave keeps about things you cannot change. Offer the cheapest in-scope type, runtime, test, or CI encoding; wait for interactive approval (or caller pre-approval when unattended). If approved, encode then delete. Otherwise delete, report the constraint open, and sketch out-of-scope work.
6. **Report.** Deletion count, restored comments, reruns, fixes, encoding offers, encodings, unenforced constraints, and other open work.

## Trigger

Run before asking for human or bot review, and before an Opening-a-PR step that claims the diff is review-ready. Pair with `unslop` on PR title/body and commit text. Pair with `principles` autonomy rules: this gate itself is reversible; do not skip it under a full-autonomy grant.
