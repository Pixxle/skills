### Perf issue

**You own the measurement. Plan, review, and verify every number.** Tie every fix and every ceiling claim to a measurement. Don't read source instead of measuring.

1. Capture a baseline via the repo's `verify-*` skill, on the surface the user reported and with a workload that reproduces the slowness. Record a trace and a number, and set the target from the user's number or state one. Read and follow [`benchmark-checklist`](../../benchmark-checklist/SKILL.md) to vet the baseline and each later number. For a regression, bisect with the same workload before you form hypotheses.
2. Load the trace into a queryable form (JSON to sqlite) and find the hot path. Read and follow [`how`](../../how/SKILL.md) over that path to ground hypotheses.
   Try the performance mantras in order, cheapest first:
   1. Don't do it. Stop work whose result nothing uses rather than cheapening it.
   2. Do it, but don't do it again.
   3. Do it less.
   4. Do it later.
   5. Do it when they're not looking.
   6. Do it concurrently.
   7. Do it cheaper.

   When an earlier mantra meets the target, stop.
3. Plan the fix from the trace. If it crosses a function boundary, read and follow [`architect`](../../architect/SKILL.md) first. Delegate implementation to a subagent, and review the diff.
4. Capture a post-fix trace and number with the baseline's workload, and run the tests. Keep the attempt only when the number moves past noise and the tests pass. Otherwise revert it in full before the next attempt, per [Sequence Work into Verifiable Units](../../principles/sequence-verifiable-units.md). If attempts keep missing the target, switch to the [Hillclimb](hillclimb.md) playbook, and carry the baseline workload and target into its step 1.
5. Diff the baseline and post-fix artifacts.
6. Run [Opening a PR](opening-a-pr.md), with the before → after number under Verification.

**Reply:** baseline and post-fix numbers with run count and range, the delta, the limiter, the mantra the fix applied, and artifact paths.
