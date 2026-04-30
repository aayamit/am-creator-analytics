import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, DollarSign, Download } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { RevenueMarginChart } from '@/components/dashboard/charts';

export default async function AnalyticsPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;

  // Fetch real data - simplified calls to avoid parsing errors
  const campaigns = await prisma.campaign.findMany({
    where: { tenantId: tenantId },
  });

  const contracts = await prisma.contract.findMany({
    where: { campaignCreator: { campaign: { tenantId: tenantId } } },
  });

  const creators = await prisma.creatorProfile.findMany({
    where: { user: { tenantId: tenantId } },
    take: 10,
    orderBy: { followerCount: 'desc' },
  });

  // Calculate KPIs
  const totalViews = creators.reduce((sum, c) => sum + (c.followerCount || 0) * 5, 0); // Mock: 5 views per follower
  const avgEngagement = 4.2; // TODO: calculate from real data
  const totalSpend = contracts.reduce((sum, c) => sum + (c.amount || 0), 0);
  const avgROI = 312; // TODO: calculate from campaign ROI

  // Chart data (mock for now, replace with real aggregation)
  const chartData = [
    { month: 'Jan', revenue: 420000, margin: 84000, creators: 45 },
    { month: 'Feb', revenue: 380000, margin: 76000, creators: 52 },
    { month: 'Mar', revenue: 510000, margin: 102000, creators: 61 },
    { month: 'Apr', revenue: 475000, margin: 95000, creators: 58 },
    { month: 'May', revenue: 580000, margin: 116000, creators: 67 },
  ];

  // Top creators by ROI
  const topCreators = creators.slice(0, 5).map(c => ({
    id: c.id,
    name: c.user?.name || 'Unknown',
    followers: `${Math.round((c.followerCount || 0) / 1000)}K`,
    views: `${Math.round((c.followerCount || 0) * 5 / 1000000)}M`,
    engagement: `${c.engagementRate || 4.2}%`,
    roi: `${c.roi || 312}%`,
  }));

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
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div>
          <h1 style={{
            color: '#1a1a2e',
            fontSize: '28px',
            fontWeight: 600,
            marginBottom: '4px',
          }}>
            Analytics
          </h1>
          <p style={{
            color: '#92400e',
            fontSize: '14px',
            margin: 0,
          }}>
            Campaign performance and creator insights
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Button
            variant="outline"
            onClick={() => {
              // TODO: Call PDF export API
              alert('PDF export coming soon!');
            }}
          >
            <Download size={16} style={{ marginRight: '8px' }} />
            Export PDF Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
        marginBottom: '32px',
      }}>
        <KPICard title="Total Views" value={`${(totalViews / 1000000).toFixed(1)}M`} change="+18%" icon={<BarChart3 size={20} />} accentColor="#1a1a2e" />
        <KPICard title="Avg Engagement" value={`${avgEngagement}%`} change="+0.3%" icon={<TrendingUp size={20} />} accentColor="#92400e" />
        <KPICard title="Total Spend" value={`Rs.${(totalSpend / 100000).toFixed(1)}L`} change="+12%" icon={<DollarSign size={20} />} accentColor="#16a34a" />
        <KPICard title="Avg ROI" value={`${avgROI}%`} change="+28%" icon={<BarChart3 size={20} />} accentColor="#2563eb" />
      </div>

      {/* Chart */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        marginBottom: '32px',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #e5e7eb',
        }}>
          <h3 style={{
            color: '#1a1a2e',
            fontSize: '16px',
            fontWeight: 600,
            margin: 0,
          }}>
            Revenue & Margin Trends
          </h3>
        </div>
        <div style={{ padding: '20px' }}>
          <RevenueMarginChart data={chartData} />
        </div>
      </div>

      {/* Top Creators Table */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #e5e7eb',
        }}>
          <h3 style={{
            color: '#1a1a2e',
            fontSize: '16px',
            fontWeight: 600,
            margin: 0,
          }}>
            Top Creators by ROI
          </h3>
        </div>
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
              }}>Creator</th>
              <th style={{
                textAlign: 'left',
                padding: '12px 16px',
                color: '#1a1a2e',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase' as const,
              }}>Followers</th>
              <th style={{
                textAlign: 'left',
                padding: '12px 16px',
                color: '#1a1a2e',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase' as const,
              }}>Views</th>
              <th style={{
                textAlign: 'left',
                padding: '12px 16px',
                color: '#1a1a2e',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase' as const,
              }}>Engagement</th>
              <th style={{
                textAlign: 'left',
                padding: '12px 16px',
                color: '#1a1a2e',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase' as const,
              }}>ROI</th>
            </tr>
          </thead>
          <tbody>
            {topCreators.map((creator) => (
              <tr
                key={creator.id}
                style={{
                  borderBottom: '1px solid #f1f5f9',
                  cursor: 'pointer',
                }}
              >
                <td style={{
                  padding: '16px',
                  color: '#1a1a2e',
                  fontSize: '14px',
                  fontWeight: 500,
                }}>
                  {creator.name}
                </td>
                <td style={{
                  padding: '16px',
                  color: '#1a1a2e',
                  fontSize: '14px',
                }}>
                  {creator.followers}
                </td>
                <td style={{
                  padding: '16px',
                  color: '#1a1a2e',
                  fontSize: '14px',
                }}>
                  {creator.views}
                </td>
                <td style={{
                  padding: '16px',
                  color: '#1a1a2e',
                  fontSize: '14px',
                }}>
                  {creator.engagement}
                </td>
                <td style={{
                  padding: '16px',
                  color: '#16a34a',
                  fontSize: '14px',
                  fontWeight: 600,
                }}>
                  {creator.roi}
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
