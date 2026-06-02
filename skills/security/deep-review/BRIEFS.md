# Sub-agent briefs

Each brief is a self-contained prompt — the sub-agent does not see your conversation. Copy the brief verbatim, fill in the `{{...}}` placeholders, and adapt file-extension hints to the scope's language (this repo is .NET services + a React/Vite frontend).

Shared rules for every brief:

- Absolute file paths in every citation, with line numbers where they sharpen the point.
- Be honest and hostile-to-the-code in a productive way: surface dead code, drift, and missing pieces; do not rationalise.
- Length is governed by the code, not a word target.

---

## The finding schema (the contract between phases)

Phase 2 review agents emit findings as repeated blocks in this exact shape. Phase 3 QA agents read them, Phase 4 prints them. Keep the keys stable.

There are two finding shapes. **DEEP findings** (from the tangle pass) come first
and are the point of the review. **LOCAL findings** (judo moves) come after.

DEEP finding (tangle / model-level — may be non-local, may not preserve behavior):

```
### D<NN> — <one-line title of the core problem>
- **target:** <worklist target name>
- **category:** tangle-model
- **core-problem:** <the load-bearing wrong abstraction / dual source of truth /
  ownership boundary — name it, don't describe a symptom>
- **change-scenario:** <the realistic change you traced, e.g. "add a new health
  case type", and the N places it forces you to touch>
- **blast-radius:** <files/layers/hops involved; the cycle or drift; what an
  unsuspecting dev would break>
- **locations:** <absolute path:line>, ... (the sites that prove it)
- **better-model:** <the boundary/state-model/ownership change that collapses the
  whole class of problem — the deep move, even if large or behavior-changing>
- **payoff:** <what stops being hard; how many future changes get cheaper>
- **confidence:** HIGH | MED | LOW
- **risk-if-wrong:** <what this reframing would cost if the model is misread>
```

LOCAL finding (code-judo move — behavior-preserving, local):

```
### F<NN> — <one-line title>
- **target:** <worklist target name>
- **locations:** <absolute path:line>, <absolute path:line>, ...
- **category:** structural-regression | missed-simplification | spaghetti-branching | boundary-or-type | file-size | modularity | legibility
- **problem:** <what is wrong, concretely — name the concepts a reader must hold>
- **judo-move:** <the restructuring that deletes complexity rather than rearranging it; what disappears>
- **payoff:** <what gets simpler/smaller/safer, ideally with a line-count or branch-count delta>
- **behavior-preserved:** <why this keeps behavior identical>
- **confidence:** HIGH | MED | LOW
- **risk-if-wrong:** <what breaks if this finding is acted on but was mistaken>
```

---

## Brief 1 — Discovery (Explore agent, run several in parallel)

```
You are mapping part of {{project_name}} at {{repo_root}}, scoped to {{scope}}.

Do not propose fixes. Your job is to UNDERSTAND and PARTITION this scope into
review targets for a later phase.

Investigate {{your_slice}} and report:

1. The modules/domains in your slice, grouped by responsibility (identity,
   billing, scheduling, …) — NOT alphabetically.
2. For each: entry points, the key types/classes, what it depends on, what
   depends on it.
3. God objects and complexity hotspots — rank by responsibility surface and
   line count. For each: file path, line count, the worst-offending method,
   and one line on why it concentrates complexity.
4. The seams — where this slice talks to other slices (shared models, events,
   HTTP, the database). These are where boundary leaks hide.
5. Anything that already looks like a code smell worth a closer look later
   (sprawling files, repeated conditionals, suspicious wrappers) — just note
   the location, do not analyse it yet.

6. DISTRESS SIGNALS — where the repo itself says it hurts. This matters MORE
   than file size. Gather: git churn (files changed most in ~12 months), bug-fix
   density (`git log --grep=fix -i -- <slice>`), co-change coupling (files that
   keep changing together — hidden seams), test gaps (production files with
   no/brittle tests; an oversized test file is itself a smell), and TODO/HACK/
   FIXME plus "careful"/"don't touch"/"load-bearing" comments. Report the worst
   offenders by these signals, not by line count.
   IF THE DISTRESS MAP COMES BACK FLAT (a young repo, or one in heavy
   feature-build mode with few bug fixes), the historical signals are mismatched
   to the repo's phase — debt is being created now, not yet paid in bugs. Do NOT
   read flat as healthy. Switch to phase-appropriate, NON-historical signals:
   - centrality / fan-in: which module does EVERY new feature import or edit (the
     shared enum, the big DbContext, the auth context) — the unavoidable bottleneck;
   - god-object GROWTH RATE: files accreting logic fastest commit-over-commit
     without being split — the tangle forming in real time;
   - cross-feature co-change: a file touched by many UNRELATED feature areas (this
     is structural gravity; same-feature co-change is just noise);
   - recently-added TODO/HACK and new code shipped without tests — where corners
     are being cut under feature pressure.
7. CROSS-MODULE FLOWS — the 2-4 end-to-end scenarios that thread through several
   modules (e.g. "an upstream event triggers a downstream record, which emits its
   own events that fan out to other consumers"). These are the seams where tangle
   hides; name each flow and the files it crosses.
8. CONSUMER-SIDE SEAMS — enumerate every producer→consumer edge (each Rebus event
   type, each cross-service HTTP adapter, each place service B handles a message
   service A produced). This is mechanical and needs NO distress signal, so it
   survives a clean/young/feature-heavy repo. Prioritize RULE-BEARING seams (one
   that carries business rules is far more brittle-prone than a plain entity-sync
   edge). Flag the ASYMMETRY: a clean, atomic producer
   paired with a messy consumer of it is a strong tell that the interface is wrong
   — the producer is exporting its internal model and the consumer is adapting.
   The brittleness lives in NEITHER module's internals, so no module slice will
   ever own it; it needs its own target.

Output a partition with FOUR kinds of target, each named and tagged:
- `module` targets — coherent domain slices, with files, god objects, hotspots,
  entry points.
- `flow` targets — one per cross-module scenario from (7), to be reviewed by a
  single agent end-to-end.
- `seam` targets — one per rule-bearing producer→consumer edge from (8), reviewed
  by a single agent that owns BOTH sides of the edge. The brittleness is on the
  consumer side of a contract; an agent that sees only one module cannot find it.
- `deep-dive` targets — the 2-3 worst subsystems by the distress signals in (6)
  (and any priors the orchestrator hands you), flagged for a long, large-budget
  review rather than a quick slice.
ORDER targets by distress, NOT alphabetically and NOT by size. A later agent
will be handed one target at a time. Use absolute paths.
```

After the Explore agents return, the orchestrator writes `_deep-review/00_distress.md` (the signal map) and consolidates the partitions into `_deep-review/00_worklist.md` — a numbered list of targets tagged `module`/`flow`/`deep-dive`, deduped, ordered by distress + the Phase 0 priors, each with its file set, hotspots, and (for flows) the path it crosses.

---

## Brief 2 — Review (one agent per worklist target)

```
You are doing a STRICT maintainability review of one slice of {{project_name}}
at {{repo_root}}. Your target is:

{{target_block}}   // name, files, god objects, hotspots from the worklist

FIRST, do a TANGLE PASS — this is the primary deliverable. The judo moves below
are secondary. Do NOT lead with dead code and duplication; those are real but
they are not why this code is hard to change.

Pick the 2-3 changes a team is most likely to need in this target (add a new
case type / rule / report / field / state / channel; change an ownership
boundary) and trace what each would ACTUALLY take, file by file, layer by layer.
If there is FEATURE WORK IN FLIGHT, use those actual changes as your scenarios —
a real change beats a hypothetical one, and a feature-building repo hands you the
best possible evidence of where the model is inadequate. Frame the finding
predictively: which abstraction won't survive the next stretch of feature work,
and why. Then report:

- The load-bearing WRONG abstraction: the type, state model, or ownership
  boundary that forces a one-line intent into an N-place edit. Name it explicitly.
- Sources of truth that disagree: state both stored and recomputed, the same
  rule encoded in two places that must stay in sync, a flag and a derived value
  that can diverge. Do NOT file the divergence as a one-line fix — name the
  model that removes the whole CLASS of divergence.
- Flow you had to hold in your head: to understand ONE operation, how many
  files / layers / hops did you traverse? If it spans aggregate + service +
  base-service + controller + events + shadow-replica, say so and say why.
- Cyclic / backward dependencies: service→repo→context→back, an aggregate that
  emits events it also consumes, a replication shadow that drifts from its source.

IF THIS IS A `seam` TARGET (a producer→consumer edge), review the CONSUMER side
specifically and ask:
- Does the consumer faithfully model the producer's concepts, or does it
  translate / reconstruct / guess / shadow them? Scattered interpretation of a
  producer's output across the consumer's internals is the brittleness.
- ASYMMETRY: is the producer clean/atomic while the consumer that ingests it is
  messy? That means the interface is exporting the producer's internal model and
  forcing the consumer to adapt. The fix is usually a published consumer-ready
  contract OR one explicit anti-corruption / translation layer — NOT cleaning up
  the consumer file in place. Flag the INTERFACE, as a CORE finding.
- EVOLVABILITY change-scenario: the producer adds or changes an output (a new
  rule type, a new field, a new state). Trace what breaks downstream and in HOW
  MANY places the consumer must change. If a producer-side addition forces edits
  deep in the consumer's core logic, the seam is brittle — that is the finding,
  not the N+1 query next to it.

DEEP findings may be NON-LOCAL and NON-BEHAVIOR-PRESERVING. That is allowed and
wanted. One model-level finding ("status is tracked three ways; here is the
single model that collapses it") outranks any number of dead-code deletions.

Rank everything by COST-OF-CHANGE, NEVER by file size. A 200-line file in a call
cycle is worse than an isolated 900-line file. The question is not "what is big"
but "what fights you when you touch it." If you were handed god-objects/hotspots
in the target block, treat them as starting points to investigate, not as the
answer — the real tangle is often in the small files that connect them.

THEN, secondarily, apply the thermo-nuclear quality bar for local CODE-JUDO MOVES:
restructurings that preserve behavior while making the implementation
dramatically simpler, smaller, and more direct. Prefer deleting complexity over
rearranging it. Prefer the version that makes the code feel inevitable in hindsight.

Flag aggressively, in priority order:
1. Structural regressions — a previously cohesive module that is now coupled,
   stateful, or hard to scan.
2. Missed dramatic simplifications — a complicated implementation where a
   reframing could delete whole branches, helpers, modes, or layers.
3. Spaghetti/branching growth — ad-hoc conditionals, scattered special cases,
   one-off flags bolted into unrelated flows.
4. Boundary & type problems — feature logic leaking into shared paths;
   implementation details leaking through APIs; unnecessary casts, `any`,
   `object`, optionality, or ad-hoc object shapes that obscure the real
   invariant; magic/generic mechanisms hiding simple data-shape assumptions;
   thin wrappers / identity abstractions that add indirection without clarity.
5. File-size — files over ~1000 lines that should be decomposed.
6. Modularity — duplicated logic instead of a shared canonical helper; logic
   living in the wrong layer/package.
7. Legibility — narrow edge cases buried mid-function; sequential orchestration
   or non-atomic updates where the cleaner structure is obvious.

Prefer remedies that REMOVE moving pieces: delete a layer of indirection,
reframe the state model so conditionals vanish, change an ownership boundary so
the feature becomes a natural extension of an existing abstraction, replace a
condition chain with a typed model or dispatcher, reuse the canonical helper.

Note: in this codebase some patterns are INTENTIONAL — static singletons,
shared models across services, and Dapper repositories are by design. Do not
flag those as smells on principle. BUT intentional ≠ immune: if one of them is
the SOURCE of the tangle you found in the tangle pass, say so with concrete
change-cost evidence. An intentional pattern that makes every change expensive
is still a CORE finding.

Emit findings ONLY in this block format, one per finding (no prose around it):

{{finding_schema}}

Be high-conviction: a few real structural findings beat a long list of nits.
For each, fill judo-move, payoff, behavior-preserved, and risk-if-wrong
honestly. If you are unsure a finding is real, set confidence LOW and say why
in risk-if-wrong — the next phase will verify it.

Write your findings to {{repo_root}}/_deep-review/candidates/{{target_slug}}.md
```

---

## Brief 3 — QA (one agent per candidate finding)

```
You are the QA verifier for ONE proposed finding in {{project_name}} at
{{repo_root}}. A reviewer raised it; your job is to take a WIDER and DEEPER
perspective and decide TWO things: (1) is it TRUE, and (2) is it the CORE problem
or merely a SYMPTOM of a deeper one.

The finding:

{{finding_block}}

If this is a DEEP / tangle-model finding (a `D<NN>` block), flip your stance:
do NOT try to refute that the tangle exists. Instead, trace the change-scenario
yourself, confirm the blast radius, and pressure-test the proposed better-model —
find the REAL boundary that fixes it and cost the change honestly. A DEEP finding
is REJECTED only if the tangle isn't real or the model is already correct.

If this is a LOCAL / judo finding (an `F<NN>` block), be adversarial and default
to skepticism. Additionally ask: is this a true-but-shallow SYMPTOM of a
model-level tangle? If so, REFRAME IT UPWARD to the root cause rather than
polishing the symptom. Do the work the reviewer may not have:

1. Open every cited location and read the surrounding code, not just the lines.
2. Follow the code paths OUTWARD — find the callers and call sites, the
   implementers of the interface, the tests that pin current behavior. Use
   grep/search across the whole repo, not just the target slice.
3. Look for the CONTEXT that might justify the current design: a constraint, a
   second caller with different needs, a performance reason, an intentional
   pattern (static singletons, shared models, Dapper repos are intentional here
   — reject findings that merely object to those without evidence of harm).
4. Verify the proposed judo-move actually PRESERVES BEHAVIOR — trace whether it
   would change any observable output, edge case, error path, or contract.
5. Estimate the true payoff — is the simplification as large as claimed once you
   account for everything the current code handles?

Return exactly one verdict AND a severity tag:

- CONFIRMED — real and sound (for a judo move, behavior-preserving; for a deep
  finding, the tangle and better-model hold). Tighten the payoff if mis-stated.
- REFRAMED — real issue, but the framing or proposed move is wrong, OR it's a
  shallow symptom of a deeper tangle; give the corrected move / the root cause.
- REJECTED — not a real issue, or the move would change behavior unacceptably, or
  the design is justified. Say exactly why, citing what you traced.

Severity (always tag): **CORE** (a load-bearing reason the code is hard to change)
/ **CONTRIBUTING** (real, makes things worse, but not the root) / **COSMETIC**
(true but shallow — dead code, a rename, a local dedup). A true cosmetic finding
is `CONFIRMED-COSMETIC`, not just `CONFIRMED`. Intentional ≠ immune: if an
intentional pattern (static singleton, shared model, Dapper repo) is the SOURCE
of a tangle, that is CORE, not a rejection.

Output:

### <F-id> — <CONFIRMED | REFRAMED | REJECTED> · <CORE | CONTRIBUTING | COSMETIC>
- **traced:** <the call sites / implementers / tests / change-scenario you actually followed, with paths:lines>
- **finding:** <reason for the verdict, concrete>
- **corrected-move:** <only for REFRAMED — the corrected judo-move or the root-cause reframe>
- **corrected-payoff:** <only for CONFIRMED/REFRAMED>
- **confidence:** HIGH | MED | LOW

Write to {{repo_root}}/_deep-review/verdicts/{{target_slug}}.md (append).
```
