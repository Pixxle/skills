# Detecting breaking changes from a PR diff

A language-agnostic rubric for the breaking-changes pass. Apply it to each merged PR's diff.

## The one test

> Would code or usage that worked against the old version still work, **unchanged**, against
> the new one?

If the answer is no for any consumer outside the change's own boundary, it's a breaking change.
Everything below is a way to spot when the answer is no.

## What is a "public contract"

Anything a consumer depends on *across a boundary you don't control both sides of*:

- **Exported code** — public functions, methods, classes, types, constants, enums. Signatures
  and return shapes are part of the contract, not just names.
- **HTTP/RPC** — routes, methods, path/query params, request and response bodies, status codes,
  headers, error shapes.
- **CLI & config** — subcommands, flags, positional args, config keys, env vars, and their
  defaults.
- **Data & messages** — DB schema, migration up/down, event/queue payloads, serialized file
  formats, wire protocols.
- **Anything documented as stable** — if the README or docs promise it, it's public.

If you can't tell whether something is public, look for: exports/visibility keywords, callers in
tests or examples, doc mentions, naming conventions (a leading `_` or `internal`/`private`
package usually means private). Uncertain → treat as **possibly breaking**, don't drop it.

## Kinds of breaking change

- **Removal** — a symbol, route, flag, field, or column is gone.
- **Rename** — same thing, new name, no alias kept. (An alias that still works = not breaking.)
- **Signature change** — a new *required* parameter, reordered params, a removed param, a
  required field added to a request body, a narrowed/changed type.
- **Default change** — same surface, different default value or behaviour when unspecified.
- **Stricter validation** — input that used to be accepted is now rejected.
- **Return/response change** — a removed or renamed field, a changed type, a different status
  code, a different error shape.
- **Semantic change** — identical signature, different *meaning*: units change, ordering
  guarantees drop, an idempotent call becomes non-idempotent, an error is thrown where a value
  was returned.
- **Contract-narrowing** — visibility reduced (public → internal), a stable API marked
  experimental, a supported input range shrunk.

## Not breaking (don't list these as breaking)

- Purely **additive**: a new optional parameter (with a default), a new endpoint, a new
  response field, a new flag, a new nullable column.
- **Deprecation that still works** — mark it under Improvements/Deprecations, not Breaking, as
  long as the old path functions.
- **Internal refactors** with no change to any public contract.
- Bug fixes that bring behaviour *back* to the documented contract — unless consumers provably
  relied on the buggy behaviour, in which case note it.

## Reading it off the diff

- Removed/renamed public identifiers → grep the diff for `-` lines that delete an exported name,
  a route registration, a flag definition, a schema field.
- Changed function signatures → compare the param list before/after on changed public
  functions; watch for added params without defaults.
- Migrations → `DROP COLUMN`, `RENAME`, `NOT NULL` added to an existing column, a type change.
- Config → keys deleted or renamed, a default flipped.
- The subtle ones (semantic/default changes) rarely show as a deleted line — read the *new*
  logic and ask whether the old inputs still produce compatible outputs.

## When unsure

Prefer a false positive to a silent miss. List it as **possibly breaking** with a one-line note
on the doubt ("unclear if `parseToken` is exported outside the package"). A human rules on it;
the skill's job is to make sure nothing that could break a consumer ships unmentioned.
