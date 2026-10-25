---
name: to-issue
description: Converts an existing conversation or RFC into a proposed issue split, then drafts issues after the user approves the split. Use when the user wants one or more issues scoped for AI implementation, with clear outcomes and acceptance criteria for human review.
---

# To Issue

Turn a conversation or RFC into issues that AI agents can implement and humans can understand.
Use [template.md](template.md) for each issue body after the split is approved.

Example request: "Use to-issue to turn this RFC into issues."

## Establish the source

Use the current conversation unless the user identifies another conversation or an RFC.
Read the source through available history, files, or document access. If it is unavailable, ask for its contents.
Preserve agreed requirements, constraints, and later corrections. Distinguish decisions from suggestions and unresolved questions.
Inspect the relevant code only when needed to check a scope boundary or dependency. Do not invent source locations or technical facts.

If a missing decision changes the intended outcome or issue count, ask a focused question before proposing a firm split.
Do not present work as ready for implementation when its required behavior is unresolved.

## Outline the problem and split

Start with a short explanation of the current problem and the outcome the work must achieve.
Recommend an issue count and explain why that count provides useful delivery boundaries.
For each proposed issue, give a short title, its intended outcome, its scope boundary, and any dependency on another issue.
Use a numbered list or a compact table. Make independent work and required order clear.

Return the problem and proposed split, then ask for feedback. Wait before drafting full issue bodies or creating tracker issues.
Revise the split from the feedback. Continue once the user approves it.
If the same split was already approved in the conversation, use that approval without asking again.

## Size work for AI implementation

Assume AI agents implement the issues. The human must be able to assess the intended outcome, scope, and proof of completion.
Start with one cohesive issue. Split when separate parts support faster verified delivery, clearer review, or genuinely independent work.

- Keep an end-to-end outcome together across storage, API, UI, and tests when those changes form one coherent result.
- Keep tightly coupled behaviors together when they share invariants or must ship together and remain practical to verify.
- Split distinct outcomes, substantial independent risks, or real prerequisites that can each be completed and checked separately.
- Size by the context, uncertainty, integration risk, verification, and human review each issue requires. Avoid human coding-hour estimates and arbitrary limits on files or code lines.
- Keep validation with the behavior it proves. Avoid separate issues for each technical layer, helper, or test.
- Give a prerequisite issue a concrete deliverable and explain what it enables. Define dependencies honestly; do not imply parallel work across an unsettled contract.

Example: "Save and reopen a search" can include storage, API, UI, and tests in one issue.
"Share a saved search" can be another issue if the source requests it. Separate storage, API, and UI tickets would fragment the first outcome.

## Draft the approved issues

Use the template for each issue. Give each a title that states its outcome.
Lead with the problem and desired behavior in language the human can understand without reading the implementation.
Make each issue understandable to an AI agent that cannot see the original conversation.
Include the scope boundaries and agreed constraints needed to complete that issue. Do not copy the full RFC into every issue.

Write acceptance criteria as observable results. Cover relevant failure cases and compatibility requirements from the source.
Include a short before-and-after example when it clarifies success. Do not invent measurements, thresholds, or requirements.
Keep implementation context limited to agreed design choices, relevant facts, and dependencies. Leave routine coding choices to the implementing agent.
If an unresolved decision blocks an issue, identify it explicitly. A proposed investigation must have a concrete question and completion result.

Use Simplified Technical English: active voice, consistent terms, complete sentences, and one topic per paragraph.
Limit descriptive sentences to 25 words and instructions to 20 words. Preserve technical names and identifiers exactly.
Use approved ASD-STE100 vocabulary when available. Do not claim full vocabulary compliance without checking it.
Keep the issue concise. Omit RFC-style alternatives, diagrams, timelines, business impact sections, and unused template sections.
End with linked references when an RFC or other external source supports the issue. Do not invent links.

## Deliver

Check that the approved issues cover the agreed work without gaps or duplicate ownership.
Check that each issue has a verifiable outcome and that dependencies have no cycles.
Return the issue drafts in the conversation by default. Publishing requires a user request to create issues in a known tracker or project.
Use actual issue links for dependencies after publication. Do not invent tracker IDs, labels, owners, or status values.
