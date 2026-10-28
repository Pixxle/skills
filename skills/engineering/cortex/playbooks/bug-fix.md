### Bug fix

**You own the defect loop. Plan, review, verify.**

1. Read and follow [`fix-bug`](../../fix-bug/SKILL.md) in full. Copy its loop steps into the todolist (reproduce → binary-search with live evidence → smallest justified fix → failing-then-passing history → same-surface verify).
2. Seed the binary search with [`how`](../../how/SKILL.md) over the affected subsystem and [`why`](../../why/SKILL.md) for regression history, as fix-bug's step 2 says. Confirm the surviving mechanism with runtime evidence before planning the fix.
3. If the fix crosses a function boundary, run [`architect`](../../architect/SKILL.md) before implementing it. Skip it for mechanical work whose shape is already concrete.
4. Apply **Prove it works ∩ Laziness** and **Attack the premise** from [`principles`](../../principles/SKILL.md) when they fire. Do not invent a parallel defect method here.
5. When the fix is ready, run **Opening a PR** ([opening-a-pr.md](opening-a-pr.md)).

**Reply:** what was broken, root cause, fix, how you verified. Paste failing-then-passing repro output verbatim.
