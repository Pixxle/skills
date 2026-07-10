#!/usr/bin/env bash
# Collect the raw material for a changelog + breaking-changes pass over a range.
# Emits: the commit log (no merges), then each merged PR in range with its full diff.
#
# Usage:
#   collect-history.sh [<from>] [<to>]
#   collect-history.sh                 # since last tag -> HEAD
#   collect-history.sh v2.4.0          # v2.4.0 -> HEAD
#   collect-history.sh v2.4.0 v2.5.0   # between two refs
set -euo pipefail

FROM="${1:-$(git describe --tags --abbrev=0 2>/dev/null || git rev-list --max-parents=0 HEAD | tail -1)}"
TO="${2:-HEAD}"
RANGE="$FROM..$TO"

echo "===== RANGE: $RANGE ====="
echo "from: $FROM   to: $TO"

echo
echo "===== COMMITS (no merges) — feeds the changelog pass ====="
git log "$RANGE" --no-merges --pretty=format:'%h %s' || true

echo
echo
echo "===== MERGED PRs — feeds the breaking-changes pass ====="
if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
  # Date-bound the PR search to the range so we only inspect PRs merged in it.
  FROM_DATE="$(git log -1 --format=%cs "$FROM" 2>/dev/null || echo '')"
  TO_DATE="$(git log -1 --format=%cs "$TO" 2>/dev/null || echo '')"
  echo "(gh available — searching merged PRs in $FROM_DATE..$TO_DATE)"
  PRS="$(gh pr list --state merged --search "merged:${FROM_DATE}..${TO_DATE}" \
         --json number,title,url --jq '.[].number' 2>/dev/null || echo '')"
  if [ -z "$PRS" ]; then
    echo "(no merged PRs found via gh; falling back to merge commits below)"
  else
    for n in $PRS; do
      echo
      echo "----- PR #$n -----"
      gh pr view "$n" --json number,title,url,body \
        --jq '"#\(.number) \(.title)\n\(.url)\n\n\(.body // "")"' 2>/dev/null || true
      echo
      echo "--- diff for #$n ---"
      gh pr diff "$n" 2>/dev/null || echo "(diff unavailable)"
    done
    exit 0
  fi
fi

# Fallback: no gh / no auth / no PRs -> use merge commits and their diffs.
echo "(no gh — using merge commits; squash-merged PRs will look like single commits)"
for mc in $(git log "$RANGE" --merges --pretty=format:'%h'); do
  echo
  echo "----- merge $mc -----"
  git show "$mc" --no-patch --pretty=format:'%s%n%b'
  echo
  echo "--- diff for $mc ---"
  git show "$mc" --pretty=format: -m --first-parent || true
done
