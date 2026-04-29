/**
 * API Route: Create Contract & Send via OpenSign
 * Creates a contract linked to a campaign-creator assignment
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, UserRole } from '@prisma/client';
import { createDocument, sendDocument } from '@/lib/opensign';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      // Campaign & Creator
      campaignId,
      creatorId,

      // Contract details
      contractType = 'STANDARD',
      country = 'IN',

      // Timeline
      startDate = new Date().toISOString(),
      endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),

      // Compensation
      amount,
      currency = 'INR',
      paymentTerms = 'Within 7 days of deliverable approval',

      // Deliverables
      deliverables = {},
      platforms = [],

      // Template
      templateId,
    } = body;

    // Validation
    if (!campaignId || !creatorId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: campaignId, creatorId, amount' },
        { status: 400 }
      );
    }

    // Get campaign and creator details
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: { brand: { include: { user: true } } },
    });

    const creatorProfile = await prisma.creatorProfile.findUnique({
      where: { id: creatorId },
      include: { user: true },
    });

    if (!campaign || !creatorProfile) {
      return NextResponse.json(
        { error: 'Campaign or Creator not found' },
        { status: 404 }
      );
    }

    // Find or create CampaignCreator
    let campaignCreator = await prisma.campaignCreator.findUnique({
      where: {
        campaignId_creatorId: {
          campaignId,
          creatorId,
        },
      },
    });

    if (!campaignCreator) {
      campaignCreator = await prisma.campaignCreator.create({
        data: {
          campaignId,
          creatorId,
          status: 'ACTIVE',
          revenueSharePercent: 10, // Default
        },
      });
    }

    // Generate contract HTML
    const contractHTML = generateContractHTML({
      brandName: campaign.brand.companyName || 'Brand',
      creatorName: creatorProfile.displayName || 'Creator',
      deliverables,
      compensation: { amount, currency },
      timeline: { start: startDate, end: endDate },
      terms: {
        paymentTerms,
        governingLaw: country === 'IN' ? 'Laws of India' : 'Laws of the respective jurisdiction',
        jurisdiction: country === 'IN' ? 'Bangalore, Karnataka' : 'Appropriate jurisdiction',
      },
    });

    // Create document in OpenSign
    const signers = [
      {
        name: campaign.brand.companyName || 'Brand',
        email: campaign.brand.user.email!,
        role: 'brand' as const,
      },
      {
        name: creatorProfile.displayName || 'Creator',
        email: creatorProfile.user.email!,
        role: 'creator' as const,
      },
    ];

    const document = await createDocument({
      title: `Contract: ${campaign.brand.companyName || 'Brand'} x ${creatorProfile.displayName || 'Creator'}`,
      htmlContent: contractHTML,
      signers,
      templateId,
    });

    // Create contract record in our DB
    const contract = await prisma.contract.create({
      data: {
        campaignCreatorId: campaignCreator.id,
        status: 'DRAFT',
        openSignDocumentId: (document as any).id || (document as any).objectId,
      },
    });

    // Send document to signers
    const sendResult = await sendDocument((document as any).id || (document as any).objectId);

    // Update contract status
    await prisma.contract.update({
      where: { id: contract.id },
      data: { status: 'SENT' },
    });

    return NextResponse.json({
      success: true,
      contractId: contract.id,
      openSignDocumentId: (document as any).id || (document as any).objectId,
      signingUrls: sendResult.signingUrls,
      message: 'Contract created and sent for signature',
    });
  } catch (error: any) {
    console.error('Contract creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create contract' },
      { status: 500 }
    );
  }
}

/**
 * Generate contract HTML
 */
function generateContractHTML(contractData: any): string {
  const { brandName, creatorName, deliverables, compensation, timeline, terms } = contractData;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Creator Agreement - ${brandName} x ${creatorName}</title>
  <style>
    body { font-family: 'Inter', sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; color: #1a1a2e; }
    h1 { color: #92400e; border-bottom: 2px solid #92400e; padding-bottom: 10px; }
    h2 { color: #1a1a2e; margin-top: 30px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #f8f7f4; font-weight: 600; }
  </style>
</head>
<body>
  <h1>Creator Agreement</h1>

  <div>
    <h2>Parties</h2>
    <p><strong>Brand:</strong> ${brandName}</p>
    <p><strong>Creator:</strong> ${creatorName}</p>
  </div>

  <div>
    <h2>Scope of Work</h2>
    <table>
      <tr><th>Deliverable</th><th>Quantity</th></tr>
      ${deliverables?.posts ? `<tr><td>Posts</td><td>${deliverables.posts}</td></tr>` : ''}
      ${deliverables?.stories ? `<tr><td>Stories</td><td>${deliverables.stories}</td></tr>` : ''}
      ${deliverables?.reels ? `<tr><td>Reels/Videos</td><td>${deliverables.reels}</td></tr>` : ''}
    </table>
  </div>

  <div>
    <h2>Compensation</h2>
    <p><strong>Total Amount:</strong> ₹${Number(compensation.amount).toLocaleString()}</p>
    <p><strong>Payment Terms:</strong> ${terms.paymentTerms}</p>
  </div>

  <div>
    <h2>Timeline</h2>
    <p><strong>Start Date:</strong> ${timeline.start}</p>
    <p><strong>End Date:</strong> ${timeline.end}</p>
  </div>

  <div>
    <h2>Terms & Conditions</h2>
    <p><strong>Governing Law:</strong> ${terms.governingLaw}</p>
    <p><strong>Jurisdiction:</strong> ${terms.jurisdiction}</p>
  </div>
</body>
</html>
  `.trim();
}
