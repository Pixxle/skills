### Visual parity

**You own pixel-exact equivalence. The baseline is the spec.**

1. Before any migration, build a visual regression harness on the repo's `verify-*` skill. It screenshots each component in every state, theme, and viewport it ships. When migrating a styling system, the baseline is the current code. When matching two implementations, the baseline is the reference implementation. No baseline, no parity claim.
2. Prove the harness deterministic, then freeze it. Capture the baseline twice and diff the two runs. A nonzero diff here is harness noise, such as animation, font loading, the clock, or device pixel ratio. Pin each cause in the harness until two runs diff to zero.
3. Anti-shortcut clauses, stated and held: no harness edits after the freeze, no baseline tampering, no component restructuring to make a diff pass. If the baseline looks wrong, stop and ask. Do not edit it.
4. Migrate shared primitives first as a blocking phase, and diff the whole suite to zero before any component starts. Then give each component one owner in its own worktree and run the owners in parallel (the [Separate Before Serializing Shared State](../../principles/separate-before-serializing-shared-state.md) principle).
5. Diff each migrated component against its baseline with the harness. A nonzero diff is a fail, by image diff, never by eye. Trace each delta to the style rule that caused it. Loop until the diff is zero, or follow [Autonomous run](autonomous-run.md) with a zero diff as the predicate for a long hunt.
6. Before each PR, rebase onto the latest trunk and rerun the whole suite, because a styling change can shift components nobody touched. Then run [Opening a PR](opening-a-pr.md) per component or per safe batch.

**Reply:** components migrated, the diff result for each, the last whole-suite result, the baseline harness location, what's left.
