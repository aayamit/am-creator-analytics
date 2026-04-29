/**
 * Notification Helper
 * Use this to create notifications from server-side code
 * Now with Email integration (Resend + React Email)
 */

import { prisma } from './prisma';
import { sendEmail, shouldSendEmail, getTemplateForType } from './email';
import WelcomeEmail from '@/emails/welcome';
import ContractSignedEmail from '@/emails/contract-signed';
import PayoutSentEmail from '@/emails/payout-sent';

export interface CreateNotificationParams {
  userId: string;
  type: 'CONTRACT_SIGNED' | 'PAYOUT_SENT' | 'CAMPAIGN_INVITE' | 'WELCOME' | 'PASSWORD_RESET' | 'SYSTEM';
  title: string;
  message: string;
  link?: string;
  metadata?: any;
}

/**
 * Create a notification AND send email if appropriate
 */
export async function createNotification(params: CreateNotificationParams) {
  try {
    // 1. Create in-app notification
    const notification = await prisma.notification.create({
      data: {
        userId: params.userId,
        type: params.type,
        title: params.title,
        message: params.message,
        link: params.link,
        metadata: params.metadata,
      },
    });

    // 2. Get user email
    const user = await prisma.user.findUnique({
      where: { id: params.userId },
      select: { email: true, name: true },
    });

    // 3. Send email if this notification type supports it
    if (user?.email && shouldSendEmail(params.type)) {
      try {
        const templateType = getTemplateForType(params.type);
        let emailTemplate;

        // Select the right template
        switch (templateType) {
          case 'welcome':
            emailTemplate = <WelcomeEmail userName={user.name || 'there'} />;
            break;
          case 'contract-signed':
            emailTemplate = (
              <ContractSignedEmail
                creatorName={user.name || 'Creator'}
                brandName={params.metadata?.brandName || 'Brand'}
                campaignName={params.metadata?.campaignName || 'Campaign'}
                contractAmount={params.metadata?.amount || 0}
                signingBonus={params.metadata?.bonus || 0}
              />
            );
            break;
          case 'payout-sent':
            emailTemplate = (
              <PayoutSentEmail
                creatorName={user.name || 'Creator'}
                amount={params.metadata?.amount || 0}
                transactionId={params.metadata?.transactionId || ''}
              />
            );
            break;
        }

        if (emailTemplate) {
          await sendEmail({
            to: user.email,
            subject: params.title,
            react: emailTemplate,
          });
        }
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the notification if email fails
      }
    }

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

/**
 * Mark notifications as read
 */
export async function markAsRead(notificationIds: string[]) {
  return prisma.notification.updateMany({
    where: { id: { in: notificationIds } },
    data: { read: true },
  });
}

/**
 * Get unread notification count for a user
 */
export async function getUnreadCount(userId: string) {
  return prisma.notification.count({
    where: { userId, read: false },
  });
}
