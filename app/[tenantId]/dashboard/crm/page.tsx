/**
 * Brand CRM Page
 * View Nango-synced leads and CRM data
 */

import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Plus, Search, Filter, ExternalLink, RefreshCw } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'CRM | Brand | AM Creator Analytics',
  description: 'Manage CRM leads and sync data',
};

export default async function BrandCRMPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;

  // Fetch leads (using notifications as placeholder for now)
  const leads = await prisma.notification.findMany({
    where: {
      userId: {
        in: await prisma.user.findMany({
          where: { tenantId, role: 'BRAND' },
          select: { id: true },
        }).then(users => users.map(u => u.id)),
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  // Stats
  const stats = {
    total: leads.length,
    new: leads.filter(l => !l.isRead).length,
    contacted: 0, // Would come from CRM sync
    converted: 0, // Would come from CRM sync
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
            CRM
          </h1>
          <p style={{
            color: '#92400e',
            fontSize: '14px',
            margin: 0,
          }}>
            Manage leads and sync with Nango
          </p>
        </div>
        <div style={{
          display: 'flex',
          gap: '8px',
        }}>
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
          }}>
            <RefreshCw size={16} /> Sync Nango
          </button>
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
            <Plus size={16} /> Add Lead
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
        <StatCard title="Total Leads" value={stats.total.toString()} color="#1a1a2e" icon={<Users size={20} />} />
        <StatCard title="New" value={stats.new.toString()} color="#16a34a" icon={<Users size={20} />} />
        <StatCard title="Contacted" value={stats.contacted.toString()} color="#92400e" icon={<Users size={20} />} />
        <StatCard title="Converted" value={stats.converted.toString()} color="#2563eb" icon={<Users size={20} />} />
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
            placeholder="Search leads..."
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

      {/* Nango Integration Card */}
      <Card style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        marginBottom: '24px',
      }}>
        <CardHeader>
          <CardTitle style={{ color: '#1a1a2e', fontSize: '16px', fontWeight: 600 }}>
            Nango Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            <p style={{
              color: '#374151',
              fontSize: '14px',
              lineHeight: '1.6',
              margin: 0,
            }}>
              Connect your CRM (HubSpot, Pipedrive, Salesforce) via Nango self-hosted.
              This saves Rs.40K–1.6L/month vs Merge.dev.
            </p>
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
            }}>
              <span style={{
                backgroundColor: '#dcfce7',
                color: '#166534',
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 500,
              }}>
                HubSpot ✓
              </span>
              <span style={{
                backgroundColor: '#fef3c7',
                color: '#92400e',
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 500,
              }}>
                Pipedrive (pending)
              </span>
              <span style={{
                backgroundColor: '#fef3c7',
                color: '#92400e',
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 500,
              }}>
                Salesforce (pending)
              </span>
            </div>
            <a
              href="http://localhost:3003" // Nango dashboard
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#92400e',
                fontSize: '14px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              Open Nango Dashboard <ExternalLink size={14} />
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        overflow: 'hidden',
      }}>
        <CardHeader>
          <CardTitle style={{ color: '#1a1a2e', fontSize: '16px', fontWeight: 600 }}>
            Recent Leads ({leads.length})
          </CardTitle>
        </CardHeader>
        <CardContent style={{ padding: 0 }}>
          {leads.length === 0 ? (
            <div style={{
              padding: '48px 24px',
              textAlign: 'center',
              color: '#6b7280',
            }}>
              <Users size={48} style={{ color: '#d1d5db', marginBottom: '16px' }} />
              <p style={{ fontSize: '16px', marginBottom: '8px' }}>No leads yet</p>
              <p style={{ fontSize: '14px' }}>Sync your CRM via Nango to see leads here.</p>
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
                    <th style={thStyle}>Lead</th>
                    <th style={thStyle}>Source</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Date</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} style={{
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
                            {lead.title}
                          </div>
                          <div style={{
                            color: '#6b7280',
                            fontSize: '12px',
                          }}>
                            {lead.message}
                          </div>
                        </div>
                      </td>
                      <td style={tdStyle}>
                        <span style={{
                          color: '#1a1a2e',
                          fontSize: '14px',
                        }}>
                          Nango
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <span style={{
                          backgroundColor: lead.isRead ? '#f3f4f6' : '#dcfce7',
                          color: lead.isRead ? '#374151' : '#166534',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 500,
                        }}>
                          {lead.isRead ? 'CONTACTED' : 'NEW'}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <span style={{
                          color: '#6b7280',
                          fontSize: '12px',
                        }}>
                          {new Date(lead.createdAt).toLocaleDateString('en-IN')}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <button style={actionButtonStyle}>
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
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
  padding: '4px 12px',
  cursor: 'pointer',
  color: '#6b7280',
  fontSize: '12px',
};
