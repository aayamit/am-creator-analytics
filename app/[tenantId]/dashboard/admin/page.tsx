import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Users, TrendingUp, FileText, Plus, Send, BarChart3 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Agency Command Center | AM Creator Analytics',
  description: 'Multi-tenant agency dashboard',
};

const topCreators = [
  { id: '1', name: 'Priya Sharma', followers: '245K', revenue: '₹1.2L', margin: '21%', status: 'Active' },
  { id: '2', name: 'Arjun Kapoor', followers: '189K', revenue: '₹0.9L', margin: '18%', status: 'Active' },
  { id: '3', name: 'Tech Reviews', followers: '512K', revenue: '₹2.5L', margin: '24%', status: 'Active' },
  { id: '4', name: 'Fashion Forward', followers: '98K', revenue: '₹0.6L', margin: '15%', status: 'Pending' },
];

const recentActivity = [
  { id: 1, icon: '✅', text: 'Contract signed: Priya Sharma', time: '2 min ago' },
  { id: 2, icon: '💰', text: 'Bonus triggered: Creator-pro (₹1,500)', time: '5 min ago' },
  { id: 3, icon: '📊', text: 'New campaign: Tech Reviews Q2', time: '12 min ago' },
  { id: 4, icon: '🎯', text: 'Lead converted: Arjun Kapoor', time: '25 min ago' },
  { id: 5, icon: '📈', text: 'Margin alert: Brand X campaign at 28%', time: '1 hour ago' },
];

export default async function AgencyDashboardPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;

  return (
    <div style={{
      backgroundColor: '#F8F7F4',
      minHeight: '100vh',
      padding: '32px',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      {/* Header */}
      <header style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div>
            <h1 style={{ color: '#1a1a2e', fontSize: '28px', fontWeight: 600, marginBottom: '4px' }}>
              Agency Command Center
            </h1>
            <p style={{ color: '#92400e', fontSize: '14px', margin: 0 }}>
              Multi-tenant overview • {new Date().toLocaleDateString('en-IN')} • Tenant: {tenantId}
            </p>
          </div>
          <button
            style={{
              backgroundColor: '#92400e',
              color: '#F8F7F4',
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Plus size={16} /> New Campaign
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
        marginBottom: '32px',
      }}>
        <KPICard
          title="Total Revenue"
          value="₹17.8L"
          change="+12%"
          icon={<DollarSign size={20} />}
          accentColor="#1a1a2e"
        />
        <KPICard
          title="Active Creators"
          value="1,247"
          change="+8%"
          icon={<Users size={20} />}
          accentColor="#92400e"
        />
        <KPICard
          title="Avg Margin"
          value="21.4%"
          change="+3.2%"
          icon={<TrendingUp size={20} />}
          accentColor="#16a34a"
        />
        <KPICard
          title="Active Contracts"
          value="89"
          change="+15%"
          icon={<FileText size={20} />}
          accentColor="#2563eb"
        />
      </div>

      {/* Bottom Row: Top Creators + Activity */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.5fr 1fr',
        gap: '24px',
        marginBottom: '32px',
      }}>
        {/* Top Creators Table */}
        <Card style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
        }}>
          <CardHeader>
            <CardTitle style={{ color: '#1a1a2e', fontSize: '16px', fontWeight: 600 }}>
              Top Creators by Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ textAlign: 'left', padding: '12px 8px', color: '#1a1a2e', fontSize: '12px', fontWeight: 600 }}>Creator</th>
                  <th style={{ textAlign: 'left', padding: '12px 8px', color: '#1a1a2e', fontSize: '12px', fontWeight: 600 }}>Followers</th>
                  <th style={{ textAlign: 'left', padding: '12px 8px', color: '#1a1a2e', fontSize: '12px', fontWeight: 600 }}>Revenue</th>
                  <th style={{ textAlign: 'left', padding: '12px 8px', color: '#1a1a2e', fontSize: '12px', fontWeight: 600 }}>Margin</th>
                  <th style={{ textAlign: 'left', padding: '12px 8px', color: '#1a1a2e', fontSize: '12px', fontWeight: 600 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {topCreators.map((creator) => (
                  <tr key={creator.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 8px', color: '#1a1a2e', fontSize: '14px', fontWeight: 500 }}>{creator.name}</td>
                    <td style={{ padding: '12px 8px', color: '#1a1a2e', fontSize: '14px' }}>{creator.followers}</td>
                    <td style={{ padding: '12px 8px', color: '#1a1a2e', fontSize: '14px', fontWeight: 500 }}>{creator.revenue}</td>
                    <td style={{ padding: '12px 8px', color: '#1a1a2e', fontSize: '14px' }}>{creator.margin}</td>
                    <td style={{ padding: '12px 8px' }}>
                      <span style={{
                        backgroundColor: creator.status === 'Active' ? '#f0fdf4' : '#fef3c7',
                        color: creator.status === 'Active' ? '#16a34a' : '#92400e',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 500,
                      }}>
                        {creator.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
        }}>
          <CardHeader>
            <CardTitle style={{ color: '#1a1a2e', fontSize: '16px', fontWeight: 600 }}>
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 0',
                    borderBottom: '1px solid #f1f5f9',
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{activity.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, color: '#1a1a2e', fontSize: '14px' }}>{activity.text}</p>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '12px' }}>{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
      }}>
        <CardHeader>
          <CardTitle style={{ color: '#1a1a2e', fontSize: '16px', fontWeight: 600 }}>
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
          }}>
            <button
              style={{
                backgroundColor: '#1a1a2e',
                color: '#F8F7F4',
                padding: '12px 20px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Plus size={16} /> Create Campaign
            </button>
            <button
              style={{
                backgroundColor: '#92400e',
                color: '#F8F7F4',
                padding: '12px 20px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Send size={16} /> Send Contract
            </button>
            <button
              style={{
                backgroundColor: '#f1f5f9',
                color: '#1a1a2e',
                padding: '12px 20px',
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <BarChart3 size={16} /> View Reports
            </button>
            <button
              style={{
                backgroundColor: '#f1f5f9',
                color: '#1a1a2e',
                padding: '12px 20px',
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Users size={16} /> Manage Creators
            </button>
          </div>
        </CardContent>
      </Card>
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
  const isPositive = change.startsWith('+');
  return (
    <Card style={{
      backgroundColor: '#FFFFFF',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
    }}>
      <CardContent style={{ padding: '20px' }}>
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
      </CardContent>
    </Card>
  );
}
