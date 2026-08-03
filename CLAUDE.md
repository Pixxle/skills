# Skills repo conventions

Personal Claude Code and Codex skills, organised into category buckets under `skills/`:

- `engineering/` — daily code work
- `productivity/` — daily non-code workflow tools
- `writing/` — drafting and shaping prose
- `security/` — audit, review, and pen-test skills
- `misc/` — kept around but rarely used
- `deprecated/` — no longer used (excluded from everything below)

## How skills reach agents

Claude Code only discovers skills **one level deep** at `~/.claude/skills/<name>/SKILL.md`
— it does not recurse into category folders. Codex uses the equivalent
`~/.codex/skills/<name>/SKILL.md` layout. So the buckets here are organisational
only; `scripts/link-skills.sh` flattens them into both personal skill directories.

- **This machine:** run `scripts/link-skills.sh`. Skills load as *personal* skills
  in both agents. Pass `--claude` or `--codex` to install for only one.
- **Another machine / sharing:** `npx skills@latest add Pixxle/skills` installs from
  `.claude-plugin/plugin.json` as a *namespaced plugin*.
- For Claude Code, don't combine the personal-link and plugin install methods on
  the same machine — the skills would load twice.

## Maintenance rules

Every skill in `engineering/`, `productivity/`, `writing/`, `security/`, or `misc/` must:
- have an entry in `.claude-plugin/plugin.json`, and
- be listed in its bucket's `README.md` (skill name linked to its `SKILL.md`).

Skills in `deprecated/` must appear in neither.

Each skill is a folder named after the skill, containing `SKILL.md` (uppercase) plus any
bundled resources. Keep frontmatter portable: use only `name` and `description`.
Write tool instructions in capability terms (for example, "spawn sub-agents in
parallel"), not with a Claude- or Codex-specific tool name. Re-run
`scripts/link-skills.sh` after adding, renaming, or moving a skill.
