---
name: reflect
description: Mines the active session transcript for durable learnings with three parallel reviewers (judgment, tooling, divergent) and one synthesizer, sorts the proposals into Accepted, Rejected, and Backlog, and applies only the skill edits the user approves. Use when the user says reflect or /reflect, asks to capture what a session taught, or wants a slow or painful run turned into skill changes so the next run doesn't repeat it.
disable-model-invocation: true
---

# Reflect

Mine this conversation for durable learnings and route each one to a concrete skill edit. Nothing changes until the user approves.

Skip when the session was trivial or off-topic, or when the parent followed an existing skill correctly. One weird session is an anecdote, not a rule.

Open a todolist with the six steps below.

Resolve relative links from this skill directory's real path. The personal install symlinks each skill directory one level deep, so a textual `../..` from the link path lands outside the repo.

## 1. Locate the active transcript

Read only this workspace's transcripts. Never glob across other projects, since that reads private chats from unrelated work.

- Claude Code keeps sessions at `~/.claude/projects/<workspace-slug>/<session>.jsonl`, under `$CLAUDE_CONFIG_DIR` instead of `~/.claude` when that is set. The slug is the absolute workspace path with every character other than letters and digits replaced by `-`. Subagent transcripts sit under `<session>/subagents/`. List the newest with `ls -t <dir>/*.jsonl | head`.
- Codex writes `${CODEX_HOME:-~/.codex}/sessions/YYYY/MM/DD/rollout-<time>-<id>.jsonl`, and older ones may be compressed to `.jsonl.zst`. List the newest with `ls -t "${CODEX_HOME:-$HOME/.codex}"/sessions/*/*/*/rollout-*.jsonl | head`. Check only the newest few, and read past a file's metadata line only when it names this workspace as the working directory.

Take the one whose first user message matches this conversation's opening prompt. If none matches, write a tight digest of the session and pass that instead.

## 2. Spawn three reviewers in parallel

Spawn three subagents at once. Pass each its template verbatim, with the transcript path or digest substituted where marked. Reviewers edit nothing, but keep their connector access so they can look up the tickets, threads, and traces the transcript cites.

| Lens | Model | Template |
| --- | --- | --- |
| Judgment | the strongest judgment model | [references/judgment-reviewer.md](references/judgment-reviewer.md) |
| Tooling | a different model family than the parent when the runtime offers one, otherwise the parent model | [references/tooling-reviewer.md](references/tooling-reviewer.md) |
| Divergent | the strongest judgment model | [references/divergent-reviewer.md](references/divergent-reviewer.md) |

If the runtime refuses a model choice, fall back to the parent model and say so. Never block on a specific vendor.

## 3. Synthesize

Spawn one synthesizer on the strongest judgment model. Pass [references/synthesizer.md](references/synthesizer.md) verbatim, with each reviewer's full output inlined where marked. Keep its connector access so it can spot-verify citations. It returns an Accepted, Rejected, and Backlog list.

## 4. Structural enforcement check

Move any Accepted row that a lint rule, script, metadata flag, or runtime check would enforce more reliably to Backlog, and route it to [`correct`](../../engineering/correct/SKILL.md). Skill prose is for what mechanisms cannot enforce.

## 5. Apply

Present the synthesizer's full output with each row's destination path. Wait for explicit approval. The user picks the Accepted subset and may redirect routings. Never auto-apply, because a skill edit changes every future session. Approve a row only if it would change a future decision.

Where edits land:

- Skills in this collection are source files in the Pixxle/skills repo under `skills/<bucket>/<name>/`. The personal skill links resolve there, so follow the link and edit the target. If the collection is installed as a plugin instead, edit a checkout of the repo, never the installed copy.
- A skill installed from somewhere else is never edited in place. List its finding in Backlog for its owner, or fork it into this collection if the user asks.
- Make skill edits on their own branch in the skills repo. A skill edit tangled into feature work is invisible to review and impossible to evaluate.

How each approved row lands:

- A trivial edit (a one-line bullet, a tightened sentence, a stale fact corrected) goes in directly, under the collection rules in [Authoring a skill](../../engineering/cortex/playbooks/authoring-a-skill.md).
- A substantive edit (a new section or table, more than about 10 lines), a `tune description` row, or a `new skill` row runs through the [Authoring a skill](../../engineering/cortex/playbooks/authoring-a-skill.md) playbook and [`write-a-skill`](../write-a-skill/SKILL.md). A description tune front-loads the trigger words that would have fired it this session. An explicit-only skill (`disable-model-invocation: true`) never fires from its description, so its missed trigger becomes a link from the router or sibling that should have loaded it.
- Offer the [Eval](../../engineering/cortex/playbooks/eval.md) playbook before trusting a substantive edit. A fix written from one bad session tends to overfit it.

Stop before pushing. Opening a PR for the edits needs its own go-ahead.

Backlog items stay in the reply. Filing them anywhere external needs the user's go-ahead, and then [`to-issue`](../to-issue/SKILL.md) drafts them.

## 6. Summarize

Short list, no preamble:

- Edits applied: `<skill path>` and what changed, one line each.
- New skills created: `<skill path>`, one line each (rare).
- Backlog: the item, its suggested mechanism, and where it routes ([`correct`](../../engineering/correct/SKILL.md), [`to-issue`](../to-issue/SKILL.md), or the skill's owner), one line each.
- Dropped: one line per rejected finding with the synthesizer's reason.
