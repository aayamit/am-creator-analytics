/**
 * Contract Management Page
 * List all contracts with status, send for signing
 */

import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Plus, Filter, Search, CheckCircle, Clock, XCircle, Send } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contracts | AM Creator Analytics',
  description: 'Manage your contracts',
};

export default async function ContractsPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;

  // Fetch contracts with related data
  const contracts = await prisma.contract.findMany({
    where: { tenantId },
    include: {
      campaignCreator: {
        include: {
          campaign: true,
          creator: {
            include: { user: true },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Calculate stats
  const stats = {
    total: contracts.length,
    signed: contracts.filter(c => c.status === 'SIGNED').length,
    pending: contracts.filter(c => c.status === 'SENT' || c.status === 'VIEWED').length,
    draft: contracts.filter(c => c.status === 'DRAFT').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SIGNED': return { bg: '#dcfce7', text: '#166534' };
      case 'SENT': return { bg: '#dbeafe', text: '#1e40af' };
      case 'VIEWED': return { bg: '#fef3c7', text: '#92400e' };
      case 'DRAFT': return { bg: '#f3f4f6', text: '#374151' };
      case 'DECLINED': return { bg: '#fce7f3', text: '#9d174d' };
      case 'EXPIRED': return { bg: '#fee2e2', text: '#dc2626' };
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
            Contracts
          </h1>
          <p style={{
            color: '#92400e',
            fontSize: '14px',
            margin: 0,
          }}>
            Manage and track all your contracts
          </p>
        </div>
        <Link
          href={`/${tenantId}/dashboard/contracts/new`}
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
          <Plus size={16} /> New Contract
        </Link>
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
        <StatCard title="Total Contracts" value={stats.total.toString()} color="#1a1a2e" />
        <StatCard title="Signed" value={stats.signed.toString()} color="#16a34a" />
        <StatCard title="Pending" value={stats.pending.toString()} color="#2563eb" />
        <StatCard title="Draft" value={stats.draft.toString()} color="#6b7280" />
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
            placeholder="Search contracts..."
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

      {/* Contracts Table */}
      <Card style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        overflow: 'hidden',
      }}>
        <CardHeader>
          <CardTitle style={{ color: '#1a1a2e', fontSize: '16px', fontWeight: 600 }}>
            All Contracts ({contracts.length})
          </CardTitle>
        </CardHeader>
        <CardContent style={{ padding: 0 }}>
          {contracts.length === 0 ? (
            <div style={{
              padding: '48px 24px',
              textAlign: 'center',
              color: '#6b7280',
            }}>
              <p style={{ fontSize: '16px', marginBottom: '8px' }}>No contracts yet</p>
              <p style={{ fontSize: '14px' }}>Create your first contract to get started.</p>
              <Link
                href={`/${tenantId}/dashboard/contracts/new`}
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
                <Plus size={16} /> Create Contract
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
                    <th style={thStyle}>Contract</th>
                    <th style={thStyle}>Creator</th>
                    <th style={thStyle}>Campaign</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Amount</th>
                    <th style={thStyle}>Date</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.map((contract) => {
                    const statusColor = getStatusColor(contract.status);
                    return (
                      <tr key={contract.id} style={{
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
                              {contract.title}
                            </div>
                            <div style={{
                              color: '#6b7280',
                              fontSize: '12px',
                            }}>
                              ID: {contract.id.substring(0, 8)}...
                            </div>
                          </div>
                        </td>
                        <td style={tdStyle}>
                          <span style={{
                            color: '#1a1a2e',
                            fontSize: '14px',
                          }}>
                            {contract.campaignCreator?.creator?.user?.name || 'Unknown'}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <span style={{
                            color: '#1a1a2e',
                            fontSize: '14px',
                          }}>
                            {contract.campaignCreator?.campaign?.name || 'Unknown'}
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
                            {contract.status}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <span style={{
                            color: '#1a1a2e',
                            fontSize: '14px',
                            fontWeight: 500,
                          }}>
                            Rs.{(contract.amount || 0).toLocaleString('en-IN')}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <div style={{
                            color: '#6b7280',
                            fontSize: '12px',
                          }}>
                            {new Date(contract.createdAt).toLocaleDateString('en-IN')}
                          </div>
                        </td>
                        <td style={tdStyle}>
                          <div style={{
                            display: 'flex',
                            gap: '8px',
                          }}>
                            <Link
                              href={`/${tenantId}/dashboard/contracts/${contract.id}`}
                              style={{
                                ...actionButtonStyle,
                                textDecoration: 'none',
                              }}
                            >
                              <Eye size={14} />
                            </Link>
                            {contract.status === 'DRAFT' && (
                              <button style={actionButtonStyle}>
                                <Send size={14} />
                              </button>
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

function Eye({ size }: { size: number }) {
  return <span>👁️</span>;
}
