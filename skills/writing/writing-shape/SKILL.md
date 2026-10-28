---
name: writing-shape
description: Shape raw material into an article through a conversation about the opening, order of ideas, and each agreed paragraph or block. Use when the user wants to turn notes or fragments into an article, structure an argument, or revise an existing draft.
disable-model-invocation: true
---

<what-to-do>

The user has passed (or will pass) raw material as text, a working brief, or a markdown file. Treat it as the input pile, whatever its format. Read supplied material end-to-end before shaping it.

Draft into a separate article document. Raw material files are read-only. In revision mode, the supplied article is the editable output: read it and continue or restructure it in place, preserving user edits and agreed choices. If a path could mean source or output, clarify its role before writing.

If the user did not say where to save the article, ask once and remember the path. The user will be editing the article file during the session; always re-read it before writing so their edits are preserved.

</what-to-do>

## When coordinated by another writing skill

Accept the interview brief, material, current draft, and supplied paths. Reuse established answers and honor inherited voice, length, format, and destination constraints. Keep an agreed angle or opening unless the author wants it changed; vary execution within that angle. Return the working draft path and gaps when the author accepts the structure or changes mode. In the full composition flow, the coordinator then reads and follows [`writing-blog-post`](../writing-blog-post/SKILL.md) to produce the final article. Do not start another skill yourself.

<supporting-info>

## The loop

1. **Read the pile.** Read the input file in full. Form a sense of what's in it.
2. **Find the opening.** For a new article, show 2–3 candidate openings and let the user pick or combine them. With an agreed angle, vary the entry point rather than replacing the premise. When resuming or revising, keep the opening unless changing it is part of the request.
3. **Grow paragraph by paragraph.** After the opening lands, ask "given this opening, what does the reader need to hear next?" Pull material from the pile to answer. Argue about whether the next beat is a paragraph, a list, a table, a callout, a quote, a code block. Each format choice should be deliberate and defensible.
4. **Append to the article file as you go.** Don't batch. Write each agreed paragraph or block immediately so the user can see the article taking shape.
5. **Loop step 3 until the article is done.** The user decides when it's done.

## Conversational feel

This is a grilling session inverted. In ideation, the question was "what are you actually noticing?" Here it's "what is this article actually arguing, and in what order does the reader need to hear it?" Push back. Refuse to let weak transitions slide. If a paragraph doesn't earn its place, cut it.

Specific moves to keep using:

- "What does this paragraph do for the reader that the previous one didn't?"
- "If I cut this, what breaks?"
- "Is this prose, or should it be a list? Why prose?"
- "This sentence is doing two jobs — split it or pick one."
- "The opening promised X. We've drifted to Y. Either re-thread it or change the opening."

## Pulling from the pile

Treat the raw material as a quarry, not a script. Pull a fragment, rework it to fit the surrounding paragraph, and place it. A fragment may be split across multiple paragraphs, merged with another, or paraphrased. The pile's job is to be mined; the article's job is to read as one voice.

If the pile lacks something the article needs, name the gap explicitly: "We need an example here and the pile doesn't have one — give me one now or we cut this section."

## Format arguments to actually have

When choosing how to render a beat, weigh these tradeoffs out loud with the user, not silently:

- **Prose vs. list.** Prose carries argument; lists carry parallel items. If items aren't truly parallel, prose is better. If they are, a list is faster to scan.
- **Inline vs. callout.** Tips, warnings, and asides go in callouts (`> [!TIP]`, `> [!NOTE]`) — but only if they'd genuinely derail the main argument inline. Otherwise leave them inline.
- **Table vs. repeated structure.** If the same shape repeats 3+ times with the same fields, a table. Otherwise prose with bold leads.
- **Quote vs. paraphrase.** Quote when the original wording is the point. Paraphrase when only the idea matters.
- **Code block vs. inline code.** Multi-line, runnable, or illustrative → block. Single token or identifier → inline.

## Writing rhythm

Append to the article file as each block is agreed. Re-read the file from disk before every write — the user may have edited between turns. Never overwrite blindly. If the user wants a paragraph rewritten, edit that specific paragraph in place; leave the rest alone.

## Out of scope

- Mining for new fragments that aren't in the pile (the pile is the input — if it's incomplete, name the gap and either get the user to fill it or cut the section).
- Editing the raw material file.
- Publishing, formatting for a specific platform, or adding frontmatter the user didn't ask for.

</supporting-info>
