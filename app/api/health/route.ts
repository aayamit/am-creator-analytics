/**
 * Health Check API Route
 * Returns system health status
 * Used by monitoring tools (Uptime Robot, etc.)
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      database: 'unknown',
      api: 'up',
    },
  };

  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    health.services.database = 'up';
    
    return NextResponse.json(health, { status: 200 });
  } catch (error) {
    health.status = 'unhealthy';
    health.services.database = 'down';
    
    return NextResponse.json(
      {
        ...health,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
