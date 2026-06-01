---
name: review-adrs
description: Review the ADRs in a repository against the quality bar the documentation skills hold them to — does each one actually qualify as a decision worth recording, does it capture the *why* rather than implementation detail, is it still true in the code, and is the set internally consistent. Walks ADRs one at a time and fixes problems inline once you confirm. Use when the user wants to review, audit, prune, or clean up the ADRs that bootstrap-context, grill-with-docs, or improve-codebase-architecture have generated, or mentions "review the ADRs", "are these ADRs any good", "audit docs/adr".
---

# Review ADRs

The other documentation skills *write* ADRs. This skill *audits* the ones they left behind.

The bar is fixed by [ADR-FORMAT.md](../grill-with-docs/ADR-FORMAT.md) — read it first. The whole point of an ADR is to record *that* a decision was made and *why*. Not to fill out sections. Not to capture implementation detail. Most good ADRs are a single paragraph. Hold every ADR you review to that standard.

## Process

### 1. Discover the ADRs

- Single-context repo: `docs/adr/` at the root.
- Multi-context repo (a `CONTEXT-MAP.md` exists at the root): a root `docs/adr/` for system-wide decisions, plus a `docs/adr/` under each context. Review all of them; note which set each ADR belongs to.
- If there's no `docs/adr/` anywhere, say so and stop — there's nothing to review.

Read every ADR in full before touching anything.

### 2. Set-integrity sweep (whole set, once)

Before going ADR-by-ADR, check the set as a whole — these findings only make sense across all files:

- **Numbering** — gaps, duplicate numbers, or files out of sequence in each `docs/adr/`.
- **Supersede links** — every "superseded by ADR-NNNN" points to a file that exists; the target isn't itself still marked `accepted` as if nothing happened; no supersede cycles.
- **Status drift** — an ADR still marked `proposed` for a decision the code clearly already implements; an `accepted` ADR that a later one quietly contradicts without superseding it.
- **Contradictions** — two ADRs that assert incompatible decisions with neither pointing at the other.

Hold these as findings; resolve them in the loop or in a final pass, whichever is clearer.

### 3. Walk each ADR, one at a time

For each ADR, in order, run it through three lenses and report what you find **before** moving to the next one. Don't batch.

**Lens 1 — Does it qualify?** All three must hold: hard to reverse, surprising without context, the result of a real trade-off (see [ADR-FORMAT.md](../grill-with-docs/ADR-FORMAT.md)). If one is missing, the entry isn't an architectural decision worth a record — it's a note, a how-to, or the obvious thing. Flag it for deletion and say which criterion fails.

**Lens 2 — Does it record the *why*, not the *how*?**
- Missing rationale: states what was decided but not why. The "why" is the load-bearing half — without it the ADR is just a label. If the reasoning isn't recoverable from the text, ask the user for it.
- Implementation detail: code snippets, function names, step-by-step setup, anything that belongs in the code or a runbook rather than a decision record. Propose trimming it out.
- Section bloat: `Considered Options` / `Consequences` / `Status` filled in by reflex when they add nothing (ADR-FORMAT.md makes them optional — most ADRs need none). Propose collapsing back toward the single paragraph.

**Lens 3 — Is it still true?** The decision is a claim about the system. Verify it against the code — grep for the pattern it describes, or spawn an `Explore` sub-agent for a broad claim ("all business logic flows through Operations"). If the code has moved on, the ADR isn't wrong to exist — it's *out of date*. Propose marking it `deprecated`, or writing a new ADR that supersedes it and linking the two. Never silently edit a superseded decision to match today's code; that erases the history the ADR exists to keep.

### 4. Fix inline, after confirming each

When a lens turns up something, propose the concrete fix and apply it once the user okays it:

- **Doesn't qualify** → delete the file (and renumber only if the user wants gaps closed; gaps are harmless).
- **Missing why** → ask the user for the rationale, write it into the ADR.
- **Bloat / implementation detail** → trim to the decision and its reasoning.
- **Out of date** → set `Status: deprecated`, or draft a superseding ADR (next number in that `docs/adr/`) and add the supersede link both ways.
- **Set-integrity** → fix numbering, repair supersede links, correct status frontmatter.

Stay inside [ADR-FORMAT.md](../grill-with-docs/ADR-FORMAT.md) — never invent new sections or a new format. When in doubt, the smaller ADR is the better one.

### 5. Wrap up

Summarize: ADRs reviewed, what was deleted / trimmed / deprecated / superseded, and any rationale you asked for and recorded. List anything you flagged but the user chose to keep, so the next review doesn't re-litigate it.
