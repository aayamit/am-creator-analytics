/**
 * Campaign Detail Page
 * View campaign details, creators, and performance
 */

import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, Edit, Trash2, Send, BarChart3 } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Campaign Details | AM Creator Analytics',
  description: 'View campaign details and performance',
};

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ tenantId: string; id: string }>;
}) {
  const { tenantId, id } = await params;

  // Fetch campaign with related data
  const campaign = await prisma.campaign.findUnique({
    where: { id, tenantId },
    include: {
      brand: true,
      creators: {
        include: {
          creator: {
            include: { user: true },
          },
        },
      },
      _count: {
        select: { creators: true },
      },
    },
  });

  if (!campaign) {
    return (
      <div style={{
        backgroundColor: '#F8F7F4',
        minHeight: '100vh',
        padding: '32px',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        textAlign: 'center',
        color: '#6b7280',
      }}>
        <h1 style={{ color: '#1a1a2e', fontSize: '24px' }}>Campaign not found</h1>
        <Link href={`/${tenantId}/dashboard/campaigns`} style={{
          color: '#92400e',
          textDecoration: 'none',
          fontSize: '14px',
        }}>
          ← Back to Campaigns
        </Link>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return { bg: '#dcfce7', text: '#166534' };
      case 'DRAFT': return { bg: '#fef3c7', text: '#92400e' };
      case 'COMPLETED': return { bg: '#dbeafe', text: '#1e40af' };
      case 'PAUSED': return { bg: '#fce7f3', text: '#9d174d' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  const statusColor = getStatusColor(campaign.status);

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
          <Link
            href={`/${tenantId}/dashboard/campaigns`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#92400e',
              fontSize: '14px',
              textDecoration: 'none',
              marginBottom: '8px',
            }}
          >
            <ArrowLeft size={16} /> Back to Campaigns
          </Link>
          <h1 style={{
            color: '#1a1a2e',
            fontSize: '24px',
            fontWeight: 600,
            marginBottom: '4px',
            '@media (min-width: 768px)': {
              fontSize: '28px',
            },
          }}>
            {campaign.name}
          </h1>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{
              backgroundColor: statusColor.bg,
              color: statusColor.text,
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 500,
            }}>
              {campaign.status}
            </span>
            <span style={{
              color: '#92400e',
              fontSize: '14px',
            }}>
              {campaign.brand?.companyName || 'Unknown Brand'}
            </span>
          </div>
        </div>
        <div style={{
          display: 'flex',
          gap: '8px',
        }}>
          <Link
            href={`/${tenantId}/dashboard/campaigns/${id}/edit`}
            style={{
              backgroundColor: '#f1f5f9',
              color: '#1a1a2e',
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #e5e7eb',
              fontSize: '14px',
              fontWeight: 500,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Edit size={16} /> Edit
          </Link>
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
          }}>
            <Send size={16} /> Send Contracts
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '12px',
        marginBottom: '24px',
        '@media (min-width: 768px)': {
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
        },
      }}>
        <StatCard title="Creators" value={campaign._count.creators.toString()} color="#1a1a2e" />
        <StatCard title="Budget" value={`Rs.${(campaign.budget || 0).toLocaleString('en-IN')}`} color="#92400e" />
        <StatCard title="Start Date" value={new Date(campaign.startDate).toLocaleDateString('en-IN')} color="#16a34a" />
        <StatCard title="End Date" value={new Date(campaign.endDate).toLocaleDateString('en-IN')} color="#2563eb" />
      </div>

      {/* Creators List */}
      <Card style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        marginBottom: '24px',
      }}>
        <CardHeader>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <CardTitle style={{ color: '#1a1a2e', fontSize: '16px', fontWeight: 600 }}>
              Creators ({campaign.creators.length})
            </CardTitle>
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
            }}>
              <Plus size={16} /> Add Creator
            </button>
          </div>
        </CardHeader>
        <CardContent style={{ padding: 0 }}>
          {campaign.creators.length === 0 ? (
            <div style={{
              padding: '48px 24px',
              textAlign: 'center',
              color: '#6b7280',
            }}>
              <p style={{ fontSize: '16px', marginBottom: '8px' }}>No creators added yet</p>
              <p style={{ fontSize: '14px' }}>Add creators to this campaign to get started.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                minWidth: '800px',
              }}>
                <thead>
                  <tr style={{
                    backgroundColor: '#f9fafb',
                    borderBottom: '2px solid #e5e7eb',
                  }}>
                    <th style={thStyle}>Creator</th>
                    <th style={thStyle}>Followers</th>
                    <th style={thStyle}>Engagement</th>
                    <th style={thStyle}>Contract Status</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {campaign.creators.map((cc) => (
                    <tr key={cc.id} style={{
                      borderBottom: '1px solid #f1f5f9',
                    }}>
                      <td style={tdStyle}>
                        <div>
                          <div style={{
                            color: '#1a1a2e',
                            fontSize: '14px',
                            fontWeight: 500,
                            marginBottom: '2px',
                          }}>
                            {cc.creator.user?.name || 'Unknown'}
                          </div>
                          <div style={{
                            color: '#6b7280',
                            fontSize: '12px',
                          }}>
                            {cc.creator.user?.email}
                          </div>
                        </div>
                      </td>
                      <td style={tdStyle}>
                        <span style={{
                          color: '#1a1a2e',
                          fontSize: '14px',
                          fontWeight: 500,
                        }}>
                          {Math.round((cc.creator.followerCount || 0) / 1000)}K
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <span style={{
                          color: '#1a1a2e',
                          fontSize: '14px',
                        }}>
                          {cc.creator.engagementRate || 0}%
                        </span>
                      </td>
                      <td style={tdStyle}>
                        {cc.contract ? (
                          <span style={{
                            backgroundColor: '#dcfce7',
                            color: '#166534',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 500,
                          }}>
                            {cc.contract.status}
                          </span>
                        ) : (
                          <button style={{
                            backgroundColor: '#92400e',
                            color: '#F8F7F4',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            border: 'none',
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}>
                            Create Contract
                          </button>
                        )}
                      </td>
                      <td style={tdStyle}>
                        <div style={{
                          display: 'flex',
                          gap: '8px',
                        }}>
                          <button style={actionBtnStyle}>
                            <Eye size={14} />
                          </button>
                          <button style={{
                            ...actionBtnStyle,
                            color: '#dc2626',
                          }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Campaign Details */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '16px',
        '@media (min-width: 768px)': {
          gridTemplateColumns: '1fr 1fr',
        },
      }}>
        <Card style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
        }}>
          <CardHeader>
            <CardTitle style={{ color: '#1a1a2e', fontSize: '16px', fontWeight: 600 }}>
              Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p style={{
              color: '#374151',
              fontSize: '14px',
              lineHeight: '1.6',
            }}>
              {campaign.description || 'No description provided.'}
            </p>
          </CardContent>
        </Card>

        <Card style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
        }}>
          <CardHeader>
            <CardTitle style={{ color: '#1a1a2e', fontSize: '16px', fontWeight: 600 }}>
              Platforms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
            }}>
              {(campaign.platforms as string[])?.map((platform) => (
                <span key={platform} style={{
                  backgroundColor: '#f3f4f6',
                  color: '#1a1a2e',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  fontSize: '14px',
                }}>
                  {platform}
                </span>
              )) || (
                <span style={{ color: '#6b7280', fontSize: '14px' }}>
                  No platforms specified
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string; value: string; color: string }) {
  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '16px',
    }}>
      <div style={{
        color: '#6b7280',
        fontSize: '12px',
        fontWeight: 600,
        textTransform: 'uppercase' as const,
        marginBottom: '4px',
      }}>
        {title}
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

const thStyle = {
  textAlign: 'left' as const,
  padding: '12px 16px',
  color: '#1a1a2e',
  fontSize: '12px',
  fontWeight: 600,
  textTransform: 'uppercase' as const,
};

const tdStyle = {
  padding: '16px',
  color: '#1a1a2e',
  fontSize: '14px',
};

const actionBtnStyle = {
  backgroundColor: 'transparent',
  border: '1px solid #e5e7eb',
  borderRadius: '4px',
  padding: '4px 8px',
  cursor: 'pointer',
  color: '#6b7280',
  display: 'flex',
  alignItems: 'center',
};

function Eye({ size }: { size: number }) {
  return <span>👁️</span>;
}
