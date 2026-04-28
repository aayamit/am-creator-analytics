/**
 * API Route: Create Contract & Send via OpenSign
 * Either Brand or Creator can initiate
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createDocument, sendDocument } from '@/lib/opensign';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      // Who is creating this contract?
      initiatorType, // 'BRAND' or 'CREATOR'
      initiatorId,   // User ID
      
      // Other party
      counterpartyId, // User ID of the other party
      
      // Contract details
      contractType,  // 'STANDARD', 'EXCLUSIVE', 'NDA'
      country,       // 'IN', 'US', 'EU'
      
      // Timeline
      startDate,
      endDate,
      
      // Compensation
      amount,
      currency = 'INR',
      paymentTerms = 'Within 7 days of deliverable approval',
      
      // Deliverables
      deliverables, // { posts: 3, stories: 5, reels: 2 }
      platforms,    // ['YouTube', 'Instagram']
      
      // Template
      templateId,
    } = body;

    // Validation
    if (!initiatorType || !counterpartyId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get initiator and counterparty details
    const initiator = await prisma.user.findUnique({
      where: { id: initiatorId },
      include: {
        brandProfile: true,
        creatorProfile: true,
      },
    });

    const counterparty = await prisma.user.findUnique({
      where: { id: counterpartyId },
      include: {
        brandProfile: true,
        creatorProfile: true,
      },
    });

    if (!initiator || !counterparty) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Determine brand and creator
    const brand = initiatorType === 'BRAND' ? initiator.brandProfile : counterparty.brandProfile;
    const creator = initiatorType === 'CREATOR' ? initiator.creatorProfile : counterparty.creatorProfile;

    if (!brand || !creator) {
      return NextResponse.json(
        { error: 'Invalid contract parties' },
        { status: 400 }
      );
    }

    // Generate contract HTML
    const contractHTML = generateContractHTML({
      brandName: brand.companyName,
      creatorName: creator.displayName,
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
        name: brand.companyName,
        email: initiatorType === 'BRAND' ? initiator.email! : counterparty.email!,
        role: 'brand' as const,
      },
      {
        name: creator.displayName,
        email: initiatorType === 'CREATOR' ? initiator.email! : counterparty.email!,
        role: 'creator' as const,
      },
    ];

    const document = await createDocument({
      title: `Contract: ${brand.companyName} x ${creator.displayName}`,
      htmlContent: contractHTML,
      signers,
      templateId,
    });

    // Create contract record in our DB
    // (Assuming you have a Contract model - adjust as needed)
    // For now, just return the OpenSign document ID

    // Send document to signers
    await sendDocument(document.id);

    return NextResponse.json({
      success: true,
      contractId: document.id,
      openSignUrl: document.id, // URL to view/sign
      message: 'Contract created and sent for signature',
    });
  } catch (error) {
    console.error('Contract creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create contract' },
      { status: 500 }
    );
  }
}

/**
 * Generate contract HTML (from lib/opensign.ts)
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
    <p><strong>Total Amount:</strong> ${compensation.currency} ${compensation.amount.toLocaleString()}</p>
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
