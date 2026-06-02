#!/usr/bin/env bash
#
# Flatten the categorized skills in this repo into ~/.claude/skills as symlinks,
# so Claude Code (which only discovers skills one level deep) can find them.
#
#   skills/<category>/<name>/SKILL.md  ->  ~/.claude/skills/<name>  (symlink)
#
# Skills under skills/deprecated/ are skipped. Re-running is safe and idempotent:
# existing symlinks are refreshed and dangling ones are pruned.
set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"
DEST="${HOME}/.claude/skills"

# Safety: never run if DEST itself is a symlink into the repo — that would make
# the link script pollute the working copy instead of populating ~/.claude/skills.
if [ -L "$DEST" ] && [[ "$(readlink "$DEST")" == "$REPO"* ]]; then
  echo "ABORT: $DEST is a symlink into the repo. Remove it and re-run." >&2
  exit 1
fi

mkdir -p "$DEST"

# Prune dangling symlinks left over from renamed/removed skills.
for link in "$DEST"/*; do
  [ -L "$link" ] || continue
  [ -e "$link" ] || { echo "pruned $(basename "$link") (dangling)"; rm -f "$link"; }
done

# Link every skill, flattening category folders. deprecated/ and node_modules/ excluded.
find "$REPO/skills" -name SKILL.md \
  -not -path '*/node_modules/*' \
  -not -path '*/deprecated/*' | while read -r skillmd; do
  src="$(dirname "$skillmd")"
  name="$(basename "$src")"
  target="$DEST/$name"
  # Replace a real file/dir (not a symlink) sitting in the way.
  if [ -e "$target" ] && [ ! -L "$target" ]; then
    rm -rf "$target"
  fi
  ln -sfn "$src" "$target"
  echo "linked $name -> ${src#"$REPO"/}"
done
