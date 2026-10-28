### Perf issue

**You own the measurement story. Plan, review, verify the numbers.** Tie every fix to a measurement. Do not read source instead of measuring.

1. **Baseline.** Measure on the surface the user waits on, with realistic data. Keep the profile or trace as an artifact. Vet the baseline, and every later number, with [`benchmark-checklist`](../../benchmark-checklist/SKILL.md).
2. **Ground hypotheses in the profile** and a [`how`](../../how/SKILL.md) pass over the hot path. Do not claim a perf ceiling without running it first. A regression with a known-good version is a defect. Bisect it with the vetted benchmark as the repro, per the binary-search step of [`fix-bug`](../../fix-bug/SKILL.md). For new slowness, try the performance mantras in order, cheapest first:
   1. Don't do it. Stop work whose result nothing uses rather than cheapening it.
   2. Do it, but don't do it again.
   3. Do it less.
   4. Do it later.
   5. Do it when they're not looking.
   6. Do it concurrently.
   7. Do it cheaper.

   When an earlier mantra meets the target, stop.
3. **Fix from the trace.** If the fix crosses a function boundary, run [`architect`](../../architect/SKILL.md) first. Skip it for mechanical work whose shape is already concrete. Delegate implementation to a subagent on the strongest judgment model for cross-cutting or subtle changes, or a fast model for mechanical edits. Review the diff yourself. Verify each attempt before trying the next (**Sequence verifiable units** in [`principles`](../../principles/SKILL.md)). Commit the harness before the fix so history reads baseline then treatment. Capture a post-fix trace.
4. **Compare artifacts with a tool.** Parse both sides into one queryable form (JSON to sqlite, then diff). Do not compare by eye. Inconclusive or wrong-surface is not a pass. Flag it.
5. **Cite the measurement in the PR.** One primary number under Verification. Link the runs, range, and limiter evidence.
6. Run [Opening a PR](opening-a-pr.md).

No Hillclimb playbook exists yet. For sustained improvement of one metric rather than a one-off fix, use [`figure-it-out`](../../figure-it-out/SKILL.md) and keep its decision trail.

**Reply:** verdict, baseline and post-fix numbers with run count and range, delta, the limiter, artifact path.
