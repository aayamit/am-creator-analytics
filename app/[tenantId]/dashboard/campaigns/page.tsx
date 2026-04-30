/**
 * Campaign Management Page
 * Full CRUD for campaigns with real data
 */

import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Filter, Search, Edit, Trash2, Eye } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import ExportButtons from '@/components/reports/export-buttons';

export const metadata: Metadata = {
  title: 'Campaigns | AM Creator Analytics',
  description: 'Manage your campaigns',
};

export default async function CampaignsPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;

  // Fetch campaigns with creator count
  const campaigns = await prisma.campaign.findMany({
    where: { tenantId },
    include: {
      _count: {
        select: { creators: true },
      },
      brand: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  // Calculate summary stats
  const stats = {
    total: campaigns.length,
    active: campaigns.filter(c => c.status === 'ACTIVE').length,
    draft: campaigns.filter(c => c.status === 'DRAFT').length,
    completed: campaigns.filter(c => c.status === 'COMPLETED').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return { bg: '#dcfce7', text: '#166534' };
      case 'DRAFT': return { bg: '#fef3c7', text: '#92400e' };
      case 'COMPLETED': return { bg: '#dbeafe', text: '#1e40af' };
      case 'PAUSED': return { bg: '#fce7f3', text: '#9d174d' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
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
            Campaigns
          </h1>
          <p style={{
            color: '#92400e',
            fontSize: '14px',
            margin: 0,
          }}>
            Manage and track all your campaigns
          </p>
        </div>
        <Link
          href={`/${tenantId}/dashboard/campaigns/new`}
          style={{
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
            textDecoration: 'none',
            width: '100%',
            justifyContent: 'center',
            '@media (min-width: 768px)': {
              width: 'auto',
            },
          }}
        >
          <Plus size={16} /> New Campaign
        </Link>
      </div>

      {/* Export Buttons */}
      <div style={{ marginBottom: '24px' }}>
        <ExportButtons tenantId={tenantId} reportType="campaigns" />
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
        <StatCard title="Total Campaigns" value={stats.total.toString()} color="#1a1a2e" />
        <StatCard title="Active" value={stats.active.toString()} color="#16a34a" />
        <StatCard title="Draft" value={stats.draft.toString()} color="#92400e" />
        <StatCard title="Completed" value={stats.completed.toString()} color="#2563eb" />
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
            placeholder="Search campaigns..."
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
          '@media (min-width: 768px)': {
            width: 'auto',
          },
        }}>
          <Filter size={16} /> Filter
        </button>
      </div>

      {/* Campaigns Table */}
      <Card style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        overflow: 'hidden',
      }}>
        <CardHeader>
          <CardTitle style={{ color: '#1a1a2e', fontSize: '16px', fontWeight: 600 }}>
            All Campaigns ({campaigns.length})
          </CardTitle>
        </CardHeader>
        <CardContent style={{ padding: 0 }}>
          {campaigns.length === 0 ? (
            <div style={{
              padding: '48px 24px',
              textAlign: 'center',
              color: '#6b7280',
            }}>
              <p style={{ fontSize: '16px', marginBottom: '8px' }}>No campaigns yet</p>
              <p style={{ fontSize: '14px' }}>Create your first campaign to get started.</p>
              <Link
                href={`/${tenantId}/dashboard/campaigns/new`}
                style={{
                  display: 'inline-block',
                  marginTop: '16px',
                  backgroundColor: '#92400e',
                  color: '#F8F7F4',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                <Plus size={16} /> Create Campaign
              </Link>
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
                    <th style={thStyle}>Campaign</th>
                    <th style={thStyle}>Brand</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Creators</th>
                    <th style={thStyle}>Budget</th>
                    <th style={thStyle}>Dates</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => {
                    const statusColor = getStatusColor(campaign.status);
                    return (
                      <tr key={campaign.id} style={{
                        borderBottom: '1px solid #f1f5f9',
                        transition: 'background-color 0.2s',
                      }}>
                        <td style={tdStyle}>
                          <div>
                            <div style={{
                              color: '#1a1a2e',
                              fontSize: '14px',
                              fontWeight: 500,
                              marginBottom: '2px',
                            }}>
                              {campaign.name}
                            </div>
                            <div style={{
                              color: '#6b7280',
                              fontSize: '12px',
                            }}>
                              {campaign.description?.substring(0, 50) || 'No description'}
                            </div>
                          </div>
                        </td>
                        <td style={tdStyle}>
                          <span style={{
                            color: '#1a1a2e',
                            fontSize: '14px',
                          }}>
                            {campaign.brand?.companyName || 'Unknown'}
                          </span>
                        </td>
                        <td style={tdStyle}>
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
                        </td>
                        <td style={tdStyle}>
                          <span style={{
                            color: '#1a1a2e',
                            fontSize: '14px',
                            fontWeight: 500,
                          }}>
                            {campaign._count.creators}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <span style={{
                            color: '#1a1a2e',
                            fontSize: '14px',
                            fontWeight: 500,
                          }}>
                            Rs.{(campaign.budget || 0).toLocaleString('en-IN')}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <div style={{
                            color: '#6b7280',
                            fontSize: '12px',
                          }}>
                            {new Date(campaign.startDate).toLocaleDateString('en-IN')} - {new Date(campaign.endDate).toLocaleDateString('en-IN')}
                          </div>
                        </td>
                        <td style={tdStyle}>
                          <div style={{
                            display: 'flex',
                            gap: '8px',
                          }}>
                            <button style={actionButtonStyle}>
                              <Eye size={14} />
                            </button>
                            <button style={actionButtonStyle}>
                              <Edit size={14} />
                            </button>
                            <button style={{
                              ...actionButtonStyle,
                              color: '#dc2626',
                            }}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
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

const actionButtonStyle = {
  backgroundColor: 'transparent',
  border: '1px solid #e5e7eb',
  borderRadius: '4px',
  padding: '4px 8px',
  cursor: 'pointer',
  color: '#6b7280',
  display: 'flex',
  alignItems: 'center',
};
