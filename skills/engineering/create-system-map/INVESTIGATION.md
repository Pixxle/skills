# Source investigation guide

Use this guide for discovery and leaf-worker assignments. Adapt it to the repository: a CLI, library, frontend, infrastructure repository, or multi-service platform exposes different interfaces. Document what exists.

## Assignment contract

Every worker receives the source root and snapshot, resolved `map_root`, a stable unit ID, owned paths and behavior, explicit exclusions, parent ID, output paths, and a bounded set of questions. Include neighboring unit IDs and the common handoff format from the orchestration instructions.

Workers may read callers and dependencies outside their owned paths to establish a boundary. Record those reads and notify the owning unit; do not silently assume ownership of another worker's scope. Request a split when the assignment cannot be investigated thoroughly within context.

## Discovery pass

Inspect manifests, workspace definitions, source directories, launch commands, route registration, dependency wiring, deployment configuration, test organization, and existing documentation. Explain:

- What kind of system this is and what its users or consumers can accomplish.
- Which artifacts are applications, libraries, shared packages, workers, tools, or infrastructure.
- Which processes run separately and how they communicate.
- Which areas own domain behavior, public interfaces, persistence, and integration adapters.
- Which parts are first-party, generated, vendored, archived, fixtures, or build output.

Estimate scale using file and source-line counts with the counting rules stated. Counts guide partitioning; they do not establish understanding. Do not read the entire repository into a discovery worker's context. Give large areas bounded discovery owners and return an indexed partition proposal.

## Investigation lenses

### 1. Capabilities and domain language

Start with the verbs and nouns of the system. For each capability, identify the actor or caller, initiating interface, observable outcome, owning component, required state, dependencies, and main restrictions. Distinguish user capabilities, internal support mechanisms, optional features, and inactive code.

Follow feature gates, registration, and configuration to determine whether an implementation is wired into the mapped build. If runtime configuration is unavailable, describe the condition rather than claiming the feature is enabled in production.

### 2. Construction and runtime topology

Explain how the executable or package is assembled: bootstrap, dependency injection or composition root, plugin registration, module wiring, configuration loading, and runtime entry points. Describe which code runs in which process or client and what state is local, shared, or external.

Trace startup far enough to connect the launch command to the main handler or processing loop. Identify build-time generation and runtime discovery when they determine what is reachable. Separate deployed topology evidenced by configuration from deployment assumptions.

### 3. APIs and other contracts

Inventory the interfaces this area exposes and consumes. Group by capability or domain and preserve a way to locate individual operations. Include the registration site, implementation, and boundary schema when available.

| Surface | Contract details to capture |
| --- | --- |
| HTTP/webhooks | Effective method and path including mount prefixes; version; caller; authentication and authorization; key request/response shapes; errors; pagination; side effects; webhook verification |
| GraphQL/RPC | Registered operation or service/method; schema location; resolver or implementation; authorization context; streaming or subscription behavior |
| CLI | Command/subcommand; flags and inputs; output and exit behavior; dispatch target; configuration dependencies |
| Library/package | Public exports; principal types/functions; inputs/outputs; extension points; exceptions or error values; important lifecycle requirements |
| Events/messages | Producer and consumer; topic/channel/job name; payload schema; delivery and ordering assumptions; acknowledgement and retry behavior |
| UI | Routes/screens and major user actions; client state ownership; server interfaces invoked; loading, error, and realtime update paths |
| Files/configuration | Accepted format or schema; loader; required options; precedence and defaults; resulting behavior; generated outputs |

Document semantics rather than dumping every field. Link to authoritative schemas and provide sanitized representative examples when helpful. Include full operation inventories at the appropriate leaf or area level, with coverage limits for dynamic or generated registrations.

Trace route and export composition: a declaration is not proof that an operation is registered or reachable. State counting rules before giving totals; keep logical operations distinct from generated aliases or versioned variants. Never describe an inventory as exhaustive while registration paths remain unexamined.

### 4. Internal logic and control flow

Trace each important capability through its actual path:

1. Trigger: request, command, UI action, schedule, file, or external event.
2. Boundary processing: parsing, authentication, authorization, validation, and normalization.
3. Orchestration: handler, service, operation, workflow, or processing loop.
4. Domain decisions: rules, branches, invariants, calculations, and lifecycle transitions.
5. State changes: reads, writes, cache changes, transaction boundaries, and concurrency control.
6. Effects: emitted events, queued jobs, external calls, notifications, or files.
7. Observable result: response, output, persisted state, or later completion signal.
8. Material alternatives: rejected input, denied permission, duplicate work, failure, retry, timeout, cancellation, or compensation, where implemented.

Explain the handoffs and decisions in connected prose. Identify which steps are synchronous, asynchronous, deferred, or conditional. Follow indirect hooks such as callbacks, middleware, interceptors, subscriptions, and dispatch registries. Do not stop at a controller delegating to a service.

For example, tracing “submit an order” should connect the entry operation, eligibility decision, order/payment state changes, job or webhook continuation, and what the caller can observe. Use the repository's actual capability; this example is not a required commerce domain.

### 5. Data and state ownership

Describe principal entities or aggregates, their meaning, relationships, owners, and storage. Explain the source of truth, derived views or caches, transaction scope, key invariants, and important state transitions. Include deletion/retention or migration behavior where it affects the capability.

Distinguish domain entities, transport schemas, persistence records, and client state. Identify shared databases or schemas across services and who writes each important record. State whether consistency is immediate or deferred only when supported by the implementation.

### 6. Background work and integrations

For each queue, schedule, callback, or message flow, connect the trigger to its handler, payload, state changes, and completion or failure behavior. Document configured schedules and timezone when available. Explain retries, deduplication, ordering, acknowledgement, and dead-letter behavior as implemented; mark unestablished semantics unknown.

For each external dependency, explain its purpose, adapter, direction of traffic, credentials mechanism without values, request/event contracts, and failure handling. Separate third-party guarantees documented externally from behavior observed in this repository.

### 7. Frontend and client behavior, when present

Explain navigation, screen composition, state management, API clients, local persistence, optimistic updates, and realtime subscriptions. Trace a major user action through client and server boundaries. Document which decisions and calculations the client owns and which are enforced by the server, without assuming client logic is a defect.

### 8. Configuration, operations, and tests

Explain relevant feature switches, configuration precedence, startup dependencies, deployment units, health checks, logging, tracing, and metrics. Extract local run/build/test commands from scripts and configuration; label commands as inspected or executed. Do not run unfamiliar commands merely because they appear in a README.

Use tests to clarify intended scenarios and edge cases, with links to representative tests. Tests and comments do not override contradictory implementation; describe any discrepancy that materially changes understanding. Missing local infrastructure or runtime evidence is a coverage limit, not permission to invent behavior.

## Evidence and writing rules

- Cite implementation claims near the explanation with repository-relative paths and symbols or line references. Include registration and implementation when the link between them matters.
- Use relative Markdown links from the report to source and other reports so the map can travel with the repository. Avoid machine-specific absolute paths in generated documentation.
- Label observed implementation, supported inference, and unknown behavior. State what evidence would resolve an unknown.
- Provide concise code excerpts only when they clarify a rule that prose cannot explain as well. Never return bulk source as a handoff.
- Explain the implemented mechanism and its consequences. Mention surprises or inconsistencies only when necessary to understand behavior; do not introduce severity rankings or a remediation backlog.
- Finish with inspected paths, coverage limits, boundary dependencies, and open questions using the shared handoff contract. A worker must not declare an entire directory understood from a few sampled files.
