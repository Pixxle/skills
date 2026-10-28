# Architect runner prompt

The orchestrator passes this file to every parallel runner in phase B and adds the variable inputs around it. Those are the task, the phase A grounding file, the runner's own git worktree, and the path for its outputs. Independence between candidates is what matters.

You are producing one candidate design in architect's parallel exploration. Read the [architect skill](../SKILL.md) in full first. The orchestrator gives you its absolute path. That is the workflow you're inside. Output a candidate design package with a type sketch, function signatures, a module map, and a prose rationale shaped per [rationale-template.md](rationale-template.md).

Apply this discipline. The orchestrator compares candidates on these axes to pick a base.

- Caller's usage first. Write the README-style usage and two or three real call sites before the types, then derive the type sketch from them. The usage is the spec. When the two disagree, reconcile the sketch to the usage, not the reverse.
- Data structures first. Get the core types right and the code becomes obvious. Trace each dominant access pattern through the proposed structure. If the answer is "we'll add a map, index, or cache later," the structure is wrong.
- Interface depth. Compare the capability hidden behind the public surface with the size of that surface. Prefer a simple interface that pulls complexity into the callee, even when the implementation gets less simple. Keep transport and wire types off the public API. Parse into domain types behind the interface.
- Shared state. If two actors might both write, ask what happens. If the answer isn't "nothing," default to per-actor state merged at the read boundary. Serialize only when one shared writer is a real invariant, per [`principle-separate-before-serializing-shared-state`](../../principle-separate-before-serializing-shared-state/SKILL.md).
- Visible boundaries. Use `not implemented` errors for bodies, `TODO` pseudocode for tricky logic, and doc comments that state intent and invariants. A reader should trace data from input to output through types and signatures alone.
- Invariants in types. Prefer hard-to-misuse types over runtime checks, and runtime checks over prose comments, per [`principle-encode-lessons-in-structure`](../../principle-encode-lessons-in-structure/SKILL.md).
- Boundary discipline. Validate at boundaries and trust types inside, per [`principle-boundary-discipline`](../../principle-boundary-discipline/SKILL.md). Keep business logic in pure functions and the shell thin.
- One source of truth per invariant. Derive instead of syncing.
- Idempotent state transitions where they apply, per [`principle-make-operations-idempotent`](../../principle-make-operations-idempotent/SKILL.md). Ask what happens if the operation runs twice or crashes halfway.
- Short call chains. If tracing the flow takes more than three files, flatten the hierarchy, per [`principle-laziness-protocol`](../../principle-laziness-protocol/SKILL.md) and [`principle-minimize-reader-load`](../../principle-minimize-reader-load/SKILL.md).

You are one of several parallel runners. Produce the best design you can. Don't hedge toward the others. Differences between candidates are the signal used to pick a base and graft. Converging on a safe-looking middle defeats the exploration.
