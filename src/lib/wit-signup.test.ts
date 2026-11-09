import { test, expect } from "bun:test";
import { witSignupSchema } from "./wit-signup";

const base = {
  name: "Nicole Titus",
  email: "nicole@example.com",
  stage: "startup",
  involvement: ["organize"],
  note: "",
  consent: true,
};

test("sign-up is rejected when data-sharing consent is not given", () => {
  const result = witSignupSchema.safeParse({ ...base, consent: false });
  expect(result.success).toBe(false);
  if (!result.success) {
    expect(result.error.errors[0].message).toBe("Please agree before submitting");
  }
});

test("sign-up is rejected when consent is missing entirely", () => {
  const { consent, ...rest } = base;
  expect(witSignupSchema.safeParse(rest).success).toBe(false);
});

test("sign-up passes with consent and valid fields", () => {
  const result = witSignupSchema.safeParse(base);
  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.data.email).toBe("nicole@example.com");
    expect(result.data.stage).toBe("startup");
    expect(result.data.involvement).toEqual(["organize"]);
  }
});
