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
- [bootstrap-context](skills/engineering/bootstrap-context/SKILL.md) — seed a repo's `CONTEXT.md` glossary, then offer ADRs.
- [bump-deps](skills/engineering/bump-deps/SKILL.md) — safely upgrade deps one at a time, validating after each.
- [changelog](skills/engineering/changelog/SKILL.md) — generate a user-facing changelog from a commit range and flag every breaking API change a merged PR introduced.
- [design-an-interface](skills/engineering/design-an-interface/SKILL.md) — generate several radically different interface designs in parallel.
- [grill-with-docs](skills/engineering/grill-with-docs/SKILL.md) — stress-test a plan against the domain model and update docs inline.
- [handoff](skills/engineering/handoff/SKILL.md) — compact the conversation into a handoff doc.
- [improve-codebase-architecture](skills/engineering/improve-codebase-architecture/SKILL.md) — find deepening and refactoring opportunities.
- [map-system](skills/engineering/map-system/SKILL.md) — produce a deep, evidence-backed map of how a system is built.
- [pr-comments](skills/engineering/pr-comments/SKILL.md) — turn existing findings into concise inline GitHub review comments.
- [propose-a-solution](skills/engineering/propose-a-solution/SKILL.md) — autonomously design a bold solution and write it up.
- [prototype](skills/engineering/prototype/SKILL.md) — build a throwaway prototype to flesh out a design.
- [review-with-docs](skills/engineering/review-with-docs/SKILL.md) — review a change branch against its spec with running evidence, then apply strict quality and security passes.
- [tdd](skills/engineering/tdd/SKILL.md) — red-green-refactor test-driven development.
- [tdd-backfill](skills/engineering/tdd-backfill/SKILL.md) — retrofit an existing change to look test-first.
- [thermo-nuclear-code-quality-review](skills/engineering/thermo-nuclear-code-quality-review/SKILL.md) — extremely strict maintainability review.
- [workshop-findings](skills/engineering/workshop-findings/SKILL.md) — decide the best fix for each review finding before commenting.

### Productivity
- [grill-me](skills/productivity/grill-me/SKILL.md) — interview you relentlessly about a plan until shared understanding.
- [review-adrs](skills/productivity/review-adrs/SKILL.md) — audit a repo's ADRs against the quality bar.
- [teach](skills/productivity/teach/SKILL.md) — teach a concept using a workspace-local learning record.
- [to-issues](skills/productivity/to-issues/SKILL.md) — break a plan into independently-grabbable issues.
- [to-prd](skills/productivity/to-prd/SKILL.md) — turn the conversation into a PRD on the issue tracker.
- [triage](skills/productivity/triage/SKILL.md) — triage issues through a role-driven state machine.
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
- [red-team](skills/security/red-team/SKILL.md) — dynamic penetration test against a running app, with replayable PoCs.

### Misc
- [caveman](skills/misc/caveman/SKILL.md) — ultra-compressed communication mode.
