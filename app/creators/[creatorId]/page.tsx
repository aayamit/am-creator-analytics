/**
 * Creator Portfolio Page (Public)
 * SEO-optimized public profile for creators
 * Server Component (fast SSR)
 */

import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PageProps {
  params: Promise<{ creatorId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { creatorId } = await params;
  const creator = await prisma.creatorProfile.findUnique({
    where: { id: creatorId },
    include: { user: true, socialAccounts: true },
  });

  if (!creator) {
    return { title: 'Creator Not Found | AM Creator Analytics' };
  }

  return {
    title: `${creator.displayName || 'Creator'} | AM Creator Analytics`,
    description: creator.bio || `Check out ${creator.displayName}'s creator profile`,
    openGraph: {
      images: creator.socialAccounts.find(a => a.platform === 'INSTAGRAM')?.profileImage || [],
    },
  };
}

export default async function CreatorPortfolioPage({ params }: PageProps) {
  const { creatorId } = await params;
  
  const creator = await prisma.creatorProfile.findUnique({
    where: { id: creatorId },
    include: {
      user: true,
      socialAccounts: true,
      campaignCreators: {
        include: { campaign: true },
        take: 10,
      },
    },
  });

  if (!creator) {
    return <div className="p-8 text-center">Creator not found</div>;
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#1a1a2e' }}>
          {creator.displayName || 'Creator Profile'}
        </h1>
        <p style={{ color: '#6b7280', marginTop: '8px' }}>{creator.niche || 'Content Creator'}</p>
      </div>

      {/* Bio */}
      {creator.bio && (
        <Card style={{ marginBottom: '24px' }}>
          <CardHeader>
            <CardTitle style={{ color: '#1a1a2e' }}>About</CardTitle>
          </CardHeader>
          <CardContent>
            <p style={{ color: '#374151' }}>{creator.bio}</p>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <Card>
          <CardContent style={{ textAlign: 'center', padding: '16px' }}>
            <p style={{ fontSize: '24px', fontWeight: 700, color: '#1a1a2e' }}>
              {creator.followerCount?.toLocaleString() || 0}
            </p>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>Followers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent style={{ textAlign: 'center', padding: '16px' }}>
            <p style={{ fontSize: '24px', fontWeight: 700, color: '#1a1a2e' }}>
              {creator.engagementRate || 0}%
            </p>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>Engagement</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent style={{ textAlign: 'center', padding: '16px' }}>
            <p style={{ fontSize: '24px', fontWeight: 700, color: '#1a1a2e' }}>
              {creator.campaignCreators.length}
            </p>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>Campaigns</p>
          </CardContent>
        </Card>
      </div>

      {/* Social Accounts */}
      {creator.socialAccounts.length > 0 && (
        <Card style={{ marginBottom: '24px' }}>
          <CardHeader>
            <CardTitle style={{ color: '#1a1a2e' }}>Social Media</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {creator.socialAccounts.map((account) => (
                <Badge key={account.id} variant="secondary">
                  {account.platform}: {account.username}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Campaigns */}
      {creator.campaignCreators.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle style={{ color: '#1a1a2e' }}>Recent Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {creator.campaignCreators.map((cc) => (
                <div key={cc.id} className="p-2 border-b">
                  <p className="font-medium" style={{ color: '#1a1a2e' }}>{cc.campaign.title}</p>
                  <p className="text-sm text-gray-500">
                    {cc.campaign.status} • Budget: ₹{cc.campaign.budget?.toLocaleString() || 0}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '48px', color: '#6b7280', fontSize: '14px' }}>
        Powered by <span style={{ color: '#1a1a2e', fontWeight: 600 }}>AM Creator Analytics</span>
      </div>
    </div>
  );
}
