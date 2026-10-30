---
name: create-system-map
description: Creates a thorough technical onboarding map of an unfamiliar repository, explaining its capabilities, APIs, architecture, data, and internal execution flows with source-backed diagrams. Uses mandatory sub-agents and tiered aggregation to cover large systems without overloading one context window. Use when the user asks for a written map of a whole repository or service, such as a system map, architecture overview, API inventory, end-to-end flow documentation, or onboarding docs saved to disk. Not for one question about one subsystem answered in chat (use how).
disable-model-invocation: true
---

# Create System Map

Explain a repository to an engineer encountering it for the first time: what it does, how it is built, and how its parts cooperate. Produce a navigable technical guide in `_system-map/`, with diagrams and links from the overview down to source evidence.

This is an explanation workflow. Describe the implemented design and its constraints without turning the map into an audit, a god-object ranking, or a refactoring backlog.

## Quick start

Example requests: “Create a system map of this repository” or “Map the billing service, including its APIs and payment lifecycle.” Default to the whole repository when no narrower scope is given.

Use sub-agents for discovery, source exploration, aggregation, and verification. For large repositories, build multiple aggregation tiers; a single lead reading all worker reports defeats the workflow.

Read [ORCHESTRATION.md](ORCHESTRATION.md) before scheduling work, [INVESTIGATION.md](INVESTIGATION.md) before assigning source exploration, and [OUTPUT.md](OUTPUT.md) and [DIAGRAMS.md](DIAGRAMS.md) before writing reports.

## Workflow

### 1. Establish scope and a source snapshot

- Read repository instructions. Identify the root, workspaces, languages, manifests, runnable processes, libraries, and deployment entry points.
- Record the revision and relevant working-tree changes. The current source is authoritative; distinguish it from older docs, generated specifications, tests, and inferred intent.
- For a monorepo, map the whole-system boundaries and group related services or packages. Ask only when the requested scope cannot reasonably be inferred.
- Resolve one `map_root`, defaulting to `_system-map/`. Preserve existing output unless regeneration was requested; otherwise choose a unique suffixed directory and report it. Keep manually authored material intact. Carry the resolved root through every assignment and report.
- Treat application source as read-only. Write mapping artifacts only; do not install dependencies, start services, or contact live systems just to fill documentation gaps. Never copy secret values into reports.

### 2. Discover and partition with sub-agents

- Have discovery workers inventory bounded repository areas and propose capability, service, and subsystem boundaries before assigning detailed exploration.
- Create the durable work tree and coverage ledgers described in ORCHESTRATION.md. Assign every in-scope first-party area to an owner; classify generated, vendored, archived, and excluded code explicitly.
- Split large or tangled areas until a leaf worker can examine its assigned implementation and relevant callers within a bounded context. Partition by coherent behavior, using size as a capacity signal.
- Plan the aggregation tree before fan-out: leaf components → subsystems → services or domains → system. Collapse unnecessary tiers for small repositories and add tiers for larger ones.
- Schedule workers in batches within available concurrency. If sub-agents are unavailable, report the limitation and seek an execution alternative; do not claim a whole-system map from a silent single-agent fallback.

### 3. Explore implementation and publish leaf reports

- Give each worker an explicit scope, parent, output path, investigation brief, and compact handoff contract. Workers write durable reports rather than returning source dumps.
- Explain capabilities, public contracts, domain concepts, control flow, persistence, and integration boundaries using INVESTIGATION.md. Include enough prose for a newcomer to understand why each step exists.
- Trace actual implementations beyond entry points. Distinguish reachable behavior, declarations, generated surfaces, tests, and unverified assumptions.
- Publish source-backed component reports and interface inventories, plus inspected paths, remaining gaps, and cross-boundary dependencies. Split oversized assignments rather than compressing away unexplored behavior.

### 4. Aggregate upward and connect the system

- At each tier, use synthesis sub-agents to combine a bounded set of child handoffs and reports into an explanatory parent map. Preserve links to detailed contracts, flows, source evidence, and unknowns.
- Explain how children cooperate: ownership, calls, events, shared state, lifecycle transitions, and runtime boundaries. A concatenation of child summaries is insufficient.
- Assign dedicated flow workers to trace core capabilities across area boundaries from trigger to observable result, including async continuations and material failure paths.
- Reconcile producer/consumer, caller/callee, schema, and routing disagreements with targeted source reads. Delegate unresolved investigations back down the tree.
- Repeat aggregation until the lead can synthesize a coherent whole-system outline from bounded top-level reports. Never load every leaf or the full source inventory into the lead's context.

### 5. Build the onboarding guide and diagrams

- Follow OUTPUT.md: orient the reader, explain capabilities, inventory APIs and other interfaces, describe construction and runtime behavior, and provide a guided reading path.
- Use DIAGRAMS.md to create Mermaid architecture and end-to-end flow diagrams, with deeper sequence, data, or state diagrams where they clarify the actual implementation.
- Make all diagrams traceable to reports and source. Show sync/async boundaries and external systems; distinguish hypothetical examples from observed behavior.
- Keep detail at the level where it is useful. The overview explains the system; linked reports retain the technical depth and inventories.

### 6. Verify coverage, seams, and navigation

- Have verification sub-agents check the major cross-area flows, interface inventories, and architecture against source. The author of a synthesis must not be its only verifier.
- Resolve incorrect claims and broken links. Check diagram syntax with an available renderer; otherwise report that rendering was not verified.
- Reconcile coverage ledgers upward: inspected, partially inspected, excluded, and unexamined areas remain distinguishable. Do not equate an assigned unit with inspected code.
- Check evidence paths, symbols, line references, report links, inventory counting rules, and whether important claims survive every aggregation tier.
- Recheck the source snapshot. Refresh affected branches of the map if source changed, or mark precisely which descriptions are stale.
- Report the entry-point path, covered scope, main capabilities and flows, verification performed, and material gaps. Describe the map as a snapshot; do not claim completeness beyond the recorded coverage.

## Quality bar

- **Useful on day one:** a newcomer can explain what the system does, follow a real operation, locate its API and implementation, and find the owning data and process.
- **Thorough at scale:** every important capability and interface group has an owner and a linked explanation; aggregation preserves detail through drill-down rather than discarding it.
- **Evidence-backed:** implementation claims cite repository-relative source paths with symbols or line numbers; observations, inferences, and unknowns are clearly distinguished.
- **Repository-shaped:** document HTTP APIs, CLIs, libraries, frontends, workers, or infrastructure according to what exists. Do not invent a backend, database, or queue.
- **Explanatory:** connect concepts and decisions with plain prose, concrete examples, and diagrams. Tables and file inventories support the explanation; they do not replace it.
