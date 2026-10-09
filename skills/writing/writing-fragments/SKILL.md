---
name: writing-fragments
description: Collect and expand raw writing material as claims, vignettes, sharp sentences, and half-thoughts in one unstructured document. Use when the user wants to mine fragments, build a richer pile of examples and phrases, or keep exploring material before drafting an article.
---

<what-to-do>

Run a probing conversation that produces fragments. Follow what the author notices and ask for scenes, examples, sharper wording, and useful half-thoughts. The goal is a richer supply of writing material. Do not impose an article outline or argument structure.

As fragments emerge from either side of the conversation, append them to a single markdown file. The user will be editing this file during the session; always re-read it before writing so their edits are preserved.

If the user did not pass a path, ask once where to save the document, then remember it for the rest of the session.

Capture usable fragments from the very first thing the user says, including the initial prompt. When a caller supplies interview notes, extract usable material without copying the entire working brief or inventing words attributed to the author.

On first write, put a single H1 at the top with a working title (it can change later) and nothing else — no metadata, no TOC, no date.

</what-to-do>

## When coordinated by another writing skill

Accept the interview brief and supplied paths. Reuse settled answers instead of restarting the conceptual interview; gather the material the brief still needs. Honor inherited writing preferences, while keeping the fragments file free of orchestration metadata and article structure.

End when the author has enough material and is ready to draft, or asks to stop or switch modes. Return the fragments path and material gaps to the caller. Do not pick or start the drafting skill yourself. Standalone sessions remain open-ended until the author ends them.

<supporting-info>

## What is a fragment

A fragment is any piece of text that might survive into the final article. It must be _readable by the author_ — the author can tell what it means — but it does not need to define its terms or be comprehensible to a cold reader. The bar is "is this a piece of good writing?", not "is this a self-contained argument?"

Fragments are deliberately heterogeneous. Examples of what could be a fragment:

- A sharp sentence you'd want to deploy somewhere but don't yet know where.
- A claim with a one-line justification.
- A vignette: a thing that happened, a code snippet, a scenario, an analogy.
- A half-thought: "something about how X feels like Y, work this out later."
- A quote, a piece of dialogue, an overheard line.
- A list of related observations that hang together by feel.
- A complaint, a confession, a punchline.

The novelist's diary is the model: years of unstructured noticings that later get mined for raw material. Fragments are noticings.

## File format

```markdown
# Working title

A first fragment lives here.

It can be multiple paragraphs. It can include lists, code, quotes — whatever
shape the fragment naturally takes.

---

A second fragment.

---

> A quoted line that the user wants to keep around.

A reaction to it.

---

- A cluster of related observations
- That hang together by feel
- And want to be near each other
```

Fragments are separated by a horizontal rule (`\n---\n`). No headings inside the body. No tags. No order beyond the order they were added.

## Writing rhythm

Append silently. Don't ask permission for each fragment. Mention what you added in passing ("adding that"), but don't interrupt the conversation with save dialogs.

Before every write: re-read the file from disk. The user may have edited, reordered, or deleted fragments between turns — preserve their changes. Never overwrite the file; only append (or, if the user asks, edit a specific fragment in place).

The user can say "cut the last one", "rewrite that one sharper", "merge those two" at any time. Treat those as first-class instructions.

</supporting-info>
