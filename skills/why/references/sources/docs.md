# Long-form docs

Confluence, Notion, Google Docs, or similar. Where the why is often written out before it becomes code. A significant feature usually has a doc.

## What it holds

- PRDs, technical specs, RFCs, and ADRs
- Design review and meeting notes
- Postmortems
- Runbooks that explain defensive code
- Team pages and strategy documents that set priorities

## How to search it

1. **Search by keyword.** Feature name, key symbols, error strings, user-visible terms, and the PR author's name. In Confluence, CQL such as `text ~ "<term>"` with a date bound narrows fast.
2. **Read full pages**, not previews. Rationale is often buried mid-document.
3. **Follow child pages and backlinks.** Alternatives considered and appendices often live in sub-pages.
4. **Check meeting notes** from the weeks around the ship date.

## What good evidence looks like

- A problem statement or motivation section matching the target's purpose
- An "alternatives considered" or "rejected approaches" section
- A postmortem naming the target as the fix for a specific incident
- Meeting notes recording "we decided X because Y" in the same window as the PR
- A filled-in ADR with context, decision, and consequences

## Pitfalls

- **Outdated specs.** A spec written before implementation may describe a plan that changed. Cross-check against the PR. Flag any drift as a contradiction.
- **Boilerplate.** Generic "why" sections are not answers.
- **Several drafts.** Find the finalized or most recently updated version. Check dates.
- **Unlinked docs.** The best doc may be linked from nowhere. Broad searches help.
- **Access limits.** A page you cannot open is a gap.

## What to return

For each relevant doc, give the title and URL, author and last-updated date, the motivation quoted verbatim with its section, relevant linked pages, and whether it was final or draft.
