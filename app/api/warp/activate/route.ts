/**
 * Warp Drive Activation API (Mock)
 * POST /api/warp/activate
 * Engage warp drive for lightning-fast campaign processing
 */

import { NextRequest, NextResponse } from "next/server";
import { activateWarpDrive, calculateWarpSpeed } from "@/lib/warp-drive";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { speed, campaignCount } = body;

    // Calculate optimal warp speed
    const metrics = calculateWarpSpeed(campaignCount || 50);
    
    // Activate warp drive
    const result = activateWarpDrive(speed || 'WARP_5');

    return NextResponse.json({
      success: true,
      warpStatus: 'ENGAGED',
      ...result,
      metrics,
      warning: "⚠️ Do not exceed Warp 9.995 or you'll create a temporal vortex!",
      timestamp: new Date().toISOString(),
      message: "Warp drive engaged! Campaigns processing at light speed!",
    });
  } catch (error) {
    console.error('Warp drive error:', error);
    return NextResponse.json(
      { error: 'Warp core breach! Abort!', success: false },
      { status: 500 }
    );
  }
}
