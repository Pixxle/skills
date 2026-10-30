---
name: thermo-nuclear-code-quality-review
description: Review a change for structural maintainability and major simplification opportunities. Use only when the user names thermo-nuclear or asks for an unusually strict, maintainability-only audit. For a general or thorough PR review, use swarm.
disable-model-invocation: true
---

# Thermo-Nuclear Code Quality Review

Apply an exceptionally high structural quality bar. Actively search for a substantially simpler implementation, including changes to the underlying model or ownership boundaries. Continue beyond the first acceptable design when substantial complexity remains unexplained. If a concrete, behavior-preserving alternative would eliminate significant complexity, treat the missed simplification as grounds to request changes—even when the implementation works and its tests pass. Require evidence for criticism, and do not soften a substantiated structural problem into an optional cleanup suggestion.

Produce a review. Implement changes only when the user has requested implementation as well.

## Understand the change

Establish the review scope: the requested diff or branch comparison, its base, and whether working-tree changes are included. Map the behavior delta, affected contracts, relevant constraints, and structural hotspots before judging the implementation. Explore surrounding code where it helps explain or verify the change; keep broader redesign proposals tied to that scope.

Use parallel read-only exploration when independent areas justify it and sub-agents are available. Group work by feature, layer, or ownership boundary. A small, cohesive diff can be mapped directly. Exploration reports should distinguish observed behavior from inferred intent and include source locations, relevant callers or contracts, and uncertainties.

Treat inferred intent as a hypothesis to verify. An understandable motivation does not excuse unnecessary complexity; verified compatibility, operational, and domain constraints remain part of judging any alternative.

Carry the map into the review and continue without pausing for confirmation. The map guides coverage without limiting the review to initially flagged code.

## Evaluate structural quality

Every added line must earn its place: it adds complexity and needs a concrete justification in the task's required behavior or verified constraints. Always look first for a solution through deletion, reuse, or changes to existing code. If the requirement can be met without adding code while preserving correctness, clarity, and required coverage, require that approach. Assess additions individually even in a net-negative diff. Judge overall complexity; compressing syntax or removing necessary validation or tests does not count as simplification.

Apply these lenses where relevant:

- **Simplification:** Can a different state model, ownership boundary, or use of existing architecture eliminate substantial complexity? Compare the total concepts and indirection before and after, including any machinery the proposed remedy introduces.
- **Cohesion and branching:** Look for scattered feature checks, duplicated decisions, and tangled responsibilities. Extract or consolidate logic when that reduces the burden of understanding or changing it; splitting code into more files is not itself an improvement.
- **Abstractions and ownership:** Prefer direct flows and existing canonical helpers. Question wrappers, generic mechanisms, and logic crossing layers when they obscure responsibilities or duplicate an established capability.
- **Contracts and invariants:** Investigate casts, unnecessary optionality, loose data shapes, and silent fallbacks when they hide an invariant that could be explicit. Respect the language's idioms and legitimate boundary validation.
- **Orchestration:** Consider parallel work or atomic updates when they simplify coordination or eliminate partial-state hazards. Verify independence, ordering, failure semantics, and operational constraints before proposing a change.
- **Module size:** A file crossing 1,000 lines deserves inspection for mixed responsibilities and difficult navigation. Size alone does not establish a defect; account for cohesion, generated content, and the coupling an extraction would introduce.

These are investigation signals. A finding needs evidence of a material maintenance cost or a concrete, materially simpler design.

## Substantiate findings

Verify candidate findings against the source, including relevant callers, tests, existing utilities, and documented constraints. Check whether evidence explains the current design or invalidates the proposed remedy. Do not rely on an exploration summary as proof.

For each retained finding, provide:

- A precise code location and the structural problem or missed simplification.
- The practical cost: what becomes harder to understand, change, reuse, or keep consistent.
- A feasible alternative and why it reduces overall complexity while preserving the required behavior and contracts.
- Relevant tradeoffs and any uncertainty about the diagnosis or behavior preservation. Use targeted checks when needed to settle a disputed assumption.

A plausible redesign, personal preference, or threshold crossing alone is insufficient. Separate exploratory suggestions from substantiated findings.

## Deliver and finish

Open with a concise explanation of what the change does and a brief review map, scaled to the diff. Present findings in priority order: structural regressions and major simplifications first, then branching, boundary, modularity, and legibility concerns. Be direct about consequential problems and favor a few well-supported findings over cosmetic comments.

Resolve every mapped hotspot as a finding, a dismissed concern with supporting evidence, or an unresolved question with the missing evidence identified. Group clean areas briefly so coverage reporting does not overwhelm the findings. Report material verification limits rather than implying those areas are clean.

Finish when the change and relevant boundaries are understood to the extent available evidence allows, retained findings have been checked, and every hotspot has a reported disposition. If there are no material findings, say so. Stop after delivering the review unless implementation is also part of the user's request.
