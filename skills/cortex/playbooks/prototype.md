### Prototype

**You own the decision, not the code.** Read and follow [`prototype`](../../prototype/SKILL.md) to build it. Where the skill asks the user to pick a branch, pick it from the decision. Where the skill hands the prototype to the user, you drive it first.

Speed beats polish. Do not cite the [Laziness Protocol](../../principles/laziness-protocol.md) to build one variant. Build alternatives the user did not ask for, and drop an approach when it loses.

1. Scope the decision the prototype exists to make: which layout, interaction, or density, or for an empirical fork which behavior, timing, or approach. No decision means no prototype. Route to [Feature](feature.md).
2. Build in a git worktree off trunk, at the location the skill picks inside it. For a behavioral or timing fork, build the smallest script that prints the observation, not a TUI.
3. When the design space is open, search prior art and let it seed the variants. Do not wait for the user to pick directions.
4. Observe each variant yourself on the matching surface. For a visual decision, drive the interaction and screenshot each variant, through the repo's `verify-*` skill when the prototype runs inside the app. For a behavioral or timing decision, log the timing or print the output. The observation is the evidence.
5. When a run settles the fork, pick the winner on the evidence. For a genuine product or preference call, recommend one and leave the variants up for the user to pick. Capture the answer per the skill's **When done**, and commit it with the prototype on the worktree branch.
6. Entered from a fork inside another playbook, return to that playbook with the branch, the SHA, and the evidence, and act on the result. Otherwise hand the chosen direction to [Feature](feature.md). The prototype itself does not ship, so open no PR for it.

**Reply:** the variants explored, the evidence (screenshots for a visual decision, the observed output or timing for a behavioral one), tradeoffs, your recommendation, the branch and SHA, and the prototype's path with whether you kept, deleted, or absorbed it. Say plainly which parts are throwaway.
