---
name: unslop
description: Strip AI tells and filler from any prose surface. Use for replies, PR titles and bodies, commit messages, docs, RFCs, and other session writing — not as a substitute for writing ai-tells on blog drafts or caveman for token-compressed chat.
---

# Unslop

Session-wide prose cleanup. Scan for the patterns below, then rewrite. Preserve meaning and match the intended tone. Write clean as you draft; a cleanup pass is a safety net, not a license to dump slop first.

## Scope

Any prose you produce in the session: chat replies, PR titles/descriptions, commit subjects/bodies, READMEs, RFCs, handoff notes, and decision-trail cells.

**Niche owners (link, don't fork):**

- Long-form / blog drafts → writing `ai-tells` under `writing-blog-post/references/ai-tells.md` (deeper post-specific rules)
- Ultra-compressed chat mode → `caveman`
- Structural code review voice → `thermo-nuclear-code-quality-review` (not a prose skill)

## Patterns to cut

### Content

- **Superficial -ing phrases.** "highlighting…", "ensuring…", "showcasing…", "fostering…". Delete or replace with a concrete fact.
- **Vague attributions.** "Experts believe", "Industry reports suggest". Name the source or delete.

### Language

- **AI vocabulary.** Additionally, crucial, delve, enhance, fostering, garner, interplay, intricate, landscape (abstract), pivotal, showcase, tapestry, testament, underscore, vibrant. Prefer plain words.
- **Fancy "is".** "serves as", "stands as", "boasts", "features" → "is" / "has".
- **"Not just X, but Y."** State the point directly. At most one per long artifact, and only when the contrast earns it.
- **Forced rule of three.** Use the natural number of items.
- **Synonym cycling.** Pick one term for a thing and keep it.
- **False ranges.** "from X to Y" when X and Y are not on a scale. List topics instead.

### Style

- **Em dash overuse.** Prefer periods or commas. Do not sprinkle em dashes for punch.
- **Colon as mid-sentence connector.** Colons are fine before a list or example, not as a crutch before a restatement.
- **Boldface spam.** Do not bold every proper noun or acronym.
- **Inline-header lists that restate.** "`**Performance:** Performance improved…`" → real prose. A bold lead-in that names the item and adds new detail is fine.
- **Title Case headings.** Use sentence case.
- **Decorative emoji** in headings and bullets. Remove.
- **Curly quotes.** Use straight quotes.

### Chat and filler

- **Chatbot phrases.** "I hope this helps!", "Let me know if…", "Of course!", "Certainly!", "Found the smoking gun!". Remove.
- **Sycophancy.** "Great question! You're absolutely right!" Respond directly.
- **Filler.** "In order to" → "To". "Due to the fact that" → "Because". Delete "It is important to note that".
- **Excessive hedging.** Collapse stacked maybes into one honest hedge or a claim with evidence.
- **Generic conclusions.** "The future looks bright." State a specific plan or fact.

### Plain speech

- **Say what it does, not how it feels.** Prefer mechanism, path, or number over atmosphere.
- **One idea per sentence.** Split dense sentences.
- **Active voice** when the actor matters.
- **Prefer the plain word.** utilize/leverage → use; facilitate → help.
- **Cut mannered metaphor** when a literal phrase exists. Abstract metaphor nouns (substrate, wedge, nexus, flywheel, north star) usually want a concrete replacement.
- **Keep articles and verbs.** Over-compression that forces the reader to decode is not clarity (unless the user invoked `caveman`).

## Done check

Before you ship prose: no chatbot closer, no "not X but Y" stack, no em-dash sprinkle, and every claim either cites evidence or is labeled as measured / inferred / guess.
