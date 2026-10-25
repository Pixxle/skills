# Hierarchical investigation and aggregation

Use sub-agents for source investigation, aggregation, and independent verification.
The coordinator owns the investigation plan and the final system explanation; it
does not load the entire repository or every leaf report into its context. The
purpose of each tier is to explain construction and behavior at a wider scope
while preserving links to the detailed evidence underneath it.

## Establish durable state

Resolve `map_root` once, defaulting to `_system-map/` or using the selected unique
or caller-specified destination. All artifact paths in this guide are relative to
that root. Include it in every assignment; workers must never independently pick
an output directory. Before dispatching source workers, create
`<map_root>/_work/manifest.md`. Record:

- Repository, resolved map root, revision, source snapshot or file fingerprints, pre-existing working
  tree changes, investigation date, requested scope, and explicit exclusions.
- The discovered applications, packages, runtime processes, entrypoints, and
  deployment units, with pointers to the inventory and coverage shards.
- A work-unit index: stable ID, role, scope, owner, parent aggregation unit,
  expected output paths, dependencies, status, and handoff location.
- Current phase, remaining work, unresolved questions, and available concurrency.

Keep the manifest a compact index. Store detailed assignments, coverage ledgers,
handoffs, boundary contracts, and verification results in separate files under
`_work/`, sharded by work-unit ID. Do not build one enormous scheduling document.
At large scale, index immediate child units and their ledgers at each tier rather
than listing every leaf in the global manifest. Schedule from ready-work shards;
the coordinator need not load all assignments or coverage entries at once.
Each worker owns its assigned report and work files; only the coordinator updates
the global manifest. Reading overlapping source is useful, but concurrent writers
must never own the same artifact. Give a boundary or cross-cutting investigation
an explicit owner instead of assuming adjacent workers will cover it.

Use states such as `pending`, `running`, `partial`, `documented`, `verified`, and
`blocked`, and define them in the manifest. A completed report is `documented`;
it does not automatically mean its source coverage or contracts were independently
verified. Track investigation depth separately from scheduling status.

## Discover, partition, and assign

1. Inventory the repository using file searches, manifests, build configuration,
   schema and route declarations, executable entrypoints, deployment definitions,
   and existing documentation. Treat existing documentation as a lead to check.
2. Partition around coherent runtime or product responsibilities: applications,
   services, packages, domains, adapters, or pipeline stages. Directory boundaries
   are evidence, not proof of architectural boundaries.
3. Give source exploration units small enough scopes to explain with available
   context. Split a unit again when it contains several independent capabilities,
   too many contracts to retain reliably, or unresolved paths that exceed a
   worker's context. Do not let a line-count target decide completeness.
4. Assign separate owners where necessary for shared API registration, schemas,
   persistence, authorization, messaging, infrastructure, and user-interface entry
   points. These owners reconcile inventories across local units; they do not all
   repeat a whole-repository investigation.
5. Assign end-to-end flow owners whose scopes cross the local partitions. They
   trace important user or machine operations through the actual source, including
   synchronous calls, events, jobs, external systems, and final state changes.

Every inventoried source area must have an owner or an explicit coverage
classification. Record whether it was source-traced, declaration-inventoried,
sampled, deferred, inaccessible, or excluded, with the actual files or patterns
and the reason. Document the representative paths behind a sampled conclusion.
Generated code, vendor trees, tests, migrations, and inactive-looking modules
still need a classification; exclude them deliberately, not by omission. Tests
can explain behavior, but test coverage is not evidence of full source coverage.

Adapt the hierarchy to what discovery reveals. A hypothetical 200,000-line system
spread across many packages might use 24 source units, six subsystem integrators,
two service or domain integrators, and one system synthesis, plus shared-contract
and flow workers. Those counts illustrate four abstraction tiers, not prescribed
sizes or a requirement to read a fixed number of lines. A smaller repository may
need only source workers and system synthesis; a larger one may need more tiers.
These are investigation groupings; do not draw them as runtime services unless
the source and deployment evidence support that interpretation.

## Dispatch bounded assignments

Each assignment must carry the following brief, saved in its work shard:

- Role, work-unit ID, source snapshot, resolved map root, exact scope, exclusions, and parent ID.
- The question to answer for a newcomer and the capabilities to investigate.
- Known entrypoints, neighboring units, shared dependencies, and contract IDs.
- Source and report paths to consult, expected output paths, and writing ownership.
- Required coverage ledger, handoff fields, outstanding questions, and completion
  conditions. Allow the worker to request a split or report a newly found unit.

Source workers write substantial explanations under
`components/<id>.md` within the resolved map root, supported by interface inventories under
`interfaces/<id>.md` where useful. Explain what the component does, its public
inputs and outputs, how its internal parts cooperate, the state it owns, important
business rules, and how execution reaches other components. Include normal and
failure behavior, relevant permissions, persistence, concurrency, retries, and
configuration when the source supports them. Help a newcomer find the concrete
entrypoints and follow the implementation. Do not substitute a smell list,
symbol index, or a list of files for this explanation.

Workers report newly discovered boundaries and follow-up questions to the
coordinator. They must not quietly expand into unbounded repository-wide work.
The coordinator updates ownership and schedules follow-ups or splits the scope.

## Preserve meaning at every handoff

Workers write their detailed report and ledger to disk, then return a compact
handoff with links. The handoff must preserve:

| Field | Required content |
| --- | --- |
| Identity | Unit ID, role, snapshot, scope, resolved map root, report paths, parent, and child IDs. |
| Technical model | Responsibilities, capabilities, construction, important state owners, and the control/data path. |
| Contracts | Stable IDs and links for all discovered incoming/outgoing interfaces, their counterpart owners, and unresolved ownership. Preserve behavior-changing constraints such as authorization, transaction boundaries, event ordering, retries, idempotency, and compatibility assumptions. |
| Evidence | Repo-relative source paths with line numbers or stable symbols, linked claim/report sections, and any disagreement between source and documentation. |
| Coverage | Link to the scoped ledger, investigation depth, exclusions, samples, and untraced branches. |
| Uncertainty | Explicit observed/inferred/unknown distinctions, competing interpretations, blockers, and required follow-up. |
| Integration | Cross-unit flows, contradictions, essential conclusions for the parent, and questions requiring a wider view. |

Keep exhaustive contract detail in its owning interface report and link every
boundary from the handoff. Compactness must come from structured references and
removing repetition, not dropping inconvenient contracts or unknowns. Do not send
source dumps or concatenate reports into a parent's prompt. If a handoff cannot
retain its important model and boundary references, split the unit or add an
aggregation tier. A short summary alone is never the evidence record.

## Aggregate by architectural scope

Integrators consume only their assigned child handoffs and targeted report
sections. They write explanatory summaries under `areas/<id>/README.md`;
deeper grouping directories are allowed when another tier helps navigation.
Each summary must explain:

- The subsystem or domain's capabilities, runtime parts, and how they cooperate.
- Its external interfaces, data ownership, internal flows, and operational model.
- Which child owns each important contract and where the supporting explanation
  and source evidence live.
- Boundary mismatches, inherited coverage limitations, and unanswered questions.

Aggregation is an integration task: reconcile names, follow interfaces across
children, and resolve contradictions by inspecting targeted evidence or sending
a source follow-up. Do not simply compress each child paragraph in sequence.
If the combined child handoffs exceed an integrator's useful context, introduce
another coherent aggregation tier before dispatching it. Individually compact
handoffs do not guarantee bounded fan-in.
Maintain the child links and contract IDs so a reader can descend from a system
claim to its source. An inferred or partial child claim remains inferred or
partial through every tier until new evidence resolves it. An integrator cannot
promote it to verified merely because several summaries repeat it.
For example, a leaf's finding that job delivery is at least once and its consumer
deduplicates by operation ID must survive in the parent flow explanation, with a
link to the exact contract; reducing it to “the worker processes events” loses
behavior a newcomer needs to understand.

The coordinator reads the highest useful summaries, shared inventories, and flow
reports, then inspects lower-level evidence only where necessary. It assembles
the top-level explanation, capabilities, architecture, data, and operations pages
from this linked model. Readers should understand the whole system without
opening every component report, and still be able to investigate any described
capability in depth.

## Trace and verify the seams independently

End-to-end flow workers produce `flows/<id>.md` within the resolved map root. Give them important
operations that span areas, not just one worker's internal call sequence. They
follow registration to implementation and trace each meaningful boundary to the
outcome: inputs, validation and authorization, decisions, state changes, messages,
background work, external calls, responses, and failure or recovery paths. Link
each transition to its source and responsible component; label missing or inferred
steps. Reports and diagrams must describe the same sequence.

Before synthesis is complete, assign independent seam-verification workers who
did not author the claims being checked. They check actual source against the
proposed topology, interface inventories, and important cross-area flows. Compare
both sides of boundaries: route registration and handler, caller and callee,
producer and consumer, schema and persistence, configuration and deployed process.
Reconcile inventory entries against discovered registrations or declarations so
an apparently complete inventory does not hide an unassigned API surface. Record
what was checked and the evidence; do not claim exhaustive verification from a
sample. Save results in owned verification shards under `_work/`.

Send contradictions and omissions back to the responsible owners, update their
reports and all dependent summaries or diagrams, and recheck the affected seams.
When a question cannot be resolved, retain it in the relevant report and the
global `coverage.md`. Completion requires reconciled assignments, traceable
important claims, verified seams with stated scope, and visible remaining gaps;
it does not require pretending that every line was read or every behavior proved.
Reconcile coverage shards against the source inventory to detect unowned areas,
conflicting ownership, missing outputs, and untraced interface registrations.
Link every remaining gap to an owner, a reason, or an explicit exclusion.

## Schedule for finite runtimes and resume safely

- Treat tiers as artifact dependencies, not as permanently active manager agents.
  Keep the coordinator available. Run ready source tasks in batches within the
  runtime's concurrency limit; persist handoffs and release finished workers
  before starting dependent integrators. Apply the same process at every tier.
- Avoid a waiting-manager deadlock: a child manager must not occupy the last slot
  while waiting to spawn its own workers. Let the coordinator schedule that work,
  or reserve capacity explicitly before delegating it. Do not promise all work
  will run simultaneously.
- Start source and synthesis workers with fresh or minimally inherited context
  where supported, carrying only the scoped brief and relevant artifact links.
  Do not pass full ancestor transcripts down the tree. When inheritance cannot
  be controlled, keep spawning contexts bounded and stage assignments accordingly.
  Reusing an agent requires a bounded new brief and the same persisted handoff
  discipline; accumulated source transcripts must not become the aggregation mechanism.
- Keep coordinator progress messages and worker returns compact. Persist detailed
  results and checkpoints before context compaction, then resume from indexes and
  ready-work shards instead of replaying every completed worker's conversation.
- Checkpoint after each completed work unit. On interruption, a worker marks
  partial coverage and saves questions; the next worker starts from the manifest
  and its shard instead of repeating discovery or trusting conversation memory.
- On resume, verify the source snapshot or fingerprints, including relevant
  working-tree changes. If source changed, invalidate affected units, dependent
  summaries, flows, and verification results. Reinvestigate or label mixed-revision
  evidence explicitly; do not silently combine it into a current system map.
- If sub-agent execution is unavailable, disclose that this workflow cannot run
  as designed. Offer an explicitly limited inventory or a staged run in a capable
  environment, and obtain agreement before substituting single-agent work. Never
  present a single-context skim as the completed hierarchical investigation.
