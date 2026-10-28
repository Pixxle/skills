### Perf issue

**You own the measurement story. Plan, review, verify the numbers.** Tie every fix to a measurement. Do not read source instead of measuring.

1. **Baseline.** Capture a baseline trace on the surface the user waits on, with realistic data, through the repo's `verify-*` skill when it has one ([cortex's Non-negotiables](../SKILL.md#non-negotiables)). Keep the profile or trace as an artifact. Vet the baseline, and every later number, by reading and following [`benchmark-checklist`](../../benchmark-checklist/SKILL.md).
2. **Ground hypotheses in the profile.** Read and follow [`how`](../../how/SKILL.md) over the hot path. Do not claim a perf ceiling without running it first. A regression with a known-good version is a defect. Bisect it by reading and following the binary-search step of [`fix-bug`](../../fix-bug/SKILL.md), with the vetted benchmark as the repro. For new slowness, try the performance mantras in order, cheapest first:
   1. Don't do it. Stop work whose result nothing uses rather than cheapening it.
   2. Do it, but don't do it again.
   3. Do it less.
   4. Do it later.
   5. Do it when they're not looking.
   6. Do it concurrently.
   7. Do it cheaper.

   When an earlier mantra meets the target, stop.
3. **Fix from the trace.** If the fix crosses a function boundary, read and follow [`architect`](../../architect/SKILL.md) first. Skip it for mechanical work whose shape is already concrete. Delegate implementation to a subagent per [cortex's Subagents section](../SKILL.md#subagents), picking its model for the job. Use the strongest judgment model for cross-cutting or subtle changes, or a fast model for mechanical edits. Pick each subagent's reasoning effort for the job when the runtime offers a choice. Review the diff yourself. Read and follow [`principle-sequence-verifiable-units`](../../principle-sequence-verifiable-units/SKILL.md), and verify each attempt before you try the next. Commit the harness before the fix so history reads baseline then treatment. Capture a post-fix trace.
4. **Compare artifacts with a tool.** Parse both sides into one queryable form (JSON to sqlite, then diff). Do not compare by eye. "Inconclusive" or wrong-surface is not a pass. Flag it.
5. **Cite the measurement in the PR.** One primary number under Verification. Link the runs, range, and limiter evidence.
6. Run [Opening a PR](opening-a-pr.md).

For sustained improvement against a metric rather than a one-off fix, use the [Hillclimb](hillclimb.md) playbook.

**Reply:** verdict, baseline and post-fix numbers with run count and range, delta, the limiter, artifact path.
