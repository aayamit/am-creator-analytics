/**
 * Webhook Handler for OpenSign Events
 * Receives signature completion events and triggers signing bonuses
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyContractSigned, notifyPayoutCompleted } from "@/lib/notification";

// Helper to send push notification
async function sendPushNotification(userId: string, title: string, body: string, data?: Record<string, any>) {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/mobile/send-push`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, title, body, data }),
    });
    if (!response.ok) {
      console.error("Failed to send push notification:", await response.text());
    }
  } catch (error) {
    console.error("Error sending push notification:", error);
  }
}

// Signing bonus amount (₹1,500 in paise)
const SIGNING_BONUS_AMOUNT = 150000;
const SIGNING_BONUS_FOLLOWER_THRESHOLD = 50000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('🔔 OpenSign webhook received:', JSON.stringify(body, null, 2));

    const { event, documentId } = parseWebhookEvent(body);

    if (!documentId) {
      return NextResponse.json({ error: 'Missing documentId' }, { status: 400 });
    }

    // Handle different events
    switch (event) {
      case 'document.signed':
        await handleDocumentSigned(documentId);
        break;
      case 'document.completed':
      case 'document.fully_executed':
        await handleDocumentCompleted(documentId);
        break;
      case 'document.cancelled':
        await handleDocumentCancelled(documentId);
        break;
      default:
        console.log(`ℹ️ Unhandled event: ${event}`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleDocumentSigned(documentId: string) {
  console.log(`✍️ Document ${documentId} signed`);

  try {
    await prisma.contract.updateMany({
      where: { openSignDocumentId: documentId },
      data: { status: 'PARTIALLY_SIGNED' as any, updatedAt: new Date() },
    });
    console.log('✅ Contract status updated to PARTIALLY_SIGNED');
  } catch (err) {
    console.log('⚠️ Error updating contract:', err);
  }
}

async function handleDocumentCompleted(documentId: string) {
  console.log(`🎉 Document ${documentId} fully executed!`);

  try {
    // Find contract with campaign creator (which has creator + campaign)
    const contract = await prisma.contract.findFirst({
      where: { openSignDocumentId: documentId },
      include: {
        campaignCreator: {
          include: {
            creator: {
              include: { user: true },
            },
            campaign: {
              include: { tenant: true },
            },
          },
        },
      },
    });

    if (!contract) {
      console.log('⚠️ Contract not found in DB, skipping');
      return;
    }

    // Update contract status
    await prisma.contract.update({
      where: { id: contract.id },
      data: {
        status: 'FULLY_EXECUTED' as any,
        signedAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log('✅ Contract status updated to FULLY_EXECUTED');

    // Send notification to admins about contract signing
    if (contract.campaignCreator?.creator?.user?.id) {
      try {
        await sendPushNotification(
          contract.campaignCreator.creator.user.id,
          "Contract Fully Signed! 🎉",
          `Your contract for ${contract.campaign?.title || 'campaign'} is now fully executed.`,
          { type: 'contract_signed', contractId: contract.id }
        );
        console.log(`✅ Push notification sent for contract signing`);
      } catch (pushError) {
        console.error('❌ Error sending push notification:', pushError);
      }
      
      try {
        await notifyContractSigned(
          contract.tenantId,
          contract.id,
          contract.campaignCreator.creator.user.name
        );
        console.log(`✅ Notification sent for contract signing`);
      } catch (notifyError) {
        console.error('❌ Error sending notification:', notifyError);
      }
    }

    // Check signing bonus eligibility
    const creator = contract.campaignCreator?.creator;
    if (creator) {
      const followerCount = creator.followerCount || 0;
      if (followerCount < SIGNING_BONUS_FOLLOWER_THRESHOLD) {
        console.log(`💰 Creator eligible for signing bonus! (${followerCount} followers < ${SIGNING_BONUS_FOLLOWER_THRESHOLD})`);
        await triggerSigningBonus(contract.id, creator.id, followerCount, contract.tenantId);
      } else {
        console.log(`ℹ️ Creator not eligible: ${followerCount} >= ${SIGNING_BONUS_FOLLOWER_THRESHOLD} followers`);
      }
    }
  } catch (error) {
    console.error('❌ Error handling completion:', error);
  }
}

async function triggerSigningBonus(
  contractId: string,
  creatorId: string,
  followerCount: number,
  tenantId: string
) {
  console.log(`💰 Triggering signing bonus for contract ${contractId}`);
  const bonusAmountRupees = SIGNING_BONUS_AMOUNT / 100;

  try {
    // Update contract with bonus info
    await prisma.contract.update({
      where: { id: contractId },
      data: {
        bonusPaidAt: new Date(),
        bonusAmount: bonusAmountRupees,
        updatedAt: new Date(),
      },
    });

    console.log(`✅ Signing bonus of ₹${bonusAmountRupees} recorded for contract ${contractId}`);

    // Notify creator about bonus
    const creator = await prisma.creatorProfile.findUnique({
      where: { id: creatorId },
      include: { user: true },
    });

    if (creator?.user) {
      try {
        const { createNotification } = await import('@/lib/notification');
        await createNotification({
          userId: creator.user.id,
          type: 'PAYOUT_COMPLETED',
          title: 'Signing Bonus Received!',
          message: `You have received a ₹${bonusAmountRupees} signing bonus for completing your contract.`,
          link: `/${tenantId}/dashboard/earnings`,
        });
        console.log(`✅ Bonus notification sent to creator`);
      } catch (notifyError) {
        console.error('❌ Error sending bonus notification:', notifyError);
      }
    }

    console.log('ℹ️ Stripe payout would be triggered here (if Stripe configured)');
  } catch (error) {
    console.error('❌ Error recording bonus:', error);
  }
}

async function handleDocumentCancelled(documentId: string) {
  console.log(`❌ Document ${documentId} cancelled`);

  try {
    await prisma.contract.updateMany({
      where: { openSignDocumentId: documentId },
      data: { status: 'TERMINATED' as any, updatedAt: new Date() },
    });
    console.log('✅ Contract status updated to TERMINATED');
  } catch (err) {
    console.log('⚠️ Error updating contract:', err);
  }
}

function parseWebhookEvent(body: any): { event: string; documentId: string } {
  return {
    event: body.event || body.type || 'unknown',
    documentId: body.documentId || body.objectId || body.id || '',
  };
}
