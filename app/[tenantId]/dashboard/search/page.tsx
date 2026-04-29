/**
 * Search Results Page
 * Display full search results with filters
 */

import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Loader2, X, User, Briefcase, FileText } from 'lucide-react';
import SearchBar from '@/components/search/search-bar';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Search | AM Creator Analytics',
  description: 'Search creators, campaigns, contracts',
};

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ tenantId: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { tenantId } = await params;
  const { q } = await searchParams;

  // TODO: Fetch search results from MeiliSearch
  // const results = q ? await searchAll(q, tenantId) : null;

  // Mock data for now
  const results = q
    ? {
        creators: [
          { id: '1', name: 'Priya Sharma', platform: 'Instagram', followers: 125000 },
          { id: '2', name: 'Arjun Patel', platform: 'YouTube', followers: 89000 },
        ],
        campaigns: [
          { id: '1', name: 'Summer Collection', status: 'ACTIVE' },
        ],
        contracts: [],
      }
    : null;

  return (
    <div style={{ backgroundColor: '#F8F7F4', minHeight: '100vh', padding: '32px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#1a1a2e', marginBottom: '8px' }}>
          Search Results
        </h1>
        <p style={{ color: '#92400e', opacity: 0.8 }}>
          {q ? `Results for "${q}"` : 'Enter a search query to begin'}
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '32px', maxWidth: '600px' }}>
        <SearchBar tenantId={tenantId} placeholder="Search creators, campaigns, contracts..." />
      </div>

      {/* Results */}
      {results && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Creators */}
          {results.creators.length > 0 && (
            <Card style={{ backgroundColor: 'white', border: '1px solid rgba(26,26,46,0.1)' }}>
              <CardHeader>
                <CardTitle style={{ fontSize: '18px', color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={20} />
                  Creators ({results.creators.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {results.creators.map((creator: any) => (
                    <div
                      key={creator.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(26,26,46,0.05)',
                        cursor: 'pointer',
                      }}
                      onClick={() => window.location.href = `/${tenantId}/dashboard/creators/${creator.id}`}
                    >
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: '#e5e7eb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px',
                          fontWeight: 600,
                          color: '#1a1a2e',
                        }}
                      >
                        {creator.name.charAt(0)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '14px', fontWeight: 500, color: '#1a1a2e', margin: 0 }}>
                          {creator.name}
                        </p>
                        <p style={{ fontSize: '12px', color: '#92400e', margin: 0 }}>
                          {creator.platform} • {creator.followers?.toLocaleString() || 0} followers
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Campaigns */}
          {results.campaigns.length > 0 && (
            <Card style={{ backgroundColor: 'white', border: '1px solid rgba(26,26,46,0.1)' }}>
              <CardHeader>
                <CardTitle style={{ fontSize: '18px', color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Briefcase size={20} />
                  Campaigns ({results.campaigns.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {results.campaigns.map((campaign: any) => (
                    <div
                      key={campaign.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(26,26,46,0.05)',
                        cursor: 'pointer',
                      }}
                      onClick={() => window.location.href = `/${tenantId}/dashboard/campaigns/${campaign.id}`}
                    >
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 500, color: '#1a1a2e', margin: 0 }}>
                          {campaign.name}
                        </p>
                        <p style={{ fontSize: '12px', color: '#92400e', margin: 0 }}>
                          Campaign
                        </p>
                      </div>
                      <span
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          backgroundColor: campaign.status === 'ACTIVE' ? '#dcfce7' : '#fef3c7',
                          color: '#1a1a2e',
                        }}
                      >
                        {campaign.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* No Results */}
      {q && results && results.creators.length === 0 && results.campaigns.length === 0 && results.contracts.length === 0 && (
        <Card style={{ backgroundColor: 'white', border: '1px solid rgba(26,26,46,0.1)' }}>
          <CardContent style={{ textAlign: 'center', padding: '48px' }}>
            <Search size={48} style={{ color: '#92400e', opacity: 0.5, marginBottom: '16px' }} />
            <p style={{ fontSize: '16px', fontWeight: 500, color: '#1a1a2e', marginBottom: '8px' }}>
              No results found for "{q}"
            </p>
            <p style={{ fontSize: '14px', color: '#92400e', opacity: 0.8 }}>
              Try a different search term or check your spelling
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
