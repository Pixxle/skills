---
name: prototype
description: Build a throwaway prototype to flesh out a design before committing to it. Routes between two branches — a runnable terminal app for state/business-logic questions, or several radically different UI variations toggleable from one route. Use when the user wants to prototype, sanity-check a data model or state machine, mock up a UI, explore design options, or says "prototype this", "let me play with it", "try a few designs". The code is throwaway and answers one question by running it. For the production shape of types, signatures, and modules, use architect.
disable-model-invocation: true
---

# Prototype

A prototype is **throwaway code that answers a question**. The question decides the shape.

## Pick a branch

Identify which question is being answered — from the user's prompt, the surrounding code, or by asking if the user is around:

- **"Does this logic / state model feel right?"** → [LOGIC.md](LOGIC.md). Build a tiny interactive terminal app that pushes the state machine through cases that are hard to reason about on paper.
- **"What should this look like?"** → [UI.md](UI.md). Generate several radically different UI variations on a single route, switchable via a URL search param and a floating bottom bar.

The two branches produce very different artifacts — getting this wrong wastes the whole prototype. If the question is genuinely ambiguous and the user isn't reachable, default to whichever branch better matches the surrounding code (a backend module → logic; a page or component → UI) and state the assumption at the top of the prototype.

## Rules that apply to both

1. **Throwaway from day one, and clearly marked as such.** Pick its location by what it prototypes, per the cases below, and never put it inside production code paths. Name it so a casual reader can see it's a prototype, not production.
   - **Tied to a module or page.** Put it next to the module or page it's prototyping for, so context is obvious. A logic prototype or a behavioral probe goes next to the code it exercises. A UI prototype with a host page renders on that page, per [UI.md](UI.md).
   - **A UI with no host page.** When the sketch needs the app's runtime (its data, auth, or components), use a throwaway route that obeys the project's routing convention. Don't invent a new top-level structure. Otherwise build it in an isolated scratch dir.
   - **Tied to no module.** Use an isolated scratch dir. There, use the lightest stack that runs the idea and no production framework.
2. **One command to run.** Whatever the project's existing task runner supports — `pnpm <name>`, `python <path>`, `bun <path>`, etc. The user must be able to start it without thinking.
3. **No persistence by default.** State lives in memory. Persistence is the thing the prototype is _checking_, not something it should depend on. If the question explicitly involves a database, hit a scratch DB or a local file with a clear "PROTOTYPE — wipe me" name.
4. **Skip the polish.** No tests, no error handling beyond what makes the prototype _runnable_, no abstractions. The point is to learn something fast and then delete it.
5. **Surface the state.** After every action (logic) or on every variant switch (UI), print or render the full relevant state so the user can see what changed.
6. **Delete or absorb once the decision is settled.** Until then, keep it at its path so the user can try it. Once it has answered its question and the user has the answer, either delete it or fold the validated decision into the real code. Don't leave it rotting in the repo. Report its path and whether you kept it for review, deleted it, or absorbed it.

## When done

The _answer_ is the only thing worth keeping from a prototype. Capture it somewhere durable (commit message, ADR, issue, or a `NOTES.md` next to the prototype) along with the question it was answering. If the user is around, that capture is a quick conversation; if not, leave the placeholder so they (or you, on the next pass) can fill in the verdict before deleting the prototype.
