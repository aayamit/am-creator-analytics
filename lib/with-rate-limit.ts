/**
 * Example: Apply rate limiting to an API route
 * Usage: Wrap your handler with withRateLimit
 */

import { NextRequest, NextResponse } from "next/server";
import rateLimit from "@/lib/rate-limit";

// Create limiters for different endpoints
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 60, // 60 requests per minute
  message: "Too many requests from this IP, please try again later.",
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 attempts per 15 minutes
  message: "Too many authentication attempts, please try again later.",
});

export const simulateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 simulations per minute
  message: "Too many simulation requests, please wait.",
});

// Higher-order function to wrap handlers
export function withRateLimit(
  limiter: (req: Request) => Response | null,
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async function wrappedHandler(request: NextRequest) {
    const limitResponse = limiter(request);
    if (limitResponse) {
      return limitResponse;
    }
    return handler(request);
  };
}

// ---- EXAMPLE USAGE ----
// export const POST = withRateLimit(apiLimiter, async (request: NextRequest) => {
//   // Your handler logic here
//   return NextResponse.json({ success: true });
// });
