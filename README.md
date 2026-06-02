# skills

Personal [Claude Code](https://docs.claude.com/en/docs/claude-code) skills, organised
into category buckets. Claude Code only discovers skills one level deep
(`~/.claude/skills/<name>/SKILL.md`), so `scripts/link-skills.sh` flattens the buckets
into symlinks there. See [CLAUDE.md](CLAUDE.md) for the full convention.

## Install

**Your own machine** (skills load un-namespaced as personal skills):

```bash
git clone https://github.com/Pixxle/skills.git ~/repos/skills
~/repos/skills/scripts/link-skills.sh
```

**Anywhere else** (installs as a namespaced plugin from `.claude-plugin/plugin.json`):

```bash
npx skills@latest add Pixxle/skills
```

Run `scripts/list-skills.sh` to see everything, grouped by bucket.

## Skills

### Engineering
- [bootstrap-context](skills/engineering/bootstrap-context/SKILL.md) — seed a repo's `CONTEXT.md` glossary, then offer ADRs.
- [bump-deps](skills/engineering/bump-deps/SKILL.md) — safely upgrade deps one at a time, validating after each.
- [design-an-interface](skills/engineering/design-an-interface/SKILL.md) — generate several radically different interface designs in parallel.
- [grill-with-docs](skills/engineering/grill-with-docs/SKILL.md) — stress-test a plan against the domain model and update docs inline.
- [handoff](skills/engineering/handoff/SKILL.md) — compact the conversation into a handoff doc.
- [improve-codebase-architecture](skills/engineering/improve-codebase-architecture/SKILL.md) — find deepening and refactoring opportunities.
- [map-system](skills/engineering/map-system/SKILL.md) — produce a deep, evidence-backed map of how a system is built.
- [propose-a-solution](skills/engineering/propose-a-solution/SKILL.md) — autonomously design a bold solution and write it up.
- [prototype](skills/engineering/prototype/SKILL.md) — build a throwaway prototype to flesh out a design.
- [tdd](skills/engineering/tdd/SKILL.md) — red-green-refactor test-driven development.
- [tdd-backfill](skills/engineering/tdd-backfill/SKILL.md) — retrofit an existing change to look test-first.
- [thermo-nuclear-code-quality-review](skills/engineering/thermo-nuclear-code-quality-review/SKILL.md) — extremely strict maintainability review.

### Productivity
- [grill-me](skills/productivity/grill-me/SKILL.md) — interview you relentlessly about a plan until shared understanding.
- [review-adrs](skills/productivity/review-adrs/SKILL.md) — audit a repo's ADRs against the quality bar.
- [to-issues](skills/productivity/to-issues/SKILL.md) — break a plan into independently-grabbable issues.
- [to-prd](skills/productivity/to-prd/SKILL.md) — turn the conversation into a PRD on the issue tracker.
- [triage](skills/productivity/triage/SKILL.md) — triage issues through a role-driven state machine.
- [write-a-skill](skills/productivity/write-a-skill/SKILL.md) — create new agent skills with proper structure.

### Writing
- [write-gist](skills/writing/write-gist/SKILL.md) — draft a short personal essay in Dennis's voice.
- [writing-beats](skills/writing/writing-beats/SKILL.md) — shape an article as a journey of beats.
- [writing-fragments](skills/writing/writing-fragments/SKILL.md) — mine fragments into raw material for a future article.
- [writing-shape](skills/writing/writing-shape/SKILL.md) — shape a pile of raw material into an article.

### Security
- [deep-review](skills/security/deep-review/SKILL.md) — verified architectural deep-dive hunting for code-judo simplifications.
- [red-team](skills/security/red-team/SKILL.md) — dynamic penetration test against a running app, with replayable PoCs.

### Misc
- [caveman](skills/misc/caveman/SKILL.md) — ultra-compressed communication mode.
