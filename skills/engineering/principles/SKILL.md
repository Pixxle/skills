---
name: principles
description: Shared portable engineering principles, autonomy pause lines, and the session-gates package index. Use when starting multi-step code work, opening a PR, acting under autonomy, or when cortex (or another eng orchestrator) needs the shared gates package.
---

# Principles

Lean session-wide defaults for code work. Not a code-quality review rubric, which stays with `thermo-nuclear-code-quality-review`. Not blog anti-slop, which stays with writing `ai-tells` and `caveman`.

## Package (for cortex)

This skill is the index. Load it, then route to siblings by trigger. Playbook selection lives in [`cortex`](../cortex/SKILL.md), not here.

| Gate | Skill | Fires when |
| --- | --- | --- |
| Principles + autonomy | `principles` (this file) | Multi-step work, design forks, autonomy grants |
| Prose cleanup | [`unslop`](../unslop/SKILL.md) | Any prose surface: replies, PR/commit text, docs |
| Pre-PR comment hygiene | [`no-comments`](../no-comments/SKILL.md) | Before you ask for review of your own change |
| Pause, pickup, decision trail | [`handoff`](../handoff/SKILL.md) | Session stop, resume, long or unattended runs |

Cortex reads this package at session start and at Opening-a-PR through the links above. This skill, [`unslop`](../unslop/SKILL.md), and [`no-comments`](../no-comments/SKILL.md) are explicit-only, so they load by link, never by name. Open each one's SKILL.md with a file read at the relative link. Never invoke one as a skill; Claude Code blocks that call and tells the model not to reproduce the skill another way. Do not fork thermo, writing `ai-tells`, or `caveman` into the gates.

## Principles

Read the bullet that applies. Keep the set small; prefer deletion over new abstraction.

### Core

- **Laziness.** Bias to deletion and the smallest change that solves the problem. Consolidate a repeated decision behind one source of truth. Skip layers and signal threading that do not remove real complexity.
- **Subtract before you add.** When evolving a system, remove dead weight first, then build on the simpler base.
- **Build the lever.** For non-trivial work, build the tool that does or proves it (script, codemod, generator, re-runnable check) instead of hand-applying the same edit. The tool is the artifact a reviewer reruns. Skip only when the task is a couple of obvious edits you can see at a glance. Citing this without a lever file in the diff means you did not apply it.
- **Attack the premise.** When two or more fixes that share one premise have failed the same gate, write the premise down and test it directly before the next fix. Follow the evidence; do not stack another patch on an untested belief.

### Architecture

- **Model the domain.** Before writing logic, settle the data shape and scaffold (core types, shared structures, access patterns, what concurrent actors share). Then encode domain knowledge in that structure (typed model, state machine, table, registry, boundary) instead of scattering conditionals and shape assumptions. Prefer boring local code when the shape is already clear.
- **Boundary discipline.** Validate, parse into domain types, and handle errors at system boundaries (CLI args, config, network, external APIs), then trust internal types without re-checking. Keep business logic in pure functions and the framework shell thin. Expose domain concepts across a boundary, not its transport, storage, or wire types.
- **Type system discipline.** Make illegal states unrepresentable, brand primitives that mean different things (`UserId` and `OrderId`), and handle every variant exhaustively. Treat external data as untyped until a boundary parser turns it into the model. Derive types from the authoritative schema (OpenAPI, protobuf, migrations) instead of hand-rolling a parallel one.
- **Make operations idempotent.** A state-mutating step converges to the same end state whether it runs twice or after a crash at any point. Read the current state, compare it to the goal, and apply only the difference. Leave nothing the next run cannot judge as stale (write to a temp path then rename, compare by content rather than creation order).
- **Separate before serializing shared state.** When concurrent actors might write the same file, branch, key, or state object, give each its own write target and merge at the read boundary. Separate fields in one shared file still count as sharing. Serialize structurally (sequential phases, one writer, a lockfile, compare-and-swap) only when one shared target is a real invariant, since instructions and conventions are not concurrency control.

### Verification

- **Prove it works.** Before declaring done, check the real artifact on the real surface. Compiles, proxies, and self-reports are not proof.
- **Sequence verifiable units.** Break multi-step work into small units that each end in a check. Verify one before starting the next. Stack commits so a reviewer can replay the argument (failing test then fix; baseline then treatment; subtract then reshape).
- **Test behavior, not implementation.** When writing, changing, or keeping a test, assert what callers or users can observe. A good test fails when that behavior breaks and keeps passing when only internals change. Rewrite or delete tests pinned to private helpers, call order, or values the test itself built.
- **Fix root causes.** Trace the symptom to the first wrong decision and fix it there. A guard is a fix only when the state it handles is legitimate.
- **Explain the number.** Before you run, write down the result that would change a decision. Before you trust or report a measured number, name its limiter from a profile or counters ("why not double?") and rule out errors, skipped or cached work, an untuned side, and noise. Keep the run count, spread, and limiter with the number, and for performance run [`benchmark-checklist`](../benchmark-checklist/SKILL.md).

### Delegation

- **Never block on reversible work.** Proceed on reversible edits, present the result, let the human course-correct. Product preference forks still need a human; empirical forks need an experiment, not a question.
- **Guard the context window.** When outputs, files, or repeated reads pile up, route the bulk to subagents and keep their summaries, not raw payloads, in the main thread. Size phases and cap files and turns per phase so no context overflows mid-task.

### Meta

- **Encode lessons in structure.** When you write the same instruction a second time or see a recurring correction, encode it as a lint, check, type, metadata flag, or script instead of more text. Once the structural fix exists, use it alone and delete the instruction, which was only the symptom. A lesson that needs judgment stays prose, made prominent and paired with an example of the failure.

When a principle shapes a decision, name it and the specific choice it changed. Cite only principles you applied this session.

## Combinations

These fire together. Name the combo when it shaped the work.

- **Prove it works ∩ Laziness.** Ship the smallest change the evidence justifies. Belt-and-suspenders that "might help" fails both.
- **Sequence verifiable units ∩ Prove it works.** Each unit's check is a real-surface check, not "it compiles." Failing-then-passing commit order is the stacked form.
- **Just do it ∩ Always pause ∩ Handoff trail.** Reversible work proceeds; irreversible writes stop; a full-autonomy grant keeps an append-only decision trail via `handoff`. The pause list still binds under the grant.
- **Opening-a-PR = Unslop ∩ No-comments.** Before review-ready or asking for a PR review, run [`unslop`](../unslop/SKILL.md) on PR/commit prose and [`no-comments`](../no-comments/SKILL.md) on the scoped diff, after prove and sequence already hold on the change itself.

## Autonomy

**Just do it.** Reversible work proceeds without asking: code edits, local commits on your branch, draft notes, ticket updates that are easy to undo, kicking off read-only checks.

**Always pause** for irreversible writes, even under a grant that covers reversible work:

- Force-push to a shared or protected branch
- Deploy / production mutate
- Data deletion or irreversible migrations
- Outbound customer or public messages
- Merge or land when the user did not ask to ship

**Full-autonomy grant.** Phrases like "don't stop", "going to bed", "run until done", "be fully autonomous", or "trust it when I'm back" mean: keep going on reversible work, do not park reversible questions, and keep a decision trail via `handoff`. Gates the operator named and the Always-pause list still need the operator. For a product or preference call only the operator can make, apply a clear default, report it with a full explanation, and say in plain words what they could tell you to do instead. Never invent a shorthand token for them to type back.

**No is an acceptable answer.** Decline, push back, or say the work does not earn its place when that is true. Candor over sycophancy.

## Related niches (reuse, don't duplicate)

- Structural maintainability review → `thermo-nuclear-code-quality-review` / `thermo-nuclear-refactor`
- Blog and long-form AI-tell scrub → [`ai-tells`](../../writing/writing-blog-post/references/ai-tells.md) in [`writing-blog-post`](../../writing/writing-blog-post/SKILL.md)
- Ultra-compressed chat → `caveman`
- Review comment voice on a PR → `pr-comments`
