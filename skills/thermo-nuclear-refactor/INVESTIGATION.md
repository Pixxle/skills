# Investigation protocol

Read before discovery. The lead owns coverage and synthesis; workers investigate concrete targets. Finding count measures neither depth nor completion. Earn a short proposal list through complete target dispositions, not a preference for short output.

## Establish the source being investigated

Record the repository revision, requested scope, relevant working-tree changes including untracked source, exclusions, and source fingerprints for assigned targets. Inspect actual files; do not equate a revision identifier with an unchanged working tree.

Keep fingerprints, evidence, and worker results in conversation or temporary run notes. Do not modify project source, create commits, switch branches, stash changes, or stop another writer to obtain a stable view. Capture scoped source contents in temporary storage when needed to anchor analysis; do not copy unrelated files or secrets.

Each worker reports which source version it read. Before synthesis, compare fingerprints and the scoped file inventory again. Reinvestigate changed evidence, affected callers/contracts, and newly added source in a bounded delta pass. Do not combine contradictory versions into a claim about one consistent implementation.

If source keeps moving, identify the last verified version and mark unsettled targets incomplete. Deliver stable proposals with that limit rather than chasing changes indefinitely or declaring new lifecycle code clean after sampling it. Revalidate accepted proposals against current code before implementation.

## Build the coverage ledger

Inventory the whole requested scope before selecting attractive hotspots. Group cohesive files into targets; do not create one worker per file. Record exclusions and their reason. AI-authored application code belongs in the inventory, even if described as “generated.”

Use these target kinds:

- **Module:** a coherent responsibility with its entry points, key types, dependencies, state owners, and tests. Every in-scope first-party module belongs to a target, including less suspicious code.
- **Flow:** a major scenario owned end to end across module boundaries. Trace its normal path and applicable error, retry, cancellation, restart, and recovery paths. Several module reports do not substitute for a flow trace.
- **Seam:** a rule-bearing producer/consumer boundary. One owner examines both sides, especially translation, duplicated interpretation, reconstructed state, and responsibility drift. Merge with a flow target when the same trace covers it explicitly.
- **Deep dive:** a concentrated investigation of a high-cost state model or ownership problem identified by discovery. Increase depth here without dropping coverage elsewhere.

Maintain a compact ledger, adding evidence as work completes:

| Target | Kind | Paths / entry-to-effect route | Owner | Depth | Disposition / evidence / gaps |
| --- | --- | --- | --- | --- | --- |
| Job lifecycle | Flow | intake → worker → persistence → publication | Assigned worker | Traced | Recovery path needs independent challenge |

The row above is illustrative. Populate actual targets from source, not from this example.

Depth means **queued**, **mapped**, **traced**, **challenged**, or **incomplete**. A discovered file is not a traced flow. A dismissed candidate does not establish that its whole module is clean. A completed target records its examined paths/scenarios and either verified opportunities or evidence explaining why investigated alternatives did not simplify it.

Treat flat churn or few bug fixes in a young repository as missing historical evidence. Use current coupling, ownership, duplicate decisions, synchronization, and realistic extensions instead. Do not assume young code is defective either.

## Schedule the work in stages

Delegate these stages to read-only sub-agents when available. Use the available worker pool in waves; logical targets can outnumber concurrent workers. For example, with three worker slots, map three cohesive partitions concurrently, then reuse those workers for flow tracing and independent verification. The lead integrates their evidence and owns cross-target questions.

1. **Discovery:** scouts map assigned partitions and expose seams. They produce facts and a worklist, not a final proposal list.
2. **Tracing and design:** workers own module, flow, seam, and deep-dive targets. At least one cross-module tracing pass starts from the map and code before seeing ranked candidate remedies, reducing anchoring on early suggestions.
3. **Independent challenge:** rotate candidates to workers who did not author them. Batch related candidates when useful, but return a separate verdict for each. A worker may map a target and later verify another worker's proposal; it must still read the decisive code itself.
4. **Omission pass:** an independent worker examines coverage and searches for a missed structural cause, including areas called clean. This is distinct from checking whether existing candidates are true.

Keep write operations with the lead after user acceptance unless implementation delegation is separately justified. Investigation workers must not edit code, run autofix commands, or create repository planning files.

If sub-agents are unavailable, perform all four roles sequentially and state that challenge was not independent. Do not claim parallelism, delegate counts, or independent verification that did not happen.

## Shared worker input and output

Give each worker the repository and scope, applicable local instructions, source version/fingerprints, assigned targets, known contracts and user pain points, this protocol, and the structural lenses from the main skill. Include neighboring targets and relevant evidence so a partition is not treated as a closed world.

Require source citations, actual traced paths, tests inspected, and uncertainties. Workers may cross their assigned boundary to understand callers or contracts; report that exploration to the lead. Distinguish observed behavior from inferred intent. Report concise evidence, not only assurances such as “reviewed recovery.”

### Discovery brief

Map the assigned responsibility without proposing a preferred fix. Identify entry points, types, state writers/readers, durable and external effects, invariants, dependencies, test coverage, and producer/consumer seams. Propose concrete module/flow/seam/deep-dive targets with starting locations. Identify omissions in the initial partition and source drift. Return a map and prioritized worklist with evidence and gaps; do not stop after spotting duplication.

### Tracing and design brief

Trace the assigned target through its callers, effects, and applicable failure paths. Work these questions in order:

1. What realistic changes are likely here, based on existing capabilities or requirements? Trace where each change would force coordinated edits, decisions, or state updates. Explain why this is avoidable complexity rather than required domain work.
2. Which model or ownership boundary causes that coordination? Look for competing sources of truth, repeated lifecycle interpretation, duplicated policy, backward dependencies, and consumer logic reconstructing producer internals.
3. What substantially different design could remove the cause? Compare deletion/reuse and a change of ownership or representation with a local extraction. Count the concepts and failure modes each alternative introduces as well as those it removes.
4. Which verified constraints justify the current structure? Trace compatibility, persistence, cancellation, retry, concurrency, error, authorization, and performance requirements where applicable. Respect language idioms; a framework, large type, or shared-state primitive is not defective on principle.
5. After model-level investigation, which smaller consolidations independently reduce material maintenance cost?

Return all credible candidates for verification, not just your favorite two. Assign temporary IDs. For each, provide locations, maintenance scenario, root cause, concrete replacement, removed complexity, affected callers/contracts, tradeoffs, confidence, and missing proof. Label structural refactoring separately from bug correction or intentional behavior change. Record alternatives rejected on evidence and target paths not examined. Zero candidates is valid when supported by traced evidence.

### Independent challenge brief

Read the candidate's decisive source and follow relevant callers, consumers, tests, and failure paths beyond the author's slice. Challenge both whether the problem exists and whether the remedy addresses its cause. Model-level candidates receive the same evidentiary scrutiny as local extractions; do not assume a claimed tangle is real.

Check whether an existing utility or invariant already solves the problem, a different caller invalidates the proposal, or the remedy adds equal or greater complexity. Verify preservation claims against observable success and failure behavior. If atomicity or recovery changes observable failure handling, call out that correction explicitly rather than describing all behavior as unchanged.

Return one verdict per candidate:

- **Confirmed:** the problem and feasible remedy hold, with decisive source evidence and compatibility limits.
- **Reframed:** the cost is real but the cause or remedy needs correction; provide the corrected design and supporting trace. Unverified speculation remains unresolved.
- **Rejected:** the diagnosis is false, the design is justified, or the remedy has no net payoff; give the counterevidence.
- **Unresolved:** specific evidence is missing, source is unstable, or behavior preservation cannot yet be established; name what would settle it.

Also tag the candidate as model/ownership, flow/orchestration, or local consolidation so a cleanup-heavy run cannot hide its depth behind total counts. Do not inflate severity to make the report look stronger.

The lead reads decisive locations before accepting a verdict, merges overlapping causes, and checks that the consolidated remedy still has evidence. Preserve candidate IDs and verdicts through consolidation.

### Omission brief

Read the ledger and discovery map. Start with important targets that produced no candidates, high-coupling seams, recently added source, and user pain points. Independently trace the most consequential apparent gap; do not merely reread the proposed remedies.

Ask whether local consolidations are symptoms of a larger state/ownership problem and whether the current decomposition itself hid a cross-module cause. Check that difficult alternatives were rejected through evidence rather than effort aversion. A larger behavior-preserving restructuring is allowed when its net payoff warrants it; an incompatible redesign needs a separately identified proposal, not a disguised refactor.

Return missed candidates with evidence, specific additional traces required, or a supported explanation that examined areas need no material refactor. All new candidates re-enter verification. Complete at least one omission pass; do not loop until an arbitrary number of findings appears.

## Synthesis and completion criteria

Before presenting a complete investigation:

- Every in-scope module is assigned, every major flow has an owner and trace, and material producer/consumer seams are covered on both sides.
- Every target has a disposition backed by examined paths and scenarios. Mapped-only, sampled, blocked, or moving targets remain explicit incomplete coverage. Finish their analysis when possible; disclose gaps when it is not.
- Every candidate has a verdict, every retained remedy has independent evidence when delegation is available, and overlapping causes have been consolidated without losing distinct opportunities.
- The omission pass is complete and concrete candidates it raised have been resolved or marked unresolved.
- Source drift has been checked, changed evidence has been revisited, and remaining freshness limits are identified.

If time, context, tool, or source-stability limits prevent completion, deliver a partial investigation with the unfinished work named. A lack of completed coverage cannot be repaired by confident prose or extra cosmetic findings.

Report unique candidate counts: total → confirmed / reframed / rejected / unresolved, followed by the number of proposals after consolidation. Distinguish model/ownership improvements from flow changes and local consolidations. Do not confuse a small recommended first batch with the full verified opportunity inventory.

Show the coverage ledger compactly with evidence and gaps. For example, “2 proposals from 11 candidates, with 7 rejected on constraints and 2 unresolved” is informative only when those counts and dispositions actually exist. Two proposals after broad independent investigation can be a strong result; two proposals after sampling are a partial result.
