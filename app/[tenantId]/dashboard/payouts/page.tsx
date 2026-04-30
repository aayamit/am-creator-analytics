/**
 * Creator Payouts Page
 * View payout history and set up Stripe Connect
 */

import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, Plus, Download, CheckCircle, Clock, AlertCircle, ExternalLink } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/nextauth';

export const metadata: Metadata = {
  title: 'Payouts | Creator | AM Creator Analytics',
  description: 'Manage your payouts and Stripe Connect',
};

export default async function CreatorPayoutsPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <div>Unauthorized</div>;
  }

  // Fetch creator profile with payouts
  const creatorProfile = await prisma.creatorProfile.findFirst({
    where: { userId: session.user.id },
    include: {
      payouts: {
        orderBy: { createdAt: 'desc' },
        take: 50,
      },
    },
  });

  if (!creatorProfile) {
    return (
      <div style={{
        backgroundColor: '#F8F7F4',
        minHeight: '100vh',
        padding: '32px',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        textAlign: 'center',
        color: '#6b7280',
      }}>
        <h1 style={{ color: '#1a1a2e', fontSize: '24px' }}>Creator Profile Not Found</h1>
        <p>Complete your creator profile to view payouts.</p>
      </div>
    );
  }

  const payouts = creatorProfile.payouts || [];
  const totalEarnings = payouts
    .filter(p => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payouts
    .filter(p => p.status === 'PENDING')
    .reduce((sum, p) => sum + p.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return { bg: '#dcfce7', text: '#166534' };
      case 'PENDING': return { bg: '#fef3c7', text: '#92400e' };
      case 'FAILED': return { bg: '#fee2e2', text: '#dc2626' };
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
            Payouts
          </h1>
          <p style={{
            color: '#92400e',
            fontSize: '14px',
            margin: 0,
          }}>
            Manage your earnings and payout methods
          </p>
        </div>
        {!creatorProfile.stripeConnectId ? (
          <a
            href={`/${tenantId}/dashboard/settings`}
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
            <ExternalLink size={16} /> Set Up Stripe Connect
          </a>
        ) : (
          <button
            onClick={() => alert('Withdrawal request submitted!')}
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
              width: '100%',
              justifyContent: 'center',
              '@media (min-width: 768px)': {
                width: 'auto',
              },
            }}
          >
            <Plus size={16} /> Request Withdrawal
          </button>
        )}
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
        <StatCard title="Total Earnings" value={`Rs.${totalEarnings.toLocaleString('en-IN')}`} color="#1a1a2e" icon={<Wallet size={20} />} />
        <StatCard title="Pending" value={`Rs.${pendingAmount.toLocaleString('en-IN')}`} color="#92400e" icon={<Clock size={20} />} />
        <StatCard title="Payouts" value={payouts.length.toString()} color="#16a34a" icon={<CheckCircle size={20} />} />
      </div>

      {/* Stripe Connect Status */}
      <Card style={{
        backgroundColor: creatorProfile.stripeConnectId ? '#dcfce7' : '#fef3c7',
        border: `1px solid ${creatorProfile.stripeConnectId ? '#bbf7d0' : '#f59e0b'}`,
        borderRadius: '8px',
        marginBottom: '24px',
      }}>
        <CardContent style={{ padding: '16px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            {creatorProfile.stripeConnectId ? (
              <CheckCircle size={20} style={{ color: '#166534' }} />
            ) : (
              <AlertCircle size={20} style={{ color: '#92400e' }} />
            )}
            <div>
              <div style={{
                color: creatorProfile.stripeConnectId ? '#166534' : '#92400e',
                fontSize: '14px',
                fontWeight: 600,
              }}>
                {creatorProfile.stripeConnectId ? 'Stripe Connect Active' : 'Stripe Connect Not Set Up'}
              </div>
              <div style={{
                color: creatorProfile.stripeConnectId ? '#166534' : '#92400e',
                fontSize: '12px',
              }}>
                {creatorProfile.stripeConnectId
                  ? `Connected with ID: ${creatorProfile.stripeConnectId.substring(0, 12)}...`
                  : 'Set up Stripe Connect to receive payouts'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payouts Table */}
      <Card style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        overflow: 'hidden',
      }}>
        <CardHeader>
          <CardTitle style={{ color: '#1a1a2e', fontSize: '16px', fontWeight: 600 }}>
            Payout History ({payouts.length})
          </CardTitle>
        </CardHeader>
        <CardContent style={{ padding: 0 }}>
          {payouts.length === 0 ? (
            <div style={{
              padding: '48px 24px',
              textAlign: 'center',
              color: '#6b7280',
            }}>
              <Wallet size={48} style={{ color: '#d1d5db', marginBottom: '16px' }} />
              <p style={{ fontSize: '16px', marginBottom: '8px' }}>No payouts yet</p>
              <p style={{ fontSize: '14px' }}>Complete campaigns and set up Stripe Connect to receive payouts.</p>
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
                    <th style={thStyle}>Description</th>
                    <th style={thStyle}>Amount</th>
                    <th style={thStyle}>Method</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((payout) => {
                    const statusColor = getStatusColor(payout.status);
                    return (
                      <tr key={payout.id} style={{
                        borderBottom: '1px solid #f1f5f9',
                      }}>
                        <td style={tdStyle}>
                          <div style={{
                            color: '#1a1a2e',
                            fontSize: '14px',
                            fontWeight: 500,
                          }}>
                            {payout.description || 'Payout'}
                          </div>
                          <div style={{
                            color: '#6b7280',
                            fontSize: '12px',
                          }}>
                            ID: {payout.id.substring(0, 8)}...
                          </div>
                        </td>
                        <td style={tdStyle}>
                          <span style={{
                            color: '#1a1a2e',
                            fontSize: '14px',
                            fontWeight: 500,
                          }}>
                            Rs.{payout.amount.toLocaleString('en-IN')}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <span style={{
                            color: '#1a1a2e',
                            fontSize: '14px',
                          }}>
                            {payout.method || 'Bank Transfer'}
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
                            {payout.status}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <span style={{
                            color: '#6b7280',
                            fontSize: '12px',
                          }}>
                            {new Date(payout.createdAt).toLocaleDateString('en-IN')}
                          </span>
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
