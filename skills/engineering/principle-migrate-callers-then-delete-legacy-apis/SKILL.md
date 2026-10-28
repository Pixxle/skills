---
name: principle-migrate-callers-then-delete-legacy-apis
description: Migrate every caller to a new internal API and delete the old API in the same wave, instead of preserving compatibility layers. Use when introducing a new internal API while old callers still exist and no external users depend on backward compatibility.
disable-model-invocation: true
---

# Migrate Callers Then Delete Legacy APIs

When a new internal API replaces an old one, migrate every caller and delete the old API in the same wave. Do not preserve compatibility layers.

- Update tests to assert the new contract, and delete tests that only protect pre-refactor implementation details, per [`principle-test-behavior-not-implementation`](../principle-test-behavior-not-implementation/SKILL.md)

**When this applies:**
- No external users depend on backward compatibility
- The project can absorb coordinated breaking changes
- The new API is part of a simplification or refactor initiative
