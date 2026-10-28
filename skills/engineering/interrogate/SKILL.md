---
name: interrogate
description: >-
  Adversarial review where subagents in their own git worktrees try to break a
  change or design, and only findings proven by a rerun command survive.
  Reports the restated intent, each verified finding with its command and
  output, and how many findings each adversary had dropped. Use when the user
  wants a change attacked by running code against it ("interrogate",
  "adversarial review", "try to break it", "stress test this code", "prove
  it"), or before shipping a contested or hard-to-reverse change. Not for a
  read-only review of a PR or diff (use swarm-review).
---

# Interrogate

Adversaries try to break a change or a design. A finding survives only when a rerun proves it. Report the findings. Do not apply fixes.

Open a todolist with Frame, Fan out, Verify, and Report.

## Interrogate or swarm-review

[swarm-review](../swarm-review/SKILL.md) assigns lenses (correctness, security, contracts, tests, maintainability), reads the diff, and ranks findings that cite code, including debt and nits. Interrogate assigns no lenses and accepts no read-only findings. Each adversary attacks the whole intent, and each surviving finding carries a command whose output shows the failure.

Use swarm-review for breadth before asking for review. Use interrogate when the question is whether the change actually breaks, or before shipping something contested or expensive to reverse. Chain them when swarm-review returns blocking or should-fix correctness or security findings without a repro. Pass those findings to the adversaries as leads, not limits. A lead survives only if a run proves it.

## Frame

The scope is what the user names. Otherwise it is the branch diff from its merge base with the base branch, through the working tree.

Restate the intent in your own words. Say what the user is trying to achieve and what problem the change solves, drawing on the user's message, the commits, and the PR description. Keep it to one or two sentences an adversary can test against. Ask the user when the intent is unclear, because a wrong intent produces false findings.

A design or plan with no code behind it gives adversaries little to prove. Settle its open questions with [prototype](../prototype/SKILL.md) first, then interrogate what got built.

## Fan out

Run [arena](../arena/SKILL.md) phase A steps 3 and 4 and phase B, with these changes.

- Adversaries fill the runner seats.
- Copy the scope's uncommitted changes, including untracked files, into each worktree so every adversary attacks the real tree.
- Spawn each adversary as a full subagent that can edit files and run commands in its own worktree, not a read-only one.
- In place of the [arena](../arena/SKILL.md) task and rationale, give each adversary the scope, the intent, and this brief.

> Break this change. Prove each finding with a run against the real code, such as a failing test, a repro script, or command output that shows the wrong behavior. For a design or plan, run a prototype or probe the current tree. Keep repros in your own worktree. Report each finding with a title, the exact command, the output it printed, and the output the intent requires. Leave out anything you did not run. That covers style, naming, structure, and risks that need a future change to matter. No findings is a valid result.

## Verify

Rerun each finding's command yourself in the adversary's worktree, per [arena phase F](../arena/SKILL.md#f-verify). Keep a finding when the output shows the failure and the failure breaks the intent. Drop the rest. Merge findings that share a root cause.

Skip [arena](../arena/SKILL.md) phases C, D, and E. Adversaries find different failures, so the verdict keeps every verified finding, not one adversary's list.

## Report

- **Intent.** The restatement.
- **Findings.** For each verified finding, the command, its output, how it breaks the intent, the adversaries that found it, and the worktree that holds the repro. Say "no verified findings" when none survive.
- **Dropped.** For each adversary, the count of dropped findings and why.

A verified finding is a ready repro for [fix-bug](../fix-bug/SKILL.md). To decide remedies or post them, hand the list to [workshop-findings](../workshop-findings/SKILL.md) or [pr-comments](../pr-comments/SKILL.md).
