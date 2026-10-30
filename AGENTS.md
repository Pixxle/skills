# Skills repo conventions

Personal Claude Code and Codex skills and agents, in flat folders: `skills/<name>/` and `agents/`.

## How skills and agents reach the runtimes

Claude Code discovers personal skills at `~/.claude/skills/<name>/SKILL.md`. Codex still reads the deprecated `$CODEX_HOME/skills` (default `~/.codex/skills`) next to its documented user root, `~/.agents/skills`. `scripts/link-skills.sh` symlinks each `skills/<name>` into `~/.claude/skills` and `$CODEX_HOME/skills`, so both runtimes see the same names. It prunes its stale links there, such as old bucket paths. It also installs each `agents/<name>.md`, as a symlink in `~/.claude/agents/` and as a generated TOML role in `$CODEX_HOME/agents/`. Pass `--claude` or `--codex` to install for one runtime. Restart Claude Code once after the first install creates `~/.claude/agents/`.

Claude Code loads the linked skills un-namespaced. Codex follows each symlink back into this repo, finds `.claude-plugin/plugin.json`, and lists the skills as `pixxle-skills:<name>`.

`npx skills@latest add Pixxle/skills` copies or links each skill listed in `.claude-plugin/plugin.json` into `.claude/skills/` and `.agents/skills/`, or with `-g` into `~/.claude/skills/` and `~/.agents/skills/`. It installs plain skill folders, not a plugin, and skips the agents. Don't combine it with `link-skills.sh` on one machine. A global install claims the same `~/.claude/skills/<name>` paths, and Codex loads its `~/.agents/skills` copies next to the linked `pixxle-skills:<name>` entries.

## Maintenance rules

- A skill is a folder `skills/<name>/` holding an uppercase `SKILL.md` and any bundled resources. The folder name equals the frontmatter `name`, in lowercase kebab-case, at most 64 characters, and unique.
- Frontmatter holds `name`, `description`, and `disable-model-invocation: true`. The description says what the skill does and when to use it ("Use when ...").
- A principle is `skills/principles/<name>.md`, with a `# Title` first line and no frontmatter. `skills/principles/SKILL.md` links every principle file. Link a principle with its title as the link text, and never call it a skill.
- `disable-model-invocation: true` makes every skill explicit-only in Claude Code: the user starts it by name. Codex reads no such flag, and no skill ships `agents/openai.yaml`, so Codex can invoke a skill implicitly. A router or another skill loads a skill by link, so a routed step runs the real skill, not a freestyled copy.
- In skills and agents, a backticked skill name is always the text of a link to its `SKILL.md`. A router links each skill it routes to.
- To load a skill from another skill, open its `SKILL.md` with a file read at the relative link. Never invoke it as a skill or by bare name. Claude Code blocks that call and tells the model not to reproduce the skill another way.
- From a skill, link a skill as `../<name>/SKILL.md`, a principle as `../principles/<name>.md`, and an agent as `../../agents/<name>.md`. A cortex playbook adds one `../`. Inside `principles/`, link a principle as `<name>.md`. Resolve bundled resources from the skill directory. Installed skills are symlinks, so resolve a link from the skill directory's real path. Trimming `..` from the installed path lands outside the repo. Never hard-code `~/.claude/skills` or `~/.codex/skills`.
- Describe tool use by capability ("spawn subagents in parallel"), never by a runtime tool name or a model slug.
- List every skill in the `skills` array of `.claude-plugin/plugin.json` (`./skills/<name>`) and in the `## Skills` section of `README.md` (`[name](skills/name/SKILL.md)`).
- An agent is `agents/<name>.md` with only `name` and `description` frontmatter, between bare `---` lines, one plain `key: value` per line. The file name equals `name`. The description is one plain line without `: ` or ` #`. The body is non-empty and never contains `'''`. Never edit the generated Codex TOML.
- An agent body points at a skill by its path in the runtime's skills directory, such as `how/SKILL.md` or `principles/SKILL.md`. A relative link only helps human readers. The Codex role is a copy in `$CODEX_HOME/agents/`, where `../skills/` does not exist.
- The `agents` array of `.claude-plugin/plugin.json` lists exactly the files in `agents/`. That array replaces the plugin's default `agents/` scan, so an unlisted agent never reaches a plugin install.
- `NOTICE.md` lists every skill, playbook, script, principle, and agent derived from pstack or Cursor's thermos plugin.
- Re-run `scripts/link-skills.sh` after adding, renaming, or removing a skill or agent.

## Checks

- `scripts/check-skills.sh` checks the repo against these rules and prints each problem as `file:line: message`. `--installed` also checks this machine's skill links and agent installs. Add `--claude` or `--codex` to check one runtime after a one-runtime install. Keep `--installed` out of CI.
- `scripts/test-check-skills.sh` proves the checker catches each rule it claims, on fixtures in a temp dir.
- CI (`.github/workflows/check-skills.yml`) runs both scripts, plus the `node:test` suites in `skills/babysit/scripts/watch-pr/` and `skills/cortex/scripts/`, on every push and pull request.
- The pre-commit hook runs `check-skills.sh` on the staged tree, so a skill folder left out of `git add` fails the commit. Enable it once per clone with `git config core.hooksPath .githooks`.

## Rule to enforcer

| Rule | Enforced by |
| --- | --- |
| Skill folder shape, uppercase `SKILL.md`, name equals folder | `check-skills.sh` |
| Skill names unique | `check-skills.sh`, and `link-skills.sh` aborts |
| Frontmatter keys and a non-empty description | `check-skills.sh` |
| Description says what and when | Review only |
| Every skill sets `disable-model-invocation: true` | `check-skills.sh` |
| Principle file shape, and the lookup links each one | `check-skills.sh` |
| Skills reached by link, not bare name | `check-skills.sh` for backticked names outside a link to the skill's `SKILL.md`, review for other prose |
| Relative links resolve and stay in the repo | `check-skills.sh` |
| Capability terms, no runtime tool names or model slugs | Review only |
| `plugin.json` is valid JSON | `check-skills.sh`, where `python3` runs |
| `plugin.json` skills array equals the skill set | `check-skills.sh` |
| `plugin.json` agents array equals `agents/` | `check-skills.sh` |
| `README.md` links every skill | `check-skills.sh` |
| Agent frontmatter and body shape | `check-skills.sh`, as strict as `link-skills.sh`, which aborts the install |
| Agent bodies point at skills by runtime path | Review only |
| Generated Codex TOML stays unedited | `link-skills.sh` overwrites local edits on the next run |
| Stale repo links leave the runtimes | `link-skills.sh` prunes them |
| `NOTICE.md` lists everything derived from pstack or thermos | Review only |
| Installed skill links and agents match the repo | `check-skills.sh --installed`, local only |
| `CLAUDE.md` matches this file | `CLAUDE.md` imports this file |
