### Bug fix

**You own this task.** Delegate investigation and the fix to subagents, stay in the lead.

Ship the smallest change the evidence justifies. Every shipped line traces to runtime evidence, so a belt-and-suspenders line that "might help" stays out. When evidence refutes a hypothesis, revert what it motivated.

1. Reproduce it on the matching surface: the repo's `verify-*` skill for a UI, IDE, or CLI surface (Non-negotiables), otherwise the narrowest executable check. Do this even when a debug or instrumentation protocol says to ask the user to reproduce. Ask the user only with a stated, specific reason the control surface cannot reach the target, and only after driving it as far as it goes. If it won't reproduce directly, synthesize the trigger, tighten conditions, or instrument until it fires. When the bug has a cheap local test path, read and follow [`tdd`](../../tdd/SKILL.md) to capture the repro as a failing test.
2. Binary-search the cause. Form the candidate hypotheses, then rule them out with runtime evidence until one survives. Seed them by reading and following [`how`](../../how/SKILL.md) over the affected subsystem. For a regression with a known-good version, bisect history against the repro. When bisection names a culprit commit, or the suspect code looks deliberate (a guard, a retry, a flag), read and follow [`why`](../../why/SKILL.md) as a passing question. Instrument wherever program state is unclear, and trace back to the first wrong decision per [Fix Root Causes](../../principles/fix-root-causes.md). Drive a long or stubborn hunt with an [Autonomous run](autonomous-run.md). Confirm the surviving *mechanism* with runtime evidence before you plan the fix.
3. Plan the fix. If it crosses a function boundary, read and follow [`architect`](../../architect/SKILL.md) first. Delegate implementation to a subagent, scoped to the confirmed mechanism and the files it touches.
4. Verify on the same surface. The original repro now passes. Unit tests show branch behavior, not bug absence. If two fixes fail the repro, apply [Attack the Premise](../../principles/attack-the-premise.md) before a third.
5. When step 1 produced a committable check, commit it failing before the fix, per [Sequence Work into Verifiable Units](../../principles/sequence-verifiable-units.md).
6. Run [Opening a PR](opening-a-pr.md).

**Reply:** what was broken, root cause, fix, how you verified. Paste failing-then-passing repro output verbatim.
