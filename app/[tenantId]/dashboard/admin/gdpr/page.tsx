/**
 * Admin GDPR Page
 * Manage DPDPA/GDPR requests and compliance
 */

import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, CheckCircle, Clock, XCircle, Filter, Search } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/nextauth';

export const metadata: Metadata = {
  title: 'GDPR | Admin | AM Creator Analytics',
  description: 'Manage DPDPA and GDPR requests',
};

export default async function AdminGDPRPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <div>Unauthorized</div>;
  }

  // Fetch DPDPA requests (using notifications as placeholder)
  // First get user IDs for this tenant
  const tenantUsers = await prisma.user.findMany({
    where: { tenantId },
    select: { id: true },
  });
  const tenantUserIds = tenantUsers.map(u => u.id);

  // Then fetch requests
  const requests = await prisma.dPDPARequest.findMany({
    where: { userId: { in: tenantUserIds } },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  // Stats
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'PENDING').length,
    approved: requests.filter(r => r.status === 'APPROVED').length,
    completed: requests.filter(r => r.status === 'COMPLETED').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
      case 'COMPLETED':
        return { bg: '#dcfce7', text: '#166534' };
      case 'PENDING':
        return { bg: '#fef3c7', text: '#92400e' };
      case 'REJECTED':
        return { bg: '#fee2e2', text: '#dc2626' };
      default:
        return { bg: '#f3f4f6', text: '#374151' };
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
            DPDPA / GDPR
          </h1>
          <p style={{
            color: '#92400e',
            fontSize: '14px',
            margin: 0,
          }}>
            Manage data protection requests and compliance
          </p>
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
        <StatCard title="Total Requests" value={stats.total.toString()} color="#1a1a2e" icon={<Shield size={20} />} />
        <StatCard title="Pending" value={stats.pending.toString()} color="#92400e" icon={<Clock size={20} />} />
        <StatCard title="Approved" value={stats.approved.toString()} color="#16a34a" icon={<CheckCircle size={20} />} />
        <StatCard title="Completed" value={stats.completed.toString()} color="#2563eb" icon={<CheckCircle size={20} />} />
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
            placeholder="Search requests..."
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

      {/* Requests Table */}
      <Card style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        overflow: 'hidden',
      }}>
        <CardHeader>
          <CardTitle style={{ color: '#1a1a2e', fontSize: '16px', fontWeight: 600 }}>
            DPDPA Requests ({requests.length})
          </CardTitle>
        </CardHeader>
        <CardContent style={{ padding: 0 }}>
          {requests.length === 0 ? (
            <div style={{
              padding: '48px 24px',
              textAlign: 'center',
              color: '#6b7280',
            }}>
              <Shield size={48} style={{ color: '#d1d5db', marginBottom: '16px' }} />
              <p style={{ fontSize: '16px', marginBottom: '8px' }}>No DPDPA requests yet</p>
              <p style={{ fontSize: '14px' }}>Requests will appear here when users submit them.</p>
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
                    <th style={thStyle}>User</th>
                    <th style={thStyle}>Request Type</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Date</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => {
                    const statusColor = getStatusColor(request.status);
                    return (
                      <tr key={request.id} style={{
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
                              User ID: {request.userId.substring(0, 8)}...
                            </div>
                          </div>
                        </td>
                        <td style={tdStyle}>
                          <span style={{
                            color: '#1a1a2e',
                            fontSize: '14px',
                          }}>
                            {request.requestType}
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
                            {request.status}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <span style={{
                            color: '#6b7280',
                            fontSize: '12px',
                          }}>
                            {new Date(request.createdAt).toLocaleDateString('en-IN')}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <div style={{
                            display: 'flex',
                            gap: '8px',
                          }}>
                            {request.status === 'PENDING' && (
                              <>
                                <button style={actionButtonStyle}>
                                  Approve
                                </button>
                                <button style={{
                                  ...actionButtonStyle,
                                  color: '#dc2626',
                                }}>
                                  Reject
                                </button>
                              </>
                            )}
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

      {/* Info Card */}
      <Card style={{
        backgroundColor: '#fef3c7',
        border: '1px solid #f59e0b',
        borderRadius: '8px',
        marginTop: '24px',
      }}>
        <CardContent style={{ padding: '16px' }}>
          <div style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start',
          }}>
            <Shield size={20} style={{ color: '#92400e', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{
                color: '#92400e',
                fontSize: '14px',
                fontWeight: 600,
                marginBottom: '4px',
              }}>
                About DPDPA Compliance
              </div>
              <p style={{
                color: '#92400e',
                fontSize: '12px',
                lineHeight: '1.5',
                margin: 0,
              }}>
                The Digital Personal Data Protection Act (DPDPA) 2023 is India's data protection law.
                Users have the right to access, correct, and erase their personal data.
                This page helps you manage user requests in compliance with the law.
              </p>
            </div>
          </div>
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
  padding: '4px 8px',
  cursor: 'pointer',
  color: '#6b7280',
  fontSize: '12px',
};
