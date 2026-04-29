/**
 * Admin Audit Logs Page
 * Track all admin actions for compliance
 */

import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Search, Filter, Shield, Download } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/nextauth';

export const metadata: Metadata = {
  title: 'Audit Logs | Admin | AM Creator Analytics',
  description: 'Track admin actions and system changes',
};

export default async function AdminAuditLogsPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <div>Unauthorized</div>;
  }

  // Fetch audit logs (using notifications as audit trail for now)
  const logs = await prisma.notification.findMany({
    where: {
      userId: { in: await prisma.user.findMany({
        where: { tenantId, role: 'ADMIN' },
        select: { id: true },
      }).then(users => users.map(u => u.id))),
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  const getActionIcon = (type: string) => {
    if (type.includes('CONTRACT')) return '📄';
    if (type.includes('PAYOUT')) return '💰';
    if (type.includes('DPDPA')) return '🔒';
    if (type.includes('CAMPAIGN')) return '📢';
    return '🔔';
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
            Audit Logs
          </h1>
          <p style={{
            color: '#92400e',
            fontSize: '14px',
            margin: 0,
          }}>
            Track all admin actions and system changes
          </p>
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
          <Download size={16} /> Export Logs
        </button>
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
            placeholder="Search logs..."
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

      {/* Logs Table */}
      <Card style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        overflow: 'hidden',
      }}>
        <CardHeader>
          <CardTitle style={{ color: '#1a1a2e', fontSize: '16px', fontWeight: 600 }}>
            Recent Activity ({logs.length})
          </CardTitle>
        </CardHeader>
        <CardContent style={{ padding: 0 }}>
          {logs.length === 0 ? (
            <div style={{
              padding: '48px 24px',
              textAlign: 'center',
              color: '#6b7280',
            }}>
              <Shield size={48} style={{ color: '#d1d5db', marginBottom: '16px' }} />
              <p style={{ fontSize: '16px', marginBottom: '8px' }}>No audit logs yet</p>
              <p style={{ fontSize: '14px' }}>Admin actions will appear here.</p>
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
                    <th style={thStyle}>Action</th>
                    <th style={thStyle}>Details</th>
                    <th style={thStyle}>User</th>
                    <th style={thStyle}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} style={{
                      borderBottom: '1px solid #f1f5f9',
                    }}>
                      <td style={tdStyle}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}>
                          <span style={{ fontSize: '16px' }}>
                            {getActionIcon(log.type)}
                          </span>
                          <span style={{
                            color: '#1a1a2e',
                            fontSize: '14px',
                            fontWeight: 500,
                          }}>
                            {log.type.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </td>
                      <td style={tdStyle}>
                        <span style={{
                          color: '#374151',
                          fontSize: '14px',
                        }}>
                          {log.title}
                        </span>
                        <div style={{
                          color: '#6b7280',
                          fontSize: '12px',
                          marginTop: '2px',
                        }}>
                          {log.message}
                        </div>
                      </td>
                      <td style={tdStyle}>
                        <span style={{
                          color: '#1a1a2e',
                          fontSize: '14px',
                        }}>
                          {log.userId.substring(0, 8)}...
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <span style={{
                          color: '#6b7280',
                          fontSize: '12px',
                        }}>
                          {new Date(log.createdAt).toLocaleString('en-IN')}
                        </span>
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

const thStyle = {
  textAlign: 'left' as const,
  padding: '12px 16px',
  color: '#1a1a2e',
  fontSize: '12px',
  fontWeight: 600,
  textTransform: 'uppercase' as const,
};

const tdStyle = {
  padding: '12px 16px',
  color: '#1a1a2e',
  fontSize: '14px',
};
