### Authoring a skill

**You own the skill's voice and structure for this collection.** Approved [`reflect`](../../../productivity/reflect/SKILL.md) edits and broken-skill fixes found mid-task come through here too, each in its own change.

1. Read and follow [`write-a-skill`](../../../productivity/write-a-skill/SKILL.md).
2. Follow the maintenance rules in the repo's `AGENTS.md` or `CLAUDE.md`. Folder name matches frontmatter `name`. Frontmatter keys stay within what those rules allow. Capability terms, never runtime tool names. Relative resource paths. Register in `.claude-plugin/plugin.json` and the bucket README.
3. When in doubt, delete. Keep only prose that changes a decision. Delegate to siblings by path. Don't restate them. A rule a lint, script, or check could enforce goes to [`correct`](../../correct/SKILL.md), not into more prose.
4. Validate. Run `scripts/check-skills.sh` when the repo has it, and fix every finding. Then re-run `scripts/link-skills.sh`.
5. For an edit that changes agent behavior, run the [Eval](eval.md) playbook before trusting it. A fix written from one session tends to overfit that session.
6. Run **Opening a PR**. A caller that needs its own go-ahead before the PR, such as [`reflect`](../../../productivity/reflect/SKILL.md), stops before this step and reports.

**Reply:** skill path, key design choices, validation output, eval verdict or `skip: <reason>`, registration and link notes.
