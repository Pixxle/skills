---
name: swarm-review
description: >-
  Parallel multi-perspective review of a PR, branch diff, or path-scoped change:
  spawn review sub-agents together, then dedupe, severity-triage, and return
  actionable findings. Use for a thorough, swarm, parallel, multi-model, or
  multi-agent review of a PR or diff that ranks findings by reading the code,
  with pre-merge coverage across correctness, security, contracts, tests, and
  maintainability. To prove findings by running code, use interrogate. For a
  maintainability-only bar, use thermo-nuclear-code-quality-review. Not for
  whole-repo deep audits or posting comments.
---

# Swarm review

Review a **change set** by fanning out several independent perspectives at once,
then consolidating into one ranked, actionable report. The coordinator owns
scope, aggregation, and the final write-up; workers only report evidence-backed
findings in their assigned lens.

This is review, not implementation. Do not apply fixes unless the user asks.

## When to use

- Pre-merge review of a PR, branch, or working-tree diff
- "swarm review", "multi-agent review", "parallel review", "multi-model review"
- Want breadth across lenses on one change without a whole-repo audit

## Related skills (link, don't duplicate)

| Need | Use instead / next |
| --- | --- |
| Whole-codebase structural audit / tangle hunting | [`thermo-nuclear-refactor`](../thermo-nuclear-refactor/SKILL.md) |
| Single-pass structural maintainability bar on a change | [`thermo-nuclear-code-quality-review`](../thermo-nuclear-code-quality-review/SKILL.md) |
| Decide fixes on findings you already have | [`workshop-findings`](../workshop-findings/SKILL.md) |
| Prove a finding by running it, or try to break the change | [`interrogate`](../interrogate/SKILL.md), with unproven findings as leads |
| Post findings as a GitHub review | [`pr-comments`](../pr-comments/SKILL.md), after this skill (or after workshop) |
| Map an unfamiliar system | [`create-system-map`](../create-system-map/SKILL.md) |

`swarm-review` **finds** issues on a diff. It does not workshop remedies or post
comments. When the user wants that end to end, the pipeline is
`swarm-review` → optional `interrogate` or `workshop-findings` → `pr-comments`.

## Phases

Open a todolist with one entry per phase before launching workers.

1. Frame
2. Fan out
3. Aggregate
4. Report

### 1. Frame

**Scope inputs** (resolve in this order; state the choice out loud):

1. Explicit paths, files, or commit range the user named
2. A PR number/URL → that PR's diff against its base
3. Current branch → diff from merge-base with the default base branch through
   the working tree (include uncommitted changes unless the user said commits-only)
4. Otherwise ask: PR, branch, or paths?

Capture **intent** in one or two sentences from the user message, commits, and
PR description. Ask only when intent is unclear, because wrong intent produces
false findings.

Pick the **panel** from [PERSPECTIVES.md](PERSPECTIVES.md). Default is the full
five-lens panel. Shrink for tiny diffs (e.g. docs-only → correctness + prose;
pure rename → contracts + tests). Expand only when the user names extra lenses.
Record the panel and the done predicate: *"every in-scope path has a
disposition; findings are deduped, severity-tagged, and evidence-backed."*

Create `_swarm-review/` at the repo root (or `_swarm-review_<date>/` if one
exists). Write `_swarm-review/00_frame.md` with scope, base SHA / PR, intent,
panel, and any exclusions.

### 2. Fan out

Spawn **one sub-agent per perspective in parallel** (one message, concurrent).
Capability terms only. Spawn read-focused review sub-agents together. Prefer
diverse model families when the runtime offers them so blind spots differ.
Never block the run on a specific vendor. When a model choice is refused, fall
back to the parent model.

Every brief must stand alone. Include:

- Goal, intent, and exact scope (paths, SHAs, PR)
- The single perspective from [PERSPECTIVES.md](PERSPECTIVES.md)
- Output path: `_swarm-review/workers/<perspective>.md`
- Finding schema (below)
- Instruction: report only what that lens owns, with no drive-by nits from
  other lenses. "No findings" is a valid result. Prove claims against the real
  diff and surrounding callers and tests when relevant

If a worker drops out, proceed with N−1 and note the gap. Do not wait to
serialize workers that are independent.

### 3. Aggregate

Read every worker file. For each candidate finding:

1. **Verify lightly.** Confirm the cited location is in scope and the claim
   matches the code. Drop hallucinations and out-of-scope style preferences.
   A plausible finding that reading alone cannot confirm stays in the report
   marked `unproven`, as a lead for [`interrogate`](../interrogate/SKILL.md).
2. **Dedupe.** Merge findings that share a root cause into one item. List which
   perspectives raised it.
3. **Rank by severity** (internal triage, highest first):
   - `blocking` for wrong behavior, a security hole, a broken contract, or data loss
   - `should-fix` for a real defect or maintainability debt that will bite soon
   - `nit` for optional cleanup. Keep these sparse.
   - `question` when intent is unclear. Ask rather than assert.
4. **Coverage check.** Every hot area of the diff has a disposition (finding,
   clean, or gap). Gaps from dropouts stay gaps, not silent passes.

Write `_swarm-review/aggregate.md`. Do not paste raw worker dumps into the user
reply.

### 4. Report

Return one consolidated in-chat review:

1. **Scope and intent.** What was reviewed and against what base.
2. **Panel.** Perspectives run, dropouts, and gaps.
3. **Findings** in severity order. Each has a location (`path:line` when
   possible), a one-line problem, why it matters, a concrete fix or question,
   and which perspectives agreed.
4. **Clean or covered.** A brief note on areas reviewed without material findings.
5. **Handoff.** When a blocking or should-fix finding is `unproven`, or the user
   wants proof, offer [`interrogate`](../interrogate/SKILL.md) with those
   findings as leads. Only a finding a run proves survives there. If the user
   wants comments posted, point them at `workshop-findings` (optional), then
   `pr-comments`. Do not infer a GitHub review verdict.

When handing off to `pr-comments`, remember that its severity labels only go
**down** (`nit:`, `optional:`). Escalation is the human's review event, not a
`blocking:` prefix on a comment.

## Finding schema (workers)

```md
### <short title>
- **severity:** blocking | should-fix | nit | question
- **location:** path:line (or range)
- **problem:** one sentence
- **evidence:** what in the diff/callers/tests supports it
- **fix or question:** concrete remedy, or the question to ask
```

## Out of scope

- Implementing the fix list (unless the user explicitly asks after the report)
- Whole-repo discovery and tangle hunting → `thermo-nuclear-refactor`
- Proving findings by running them → [`interrogate`](../interrogate/SKILL.md)
- Posting the GitHub review → `pr-comments`
- Design bakeoffs and candidate grafting → [`arena`](../arena/SKILL.md). Keep one review report here.
- General-purpose parallel exploration unrelated to reviewing a change
