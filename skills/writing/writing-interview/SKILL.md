---
name: writing-interview
description: Develop an author's unstructured thoughts into a clear working idea through a Socratic conversation. Use when the user wants to be interviewed about an article idea, understand what they think before writing, or clarify the premise before collecting fragments or drafting.
disable-model-invocation: true
---

# Writing Interview

Help the author discover and sharpen what they want to say. The result is a working understanding that can guide writing, including any uncertainty the article should retain.

## Start with their thoughts

Accept a rant, scattered notes, an anecdote, a contradiction, or a topic with no settled opinion. If thoughts are already supplied, begin from them; otherwise invite a free-form brain dump.

Reflect the interesting thread in a few sentences, distinguishing the author's words from your tentative interpretation. Then ask one focused question. Do not begin with a questionnaire, outline, title exercise, or draft.

## Interview

Use a collaborative Socratic style. Follow each answer with the question that would most improve understanding. Ask one main question per turn and wait for the answer; do not simulate the author's replies.

Useful moves, chosen to fit the conversation:

- Clarify a loaded term: "When you say ownership, what does that look like in practice?"
- Find a concrete anchor: "What happened that made you notice this?"
- Uncover the reason: "Why does that bother you more than the other parts?"
- Test a leap: "Does that example support the broader claim, or a narrower one?"
- Examine a counterexample: "When would the opposite approach make sense?"
- Find the stakes: "What would you want someone reading this to reconsider?"
- Follow a contradiction: "Earlier you valued autonomy; here you want oversight. Where is the boundary?"

Be pointed when the thought is vague or contradictory, without debating for sport. Respect a requested gentler or more adversarial style. Do not force every idea into a thesis: an observation, unresolved tension, or honest question may be the point.

Periodically offer a short synthesis for correction, especially after the angle changes. Retain striking phrases and concrete details. Do not smooth away the author's ambivalence or turn your suggestion into their settled view.

Do not invent experiences, quotations, numbers, or evidence. Mark interpretations and factual claims needing verification. Keep verified evidence distinct from personal experience and speculation.

## Working notes

Begin the conversation before asking about storage. Use a supplied notes path or established project convention; if neither exists, ask once where to save notes when there is useful material to preserve. Until then, keep the notes in the conversation.

Keep the initial brain dump intact in the notes, alongside an evolving working brief. Re-read an existing file before updating it and preserve the author's edits. Do not turn these notes into an article or mix them into the fragments file.

The brief carries whichever of these are established:

- Topic and working angle: the claim, observation, tension, or question.
- Meaning and stakes: what the author means and why it matters to the intended reader.
- Concrete material: experiences, examples, evidence, and counterexamples, with their provenance.
- Boundaries and uncertainties: qualifications, unresolved questions, and facts to verify.
- Phrases to preserve: the author's distinctive wording.
- Writing preferences: voice, length, format, and destination, if given.
- Files and progress: notes, fragments, article paths, and the next useful step, if known.

Leave unknowns open instead of filling them with guesses. This is a handoff, not a required form or article outline.

## Finish or hand off

When there is a coherent angle and enough concrete material to begin writing, show the compact brief and ask whether it captures what the author means. Their correction or agreement settles the working understanding; do not demand perfect certainty or a fixed number of interview rounds.

If the author says "enough" or asks to draft earlier, hand off what exists and name the remaining gaps. An exploratory piece can carry uncertainty forward.

When called by `compose-blog-post`, return the brief and current paths to that coordinator. Do not choose or start the drafting workflow yourself. When invoked alone, finish with the brief and suggest the next stage. If the author wants to continue, read and follow [`compose-blog-post`](../compose-blog-post/SKILL.md) from the shaping stage with this brief.

## Example

Input: "AI makes coding faster, but I feel less involved. Maybe I'm just attached to typing."

First move: "There may be a difference between doing the typing and feeling responsible for the work. When did you first feel less involved?"

Possible outcome, only if supported by the answers: a piece about preserving judgment as coding becomes delegation, grounded in one actual experience and clear about what remains uncertain.
