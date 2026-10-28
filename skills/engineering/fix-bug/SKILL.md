---
name: fix-bug
description: >-
  Reproduce-first bug fix: same-surface repro, hypothesis binary-search with
  live runtime evidence, a regression test or check that fails for the
  intended reason before any production edit, the smallest justified change,
  a rerun of that check that passes, then verify on the same surface. Use when the user reports a defect, asks to fix a
  bug, chase a regression, or debug failing behavior with a real repro, or asks
  for TDD, a failing test first, or a regression test. Not for open-ended
  refactors, forensics-only diagnosis, or feature work.
disable-model-invocation: true
---

# Fix bug

Own the defect end to end. Be scientific. Every shipped line traces to runtime
evidence. A change that "might help" is a hypothesis, not a fix, and it does
not ship. When evidence refutes a hypothesis, revert what it motivated. Ship the
smallest change the evidence justifies, nothing more.

This skill is the defect loop only. It is not a meta-router into other playbooks.

## The loop

Copy these steps into the working todolist before task-specific items. Mark a
skipped step with a one-line reason.

### 1. Reproduce on the same surface

Name the intended behavior, the current behavior, the affected path, and the
smallest observable reproduction.

Reproduce the failure yourself on the surface the user (or report) hits, such
as a browser, CLI, API, test runner, or IDE, even if a protocol suggests asking
them to repro. Drive that surface as far as it goes. When the repo has a
project verify skill (`.agents/skills/verify-*/`, linked at
`.claude/skills/verify-*`), read its `SKILL.md` and drive this repro and the
step 5 re-run through its Launch, Doctor, and Drive recipes. Cite the
feature-map entry you used. When a recipe fails against an app that works, the
recipe is stale. To repair it, read and follow
[`maintain-verification-skill`](../maintain-verification-skill/SKILL.md).

Ask the user only with a stated, specific reason the surface cannot reach the
target, and only after you have driven it. If it will not reproduce directly,
synthesize the trigger, tighten conditions, or add instrumentation until it
fires. Capture failing output, logs, or screenshots you can paste later.

When the defect is a slowdown, the repro is a benchmark. To vet it before and
after the fix, read and follow
[`benchmark-checklist`](../benchmark-checklist/SKILL.md).

Wrong-surface or "couldn't repro, shipping anyway" is not a start.

### 2. Binary-search with live evidence

Form candidate hypotheses, then rule them out until one survives. Seed them by
reading and following [`how`](../how/SKILL.md) over the affected subsystem and
[`why`](../why/SKILL.md) for regression history. Each pass, take the split
that cuts the most remaining problem space, gather **runtime** evidence (run
it, log it, instrument it, watch the process), and eliminate.

Do not guess from source alone when program state is unclear. Instrument and
read the running system. Confirm the surviving **mechanism** with runtime
evidence before writing a fix.

If two or more attempted fixes share one premise and both fail the same gate,
write that premise down and test it directly before another fix that assumes it,
per [`principle-attack-the-premise`](../principle-attack-the-premise/SKILL.md).

Prefer root cause at the first place the system went wrong. A guard is a fix
only when the state it handles is legitimate. Read and follow
[`principle-fix-root-causes`](../principle-fix-root-causes/SKILL.md) for the
procedure.

### 3. Failing-then-passing history

Make the broken behavior executable before the fix. This step is a gate. No
production edit happens until its check fails for the intended reason. Stage
commits so the failing test or repro lands **before** the fix in git history,
and a reviewer can replay the failure and then the fix.

When the bug has a clear, cheap test path, lock it in with a focused
regression test.

1. **Choose the narrowest executable check.** Prefer the closest unit,
   component, integration, or regression test the codepath already uses. If no
   practical test path is obvious, do not build one from scratch to satisfy
   this loop.
2. **Write the failing test first.** Add the smallest focused test that would
   have caught the bug. It encodes the intended behavior, not the current
   implementation.
3. **Run it before the fix.** Confirm it fails for the intended reason. If it
   passes, or fails for an unrelated reason, correct the test or the repro
   before you edit the implementation. Capture the failure output.

Do not force a test when it would be impractical. Broad harness setup, brittle
mocks, slow end-to-end infrastructure, production-only state, vague
reproduction steps, or large unrelated fixture churn all mean skip the new
test. Use the closest executable regression check instead: a targeted script,
a manual reproduction command, browser automation, a snapshot comparison, a log
assertion, or a focused integration check. The live same-surface repro still
carries the proof sequence (failing capture, then passing capture).

No new test is better than a bad test. A bad test mostly tests mocks, encodes
current implementation details, depends on timing or unrelated global state,
needs expensive infrastructure for a small fix, or would be deleted right after
it proves the fix.

Unit tests alone show branch behavior. They do not prove bug absence on the
real surface.

### 4. Smallest justified fix

Start only after the step 3 check fails for the intended reason.

Plan the change from the confirmed mechanism. Change only what the evidence
requires, and preserve the contracts of the code around it. No
belt-and-suspenders, no unrelated cleanup, no speculative hardening in the
same diff.

When implementation is large or parallelizable, spawn sub-agents with a
specific scope. Each brief carries the step 3 check with its captured failure,
the order (that check already fails, so the delegate edits production code to
turn it green and never edits the check to fit the code), and the Test
guardrails below, verbatim. Review their diffs yourself. Do not pass their
summaries through as the verdict.

Rerun the step 3 check after the fix. Confirm it now passes.

### 5. Verify on the same surface

Re-run the **original** repro on the **same** surface from step 1. It must
pass. "Inconclusive," flaky, or a different surface is not a pass. Flag it and
continue until the original path is green.

## Test guardrails

- Never edit a test to fit a wrong implementation.
- Do not weaken an existing assertion unless the expected behavior genuinely
  changed and you can state the reason.
- Keep the regression test focused on the bug. Avoid broad fixture churn or
  unrelated coverage.
- For a flaky bug, make the test deterministic where possible, and document
  the signal it locks down.
- When the bug exposes a broader class of failures, land the focused regression
  test first, then consider sibling coverage.

## Asking the human

Classify before asking.

- **Empirical forks** (behavior, timing, layout, output, whether a change
  fixed it). Settle them by running the surface or a cheap throwaway sketch.
  When a sketch is cheaper than debating, read and follow
  [`prototype`](../prototype/SKILL.md). Do not ask the user to be your
  debugger.
- **Product or preference forks** no experiment can settle (desired UX,
  acceptable tradeoff, which broken behavior to keep). Read and follow
  [`grill-me`](../../productivity/grill-me/SKILL.md) for one thin pass. Take
  one branch at a time and lead with a recommendation. Do not expand into a
  full design interview for an empirical bug.

## Out of scope

- Structural simplification belongs to the [Refactor](../cortex/playbooks/refactor.md)
  playbook. It sends whole-system refactors to
  [`thermo-nuclear-refactor`](../thermo-nuclear-refactor/SKILL.md).
- Diagnosis without a fix belongs to
  [Runtime forensics](../cortex/playbooks/runtime-forensics.md) for a live
  process and [Trace forensics](../cortex/playbooks/trace-forensics.md) for a
  captured artifact. Stop at the cited mechanism, or hand back once the cause
  is known.
- New behavior or features belong to the [Feature](../cortex/playbooks/feature.md)
  playbook.
- Playbook routing belongs to [`cortex`](../cortex/SKILL.md). This skill runs
  the defect loop that cortex's Bug fix playbook loads by link.

## Opening a PR

To open a PR for the fix, read and follow [Opening a PR](../cortex/playbooks/opening-a-pr.md),
which reads and follows [`no-comments`](../no-comments/SKILL.md) and
[`unslop`](../unslop/SKILL.md).

## Reply

Report what was broken, the root cause (mechanism and evidence), the fix, and
how you verified on the same surface. Report the evidence, not just the
outcome.

- Name the failing-before test or executable check and the failure it
  produced.
- Name the passing-after run and any nearby validation you performed.
- If you could not demonstrate failing-before evidence, say why, and name the
  closest regression check you used instead.

Paste failing-then-passing repro output verbatim when you have it. Link the PR
when you opened one.
