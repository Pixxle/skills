---
name: shipping
description: >-
  Land verified PRs safely: independent non-author verification before merge,
  contiguous verified run from the stack root, bottom-up land with forge-aware
  merge hygiene, and a thin optional note for keeping a verified queue moving.
  Use when the user asks to ship, land, merge, merge when ready, or verify before
  merge. Complements babysit (merge-ready) and pr-comments (review voice); does
  not own CI babysitting or human review posting.
disable-model-invocation: true
---

# Shipping

You own what lands. Verify each PR independently, land only the contiguous
verified run from the root, then keep your hands off the stack.

[`babysit`](../babysit/SKILL.md) ends at merge-ready. This skill starts there, or
when the user explicitly asks to land, ship, or merge.
[`pr-comments`](../pr-comments/SKILL.md) owns human review comment voice. Do not
turn that skill into CI or merge ownership.

Green is not safe. Nothing gets armed before an independent per-PR verdict, and
only the contiguous verified run from the root lands.

## 1. Resolve the forge, then verify independently

Pick one forge path and keep it for view, merge, retarget, and watch. The rules
match [`babysit`](../babysit/SKILL.md). GitHub CLI (`gh`) is the default. Use
another forge's CLI only when it is installed and resolves the repo. Record any
fallback, and never require Graphite (`gt`).

**Independent non-author verify before land.** For each PR about to land, spawn
one verifier that did **not** author the code, on a different model family than
the author when the runtime offers one. The verifier runs the change the way a
user would on the matching surface (UI, CLI, API, or the repo's usual smoke
path), parent against head, and posts one of these on that PR:

- `PASS` means good to land.
- `PASS+NOTES` means landable, with non-blocking notes.
- `FAIL` means do not land.

When the repo has a project verify skill (`.agents/skills/verify-*/`, linked at
`.claude/skills/verify-*`), the verifier drives parent and head through it and
names the feature-map entries it covered in the verdict. When a recipe fails
against an app that works, the recipe is stale. Read and follow
[`maintain-verification-skill`](../maintain-verification-skill/SKILL.md) to
repair it.

Only a verdict from a non-author agent counts, because an author checks what it
meant to build. Green CI and an approving bot review are not verdicts, because
neither runs the change as a user would. When the change is a defect fix, hold
the verify to the same-surface bar of the [Bug fix](../cortex/playbooks/bug-fix.md) playbook.

## 2. Land only the contiguous verified run from the bottom

Walk up from the lowest unmerged PR. Stop at the first without `PASS` or
`PASS+NOTES`. Everything below that is the **run**. The top of the run is the
**ceiling**. A verified PR above an unverified one waits, because it cannot land
without the code below it. A PR whose branch neither holds nor needs the
unverified code may move onto trunk and land on its own after a **fresh**
verdict, because its old one ran with that code beneath it and trunk does not
have it.

## 3. Re-check that verdicts still describe the code

A verdict covers a **patch**, and a chain rebase moves every PR above it to a new
SHA without failing any check. Compare `git patch-id` (or an equivalent stable
patch identity) at the verdict SHA with the current head before trusting an
older verdict.

- When the patches differ only in tests, docs, or lint config, a lane's result
  stands if what it ran builds the same at both SHAs apart from noise. Noise is
  a difference that also shows up between two builds of the verdict SHA, or an
  embedded commit SHA. Report each kind of noise with its files, so a reader can
  check the call.
- The change itself still gets fresh checks and a review, because the old
  verdict never saw it.
- A lane with no build output, such as a long-lived dev server, cannot show
  this. Rerun it, and re-verify anything else that drifted.

## 4. Land bottom-up, one PR at a time

Always merge the run's lowest unmerged PR through the resolved forge (on GitHub,
`gh pr merge <pr> --squash` when squash is the repo norm). On GitHub, a PR whose
base is still its parent's branch merges into that branch, not trunk. Some
forges' plain merge command also merges every PR below the one you name.

After the merge command:

1. **Read the PR back** (on GitHub,
   `gh pr view <pr> --json state,mergedAt,baseRefName`). A merge command can
   report success when a merge queue only **queued** the PR, and a requested
   auto-merge is not a merge. A landed PR reads merged with **trunk** as its
   base, not its parent's branch.
2. Arm merge-when-ready or auto-merge only on a PR whose verdict covers its
   **current** head, because it lands whatever head becomes ready.
3. After a parent lands, retarget the PR whose base was the merged branch to
   trunk (on GitHub, `gh pr edit <pr> --base <trunk>`), move its patch onto the
   merge result, and push with `--force-with-lease`. The verdict covers the
   patch, not its commits, so step 3's patch-id rule decides whether the verdict
   survives. Merge it once its checks pass and its verdict survives.

## 5. Leave the stack alone while it lands

Step 4's move of the next PR is the only change to a branch or base, because a
merge lands whatever its branch and base hold at that moment, verdict or not. A
base that moves to trunk when its parent merges is expected, not damage to
repair. If a merge stalls, find out why before you change anything.

**GitHub.** Watch the run with babysit's queued watcher until it reports
`COMPLETE` at the ceiling. The watcher ships in the babysit skill at
[`../babysit/scripts/watch-pr/watch-pr`](../babysit/scripts/watch-pr/watch-pr),
relative to this skill directory. It needs Node 22.18 or later and an
authenticated `gh`. Run it directly. Never rebuild its checks by hand.

Call it by absolute path, `<skill-dir>/../babysit/scripts/watch-pr/watch-pr`,
where `<skill-dir>` is this skill directory's real path. Installed skills are
symlinks, so resolve the real path first (`cd -P <skill-dir> && pwd`) and never
resolve `..` from the link path. That absolute path is written `<watch-pr>`
below. Run it with the target repo's checkout as the working directory, and
pass `--owner` and `--repo` as well. Without both, the watcher reads the
repository from the working directory's `origin` remote. Run from this skill's
directory, it would read the skills checkout's remote, or find none, and track
the wrong repository's PR numbers or fail.

```sh
<watch-pr> --owner <owner> --repo <repo> --queued-stack --stack-prs <root>,...,<ceiling>
```

Capture the run bottom-to-top once and pass the same frozen `--stack-prs` list
on every rearm. Run it under the runtime's self-paced loop, or as a background
command whose output you read as each line arrives. It keeps running after a
progress line, so act on each line without waiting for exit. Never add a
second sleep loop. The verdicts are the ones in
[babysit's watcher table](../babysit/SKILL.md#github-drive-the-loop-with-watch-pr):

- `QUEUE` echoes the captured list. It must match the run.
- `WAITING` with reason `pending-checks`, `STATUS`, and `RETRY` mean keep
  watching.
- `WAITING` with reason `merge-queue` means the frontier is blocker-free. Land
  it per step 4 when its verdict covers its current head.
- `ADVANCE` means the frontier merged. Read it back, move the next PR per step
  4, re-check its verdict per step 3, and keep watching.
- `COMPLETE` means every PR in the run merged. Confirm the ceiling reads merged,
  then stop.
- `BLOCKER` or `TIMEOUT` stops landing. Find out why before you change
  anything. For new failures, read and follow
  [`babysit`](../babysit/SKILL.md) to triage them.

**Other forges.** Re-read the current PR with the forge's view each time its
check watch returns, until the ceiling reads merged.

Reopen a full [`babysit`](../babysit/SKILL.md) drive loop only when new
failures need triage. Then read and follow it for those failures alone.

## 6. Stop at the ceiling

Extending the run needs new verdicts, which means a new pass through step 1.

## Opening PRs that will be shipped

Open PRs by reading and following cortex's
[Opening a PR](../cortex/playbooks/opening-a-pr.md) playbook. It owns branches,
commits, titles, the body, the forge, and the
[`no-comments`](../no-comments/SKILL.md) and [`unslop`](../unslop/SKILL.md)
gates. Landing adds these rules.

- **Stack bases.** Root targets trunk. Each child bases on its parent's tip. As
  parents merge, move children onto trunk per step 4.
- **Babysit is opt-in.** Opening a PR does not start babysit. Post the URL and
  keep building unless the user (or an assigned stack owner brief) asks for a
  babysit after the stack exists.
- **Sibling skills.** For human review findings, read and follow
  [`pr-comments`](../pr-comments/SKILL.md).

## Keep a verified queue moving (optional)

Only when the user asks for unattended queue help **and** the stack is already
verified. Stay thin:

1. Do not invent new product work. Land the contiguous verified run (steps 1 to 6).
2. After each land, re-check the next ceiling candidate's verdict against its
   patch-id. Re-verify if it drifted.
3. Stop at the first `FAIL`, missing verdict, conflict, or human-approval wait.
   Surface the blocker. Do not auto-extend scope.
4. Never merge without a surviving non-author verdict on the current head.

This is not a full autopilot orchestrator. Large unattended programs belong to
cortex's [Autopilot-full](../cortex/playbooks/autopilot-full.md) and
[Autopilot-stack](../cortex/playbooks/autopilot-stack.md) playbooks. Restacking
policy beyond step 4 and multi-repo queues are out of scope for this skill.

## Reply shape

Report the verified run and its ceiling, each PR's verdict and who produced it,
what landed and how you confirmed the merge, and what the next gap needs.
