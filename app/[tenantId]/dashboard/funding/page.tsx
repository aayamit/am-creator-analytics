/**
 * Brand Funding Page
 * View funding rounds, investors, valuation
 */

import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Plus, Search, Filter, DollarSign, BarChart3 } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Funding | Brand | AM Creator Analytics',
  description: 'Manage funding rounds and valuation',
};

export default async function BrandFundingPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;

  // Mock funding data (would come from a Funding model in real app)
  const fundingRounds = [
    {
      id: '1',
      round: 'Seed',
      amount: 5000000, // Rs.50L
      date: '2025-01-15',
      leadInvestor: 'Sequoia Capital',
      valuation: 25000000, // Rs.2.5Cr
    },
    {
      id: '2',
      round: 'Series A',
      amount: 20000000, // Rs.2Cr
      date: '2025-06-20',
      leadInvestor: 'Accel',
      valuation: 100000000, // Rs.10Cr
    },
  ];

  const totalRaised = fundingRounds.reduce((sum, r) => sum + r.amount, 0);
  const currentValuation = fundingRounds[fundingRounds.length - 1]?.valuation || 0;

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
            Funding
          </h1>
          <p style={{
            color: '#92400e',
            fontSize: '14px',
            margin: 0,
          }}>
            Track funding rounds and company valuation
          </p>
        </div>
        <button style={{
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
        }}>
          <Plus size={16} /> Add Round
        </button>
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
        <StatCard title="Total Raised" value={`Rs.${(totalRaised / 10000000).toFixed(1)}Cr`} color="#1a1a2e" icon={<DollarSign size={20} />} />
        <StatCard title="Current Valuation" value={`Rs.${(currentValuation / 10000000).toFixed(1)}Cr`} color="#92400e" icon={<BarChart3 size={20} />} />
        <StatCard title="Rounds" value={fundingRounds.length.toString()} color="#16a34a" icon={<TrendingUp size={20} />} />
      </div>

      {/* Funding Rounds Table */}
      <Card style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        overflow: 'hidden',
      }}>
        <CardHeader>
          <CardTitle style={{ color: '#1a1a2e', fontSize: '16px', fontWeight: 600 }}>
            Funding Rounds ({fundingRounds.length})
          </CardTitle>
        </CardHeader>
        <CardContent style={{ padding: 0 }}>
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
                  <th style={thStyle}>Round</th>
                  <th style={thStyle}>Amount</th>
                  <th style={thStyle}>Valuation</th>
                  <th style={thStyle}>Lead Investor</th>
                  <th style={thStyle}>Date</th>
                </tr>
              </thead>
              <tbody>
                {fundingRounds.map((round) => (
                  <tr key={round.id} style={{
                    borderBottom: '1px solid #f1f5f9',
                  }}>
                    <td style={tdStyle}>
                      <span style={{
                        color: '#1a1a2e',
                        fontSize: '14px',
                        fontWeight: 500,
                      }}>
                        {round.round}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{
                        color: '#1a1a2e',
                        fontSize: '14px',
                        fontWeight: 500,
                      }}>
                        Rs.{(round.amount / 10000000).toFixed(1)}Cr
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{
                        color: '#92400e',
                        fontSize: '14px',
                      }}>
                        Rs.{(round.valuation / 10000000).toFixed(1)}Cr
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{
                        color: '#1a1a2e',
                        fontSize: '14px',
                      }}>
                        {round.leadInvestor}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{
                        color: '#6b7280',
                        fontSize: '12px',
                      }}>
                        {new Date(round.date).toLocaleDateString('en-IN')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
