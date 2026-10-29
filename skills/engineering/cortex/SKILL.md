---
name: cortex
description: >-
  Engineering meta-router for this collection: restate the goal, match a
  playbook, copy its steps into a todolist, apply session gates, and route into
  sibling Pixxle skills. Use for cortex, /cortex, daily engineering mode,
  eng orchestration, or when the task needs a playbook dispatcher rather than
  freestyle skill picking.
disable-model-invocation: true
---

# Cortex

Own mode selection and session gates. Sibling skills own the work.

Bundled skills live under `skills/<category>/<name>/`. From this file, engineering peers are `../<name>/SKILL.md`, productivity peers are `../../productivity/<name>/SKILL.md`, and writing peers are `../../writing/<name>/SKILL.md`. Every skill in this collection is explicit-only (`disable-model-invocation: true`). It runs only when the user types `/name`, or when a router or another skill opens its `SKILL.md` by link. A model can never invoke it by name.

## Session start

1. Restate the user's goal in your own words, and the problem they are solving. If the task ships a change, name the smallest change you expect to meet it. Don't wait for confirmation. If evidence rules out the asked change, show it and stop.
2. Load the session-gates package by reading [`principles`](../principles/SKILL.md). It indexes the principle leaves and the autonomy rules, which bind every playbook. Keep [`unslop`](../unslop/SKILL.md), [`no-comments`](../no-comments/SKILL.md), and [`handoff`](../handoff/SKILL.md) ready by trigger. Do not restate them here. Every skill a step routes to is explicit-only, so the step loads it by reading the linked `SKILL.md` in full when the step begins. Never freestyle a step whose skill you did not open. A link that does not resolve is a broken skill (see Non-negotiables), not license to improvise.
3. Match one playbook below, then read its file under `playbooks/<title>.md` (kebab-case) in full.
4. Open a todolist whose first items are that playbook's steps, copied in verbatim, before any task-specific todos. A step you skip stays in the list with a one-line `skip: <reason>`. Then follow the playbook. Use capability terms (spawn subagents, browse the forge, write a PR), never runtime-specific tool names.

## Non-negotiables

Principles ground every trigger below. Read a principle's leaf `SKILL.md` in full before you apply it. [`principles`](../principles/SKILL.md) links each leaf and says when it applies. In your reply, name each principle that shaped a decision and the specific choice it changed. Cite only principles whose leaf you read this session, and only gates you applied.

- Restate the user's goal at the top of each subagent brief, as the opening of each PR's `## Why`, and at the top of each final report, your final reply included. A fully specified one-line edit is exempt.
- Nontrivial change, architecture question, or "are we sure?" → read and follow [`how`](../how/SKILL.md) over the affected code before you decide.
- About to ask the user a "which approach", "how should I", or "what should this do" question → classify the fork first. If the answer is a fact you could observe by running something, it is not the user's to answer. Sketch it via **Prototype** and let the result decide. A read-only **Investigation** stays read-only and answers from the evidence. Reserve the question for a genuine product or preference call no experiment can settle, per [`principle-never-block-on-the-human`](../principle-never-block-on-the-human/SKILL.md).
- Under a full-autonomy grant, decide a call the grant covers, act on it, and report it, with no reply word and no offer. For a call only the operator can make, apply a default, report it with a full explanation, and say in plain words what the operator could tell you to do instead. Never give a shorthand token to type back. Gates the operator named and the Always-pause list in [`principles`](../principles/SKILL.md#autonomy) still need the operator.
- Any code → name the data shape first, and choose its organizing structure per [`principle-model-the-domain`](../principle-model-the-domain/SKILL.md).
- Code crossing a function boundary, or moving ownership or layering → read and follow [`architect`](../architect/SKILL.md) for parallel design exploration before you implement. It runs [`arena`](../arena/SKILL.md). Skip it for mechanical work whose shape is already concrete.
- Parallel fan-out for coverage matrices, races, gauntlets, or exploration partitions → read and follow [`swarm`](../swarm/SKILL.md). Give concurrent writers separate targets first, per [`principle-separate-before-serializing-shared-state`](../principle-separate-before-serializing-shared-state/SKILL.md). A design or code bakeoff with base selection and grafting → [`arena`](../arena/SKILL.md). Read [Subagents](references/subagents.md) before you spawn.
- Contested or hard-to-reverse design → [`interrogate`](../interrogate/SKILL.md) before Opening a PR.
- Structural quality in scope for a change under review or refactor → spawn [`thermo-nuclear-code-quality-review`](../thermo-nuclear-code-quality-review/SKILL.md) in parallel with other review or swarm lanes. Whole-system structural discovery → [`thermo-nuclear-refactor`](../thermo-nuclear-refactor/SKILL.md). Do not invent a parallel rubric.
- Nontrivial multi-step → write the throughput checkpoint ([Feature](playbooks/feature.md) step 4).
- Any prose surface, your reply to the user included → [`unslop`](../unslop/SKILL.md). Write the reply per **Writing the reply**. Docs, readmes, PR descriptions, and commit messages also follow the plain technical English rules in [Opening a PR](playbooks/opening-a-pr.md). Agent-facing prose also follows [`write-a-skill`](../../productivity/write-a-skill/SKILL.md).
- Before each commit → slop-strip the diff per [Opening a PR](playbooks/opening-a-pr.md).
- Before you ask for review of your own change → [`no-comments`](../no-comments/SKILL.md) on the scoped diff, with [`unslop`](../unslop/SKILL.md) on PR and commit prose.
- **Same-surface verification.** Shipping a UI, IDE, or CLI change → drive it through the repo's `verify-*` skill when it has one. None, and the surface needs scripted driving → offer [`create-verification-skill`](../create-verification-skill/SKILL.md). A recipe fails against an app that works → [`maintain-verification-skill`](../maintain-verification-skill/SKILL.md). For a bug fix, reproduce first on the same surface yourself. Hand it to the user only under the narrow exception in [Bug fix](playbooks/bug-fix.md).
- Running a benchmark, measuring perf yourself, or reporting a speedup or regression you measured → [`benchmark-checklist`](../benchmark-checklist/SKILL.md) before you report or act on the number. Read [`principle-explain-the-number`](../principle-explain-the-number/SKILL.md) before you measure.
- Any PR-status request → the [Babysit](playbooks/babysit.md) playbook. Declare its mode before polling. Opening a PR does **not** start babysit. Post the URL and keep building unless the user asked to babysit or ship.
- Asked to land or ship a green stack → the [Shipping](playbooks/shipping.md) playbook. Green is not safe. Nothing gets armed before an independent per-PR verdict, and only the contiguous verified run from the root lands.
- Bugbot or a security review bot commented → skeptical posture. Triage each one as fix, dismiss, or ask per [BUGBOT-TRIAGE.md](../babysit/BUGBOT-TRIAGE.md).
- The user corrects the same mistake twice → [`correct`](../correct/SKILL.md).
- The session taught something durable → offer [`reflect`](../../productivity/reflect/SKILL.md) at the end.
- Broken skill mid-task → fix it in its own change via **Authoring a skill**. Don't block on it. Don't silently work around it.
- Long, autonomous, or multi-phase work, or any task the user steps away from to review later → a decision trail in the decision-trail mode of [`handoff`](../handoff/SKILL.md). Autonomy pause lines still bind.
- Contested product tree no run can settle → [`grill-me`](../../productivity/grill-me/SKILL.md). Spec or ticket capture → [`write-rfc`](../../productivity/write-rfc/SKILL.md) or [`to-issue`](../../productivity/to-issue/SKILL.md).

## Playbooks

Match the task to one row, then read its playbook in full. Each name links its file.

| Playbook | When |
| --- | --- |
| [**Investigation**](playbooks/investigation.md) | Read-only findings, not a fix |
| [**Bug fix**](playbooks/bug-fix.md) | Defect to reproduce, root-cause, and fix with runtime evidence |
| [**Perf issue**](playbooks/perf-issue.md) | Measured slowness to fix once against a baseline |
| [**Hillclimb**](playbooks/hillclimb.md) | Sustained climb of one metric against a target |
| [**Runtime forensics**](playbooks/runtime-forensics.md) | Live runtime symptom. Diagnosis, not a fix |
| [**Trace forensics**](playbooks/trace-forensics.md) | Captured profile or dump. Diagnosis, not a fix |
| [**Feature**](playbooks/feature.md) | New or changed behavior from a named data shape |
| [**Refactor**](playbooks/refactor.md) | Behavior-preserving structure change. Whole-system → thermo-nuclear-refactor. Maintainability-only → thermo-nuclear-code-quality-review |
| [**Prototype**](playbooks/prototype.md) | Throwaway sketch to settle a design or empirical fork |
| [**Visual parity**](playbooks/visual-parity.md) | Pixel-exact UI equivalence or styling migration by image diff |
| [**Map system**](playbooks/map-system.md) | Whole-repo onboarding map in `_system-map/` |
| [**Swarm**](playbooks/swarm.md) | Parallel coverage, races, gauntlets, or multi-lens review |
| [**Authoring a skill**](playbooks/authoring-a-skill.md) | Write or modify a SKILL.md, playbook, or agent |
| [**Eval**](playbooks/eval.md) | Blind A/B or vet a skill or prompt change before promoting |
| [**Bump deps**](playbooks/bump-deps.md) | Upgrade packages, runtimes, or base images safely |
| [**Changelog**](playbooks/changelog.md) | User-facing changelog or breaking-change notes |
| [**Writing**](playbooks/writing.md) | Thought-to-article blog orchestration |
| [**Babysit**](playbooks/babysit.md) | Any PR-status request. Not triggered by opening a PR |
| [**Shipping**](playbooks/shipping.md) | Land a green stack after independent per-PR verify |
| [**Multi-phase plan**](playbooks/multi-phase-plan.md) | Written plan for phases or stacked PRs. No code |
| [**Autonomous run**](playbooks/autonomous-run.md) | One long task driven to a checkable predicate |
| [**Orchestrate**](playbooks/orchestrate.md) | Standing multi-day program under one coordinator |
| [**Autopilot full**](playbooks/autopilot-full.md) | Queue of PRs to merged. Live `verify-*` + swarm audit (+ interrogate when contested) |
| [**Autopilot stack**](playbooks/autopilot-stack.md) | Autopilot full without the merge |
| [**Session pickup**](playbooks/session-pickup.md) | Resume prior in-flight work |
| [**Pause safely**](playbooks/pause-safely.md) | Explicit pause, offline, restart, or context compaction |
| [**Worktree cleanup**](playbooks/worktree-cleanup.md) | Prune merged or abandoned worktrees and stale simulators |
| [**Opening a PR**](playbooks/opening-a-pr.md) | End of every playbook that ships a change |

### When rows overlap

Take the first rule that fits. A climb of one metric toward a target is **Hillclimb**, never a rule below, even when the user says "keep going until X".

1. The user wants a written plan before anyone builds work that spans phases or stacked PRs → **Multi-phase plan**.
2. A known queue of PRs to build and verify under full autonomy → **Autopilot full** when the run may merge. **Autopilot stack** when the user lands the PRs.
3. A standing multi-day project to break into units yourself → **Orchestrate**. Work one agent could finish inside the session's budget goes to **Autonomous run** (rule 4).
4. One task driven to a checkable predicate without stopping → **Autonomous run**.
5. A large or cross-cutting run that needs a bespoke workflow, or work the user steps away from to trust later → [`figure-it-out`](../figure-it-out/SKILL.md).

Read and follow [`figure-it-out`](../figure-it-out/SKILL.md) when no row fits.

## Writing the reply

Write the reply clean as you draft it, applying [`unslop`](../unslop/SKILL.md) as you go. A cleanup pass after drafting does not remove these patterns.

- **Short declarative sentences.** One thought per sentence, ended with a period.
- **No long-dash character anywhere.** Write a file-list bullet as a sentence and a bold section header as its own sentence. This is unslop rule 13.
- **A colon as a mid-sentence connector is also out** (unslop rule 14). A colon before a list is fine.
- **Terse is not an excuse to drop content.** Short sentences, but every section the playbook's reply names stays.
- **Frame impact for the consumer and the maintainer.** Name who the work is for and what changes for them before any implementation detail.
- **Never fabricate a link, citation, or transcript reference.** Link only artifacts you produced or read this session.
- **Every claim carries its evidence or its label in the same sentence.** Measured, inferred, or guess. Never hand the user a check you could run.

Every playbook ends with a reply written this way. Give each PR as its full forge URL. Each playbook's own reply lines name only the content unique to that playbook.

## Comments

Comments follow the same rule as the reply. Write them clean as you go. Keep a comment only for a non-obvious why the code cannot show. A verify or test script gets no phase-narrating comments. The assertion or log string documents the step. Before review, [`no-comments`](../no-comments/SKILL.md) still runs on the scoped diff.
