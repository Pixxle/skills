---
name: review-with-docs
description: Review a change branch against the spec that produced it — the Linear issue (and its parent), CONTEXT.md glossary, and ADRs — verifying acceptance criteria with running evidence, then applying the thermo-nuclear code quality bar and an adversarial security-and-correctness pass. Scales from one slice to a whole release branch via agent fan-out. Use after a /tdd slice is built, when the user wants to review a branch against its issue(s), check a slice is done as planned, or mentions "review with docs", "spec review", or "did we build what we said".
disable-model-invocation: true
---

# Review With Docs

The closing step of the planning loop: `grill-with-docs` decides what to build, `to-issues` writes it down, `tdd` builds it, and this skill verifies the branch actually delivers what was decided — then holds it to the thermo-nuclear quality bar.

Three passes, in order. **Conformance first** (did we build the right thing?), **quality second** (did we build it right?), **security-and-correctness third** (can it be broken?). A beautifully structured branch that ignores its acceptance criteria fails. A spec-perfect branch full of spaghetti also fails. So does a clean, conformant branch with an exploitable hole.

## 1. Identify the work

- Diff the current branch against the merge-base with the main branch: `git diff $(git merge-base main HEAD)`. If the user names a different branch or PR, use that.
- Find the Linear issue: take it from the argument if given, otherwise extract the issue key from the branch name (e.g. `dennis/orc-71-...` → ORC-71). On a **release branch** that aggregates many issues, harvest the issue keys from the merge-commit log instead — the review then covers every issue the branch claims to deliver. If neither works, ask.
- Fetch the issue(s) **and their comments** (comments often amend the spec), and fetch the **parent issue** if the `## Parent` section references one. Load the Linear tools via ToolSearch if needed. Note which issues in the harvested range are *not* part of the branch (still open/backlog) — they become scope checks: verify no partial implementation leaked in.

## 2. Assemble the spec

Read, in this order:

1. **The issue**: `## What to build`, `## Acceptance criteria`, `## Blocked by`, designs if present.
2. **The parent issue**: the broader intent this slice serves. A slice can pass its own criteria while drifting from the parent's goal — check both.
3. **The glossary**: `CONTEXT.md` at the root, or follow `CONTEXT-MAP.md` to the context(s) the diff touches. Note canonical terms and their _Avoid_ aliases.
4. **ADRs**: scan `docs/adr/` titles (system-wide and context-specific), read every ADR plausibly touching the changed area. ADRs added or updated *in this very diff* are part of the spec too.

## 3. Scale the execution: fan out

A single-issue slice is reviewed inline — no agents needed. A multi-issue branch or any diff too large to hold in one context gets the fleet treatment. The pattern that works:

1. **Baseline first.** Run the repo's full CI command (backend + frontend) once, in a clean environment, before any agent launches — capture per-package results to cite as evidence. If a "single run surface" like `make ci` exists, use it; if it fails for environment reasons (env leak, missing service), diagnose before blaming the branch, and report the discrepancy either way. Run it in the background while assembling the spec.
2. **Digest the spec.** If the issue list is large, a digest agent turns the tracker dump into per-issue acceptance-criteria blocks. Bulk issue fetches often truncate descriptions — when they do, have each conformance agent re-fetch its own issues in full rather than reviewing against a truncated spec.
3. **Conformance agents, one per issue group** (~5–6 related issues each, grouped by domain). Each agent gets: its issue keys, instructions to fetch full issues + comments, the diff paths for its area, the glossary path, the ADRs relevant to its area, and the obligation to produce per-criterion verdicts with **named tests it actually re-ran** (`go test -run <Name> ./<pkg>` or equivalent). Tell them PARTIAL is honest, not polite.
4. **Quality agents, one per area** of the diff (resolver layer, services, pipelines, infra — whatever the diff's natural seams are), each reading the thermo-nuclear skill and the ADRs governing its area. Plus **one test-quality agent** over all changed test files (behavior-coupled vs implementation-coupled).
5. **One security-and-correctness agent** (section 6) over the whole diff.
6. **Launch agents in parallel, in the background**; synthesize as results land. Don't duplicate their work while waiting.

**Verify the load-bearing findings yourself.** Any finding that decides the verdict — a FAIL, a release blocker, a security hole — gets independently reproduced in the main session before it goes in the report (run the failing command, read the code at the cited lines). Agents are witnesses, not judges.

## 4. Conformance review

**Acceptance criteria — verify, don't assume.** For each criterion, produce a verdict (PASS / FAIL / PARTIAL) with evidence. Evidence means observed behavior, not code that looks right:

- Run the test suite; name the specific test(s) covering each criterion.
- If a criterion is user-observable and no test covers it, run the app and observe it directly (the `/verify` approach). A criterion with no test and no observation is at best PARTIAL.

**Scope.** Flag work the issue didn't ask for (scope creep — especially work belonging to a sibling or blocked slice) and asked-for work that's missing. The slice should be exactly as thick as the ticket says.

**Language.** New identifiers — types, functions, tables, endpoints, UI copy — must use the glossary's canonical terms. An _Avoid_ alias appearing in new code is a finding. A new domain concept that never made it into CONTEXT.md is also a finding: the glossary should have grown with the code.

**ADR compliance.** The diff must not contradict an accepted decision. If a deviation was deliberate, the branch must carry the superseding/updated ADR — "we changed our mind silently" is a blocker. Conversely, if the implementation made a decision that meets the ADR bar (hard to reverse, surprising, real trade-off) and recorded nothing, flag the missing ADR.

**Test quality (the `/tdd` contract).** Tests must verify behavior through public interfaces and read like the acceptance criteria. Flag tests that mock internal collaborators, assert implementation shape, or would break on a behavior-preserving refactor.

## 5. Quality review

Apply the full standards from the sibling skill — read [../thermo-nuclear-code-quality-review/SKILL.md](../thermo-nuclear-code-quality-review/SKILL.md) and hold the diff to all of it: hunt for code-judo moves, block unjustified file growth past 1k lines, reject spaghetti branching, demand boring direct code, clean type boundaries, and logic in its canonical layer.

One extra lens this skill adds: when you spot a judo move, check it against the ADRs first. A restructuring that "simplifies" the code by unwinding a documented decision is not a judo move — it's a regression with good posture.

## 6. Security-and-correctness review

An adversarial read of the whole diff, distinct from conformance (which proves the criteria) and quality (which judges the structure): hunt for what an attacker or an unlucky input can do.

- **Security:** authorization and tenant-boundary gaps (the edge that skips the check its siblings all make), injection (SQL, header, path, template), secrets in code or logs, crypto misuse, unsafe defaults, resource exhaustion. Privilege boundaries the branch itself introduced deserve the hardest look — a new "unforgeable" type with one forgeable caller is a finding.
- **Correctness:** real bugs beyond any acceptance criterion — logic errors, broken edge cases, races **with a demonstrated trigger**, mishandled errors, dead code that claims to do something (a persisted value nothing reads, a lock that can't hold). "This looks fragile" is not a finding; "this fails when X, here's the path" is.
- Distinguish **introduced** from **pre-existing**: a gap the branch faithfully preserved from old code is a follow-up issue, not a branch regression — say which it is, with the `git show <merge-base>` evidence.

## 7. Report

Use the format in [REPORT-FORMAT.md](./REPORT-FORMAT.md). Verdict is **APPROVE** or **REQUEST CHANGES** — no soft middle. Approval requires:

- every acceptance criterion PASS with named evidence
- no scope creep or missing scope
- no ADR contradiction and no silently-missing ADR
- no glossary drift in new identifiers
- the thermo-nuclear approval bar met
- no security hole or demonstrated-trigger correctness bug introduced by the branch

Prioritize findings: spec violations and security holes → ADR contradictions → structural quality / missed judo → test-quality problems → language drift → everything else. Few high-conviction findings beat a wall of nits.

After reporting, offer (don't auto-run): post the report as a comment on the Linear issue, post inline PR comments via `/pr-comments`, or fix the findings directly on the branch.
