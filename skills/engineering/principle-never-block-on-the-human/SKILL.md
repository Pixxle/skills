---
name: principle-never-block-on-the-human
description: Stay unblocked while the human supervises asynchronously. Do reversible work without asking, present the result, and let the human course-correct after the fact. Irreversible actions still need confirmation, and product direction still comes from the human. Use when tempted to ask "should I do X?" on reversible work.
disable-model-invocation: true
---

# Never Block on the Human

The human supervises asynchronously. Agents must stay unblocked. Make reasonable decisions, proceed, and let the human course-correct after the fact.

**Why:** Code changes are reversible and reviewable, so a wrong decision usually costs less than blocking.

- **Proceed, then present.** Do the work, show the result. Don't ask "should I do X?" Do X, explain why.
- **Make the system self-healing.** When you notice a problem, log it and fix it in the next round.
- **Irreversible actions still require confirmation.** Force-push, delete production data, send external messages. For the full pause list, and what a full-autonomy grant changes, read the Autonomy section of [`principles`](../principles/SKILL.md).
- **Reversible actions proceed without blocking.** Write code, edit notes, split tasks.
- **Product direction comes from the human.** Ask, with options, only about a product or preference call that no experiment can settle. Under a full-autonomy grant, apply a clear default instead, report it with a full explanation, and say in plain words what the human could tell you to do instead. Never invent a shorthand token for them to type back. For the grant rules, read the Autonomy section of [`principles`](../principles/SKILL.md). Execution should not block.
- **An empirical fork needs an experiment, not a question.** When data can settle the choice, run the experiment and present the result. Do not ask the human to guess what a measurement would show.
