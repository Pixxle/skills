---
name: principles
description: Index of the 24 principle-* leaf skills, with the combinations, autonomy pause lines, and the session-gates package that cortex loads. Use when starting multi-step code work, opening a PR, acting under autonomy, finding the principle leaf that fits a decision, or when cortex (or another eng orchestrator) needs the shared gates package.
disable-model-invocation: true
---

# Principles

Lean session-wide defaults for code work. Not a code-quality review rubric, which stays with [`thermo-nuclear-code-quality-review`](../thermo-nuclear-code-quality-review/SKILL.md). Not blog anti-slop, which stays with writing [`ai-tells`](../../writing/writing-blog-post/references/ai-tells.md) and [`caveman`](../../misc/caveman/SKILL.md).

## Package (for cortex)

This skill is the index. Load it, then route to siblings by trigger. Playbook selection lives in [`cortex`](../cortex/SKILL.md), not here.

| Gate | Skill | Fires when |
| --- | --- | --- |
| Principles + autonomy | `principles` (this file) | Multi-step work, design forks, autonomy grants |
| Principle leaves | The 24 `principle-*` skills linked under Principles | A principle is about to shape a decision |
| Prose cleanup | [`unslop`](../unslop/SKILL.md) | Any prose surface: replies, PR/commit text, docs |
| Pre-PR comment hygiene | [`no-comments`](../no-comments/SKILL.md) | Before you ask for review of your own change |
| Pause, pickup, decision trail | [`handoff`](../handoff/SKILL.md) | Session stop, resume, long or unattended runs |

Cortex reads this package at session start and at Opening-a-PR through the links above. Every skill here is explicit-only, this one and each principle leaf included, so each loads by link, never by name. Open each one's SKILL.md with a file read at the relative link, resolved from this skill directory's real path. Never invoke one as a skill; Claude Code blocks that call and tells the model not to reproduce the skill another way. Do not fork the thermo-nuclear skills, writing [`ai-tells`](../../writing/writing-blog-post/references/ai-tells.md), or [`caveman`](../../misc/caveman/SKILL.md) into the gates.

## Principles

Each principle is its own explicit-only leaf skill. Each entry below links the leaf, names when it applies, and gives its gist. The gist is not the rule. Before a principle shapes a decision, read its leaf in full. Keep the set small; prefer deletion over new abstraction.

When a principle shapes a decision, name it and the specific choice it changed. Cite only principles you applied this session, and only leaves you read in full this session.

### Core

- [`principle-laziness-protocol`](../principle-laziness-protocol/SKILL.md). Refactoring, sizing a diff, or tempted to add abstractions, layers, or signal threading. Bias to deletion and the smallest change that solves the problem.
- [`principle-foundational-thinking`](../principle-foundational-thinking/SKILL.md). Before writing logic, when choosing core types and data structures, sequencing scaffold before features, or asking what concurrent actors share. Get the data shape right so downstream code becomes obvious.
- [`principle-redesign-from-first-principles`](../principle-redesign-from-first-principles/SKILL.md). Integrating a new requirement into an existing design. Redesign as if it had been foundational from day one.
- [`principle-attack-the-premise`](../principle-attack-the-premise/SKILL.md). Two or more fixes that share one premise have failed the same gate. Write the premise down and test it directly before you write another fix that assumes it.
- [`principle-subtract-before-you-add`](../principle-subtract-before-you-add/SKILL.md). Sequencing an addition, refactor, or rewrite. Remove dead weight first, then build on the simpler base.
- [`principle-minimize-reader-load`](../principle-minimize-reader-load/SKILL.md). Reviewing or shaping code that is hard to trace. Count layers and hidden state, collapse one-caller wrappers, shrink mutable scope.
- [`principle-outcome-oriented-execution`](../principle-outcome-oriented-execution/SKILL.md). Planned rewrites and migrations with explicit phase boundaries. Converge on the target architecture instead of keeping throwaway compatibility states alive.
- [`principle-experience-first`](../principle-experience-first/SKILL.md). Product, UX, or feature-scope tradeoffs. Choose user delight over implementation convenience.
- [`principle-exhaust-the-design-space`](../principle-exhaust-the-design-space/SKILL.md). A novel interaction or architectural decision with no precedent in the codebase. Build 2-3 competing prototypes and compare them before committing.
- [`principle-build-the-lever`](../principle-build-the-lever/SKILL.md). Any non-trivial work. Build the tool that does or proves it (codemod, script, generator, re-runnable check) instead of hand-applying the edit. The tool is the artifact a reviewer reruns.

### Architecture

- [`principle-model-the-domain`](../principle-model-the-domain/SKILL.md). Writing stateful logic, or code that branches a lot or repeats a shape assumption across files. Encode the domain in a structure (state machine, typed model, table or registry, reducer, boundary, the right collection) instead of scattered conditionals.
- [`principle-boundary-discipline`](../principle-boundary-discipline/SKILL.md). Wiring validation, error handling, or framework adapters. Guard at system boundaries, trust internal types, keep business logic pure.
- [`principle-type-system-discipline`](../principle-type-system-discipline/SKILL.md). Designing types or a signature in any typed language. Make illegal states unrepresentable, brand primitives, parse external data at boundaries.
- [`principle-make-operations-idempotent`](../principle-make-operations-idempotent/SKILL.md). Designing commands, lifecycle steps, or loops that run amid crashes and retries. Converge to the same end state.
- [`principle-migrate-callers-then-delete-legacy-apis`](../principle-migrate-callers-then-delete-legacy-apis/SKILL.md). Introducing a new internal API while old callers exist. Migrate the callers and delete the old API in one wave.
- [`principle-separate-before-serializing-shared-state`](../principle-separate-before-serializing-shared-state/SKILL.md). Concurrent actors might write the same file, branch, key, or object. Eliminate the sharing first, and serialize structurally only when one shared writer is a real invariant.

### Verification

- [`principle-prove-it-works`](../principle-prove-it-works/SKILL.md). After a task, before declaring done. Verify the real artifact on the real surface, not a proxy, a self-report, or "it compiles."
- [`principle-fix-root-causes`](../principle-fix-root-causes/SKILL.md). Debugging, and before you add a guard, retry, or caught error where a symptom appeared. Fix the first place the system went wrong. A guard is a fix only when the state it handles is legitimate.
- [`principle-sequence-verifiable-units`](../principle-sequence-verifiable-units/SKILL.md). Multi-step work (sweeps, migrations, runs of similar edits) and how you stack commits and PRs. Break the work into small units that each end in a check, verify each before the next, and order delivery so the sequence proves itself.
- [`principle-test-behavior-not-implementation`](../principle-test-behavior-not-implementation/SKILL.md). Writing, changing, or keeping a test. Assert what the code's users can observe, so the test fails when that behavior breaks and keeps passing when only the internals change.
- [`principle-explain-the-number`](../principle-explain-the-number/SKILL.md). Before you measure, and before you trust, report, or act on a number you measured (a speedup, a regression, a throughput, a latency, an eval result). Name what limits it, and rule out that it measured something other than the work you think.

### Delegation

- [`principle-guard-the-context-window`](../principle-guard-the-context-window/SKILL.md). Context fills up with large outputs, long files, repeated reads, or fan-out planning. Route bulk to subagents and keep their summaries in the main thread.
- [`principle-never-block-on-the-human`](../principle-never-block-on-the-human/SKILL.md). Tempted to ask "should I do X?" on reversible work. Proceed, present the result, and let the human course-correct. The Always-pause list in [Autonomy](#autonomy) still binds.

### Meta

- [`principle-encode-lessons-in-structure`](../principle-encode-lessons-in-structure/SKILL.md). You catch yourself writing the same instruction a second time, or see a recurring correction. Encode it as a lint, check, type, metadata flag, or script instead of more text.

## Combinations

These fire together. Name the combo when it shaped the work. Read each linked leaf in full before you apply the combo.

- **Prove it works ∩ Laziness** ([`principle-prove-it-works`](../principle-prove-it-works/SKILL.md) with [`principle-laziness-protocol`](../principle-laziness-protocol/SKILL.md)). Ship the smallest change the evidence justifies. Belt-and-suspenders that "might help" fails both.
- **Sequence verifiable units ∩ Prove it works** ([`principle-sequence-verifiable-units`](../principle-sequence-verifiable-units/SKILL.md) with [`principle-prove-it-works`](../principle-prove-it-works/SKILL.md)). Each unit's check is a real-surface check, not "it compiles." Failing-then-passing commit order is the stacked form.
- **Just do it ∩ Always pause ∩ Handoff trail.** Reversible work proceeds, per [`principle-never-block-on-the-human`](../principle-never-block-on-the-human/SKILL.md). Irreversible writes stop at the Always-pause list in [Autonomy](#autonomy). A full-autonomy grant keeps an append-only decision trail in the decision-trail mode of [`handoff`](../handoff/SKILL.md). The pause list still binds under the grant.
- **Opening-a-PR = Unslop ∩ No-comments.** Before review-ready or asking for a PR review, read and follow [`unslop`](../unslop/SKILL.md) on PR and commit prose and [`no-comments`](../no-comments/SKILL.md) on the scoped diff. Do this after [`principle-prove-it-works`](../principle-prove-it-works/SKILL.md) and [`principle-sequence-verifiable-units`](../principle-sequence-verifiable-units/SKILL.md) already hold on the change itself.

## Autonomy

**Just do it.** Reversible work proceeds without asking: code edits, local commits on your branch, draft notes, ticket updates that are easy to undo, kicking off read-only checks. [`principle-never-block-on-the-human`](../principle-never-block-on-the-human/SKILL.md) holds the full rule.

**Always pause** for irreversible writes, even under a grant that covers reversible work:

- Force-push to a shared or protected branch
- Deploy / production mutate
- Data deletion or irreversible migrations
- Outbound customer or public messages
- Merge or land when the user did not ask to ship

**Full-autonomy grant.** Phrases like "don't stop", "going to bed", "run until done", "be fully autonomous", or "trust it when I'm back" mean: keep going on reversible work, do not park reversible questions, and keep a decision trail in the decision-trail mode of [`handoff`](../handoff/SKILL.md). Gates the operator named and the Always-pause list still need the operator. For a product or preference call only the operator can make, apply a clear default, report it with a full explanation, and say in plain words what they could tell you to do instead. Never invent a shorthand token for them to type back.

**No is an acceptable answer.** Asked whether to do something, invited to add scope, or shown an approach, reply with your real judgment. Decline, push back, or say the work does not earn its place when that is true. A recommendation is a judgment, not a validation. Candor over sycophancy.

## Related niches (reuse, don't duplicate)

Each niche has its own owner. When one applies, read and follow the linked file instead of restating it here.

- Structural maintainability review → [`thermo-nuclear-code-quality-review`](../thermo-nuclear-code-quality-review/SKILL.md)
- Full-scale refactoring of the whole system → [`thermo-nuclear-refactor`](../thermo-nuclear-refactor/SKILL.md). A focused refactor follows the cortex [Refactor](../cortex/playbooks/refactor.md) playbook instead.
- Blog and long-form AI-tell scrub → [`ai-tells`](../../writing/writing-blog-post/references/ai-tells.md) in [`writing-blog-post`](../../writing/writing-blog-post/SKILL.md)
- Ultra-compressed chat → [`caveman`](../../misc/caveman/SKILL.md)
- Review comment voice on a PR → [`pr-comments`](../pr-comments/SKILL.md)
