import assert from "node:assert/strict";
import { inspect } from "node:util";

type Class = abstract new (...args: never[]) => unknown;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
function pickExpectedKeys(actual: unknown, expected: unknown): unknown {
  if (Array.isArray(actual) && Array.isArray(expected))
    return actual.map((item, index) => pickExpectedKeys(item, expected[index]));
  if (isRecord(actual) && isRecord(expected))
    return Object.fromEntries(
      Object.keys(expected).map((key) => [
        key,
        pickExpectedKeys(actual[key], expected[key]),
      ])
    );
  return actual;
}
function contains(actual: unknown, item: unknown): boolean {
  if (typeof actual === "string") return actual.includes(String(item));
  if (Array.isArray(actual)) return actual.includes(item);
  throw new TypeError(`toContain needs a string or array, got ${inspect(actual)}`);
}
const thrown = (expected: Class | string) =>
  typeof expected === "string"
    ? (error: unknown) =>
        error instanceof Error && error.message.includes(expected)
    : expected;

export function expect(actual: unknown) {
  return {
    toBe: (expected: unknown) => assert.strictEqual(actual, expected),
    toEqual: (expected: unknown) => assert.deepStrictEqual(actual, expected),
    toMatchObject: (expected: object) =>
      assert.deepStrictEqual(pickExpectedKeys(actual, expected), expected),
    toContain: (item: unknown) =>
      assert.ok(
        contains(actual, item),
        `expected ${inspect(actual)} to contain ${inspect(item)}`
      ),
    toHaveLength: (length: number) =>
      assert.strictEqual((actual as { readonly length: number }).length, length),
    toBeNull: () => assert.strictEqual(actual, null),
    toBeUndefined: () => assert.strictEqual(actual, undefined),
    toBeInstanceOf: (type: Class) =>
      assert.ok(
        actual instanceof type,
        `expected ${inspect(actual)} to be an instance of ${type.name}`
      ),
    toThrow: (expected: Class | string) =>
      assert.throws(actual as () => unknown, thrown(expected)),
    not: {
      toContain: (item: unknown) =>
        assert.ok(
          !contains(actual, item),
          `expected ${inspect(actual)} not to contain ${inspect(item)}`
        ),
    },
    rejects: {
      toThrow: (expected: Class | string) =>
        assert.rejects(actual as Promise<unknown>, thrown(expected)),
      toBeInstanceOf: (type: Class) =>
        assert.rejects(actual as Promise<unknown>, type),
    },
  };
}
