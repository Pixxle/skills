### Investigation

**You own the answer. Plan, route, write.**

Investigation requests are read-only. They produce a cited explanation or a recommendation, not a code change. Match this when the user wants findings, not a fix ("investigate", "how does X work", "why is it like this", "are we sure about Z", "should we do X or Y", "don't change any code yet").

1. Read and follow [`how`](../../how/SKILL.md) for what the code does now, and [`why`](../../why/SKILL.md) for motivation, history, or whether a reason still holds. For a pure motivation question, why alone is enough. Add how only when the answer needs what the code does now. Run why first when the history likely explains the shape.
2. The throughput checkpoint ([Feature](feature.md) step 4) stays one line: `throughput checkpoint: n/a, read-only investigation`.
3. Produce the how-shaped output (Overview / Key concepts / How it works / Where things live / Gotchas). When both skills run, give how's sections, then why's sections unchanged, with its confidence tiers, hypotheses, and Sources consulted. For a decision between alternatives, give a recommendation with a trade-offs table.
4. Keep evidence and inference apart. Every claim carries a citation or a label (measured, inferred, guess).
5. Read and follow [`unslop`](../../unslop/SKILL.md) on the reply.

No code edits, no PR, no babysit, and no [`architect`](../../architect/SKILL.md) unless the investigation precedes a code change. If it does, hand back to the user and rematch [Bug fix](bug-fix.md) or [Feature](feature.md) as a new task. A whole-repo onboarding map written to disk is [Map system](map-system.md), not this.

**Reply:** the investigation output, the evidence it used, and ranked hypotheses when the cause is open. For "are we sure?" questions, give your real judgment with reasons. Push back when the premise is wrong (**No is an acceptable answer** in [`principles`](../../principles/SKILL.md#autonomy)).
