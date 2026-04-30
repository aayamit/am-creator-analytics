/**
 * Contract Detail Page
 * View contract details, status, and send for signing
 */

import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Send, Download, CheckCircle, Clock, XCircle, FileText } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Contract Details | AM Creator Analytics',
  description: 'View contract details and status',
};

export default async function ContractDetailPage({
  params,
}: {
  params: Promise<{ tenantId: string; id: string }>;
}) {
  const { tenantId, id } = await params;

  // Fetch contract with related data
  const contract = await prisma.contract.findUnique({
    where: { id, tenantId },
    include: {
      campaignCreator: {
        include: {
          campaign: true,
          creator: {
            include: { user: true },
          },
        },
      },
    },
  });

  if (!contract) {
    notFound();
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SIGNED': return { bg: '#dcfce7', text: '#166534' };
      case 'SENT': return { bg: '#dbeafe', text: '#1e40af' };
      case 'VIEWED': return { bg: '#fef3c7', text: '#92400e' };
      case 'DRAFT': return { bg: '#f3f4f6', text: '#374151' };
      case 'DECLINED': return { bg: '#fce7f3', text: '#9d174d' };
      case 'EXPIRED': return { bg: '#fee2e2', text: '#dc2626' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  const statusColor = getStatusColor(contract.status);

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
          <Link
            href={`/${tenantId}/dashboard/contracts`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#92400e',
              fontSize: '14px',
              textDecoration: 'none',
              marginBottom: '8px',
            }}
          >
            <ArrowLeft size={16} /> Back to Contracts
          </Link>
          <h1 style={{
            color: '#1a1a2e',
            fontSize: '24px',
            fontWeight: 600,
            marginBottom: '4px',
            '@media (min-width: 768px)': {
              fontSize: '28px',
            },
          }}>
            {contract.title}
          </h1>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{
              backgroundColor: statusColor.bg,
              color: statusColor.text,
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 500,
            }}>
              {contract.status}
            </span>
            <span style={{
              color: '#92400e',
              fontSize: '14px',
            }}>
              Created {new Date(contract.createdAt).toLocaleDateString('en-IN')}
            </span>
          </div>
        </div>
        <div style={{
          display: 'flex',
          gap: '8px',
        }}>
          {contract.status === 'DRAFT' && (
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
              <Send size={16} /> Send for Signing
            </button>
          )}
          {contract.pdfUrl && (
            <a
              href={contract.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: '#f1f5f9',
                color: '#1a1a2e',
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
                fontSize: '14px',
                fontWeight: 500,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Download size={16} /> Download PDF
            </a>
          )}
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '16px',
        '@media (min-width: 768px)': {
          gridTemplateColumns: '2fr 1fr',
        },
      }}>
        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Contract Details */}
          <Card style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}>
            <CardHeader>
              <CardTitle style={{ color: '#1a1a2e', fontSize: '16px', fontWeight: 600 }}>
                Contract Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '16px',
                '@media (min-width: 768px)': {
                  gridTemplateColumns: '1fr 1fr',
                },
              }}>
                <DetailRow label="Contract ID" value={contract.id} />
                <DetailRow label="Status" value={contract.status} isStatus />
                <DetailRow label="Amount" value={`Rs.${(contract.amount || 0).toLocaleString('en-IN')}`} />
                <DetailRow label="Signed Date" value={contract.signedAt ? new Date(contract.signedAt).toLocaleDateString('en-IN') : 'Not signed yet'} />
                <DetailRow label="Expiry Date" value={contract.expiresAt ? new Date(contract.expiresAt).toLocaleDateString('en-IN') : 'No expiry'} />
                <DetailRow label="OpenSign ID" value={contract.openSignTemplateId || 'N/A'} />
              </div>
            </CardContent>
          </Card>

          {/* Contract Content */}
          <Card style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}>
            <CardHeader>
              <CardTitle style={{ color: '#1a1a2e', fontSize: '16px', fontWeight: 600 }}>
                Contract Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{
                backgroundColor: '#f9fafb',
                padding: '16px',
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
              }}>
                <pre style={{
                  color: '#374151',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap' as const,
                  margin: 0,
                  fontFamily: 'inherit',
                }}>
                  {contract.content || 'No content available.'}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Creator Info */}
          <Card style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}>
            <CardHeader>
              <CardTitle style={{ color: '#1a1a2e', fontSize: '16px', fontWeight: 600 }}>
                Creator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div>
                  <div style={{ color: '#1a1a2e', fontSize: '14px', fontWeight: 500 }}>
                    {contract.campaignCreator?.creator?.user?.name || 'Unknown'}
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '12px' }}>
                    {contract.campaignCreator?.creator?.user?.email}
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  fontSize: '12px',
                  color: '#6b7280',
                }}>
                  <span>Followers: {Math.round((contract.campaignCreator?.creator?.followerCount || 0) / 1000)}K</span>
                  <span>•</span>
                  <span>ER: {contract.campaignCreator?.creator?.engagementRate || 0}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Campaign Info */}
          <Card style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}>
            <CardHeader>
              <CardTitle style={{ color: '#1a1a2e', fontSize: '16px', fontWeight: 600 }}>
                Campaign
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ color: '#1a1a2e', fontSize: '14px', fontWeight: 500 }}>
                  {contract.campaignCreator?.campaign?.name || 'Unknown'}
                </div>
                <Link
                  href={`/${tenantId}/dashboard/campaigns/${contract.campaignCreator?.campaign?.id}`}
                  style={{
                    color: '#92400e',
                    fontSize: '12px',
                    textDecoration: 'none',
                  }}
                >
                  View Campaign →
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Signing Bonus Info */}
          {contract.campaignCreator?.creator && (contract.campaignCreator.creator.followerCount || 0) < 50000 && (
            <Card style={{
              backgroundColor: '#fef3c7',
              border: '1px solid #f59e0b',
              borderRadius: '8px',
            }}>
              <CardContent style={{ padding: '16px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                }}>
                  <CheckCircle size={16} style={{ color: '#92400e' }} />
                  <span style={{
                    color: '#92400e',
                    fontSize: '14px',
                    fontWeight: 600,
                  }}>
                    Signing Bonus Eligible
                  </span>
                </div>
                <p style={{
                  color: '#92400e',
                  fontSize: '12px',
                  margin: 0,
                  lineHeight: '1.5',
                }}>
                  This creator has &lt;50K followers. They are eligible for a Rs.1,500 signing bonus upon contract signing.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, isStatus }: { label: string; value: string; isStatus?: boolean }) {
  return (
    <div>
      <div style={{
        color: '#6b7280',
        fontSize: '12px',
        fontWeight: 600,
        textTransform: 'uppercase' as const,
        marginBottom: '4px',
      }}>
        {label}
      </div>
      <div style={{
        color: isStatus ? '#1a1a2e' : '#1a1a2e',
        fontSize: '14px',
        fontWeight: isStatus ? 500 : 400,
      }}>
        {value}
      </div>
    </div>
  );
}

// ArrowLeft icon removed - using lucide-react import
// Icon functions removed - using lucide-react imports
