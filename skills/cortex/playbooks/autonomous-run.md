### Autonomous run

**You own the exit condition. Define done, then drive to it without stopping.**

1. State the exit condition as a predicate you check on the real artifact, before the first iteration (tests green, repro fixed, all N PRs merged, pixel-diff zero). Open a decision trail via the decision-trail mode of [`handoff`](../../handoff/SKILL.md), one row per iteration.
2. Run the loop self-paced, and pick what wakes you when an iteration waits on something outside your control. An event to watch (CI, a merge, a ref advancing) gets a watcher subagent that wakes you on the event, with a long time-based heartbeat as fallback. For a PR's checks and reviews, use the watcher the [Babysit](babysit.md) playbook uses for the active forge. No event gets a fixed-interval heartbeat sized to when the result is worth re-checking.
3. Each iteration makes the smallest change the evidence justifies, verifies it against the predicate, and commits if it moved the run toward the predicate. Revert one that did not, including one that "might help". A predicate of merged PRs lands them through the [Shipping](shipping.md) playbook.
4. Mid-run discoveries that support the goal are yours. Fix related bugs, flaky verifiers, tooling failures, and broken skills yourself, each through its matching cortex playbook and in its own PR. Then return to the predicate. Settle a product call by cortex's ask-the-user trigger.
5. Stop when the predicate is met. A plateau is not a stop. Pivot the approach while an untried one remains. Call a dead end only when every approach you can name is tried and logged, and then surface it. Never relax the predicate to declare victory.
6. If no outer playbook owns this run, run the end-of-run trail audit and cross-model review from the decision-trail mode of [`handoff`](../../handoff/SKILL.md). If the run changed code and no outer playbook owns its PR, run [Opening a PR](opening-a-pr.md).

**Reply:** the exit condition, iterations run, what landed, what was discarded, final predicate state, and the decision-trail path.
