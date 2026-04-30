/**
 * IoT Studio Status API
 * GET /api/iot/studio/status
 * Returns status of all studio devices
 */

import { NextRequest, NextResponse } from "next/server";
import { getStudioStatus } from "@/lib/iot-service";

export async function GET(request: NextRequest) {
  try {
    const status = getStudioStatus();
    return NextResponse.json(status);
  } catch (error) {
    console.error('IoT status error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch IoT status' },
      { status: 500 }
    );
  }
}
