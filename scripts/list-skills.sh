#!/usr/bin/env bash
#
# List every skill in the repo, grouped by category bucket.
set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO/skills"

for bucket in */; do
  bucket="${bucket%/}"
  echo "$bucket:"
  find "$bucket" -maxdepth 2 -name SKILL.md -not -path '*/node_modules/*' \
    | sed -E "s|^$bucket/||; s|/SKILL.md$||" | sort | sed 's/^/  /'
  echo
done
