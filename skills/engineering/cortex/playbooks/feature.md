### Feature

**You own design and delivery. Plan, review, verify.** Prefer existing decide and explore skills. This playbook owns ground, design, implement, verify, and PR.

1. **Ground.** Run [`how`](../../how/SKILL.md) over the affected subsystem. Add [`why`](../../why/SKILL.md) when history likely explains the shape or the change moves ownership.
2. **Data shape first.** Name the domain structure before branching logic (**Model the domain** in [`principles`](../../principles/SKILL.md)).
3. **Design.** When the change crosses a function boundary or moves ownership or layering, run [`architect`](../../architect/SKILL.md). It runs [`arena`](../../arena/SKILL.md) over at least two distinct shapes. Skip it for mechanical work whose shape is already concrete. Decide when stuck. Contested product tree → [`grill-me`](../../../productivity/grill-me/SKILL.md). Need a durable spec → [`write-rfc`](../../../productivity/write-rfc/SKILL.md). Need a tracked unit of work → [`to-issue`](../../../productivity/to-issue/SKILL.md). Empirical fork → **Prototype** first.
4. **Throughput checkpoint** (keep each item, and use `n/a: <reason>` when it does not apply):
   - Blocking first steps
   - Independent workstreams
   - Shared mutable state (prefer split over serialize)
   - Smallest safe decomposition
5. **Implement** the smallest change that meets the goal. Delegate code-writing per [cortex's Subagents section](../SKILL.md#subagents), with file paths, the named data shape, and success criteria in the brief. When architect ran, implement against its sketch (architect phase D) without another arena. Delegate through [`arena`](../../arena/SKILL.md) only when architect was skipped and the implementation admits several valid shapes (error handling, abstraction layer, test structure), so the runners surface the alternatives and the judge guards the pick. Review every diff yourself. Apply **Sequence verifiable units ∩ Prove it works**.
6. **Verify** on the real surface the user hits, through the repo's verify skill when it has one. Inconclusive or wrong-surface is not a pass.
7. If the design is contested or hard to reverse, run [`interrogate`](../../interrogate/SKILL.md) before shipping.
8. Run **Opening a PR**.

**Reply:** what you built, the data shape and design chosen (alternatives as a table), the throughput checkpoint, how you verified, open decisions.
