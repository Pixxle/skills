# skills

Personal agent skills for Claude Code and Codex. Each skill is a flat folder
under `skills/`.
`scripts/link-skills.sh` symlinks each one into each agent's skills directory,
so both agents use the same source files.

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
them. Each run also prunes links into this repo that no longer point at a skill,
such as links left from the old bucket layout. The script also installs each
`agents/<name>.md` as a Claude Code subagent and a Codex agent role. Run
`scripts/link-skills.sh --help` for the agent directory overrides.

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

## Usage

Every skill sets `disable-model-invocation: true`, so Claude Code never starts
one on its own. Codex reads no such flag and can start a skill implicitly. Type
`/<name>` to start a skill, such as `/cortex` for daily engineering work. When
cortex or another skill routes to a skill, it reads that skill's linked
`SKILL.md` and follows it, so each routed step runs the real skill.

## Skills

Run `scripts/list-skills.sh` to list every skill.

- [architect](skills/architect/SKILL.md): ground with how and why, sketch usage, types, and module boundaries through an arena of at least two distinct designs, then implement against the sketch and scrap it when friction shows the shape is wrong.
- [arena](skills/arena/SKILL.md): run N parallel candidates on one brief, each in its own git worktree, then pick a base, graft the strongest parts of the others, and verify.
- [babysit](skills/babysit/SKILL.md): own the merge frontier until merge-ready: declare a mode (`drive` / `background` / `threads-only` / `check`), drive the GitHub loop on the verdicts of its bundled `watch-pr` script, classify CI flakes, and triage bot review skeptically without merging.
- [benchmark-checklist](skills/benchmark-checklist/SKILL.md): vet a performance number before reporting or acting on it: limiter, tuning, physical limits, errors, repeatability, end-to-end relevance, and whether the work ran.
- [bro](skills/bro/SKILL.md): restate the last reply in plain words, shorter and without jargon.
- [correct](skills/correct/SKILL.md): find the mistake classes agents keep repeating in a repo and make each impossible (architecture, then types or a lint, then a test, docs last), prove each check fails on a real past mistake, and keep a rule-to-enforcer table in CLAUDE.md or AGENTS.md.
- [cortex](skills/cortex/SKILL.md): engineering agent style and meta-router: match a playbook, copy its steps into a todolist, and load each routed skill by reading its linked SKILL.md.
- [create-system-map](skills/create-system-map/SKILL.md): explain an unfamiliar repository's capabilities, APIs, construction, data, and end-to-end flows in `_system-map/`, with diagrams and hierarchical sub-agent exploration for large systems.
- [create-verification-skill](skills/create-verification-skill/SKILL.md): generate a committed project-local `verify-<app>` skill (canonical in `.agents/skills/`, symlinked from `.claude/skills/`) with Launch, Doctor, Drive, Evidence, Cleanup, and Helpers for web, CLI, API, iOS simulator, and Android emulator, plus a feature map, proven end to end before hand-off.
- [figure-it-out](skills/figure-it-out/SKILL.md): design and run a bespoke, auditable playbook when no cortex playbook fits: falsifiable done predicate, rigor scaled to stakes, keep-or-revert loop per unit, and a handoff decision trail.
- [grill-me](skills/grill-me/SKILL.md): interview you relentlessly about a plan or design until you reach shared understanding, resolving each branch of the decision tree.
- [handoff](skills/handoff/SKILL.md): persist work across agents and sessions: handoff docs, pause/resume notes, pickup from a prior trail, and append-only decision trails.
- [how](skills/how/SKILL.md): explain how code works today, in chat and read-only: one explainer for narrow questions, or 2 to 4 parallel explorers then one explainer for a subsystem (Overview, Key concepts, How it works, Where things live, Gotchas).
- [interrogate](skills/interrogate/SKILL.md): adversaries in their own worktrees try to break a change or design, and only findings proven by a rerun command survive; reports intent, verified findings with command and output, and dropped counts.
- [maintain-verification-skill](skills/maintain-verification-skill/SKILL.md): keep a project's verify skill and feature map honest with parallel read-only source readers per feature and one live pass over every feature, ending clean, changed (one PR of proven corrections), or blocked.
- [no-comments](skills/no-comments/SKILL.md): pre-PR comment hygiene: strip unjustified comments from the scoped diff, fix accepted root-cause flags, and offer encodings for claimed constraints.
- [pr-comments](skills/pr-comments/SKILL.md): turn review findings into concise, inline-first PR comments and submit them as one GitHub review; brevity-first, with a human-owned verdict.
- [principles](skills/principles/SKILL.md): lookup of each engineering principle, when it applies, and its file; cortex loads it.
- [prototype](skills/prototype/SKILL.md): build a throwaway prototype (runnable terminal app or toggleable UI variations) to flesh out a design before committing.
- [reflect](skills/reflect/SKILL.md): mine the active session transcript with three parallel reviewers (judgment, tooling, divergent) and a synthesizer, sort proposals into Accepted, Rejected, and Backlog, and apply only the skill edits you approve.
- [shipping](skills/shipping/SKILL.md): independently verify then land contiguous merge-ready PRs bottom-up, with forge-aware merge hygiene; on GitHub, watch the run with babysit's queued `watch-pr` until it reports `COMPLETE`.
- [swarm](skills/swarm/SKILL.md): fan out N parallel workers (coverage slices, races, gauntlets, or exploration), drain them, and return one report.
- [tdd](skills/tdd/SKILL.md): fix a bug with a cheap local test path by writing a focused regression test that fails before the fix and passes after it; use a closer executable check when a test is impractical.
- [thermo-nuclear-code-quality-review](skills/thermo-nuclear-code-quality-review/SKILL.md): an extremely strict, maintainability-only review for abstraction quality, giant files, and spaghetti conditions, run only when asked for by name or for that bar.
- [thermo-nuclear-refactor](skills/thermo-nuclear-refactor/SKILL.md): full-scale refactoring of the whole system only: multi-agent discovery, cross-module tracing, and independent verification; show coverage, propose refactorings, and implement only accepted proposals. A focused refactor follows the cortex [Refactoring playbook](skills/cortex/playbooks/refactoring.md).
- [to-issue](skills/to-issue/SKILL.md): propose an issue split from a conversation or RFC, then draft approved issues for AI implementation and human review.
- [unslop](skills/unslop/SKILL.md): strip AI tells and filler from replies, PR/commit text, docs, and other session prose, by numbered rules other skills cite by id.
- [why](skills/why/SKILL.md): investigate why code is shaped the way it is: build a git/PR code anchor, query each connected evidence category in parallel (issue tracker, docs, chat, observability, error tracking, analytics), and return a cited, confidence-tiered answer in chat.
- [write-a-skill](skills/write-a-skill/SKILL.md): create new agent skills with proper structure, progressive disclosure, and bundled resources.
- [write-rfc](skills/write-rfc/SKILL.md): turn a conversation into a concise RFC in Simplified Technical English, with explicit decisions and comparative trade-offs for alternatives.

## Checks

`scripts/check-skills.sh` enforces the maintenance rules in `AGENTS.md`. CI runs
it, `scripts/test-check-skills.sh`, and the `node:test` suites of the bundled
scripts on every push and pull request. To run the checker on the staged tree
before each commit, enable the hook once per clone.

```bash
git config core.hooksPath .githooks
```

`scripts/check-skills.sh --installed` also checks this machine's skill links and
agent installs for missing, dangling, stale, or shadowing entries. Add `--claude`
or `--codex` after a one-runtime install.

## Credits

Several skills derive from Lauren Tan's pstack and Cursor's thermos plugin, both
under the MIT License. See [NOTICE.md](NOTICE.md).
