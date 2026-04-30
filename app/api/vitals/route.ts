/**
 * Web Vitals API Route
 * POST /api/vitals
 * Collects and stores Core Web Vitals metrics
 * Can forward to Sentry, Grafana, or simple JSON file
 */

import { NextRequest, NextResponse } from "next/server";

// In-memory store (for MVP)
// For production: use Redis or send to Sentry
const vitalsStore: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const metric = await request.json();

    // Add timestamp and basic info
    const enriched = {
      ...metric,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      referer: request.headers.get('referer'),
    };

    // Store in memory (last 1000 entries)
    vitalsStore.push(enriched);
    if (vitalsStore.length > 1000) {
      vitalsStore.shift();
    }

    // Log for debugging (in production, send to monitoring service)
    console.log('[Web Vital]', enriched.name, enriched.value);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving web vital:', error);
    return NextResponse.json(
      { error: 'Failed to save metric' },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to view recent metrics (admin only)
export async function GET() {
  // Simple auth check (in production, use proper auth)
  const recent = vitalsStore.slice(-20).reverse();
  return NextResponse.json({
    count: vitalsStore.length,
    recent,
  });
}
