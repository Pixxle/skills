# skills

Personal agent skills for Claude Code and Codex, organised into category buckets.
Both agents discover personal skills one level below their skills directory, so
`scripts/link-skills.sh` flattens the buckets into symlinks. The same source files
are used by both agents.

## Install

**Your own machine** (skills load un-namespaced as personal skills in both agents):

```bash
git clone https://github.com/Pixxle/skills.git ~/repos/skills
~/repos/skills/scripts/link-skills.sh
```

To install for only one agent:

```bash
scripts/link-skills.sh --claude
scripts/link-skills.sh --codex
```

The destinations default to `~/.claude/skills` and `~/.codex/skills`. Set
`CLAUDE_SKILLS_DIR`, `CODEX_SKILLS_DIR`, or `CODEX_HOME` to override them.

**Claude plugin install** (installs as a namespaced plugin from `.claude-plugin/plugin.json`):

```bash
npx skills@latest add Pixxle/skills
```

Run `scripts/list-skills.sh` to see everything, grouped by bucket.

## Skills

### Engineering
- [bump-deps](skills/engineering/bump-deps/SKILL.md) — safely upgrade deps one at a time, validating after each.
- [changelog](skills/engineering/changelog/SKILL.md) — generate a user-facing changelog from a commit range and flag every breaking API change a merged PR introduced.
- [handoff](skills/engineering/handoff/SKILL.md) — compact the conversation into a handoff doc.
- [map-system](skills/engineering/map-system/SKILL.md) — produce a deep, evidence-backed map of how a system is built.
- [pr-comments](skills/engineering/pr-comments/SKILL.md) — turn existing findings into concise inline GitHub review comments.
- [prototype](skills/engineering/prototype/SKILL.md) — build a throwaway prototype to flesh out a design.
- [thermo-nuclear-code-quality-review](skills/engineering/thermo-nuclear-code-quality-review/SKILL.md) — extremely strict maintainability review.
- [workshop-findings](skills/engineering/workshop-findings/SKILL.md) — decide the best fix for each review finding before commenting.

### Productivity
- [grill-me](skills/productivity/grill-me/SKILL.md) — interview you relentlessly about a plan until shared understanding.
- [teach](skills/productivity/teach/SKILL.md) — teach a concept using a workspace-local learning record.
- [write-a-skill](skills/productivity/write-a-skill/SKILL.md) — create new agent skills with proper structure.

### Writing

- [compose-blog-post](skills/writing/compose-blog-post/SKILL.md) — coordinate the full flow from thoughts to a finished article.
- [writing-interview](skills/writing/writing-interview/SKILL.md) — develop an idea through a collaborative Socratic interview.
- [writing-fragments](skills/writing/writing-fragments/SKILL.md) — gather concrete examples, observations, and phrases before drafting.
- [writing-beats](skills/writing/writing-beats/SKILL.md) — build a narrative one agreed beat at a time.
- [writing-shape](skills/writing/writing-shape/SKILL.md) — shape the structure and working draft, or revise an existing draft.
- [writing-blog-post](skills/writing/writing-blog-post/SKILL.md) — compose the final article in Dennis's voice, with destination-specific output.

### Security
- [deep-review](skills/security/deep-review/SKILL.md) — verified architectural deep-dive hunting for code-judo simplifications.

### Misc
- [caveman](skills/misc/caveman/SKILL.md) — ultra-compressed communication mode.
