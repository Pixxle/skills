### Visual parity

**You own pixel-exact equivalence. The baseline is the spec. You do not touch it.** An image diff proves equivalence. Your eye does not.

1. **Baseline first.** Before any migration, build a visual regression harness that screenshots the current component across its states. When you match two implementations, it screenshots the target too. No baseline, no parity claim. The baseline is a blocking prerequisite, not a follow-up.
2. **Anti-shortcut clauses.** State them in every brief and hold them. No harness modifications. No baseline tampering. No component restructuring to make a diff pass. If the baseline looks wrong, stop and ask. Do not edit it.
3. **One component at a time.** Shared primitives migrate first, as a blocking phase. Then migrate one component per unit. Parallelize across worktrees with one owner per component. Read and follow [`principle-separate-before-serializing-shared-state`](../../principle-separate-before-serializing-shared-state/SKILL.md) to split the work. Spawn the owners per [Subagents](../references/subagents.md).
4. **Verify by image diff.** Diff each component against its baseline on the matching surface. Drive that surface through the repo's `verify-*` skill (`.agents/skills/` or `.claude/skills/`) when it has one. When it has none, offer to create one, and on yes read and follow [`create-verification-skill`](../../create-verification-skill/SKILL.md). When a recipe fails against an app that works, read and follow [`maintain-verification-skill`](../../maintain-verification-skill/SKILL.md). A nonzero diff is a fail. Investigate the pixel delta. Drive each component as an [Autonomous run](autonomous-run.md) whose predicate is a zero diff against its baseline. The anti-shortcut clauses bind that run. If the baseline looks wrong, stop the run and ask the human. An inconclusive or wrong-surface run is not a pass.
5. Run [Opening a PR](opening-a-pr.md) per component or per safe batch.

**Reply:** components migrated, the diff result for each, the baseline harness location, what's left.
