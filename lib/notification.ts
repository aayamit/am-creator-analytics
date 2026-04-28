import { PrismaClient } from '@prisma/client';
import { NotificationType } from '@prisma/client';
import { notificationEmitter } from './notification-events';

const prisma = new PrismaClient();

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
}

export async function createNotification({ userId, type, title, message, link }: CreateNotificationParams) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        link,
      },
    });
    
    // Emit event for real-time notifications
    notificationEmitter.emit('new-notification', {
      userId,
      notification,
    });
    
    return notification;
  } catch (error) {
    console.error('Failed to create notification:', error);
    throw error;
  }
}

export async function createCampaignInviteNotification(
  creatorUserId: string,
  campaignTitle: string,
  campaignId: string,
  brandName: string
) {
  return createNotification({
    userId: creatorUserId,
    type: NotificationType.CAMPAIGN_INVITE,
    title: 'New Campaign Invite',
    message: `${brandName} has invited you to join "${campaignTitle}"`,
    link: `/creators/campaigns/${campaignId}`,
  });
}

export async function createCampaignUpdateNotification(
  userId: string,
  campaignTitle: string,
  campaignId: string,
  updateMessage: string
) {
  return createNotification({
    userId,
    type: NotificationType.CAMPAIGN_UPDATE,
    title: 'Campaign Update',
    message: `Campaign "${campaignTitle}" ${updateMessage}`,
    link: `/brands/campaigns/${campaignId}`,
  });
}
