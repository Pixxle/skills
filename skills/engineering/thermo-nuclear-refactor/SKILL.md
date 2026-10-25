---
name: thermo-nuclear-refactor
description: Identifies and verifies high-value refactoring opportunities across a codebase, drafts concrete proposals, and implements only the proposals the user accepts. Use when the user requests thermo-nuclear refactoring, a pre-review simplification pass, or a proposal-first codebase refactor.
---

# Thermo-Nuclear Refactor

Find substantially simpler designs, including changes to state models and ownership boundaries. Apply the structural quality bar of a thermo-nuclear review to existing code, then turn verified opportunities into proposals the user can accept individually. No prior review or findings are required.

Invocation authorizes investigation and proposal drafting. Wait for the user's acceptance of concrete proposals before editing project files. Preserve observable behavior and contracts throughout the refactoring.

Example requests: “Find the highest-value refactors in this codebase and propose them before changing anything”; “Run a thermo-nuclear refactor on the job lifecycle before review.”

## 1. Understand the scope

- Use the requested repository, subsystem, paths, or diff. Default to the whole current codebase, including its working-tree state; do not assume a branch diff. Inspect local instructions, repository status, architecture documentation, and build/test conventions. Preserve existing user changes.
- Map responsibilities, state ownership, public contracts, and major flows across module boundaries. Follow at least one representative end-to-end path for each major flow in scope; isolated file inspections miss complexity at the seams.
- Use churn, recurring fixes, co-changing files, duplicated decisions, brittle tests, and maintenance comments to prioritize investigation. Read the actual code; history, size, and dependency counts are signals rather than proof. Exclude generated and vendored code unless its integration is the problem.
- Use existing maps or review findings as leads and verify them against the current source. Incorporate pain points already supplied by the user; ask only when missing context materially affects the proposed design or scope.
- Use parallel read-only sub-agents when independent areas justify them and they are available. Assign ownership of cross-module flows as well as coherent subsystems. Require evidence, callers, constraints, and uncertainties in their reports; a small scope can be investigated directly.
- State the scope actually examined and any gaps. Prioritize depth where complexity concentrates; do not imply exhaustive coverage of a codebase that was only sampled.

## 2. Hunt for structural simplifications

Start with deletion, reuse, and changes to existing code. Every added concept, layer, and line must justify its cost through required behavior or verified constraints. Continue beyond the first acceptable design when substantial complexity remains unexplained. Judge the total design, including machinery the remedy introduces.

Investigate these lenses where relevant:

- **Models and invariants:** Can a better state representation remove impossible combinations, synchronization, casts, loose shapes, unnecessary optionality, or silent fallbacks? Preserve legitimate boundary validation.
- **Ownership and cohesion:** Is one decision scattered across consumers, duplicated across layers, or maintained by several competing owners? Find the boundary that removes coordination rather than merely relocating it.
- **Control flow:** Can a canonical decision, explicit transition, or direct data flow replace tangled branching and repeated feature checks? Explain which real change becomes easier afterward.
- **Abstractions:** Can wrappers, generic mechanisms, adapters, or parallel implementations disappear through existing capabilities or a simpler contract? File splitting and new helper layers need a net reduction in complexity.
- **Orchestration:** Can clearer ordering, atomicity, or independent work remove partial-state hazards and coordination code? Verify failure, cancellation, retry, and concurrency semantics before changing them.
- **Module size:** Inspect large files for mixed responsibilities and difficult navigation. Size alone does not justify extraction; account for coupling the extraction would create.

Favor root causes and major simplifications over cosmetic cleanup. Fewer lines, compressed syntax, a preferred pattern, or a fashionable architecture alone do not establish value. Necessary validation and meaningful tests must survive.

## 3. Verify each candidate

Trace relevant callers, consumers, tests, existing utilities, and documented constraints yourself. Check the strongest explanation for the current design and try to invalidate the proposed replacement. Do not accept a sub-agent summary as proof.

For each candidate, establish a concrete maintenance cost, a feasible simpler design, and evidence that required behavior survives. Check applicable API, persistence, serialization, ordering, error, security, and performance constraints. An intentional pattern is neither automatically defective nor immune to evidence of harm.

Resolve mapped hotspots as a verified proposal, a dismissed concern with its reason, or an unresolved question with the missing evidence. Keep speculative redesigns out of the executable proposal set. If no material opportunity survives verification, say so, explain coverage limits, and finish without manufacturing work.

## 4. Draft proposals for the user

Present the draft in the conversation by default. Do not create source edits, refactoring patches, or repository planning artifacts before approval unless separately requested. Open with the main simplification opportunities and the scope examined.

Give each proposal a stable ID such as **R1**, a concrete title, and:

1. **Evidence and cost:** precise source locations, the current structural problem, and a realistic change scenario that demonstrates its maintenance cost.
2. **Before and after:** the current model or flow, the proposed replacement, and what disappears or becomes simpler. Use a small sketch or illustrative snippet when it makes the design reviewable.
3. **Behavior to preserve:** the contracts and invariants involved, supporting evidence, and any uncertainty that must be settled before implementation.
4. **Implementation:** affected files/modules and callers, ordered steps, prerequisites, and dependencies or conflicts with other proposal IDs.
5. **Payoff and tradeoffs:** the net reduction in concepts or coordination, expected effort, blast radius, and material risks. Avoid invented precision or unsupported performance claims.
6. **Validation:** existing checks to run, targeted behavioral coverage needed, and observable acceptance criteria proving both compatibility and the intended simplification.

Merge overlapping proposals around their common cause. Rank by structural payoff, confidence, and risk; recommend the smallest coherent set worth doing. Report dismissed concerns and unresolved areas briefly so coverage remains honest.

For example, a proposal to replace three independently mutable job-status flags with one explicit lifecycle must identify their writers and readers, show which inconsistent states disappear, and preserve transition, retry, and serialization behavior. “Introduce a state machine” alone is not a proposal.

Ask which IDs the user accepts, wants revised, or defers, then wait. Invocation, silence, interest, or a request to revise the draft is not acceptance. If acceptance is ambiguous, clarify the selected set; approval of a dependent proposal does not silently authorize an unaccepted prerequisite.

## 5. Execute accepted proposals

- Record the accepted IDs and agreed design in the conversation. Accept a clear approval of the full presented set as well as individual selections. Keep IDs stable through revisions and preserve prior approvals; do not ask again for unchanged, accepted work.
- Respect the active collaboration mode. If it permits planning only, retain the approval and wait until implementation is allowed.
- Recheck the current source and working-tree changes, then run the relevant existing checks to establish a baseline. Identify pre-existing failures and validation gaps before attributing results to the refactor.
- Implement only the accepted proposals, in dependency order and coherent increments. Include necessary caller and test updates; leave deferred proposals and unrelated cleanup alone. Do not reset, overwrite, or revert the user's work.
- Use characterization tests when important behavior lacks coverage, and targeted regression tests where the design has meaningful compatibility risk. Prefer behavioral assertions over tests that mirror internal structure. Do not weaken coverage or change expected behavior just to make checks pass.
- Run the agreed checks after each coherent change. Fix regressions introduced by the refactor within the approved design, then run the applicable integration/build/type checks for the combined result. If safe verification is unavailable, report the limit explicitly.
- If new evidence requires a materially different design, broader scope, an unapproved dependency, or a behavior/contract change, stop that proposal and present a revised draft for acceptance. Continue independent accepted work when safe; routine implementation choices within the accepted design need no renewed approval.

## 6. Verify and deliver

Inspect the final diff against each accepted proposal and its acceptance criteria. Trace affected contracts again and confirm the intended complexity actually disappeared; relocated complexity is not success. Resolve issues found within the accepted scope and rerun affected checks.

Report completed IDs, the resulting simplifications, checks and outcomes, and any remaining risks or blocked work. Distinguish pre-existing failures from regressions. Identify deferred or revised proposals without implementing them. Leave a concrete, reviewable result; do not claim completion while required validation or accepted work remains unresolved.
