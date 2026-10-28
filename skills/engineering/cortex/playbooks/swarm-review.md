### Swarm review

**You own framing, aggregation, and the ranked report.** Workers only report evidence-backed findings in their lens.

1. Read and follow [`swarm-review`](../../swarm-review/SKILL.md). Fan out lenses in parallel; dedupe and severity-triage yourself.
2. If the user wants remedies decided one-by-one, continue with [`workshop-findings`](../../workshop-findings/SKILL.md).
3. If the user wants findings posted as a forge review, hand the clean list to [`pr-comments`](../../pr-comments/SKILL.md).
4. Do not implement fixes unless asked. Whole-repo structural hunts → **Refactor**. Single-pass maintainability bar without fan-out → [`thermo-nuclear-code-quality-review`](../../thermo-nuclear-code-quality-review/SKILL.md).

**Reply:** scope, lenses, ranked findings, next handoff (workshop / pr-comments / none).
