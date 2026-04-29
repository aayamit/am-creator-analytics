import { Users, TrendingUp, Wallet, Plus, BarChart3 } from 'lucide-react';

export default function CreatorDashboardPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  return (
    <div style={{
      backgroundColor: '#F8F7F4',
      minHeight: '100vh',
      padding: '32px',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ color: '#1a1a2e', fontSize: '28px', fontWeight: 600, marginBottom: '4px' }}>
          Creator Dashboard
        </h1>
        <p style={{ color: '#92400e', fontSize: '14px', margin: 0 }}>
          Manage your campaigns and earnings
        </p>
      </header>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
        marginBottom: '32px',
      }}>
        <KPICard title="Active Campaigns" value="8" change="+2" icon={<BarChart3 size={20} />} accentColor="#1a1a2e" />
        <KPICard title="Total Earnings" value="₹3.2L" change="+18%" icon={<Wallet size={20} />} accentColor="#92400e" />
        <KPICard title="Profile Views" value="12.5K" change="+24%" icon={<Users size={20} />} accentColor="#16a34a" />
        <KPICard title="Conversion Rate" value="4.8%" change="+0.6%" icon={<TrendingUp size={20} />} accentColor="#2563eb" />
      </div>

      {/* Placeholder for charts and tables */}
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
