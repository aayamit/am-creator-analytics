/**
 * GraphQL PubSub for Subscriptions (Real-time)
 * Uses in-memory event emitter (swap with Redis for production)
 */

import { PubSub } from 'graphql-subscriptions';

export const pubsub = new PubSub();

// Event types
export const EVENTS = {
  NOTIFICATION_ADDED: 'NOTIFICATION_ADDED',
  CONTRACT_SIGNED: 'CONTRACT_SIGNED',
  CONTRACT_CREATED: 'CONTRACT_CREATED',
  CAMPAIGN_UPDATED: 'CAMPAIGN_UPDATED',
};
