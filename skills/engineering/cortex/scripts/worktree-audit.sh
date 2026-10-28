#!/usr/bin/env bash
# Read-only worktree prune audit. Classifies every git worktree by size, merge
# state, uncommitted work, remote/PR state, and the most recent Claude Code or
# Codex chat that operated in it. Emits a table sorted by size with a suggested
# bucket. Never deletes anything; deletion stays a human-gated step in the
# playbook.
#
# Usage: worktree-audit.sh [-b|--base <ref>] [repo-path]
#   repo-path defaults to the current repo.
#   -b sets the ref the MERGED column checks against (e.g. origin/integration).
#   Without it the base is origin/HEAD, then origin/main, then origin/master.
#   origin/HEAD is the remote's default branch, not necessarily the branch PRs
#   merge into; pass -b when they differ.
#
# Chats: Claude Code transcripts under ${CLAUDE_CONFIG_DIR:-~/.claude}/projects
# for each worktree of this repo, and Codex sessions under
# ${CODEX_HOME:-~/.codex}/sessions. The scan is slow on a long history, so run
# the audit in the background.
set -u

base=""
while [ $# -gt 0 ]; do
	case "$1" in
	-b|--base) [ $# -ge 2 ] || { echo "error: $1 needs a ref" >&2; exit 2; }; base="$2"; shift 2 ;;
	-h|--help) sed -n '2,/^set -u/p' "$0" | sed '$d; s/^# \{0,1\}//'; exit 0 ;;
	-*) echo "error: unknown option: $1" >&2; exit 2 ;;
	*) break ;;
	esac
done

repo="${1:-$(git rev-parse --show-toplevel 2>/dev/null)}"
[ -z "$repo" ] && { echo "not in a git repo; pass a repo path" >&2; exit 1; }
cd "$repo" || exit 1
git rev-parse --git-dir >/dev/null 2>&1 || { echo "error: not a git repo: $repo" >&2; exit 1; }

worktrees=$(git worktree list --porcelain | sed -n 's/^worktree //p')
main_wt=$(printf '%s\n' "$worktrees" | head -1)

if [ -z "$base" ]; then
	for cand in "$(git symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null)" origin/main origin/master; do
		[ -n "$cand" ] && git rev-parse --verify --quiet "$cand^{commit}" >/dev/null && { base="$cand"; break; }
	done
	[ -z "$base" ] && { echo "error: no base ref (origin/HEAD, origin/main, origin/master all missing); pass -b <ref>" >&2; exit 1; }
	echo "warn: no -b given; MERGED checks against $base" >&2
fi

# The explicit refspec creates refs/remotes/$base even in a single-branch clone.
case "$base" in
origin/*) git fetch origin "+refs/heads/${base#origin/}:refs/remotes/$base" --quiet 2>/dev/null \
	|| echo "warn: could not fetch $base; merged column may be stale" >&2 ;;
esac
git rev-parse --verify --quiet "$base^{commit}" >/dev/null 2>&1 || { echo "error: base ref not found: $base" >&2; exit 1; }

# GNU coreutils (Linux, Homebrew gnubin) reads `stat -f` as file system status
# and `date -r` as a file, so pick the stat and date flags once.
if stat -c %Y / >/dev/null 2>&1; then
	stat_fmt=(-c '%Y %n'); fmt_day() { date -d "@$1" '+%Y-%m-%d'; }
else
	stat_fmt=(-f '%m %N'); fmt_day() { date -r "$1" '+%Y-%m-%d'; }
fi

prs=$(mktemp)
trap 'rm -f "$prs"' EXIT
if command -v origin >/dev/null 2>&1 \
	&& raw=$(origin pr list --author "@me" --state all --limit 1000 \
		--json number,status,headRef 2>/dev/null); then
	printf '%s' "$raw" | jq '[.[] | {number, state: .status, head: .headRef}]' > "$prs" 2>/dev/null
elif raw=$(gh pr list --author "@me" --state all --limit 1000 \
	--json number,state,headRefName 2>/dev/null); then
	printf '%s' "$raw" | jq '[.[] | {number, state: (.state | ascii_downcase), head: .headRefName}]' > "$prs" 2>/dev/null
fi
[ -s "$prs" ] || echo "[]" > "$prs"

# Claude Code files each session under projects/<slug>, where the slug is the
# session's cwd with every character other than a letter or digit changed to
# "-". A session started in a worktree gets that worktree's slug, so scan the
# slug of every worktree of this repo, main included. A slug past 200
# characters is cut and given a hash suffix, hence the prefix glob. Codex files
# sessions by date and records the cwd inside each file, so scan them all.
claude_projects="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/projects"
claude_dirs=()
while IFS= read -r p; do
	[ -n "$p" ] || continue
	slug=$(printf '%s' "$p" | sed 's/[^A-Za-z0-9]/-/g')
	if [ -d "$claude_projects/$slug" ]; then claude_dirs+=("$claude_projects/$slug")
	elif [ ${#slug} -gt 200 ]; then
		for d in "$claude_projects/${slug:0:200}"-*; do [ -d "$d" ] && claude_dirs+=("$d"); done
	fi
done <<EOF
$worktrees
EOF
codex_sessions="${CODEX_HOME:-$HOME/.codex}/sessions"
codex_dirs=()
[ -d "$codex_sessions" ] && codex_dirs=("$codex_sessions")

newest_chat() {
	local wt=$1 runtime=$2
	local as_dir="$wt/" as_json_value="$wt\""
	shift 2
	[ $# -gt 0 ] || return 0
	if command -v rg >/dev/null 2>&1; then
		rg --files-with-matches --null -uu -F -g '*.jsonl' -e "$as_dir" -e "$as_json_value" -- "$@" 2>/dev/null
	else
		grep -rlF --null --include='*.jsonl' -e "$as_dir" -e "$as_json_value" -- "$@" 2>/dev/null
	fi | xargs -0 stat "${stat_fmt[@]}" 2>/dev/null | sort -rn | head -1 \
		| awk -v r="$runtime" 'NF {print $1, r}'
}

now=$(date +%s)

echo "# base: $base"
echo "# chats: ${#claude_dirs[@]} Claude Code project dir(s), Codex sessions $([ ${#codex_dirs[@]} -gt 0 ] && echo "at $codex_sessions" || echo "not found")"
printf "SIZE\tAGE\tMERGED\tDIRTY\tREMOTE\tPR\tLAST_CHAT\tBUCKET\tWORKTREE\n"

printf '%s\n' "$worktrees" | while IFS= read -r wt; do
	[ -z "$wt" ] || [ "$wt" = "$main_wt" ] && continue

	if [ ! -d "$wt" ]; then
		printf "%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n" - - - - - - - missing "$wt"
		continue
	fi

	size=$(du -sh "$wt" 2>/dev/null | awk '{print $1}')
	head=$(git -C "$wt" rev-parse HEAD 2>/dev/null)
	head_ts=$(git -C "$wt" log -1 --format='%ct' HEAD 2>/dev/null || echo 0)
	age=$([ "$head_ts" -gt 0 ] 2>/dev/null && echo "$(( (now - head_ts) / 86400 ))d" || echo "?")

	git merge-base --is-ancestor "$head" "$base" 2>/dev/null && in_base=YES || in_base=no

	porcelain=$(git -C "$wt" status --porcelain 2>/dev/null)
	if [ -z "$porcelain" ]; then dirty=clean
	elif printf '%s\n' "$porcelain" | grep -qv '^??'; then
		dirty="wip:$(printf '%s\n' "$porcelain" | grep -cv '^??')"
	else dirty="scratch:$(printf '%s\n' "$porcelain" | grep -c '^??')"; fi

	branch=$(git -C "$wt" symbolic-ref --quiet --short HEAD 2>/dev/null || echo "")
	if [ -z "$branch" ]; then remote=detached
	elif git -C "$wt" show-ref --verify --quiet "refs/remotes/origin/$branch"; then
		[ "$(git -C "$wt" rev-parse "origin/$branch" 2>/dev/null)" = "$head" ] \
			&& remote=pushed \
			|| remote="ahead$(git -C "$wt" rev-list --count "origin/$branch..HEAD" 2>/dev/null)"
	else remote=no-remote; fi

	pr=$([ -n "$branch" ] && jq -r --arg b "$branch" \
		'.[] | select(.head==$b) | "#\(.number)/\(.state)"' "$prs" 2>/dev/null | head -1)
	[ -z "$pr" ] && pr="-"

	last_chat="-"; last_chat_ts=0
	for hit in "$(newest_chat "$wt" claude ${claude_dirs[@]+"${claude_dirs[@]}"})" \
		"$(newest_chat "$wt" codex ${codex_dirs[@]+"${codex_dirs[@]}"})"; do
		[ -n "$hit" ] || continue
		ts=${hit%% *}
		[ "$ts" -gt "$last_chat_ts" ] 2>/dev/null || continue
		last_chat_ts=$ts
		last_chat="$(fmt_day "$ts" 2>/dev/null) ${hit#* }"
	done
	recent=$([ "$last_chat_ts" -gt 0 ] && [ $(( (now - last_chat_ts) / 86400 )) -le 4 ] && echo yes || echo no)

	case "$dirty" in wip:*) bucket=hold-wip ;; *)
		case "$pr" in */open|*/draft) bucket=hold-open-pr ;; *)
			if [ "$recent" = yes ]; then bucket=verify-recent-chat
			elif [ "$in_base" = YES ] || [ "$pr" != "-" ]; then bucket=safe
			else bucket=review; fi ;;
		esac ;;
	esac

	printf "%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n" \
		"$size" "$age" "$in_base" "$dirty" "$remote" "$pr" "$last_chat" "$bucket" "$wt"
done | sort -t$'\t' -k1,1 -rh
