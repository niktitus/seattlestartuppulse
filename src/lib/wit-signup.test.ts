import { test, expect } from "bun:test";
import { witSignupSchema } from "./wit-signup";

const base = {
  name: "Nicole Titus",
  email: "nicole@example.com",
  stage: "startup",
  involvement: ["organize"],
  note: "",
};

test("sign-up passes without a separate data-sharing opt-in", () => {
  const result = witSignupSchema.safeParse(base);
  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.data.email).toBe("nicole@example.com");
    expect(result.data.stage).toBe("startup");
    expect(result.data.involvement).toEqual(["organize"]);
  }
});
