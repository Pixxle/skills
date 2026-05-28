# Proposal Format

A proposal is the written output of this skill: the worked-out plan that `grill-with-docs` would have produced through conversation, but resolved from evidence instead.

## Location

`docs/proposals/NNNN-slug.md` — sequential numbering, same convention as ADRs. Scan the directory for the highest number and increment. Create the directory lazily.

In a multi-context repo, place it under the relevant context (e.g. `src/billing/docs/proposals/`) following whatever `CONTEXT-MAP.md` establishes.

## Template

```md
# {Title — the change, in domain language}

**Status:** proposed
**Date:** {YYYY-MM-DD}

## Problem

{2–4 sentences. The problem stated in CONTEXT.md vocabulary. What hurts today, and why it's worth changing.}

## Recommended solution

{Lead with the bold move. Describe the design plainly — what changes, where, and why it's the right shape. If a code-judo move is available, this is it: name the complexity it deletes. Reference files as file:line where it grounds the design.}

## How it works

{The mechanics, walked through the decision tree from the skill: scope, ownership, data shape, sequencing, failure modes, boundaries. One short subsection or paragraph per branch you resolved.}

## Cross-cutting impact

{What this touches beyond the immediate code: other services/packages, frontend, shared contracts/events, data model & migrations, async paths. State "none" explicitly where you checked and found none — silence reads as "didn't look".}

## Fallback (the boring version)

{The incremental, lower-risk option, in case the user rejects the bold move. One paragraph. Why it's safer and what it costs.}

## Assumptions

{Each call you made that the code couldn't fully decide, with its confidence and the alternative you rejected. These are the things most likely to be wrong.}

## Decisions for the user

{The short list of genuinely user-only choices — product trade-offs, external constraints, irreversibles with no clear winner. Empty is a fine answer if there are none.}

## Proposed ADRs

{Links to any ADRs this proposal proposes, e.g. docs/adr/0007-slug.md (status: proposed). Omit the section if none.}
```

## Rules

- **Lead with the bold move, keep the fallback.** The recommended solution is the ambitious one; the fallback exists so the user can choose with eyes open.
- **Evidence over assertion.** Ground claims about how the system works in `file:line` from the exploration, not in supposition.
- **Use the glossary.** Domain terms come from `CONTEXT.md`. If the design needs a new term, add it to `CONTEXT.md` and use it here.
- **Proposed, not accepted.** Everything this skill writes is awaiting ratification. ADRs it creates carry `status: proposed`; the proposal itself is `status: proposed`. The user accepts (or grills) afterward.
- **Don't bury the unresolved.** Assumptions and user-only decisions get their own sections precisely because they're the parts most worth scrutiny.
