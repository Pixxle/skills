---
name: changelog
description: >-
  Generate a user-facing changelog from git history and flag every breaking API
  change a merged PR introduced. Inspect public contracts such as exported
  symbols, HTTP routes, CLI flags, config keys, and schemas, then write breaking
  changes with before/after examples and migration steps. Use when preparing
  release notes, cutting a version, summarising changes since a tag or date, or
  when the user asks what broke, whether an API changed, or to write a changelog.
  Language-agnostic; reasons about whatever public surface the repo exposes.
---

# changelog

Two passes over one commit range. The **changelog pass** categorises commits into user-facing
notes. The **breaking-changes pass** inspects each merged PR's diff for changes to a public
contract that would break existing consumers. The Breaking Changes section is the point of this
skill: a dropped feature entry is an annoyance, a missed breaking change is a broken customer.
Never ship the changelog without the breaking-changes pass having run.

## Steps

1. **Fix the range.** Default: since the last tag → HEAD. Or between two versions, a date
   range, or a single PR (per-PR mode: skip to step 4 against that one diff).
2. **Collect the raw material** with the bundled script — it emits the commit log plus every
   merged PR in range with its full diff:
   ```bash
   scripts/collect-history.sh [<from>] [<to>]
   ```
   No `gh`/no remote → it falls back to merge-commit diffs and says so (squash-merged PRs then
   look like single commits).
3. **Changelog pass.** Group commits into Features / Improvements / Fixes / Security. Drop
   internal noise (refactors, tests, CI, formatting). Rewrite each in user language, not
   commit-speak.
4. **Breaking-changes pass.** Run each PR diff through the rubric in
   [BREAKING-CHANGES.md](BREAKING-CHANGES.md). Anything that removes, renames, or changes the
   shape or behaviour of a public contract is breaking. Unsure whether the surface is public →
   flag it **possibly breaking**, never drop it silently.
5. **Assemble** with Breaking Changes first (format below), then the user-facing sections; omit
   empty sections.
6. **Review before publishing.** Show the draft; don't write `CHANGELOG.md` or post it until
   the user confirms. Call out anything flagged *possibly* breaking so a human rules on it.

## Breaking-change entry

State what broke, show before/after, tell the consumer what to do. A copyable diff beats a
paragraph; link the PR.

```markdown
## ⚠️ Breaking Changes

- **`createUser` no longer accepts a positional `role` argument** (#482)
  It now takes an options object. Callers passing `role` positionally will break.

  ```diff
  - createUser("ada", "admin")
  + createUser("ada", { role: "admin" })
  ```

  **Migrate:** wrap the second argument in `{ role: … }`. No behaviour change beyond the shape.
```

## Output format

```markdown
# Release 3.0.0 — 2026-07-10

## ⚠️ Breaking Changes
- **<what broke>** (#PR) — before/after + migration

## ✨ New Features
- **Team Workspaces**: separate workspaces per project, invite teammates.

## 🔧 Improvements
- **Faster Sync**: files sync 2× faster across devices.

## 🐛 Fixes
- Fixed large images failing to upload.

## 🔒 Security
- Patched a session-fixation issue in login.
```

- A `CHANGELOG_STYLE.md` in the repo overrides section names, emoji, and voice — honour it.
- Any Breaking Changes entry means the release is a **major** bump; say so if the proposed
  version doesn't reflect it.
