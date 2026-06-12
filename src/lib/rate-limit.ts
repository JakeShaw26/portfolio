/**
 * Best-effort in-memory rate limiter (fixed sliding window).
 *
 * CAVEAT (worth understanding): this lives in a single server process's memory.
 * On Vercel/serverless each instance has its own Map and cold starts wipe it, so
 * a determined attacker spread across instances isn't fully stopped. It's enough
 * to blunt casual spam/abuse from one source. For a hard guarantee you'd back this
 * with a shared store (e.g. Upstash Redis) keyed the same way.
 */
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 5;

const hits = new Map<string, number[]>();

/** Returns true if the request is allowed, false if the key is over its budget. */
export function rateLimit(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS) {
    hits.set(key, recent);
    return false;
  }

  recent.push(now);
  hits.set(key, recent);
  return true;
}
