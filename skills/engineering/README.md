# Engineering

Daily code work.

- [babysit](babysit/SKILL.md) — own the merge frontier until merge-ready: declare a mode (`drive` / `background` / `threads-only` / `check`), watch forge checks and threads, classify CI flakes, and triage bot review skeptically without merging.
- [bump-deps](bump-deps/SKILL.md) — safely upgrade packages, runtimes, and Docker base images one at a time on a fresh branch, validating after each.
- [changelog](changelog/SKILL.md) — generate a user-facing changelog from a commit range and flag every breaking API change a merged PR introduced, with before/after and migration steps.
- [cortex](cortex/SKILL.md) — engineering meta-router: restate the goal, match a playbook, copy steps into a todolist, apply session gates, and route into sibling Pixxle skills.
- [create-system-map](create-system-map/SKILL.md) — explain an unfamiliar repository's capabilities, APIs, construction, data, and end-to-end flows in `_system-map/`, with diagrams and hierarchical sub-agent exploration for large systems.
- [fix-bug](fix-bug/SKILL.md) — reproduce-first defect loop: same-surface repro, hypothesis binary-search with live evidence, smallest justified fix, failing-then-passing history, same-surface verify.
- [handoff](handoff/SKILL.md) — persist work across agents and sessions: handoff docs, pause/resume notes, pickup from a prior trail, and append-only decision trails.
- [no-comments](no-comments/SKILL.md) — pre-PR comment hygiene: strip unjustified comments from the scoped diff, fix accepted root-cause flags, and offer encodings for claimed constraints.
- [pr-comments](pr-comments/SKILL.md) — turn review findings into concise, inline-first PR comments and submit them as one GitHub review; brevity-first, with a human-owned verdict.
- [principles](principles/SKILL.md) — shared portable engineering principles, autonomy pause lines, and the session-gates package index used by `cortex`.
- [prototype](prototype/SKILL.md) — build a throwaway prototype (runnable terminal app or toggleable UI variations) to flesh out a design before committing.
- [shipping](shipping/SKILL.md) — independently verify then land contiguous merge-ready PRs bottom-up, with forge-aware merge hygiene and a thin optional keep-the-queue-moving note.
- [swarm-review](swarm-review/SKILL.md) — parallel multi-perspective review of a PR or change set: fan out lenses, dedupe/rank findings, hand off to workshop-findings or pr-comments.
- [thermo-nuclear-code-quality-review](thermo-nuclear-code-quality-review/SKILL.md) — an extremely strict maintainability review for abstraction quality, giant files, and spaghetti conditions.
- [thermo-nuclear-refactor](thermo-nuclear-refactor/SKILL.md) — investigate codebase simplifications through multi-agent discovery, tracing, and independent verification; show coverage, propose refactorings, and implement only accepted proposals.
- [unslop](unslop/SKILL.md) — strip AI tells and filler from replies, PR/commit text, docs, and other session prose.
- [workshop-findings](workshop-findings/SKILL.md) — walk review findings one at a time and decide the best fix for each, grill-me style, then hand a clean decision list to pr-comments.
