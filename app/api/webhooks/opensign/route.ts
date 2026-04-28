/**
 * Webhook Handler for OpenSign Events
 * Receives signature completion events
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, documentId, signerId, status } = body;

    console.log('OpenSign webhook received:', { event, documentId, signerId, status });

    // Verify webhook signature (inject in production)
    const signature = request.headers.get('x-opensign-signature');
    if (!verifySignature(signature, body)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Handle different events
    switch (event) {
      case 'document.signed':
        await handleDocumentSigned(documentId, signerId);
        break;

      case 'document.completed':
        await handleDocumentCompleted(documentId);
        break;

      case 'document.cancelled':
        await handleDocumentCancelled(documentId);
        break;

      default:
        console.log(`Unhandled event: ${event}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleDocumentSigned(documentId: string, signerId: string) {
  console.log(`Document ${documentId} signed by ${signerId}`);

  // Update contract status in DB
  // (Add your Contract model logic here)
  // Example: await prisma.contract.update(...))

  // Send notification to other party
  // Example: await sendNotification(...)
}

async function handleDocumentCompleted(documentId: string) {
  console.log(`Document ${documentId} fully executed`);

  // Update contract status to FULLY_EXECUTED
  // Check if signing bonus applies (<50K followers)
  // If yes, trigger Stripe payout of ₹1,500
}

async function handleDocumentCancelled(documentId: string) {
  console.log(`Document ${documentId} cancelled`);
  // Update contract status to TERMINATED
}

function verifySignature(signature: string | null, body: any): boolean {
  // TODO: Implement HMAC verification with your webhook secret
  // const expected = crypto
  //   .createHmac('sha256', process.env.OPENSIGN_WEBHOOK_SECRET!)
  //   .update(JSON.stringify(body))
  //   .digest('hex');
  // return signature === expected;
  
  // For now, skip verification (add in production!)
  return true;
}
