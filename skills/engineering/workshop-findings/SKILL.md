---
name: workshop-findings
description: Work through review findings you already have, one at a time, deciding the best fix for each before anything gets posted. A grill-me-style deliberation that sits between a review pass and pr-comments: it assumes the findings are real and spends the time on how to solve them, then leaves a clean per-finding decision list for pr-comments to author. Use after a review (thermo-nuclear, /code-review, /security-review, or your own read) when the user wants to "workshop the findings", "work through the review", "talk through each issue", or decide fixes before commenting. Does not hunt for new issues and does not post anything.
disable-model-invocation: true
---

# workshop-findings: decide the fix before you post

The decision layer between a review and `/pr-comments`. A review hands you a pile of
findings; this skill walks them with you one at a time and works out the **fix** for each.
It does not hunt for issues (that's the review) and it does not author or post comments
(that's `/pr-comments`). It decides substance, then hands off.

Pipeline: a review pass (e.g. `/thermo-nuclear-code-quality-review`) → **`/workshop-findings`** → `/pr-comments`.

## Stance: fix-focused collaborator

Treat each finding as real and worth solving. The work isn't *whether* to comment, it's
*what the fix is*. Like `grill-me`, walk down the tree finding by finding and resolve each
branch with the user, but the question under each finding is "what's the best way to solve
this?", not "does this survive?". For every finding, **lead with your recommended fix.**

A finding can still get dropped if working it reveals it's a non-issue, but that's the
exception, not the goal. Don't spend the session playing skeptic.

## The loop

Pull the findings already in context. None there → stop; there's nothing to workshop, run
the review first. Then walk them in the review's priority order (structural before nits):

For each finding:

1. **State it in one line** and where it lives (`file:line`). No re-litigating that it's a problem.
2. **Lay out the solution space.** The real candidates, usually 2-3. The review's own
   "preferred remedies" are a good menu: extract a helper, reframe the state so branches
   disappear, delete the layer, move it to the canonical home, collapse duplicates.
3. **Recommend one**, with the tradeoff in a sentence. This is the grill-me move: you bring
   an answer, you don't just ask.
4. **Deliberate** until you and the user land on the fix. Explore the codebase to settle a
   question rather than asking the user to guess.
5. **Decide and capture** (below). Then move on.

Spend the deliberation budget where the fix is genuinely open. Fast-track the obvious ones,
batch the trivial nits, don't ceremonially debate a rename.

## Resolve cross-finding dependencies

Findings interact. The point of going one-by-one is to catch where they collapse:

- One **code-judo restructuring** often dissolves three smaller findings at once. When you
  see it, merge them into a single decision and drop the now-moot ones.
- Two fixes can **conflict** (one extracts a helper, another inlines the same code). Resolve
  the order or pick one.
- A fix can **enlarge scope past what's worth a PR comment**. Decide then whether it's a
  comment, a follow-up issue, or out of scope.

Note these out loud as you go so the final list has no contradictions.

## What each decision captures

By the end, each finding resolves to one of: **fix it here**, **raise as a question**,
**defer to a follow-up**, or **drop**. For everything not dropped, capture exactly what
`/pr-comments` needs to author without re-deriving anything:

- **Location** — `file:line` so it can be placed inline.
- **The decided fix** — the substance, concrete enough to become a ` ```suggestion ` block
  when it's a clean code change.
- **How hard to push** — plain, `nit:`, or `optional:`. Severity goes *down* only, matching
  pr-comments; real escalation is the verdict, which stays the user's.
- **Assertion or question** — if the fix depends on intent you couldn't settle, mark it a
  question rather than a confident wrong fix.

## Handoff

End with a compact per-finding decision list in the conversation, grouped kept / question /
deferred / dropped. That list *is* the input to `/pr-comments` — it reads it straight from
context.

Stop at the decision. **Do not pre-write the final comment prose** — voice, placement
(inline vs body), and submission are pr-comments' job, and writing them here just gets
redone. Hand off substance and stance; let pr-comments make it sound like a person.
