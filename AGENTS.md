# Skills repo conventions

Personal Claude Code and Codex skills and agents. Skills live in category buckets under `skills/`. The buckets only group the source.

- `engineering/` for daily code work
- `productivity/` for daily non-code workflow tools
- `writing/` for drafting and shaping prose
- `security/` for audit, review, and pen-test skills
- `misc/` for skills kept around but rarely used
- `deprecated/` for skills no longer used, excluded from every rule below

## How skills and agents reach the runtimes

Claude Code discovers personal skills at `~/.claude/skills/<name>/SKILL.md`. Codex scans each skill root recursively, up to six levels deep. It still reads the deprecated `$CODEX_HOME/skills` (default `~/.codex/skills`) next to its documented user root, `~/.agents/skills`. `scripts/link-skills.sh` flattens the buckets into symlinks in `~/.claude/skills` and `$CODEX_HOME/skills`, so both runtimes see the same names. It also installs each repo-root `agents/<name>.md`, as a symlink in `~/.claude/agents/` and as a generated TOML role in `$CODEX_HOME/agents/`. Pass `--claude` or `--codex` to install for one runtime. Restart Claude Code once after the first install creates `~/.claude/agents/`.

Claude Code loads the linked skills un-namespaced. Codex follows each symlink back into this repo, finds `.claude-plugin/plugin.json`, and lists the skills as `pixxle-skills:<name>`.

`npx skills@latest add Pixxle/skills` copies or links each skill listed in `.claude-plugin/plugin.json` into `.claude/skills/` and `.agents/skills/`, or with `-g` into `~/.claude/skills/` and `~/.agents/skills/`. It installs plain skill folders, not a plugin, and skips the agents. Don't combine it with `link-skills.sh` on one machine. A global install claims the same `~/.claude/skills/<name>` paths, and Codex loads its `~/.agents/skills` copies next to the linked `pixxle-skills:<name>` entries.

## Maintenance rules

- A skill is a folder `skills/<bucket>/<name>/` holding an uppercase `SKILL.md` and any bundled resources. The folder name equals the frontmatter `name`, in lowercase kebab-case, at most 64 characters, and unique across buckets.
- Frontmatter holds `name`, `description`, and `disable-model-invocation: true`. The description says what the skill does and when to use it ("Use when ...").
- Every skill is explicit-only. It sets `disable-model-invocation: true` and ships `<skill>/agents/openai.yaml` setting `policy.allow_implicit_invocation: false`. Claude Code reads the first and Codex the second, so both hide the skill from the model. The user starts a skill by name. A router or another skill loads it by link, so a routed step always runs the real skill instead of a freestyled copy.
- In skills and agents, a backticked skill name is always the text of a link to its `SKILL.md`. A router links each skill it routes to.
- To load a skill from another skill, open its `SKILL.md` with a file read at the relative link. Never invoke it as a skill or by bare name. Claude Code blocks that call and tells the model not to reproduce the skill another way.
- Link a sibling as `../<name>/SKILL.md` in the same bucket and `../../<bucket>/<name>/SKILL.md` across buckets. Resolve bundled resources from the skill directory. Installed skills are symlinks, so resolve a link from the skill directory's real path. Trimming `..` from the installed path lands outside the repo. Never hard-code `~/.claude/skills` or `~/.codex/skills`.
- Describe tool use by capability ("spawn subagents in parallel"), never by a runtime tool name or a model slug.
- List every active skill in the `skills` array of `.claude-plugin/plugin.json` and in its bucket `README.md` as `[name](name/SKILL.md)`. Deprecated skills appear in neither.
- An agent is `agents/<name>.md` with only `name` and `description` frontmatter, between bare `---` lines, one plain `key: value` per line. The file name equals `name`. The description is one plain line without `: ` or ` #`. The body is non-empty and never contains `'''`. Never edit the generated Codex TOML.
- An agent body points at a skill by its path in the runtime's skills directory, such as `how/SKILL.md`. A relative link only helps human readers. The Codex role is a copy in `$CODEX_HOME/agents/`, where `../skills/<bucket>/` does not exist.
- The `agents` array of `.claude-plugin/plugin.json` lists exactly the files in `agents/`. That array replaces the plugin's default `agents/` scan, so an unlisted agent never reaches a plugin install.
- `NOTICE.md` lists every skill, playbook, script, and agent derived from pstack or Cursor's thermos plugin.
- Re-run `scripts/link-skills.sh` after adding, renaming, moving, or removing a skill or agent.

## Checks

- `scripts/check-skills.sh` checks the repo against these rules and prints each problem as `file:line: message`. `--installed` also checks this machine's skill links and agent installs. Add `--claude` or `--codex` to check one runtime after a one-runtime install. Keep `--installed` out of CI.
- `scripts/test-check-skills.sh` proves the checker catches each rule it claims, on fixtures in a temp dir.
- CI (`.github/workflows/check-skills.yml`) runs both scripts, plus the `node:test` suites in `skills/engineering/babysit/scripts/watch-pr/` and `skills/engineering/cortex/scripts/`, on every push and pull request.
- The pre-commit hook runs `check-skills.sh` on the staged tree, so a skill folder left out of `git add` fails the commit. Enable it once per clone with `git config core.hooksPath .githooks`.

## Rule to enforcer

| Rule | Enforced by |
| --- | --- |
| Skill folder shape, uppercase `SKILL.md`, name equals folder | `check-skills.sh` |
| Skill names unique across buckets | `check-skills.sh`, and `link-skills.sh` aborts |
| Frontmatter keys and a non-empty description | `check-skills.sh` |
| Description says what and when | Review only |
| Every skill explicit-only, with `disable-model-invocation: true` and `agents/openai.yaml` | `check-skills.sh` |
| Skills reached by link, not bare name | `check-skills.sh` for backticked names outside a link to the skill's `SKILL.md`, review for other prose |
| Relative links resolve, stay in the repo, and skip `deprecated/` | `check-skills.sh` |
| Capability terms, no runtime tool names or model slugs | Review only |
| `plugin.json` is valid JSON | `check-skills.sh`, where `python3` runs |
| `plugin.json` skills array equals the active set | `check-skills.sh` |
| `plugin.json` agents array equals `agents/` | `check-skills.sh` |
| Bucket README links every skill and no inactive one | `check-skills.sh` |
| Agent frontmatter and body shape | `check-skills.sh`, as strict as `link-skills.sh`, which aborts the install |
| Agent bodies point at skills by runtime path | Review only |
| Generated Codex TOML stays unedited | `link-skills.sh` overwrites local edits on the next run |
| `NOTICE.md` lists every skill, playbook, script, and agent derived from pstack or thermos | Review only |
| Installed skill links and agents match the repo | `check-skills.sh --installed`, local only |
| `CLAUDE.md` matches this file | `CLAUDE.md` imports this file |
