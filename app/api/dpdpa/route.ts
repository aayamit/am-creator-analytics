/**
 * API Route: DPDPA Compliance
 * Handles consent management, data export, and erasure requests
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/nextauth';
import { prisma } from '@/lib/prisma';

/**
 * Get user's DPDPA status
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        consentGiven: true,
        consentDate: true,
        dataProcessingAgreed: true,
        tenantId: true,
      },
    });

    // Get consent logs
    const consentLogs = await prisma.consentLog.findMany({
      where: { userId: session.user.id },
      orderBy: { timestamp: 'desc' },
      take: 10,
    });

    // Get pending DPDPA requests
    const dpdpaRequests = await prisma.dPDPRRequest.findMany({
      where: {
        userId: session.user.id,
        status: { in: ['PENDING', 'IN_PROGRESS'] },
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        consentGiven: user?.consentGiven,
        consentDate: user?.consentDate,
        dataProcessingAgreed: user?.dataProcessingAgreed,
      },
      consentLogs: consentLogs.map(log => ({
        id: log.id,
        action: log.action,
        timestamp: log.timestamp,
        ipAddress: log.ipAddress,
        userAgent: log.userAgent,
      })),
      pendingRequests: dpdpaRequests.map(req => ({
        id: req.id,
        type: req.type,
        status: req.status,
        createdAt: req.createdAt,
      })),
    });
  } catch (error: any) {
    console.error('DPDPA GET error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/**
 * Update consent
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { consentGiven, dataProcessingAgreed } = body;

    // Get IP and User Agent
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Update user consent
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        consentGiven: consentGiven ?? undefined,
        dataProcessingAgreed: dataProcessingAgreed ?? undefined,
        consentDate: consentGiven ? new Date() : null,
      },
    });

    // Log consent change
    await prisma.consentLog.create({
      data: {
        userId: session.user.id,
        action: consentGiven ? 'CONSENT_GIVEN' : 'CONSENT_WITHDRAWN',
        timestamp: new Date(),
        ipAddress,
        userAgent,
        metadata: {
          dataProcessingAgreed,
          previousConsent: session.user.consentGiven,
        },
      },
    });

    return NextResponse.json({
      success: true,
      consentGiven: user.consentGiven,
      consentDate: user.consentDate,
    });
  } catch (error: any) {
    console.error('DPDPA POST error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/**
 * Request data export (Right to Data Portability)
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create DPDPA request
    const dpdpaRequest = await prisma.dPDPRRequest.create({
      data: {
        userId: session.user.id,
        type: 'EXPORT',
        status: 'PENDING',
        requestedAt: new Date(),
        metadata: {
          requestedBy: session.user.email,
          requestType: 'USER_INITIATED',
        },
      },
    });

    // TODO: Trigger background job to:
    // 1. Collect all user data (profile, campaigns, contracts, payouts)
    // 2. Generate JSON/CSV export
    // 3. Email download link
    // 4. Update request status to COMPLETED

    return NextResponse.json({
      success: true,
      requestId: dpdpaRequest.id,
      message: 'Data export request submitted. You will receive an email when ready.',
    });
  } catch (error: any) {
    console.error('DPDPA PUT error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/**
 * Request data erasure (Right to be Forgotten)
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create DPDPA request
    const dpdpaRequest = await prisma.dPDPRRequest.create({
      data: {
        userId: session.user.id,
        type: 'DELETE',
        status: 'PENDING',
        requestedAt: new Date(),
        metadata: {
          requestedBy: session.user.email,
          requestType: 'USER_INITIATED',
          confirmationRequired: true,
        },
      },
    });

    return NextResponse.json({
      success: true,
      requestId: dpdpaRequest.id,
      message: 'Data erasure request submitted. Admin approval required.',
    });
  } catch (error: any) {
    console.error('DPDPA DELETE error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
