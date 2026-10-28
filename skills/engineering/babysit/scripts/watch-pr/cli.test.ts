import { describe, it } from "node:test";
import { helpText, main, parseArgs } from "./cli.ts";
import type { CliRuntime } from "./cli.ts";
import { expect } from "./expect.test-helper.ts";
import { fakeReader, passingCheck } from "./fakes.test-helper.ts";
import { renderJson, renderPretty } from "./render.ts";
import type { GitHubReader, WatcherVerdict } from "./types.ts";
import { parsePrNumber } from "./types.ts";

const silentIo = { stdout: () => {}, stderr: () => {} };

function testRuntime(reader: GitHubReader): {
  readonly runtime: CliRuntime;
  readonly stdout: string[];
  readonly stderr: string[];
} {
  const stdout: string[] = [];
  const stderr: string[] = [];
  return {
    stdout,
    stderr,
    runtime: {
      reader,
      clock: {
        now: () => 0,
        observedAt: () => "2026-07-26T00:00:00.000Z",
        async sleep() {
          throw new Error("test unexpectedly slept");
        },
      },
      stdout: (value) => stdout.push(value),
      stderr: (value) => stderr.push(value),
    },
  };
}

describe("parseArgs", () => {
  it("uses the specified defaults", () => {
    expect(parseArgs([], silentIo)).toMatchObject({
      owner: null,
      repo: null,
      pr: null,
      mode: "single",
      stackPrs: [],
      statusOnly: false,
      pretty: false,
      polling: {
        interval: 60,
        sweepInterval: 300,
        timeout: 0,
        maxQueryErrors: 5,
        allowDraft: false,
      },
    });
  });

  it("parses a frozen queued stack bottom-to-top", () => {
    const parsed = parseArgs(
      [
        "--queued-stack",
        "--stack-prs",
        "#10, 11,#12",
        "--interval",
        "2.5",
        "--sweep-interval",
        "30",
        "--timeout",
        "0",
        "--max-query-errors",
        "3",
        "--allow-draft",
        "--pretty",
      ],
      silentIo
    );
    expect(parsed.mode).toBe("queued-stack");
    expect(parsed.stackPrs.map(Number)).toEqual([10, 11, 12]);
    expect(parsed.polling).toEqual({
      interval: 2.5,
      sweepInterval: 30,
      timeout: 0,
      maxQueryErrors: 3,
      allowDraft: true,
    });
    expect(parsed.pretty).toBe(true);
  });

  it("rejects every invalid mode and numeric shape as usage", async () => {
    const invalid = [
      ["--unknown"],
      ["--interval", "0"],
      ["--sweep-interval", "-1"],
      ["--timeout", "-1"],
      ["--max-query-errors", "1.5"],
      ["--stack", "--queued-stack"],
      ["--stack-prs", "1,2"],
      ["--queued-stack", "--stack-prs", "1,1"],
    ];
    for (const argv of invalid) {
      const harness = testRuntime(fakeReader());
      expect(await main(argv, harness.runtime)).toBe(64);
      expect(harness.stdout).toEqual([]);
      expect(harness.stderr.join("")).toContain("error:");
    }
  });
});

describe("rendering", () => {
  const context = {
    owner: "owner",
    repo: "repo",
    number: parsePrNumber(1),
  };
  const status = {
    schemaVersion: 1,
    sequence: 1,
    observedAt: "2026-07-26T00:00:00.000Z",
    mode: "single",
    kind: "STATUS",
    terminal: true,
    exitCode: 0,
    reason: "status-only",
    rows: [
      {
        kind: "merged",
        context,
        facts: {
          context,
          mergeable: "MERGEABLE",
          mergeStateStatus: "CLEAN",
          reviewDecision: "APPROVED",
          headRefOid: "head",
          headRefName: "feature",
          baseRefName: "main",
          state: "MERGED",
          mergedAt: "now",
          isDraft: false,
        },
      },
    ],
  } satisfies WatcherVerdict;

  it("emits compact valid JSON by default", () => {
    const rendered = renderJson(status);
    expect(rendered.endsWith("\n")).toBe(true);
    expect(JSON.parse(rendered)).toEqual(status);
  });

  it("renders the Markdown table from the same verdict only", () => {
    const rendered = renderPretty(status);
    expect(rendered).toContain("| PR | CI | Review | Merge |");
    expect(rendered).toContain(
      "| [#1](https://github.com/owner/repo/pull/1) | \u2014 | \u2014 | ✅ merged |"
    );
  });
});

describe("main", () => {
  it("returns EX_USAGE 64 and writes usage errors only to stderr", async () => {
    const harness = testRuntime(fakeReader());
    expect(await main(["--interval", "0"], harness.runtime)).toBe(64);
    expect(harness.stdout).toEqual([]);
    expect(harness.stderr.join("")).toContain(
      "option '--interval <seconds>' argument '0' is invalid"
    );
  });

  it("bypasses the queue machine for queued-stack status-only", async () => {
    const reader = fakeReader();
    const harness = testRuntime(reader);
    const code = await main(
      [
        "--owner",
        "owner",
        "--repo",
        "repo",
        "--queued-stack",
        "--stack-prs",
        "1",
        "--status-only",
      ],
      harness.runtime
    );
    expect(code).toBe(0);
    expect(harness.stdout).toHaveLength(1);
    const verdict: unknown = JSON.parse(harness.stdout[0]);
    expect(verdict).toMatchObject({
      kind: "STATUS",
      terminal: true,
      exitCode: 0,
      mode: "queued-stack",
    });
    expect(harness.stdout[0]).not.toContain('"kind":"QUEUE"');
  });

  it("returns exit 4 for a hidden GitHub-side CI refusal", async () => {
    const reader = fakeReader({
      facts: { mergeStateStatus: "BLOCKED" },
      fastPath: { kind: "checks", checks: [passingCheck()] },
      commitRollups: [{ oid: "head", state: "FAILURE" }],
    });
    const harness = testRuntime(reader);
    const code = await main(
      ["--owner", "owner", "--repo", "repo", "--pr", "1"],
      harness.runtime
    );
    expect(code).toBe(4);
    expect(harness.stdout).toHaveLength(1);
    expect(JSON.parse(harness.stdout[0])).toMatchObject({
      kind: "BLOCKER",
      exitCode: 4,
      blocker: {
        kind: "failing-checks",
        ci: { kind: "ci-github-rejected" },
      },
    });
  });

  it("shows help without touching the reader", async () => {
    const reader = fakeReader();
    const harness = testRuntime(reader);
    expect(await main(["--help"], harness.runtime)).toBe(0);
    expect(harness.stdout.join("")).toContain("JSON (NDJSON while polling)");
    expect(reader.calls).toEqual([]);
  });
});

describe("commander parity", () => {
  it("lays out help as commander does at 80 columns", () => {
    expect(helpText(80)).toBe(
      [
        "Usage: watch-pr [options]",
        "",
        "Watch one pull request, a connected stack, or an immutable queued stack.",
        "JSON (NDJSON while polling) is the default; --pretty renders human text.",
        "",
        "Options:",
        "  --owner <owner>             GitHub repository owner",
        "  --repo <repo>               GitHub repository name",
        "  --pr <number>               pull request number",
        "  --stack                     watch the connected open stack (default: false)",
        "  --queued-stack              watch the captured stack until all PRs merge",
        "                              (default: false)",
        "  --stack-prs <n,...>         frozen bottom-to-top queue (queued mode only)",
        "  --interval <seconds>        poll interval (default: 60)",
        "  --sweep-interval <seconds>  whole-stack sweep interval (default: 300)",
        "  --timeout <seconds>         deadline; 0 disables it (default: 0)",
        "  --max-query-errors <count>  consecutive query-error budget (default: 5)",
        "  --status-only               print one status table and exit 0 (default: false)",
        "  --allow-draft               do not treat a draft as a merge gate (default:",
        "                              false)",
        "  --pretty                    render human text instead of JSON (default: false)",
        "  -h, --help                  display help for command",
        "",
      ].join("\n")
    );
  });

  it("reports each usage error with commander's message", async () => {
    const invalid = (flags: string, value: string, reason: string) =>
      `error: option '${flags}' argument '${value}' is invalid. ${reason}\n`;
    const cases: readonly (readonly [readonly string[], string])[] = [
      [["--stak"], "error: unknown option '--stak'\n(Did you mean --stack?)\n"],
      [["--stack=1"], "error: unknown option '--stack=1'\n(Did you mean --stack?)\n"],
      [["-hx"], "error: unknown option '-hx'\n"],
      [["--pr"], "error: option '--pr <number>' argument missing\n"],
      [["--pr="], invalid("--pr <number>", "", "must be a positive integer")],
      [["--sweep-interval", "-1"], invalid("--sweep-interval <seconds>", "-1", "must be greater than zero")],
      [["--help", "--interval", "0"], invalid("--interval <seconds>", "0", "must be greater than zero")],
      [["--unknown", "--interval", "0"], invalid("--interval <seconds>", "0", "must be greater than zero")],
      [["--queued-stack", "--stack-prs", "1,1"], invalid("--stack-prs <n,...>", "1,1", "contains a duplicate PR")],
      [["--queued-stack", "--stack"], "error: option '--stack' cannot be used with option '--queued-stack'\n"],
      [["--stack-prs", "1,2"], "error: --stack-prs requires --queued-stack\n"],
    ];
    for (const [argv, message] of cases) {
      const harness = testRuntime(fakeReader());
      expect(await main(argv, harness.runtime)).toBe(64);
      expect(harness.stdout).toEqual([]);
      expect(harness.stderr.join("")).toBe(message);
    }
  });

  it("treats a stray operand, a negative number included, as too many arguments", async () => {
    for (const argv of [["42"], ["-5"], ["-1.5"], ["--", "--help"]]) {
      const harness = testRuntime(fakeReader());
      expect(await main(argv, harness.runtime)).toBe(64);
      expect(harness.stdout).toEqual([]);
      expect(harness.stderr.join("")).toContain(
        "error: too many arguments. Expected 0 arguments but got 1"
      );
    }
  });

  it("finds help among unknown arguments but not in an option value", async () => {
    for (const argv of [["-h"], ["42", "--help"], ["--unknown", "--help"]]) {
      const reader = fakeReader();
      const harness = testRuntime(reader);
      expect(await main(argv, harness.runtime)).toBe(0);
      expect(harness.stdout.join("")).toContain("Usage: watch-pr [options]");
      expect(harness.stderr).toEqual([]);
      expect(reader.calls).toEqual([]);
    }
    expect(parseArgs(["--owner", "--help"], silentIo).owner).toBe("--help");
    expect(parseArgs(["--repo=a=b"], silentIo).repo).toBe("a=b");
  });
});
