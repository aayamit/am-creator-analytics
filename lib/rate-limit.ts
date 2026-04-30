/**
 * Simple Rate Limiter
 * In-memory store (per-server, for MVP)
 * For production: use Redis (we already have Redis in docker-compose!)
 */

const ipRequestMap = new Map<string, { count: number; resetTime: number }>();

interface RateLimitOptions {
  windowMs: number; // Time window (ms)
  maxRequests: number; // Max requests per window
  message?: string;
}

export function rateLimit(options: RateLimitOptions) {
  const { windowMs, maxRequests, message = "Too many requests" } = options;

  return function rateLimitMiddleware(request: Request): Response | null {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const now = Date.now();
    const record = ipRequestMap.get(ip);

    if (!record || now > record.resetTime) {
      // First request or window expired
      ipRequestMap.set(ip, { count: 1, resetTime: now + windowMs });
      return null; // Allow
    }

    if (record.count >= maxRequests) {
      // Rate limit exceeded
      return new Response(
        JSON.stringify({
          error: message,
          retryAfter: Math.ceil((record.resetTime - now) / 1000),
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": Math.ceil(
              (record.resetTime - now) / 1000
            ).toString(),
          },
        }
      );
    }

    // Increment count
    record.count++;
    return null; // Allow
  };
}

// Cleanup old entries every 5 minutes
setInterval(
  () => {
    const now = Date.now();
    for (const [ip, record] of ipRequestMap.entries()) {
      if (now > record.resetTime) {
        ipRequestMap.delete(ip);
      }
    }
  },
  5 * 60 * 1000
);

export default rateLimit;
