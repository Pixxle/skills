# Error tracking

Sentry, Rollbar, Datadog error tracking, or similar. Holds the specific exceptions and error trajectories that motivated defensive or corrective code. Strongest for catch blocks, null guards, type checks, and retries.

## How to search it

1. **Orient.** Find the organization and the project that owns the target.
2. **Search issues** using the exception classes the target handles, its function or class name, the error strings it checks for, and its file path.
3. **Read the timeline.** For each suspect issue, check first seen and last seen, affected releases, and frequency. Does the error stop when the target shipped? Which release carried the fix?
4. **Open a full event.** Does the stack trace pass through the target? Do tags and breadcrumbs match the condition the target defends against?
5. **Match releases** near the target's commit date against the PR merge date.
6. **Treat AI root-cause summaries as hypotheses**, never as evidence. Events and stack traces are the evidence.

## Pitfalls

- **Sampling.** Event counts may be sampled. Note the rate when known.
- **Resolved is not fixed.** An issue marked resolved may have been silenced. Check whether events stopped.
- **User context.** Events carry user emails, IDs, and IP addresses. Quote stack frames and error messages only. Never copy user context.

## What to return

For each relevant issue, give the ID, title, and project, first and last seen, event count, affected releases, a short stack-trace excerpt showing the target, the correlation with the ship date, a link, and any resolution notes.
