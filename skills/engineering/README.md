# Engineering

Daily code work.

- [architect](architect/SKILL.md) — ground with how and why, sketch usage, types, and module boundaries through an arena of at least two distinct designs, then implement against the sketch and scrap it when friction shows the shape is wrong.
- [arena](arena/SKILL.md) — run N parallel candidates on one brief, each in its own git worktree, then pick a base, graft the strongest parts of the others, and verify.
- [babysit](babysit/SKILL.md) — own the merge frontier until merge-ready: declare a mode (`drive` / `background` / `threads-only` / `check`), watch forge checks and threads, classify CI flakes, and triage bot review skeptically without merging.
- [benchmark-checklist](benchmark-checklist/SKILL.md) — vet a performance number before reporting or acting on it: limiter, tuning, physical limits, errors, repeatability, end-to-end relevance, and whether the work ran.
- [bump-deps](bump-deps/SKILL.md) — safely upgrade packages, runtimes, and Docker base images one at a time on a fresh branch, validating after each.
- [changelog](changelog/SKILL.md) — generate a user-facing changelog from a commit range and flag every breaking API change a merged PR introduced, with before/after and migration steps.
- [correct](correct/SKILL.md) — find the mistake classes agents keep repeating in a repo and make each impossible (architecture, then types or a lint, then a test, docs last), prove each check fails on a real past mistake, and keep a rule-to-enforcer table in CLAUDE.md or AGENTS.md.
- [cortex](cortex/SKILL.md) — engineering meta-router: restate the goal, match a playbook, copy steps into a todolist, apply session gates, and route into sibling Pixxle skills.
- [create-system-map](create-system-map/SKILL.md) — explain an unfamiliar repository's capabilities, APIs, construction, data, and end-to-end flows in `_system-map/`, with diagrams and hierarchical sub-agent exploration for large systems.
- [create-verification-skill](create-verification-skill/SKILL.md) — generate a committed project-local `verify-<app>` skill (canonical in `.agents/skills/`, symlinked from `.claude/skills/`) with Launch, Doctor, Drive, Evidence, Cleanup, and Helpers for web, CLI, API, iOS simulator, and Android emulator, plus a feature map, proven end to end before hand-off.
- [figure-it-out](figure-it-out/SKILL.md) — design and run a bespoke, auditable playbook when no cortex playbook fits: falsifiable done predicate, rigor scaled to stakes, keep-or-revert loop per unit, and a handoff decision trail.
- [fix-bug](fix-bug/SKILL.md) — reproduce-first defect loop: same-surface repro, hypothesis binary-search with live evidence, smallest justified fix, failing-then-passing history, same-surface verify.
- [handoff](handoff/SKILL.md) — persist work across agents and sessions: handoff docs, pause/resume notes, pickup from a prior trail, and append-only decision trails.
- [how](how/SKILL.md) — explain how code works today, in chat and read-only: one explainer for narrow questions, or 2 to 4 parallel explorers then one explainer for a subsystem (Overview, Key concepts, How it works, Where things live, Gotchas).
- [interrogate](interrogate/SKILL.md) — adversaries in their own worktrees try to break a change or design, and only findings proven by a rerun command survive; reports intent, verified findings with command and output, and dropped counts.
- [maintain-verification-skill](maintain-verification-skill/SKILL.md) — keep a project's verify skill and feature map honest with parallel read-only source readers per feature and one live pass over every feature, ending clean, changed (one PR of proven corrections), or blocked.
- [no-comments](no-comments/SKILL.md) — pre-PR comment hygiene: strip unjustified comments from the scoped diff, fix accepted root-cause flags, and offer encodings for claimed constraints.
- [pr-comments](pr-comments/SKILL.md) — turn review findings into concise, inline-first PR comments and submit them as one GitHub review; brevity-first, with a human-owned verdict.
- [principles](principles/SKILL.md) — shared portable engineering principles, autonomy pause lines, and the session-gates package index used by `cortex`.
- [prototype](prototype/SKILL.md) — build a throwaway prototype (runnable terminal app or toggleable UI variations) to flesh out a design before committing.
- [shipping](shipping/SKILL.md) — independently verify then land contiguous merge-ready PRs bottom-up, with forge-aware merge hygiene and a thin optional keep-the-queue-moving note.
- [swarm-review](swarm-review/SKILL.md) — parallel multi-perspective review of a PR or change set: fan out lenses, dedupe/rank findings, hand off to workshop-findings or pr-comments.
- [thermo-nuclear-code-quality-review](thermo-nuclear-code-quality-review/SKILL.md) — an extremely strict maintainability review for abstraction quality, giant files, and spaghetti conditions.
- [thermo-nuclear-refactor](thermo-nuclear-refactor/SKILL.md) — investigate codebase simplifications through multi-agent discovery, tracing, and independent verification; show coverage, propose refactorings, and implement only accepted proposals.
- [unslop](unslop/SKILL.md) — strip AI tells and filler from replies, PR/commit text, docs, and other session prose.
- [why](why/SKILL.md) — investigate why code is shaped the way it is: build a git/PR code anchor, query each connected evidence category in parallel (issue tracker, docs, chat, observability, error tracking, analytics), and return a cited, confidence-tiered answer in chat.
- [workshop-findings](workshop-findings/SKILL.md) — walk review findings one at a time and decide the best fix for each, grill-me style, then hand a clean decision list to pr-comments.
