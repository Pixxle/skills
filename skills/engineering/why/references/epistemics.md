# Epistemics

How to reason about confidence when evidence is historical, fragmentary, and sometimes contradictory, and how to report it without flattening it into false certainty. Code shows what it does, not why it exists. The why lives in commits, PRs, tickets, docs, and conversations. All of them are incomplete, biased, and sometimes missing. A confident-sounding guess misleads the user.

## Confidence tiers

Every claim sits in exactly one tier. The tier sets its section and its phrasing.

### 1. Direct

An explicit, written statement answers the question. An author said why. "The code does X, so the author wanted X" does not count.

Examples. A PR description says "fixes pagination for users with more than 1000 items". A ticket says "Acme requested this in their security review". A code comment says "clamp to 100 because the upstream API rejects larger values". A design doc says "we chose A over B because we need persistence across restarts". A chat message from the author says "switching approach since the old one was flaky in tests".

Phrasing is confident, present tense, and cited. "This exists because X."

### 2. Supported

Several indirect items converge on one conclusion. No single source states it, but the pattern makes it likely. For example, the PR title says "improve performance", the ticket is labeled perf, and the surrounding commits all touch the same hot path. Or every test added with the change exercises very large inputs.

Phrasing is confident but visibly derived, citing each item. "The evidence points strongly to X," followed by the items.

### 3. Inferred

A reasonable reading of context that nothing states. It is your interpretation, not a fact from the record. For example, the PR gives no reason, but the error was firing in production per the incident channel and the fix merged the same day, so it was likely a hotfix.

Phrasing is hedged, with the chain visible. "Given A and B, C seems likely because D."

### 4. Speculative

A plausible hypothesis on thin evidence, where other explanations fit equally well. Worth presenting because the user may know which is right. Mark it as a guess. "One possibility is a workaround for a since-fixed browser bug, but we found no contemporary evidence." It usually lives in Competing hypotheses.

### 5. Unknown

You looked and could not find out. This is a valid and important outcome. Say exactly what you searched. "We searched the issue tracker for A and B, read the 6 PRs touching this file since 2023, and searched the repo for the threshold literal. None gave a rationale."

## Phrasing

**Confidence words** imply Direct or Supported evidence and need an adjacent citation. Never use them for inferences. They include "because", "the reason is", "was designed to" (claims author intent), "fixes", "addresses", "solves" (claim the change worked), and "the team decided" (claims a group decision happened).

**Hedges** mark interpretation. Use them freely in the inference section. They include "appears to", "seems to", "likely", "suggests", "is consistent with", "one reading is", "plausibly", "may have been", and "the evidence points toward".

**Avoid** "obviously", "clearly", "of course", dismissive "just", and "I think" or "I believe". If it were obvious, the user would not be asking. Write "the evidence suggests" instead of a personal opinion.

## Avoid rationalization

Code that makes sense today may have been written for reasons that no longer apply, or that were wrong at the time. Don't retrofit a clean rationale onto messy history. Don't assume the author did the right thing and work backward. Don't assume a consistent pattern was intentional when it may be copy-paste. Absence of evidence is not evidence of absence. "Nobody mentioned security, so it wasn't a concern" is a false step.

## The sycophancy trap

Users often embed a hypothesis, as in "why do we do this, I assume for performance?" Treat the guess as one candidate and check it independently. If the evidence supports it, say so with citations. If not, say so and present what the evidence does support.

## When evidence contradicts

Show both items with citations. Don't pick the one that fits a tidier story. A ticket may say "needed for customer X's compliance requirement" while the PR says "cleaning up tech debt". Both may be true, or one may be wrong. Let the user decide.

## When evidence is missing

An honest "we don't know" is one of the most useful outputs. It tells the user the answer is not in the obvious places, that they need to ask a person, or that the question is not worth more time. Filling a gap with a confident guess harms the user, because they will act on it. Name each gap with the question, the sources searched, the queries used, and what came back.

## Before finalizing

Check every claim in What we found and What we can reasonably infer.

- It has a citation, or it moves to inferred or hypotheses.
- Its phrasing matches its tier.
- It does not use code as evidence for its own intent.
- The output has a What we don't know section. An empty one is suspicious.
