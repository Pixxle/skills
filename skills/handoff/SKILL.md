---
name: handoff
description: Persist work across agents and sessions with handoff docs, pause and resume notes, pickup from a prior trail, and an append-only decision trail that you audit against the transcript and send to a reviewer on another model family before you hand back. Use when compacting a conversation for another agent, pausing safely, picking up in-flight work, or keeping a reviewable decision trail on long, autonomous, or multi-phase runs that a human reviews after stepping away.
disable-model-invocation: true
---

# Handoff

One shape for everything that must survive a context boundary. Do not invent a parallel pickup or trail system. Pick a mode below. They share the resume template and the rules at the bottom.

## Modes

### 1. Handoff (conversation compact)

Write a handoff document summarising the current conversation so a fresh agent can continue. Save to the temporary directory of the user's OS, not the current workspace, unless the user named another path.

Include a "suggested skills" section. Prefer [`principles`](../principles/SKILL.md), [`unslop`](../unslop/SKILL.md), [`no-comments`](../no-comments/SKILL.md), and this skill when the next session will keep building or opening a PR. Give each as a path to its `SKILL.md`, since every skill is explicit-only and never loads by name.

Do not duplicate content already captured in other artifacts (PRDs, plans, ADRs, issues, commits, diffs, decision trails). Reference them by path or URL instead.

Redact secrets, credentials, and unnecessary PII.

If the user passed arguments, treat them as a description of what the next session will focus on and tailor the doc accordingly.

### 2. Pause safely

**You own a clean stop. Leave a checkpoint a cold-start agent can resume from.** Triggers: an explicit pause, going offline, a runtime restart, or imminent context compaction.

Explicit stops only. On "keep going", "going to bed, keep going", or "don't stop", do not pause. Keep a decision trail instead (mode 4) under the full-autonomy grant in [`cortex`](../cortex/SKILL.md#autonomy).

1. Stop at a safe boundary. Finish the current atomic step or back out of it. Start nothing new, and cancel any nested subagents you own.
2. Take no irreversible action just to pause. No new PR and no push unless you already had one out.
3. Make the work durable. Commit uncommitted edits as one clear `wip:` commit on the current branch so nothing is lost. If the tree is broken, say so in the commit body in one line.
4. Write the **resume note** off-context, using the shared sections below. Capture intent, what you were doing, progress and what's verified, current state, next steps, key files, and gotchas. Prefer a file such as `/tmp/<slug>-resume.md` (or the path the runtime names for off-context notes). For the compaction trigger, always write it to a file. If a decision trail already exists, point at it instead of duplicating it. Do not paste the whole trail into the note.

**Reply:** where you are in the loop, what's on disk versus still only in context (paths, no diff dumps), commits made and whether the tree is clean, and the first action on resume. This is a pause, not a final report.

### 3. Session pickup

**You own the resume point. Read the prior trail, don't redo it.**

1. Locate the prior trail: a resume note, a handoff doc, a decision trail, a local transcript, a cloud session URL, or a pushed branch. Claude Code keeps transcripts in `~/.claude/projects/<workspace-slug>/`, where the slug is the absolute workspace path with every character other than letters and digits replaced by `-`. Codex keeps them in `${CODEX_HOME:-~/.codex}/sessions/YYYY/MM/DD/`, so match on the working directory in each file's metadata line. Read only this workspace's transcripts and never glob across unrelated projects. That crosses workspace boundaries and reads private chats from unrelated work. Read the metadata overview and last messages first, then scan back for the decision points. Parse a long transcript in a subagent and keep the reduced timeline in the main thread ([Guard the Context Window](../principles/guard-the-context-window.md)).
2. Reconstruct operational state: the branch and worktree, what already landed (`git log`, `git diff` against the base), the open todos, the decisions made. The prior trail is authoritative input. Resist the bias to re-derive it.
3. Diff done versus pending. Compare what shipped against what was planned, and name the resume point. Do not re-run the prior repro or redo completed work. A "let me verify from scratch" pass treats the trail as untrustworthy when it is authoritative. Re-verify from scratch only a claim that lacks evidence.
4. Pick the verdict: continue the execution, ship a finished recommendation, ratify or override a prior conclusion, or postmortem a failed run. Hand the remaining work to its owner. Read and follow the skill or playbook that owns it. Under [`cortex`](../cortex/SKILL.md), that is the matching playbook. Pickup ends here. The routed owner runs the rest.
5. Verify the inherited claims against the original goal on the real artifact ([Prove It Works](../principles/prove-it-works.md)). A passing prior self-report is not the proof.

**Reply:** where the prior agent stopped, what you inherited versus redid (ideally nothing redone), the verdict, the resume point, and the outcome.

### 4. Decision trail

For long, autonomous, or multi-phase work, or any task the user steps away from to review later ("going to bed", "trust it when I'm back", "run until X"), keep one canonical, reviewable decision trail. The Autonomy pause lines in [`cortex`](../cortex/SKILL.md#autonomy) still bind under a full-autonomy grant.

#### The format

A single TSV file, one row per decision. Cells stay single-line. Evidence is a pointer, not prose.

Copy [references/decision-log-template.tsv](references/decision-log-template.tsv) (the header row) to start a clean log. Columns:

| Column | Meaning |
| --- | --- |
| ts | ISO8601 timestamp |
| phase | The phase or workstream |
| decision | What was chosen or done, one line |
| why | The reason in plain words. If a principle drove it, say it plainly, not as a jargon tag |
| evidence | A link or path that proves it: commit SHA, PR number, `file:line`, or an artifact, trace, or screenshot path. Never a paragraph |
| result | The outcome or predicate state: `tests green`, `reverted`, `pixel-diff 0`, `INCONCLUSIVE`, `open` |

An example, plain-spoken so a reviewer reads it at a glance:

```
ts	phase	decision	why	evidence	result
2026-05-24T09:02:00Z	frame	counted the work first, about 100 components and roughly 75 hours	wanted to know the size before starting a long run	commit 3a9f1c2	found 5 things to sort out before starting
2026-05-24T09:40:00Z	harness	took screenshots of the old version before changing anything	so we can compare old against new and catch any visual change	scripts/snapshot.sh, baseline/	saved 120 reference screenshots
2026-05-24T11:15:00Z	widget	moved the widget styles over without changing how it looks	keep the change small and the result identical	commit 7c21e0a, pixel-diff 0	looks identical, tests pass
2026-05-24T12:30:00Z	widget	threw out a helper's work because its screenshots were blank	checked the real files instead of trusting its summary	worktree reset	reverted, tightened the instructions for next time
```

#### Logging a row

Write each entry the way you'd tell a teammate what you did. Plain words, concrete actions, no AI speak or abstract jargon. Read and follow [`unslop`](../unslop/SKILL.md) for log text too.

Use [scripts/log.sh](scripts/log.sh) `<logfile> <phase> <decision> <why> <evidence> <result>` to append a row. It stamps `ts`, writes the header on first use, strips stray tabs and newlines, and prefixes any cell starting with `=`, `+`, `-`, or `@` with a single quote. A bare `printf` appending a row works too, but mind those same bytes if cells come from generated or user-supplied text.

Log decision points and checkpoints, not every action: a fork chosen, a unit completed with its verification result, a pivot or revert with its trigger, a blocker surfaced, a gate fixed. For loop runs, one row per iteration. Skip the trivial and self-evident.

A run is one agent conversation, including its later turns and any summary of it. A pickup, a replacement agent, or a new chat starts a new run. When a run adds to a log that already has rows, its first row has phase `start`, and so does its first row after another run's `start` row. So a run that comes back to a log in a later turn first reads the log's last rows to see whether another run wrote since. A `start` row names the `ts` range of the rows before it that this run did not write, and its evidence names this run, such as its session or agent id. Use phase `start` for nothing else.

#### Where it lives

By default the log is a working artifact, not committed. Keep it at `decisions.tsv` in the work dir, or `.audit/<task-slug>.tsv` when several efforts run at once, and leave it out of git. Commit it only when the work is ambitious enough that a reviewer needs the trail to trust the result.

Pause notes and handoff docs **point at** the trail. They do not fork a second log format.

#### Rules

- Append-only. A wrong call gets a new row that supersedes it. Never edit or delete history.
- Prefer evidence produced by committed scripts over hand-made one-offs ([Encode Lessons in Structure](../principles/encode-lessons-in-structure.md)).

#### Audit the log against the transcript

At the end of the run, before handing back, check the log told the truth. Read this run's transcript, found the way Session pickup step 1 finds one, and read only this workspace's transcripts. If the runtime keeps no transcript you can read, audit against the conversation in context and say so in the reply. Walk this run's rows against what actually happened. Each stretch of them begins at one of this run's `start` rows, or at the first row if this run created the log, and ends at the next `start` row of another run:

- Check that every row maps to a real decision or action.
- Check that each row's evidence resolves and shows what the row claims.
- A fork, pivot, or abandoned approach that shaped the work but isn't logged is a gap. Add it.

Correct the log, not the story. The audit never edits or removes a row, even an invented one. When a row records neither a real decision nor a real action, or its claim or evidence is wrong, add a row that supersedes it with what actually happened and a pointer that resolves. This audit does not check rows outside this run's stretches. If this run's own work shows one of them is wrong, supersede it like any wrong call.

#### Cross-model review of the trail

Before handing back, spawn a subagent on a different model family from the one that did the work. Self-review is not a substitute. When the runtime offers no other model family, spawn it on the parent model and say so on the `reviewed by` line. The subagent reads the decision trail and the run's transcript, then flags what the user should pay attention to. It is not a redo of the work. It scans for what is suboptimal or risky:

- Decisions logged with weak or absent evidence.
- Verification steps skipped or claimed without proof in the transcript.
- Choices that look risky in hindsight (premature, scope-creeping, papering over a symptom).
- Gaps the user would otherwise miss on a casual skim.

Every reply for a run that produced a trail ends with an "Attention" section. Lead with the reviewer's model on its own line (`reviewed by <model>`), then list each flag, pointing to specific rows or moments. "No flags" is a valid list. Leaving out the reviewer's model is not.

#### Reviewing the trail

Read top to bottom, follow the evidence pointers, spot-check. GitHub renders a committed TSV as a table. `column -s$'\t' -t decisions.tsv` renders it in a terminal.

#### Composing this mode

Other skills and playbooks route their audit trail here instead of inventing one. Link this skill, name the decision-trail mode, and let it own the format. Don't restate the columns. A loop playbook may define its own per-attempt columns, as [Hillclimb](../cortex/playbooks/hillclimb.md) does. This skill still owns the row, `start`-row, and audit rules.

## Shared resume / handoff sections

Use these headings for handoff docs and pause resume notes so pickup always finds the same shape:

```markdown
# Resume / handoff: <short slug>

## Goal
<user's goal in your own words>

## Status
- Phase / playbook step:
- Verified so far:
- Still open:

## Artifacts
- Branch:
- Key paths:
- PR (if any):
- Decision trail (if any):

## Decisions that matter
<bullets, or "see decision trail">

## Next actions
1. <first action on resume>
2. …

## Suggested skills
- …

## Gotchas
- …
```

Redact secrets in every mode. Prefer paths and SHAs over pasted diffs.
