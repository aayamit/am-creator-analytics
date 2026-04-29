import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, Wallet, Plus, BarChart3 } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import CreatorGrowthChart from '@/components/dashboard/charts';

export const metadata: Metadata = {
  title: 'Creator Dashboard | AM Creator Analytics',
  description: 'Manage your campaigns and earnings',
};

export default async function CreatorDashboardPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;

  // Fetch real data
  const [campaigns, contracts, creatorProfile] = await Promise.all([
    prisma.campaign.findMany({
      where: { tenantId, status: 'ACTIVE' },
    }),
    prisma.contract.findMany({
      where: { campaignCreator: { creator: { user: { tenantId } } },
      include: { campaignCreator: { include: { campaign: true } } },
    }),
    prisma.creatorProfile.findFirst({
      where: { user: { tenantId } },
    }),
  ]);

  const activeCampaigns = campaigns.length;
  const totalEarnings = contracts.reduce((sum, c) => sum + (c.amount || 0), 0);
  const profileViews = creatorProfile?.followerCount || 0;
  const conversionRate = 4.8; // TODO: calculate

  // Mock chart data
  const chartData = [
    { month: 'Jan', revenue: 420000, margin: 84000, creators: 45 },
    { month: 'Feb', revenue: 380000, margin: 76000, creators: 52 },
    { month: 'Mar', revenue: 510000, margin: 102000, creators: 61 },
    { month: 'Apr', revenue: 475000, margin: 95000, creators: 58 },
    { month: 'May', revenue: 580000, margin: 116000, creators: 67 },
  ];

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
              Creator Dashboard
            </h1>
            <p style={{ color: '#92400e', fontSize: '14px', margin: 0 }}>
              Manage your campaigns and earnings
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
              fontWeight: 500,
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
        <KPICard title="Active Campaigns" value={activeCampaigns.toString()} change="+2" icon={<BarChart3 size={20} />} accentColor="#1a1a2e" />
        <KPICard title="Total Earnings" value={`₹${(totalEarnings / 100000).toFixed(1)}L`} change="+18%" icon={<Wallet size={20} />} accentColor="#92400e" />
        <KPICard title="Profile Views" value={`${(profileViews / 1000).toFixed(1)}K`} change="+24%" icon={<Users size={20} />} accentColor="#16a34a" />
        <KPICard title="Conversion Rate" value={`${conversionRate}%`} change="+0.6%" icon={<TrendingUp size={20} />} accentColor="#2563eb" />
      </div>

      {/* Chart */}
      <Card style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        marginBottom: '32px',
      }}>
        <CardHeader>
          <CardTitle style={{ color: '#1a1a2e', fontSize: '16px', fontWeight: 600 }}>
            Creator Growth
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CreatorGrowthChart data={chartData} />
        </CardContent>
      </Card>

      {/* Placeholder for campaign table */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '48px',
        textAlign: 'center',
        color: '#6b7280',
      }}>
        <h3 style={{ color: '#1a1a2e', marginBottom: '8px' }}>Campaign Performance Coming Soon</h3>
        <p>View your campaign analytics and earnings here.</p>
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
