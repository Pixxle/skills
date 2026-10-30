# Issue tracker

Jira, Linear, GitHub Issues, or similar. This is where the product or business context usually lives, the "a customer asked" or "this is for the Q3 compliance push" layer.

## What it holds

- Issues describing features, bugs, and their motivation
- Parent and child relationships (epic or initiative down to tasks)
- Comments with clarifications, scope changes, and decisions
- Labels such as compliance, customer-request, perf, incident-followup
- Attached specs or PRDs, linked PRs, milestones, and due dates

## How to search it

1. **Start with linked tickets.** Fetch every ticket ID from the code anchor (patterns like `ENG-1234`). Read the full issue with comments and history.
2. **Search by keyword.** Feature name, key symbol, business term, error string. Try several phrasings. In Jira, use JQL such as `text ~ "<term>"` bounded by `created` dates around the ship date.
3. **Walk up the tree.** From a subtask, fetch its parent and epic. Children are tactical. Parents often carry the why.
4. **Read attached specs and project pages.** Hand a linked doc in another system to the docs investigator as a lead.
5. **Read labels and milestones.** Labels hint at the kind of motivation. Milestones tie work to deadlines.

## What good evidence looks like

- A description stating the business problem
- A comment recording a decision and its reason
- A parent named like an initiative, such as "Reduce payment failures"
- Labels tying the work to an incident, a customer, or compliance

## Pitfalls

- **Scope drift.** A ticket may have been reopened with a different scope. Read the whole history.
- **Boilerplate.** Template "why" sections filled with "improve user experience" are not answers.
- **Stale plans.** Check dates against the code's ship date.
- **Duplicate chains.** Follow "duplicate of" links back to the canonical ticket.
- **Access limits.** An issue you cannot open is a gap, not a null result.
- **Customer data.** Tickets often name customers and users. Cite the ticket ID. Don't copy personal details.

## What to return

For each relevant ticket, give the ID and title, the motivation quoted verbatim, labels, parent, and project, the created and closed dates, and a link.
