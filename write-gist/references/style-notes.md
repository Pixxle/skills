# Style notes from a close reading of the existing gists

These notes are pulled from reading all six posts in `gists/` end to end. Use them when you need more specificity than the SKILL.md guidance provides.

## Opening sentences from the six posts

- "The last few months have completely changed how I think about building software."
- "A few months ago I started experimenting with Gemini as a PR reviewer in our main frontend repository."
- "Talking with a lot of developers, I've noticed that everyone falls somewhere on a spectrum."
- "There's still debate about whether AI coding assistants truly improve developer productivity."
- "I've been the one banging the drum for more in-office time lately, and honestly, it hasn't been great."
- "Claude Code is still great. I switched because my day-to-day workflow changed, and Codex fits it better right now."

Patterns: time-anchored ("the last few months", "a few months ago"), observation-anchored ("Talking with…", "There's still debate…"), or position-anchored ("I've been the one…", "Claude Code is still great"). All six start with something concrete and personal. None start with a definition, a question, or a quote.

## Closing sentences from the six posts

- "I went from AI skeptic, to cautious user, to fully convinced. In many cases it's now faster and cheaper to rebuild than to keep patching legacy code forever."
- "Teams that treat AI as an architectural input will move faster and ship more reliably than the ones treating it like an editor plugin."
- "I don't think most people in either have internalized what that means yet."
- "AI-generated code is here to stay and the productivity gains are real. But PR review culture matters more than ever."
- "We don't have the disciplined async culture where being clear and pushing back are habits people actually work at, and the small moments where decisions actually get made don't really come through on a screen."
- "For how I work today, that fit matters more than any model benchmark."

Patterns: a forward-looking statement, a sharpened opinion, or a quiet observation that names what's actually broken. None of them are wrap-up summaries. None of them say "in conclusion." They land — they don't summarize.

## Where the pivot happens

In Shape A (story → point), the pivot to the broader lesson usually happens in the second-to-last paragraph. The last paragraph is the landing.

In Shape B (observation → story → reflection), the story takes up the middle, and the last 1–2 paragraphs widen back out.

In both shapes, the broader point is usually one sentence, maybe two. Don't elaborate. Trust the reader.

## Specific details that show up

- Dollar amounts: "$300 in one night"
- Line counts: "12,000 lines", "15,000 lines", "2,000-line PR", "1,500-line PR"
- Time: "three hours", "ten hours"
- Percentages: "46%"
- Real product names: Cursor, Codex, Claude Code, Gemini, Lovable, Copilot, Visual Studio Code, Jira
- Real code references: `Random`, `Next(0, 9)`, `main`

Made-up or hand-wavy stats kill the voice immediately. If a real number isn't available, drop the claim or rephrase it.

## Things the gists never do

- Open with a question ("Have you ever wondered…?")
- Use a numbered or bulleted list in the body
- Use H2/H3 headings to break up the post
- Include a TL;DR
- Close with "What do you think? Let me know in the comments."
- Use the words "leverage", "synergy", "game-changer", "navigate", "delve", "tapestry"
- Stack hedges ("I think maybe perhaps it could be the case that…")
- Use em dashes as a tic — one or two per post, max
- Italicize for emphasis more than once or twice
- Use ALL CAPS

## Things the gists sometimes do

- Single-sentence paragraphs for emphasis ("That isn't it.", "From the other direction, product managers are slowly approaching developers.")
- A blockquote at the top of the body for an update note (`> **Update:** …`)
- One image with descriptive alt text, embedded inline as `![alt](/gists/images/name.png)`
- Naming a specific incident or moment ("a 1,500-line PR with almost no context")
- Acknowledging the other side fairly before pushing back ("I totally get why people push back.")

## Title patterns

- Declarative claim: "Developers Are Becoming PMs", "Don't Let AI Make You Lazy"
- Descriptive: "The Bug Gemini Caught That Humans Missed for Years", "Switching from Claude Code to Codex"
- Personal: "My approach to software development has changed"
- Conditional: "When RTO Makes Sense"

Avoided:
- Colons ("Lessons from X: Why Y Matters")
- "How I…" / "Why You Should…"
- Numbered listicle titles ("5 Things…")
- Questions ("Is AI Killing Code Review?")

## Tag usage observed

Across the six posts:
- `'ai'` — used in 4
- `'blog'` — used in 4
- `'culture'` — used in 2
- `'architecture'` — used in 1
- `'future'` — used in 1

Most posts have 2 tags. A few have 1 or 3. Pulling from this palette is almost always right.

## Sentence rhythm

A typical paragraph from the gists looks like this (from `pr-reviews-matter.md`):

> The most common trap is "does it work" thinking. A developer prompts an agent, gets a lot of code quickly, runs it, sees green output, and moves on. But functional code isn't the same thing as production-safe code. I've seen AI produce solutions that returned correct data while introducing multiple full table scans in a single API path. It worked in test conditions and would have hurt real users at scale. A reviewer caught it.

Note: short opening sentence sets up a label. Long sentence walks through the failure mode. Short sentence delivers the counter-claim. Specific example. Specific consequence. Short closer that lands. The variation is doing the work.

## A note on AI tells

The gists are written by a human and read like it. To match that, kill these patterns whenever they appear in a draft:

- "Moreover", "Furthermore", "Additionally", "In addition"
- "It's important to note that…"
- "When it comes to X, …"
- "Not only X, but also Y"
- "Whether you're a beginner or an expert…"
- "In the realm of…", "In the world of…", "The landscape of…"
- "Delve into", "Dive deep into", "Explore the nuances of"
- Three-adjective stacking: "robust, scalable, and efficient"
- Concluding with "Only time will tell."

If a draft has these, the voice is wrong. Rewrite the sentence, don't just swap the offending word.
