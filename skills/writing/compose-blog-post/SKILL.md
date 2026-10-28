---
name: compose-blog-post
description: Coordinate the full flow from an author's initial thoughts through a Socratic interview and narrative shaping to a finished article in their voice. Use when the user wants to write, develop, or finish a blog post or article, from a brain dump through an interview, fragments, shaping or revising a draft, to a final polish in Dennis's voice or a vinterfjard.com post. Resumes at whichever stage the material is in.
---

# Compose Blog Post

Coordinate the writing skills in the same conversation: initial thoughts → interview → narrative and working draft → final article. Own handoffs and continuity; let the skills supply their methods.

## Load and follow skills

The stage skills are explicit-only, so they are not in the model's skill inventory. When a stage begins, read its `SKILL.md` through the link below and follow it in this conversation. Do not assume a particular command or tool exists.

Load only skills needed for the current stage. If a linked file is missing, name it rather than pretending to run it. Do not send the author to another conversation or make them invoke each skill manually.

## Entry and continuity

Read [`writing-blog-post`](../writing-blog-post/SKILL.md) in voice-profile mode so its guidance travels with the brief and into shaping. This supplies voice and established destination preferences; it does not start composing the final article early.

For a new idea, start [`writing-interview`](../writing-interview/SKILL.md) immediately with the thoughts already supplied. Do not ask the author to repeat them or choose a drafting method before the idea is understood.

Resume a supplied brief or existing session at its current stage. If the author explicitly wants to skip the interview or already supplies a developed premise and material, honor that and load the appropriate writing skill. Keep any visible gaps in the handoff.

Carry the interview brief, the author's corrections, distinctive phrases, voice guidance, writing preferences, current stage, and file paths across every transition. Reuse established answers and paths. Keep tentative interpretations distinguishable from confirmed views.

Use supplied destinations and established project conventions. Otherwise let the active skill ask once for the location when saving becomes useful. Start the conversation before file setup. Keep interview notes and fragments separate from the editable article. Carry the working-draft and final-output paths with their roles: they may be the same editable article file, or distinct when requested or required by the destination. Resolve ambiguous source/output roles before writing.

When notes are saved, keep a short progress record with the brief so a future session can resume: current stage, material, working-draft and final-output paths, settled choices, open questions, and next action. Keep this record out of the fragments and published article.

## Shape the narrative and working draft

After the author accepts or corrects the interview brief, explain the next skill choice in one sentence and continue. The author can override it; their agreement to the brief does not require a second transition approval.

| Need in the material | Skill to load |
| --- | --- |
| The angle is understood, but usable scenes, examples, observations, or phrases are thin; or the author wants more material | [`writing-fragments`](../writing-fragments/SKILL.md) |
| A story, sequence of scenes, or changes of perspective carry the piece | [`writing-beats`](../writing-beats/SKILL.md) |
| A claim, explanation, or the order of ideas carries the piece | [`writing-shape`](../writing-shape/SKILL.md) |
| An existing draft needs restructuring or a different opening | [`writing-shape`](../writing-shape/SKILL.md) in revision mode |

[`writing-fragments`](../writing-fragments/SKILL.md) is optional. After it finishes, choose beats or shape from the resulting material. The shaping stage produces an agreed narrative and a working draft; it does not finish the full composition workflow.

Choose one drafting skill initially. Combine or switch modes only when the author asks or the emerging draft needs it. Preserve the current draft and settled opening; do not restart just because the active skill changes. If a conceptual gap appears during drafting, return briefly to [`writing-interview`](../writing-interview/SKILL.md) for that gap and then resume.

## Compose the final article

Once the author agrees the narrative and working draft are ready, read and follow [`writing-blog-post`](../writing-blog-post/SKILL.md) in final-composition mode with the brief, shaped material, agreed structure, current draft, voice preferences, and output path. Continue directly; do not ask for a separate transition approval.

This is the final stage of the full flow, for any blog destination. It completes and edits the prose in the author's voice, preserves settled choices, and produces the finished article. Do not skip it just because beats or shape already produced readable prose. The author can explicitly skip a stage or end the session.

If final composition reveals a structural gap, let the coordinator return to the appropriate shaping skill for that gap and then resume final composition. Do not repeat the whole process.

## Handoff to each skill

Pass the current brief and these details, as available:

- Purpose of this stage and the next unresolved choice.
- Raw material: supplied text and/or notes and fragment files.
- Working-draft and final-output paths, including whether the editable article is being finished in place, and any opening or blocks already agreed.
- Voice, length, format, and destination constraints supplied by the author or a destination skill.
- Remaining uncertainties and facts needing verification.

When the active skill reaches its stopping point, resume coordination. Keep its conversational pauses: do not answer its questions for the author, choose among openings on their behalf, or write ahead of an agreed beat or block.

## Destination-specific output

[`writing-blog-post`](../writing-blog-post/SKILL.md) owns Dennis's voice and final output. Carry its voice guidance through every stage. Apply site-specific length, file conventions, and frontmatter only when that destination is established. A general article does not inherit the short-gist format automatically.

## Finish

Finish after [`writing-blog-post`](../writing-blog-post/SKILL.md) produces the complete article and the author accepts it, or when the author explicitly stops or overrides the flow. Report the article path and any unresolved factual gaps. Preserve working material. A request to compose a post does not by itself request publishing, committing, or deleting notes.

## Examples

- "Compose a post from this rant about code reviews" → interview → fragments if needed → shape → final composition.
- "There's a story in this disastrous release" → interview → beats → final composition.
- "The interview is done; here are the notes and draft" → resume shaping → final composition, without repeating discovery.
