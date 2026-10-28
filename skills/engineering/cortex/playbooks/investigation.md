### Investigation

**You own the answer. Plan, route, write.**

Read-only. The output is a cited explanation or a recommendation, not a code change. Match this when the user wants findings, not a fix ("investigate", "how does X work", "why is it like this", "don't change any code yet").

1. Route through [`how`](../../how/SKILL.md) for what the code does now, and through [`why`](../../why/SKILL.md) for motivation, history, or whether a reason still holds. For a pure motivation question, why alone is enough. Add how only when the answer needs what the code does now. Run why first when the history likely explains the shape.
2. When both run, give how's sections (Overview / Key concepts / How it works / Where things live / Gotchas), then why's sections unchanged, with its confidence tiers, hypotheses, and Sources consulted. For a decision between alternatives, give a recommendation with a trade-offs table.
3. Keep evidence and inference apart. Every claim carries a citation or a label (measured, inferred, guess).
4. Apply [`unslop`](../../unslop/SKILL.md) to the reply.

No code edits, no PR, no babysit. If the findings point at a fix, hand back to the user and rematch **Bug fix** or **Feature** as a new task. A whole-repo onboarding map written to disk is **Map system**, not this.

**Reply:** the investigation output, the evidence it used, and ranked hypotheses when the cause is open. For "are we sure?" questions, give your real judgment with reasons. Push back when the premise is wrong (**No is an acceptable answer** in [`principles`](../../principles/SKILL.md)).
