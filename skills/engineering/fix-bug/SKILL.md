---
name: fix-bug
description: >-
  Reproduce-first bug fix: same-surface repro, hypothesis binary-search with
  live runtime evidence, smallest justified change, failing-then-passing
  history, then verify on the same surface. Use when the user reports a defect,
  asks to fix a bug, chase a regression, or debug failing behavior with a real
  repro — not for open-ended refactors, forensics-only diagnosis, or feature work.
---

# Fix bug

Own the defect end to end. Be scientific: every shipped line traces to runtime
evidence. A change that "might help" is a hypothesis, not a fix — it does not
ship. When evidence refutes a hypothesis, revert what it motivated. Ship the
smallest change the evidence justifies, nothing more.

This skill is the defect loop only. It is not a meta-router into other playbooks.

## The loop

Copy these steps into the working todolist before task-specific items. Mark a
skipped step with a one-line reason.

### 1. Reproduce on the same surface

Reproduce the failure yourself on the surface the user (or report) hits —
browser, CLI, API, test runner, IDE — even if a protocol suggests asking them
to repro. Drive that surface as far as it goes.

Ask the user only with a stated, specific reason the surface cannot reach the
target, and only after you have driven it. If it will not reproduce directly,
synthesize the trigger, tighten conditions, or add instrumentation until it
fires. Capture failing output, logs, or screenshots you can paste later.

Wrong-surface or "couldn't repro, shipping anyway" is not a start.

### 2. Binary-search with live evidence

Form candidate hypotheses, then rule them out until one survives. Each pass,
take the split that cuts the most remaining problem space, gather **runtime**
evidence (run it, log it, instrument it, watch the process), and eliminate.

Do not guess from source alone when program state is unclear — instrument and
read the running system. Confirm the surviving **mechanism** with runtime
evidence before writing a fix.

If two or more attempted fixes share one premise and both fail the same gate,
write that premise down and test it directly before another fix that assumes it.

Prefer root cause at the first place the system went wrong. A guard is a fix
only when the state it handles is legitimate.

### 3. Smallest justified fix

Plan the change from the confirmed mechanism. Change only what the evidence
requires. No belt-and-suspenders, no unrelated cleanup, no speculative
hardening in the same diff.

When implementation is large or parallelizable, spawn sub-agents with a
specific scope and review their diffs yourself — do not pass through their
summaries as the verdict.

### 4. Failing-then-passing history

Stage commits so a failing repro (or cheap local failing test) lands **before**
the fix in git history. Prefer a focused failing test when the path is cheap
and local. Skip a new test when it would be expensive, integration-heavy, or
unclear — but still keep the live same-surface repro as the proof sequence
(failing capture, then passing capture).

Unit tests alone show branch behavior; they do not prove bug absence on the
real surface.

### 5. Verify on the same surface

Re-run the **original** repro on the **same** surface from step 1. It must
pass. "Inconclusive," flaky, or a different surface is not a pass — flag it and
continue until the original path is green.

## Asking the human

Classify before asking.

- **Empirical forks** (behavior, timing, layout, output, whether a change
  fixed it): settle by running the surface or a cheap throwaway sketch
  (`prototype` when a sketch is cheaper than debating). Do not ask the user to
  be your debugger.
- **Product or preference forks** no experiment can settle (desired UX,
  acceptable tradeoff, which broken behavior to keep): a thin
  [`grill-me`](../../productivity/grill-me/SKILL.md) pass is enough — one
  branch at a time, lead with a recommendation. Do not expand into a full
  design interview for an empirical bug.

## Out of scope

- Structural simplification campaigns → `thermo-nuclear-refactor`.
- Diagnosis without a fix (live profiles, handed traces) → say so and stop at
  the cited mechanism, or hand back once the cause is known.
- New behavior or features → not this skill.
- Meta playbook routing → not this skill; invoke `fix-bug` directly for defects.

## Reply

Report: what was broken, root cause (mechanism + evidence), the fix, how you
verified on the same surface. Paste failing-then-passing repro output
verbatim when you have it. Link the PR when you opened one.
