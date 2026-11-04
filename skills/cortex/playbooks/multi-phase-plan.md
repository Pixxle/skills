### Multi-phase or multi-PR plan

**You own the plan, not the code. Do not implement. The plan is a checklist an owner runs box by box and the operator audits from the evidence.**

1. When the change is one or two files with an obvious approach, skip the plan. Say so, name the playbook that fits ([Feature](feature.md), [Bug fix](bug-fix.md), or [Refactoring](refactoring.md)), and stop.
2. Explore in subagents (the [Guard the Context Window](../../principles/guard-the-context-window.md) principle). Each returns file pointers, conventions, test commands, entry points, and the `verify-*` skill for each surface the change touches.
3. Settle open questions by prototype. Run [`playbooks/prototype.md`](prototype.md) for each. Keep the branch, the SHA, and the screenshots or observed output for Appendix A.
4. For each touched surface with no `verify-*` skill, read and follow [`create-verification-skill`](../../create-verification-skill/SKILL.md), then open its PR per [Opening a PR](opening-a-pr.md). It is the one thing this playbook builds. Every live lane reads the skill from trunk, so the operator lands that PR before the go.
5. Copy the skeleton below into the plan file and fill every placeholder. `<skills dir>` is the real path of the directory that holds the cortex skill, and `<trunk>` is the repo's trunk branch. Write the file to the path the operator names. Without one, write it to `~/.cortex/<repo>/plans/<slug>.md`, outside the repo. Each heading states the task or the finding.
6. Write one section per PR. One PR is one change with its own evidence (the [Sequence Work into Verifiable Units](../../principles/sequence-verifiable-units.md) principle). Order the PRs toward the end state, with no throwaway compatibility PRs (the [Outcome-Oriented Execution](../../principles/outcome-oriented-execution.md) principle). Plan an intermediate breakage only under Autopilot-stack, where nothing lands until the operator lands the stack, and name each one in Appendix C.
7. Name the execution playbook in **How to read this**. Pick [`playbooks/autopilot-full.md`](autopilot-full.md) when the run may merge. Pick [`playbooks/autopilot-stack.md`](autopilot-stack.md) when the operator lands the PRs. Pick [`playbooks/orchestrate.md`](orchestrate.md) for a standing program. Under any of them, this plan's full swarm per PR and its stop for the operator's go govern. Under Orchestrate, this plan's hourly audit tick runs as Orchestrate's heartbeat.
8. Run [`check-plan.mjs`](../scripts/check-plan.mjs) as `node <skills dir>/cortex/scripts/check-plan.mjs <plan.md>` and fix every line it prints.
9. Hand back with the reply below, then stop. Execution starts on the operator's explicit go, under the execution playbook the plan names.

**Verify blocks.** Fill `<swarm workers model>` with the worker model that the [`swarm`](../../swarm/SKILL.md) skill's Phase A step 3 picks. Pick each lane's `verify-*` skill by surface. A PR that touches two surfaces gets lanes on both. A PR that changes no interaction writes `**Review gate.** None. <PR id> is not review-gated.` and no boxes under it.

````markdown
# <Program> plan

<Under ten lines. What changes, for whom, the rule the program enforces, and the PR ids in order.>

## How to read this

One box is one unit of work. Every box names the evidence that checks it. A nested box is a sub-step of the box above it. Check a box only when its evidence exists, a file, a log line, a screenshot, a test run, or a SHA. The body is a how-to. The appendices explain and record.

The program runs `<skills dir>/cortex/playbooks/<execution playbook>.md`. <Who merges, and which PR ids are the operator's items that stop at merge-ready.>

Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

## Program checklist

### Arm the program

- [ ] State the protocol and this plan to the operator, then stop. Start execution only on the operator's explicit go.
- [ ] Read these at program start. Re-read them at every tick.
  - [ ] `<skills dir>/cortex/playbooks/<execution playbook>.md`
  - [ ] `<skills dir>/swarm/SKILL.md`
  - [ ] `git show origin/<trunk>:<verify-* skill path>`
  - [ ] `<skills dir>/cortex/playbooks/opening-a-pr.md`
  - [ ] `<skills dir>/cortex/playbooks/autopilot-full.md`, for the rebase, cadence, and blocking rules this plan cites
  - [ ] `<skills dir>/<each other leaf skill the program uses>`
- [ ] On the operator's go, arm the hourly audit tick as a self-paced loop with the tick prompt below.
- [ ] Use this tick prompt, verbatim. "Re-read `<skills dir>/cortex/playbooks/<execution playbook>.md`. Audit the operation against it and fix drift in this tick. Probe every active lane and judge progress by side effects only. Stand down a stuck lane and dispatch its replacement now. Then post a short status message to the operator in chat only when the audit found a tracked change that no earlier status message reported, such as a PR opened, a code-ready head, a round launched or closed, a verdict, a merge, a stuck agent and the action taken, a blocker added or cleared, or a decision only the operator can make. Name every such change and nothing else. Do not repeat a table, the merged list, or an unchanged blocker. If the audit found none, end the turn with no reply text. Either way, log this tick's row in your decision trail. The row names the items reported, or none."
- [ ] On the operator's hold or stand-down, send every owner a zero-writes order at once.

### Spawn owners

- [ ] Spawn one owner per PR with the full lifecycle the execution playbook names. Every owner brief names this plan's path, `<plan path>`.
- [ ] Follow this dependency graph. Start dependent work only after its parent merges, or base it on the parent branch when the execution playbook stacks.
  - [ ] <PR id> and <PR id> are independent and first. Both branch from `<trunk>`.
  - [ ] <PR id> after <PR id>.
- [ ] Hold the file boundaries. <PR id or class> touches only `<glob>`.
- [ ] Hold the review gate. <PR ids> change an interaction. They wait for the operator's review in chat with screenshots and a video before merge.

### PR mechanics, for every PR

- [ ] Resolve the forge once per **Forge**, step 4 of `<skills dir>/cortex/playbooks/opening-a-pr.md`.
- [ ] Open the PR ready, never draft, per **Create ready**, step 8 of Opening a PR. A stack child targets its parent branch.
- [ ] Run the repo's lint and typecheck once before the PR-facing push. Push with hooks on.
- [ ] Slop-strip the diff per **Opening a PR** before each commit, and follow `<skills dir>/no-comments/SKILL.md` before review.
- [ ] Triage every Bugbot and security-reviewer comment per `<skills dir>/babysit/BUGBOT-TRIAGE.md`.
- [ ] Rebase when Autopilot-full step 2 says, as Autopilot-stack step 2 amends it when the plan stacks. That is before the code-ready report, then only on its named triggers.

### Verdict and merge, for every PR

- [ ] Run each full swarm per `<skills dir>/swarm/SKILL.md`, at the cadence in Autopilot-full step 4. It has one gates lane, the ten live lanes from the PR's **Verify, live** block, the perf lane from its **Verify, perf** block, and two or more audit lanes, each with its own focus, that read the diff and the receipts and distrust the PR body. The root audits the receipts in the owner's merge-ready report before the verdict.
- [ ] Judge every finding by the blocking rule in Autopilot-full step 4. A failure on trunk behavior in a lane marked `Regression lane against trunk.` is recorded against trunk and does not block the PR. A new head gets a fresh verdict, except for results that stay valid under the patch-id rule in step 3 of `<skills dir>/shipping/SKILL.md`.
- [ ] <The merge or handoff rule from the execution playbook, with that patch-id rule.>

### Boot recipe, for every live lane

Each live lane runs on its own cloud VM at the PR head. Drive through the repo's `verify-*` skill.

- [ ] `git fetch origin <head-branch> && git checkout <head SHA>`.
- [ ] <Start the backend and the surface. Wait for ready.>
- [ ] <Deliver input only through the `verify-*` skill's commands. Name the read-only diagnostics.>
- [ ] Save every screenshot to `/tmp/swarm-<pr-id>/worker-<n>/<slug>.png` and return the paths with the report.

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

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on `<swarm workers model>` at the PR head, per the boot recipe.

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
- [ ] Record a 30 to 60 second video of the change on a lane VM. Save it as `<media path>/<pr-id>-review.mp4`.
- [ ] Post the screenshots and the video in chat. Stop at merge-ready. Wait for the operator's click.

**Merge.**

- [ ] Root's clean verdict at the exact head SHA.
- [ ] Bugbot triage done.
- [ ] Rebased onto its base branch after the verdict, patch-id unchanged.
- [ ] <The owner squash-merges its own PR, or the root appends it to the base-branch stack and the operator lands it bottom-up.>

## Close the program

- [ ] Every box above is checked with its evidence.
- [ ] Reply to the operator with the report the execution playbook names.

## Appendix A. Prototype evidence

<Each open question a prototype answered, with the branch, the SHA, and the artifact links. Each question that stays unproven.>

## Appendix B. Alternatives rejected

<Each approach weighed and why it lost.>

## Appendix C. Risks

<Each risk, and each planned intermediate breakage, with the PR it lands in and what the owner watches.>

## Appendix D. Links and reading list

<Docs to read before editing. Which PRs get `<skills dir>/how/SKILL.md` and `<skills dir>/interrogate/SKILL.md`. The trail per the decision-trail mode of `<skills dir>/handoff/SKILL.md`.>
````

**Reply:** the plan path, the PR ids with their dependencies and the review-gated set, any verify-skill PR the operator lands before the go, what the prototypes proved and what stays unproven, and the check script's output.
