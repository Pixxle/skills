# Terminal report format

The final deliverable is **printed to the terminal**, not written to a file. `_deep-review/` holds the backing detail; the terminal output is the synthesis a human reads in 5 minutes. Only CONFIRMED and REFRAMED verdicts appear — REJECTED candidates are counted, not shown.

The report **leads with the core tangles**, not the cleanup list. If a reader takes away only the first screen, it must be the model-level reasons the codebase is hard to change — not a list of dead code. A run that surfaces zero CORE findings on a subsystem a human flagged as a mess has most likely failed; say so honestly rather than padding with cosmetics.

Print, in this order:

## 1. Header line

```
Deep Review — {{scope}} · {{N}} candidates → {{C}} confirmed, {{R}} reframed, {{X}} rejected · {{CORE}} core / {{CONTRIB}} contributing / {{COSMETIC}} cosmetic
```

Always show the funnel counts AND the severity split. The severity split is the honest measure of depth: a review that is 95% cosmetic should look like one at a glance, not hide behind a big "confirmed" number. Hiding the rejected count makes the review read as more thorough than it was.

## 2. The core tangles

The 1–3 CORE / model-level findings (the `D<NN>` blocks confirmed by QA) — what makes this codebase hard to change. For each: name the load-bearing wrong abstraction, the change-scenario that exposes it (and how many places it forces you to touch), the blast radius, and the better-model that collapses the class of problem. This is the point of the review; everything below is subordinate. If the run produced no CORE findings, say so plainly and treat it as a signal the review went shallow.

## 3. Confirmed cleanups — prioritized

The LOCAL judo moves (CONTRIBUTING and COSMETIC severity). Order strictly by the thermo-nuclear priority:

1. Structural code-quality regressions
2. Missed opportunities for dramatic simplification / code-judo restructuring
3. Spaghetti / branching complexity increases
4. Boundary / abstraction / type-contract problems
5. File-size & decomposition
6. Modularity & abstraction
7. Legibility & maintainability

For each finding, print a compact block:

```
[<priority#>] <title>   (confidence: HIGH/MED/LOW)
  where:   <path:line>, <path:line>
  problem: <one or two lines>
  judo:    <the move — what gets deleted, not rearranged>
  payoff:  <line/branch delta or concrete simplification>
  proof:   <what QA traced to confirm it — callers/tests/paths>
```

REFRAMED findings use the QA agent's corrected judo-move and payoff, and are marked `(reframed)`.

## 4. Where to start

A numbered list, capped at 8–10, ordered by **payoff × confidence**. Each item: one line on the change, one line on why it goes first (e.g. "unblocks the other three"), and the finding id. Anything beyond 10 goes in a short "also worth tracking" bullet list.

## 5. Priors check

Compare the report against `_deep-review/00_priors.md`. State explicitly which of the human's known problems the review surfaced (and as CORE or buried in cleanups), and which it missed. A known problem the run failed to find is itself a finding — about the run, not the code. Do not quietly omit it.

If `00_priors.md` is empty (a cold/newcomer run), degrade this to a self-consistency check against `_deep-review/00_distress.md`: did the CORE findings land where the distress signals predicted the pain would be? If the deep findings sit in quiet corners while the churn/bug-fix hotspots came back clean, say so — it usually means the review went shallow. Also note the cold-run blind spot: stable-but-rarely-touched code is invisible to distress signals and only the tangle pass would have caught it.

## 6. Footer

```
Full detail: _deep-review/ (priors, distress map, worklist, per-target candidates, per-finding verdicts)
```

## Style

- Be direct and demanding about quality, never rude. If the codebase is carrying avoidable complexity, say so plainly.
- No hedging ("might", "perhaps") — every finding survived adversarial QA, so state it with the evidence.
- Do not pad with low-value nits. The product is the core tangles plus a short list of high-conviction, verified judo moves — not a long catalog of cosmetics. If a finding is COSMETIC, let it read as cosmetic; don't dress it up.
- If zero findings survive QA, say so plainly and report the funnel — a clean result honestly reported is a valid outcome. If zero CORE findings survive on a subsystem flagged as a known mess, that is NOT a clean result — it means the review went shallow; say so.
