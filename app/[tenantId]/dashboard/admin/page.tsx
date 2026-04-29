import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Users, TrendingUp, FileText, Plus, Send, BarChart3 } from 'lucide-react';
import RevenueMarginChart from '@/components/dashboard/charts';
import CreatorGrowthChart from '@/components/dashboard/charts';
import RevenueForecast from '@/components/analytics/revenue-forecast';
import RetentionCurve from '@/components/analytics/retention-curve';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Agency Command Center | AM Creator Analytics',
  description: 'Multi-tenant agency dashboard',
};

export default async function AgencyDashboardPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;

  // Fetch real data from database
  const [campaigns, contracts, creators] = await Promise.all([
    prisma.campaign.findMany({
      where: { tenantId },
      include: { _count: { select: { creators: true } } },
    }),
    prisma.contract.findMany({
      where: { campaignCreator: { campaign: { tenantId } } },
      include: { campaignCreator: { include: { creator: true } } },
    }),
    prisma.creatorProfile.findMany({
      where: { user: { tenantId } },
      take: 10,
    }),
  ]);

  // Calculate KPIs
  const totalRevenue = contracts.reduce((sum, c) => sum + (c.amount || 0), 0);
  const activeContracts = contracts.filter(c => c.status === 'FULLY_EXECUTED').length;
  const activeCreators = creators.length;

  // Mock revenue data (replace with real aggregation later)
  const revenueData = [
    { month: 'Jan', revenue: 420000, margin: 84000, creators: 45 },
    { month: 'Feb', revenue: 380000, margin: 76000, creators: 52 },
    { month: 'Mar', revenue: 510000, margin: 102000, creators: 61 },
    { month: 'Apr', revenue: 475000, margin: 95000, creators: 58 },
    { month: 'May', revenue: 580000, margin: 116000, creators: 67 },
  ];

  // Format top creators for table
  const topCreators = creators.slice(0, 5).map(c => ({
    id: c.id,
    name: c.user?.name || 'Unknown',
    followers: `${Math.round((c.followerCount || 0) / 1000)}K`,
    revenue: `₹${(c.totalEarnings || 0).toLocaleString('en-IN')}`,
    margin: `${c.marginPercentage || 0}%`,
    status: c.verified ? 'Active' : 'Pending',
  }));

  // Recent activity (mock for now)
  const recentActivity = [
    { id: 1, icon: '✅', text: `Contract signed: ${contracts[0]?.campaignCreator?.creator?.user?.name || 'New Creator'}`, time: '2 min ago' },
    { id: 2, icon: '💰', text: 'Bonus triggered: Creator-pro (₹1,500)', time: '5 min ago' },
    { id: 3, icon: '📊', text: `New campaign: ${campaigns[0]?.name || 'Q2 Campaign'}`, time: '12 min ago' },
    { id: 4, icon: '🎯', text: 'Lead converted: Arjun Kapoor', time: '25 min ago' },
    { id: 5, icon: '📈', text: 'Margin alert: Brand X campaign at 28%', time: '1 hour ago' },
  ];

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
      <header style={{
        marginBottom: '24px',
        '@media (min-width: 768px)': {
          marginBottom: '32px',
        },
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
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
              Agency Command Center
            </h1>
            <p style={{
              color: '#92400e',
              fontSize: '14px',
              margin: 0,
            }}>
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
              width: '100%',
              justifyContent: 'center',
              '@media (min-width: 768px)': {
                width: 'auto',
              },
            }}
          >
            <Plus size={16} /> New Campaign
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '12px',
        marginBottom: '24px',
        '@media (min-width: 768px)': {
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        },
      }}>
        <KPICard
          title="Total Revenue"
          value={`₹${(totalRevenue / 100000).toFixed(1)}L`}
          change="+12%"
          icon={<DollarSign size={20} />}
          accentColor="#1a1a2e"
        />
        <KPICard
          title="Active Creators"
          value={activeCreators.toString()}
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
          value={activeContracts.toString()}
          change="+15%"
          icon={<FileText size={20} />}
          accentColor="#2563eb"
        />
      </div>

      {/* Charts Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '16px',
        marginBottom: '24px',
        '@media (min-width: 768px)': {
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          marginBottom: '32px',
        },
      }}>
        {/* Revenue & Margin Chart */}
        <Card style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
        }}>
          <CardHeader>
            <CardTitle style={{ color: '#1a1a2e', fontSize: '16px', fontWeight: 600 }}>
              Revenue & Margin Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueMarginChart data={revenueData} />
          </CardContent>
        </Card>

        {/* Creator Growth Chart */}
        <Card style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
        }}>
          <CardHeader>
            <CardTitle style={{ color: '#1a1a2e', fontSize: '16px', fontWeight: 600 }}>
              Creator Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CreatorGrowthChart data={revenueData} />
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row: Top Creators + Activity */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '16px',
        marginBottom: '24px',
        '@media (min-width: 768px)': {
          gridTemplateColumns: '1.5fr 1fr',
          gap: '24px',
          marginBottom: '32px',
        },
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
          <CardContent style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
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
                    alignItems: 'flex-start',
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
            gridTemplateColumns: '1fr',
            gap: '12px',
            '@media (min-width: 768px)': {
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            },
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
