# Team chat

Slack, Teams, or similar. Holds deliberation that never reached a doc. It matters most when the PR, ticket, and doc trail is thin.

## How to search it

Prefer public channels. Search private channels and direct messages only when the user asks.

1. **Author and date.** Messages from the PR author in the days around the merge date. This narrows scope sharply and often hits.
2. **PR link.** Search for the PR URL or `/pull/<number>`. Reviews and announcements often link it.
3. **Error string.** If the code handles a specific error, search for the string. Incident threads tend to surface.
4. **Feature or symbol name** in the owning team's channels.
5. **Fetch the thread** for every hit. A single message read without its thread often means something else.

## Pitfalls

- **Retention cliff.** Old messages may be gone. If nothing exists before a date, report the cliff.
- **Unsearched DMs.** Many decisions happen in private messages. Name that as a known limitation.
- **Jokes are not decisions.** "lol just do the thing" before a commit is not a rationale. Look for considered discussion.
- **Personal content.** Chat mixes work and personal talk. Quote only the lines that bear on the question. Never copy customer details shared in a thread.

## What to return

For each relevant thread, give the channel, permalink, date, author, the decisive lines quoted verbatim, and how the thread relates to the PR timeline.
