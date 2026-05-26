---
name: write-gist
description: Draft a new gist for the vinterfjard.com blog in Dennis's voice — short personal essays (250–450 words) that mix a concrete story with a sharp opinion. Use whenever the user wants to write a gist, blog post, or short essay for the site, asks to "turn this into a gist," wants a draft "in my style," or is brainstorming a post idea. Also trigger when the user is venting about a workplace or tech observation and hints they might want to publish it. The skill produces a markdown file with correct frontmatter, saves it under `gists/` with a kebab-case slug, and matches the existing voice closely enough that the post reads like Dennis wrote it.
user_invocable: true
---

# write-gist

Help Dennis draft a new gist for [vinterfjard.com](https://vinterfjard.com) in the same voice as the existing posts in `gists/`. The output is a single markdown file with frontmatter, ready to commit.

## When this skill runs

The user will usually arrive with one of:

1. **A rough idea or rant** — a few sentences about something they want to say. Your job is to draw out the specific story underneath it (asking 1–3 sharp questions if needed) and then draft.
2. **A finished thought, badly written** — they want it tightened and reshaped into the house voice.
3. **A topic and a request to draft cold** — least common; ask for at least one concrete anecdote or example before writing, because the voice depends on specifics.

Don't draft on pure abstractions. The gist voice lives or dies on concrete detail (a real number, a real tool name, a real moment). If you don't have any, ask one direct question to get one.

## The voice in one paragraph

First-person, confident, plainly written. Tells a small specific story, then makes one broader point. Uses contractions. No headers, no bullet lists, no emojis, no hedge-stacking. Strong opinions stated calmly, not shouted. A short paragraph standing alone for emphasis is allowed when it earns it. The reader should finish with one clear thought in their head, not five.

## Output format

Save to `gists/<kebab-case-slug>.md` in the repository root (relative to the project, not absolute). Use this frontmatter exactly:

```yaml
---
title: 'Title in Sentence Case'
date: 'YYYY-MM-DD'
tags: ['tag1', 'tag2']
---
```

Rules for each field:

- **title** — single-quoted. Sentence case or light title case. Short (3–8 words). Often a declarative claim ("Developers Are Becoming PMs", "When RTO Makes Sense", "Don't Let AI Make You Lazy") or a personal statement ("My approach to software development has changed"). Avoid clickbait, colons, and "How I…" / "Why You Should…" formulations.
- **date** — single-quoted, ISO format `YYYY-MM-DD`. Use today's date unless the user specifies otherwise. Today's date is available in the system context.
- **tags** — array of single-quoted lowercase strings. Pick 1–3 from the existing palette where possible: `'ai'`, `'blog'`, `'culture'`, `'architecture'`, `'future'`. Add a new tag only if none fit.
- **slug** — derived from the title: lowercase, kebab-case, no punctuation, no leading/trailing dashes. Examples: "Don't Let AI Make You Lazy" → `pr-reviews-matter.md` (Dennis sometimes slugs by theme rather than literal title — pick whichever reads better, but prefer literal). If unsure, default to the literal title slug.

Body comes after a blank line. No H1 — the title in frontmatter is the heading. Body uses plain markdown paragraphs separated by blank lines.

## Structural patterns

Most gists follow one of two shapes. Pick the one that fits the material; don't force a template.

**Shape A — Story → Point.** Open with a personal experience or specific moment. Stay in the story for the middle. Pivot in the last paragraph or two to the broader lesson. Used in `ai-has-rewritten-my-approach-to-software-development.md` and `catching-bugs-and-planning-the-future.md`.

**Shape B — Observation → Story → Reflection.** Open with a claim or pattern the user has noticed. Bring in one specific example to ground it. Close with the implication. Used in `dev-and-pm-are-converging.md` and `pr-reviews-matter.md`.

Either way: one specific anecdote is usually enough. Resist the urge to stack three examples — the gists trust the reader to extrapolate.

## Length and rhythm

- **Word count**: aim for 250–450 words. The existing posts are all in this band. Going over 500 starts to feel like a different format.
- **Paragraphs**: short. 1–4 sentences. A one-sentence paragraph as a punch is fine when something needs to land hard ("That isn't it."). Don't do it more than once or twice per post.
- **Sentences**: vary length. Mix short, punchy sentences with longer ones that carry detail. Avoid stringing together three sentences of the same length and shape.
- **No subheadings, no bulleted lists, no tables.** The gists never use these. If you feel the urge to add a list, the material is probably too big for a gist — push back to the user or restructure as prose.

## Style rules

**Use:**
- Contractions ("don't", "it's", "we're")
- Real names of tools, people, products ("Cursor", "Codex", "Gemini")
- Specific numbers ("$300", "12,000 lines", "46%", "1,500-line PR")
- Plain words ("use", "show", "help", "build")
- First person — "I", "we", "my team"
- One concrete anecdote, fully told
- Acknowledging the other side before disagreeing with it

**Avoid (the big three AI tells — kill these on sight):**
- **Negative parallelism**: "not X, but Y" / "It's not X, it's Y" / "Not only does it X, it also Y." The single most identifiable AI structure. At most one per post, and only if it earns it.
- **Em-dash overuse**: at most one em-dash per post. If you reach for a second, restructure with a period or comma instead.
- **Rule of three**: triple-adjective stacking ("robust, scalable, efficient"), triple-clause parallels, three-sentence anaphora. One triplet per post, max. Two-item parallels and four-item process descriptions are fine.

**Also avoid:**
- AI-vocabulary words: "delve", "tapestry", "landscape" (as metaphor), "realm", "synergy", "leverage", "harness", "utilize", "unlock", "empower", "robust", "pivotal", "innovative", "seamless", "cutting-edge", "game-changer", "ecosystem", "framework" (unless literal), "navigate" (metaphor), "journey" (metaphor), "underscore", "foster", "groundbreaking", "transformative", "holistic", "dynamic"
- AI transitions: "moreover", "furthermore", "additionally", "consequently", "notably", "importantly", "ultimately", "essentially", "that said", "in conclusion", "to summarize", "it's worth noting"
- Copulative avoidance: "X serves as Y", "X stands as Y", "X represents Y" — use "is" when you mean is.
- Balanced-clause overuse: "While X is true, Y is also important" — once per post, never two in a row.
- Smoothed emotional tone: "It's understandable that…", hedge-stacks ("perhaps maybe I think it seems"), uniform sentiment across the whole post
- Mechanical rhythm: every sentence the same length, every paragraph the same shape, frictionless transitions between paragraphs
- Rhetorical questions ("But what does this really mean?")
- Emojis
- Headers (`#`, `##`) in the body
- Bullet lists or numbered lists
- Bold inline mini-headers (`**Key insight**: …`)
- Closing summary paragraphs that recap what the post just said
- "Looking ahead" / "Future outlook" / "Only time will tell" closers
- Calling AI "powerful" — show what it did instead

For the full reference with examples and rationale, see `references/ai-tells.md`. Use it during the read-back-and-cut pass.

## Drafting workflow

1. **Get a concrete anchor.** If the user hasn't given one, ask: "What's the specific moment or example you want to build this around?" One question, not a battery.
2. **Pick the shape.** Story-first (Shape A) or observation-first (Shape B). Default to A if the user led with a story.
3. **Draft once.** Write the whole thing through. Don't outline first; gists are short enough that outlining flattens them.
4. **Read it back and cut.** Aim to remove 10–15% of the first draft. Common cuts: hedging, restating the same point twice, throat-clearing in the opening sentence, summary-paragraph creep at the end.
5. **Run the AI-tell scan.** Before saving, work through the self-check at the bottom of `references/ai-tells.md`:
   - Count em-dashes. More than one? Cut some.
   - Search for "not just", "not only", "it's not", "isn't just". More than one? Rewrite.
   - Look for stacked triplets (three adjectives, three clauses, three same-shaped sentences). Break them up.
   - Scan for banned vocabulary (`leverage`, `delve`, `landscape`, `realm`, etc.). Found one? Rewrite the sentence, don't just swap the word.
   - Read the first sentence of each paragraph aloud. Do they all sound the same? Vary at least one.
   - Final paragraph: forward-looking and personal, or summarizing what was just said? Cut summary closers.
   - **Verify any casual time references against the actual date.** If the draft says "Today it's just Wednesday", "Last Tuesday I…", "this summer", "back in March", check those against today's date (in the system context) before saving. Use `date` via Bash if you need to confirm a day of the week. A wrong day-of-week is a credibility hit that's trivial to avoid.
6. **Check the title.** Does it state a position or describe an observation? Is it short? Does it avoid colons and "How I…" / "Why I…" patterns?
7. **Pick tags.** 1–3. Reuse existing ones where possible.
8. **Save to `gists/<slug>.md`.** Confirm with the user before saving if you're unsure about the title or slug.

## Examples of titles that fit the voice

From the existing posts:
- "My approach to software development has changed"
- "The Bug Gemini Caught That Humans Missed for Years"
- "Developers Are Becoming PMs"
- "Don't Let AI Make You Lazy"
- "When RTO Makes Sense"
- "Switching from Claude Code to Codex"

Note the range: some are declarative claims, some are descriptive, some are personal updates. None are clickbait, and none use colons or rhetorical questions.

## Images

The gists occasionally include an image:

```markdown
![Descriptive alt text](/gists/images/filename.png)
```

Don't invent image references. Only include one if the user mentions they have a screenshot or asset ready, and confirm the filename with them.

## Updates and corrections

If the post needs an inline update (e.g., the situation changed after publishing), use a blockquote at the top of the body:

```markdown
> **Update:** Short note about what changed.
```

See `why-i-switched-from-claude-code-to-codex.md` for the pattern.

## Final check before saving

Before writing the file, mentally run through:

- Would this read like one of the existing six posts if dropped in among them?
- Is there at least one specific, concrete detail (name, number, moment)?
- Does it land on a clear thought rather than fizzling out or summarizing?
- Is it between 250 and 450 words?
- Is the title doing work, or is it just a topic label?

If any of these is shaky, fix it before saving. It's much easier to tighten before the file exists than to negotiate edits after.

## Reference

The six existing gists in `gists/` are the source of truth for the voice. If you're ever unsure, open one of them and compare.

- `references/style-notes.md` — close-reading notes on the existing gists (opening/closing patterns, sentence rhythm, title patterns, tag usage).
- `references/ai-tells.md` — comprehensive catalog of AI-writing patterns to remove, with the self-check scan to run before saving.
