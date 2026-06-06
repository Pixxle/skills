#!/usr/bin/env bash
# inspect-design-zip.sh — unzip a Claude Design export and inventory its images.
#
# Claude Design serves mockups from URLs that expire, so we re-host the images on
# Linear to keep them. This script does the deterministic half: it unzips the export
# to a temp dir and lists every image with the EXACT byte size and MIME type that
# Linear's prepare_attachment_upload needs — declaring the wrong size returns HTTP 403.
#
# Usage: inspect-design-zip.sh [path/to/export.zip]
#   With no argument, picks the newest *.zip in ~/Downloads.
#
# Stdout (tab-separated): first line is `TMPDIR\t<extraction-dir>`, then one image per
# line as `<bytes>\t<mime>\t<absolute-path>`.
# Stderr: a human summary, plus `OTHER\t<path>` for each non-image file (e.g. SVG source,
# HTML bundle) so the caller can decide whether to link those instead.
set -euo pipefail

zip="${1:-}"
if [ -z "$zip" ]; then
  zip="$(ls -t "$HOME"/Downloads/*.zip 2>/dev/null | head -1 || true)"
fi
if [ -z "$zip" ] || [ ! -f "$zip" ]; then
  echo "No zip found. Pass a path, or put the Claude Design export in ~/Downloads." >&2
  exit 1
fi

dest="$(mktemp -d "${TMPDIR:-/tmp}/claude-design.XXXXXX")"
unzip -o -q "$zip" -d "$dest"
printf 'TMPDIR\t%s\n' "$dest"

mime_for() {
  case "$(printf '%s' "${1##*.}" | tr '[:upper:]' '[:lower:]')" in
    png)      echo image/png ;;
    jpg|jpeg) echo image/jpeg ;;
    gif)      echo image/gif ;;
    webp)     echo image/webp ;;
    *)        echo "" ;;  # svg/html/source fall to OTHER — they don't embed inline reliably
  esac
}

size_of() { stat -f%z "$1" 2>/dev/null || stat -c%s "$1" 2>/dev/null; }

found=0
while IFS= read -r -d '' f; do
  mime="$(mime_for "$f")"
  if [ -z "$mime" ]; then
    printf 'OTHER\t%s\n' "$f" >&2
    continue
  fi
  printf '%s\t%s\t%s\n' "$(size_of "$f")" "$mime" "$f"
  found=$((found + 1))
done < <(find "$dest" -type f -print0 | sort -z)

echo "FOUND ${found} image(s) in: $(basename "$zip")" >&2
