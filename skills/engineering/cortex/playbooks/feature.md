### Feature

**You own design and delivery.** Prefer existing decide/explore skills; this playbook owns implement → verify → PR.

1. **Data shape first.** Name the domain structure before branching logic ([`principles`](../../principles/SKILL.md) — Model the domain / Foundational sequencing).
2. **Decide when stuck.** Contested product tree → [`grill-me`](../../../productivity/grill-me/SKILL.md). Need a durable spec → [`write-rfc`](../../../productivity/write-rfc/SKILL.md). Need a tracked unit of work → [`to-issue`](../../../productivity/to-issue/SKILL.md). Empirical fork → **Prototype** first.
3. **Throughput checkpoint** (keep each item; use `n/a: <reason>` when it does not apply):
   - Blocking first steps
   - Independent workstreams
   - Shared mutable state (prefer split over serialize)
   - Smallest safe decomposition
4. Implement the smallest change that meets the goal. Spawn subagents for disjoint streams; review their diffs yourself. Apply **Sequence verifiable units ∩ Prove it works**.
5. Verify on the real surface the user hits. Inconclusive or wrong-surface is not a pass.
6. Run **Opening a PR**.

No arena / multi-model bakeoff skill exists yet — when multiple shapes are plausible, run a short **Prototype** bakeoff or state the chosen shape and why.

**Reply:** what you built, data shape chosen, throughput checkpoint, how you verified, open decisions.
