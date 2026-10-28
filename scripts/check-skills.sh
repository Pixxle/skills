#!/usr/bin/env bash
set -euo pipefail
export LC_ALL=C

usage() {
  cat <<'EOF'
Usage: scripts/check-skills.sh [--installed [--all | --claude | --codex]]

  --installed  Also check that this machine's Claude Code and Codex installs
               link every active skill and agent into a checkout of this repo,
               with no dangling, stale, or shadowing entries. Never use it in
               CI.
  --claude     With --installed, check only the Claude Code install.
  --codex      With --installed, check only the Codex install.

Set SKILLS_REPO to check another checkout. --installed reads the same
CLAUDE_SKILLS_DIR, CLAUDE_AGENTS_DIR, CODEX_SKILLS_DIR, CODEX_AGENTS_DIR, and
CODEX_HOME overrides as link-skills.sh, plus AGENTS_SKILLS_DIR (default
~/.agents/skills).
EOF
}

installed=0
runtime=""
for arg in "$@"; do
  case "$arg" in
    --installed) installed=1 ;;
    --all|--claude|--codex)
      if [ -n "$runtime" ]; then
        usage >&2
        exit 2
      fi
      runtime="${arg#--}"
      ;;
    --help|-h) usage; exit 0 ;;
    *) usage >&2; exit 2 ;;
  esac
done

if [ -n "$runtime" ] && [ "$installed" = 0 ]; then
  usage >&2
  exit 2
fi
runtime="${runtime:-all}"

skills_repo="${SKILLS_REPO:-$(dirname "$0")/..}"
skills_repo="$(cd "$skills_repo" && pwd)"
cd "$skills_repo"

if [ ! -d skills ]; then
  echo "$skills_repo/skills:1: missing; run this from a checkout of the skills repo" >&2
  exit 1
fi

tmp="$(mktemp -d "${TMPDIR:-/tmp}/check-skills.XXXXXX")"
trap 'rm -rf "$tmp"' EXIT
problems="$tmp/problems"
: > "$problems"

report() {
  printf '%s:%s: %s\n' "$1" "$2" "$3" >> "$problems"
}

# Exact-case lookup. macOS file systems ignore case, so [ -f ] accepts skill.md
# for SKILL.md and the skill then fails to load on Linux.
has_file() {
  local entry
  for entry in "$1"/*; do
    [ "${entry##*/}" = "$2" ] && return 0
  done
  return 1
}

IFS= read -r -d '' frontmatter_awk <<'AWK' || true
function err(line, msg) { printf "%s:%d: %s\n", file, line, msg }
function trim(s) { sub(/^[ \t]+/, "", s); sub(/[ \t\r]+$/, "", s); return s }
function field(k,   v) {
  v = value[k]
  if (v ~ /^[|>][-+0-9]*$/) v = ""
  v = trim(v more[k])
  if (v ~ /^".*"$/ || v ~ /^'.*'$/) v = substr(v, 2, length(v) - 2)
  return trim(v)
}
NR == 1 {
  if ($0 !~ /^---[ \t\r]*$/) {
    err(1, "no frontmatter; start the file with a --- block holding name and description")
    skip = 1
    exit
  }
  open = 1
  next
}
open && /^---[ \t\r]*$/ { closed = 1; open = 0; next }
open && /^[A-Za-z0-9_-]+[ \t]*:/ {
  key = $0; sub(/[ \t]*:.*/, "", key)
  val = $0; sub(/^[^:]*:/, "", val)
  if (key in line_of) err(NR, "duplicate key '" key "'; keep one")
  else keys[++n] = key
  line_of[key] = NR; value[key] = trim(val); more[key] = ""; cur = key
  next
}
open && /^[ \t]/ {
  if (cur != "") more[cur] = more[cur] " " trim($0)
  next
}
open {
  if (trim($0) != "" && $0 !~ /^#/ && $0 !~ /^- /) err(NR, "cannot parse this frontmatter line; write key: value")
  next
}
END {
  if (skip) exit
  if (!closed) { err(NR ? NR : 1, "frontmatter never closes; end it with a --- line"); exit }
  if (!("name" in line_of)) err(1, "missing name; add name: " expect)
  else if (field("name") != expect)
    err(line_of["name"], "name '" field("name") "' does not match " noun " '" expect "'; make them identical")
  if (!("description" in line_of)) err(1, "missing description; add one that says what it does and when to use it")
  else if (field("description") == "") err(line_of["description"], "description is empty; say what it does and when to use it")
  check_kind()
}
AWK

IFS= read -r -d '' skill_frontmatter_awk <<'AWK' || true
BEGIN { noun = "folder" }
closed { exit }
function check_kind(   name, i, k) {
  name = field("name")
  if (name == expect && (name !~ /^[a-z0-9]+(-[a-z0-9]+)*$/ || length(name) > 64))
    err(line_of["name"], "name must be lowercase letters, digits, and single hyphens, at most 64 characters; rename the folder and the name")
  for (i = 1; i <= n; i++) {
    k = keys[i]
    if (k != "name" && k != "description" && k != "disable-model-invocation")
      err(line_of[k], "unsupported frontmatter key '" k "'; remove it (allowed: name, description, disable-model-invocation)")
  }
  if ("disable-model-invocation" in line_of) {
    if (field("disable-model-invocation") != "true")
      err(line_of["disable-model-invocation"], "disable-model-invocation must be true; delete the key to allow model invocation")
    else
      print line_of["disable-model-invocation"] > meta
  }
}
AWK

IFS= read -r -d '' agent_frontmatter_awk <<'AWK' || true
BEGIN { noun = "file" }
NR == 1 && /^---[ \t\r]*$/ && $0 != "---" {
  err(1, "write this line as a bare ---, with no trailing space or CRLF line ending; link-skills.sh rejects anything else")
}
open && /^---[ \t\r]*$/ && $0 != "---" {
  err(NR, "close the frontmatter with a bare ---, with no trailing space or CRLF line ending; link-skills.sh does not see this line")
}
open && /^[A-Za-z0-9_-]+[ \t]+:/ {
  spaced = $0; sub(/[ \t]*:.*/, "", spaced)
  err(NR, "write " spaced ": with no space before the colon; link-skills.sh does not read the key otherwise")
}
open && /^[ \t]/ {
  err(NR, "agent frontmatter holds one plain key: value per line; join this indented line onto its key or delete it")
}
closed {
  if ($0 ~ /[^ \t\r]/) body = 1
  if (!quotes && index($0, "'''")) quotes = NR
  next
}
function check_kind(   d, i) {
  if (field("name") == expect && value["name"] != expect)
    err(line_of["name"], "write name: " expect " as a plain unquoted value; link-skills.sh compares it literally")
  if (expect !~ /^[a-z0-9][a-z0-9-]*$/) err(1, "agent file name must be kebab-case; rename it")
  d = value["description"]
  if (field("description") != "" && (d == "" || index(">|\"'[{&*!%@`", substr(d, 1, 1)) || index(d, ": ") || index(d, " #")))
    err(line_of["description"], "description must be a plain single-line value without ': ' or ' #'; unquote and join it")
  for (i = 1; i <= n; i++)
    if (keys[i] != "name" && keys[i] != "description")
      err(line_of[keys[i]], "unsupported agent frontmatter key '" keys[i] "'; the Codex role only carries name and description, so remove it")
  if (!body) err(NR, "body is empty; add the agent's instructions below the frontmatter")
  if (quotes) err(quotes, "body contains ''' which the Codex agent role cannot hold; rephrase it")
}
AWK

: > "$tmp/skills"
: > "$tmp/explicit"
for bucket_dir in skills/*/; do
  [ -d "$bucket_dir" ] || continue
  bucket="$(basename "$bucket_dir")"
  [ "$bucket" = deprecated ] && continue
  echo "$bucket" >> "$tmp/buckets"
  for skill_dir in "$bucket_dir"*/; do
    [ -d "$skill_dir" ] || continue
    echo "$bucket $(basename "$skill_dir")" >> "$tmp/skills"
  done
done
touch "$tmp/buckets"
sort -o "$tmp/skills" "$tmp/skills"
awk '{ print $2 }' "$tmp/skills" > "$tmp/names"

policy_allow_implicit_invocation_off_line() {
  awk '
    /^[^ \t#]/ { inpol = ($0 ~ /^policy:[ \t\r]*(#.*)?$/) }
    inpol && /^[ \t]+allow_implicit_invocation:[ \t]*false[ \t\r]*(#.*)?$/ { print NR; exit }
  ' "$1"
}

while read -r bucket name; do
  dir="skills/$bucket/$name"
  skill_md="$dir/SKILL.md"
  if ! has_file "$dir" SKILL.md; then
    variant=""
    for entry in "$dir"/*; do
      case "${entry##*/}" in
        [Ss][Kk][Ii][Ll][Ll].[Mm][Dd]) variant="$entry" ;;
      esac
    done
    if [ -n "$variant" ]; then
      report "$variant" 1 "rename to SKILL.md; agents only load the uppercase name"
    else
      report "$skill_md" 1 "missing; add SKILL.md with name and description frontmatter, or move $dir to skills/deprecated/"
    fi
    continue
  fi

  : > "$tmp/meta"
  awk -v file="$skill_md" -v expect="$name" -v meta="$tmp/meta" \
    "$skill_frontmatter_awk$frontmatter_awk" "$skill_md" >> "$problems"

  dmi_line="$(cat "$tmp/meta")"
  [ -z "$dmi_line" ] || echo "$bucket $name" >> "$tmp/explicit"
  openai="$dir/agents/openai.yaml"
  off_line=""
  if [ -f "$openai" ]; then
    off_line="$(policy_allow_implicit_invocation_off_line "$openai")"
  fi
  if [ -n "$dmi_line" ] && [ -z "$off_line" ]; then
    if [ -f "$openai" ]; then
      report "$openai" 1 "set policy.allow_implicit_invocation: false to match disable-model-invocation: true in $skill_md"
    else
      report "$skill_md" "$dmi_line" "disable-model-invocation: true needs $openai with policy.allow_implicit_invocation: false for Codex parity; add it"
    fi
  elif [ -z "$dmi_line" ] && [ -n "$off_line" ]; then
    report "$openai" "$off_line" "allow_implicit_invocation: false needs disable-model-invocation: true in $skill_md for Claude Code parity; add it or drop this line"
  fi
done < "$tmp/skills"

awk -v q="'" 'NR == FNR { count[$2]++; next }
  count[$2] > 1 {
    printf "skills/%s/%s/SKILL.md:1: skill name %s%s%s exists in more than one bucket; rename one, since link-skills.sh flattens buckets\n", $1, $2, q, $2, q
  }' "$tmp/skills" "$tmp/skills" >> "$problems"

find skills -name SKILL.md -not -path '*/node_modules/*' -not -path '*/deprecated/*' |
  awk -F/ 'NF != 4 {
    printf "%s:1: SKILL.md outside skills/<bucket>/<name>/; link-skills.sh would install its folder as a skill, so move or rename it\n", $0
  }' >> "$problems"

: > "$tmp/agents"
if [ -d agents ]; then
  for agent in agents/*.md; do
    [ -f "$agent" ] || continue
    base="${agent##*/}"
    [ "$base" = README.md ] || echo "${base%.md}" >> "$tmp/agents"
  done
fi

IFS= read -r -d '' array_scan_awk <<'AWK' || true
function scan(s,   c, i) {
  while (s != "") {
    if (match(s, /^[ \t\r,]+/)) { s = substr(s, RLENGTH + 1); continue }
    c = substr(s, 1, 1)
    if (c == "]") { inarr = 0; return }
    if (c != "\"") { printf "error\t%d\tunexpected %s in the %s array; keep it a flat list of strings\n", NR, c, key; return }
    s = substr(s, 2); i = index(s, "\"")
    if (i == 0) { printf "error\t%d\tunterminated string in the %s array\n", NR, key; return }
    printf "entry\t%d\t%s\n", NR, substr(s, 1, i - 1)
    s = substr(s, i + 1)
  }
}
!found && $0 ~ ("\"" key "\"[ \t]*:") { found = NR; s = $0; sub(".*\"" key "\"[ \t]*:", "", s); want_open = 1 }
NR != found { s = $0 }
want_open {
  sub(/^[ \t\r]*/, "", s)
  if (s == "") next
  want_open = 0
  if (substr(s, 1, 1) != "[") { printf "error\t%d\t%s must be an array of paths\n", NR, key; next }
  inarr = 1; s = substr(s, 2)
}
inarr { scan(s) }
END { printf "key\t%d\n", found }
AWK

check_json_syntax_if_python3_works() {
  local status=0 line msg
  command -v python3 > /dev/null || return 0
  python3 -I -c '
import json, sys
try:
    json.load(open(sys.argv[1], encoding="utf-8"))
except ValueError as e:
    print("%d\t%s" % (getattr(e, "lineno", 1), getattr(e, "msg", str(e))))
    sys.exit(3)
' "$1" > "$tmp/json" 2> /dev/null || status=$?
  [ "$status" = 3 ] || return 0
  IFS="$(printf '\t')" read -r line msg < "$tmp/json" || true
  report "$1" "${line:-1}" "not valid JSON ($msg); fix it, since plugin and npx skills installs parse this file"
}

plugin=".claude-plugin/plugin.json"
awk '{ print "./skills/" $1 "/" $2 }' "$tmp/skills" > "$tmp/expected"
if [ ! -f "$plugin" ]; then
  report "$plugin" 1 "missing; add it with a skills array listing ./skills/<bucket>/<name> for every active skill"
else
  check_json_syntax_if_python3_works "$plugin"

  awk -v key=skills "$array_scan_awk" "$plugin" > "$tmp/plugin"

  awk -v plugin="$plugin" '
    function err(line, msg) { printf "%s:%d: %s\n", plugin, line, msg }
    FILENAME == ARGV[1] { want[$0] = 1; order[++n] = $0; next }
    {
      split($0, f, "\t")
      if (f[1] == "key") { keyline = f[2] + 0; next }
      if (f[1] == "error") { err(f[2], f[3]); next }
      v = f[3]
      if (v in seen) { err(f[2], "lists " v " twice; remove the duplicate"); next }
      seen[v] = 1
      if (v in want) next
      norm = v; sub(/^\.\//, "", norm); sub(/\/+$/, "", norm); norm = "./" norm
      if (norm ~ /^\.\/skills\/deprecated\//) err(f[2], v " is deprecated; remove it from the skills array")
      else if (norm in want) { err(f[2], "write " v " as " norm); seen[norm] = 1 }
      else err(f[2], "no active skill at " v "; remove the entry or restore the skill")
    }
    END {
      if (!keyline) { err(1, "no skills array; add one listing ./skills/<bucket>/<name> for every active skill"); exit }
      for (i = 1; i <= n; i++) if (!(order[i] in seen)) err(keyline, "missing " order[i] "; add it to the skills array")
    }
  ' "$tmp/expected" "$tmp/plugin" >> "$problems"

  # The agents array replaces the plugin's default agents/ scan, so it must
  # list exactly the agents in agents/.
  awk -v key=agents "$array_scan_awk" "$plugin" > "$tmp/plugin-agents"
  awk -v plugin="$plugin" '
    function err(line, msg) { printf "%s:%d: %s\n", plugin, line, msg }
    FILENAME == ARGV[1] { v = "./agents/" $0 ".md"; want[v] = 1; order[++n] = v; next }
    {
      split($0, f, "\t")
      if (f[1] == "key") { keyline = f[2] + 0; next }
      if (f[1] == "error") { err(f[2], f[3]); next }
      v = f[3]
      if (v in seen) { err(f[2], "lists " v " twice; remove the duplicate"); next }
      seen[v] = 1
      if (!(v in want)) err(f[2], "no agent at " v "; list agents as ./agents/<name>.md for a file in agents/, or remove the entry")
    }
    END {
      if (!keyline) { if (n) err(1, "no agents array; add one listing ./agents/<name>.md for every agent"); exit }
      for (i = 1; i <= n; i++) if (!(order[i] in seen)) err(keyline, "missing " order[i] "; add it to the agents array")
    }
  ' "$tmp/agents" "$tmp/plugin-agents" >> "$problems"
fi

while read -r bucket; do
  readme="skills/$bucket/README.md"
  if ! has_file "skills/$bucket" README.md; then
    report "$readme" 1 "missing; add a README linking each skill as [name](name/SKILL.md)"
    continue
  fi
  awk -v readme="$readme" -v bucket="$bucket" '
    function err(line, msg) { printf "%s:%d: %s\n", readme, line, msg }
    FILENAME == ARGV[1] { if ($1 == bucket) { skill[$2] = 1; order[++n] = $2 }; next }
    {
      last = FNR; line = $0
      while (match(line, /\]\([^)]*\)/)) {
        target = substr(line, RSTART + 2, RLENGTH - 3)
        before = substr(line, 1, RSTART - 1)
        line = substr(line, RSTART + RLENGTH)
        i = length(before); while (i > 0 && substr(before, i, 1) != "[") i--
        text = substr(before, i + 1)
        sub(/^\.\//, "", target)
        if (target !~ /^[^\/]+\/SKILL\.md$/) continue
        dir = target; sub(/\/SKILL\.md$/, "", dir)
        if (!(dir in skill)) { err(FNR, "links " dir ", which is not an active skill in skills/" bucket "; remove the entry or fix the path"); continue }
        linked[dir] = 1
        if (text != dir) err(FNR, "write the entry as [" dir "](" dir "/SKILL.md)")
      }
    }
    END {
      for (i = 1; i <= n; i++)
        if (!(order[i] in linked)) err(last ? last : 1, "missing entry for " order[i] "; add - [" order[i] "](" order[i] "/SKILL.md) with a one-line summary")
    }
  ' "$tmp/skills" "$readme" >> "$problems"
done < "$tmp/buckets"

# Relative links resolve against a listing of the tree, not the file system, so
# a case mismatch fails here on macOS the same way it fails on Linux.
find . \( -name .git -o -name node_modules \) -prune -o -print | sed 's|^\./||' > "$tmp/paths"
{
  find . -maxdepth 1 -type f -name '*.md'
  find skills -type f -name '*.md' -not -path '*/node_modules/*'
  if [ -d agents ]; then find agents -type f -name '*.md'; fi
} | sed 's|^\./||' | awk -F/ '!($1 == "skills" && $2 == "deprecated" && NF > 3)' | sort > "$tmp/md"

IFS= read -r -d '' links_awk <<'AWK' || true
function err(line, msg) { printf "%s:%d: %s\n", FILENAME, line, msg }
function trim(s) { sub(/^[ \t]+/, "", s); sub(/[ \t\r]+$/, "", s); return s }
function placeholder(t) { return t ~ /[<>{}]/ || t ~ /^[A-Z][A-Z0-9]*_[A-Z0-9_]*$/ }
function check(t,   n, parts, i, m, p, norm) {
  t = trim(t)
  if (substr(t, 1, 1) == "<") { t = substr(t, 2); sub(/>.*/, "", t) }
  else sub(/[ \t].*/, "", t)
  if (t == "" || t ~ /^#/ || t ~ /^[A-Za-z][A-Za-z0-9+.-]*:/) return
  if (placeholder(t)) return
  sub(/[#?].*/, "", t)
  gsub(/%20/, " ", t)
  if (t ~ /^[\/~]/) { err(FNR, "link '" t "' is absolute; make it relative to this file"); return }
  n = split((dir == "") ? t : (dir "/" t), parts, "/")
  m = 0
  for (i = 1; i <= n; i++) {
    p = parts[i]
    if (p == "" || p == ".") continue
    if (p != "..") { out[++m] = p; continue }
    if (m == 0) { err(FNR, "link '" t "' leaves the repo; link a file inside it"); return }
    m--
  }
  norm = m ? out[1] : "."
  for (i = 2; i <= m; i++) norm = norm "/" out[i]
  if (!(norm in have)) { err(FNR, "broken link '" t "'; fix the path or create " norm); return }
  if (norm ~ /^skills\/deprecated\// && (readme || !deprecated_src))
    err(FNR, "links deprecated " norm "; link an active skill or drop the link")
}
FILENAME == ARGV[1] { have[$0] = 1; next }
FNR == 1 {
  fence = ""
  dir = FILENAME
  if (!sub(/\/[^\/]*$/, "", dir)) dir = ""
  readme = (FILENAME == "README.md" || FILENAME ~ /\/README\.md$/)
  deprecated_src = (FILENAME ~ /^skills\/deprecated\//)
}
{
  line = $0
  s = line; sub(/^[ \t]*/, "", s)
  c = substr(s, 1, 1)
  if ((c == "`" || c == "~") && substr(s, 1, 3) == (c c c)) {
    k = 1; while (substr(s, k + 1, 1) == c) k++
    if (fence == "") { fence = c; flen = k }
    else if (c == fence && k >= flen && trim(substr(s, k + 1)) == "") fence = ""
    next
  }
  if (fence != "") next
  gsub(/``[^`]*``/, "", line)
  gsub(/`[^`]*`/, "", line)
  while (match(line, /\]\([^)]*\)/)) {
    t = substr(line, RSTART + 2, RLENGTH - 3)
    line = substr(line, RSTART + RLENGTH)
    check(t)
  }
}
AWK
tr '\n' '\0' < "$tmp/md" | xargs -0 awk "$links_awk" "$tmp/paths" >> "$problems"

IFS= read -r -d '' unlinked_explicit_skill_mention_awk <<'AWK' || true
function trim(s) { sub(/^[ \t]+/, "", s); sub(/[ \t\r]+$/, "", s); return s }
function named(s, nm) { return index(s, "`" nm "`") || index(s, "`/" nm "`") || index(s, "`$" nm "`") }
function links_to(t, nm,   suf) {
  t = trim(t)
  if (substr(t, 1, 1) == "<") { t = substr(t, 2); sub(/>.*/, "", t) }
  else sub(/[ \t].*/, "", t)
  sub(/[#?].*/, "", t)
  suf = nm "/SKILL.md"
  return t == suf || (length(t) > length(suf) && substr(t, length(t) - length(suf)) == "/" suf)
}
function without_links_to(line, nm,   rest, o) {
  rest = ""
  while (match(line, /\]\([^)]*\)/)) {
    o = RSTART; while (o > 1 && substr(line, o, 1) != "[") o--
    if (links_to(substr(line, RSTART + 2, RLENGTH - 3), nm)) rest = rest substr(line, 1, o - 1) " "
    else rest = rest substr(line, 1, RSTART + RLENGTH - 1)
    line = substr(line, RSTART + RLENGTH)
  }
  return rest line
}
FILENAME == ARGV[1] { names[++nn] = $2; next }
FNR == 1 {
  fence = ""
  split(FILENAME, fp, "/")
  own = (fp[1] == "skills") ? fp[3] : ""
}
{
  s = $0; sub(/^[ \t]*/, "", s)
  c = substr(s, 1, 1)
  if ((c == "`" || c == "~") && substr(s, 1, 3) == (c c c)) {
    k = 1; while (substr(s, k + 1, 1) == c) k++
    if (fence == "") { fence = c; flen = k }
    else if (c == fence && k >= flen && trim(substr(s, k + 1)) == "") fence = ""
    next
  }
  if (fence != "") next
  for (i = 1; i <= nn; i++) {
    nm = names[i]
    if (nm == own || !named($0, nm)) continue
    if (named(without_links_to($0, nm), nm))
      printf "%s:%d: names explicit-only skill %s by bare name, which never loads it; make the mention a link to its SKILL.md\n", FILENAME, FNR, nm
  }
}
AWK
{ grep -E '^(skills|agents)/' "$tmp/md" || true; } | tr '\n' '\0' |
  xargs -0 awk "$unlinked_explicit_skill_mention_awk" "$tmp/explicit" >> "$problems"

while read -r name; do
  awk -v file="agents/$name.md" -v expect="$name" \
    "$agent_frontmatter_awk$frontmatter_awk" "agents/$name.md" >> "$problems"
done < "$tmp/agents"

resolve_dir() {
  (cd -P "$1" 2>/dev/null && pwd -P) || true
}

is_skill_dir_in_any_checkout() {
  local root="${1%/skills/*/*}" rest
  [ "$root" != "$1" ] || return 1
  rest="${1#"$root"/skills/}"
  case "$rest" in
    */*/*) return 1 ;;
  esac
  is_checkout "$root"
}

is_checkout() {
  [ -f "$1/scripts/link-skills.sh" ] && [ -d "$1/.claude-plugin" ]
}

resolve_link_once() {
  local t dir
  t="$(readlink "$1")"
  case "$t" in
    /*) ;;
    *) t="${1%/*}/$t" ;;
  esac
  dir="$(resolve_dir "${t%/*}")"
  printf '%s/%s\n' "${dir:-${t%/*}}" "${t##*/}"
}

check_install_dir() {
  local label="$1" dest="$2" bucket name entry resolved
  if [ ! -d "$dest" ]; then
    report "$dest" 1 "missing $label skills directory; run scripts/link-skills.sh"
    return
  fi

  while read -r bucket name; do
    entry="$dest/$name"
    if [ -L "$entry" ] && [ ! -e "$entry" ]; then
      report "$entry" 1 "dangling link to $(readlink "$entry"); remove it and run scripts/link-skills.sh"
    elif [ -L "$entry" ]; then
      resolved="$(resolve_dir "$entry")"
      case "$resolved" in
        */skills/"$bucket"/"$name") [ -f "$resolved/SKILL.md" ] && continue ;;
      esac
      report "$entry" 1 "links to ${resolved:-$(readlink "$entry")}, not skills/$bucket/$name in a checkout of this repo; remove it and run scripts/link-skills.sh"
    elif [ -e "$entry" ]; then
      report "$entry" 1 "is a copy, not a link into this repo, so it shadows the repo version; remove it and run scripts/link-skills.sh"
    else
      report "$entry" 1 "$name is not installed for $label; run scripts/link-skills.sh"
    fi
  done < "$tmp/skills"

  for entry in "$dest"/*; do
    [ -L "$entry" ] || continue
    name="${entry##*/}"
    grep -qxF "$name" "$tmp/names" && continue
    if [ ! -e "$entry" ]; then
      report "$entry" 1 "dangling link to $(readlink "$entry"); remove it"
      continue
    fi
    resolved="$(resolve_dir "$entry")"
    if [ -n "$resolved" ] && is_skill_dir_in_any_checkout "$resolved"; then
      report "$entry" 1 "links to $resolved, but $name is not an active skill in this repo; remove it"
    fi
  done
}

check_install_claude_agents() {
  local dest="$1" name entry resolved
  if [ ! -d "$dest" ]; then
    [ ! -s "$tmp/agents" ] || report "$dest" 1 "missing Claude Code agents directory; run scripts/link-skills.sh"
    return
  fi

  while read -r name; do
    entry="$dest/$name.md"
    if [ -L "$entry" ] && [ ! -e "$entry" ]; then
      report "$entry" 1 "dangling link to $(readlink "$entry"); remove it and run scripts/link-skills.sh"
    elif [ -L "$entry" ]; then
      resolved="$(resolve_link_once "$entry")"
      case "$resolved" in
        */agents/"$name".md) is_checkout "${resolved%/agents/*}" && continue ;;
      esac
      report "$entry" 1 "links to $resolved, not agents/$name.md in a checkout of this repo; remove it and run scripts/link-skills.sh"
    elif [ -e "$entry" ]; then
      report "$entry" 1 "is a copy, not a link into this repo, so it shadows the repo agent; remove it and run scripts/link-skills.sh"
    else
      report "$entry" 1 "$name is not installed for Claude Code; run scripts/link-skills.sh"
    fi
  done < "$tmp/agents"

  for entry in "$dest"/*.md; do
    [ -L "$entry" ] || continue
    name="${entry##*/}"
    name="${name%.md}"
    grep -qxF "$name" "$tmp/agents" && continue
    if [ ! -e "$entry" ]; then
      report "$entry" 1 "dangling link to $(readlink "$entry"); remove it"
      continue
    fi
    resolved="$(resolve_link_once "$entry")"
    case "$resolved" in
      */agents/"$name".md)
        if is_checkout "${resolved%/agents/*}"; then
          report "$entry" 1 "links to $resolved, but $name is not an agent in this repo; remove it"
        fi
        ;;
    esac
  done
}

codex_marker="# Generated by Pixxle/skills scripts/link-skills.sh from "
codex_source() {
  local first=""
  [ -f "$1" ] && [ ! -L "$1" ] || return 1
  IFS= read -r first < "$1" || [ -n "$first" ] || return 1
  case "$first" in
    "$codex_marker"*) printf '%s\n' "${first#"$codex_marker"}" ;;
    *) return 1 ;;
  esac
}

check_install_codex_agents() {
  local dest="$1" name entry src
  if [ ! -d "$dest" ]; then
    [ ! -s "$tmp/agents" ] || report "$dest" 1 "missing Codex agents directory; run scripts/link-skills.sh"
    return
  fi

  while read -r name; do
    entry="$dest/$name.toml"
    if [ ! -e "$entry" ] && [ ! -L "$entry" ]; then
      report "$entry" 1 "$name is not installed for Codex; run scripts/link-skills.sh"
    elif ! src="$(codex_source "$entry")"; then
      report "$entry" 1 "was not generated by scripts/link-skills.sh, so it shadows the repo agent; remove it and run scripts/link-skills.sh"
    elif [ ! -f "$src" ]; then
      report "$entry" 1 "was generated from $src, which no longer exists; run scripts/link-skills.sh"
    else
      case "$src" in
        */agents/"$name".md) ;;
        *) report "$entry" 1 "was generated from $src, not agents/$name.md; remove it and run scripts/link-skills.sh" ;;
      esac
    fi
  done < "$tmp/agents"

  for entry in "$dest"/*.toml; do
    name="${entry##*/}"
    name="${name%.toml}"
    grep -qxF "$name" "$tmp/agents" && continue
    src="$(codex_source "$entry")" || continue
    if [ ! -f "$src" ]; then
      report "$entry" 1 "was generated from $src, which no longer exists, and Codex still loads it; remove it"
    else
      report "$entry" 1 "was generated from $src, but $name is not an agent in this repo; remove it"
    fi
  done
}

if [ "$installed" = 1 ]; then
  codex_root="${CODEX_HOME:-${HOME}/.codex}"
  agents_dest="${AGENTS_SKILLS_DIR:-${HOME}/.agents/skills}"
  if [ "$runtime" != codex ]; then
    check_install_dir "Claude Code" "${CLAUDE_SKILLS_DIR:-${HOME}/.claude/skills}"
    check_install_claude_agents "${CLAUDE_AGENTS_DIR:-${HOME}/.claude/agents}"
  fi
  if [ "$runtime" != claude ]; then
    check_install_dir "Codex" "${CODEX_SKILLS_DIR:-${codex_root}/skills}"
    check_install_codex_agents "${CODEX_AGENTS_DIR:-${codex_root}/agents}"
    while read -r name; do
      entry="$agents_dest/$name"
      if [ -e "$entry" ] || [ -L "$entry" ]; then
        report "$entry" 1 "same name as the repo skill $name; Codex also loads $agents_dest, so this copy shadows or duplicates it; remove it"
      fi
    done < "$tmp/names"
  fi
fi

if [ -s "$problems" ]; then
  sort -t: -k1,1 -k2,2n -k3 "$problems" | uniq
  echo "check-skills: $(sort -u "$problems" | wc -l | tr -d ' ') problem(s)" >&2
  exit 1
fi
echo "check-skills: ok, $(wc -l < "$tmp/skills" | tr -d ' ') active skills" >&2
