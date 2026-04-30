/**
 * Time Travel Debugger API (Mock)
 * POST /api/timetravel
 * Fix bugs in past commits
 */

import { NextRequest, NextResponse } from "next/server";
import { travelToCommit, fixBugInPast, getTimeline, restoreTimeline } from "@/lib/time-travel";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { targetCommit, action, fixPatch } = body;

    if (!targetCommit || !action) {
      return NextResponse.json(
        { error: 'targetCommit and action are required' },
        { status: 400 }
      );
    }

    if (action === 'INSPECT') {
      const result = travelToCommit(targetCommit, {});
      return NextResponse.json({
        success: true,
        action: 'INSPECT',
        ...result,
        message: `Inspecting commit ${targetCommit}`,
      });
    }

    if (action === 'FIX') {
      if (!fixPatch) {
        return NextResponse.json(
          { error: 'fixPatch is required for FIX action' },
          { status: 400 }
        );
      }
      
      const result = fixBugInPast(targetCommit, fixPatch);
      return NextResponse.json({
        success: true,
        action: 'FIX',
        ...result,
        temporalWarning: "⚠️ Modifying past commits may create temporal paradox!",
      });
    }

    if (action === 'RESTORE') {
      const result = restoreTimeline(targetCommit);
      return NextResponse.json({
        success: true,
        action: 'RESTORE',
        ...result,
        warning: "Future commits may be affected!",
      });
    }

    return NextResponse.json(
      { error: 'Invalid action. Use INSPECT, FIX, or RESTORE' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Time travel error:', error);
    return NextResponse.json(
      { error: 'Temporal anomaly detected! Abort!' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const timeline = getTimeline();
  return NextResponse.json({
    success: true,
    timeline,
    currentTimeline: timeline.length,
    message: "Timeline loaded. Proceed with caution.",
  });
}
