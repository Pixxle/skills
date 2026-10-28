---
name: write-rfc
description: Converts an existing conversation into a concise RFC with explicit decisions, a proposed solution, and alternatives with comparative trade-offs. Use when the user asks to document a discussion, capture conversation outcomes, or turn an existing chat into an RFC in Simplified Technical English.
disable-model-invocation: true
---

# Write RFC

Document the outcomes of an existing conversation. Use [template.md](template.md) for the RFC structure.

Example request: "/write-rfc turn this conversation into an RFC."

## Establish the source

Use the current conversation unless the user identifies another conversation or provides a transcript.
Read the available source before drafting. For another conversation, use supported history access or a supplied export.
If that source is unavailable, ask for its contents. Do not substitute the current chat or infer outcomes from a title.

Identify the problem, requirements, constraints, selected approach, reasons, alternatives, and unresolved points.
Distinguish explicit agreement from proposals, assumptions, and assistant suggestions.
Apply later corrections to earlier decisions. Preserve the final outcome rather than the order of the discussion.

Document what the conversation supports. Do not invent agreement, technical details, measurements, authors, or approval.
Ask a focused question only when a missing fact prevents a useful draft. Otherwise, record the gap under open questions.

## Draft the RFC

Load the bundled template. Its headings define the format; scale the detail to the discussion.
Default the RFC status to Draft. Use another status only when the source explicitly establishes that RFC status.
Remove template prompts, unused optional metadata, and empty optional sections.

State the problem and proposed solution directly. Explain how the proposal meets the requirements and why the approach was selected.
Include technical details only when they help assess the proposal. Preserve relevant constraints, failure cases, and technical risks from the conversation.
Keep unresolved assumptions explicit. Do not reopen settled decisions or silently fill gaps with a new design.
Use source links beside relevant claims when available. Do not invent message links or require citations for every sentence.
When the RFC uses external sources, end with a References section.
List each source once with a descriptive title and a direct Markdown link. Do not invent URLs or list unused sources.
Omit the section when there are no external references.

Do not add FAQs, drawings, diagrams, timelines, milestones, a glossary, or a terms section.
Exclude customer or business impact content, review matrices, a table of contents, and appendices.
Explain an essential unfamiliar term at first use instead of creating a separate glossary.

## Compare alternatives

Always keep the Alternative options section. Include each material alternative from the conversation.
For each option, describe the approach and compare its benefits, costs, and limits directly with the proposed solution.
Tie the trade-offs to the same requirements and constraints. Explain the recorded reason for the choice, if there is one.
Do not force a disadvantage or present an undecided option as rejected.

If no alternative was discussed, add a feasible comparison based on known constraints and label it as added analysis.
The current system can be an alternative when it is viable. Do not claim that the conversation considered or rejected this option.
If the source cannot support a credible comparison, state that gap and request the missing information under open questions.

## Use Simplified Technical English

Apply ASD-STE100 to the RFC prose:

- Use approved general words with their specified meanings and parts of speech. Use recognized technical nouns and verbs where necessary.
- Keep technical names and code identifiers exact. Use the same term for the same concept throughout.
- Limit descriptive sentences to 25 words. Limit procedural sentences to 20 words.
- Give each sentence one topic. Keep each paragraph to one topic and no more than six sentences.
- Use active voice. Use passive voice in descriptions only when the actor is unknown.
- Use simple present, past, or future forms. Avoid complex verb forms and verb forms that end in "-ing".
- Write instructions as commands, with one instruction per sentence. Put a necessary condition before its action.
- Break up noun groups longer than three words, while preserving exact technical names.
- Keep complete sentences and necessary articles. Avoid idioms, figurative language, vague claims, and unexplained abbreviations.

Check the official dictionary when available. Do not claim full ASD-STE100 compliance without a vocabulary check.
If the dictionary is unavailable, apply these rules and briefly state the verification limit outside the RFC.

Example: Replace "The cache will be utilized by the service" with "The service will use the cache."

## Check and deliver

Check that the RFC preserves the conversation's final decisions and distinguishes proposals from agreement.
Check every alternative for an explicit comparison. Check sentence length, consistent terms, and excluded content.
Return the RFC in the conversation by default. Save or publish it only to a destination the user requests, following its conventions.

## Format and language references

The language rules follow [ASD-STE100](https://www.asd-ste100.org/assets/files/ASD-STE100_ISSUE9.pdf), introduced in the user's [STE reference](https://en.wikipedia.org/wiki/Simplified_Technical_English).
These links provide background. The bundled files are sufficient for routine use without fetching the original template again.
