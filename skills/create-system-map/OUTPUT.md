# Output contract

The map is a layered technical guide for a newcomer. The top level answers whole-system questions; each deeper report explains its owned area and lets the reader follow claims down to source. Scale the hierarchy to the repository rather than targeting a word count or a fixed report count.

Use the resolved `map_root` from the coordinator, defaulting to `_system-map/`. All artifact paths below are relative to that root; a suffixed or caller-selected destination applies to every worker and tier. A typical large-system layout is:

```text
_system-map/
  README.md                       # Whole-system orientation and reading path
  architecture.md                 # Construction, topology, and communication
  capabilities.md                 # Capability catalog and implementation owners
  data.md                         # Domain concepts, ownership, and relationships
  operations.md                   # Configuration, lifecycle, and local orientation
  coverage.md                     # Snapshot, scope, confidence, and coverage index
  areas/<area>/README.md          # Service/domain/subsystem synthesis
  components/<unit>.md            # Source exploration reports
  interfaces/<area-or-unit>.md    # API/contract inventories
  flows/<scenario>.md             # End-to-end explanations and diagrams
  _work/                         # Durable scheduling, handoffs, and coverage shards
```

Add intermediate area summaries for further aggregation tiers. Omit nonapplicable topical files or combine them for a small system; retain their relevant content in the entry point or area report. Keep evidence and coverage artifacts available even when the overview is compact. Do not create empty files to match the example tree.

## Entry point: README.md

Write this after top-level synthesis and seam verification. It must teach the reader how the parts form a system, with these sections in a useful order:

1. **Snapshot and scope.** Project name, generation date, revision, relevant working-tree changes, mapped scope, and a link to coverage. State that the report describes inspected source and configuration, not a verified live deployment.
2. **The system in one paragraph.** What it enables, who uses it, principal domain concepts, and the implementation's broad shape.
3. **Capabilities.** A concise table of major capabilities, initiating interfaces, owning areas, observable outcomes, and links to the deeper catalog and flows.
4. **Architecture at a glance.** A Mermaid diagram and explanatory prose connecting clients, entry points, processes, domain areas, storage, and external services as applicable.
5. **How a core operation works.** Walk through a representative capability from trigger to result, including a diagram and important async continuations. Link to the full scenario report and other major flows.
6. **How the code is constructed.** Explain entry points, composition/bootstrap, major packages, responsibility boundaries, and where the central decisions live. Include a directory-to-responsibility table rather than an unexplained directory dump.
7. **Interfaces and data.** Orient the reader to the API/contract surfaces, authorization model, main domain entities, and state ownership. Link to inventories and deeper data explanations.
8. **Runtime and local orientation.** Name the processes and infrastructure required for representative behavior; point to verified script/configuration locations for building, running, and testing. State what was actually executed.
9. **Guided reading path.** Suggest a source-reading sequence for a newcomer, and routes such as “follow a request,” “find an API,” or “understand background processing.” Link to concrete files and reports.
10. **Coverage and open questions.** Summarize material limits and link to detailed ledgers. Explain which gaps affect the reader's interpretation.

Keep this entry point readable without opening every linked report. Explain terms before relying on them. Do not substitute a table of contents for a whole-system explanation, or duplicate every leaf inventory in the overview.

## Architecture and area syntheses

Each intermediate summary explains the behavior of its owned subtree. Include:

- Purpose, consumers, owned capabilities, and boundaries.
- Child components and how they cooperate, with links to their reports.
- Entry points and construction: how dependencies and handlers are wired.
- Public and consumed contracts, with links to complete owned inventories.
- Main domain concepts, state owners, lifecycle, and persistence.
- Internal and cross-boundary execution paths, including failure behavior.
- A diagram appropriate to this abstraction level and a plain-language walkthrough.
- Configuration or deployment conditions that materially alter behavior.
- Evidence links, coverage status, unresolved boundaries, and unknowns.

Summarize the meaning of child reports, preserving the contracts that other areas rely on. For example, “publishes a completion event after commit, consumed asynchronously by notifications” is useful; “contains an events module” is insufficient. Resolve contradictions before synthesizing them into a confident claim.

Global architecture documentation should distinguish build-time dependencies, in-process calls, inter-process traffic, and deployment topology. Data documentation explains ownership and relationships; operations documentation connects configuration and process lifecycle to behavior. Keep these as linked views of one system rather than independent summaries with conflicting names.

## Capability catalog

For each major capability, record:

| Field | Meaning |
| --- | --- |
| Capability | What a user or consuming system can accomplish |
| Actor/trigger | User, request, command, schedule, file, or event |
| Interface | Operation, command, export, screen/action, or message |
| Owner | Service/domain/component and report link |
| Outcome | Observable response, output, or persisted change |
| Dependencies | Data, other areas, external systems, configuration |
| Execution guide | Link to a flow explanation and decisive source evidence |

Group related operations without losing their discoverability. Distinguish optional, unregistered, or unresolved capabilities from observed reachable ones. Document internal platform capabilities too when other components depend on them.

## API and contract inventories

Place the detailed inventories at leaf or area level; parents link to them. Each operation needs an identifier, purpose, caller/access model, key inputs and outputs, material side effects/errors, registration site, and implementation link. Add protocol-specific details where appropriate.

Group by domain or consumer need. Link shared schemas and common authorization/error conventions once instead of duplicating them for every operation. Give sanitized usage examples for representative operations, clearly marked as illustrative unless executed.

Record inventory scope and counting rules, including mount prefixes, versions, aliases, generated operations, dynamic registration, and exclusions. An API overview must allow a newcomer to locate an individual operation without searching the whole codebase.

## End-to-end flow reports

Give each major flow a named owner across component boundaries. Include:

1. Scenario, actor, preconditions, initiating interface, and observable outcome.
2. A Mermaid flowchart or sequence diagram with a source/evidence legend.
3. A numbered walkthrough: source location, action, decision, next handoff, and state/effect at each step.
4. Async boundaries: producer, payload, queue/topic/schedule, consumer, and completion signal.
5. State transitions, transaction boundaries, and external integration points.
6. Important alternatives and failure/recovery behavior evidenced by code.
7. Links to APIs, data/area reports, representative tests, and unresolved steps.

Cover the central capabilities and distinct execution patterns rather than producing the same CRUD flow repeatedly. Include both a synchronous and an asynchronous scenario if both are material to the system. Add startup/plugin/lifecycle flows for systems where these are the central behavior.

## Leaf component reports

Explain the component's role, contracts, internal decisions, data/effects, dependencies, and relationship to the enclosing capability. Use concrete scenarios and connected prose alongside inventories and citations.

Retain enough detail to answer “what happens here and where can I verify it?” without repeating all source code. Deep reports remain part of the delivered map; higher-level synthesis must not delete them after summarizing.

## Coverage and provenance

`coverage.md` is the human-readable index of the sharded work ledgers. Include:

- Snapshot and scope, inventory method, and treatment of working-tree changes.
- First-party areas covered, partially covered, excluded, or unexamined, with report and ledger links.
- What “inspected” means in this run; sampled code stays labeled sampled.
- Contract inventory coverage and unresolved dynamic/generated surfaces.
- Flows traced end to end and boundaries checked independently.
- Verification performed, including diagram rendering and any runtime checks.
- Remaining unknowns, stale evidence, unavailable dependencies, and their effect on confidence.

Use counts only with a defined denominator. “All 12 assigned workers finished” does not mean “all source was inspected.” Keep partial or failed worker scopes visible through every tier and in the final overview.

## Completion criteria and delivery

A final system outline is ready when the top-level model coherently connects the major capabilities, runtime units, interfaces, state owners, and core flows; every in-scope area has an honest coverage status; boundary verification has run; and navigation and evidence links have been checked.

Fix material contradictions or label unresolved behavior before delivery. An incomplete run may still provide useful partial documentation, but call it partial and identify the missing branches and resume state. Do not label a collection of disconnected area reports a completed whole-system outline.

In the final response, link to the entry point, summarize what the reader can now understand, and state material gaps and validation limits. Avoid selling line counts as a measure of quality.
