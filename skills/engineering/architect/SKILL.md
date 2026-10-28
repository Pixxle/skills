---
name: architect
description: >-
  Settle the caller's usage, types, signatures, and module boundaries before
  writing code. Grounds in the existing system, runs an arena of at least two
  structurally distinct sketches, implements against the synthesized sketch,
  and scraps it when implementation friction shows the shape is wrong. Use for
  "architect this", "design this first", "sketch the types before coding",
  "architect with checkpoint", or work that crosses a function boundary or
  moves ownership, where jumping to code would lock in the wrong shape.
  Settles the production shape. For a throwaway sketch that answers a question
  by running it, use prototype.
---

# Architect

Sketch types, signatures, class shapes, and module boundaries with `not implemented` bodies and pseudocode. Synthesize across competing candidates, then fill in code against the chosen sketch.

Skip it for mechanical work whose shape is already concrete. A second [arena](../arena/SKILL.md) over a settled design is over-engineering.

[prototype](../prototype/SKILL.md) answers an empirical question with throwaway code. Architect settles the production shape. When a sketch has an open question a run can settle, such as a layout, a timing, or whether a state model holds, prototype it instead of debating it.

## Phases

Open a todolist with one entry per phase before starting.

| Phase | Produces |
| --- | --- |
| A. Ground | A [how](../how/SKILL.md) explanation of every touched system, plus a [why](../why/SKILL.md) rationale when ownership or layering moves |
| B. Sketch | One synthesized design package from [arena](../arena/SKILL.md) with usage, types, signatures, module map, and rationale |
| C. Agree (opt-in) | User sign-off on the sketch |
| D. Implement | Code that fills the sketch, with deviations surfaced |
| E. Scrap | A fresh grounding and a smaller sketch when the architecture proves wrong |

## A. Ground

Build a real mental model of every system the new code touches. Run [how](../how/SKILL.md) over the relevant subsystems and produce the architectural explanation it prescribes. Naming a file isn't grounding. If the design redefines ownership or layering, also run [why](../why/SKILL.md) on the existing shape so its rationale becomes a constraint, not a guess.

Skip phase A only for greenfield work with no surrounding system to integrate.

## B. Sketch

Save the phase A output to one grounding file. Run [arena](../arena/SKILL.md) with the design-sketch task and that file as shared grounding. Each runner brief carries the absolute paths of this file and of [references/runner-prompt.md](references/runner-prompt.md), which is the runner's prompt. Pick runners per [arena phase A](../arena/SKILL.md#a-frame) step 3.

Design it twice. Require at least two structurally distinct candidates before synthesis, even when the first looks sufficient. Whole-shape alternatives count. Point fixes inside one shape don't. If every candidate lands on one shape, run one more runner barred from that shape before calling it consensus.

Screen every candidate against [references/design-red-flags.md](references/design-red-flags.md) before synthesis. Assume the next contributor is an agent that sees only the files it opened, copies the nearest example, and takes the shortest path that compiles. Prefer the design where a change that looks right from one file is right for the whole repo.

Compare viable candidates on interface depth. Prefer the design that hides more complexity behind a smaller, simpler public surface. A rich interface can keep call chains short by concentrating capability instead of scattering it across layers.

[Arena](../arena/SKILL.md) returns one synthesized design package. Its synthesis note fills the rationale's "Synthesis decision" section.

## C. Agree (opt-in)

By default, go straight from the synthesized design to implementation with no human checkpoint.

Checkpoint only when the user asks, as in "with checkpoint" or "show me before implementing". Then present the synthesized design and wait for sign-off.

Either way, the sketch can land as its own commit before fill-in, as scaffold. Planned, scoped breakage during fill-in is fine. For adversarial pressure before implementing, run [interrogate](../interrogate/SKILL.md) on the sketch once stubs or prototypes give adversaries something to run. A contested product call that no run can settle goes to [grill-me](../../productivity/grill-me/SKILL.md).

If the user pushes back on the shape, treat that as phase A evidence. Re-ground and re-run phase B before writing more code.

## D. Implement against the sketch

Replace `not implemented` bodies with code and pseudocode with logic. The sketch is the contract. Surface deviations instead of absorbing them silently. If a function needs a parameter the sketch didn't anticipate, ask whether the sketch was wrong, the requirement was missed, or the implementation is overreaching.

## E. Scrap when the architecture is wrong

If implementation keeps producing friction the sketch can't absorb, throw the sketch out. Don't bolt fixes onto a wrong design.

The signal is a pattern, not a single instance. Tells:

- The same shape of workaround appears across unrelated code.
- Several unrelated edge cases each need a special-case branch.
- Types need escape hatches (`any`, casts, optional fields that are always set) to compile.
- The "we need a lock" reflex appears where the sketch said state wasn't shared.
- Callers must know the abstraction's internal rules to use it.
- Two or more independent phase D deviations share one shape.

Use judgment. A few edge cases don't condemn an architecture. Complexity in the data is not complexity in the design.

When you scrap:

1. Re-run [how](../how/SKILL.md) over what's been built.
2. Redesign as if the new constraints had been day-one assumptions.
3. Subtract before adding, per [principles](../principles/SKILL.md). The new sketch is smaller than the old one before it grows.
4. Return to phase B and re-run [arena](../arena/SKILL.md).

## Output

The caller's usage comes first and the type sketch derives from it. A small change gets one file of new types and signatures. Larger work gets a module map plus type definitions. The rationale ships alongside, shaped per [references/rationale-template.md](references/rationale-template.md), including the usage sketch and the synthesis decision.
