/**
 * New Campaign Creation Page
 */

import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'New Campaign | AM Creator Analytics',
  description: 'Create a new campaign',
};

export default async function NewCampaignPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;

  // Fetch brands for dropdown
  const brands = await prisma.brandProfile.findMany({
    where: { user: { tenantId } },
  });

  async function createCampaign(formData: FormData) {
    'use server';

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const brandId = formData.get('brandId') as string;
    const budget = parseFloat(formData.get('budget') as string);
    const startDate = new Date(formData.get('startDate') as string);
    const endDate = new Date(formData.get('endDate') as string);
    const platforms = formData.getAll('platforms') as string[];

    await prisma.campaign.create({
      data: {
        name,
        description,
        tenantId,
        brandId,
        budget,
        startDate,
        endDate,
        platforms: platforms as any,
        status: 'DRAFT',
      },
    });

    redirect(`/${tenantId}/dashboard/campaigns`);
  }

  return (
    <div style={{
      backgroundColor: '#F8F7F4',
      minHeight: '100vh',
      padding: '16px',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      '@media (min-width: 768px)': {
        padding: '32px',
        maxWidth: '800px',
        margin: '0 auto',
      },
    }}>
      {/* Header */}
      <div style={{
        marginBottom: '24px',
      }}>
        <Link
          href={`/${tenantId}/dashboard/campaigns`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#92400e',
            fontSize: '14px',
            textDecoration: 'none',
            marginBottom: '12px',
          }}
        >
          <ArrowLeft size={16} /> Back to Campaigns
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
          Create New Campaign
        </h1>
        <p style={{
          color: '#92400e',
          fontSize: '14px',
          margin: 0,
        }}>
          Set up a new campaign for your creators
        </p>
      </div>

      {/* Form */}
      <Card style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
      }}>
        <CardHeader>
          <CardTitle style={{ color: '#1a1a2e', fontSize: '16px', fontWeight: 600 }}>
            Campaign Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createCampaign} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}>
            {/* Campaign Name */}
            <div>
              <label style={labelStyle}>
                Campaign Name *
              </label>
              <input
                name="name"
                type="text"
                required
                placeholder="e.g., Q2 2026 Creator Campaign"
                style={inputStyle}
              />
            </div>

            {/* Description */}
            <div>
              <label style={labelStyle}>
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                placeholder="Describe the campaign goals and requirements..."
                style={{
                  ...inputStyle,
                  resize: 'vertical' as const,
                }}
              />
            </div>

            {/* Brand Selection */}
            <div>
              <label style={labelStyle}>
                Brand *
              </label>
              <select
                name="brandId"
                required
                style={inputStyle}
              >
                <option value="">Select a brand...</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id}>
                    {brand.companyName || brand.user?.name || 'Unknown'}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget & Dates Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '16px',
              '@media (min-width: 768px)': {
                gridTemplateColumns: '1fr 1fr',
              },
            }}>
              <div>
                <label style={labelStyle}>
                  Budget (Rs.)
                </label>
                <input
                  name="budget"
                  type="number"
                  placeholder="500000"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>
                  Platforms
                </label>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap' as const,
                  gap: '8px',
                }}>
                  {['Instagram', 'YouTube', 'TikTok', 'LinkedIn'].map(platform => (
                    <label key={platform} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '14px',
                      color: '#1a1a2e',
                      cursor: 'pointer',
                    }}>
                      <input
                        type="checkbox"
                        name="platforms"
                        value={platform}
                        style={{ cursor: 'pointer' }}
                      />
                      {platform}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Dates Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '16px',
              '@media (min-width: 768px)': {
                gridTemplateColumns: '1fr 1fr',
              },
            }}>
              <div>
                <label style={labelStyle}>
                  Start Date *
                </label>
                <input
                  name="startDate"
                  type="date"
                  required
                  defaultValue={new Date().toISOString().split('T')[0]}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>
                  End Date *
                </label>
                <input
                  name="endDate"
                  type="date"
                  required
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
              paddingTop: '16px',
              borderTop: '1px solid #f1f5f9',
            }}>
              <Link
                href={`/${tenantId}/dashboard/campaigns`}
                style={{
                  backgroundColor: '#f1f5f9',
                  color: '#1a1a2e',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                  fontSize: '14px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  textAlign: 'center' as const,
                }}
              >
                Cancel
              </Link>
              <button
                type="submit"
                style={{
                  backgroundColor: '#92400e',
                  color: '#F8F7F4',
                  padding: '8px 24px',
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
                <Plus size={16} /> Create Campaign
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  color: '#1a1a2e',
  fontSize: '14px',
  fontWeight: 500,
  marginBottom: '6px',
};

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  border: '1px solid #e5e7eb',
  borderRadius: '6px',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box' as const,
  fontFamily: 'inherit',
};

function Link({ href, children, style }: { href: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <a href={href} style={style}>
      {children}
    </a>
  );
}
