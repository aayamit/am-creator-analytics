/**
 * IoT Device Command API
 * POST /api/iot/device/[id]/command
 * Sends command to a specific device
 */

import { NextRequest, NextResponse } from "next/server";
import { sendCommand } from "@/lib/iot-service";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deviceId = params.id;
    const body = await request.json();
    const { command } = body;

    if (!command) {
      return NextResponse.json(
        { error: 'Command is required' },
        { status: 400 }
      );
    }

    sendCommand(deviceId, command);

    return NextResponse.json({
      success: true,
      message: `Command "${command}" sent to device ${deviceId}`,
    });
  } catch (error) {
    console.error('IoT command error:', error);
    return NextResponse.json(
      { error: 'Failed to send command' },
      { status: 500 }
    );
  }
}
