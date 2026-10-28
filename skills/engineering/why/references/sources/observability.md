# Observability

Datadog, Grafana, New Relic, or similar. Holds the runtime record of what happened in production, as opposed to what was planned.

## What it holds

- **Metrics.** A metric's existence shows someone thought the number worth watching.
- **Monitors and alerts.** Conditions the team decided were worth waking someone for.
- **Dashboards.** Curated views of what the team considers important.
- **Traces and spans.** Request-level data for slow paths, timeouts, and retries.
- **Logs.** Error conditions that motivated defensive code.
- **Incidents.** Formal records with timelines and linked postmortems.
- **Notebooks.** Exploratory analyses with hypotheses.

## How to search it

Start broad, then narrow. Time-bound every query, typically about 30 days on each side of the change.

1. **Find the owning service** and its upstream and downstream dependencies.
2. **Dashboards and monitors first.** Search by feature, service, and symbol. A watched threshold is often the answer to "why is this clamped at N?"
3. **Metrics around the target.** Read metadata, then the time series. Does it spike before the merge and settle after?
4. **Logs.** Search by symbol, error string, or feature name, scoped by service. Prefer pattern or aggregate views over raw dumps.
5. **Traces.** Aggregate failure and latency stats for the endpoint, then inspect individual spans.
6. **Incidents.** For defensive code, search incidents near the date it was added. A timeline entry like "added defensive check for X" is near-direct evidence.

## What good evidence looks like

- A monitor whose threshold matches the constraint the code enforces
- A dashboard created by the target's author, measuring what the code guards
- A metric spike right before the merge and stable values after
- An incident record naming the target's symbols or error strings
- Logs showing the error pattern the defensive code prevents, in the window before the change

## Pitfalls

- **Correlation is not causation.** Other changes may have landed in the same window. Check neighboring PRs.
- **Instrumented is not caused.** A metric shows someone measured something, not that the code exists because of it.
- **Chart framing.** A chart reflects its author's framing, not the reason for a specific line.
- **Vanished telemetry.** Renamed metrics and short retention create gaps. Report them as gaps, not null results.
- **Personal data in logs.** Logs can carry user identifiers. Quote message templates and counts, not user values.

## What to return

For each relevant item, give its type, name, ID or link, owner and created or modified date, the condition or query quoted verbatim, and how strongly it connects to the target.
