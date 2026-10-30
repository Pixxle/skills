import { setTimeout as delay } from "node:timers/promises";
import { parseArgs as tokenizeArgs } from "node:util";
import type { ParseArgsOptionsConfig } from "node:util";
import { boxWrap, suggestion } from "./commander-compat.ts";
import {
  GhGitHubReader,
  WatcherQueryError,
  discoverStack,
  resolveContext,
} from "./github.ts";
import {
  runQueued,
  runSimple,
  statusQueryVerdict,
  verdictFactory,
} from "./policy.ts";
import type { WatchClock } from "./policy.ts";
import { renderJson, renderPretty } from "./render.ts";
import type * as T from "./types.ts";
import { nonEmpty, parsePrNumber } from "./types.ts";
export interface CliOptions {
  readonly owner: string | null;
  readonly repo: string | null;
  readonly pr: T.PrNumber | null;
  readonly mode: T.WatchMode;
  readonly stackPrs: readonly T.PrNumber[];
  readonly statusOnly: boolean;
  readonly pretty: boolean;
  readonly polling: T.PollingOptions;
}
class InvalidArgumentError extends Error {}
const EX_USAGE = 64;
export class CliExit extends Error {
  readonly exitCode: 0 | typeof EX_USAGE;
  constructor(exitCode: 0 | typeof EX_USAGE) {
    super(exitCode === 0 ? "help displayed" : "usage error");
    this.name = "CliExit";
    this.exitCode = exitCode;
  }
}
function positiveNumber(value: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0)
    throw new InvalidArgumentError("must be greater than zero");
  return parsed;
}
function nonNegativeNumber(value: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0)
    throw new InvalidArgumentError("must be zero or greater");
  return parsed;
}
function positiveInteger(value: string): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0)
    throw new InvalidArgumentError("must be a positive integer");
  return parsed;
}
function prNumber(value: string): T.PrNumber {
  try {
    return parsePrNumber(Number(value.replace(/^#/, "")));
  } catch {
    throw new InvalidArgumentError("must be a positive integer");
  }
}
function stackPrList(value: string): T.NonEmpty<T.PrNumber> {
  const numbers = value.split(",").map((part) => prNumber(part.trim()));
  if (new Set(numbers).size !== numbers.length)
    throw new InvalidArgumentError("contains a duplicate PR");
  const parsed = nonEmpty(numbers);
  if (parsed === null) throw new InvalidArgumentError("cannot be empty");
  return parsed;
}
interface RawOptions {
  readonly owner?: string;
  readonly repo?: string;
  readonly pr?: T.PrNumber;
  readonly stack: boolean;
  readonly queuedStack: boolean;
  readonly stackPrs?: T.NonEmpty<T.PrNumber>;
  readonly interval: number;
  readonly sweepInterval: number;
  readonly timeout: number;
  readonly maxQueryErrors: number;
  readonly statusOnly: boolean;
  readonly allowDraft: boolean;
  readonly pretty: boolean;
}
interface OptionSpec {
  readonly key: keyof RawOptions;
  readonly flags: string;
  readonly description: string;
  readonly parse?: (value: string) => unknown;
  readonly defaultValue?: boolean | number;
}
const OPTIONS: readonly OptionSpec[] = [
  { key: "owner", flags: "--owner <owner>", description: "GitHub repository owner" },
  { key: "repo", flags: "--repo <repo>", description: "GitHub repository name" },
  { key: "pr", flags: "--pr <number>", description: "pull request number", parse: prNumber },
  { key: "stack", flags: "--stack", description: "watch the connected open stack", defaultValue: false },
  { key: "queuedStack", flags: "--queued-stack", description: "watch the captured stack until all PRs merge", defaultValue: false },
  { key: "stackPrs", flags: "--stack-prs <n,...>", description: "frozen bottom-to-top queue (queued mode only)", parse: stackPrList },
  { key: "interval", flags: "--interval <seconds>", description: "poll interval", parse: positiveNumber, defaultValue: 60 },
  { key: "sweepInterval", flags: "--sweep-interval <seconds>", description: "whole-stack sweep interval", parse: positiveNumber, defaultValue: 300 },
  { key: "timeout", flags: "--timeout <seconds>", description: "deadline; 0 disables it", parse: nonNegativeNumber, defaultValue: 0 },
  { key: "maxQueryErrors", flags: "--max-query-errors <count>", description: "consecutive query-error budget", parse: positiveInteger, defaultValue: 5 },
  { key: "statusOnly", flags: "--status-only", description: "print one status table and exit 0", defaultValue: false },
  { key: "allowDraft", flags: "--allow-draft", description: "do not treat a draft as a merge gate", defaultValue: false },
  { key: "pretty", flags: "--pretty", description: "render human text instead of JSON", defaultValue: false },
];
const DESCRIPTION =
  "Watch one pull request, a connected stack, or an immutable queued stack.\nJSON (NDJSON while polling) is the default; --pretty renders human text.";
const longFlag = (spec: OptionSpec): string => spec.flags.split(" ")[0];
const takesValue = (spec: OptionSpec): boolean => spec.flags.includes(" <");
const TOKENIZER_OPTIONS: ParseArgsOptionsConfig = Object.fromEntries(
  OPTIONS.map((spec) => [
    longFlag(spec).slice(2),
    { type: takesValue(spec) ? "string" : "boolean" },
  ])
);
const KNOWN_FLAGS: readonly string[] = [...OPTIONS.map(longFlag), "--help"];
const helpRequestedAmong = (args: readonly string[]): boolean =>
  args.some((arg) => arg === "-h" || arg === "--help");
const NEGATIVE_NUMBER = /^-(\d+|\d*\.\d+)(e[+-]?\d+)?$/;
const isOptionLike = (arg: string): boolean =>
  arg.length > 1 && arg.startsWith("-") && !NEGATIVE_NUMBER.test(arg);
const findOption = (arg: string): OptionSpec | undefined =>
  OPTIONS.find(
    (spec) =>
      arg === longFlag(spec) ||
      (takesValue(spec) && arg.startsWith(`${longFlag(spec)}=`))
  );
function firstTokenPerArgument<Token extends { readonly index: number }>(
  tokens: readonly Token[]
): Token[] {
  return tokens.filter(
    (token, position) =>
      position === 0 || tokens[position - 1].index !== token.index
  );
}
export function helpText(width: number): string {
  const items: readonly (readonly [string, string])[] = [
    ...OPTIONS.map(
      (spec) =>
        [
          spec.flags,
          spec.defaultValue === undefined
            ? spec.description
            : `${spec.description} (default: ${JSON.stringify(spec.defaultValue)})`,
        ] as const
    ),
    ["-h, --help", "display help for command"],
  ];
  const termWidth = Math.max(...items.map(([term]) => term.length));
  const continuation = `\n${" ".repeat(termWidth + 4)}`;
  return [
    "Usage: watch-pr [options]",
    "",
    boxWrap(DESCRIPTION, width),
    "",
    "Options:",
    ...items.map(
      ([term, description]) =>
        `  ${term.padEnd(termWidth)}  ${boxWrap(description, width - termWidth - 4).replaceAll("\n", continuation)}`
    ),
    "",
  ].join("\n");
}
const terminalWidth = (): number =>
  (process.stdout.isTTY ? process.stdout.columns : undefined) ?? 80;
function usageError(
  io: Pick<CliRuntime, "stderr">,
  message: string
): never {
  io.stderr(`${message}\n`);
  throw new CliExit(EX_USAGE);
}
export function parseArgs(
  argv: readonly string[],
  io: Pick<CliRuntime, "stdout" | "stderr">
): CliOptions {
  const raw: Partial<Record<keyof RawOptions, unknown>> = {};
  for (const spec of OPTIONS)
    if (spec.defaultValue !== undefined) raw[spec.key] = spec.defaultValue;
  const given = new Set<keyof RawOptions>();
  const operands: string[] = [];
  const unknown: string[] = [];
  const { tokens } = tokenizeArgs({
    args: [...argv],
    options: TOKENIZER_OPTIONS,
    strict: false,
    allowPositionals: true,
    tokens: true,
  });
  for (const token of firstTokenPerArgument(tokens)) {
    const arg = argv[token.index];
    const afterUnknownOption = unknown.length > 0;
    if (token.kind === "option-terminator") {
      const rest = argv.slice(token.index + 1);
      if (afterUnknownOption) unknown.push(arg, ...rest);
      else operands.push(...rest);
      break;
    }
    if (token.kind === "option") {
      const spec = findOption(arg);
      if (spec !== undefined) {
        given.add(spec.key);
        if (!takesValue(spec)) {
          raw[spec.key] = true;
          continue;
        }
        const value = token.value;
        if (value === undefined)
          usageError(io, `error: option '${spec.flags}' argument missing`);
        try {
          raw[spec.key] = spec.parse === undefined ? value : spec.parse(value);
        } catch (error) {
          if (!(error instanceof InvalidArgumentError)) throw error;
          usageError(
            io,
            `error: option '${spec.flags}' argument '${value}' is invalid. ${error.message}`
          );
        }
        continue;
      }
    }
    if (afterUnknownOption || isOptionLike(arg)) unknown.push(arg);
    else operands.push(arg);
  }
  if (helpRequestedAmong(unknown)) {
    io.stdout(helpText(terminalWidth()));
    throw new CliExit(0);
  }
  if (given.has("stack") && given.has("queuedStack"))
    usageError(
      io,
      "error: option '--stack' cannot be used with option '--queued-stack'"
    );
  if (unknown.length > 0)
    usageError(
      io,
      `error: unknown option '${unknown[0]}'${suggestion(unknown[0], KNOWN_FLAGS)}`
    );
  if (operands.length > 0)
    usageError(
      io,
      `error: too many arguments. Expected 0 arguments but got ${operands.length}.`
    );
  const options = raw as RawOptions;
  if (options.stackPrs !== undefined && !options.queuedStack)
    usageError(io, "error: --stack-prs requires --queued-stack");
  return {
    owner: options.owner ?? null,
    repo: options.repo ?? null,
    pr: options.pr ?? null,
    mode: options.queuedStack
      ? "queued-stack"
      : options.stack
        ? "stack"
        : "single",
    stackPrs: options.stackPrs ?? [],
    statusOnly: options.statusOnly,
    pretty: options.pretty,
    polling: {
      interval: options.interval,
      sweepInterval: options.sweepInterval,
      timeout: options.timeout,
      maxQueryErrors: options.maxQueryErrors,
      allowDraft: options.allowDraft,
    },
  };
}
export interface CliRuntime {
  readonly reader: T.GitHubReader;
  readonly clock: WatchClock;
  readonly stdout: (value: string) => void;
  readonly stderr: (value: string) => void;
}
function realRuntime(): CliRuntime {
  return {
    reader: new GhGitHubReader(),
    clock: {
      now: () => performance.now() / 1_000,
      observedAt: () => new Date().toISOString(),
      sleep: async (seconds) => {
        await delay(seconds * 1_000);
      },
    },
    stdout: (value) => process.stdout.write(value),
    stderr: (value) => process.stderr.write(value),
  };
}
export async function main(
  argv: readonly string[],
  runtime: CliRuntime = realRuntime()
): Promise<number> {
  let options: CliOptions;
  try {
    options = parseArgs(argv, runtime);
  } catch (error) {
    if (!(error instanceof CliExit)) throw error;
    return error.exitCode;
  }
  const render = options.pretty ? renderPretty : renderJson;
  const emit = (verdict: T.ProgressVerdict): void =>
    runtime.stdout(render(verdict));
  let contexts: T.NonEmpty<T.PrContext>;
  try {
    const seed = await resolveContext({
      reader: runtime.reader,
      owner: options.owner,
      repo: options.repo,
      pr: options.pr ?? options.stackPrs[0] ?? null,
    });
    contexts =
      nonEmpty(options.stackPrs.map((number) => ({ ...seed, number }))) ??
      (options.mode === "single"
        ? [seed]
        : await discoverStack(runtime.reader, seed));
  } catch (error) {
    if (!(error instanceof WatcherQueryError)) throw error;
    const verdict = statusQueryVerdict(
      verdictFactory(runtime.clock, options.mode),
      1,
      error.failure
    );
    runtime.stdout(render(verdict));
    return verdict.exitCode;
  }
  const dependencies = { reader: runtime.reader, clock: runtime.clock, emit };
  const verdict =
    options.mode === "queued-stack" && !options.statusOnly
      ? await runQueued({ dependencies, contexts, options: options.polling })
      : await runSimple({
          dependencies,
          contexts,
          mode: options.mode,
          statusOnly: options.statusOnly,
          options: options.polling,
        });
  runtime.stdout(render(verdict));
  return verdict.exitCode;
}
