import {
	accessSync,
	chmodSync,
	constants,
	mkdirSync,
	mkdtempSync,
	readdirSync,
	realpathSync,
	rmSync,
	statSync,
	symlinkSync,
	utimesSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { delimiter, dirname, join, relative } from "node:path";
import { spawnSync } from "node:child_process";
import assert from "node:assert/strict";
import { after, before, describe, test } from "node:test";

const script = join(import.meta.dirname, "worktree-audit.sh");
const tools = ["bash", "git", "sed", "head", "date", "stat", "mktemp", "rm", "du", "awk", "grep", "sort", "xargs"];

function which(name) {
	for (const dir of (process.env.PATH ?? "").split(delimiter)) {
		if (!dir) continue;
		const candidate = join(dir, name);
		try {
			accessSync(candidate, constants.X_OK);
			if (statSync(candidate).isFile()) return candidate;
		} catch {}
	}
	return null;
}

const missingTools = tools.filter((name) => !which(name));
const rgPath = which("rg");
const noJq = which("jq") ? false : "jq not on PATH";

const root = realpathSync(mkdtempSync(join(tmpdir(), "wtaudit-")));
const home = join(root, "home");
const codexHome = join(root, "codex");
const fakeBin = join(root, "bin");
const originRepo = join(root, "origin.git");
const repo = join(root, "repo");
const wts = join(root, "wts");
const longName = "l".repeat(200);

const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith("GIT_")));
delete env.CLAUDE_CONFIG_DIR;
Object.assign(env, {
	HOME: home,
	CODEX_HOME: codexHome,
	GIT_CONFIG_GLOBAL: join(root, "gitconfig"),
	GIT_CONFIG_NOSYSTEM: "1",
});

function git(cwd, ...args) {
	const result = spawnSync("git", args, { cwd, env, encoding: "utf8" });
	assert.equal(result.status, 0, `git ${args.join(" ")} failed: ${result.stderr}`);
	return result.stdout;
}

const slug = (path) => path.replace(/[^A-Za-z0-9]/g, "-");

function writeFile(path, content) {
	mkdirSync(dirname(path), { recursive: true });
	writeFileSync(path, content);
}

function today() {
	const d = new Date();
	const pad = (n) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function restrictedPath(name, withRg) {
	const dir = join(root, name);
	mkdirSync(dir);
	const linked = [...tools, ...(noJq ? [] : ["jq"]), ...(withRg ? ["rg"] : [])];
	for (const tool of linked) symlinkSync(which(tool), join(dir, tool));
	return `${fakeBin}${delimiter}${dir}`;
}

function audit(path, ...args) {
	return spawnSync(script, args, { env: { ...env, PATH: path }, encoding: "utf8" });
}

function snapshot() {
	const files = [];
	const walk = (dir) => {
		for (const entry of readdirSync(dir, { withFileTypes: true })) {
			const full = join(dir, entry.name);
			if (entry.isDirectory()) {
				files.push(`${relative(wts, full)}/`);
				walk(full);
			} else {
				const { size, mtimeMs } = statSync(full);
				files.push(`${relative(wts, full)} ${size} ${mtimeMs}`);
			}
		}
	};
	walk(wts);
	return { worktrees: git(repo, "worktree", "list", "--porcelain"), refs: git(repo, "for-each-ref"), files };
}

function buildFixture() {
	mkdirSync(home, { recursive: true });
	mkdirSync(join(codexHome, "sessions", "2026", "10", "28"), { recursive: true });
	mkdirSync(fakeBin);
	writeFileSync(
		env.GIT_CONFIG_GLOBAL,
		"[user]\n\temail = t@example.com\n\tname = t\n[init]\n\tdefaultBranch = main\n[commit]\n\tgpgsign = false\n",
	);

	git(root, "init", "-q", "--bare", originRepo);
	git(root, "clone", "-q", originRepo, repo);
	git(repo, "commit", "-q", "--allow-empty", "-m", "init");
	git(repo, "push", "-q", "origin", "main");
	git(repo, "remote", "set-head", "origin", "main");

	const mk = (name) => {
		git(repo, "worktree", "add", "-q", "-b", name, join(wts, name), "main");
		git(join(wts, name), "commit", "-q", "--allow-empty", "-m", name);
	};
	mk("merged");
	git(repo, "merge", "-q", "--ff-only", "merged");
	git(repo, "push", "-q", "origin", "main");
	mk("wip");
	writeFileSync(join(wts, "wip", "f"), "x\n");
	git(join(wts, "wip"), "add", "f");
	git(join(wts, "wip"), "commit", "-q", "-m", "f");
	writeFileSync(join(wts, "wip", "f"), "y\n");
	mk("scratch");
	writeFileSync(join(wts, "scratch", "junk"), "x\n");
	for (const name of ["claude", "codex", "oldchat", "wt-a", "wt-a-r37", "openpr", "squashed"]) mk(name);
	git(repo, "worktree", "add", "-q", "-b", "spaced", join(wts, "with space"), "main");
	git(join(wts, "with space"), "commit", "-q", "--allow-empty", "-m", "spaced");
	git(repo, "worktree", "add", "-q", "--detach", join(wts, "detached"), "main");
	mk("gone");
	rmSync(join(wts, "gone"), { recursive: true });
	mk(longName);

	const projects = join(home, ".claude", "projects");
	writeFile(
		join(projects, slug(join(wts, "claude")), "sess", "subagents", "agent-1.jsonl"),
		`${JSON.stringify({ cwd: join(wts, "claude") })}\n`,
	);
	writeFile(join(projects, slug(repo), "s1.jsonl"), `${JSON.stringify({ file_path: join(wts, "wt-a-r37", "x.ts") })}\n`);
	const old = join(projects, slug(repo), "s2.jsonl");
	writeFile(old, `${JSON.stringify({ file_path: join(wts, "oldchat", "y.ts") })}\n`);
	const tenDaysAgo = new Date(Date.now() - 10 * 86400 * 1000);
	utimesSync(old, tenDaysAgo, tenDaysAgo);
	writeFile(
		join(projects, `${slug(join(wts, longName)).slice(0, 200)}-1a2b3c`, "s.jsonl"),
		`${JSON.stringify({ cwd: join(wts, longName) })}\n`,
	);
	writeFile(join(projects, "-unrelated", "s.jsonl"), `${JSON.stringify({ cwd: join(wts, "scratch") })}\n`);
	const day = join(codexHome, "sessions", "2026", "10", "28");
	writeFile(join(day, "rollout-1.jsonl"), `${JSON.stringify({ type: "session_meta", payload: { cwd: join(wts, "codex") } })}\n`);
	writeFile(join(day, "rollout-2.jsonl"), `${JSON.stringify({ type: "session_meta", payload: { cwd: join(wts, "with space") } })}\n`);

	const origin = join(fakeBin, "origin");
	writeFileSync(
		origin,
		`#!/bin/sh\necho '[{"number":7,"status":"open","headRef":"openpr"},{"number":8,"status":"merged","headRef":"squashed"}]'\n`,
	);
	chmodSync(origin, 0o755);
}

const skipAll = missingTools.length > 0 ? `missing tools: ${missingTools.join(", ")}` : false;
if (!skipAll) buildFixture();
const fixtureState = skipAll ? null : snapshot();
after(() => rmSync(root, { recursive: true, force: true }));

const day = today();
const columns = { size: 0, age: 1, merged: 2, dirty: 3, remote: 4, pr: 5, chat: 6, bucket: 7, worktree: 8 };
const rowCases = [
	["merged branch is safe", "merged", "bucket", "safe"],
	["merged branch shows MERGED", "merged", "merged", "YES"],
	["tracked edits hold the worktree", "wip", "bucket", "hold-wip"],
	["tracked edits are counted", "wip", "dirty", "wip:1"],
	["untracked scratch needs review", "scratch", "bucket", "review"],
	["untracked scratch is counted", "scratch", "dirty", "scratch:1"],
	["an unrelated project dir is not scanned", "scratch", "chat", "-"],
	["a recent Claude Code chat needs verifying", "claude", "bucket", "verify-recent-chat"],
	["a nested Claude Code subagent transcript counts", "claude", "chat", `${day} claude`],
	["a recent Codex chat needs verifying", "codex", "bucket", "verify-recent-chat"],
	["a Codex session names its runtime", "codex", "chat", `${day} codex`],
	["a chat older than four days needs review", "oldchat", "bucket", "review"],
	["an old chat still names its runtime", "oldchat", "chat", / claude$/],
	["a path prefix does not match a longer name", "wt-a", "chat", "-"],
	["a file edit from the main repo's chat counts", "wt-a-r37", "bucket", "verify-recent-chat"],
	["an open PR holds the worktree", "openpr", "bucket", "hold-open-pr", noJq],
	["the PR column shows number and state", "openpr", "pr", "#7/open", noJq],
	["a squash-merged PR is safe", "squashed", "bucket", "safe", noJq],
	["the squash-merged PR state is shown", "squashed", "pr", "#8/merged", noJq],
	["a path with a space matches", "with space", "bucket", "verify-recent-chat"],
	["a detached head has no remote", "detached", "remote", "detached"],
	["a slug past 200 characters matches its hashed dir", longName, "chat", `${day} claude`],
	["a deleted worktree dir is missing", "gone", "bucket", "missing"],
];

const passes = [
	{ label: "with rg", withRg: true, skip: skipAll || (rgPath ? false : "rg not on PATH") },
	{ label: "grep fallback", withRg: false, skip: skipAll },
];

for (const pass of passes) {
	describe(pass.label, { skip: pass.skip }, () => {
		let result;
		let rows;
		before(() => {
			result = audit(restrictedPath(pass.withRg ? "tools-rg" : "tools-grep", pass.withRg), repo);
			rows = result.stdout.split("\n").filter((line) => line && !line.startsWith("#")).map((line) => line.split("\t"));
		});
		const cell = (name, column) => {
			const row = rows.find((r) => r[columns.worktree] === join(wts, name));
			assert.ok(row, `no row for ${name}`);
			return row[columns[column]];
		};

		test("exits 0", () => assert.equal(result.status, 0, result.stderr));
		test("prints the base header first", () => assert.equal(result.stdout.split("\n")[0], "# base: origin/main"));
		test("warns when no base was given", () => assert.match(result.stderr, /no -b given; MERGED checks against origin\/main/));
		test("skips the main worktree", () => assert.equal(rows.filter((r) => r[columns.worktree] === repo).length, 0));
		for (const [name, worktree, column, expected, skip = false] of rowCases) {
			test(name, { skip }, () => {
				const actual = cell(worktree, column);
				if (expected instanceof RegExp) assert.match(actual, expected);
				else assert.equal(actual, expected);
			});
		}
	});
}

describe("arguments", { skip: skipAll }, () => {
	let path;
	before(() => {
		path = restrictedPath("tools-args", false);
	});
	test("an unknown base exits 1", () => assert.equal(audit(path, "-b", "origin/nope", repo).status, 1));
	test("an unknown option exits 2", () => assert.equal(audit(path, "--bogus").status, 2));
	test("-b without a ref exits 2", () => assert.equal(audit(path, "-b").status, 2));
	test("--help prints usage and exits 0", () => {
		const result = audit(path, "--help");
		assert.equal(result.status, 0);
		assert.match(result.stdout, /^Usage: worktree-audit\.sh/m);
	});
});

test("changes no worktree, ref, or file", { skip: skipAll }, () => {
	assert.equal(audit(restrictedPath("tools-readonly", false), repo).status, 0);
	assert.deepEqual(snapshot(), fixtureState);
});
