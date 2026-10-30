#!/usr/bin/env bash
#
# List every skill in the repo: each skills/<name> folder.
set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO"

{
  for dir in skills/*/; do
    if [ -f "${dir}SKILL.md" ]; then
      basename "$dir"
    fi
  done
} | sort
