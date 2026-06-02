# Characterization tests and the mutation check

A **characterization test** pins down what code *currently* does so you can change it safely. That's exactly what step 4 backfills. The danger is unique to working backwards: the code is already green, so a test you write will pass — even if it asserts nothing meaningful. In TDD the failing RED proves the test bites; here you have to manufacture that proof.

## The mutation check is the inverse of RED

```
TDD (forward):     RED  → write test, it fails (proves test bites) → write code → GREEN
Backfill (inverse): GREEN → write test against working code, it passes
                    MUTATE → break the behavior, the test must now fail (proves test bites)
                    RESTORE → undo the break, green again
```

If breaking the behavior does NOT turn the test red, the test is not testing that behavior. It is one of:

- a tautology (`expect(result).toBeDefined()`, `expect(x).toEqual(x)`)
- a snapshot of incidental output nobody asserted intent about
- asserting on a value the mutation didn't touch (wrong target)

Fix the assertion until the mutation makes it fail, or delete the test. A green-only test is worse than no test: it advertises coverage that isn't there.

## How to mutate (cheapest meaningful break)

Pick the smallest edit that changes the behavior under test, not just any edit:

- flip a boolean / comparison (`>` → `>=`, `&&` → `||`)
- return a wrong-but-type-valid constant (`return total` → `return 0`)
- skip a step (comment out the line that applies the discount)
- off-by-one a bound

Then re-run and read the failure. You want the *target* test to fail with an assertion mismatch that names the behavior — not a compile error, not twenty unrelated tests collapsing. If the whole suite lights up, your test isn't isolating the behavior; tighten it. Always restore exactly (prefer reverting the edit, not re-typing it).

## What NOT to do

- **Don't write the snapshot and move on.** "It passes" is the start of the check, not the end.
- **Don't codify bugs.** If the current output looks wrong, a characterization test makes it permanent and green forever. Surface it to the user; capture the *intended* behavior, or quarantine the test with a clear `// TODO: confirms current (suspect) behavior` and flag it.
- **Don't characterize internals.** The point is a net that survives refactoring. Assert through the public interface so step 5's refactors don't break the very tests protecting them.
- **Don't batch the mutations.** One behavior, one test, one mutation check, then next — same vertical-slice rule as `/tdd`. Mutating after a batch of tests can't tell you *which* test (if any) actually caught the break.
