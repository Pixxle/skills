---
name: cortex
description: >-
  Engineering meta-router for this collection: restate the goal, match a
  playbook, copy its steps into a todolist, apply session gates, and route into
  sibling Pixxle skills. Use for cortex, /cortex, daily engineering mode,
  eng orchestration, or when the task needs a playbook dispatcher rather than
  freestyle skill picking.
---

# Cortex

Own mode selection and session gates. Sibling skills own the work.

Bundled skills live under `skills/<category>/<name>/`. From this file, engineering peers are `../<name>/SKILL.md`; productivity peers are `../../productivity/<name>/SKILL.md`; writing peers are `../../writing/<name>/SKILL.md`. Put this file's absolute path in every subagent brief that must load a sibling.

## Session start

1. Restate the user's goal in your own words. If the task ships a change, name the smallest change you expect to meet it. Don't wait for confirmation. If evidence rules out the asked change, show it and stop.
2. Load the session-gates package: [`principles`](../principles/SKILL.md) (principles, combinations, autonomy). Keep [`unslop`](../unslop/SKILL.md), [`no-comments`](../no-comments/SKILL.md), and [`handoff`](../handoff/SKILL.md) ready by trigger — do not restate them here.
3. Match one playbook below. Open a todolist whose first items are that playbook's steps, copied in verbatim, before any task-specific todos. A step you skip stays in the list with `skip: <reason>`.
4. Read the matched playbook under `playbooks/<title>.md` (kebab-case). Follow it. Route into siblings by reading their `SKILL.md` when that step begins — capability terms only (spawn subagents, browse the forge, write a PR), never runtime-specific tool names.

When a principle or combination shapes a decision, name it and the choice it changed. Cite only gates you applied this session.

## Non-negotiables

- Any prose surface → [`unslop`](../unslop/SKILL.md). Niche owners stay linked there (`caveman`, writing `ai-tells`).
- Before review / before asking for a PR review → [`no-comments`](../no-comments/SKILL.md) on the scoped diff, with `unslop` on PR/commit prose (**Opening-a-PR** combination).
- Long, autonomous, multi-phase, or "trust it when I'm back" work → decision trail via [`handoff`](../handoff/SKILL.md). Autonomy pause lines still bind.
- Empirical "which approach" forks → settle by running something (often **Prototype**), not by asking. Reserve questions for product or preference calls.
- Contested product/design tree → [`grill-me`](../../productivity/grill-me/SKILL.md). Spec/ticket capture → [`write-rfc`](../../productivity/write-rfc/SKILL.md) / [`to-issue`](../../productivity/to-issue/SKILL.md).
- Structural maintainability bar → [`thermo-nuclear-code-quality-review`](../thermo-nuclear-code-quality-review/SKILL.md). Do not invent a parallel rubric.
- Opening a PR does **not** start babysit. Post the URL and keep building unless the user asked to babysit or ship.
- You own every subagent's work. Review the diff; don't pass through its summary as the verdict.
- Fresh subagents by default for new work. Resume only when state in that agent is costly to move (checkout, uncommitted edits, a live watcher).

## Playbooks

Match the task, then open `playbooks/<title>.md`.

| Mode | When | Routes into |
| --- | --- | --- |
| **Bug fix** | Reported defect, regression, failing behavior | [`fix-bug`](../fix-bug/SKILL.md) → Opening a PR |
| **Babysit** | Get a PR/stack merge-ready; address review/CI/Bugbot | [`babysit`](../babysit/SKILL.md) |
| **Shipping** | Land / merge / ship verified PRs | [`shipping`](../shipping/SKILL.md) |
| **Swarm review** | Parallel multi-perspective review of a change | [`swarm-review`](../swarm-review/SKILL.md) → optional [`workshop-findings`](../workshop-findings/SKILL.md) → [`pr-comments`](../pr-comments/SKILL.md) |
| **Map system** | Unfamiliar repo, how it works, onboarding map | [`create-system-map`](../create-system-map/SKILL.md) |
| **Refactor** | Behavior-preserving simplification, proposal-first reshape | [`thermo-nuclear-refactor`](../thermo-nuclear-refactor/SKILL.md) (+ CQ review when asked) |
| **Prototype** | Throwaway sketch to settle a design or empirical fork | [`prototype`](../prototype/SKILL.md) |
| **Feature** | New or changed behavior to implement and verify | thin spine → Opening a PR |
| **Authoring a skill** | Write or edit a SKILL.md in this collection | [`write-a-skill`](../../productivity/write-a-skill/SKILL.md) → Opening a PR |
| **Bump deps** | Upgrade packages / runtimes / base images safely | [`bump-deps`](../bump-deps/SKILL.md) → Opening a PR |
| **Changelog** | User-facing changelog / breaking-change notes | [`changelog`](../changelog/SKILL.md) |
| **Writing** | Thought-to-article blog orchestration | [`compose-blog-post`](../../writing/compose-blog-post/SKILL.md) |
| **Session pickup** | Resume prior in-flight work | [`handoff`](../handoff/SKILL.md) (pickup) → rematch playbook |
| **Pause safely** | Explicit stop; leave a clean resume point | [`handoff`](../handoff/SKILL.md) (pause) |
| **Opening a PR** | End of every playbook that ships a change | gates + forge PR |

**Not yet** (omit rather than fake): perf issue, hillclimb, runtime/trace forensics, visual parity, eval harness, autopilot, orchestrate. If asked, say so in one line and offer the closest available mode (often Bug fix, Feature, Swarm review, or Refactor).

Do **not** route to `deep-review` — removed from this collection.

When nothing fits cleanly, pick the closest row, say why, and proceed. Prefer Map system or Prototype over freestyle for "how does this work" / "should we do X" forks.

## Subagents

Spawn subagents in parallel when a playbook or sibling skill asks for coverage, independent verify, or disjoint workstreams. Prefer file pointers and the original goal in each brief over pasted dumps. Match model strength to the job when the runtime allows choosing; verification stays on a different agent than the author when Shipping or independent challenge requires it.

## Writing the reply

Apply [`unslop`](../unslop/SKILL.md). Short declarative sentences. Every claim carries evidence or a label (measured, inferred, guess) in the same sentence. Open the final report with the restated goal. Each playbook names any reply content unique to that mode.
