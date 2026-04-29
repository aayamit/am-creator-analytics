/**
 * Brand Creators Page (Discover)
 * Browse and discover creators for campaigns
 */

import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Plus, Search, Filter, UserCheck, BarChart3, TrendingUp } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Discover | Brand | AM Creator Analytics',
  description: 'Browse and discover creators for your campaigns',
};

export default async function BrandCreatorsPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;

  // Fetch all creator profiles
  const creators = await prisma.creatorProfile.findMany({
    include: {
      user: true,
      socialProfiles: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  // Stats
  const stats = {
    total: creators.length,
    available: creators.filter(c => (c.followerCount || 0) > 10000).length,
    avgEngagement: creators.length > 0
      ? creators.reduce((sum, c) => sum + (c.engagementRate || 0), 0) / creators.length
      : 0,
  };

  return (
    <div style={{
      backgroundColor: '#F8F7F4',
      minHeight: '100vh',
      padding: '16px',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      '@media (min-width: 768px)': {
        padding: '32px',
      },
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginBottom: '24px',
        '@media (min-width: 768px)': {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        },
      }}>
        <div>
          <h1 style={{
            color: '#1a1a2e',
            fontSize: '24px',
            fontWeight: 600,
            marginBottom: '4px',
            '@media (min-width: 768px)': {
              fontSize: '28px',
            },
          }}>
            Discover Creators
          </h1>
          <p style={{
            color: '#92400e',
            fontSize: '14px',
            margin: 0,
          }}>
            Browse and connect with creators for your campaigns
          </p>
        </div>
        <button style={{
          backgroundColor: '#92400e',
          color: '#F8F7F4',
          padding: '8px 16px',
          borderRadius: '6px',
          border: 'none',
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          width: '100%',
          justifyContent: 'center',
          '@media (min-width: 768px)': {
            width: 'auto',
          },
        }}>
          <Plus size={16} /> Post a Campaign
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '12px',
        marginBottom: '24px',
        '@media (min-width: 768px)': {
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
        },
      }}>
        <StatCard title="Total Creators" value={stats.total.toString()} color="#1a1a2e" icon={<Users size={20} />} />
        <StatCard title="Available" value={stats.available.toString()} color="#16a34a" icon={<UserCheck size={20} />} />
        <StatCard title="Avg Engagement" value={`${stats.avgEngagement.toFixed(1)}%`} color="#92400e" icon={<BarChart3 size={20} />} />
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginBottom: '24px',
        '@media (min-width: 768px)': {
          flexDirection: 'row',
          alignItems: 'center',
        },
      }}>
        <div style={{
          position: 'relative',
          flex: 1,
        }}>
          <Search size={16} style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#6b7280',
          }} />
          <input
            type="text"
            placeholder="Search creators..."
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <button style={{
          backgroundColor: '#f1f5f9',
          color: '#1a1a2e',
          padding: '8px 16px',
          borderRadius: '6px',
          border: '1px solid #e5e7eb',
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          width: '100%',
          justifyContent: 'center',
          '@media (min-width: 768px)': {
            width: 'auto',
          },
        }}>
          <Filter size={16} /> Filter
        </button>
      </div>

      {/* Creators Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '16px',
        '@media (min-width: 768px)': {
          gridTemplateColumns: 'repeat(2, 1fr)',
        },
        '@media (min-width: 1024px)': {
          gridTemplateColumns: 'repeat(3, 1fr)',
        },
      }}>
        {creators.map((creator) => (
          <Card key={creator.id} style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            overflow: 'hidden',
          }}>
            <CardContent style={{ padding: '16px' }}>
              <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '12px',
              }}>
                {/* Avatar */}
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#92400e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#F8F7F4',
                  fontSize: '16px',
                  fontWeight: 600,
                  flexShrink: 0,
                }}>
                  {(creator.user?.name?.[0] || 'C').toUpperCase()}
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    color: '#1a1a2e',
                    fontSize: '14px',
                    fontWeight: 600,
                    marginBottom: '2px',
                  }}>
                    {creator.user?.name || 'Creator'}
                  </div>
                  <div style={{
                    color: '#6b7280',
                    fontSize: '12px',
                  }}>
                    {creator.user?.email || 'email@example.com'}
                  </div>
                </div>

                {/* Status */}
                <span style={{
                  backgroundColor: (creator.followerCount || 0) > 10000 ? '#dcfce7' : '#f3f4f6',
                  color: (creator.followerCount || 0) > 10000 ? '#166534' : '#374151',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 500,
                }}>
                  {(creator.followerCount || 0) > 10000 ? 'Available' : 'New'}
                </span>
              </div>

              {/* Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                marginBottom: '12px',
                paddingBottom: '12px',
                borderBottom: '1px solid #f1f5f9',
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    color: '#1a1a2e',
                    fontSize: '16px',
                    fontWeight: 600,
                  }}>
                    {Math.round((creator.followerCount || 0) / 1000)}K
                  </div>
                  <div style={{
                    color: '#6b7280',
                    fontSize: '11px',
                  }}>
                    Followers
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    color: '#1a1a2e',
                    fontSize: '16px',
                    fontWeight: 600,
                  }}>
                    {creator.engagementRate || 0}%
                  </div>
                  <div style={{
                    color: '#6b7280',
                    fontSize: '11px',
                  }}>
                    Engagement
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    color: '#1a1a2e',
                    fontSize: '16px',
                    fontWeight: 600,
                  }}>
                    {(creator.categories as string[])?.length || 0}
                  </div>
                  <div style={{
                    color: '#6b7280',
                    fontSize: '11px',
                  }}>
                    Categories
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '4px',
                marginBottom: '12px',
              }}>
                {(creator.categories as string[])?.slice(0, 3).map((cat) => (
                  <span key={cat} style={{
                    backgroundColor: '#f3f4f6',
                    color: '#1a1a2e',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                  }}>
                    {cat}
                  </span>
                )) || <span style={{ fontSize: '12px', color: '#6b7280' }}>No categories</span>}
              </div>

              {/* Action */}
              <button style={{
                width: '100%',
                backgroundColor: '#92400e',
                color: '#F8F7F4',
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
              }}>
                View Profile
              </button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {creators.length === 0 && (
        <Card style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
        }}>
          <CardContent style={{
            padding: '48px 24px',
            textAlign: 'center',
            color: '#6b7280',
          }}>
            <Users size={48} style={{ color: '#d1d5db', marginBottom: '16px' }} />
            <p style={{ fontSize: '16px', marginBottom: '8px' }}>No creators yet</p>
            <p style={{ fontSize: '14px' }}>Creators will appear here when they join the platform.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatCard({ title, value, color, icon }: { title: string; value: string; color: string; icon: React.ReactNode }) {
  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '16px',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '4px',
      }}>
        <div style={{
          color: '#6b7280',
          fontSize: '12px',
          fontWeight: 600,
          textTransform: 'uppercase' as const,
        }}>
          {title}
        </div>
        <div style={{ color: '#92400e' }}>{icon}</div>
      </div>
      <div style={{
        color: color,
        fontSize: '24px',
        fontWeight: 600,
      }}>
        {value}
      </div>
    </div>
  );
}
