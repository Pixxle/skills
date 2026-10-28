# Bugbot / bot-review triage

Use with [`babysit`](SKILL.md) when handling Bugbot or other automated review
comments. The goal is not to ignore bots by default. The goal is to stop treating
every comment as a required code change.

## Decision rubric

Classify each thread before acting:

- **`fix`** — Plausible correctness, security, privacy, data loss, auth, billing,
  migration, idempotency, race, or shipped-behavior issue. Fix in the lowest
  owning PR, reply with the commit, resolve the thread.
- **`dismiss`** — Matches a documented low-risk noisy pattern, and the current
  code proves no change is needed. Reply with a short reason and resolve.
- **`ask`** — Novel, high-severity, security/privacy/data-related, or ambiguous.
  Ask the user instead of guessing.

When in doubt, ask. Skipping a noisy style comment is cheap; skipping a real data
or security bug is not.

## Learned pattern format

Add future patterns in this shape:

```markdown
### <short pattern name>

- Confidence: candidate | recurring | strong
- Skip when: <conditions that must be true>
- Do not skip when: <risk boundaries>
- Example signal: <phrases or code context that identify the pattern>
- Source: <PR/comment URL or short historical note>
```

Use `candidate` for one or two examples, `recurring` after multiple real
dismissals, and `strong` only when the pattern is narrow, repeatedly verified,
and low-risk.

## Recurring skip candidates

### Intentional UI or design-system visual changes

- Confidence: candidate
- Skip when: The PR description, screenshots, design review, or nearby code makes
  the visual change explicit, and the bot only restates that a shared visual
  default changed.
- Do not skip when: Accessibility, focus visibility, keyboard navigation, color
  contrast, or a component API contract the PR did not intentionally change.
- Example signal: Focus outlines, button sizes, spacing, or shared component
  defaults where the owner replies "intentional".

### Upstack or stack-local usage the bot cannot see

- Confidence: candidate
- Skip when: The bot flags an export, helper, or file as unused, and the forge's
  PR list / upper-stack diffs show a later PR uses it.
- Do not skip when: The PR is not in a stack, the symbol is public API, or the
  supposed upstack use cannot be verified.
- Example signal: "Exported component is never used" with a human reply like
  "used upstack".

### Temporary duplication during parallel implementation

- Confidence: candidate
- Skip when: The PR intentionally duplicates a small amount of code to keep a new
  path parallel to an old path being deleted or proven out.
- Do not skip when: Duplication touches security, billing, data access, API
  behavior, or a long-lived shared abstraction would clearly reduce risk.
- Example signal: "Significant duplication" where the owner explains the old path
  will be deleted.

### Existing framework or component invariant covers the warning

- Confidence: candidate
- Skip when: The concern is already guaranteed by a shared component, framework
  contract, type invariant, or single source of truth visible in the diff or
  nearby code.
- Do not skip when: The invariant is assumed but not enforced, depends on timing,
  or crosses async/state boundaries where values can diverge.
- Example signal: Missing max-height on an inner popover when the shared popover
  already enforces viewport bounds.

### Owner-declared follow-up or deferred cleanup

- Confidence: candidate
- Skip when: The owner explicitly marks a known follow-up, the behavior is not
  made worse by this PR, and the comment is not high-risk.
- Do not skip when: Acting without owner input, medium/high severity product
  behavior, or deferring would merge a new regression.
- Example signal: "I'll worry about that later" / "we'll delete this eventually".

### Self-withdrawn or explicit false-positive rule comments

- Confidence: recurring
- Skip when: The comment body or a later bot reply says the finding is withdrawn,
  compliant, or a false positive, and you can verify the rule locally.
- Do not skip when: The only evidence is a human saying "false positive" on a
  high-risk issue without explanation.
- Example signal: A file-naming rule whose body says the file is already compliant.

### Stale finding already fixed later in the same PR

- Confidence: candidate
- Skip when: An agentic review claims a missing gate, and the current tip clearly
  includes that exact check (typically added in a later hardening commit).
- Do not skip when: The cited helper is a no-op for the principal under
  discussion, the check runs after the side effect it guards, or coverage is
  missing.
- Example signal: HIGH "missing authorization check" while the tip already calls
  the guard before the side effect.

### Contract-test drift — run the test first

- Confidence: candidate
- Skip when: Never skip the verification. When a PR pins protocol or docs prose
  in a contract test and the bot claims mismatch, run that test on the tip before
  classifying. Red confirms; green is concrete disproof for the dismissal reply.
- Do not skip when: n/a — verification shortcut, not a dismissal pattern.
- Example signal: "Contract test omits …" after earlier fix commits reworded the
  pinned passage.

## Ask by default

Do not auto-skip these, even if a previous PR dismissed something similar:

- Security, privacy, auth, billing, data retention, training-data, and permission
  boundaries
- High-severity findings
- Migration, schema, idempotency, concurrency, and cross-system behavior
- Comments where a small suggested fix clearly reduces risk without changing
  product intent

## Candidate learnings

Append new candidate patterns here during or after babysitting when they look
team-useful but not yet mature. Prefer promoting recurring candidates into the
section above once several PRs confirm them.
