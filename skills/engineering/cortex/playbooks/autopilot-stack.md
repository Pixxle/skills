### Autopilot stack

Run the [Autopilot full](autopilot-full.md) playbook, but do not merge.

1. **In place of step 5, stop at verified.** Stop when each PR is verified and green at its current head, then hand the PRs to the operator. After the handoff, nobody pushes without the operator's go. Every tick re-reads this file along with Autopilot full, and every scheduled tick's prompt names this file, so each tick sees the no-merge rule. Every owner's brief also states the no-merge rule and gives this file's absolute path, because an owner round reads only its brief and would otherwise land per step 5. Landing is the operator's call. When they ask for it, it runs through [Shipping](shipping.md), which re-checks each verdict against its patch before anything lands.
2. **Stack a PR only when it builds on another PR.** This is the one exception to step 3. Base the PR on the other PR's branch in place of trunk, per step 8 (Size and stacks) of [Opening a PR](opening-a-pr.md). In place of step 2's rebase onto trunk, each PR rebases onto its parent PR's branch at its exact tip, and the stack root rebases onto trunk. A new head on the lower PR restacks the PRs above it. A PR whose `git patch-id` the restack leaves unchanged keeps its verdict. Once the operator lands a parent, its child moves onto trunk per step 4 of [`shipping`](../../shipping/SKILL.md).

**Reply:** list each PR with its verdict, in place of what merged.
