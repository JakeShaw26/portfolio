import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { fetchEntries } from "./contentful";

/**
 * These two tests guard security properties of the request itself rather than
 * anything about the data that comes back. Both failures would be invisible in
 * the rendered site — it would look completely normal while doing the wrong
 * thing — so a test is the only thing that would catch either one.
 */
describe("fetchEntries", () => {
  const originalEnv = { ...process.env };
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    process.env.CONTENTFUL_SPACE_ID = "space";
    process.env.CONTENTFUL_DELIVERY_TOKEN = "token";
    fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({ items: [] }) });
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.unstubAllGlobals();
  });

  // cdn.contentful.com serves published entries only; preview.contentful.com
  // serves drafts. Swapping the host is a one-word change that would silently
  // publish unpublished or rejected content — an unapproved testimonial being
  // the case that actually matters here.
  it("requests the published-content host, never the preview host", async () => {
    await fetchEntries("testimonial");

    const url = new URL(fetchMock.mock.calls[0][0] as string);
    expect(url.host).toBe("cdn.contentful.com");
    expect(url.protocol).toBe("https:");
  });

  // Contentful accepts the token as an `access_token` query param, which is the
  // path of least resistance and puts the credential into anything that logs a
  // URL. The header form keeps it out of them.
  it("sends the token as a header and never in the query string", async () => {
    await fetchEntries("testimonial");

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).not.toContain("token");
    expect(new URL(url).searchParams.has("access_token")).toBe(false);
    expect((init.headers as Record<string, string>).Authorization).toBe(
      "Bearer token",
    );
  });
});
