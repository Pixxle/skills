#!/usr/bin/env python3
"""Submit ONE pull-request review: inline comments + an overview body, with a human-provided verdict.

The posting layer for the `pr-comments` skill. It does not find issues and it does not choose the
verdict. It takes findings you've already authored, assembles them into a single GitHub review
(inline comments anchored to diff lines + the overview in the review body), and submits it with the
`--event` you pass. There is no default event — by design, the verdict is the human's call.

Findings JSON (via --findings FILE, or --findings - for stdin):

    {
      "body": "Overview that goes in the review body (the final summary).",
      "comments": [
        {"path": "services/Absence/Foo.cs", "line": 42, "body": "bug: null-deref when report is null."},
        {"path": "apps/web/src/bar.tsx", "line": 88, "side": "RIGHT", "body": "nit: rename `d` -> `deadline`."},
        {"path": "services/IAM/Auth.cs", "start_line": 120, "line": 126, "body": "question: re-validated server-side?"}
      ]
    }

Each comment needs `path`, `line`, and `body`. `side` defaults to RIGHT (the new file); use LEFT to
comment on a removed line. For a multi-line range add `start_line` (and `start_side`, default = side).
Comments must target lines that appear in the PR diff, or GitHub rejects the whole review.

Examples
--------
  # Assemble and preview, post nothing (the confirm step):
  python3 post-review.py --findings review.json --event COMMENT --dry-run

  # Submit for real, verdict provided by the human:
  python3 post-review.py --findings review.json --event REQUEST_CHANGES

Requires: gh (authenticated). No third-party Python deps.
"""
import argparse, json, subprocess, sys


def gh(args, check=True):
    out = subprocess.run(["gh", *args], capture_output=True, text=True)
    if check and out.returncode != 0:
        sys.exit(f"error: `gh {' '.join(args)}` failed:\n{out.stderr.strip()}")
    return out


def resolve_pr(pr):
    cmd = ["pr", "view", "--json", "number,headRefOid,url"]
    if pr:
        cmd.insert(2, str(pr))
    out = gh(cmd, check=False)
    if out.returncode != 0:
        sys.exit("error: could not resolve the pull request (no PR for this branch, or bad --pr). "
                 "Open a PR or pass --pr N.")
    data = json.loads(out.stdout)
    return data["number"], data["headRefOid"], data["url"]


def resolve_repo():
    return gh(["repo", "view", "--json", "nameWithOwner", "-q", ".nameWithOwner"]).stdout.strip()


def build_comment(c):
    if not c.get("path") or not c.get("body") or c.get("line") is None:
        sys.exit(f"error: each comment needs path, line, body. Bad entry: {json.dumps(c)}")
    side = c.get("side", "RIGHT")
    out = {"path": c["path"], "line": int(c["line"]), "side": side, "body": c["body"]}
    if c.get("start_line") is not None:
        out["start_line"] = int(c["start_line"])
        out["start_side"] = c.get("start_side", side)
    return out


def print_summary(pr_num, repo, url, event, body, comments):
    print(f"PR #{pr_num} · {repo} · event: {event}")
    print(f"{len(comments)} inline comment(s):")
    for c in comments:
        loc = c["path"] + (f":{c['start_line']}-{c['line']}" if "start_line" in c else f":{c['line']}")
        print(f"  {loc}  {c['body'].strip().splitlines()[0][:80]}")
    print("overview (review body):")
    print(f"  {body.strip().splitlines()[0] if body.strip() else '(empty)'}")
    print(f"  {url}")


def main():
    p = argparse.ArgumentParser(description="Submit one PR review: inline comments + overview body.")
    p.add_argument("--findings", required=True, help="JSON file with {body, comments[]}, or - for stdin")
    p.add_argument("--event", required=True, choices=["COMMENT", "REQUEST_CHANGES", "APPROVE"],
                   help="The review verdict. Human-provided — never inferred from the findings.")
    p.add_argument("--pr", help="PR number (default: the PR for the current branch)")
    p.add_argument("--dry-run", action="store_true", help="Assemble and print a summary; post nothing.")
    args = p.parse_args()

    raw = sys.stdin.read() if args.findings == "-" else open(args.findings).read()
    try:
        data = json.loads(raw)
    except json.JSONDecodeError as e:
        sys.exit(f"error: findings is not valid JSON: {e}")

    body = data.get("body", "")
    comments = [build_comment(c) for c in data.get("comments", [])]
    if not body.strip() and not comments:
        sys.exit("error: nothing to post — no comments and no overview body.")

    pr_num, commit_id, url = resolve_pr(args.pr)
    repo = resolve_repo()

    if args.dry_run:
        print_summary(pr_num, repo, url, args.event, body, comments)
        print("— dry run, nothing posted —")
        return

    payload = {"commit_id": commit_id, "body": body, "event": args.event, "comments": comments}
    out = subprocess.run(
        ["gh", "api", f"repos/{repo}/pulls/{pr_num}/reviews", "-X", "POST", "--input", "-"],
        input=json.dumps(payload), capture_output=True, text=True,
    )
    if out.returncode != 0:
        sys.exit(f"error: GitHub rejected the review (often a line not in the diff):\n{out.stderr.strip()}")
    print(json.loads(out.stdout).get("html_url", "review submitted"))


if __name__ == "__main__":
    main()
