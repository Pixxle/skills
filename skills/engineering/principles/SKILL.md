---
name: principles
description: Index of the 24 principle-* leaf skills, autonomy pause lines, and the session-gates package that cortex loads. Use when starting multi-step code work, opening a PR, acting under autonomy, finding the principle leaf that fits a decision, or when cortex (or another eng orchestrator) needs the shared gates package.
disable-model-invocation: true
---

# Principles

Lean session-wide defaults for code work. Index only. Playbook selection lives in [`cortex`](../cortex/SKILL.md). Niche owners stay linked under Related niches.

| Gate | Skill | Fires when |
| --- | --- | --- |
| Principles + autonomy | this file | Multi-step work, design forks, autonomy grants |
| Principle leaves | the 24 `principle-*` links below | A principle is about to shape a decision |
| Prose cleanup | [`unslop`](../unslop/SKILL.md) | Any prose surface |
| Pre-PR comment hygiene | [`no-comments`](../no-comments/SKILL.md) | Before asking for review of your own change |
| Pause, pickup, decision trail | [`handoff`](../handoff/SKILL.md) | Session stop, resume, long or unattended runs |

Open each linked `SKILL.md` by file read.

## Principles

Read the leaf skill in full for any principle you apply. Each entry names when it applies. Cite only leaves you read this session, and name the choice each changed.

**Core**

- [`principle-laziness-protocol`](../principle-laziness-protocol/SKILL.md). Refactoring, sizing a diff, or tempted to add abstractions, layers, or signal threading.
- [`principle-foundational-thinking`](../principle-foundational-thinking/SKILL.md). Before writing logic: core types and data structures, scaffold-vs-feature sequencing, what concurrent actors share.
- [`principle-redesign-from-first-principles`](../principle-redesign-from-first-principles/SKILL.md). Integrating a new requirement into an existing design.
- [`principle-attack-the-premise`](../principle-attack-the-premise/SKILL.md). Two or more fixes that share one premise have failed the same gate.
- [`principle-subtract-before-you-add`](../principle-subtract-before-you-add/SKILL.md). Sequencing an addition, refactor, or rewrite.
- [`principle-minimize-reader-load`](../principle-minimize-reader-load/SKILL.md). Reviewing or shaping code that is hard to trace.
- [`principle-outcome-oriented-execution`](../principle-outcome-oriented-execution/SKILL.md). Planned rewrites and migrations with explicit phase boundaries.
- [`principle-experience-first`](../principle-experience-first/SKILL.md). Product, UX, or feature-scope tradeoffs.
- [`principle-exhaust-the-design-space`](../principle-exhaust-the-design-space/SKILL.md). A novel interaction or architectural decision with no precedent.
- [`principle-build-the-lever`](../principle-build-the-lever/SKILL.md). Any non-trivial work. Build the tool that does or proves it.

**Architecture**

- [`principle-model-the-domain`](../principle-model-the-domain/SKILL.md). Writing stateful logic, or code that branches a lot or repeats a shape assumption across files.
- [`principle-boundary-discipline`](../principle-boundary-discipline/SKILL.md). Wiring validation, error handling, or framework adapters.
- [`principle-type-system-discipline`](../principle-type-system-discipline/SKILL.md). Designing types or a signature in any typed language.
- [`principle-make-operations-idempotent`](../principle-make-operations-idempotent/SKILL.md). Commands, lifecycle steps, or loops amid crashes and retries.
- [`principle-migrate-callers-then-delete-legacy-apis`](../principle-migrate-callers-then-delete-legacy-apis/SKILL.md). Introducing a new internal API while old callers exist.
- [`principle-separate-before-serializing-shared-state`](../principle-separate-before-serializing-shared-state/SKILL.md). Concurrent actors might write the same file, branch, key, or object.

**Verification**

- [`principle-prove-it-works`](../principle-prove-it-works/SKILL.md). After a task, before declaring done.
- [`principle-fix-root-causes`](../principle-fix-root-causes/SKILL.md). Debugging, and before you add a guard where a symptom appeared.
- [`principle-sequence-verifiable-units`](../principle-sequence-verifiable-units/SKILL.md). Multi-step work and how you stack commits and PRs.
- [`principle-test-behavior-not-implementation`](../principle-test-behavior-not-implementation/SKILL.md). Writing, changing, or keeping a test.
- [`principle-explain-the-number`](../principle-explain-the-number/SKILL.md). Before you measure, trust, report, or act on a measured number.

**Delegation**

- [`principle-guard-the-context-window`](../principle-guard-the-context-window/SKILL.md). Context fills up with large outputs, long files, repeated reads, or fan-out planning.
- [`principle-never-block-on-the-human`](../principle-never-block-on-the-human/SKILL.md). Tempted to ask "should I do X?" on reversible work. The Always-pause list still binds.

**Meta**

- [`principle-encode-lessons-in-structure`](../principle-encode-lessons-in-structure/SKILL.md). Writing the same instruction a second time, or a recurring correction.

## Autonomy

**Just do it.** Reversible work proceeds without asking. [`principle-never-block-on-the-human`](../principle-never-block-on-the-human/SKILL.md) holds the full rule.

**Always pause** for irreversible writes: force-push to a shared or protected branch, deploy or production mutate, data deletion or irreversible migrations, outbound customer or public messages, merge or land when the user did not ask to ship.

**Full-autonomy grant.** "Don't stop" / "going to bed" / "run until done" / "be fully autonomous" / "trust it when I'm back" → keep going on reversible work and keep a decision trail via [`handoff`](../handoff/SKILL.md). Named gates and the Always-pause list still need the operator.

**No is an acceptable answer.** Decline, push back, or say the work does not earn its place when that is true. Candor over sycophancy.

## Related niches

- Structural maintainability review → [`thermo-nuclear-code-quality-review`](../thermo-nuclear-code-quality-review/SKILL.md)
- Full-scale refactoring of the whole system → [`thermo-nuclear-refactor`](../thermo-nuclear-refactor/SKILL.md)
- Blog and long-form AI-tell scrub → [`ai-tells`](../../writing/writing-blog-post/references/ai-tells.md)
- Ultra-compressed chat → [`caveman`](../../misc/caveman/SKILL.md)
- Review comment voice on a PR → [`pr-comments`](../pr-comments/SKILL.md)
