# Subagents

Read this reference before you spawn. Spawn subagents in parallel when a playbook or sibling skill asks for coverage, independent verification, or disjoint workstreams. Each brief carries file pointers, not pasted dumps. Run subagents in the background by default. That includes a steer or resume of a running agent, because a foreground call holds your turn while other reports wait.

- **Delegates.** For a subagent inside a playbook step (a code-writing delegate, an ad-hoc helper), spawn the [`cortex-agent`](../../../../agents/cortex-agent.md) agent type when the runtime has it. The repo ships it in `agents/`. It reads [`cortex`](../SKILL.md) and [`principles`](../../principles/SKILL.md) before any work. Otherwise spawn a general subagent whose brief says to read both in full first. Either way, put this cortex skill's absolute path in every delegate brief. Never spawn a delegate to run a playbook. The playbook stays in this chat. A PR owner in Autopilot full, Autopilot stack, or Orchestrate is not a delegate. Spawn each owner as a fresh background subagent of the general kind.
- **Routed skills keep their own subagents.** When a routed skill ([`how`](../../how/SKILL.md), [`why`](../../why/SKILL.md), [`arena`](../../arena/SKILL.md), [`interrogate`](../../interrogate/SKILL.md), [`swarm`](../../swarm/SKILL.md), [`reflect`](../../../productivity/reflect/SKILL.md), and others) prescribes its reviewers or models, follow the skill. Do not override it with a delegate.
- **You own every subagent's work.** Review the diff and write your own summary. Don't pass its summary through as the verdict. A second opinion is the same prompt against a different model family.
- **Fresh by default.** Give new work to a fresh subagent with consolidated scope: the original brief, every later directive, and the prior agent's report and branch. Resume an existing agent only when the new work needs state that lives there and is costly to move (checkout, uncommitted edits, a running process). A role such as a PR owner outlives its agent. Once that agent returns, a fresh agent takes the next round.
- **Guard the context window.** Route bulk output, long files, and repeated reads to subagents, and keep their summaries in this chat, per [`principle-guard-the-context-window`](../../principle-guard-the-context-window/SKILL.md).

| Role | Model |
| --- | --- |
| Design, review, prose, and the hardest changes | The strongest judgment model |
| Mechanical edits and evidence gathering | A fast model |
| Verifiers, judges, and second opinions | A different model family than the author when the runtime offers one, otherwise the parent model |

**Match the model to the job.** The hardest changes go to the strongest judgment model. Trivial mechanical edits go to a fast model. When the runtime offers reasoning-effort levels, every role starts at the highest level below the maximum. Raise it one step for the hardest work. Lower it for judgment and routine work. Use a fast mode only when CI or trunk is red or a person is blocked. Verifiers keep their role's model family.

When the runtime offers no model choice or rejects one, use the role's default, then the parent model, and say so. Never pass a choice the runtime already rejected. Never block on a specific vendor. Agreement across model families is high-signal.
