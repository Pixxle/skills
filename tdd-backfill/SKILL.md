---
name: tdd-backfill
description: The inverse of TDD — retrofit an existing change so it looks as if it had been built test-first. Investigate already-written code, inventory the behavior tests a TDD process would have produced but are missing, backfill them (verified by a mutation check, since you can't go RED first), then apply the same testability refactors /tdd does — under the safety net of the new tests. Use after a change has landed without tests, to bring a module up to TDD standard, when the user says "backfill tests", "retrofit TDD", "characterize this", or invokes /tdd-backfill.
user_invocable: true
---

# TDD Backfill (inverse TDD)

Same destination as [`/tdd`](../tdd/SKILL.md) — behavior tests through public interfaces, testable interfaces, deep modules — reached from the opposite direction. The code already exists; you reverse-engineer the tests and design it should have had.

The canonical design vocabulary is the `/tdd` reference files. They apply unchanged and are the single source of truth — read them, don't restate them:

- [../tdd/tests.md](../tdd/tests.md) — good vs bad tests (the bar your backfilled tests must clear)
- [../tdd/mocking.md](../tdd/mocking.md) — mock only at boundaries; DI and SDK-style interfaces
- [../tdd/interface-design.md](../tdd/interface-design.md) — designing for testability
- [../tdd/deep-modules.md](../tdd/deep-modules.md) — small interface, deep implementation
- [../tdd/refactoring.md](../tdd/refactoring.md) — refactor candidates

## The one rule that shapes everything

In TDD, RED comes first: the failing test proves the test is meaningful before any code exists. **You've lost that proof — the code is already green.** A test written against working code passes whether or not it asserts anything real; that's how you get tautological snapshot tests that survive every bug.

So the discipline that replaces "confirm RED for the right reason" is the **mutation check**: after a backfilled test passes, deliberately break the behavior it covers, re-run, and confirm *that* test (and ideally only that test) goes red for the right reason — then restore. **A test you cannot make fail is worthless. Fix it or delete it.** See [characterization.md](characterization.md).

Second rule, also inverted: in TDD, test precedes code. Here, **tests precede refactor**. Never touch the design until the behavior is pinned by mutation-checked tests — the tests are the net you refactor over. Never refactor against red or untested code.

## Workflow

### 1. Scope the change

Establish exactly what's in scope and how the repo tests.

- [ ] Identify the change — default to the working diff vs the main branch (`git diff main...` / merge-base); or a named PR, commit range, or module if the user points at one
- [ ] Find the **test command** and the repo's **test conventions** (framework, layout, naming, fixtures) — fan out `Explore` agents if the repo is unfamiliar
- [ ] Separate the **public interface** the change exposes from its internals — tests and the gap inventory are scoped to the public surface only

### 2. Characterize the behaviors

Read the changed code and list the observable behaviors it now provides — the same ordered behavior list a `/tdd` plan would have produced, recovered after the fact. Describe each as WHAT the system does, not HOW. Flag any behavior that is ambiguous or looks like a latent bug — **surface it to the user; do not silently codify it as "correct."**

### 3. Inventory the gaps

For each behavior, classify:

- **Untested** — no test exercises it through the public interface → backfill (step 4)
- **Tested but coupled** — a test exists but asserts on internals / call counts / private state, or verifies through a back door → rewrite to behavior-level
- **Covered** — a sound behavior test already exists → leave it

Present the behavior list + gap inventory and **get the user's priorities** — you can't test everything; confirm which behaviors matter most and in what order. This is the planning gate.

### 4. Backfill tests — one behavior at a time (vertical, never horizontal)

Same anti-horizontal-slicing rule as `/tdd`: do NOT write all the tests at once. For each prioritized behavior, run a full cycle before moving on:

```
GREEN:    Write ONE behavior test through the public interface → run → passes
MUTATE:   Break that behavior in the implementation → run → confirm the test fails
          for the right reason (it caught the break, not a compile error)
RESTORE:  Revert the mutation → run → green again
```

Rules:

- One behavior at a time; let each test teach you about the next
- Test through the public interface only — it must survive a behavior-preserving refactor
- Mock only at system boundaries; verify through the interface, never a back door
- If the mutation check can't make the test fail, the test is asserting nothing — fix it

### 5. Refactor for testability — under the net

Only now, with behaviors pinned, apply the `/tdd` design principles that the original change skipped. Run the test command after every step; revert anything that breaks a test.

- [ ] Dependencies created internally (`new StripeGateway()`) → inject them
- [ ] Side-effect-only functions that mutate inputs → return results instead
- [ ] Shallow modules / leaky interfaces → deepen (move complexity behind a small interface)
- [ ] Internal mocks a test needed → restructure so mocking moves to the real boundary
- [ ] Duplication, long methods, primitive obsession → as in [../tdd/refactoring.md](../tdd/refactoring.md)

Behavior and public interface stay fixed; if you must change the interface, that's a new behavior — loop back to step 4 first.

### 6. Review

Adversarial pass with the `/tdd` review lenses — implementation-coupling, internal-mocking, verification-bypass, minimality — **plus the one this skill exists to catch**: tautological tests that lock in current output without expressing intent. The mutation check from step 4 is the evidence each test clears that bar; any test added without one is suspect.

## Checklist per behavior

```
[ ] Test describes behavior, not implementation
[ ] Test uses the public interface only
[ ] Test passes against the current code (GREEN)
[ ] Mutation check done: breaking the behavior makes THIS test fail, for the right reason
[ ] Ambiguous / bug-like behavior surfaced to the user, not silently pinned
[ ] Refactors (if any) ran only after the behavior was pinned, with tests green after each step
```

## Tuning

- **No change to scope against?** Point the skill at a module instead of a diff — same workflow, scope step names the module's public surface.
- **The behavior looks wrong?** Stop and ask. Backfilling is for capturing *intended* behavior; a characterization test over a bug just makes the bug permanent.
- **Many changed files?** This skill runs inline and sequential, like `/tdd`. For a large fan-out across files, that's the workflow shape `/tdd-flow` uses — raise it with the user rather than slicing horizontally here.
