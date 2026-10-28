# skills

Personal agent skills for Claude Code and Codex, organised into category buckets.
Claude Code discovers personal skills one level below its skills directory, so
`scripts/link-skills.sh` flattens the buckets into symlinks. Codex reads the same
links. The same source files are used by both agents.

## Install

### Your own machine

Claude Code loads the skills un-namespaced. Codex follows each symlink back into
this repo, finds `.claude-plugin/plugin.json`, and lists the skills as
`pixxle-skills:<name>`.

```bash
git clone https://github.com/Pixxle/skills.git ~/repos/skills
~/repos/skills/scripts/link-skills.sh
```

To install for only one agent, pass `--claude` or `--codex`.

```bash
scripts/link-skills.sh --claude
scripts/link-skills.sh --codex
```

The destinations default to `~/.claude/skills` and `~/.codex/skills`. Codex still
reads `~/.codex/skills`, though its docs now name `~/.agents/skills` as the user
location. Set `CLAUDE_SKILLS_DIR`, `CODEX_SKILLS_DIR`, or `CODEX_HOME` to override
them. The script also installs each `agents/<name>.md` as a Claude Code subagent
and a Codex agent role. Run `scripts/link-skills.sh --help` for the agent
directory overrides.

### skills CLI

This copies or links each skill listed in `.claude-plugin/plugin.json` into
`.claude/skills/` and `.agents/skills/`, or with `-g` into `~/.claude/skills/` and
`~/.agents/skills/`. It installs plain skill folders, not a plugin, and skips the
agents. Don't combine it with `link-skills.sh` on the same machine. A global
install claims the same `~/.claude/skills/<name>` paths, and Codex loads its
`~/.agents/skills` copies next to the linked ones.

```bash
npx skills@latest add Pixxle/skills
```

## Skills

Each bucket README lists its skills. Run `scripts/list-skills.sh` to see every
skill, grouped by bucket.

- [Engineering](skills/engineering/README.md) for daily code work.
- [Productivity](skills/productivity/README.md) for daily non-code workflow tools.
- [Writing](skills/writing/README.md) for drafting and shaping prose.
- [Security](skills/security/README.md) for audit, review, and pen-test skills.
- [Misc](skills/misc/README.md) for skills kept around but rarely used.

## Checks

`scripts/check-skills.sh` enforces the maintenance rules in `AGENTS.md`. CI runs
it and `scripts/test-check-skills.sh` on every push and pull request. To run it
on the staged tree before each commit, enable the hook once per clone.

```bash
git config core.hooksPath .githooks
```

`scripts/check-skills.sh --installed` also checks this machine's skill links and
agent installs for missing, dangling, stale, or shadowing entries. Add `--claude`
or `--codex` after a one-runtime install.

## Credits

Several skills derive from Lauren Tan's pstack, under the MIT License. See
[NOTICE.md](NOTICE.md).
