---
name: no-comments
description: Pre-PR comment hygiene. Spawn a comment-sicko review of the scoped diff, delete unjustified comments, fix accepted root-cause flags in scope, and offer encodings for claimed constraints. Use before you ask for review of your own change.
disable-model-invocation: true
---

# No comments

Session-wide pre-review gate. Strip narration, banners, commented-out corpses, and workaround sermons from the scoped diff. Keep only comments that earn a keep-list exception.

Spawn the comment-sicko reviewer and act on the findings you accept. Defer to its fresh perspective. It reports and edits nothing, so you do the deleting.

This is hygiene before review. It is not the structural review in [`thermo-nuclear-code-quality-review`](../thermo-nuclear-code-quality-review/SKILL.md), and it is not [`pr-comments`](../pr-comments/SKILL.md), which posts review findings to a PR.

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

Correctness or safety suppressions (`eslint-disable`, `@ts-ignore`, `@ts-expect-error`, and kin) stay actionable. Prefer fixing the code over silencing the checker.

## Steps

1. **Review.** Spawn the [`comment-sicko`](../../agents/comment-sicko.md) agent shipped in this repo's `agents/` and pass it only the scope. Do not restate its rules. A plugin install namespaces the agent, for example `pixxle-skills:comment-sicko`. When that agent type is unavailable, spawn a separate read-only subagent with the scope and the keep list above, verbatim. The reviewer is never the author. If no subagent can be spawned, report this step open instead of reviewing your own diff.
2. **Triage.** Inspect the report, and check the working tree for any edit the reviewer made anyway.
   - Reject the report when it edits a file, escapes the scope, kills a keep-list exception, misstates a `MUST KILL` reason, flags kept intentional code as guilty, or keeps a comment by treating an intentional our-code surprise as sacred.
   - Reshape flags on our-code surprises stay actionable. Delete those comments and do not restore them.
   - Accept every kill unless you can prove a keep-list exception. Overrule a kill only with the exact exception and scoped proof. A keep survives only with proof it is about something you cannot change.
   - Before you accept a thin kill or keep on an `IMPORTANT` or `do not remove` comment, read and follow [`how`](../how/SKILL.md) or [`why`](../why/SKILL.md) on its symbol. If a kill is still ambiguous, it dies. If a keep is refuted or still ambiguous, delete the comment.
   - Audit scoped lint and TypeScript suppressions the reviewer missed. Correctness or safety suppressions stay actionable `MUST KILL` flags.
   - **Rerun once, then fail.** When you reject a report, revert every file edit the reviewer made and rerun it once, with the failure named in the new brief. If you reject the second report too, report it open and fail no-comments. Step 6 reports each rerun.
3. **Trivial fixes, then the architect sketch.** Fix trivial accepted flags directly. Delete a dead path, drop an unused parameter, or call the real API. If any accepted fix needs a shape, read and follow [`architect`](../architect/SKILL.md) once, for the whole accepted set and the code around it. Stop at the sketch. Architect settles the shape, and step 4 implements it.
4. **Root-cause fixes.** Implement the smallest in-scope root-cause fix for each accepted reshape flag. Remove every named workaround. If the root cause is out of scope, land the smallest in-scope fix and report the rest open. Read [Fix Root Causes](../principles/fix-root-causes.md) and [Redesign from First Principles](../principles/redesign-from-first-principles.md) for intent only. Neither authorizes widening the fence or fixing instances outside it. Never bolt on symptom guards.
5. **Constraint comments.** Comments that say `do not remove`, `do not change wording`, or `talk to X before changing` need proof. Leave keeps about things you cannot change. Offer the cheapest in-scope type, runtime, test, or CI lint encoding. Wait for interactive approval. Unattended and eval runs need the caller's pre-approval. If approved, encode then delete. Otherwise delete, report the constraint open, and sketch out-of-scope work.
6. **Report.** Deletion count, overruled kills, reruns with the failure each one named, the architect sketch, fixes, encoding offers, encodings, unenforced constraints, and other open work. When a second rejected report failed no-comments, say so first.

## Trigger

Run before asking for human or bot review, and before an [Opening a PR](../cortex/playbooks/opening-a-pr.md) step that claims the diff is review-ready. Read and follow [`unslop`](../unslop/SKILL.md) on the PR title, body, and commit text. Read and follow the Autonomy section of [`cortex`](../cortex/SKILL.md). This gate is reversible, so do not skip it under a full-autonomy grant.
