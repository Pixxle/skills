---
name: map-system
description: Produce a deep, evidence-backed map of how a system is built — its data model, async paths, API surface, and (if applicable) where business logic has leaked into the frontend. Output lands in `_mapping/` at the repo root. Use when the user wants to map, explore, document, or onboard onto an unfamiliar codebase; when they say "map this system", "where are the god objects", "show me the architecture", or want a system map / system audit / system overview before changing something load-bearing.
---

# Map System

Run four parallel investigations across the repo and write the findings to `_mapping/` at the repo root. The output is a navigable README plus deep per-domain sub-reports.

## Process

### 1. Detect scope

- Confirm the repo root (the directory `_mapping/` should be created in). If the user is inside a monorepo with multiple services, ask whether to map one service or all of them — the four investigations run per service.
- Check whether a frontend exists (presence of `package.json` with React/Vue/Svelte/Angular, a `lib/` Flutter tree, an `apps/web` workspace, etc.). If there is no frontend, drop investigation #4 — do not invent a phantom report.
- If `_mapping/` already exists, ask before overwriting. Offer to write to `_mapping_<date>/` instead.

### 2. Fan out four sub-agents in parallel

Spawn all four with `subagent_type=Explore` **in a single message**. Each gets a tailored brief from [SUBAGENT-BRIEFS.md](SUBAGENT-BRIEFS.md):

1. **Models** — tables, god objects, permissions
2. **Workers** — async paths, queues, crons, inter-service messages
3. **Endpoints** — every API endpoint, what it touches, how it's authorized
4. **Frontend leakage** (skip if no frontend) — business logic that should live on the backend

Each sub-agent writes its own sub-reports directly to `_mapping/<area>/NN_<domain>.md`. They group findings by **domain** (identity, billing, scheduling, …), not alphabetically — related concepts belong in the same file. File count is determined by the size of the codebase; small repos may produce 1–2 files per area, large monoliths 5–8.

Sub-agent outputs MUST follow the conventions in [SUBAGENT-BRIEFS.md](SUBAGENT-BRIEFS.md): absolute file paths, line numbers, code excerpts where they sharpen a point, risk-ranked findings (🔴 HIGH / 🟠 MED / 🟡 LOW), and an honest tone that surfaces dead code, drift, and gaps rather than rationalising them.

### 3. Synthesize the top-level README

Once all four sub-agents have written their reports, read their outputs and write `_mapping/README.md` following [README-TEMPLATE.md](README-TEMPLATE.md). The README is an executive summary with hyperlinks into the sub-reports — never a re-statement of their content. It must:

- Open with "the system in one paragraph"
- Show the cross-service / cross-process architecture as ASCII art when it clarifies (shared databases, message buses, JWT trust)
- Rank god objects with line counts and one-line "why"
- Consolidate the risk-ranked findings from all four sub-agents into single tables (permissions gaps, sensitive-data exposure, payment-correctness risks, cross-cutting smells)
- End with a "where to start" sequencing section ordered by risk × impact

### 4. Verify and wrap up

- Confirm every file referenced in the README actually exists
- Confirm every link resolves
- Report file count and approximate line total to the user (e.g. "24 sub-reports, ~19k lines")
- Note that the `_mapping/` folder is meant to be checked in alongside the code it describes — but is **frozen at generation time**; suggest regenerating after any non-trivial architecture change

## What good output looks like

- **Evidence-backed.** Every claim cites a file path (absolute) with line numbers where relevant.
- **Hostile to the code, in a productive way.** If a callback is doing business logic against a stated rule, call it out. If a policy is commented out, that's 🔴 HIGH.
- **Concrete.** Not "permissions are complex" — "three orthogonal axes: OrganisationUser flags, TeamUser role enum, direct FK ownership; resolved in 26 policy files, ~186 `authorize!` calls".
- **Honest about what was not investigated.** If a sub-agent didn't reach a corner of the codebase, say so in the README rather than papering over.

## What NOT to produce

- A glossary or CONTEXT.md — that's `bootstrap-context`'s job
- Refactor recommendations as the primary output — recommendations are secondary; the map is primary
- A single monolithic file — the value is in the navigable sub-report structure
- Generic architecture diagrams divorced from this repo's actual file paths
