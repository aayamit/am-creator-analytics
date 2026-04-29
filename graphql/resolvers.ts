/**
 * GraphQL Resolvers for AM Creator Analytics
 * Handles queries, mutations, and subscriptions
 */

import { prisma } from '@/lib/prisma';
import { pubsub } from './pubsub'; // For subscriptions

export const resolvers = {
  // ---- Queries ----
  Query: {
    // Creator queries
    creator: async (_: any, { id }: { id: string }) => {
      return await prisma.creator.findUnique({
        where: { id },
        include: { campaigns: true, contracts: true },
      });
    },

    creators: async (_: any, { tenantId }: { tenantId: string }) => {
      return await prisma.creator.findMany({
        where: { tenantId },
        include: { campaigns: true, contracts: true },
      });
    },

    creatorsByPlatform: async (
      _: any,
      { tenantId, platform }: { tenantId: string; platform: string }
    ) => {
      return await prisma.creator.findMany({
        where: { tenantId, platform },
        include: { campaigns: true, contracts: true },
      });
    },

    // Campaign queries
    campaign: async (_: any, { id }: { id: string }) => {
      return await prisma.campaign.findUnique({
        where: { id },
        include: { creators: true, contracts: true },
      });
    },

    campaigns: async (_: any, { tenantId }: { tenantId: string }) => {
      return await prisma.campaign.findMany({
        where: { tenantId },
        include: { creators: true, contracts: true },
      });
    },

    activeCampaigns: async (_: any, { tenantId }: { tenantId: string }) => {
      return await prisma.campaign.findMany({
        where: { tenantId, status: 'ACTIVE' },
        include: { creators: true, contracts: true },
      });
    },

    // Contract queries
    contract: async (_: any, { id }: { id: string }) => {
      return await prisma.contract.findUnique({
        where: { id },
        include: { campaign: true, creator: true },
      });
    },

    contracts: async (_: any, { tenantId }: { tenantId: string }) => {
      const campaigns = await prisma.campaign.findMany({
        where: { tenantId },
        select: { id: true },
      });
      const campaignIds = campaigns.map((c: any) => c.id);

      return await prisma.contract.findMany({
        where: { campaignId: { in: campaignIds } },
        include: { campaign: true, creator: true },
      });
    },

    signedContracts: async (_: any, { tenantId }: { tenantId: string }) => {
      const campaigns = await prisma.campaign.findMany({
        where: { tenantId },
        select: { id: true },
      });
      const campaignIds = campaigns.map((c: any) => c.id);

      return await prisma.contract.findMany({
        where: {
          campaignId: { in: campaignIds },
          status: 'SIGNED',
        },
        include: { campaign: true, creator: true },
      });
    },

    // Notification queries
    notifications: async (_: any, { userId }: { userId: string }) => {
      return await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
    },

    unreadNotificationCount: async (_: any, { userId }: { userId: string }) => {
      return await prisma.notification.count({
        where: { userId, read: false },
      });
    },
  },

  // ---- Mutations ----
  Mutation: {
    // Creator mutations
    createCreator: async (
      _: any,
      {
        name,
        email,
        tenantId,
        platform,
        followerCount,
      }: {
        name: string;
        email: string;
        tenantId: string;
        platform?: string;
        followerCount?: number;
      }
    ) => {
      return await prisma.creator.create({
        data: {
          name,
          email,
          tenantId,
          platform,
          followerCount,
        },
        include: { campaigns: true, contracts: true },
      });
    },

    // Campaign mutations
    createCampaign: async (
      _: any,
      {
        name,
        tenantId,
        description,
        budget,
      }: {
        name: string;
        tenantId: string;
        description?: string;
        budget?: number;
      }
    ) => {
      return await prisma.campaign.create({
        data: {
          name,
          tenantId,
          description,
          budget,
        },
        include: { creators: true, contracts: true },
      });
    },

    addCreatorToCampaign: async (
      _: any,
      { campaignId, creatorId }: { campaignId: string; creatorId: string }
    ) => {
      return await prisma.campaign.update({
        where: { id: campaignId },
        data: {
          creators: {
            connect: { id: creatorId },
          },
        },
        include: { creators: true, contracts: true },
      });
    },

    updateCampaignStatus: async (
      _: any,
      { id, status }: { id: string; status: string }
    ) => {
      return await prisma.campaign.update({
        where: { id },
        data: { status: status as any },
        include: { creators: true, contracts: true },
      });
    },

    // Contract mutations
    createContract: async (
      _: any,
      { campaignId, creatorId }: { campaignId: string; creatorId: string }
    ) => {
      const contract = await prisma.contract.create({
        data: {
          campaignId,
          creatorId,
        },
        include: { campaign: true, creator: true },
      });

      // Publish subscription event
      pubsub.publish('CONTRACT_CREATED', { contractCreated: contract });

      return contract;
    },

    signContract: async (_: any, { id }: { id: string }) => {
      const contract = await prisma.contract.update({
        where: { id },
        data: {
          status: 'SIGNED',
          signedAt: new Date(),
        },
        include: { campaign: true, creator: true },
      });

      // Trigger signing bonus (₹1,500)
      await prisma.user.updateMany({
        where: { id: contract.creatorId },
        data: { walletBalance: { increment: 1500 } },
      });

      // Publish subscription event
      pubsub.publish('CONTRACT_SIGNED', {
        contractSigned: contract,
      });

      return contract;
    },

    // Notification mutations
    markNotificationRead: async (_: any, { id }: { id: string }) => {
      return await prisma.notification.update({
        where: { id },
        data: { read: true },
      });
    },

    markAllNotificationsRead: async (
      _: any,
      { userId }: { userId: string }
    ) => {
      await prisma.notification.updateMany({
        where: { userId, read: false },
        data: { read: true },
      });
      return true;
    },
  },

  // ---- Nested Resolvers ----
  Creator: {
    campaigns: async (parent: any) => {
      return await prisma.campaign.findMany({
        where: { creators: { some: { id: parent.id } } },
      });
    },
    contracts: async (parent: any) => {
      return await prisma.contract.findMany({
        where: { creatorId: parent.id },
      });
    },
  },

  Campaign: {
    creators: async (parent: any) => {
      return await prisma.creator.findMany({
        where: { campaigns: { some: { id: parent.id } } },
      });
    },
    contracts: async (parent: any) => {
      return await prisma.contract.findMany({
        where: { campaignId: parent.id },
      });
    },
  },

  Contract: {
    campaign: async (parent: any) => {
      return await prisma.campaign.findUnique({
        where: { id: parent.campaignId },
      });
    },
    creator: async (parent: any) => {
      return await prisma.creator.findUnique({
        where: { id: parent.creatorId },
      });
    },
  },
};
