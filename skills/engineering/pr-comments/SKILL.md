---
name: pr-comments
description: Turn review findings you already have into concise, inline-first PR comments and submit them as one GitHub review. Use after a review pass (your own read, /code-review, or /security-review) when the user wants to "comment on the PR", "post these findings", "leave inline comments", or "write PR comments" locally. Brevity is the point — short comments get replies, walls of text get ignored; inline on the changed line beats a PR-level comment, and a short overview goes in the review body. The verdict (COMMENT / REQUEST_CHANGES / APPROVE) is human-provided and never inferred — ask if it's missing. Does not hunt for issues itself.
---

# pr-comments — post a review well

Turn findings you **already have** into a tight set of PR comments and submit them as one GitHub
review. This is a posting layer: it does **not** hunt for issues (that's `/code-review`,
`/security-review`, or your own read) and it does **not** decide the verdict (that's the human's).
It authors, places, and submits.

## Two rules that matter most

1. **Cut text.** A short comment gets a reply; a wall of text gets skimmed and ignored. One issue
   per comment, lead with the point, ≤ 2 lines for most. Need 3+ sentences? It's either two
   comments or it belongs in the overview.
2. **Inline beats PR-level.** Anything that lands on a changed line goes inline on that line. The
   PR-level review body is only for the overview and for concerns that don't belong to one line.

## Workflow

1. **Collect the findings** already in hand. None in context → stop; there's nothing to post. Don't
   start a fresh review here.
2. **Find the PR** for the branch: `gh pr view`. No PR → offer to open one or write the comments to
   a local markdown draft; don't invent a PR.
3. **Map each finding to a diff line.** `gh pr diff` shows what's commentable. Lands on a changed
   (or shown-context) line → inline. Doesn't → fold into the overview. Comments can only attach to
   lines in the diff.
4. **Write each comment** per the rules below. Reach for a ` ```suggestion ` block whenever the fix
   is concrete — one click for the author beats a paragraph describing it.
5. **Write the overview** (the final step) — short, grouped, skimmable. Goes in the review body.
6. **Get the verdict from the user** — `COMMENT`, `REQUEST_CHANGES`, or `APPROVE`. Never infer it.
   If they haven't said, ask and wait.
7. **Assemble & confirm.** Write the findings JSON, run the script with `--dry-run`, show the
   summary, get the OK.
8. **Submit.** Run the script for real; report the review URL.

## Writing rules

- **One issue per comment.** Don't bundle two things on one line.
- **Lead with the point.** Cut "I noticed that…", "It seems like…", "Have you considered…". Say it.
- **Don't restate the code** or pad with praise — the author can read their own diff.
- **Show, don't tell.** Concrete fix → ` ```suggestion ` block; let GitHub apply it.
- **Prefer a question** when unsure ("re-validated server-side?") over a confident wrong assertion.
- **Severity: down only.** You may mark a comment `nit:` or `optional:` to *lower* its stakes.
  Never *raise* them — no `blocking:`, `critical:`, `must-fix:`. Escalation is the human's, and it's
  expressed through the verdict, not your label.
- **Link instead of explain.** Point to `file:line` or a doc rather than reproducing context inline.

## The overview (review body)

The last step, and the only longer piece — still keep it tight. Say what was reviewed and group the
findings by theme or count; don't re-explain each inline comment. Skimmable in five seconds:

> Reviewed the absence refactor (~6 files). Inline: 1 null-deref path, 1 "re-validated
> server-side?", a couple of naming nits. None of these are mine to block on — your call.

## The verdict is the human's

The review event — `COMMENT` / `REQUEST_CHANGES` / `APPROVE` — is never derived from the findings:
not from how many, how severe, or how they read. Given it → use it. Not given → ask and wait.
`post-review.py` requires `--event` with no default, on purpose.

## Mechanics

`scripts/post-review.py` assembles and submits one review. Findings JSON:

```json
{
  "body": "Overview goes here (the review body).",
  "comments": [
    {"path": "services/Absence/Foo.cs", "line": 42, "body": "bug: null-deref when report is null."},
    {"path": "apps/web/src/bar.tsx", "line": 88, "body": "nit: rename `d` → `deadline`."},
    {"path": "services/IAM/Auth.cs", "start_line": 120, "line": 126, "body": "question: re-validated server-side?"}
  ]
}
```

`side` defaults to `RIGHT` (new/changed lines); use `LEFT` for a removed line. Add `start_line` for
a multi-line range.

```bash
# Preview (the confirm step) — posts nothing:
python3 scripts/post-review.py --findings review.json --event COMMENT --dry-run
# Submit, verdict supplied by the human:
python3 scripts/post-review.py --findings review.json --event REQUEST_CHANGES
```

If GitHub rejects the review it's almost always a line that isn't in the diff — move that finding to
the overview or fix the line, and resubmit.
