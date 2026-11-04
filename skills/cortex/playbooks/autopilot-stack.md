### Autopilot-stack

Run the [Autopilot-full](autopilot-full.md) playbook, but do not merge.

1. **In place of step 5, stop at verified.** Stop when each PR is verified and green at its current head, then hand the PRs to the operator. After the handoff, nobody pushes without the operator's go. Every owner brief and every loop tick prompt names this file and its no-merge rule, so no owner or tick merges.
2. **Stack a PR only when it builds on another PR, the one exception to step 3.** Base it on its parent PR's branch per **Size and stacks** in [`playbooks/opening-a-pr.md`](opening-a-pr.md), and rebase it onto that branch wherever step 2 says trunk. Owners still start in parallel off trunk, except that a child's owner starts from its parent's code-ready head. When a parent reports a new head, the owner of each PR above it rebases onto that head. A restacked PR keeps its verdict under the patch-id rule only when the parent's change was wording only. Otherwise it gets a single verifier at its new head, per step 4.

**Reply:** in place of what merged, list each stack bottom to top, then each independent PR, each with its verdict and the head SHA the verdict covers.
