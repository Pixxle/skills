# Report Format

The report is the deliverable. It must be readable by someone who hasn't seen the branch — name files, tests, and criteria explicitly.

```md
# Review: <ISSUE-KEY> — <issue title>

**Branch:** <branch> (<n> files, +<a>/−<d>)
**Verdict:** APPROVE | REQUEST CHANGES

## Acceptance criteria

| # | Criterion | Verdict | Evidence |
|---|-----------|---------|----------|
| 1 | <criterion text> | PASS | `test name` in `path/to/test.ts` |
| 2 | <criterion text> | PARTIAL | observed manually: <what you saw>; no test covers it |
| 3 | <criterion text> | FAIL | <what happened instead> |

For a multi-issue (release-branch) review, title it `# Review: <branch> — <KEY-A> → <KEY-B> (<n> issues)`,
lead the section with the computed totals ("<p> PASS / <q> PARTIAL / <r> FAIL across <n> issues"),
**roll clean-sweep issues up to a single line each** ("KEY-202–209: 27/27 PASS"), and render table
rows only for FAIL/PARTIAL criteria. The full per-issue detail lives with whoever produced it; the
report is for deciding, not archiving.

## Spec findings

Scope creep, missing scope, parent-issue drift, ADR contradictions,
missing ADRs, glossary drift. One short paragraph per finding:
what the spec says, what the code does, what to change.

## Quality findings

Thermo-nuclear findings in priority order. For each: the problem,
why it matters, and the preferred remedy (judo move > extraction > nit).
Reference code as `file.ts:123`.

## Security & correctness findings

Adversarial findings: security holes and demonstrated-trigger correctness
bugs beyond the criteria. For each: the attack or failure path (who can do
what, or what input breaks it), the evidence you verified it with, and
whether the branch INTRODUCED it or PRESERVED it from before the merge-base
(preserved → recommend a follow-up issue, not a branch blocker).

## Test quality

Behavior-coupled vs implementation-coupled assessment. Criteria
lacking test coverage. Tests that would break on a safe refactor.

## What was verified by running

Commands run, suites passed/failed, manual observations made.
Be explicit about what was NOT verified and why.
```

## Rules

- **Evidence column is mandatory.** "Code looks correct" is not evidence. A test name, a command output, or an observed behavior is.
- **PARTIAL is honest, not polite.** Use it when the behavior probably works but you couldn't fully verify. Never use it to soften a FAIL.
- **Every REQUEST CHANGES finding must be actionable** — say what to change, not just what's wrong.
- **If you couldn't fetch the issue or find the docs**, say so at the top and downgrade confidence accordingly — don't review against an imagined spec.
