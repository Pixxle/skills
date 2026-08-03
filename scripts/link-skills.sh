#!/usr/bin/env bash
#
# Flatten the categorized skills in this repo into the personal skill directories
# used by Claude Code and Codex.
#
#   skills/<category>/<name>/SKILL.md -> <agent-skills-dir>/<name> (symlink)
#
# Re-running is safe and idempotent. Only links owned by this repository are
# refreshed or pruned; unrelated personal skills are never replaced.
set -euo pipefail

skills_repo="$(cd "$(dirname "$0")/.." && pwd)"
claude_dest="${CLAUDE_SKILLS_DIR:-${HOME}/.claude/skills}"
codex_root="${CODEX_HOME:-${HOME}/.codex}"
codex_dest="${CODEX_SKILLS_DIR:-${codex_root}/skills}"
platform="all"

usage() {
  cat <<'EOF'
Usage: scripts/link-skills.sh [--all | --claude | --codex]

  --all      Link skills for both Claude Code and Codex (default)
  --claude   Link skills for Claude Code only
  --codex    Link skills for Codex only

For isolated tests or custom installations, set CLAUDE_SKILLS_DIR,
CODEX_SKILLS_DIR, or CODEX_HOME.
EOF
}

case "${1:---all}" in
  --all) platform="all" ;;
  --claude) platform="claude" ;;
  --codex) platform="codex" ;;
  --help|-h) usage; exit 0 ;;
  *) usage >&2; exit 2 ;;
esac

if [ "$#" -gt 1 ]; then
  usage >&2
  exit 2
fi

# macOS ships an older Bash without mapfile/readarray, so collect paths via a
# portable read loop. Newlines in skill paths are intentionally unsupported.
skill_dirs=()
while IFS= read -r skillmd; do
  skill_dirs+=("$(dirname "$skillmd")")
done < <(
  find "$skills_repo/skills" -name SKILL.md \
    -not -path '*/node_modules/*' \
    -not -path '*/deprecated/*' | sort
)

seen_names=""
for skill_dir in "${skill_dirs[@]}"; do
  skill_name="$(basename "$skill_dir")"
  case " $seen_names " in
    *" $skill_name "*)
      echo "ABORT: duplicate skill name '$skill_name' (found at $skill_dir)" >&2
      exit 1
      ;;
  esac
  seen_names="$seen_names $skill_name"
done

link_into() {
  local agent_name="$1"
  local dest="$2"
  local had_conflict=0

  if [ -L "$dest" ]; then
    local dest_target
    dest_target="$(readlink "$dest")"
    case "$dest_target" in
      "$skills_repo"|"$skills_repo"/*)
        echo "ABORT: $dest is a symlink into the repo; remove it and re-run." >&2
        return 1
        ;;
    esac
  fi

  mkdir -p "$dest"

  # Remove stale links from renamed/deleted skills, but only when the link target
  # belongs to this repository.
  for link in "$dest"/*; do
    [ -L "$link" ] || continue
    link_target="$(readlink "$link")"
    case "$link_target" in
      "$skills_repo/skills"/*)
        [ -e "$link" ] || {
          rm -f "$link"
          echo "$agent_name: pruned $(basename "$link") (dangling)"
        }
        ;;
    esac
  done

  for skill_dir in "${skill_dirs[@]}"; do
    skill_name="$(basename "$skill_dir")"
    target="$dest/$skill_name"

    if [ -e "$target" ] || [ -L "$target" ]; then
      if [ -L "$target" ]; then
        current_target="$(readlink "$target")"
        case "$current_target" in
          "$skills_repo/skills"/*)
            ln -sfn "$skill_dir" "$target"
            echo "$agent_name: linked $skill_name -> ${skill_dir#"$skills_repo"/}"
            continue
            ;;
        esac

        # Migrate the old Codex setup, where a Codex link pointed to a Claude
        # link that in turn pointed into this repository.
        if [ -L "$current_target" ]; then
          nested_target="$(readlink "$current_target")"
          case "$nested_target" in
            "$skills_repo/skills"/*)
              ln -sfn "$skill_dir" "$target"
              echo "$agent_name: linked $skill_name -> ${skill_dir#"$skills_repo"/}"
              continue
              ;;
          esac
        fi
      fi

      echo "$agent_name: skipped $skill_name; $target is not managed by this repo" >&2
      had_conflict=1
      continue
    fi

    ln -s "$skill_dir" "$target"
    echo "$agent_name: linked $skill_name -> ${skill_dir#"$skills_repo"/}"
  done

  return "$had_conflict"
}

status=0
if [ "$platform" = "all" ] || [ "$platform" = "claude" ]; then
  link_into "Claude Code" "$claude_dest" || status=1
fi
if [ "$platform" = "all" ] || [ "$platform" = "codex" ]; then
  link_into "Codex" "$codex_dest" || status=1
fi

exit "$status"
