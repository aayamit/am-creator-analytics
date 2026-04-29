/**
 * Search API Route
 * Universal search across creators, campaigns, contracts
 * Powered by MeiliSearch (saves ₹15K/month vs Algolia)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/nextauth';
import { searchAll } from '@/lib/meilisearch';

export async function GET(request: NextRequest) {
  try {
    // 1. Auth check
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Get tenant ID from session
    const tenantId = (session as any).user?.tenantId;
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 400 });
    }

    // 3. Get search query
    const query = request.nextUrl.searchParams.get('q') || '';
    if (!query || query.length < 2) {
      return NextResponse.json({
        creators: [],
        campaigns: [],
        contracts: [],
      });
    }

    // 4. Search across all indexes
    const results = await searchAll(query, tenantId);

    // 5. Format results
    const formattedResults = {
      creators: results.creators.map((hit: any) => ({
        id: hit.id,
        name: hit.name,
        platform: hit.platform,
        followers: hit.followerCount,
        type: 'creator',
        url: `/${tenantId}/dashboard/creators/${hit.id}`,
      })),
      campaigns: results.campaigns.map((hit: any) => ({
        id: hit.id,
        name: hit.name,
        status: hit.status,
        type: 'campaign',
        url: `/${tenantId}/dashboard/campaigns/${hit.id}`,
      })),
      contracts: results.contracts.map((hit: any) => ({
        id: hit.id,
        status: hit.status,
        type: 'contract',
        url: `/${tenantId}/dashboard/contracts/${hit.id}`,
      })),
    };

    return NextResponse.json(formattedResults);

  } catch (error: any) {
    console.error('Search error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
