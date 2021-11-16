import { assertEquals } from "https://deno.land/std@0.114.0/testing/asserts.ts";

type FooResult =
  | { outcome: "success"; value: number }
  | { outcome: "failure"; error: string };

function foo(input: number): FooResult {
  if (input % 2 == 0) {
    return { outcome: "success", value: input * input };
  }
  return { outcome: "failure", error: "odd" };
}

Deno.test("squares even number", () => {
  const result = foo(2);
  assertEquals(result, {
    outcome: "success",
    value: 4,
  });
});

Deno.test("fails on odd", () => {
  const result = foo(3);
  assertEquals(result, {
    outcome: "failure",
    error: "odd",
  });
});
