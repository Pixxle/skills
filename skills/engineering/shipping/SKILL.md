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

# shipping: land only what was independently verified

You own what lands. Verify each PR independently, land only the contiguous
verified run from the root, then keep your hands off the stack.

[`babysit`](../babysit/SKILL.md) ends at merge-ready. This skill starts there (or
when the user explicitly asks to land / ship / merge). [`pr-comments`](../pr-comments/SKILL.md)
owns human review comment voice; do not turn that skill into CI or merge ownership.

## 1. Resolve the forge, then verify independently

Pick one forge path (same rules as babysit: prefer the repo's active forge CLI,
record fallbacks, never require Graphite) and keep it for view / merge / retarget.

**Independent non-author verify before land.** For each PR about to land, spawn a
verifier that did **not** author the code. The verifier runs the change the way a
user would on the matching surface (UI, CLI, API, or the repo's usual smoke path),
parent against head, and posts one of:

- `PASS` — good to land
- `PASS+NOTES` — landable; notes are non-blocking
- `FAIL` — do not land

Only a verdict from a non-author agent counts. Green CI and an approving bot
review are not verdicts — neither exercises the change as a user would. When
`fix-bug` is available and the change is a defect fix, prefer same-surface
verify consistent with that skill's bar.

## 2. Land only the contiguous verified run from the bottom

Walk up from the lowest unmerged PR. Stop at the first without `PASS` or
`PASS+NOTES`. Everything below that is the **run**; the top of the run is the
**ceiling**. A verified PR above an unverified one waits. A PR whose branch
neither holds nor needs the unverified code may retarget onto trunk and land on
its own — after a **fresh** verdict, because the old one ran with different code
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
  this — re-verify.

## 4. Land bottom-up, one PR at a time

Always merge the run's lowest unmerged PR via the resolved forge (squash when
that is the repo norm).

After the merge command:

1. **Read the PR back** (state, merged-at, base). A merge command can report
   success when a merge queue only **queued** the PR. Auto-merge armed is not a
   merge. A landed PR reads merged with **trunk** as its base, not its parent's
   branch.
2. Arm merge-when-ready / auto-merge only when the verdict covers the **current**
   head — it will land whatever head becomes ready.
3. After a parent lands, retarget the next PR whose base was the merged branch to
   trunk, move its patch onto the merge result, and push with
   `--force-with-lease`. Step 3's patch-id rule decides whether the verdict
   survives. Merge once checks pass and the verdict still holds.

## 5. Leave the stack alone while it lands

The retarget/restack in step 4 is the only intentional branch or base change
during landing. A base that moves to trunk when its parent merges is expected,
not damage to repair. If a merge stalls, find out why before changing anything.

Watch the run with the forge's check/watch capabilities until the ceiling reads
merged (or the queue reports complete). Do not reopen a full `babysit` drive
loop unless new failures need triage — then hand those back to babysit.

## 6. Stop at the ceiling

Extending the run needs new verdicts — a new pass through step 1.

## Opening / merge hygiene (complements pr-comments)

Use this when opening PRs that will later be babysat and shipped. Keep it short;
do not steal review-comment ownership from `pr-comments`.

- **Worktree / branch:** Prefer a clean worktree off trunk. Dirty unrelated work →
  patch out, fresh branch, re-apply.
- **Commits:** Small, ordered, landable. Amend when the fix belongs in a
  just-made commit; new commit when separable.
- **Titles:** Conventional Commits `type(scope): subject`, imperative, no
  trailing period.
- **Body (one-minute briefing):** `## Why`, `## What changed`, `## Scope`,
  optional `## Tradeoffs`, `## Blast Radius`, `## Verification`. Drop empty
  sections. Evidence that proves a claim (screenshots, recordings) attaches
  after the sections; long SHA recitals go in a linked artifact.
- **Forge:** Same resolve-once rule as babysit. When the run provides a built-in
  PR tool, create/edit/retarget through it so tracking stays correct; use the
  forge CLI for everything the tool does not cover.
- **Ready, not draft:** Open PRs ready for review unless the user asks for draft.
- **Stacks:** Prefer several narrow PRs to one large one. Root targets trunk;
  each child bases on its parent's tip. As parents merge, move children onto
  trunk per step 4.
- **Babysit is opt-in:** Opening a PR does not start babysit. Post the URL and
  keep building unless the user (or an assigned stack owner brief) asks for a
  babysit after the stack exists.
- **Sibling skills:** Use `changelog` when cutting release notes after land;
  `bump-deps` keeps its own opt-in push/PR gate; human review findings go through
  `workshop-findings` → `pr-comments`.

## Optional: keep a verified queue moving

Only when the user asks for unattended queue help **and** the stack is already
verified. Stay thin:

1. Do not invent new product work. Land the contiguous verified run (steps 1–6).
2. After each land, re-check the next ceiling candidate's verdict vs patch-id;
   re-verify if drifted.
3. Stop at the first `FAIL`, missing verdict, conflict, or human-approval wait.
   Surface the blocker; do not auto-extend scope.
4. Never merge without a surviving non-author verdict on the current head.

This is not a full autopilot orchestrator. Large unattended planning, restacking
policy beyond step 4, or multi-repo queues are out of scope for this skill.

## Reply shape

Report: the verified run and its ceiling; each PR's verdict and who produced it;
what landed and how you confirmed merge; what the next gap needs.
