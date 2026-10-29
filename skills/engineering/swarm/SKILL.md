---
name: swarm
description: >-
  Fan out N parallel workers, drain them, and return one report. Use for /swarm,
  'swarm this', parallel coverage, races, gauntlets, exploration partitions, or
  multi-lens review of a PR or diff. For proving findings by running code, use
  interrogate. For a maintainability-only bar, use thermo-nuclear-code-quality-review.
disable-model-invocation: true
---

# Swarm

## Start

Open a todolist with one entry per phase before launching anything.

1. Frame
2. Fan out
3. Aggregate
4. Report

## Phase A: Frame

1. State the done predicate and the artifact or report the swarm must return.
2. Choose the shape. Partition into slices, race N workers on identical briefs, or mix both. For a race or mixed shape, declare `first pass`, `rank all`, or `best-of` before spawning. For a multi-lens **review** of a change, pick the panel from [perspectives.md](references/perspectives.md) (default five lenses; shrink for tiny diffs).
3. Pick each worker's model for the job per [cortex Subagents](../cortex/references/subagents.md). Prefer a different model family than the author for verifiers when the runtime offers one. For a model race, name each arm's model up front. When the runtime offers no model choice or rejects one, use the parent model and say so.
4. Give each worker its own writable output when it writes. When workers verify or measure commits, each brief names the exact SHAs. A measurement brief also names the method (sample count, what one sample is, order). The worker records both in its result. For review, create `_swarm/` at the repo root (or `_swarm_<date>/` if one exists) and write `_swarm/00_frame.md` with scope, base SHA or PR, intent, panel, and exclusions.

## Phase B: Fan out

Spawn all N workers in one message as background subagents. Use capability terms only. Prefer diverse model families when the runtime offers them.

Every brief stands alone. Include the goal, scope, exact slice or race arm or review lens, how to verify, and what to report. Reports use `PASS`, `ISSUES`, or `BLOCKED` with evidence. A worker that can prove a defect reports `ISSUES` and lists every issue it can prove, not only the first. Review workers also use the finding schema in [perspectives.md](references/perspectives.md) and write only to `_swarm/workers/<slice-or-lens>.md`.

If a worker drops out, proceed with N-1 and note it.

## Phase C: Aggregate

Read the terminal results. Drop a result that does not record the SHAs and method its brief names, and respawn that worker once. After a second miss, record a gap. A gap does not count as a pass. For coverage, every required slice needs a result. For a race, apply the selection rule declared up front. For review, verify lightly, dedupe shared root causes, and rank by severity (`blocking`, `should-fix`, `nit`, `question`). Write `_swarm/aggregate.md` when using the review shape. Do not paste raw worker dumps.

## Phase D: Report

Return one consolidated in-chat report with a result table, issue one-liners, gaps or dropouts, and the race rule when used. For review, include scope, panel, ranked findings with location and evidence, clean coverage, and handoff. When a blocking or should-fix finding is unproven, or the user wants proof, offer [`interrogate`](../interrogate/SKILL.md). If the user wants remedies decided, offer [`workshop-findings`](../workshop-findings/SKILL.md). If they want findings posted, offer [`pr-comments`](../pr-comments/SKILL.md). Structural maintainability alone → [`thermo-nuclear-code-quality-review`](../thermo-nuclear-code-quality-review/SKILL.md). Whole-system tangle hunt → [`thermo-nuclear-refactor`](../thermo-nuclear-refactor/SKILL.md).
