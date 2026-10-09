---
name: writing-blog-post
description: Compose and polish a finished article or blog post in Dennis's voice from a developed brief, shaped narrative, or working draft. Use when the user wants the final article written in their style, asks to finish a shaped draft, or requests a vinterfjard.com post with the site's output conventions.
---

# Writing Blog Post

Turn the developed idea and shaped material into a complete article in Dennis's voice. Own final prose, voice, and output. In the full workflow, `compose-blog-post` calls this skill after the interview and shaping stages.

## Two uses

- **Voice-profile mode:** when the coordinator loads this skill before shaping, supply the voice guidance below and any established destination constraints. Carry them into the interview brief and shaping handoffs. Do not compose the final article yet.
- **Final-composition mode:** use the developed brief, shaped narrative, working draft, and settled choices to produce the finished article. This is the final writing stage of the full flow.

When invoked directly with developed material, compose the article without requiring earlier stages. For an explicit "just draft it" request, draft from the available concrete material and then perform the editing pass. If an essential personal example or meaning is missing, ask one focused question rather than inventing it. For a rough idea needing extended development, suggest `compose-blog-post`; do not automatically restart that workflow from inside this skill.

## Dennis's voice

First-person, confident, plainly written. Use contractions, concrete experiences, real names and details, and varied sentence rhythm. State strong opinions calmly. Acknowledge a worthwhile counterpoint without flattening the author's position. Keep their distinctive phrases and uncertainty where it matters.

Prose flows best when a sentence opens with something the previous sentence just mentioned and ends with the new information. Use this as a guide to continuity while preserving natural rhythm and deliberate shifts.

Read [references/style-notes.md](references/style-notes.md) for examples from Dennis's posts and [references/ai-tells.md](references/ai-tells.md) for patterns to remove. Their gist-specific bans on headings or lists, length rules, and output conventions apply only to vinterfjard.com; use their prose guidance for other articles and preserve the formats agreed during shaping. When available, compare with representative posts in `gists/`; use them to understand voice, not to borrow anecdotes as new experiences.

Avoid hedging piles, corporate vocabulary, repetitive transitions, excessive em-dashes, formulaic contrasts, stacked triplets, and closing summaries. Favor short paragraphs and prose. Preserve headings, lists, or other formats deliberately agreed during shaping; let the article's needs and the author's preferences determine length and structure.

The 250–450-word target and compact gist format are site-specific defaults. Do not force every article into them. Explicit author preferences override inferred house patterns.

## Input and continuity

Read the supplied brief, relevant source material, and working draft before writing. Carry forward the agreed angle, reader, stakes, narrative order, opening, concrete material, and writing preferences. Do not repeat the conceptual interview or opening selection.

Treat notes and fragments as source material. Preserve them and re-read editable files before changes. Use supplied output paths or established project conventions; otherwise ask once where the final article should go when saving becomes useful. Keep the article separate from raw notes and fragments. Shaping and final composition may use the same editable article file, finishing it in place while preserving author edits; if a distinct final-output path is supplied, keep the shaped working draft intact.

## Compose and edit

1. **Complete the article.** Use the agreed narrative and working draft to write coherent final prose. Connect the ideas, finish incomplete passages, and give the piece an earned ending. Keep paragraphs already doing their job; this stage does not require a wholesale rewrite.
2. **Keep meaning intact.** Do not change the settled premise, invent experiences or quotations, borrow another post's anecdote, or fill factual gaps with plausible detail. Distinguish personal experience, inference, and verified evidence.
3. **Read back for voice and flow.** Cut repetition, hedging, throat-clearing, weak transitions, and summary closers. Check how each sentence carries forward the preceding idea and introduces new information. Use the AI-tell reference to rewrite weak sentences rather than swapping isolated words. Check that the opening's promise is fulfilled and the ending leaves one clear thought.
4. **Check factual gaps.** Verify claims that need external support and retain their sources. Resolve uncertainties with the author or mark them visibly as unresolved in the handoff; do not present them as established facts. Use the current session date when checking relative time references.
5. **Save and show the complete article.** Use the agreed format and output path. Invite the author's final read and revise specific passages as requested. Preserve their subsequent edits.

If completing the piece reveals a real structural gap, identify it and return that gap to the coordinator for shaping. Do not call the coordinator recursively or discard the existing draft. In a standalone session, work through the specific gap with the author.

## Vinterfjard.com output

Apply this section only when the destination is established as vinterfjard.com. Read [references/site-format.md](references/site-format.md) for title rules, tags, structural patterns, images, and updates.

Default to 250–450 words, one concrete anecdote, and one broader point. The published body has no H1, subheadings, lists, tables, or emojis unless the author requests an exception. Carry those constraints into shaping when the site is already known.

Unless the author supplied paths, use `gists/_drafts/<slug>/notes.md` for interview notes and progress, `fragments.md` in the same folder for optional fragments, and `article.md` for the shaped working draft. Save the final post to `gists/<slug>.md`. Check for existing work, including the legacy `gists/_drafts/<slug>.md`, and resume matching material without overwriting it or mixing file roles.

Show title, slug, and tags together; reuse settled choices and ask only for unresolved editorial choices. Remove only a working title H1 if present and prepend:

```yaml
---
title: 'Title in Sentence Case'
date: 'YYYY-MM-DD'
tags: ['tag1', 'tag2']
---
```

Use the current session date unless the author supplied another date. Escape apostrophes in single-quoted YAML values by doubling them. Use a kebab-case slug and 1–3 lowercase tags. Do not overwrite an existing final post unless updating it is requested. Include only real supplied image assets.

## Finish

After the author accepts the complete article, return its path and any remaining factual gaps to the coordinator, or finish the standalone session. Preserve working material. Composing or saving an article does not itself request publishing, committing, or deleting drafts.

## Example

Input: an agreed point about verifying delegated work, a narrative built around one actual code review, and a shaped draft. Output: the finished post in Dennis's voice, retaining that point and story while tightening transitions and the ending. The interview and opening selection are already settled.
