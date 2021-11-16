import { expect } from "https://deno.land/x/expect/mod.ts";

type Result<T> =
  | { outcome: "ok"; value: T }
  | { outcome: "error"; error: string };

const randomInt = () => Math.ceil(Math.random() * 10);

function foo(input: number): Result<number> {
  if (input % 2 == 0) {
    return { outcome: "ok", value: input + randomInt() };
  }
  return { outcome: "error", error: "input was odd" };
}

// It's straightforward to test a deterministic case:
Deno.test("returns error for odd input", () => {
  const result = foo(3);
  // expect(result).to;
  expect(result).toEqual({
    outcome: "error",
    error: "input was odd",
  });
});

// ..but harder when the output is unpredictable:
Deno.test("increases even number", () => {
  const result = foo(2);

  expect(result.outcome).toEqual("ok");

  expect((result as any).value).toBeGreaterThan(2);

  expect(result.outcome == "ok" && result.value > 2);
});
