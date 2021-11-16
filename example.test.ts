import { assert } from "https://deno.land/std@0.97.0/testing/asserts.ts";
import { expect } from "https://deno.land/x/expect@v0.2.9/mod.ts";

export type Ok<T> = { outcome: "ok"; value: T };
export type Err = { outcome: "error"; error: string };
type Result<T> = Ok<T> | Err;

const randomInt = () => Math.ceil(Math.random() * 10);

function foo(input: number): Result<number> {
  if (input % 2 == 0) {
    return { outcome: "ok", value: input + randomInt() };
  }
  return { outcome: "error", error: "input was odd" };
}

// It's straightforward to test a deterministic case:
Deno.test("returns an error for odd input", () => {
  const result = foo(3);
  expect(result).toEqual({
    outcome: "error",
    error: "input was odd",
  });
});

// ..but messier when the output is unpredictable:
Deno.test("increases an even number", () => {
  const result = foo(2);

  expect(result.outcome).toEqual("ok");

  // deno-lint-ignore no-explicit-any
  expect((result as any).value).toBeGreaterThan(2);

  expect(result.outcome === "ok" && result.value > 2);
});

/*
We can narrow the type of the result with a _Type Guard_:
https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
*/
function isOk<T>(input: Result<T>): input is Ok<T> {
  return input.outcome === "ok";
}

Deno.test("uses a type guard", () => {
  const result = foo(2);

  if (isOk(result)) {
    expect(result.value).toBeGreaterThan(2);
    // but it creates this awkward "else" case:
  } else {
    assert(false, "expected OK result, got error");
  }
});

/*
So instead let's use an "Assertion Function":
https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions
*/
function expectOk<T>(input: Result<T>): asserts input is Ok<T> {
  expect(input.outcome).toEqual("ok");
}

Deno.test("uses an assertion function", () => {
  const result = foo(2);

  expectOk(result);

  expect(result.value).toBeGreaterThan(2);
});
