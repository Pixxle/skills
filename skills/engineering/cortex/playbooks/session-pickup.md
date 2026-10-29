### Session pickup

**You own the resume point. Read the prior trail, don't redo it.** Use this to resume or take over a prior agent's in-flight work from a transcript, a resume note, a decision trail, or a pushed branch.

These steps track mode 3 of [`handoff`](../../handoff/SKILL.md) and add cortex's routing.

1. Read and follow [`handoff`](../../handoff/SKILL.md) mode 3, Session pickup. Locate the prior trail: a resume note, a handoff doc, a decision trail, a local transcript, a cloud session URL, or a pushed branch. Find transcripts where that mode's step 1 says each runtime keeps them, and read only this workspace's. Never glob across unrelated projects. That crosses workspace boundaries and reads private chats from unrelated work. Read the metadata overview and last messages first, then scan back for the decision points. Parse a long transcript in a subagent and keep the reduced timeline in the main thread ([`principle-guard-the-context-window`](../../principle-guard-the-context-window/SKILL.md)). Pick each subagent's model per [Subagents](../references/subagents.md), and its reasoning effort for the job when the runtime offers a choice.
2. Reconstruct operational state. The branch and worktree, what already landed (`git log`, `git diff` against the base), the open todos, the decisions made. The prior trail is authoritative input. Resist the bias to re-derive it.
3. Diff done vs pending. Compare what shipped against what was planned, name the resume point, and do not re-run the prior repro or redo completed work. A "let me verify from scratch" pass means you're treating the trail as untrustworthy when it's authoritative. Re-verify from scratch only a claim that lacks evidence.
4. Route the remaining work to the matching playbook in [cortex's table](../SKILL.md#playbooks) and pick the verdict: continue the execution, ship a finished recommendation, ratify or override a prior conclusion, or postmortem a failed run. The pickup playbook ends here. The routed playbook owns the rest.
5. Verify the inherited claims against the original goal on the real artifact ([`principle-prove-it-works`](../../principle-prove-it-works/SKILL.md)). A passing prior self-report is not the proof.

**Reply:** where the prior agent stopped, what you inherited vs redid (ideally nothing redone), the verdict and the playbook you routed to, the resume point, and the outcome.
