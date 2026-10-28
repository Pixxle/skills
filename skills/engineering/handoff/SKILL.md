---
name: handoff
description: Persist work across agents and sessions — handoff docs, pause/resume notes, pickup from a prior trail, and append-only decision trails. Use when compacting a conversation for another agent, pausing safely, picking up in-flight work, or logging decisions on long, autonomous, or multi-phase runs.
---

# Handoff

One shape for everything that must survive a context boundary. Do not invent a parallel pickup or trail system. Pick a mode below; they share the artifact rules at the bottom.

## Modes

### 1. Handoff (conversation compact)

Write a handoff document summarising the current conversation so a fresh agent can continue. Save to the temporary directory of the user's OS — not the current workspace — unless the user named another path.

Include a "suggested skills" section. Prefer skills from the shared gates package ([`principles`](../principles/SKILL.md), [`unslop`](../unslop/SKILL.md), [`no-comments`](../no-comments/SKILL.md), and this skill) when the next session will keep building or opening a PR. Give each as a path to its `SKILL.md`, since the gates are explicit-only and never load by name.

Do not duplicate content already captured in other artifacts (PRDs, plans, ADRs, issues, commits, diffs, decision trails). Reference them by path or URL instead.

Redact secrets, credentials, and unnecessary PII.

If the user passed arguments, treat them as a description of what the next session will focus on and tailor the doc accordingly.

### 2. Pause safely

Explicit stops only. On "keep going", "going to bed, keep going", or "don't stop", do not pause. Keep a decision trail instead (mode 4) under the full-autonomy grant in [`principles`](../principles/SKILL.md).

1. Stop at a safe boundary. Finish the current atomic step or back out of it. Start nothing new. Cancel nested subagents you own.
2. Take no irreversible action just to pause. No new PR and no push unless you already had one out.
3. Make the work durable. Commit uncommitted edits as one clear `wip:` commit on the current branch. If the tree is broken, say so in the commit body in one line.
4. Write a **resume note** using the shared sections below. Prefer a file such as `/tmp/<slug>-resume.md` (or the path the runtime names for off-context notes). If a decision trail already exists, point at it; do not paste the whole trail into the note.

**Reply:** where you are in the loop, what's on disk versus still only in context (paths, no diff dumps), commits made and whether the tree is clean, and the first action on resume. This is a pause, not a final report.

### 3. Session pickup

You own the resume point. Read the prior trail; do not redo it.

1. Locate the prior trail: resume note, handoff doc, decision trail, local transcript, cloud-agent URL, or pushed branch. Claude Code keeps transcripts in `~/.claude/projects/<workspace-slug>/`, where the slug is the absolute workspace path with every character other than letters and digits replaced by `-`. Codex keeps them in `${CODEX_HOME:-~/.codex}/sessions/YYYY/MM/DD/`, so match on the working directory in each file's metadata line. Read only this workspace's transcripts and never glob across unrelated projects. Read metadata and last messages first, then scan back for decision points. Parse a long transcript in a subagent and keep a reduced timeline in the main thread.
2. Reconstruct operational state: branch and worktree, what already landed (`git log`, `git diff` against the base), open todos, decisions made. The prior trail is authoritative input.
3. Diff done versus pending. Name the resume point. Do not re-run a completed repro or redo finished work. "Verify from scratch" is only for claims that lack evidence.
4. Continue the remaining work (or hand off to the skill/playbook that owns it). Pickup ends once the resume point and next action are clear.
5. Verify inherited "done" claims against the original goal on the real artifact (Prove it works in [`principles`](../principles/SKILL.md)). A prior self-report is not proof.

**Reply:** where the prior agent stopped, what you inherited versus redid (ideally nothing redone), the resume point, and the outcome.

### 4. Decision trail

For long, autonomous, or multi-phase work, or any task the user steps away from ("going to bed", "trust it when I'm back", "run until X"): keep one append-only TSV log. The Autonomy pause lines in [`principles`](../principles/SKILL.md#autonomy) still bind under a full-autonomy grant.

Copy [references/decision-log-template.tsv](references/decision-log-template.tsv) (header row) to start a clean log. Columns:

| Column | Meaning |
| --- | --- |
| `ts` | ISO8601 timestamp |
| `phase` | Phase or workstream |
| `decision` | What was chosen or done, one line |
| `why` | Reason in plain words |
| `evidence` | Pointer only: commit SHA, PR number, `file:line`, artifact path |
| `result` | Outcome predicate: `tests green`, `reverted`, `open`, `INCONCLUSIVE`, … |

Cells stay single-line. Evidence is a pointer, not prose. Apply [`unslop`](../unslop/SKILL.md) to cell text.

Default path: `decisions.tsv` in the work dir, or `.audit/<task-slug>.tsv` when several efforts run at once. Leave it out of git unless a reviewer needs the trail to trust the result.

Use [scripts/log.sh](scripts/log.sh) `<logfile> <phase> <decision> <why> <evidence> <result>` to append a row (stamps `ts`, writes the header on first use, strips tabs/newlines, and neutralizes spreadsheet-formula prefixes).

Log forks, unit completions with verification results, pivots/reverts, blockers, and gate fixes — not every keystroke. Append-only: a wrong call gets a superseding row, never an edit.

A run is one agent conversation, including later turns. A pickup or new chat is a new run. When a run appends to an existing log, its first row uses phase `start`, names the prior `ts` range it did not write, and points at this run in `evidence`.

At the end of a trailed run, spot-check this run's rows against what happened and against resolving evidence. Correct with superseding rows only. Optionally spawn a different-model subagent to flag weak evidence, skipped verification, or risky choices; end the reply with an Attention section (`reviewed by <model>`, then flags or "No flags").

Pause notes and handoff docs **point at** the trail. They do not fork a second log format.

## Shared resume / handoff sections

Use these headings for handoff docs and pause resume notes so pickup always finds the same shape:

```markdown
# Resume / handoff — <short slug>

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
