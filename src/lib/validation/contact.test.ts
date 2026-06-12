import { describe, expect, it } from "vitest";

import { contactSchema, getFieldErrors } from "./contact";

const valid = {
  name: "Jake Shaw",
  email: "jake@example.com",
  message: "Hello — I'd love to work together on something.",
};

describe("contactSchema", () => {
  it("accepts a well-formed submission", () => {
    const result = contactSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("trims whitespace around fields", () => {
    const result = contactSchema.safeParse({
      ...valid,
      name: "  Jake Shaw  ",
    });
    // Why: the server should store/send the cleaned value, not the padded one.
    expect(result.success && result.data.name).toBe("Jake Shaw");
  });

  it("rejects a name shorter than 2 characters", () => {
    const result = contactSchema.safeParse({ ...valid, name: "J" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(getFieldErrors(result.error).name).toBeDefined();
    }
  });

  it("rejects a malformed email", () => {
    const result = contactSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(getFieldErrors(result.error).email).toBeDefined();
    }
  });

  it("rejects a message that is too short", () => {
    const result = contactSchema.safeParse({ ...valid, message: "hi" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(getFieldErrors(result.error).message).toBeDefined();
    }
  });

  it("rejects a message over the 2000-char ceiling", () => {
    // Why: an unbounded text field is an abuse vector (oversized payloads / spam).
    const result = contactSchema.safeParse({
      ...valid,
      message: "x".repeat(2001),
    });
    expect(result.success).toBe(false);
  });

  it("tolerates the honeypot field being present", () => {
    // The schema must not reject a filled honeypot — the route handles that
    // silently so bots get no signal.
    const result = contactSchema.safeParse({ ...valid, company: "Acme Inc" });
    expect(result.success).toBe(true);
  });
});
