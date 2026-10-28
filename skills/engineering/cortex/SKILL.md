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

Bundled skills live under `skills/<category>/<name>/`. From this file, engineering peers are `../<name>/SKILL.md`, productivity peers are `../../productivity/<name>/SKILL.md`, and writing peers are `../../writing/<name>/SKILL.md`. Every skill in this collection is explicit-only (`disable-model-invocation: true`). It runs only when the user types `/name`, or when a router or another skill opens its `SKILL.md` by link. A model can never invoke it by name. Resolve relative links from this skill directory's real path. The personal install symlinks each skill directory one level deep, so a textual `../..` from the link path lands outside the repo.

## Session start

1. Restate the user's goal in your own words, and the problem they are solving. If the task ships a change, name the smallest change you expect to meet it. Don't wait for confirmation. If evidence rules out the asked change, show it and stop.
2. Load the session-gates package by reading [`principles`](../principles/SKILL.md). It indexes the principle leaves, the combinations, and the autonomy rules (just do it, always pause, full-autonomy grants, no is an acceptable answer), which bind every playbook. Keep [`unslop`](../unslop/SKILL.md), [`no-comments`](../no-comments/SKILL.md), and [`handoff`](../handoff/SKILL.md) ready by trigger. Do not restate them here. Every skill a step routes to is explicit-only, so the step loads it by reading the linked `SKILL.md` in full when the step begins. Never freestyle a step whose skill you did not open. A link that does not resolve is a broken skill (see Non-negotiables), not license to improvise.
3. Match one playbook below, then read its file under `playbooks/<title>.md` (kebab-case) in full.
4. Open a todolist whose first items are that playbook's steps, copied in verbatim, before any task-specific todos. A step you skip stays in the list with a one-line `skip: <reason>`. Then follow the playbook. Use capability terms (spawn subagents, browse the forge, write a PR), never runtime-specific tool names.

## Non-negotiables

Principles ground every trigger below. Read a principle's leaf `SKILL.md` in full before you apply it. [`principles`](../principles/SKILL.md) links each leaf and says when it applies. In your reply, name each principle or combination that shaped a decision and the specific choice it changed. Cite only principles whose leaf you read this session, and only gates you applied.

- Restate the user's goal at the top of each subagent brief, as the opening of each PR's `## Why`, and at the top of each final report, your final reply included. A fully specified one-line edit is exempt.
- Nontrivial change, architecture question, or "are we sure?" → read and follow [`how`](../how/SKILL.md) over the affected code before you decide.
- About to ask the user a "which approach", "how should I", or "what should this do" question → classify the fork first. If the answer is a fact you could observe by running something (behavior, timing, layout, output, perf, even whether an eval separates), it is not the user's to answer. Sketch it via **Prototype** and let the result decide. A read-only **Investigation** whose deliverable is a cited answer stays read-only and answers from the evidence instead. Reserve the question for a genuine product or preference call no experiment can settle, per [`principle-never-block-on-the-human`](../principle-never-block-on-the-human/SKILL.md).
- Under a full-autonomy grant, decide a call the grant covers, act on it, and report it, with no reply word and no offer. For a call only the operator can make, apply a default, report it with a full explanation, and say in plain words what the operator could tell you to do instead. The operator answers in their own words. Never give a shorthand token to type back. Gates the operator named and the Always-pause list in [`principles`](../principles/SKILL.md#autonomy) still need the operator.
- Any code → name the data shape first, and choose its organizing structure per [`principle-model-the-domain`](../principle-model-the-domain/SKILL.md).
- Code crossing a function boundary, or moving ownership or layering → read and follow [`architect`](../architect/SKILL.md) for parallel design exploration before you implement. It runs [`arena`](../arena/SKILL.md). Skip it for mechanical work whose shape is already concrete.
- Parallel fan-out for coverage matrices, races, gauntlets, or exploration partitions → spawn subagents in parallel per **Subagents**. Give concurrent writers separate targets first, per [`principle-separate-before-serializing-shared-state`](../principle-separate-before-serializing-shared-state/SKILL.md). A design or code bakeoff with base selection and grafting → [`arena`](../arena/SKILL.md).
- Contested or hard-to-reverse design → [`interrogate`](../interrogate/SKILL.md) before Opening a PR.
- Nontrivial multi-step → write the throughput checkpoint ([Feature](playbooks/feature.md) step 4).
- Any prose surface, your reply to the user included → [`unslop`](../unslop/SKILL.md). Write the reply per **Writing the reply**. Docs, readmes, PR descriptions, and commit messages also follow the plain technical English rules in step 4 of [Opening a PR](playbooks/opening-a-pr.md). Agent-facing prose (a SKILL.md, a playbook, an agent file) also follows [`write-a-skill`](../../productivity/write-a-skill/SKILL.md). Niche owners stay linked from unslop ([`caveman`](../../misc/caveman/SKILL.md), writing [`ai-tells`](../../writing/writing-blog-post/references/ai-tells.md)).
- Before each commit → slop-strip the diff per step 4 of [Opening a PR](playbooks/opening-a-pr.md).
- Before you ask for review of your own change → [`no-comments`](../no-comments/SKILL.md) on the scoped diff, with [`unslop`](../unslop/SKILL.md) on PR and commit prose (**Opening-a-PR** combination).
- **Same-surface verification.** Shipping a UI, IDE, or CLI change → drive it through the repo's `verify-*` skill (`.agents/skills/` or `.claude/skills/`) when it has one. None, and the surface needs scripted driving → offer [`create-verification-skill`](../create-verification-skill/SKILL.md). A recipe fails against an app that works → [`maintain-verification-skill`](../maintain-verification-skill/SKILL.md). For a bug fix, reproduce first on the same surface yourself. Hand it to the user only under the narrow exception in step 2 of [Bug fix](playbooks/bug-fix.md).
- Running a benchmark, measuring perf yourself, or reporting a speedup or regression you measured → [`benchmark-checklist`](../benchmark-checklist/SKILL.md) before you report or act on the number. Read [`principle-explain-the-number`](../principle-explain-the-number/SKILL.md) before you measure.
- Any PR-status request ("babysit this", "get it green", "address the bot comments", and most often "check on PR X" or "anything outstanding on X") → the [Babysit](playbooks/babysit.md) playbook. Declare its mode before polling. Step 2 of that playbook owns the request-to-mode mapping. A phase agent never reaches for `drive`, because the loop stops that agent finishing its turn.
- Opening a PR does **not** start babysit. Post the URL and keep building unless the user asked to babysit or ship.
- Asked to land or ship a green stack → the [Shipping](playbooks/shipping.md) playbook. Green is not safe. Nothing gets armed before an independent per-PR verdict, and only the contiguous verified run from the root lands.
- Bugbot or a security review bot commented → skeptical posture. These bots catch real bugs and also file non-issues and nitpicks. Assess each finding on its merits and dismiss noise with a concrete reason instead of churning code. Triage each one as fix, dismiss, or ask per [BUGBOT-TRIAGE.md](../babysit/BUGBOT-TRIAGE.md).
- The user corrects the same mistake twice → [`correct`](../correct/SKILL.md), so the repo enforces the rule.
- The session taught something durable → offer [`reflect`](../../productivity/reflect/SKILL.md) at the end.
- Broken skill mid-task → fix it in its own change via **Authoring a skill**. Don't block on it. Don't silently work around it.
- Long, autonomous, or multi-phase work, or any task the user steps away from to review later ("going to bed", "trust it when I'm back", "loop until X") → a decision trail in the decision-trail mode of [`handoff`](../handoff/SKILL.md). Commit it when stakes need an auditable record. Keep it local otherwise. Autonomy pause lines still bind.
- Contested product tree no run can settle → [`grill-me`](../../productivity/grill-me/SKILL.md). Spec or ticket capture → [`write-rfc`](../../productivity/write-rfc/SKILL.md) or [`to-issue`](../../productivity/to-issue/SKILL.md).
- Structural maintainability bar → [`thermo-nuclear-code-quality-review`](../thermo-nuclear-code-quality-review/SKILL.md). Do not invent a parallel rubric.

## Playbooks

Match the task to one row, then read its playbook in full. Each name links its file.

| Playbook | When | Routes into |
| --- | --- | --- |
| [**Investigation**](playbooks/investigation.md) | Read-only findings, not a fix. How or why X works, "are we sure about Z", "should we do X or Y", "don't change code yet" | [`how`](../how/SKILL.md) → optional [`why`](../why/SKILL.md) |
| [**Bug fix**](playbooks/bug-fix.md) | Reported defect, regression, or failing behavior to reproduce, root-cause, and fix with runtime evidence. A slowdown is Perf issue | [`fix-bug`](../fix-bug/SKILL.md) → Opening a PR |
| [**Perf issue**](playbooks/perf-issue.md) | Measured slowness to trace and fix once against a baseline | [`benchmark-checklist`](../benchmark-checklist/SKILL.md) → [`fix-bug`](../fix-bug/SKILL.md) for regressions → Opening a PR |
| [**Hillclimb**](playbooks/hillclimb.md) | Sustained, measured improvement of one metric against a target. Loop hypotheses with before and after measurement, a decision log, and one commit per accepted win. A one-off fix is Perf issue | [`how`](../how/SKILL.md) → [`benchmark-checklist`](../benchmark-checklist/SKILL.md) and [`principle-explain-the-number`](../principle-explain-the-number/SKILL.md) → [`handoff`](../handoff/SKILL.md) (decision trail) → Opening a PR |
| [**Runtime forensics**](playbooks/runtime-forensics.md) | Live runtime symptom (leak, idle-CPU spin, visual glitch) to diagnose by instrumenting the running process. The deliverable is a cited diagnosis, not a fix | Repo `verify-*` skill to capture → [`principle-guard-the-context-window`](../principle-guard-the-context-window/SKILL.md) for large artifacts → Bug fix or Perf issue once the cause is known |
| [**Trace forensics**](playbooks/trace-forensics.md) | Captured profiling artifact (cpuprofile, trace, spindump, heap snapshot) handed over after the fact. The deliverable is a cited diagnosis, not a fix. A live process to instrument is Runtime forensics | [`principle-guard-the-context-window`](../principle-guard-the-context-window/SKILL.md) to parse in a subagent → Bug fix or Perf issue once the cause is known |
| [**Feature**](playbooks/feature.md) | New or changed behavior, built from a named data shape, to implement and verify | [`how`](../how/SKILL.md) → data shape per [`principle-model-the-domain`](../principle-model-the-domain/SKILL.md) → [`architect`](../architect/SKILL.md) → Opening a PR |
| [**Refactor**](playbooks/refactor.md) | Behavior-preserving change to structure or shape (rename, extract, inline, dedupe, move) | [`how`](../how/SKILL.md) to pin the contract → [`architect`](../architect/SKILL.md) when the target crosses a function boundary → equivalence proof → Opening a PR. Full-scale refactoring of the whole system only → [`thermo-nuclear-refactor`](../thermo-nuclear-refactor/SKILL.md). Maintainability-only review the user asked for → [`thermo-nuclear-code-quality-review`](../thermo-nuclear-code-quality-review/SKILL.md) |
| [**Prototype**](playbooks/prototype.md) | Throwaway sketch to settle a design or empirical fork by observing it instead of asking ("prototype", "mock it up", "try this layout", "sketch it to decide") | [`prototype`](../prototype/SKILL.md) |
| [**Visual parity**](playbooks/visual-parity.md) | Pixel-exact UI equivalence between two implementations, or a styling-system migration proven by image diff | Baseline harness → repo `verify-*` skill or [`create-verification-skill`](../create-verification-skill/SKILL.md) → Autonomous run per component → Opening a PR |
| [**Map system**](playbooks/map-system.md) | Whole-repo onboarding map written to `_system-map/` | [`create-system-map`](../create-system-map/SKILL.md) |
| [**Swarm review**](playbooks/swarm-review.md) | Parallel multi-perspective review of a change | [`swarm-review`](../swarm-review/SKILL.md) → optional [`interrogate`](../interrogate/SKILL.md) or [`workshop-findings`](../workshop-findings/SKILL.md) → [`pr-comments`](../pr-comments/SKILL.md) |
| [**Authoring a skill**](playbooks/authoring-a-skill.md) | Write or modify a SKILL.md, playbook, or agent in this collection | [`write-a-skill`](../../productivity/write-a-skill/SKILL.md) → Opening a PR |
| [**Eval**](playbooks/eval.md) | Test how a skill, structure, or prompt change affects agent behavior before promoting it. Blind A/B, or vetting someone else's skill | [`arena`](../arena/SKILL.md) for spawning, then promote via Authoring a skill |
| [**Bump deps**](playbooks/bump-deps.md) | Upgrade packages, runtimes, or base images safely | [`bump-deps`](../bump-deps/SKILL.md) → Opening a PR |
| [**Changelog**](playbooks/changelog.md) | User-facing changelog or breaking-change notes | [`changelog`](../changelog/SKILL.md) |
| [**Writing**](playbooks/writing.md) | Thought-to-article blog orchestration | [`compose-blog-post`](../../writing/compose-blog-post/SKILL.md) |
| [**Babysit**](playbooks/babysit.md) | Any PR-status request. Babysit, get it green, merge-ready, address review or Bugbot comments, "check on PR X". Never triggered by opening a PR | [`babysit`](../babysit/SKILL.md) (its GitHub loop runs on `watch-pr`) |
| [**Shipping**](playbooks/shipping.md) | Land, merge, or ship a green stack. Green is not safe. Verify each PR independently first | [`shipping`](../shipping/SKILL.md) (on GitHub, the queued `watch-pr` until `COMPLETE`) |
| [**Multi-phase plan**](playbooks/multi-phase-plan.md) | Work that spans phases or stacked PRs and needs a written plan before anyone builds. Writes the plan, never the code | Prototype for open questions → [`unslop`](../unslop/SKILL.md) → [`check-plan.mjs`](scripts/check-plan.mjs) → hand back. The plan names Autopilot full, Autopilot stack, or Orchestrate to run it on the operator's go |
| [**Autonomous run**](playbooks/autonomous-run.md) | One long task to drive to a checkable predicate without stopping ("run until done", "keep going until X", a recurring loop until X). Distinct from Orchestrate, which runs a multi-day program. A climb of one metric toward a target is Hillclimb | [`handoff`](../handoff/SKILL.md) (decision trail) → the playbook each iteration needs → Opening a PR |
| [**Orchestrate**](playbooks/orchestrate.md) | A standing multi-day project handed to one coordinator chat: many stacked PRs, a fleet of subagents, few human turns ("run this whole project", "own this migration until it lands"). One task driven to a predicate is Autonomous run. So is work one agent could finish inside the session's budget, however program-shaped the phrasing sounds | Per PR, an owner reads and follows [`babysit`](../babysit/SKILL.md) → a non-author verifier → [`shipping`](../shipping/SKILL.md) when the request covers landing. [`handoff`](../handoff/SKILL.md) decision trail |
| [**Autopilot full**](playbooks/autopilot-full.md) | A queue of independent PRs run to merged under full autonomy. One owner per PR carries build through merge, and parallel verifiers clear each code-ready head before its owner merges ("autopilot this queue", "full autopilot") | One owner per PR → Opening a PR → [`babysit`](../babysit/SKILL.md) → parallel verify via [`swarm-review`](../swarm-review/SKILL.md), plus [`interrogate`](../interrogate/SKILL.md) when contested → [`shipping`](../shipping/SKILL.md) |
| [**Autopilot stack**](playbooks/autopilot-stack.md) | Autopilot full without the merge. Build and verify a queue under full autonomy, then hand it to the user to land. A PR stacks only on a PR it builds on ("autopilot, don't merge", "stack them, don't ship", "build the stack, I'll land it") | Autopilot full with step 5 replaced by a stop at verified and a handoff. Steps 6 and 7 still run. A later land runs through [`shipping`](../shipping/SKILL.md) |
| [**Session pickup**](playbooks/session-pickup.md) | Resume or take over a prior agent's in-flight work from a transcript, resume note, decision trail, or pushed branch | [`handoff`](../handoff/SKILL.md) (pickup) → verdict → rematch playbook |
| [**Pause safely**](playbooks/pause-safely.md) | Explicit pause, going offline, a runtime restart, or imminent context compaction. The complement to Session pickup | [`handoff`](../handoff/SKILL.md) (pause) |
| [**Worktree cleanup**](playbooks/worktree-cleanup.md) | Reclaim local disk by pruning merged or abandoned git worktrees and stale iOS simulators ("what's using my disk", "clean up worktrees", "prune safe-to-prune worktrees", "free up space", "delete old simulators") | [`scripts/worktree-audit.sh`](scripts/worktree-audit.sh) → user go-ahead → prune |
| [**Opening a PR**](playbooks/opening-a-pr.md) | End of every playbook that ships a change | Slop-strip, [`no-comments`](../no-comments/SKILL.md), and [`unslop`](../unslop/SKILL.md), then the forge PR |

### When rows overlap

**Plans, programs, queues, and long runs.** A climb of one metric toward a target is **Hillclimb**, never a rule below, even when the user says "keep going until X" or steps away (see **One fix or a climb**). Otherwise take the first rule that fits.

1. The user wants a written plan before anyone builds work that spans phases or stacked PRs → **Multi-phase plan**. It writes the plan and stops. The plan names Autopilot full, Autopilot stack, or Orchestrate, and that playbook runs it on the operator's go.
2. A known queue of PRs to build and verify under full autonomy, one owner per PR → **Autopilot full** when the run may merge. **Autopilot stack** when the user lands the PRs.
3. A standing multi-day project to break into units yourself (many stacked PRs, a fleet of subagents under one coordinator, few human turns) → **Orchestrate**. This holds even for a migration across many call sites. Work one agent could finish inside the session's budget is not a program, however program-shaped the phrasing sounds. That work goes to **Autonomous run** (rule 4).
4. One task the user wants driven to a checkable predicate without stopping ("run until done", "keep going until X", a recurring loop until X) → **Autonomous run**. Each iteration still runs through the playbook it needs.
5. A large or cross-cutting run that needs a bespoke workflow (a migration across many call sites, an ambitious multi-part change), or work the user steps away from to trust later → [`figure-it-out`](../figure-it-out/SKILL.md), even when a narrower playbook like Feature fits. figure-it-out designs one bespoke run. Orchestrate runs a program.

**Diagnose or fix.** A request to fix a defect is **Bug fix**, and a request to fix slowness is **Perf issue**. Both capture their own evidence. A request for a diagnosis only is forensics. A live process to instrument is **Runtime forensics**. A capture that already exists (cpuprofile, trace, spindump, heap snapshot), analyzed as captured, is **Trace forensics**. Both forensics playbooks hand back to Bug fix or Perf issue once the cause is known. A read-only question about what code does or why it is shaped that way is **Investigation**.

**One fix or a climb.** **Perf issue** is one fix of a measured slowness against a baseline. **Hillclimb** is a loop toward a target on one metric, with a stop predicate, a decision log, and one commit per accepted win. A climb stays in Hillclimb even when it runs unattended. It borrows only the wake mechanism from Autonomous run and keeps its own stop rule (step 7 of [Hillclimb](playbooks/hillclimb.md)). A regression with a known-good version stays in Perf issue, which bisects it through [`fix-bug`](../fix-bug/SKILL.md).

**Refactor scope.** Step 0 of [Refactor](playbooks/refactor.md) routes a whole-system sweep to [`thermo-nuclear-refactor`](../thermo-nuclear-refactor/SKILL.md), a standing multi-day program to **Orchestrate** (rule 3), and a large cross-cutting reshape short of those to [`figure-it-out`](../figure-it-out/SKILL.md). A focused-to-medium change stays in the playbook.

Read and follow [`figure-it-out`](../figure-it-out/SKILL.md) when no row fits. It designs a bespoke, rigorous playbook for the run.

## Subagents

Spawn subagents in parallel when a playbook or sibling skill asks for coverage, independent verification, or disjoint workstreams. Each brief carries file pointers, not pasted dumps. Run subagents in the background by default. That includes a steer or resume of a running agent, because a foreground call holds your turn while other reports wait.

- **Delegates.** For a subagent inside a playbook step (a code-writing delegate, an ad-hoc helper), spawn the [`cortex-agent`](../../../agents/cortex-agent.md) agent type when the runtime has it. The repo ships it in `agents/`. It reads this file and [`principles`](../principles/SKILL.md) before any work. Otherwise spawn a general subagent whose brief says to read both in full first. Either way, put this file's absolute path, resolved from its real path, in every delegate brief. Never spawn a delegate to run a playbook. The playbook stays in this chat. A PR owner in [Autopilot full](playbooks/autopilot-full.md), [Autopilot stack](playbooks/autopilot-stack.md), or [Orchestrate](playbooks/orchestrate.md) is not a delegate, because it reads and follows other skills to carry its PR and a delegate stops when its task needs another workflow. Spawn each owner as a fresh background subagent of the general kind, as step 2 of Autopilot full says.
- **Routed skills keep their own subagents.** When a routed skill ([`how`](../how/SKILL.md), [`why`](../why/SKILL.md), [`arena`](../arena/SKILL.md), [`interrogate`](../interrogate/SKILL.md), [`reflect`](../../productivity/reflect/SKILL.md), and others) prescribes its reviewers or models for diverse-model review, follow the skill. Do not override it with a delegate.
- **You own every subagent's work.** Review the diff and write your own summary. Don't pass its summary through as the verdict. A second opinion is the same prompt against a different model family.
- **Fresh by default.** Give new work (a fix round, a follow-up, a retry, the next queue item) to a fresh subagent with consolidated scope. Its brief carries the original brief, every later directive, and the prior agent's report and branch. Resume, message, or queue a follow-up on an existing agent only when the new work strictly needs state that lives in that agent and is costly to move, such as its checkout, its uncommitted edits, or a process it still runs (a dev server, a simulator, a babysit watcher). A stop or hold order to a running agent is not reuse. A role such as a PR owner outlives its agent. Once that agent returns, a fresh agent takes the role's next round. Interrupt-chained resumes silently drop directives, so spawn a fresh subagent with consolidated scope rather than trusting a "done" summary.
- **Guard the context window.** Route bulk output, long files, and repeated reads to subagents, and keep their summaries in this chat, per [`principle-guard-the-context-window`](../principle-guard-the-context-window/SKILL.md).

| Role | Model |
| --- | --- |
| Design, review, prose, and the hardest changes (cross-cutting design, concurrency, subtle algorithms) | The strongest judgment model |
| Mechanical edits and evidence gathering | A fast model |
| Verifiers, judges, and second opinions | A different model family than the author when the runtime offers one, otherwise the parent model |

**Match the model to the job.** Code delegates tier by difficulty. The hardest changes go to the strongest judgment model, whether the task needs judgment on vague intent or is a precisely specified sequence of steps. Trivial mechanical edits go to a fast model. When the runtime offers reasoning-effort levels, every role starts at the highest level below the maximum. Raise it one step, up to the maximum, for the hardest or subtlest work. Lower it one step for judgment and two or more steps for routine work. Use a fast or low-latency mode only when the job is urgent, meaning CI or trunk is red or a person is blocked on the result right now. Verifiers keep their role's model family, so a diverse panel stays diverse.

When the runtime offers no model choice or rejects one, use the role's default, then the parent model, and say so. Never pass a choice the runtime already rejected. Never block on a specific vendor. Agreement across model families is high-signal.

## Writing the reply

Write the reply clean as you draft it, applying [`unslop`](../unslop/SKILL.md) as you go. A cleanup pass after drafting does not remove these patterns.

- **Short declarative sentences.** One thought per sentence, ended with a period.
- **No long-dash character anywhere.** Write a file-list bullet as a sentence ("`main.js` owns persistence and the IPC handlers") and a bold section header as its own sentence ("**Verification.** End to end via CDP"). This is unslop rule 13.
- **A colon as a mid-sentence connector is also out** (unslop rule 14). A colon before a list is fine.
- **Terse is not an excuse to drop content.** Short sentences, but every section the playbook's reply names stays. That covers details, tradeoffs, choices, and open decisions.
- **Frame impact for the consumer and the maintainer.** Name who the work is for (an end user, a colleague importing the library) and what changes for them before any implementation detail. Then name what the next engineer who owns this code inherits. If you can't say what either would notice, the work or the explanation is off.
- **Never fabricate a link, citation, or transcript reference.** Link only artifacts you produced or read this session.
- **Every claim carries its evidence or its label in the same sentence.** Measured, inferred, or guess. A prediction or an unseen cause is a guess. Never hand the user a check you could run.

Every playbook ends with a reply written this way. Give each PR as its full forge URL, such as `https://github.com/<owner>/<repo>/pull/<number>`. Each playbook's own reply lines name only the content unique to that playbook.

## Comments

Comments follow the same rule as the reply. Write them clean as you go. Keep a comment only for a non-obvious why the code cannot show. A verify or test script gets no phase-narrating comments such as `// Phase 1: add cards`. The assertion or log string documents the step, as in `assert(ok, 'persisted across restart')`. This applies to every file you produce, including a delegate's diff. Before review, [`no-comments`](../no-comments/SKILL.md) still runs on the scoped diff.
