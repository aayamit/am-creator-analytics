import { Wallet, TrendingUp, Download, DollarSign } from 'lucide-react';

export default function EarningsPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const transactions = [
    {
      id: '1',
      date: '2026-04-28',
      campaign: 'Summer Collection Launch',
      creator: 'Priya Sharma',
      amount: 'Rs.45,000',
      status: 'Completed',
    },
    {
      id: '2',
      date: '2026-04-25',
      campaign: 'Tech Reviews Q2',
      creator: 'Arjun Kapoor',
      amount: 'Rs.32,500',
      status: 'Completed',
    },
    {
      id: '3',
      date: '2026-04-22',
      campaign: 'Fitness Challenge',
      creator: 'Tech Reviews',
      amount: 'Rs.75,000',
      status: 'Pending',
    },
  ];

  return (
    <div style={{
      backgroundColor: '#F8F7F4',
      minHeight: '100vh',
      padding: '32px',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '32px',
      }}>
        <div>
          <h1 style={{
            color: '#1a1a2e',
            fontSize: '28px',
            fontWeight: 600,
            marginBottom: '4px',
          }}>
            Earnings
          </h1>
          <p style={{
            color: '#92400e',
            fontSize: '14px',
            margin: 0,
          }}>
            Track your earnings and payouts
          </p>
        </div>
        <button style={{
          backgroundColor: '#1a1a2e',
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
          <Download size={16} /> Export
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
        marginBottom: '32px',
      }}>
        <KPICard title="Total Earnings" value="Rs.15.2L" change="+18%" icon={<Wallet size={20} />} accentColor="#1a1a2e" />
        <KPICard title="Pending" value="Rs.3.2L" change="+5%" icon={<DollarSign size={20} />} accentColor="#92400e" />
        <KPICard title="This Month" value="Rs.4.8L" change="+22%" icon={<TrendingUp size={20} />} accentColor="#16a34a" />
        <KPICard title="Avg per Campaign" value="Rs.1.3L" change="+8%" icon={<DollarSign size={20} />} accentColor="#2563eb" />
      </div>

      {/* Transactions Table */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        overflow: 'hidden',
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
        }}>
          <thead>
            <tr style={{
              backgroundColor: '#f9fafb',
              borderBottom: '2px solid #e5e7eb',
            }}>
              <th style={{
                textAlign: 'left',
                padding: '12px 16px',
                color: '#1a1a2e',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase' as const,
              }}>Date</th>
              <th style={{
                textAlign: 'left',
                padding: '12px 16px',
                color: '#1a1a2e',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase' as const,
              }}>Campaign</th>
              <th style={{
                textAlign: 'left',
                padding: '12px 16px',
                color: '#1a1a2e',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase' as const,
              }}>Creator</th>
              <th style={{
                textAlign: 'left',
                padding: '12px 16px',
                color: '#1a1a2e',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase' as const,
              }}>Amount</th>
              <th style={{
                textAlign: 'left',
                padding: '12px 16px',
                color: '#1a1a2e',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase' as const,
              }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr
                key={tx.id}
                style={{
                  borderBottom: '1px solid #f1f5f9',
                  cursor: 'pointer',
                }}
              >
                <td style={{
                  padding: '16px',
                  color: '#6b7280',
                  fontSize: '14px',
                }}>
                  {tx.date}
                </td>
                <td style={{
                  padding: '16px',
                  color: '#1a1a2e',
                  fontSize: '14px',
                  fontWeight: 500,
                }}>
                  {tx.campaign}
                </td>
                <td style={{
                  padding: '16px',
                  color: '#1a1a2e',
                  fontSize: '14px',
                }}>
                  {tx.creator}
                </td>
                <td style={{
                  padding: '16px',
                  color: '#1a1a2e',
                  fontSize: '14px',
                  fontWeight: 500,
                }}>
                  {tx.amount}
                </td>
                <td style={{ padding: '16px' }}>
                  <span style={{
                    backgroundColor: tx.status === 'Completed' ? '#f0fdf4' : '#fef3c7',
                    color: tx.status === 'Completed' ? '#16a34a' : '#92400e',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 500,
                  }}>
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KPICard({
  title,
  value,
  change,
  icon,
  accentColor,
}: {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  accentColor?: string;
}) {
  const isPositive = !change.startsWith('-');
  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '20px',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
      }}>
        <span style={{ color: '#1a1a2e', fontSize: '14px', fontWeight: 500 }}>{title}</span>
        <span style={{ color: accentColor || '#1a1a2e' }}>{icon}</span>
      </div>
      <div style={{
        color: '#1a1a2e',
        fontSize: '28px',
        fontWeight: 600,
        marginBottom: '8px',
      }}>
        {value}
      </div>
      <div style={{
        color: isPositive ? '#16a34a' : '#dc2626',
        fontSize: '12px',
        fontWeight: 500,
      }}>
        {change} vs last period
      </div>
    </div>
  );
}
