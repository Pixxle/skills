---
name: how
description: Explain how code works today, in chat, at the level of a senior engineer onboarding onto a subsystem. Stays read-only, fans out 2 to 4 parallel explorers for a large area, then one explainer writes Overview, Key concepts, How it works, Where things live, and Gotchas. Use when the user asks "how does X work", wants a code walkthrough before changing something, asks where something lives, which package or layer owns it, or where new code should go, or needs a runtime-flow mental model. Use why for motivation and history, and create-system-map for a whole-repo onboarding map written to disk.
disable-model-invocation: true
---

# How

Answer "how does X work?" with an explanation a senior engineer could use to start working in the area. Give a working mental model, not annotated source.

`how` stays read-only and answers in chat. It writes no files and changes no code. Read and follow it before editing code you have not traced. An agent that edits without a traced model tends to fix the symptom at the first plausible spot.

## Pick the right skill

- "What does it do and where?" → this skill.
- "Why is it shaped this way?", history, or whether a reason still holds → read and follow [`why`](../why/SKILL.md). When history likely explains the mess, do that first, then this skill.
- A whole-repo onboarding map with diagrams written to `_system-map/` → read and follow [`create-system-map`](../create-system-map/SKILL.md). Use this skill for one question or one subsystem answered in chat.

## Subagents

Spawn every subagent read-only. Explorers do mechanical tracing, so a fast model fits. The explainer reconciles and writes, so give it the strongest judgment model. When the runtime does not let you choose, use the parent model. Never block on a specific vendor.

## 1. Assess scope

If the scope is ambiguous, state your interpretation and proceed. The user can redirect.

- **Simple.** One module, a small utility, or a narrow question such as "how does function X work". Spawn no explorers. Spawn one explainer from [references/explainer-prompt.md](references/explainer-prompt.md) with the explorer-findings section deleted. It explores and explains in one pass. Go to step 4.
- **Complex.** A subsystem spanning several files or services, a cross-cutting feature, or an architectural overview of an area. Go to step 2.

When in doubt, take the simple path.

## 2. Fan out explorers (complex only)

Split the question into 2 to 4 angles. Each angle is a distinct slice of the subsystem, such as triggers and entry points, the core data model, persistence, or an integration boundary. Spawn all explorers in parallel, each briefed with [references/explorer-prompt.md](references/explorer-prompt.md) and its angle filled in.

## 3. Explain (complex only)

After every explorer returns, spawn one explainer from [references/explainer-prompt.md](references/explainer-prompt.md) with every explorer's findings filled in.

## 4. Present

You own the explanation. Spot-check the file and symbol references it leans on hardest. Then present the explainer's output in chat. Light edits for clarity or conversation context are fine. Do not substantially rewrite it. Read and follow [`unslop`](../unslop/SKILL.md) on the result.

## Output format

Use the explainer prompt's sections and drop any that do not apply. They are Overview, Key concepts, How it works, Where things live, and Gotchas.
