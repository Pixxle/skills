import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import assert from "node:assert/strict";
import { test } from "node:test";

const checker = join(import.meta.dirname, "check-plan.mjs");
const playbook = join(import.meta.dirname, "..", "playbooks", "multi-phase-plan.md");
const rule =
	"Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.";
const markers = ["git show origin/", "hourly audit tick", "status message"];
const longDash = String.fromCharCode(0x2014);
const openQuote = String.fromCharCode(0x201c);
const closeQuote = String.fromCharCode(0x201d);

const validPlan = `# Demo

## How to read this
One box is one unit of work and names the evidence. Check a box only when its evidence exists. See playbooks/.
${rule}

## Program checklist
### Arm the program
### Spawn owners
### PR mechanics
### Verdict and merge
### Boot recipe
\`git show origin/main:<path>\` hourly audit tick status message

## PR 1
**Depends on.** None.
**Files.**
- [ ] Do the thing.
**Build.**
- [ ] Do the thing.
**You see.**
- [ ] Do the thing.
**Verify, unit.** ${rule}
- [ ] Check the thing.
**Verify, live.** ${rule} Ten lanes on \`example-model\` at the PR head
${Array.from({ length: 10 }, (_, i) => `- [ ] Lane ${i + 1}. Save \`lane-${i + 1}.png\`. Pass when evidence exists.`).join("\n")}
**Verify, perf.** ${rule}
- [ ] Metric. Recorded.
- [ ] Probe. Recorded.
- [ ] Baseline. Recorded.
- [ ] Rule. Recorded.
**Review gate.** None.
**Merge.**
- [ ] Merge when approved.

## Close the program
Close.

## Appendix Prototype evidence
Recorded.
`;

const run = (text) => {
	const directory = mkdtempSync(join(tmpdir(), "check-plan-test-"));
	const file = join(directory, "plan.md");
	writeFileSync(file, text);
	try {
		return spawnSync(process.execPath, [checker, file], { encoding: "utf8" });
	} finally {
		rmSync(directory, { recursive: true, force: true });
	}
};

const runPlan = (example, expectedExit) => {
	const result = run(validPlan + example);
	assert.equal(result.status, expectedExit, result.stderr);
	return result;
};

const skeleton = () => {
	const match = readFileSync(playbook, "utf8").match(/^````markdown\n([\s\S]*?)\n````$/m);
	assert.ok(match, "multi-phase-plan.md has a ````markdown skeleton");
	return match[1];
};
const fill = (text) => text.replace(/<[^<>\n]+>/g, "filled");

test("accepts ordinary, indented, and longer closing fences", () => {
	for (const indent of ["", " ", "  ", "   "])
		runPlan(`${indent}\`\`\`markdown\n## Example only\n${indent}\`\`\`\n`, 0);
	runPlan("```markdown\n## Example only\n````\n", 0);
});

test("accepts nested backticks and tilde info strings", () => {
	runPlan("````markdown\n```markdown\n## Example only\n```\n````\n", 0);
	runPlan("~~~markdown `info`\n## Example only\n ~~~\n", 0);
});

test("keeps mismatched, shorter, and suffixed closers inside the fence", () => {
	runPlan("````markdown\n~~~\n## Example only\n````\n", 0);
	runPlan("````markdown\n```\n## Example only\n````\n", 0);
	runPlan("````markdown\n``` info\n## Example only\n````\n", 0);
});

test("rejects headings and prose outside a proper close", () => {
	for (const suffix of ["  ", "\t"]) {
		const heading = runPlan(`\`\`\`markdown\n## Example only\n\`\`\`${suffix}\n## Example only\n`, 1);
		assert.match(heading.stderr, /"## Example only" after Close the program is not an appendix/);
	}

	const prose = runPlan("```markdown\nThis prose has a mid-sentence colon: inside code\n```\nThis prose has a mid-sentence colon: bad.\n", 1);
	assert.match(prose.stderr, /mid-sentence colon/);
});

test("rejects backtick info strings containing a backtick", () => {
	const result = runPlan("```markdown `invalid`\n## Example only\n```\n", 1);
	assert.match(result.stderr, /"## Example only" after Close the program is not an appendix/);
});

test("ignores prose punctuation inside matching multi-backtick code spans", () => {
	for (const count of [2, 3, 4]) {
		const delimiter = "`".repeat(count);
		runPlan(`Use ${delimiter}echo \`x\`: ${openQuote}quoted${closeQuote} ${longDash} example${delimiter}.\n`, 0);
	}
});

test("checks prose following a multi-backtick span and unmatched delimiters", () => {
	const outside = runPlan("Use ``echo `x`: y``. Bad: prose.\n", 1);
	assert.match(outside.stderr, /mid-sentence colon/);
	const unmatched = runPlan("Use ``unclosed: bad` here.\n", 1);
	assert.match(unmatched.stderr, /mid-sentence colon/);
});

test("rejects a long dash and a curly quote in prose", () => {
	assert.match(runPlan(`A dash ${longDash} here.\n`, 1).stderr, /long dash/);
	assert.match(runPlan(`A ${openQuote}quote${closeQuote} here.\n`, 1).stderr, /curly quote/);
});

test("rejects a program checklist that lacks a marker", () => {
	for (const marker of markers) {
		const result = run(validPlan.replace(marker, "x"));
		assert.equal(result.status, 1, `dropping "${marker}" should fail`);
		assert.ok(result.stderr.includes(`Program checklist lacks "${marker}"`), result.stderr);
	}
});

test("accepts the playbook skeleton once its placeholders are filled", () => {
	const result = run(fill(skeleton()));
	assert.equal(result.status, 0, result.stderr);
	assert.match(result.stdout, /^filled \(filled\) {2}boxes=\d+ {2}files=3 build=1 you-see=1 verify-unit=1 verify-live=10 verify-perf=4 review-gate=3 merge=4$/m);
	assert.match(result.stdout, /^1 PR sections, 0 problems$/m);
});

test("accepts the skeleton with a not-review-gated PR", () => {
	const plan = fill(skeleton()).replace(
		/\*\*Review gate\.\*\*[\s\S]*?(?=\*\*Merge\.\*\*)/,
		"**Review gate.** None. PR 1 is not review-gated.\n\n",
	);
	const result = run(plan);
	assert.equal(result.status, 0, result.stderr);
	assert.match(result.stdout, /review-gate=0/);
});

test("rejects the skeleton while the verifier model is a placeholder", () => {
	const result = run(fill(skeleton()).replace("Ten lanes on `filled`", "Ten lanes on `<verifier model>`"));
	assert.equal(result.status, 1);
	assert.match(result.stderr, /Verify, live lacks "Ten lanes on `<verifier model>` at the PR head" with the model filled in/);
});
