/**
 * API Route: DPDPA Data Export
 * Generates and returns user's data in JSON format
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/nextauth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch all user data
    const userData: any = {};

    // 1. User profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        accounts: true,
        sessions: true,
        brandProfile: true,
        creatorProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    userData.profile = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      image: user.image,
      emailVerified: user.emailVerified,
      consentGiven: user.consentGiven,
      consentDate: user.consentDate,
      dataProcessingAgreed: user.dataProcessingAgreed,
      createdAt: user.createdAt,
      tenantId: user.tenantId,
    };

    // 2. Campaigns (if brand)
    if (user.brandProfile) {
      const campaigns = await prisma.campaign.findMany({
        where: { brandId: user.brandProfile.id },
        include: {
          _count: { select: { creators: true } },
        },
      });
      userData.campaigns = campaigns;
    }

    // 3. Creator data (if creator)
    if (user.creatorProfile) {
      const contracts = await prisma.contract.findMany({
        where: { campaignCreator: { creatorId: user.creatorProfile.id } },
        include: { campaignCreator: { include: { campaign: true } } },
      });
      userData.contracts = contracts;

      const payoutAccounts = await prisma.payoutAccount.findMany({
        where: { userId: userId },
      });
      userData.payoutAccounts = payoutAccounts;
    }

    // 4. Leads created
    const leads = await prisma.lead.findMany({
      where: { creator: { userId } },
      include: { campaign: true },
    });
    userData.leads = leads;

    // 5. Consent logs
    const consentLogs = await prisma.consentLog.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
    });
    userData.consentLogs = consentLogs;

    // 6. DPDPA requests
    const dpdpaRequests = await prisma.dPDPRRequest.findMany({
      where: { userId },
      orderBy: { requestedAt: 'desc' },
    });
    userData.dpdpaRequests = dpdpaRequests;

    // Return as JSON
    return NextResponse.json({
      success: true,
      exportedAt: new Date().toISOString(),
      userId,
      data: userData,
    });
  } catch (error: any) {
    console.error('DPDPA export error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
