---
name: bump-deps
description: Safely bump repository dependencies — discover manifests via parallel sub-agents, baseline build/typecheck/tests, anchor latest versions to the internet (never guess, never downgrade), present a gated plan, apply one bump at a time on a fresh branch, validate after each, and auto-resolve source-only regressions (never modifying tests, hard stop on test-framework breakage). Use when user wants to upgrade packages, runtimes, or Docker base images safely. Triggers include "bump deps", "upgrade dependencies", "safely update packages", "/bump-deps".
user_invocable: true
---

# bump-deps

Safely upgrade a repository's dependencies — packages, language runtimes, and Docker base images — using a multi-agent flow with explicit user gates and a strict no-regress contract.

---

## Invariants (never violate)

- **Never guess versions.** Latest-version info must come from a native package-manager CLI (which queries the official registry) or `WebFetch` of an official registry/release endpoint. Training-data knowledge is not a valid source.
- **Never downgrade.** If `current > latest stable` (e.g., a pinned pre-release that hasn't been promoted to stable), the dep is held until stable catches up. Applies to packages, runtimes, and Docker tags equally.
- **Never modify tests to make them pass.** Auto-resolution edits source code only. If a regression can only be fixed by changing a test, defer to the user.
- **Never silently revert.** Every reverted bump is reported with reason in the final summary.
- **Never push without asking.** End-of-run push & PR is explicit opt-in.
- **Refuse on dirty working tree.** Modified, staged, or in-tracked-path untracked changes block the start. User may explicitly override.
- **Test-framework upgrades are a separate trust boundary.** Hard revert + warn + add to manual-review list. Never auto-resolved.
- **Anchored sources must be cited.** Every `latest-stable` / `LTS` value in the plan carries the URL or CLI command it came from.

---

## Recognized test-framework prefixes

Used to identify "this is a test-framework dep" for the hard-revert rule. Sub-agents may extend per ecosystem; extensions must be reported in their output for auditability.

- **.NET**: `xunit*`, `nunit*`, `MSTest*`, `Microsoft.NET.Test.Sdk`, `Moq`, `NSubstitute`, `FluentAssertions`, `Shouldly`, `coverlet*`, `AutoFixture*`, `Bogus`.
- **Node**: `jest`, `vitest`, `@testing-library/*`, `mocha`, `chai`, `sinon`, `cypress`, `@playwright/*`, `playwright`, `@types/jest`, `@types/mocha`, `@vitest/*`, `ts-jest`, `jasmine`, `karma*`.
- **Python**: `pytest*`, `unittest*`, `nose*`, `hypothesis`, `tox`, `coverage`, `mock`.
- **Go**: `testify`, `ginkgo`, `gomega`, `gomock`, `mockery`.
- **Ruby**: `rspec*`, `minitest`.

---

## Phase 1 — Discovery (parallel sub-agents)

### 1.1 Preflight

- `git status --porcelain` → if non-empty, refuse with the list of changed files. Wait for explicit user override.
- Confirm we are inside a git repo; capture current branch as `<base-branch>`.

### 1.2 Coordinator scan

Walk the repo, skipping: `node_modules`, `bin`, `obj`, `vendor`, `.git`, `dist`, `build`, `.next`, `target`, `.venv`, `__pycache__`, `coverage`, `.gradle`.

Enumerate every file that looks like a dependency manifest, lockfile, runtime pin, or container spec — do not pre-filter by ecosystem; treat anything plausibly manifest-like as a candidate.

### 1.3 Group manifests into ecosystem projects

- One `.sln` (or directory containing one or more orphan `.csproj`) → one .NET project (include any `Directory.Packages.props`, `Directory.Build.props`, `global.json`, `dotnet-tools.json`).
- One Node workspace (root `package.json` + lockfile + its `workspaces` leaves) → one Node project. Standalone `package.json` (no workspace) → its own project.
- Each `go.mod` → one Go project.
- Each `pyproject.toml` / standalone `requirements*.txt` / `Pipfile` / `Cargo.toml` / `Gemfile` / `pom.xml` / `build.gradle*` → one project per group.
- Unknown ecosystem → one project; the sub-agent will use judgment and report what it concluded.

Do not fragment too granularly: a sub-agent should reason holistically about shared package management within its unit.

### 1.4 Spawn discovery sub-agents in parallel

- One Agent call per ecosystem project.
- **One dedicated `runtimes-and-images` sub-agent** for: Dockerfiles, `docker-compose*.yml`, `.nvmrc`, `.tool-versions` (asdf/mise), `global.json` SDK pin, `go.mod` toolchain directive, `.python-version`, GitHub Actions runner/setup-action versions in `.github/workflows/*.yml`.
- All sub-agent calls must go in a **single message with multiple Agent tool uses** so they run concurrently. Coordinator waits for all to complete before aggregating.

### 1.5 Sub-agent contract

Each sub-agent is given:
- Project root path and ecosystem hint (or `unknown`).
- The full invariants list above.
- The output template (§1.7) it must follow exactly.
- The breaking-changes source priority (§1.6).

It must:
1. Identify and run the project's **build** command (e.g., `dotnet build`, `tsc --noEmit` or framework build, `go build ./...`, `cargo build`).
2. Identify and run the project's **typecheck/lint** if configured (`tsc --noEmit`, `mypy`, `golangci-lint`, `eslint`, `ruff`, etc.).
3. Identify and run the project's **test command**. Capture the **test-name → outcome** map. Pre-existing failures are recorded and **excluded from the regression set**.
4. Enumerate **direct and dev** dependencies.
5. For each dep, fetch `current`, `latest-stable`, `LTS-if-applicable` via **native CLI first**, registry WebFetch as fallback:
   - .NET: `dotnet list package --outdated --include-transitive` and `dotnet list package --vulnerable`.
   - Node: `npm outdated --json` (or `pnpm outdated --format=json`, `yarn outdated --json`) and `npm audit --json`.
   - Go: `go list -m -u all` and `govulncheck ./...` (or osv-scanner).
   - Python: `pip list --outdated --format=json` (or `poetry show --outdated`) and `pip-audit`.
   - Docker base images: WebFetch `https://hub.docker.com/v2/repositories/<image>/tags?page_size=100` (or registry API for non-DockerHub).
   - Runtimes: WebFetch official endpoints — nodejs.org/dist/index.json, dotnet.microsoft.com release notes JSON, go.dev/dl/?mode=json, python.org/api or endoflife.date as a secondary anchor.
6. Surface **CVEs** alongside each dep. CVE-fixing bumps will jump the order within their risk tier.
7. For each non-trivial bump (≥ minor, any CVE, any runtime), fetch breaking-changes info per §1.6.
8. Risk-classify each bump: `low` / `medium` / `high`. Default raise rules in §1.8.

### 1.6 Breaking-changes source priority (cap 2 fetches per package)

1. **GitHub Releases** for the package's source repo (discovered from registry metadata `homepage` / `repository` / `project_urls`).
2. **CHANGELOG.md / RELEASES.md / HISTORY.md** in the source repo (raw.githubusercontent.com URL).
3. **Registry release notes page** (npmjs.com/package/X, nuget.org/packages/X, pkg.go.dev/X, pypi.org/project/X).
4. **WebSearch** `"<pkg> <new-version> breaking changes"` — fallback only.

If none yield content, mark `breaking-changes: unknown — manual review recommended`.

Prefer the registry's JSON API endpoint when available — faster and less noisy than HTML pages:
- `https://registry.npmjs.org/<pkg>`
- `https://api.nuget.org/v3-flatcontainer/<pkg>/index.json`
- `https://proxy.golang.org/<pkg>/@latest`
- `https://pypi.org/pypi/<pkg>/json`

### 1.7 Sub-agent output template (followed exactly)

```
## Project: <root path>
### Ecosystem: <node | dotnet | go | python | docker | runtimes-and-images | ...>
### Build:           <command, cwd> → <ok | fail (≤30 line excerpt)>
### Typecheck/lint:  <command | n/a> → <ok | fail (≤30 line excerpt)>
### Tests:           <command, cwd> → pass=<N>/fail=<M>/skip=<K>
### Pre-existing failures (excluded from regression set)
- <test-id-1>
- ...
### Dependencies
| name | type | current | latest-stable | LTS | bump-size | risk | CVE | breaking-changes | usage-hotspots | anchored-source |
| ...  | direct/dev/transitive | ... | ... | ... | patch/minor/major | low/med/high | CVE id or — | summary or "unknown" | file:line refs | URL or CLI |
### Runtime/image pins (if owned by this sub-agent)
| target | current | latest-stable | LTS | risk | anchored-source |
### Suggested order (lowest-risk first within this project)
1. ...
### Sub-agent notes / test-framework list extensions / fetch failures
- ...
```

### 1.8 Risk-classification defaults

- **patch**, no CVE, breaking-changes empty → `low`.
- **minor**, breaking-changes empty → `low`. Breaking-changes non-empty → `medium`.
- **major** → `medium` floor; `high` if breaking-changes mentions API removals or behavior changes touched by `usage-hotspots`.
- **runtime** (.NET, Node, Go, Python, Docker base image major) → `high` floor.
- **breaking-changes: unknown** → bump risk floor by one tier.
- **CVE present** → does not raise risk; instead, jumps the order within its tier.
- **Test-framework dep** → tag as `test-framework`. Always offered to the user; never auto-resolved.

### 1.9 Sub-agent failure handling

Coordinator collects every sub-agent result before aggregating. If any sub-agent failed (crash, timeout, missing native tool, parse error):

1. List the failed projects with the reason.
2. Ask the user: **continue with successful projects only / retry failed / abort entire run**.
3. Never silently exclude — partial coverage is more dangerous than no coverage because the user assumes a full sweep.

---

## Phase 2 — Plan aggregation

Coordinator merges all sub-agent outputs into one master plan:

- **Summary table** with stable integer IDs across all projects:
  `# | project | name | current → proposed | bump-size | risk | CVE | one-line summary`
- IDs are assigned in **suggested run order**: within each risk tier, CVE-fixing bumps come first. Tier order: patch → minor → major → runtime. Trivial patch families (`@types/*`, transitively coupled cluster, all patch-level, no CVE) may share a single ID.
- Below the summary, **per-project sections** preserving each sub-agent's full output for detail.
- **Aggregate footer**:
  - "N deps holding (current ahead of stable): …"
  - "K bumps lacking breaking-changes info — risk raised."
  - "P CVEs surfaced."
  - "Q test-framework bumps available — will not be auto-resolved."

---

## Phase 3 — User gate

Print the master plan. Ask:

> Which to apply? Reply in natural language or by IDs.
> Examples: `"all patches"`, `"all patch and minor, skip majors"`, `"only security fixes"`, `"do #3, #5, #9"`, `"all except #7 and #12"`, `"runtimes only"`, `"all"`, `"none"`.

For runtime rows that list both LTS and latest-stable, accept per-runtime preference here (e.g. `"do #5 as latest stable, #6 as LTS"`). Default is LTS when one exists; user may override.

Parse the answer, then **echo back the resolved selection** as two lists:

```
Will bump (in this order):
  #3  <pkg> <old → new>
  #5  <pkg> <old → new>
  ...
Will skip:
  #7  <pkg> — major bump, user excluded
  ...
```

Ask for one final `confirm` token before any code change. Do not proceed without explicit confirmation.

---

## Phase 4 — Apply (sequential, one at a time)

1. **Branch off current HEAD**: `git switch -c bump-deps/<base-branch>-<YYYYMMDD-HHMM>`. Do not push.
2. For each selected bump in plan order:
   a. **Apply via native tooling** — never hand-edit lockfiles.
      - .NET: `dotnet add <proj> package <pkg> --version <ver>` (or edit `Directory.Packages.props` and run `dotnet restore` if central package management is in use).
      - Node: `npm install <pkg>@<ver>` / `pnpm add <pkg>@<ver>` / `yarn add <pkg>@<ver>` (preserve dev flag when applicable).
      - Go: `go get <pkg>@<ver> && go mod tidy`.
      - Python: `poetry add <pkg>@<ver>` or pin in `requirements.txt` then `pip install -r requirements.txt`.
      - Docker: edit `FROM` lines in Dockerfile, `image:` in docker-compose; preserve digest pinning if originally pinned by digest.
      - Runtimes: edit `global.json` / `.nvmrc` / `go.mod` toolchain / `.python-version` per the runtime's convention.
   b. **Verify** the manifest + lockfile changed as expected (`git diff --stat`).
   c. **Commit**: subject `bump(<ecosystem>): <pkg> <old> → <new>`; body lists CVE id (if any) and a 1–3 line breaking-changes summary. Lockfile changes are part of this same commit. Do not use `--amend`. Co-Authored-By per host conventions.
   d. **Run per-bump validation** (Phase 5a) on the affected project only.
   e. **Pass** → continue to next bump.
   f. **Fail** → enter Phase 6.
3. After all selected bumps are applied & individually green, run **final full-suite validation** (Phase 5b).

---

## Phase 5 — Validation

### 5a. Per-bump (affected project)

Rerun the project's build, typecheck/lint, and test command captured at baseline — **same command, same cwd**. Diff against baseline:

- **Build / typecheck / lint regression**: went from `ok` → `fail`.
- **Test regression**: a test that was `pass` in baseline is now `fail`, **or** a new failure not present in baseline. Pre-existing baseline failures are ignored.

### 5b. Final full-suite

After the batch:

- Run **every project's test command** (sequential — dependency-graph order if discoverable, else alphabetical).
- If individual per-bump runs were all green but the full-suite reveals regressions, present them as **cross-project regressions** with most-likely-culprit bumps (correlate failing test imports/stack frames against bumped package names).
- User decides which bump(s) to revert.

---

## Phase 6 — Failure analysis & auto-resolve

When a per-bump validation fails:

### 6a. Categorize

- **Test-framework breakage** — failing test imports symbols from a recognized test-framework package, AND that package is the bump just applied (or a direct transitive of it) → **§6c hard revert path**. Do not enter the resolve loop.
- **Build / typecheck regression** or **app-code test regression** → §6d resolve loop.
- **Test code references a removed API of the bumped package** → §6b report + **defer to user**: "revert this bump or pause for manual edit?" Do not contort source.

### 6b. Failure report

Per failed signature (dedupe identical traces — e.g. 50 tests failing on one missing API → one entry with count):

```
❌ <Project> :: <TestName(s) — N occurrences>
   Bump:      <pkg> <old> → <new>
   Mode:      assertion-failure | exception | build-error | typecheck-error | timeout
   Output:    <≤30 lines, middle-truncated, with [...N lines elided] marker>
   Suspicion: <high|medium|low> — <evidence-sentence with file:line>
   Path:      auto-resolvable | requires-test-edit | test-framework-breakage
```

**Suspicion confidence**:
- **high** — failing test source or stack trace mentions the bumped package's namespace / type / method by name.
- **medium** — bumped package is transitively used by a module the failing test imports (verified via import-graph grep).
- **low** — no direct reference found; bump may be coincidental or deep-transitive.

Always cite evidence (file:line of the import or stack frame). Never invent a cause.

### 6c. Test-framework breakage UX

```
⚠️  Test-framework upgrade detected as likely cause.
    Bump:    <pkg> <old> → <new>
    Reason:  failing test imports symbols from <pkg> (recognized test framework).
    Action:  Reverting this bump. Test-framework upgrades are a separate trust
             boundary and must be done as a dedicated, human-reviewed change.
    Next:    Added to "needs-manual-review" list; continuing with remaining bumps.
```

Revert with `git revert <bump-sha> --no-edit`. Add to the `needs-manual-review` list with full failure context. Continue with the next bump.

### 6d. Auto-resolve loop (source-only)

Only entered for build / typecheck / app-code test regressions.

1. Print the §6b failure report.
2. Ask the user: **`yes` (try to auto-resolve) / `skip` (revert this bump and continue) / `abort` (stop the whole run)**. Wait for explicit answer.
3. On `yes`: launch a focused resolution sub-agent with:
   - The bump diff (`git show HEAD`).
   - The failure report.
   - The failing test files (read-only context — must not be edited).
   - The bumped package's changelog/release-notes excerpt (already fetched in Phase 1).
   - Hard constraints:
     - May edit **only files NOT classified as tests**. "Test" = file under a `*test*` / `*Test*` / `tests/` / `__tests__/` path **OR** containing a recognized test-framework import. The test-file set is **pinned at baseline time** so the boundary is deterministic across iterations.
     - May not modify the manifest or lockfile.
     - Returns: list of edits applied + rationale.
4. Rerun §5a affected-project validation.
5. **Green** → commit `fix: adapt to <pkg> <new> API change` on top of the bump commit, continue with the next bump.
6. **Still red and iteration < 3** → loop back to step 3 with the updated failure report appended.
7. **Iteration == 3** → revert the bump commit **and any source edits made for it** (`git reset --hard <pre-bump-sha>`), add to `needs-manual-review` with full failure context, continue with the next bump.

---

## Phase 7 — Finalize

After the §5b full-suite gate:

### 7.1 Summary

Print:

```
bump-deps run summary — branch bump-deps/<base>-<timestamp>

Applied (N):
  • <pkg> <old → new>  [risk] [CVE id if any]
  • ...

Auto-resolved with source edits (M):
  • <pkg> <old → new> — <one-line edit summary>
  • ...

Reverted (P):
  • <pkg> <old → new> — reason: <test-framework | auto-resolve cap | user-defer>
  • ...

Needs manual review (Q):
  • <pkg> — <one-line reason + pointer to failure context>
  • ...

CVEs addressed: R
Holding (current ahead of stable): S
```

### 7.2 Push & PR (opt-in)

Ask:

> **Push branch and open a PR with this summary as the body?**

- On `yes`:
  - `git push -u origin <branch>`.
  - `gh pr create --title "bump-deps: <YYYY-MM-DD>" --body <summary + test-plan>`.
  - PR body includes the §7.1 summary plus a `## Test plan` section listing the exact test commands rerun in §5b.
  - Print the PR URL.
- On `no`:
  - Stop on the branch. Print suggested follow-up commands.

Never push without explicit confirmation.

---

## Notes for the running agent

- **Concurrency**: discovery sub-agents always parallel (one message, multiple Agent calls). Resolution sub-agent always single-instance — sequential is part of the safety story.
- **Native-tool absence**: if `npm` / `dotnet` / `go` / `pip` / `gh` etc. is not installed, the sub-agent must report it explicitly. Do not WebFetch around a missing toolchain — the user needs to know coverage is degraded.
- **Trivial patch grouping**: `@types/*` patches and similar low-risk families may be applied as one commit `bump(node): @types/* patches` — only if all members are patch-level and none has a CVE.
- **Holding deps**: if a project pins a dep above latest stable (e.g. `"react": "19.0.0-rc"` while stable is `18.x`), the row reads `current=19.0.0-rc, latest-stable=18.x.x, action: hold (pre-release ahead)`. Revisit once stable catches up.
- **Anchored-source column is non-optional.** A bump with a missing anchored-source is a bug in the sub-agent and must be reported, not skipped.
- **No `--amend`, no `--force`.** Every action is a new commit. Reverts are explicit `git revert` or `git reset` calls with their reasons printed.
- **Coordinator never edits source code itself** for resolution. Always delegate to a fresh resolution sub-agent so the resolution context stays small and the boundary is enforceable.
