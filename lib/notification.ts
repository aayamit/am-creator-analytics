/**
 * Notification Helper
 * Use this to create notifications from server-side code
 */

import { prisma } from './prisma';

export interface CreateNotificationParams {
  userId: string;
  type: 'CONTRACT_SIGNED' | 'PAYOUT_COMPLETED' | 'CAMPAIGN_CREATED' | 'DPDPA_REQUEST' | 'SYSTEM';
  title: string;
  message: string;
  link?: string;
}

export async function createNotification({
  userId,
  type,
  title,
  message,
  link,
}: CreateNotificationParams) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        link,
        isRead: false,
      },
    });
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

/**
 * Create notification for multiple users
 */
export async function createNotificationForUsers(
  userIds: string[],
  params: Omit<CreateNotificationParams, 'userId'>
) {
  try {
    const notifications = await prisma.$transaction(
      userIds.map(userId =>
        prisma.notification.create({
          data: {
            userId,
            ...params,
            isRead: false,
          },
        })
      )
    );
    return notifications;
  } catch (error) {
    console.error('Error creating notifications for users:', error);
    throw error;
  }
}

/**
 * Notify when a contract is signed
 */
export async function notifyContractSigned(
  tenantId: string,
  contractId: string,
  creatorName: string
) {
  // Get all admin users in the tenant
  const admins = await prisma.user.findMany({
    where: {
      tenantId,
      role: 'ADMIN',
    },
  });

  const userIds = admins.map(admin => admin.id);

  await createNotificationForUsers(userIds, {
    type: 'CONTRACT_SIGNED',
    title: 'Contract Signed',
    message: `${creatorName} has signed the contract.`,
    link: `/${tenantId}/dashboard/contracts/${contractId}`,
  });
}

/**
 * Notify when a payout is completed
 */
export async function notifyPayoutCompleted(
  userId: string,
  amount: number,
  campaignName: string
) {
  await createNotification({
    userId,
    type: 'PAYOUT_COMPLETED',
    title: 'Payout Completed',
    message: `₹${amount.toLocaleString('en-IN')} payout for ${campaignName} has been completed.`,
    link: `/${tenantId}/dashboard/earnings`,
  });
}

/**
 * Notify when a DPDPA request is submitted
 */
export async function notifyDPDPARequest(
  tenantId: string,
  requestId: string,
  userName: string,
  requestType: string
) {
  const admins = await prisma.user.findMany({
    where: {
      tenantId,
      role: 'ADMIN',
    },
  });

  await createNotificationForUsers(
    admins.map(admin => admin.id),
    {
      type: 'DPDPA_REQUEST',
      title: 'DPDPA Request Submitted',
      message: `${userName} has submitted a ${requestType} request.`,
      link: `/${tenantId}/dashboard/settings`,
    }
  );
}
