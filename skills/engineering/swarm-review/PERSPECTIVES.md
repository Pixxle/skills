# Swarm review perspectives

Each worker owns **one** lens. Stay inside it. Cite the diff and nearby callers,
tests, or contracts. Prefer a few proven findings over a long nit list.

## Default panel

### 1. `correctness`

Break the change. Hunt regressions, edge cases, null/empty paths, concurrency
and ordering bugs, error-handling holes, and mismatched intent vs behavior.

Ask: *What input or interleaving makes this wrong?* Prefer findings you can
sketch a repro for (test name, command, or concrete scenario). Skip pure style.

### 2. `security`

Trust boundaries, authz/authn, injection, secret handling, SSRF/path traversal,
unsafe deserialization, over-broad permissions, and logging of sensitive data.

Ask: *What can a hostile or confused deputy do with this delta?* Reject
theoretical scares with no path from the diff. Flag missing checks at the real
boundary, not deep inside already-trusted code without evidence.

### 3. `contracts`

Public APIs, types, schemas, events, HTTP/RPC shapes, backwards compatibility,
and caller blast radius. Trace at least one real caller per changed export when
feasible.

Ask: *Who breaks if this ships, and is the breakage intentional?* Prefer
concrete call sites over abstract "might break clients."

### 4. `tests-observability`

Test gaps for new behavior, brittle or misleading tests, missing failure-path
coverage, and operability: logs, metrics, traces, feature flags, rollout
guards.

Ask: *How would we know this failed in CI or in production?* Do not demand tests
that are expensive theater; do flag untested load-bearing branches in the diff.

### 5. `maintainability`

Local structural cost introduced by *this* change: new tangles, duplicated
decisions, unnecessary indirection, file growth that mixes responsibilities,
or a missed simplification that the diff itself made obvious.

Ask: *Did this change make the next change harder for a clear reason?* Keep the
bar evidence-based and tied to the delta. Full thermo-nuclear or whole-repo
tangle hunts belong in `thermo-nuclear-code-quality-review` /
`thermo-nuclear-refactor`, not here. No drive-by renames or formatting nits.

## Shrinking the panel

| Change shape | Suggested panel |
| --- | --- |
| Docs / comments only | `correctness` (facts) — or skip swarm-review |
| Pure rename / move | `contracts`, `tests-observability` |
| Small bugfix | `correctness`, `tests-observability`, maybe `security` |
| API or schema change | full panel; weight `contracts` |
| Auth / multi-tenant / payments | full panel; weight `security` + `correctness` |

## Worker output file

Write only to the assigned `_swarm-review/workers/<perspective>.md`. Start with:

```md
# <perspective>
scope: <paths or PR>
base: <sha or branch>
result: PASS | ISSUES | BLOCKED
```

Then zero or more findings using the schema in `SKILL.md`. `PASS` means the
lens found nothing material. `BLOCKED` means the worker could not review (missing
diff, unreadable paths) — say why. List every issue the lens can prove, not only
the first.
