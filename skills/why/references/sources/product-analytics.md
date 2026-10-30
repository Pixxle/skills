# Product analytics

Amplitude, Mixpanel, a SQL warehouse, or similar. Holds the product and data reality behind the code. Observability shows what the system did. Analytics shows what users did, which experiments ran, and where a threshold may have come from. Strongest for flag-gated code, experiment-driven ships, data migrations, and "where did this number come from".

## How to search it

1. **Orient before querying.** Event names, properties, and tables are project-specific. Discover them first. Never assume a name, and never report results from a table or event whose existence you did not confirm.
2. **Time-bound every query.** Bracket the ship date, typically 30 days on each side. Unbounded scans time out.
3. **Prefer curated sources.** Saved charts, dashboards, and modeled tables are deduplicated and typed. Drop to raw events only when nothing curated exists.
4. **Aggregate only.** Counts, percentiles, and first and last seen dates. Never pull user-level rows.

## Patterns that pay off

- **Usage trajectory.** Daily counts of the relevant event around the merge. A step from zero to steady volume within a day or two suggests the PR launched the feature. A decay to zero suggests a deprecation.
- **Threshold origin.** Median, p99, and max of the relevant property in the 14 days before the PR. A p99 that matches the target's constant suggests the number came from data.
- **Experiment or flag lookup.** Find the experiment or flag by its key in the code, then pull exposure by variant and any recorded decision near the PR date.
- **Query history.** For migrations, backfills, or performance rewrites, warehouse query history filtered to the table and window can show the expensive queries that motivated the change.
- **Data lineage.** If the target reads or writes a modeled table, that model's history often holds the rationale. Hand it to the source-control investigator as a lead.

## Pitfalls

- **Instrumented is not caused.** An event exists because someone cared to log it. Pair any causal claim with a PR or commit citation.
- **Silent instrumentation changes.** A step in volume may mean logging started, not that behavior changed. Check for instrumentation PRs in the same window.
- **Schema drift.** A property today may not have existed when the target was written.
- **Refresh lag.** Modeled tables rebuild on a schedule. The last few hours may be missing.
- **Retention cliff.** A window older than the data's retention is a gap, not a null result.
- **Notebooks.** Exploratory notebooks may not be queryable. If the rationale likely lives in one, report a gap.

## What to return

For each finding, give its type (event, experiment, flag, chart, table), the exact name and query or chart definition, the time window, a compact numeric summary, the correlation with the ship date, and its strength (direct, circumstantial, weak).
