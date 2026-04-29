/**
 * MeiliSearch Client
 * Self-hosted search engine (saves ₹15K/month vs Algolia)
 */

import { MeiliSearch } from 'meilisearch';

const meili = new MeiliSearch({
  host: process.env.MEILI_HOST || 'http://localhost:7700',
  apiKey: process.env.MEILI_MASTER_KEY || 'my-master-key-change-in-prod',
});

// Index names
export const INDEXES = {
  CREATORS: 'creators',
  CAMPAIGNS: 'campaigns',
  CONTRACTS: 'contracts',
};

// Initialize indexes
export async function initMeiliSearch() {
  try {
    // Create indexes if they don't exist
    try {
      await meili.createIndex(INDEXES.CREATORS, { primaryKey: 'id' });
      console.log(`✅ Created index: ${INDEXES.CREATORS}`);
    } catch (e) {
      // Index might already exist
    }

    try {
      await meili.createIndex(INDEXES.CAMPAIGNS, { primaryKey: 'id' });
      console.log(`✅ Created index: ${INDEXES.CAMPAIGNS}`);
    } catch (e) {
      // Index might already exist
    }

    try {
      await meili.createIndex(INDEXES.CONTRACTS, { primaryKey: 'id' });
      console.log(`✅ Created index: ${INDEXES.CONTRACTS}`);
    } catch (e) {
      // Index might already exist
    }

    // Configure searchable attributes
    const creatorsIndex = meili.index(INDEXES.CREATORS);
    await creatorsIndex.updateSearchableAttributes([
      'name', 'niche', 'platform', 'bio'
    ]);

    const campaignsIndex = meili.index(INDEXES.CAMPAIGNS);
    await campaignsIndex.updateSearchableAttributes([
      'name', 'description', 'brandName'
    ]);

    const contractsIndex = meili.index(INDEXES.CONTRACTS);
    await contractsIndex.updateSearchableAttributes([
      'id', 'status', 'campaignName'
    ]);

    console.log('✅ MeiliSearch initialized');
  } catch (error) {
    console.error('❌ MeiliSearch init error:', error);
  }
}

// Index a creator
export async function indexCreator(creator: {
  id: string;
  name: string;
  niche?: string;
  platform?: string;
  followerCount?: number;
  engagementRate?: number;
}) {
  try {
    const index = meili.index(INDEXES.CREATORS);
    await index.addDocuments([creator]);
  } catch (error) {
    console.error('Error indexing creator:', error);
  }
}

// Index a campaign
export async function indexCampaign(campaign: {
  id: string;
  name: string;
  description?: string;
  brandName?: string;
  status?: string;
}) {
  try {
    const index = meili.index(INDEXES.CAMPAIGNS);
    await index.addDocuments([campaign]);
  } catch (error) {
    console.error('Error indexing campaign:', error);
  }
}

// Search across all indexes
export async function searchAll(query: string, tenantId: string) {
  try {
    const results = await Promise.all([
      meili.index(INDEXES.CREATORS).search(query, {
        filter: [`tenantId = ${tenantId}`],
        limit: 10,
      }),
      meili.index(INDEXES.CAMPAIGNS).search(query, {
        filter: [`tenantId = ${tenantId}`],
        limit: 10,
      }),
      meili.index(INDEXES.CONTRACTS).search(query, {
        filter: [`tenantId = ${tenantId}`],
        limit: 10,
      }),
    ]);

    return {
      creators: results[0].hits,
      campaigns: results[1].hits,
      contracts: results[2].hits,
    };
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
}
