### Authoring or modifying a skill

**You own the skill's voice.** Ask the user only what the request leaves open, and present the draft in the reply instead of holding it for review.

1. Read and follow [`write-a-skill`](../../write-a-skill/SKILL.md).
2. Run the repo's skill checker, if it has one, and fix every finding.
3. A substantive change to agent behavior → offer the [Eval](eval.md) playbook before you promote it. A bundled script → run its tests. Skip for a wording-only edit.
4. Run [Opening a PR](opening-a-pr.md).

When in doubt, delete. Keep only prose that changes a decision. Give the instruction without the reason, unless the rule confuses without one. Link other skills, principles, types, READMEs, and config instead of restating them. A cortex playbook starts at its first step and does not restate its routing entry. A rule a script can check belongs in that script, not in prose, per the [Encode Lessons in Structure](../../principles/encode-lessons-in-structure.md) principle.

**Reply:** summary of the skill, key design decisions, checker and eval results.
