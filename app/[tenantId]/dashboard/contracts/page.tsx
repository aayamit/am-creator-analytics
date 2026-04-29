import { FileText, Plus, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function ContractsPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const contracts = [
    {
      id: '1',
      title: 'Summer Collection - Priya Sharma',
      creator: 'Priya Sharma',
      brand: 'Fashion Forward',
      value: '₹1.2L',
      status: 'SIGNED_BY_BRAND',
      date: '2026-04-28',
    },
    {
      id: '2',
      title: 'Tech Reviews Q2 - Arjun Kapoor',
      creator: 'Arjun Kapoor',
      brand: 'Gadget Pro',
      value: '₹0.9L',
      status: 'SENT',
      date: '2026-04-27',
    },
    {
      id: '3',
      title: 'Fitness Challenge - Tech Reviews',
      creator: 'Tech Reviews',
      brand: 'HealthPlus',
      value: '₹2.5L',
      status: 'DRAFT',
      date: '2026-04-25',
    },
  ];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; color: string }> = {
      'DRAFT': { bg: '#f3f4f6', color: '#6b7280' },
      'SENT': { bg: '#dbeafe', color: '#2563eb' },
      'SIGNED_BY_CREATOR': { bg: '#fef3c7', color: '#92400e' },
      'SIGNED_BY_BRAND': { bg: '#fef3c7', color: '#92400e' },
      'FULLY_EXECUTED': { bg: '#f0fdf4', color: '#16a34a' },
    };
    const style = styles[status] || { bg: '#f3f4f6', color: '#6b7280' };
    return (
      <span style={{
        backgroundColor: style.bg,
        color: style.color,
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 500,
      }}>
        {status.replace(/_/g, ' ')}
      </span>
    );
  };

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
            Contracts
          </h1>
          <p style={{
            color: '#92400e',
            fontSize: '14px',
            margin: 0,
          }}>
            Manage and track all contracts
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
          <Plus size={16} /> Create Contract
        </button>
      </div>

      {/* Contracts Table */}
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
              }}>Contract</th>
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
              }}>Brand</th>
              <th style={{
                textAlign: 'left',
                padding: '12px 16px',
                color: '#1a1a2e',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase' as const,
              }}>Value</th>
              <th style={{
                textAlign: 'left',
                padding: '12px 16px',
                color: '#1a1a2e',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase' as const,
              }}>Status</th>
              <th style={{
                textAlign: 'left',
                padding: '12px 16px',
                color: '#1a1a2e',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase' as const,
              }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((contract) => (
              <tr
                key={contract.id}
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
                  {contract.title}
                </td>
                <td style={{
                  padding: '16px',
                  color: '#1a1a2e',
                  fontSize: '14px',
                }}>
                  {contract.creator}
                </td>
                <td style={{
                  padding: '16px',
                  color: '#1a1a2e',
                  fontSize: '14px',
                }}>
                  {contract.brand}
                </td>
                <td style={{
                  padding: '16px',
                  color: '#1a1a2e',
                  fontSize: '14px',
                  fontWeight: 500,
                }}>
                  {contract.value}
                </td>
                <td style={{ padding: '16px' }}>
                  {getStatusBadge(contract.status)}
                </td>
                <td style={{
                  padding: '16px',
                  color: '#6b7280',
                  fontSize: '14px',
                }}>
                  {contract.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
