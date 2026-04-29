import { Plus, Filter, Search, BarChart3 } from 'lucide-react';

export default function CampaignsPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const campaigns = [
    {
      id: '1',
      name: 'Summer Collection Launch',
      brand: 'Fashion Forward',
      creators: 12,
      budget: '₹5.0L',
      status: 'Active',
      roi: '312%',
    },
    {
      id: '2',
      name: 'Tech Reviews Q2',
      brand: 'Gadget Pro',
      creators: 8,
      budget: '₹3.5L',
      status: 'Active',
      roi: '245%',
    },
    {
      id: '3',
      name: 'Fitness Challenge',
      brand: 'HealthPlus',
      creators: 15,
      budget: '₹4.2L',
      status: 'Draft',
      roi: '-',
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
            Campaigns
          </h1>
          <p style={{
            color: '#92400e',
            fontSize: '14px',
            margin: 0,
          }}>
            Manage and track all campaigns
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
        }}>
          <Plus size={16} /> Create Campaign
        </button>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '24px',
      }}>
        <div style={{
          flex: 1,
          position: 'relative',
        }}>
          <Search size={16} style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#6b7280',
          }} />
          <input
            type="text"
            placeholder="Search campaigns..."
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '14px',
              outline: 'none',
            }}
          />
        </div>
        <button style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #e5e7eb',
          padding: '8px 16px',
          borderRadius: '6px',
          fontSize: '14px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <Filter size={16} /> Filter
        </button>
      </div>

      {/* Campaigns Table */}
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
              }}>Campaign</th>
              <th style={{
                textAlign: 'left',
                padding: '12px 16px',
                color: '#1a1a2e',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase' as const,
              }}>Brand</th>
              <th style={{
                textAlign: 'left',
                padding: '12px 16px',
                color: '#1a1a2e',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase' as const,
              }}>Creators</th>
              <th style={{
                textAlign: 'left',
                padding: '12px 16px',
                color: '#1a1a2e',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase' as const,
              }}>Budget</th>
              <th style={{
                textAlign: 'left',
                padding: '12px 16px',
                color: '#1a1a2e',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase' as const,
              }}>ROI</th>
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
            {campaigns.map((campaign) => (
              <tr
                key={campaign.id}
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
                  {campaign.name}
                </td>
                <td style={{
                  padding: '16px',
                  color: '#1a1a2e',
                  fontSize: '14px',
                }}>
                  {campaign.brand}
                </td>
                <td style={{
                  padding: '16px',
                  color: '#1a1a2e',
                  fontSize: '14px',
                }}>
                  {campaign.creators}
                </td>
                <td style={{
                  padding: '16px',
                  color: '#1a1a2e',
                  fontSize: '14px',
                  fontWeight: 500,
                }}>
                  {campaign.budget}
                </td>
                <td style={{
                  padding: '16px',
                  color: '#16a34a',
                  fontSize: '14px',
                  fontWeight: 600,
                }}>
                  {campaign.roi}
                </td>
                <td style={{ padding: '16px' }}>
                  <span style={{
                    backgroundColor: campaign.status === 'Active' ? '#f0fdf4' : '#fef3c7',
                    color: campaign.status === 'Active' ? '#16a34a' : '#92400e',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 500,
                  }}>
                    {campaign.status}
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
