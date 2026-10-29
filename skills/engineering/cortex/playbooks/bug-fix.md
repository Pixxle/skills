### Bug fix

**You own the defect loop. Plan, review, verify.** Delegate investigation and the fix to subagents, and stay in the lead. Pick each subagent's model per [Subagents](../references/subagents.md).

Be scientific. Every shipped line traces to runtime evidence. Belt-and-suspenders that "might help" is a hypothesis, not a fix. When evidence refutes a hypothesis, revert what it motivated. The smallest change the evidence justifies ships.

1. Read and follow [`fix-bug`](../../fix-bug/SKILL.md) in full. Its failing-then-passing history and Test guardrails bind. Cortex adds: same-surface reproduce yourself first (repo `verify-*` when present), seed hypotheses with [`how`](../../how/SKILL.md) / [`why`](../../why/SKILL.md), architect or interrogate before Opening a PR when the fix crosses a boundary or is hard to reverse, and stage commits so the failing check lands before the fix.
2. Run [Opening a PR](opening-a-pr.md).

**Reply:** what was broken, root cause, fix, how you verified. Name the failing-before check and paste failing-then-passing repro output verbatim.
