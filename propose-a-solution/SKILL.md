---
name: propose-a-solution
description: Autonomously design a bold solution to a problem and write it up — explore the codebase with sub-agents, trace cross-cutting concerns (other services, frontend, shared contracts), resolve the design decision tree yourself instead of grilling the user, hunt for a code-judo move, and produce a proposal plus proposed ADRs grounded in CONTEXT.md and existing decisions. Use when the user wants a worked-out plan or design handed back rather than a back-and-forth interview — triggers include "propose a solution", "design this for me", "come back with a plan", "what's the bold version of this".
---

# Propose a Solution

The autonomous twin of `grill-with-docs`. That skill walks the design decision tree by asking the user one question at a time. **This skill walks the same tree, but answers each branch yourself** — from the codebase, the domain glossary, and the recorded decisions — then writes the result up as a plan and a set of *proposed* ADRs.

Two non-negotiables separate a good proposal from a mediocre one:

1. **Resolve from evidence, not from the user.** Every branch the grilling skill would ask about, you answer by exploring. The user only sees genuinely unresolvable decisions, surfaced at the end.
2. **Aim for the bold move.** Do not propose the obvious incremental change if a code-judo restructuring makes whole categories of complexity disappear. See [BOLDNESS.md](BOLDNESS.md).

## Process

### 1. Orient on what's already decided

Read `CONTEXT.md` / `CONTEXT-MAP.md` and any ADRs in `docs/adr/` for the area in play. The glossary fixes your vocabulary; the ADRs are decisions you must not silently re-litigate. If none exist, note it and proceed — but suggest `/bootstrap-context` would make future proposals sharper.

### 2. Frame the problem in domain language

State the problem crisply using `CONTEXT.md` terms. Then lay out the **decision tree** — the same branches `grill-with-docs` would interrogate (scope, ownership, data shape, sequencing, failure modes, boundaries). You will resolve these in step 4; name them now so nothing gets skipped.

### 3. Deep exploration via sub-agents

Spawn `subagent_type=Explore` agents **in parallel** to investigate. Scale to the codebase (`git ls-files | wc -l`):

| Files tracked | Sub-agents |
| --- | --- |
| < 200 | 1–2 |
| 200 – 2,000 | 2–4 |
| 2,000 – 10,000 | 4–8 |
| > 10,000 | 8+ (slice by context × concern) |

Always spend at least one agent on **cross-cutting concerns** — this is the part a shallow proposal misses:

- **Other services / packages** that call into or are called by the touched code; shared contracts and events.
- **Frontend impact** — does this change an API shape, a payload, a state machine the UI depends on?
- **Data model & migrations** — what's persisted, what has to change, what's irreversible.
- **Async paths** — jobs, queues, webhooks, retries that touch the same state.

Each agent returns evidence (file:line), not opinions. Cap responses ~400 words.

### 4. Resolve the decision tree yourself

For each branch from step 2, pick the answer the evidence supports. Where the code decides it, just decide it. Where it can't, make a **recommended call** and record it as a stated assumption with its confidence and the alternative you rejected. Only escalate to the user the decisions that are genuinely theirs (product trade-offs, external constraints, irreversibles with no clear winner) — and defer those to the wrap-up, don't stop the flow.

### 5. Hunt for the bold move

Before writing, apply the boldness pass in [BOLDNESS.md](BOLDNESS.md). Ask: is there a reframing that deletes branches instead of adding them? A seam already in the architecture that makes this a natural extension? If a judo move exists, the proposal leads with it — and explains the boring version as the fallback.

### 6. Write the proposal

Write a plan document per [PROPOSAL-FORMAT.md](PROPOSAL-FORMAT.md) (default `docs/proposals/NNNN-slug.md`). Alongside it:

- **Propose ADRs** for load-bearing decisions you made — `status: proposed`, using [ADR-FORMAT.md](../grill-with-docs/ADR-FORMAT.md). These are decisions awaiting the user's ratification, not accepted ones. Only when all three ADR criteria hold (hard to reverse, surprising without context, real trade-off).
- **Update `CONTEXT.md`** inline if the design names a concept not yet in the glossary, per [CONTEXT-FORMAT.md](../grill-with-docs/CONTEXT-FORMAT.md).

### 7. Present

Summarize: the recommended solution (lead with the bold move), the proposal file path, the proposed ADRs, the assumptions you made, and the short list of decisions only the user can settle. Offer to drop into `grill-with-docs` on any branch they want to push back on.
