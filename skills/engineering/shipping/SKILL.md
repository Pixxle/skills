---
name: shipping
description: >-
  Land verified PRs safely: independent non-author verification before merge,
  contiguous verified run from the stack root, bottom-up land with forge-aware
  merge hygiene, and a thin optional note for keeping a verified queue moving.
  Use when the user asks to ship, land, merge, merge when ready, or verify before
  merge. Complements babysit (merge-ready) and pr-comments (review voice); does
  not own CI babysitting or human review posting.
---

# Shipping

You own what lands. Verify each PR independently, land only the contiguous
verified run from the root, then keep your hands off the stack.

[`babysit`](../babysit/SKILL.md) ends at merge-ready. This skill starts there (or
when the user explicitly asks to land, ship, or merge). [`pr-comments`](../pr-comments/SKILL.md)
owns human review comment voice. Do not turn that skill into CI or merge ownership.

## 1. Resolve the forge, then verify independently

Pick one forge path and keep it for view, merge, and retarget. The rules match
babysit. Prefer the repo's active forge CLI, record fallbacks, and never require
Graphite.

**Independent non-author verify before land.** For each PR about to land, spawn a
verifier that did **not** author the code, on a different model family than the
author when the runtime offers one. The verifier runs the change the way a
user would on the matching surface (UI, CLI, API, or the repo's usual smoke path),
parent against head, and posts one of:

- `PASS` means good to land.
- `PASS+NOTES` means landable, with non-blocking notes.
- `FAIL` means do not land.

When the repo has a project verify skill (`.agents/skills/verify-*/`, linked at
`.claude/skills/verify-*`), the verifier drives parent and head through it and
names the feature-map entries it covered in the verdict. When a recipe fails
against an app that works, the recipe is stale. Repair it with
[`maintain-verification-skill`](../maintain-verification-skill/SKILL.md).

Only a verdict from a non-author agent counts. Green CI and an approving bot
review are not verdicts, because neither exercises the change as a user would.
When the change is a defect fix, hold the verify to the same-surface bar of
[`fix-bug`](../fix-bug/SKILL.md).

## 2. Land only the contiguous verified run from the bottom

Walk up from the lowest unmerged PR. Stop at the first without `PASS` or
`PASS+NOTES`. Everything below that is the **run**; the top of the run is the
**ceiling**. A verified PR above an unverified one waits. A PR whose branch
neither holds nor needs the unverified code may retarget onto trunk and land on
its own after a **fresh** verdict, because the old one ran with different code
beneath it.

## 3. Re-check that verdicts still describe the code

A verdict covers a **patch**, not a commit SHA forever. After rebases, compare
`git patch-id` (or an equivalent stable patch identity) at the verdict SHA with
the current head before trusting an older verdict.

- Patches differ only in tests, docs, or lint config → a lane's result may stand
  if what it ran builds the same at both SHAs apart from noise (noise includes
  differences that also appear between two builds of the verdict SHA, or an
  embedded commit SHA). Report each kind of noise with its files.
- The product change itself still needs fresh checks and review when it drifted.
- A lane with no build output (for example a long-lived dev server) cannot show
  this. Re-verify.

## 4. Land bottom-up, one PR at a time

Always merge the run's lowest unmerged PR via the resolved forge (squash when
that is the repo norm).

After the merge command:

1. **Read the PR back** (state, merged-at, base). A merge command can report
   success when a merge queue only **queued** the PR. Auto-merge armed is not a
   merge. A landed PR reads merged with **trunk** as its base, not its parent's
   branch.
2. Arm merge-when-ready or auto-merge only when the verdict covers the
   **current** head. It will land whatever head becomes ready.
3. After a parent lands, retarget the next PR whose base was the merged branch to
   trunk, move its patch onto the merge result, and push with
   `--force-with-lease`. Step 3's patch-id rule decides whether the verdict
   survives. Merge once checks pass and the verdict still holds.

## 5. Leave the stack alone while it lands

The retarget/restack in step 4 is the only intentional branch or base change
during landing. A base that moves to trunk when its parent merges is expected,
not damage to repair. If a merge stalls, find out why before changing anything.

Watch the run with the forge's check and watch capabilities until the ceiling
reads merged (or the queue reports complete). Do not reopen a full `babysit`
drive loop unless new failures need triage. Then hand those back to babysit.

## 6. Stop at the ceiling

Extending the run needs new verdicts, which means a new pass through step 1.

## Opening PRs that will be shipped

Open PRs through cortex's [Opening a PR](../cortex/playbooks/opening-a-pr.md).
It owns branches, commits, titles, the body, the forge, and the
[`no-comments`](../no-comments/SKILL.md) and [`unslop`](../unslop/SKILL.md)
gates. Landing adds these rules.

- **Stack bases.** Root targets trunk. Each child bases on its parent's tip. As
  parents merge, move children onto trunk per step 4.
- **Babysit is opt-in.** Opening a PR does not start babysit. Post the URL and
  keep building unless the user (or an assigned stack owner brief) asks for a
  babysit after the stack exists.
- **Sibling skills.** Use `changelog` when cutting release notes after land.
  `bump-deps` keeps its own opt-in push and PR gate. Human review findings go
  through `workshop-findings` → `pr-comments`.

## Keep a verified queue moving (optional)

Only when the user asks for unattended queue help **and** the stack is already
verified. Stay thin:

1. Do not invent new product work. Land the contiguous verified run (steps 1 to 6).
2. After each land, re-check the next ceiling candidate's verdict against its
   patch-id. Re-verify if it drifted.
3. Stop at the first `FAIL`, missing verdict, conflict, or human-approval wait.
   Surface the blocker; do not auto-extend scope.
4. Never merge without a surviving non-author verdict on the current head.

This is not a full autopilot orchestrator. Large unattended planning, restacking
policy beyond step 4, or multi-repo queues are out of scope for this skill.

## Reply shape

Report the verified run and its ceiling, each PR's verdict and who produced it,
what landed and how you confirmed the merge, and what the next gap needs.
