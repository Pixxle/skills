---
name: thermo-nuclear-refactor
description: Uses structured discovery, cross-module tracing, and independent verification to find high-value codebase refactorings, drafts concrete proposals with coverage evidence, and implements only accepted proposals. Use when the user requests thermo-nuclear refactoring, a pre-review simplification pass, or a proposal-first codebase refactor.
---

# Thermo-Nuclear Refactor

Find substantially simpler designs, including changes to state models and ownership boundaries. Apply the structural quality bar of a thermo-nuclear review to existing code, then turn verified opportunities into proposals the user can accept individually. No prior review or findings are required.

Invocation authorizes investigation and proposal drafting. Wait for the user's acceptance of concrete proposals before editing project files. Preserve observable behavior and contracts throughout the refactoring; identify bug fixes and intentional behavior changes separately for explicit acceptance.

Example requests: “Find the highest-value refactors in this codebase and propose them before changing anything”; “Run a thermo-nuclear refactor on the job lifecycle before review.”

## 1. Understand the scope

- Read and follow [INVESTIGATION.md](INVESTIGATION.md) before discovery. It defines the coverage ledger, worker briefs, verification, and completion criteria. Keep run notes in conversation or temporary storage unless repository artifacts are requested.
- Use the requested repository, subsystem, paths, or diff. Default to the whole current codebase, including its working-tree state. Inspect local instructions, repository status, architecture documentation, and build/test conventions. Preserve existing user changes.
- Inventory first-party modules, entry points, tests, contracts, and major flows. Assign every module to a named target and every major cross-module flow to an end-to-end tracing target. Give rule-bearing producer/consumer seams explicit ownership of both sides.
- For whole-codebase or multi-subsystem scopes, use read-only sub-agents for discovery, tracing, and independent challenge when available; this is the default workflow, not an optional optimization. Queue targets within available concurrency and reuse workers. A small cohesive scope can be investigated directly; if delegation is unavailable, perform the stages sequentially and disclose the independence limit.
- Use churn, recurring fixes, co-changing files, duplicated decisions, brittle tests, and maintenance comments to prioritize depth. For young or actively built systems, emphasize current state writers, dependency cycles, cross-feature coupling, and change scenarios; sparse history is not evidence of health. AI-authored source is first-party code; exclude only reproducible generated outputs and vendored code unless their integration is the problem.
- Use prior maps, findings, and user pain points as leads, not proof. Record source fingerprints and recheck changed targets before reporting; newly appearing or still-moving code is incomplete coverage until investigated, not a clean area.
- Maintain the coverage ledger throughout the run. Distinguish mapped, traced, challenged, and incomplete targets; name gaps rather than implying a sampled codebase was fully investigated.

## 2. Hunt for structural simplifications

Start with deletion, reuse, and changes to existing code. Every added concept, layer, and line must justify its cost through required behavior or verified constraints. Continue beyond the first acceptable design when substantial complexity remains unexplained. Judge the total design, including machinery the remedy introduces.

Investigate these lenses where relevant:

- **Models and invariants:** Can a better state representation remove impossible combinations, synchronization, casts, loose shapes, unnecessary optionality, or silent fallbacks? Preserve legitimate boundary validation.
- **Ownership and cohesion:** Is one decision scattered across consumers, duplicated across layers, or maintained by several competing owners? Find the boundary that removes coordination rather than merely relocating it.
- **Control flow:** Can a canonical decision, explicit transition, or direct data flow replace tangled branching and repeated feature checks? Explain which real change becomes easier afterward.
- **Abstractions:** Can wrappers, generic mechanisms, adapters, or parallel implementations disappear through existing capabilities or a simpler contract? File splitting and new helper layers need a net reduction in complexity.
- **Orchestration:** Can clearer ordering, atomicity, or independent work remove partial-state hazards and coordination code? Verify failure, cancellation, retry, and concurrency semantics before changing them.
- **Module size:** Inspect large files for mixed responsibilities and difficult navigation. Size alone does not justify extraction; account for coupling the extraction would create.

For each target, trace realistic changes the system is likely to need and identify the files, decisions, or state writers they would force a developer to coordinate. Compare genuinely different ownership/model alternatives before settling for a local extraction. Ground scenarios in requirements or current capabilities; label assumptions.

Favor root causes and major simplifications over cosmetic cleanup. Fewer lines, compressed syntax, a preferred pattern, or a fashionable architecture alone do not establish value. Necessary validation and meaningful tests must survive. Discovery has no finding quota or top-N cap; an early strong candidate is not a stopping condition.

## 3. Verify each candidate

Have an independent worker challenge each candidate against relevant callers, consumers, tests, existing utilities, and documented constraints. Use a different worker from its author when available. Check the strongest explanation for the current design and try to invalidate both the diagnosis and proposed replacement. The lead must inspect decisive source evidence before retaining a proposal; worker summaries alone are not proof.

For each candidate, establish a concrete maintenance cost, a feasible simpler design, and evidence that required behavior survives. Check applicable API, persistence, serialization, ordering, error, security, and performance constraints. An intentional pattern is neither automatically defective nor immune to evidence of harm.

Track each candidate as confirmed, reframed, rejected, or unresolved, with evidence. Keep speculative redesigns out of the executable proposal set. Run the independent omission pass in the investigation protocol, then verify any new candidates it raises. Resolve all targets and account for incomplete work before drafting the report.

Do not stop structural investigation because an aggregate check fails at formatting. Discover and run safe, independent compile/test stages when possible, without formatting or modifying project files. Distinguish failed checks from stages never reached. If no material opportunity survives verification, report that result and its coverage evidence without manufacturing work.

## 4. Draft proposals for the user

Present the draft in the conversation by default. Do not create source edits, refactoring patches, or repository planning artifacts before approval unless separately requested. Open with the main simplifications, then a compact coverage table: targets, paths/flows, depth reached, disposition, and gaps. Include source freshness, unique candidate counts by verdict, and how many proposals remain after consolidation; never invent coverage or counts.

Give each proposal a stable ID such as **R1**, a concrete title, and:

1. **Evidence and cost:** precise source locations, the current structural problem, and a realistic change scenario that demonstrates its maintenance cost.
2. **Before and after:** the current model or flow, the proposed replacement, and what disappears or becomes simpler. Use a small sketch or illustrative snippet when it makes the design reviewable.
3. **Behavior to preserve:** the contracts and invariants involved, supporting evidence, and any uncertainty that must be settled before implementation.
4. **Implementation:** affected files/modules and callers, ordered steps, prerequisites, and dependencies or conflicts with other proposal IDs.
5. **Payoff and tradeoffs:** the net reduction in concepts or coordination, expected effort, blast radius, and material risks. Avoid invented precision or unsupported performance claims.
6. **Validation:** existing checks to run, targeted behavioral coverage needed, and observable acceptance criteria proving both compatibility and the intended simplification.

Merge overlapping proposals around their common cause. List every verified material opportunity, ranked by structural payoff, confidence, and risk. Recommend a first implementation batch separately from the full inventory; do not silently drop lower-ranked opportunities to keep the recommendation short. Report dismissed concerns, unresolved questions, incomplete coverage, and verification limits briefly.

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
