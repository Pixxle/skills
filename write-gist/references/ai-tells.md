# AI writing tells — the things that give a draft away

This is a reference for spotting and removing patterns that make writing read as AI-generated. Synthesized from Wikipedia's *Signs of AI writing*, recent web research on ChatGPT/Claude tells, and a close reading of the existing gists in `gists/`.

The first three patterns below are the worst offenders. If a gist draft has any of them, fix those before worrying about anything else.

## The big three (kill on sight)

### 1. Negative parallelism — "not X, but Y" / "It's not X, it's Y"

The single most identifiable AI structure. Roughly 6% of ChatGPT messages contain it. It shows up in every flavor:

- "It's not just about speed, it's about quality."
- "This isn't a tool, it's a philosophy."
- "Not just faster — better."
- "It's no longer X. It's Y."
- "Not only does it…, it also…"

These structures feel "punchy" because they imitate the rhythm of good rhetorical writing, but stacked together they're a fingerprint. **Limit: at most one per post, and only if it's saying something specific the structure earns.** If a draft has two, rewrite at least one.

### 2. Em-dash overuse, especially for "punched up" emphasis

The em-dash itself is fine. The pattern to watch for is using it to insert a snappy aside where a comma or period would do the same work:

- "The bar moved — and I didn't notice it move."
- "What's left is taste — deciding what to build."
- "Productive, comfortable, well-supported — and a step behind."

Rule: **at most one em-dash per post.** If a draft has two, cut one. If a draft has three, the rhythm is AI-shaped — rewrite the sentences. Replace em-dashes with periods (for punch) or commas (for flow).

### 3. The rule of three

LLMs love triplets. Three adjectives, three clauses, three sentences with the same opener. It's the most over-deployed rhythm in AI prose because trained models pattern-match it as "good writing."

Watch for:
- **Triple adjectives**: "robust, scalable, and efficient"; "comfortable, productive, and a step behind"
- **Triple clauses**: "deciding what to build, deciding what to ship, and deciding what's done"
- **Triple anaphora**: three consecutive sentences starting the same way
- **Triple sentence fragments**: "What to build. When to ship. What looks right."

**Limit: one triplet per post, and only if it earns its rhythm.** Two-item parallels are fine. Four-item descriptive sequences (e.g., a process: "open the terminal, write the prompt, watch the diff, ship") read as human enumeration, not AI rhythm.

## Generic vocabulary — words that signal abstraction

Real writing names specific things. AI writing reaches for abstractions when it has nothing concrete to say. The presence of these words almost always means the sentence is hollow — fix the underlying vagueness, don't just swap the word.

**Abstract nouns to avoid:**
- landscape, realm, tapestry, synergy, testament, ecosystem, framework, paradigm, fabric, sphere, journey, space (as in "the AI space"), arena, underpinnings, intersection

**Inflated adjectives to avoid:**
- robust, pivotal, innovative, seamless, cutting-edge, groundbreaking, vibrant, dynamic, profound, comprehensive, holistic, transformative, revolutionary

**Verb-inflation to avoid:**
- leverage, harness, unlock, empower, utilize, streamline, underscore, exemplify, embody, foster, cultivate, navigate (when not literal), delve (into anything), spearhead

**Promotional phrasing to avoid:**
- "boasts", "stands as a testament to", "serves as a", "represents a shift", "marks a turning point", "in the heart of", "nestled", "showcasing", "highlights the importance of", "underscores the need for"

If the draft needs one of these, the underlying claim is probably weak. Strengthen the claim instead.

## Transitions that read as AI scaffolding

LLMs glue paragraphs together with the same handful of transition words. Their absence makes prose feel more natural.

Strip these unless they're doing real work:

- Moreover, Furthermore, Additionally, In addition
- Consequently, Therefore, Thus, Hence
- Notably, Importantly, It's worth noting, It's important to note
- Ultimately, Essentially, Fundamentally, In essence
- That said, Having said that, With that being said
- In conclusion, To summarize, All in all

Real human writing uses "But", "And", "So", "Still", "And yet", or no transition at all. Paragraphs in good prose often start without any connective tissue — the relationship is implicit.

## Sentence-shape tells

### Smoothed emotional tone

AI prose maintains uniform sentiment with no abrupt shifts. Watch for:

- "It's understandable that…"
- "It's worth recognizing…"
- "Of course, X is valid, but Y…"
- Diplomatic hedge-stacks: "perhaps", "maybe", "I think", "it seems", "could be argued" within a few sentences of each other

Real writing has tonal jumps. A flat, evenly-calibrated paragraph is a tell on its own, even without any banned words.

### Balanced clauses

"While X is true, Y is also important" structures appear constantly in AI output. They feel diplomatic and complete, but stacked back-to-back they read as machine-balanced.

Once per post is fine. Never two in a row.

### Copulative avoidance

Instead of "X is Y", AI tends to write:

- "X serves as Y"
- "X stands as Y"
- "X represents Y"
- "X marks Y"
- "X embodies Y"
- "X boasts Y"

Use "is", "was", "has" when those are what you mean. They're shorter and clearer.

### Frictionless transitions / mechanical evenness

Every sentence roughly the same length. Every paragraph the same shape. Every transition smooth. This is the deepest tell — even when no individual word is wrong, the rhythm gives it away.

Counter by:
- Varying sentence length aggressively (a 4-word sentence next to a 25-word sentence)
- Leaving in one slightly awkward sentence shape that wouldn't survive an AI rewrite
- Starting a paragraph mid-thought ("And yet.", "Still.", "But here's the thing.")
- Ending a paragraph on a fragment when it earns it

## Structural / formatting tells

### The IL-summary-CTA template

AI defaults to: short intro → bulleted points or numbered list → short summary recapping what you just read. The gists never do this. No section headers, no bullet lists, no recap paragraphs at the end.

### Bolded inline mini-headers

Patterns like `**Key insight**: This is the thing.` inside paragraphs. Pure AI tic. Never use them in a gist.

### "Looking ahead" / "Future outlook" / "In the years to come"

Speculation paragraphs about the future, especially as a closer, are a classic AI tell. The gists do close on forward-looking notes, but they're personal and specific ("So it's time to put real effort in again"), not survey-of-the-industry pronouncements.

### Vague attribution

"Industry reports suggest…", "Experts argue…", "Several sources have noted…", "It's widely understood that…"

If the source isn't real and specific, the claim shouldn't be in the post.

### Knowledge-cutoff / capability disclaimers

"While I can't predict…", "As of my last update…", "It's hard to say definitively…" — these creep in even when not needed. Cut them.

## Punctuation tells

- **Em-dash overuse** — already covered above
- **Curly quotes** when the rest of the doc uses straight quotes (or vice versa)
- **Oxford comma inconsistency**: AI sometimes uses Oxford on triplets but not on pairs, or alternates within the same document
- **Heavy use of colons** to introduce phrases: "The reason: X." This is a punchy-essayist tic that AI copies indiscriminately

## Words to ban outright in gists

Borrowing from the existing gist voice and the wider AI-tell research, these words effectively never appear in a good gist:

`leverage`, `delve`, `tapestry`, `landscape` (as metaphor), `realm`, `synergy`, `paradigm`, `holistic`, `seamless`, `robust`, `pivotal`, `groundbreaking`, `cutting-edge`, `game-changer`, `innovative`, `transformative`, `harness`, `utilize`, `unlock`, `empower`, `underscore`, `spearhead`, `foster` (in the soft sense), `navigate` (as metaphor), `journey` (as metaphor), `space` (as in "the AI space"), `ecosystem`, `framework` (unless literally a software framework), `dynamic` (as adjective), `vibrant`, `profound`

If any of these appears in a draft, rewrite the sentence — don't just swap the word.

## Self-check before saving

After drafting, scan for these in order. It's faster than reading through prose-quality:

1. Count em-dashes. >1? Cut some.
2. Search for "not just", "not only", "it's not", "isn't just". >1? Rewrite.
3. Look for three consecutive items separated by commas. Stacked triplet? Break it up.
4. Search for any word from the banned list. Found one? Rewrite the sentence.
5. Read first sentence of each paragraph aloud. Do they all sound the same? Vary at least one.
6. Final paragraph: is it forward-looking and personal, or summarizing what was just said? Cut summary closers.
7. **Casual time references — verify against the actual date.** Any "today is X", "last Tuesday", "back in March", "this summer" needs to be checked against the real calendar before saving. If the draft says "Today it's just Wednesday" and today is Thursday, it's wrong. Use `date -j -f "%Y-%m-%d" "YYYY-MM-DD" "+%A"` via Bash to confirm a day of the week, or compute mentally for month/season references. This is small but high-impact — a wrong day-of-week instantly signals the post wasn't written when it claims to have been, which is exactly the credibility hit AI tells cause in the first place.

If all seven pass and the draft still feels AI-shaped, the rhythm is probably too even. Add one slightly awkward, slightly off-balance sentence somewhere. Human writing has rough edges. Machine writing sands them off.

## Sources

- [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)
- [Decrypt: 5 Biggest Tells Something Was Written by AI](https://decrypt.co/348923/5-biggest-tells-something-written-ai)
- [Walter Writes: Most Common ChatGPT Words to Avoid](https://walterwrites.ai/most-common-chatgpt-words-to-avoid/)
- [Grammarly: Common AI Words](https://www.grammarly.com/blog/ai/common-ai-words/)
- The six existing gists in `gists/`, which are the local source of truth for what "human writing" looks like in Dennis's voice
