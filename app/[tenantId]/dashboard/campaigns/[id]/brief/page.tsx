/**
 * Campaign Brief Page
 * Collaborative brief editing with real-time sync
 * Server Component (fetches data) + Client Component (editor)
 */

import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import BriefClientWrapper from '@/components/campaigns/brief-client-wrapper';

interface CampaignBriefPageProps {
  params: Promise<{ tenantId: string; id: string }>;
}

export const metadata: Metadata = {
  title: 'Campaign Brief | AM Creator Analytics',
  description: 'Collaborative campaign brief editor',
};

export default async function CampaignBriefPage({ params }: CampaignBriefPageProps) {
  const { tenantId, id } = await params;

  // Fetch campaign
  const campaign = await prisma.campaign.findUnique({
    where: { id, tenantId },
  });

  if (!campaign) {
    return (
      <div style={{
        backgroundColor: '#F8F7F4',
        minHeight: '100vh',
        padding: '32px',
        fontFamily: 'Inter, -apple-system, sans-serif',
        textAlign: 'center',
        color: '#6b7280',
      }}>
        <h1>Campaign not found</h1>
        <a href={`/${tenantId}/dashboard/campaigns`} style={{ color: '#1a1a2e' }}>
          ← Back to Campaigns
        </a>
      </div>
    );
  }

  // Default brief template
  const defaultBrief = `## ${campaign.name} Campaign Brief

### Objectives
- 

### Target Audience
- 

### Deliverables
- 

### Timeline
- Start: ${campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : 'TBD'}
- End: ${campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : 'TBD'}

### Budget
- Total: ₹${(campaign.budget || 0).toLocaleString('en-IN')}

### Notes
`;

  return (
    <div style={{
      backgroundColor: '#F8F7F4',
      minHeight: '100vh',
      padding: '32px',
      fontFamily: 'Inter, -apple-system, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
    }}>
      <BriefClientWrapper
        campaignId={campaign.id}
        campaignName={campaign.name}
        tenantId={tenantId}
        initialContent={campaign.description || defaultBrief}
      />
    </div>
  );
}
