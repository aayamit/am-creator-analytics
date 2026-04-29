import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, FileText, Plus, BarChart3, Users } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import RevenueMarginChart from '@/components/dashboard/charts';

export const metadata: Metadata = {
  title: 'Brand Dashboard | AM Creator Analytics',
  description: 'Campaign overview & ROI analytics',
};

export default async function BrandDashboardPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;

  // Fetch real data - separate calls to avoid parsing issues
  const campaigns = await prisma.campaign.findMany({
    where: { tenantId },
    include: { _count: { select: { creators: true } } },
  });

  const contracts = await prisma.contract.findMany({
    where: { campaignCreator: { campaign: { tenantId } },
    include: { campaignCreator: { include: { campaign: true } },
  });

  const creators = await prisma.creatorProfile.findMany({
    where: { user: { tenantId } },
  });

  // Calculate KPIs
  const activeCampaigns = campaigns.filter(c => c.status === 'ACTIVE').length;
  const totalSpend = contracts.reduce((sum, c) => sum + (c.amount || 0), 0);
  const avgROI = 312; // TODO: calculate from actual data
  const totalCreators = creators.length;

  // Mock chart data (replace with real aggregation)
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
              Brand Dashboard
            </h1>
            <p style={{
              color: '#92400e',
              fontSize: '14px',
              margin: 0,
            }}>
              Campaign overview & ROI analytics
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
        <KPICard title="Active Campaigns" value={activeCampaigns.toString()} change="+3" icon={<FileText size={20} />} accentColor="#1a1a2e" />
        <KPICard title="Total Spend" value={`₹${(totalSpend / 100000).toFixed(1)}L`} change="+15%" icon={<DollarSign size={20} />} accentColor="#92400e" />
        <KPICard title="ROI" value={`${avgROI}%`} change="+28%" icon={<TrendingUp size={20} />} accentColor="#16a34a" />
        <KPICard title="Creators" value={totalCreators.toString()} change="+12" icon={<Users size={20} />} accentColor="#2563eb" />
      </div>

      {/* Chart */}
      <Card style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        marginBottom: '24px',
        '@media (min-width: 768px)': {
          marginBottom: '32px',
        },
        overflow: 'hidden',
      }}>
        <CardHeader>
          <CardTitle style={{ color: '#1a1a2e', fontSize: '16px', fontWeight: 600 }}>
            Revenue & Margin Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RevenueMarginChart data={chartData} />
        </CardContent>
      </Card>

      {/* Placeholder for campaign table */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '24px',
        textAlign: 'center',
        color: '#6b7280',
      }}>
        <h3 style={{ color: '#1a1a2e', marginBottom: '8px' }}>Campaign Analytics Coming Soon</h3>
        <p>Charts and detailed analytics will be displayed here.</p>
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
