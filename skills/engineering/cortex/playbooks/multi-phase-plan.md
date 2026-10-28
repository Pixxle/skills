### Multi-phase plan

**You own the plan, not the code. The plan is a checklist an owner runs box by box and the operator audits from the evidence.** The plan is the deliverable. Do not implement.

1. When the change is one or two files with an obvious approach, skip the plan. Say so and stop.
2. Settle open questions by prototype before you write. Run [Prototype](prototype.md) for each. Keep the branch, the SHA, and the screenshots for Appendix A. Ask the operator only about a product or preference call that no run can settle. Give options ([`principle-never-block-on-the-human`](../../principle-never-block-on-the-human/SKILL.md)).
3. Explore in subagents ([`principle-guard-the-context-window`](../../principle-guard-the-context-window/SKILL.md)). Spawn each as a delegate on the model its job calls for, per [cortex's Subagents section](../SKILL.md#subagents). Each returns file pointers, conventions, test commands, and entry points. No inlined dumps.
4. Copy the skeleton below into the plan file and fill every placeholder. Unless the operator names a path, write the file as `plan.md` in the program store, one directory outside every worktree. Create the store now and write its path into the skeleton's `<program store path>`. The execution playbook keeps its trails there too. The plan lives outside the repo, so a relative link in it resolves to nothing. Write every skill or playbook it names as a real path an owner can open. `<skills dir>` is the real path of the directory that holds the installed cortex skill and its sibling engineering skills, and `<cortex skill dir>` is `<skills dir>/cortex`. Keep every heading and every sub-block in the order shown. One section per PR. One PR is one change with its own evidence ([`principle-sequence-verifiable-units`](../../principle-sequence-verifiable-units/SKILL.md)). Name the execution playbook in **How to read this**. Pick [Autopilot full](autopilot-full.md) when the run may merge. Pick [Autopilot stack](autopilot-stack.md) when the operator lands the PRs. A standing program takes [Orchestrate](orchestrate.md).
5. Write the plan as technical documentation for a tired engineer. Cut every word that does no work. Use the short, everyday word. Write the real symbol, file, flag, or command name, not a description of it. The body is one Diátaxis mode, how-to. Appendices hold explanation and reference. Each heading states the task or the finding. No long dashes. No mid-sentence colons. Then read and follow [`unslop`](../../unslop/SKILL.md) on the plan.
6. Run [`check-plan.mjs`](../scripts/check-plan.mjs) and fix every line it prints ([`principle-encode-lessons-in-structure`](../../principle-encode-lessons-in-structure/SKILL.md)). Resolve the cortex skill directory from its real path, then run `node <cortex skill dir>/scripts/check-plan.mjs <plan file>`. It prints one row per PR section with its box counts, then the problem count, and exits 0 only when there are no problems.
7. Hand back. Post the plan path and the script's output, then stop. Execution starts on the operator's explicit go, under the execution playbook the plan names.

**Verification.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked ([`principle-prove-it-works`](../../principle-prove-it-works/SKILL.md)). That sentence is the verification rule. Every verification block opens with it. The live block is mandatory. Ten lanes at the PR head drive the real surface through its control skill. They are subagents spawned in parallel on the verifier model from [cortex's Subagents section](../SKILL.md#subagents), a different model family than the author when the runtime offers one. Name that model in the live block, or write `parent model` when the runtime offers no choice. Each lane is one box with a concrete scenario, the screenshot it saves, and its pass predicate. One lane is the **Regression lane against trunk.** It runs the same load-bearing scenario on trunk and head. If trunk does not have the feature, the lane records that fact and gates the behavior the diff adds plus the end state the user waits for instead of inventing a trunk result. The perf gate is dual-sided. Trunk and head must both produce the named metric. If trunk lacks the feature, also isolate the work the diff adds and set an absolute budget for that work plus the end-to-end state the user waits for. Do not claim a ratio between unlike scenarios. The perf block names the metric, the interleaved probe, the trunk baseline measured first, and the rule with the number that fails. A PR that changes an interaction is review-gated. The operator reviews it in chat with screenshots and a video before merge. A PR that changes no interaction writes `**Review gate.** None. <PR id> is not review-gated.` and no boxes under it.

**Control skill.** Pick it by surface. Use the repo's `verify-*` skill (in `.agents/skills/` or `.claude/skills/`) that drives the surface. When the repo has none and the surface needs scripted driving, offer to create one. On yes, read and follow [`create-verification-skill`](../../create-verification-skill/SKILL.md), which covers web, CLI, API, iOS simulator, and Android emulator surfaces. A PR that touches two surfaces gets lanes on both. A surface with no control skill is a risk in Appendix C, and its live block still names how each lane drives it.

````markdown
# <Program> plan

<Under ten lines. What changes, for whom, the rule the program enforces, and the PR ids in order.>

## How to read this

One box is one unit of work. Every box names the evidence that checks it. A nested box is a sub-step of the box above it. Check a box only when its evidence exists, a file, a log line, a screenshot, a test run, or a SHA. The body is a how-to. The appendices explain and record.

The program runs `<cortex skill dir>/playbooks/<execution playbook>.md`. <Who merges, and which PR ids are the operator's items that stop at merge-ready.>

Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

## Program checklist

### Arm the program

- [ ] State the protocol and this plan to the operator, then stop. Start execution only on the operator's explicit go.
- [ ] The program store is `<program store path>`, one directory outside every worktree. This plan and every owner's decision trail live there. Name it in every owner brief.
- [ ] Read these at program start. Re-read them at every tick. Read a file this repo tracks from trunk with `git show origin/<trunk>:<path>`. Read a skill that lives outside this repo at its installed real path.
  - [ ] `<cortex skill dir>/playbooks/<execution playbook>.md`
  - [ ] `<cortex skill dir>/playbooks/opening-a-pr.md`
  - [ ] `<control skill path>`
  - [ ] `<skill dir>/SKILL.md` for each other skill the program uses.
- [ ] On the operator's go, arm the hourly audit tick with the tick prompt below, as a recurring wake-up. When the runtime cannot schedule one, run the tick each time an owner reports. Never leave the cadence to memory.
- [ ] Use this tick prompt, verbatim. "Re-read the execution playbook at `<execution playbook path>`. Audit the operation against it and fix drift in this tick. Probe every active lane and judge progress by side effects only. Stand down a stuck lane and dispatch its replacement now. Then post a short status message to the operator in chat only when the audit found a tracked change that no earlier status message reported, such as a PR opened, a code-ready head, a round launched or closed, a verdict, a merge, a stuck agent and the action taken, a blocker added or cleared, or a decision only the operator can make. Name every such change and nothing else. Do not repeat a table, the merged list, or an unchanged blocker. If the audit found none, end the turn with no reply text. Either way, log this tick's row in your decision trail. The row names the items reported, or none."
- [ ] On the operator's hold or stand-down, send every owner a zero-writes order at once.

### Spawn owners

- [ ] Spawn one owner per PR with the full lifecycle the execution playbook names.
- [ ] Follow this dependency graph. Start dependent work only after its parent merges, or base it on the parent branch when the execution playbook stacks.
  - [ ] <PR id> and <PR id> are independent and first. Both branch from `<trunk>`.
  - [ ] <PR id> after <PR id>.
- [ ] Hold the file boundaries. <PR id or class> touches only `<glob>`.
- [ ] Hold the review gate. <PR ids> change an interaction. They wait for the operator's review in chat with screenshots and a video before merge.

### PR mechanics, for every PR

- [ ] Resolve the forge once. Default to `gh`. If `command -v origin` succeeds and Origin can resolve the repository, use `origin pr` for every PR operation. Record any fallback to `gh`. Never require `gt`.
- [ ] Open the PR ready, never draft, per **Opening a PR**. Use the run's built-in PR tool when it has one, else `origin pr create --status open --base <base-branch>` or `gh pr create --base <base-branch>` according to the resolved forge. A stack child targets its parent branch.
- [ ] Run the repo's lint and typecheck once before the PR-facing push. Push with hooks on.
- [ ] Slop-strip the diff before each commit. Remove narrating comments, unsupported guards, dead compatibility paths, and unrelated edits. Before review, read and follow `<skills dir>/no-comments/SKILL.md` on the scoped diff, per **Opening a PR**.
- [ ] Triage every Bugbot and security-reviewer comment per `<skills dir>/babysit/BUGBOT-TRIAGE.md`.
- [ ] Rebase onto current trunk before the code-ready report and babysit. Keep that merge base in fix rounds. Rebase again only at merge prep, on a `git merge-tree` conflict with trunk, on a CI failure that comes from a change on trunk, or when a known concurrent change to the same files lands.

### Verdict and merge, for every PR

- [ ] A full verification fan-out runs once, at the code-ready head. Another runs only for new behavior, a redesign, or a large new diff. A rebase, a merge-conflict resolution, or a minor fix gets a single verifier at the new head, and a wording-only change gets none. Run each full fan-out as subagents spawned in parallel. One gates lane. The ten live lanes from the PR's **Verify, live** block. The perf lane from its **Verify, perf** block. Two or more audit lanes, each with its own focus, that read the diff and the receipts and distrust the PR body. Each lane brief stands alone. It names the goal, the scope, the exact head SHA, how to verify, and what to report. The perf lane's brief also names the method, which is the sample count, what one sample is, and the order. Each lane reports `PASS`, `ISSUES`, or `BLOCKED` with evidence, and records the SHA and any method its brief names. A lane that proves a defect reports `ISSUES` and lists every issue it can prove, not only the first. Respawn a lane once when its report lacks the evidence, the SHA, or the method its brief names, then record a gap. A gap is not a pass. The root aggregates the lane reports into one result table and pastes no raw lane dumps. The root audits the receipts in the merge-ready report before the verdict.
- [ ] Judge every finding by the execution playbook's blocking rule. The verdict is clean when none blocks. A failure on trunk behavior in a lane marked `Regression lane against trunk.` is recorded against trunk and does not block the PR. A new head gets a fresh verdict, except for results that stay valid under the patch-id rule in `<skills dir>/shipping/SKILL.md`.
- [ ] <The merge or handoff rule from the execution playbook.> Apply the patch-id rule in `<skills dir>/shipping/SKILL.md`.

### Boot recipe, for every live lane

Each live lane runs in its own checkout at the PR head, a separate worktree with its own ports and data, or a separate machine when the surface needs one. Drive through `<control skill>`.

- [ ] `git fetch origin <head-branch> && git worktree add --detach <lane dir> <head SHA>`.
- [ ] <Start the backend and the surface. Wait for ready.>
- [ ] <Deliver input only through the control skill's commands. Name the read-only diagnostics.>
- [ ] Save every screenshot to `/tmp/verify-<pr-id>/lane-<n>/<slug>.png` and return the paths with the report.
- [ ] After the lane reports, stop its processes and run `git worktree remove --force <lane dir>`. Keep only the screenshots under `/tmp/verify-<pr-id>/lane-<n>/`.

## <Task as a verb phrase> (<PR id>)

**Depends on.** <PR id, or None.>

**Files.**

- [ ] Edit `<path>`.
- [ ] Create `<path>`.
- [ ] Delete `<path>`.

**Build.**

- [ ] <One change. Name the symbol and the file.>

**You see.**

- [ ] <One observable result, with the exact log line or screen state.>

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] <Test file and the case it gains.> Run `<command>`.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on `<verifier model>` at the PR head, per the boot recipe.

- [ ] Lane 1. Regression lane against trunk. Run <the same load-bearing scenario> at trunk and head. If trunk lacks the feature, record that and gate <the behavior the diff adds plus the end state the user waits for>. Save `<slug>.png`. Pass when <predicate>.
- [ ] Lane 2. <Scenario.> Save `<slug>.png`. Pass when <predicate>.
- [ ] Lane 3. <Scenario.> Save `<slug>.png`. Pass when <predicate>.
- [ ] Lane 4. <Scenario.> Save `<slug>.png`. Pass when <predicate>.
- [ ] Lane 5. <Scenario.> Save `<slug>.png`. Pass when <predicate>.
- [ ] Lane 6. <Scenario.> Save `<slug>.png`. Pass when <predicate>.
- [ ] Lane 7. <Scenario.> Save `<slug>.png`. Pass when <predicate>.
- [ ] Lane 8. <Scenario.> Save `<slug>.png`. Pass when <predicate>.
- [ ] Lane 9. <Scenario.> Save `<slug>.png`. Pass when <predicate>.
- [ ] Lane 10. <Scenario.> Save `<slug>.png`. Pass when <predicate>.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. <What is measured at both trunk and head. If trunk lacks the feature, also name the diff-added work and the end-to-end state the user waits for.>
- [ ] Probe. <The command or procedure, run at trunk and at the head, interleaved. Both sides must produce the metric.>
- [ ] Baseline. Record the trunk <value> first.
- [ ] Rule. <Head against trunk, with the number that fails. If the scenarios differ, add absolute budgets for the diff-added work and the user-visible end state instead of an invalid ratio.>

**Review gate.** The operator reviews before merge.

- [ ] Copy lane <n> screenshots into `<media path>/<pr-id>-review-<slug>.png`.
- [ ] Record a 30 to 60 second video of the change in a lane's checkout. Save it as `<media path>/<pr-id>-review.mp4`.
- [ ] Post the screenshots and the video in chat. Stop at merge-ready. Wait for the operator's click.

**Merge.**

- [ ] Root's clean verdict at the exact head SHA.
- [ ] Bugbot and bot-review triage done.
- [ ] Rebased onto current trunk after the verdict, patch-id unchanged.
- [ ] <The owner squash-merges its own PR, or the root appends it to the base-branch stack and the operator lands it bottom-up.>

## Close the program

- [ ] Every box above is checked with its evidence.
- [ ] Reply to the operator with the report the execution playbook names.

## Appendix A. Prototype evidence

<Each open question a prototype answered, with the branch, the SHA, and the artifact links. Each question that stays unproven.>

## Appendix B. Alternatives rejected

<Each approach weighed and why it lost.>

## Appendix C. Risks

<Each risk with the PR it lands in and what the owner watches.>

## Appendix D. Links and reading list

<Docs to read before editing.>

- <PR ids> read and follow `<skills dir>/how/SKILL.md`.
- <PR ids> read and follow `<skills dir>/interrogate/SKILL.md`.
- Each owner keeps its decision trail in `<program store path>` per `<skills dir>/handoff/SKILL.md` in decision-trail mode.
````

**Reply:** the plan path, the PR ids with their dependencies and the review-gated set, what the prototypes proved and what stays unproven, and the check script's output.
