# Boldness — Code Judo for Forward Design

`thermo-nuclear-code-quality-review` points this philosophy *backward* at a diff that already exists. This skill points it *forward*: design the change so the complexity never gets written in the first place. Deleting complexity that doesn't exist yet is cheaper than deleting it after review.

## The bar

Do not propose the first solution that works. The default proposal — bolt a new branch, flag, service, or table onto the existing flow — is almost always available and almost never the best one. Treat "this works" as the floor, not the goal.

The proposal should make the change feel **inevitable in hindsight**: as if the architecture was always shaped to receive it.

## Look for the judo move

A code-judo move is a reframing that uses the existing architecture more effectively so that the change becomes dramatically smaller. Actively search for one before writing:

- **Reframe so branches disappear.** Can the problem be modeled so the special cases collapse into one default flow, instead of adding conditionals to an existing path?
- **Find the existing seam.** Is there already an interface, event, or extension point where this belongs as a natural adapter — rather than a new bespoke mechanism wired through unrelated code?
- **Change the ownership boundary.** Can the feature become an extension of a module that already owns the concept, instead of new logic scattered across shared paths?
- **Delete, don't rearrange.** Prefer a solution that removes moving pieces over one that spreads the same complexity around. If the design lets you retire an old path while adding the new one, that's the strong version.
- **Make the type/state model carry the weight.** Push correctness into the data shape or state machine so the runtime branching simplifies, rather than guarding invariants with runtime checks.
- **Question the premise.** Sometimes the boldest move is showing the asked-for thing is the wrong thing to build, and a smaller change solves the real problem.

## Smell tests for a weak proposal

If your draft does any of these, look harder for the judo move:

- It adds a new boolean, mode, or flag that complicates an existing flow.
- It introduces a wrapper or pass-through layer that adds indirection without deleting any.
- It scatters feature-specific checks across shared or general-purpose code.
- It pushes a file well past a healthy size instead of decomposing. (1000+ lines in a single file)
- It rearranges complexity but the reader must still hold the same number of concepts in their head.
- It duplicates a capability the codebase already has a canonical home for.

## Discipline, not recklessness

Bold ≠ reckless. The judo move still has to respect existing ADRs (or explicitly argue for reopening one), preserve behavior unless behavior change is the point, and stay grounded in evidence from the exploration — not in a clever idea that ignores how the system actually works. "Measure twice, cut once": the boldness is in the *target*, the rigor is in the *path*.

Always present the boring fallback too. Lead with the bold move; keep the incremental version as the safe option so the user can choose with eyes open.
