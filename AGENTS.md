# Skills repo conventions

This repository contains shared personal skills for Codex and Claude Code. Skills
live under `skills/<category>/<name>/` and are flattened into each agent's personal
skills directory by `scripts/link-skills.sh`.

## Maintenance rules

- Every active skill folder must contain an uppercase `SKILL.md`.
- Use only `name` and `description` in `SKILL.md` frontmatter so both agents can
  parse the same source file.
- Keep the folder name and frontmatter `name` identical and globally unique across
  category buckets.
- Describe tool use by capability, not by runtime-specific tool names. Say "spawn
  sub-agents in parallel" or "browse the official registry," for example.
- Resolve bundled resources relative to the skill directory; never hard-code
  `~/.claude/skills` or `~/.codex/skills`.
- Add active skills to `.claude-plugin/plugin.json` and the relevant bucket README.
  Skills under `deprecated/` belong in neither.
- Re-run `scripts/link-skills.sh` after adding, renaming, or moving a skill.
