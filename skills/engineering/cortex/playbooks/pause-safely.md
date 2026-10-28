### Pause safely

**You own a clean stop. Leave a checkpoint a cold-start agent can resume from.** Triggers: an explicit pause, going offline, a runtime restart, or imminent context compaction. The complement to [Session pickup](session-pickup.md).

This is explicit only. On "keep going", "going to bed, keep going", or "don't stop", do not pause. Keep a decision trail in the decision-trail mode of [`handoff`](../../handoff/SKILL.md) instead, under the full-autonomy grant in [`principles`](../../principles/SKILL.md#autonomy).

These steps track mode 2 of [`handoff`](../../handoff/SKILL.md), which owns the resume-note template.

1. Read and follow [`handoff`](../../handoff/SKILL.md) mode 2, Pause safely. Stop at a safe boundary. Finish the current atomic step or back out of it. Start nothing new, and cancel any nested subagents you own.
2. Take no irreversible action just to pause. No new PR and no push unless you already had one out.
3. Make the work durable. Commit uncommitted edits as one clear `wip:` commit on the current branch so nothing is lost. If the tree is broken, say so in the commit body in one line.
4. Write the **resume note** off-context, using the [shared resume sections](../../handoff/SKILL.md#shared-resume--handoff-sections) in [`handoff`](../../handoff/SKILL.md). Capture intent, what you were doing, progress and what's verified, current state, next steps, key files, and gotchas. Prefer a file such as `/tmp/<slug>-resume.md` (or the path the runtime names for off-context notes). For the compaction trigger, always write it to a file. If a decision trail already exists, point at it instead of duplicating it. Do not paste the whole trail into the note.

**Reply:** where you are in the loop, what's on disk versus still only in context (paths, no diff dumps), the commits you made and whether the tree is clean, and the first action on resume. This is a pause, not a final report.
