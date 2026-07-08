// Best-effort in-memory sliding-window rate limiter.
//
// Limitation: state is per-instance, so on multi-instance Cloud Run the effective
// limit is (limit × instances). It is meant to blunt casual abuse / accidental
// double submits, not as a hard security control. For strict limits, back this
// with a shared store (Firestore/Redis).

const hits = new Map<string, number[]>();

// Opportunistic cleanup so the map cannot grow unbounded across many keys.
const MAX_KEYS = 10_000;

export interface RateLimitResult {
  allowed: boolean;
  /** Seconds until the caller may retry, when not allowed. */
  retryAfterSeconds?: number;
}

/**
 * Returns whether `key` is allowed to act, given at most `limit` actions per
 * `windowMs`. Each allowed call records a timestamp.
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);

  if (recent.length >= limit) {
    hits.set(key, recent);
    const oldest = recent[0];
    return { allowed: false, retryAfterSeconds: Math.ceil((windowMs - (now - oldest)) / 1000) };
  }

  recent.push(now);
  hits.set(key, recent);

  if (hits.size > MAX_KEYS) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= windowMs)) hits.delete(k);
    }
  }

  return { allowed: true };
}
