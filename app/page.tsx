import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'AM Creator Analytics',
  description: 'Enterprise multi-tenant creator analytics platform',
};

export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#F8F7F4',
      color: '#1a1a2e',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px',
    }}>
      <div style={{ maxWidth: '800px', textAlign: 'center' }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 700,
          marginBottom: '16px',
          lineHeight: 1.1,
        }}>
          AM Creator Analytics
        </h1>
        
        <p style={{
          fontSize: '18px',
          color: '#92400e',
          marginBottom: '32px',
          lineHeight: 1.6,
        }}>
          Enterprise multi-tenant creator analytics platform.
          <br />
          Self-hosted. Open-source. Bloomberg × McKinsey design.
        </p>

        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          marginBottom: '48px',
        }}>
          <Link href="/api/auth/signin?role=brand">
            <button style={{
              backgroundColor: '#1a1a2e',
              color: '#F8F7F4',
              padding: '12px 24px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
            }}>
              Start Brand Trial
            </button>
          </Link>
          
          <Link href="/api/auth/signin?role=creator">
            <button style={{
              backgroundColor: '#92400e',
              color: '#F8F7F4',
              padding: '12px 24px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
            }}>
              Join as Creator
            </button>
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
          paddingTop: '48px',
          borderTop: '1px solid #e5e7eb',
        }}>
          {[
            { value: '500+', label: 'Active Creators' },
            { value: '$2M+', label: 'ROI Tracked' },
            { value: '73%', label: 'Avg. ROI Lift' },
          ].map((metric, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '36px',
                fontWeight: 700,
                color: '#92400e',
                marginBottom: '8px',
              }}>
                {metric.value}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#6b7280',
                fontWeight: 500,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.1em',
              }}>
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
