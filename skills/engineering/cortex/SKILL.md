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

Bundled skills live under `skills/<category>/<name>/`. From this file, engineering peers are `../<name>/SKILL.md`, productivity peers are `../../productivity/<name>/SKILL.md`, and writing peers are `../../writing/<name>/SKILL.md`. Some routed skills are explicit-only, so read each one's SKILL.md through its link when a step routes there. Resolve relative links from this skill directory's real path. The personal install symlinks each skill directory one level deep, so a textual `../..` from the link path lands outside the repo.

## Session start

1. Restate the user's goal in your own words. If the task ships a change, name the smallest change you expect to meet it. Don't wait for confirmation. If evidence rules out the asked change, show it and stop.
2. Load the session-gates package. [`principles`](../principles/SKILL.md) holds the principles, combinations, and autonomy rules. Keep [`unslop`](../unslop/SKILL.md), [`no-comments`](../no-comments/SKILL.md), and [`handoff`](../handoff/SKILL.md) ready by trigger. Do not restate them here.
3. Match one playbook below. Open a todolist whose first items are that playbook's steps, copied in verbatim, before any task-specific todos. A step you skip stays in the list with `skip: <reason>`.
4. Read the matched playbook under `playbooks/<title>.md` (kebab-case) and follow it. Read each sibling's `SKILL.md` when its step begins. Use capability terms (spawn subagents, browse the forge, write a PR), never runtime-specific tool names.

When a principle or combination shapes a decision, name it and the choice it changed. Cite only gates you applied this session.

## Non-negotiables

- Restate the user's goal at the top of each subagent brief, as the opening of each PR's `## Why`, and at the top of the final report. A fully specified one-line edit is exempt.
- Any prose surface → [`unslop`](../unslop/SKILL.md). Niche owners stay linked there ([`caveman`](../../misc/caveman/SKILL.md), writing [`ai-tells`](../../writing/writing-blog-post/references/ai-tells.md)).
- Before you ask for review of your own change → [`no-comments`](../no-comments/SKILL.md) on the scoped diff, with [`unslop`](../unslop/SKILL.md) on PR and commit prose (**Opening-a-PR** combination).
- Nontrivial change, architecture question, or "are we sure?" → [`how`](../how/SKILL.md) over the affected code before you decide.
- Code crossing a function boundary, or moving ownership or layering → [`architect`](../architect/SKILL.md). It runs [`arena`](../arena/SKILL.md). Skip it for mechanical work whose shape is already concrete.
- Contested or hard-to-reverse design → [`interrogate`](../interrogate/SKILL.md) before Opening a PR.
- Running a benchmark, or reporting a speedup or regression you measured → [`benchmark-checklist`](../benchmark-checklist/SKILL.md) before you report or act on the number.
- Same-surface verification → the repo's `verify-*` skill (`.agents/skills/` or `.claude/skills/`) when it has one. None, and the surface needs scripted driving → offer [`create-verification-skill`](../create-verification-skill/SKILL.md). A recipe fails against an app that works → [`maintain-verification-skill`](../maintain-verification-skill/SKILL.md).
- The user corrects the same mistake twice → [`correct`](../correct/SKILL.md), so the repo enforces the rule.
- The session taught something durable → offer [`reflect`](../../productivity/reflect/SKILL.md) at the end.
- Broken skill mid-task → fix it in its own change via **Authoring a skill**. Don't block on it. Don't silently work around it.
- Long, autonomous, multi-phase, or "trust it when I'm back" work → decision trail via [`handoff`](../handoff/SKILL.md). Autonomy pause lines still bind.
- Empirical "which approach" fork → settle it by running something (often **Prototype**), not by asking. A read-only **Investigation** answers from evidence instead. Reserve questions for product or preference calls.
- Contested product tree no run can settle → [`grill-me`](../../productivity/grill-me/SKILL.md). Spec or ticket capture → [`write-rfc`](../../productivity/write-rfc/SKILL.md) or [`to-issue`](../../productivity/to-issue/SKILL.md).
- Structural maintainability bar → [`thermo-nuclear-code-quality-review`](../thermo-nuclear-code-quality-review/SKILL.md). Do not invent a parallel rubric.
- Opening a PR does **not** start babysit. Post the URL and keep building unless the user asked to babysit or ship.

## Playbooks

Match the task, then open `playbooks/<title>.md`.

| Mode | When | Routes into |
| --- | --- | --- |
| **Investigation** | Read-only findings, not a fix. How or why X works, "don't change code yet", a decision with trade-offs | [`how`](../how/SKILL.md) → optional [`why`](../why/SKILL.md) |
| **Bug fix** | Reported defect, regression, failing behavior. A slowdown is Perf issue | [`fix-bug`](../fix-bug/SKILL.md) → Opening a PR |
| **Perf issue** | Measured slowness to trace and improve against a baseline | [`benchmark-checklist`](../benchmark-checklist/SKILL.md) → [`fix-bug`](../fix-bug/SKILL.md) for regressions → Opening a PR |
| **Feature** | New or changed behavior to implement and verify | [`how`](../how/SKILL.md) → [`architect`](../architect/SKILL.md) → Opening a PR |
| **Refactor** | Behavior-preserving simplification, proposal-first reshape | [`thermo-nuclear-refactor`](../thermo-nuclear-refactor/SKILL.md) (+ CQ review when asked) |
| **Prototype** | Throwaway sketch to settle a design or empirical fork | [`prototype`](../prototype/SKILL.md) |
| **Map system** | Whole-repo onboarding map written to `_system-map/` | [`create-system-map`](../create-system-map/SKILL.md) |
| **Swarm review** | Parallel multi-perspective review of a change | [`swarm-review`](../swarm-review/SKILL.md) → optional [`interrogate`](../interrogate/SKILL.md) or [`workshop-findings`](../workshop-findings/SKILL.md) → [`pr-comments`](../pr-comments/SKILL.md) |
| **Babysit** | Get a PR or stack merge-ready. Address review, CI, and bot comments | [`babysit`](../babysit/SKILL.md) |
| **Shipping** | Land, merge, or ship verified PRs | [`shipping`](../shipping/SKILL.md) |
| **Authoring a skill** | Write or edit a SKILL.md in this collection | [`write-a-skill`](../../productivity/write-a-skill/SKILL.md) → Opening a PR |
| **Eval** | Blind A/B of a skill or prompt change, or vetting someone else's skill | [`arena`](../arena/SKILL.md) for spawning, then promote via Authoring a skill |
| **Bump deps** | Upgrade packages, runtimes, or base images safely | [`bump-deps`](../bump-deps/SKILL.md) → Opening a PR |
| **Changelog** | User-facing changelog or breaking-change notes | [`changelog`](../changelog/SKILL.md) |
| **Writing** | Thought-to-article blog orchestration | [`compose-blog-post`](../../writing/compose-blog-post/SKILL.md) |
| **Session pickup** | Resume prior in-flight work | [`handoff`](../handoff/SKILL.md) (pickup) → rematch playbook |
| **Pause safely** | Explicit stop, leave a clean resume point | [`handoff`](../handoff/SKILL.md) (pause) |
| **Opening a PR** | End of every playbook that ships a change | gates + forge PR |

Route to [`figure-it-out`](../figure-it-out/SKILL.md) when no row fits. It designs a bespoke playbook for the run. Also route there, even when Feature fits, for large or cross-cutting work (a migration across many call sites, an ambitious multi-part change) and for work the user will review after stepping away.

**Not yet** (omit rather than fake): hillclimb, runtime and trace forensics, visual parity, autopilot, orchestrate. If asked, say so in one line. Offer [`figure-it-out`](../figure-it-out/SKILL.md) for hillclimb, otherwise the closest row.

## Subagents

Spawn subagents in parallel when a playbook or sibling skill asks for coverage, independent verification, or disjoint workstreams. Each brief carries file pointers, not pasted dumps.

- **Delegates.** For a subagent inside a playbook step (a code-writing delegate, an ad-hoc helper), spawn the [`cortex-agent`](../../../agents/cortex-agent.md) agent type when the runtime has it. The repo ships it in `agents/`. It reads this file and [`principles`](../principles/SKILL.md) before any work. Otherwise spawn a general subagent whose brief names this file's absolute path and says to read both in full first. Never spawn a delegate to run a playbook. The playbook stays in this chat.
- **Routed skills keep their own subagents.** When a routed skill prescribes its reviewers or models, follow the skill.
- **You own every subagent's work.** Review the diff and write your own summary. Don't pass its summary through as the verdict.
- **Fresh by default.** Give new work (a fix round, a retry, the next queue item) to a fresh subagent. Its brief carries the original brief, every later directive, and the prior report and branch. Resume an existing agent only when the work needs state that is costly to move, such as its checkout, uncommitted edits, or a live process.

| Role | Model |
| --- | --- |
| Design, review, prose, and the hardest changes (cross-cutting design, concurrency, subtle algorithms) | The strongest judgment model |
| Mechanical edits and evidence gathering | A fast model |
| Verifiers, judges, and second opinions | A different model family than the author when the runtime offers one, otherwise the parent model |

When the runtime offers no model choice or refuses one, use the parent model and say so. Never block on a specific vendor. Agreement across model families is high-signal.

## Writing the reply

Apply [`unslop`](../unslop/SKILL.md) as you draft. Short declarative sentences. Every claim carries its evidence or a label (measured, inferred, guess) in the same sentence. Never hand the user a check you could run. Never fabricate a link, citation, or transcript reference. Terse is not an excuse to drop a section the playbook's reply names. Each playbook names the reply content unique to its mode.
