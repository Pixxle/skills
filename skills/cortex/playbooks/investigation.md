### Investigation

**You own a cited answer.** It is an explanation, a verdict, or a recommendation, never a code change.

1. Classify the question as how, why, claim, or choice. Mark each later step that does not match `skip: not a <type> question`.
2. How. "How does X work" or "where does X live" → read and follow [`how`](../../how/SKILL.md).
3. Why. "Why is Y built this way" or "does that reason still hold" → read and follow [`why`](../../why/SKILL.md).
4. Claim. "Are we sure about Z" → write Z down as a claim and test it against the code, its history, or a read-only run. Answer yes, no, or unknown first, then give the evidence.
5. Choice. "Should we do X or Y" or "what is the recommended way to solve this" → for each option, read and follow [`how`](../../how/SKILL.md) for the code it touches. Read and follow [`why`](../../why/SKILL.md) for each flag, guard, or past decision the option touches, as a full investigation when the option reverses it or reinstates something a past change removed or reverted, and as a passing question when the option only relies on it. An option that changes no past decision skips that history read, and the reply says so. End with a recommendation and a tradeoffs table.

If the investigation precedes a code change, finish the answer and hand it back to the user. Then route the change to [Bug fix](bug-fix.md) or [Feature](feature.md), whose grounding steps reuse this answer.

**Reply:** the routed skill's output, the claim verdict, or the recommendation with its tradeoffs table the options that skipped the history read, and for each why read, its Sources consulted or held-back categories.
