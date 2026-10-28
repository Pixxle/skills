---
name: principle-encode-lessons-in-structure
description: Turn a recurring instruction or correction into structure (a lint, type, metadata flag, runtime check, or script) instead of more text, and use the structural fix alone once it exists. Use when you catch yourself writing the same instruction a second time, or notice a recurring correction.
disable-model-invocation: true
---

# Encode Lessons in Structure

When you catch yourself writing the same instruction a second time, or notice a recurring correction, encode the rule as a lint, type, metadata flag, runtime check, or script instead of more text.

If the lesson needs judgment and cannot be encoded, make the instruction more prominent and add an example of the failure mode.

**Corollary:** If the fix is structural, only use the structural fix. The instruction is the symptom. Once the structural fix exists, delete the instruction it replaces.
