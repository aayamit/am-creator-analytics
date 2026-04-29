import { BarChart3, TrendingUp, DollarSign, Download } from 'lucide-react';

export default function AnalyticsPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const topCreators = [
    { name: 'Priya Sharma', followers: '245K', views: '1.2M', engagement: '4.8%', roi: '312%' },
    { name: 'Arjun Kapoor', followers: '189K', views: '0.9M', engagement: '3.2%', roi: '245%' },
    { name: 'Tech Reviews', followers: '512K', views: '2.5M', engagement: '5.1%', roi: '420%' },
    { name: 'Fashion Forward', followers: '98K', views: '0.6M', engagement: '6.8%', roi: '180%' },
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
            Analytics
          </h1>
          <p style={{
            color: '#92400e',
            fontSize: '14px',
            margin: 0,
          }}>
            Track performance and ROI across all campaigns
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
          <Download size={16} /> Export Report
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
        marginBottom: '32px',
      }}>
        <KPICard title="Total Views" value="12.5M" change="+18%" icon={<BarChart3 size={20} />} accentColor="#1a1a2e" />
        <KPICard title="Avg Engagement" value="4.2%" change="+0.3%" icon={<TrendingUp size={20} />} accentColor="#92400e" />
        <KPICard title="Total Spend" value="₹18.5L" change="+12%" icon={<DollarSign size={20} />} accentColor="#16a34a" />
        <KPICard title="Avg ROI" value="312%" change="+28%" icon={<BarChart3 size={20} />} accentColor="#2563eb" />
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
            {topCreators.map((creator, index) => (
              <tr
                key={index}
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
