# Rationale template

The prose that ships alongside the type sketch. One page. Sentence-case headings, no boilerplate. Replace the italic notes with real content.

## Problem

*One paragraph. What we're trying to do, and what about the existing system or constraints makes the shape non-obvious. If [phase A](../SKILL.md#a-ground) surfaced constraints the design must honor, such as existing types to interop with, callers we can't break, or invariants that cross our boundary, name them here so the reader sees the constraints you saw.*

## Usage (caller's view)

*Write this first, before the type sketch. Show the README or quickstart the consumer reads, plus two or three realistic call sites in their own code. What they import, what they call, what comes back. The type sketch in [Shape](#shape) derives from this, and the two must agree. When they diverge, reconcile the sketch to the usage, not the reverse. The caller's experience is the spec.*

## Shape

*The recommended architecture. Data structures first, then how data flows through the signatures. Name the load-bearing decisions. State which invariants live in types, where validation lives, and what the system deliberately does not do. Judge interface depth explicitly. State what complexity the public surface hides, what stays exposed to callers, and why the interface is no larger than needed. Name the principle behind each decision without restating it.*

## Synthesis decision

*Filled in from the [`arena`](../../arena/SKILL.md) synthesis note. Which candidate became the base and why, what was adapted from each of the others, and what was rejected and why.*

## Tradeoffs accepted

*One bullet per tradeoff the chosen shape makes, in the form "we accept X in exchange for Y." Name anything a future reader might mistake for an oversight, including what looks like premature optimization or premature simplification.*

## Alternatives considered

*Required. Name at least one concrete alternative shape, with one line on why it lost. Judge each on interface depth, not implementation simplicity alone. Name the complexity it exposes to callers and the complexity it hides. Two or three belong here when the design space had real contenders. One is fine when the constraints forced the answer, phrased as "this was the only viable shape because..." Skip flavors of the same shape. This section covers design alternatives the chosen shape rejected, not other runners' candidates.*

## Open questions and risks

*What the human needs to weigh in on, and risks worth flagging before implementation starts. Phrase each as a question, so the human's answer is the resolution rather than a comment.*

## Next implementation step

*The first thing to build against the sketch, in one sentence. What you'd start writing right after synthesis, or after phase C sign-off when a checkpoint was requested.*
