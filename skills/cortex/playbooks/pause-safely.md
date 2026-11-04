### Pause safely

**You own a clean stop that a cold-start agent can resume.** Pause only on an explicit stop. On "keep going", "going to bed, keep going", or "don't stop", keep working instead, with a decision trail per the decision-trail mode of [`handoff`](../../handoff/SKILL.md).

1. Stop at a safe boundary. Finish the current atomic step or back out of it, and start nothing new. Record each subagent you spawned (id, branch, state) for the note, then stop it.
2. Take no irreversible action to pause. Push only a branch already on the remote.
3. Make the work durable. Commit uncommitted edits as one `wip:` commit on the current branch, or on a new branch if that is the default branch. If the tree is broken, say so in the commit body in one line.
4. Write the resume note to a file outside the repo that a new session can read, such as `/tmp/<slug>-resume.md`. Use handoff's shared headings: Goal, Status, Artifacts, Decisions that matter, Next actions, Suggested skills, Gotchas. Put the todolist's open items under Next actions. Point at an existing decision trail instead of copying it. Redact secrets.

**Reply:** the resume note's path, where you are in the loop, what's on disk versus only in context (paths, no diff dumps), the commits you made and whether the tree is clean, and the first action on resume. This is a pause, not a final report.
