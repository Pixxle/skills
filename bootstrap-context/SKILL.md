---
name: bootstrap-context
description: Bootstrap the initial CONTEXT.md glossary for a repository through deep multi-agent codebase exploration and a short sharpening interview, then lazily offer ADRs for load-bearing decisions surfaced along the way. Use when starting work in a repository that has no CONTEXT.md, when seeding the documentation layer that grill-with-docs and improve-codebase-architecture rely on, or when asked to initialize, bootstrap, or seed domain documentation.
---

# Bootstrap Context

Stand up the first `CONTEXT.md` (and, where applicable, `CONTEXT-MAP.md` plus a small set of ADRs) so downstream skills like `grill-with-docs` and `improve-codebase-architecture` have ground to stand on.

The output format is fixed by [CONTEXT-FORMAT.md](../grill-with-docs/CONTEXT-FORMAT.md) and [ADR-FORMAT.md](../grill-with-docs/ADR-FORMAT.md). Do not invent new formats — this skill produces files in those formats and nothing else.

## Process

### 1. Preflight

- If `CONTEXT.md` or `CONTEXT-MAP.md` already exists at the repo root, stop. This skill bootstraps the first version — for incremental updates use `grill-with-docs`.
- Estimate codebase size with `git ls-files | wc -l` (and `tokei` / `cloc` if available).
- Detect monorepo or multi-context signals: workspace manifests (`pnpm-workspace.yaml`, `lerna.json`, Cargo workspaces, Gradle subprojects), top-level service folders, multiple `package.json`/`Gemfile`/`pyproject.toml` files. If any are present, ask the user whether to treat the repo as single-context or multi-context, and where each `CONTEXT.md` should live. Otherwise default to a single root `CONTEXT.md`.

### 2. Scaled exploration

Spawn sub-agents **in parallel** with `subagent_type=Explore`. Missing a domain area is the failure mode here, so err on the high side.

| Files tracked | Sub-agents |
| --- | --- |
| < 200            | 1     |
| 200 – 2,000      | 2–3   |
| 2,000 – 10,000   | 4–8   |
| 10,000 – 50,000  | 12–20 |
| 50,000 – 200,000 | 25–40 |
| > 200,000        | 50+   |

For repos over ~10,000 files, lens-only slicing stops scaling — one "domain models" agent cannot honestly hold an entire monorepo in head. Switch to a **(context × lens)** fan-out: pick the top-level contexts (services, packages, bounded domains, app folders) and assign each lens *per context*. A monorepo with 8 contexts and 5 lenses spawns 40 agents. Cap individual agents at roughly the same scope budget every time — if a single context is itself huge, sub-slice it further (e.g. `billing/models`, `billing/operations`, `billing/api`).

For smaller repos, slice work by **lens** only. Pick from this list and combine where the repo is small:

- **Domain models** — entities, value objects, aggregates; the primary nouns
- **Business logic** — services / operations / use cases; the verbs
- **API surface** — endpoints, request/response shapes, public contract terms
- **Existing docs** — `README.md`, `CLAUDE.md`, `docs/`, `ARCHITECTURE.md`, `SYSTEM_MAP.md`
- **Tests** — recurring nouns in factory names, spec `describe` blocks
- **Background work** — workers, jobs, queues
- **Config / infrastructure** — only insofar as it names load-bearing decisions

For multi-context repos, scope each agent to one context.

Each agent's brief must ask for: (a) a flat list of candidate terms with one-sentence definitions, (b) terms that look like aliases for the same concept, (c) terms used inconsistently across files, (d) any load-bearing architectural decision they noticed (e.g. "all business logic flows through Operations, never models"). Cap each response at ~400 words.

### 3. Synthesize candidates

Merge the agents' reports into a single draft. While merging:

- Collapse synonyms — pick the strongest term as canonical, list others under `_Avoid_`.
- Flag genuinely ambiguous terms (one word, two clearly different meanings).
- Drop generic programming concepts — only project-specific terms belong (see [CONTEXT-FORMAT.md](../grill-with-docs/CONTEXT-FORMAT.md)).
- Cluster terms under subheadings only when natural groups emerge; otherwise keep it flat.

### 4. Sharpening interview

Walk through the draft with the user one issue at a time. Only ask about things the codebase cannot resolve on its own:

- Synonyms where the canonical pick isn't obvious from usage
- Ambiguous terms with two genuine meanings
- Definitions that are fuzzy from code alone
- Missing-but-implied concepts the agents could not name

Do not ask the user to ratify every term — if the code makes a meaning clear, just write it. Cap the interview at roughly 10 questions; fewer for small repos. If more would be needed, list the rest as open questions in the wrap-up instead of dragging the session out.

### 5. Write the files

Write `CONTEXT.md` (or per-context files plus `CONTEXT-MAP.md`) using [CONTEXT-FORMAT.md](../grill-with-docs/CONTEXT-FORMAT.md). Include the example dialogue at the bottom — write one short exchange that uses 4–6 of the most central terms naturally.

### 6. ADR offering pass

Surface the load-bearing decisions the agents reported. For each, ask: *"Want me to record this as an ADR?"* Only offer when all three [ADR-FORMAT.md](../grill-with-docs/ADR-FORMAT.md) criteria hold — hard to reverse, surprising without context, result of a real trade-off. Drop the rest without ceremony.

Common hits: monorepo vs polyrepo, message bus choice, event-sourced vs CRUD, deliberate deviations from a framework's defaults (e.g. "all business logic in Operations, never in models"), constraints not visible in the code.

### 7. Wrap up

- Confirm the files written and their paths
- List any open questions the interview deferred
- Note that `grill-with-docs` and `improve-codebase-architecture` will now read these files, and suggest running `grill-with-docs` next time the user plans a non-trivial change to keep the glossary alive
