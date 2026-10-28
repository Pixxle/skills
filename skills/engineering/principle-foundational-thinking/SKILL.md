---
name: principle-foundational-thinking
description: Get the data structures right before writing logic, so downstream code becomes obvious. Settle core types and access patterns, lay scaffold before features, and isolate state that concurrent actors share. Use before writing logic, when choosing core types and data structures, sequencing scaffold-vs-feature work, or asking what concurrent actors share.
disable-model-invocation: true
---

# Foundational Thinking

**Structural decisions** protect option value. **Code-level decisions** protect simplicity.

**Data structures first.** Get the data shape right before writing logic. Define core types early, trace every access pattern, and choose structures that match the dominant paths.

At code level, DRY the structure, not every line. Types and data models should converge. Three similar statements still beat a premature abstraction. Prefer explicit over clever. When the shape is already clear, prefer boring local code. Test behavior and edge cases, not line counts, per [`principle-test-behavior-not-implementation`](../principle-test-behavior-not-implementation/SKILL.md).

**Concurrency corollary.** Before sharing state between actors, ask "what happens if another actor modifies this concurrently?" If not "nothing", isolate.

**Scaffold first.** If something helps every later phase, do it first. Ask "does every subsequent phase benefit from this existing?" CI, linting, test infrastructure, and shared types are scaffold. Sequence for option value: setup before features, tests before fixes. Keep commits small and single-purpose.

Each increment should land a coherent abstraction or deepen one that exists. Do not spread a new capability across callers as special-case coordination.

Subtraction comes before scaffolding. Remove dead code first, then lay foundations.

Once the shape is settled, read and follow [`principle-model-the-domain`](../principle-model-the-domain/SKILL.md) to encode domain knowledge in it instead of scattering conditionals and shape assumptions.
