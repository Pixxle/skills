### Swarm review

**You own framing, aggregation, and the ranked report.** Workers only report evidence-backed findings in their lens.

1. Read and follow [`swarm-review`](../../swarm-review/SKILL.md). Fan out lenses in parallel. Dedupe and severity-triage yourself.
2. When a blocking or should-fix finding cannot be confirmed by reading, or the user wants proof, offer an adversarial pass with those findings as leads. On yes, read and follow [`interrogate`](../../interrogate/SKILL.md). Only a finding a run proves survives there.
3. If the user wants remedies decided one by one, read and follow [`workshop-findings`](../../workshop-findings/SKILL.md).
4. If the user wants findings posted as a forge review, read and follow [`pr-comments`](../../pr-comments/SKILL.md) with the clean list.
5. Do not implement fixes unless asked. A whole-repo structural hunt goes to [Refactor](refactor.md). For a single-pass maintainability bar without fan-out, read and follow [`thermo-nuclear-code-quality-review`](../../thermo-nuclear-code-quality-review/SKILL.md).

**Reply:** scope, lenses, ranked findings, next handoff (interrogate, workshop, pr-comments, or none).
