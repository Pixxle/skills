---
name: figure-it-out
description: Design and run a bespoke, auditable playbook. Frames a falsifiable definition of done, scales rigor to the stakes, runs each unit as a keep-or-revert experiment, and keeps a decision trail a human can audit later. Use when no cortex playbook fits, when the work is a large migration across many call sites or an ambitious cross-cutting change, when the user will review the result after stepping away, or when the user says "figure it out".
disable-model-invocation: true
---

# Figure it out

When no [`cortex`](../cortex/SKILL.md) playbook fits, design one. Large or cross-cutting work, and work the user reviews after stepping away, also route here even when Feature fits. The first deliverable is the workflow itself. It is a phase list that scales rigor to the task, runs each unit as an experiment, and leaves a trail a human can audit.

Each principle named below links its file. The index is [`principles`](../principles/SKILL.md).

## Start

Open a todolist. The first item is to read [`principles`](../principles/SKILL.md) in full. Then add the five phases below as todos.

## Frame

Ground first, then commit. Do not start the run until you can state these.

- Done, as a falsifiable predicate, per [Prove It Works](../principles/prove-it-works.md).
- Scope, quantified. Rough units and effort, plus the blockers grounding surfaced.
- The rigor level, biased high. One-way doors and high blast radius get more. Reversible low-stakes steps get less. Rigor is gates and artifacts, not trying harder.

Present the framing and tradeoffs before a long run. Reversible work proceeds, per [Never Block on the Human](../principles/never-block-on-the-human.md), but a multi-hour run earns one checkpoint. Under a full-autonomy grant, report the framing and proceed.

## Design the workflow

Decompose into atomic, independently landable units. Sequence the riskiest unknown first. Scaffold and verification come before features, per [Foundational Thinking](../principles/foundational-thinking.md).

- Build the verification harness before the work. Capture the baseline from the pre-change state, so each check reads old value against new value.
- For one-way-door design decisions, read and follow [`architect`](../architect/SKILL.md). It reads and follows [`arena`](../arena/SKILL.md). Skip it for mechanical work whose shape is already concrete. A second design exploration over a settled design is over-engineering, per [Laziness Protocol](../principles/laziness-protocol.md).
- Fan out only across seams. Give each worker its own worktree or branch, per [Separate Before Serializing Shared State](../principles/separate-before-serializing-shared-state.md). Do not over-fan.
- Put cross-cutting design and subtle changes on the strongest judgment model. Put mechanical edits on a fast model.
- Write the phase list down. That list is what the human reviews.

Then execute the design. Add its steps to the todolist as concrete items between the "Run the loop" and "Keep the trail" entries. Run each under the loop discipline. Append a trail row as each step lands, not all at the end.

## Run the loop

Each unit is an experiment. State the hypothesis, make the smallest change, and measure against the predicate on the real artifact. Keep the change if it advanced. Revert it if it did not. Verify each unit before starting the next, per [Sequence Work into Verifiable Units](../principles/sequence-verifiable-units.md).

- Verify by inspecting the artifact, never a self-report. When something passes too easily, suspect the observation method before the system.
- Before you trust a measured number, read and follow [Explain the Number](../principles/explain-the-number.md). For performance, read and follow [`benchmark-checklist`](../benchmark-checklist/SKILL.md).
- Pair delegated work with a judge. Use a different model family than the author when the runtime offers one, otherwise the parent model.
- If a worker games the gate, reset and harden the contract. If the gate itself is wrong, fix the gate in its own change rather than routing around it.
- A verdict is VERIFIED, NOT VERIFIED, or INCONCLUSIVE. Inconclusive is not a pass. Do not hide a negative.

## Keep the trail

Log the run: read and follow [`handoff`](../handoff/SKILL.md) in decision-trail mode. This work is usually ambitious enough to commit the trail, so the reviewer can read it in the PR. The trail plus the diff is what lets the human come back and trust the work.

## Verify and hand back

Check the whole against the Frame predicate on the real product, not just the harness. Encode any recurring correction as a gate, lint rule, check, or script, per [Encode Lessons in Structure](../principles/encode-lessons-in-structure.md). If the run ships a change, finish by reading and following cortex's [Opening a PR](../cortex/playbooks/opening-a-pr.md) playbook.

**Reply:** the playbook you designed, the rigor level and why, the decision-trail path, what is verified against the predicate, and what is still open.
