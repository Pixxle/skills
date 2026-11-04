### Babysit

**You own the merge frontier until it is merge-ready. Read and follow [`babysit`](../../babysit/SKILL.md) in full before any poll.** It holds the modes, the watcher, the stop conditions, CI classification, and bot triage.

1. **Declare the mode and resolve the forge.** Resolve it per **Forge** (step 4) in [`playbooks/opening-a-pr.md`](opening-a-pr.md).
2. **Confirm no other babysitter owns the stack, then name the frontier PR.**
3. **Run the skill's loop for the declared mode, one push wave at a time.**
4. **Stop at the active forge's stop condition, and never merge.** Under cortex, route a request to merge, land, or ship to [`playbooks/shipping.md`](shipping.md), not straight to the skill it names. That playbook reads and follows the same [`shipping`](../../shipping/SKILL.md) skill and adds what a ship request authorizes.
5. **Sweep the run's triage decisions once.** Offer each team-useful dismissal pattern as a candidate entry in [`BUGBOT-TRIAGE.md`](../../babysit/BUGBOT-TRIAGE.md), in its own PR.

**Reply:** the mode and forge, the frontier PR and its last verdict, each push wave with its commit SHA and what it cleared, each dismissed thread with its disproof, each escalation, each CI failure's class, and what waits on the human.
