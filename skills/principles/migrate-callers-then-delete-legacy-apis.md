# Migrate Callers Then Delete Legacy APIs

When a new internal API replaces an old one, migrate every caller and delete the old API in the same wave. Do not preserve compatibility layers.

- Update tests to assert the new contract, and delete tests that only protect pre-refactor implementation details, per [Test Behavior, Not Implementation](test-behavior-not-implementation.md)

**When this applies:**
- No external users depend on backward compatibility
- The project can absorb coordinated breaking changes
- The new API is part of a simplification or refactor initiative
