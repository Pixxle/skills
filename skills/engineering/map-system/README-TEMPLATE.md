# Top-level README structure

`_mapping/README.md` is the entry point — an executive summary that hyperlinks into the sub-reports. It is **synthesized after** all four sub-agents have written their reports, by reading their output, not by re-running investigations.

Target length: 400–600 lines for a medium-sized monolith. The value is in being scannable in 10 minutes while every claim is one click away from its evidence.

## Required sections (in order)

### 0. Header

```
# {{Project name}} — System Mapping

> Generated {{date}} from a parallel sub-agent investigation across
> {{services}} (~{{total_lines}} lines of detail across {{file_count}}
> sub-reports).
>
> This file is the **entry point**. Each domain has a deeper companion
> report linked in the index below.
```

### Index of detailed reports

Markdown table, grouped by area (MODELS / WORKERS / ENDPOINTS / FRONTEND if present). Columns: `#`, `Report` (linked), `Lines`. The line counts come from `wc -l` on each sub-report — these numbers tell the reader where the dense reading is.

### 1. The system in one paragraph

A single paragraph naming the stack, the main services, the primary nouns and verbs of the domain, and the integrations the business depends on (payments, messaging, identity). Reader should know what they're looking at before scrolling further.

### 2. Cross-service / cross-process architecture

Only include if the system is more than one service. ASCII diagram showing:

- Each service / process
- Shared infrastructure (database, Redis, message broker)
- Direction and mechanism of inter-service traffic
- Trust model (JWT keys, shared schemas)

Follow the diagram with the "load-bearing details" — the things that, if a new engineer didn't know, would cause a bad change.

### 3. Domain map

A table grouping tables/collections by domain, showing the owning service and a link to the detailed model report. This is the only place in the README where every table is at least named.

### 4. The god objects — ranked

A numbered table: rank, class, lines, why it's a god object (one paragraph), link to the detail report. Follow with a short "top decomposition recommendations" list — one bullet per top-3 god object, pointing to the multi-phase plan in the sub-report.

### 5. Permissions & authorization (the 5-second model)

Three subsections:
- How a request is authenticated (the steps the auth middleware takes)
- The orthogonal permission axes and how they compose
- Permission gaps & surprises — a single risk-ranked table consolidating findings from all four sub-agents' permission notes

### 6. Async architecture

Subsections:
- The pattern (queue runtime + any in-house wrapper)
- Queues table
- Cron table
- What's async vs sync — the surprises in both directions
- Inter-service traffic table (if applicable)

### 7. Endpoints overview

- Total endpoint count, versioning strategy, mount surface
- One subsection per service if multi-service
- Table of endpoint groups (name + notable surfaces, one row per group)

### 8. Sensitive-data exposure findings

A single risk-ranked table. PII in entities, plaintext OAuth tokens, audit logs storing raw params, unauthenticated endpoints leaking GPS, etc. Pulls from sub-agents 1 and 3.

### 9. Payment / money correctness risks (only if there's a payments domain)

A numbered list. Stripe webhook semantics, idempotency, money math (Float vs BigDecimal), missing event-ID dedup, race conditions in customer creation. These are reputation risks — they get their own section.

### 10. Lifecycle quirks

State machines without explicit transitions, GET endpoints with side effects, jobs that don't share uniqueness locks, scheduled fan-outs without batching, async ops that aren't idempotent.

### 11. Communications architecture (only if there's user-facing notifications)

How push / email / SMS / in-app are dispatched, where preferences live, notable holes (events that notify nobody).

### 12. Frontend-leakage headline (only if investigation 4 ran)

The single biggest piece of business logic that's currently in the client. Quote the line count. Note the comment-code mismatches that prove drift. Link to the detail report.

### 13. Cross-cutting smells (consolidated)

A table: smell, where it shows up (1–3 example sites), impact. These are systemic — `update_all` bypassing callbacks, `before_save` doing business logic against project rules, polymorphic refs without explicit type lists, three sources of truth for the same data.

### 14. Where to start (suggested sequencing)

A numbered list ordered by **risk × impact**. Each item:
- One-line description of the change
- One-line justification
- Link to the relevant sub-report section

Cap at 8–10 items. Anything beyond goes in a "lower-priority but worth tracking" bullet list below.

### 15. Inventory of investigation outputs

A tree of `_mapping/` showing every file with its line count. This is the last section because it doubles as the "I read everything — what did I miss" verification.

## Style notes

- Use tables liberally — they scan faster than prose
- Every claim that names a specific class, file, or endpoint must link to or be near a sub-report citation
- Risk indicators: 🔴 HIGH / 🟠 MED / 🟡 LOW — use sparingly so they retain meaning
- Avoid hedging language ("might", "could be", "perhaps"). If the sub-report has evidence, state it. If it doesn't, leave it out.
- Never repeat the sub-report's content at length. The README's job is "you should read X next, because Y" — not to be the report itself.
