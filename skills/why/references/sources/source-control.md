# Source control and PRs

Always available through git and `gh`. The most trustworthy category because it is tied directly to the code.

## What it holds

- Commit messages, dates, authors, and diffs
- PR descriptions, review comments, and discussion threads
- Inline comments, TODOs, FIXMEs, and deprecation notes
- ADRs, CHANGELOG entries, and release notes kept in the repo
- Tests, whose names and assertions often encode the edge case that motivated a change
- Files changed in the same commits (co-change signal)
- Ticket IDs in commit messages and PR bodies

## How to search it

Expand the seed commit list.

```bash
git log --follow --oneline -- <file>          # history through renames
git log -S '<exact_string_from_code>' -- <file>  # commits adding or removing this text
git log -G '<regex>' -- <file>                # same, by pattern
git blame -L <start>,<end> <file>             # last touch per line
git show <hash>                               # one commit in full
git log <old>..<new> -p -- <file>             # changes between two points
gh pr view <number> --comments                # PR body and discussion
gh pr list --state merged --search '<symbol or phrase>'
```

Look for out-of-band records.

```bash
rg -l -i 'architecture.decision' --glob '*.md'        # ADRs
rg -n -C2 '(TODO|FIXME|HACK|XXX|NOTE)' <target_file>   # notes near the target
rg -l '<symbol>' --glob '*test*'                       # related tests
```

## Pitfalls

- A revert followed by "re-apply with ..." usually hides the real reason in the revert's PR. Read both.
- A mass rename or formatting commit breaks blame. Use `--follow`, `-S`, or blame the parent commit.
