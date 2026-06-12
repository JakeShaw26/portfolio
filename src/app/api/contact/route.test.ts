import type { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the email module so tests never hit Resend (no network, no API key needed).
// Mocking it also sidesteps its `server-only` import, which would otherwise throw
// outside a React Server environment.
vi.mock("@/lib/email/contact", () => ({
  sendContactEmail: vi.fn(),
}));

import { sendContactEmail } from "@/lib/email/contact";

import { POST } from "./route";

const sendMock = vi.mocked(sendContactEmail);

const valid = {
  name: "Jake Shaw",
  email: "jake@example.com",
  message: "Hello — I'd love to work together on something.",
};

let ipCounter = 0;

/** Build a POST request with a unique IP so each test gets its own rate-limit budget. */
function post(body: unknown, ip = `10.0.0.${ipCounter++}`) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: typeof body === "string" ? body : JSON.stringify(body),
  }) as unknown as NextRequest;
}

beforeEach(() => {
  sendMock.mockReset();
});

describe("POST /api/contact", () => {
  it("sends the email and returns 200 for a valid submission", async () => {
    const res = await POST(post(valid));
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true });
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({
      name: valid.name,
      email: valid.email,
      message: valid.message,
    });
  });

  it("returns 400 with field errors for invalid input", async () => {
    const res = await POST(post({ ...valid, email: "nope" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.fieldErrors.email).toBeDefined();
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns 400 for an unparseable body", async () => {
    const res = await POST(post("{ not json"));
    expect(res.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("fakes success but sends nothing when the honeypot is filled", async () => {
    const res = await POST(post({ ...valid, company: "Spammer LLC" }));
    // Why: a 200 gives the bot no signal that it was caught.
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true });
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns 502 (not the real error) when sending fails", async () => {
    sendMock.mockRejectedValueOnce(new Error("Resend responded 401: bad key"));
    const res = await POST(post(valid));
    expect(res.status).toBe(502);
    const body = await res.json();
    // The provider's real error must not leak to the client.
    expect(body.error).not.toContain("Resend");
  });

  it("rate-limits a single IP after repeated requests", async () => {
    const ip = "203.0.113.7";
    // The limiter allows 5 in the window; the 6th must be rejected.
    for (let i = 0; i < 5; i++) {
      const ok = await POST(post(valid, ip));
      expect(ok.status).toBe(200);
    }
    const blocked = await POST(post(valid, ip));
    expect(blocked.status).toBe(429);
  });
});
