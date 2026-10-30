---
name: arena
description: >-
  Run N parallel candidates on one brief, each in its own git worktree, then
  pick a base, graft the strongest parts of the others into it, and verify the
  result. Use for "arena this", "throw it in the arena", a bakeoff, "get a few
  attempts and merge the best", a second opinion from independent attempts, or
  when one attempt at a non-trivial design, algorithm, format, or name would
  lock in the wrong shape.
disable-model-invocation: true
---

# Arena

Several candidates attempt the same brief in parallel. You pick the strongest as a base, fold the best parts of the others into it, and verify the result.

## Phases

Open a todolist with one entry per phase before launching anything. Other skills cite these letters, so keep them stable.

| Phase | Produces |
| --- | --- |
| A. Frame | Brief, rubric, runner list, one worktree per candidate |
| B. Fan out | N candidate artifacts, each with a short rationale |
| C. Cross-judge | Independent per-criterion scores and a recommended base |
| D. Pick a base | Your own scores and the chosen base |
| E. Graft | One coherent artifact with the best parts of the others folded in |
| F. Verify | Proof the synthesized artifact works |

## A. Frame

Every candidate gets the same brief, so the brief is the contract.

1. State the artifact each candidate produces.
2. Write the rubric. Use 3 to 6 concrete, gradeable criteria for success on this task. It is your tool in phase D and the judge's in phase C. Candidates see only the task.
3. Pick the runners. Default to two. Put them on different model families when the runtime offers them, otherwise on the parent model. Use the strongest judgment model for design and hard code, and a fast model only for mechanical generation. Add runners when the brief spans several design directions. Repeat one model N times when the work is generation-bound rather than judgment-sensitive. If the runtime refuses a model, run that seat on the parent model and say so.
4. Give each candidate its own git worktree off the current HEAD, or a per-candidate scratch directory when a worktree doesn't fit. No two candidates share a write target, per [Separate Before Serializing Shared State](../principles/separate-before-serializing-shared-state.md).

## B. Fan out

Spawn all N candidates in parallel in one batch, in the background so no candidate waits on another. Each brief carries the task, the path to any shared grounding, the candidate's own worktree path, and an instruction to produce the artifact plus a short rationale naming the alternatives it considered and what it rejected.

If a candidate produces nothing, proceed with N-1 and note the dropout.

## C. Cross-judge

Wait until every candidate has finished. Then spawn one read-only judge on a different model family than yours when the runtime offers one. Otherwise run it on the parent model in a fresh context and record that the judge shares your family. Its agreement then counts for less.

The judge sees the rubric and the candidates by path label, never by model name. It scores each criterion and recommends a base with a rationale. It runs while you read in phase D.

## D. Pick a base

Read every candidate end to end before picking. Score each against the rubric criterion by criterion, not on holistic feel. Compare with the judge. Agreement confirms the pick. Disagreement means one of you is biased or the rubric was ambiguous, so read both rationales before deciding.

Pick the base a future maintainer can extend most easily without breaking invariants. When two tie, prefer the cleaner boundary or the smaller API, per [Laziness Protocol](../principles/laziness-protocol.md).

## E. Graft

Build the synthesis in the caller's working tree, starting from the base. Walk each other candidate once more for what is worth porting. Usually that is one or two things per candidate, not most of it. Fold each graft in by hand, per [Redesign from First Principles](../principles/redesign-from-first-principles.md), so the result stays coherent under one mental model. Don't paste mechanically.

If the candidates converge on one shape, that is strong agreement. Note it and ship the consensus shape without grafts. If they diverge wildly, phase A was under-specified. Reframe and re-run rather than averaging the divergence.

## F. Verify

Verify the synthesized artifact like any other output, per [Prove It Works](../principles/prove-it-works.md). If verification finds a problem the arena missed, either phase A was wrong (reframe and re-run) or a candidate caught it and you missed the graft (return to phase E). Don't paper over it.

## Output

One synthesized artifact and a short synthesis note. The note names:

- the base and why
- the judge's verdict, or that the judge was skipped or shared your family
- each graft and its source candidate
- what was rejected and why
- convergence or dropouts
- the verification result
- the candidate worktree paths, so the user can compare or remove them

## Related

- Design before code that crosses a function boundary belongs to [`architect`](../architect/SKILL.md), which reads and follows this skill in its phase B.
- Breaking a finished change belongs to [`interrogate`](../interrogate/SKILL.md), which reuses phases A, B, and F with adversaries.
- Lens coverage on a diff belongs to [`swarm`](../swarm/SKILL.md). It has no base and no graft.
- A question one run can answer belongs to [`prototype`](../prototype/SKILL.md).
