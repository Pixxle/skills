### Feature

**You own the design and the review. A subagent writes the code.**

1. Read and follow [`architect`](../../architect/SKILL.md) phases A to C. Its phase A runs [`how`](../../how/SKILL.md) over the affected subsystem. Its phase D is step 3. When the shape is already concrete, skip architect and read and follow [`how`](../../how/SKILL.md) alone.
2. Write the throughput checkpoint as four todo items. A dimension that does not apply (single file, no fan-out) keeps its item with `n/a: <reason>`.
   - **Blocking first steps.** Gates run before fan-out.
   - **Independent workstreams.** Code-coupled work stays with one owner. Inside it, disjoint files, services, or layers parallelize. Only slices that produce independent artifacts fan out at the parent.
   - **Shared mutable state.** Apply [Separate Before Serializing Shared State](../../principles/separate-before-serializing-shared-state.md).
   - **Smallest safe decomposition.** If one worker is best, name why.
3. Delegate the code to one owner subagent. Its brief carries file paths, the data shape chosen per [Model the Domain](../../principles/model-the-domain.md) before any logic (architect's sketch when you ran it), the checkpoint, and success criteria. The owner fans out after the blocking phase and builds, verifies, and commits each small unit before the next, per [Sequence Work into Verifiable Units](../../principles/sequence-verifiable-units.md). It surfaces each deviation from the sketch instead of absorbing it. Delegation is mandatory. It has no `skip:` escape, and [Laziness Protocol](../../principles/laziness-protocol.md) does not override it, because the gain is review separation, not lines saved. A subagent forbidden to spawn owns the diff directly under the same review separation. Never reply "standing by" while a nested agent runs. Re-ground upstream-derived files against their source. Port a shared-primitive improvement to every consumer and verify each.
4. When the owner reports friction the sketch cannot absorb, read and follow [architect phase E](../../architect/SKILL.md#e-scrap-when-the-architecture-is-wrong) and re-delegate. Rewrite the checkpoint at each phase boundary.
5. Review the owner's diff against the sketch and the brief. Send gaps back to a fresh owner.
6. Verify on the matching surface.
7. If the design is contested or hard to reverse, read and follow [`interrogate`](../../interrogate/SKILL.md) before shipping.
8. Run [Opening a PR](opening-a-pr.md).

**Reply:** what you built, the throughput checkpoint, a table of the design alternatives, and open decisions.
