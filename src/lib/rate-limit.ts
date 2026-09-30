// ponytail: per-instance in-memory map; resets on cold start and is not shared across
// serverless instances. Enough for a portfolio. Move to Upstash Ratelimit if spam shows up.
const hits = new Map<string, number[]>();

export function rateLimit(key: string, limit = 5, windowMs = 10 * 60_000, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter(t => now - t < windowMs);
  if (recent.length >= limit) { hits.set(key, recent); return false; }
  recent.push(now);
  hits.set(key, recent);
  return true;
}

export function _resetRateLimit() { hits.clear(); }
