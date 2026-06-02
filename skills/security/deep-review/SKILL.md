---
name: deep-review
description: Deep technical deep-dive into a codebase (not a diff) that hunts for code-judo moves — dramatic structural simplifications — and verifies every one before reporting. Runs four phases of sub-agents: discovery (map the system), review (find improvements to the thermo-nuclear quality bar), QA (adversarially follow the code paths to confirm each finding is real), and a prioritized terminal report. Use for "deep review", "deep-dive the codebase", "find improvement opportunities", or a verified architectural audit of a service or the whole repo.
disable-model-invocation: true
---

# Deep Review

A whole-codebase audit (not a branch diff) that finds high-value improvements and **proves each one is real** before reporting. It applies the quality bar from `thermo-nuclear-code-quality-review` and the fan-out pattern from `map-system`, then adds a QA phase that kills plausible-but-wrong findings.

The goal is to find **where the code is a tangled mess** — the load-bearing wrong abstractions that make this codebase hard to change — and only secondarily the **code-judo moves** (behavior-preserving restructurings that make the implementation dramatically simpler). Depth comes from asking *"what would fight me if I had to change this?"*, not *"what can I safely delete?"*. Do not settle for "this could be a bit cleaner," and do not let the run degrade into a list of dead-code and duplication nits — those are real but they are not the point.

The deepest failure mode of this skill is **shallow breadth**: module-by-module slices that each look fine in isolation while the actual tangle lives in the seams between them. Guard against it deliberately — see the distress-signal mining and flow targets in Phase 1, and the tangle pass in Phase 2.

Run the four phases in order. Each phase fans out sub-agents. All inter-phase handoff goes through a scratch dir `_deep-review/` at the repo root so the run is inspectable and resumable; the final deliverable is printed to the **terminal**.

## Phase 0 — Scope & priors

- If an argument was given (`/deep-review <path|service|"."> `), use it as the review scope. Otherwise, detect whether this is a monorepo and **ask** whether to review one service or the whole repo.
- **Seed with the human's priors — do not review cold.** Before scoping, ask the user what they already know hurts: which module is scary, which recent change was far harder than it should have been, which bug keeps recurring, which file everyone avoids. Capture the answers in `_deep-review/00_priors.md`. Point the deepest agents at these, and at the end of the run treat **"did we surface the known problems?"** as the pass/fail check on the whole review. If the method can't rediscover what a human already knows is broken, the method is still wrong. **A prior that an *interaction* feels brittle ("the way X consumes Y feels fragile") is the single most valuable kind** — it points at a consumer-side seam, which is exactly what distress signals and module-by-module review are blind to. Route any such prior straight to a `seam` target (Phase 1, signal 8) that owns both sides of the edge.
- **No priors is fine — priors are an accelerant, not a dependency.** If the user is new to the repo or has nothing to offer, record "none" in `00_priors.md` and lean entirely on the Phase 1 distress map as the substitute — that mining exists precisely for the cold-repo case. Helpful pattern: once the distress map lands early in Phase 1, surface its top 3–5 suspects back to the user (*"the repo points at X, Y, Z — want me to weight any before I spend deep-dive budget?"*) to convert a newcomer into having cheap, evidence-based priors. Be aware of the blind spot: distress signals are historical (where change/bugs already happened) and can miss code that is quietly rotten but rarely touched — the Phase 2 tangle pass, which reasons about cost-of-change rather than history, is what covers that gap.
- Create `_deep-review/` at the repo root (offer `_deep-review_<date>/` if one already exists).
- If `_mapping/` already exists from `map-system`, read it for Phase 1 instead of re-mapping — note that you reused it.

## Phase 1 — Discovery (map the system as it stands)

Fan out `Explore` sub-agents **in a single message** to map the scope. Use the **Discovery brief** in [BRIEFS.md](BRIEFS.md). The job of this phase is threefold: build a real understanding, **mine the repo's own distress signals**, and produce a **worklist**.

**Distress-signal mining (do this before partitioning).** Targeting by file size and dependency count finds *big* files, not *hard-to-change* ones. Instead, let the repo tell you where it hurts: git churn (files changed most in the last ~12 months), bug-fix density (`git log --grep=fix -i`), co-change coupling (files that keep changing together — these are your hidden seams), test gaps (production files with no/brittle tests; an oversized test file is itself a smell), and TODO/HACK/FIXME plus "careful"/"don't touch"/"load-bearing" comments. Write this to `_deep-review/00_distress.md`.

**If the distress map comes back flat** — a young repo, or one in heavy feature-build mode with few bug fixes — the historical signals are mismatched to the repo's phase; the debt is being created now, not yet paid in bugs. Do not read flat as healthy. Pivot to the non-historical signals in the Discovery brief (fan-in/centrality, god-object growth rate, cross-feature co-change, recent TODO/untested-new-code), and point the tangle pass at the **features currently in flight** rather than hypothetical changes. The review's value shifts from diagnostic ("where are the bugs") to predictive ("which abstractions won't survive the next stretch of feature work"). And if the tangle pass on real in-flight features still comes back clean, report it as a genuinely healthy result for the repo's phase — do not pad with cosmetics.

**The worklist is more than a module partition.** Produce three kinds of target, and **order them by the distress map (and the Phase 0 priors), never by line count**:
- **Module targets** — coherent domain slices, as before.
- **Flow targets** — at least one per major end-to-end scenario that crosses module boundaries (e.g. "an upstream event triggers a downstream record, which emits its own events, which fan out to other consumers"), each owned by **one** agent end to end. This is the single best defense against the tangle hiding in the seams that module slices never own.
- **Deep-dive targets** — the 2–3 worst subsystems (per distress map + priors) get a long-running, large-budget agent on a strong model, **not** a 3-minute slice. Do not give the scariest subsystem the same cheap treatment as a healthy one.

Write the worklist to `_deep-review/00_worklist.md`, tagging each target `module` / `flow` / `deep-dive`. This is what Phase 2 consumes.

## Phase 2 — Review (find candidate improvements)

For each target in the worklist, spawn a **review sub-agent** with the **Review brief** in [BRIEFS.md](BRIEFS.md). The brief embeds the full thermo-nuclear standards (code-judo, 1k-line smell, spaghetti branching, boundary leaks, magic abstractions, type/contract cleanliness, orchestration atomicity).

Each agent writes **structured candidate findings** (one block per finding, schema in [BRIEFS.md](BRIEFS.md)) to `_deep-review/candidates/<target>.md`. The Review brief leads with a **tangle pass** (the primary deliverable — model-level findings about what makes the target hard to change) and treats local judo moves as secondary. Findings are **unverified candidates** at this stage — no finding skips Phase 3.

Run `flow` and `deep-dive` targets on a **stronger model with a large budget and no time pressure**; the `module` breadth pass can stay cheaper. Depth in the 2–3 subsystems that matter beats breadth across twenty that don't. Run targets in parallel. As soon as a target's candidates land, its QA can begin (pipeline — don't wait for every review to finish).

## Phase 3 — QA (adversarially verify every candidate)

Every candidate goes to its own **QA sub-agent** with the **QA brief** in [BRIEFS.md](BRIEFS.md). The QA agent takes a **wider and deeper** perspective than the reviewer: it follows the actual code paths, checks callers and call sites, looks for the context that might justify the current design, and confirms the proposed judo move actually preserves behavior.

QA verifies **two** things, not one: (1) is the finding *true*, and (2) is it the *core* problem or a *symptom* of a deeper one. It returns a verdict — **CONFIRMED / REJECTED / REFRAMED** — plus a severity tag **CORE / CONTRIBUTING / COSMETIC**, with an evidence trail (paths, line numbers, what it traced). A true-but-shallow finding is `CONFIRMED-COSMETIC`, not just `CONFIRMED`; if it is a symptom of a model-level tangle, the QA agent **reframes it upward** to the root cause rather than polishing the symptom. For DEEP/model findings the adversarial stance flips: don't try to refute that the tangle exists — try to find the *real* boundary that fixes it and cost the change honestly.

**Guard rail:** several patterns in this codebase are intentional by design (static singletons, shared models, Dapper repositories) — a QA agent must REJECT a finding that merely objects to an intentional pattern unless it has concrete evidence of harm. But intentional ≠ immune: if an intentional pattern is the *source* of a tangle, that is a CORE finding, not a rejection. Write verdicts to `_deep-review/verdicts/<target>.md`.

## Phase 4 — Terminal report

Read all CONFIRMED and REFRAMED verdicts. Synthesize and **print to the terminal** following [OUTPUT.md](OUTPUT.md). The report **opens with the core tangles** — the 1–3 model-level findings (severity CORE) that explain what makes this codebase hard to change, each with the change-scenario and blast radius that proves it. The judo-move cleanup list comes *after*, clearly subordinate, prioritized by the thermo-nuclear ordering (structural regressions → missed dramatic simplifications → spaghetti → boundary/type → file-size → modularity → legibility), each with location, payoff, confidence, and the QA evidence trail. Report how many candidates were raised, confirmed, rejected, and reframed — silent truncation reads as "covered everything" when it wasn't. Finally, **check the report against `_deep-review/00_priors.md`**: explicitly state which of the human's known problems the review did and did not surface — a known problem the run missed is a finding about the run. Mention that `_deep-review/` holds the full backing detail.
