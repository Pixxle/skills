# Vinterfjard.com Gist Format

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
- **slug** — derived from the title: lowercase, kebab-case, no punctuation, no leading/trailing dashes. Examples: "Don't Let AI Make You Lazy" → `dont-let-ai-make-you-lazy.md` (Dennis sometimes slugs by theme rather than literal title — pick whichever reads better, but prefer literal). If unsure, default to the literal title slug.

Body comes after a blank line. No H1 — the title in frontmatter is the heading. Body uses plain markdown paragraphs separated by blank lines.

## Structural patterns

Most gists follow one of two shapes. Pick the one that fits the material; don't force a template.

**Shape A — Story → Point.** Open with a personal experience or specific moment. Stay in the story for the middle. Pivot in the last paragraph or two to the broader lesson. Used in `ai-has-rewritten-my-approach-to-software-development.md` and `catching-bugs-and-planning-the-future.md`.

**Shape B — Observation → Story → Reflection.** Open with a claim or pattern the user has noticed. Bring in one specific example to ground it. Close with the implication. Used in `dev-and-pm-are-converging.md` and `pr-reviews-matter.md`.

Either way: one specific anecdote is usually enough. Resist the urge to stack three examples — the gists trust the reader to extrapolate.

## Length and rhythm

- **Word count**: aim for 250–450 words. Use this as the house-style target. Going over 500 starts to feel like a different format.
- **Paragraphs**: short. 1–4 sentences. A one-sentence paragraph as a punch is fine when something needs to land hard ("That isn't it."). Don't do it more than once or twice per post.
- **Sentences**: vary length. Mix short, punchy sentences with longer ones that carry detail. Avoid stringing together three sentences of the same length and shape.
- **No subheadings, no bulleted lists, no tables.** These are outside the gist house style unless the author requests them. If you feel the urge to add a list, the material is probably too big for a gist — push back to the user or restructure as prose.

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
