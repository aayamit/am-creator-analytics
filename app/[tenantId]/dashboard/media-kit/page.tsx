/**
 * Media Kit Page
 * For creators to showcase their profile, stats, and portfolio
 */

import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Instagram, Youtube, TikTok, Linkedin, Download, Share2, Camera, BarChart3, Users, TrendingUp } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/nextauth';

export const metadata: Metadata = {
  title: 'Media Kit | AM Creator Analytics',
  description: 'Your creator media kit and portfolio',
};

export default async function MediaKitPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <div>Unauthorized</div>;
  }

  // Fetch creator profile with user and social profiles
  const creatorProfile = await prisma.creatorProfile.findFirst({
    where: {
      userId: session.user.id,
    },
    include: {
      user: true,
      socialProfiles: true,
    },
  });

  if (!creatorProfile) {
    return (
      <div style={{
        backgroundColor: '#F8F7F4',
        minHeight: '100vh',
        padding: '32px',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        textAlign: 'center',
        color: '#6b7280',
      }}>
        <h1 style={{ color: '#1a1a2e', fontSize: '24px' }}>Creator Profile Not Found</h1>
        <p>Complete your creator profile to generate a media kit.</p>
      </div>
    );
  }

  const user = creatorProfile.user;
  const socialProfiles = creatorProfile.socialProfiles || [];

  // Get social links
  const instagramProfile = socialProfiles.find(p => p.platform === 'INSTAGRAM');
  const youtubeProfile = socialProfiles.find(p => p.platform === 'YOUTUBE');
  const tiktokProfile = socialProfiles.find(p => p.platform === 'TIKTOK');
  const linkedinProfile = socialProfiles.find(p => p.platform === 'LINKEDIN');

  // Mock stats (in real app, these would come from social APIs)
  const stats = {
    followers: creatorProfile.followerCount || 0,
    engagementRate: creatorProfile.engagementRate || 0,
    avgViews: Math.round((creatorProfile.followerCount || 0) * (creatorProfile.engagementRate || 0) / 100),
    completedCampaigns: 12, // Would come from campaign creators
  };

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
            My Media Kit
          </h1>
          <p style={{
            color: '#92400e',
            fontSize: '14px',
            margin: 0,
          }}>
            Showcase your creator profile and stats
          </p>
        </div>
        <div style={{
          display: 'flex',
          gap: '8px',
        }}>
          <button style={{
            backgroundColor: '#f1f5f9',
            color: '#1a1a2e',
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid #e5e7eb',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <Share2 size={16} /> Share
          </button>
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
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '16px',
        '@media (min-width: 768px)': {
          gridTemplateColumns: '2fr 1fr',
        },
      }}>
        {/* Main Profile */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Profile Card */}
          <Card style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}>
            <CardContent style={{ padding: '24px' }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
                '@media (min-width: 768px)': {
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                },
              }}>
                {/* Avatar */}
                <div style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '50%',
                  backgroundColor: '#92400e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#F8F7F4',
                  fontSize: '32px',
                  fontWeight: 600,
                  flexShrink: 0,
                }}>
                  {(user?.name?.[0] || 'C').toUpperCase()}
                </div>

                {/* Info */}
                <div style={{ flex: 1, textAlign: 'center', '@media (min-width: 768px)': { textAlign: 'left' } }}>
                  <h2 style={{
                    color: '#1a1a2e',
                    fontSize: '20px',
                    fontWeight: 600,
                    margin: '0 0 4px 0',
                  }}>
                    {user?.name || 'Creator Name'}
                  </h2>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '14px',
                    margin: '0 0 12px 0',
                  }}>
                    {user?.email || 'email@example.com'}
                  </p>

                  {/* Social Links */}
                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'center',
                    '@media (min-width: 768px)': {
                      justifyContent: 'flex-start',
                    },
                  }}>
                    {instagramProfile && (
                      <a href={instagramProfile.profileUrl || '#'} target="_blank" rel="noopener noreferrer" style={{ color: '#92400e' }}>
                        <Instagram size={20} />
                      </a>
                    )}
                    {youtubeProfile && (
                      <a href={youtubeProfile.profileUrl || '#'} target="_blank" rel="noopener noreferrer" style={{ color: '#92400e' }}>
                        <Youtube size={20} />
                      </a>
                    )}
                    {tiktokProfile && (
                      <a href={tiktokProfile.profileUrl || '#'} target="_blank" rel="noopener noreferrer" style={{ color: '#92400e' }}>
                        <TikTok size={20} />
                      </a>
                    )}
                    {linkedinProfile && (
                      <a href={linkedinProfile.profileUrl || '#'} target="_blank" rel="noopener noreferrer" style={{ color: '#92400e' }}>
                        <Linkedin size={20} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            '@media (min-width: 768px)': {
              gridTemplateColumns: 'repeat(4, 1fr)',
            },
          }}>
            <StatCard title="Followers" value={stats.followers.toLocaleString('en-IN')} icon={<Users size={20} />} />
            <StatCard title="Engagement" value={`${stats.engagementRate}%`} icon={<TrendingUp size={20} />} />
            <StatCard title="Avg Views" value={stats.avgViews.toLocaleString('en-IN')} icon={<BarChart3 size={20} />} />
            <StatCard title="Campaigns" value={stats.completedCampaigns.toString()} icon={<Camera size={20} />} />
          </div>

          {/* Bio */}
          <Card style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}>
            <CardHeader>
              <CardTitle style={{ color: '#1a1a2e', fontSize: '16px', fontWeight: 600 }}>
                About Me
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p style={{
                color: '#374151',
                fontSize: '14px',
                lineHeight: '1.6',
                margin: 0,
              }}>
                {creatorProfile.bio || 'No bio added yet. Edit your profile to add a bio.'}
              </p>
            </CardContent>
          </Card>

          {/* Portfolio / Previous Work */}
          <Card style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}>
            <CardHeader>
              <CardTitle style={{ color: '#1a1a2e', fontSize: '16px', fontWeight: 600 }}>
                Previous Collaborations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '12px',
              }}>
                {['Brand Campaign 1', 'Brand Campaign 2', 'Brand Campaign 3'].map((campaign, idx) => (
                  <div key={idx} style={{
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <div>
                      <div style={{ color: '#1a1a2e', fontSize: '14px', fontWeight: 500 }}>{campaign}</div>
                      <div style={{ color: '#6b7280', fontSize: '12px' }}>Brand Name</div>
                    </div>
                    <span style={{
                      backgroundColor: '#dcfce7',
                      color: '#166534',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                    }}>
                      Completed
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Categories */}
          <Card style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}>
            <CardHeader>
              <CardTitle style={{ color: '#1a1a2e', fontSize: '16px', fontWeight: 600 }}>
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
              }}>
                {(creatorProfile.categories as string[])?.map((cat) => (
                  <span key={cat} style={{
                    backgroundColor: '#f3f4f6',
                    color: '#1a1a2e',
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    fontSize: '14px',
                  }}>
                    {cat}
                  </span>
                )) || <span style={{ color: '#6b7280', fontSize: '14px' }}>No categories</span>}
              </div>
            </CardContent>
          </Card>

          {/* Location & Languages */}
          <Card style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}>
            <CardHeader>
              <CardTitle style={{ color: '#1a1a2e', fontSize: '16px', fontWeight: 600 }}>
                Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <DetailRow label="Location" value={creatorProfile.location || 'Not specified'} />
                <DetailRow label="Languages" value={(creatorProfile.languages as string[])?.join(', ') || 'Not specified'} />
                <DetailRow label="Rate per Post" value={creatorProfile.ratePerPost ? `₹${creatorProfile.ratePerPost.toLocaleString('en-IN')}` : 'Not specified'} />
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}>
            <CardHeader>
              <CardTitle style={{ color: '#1a1a2e', fontSize: '16px', fontWeight: 600 }}>
                Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ color: '#1a1a2e', fontSize: '14px' }}>{user?.email}</div>
                <div style={{ color: '#1a1a2e', fontSize: '14px' }}>{creatorProfile.phone || 'Phone not added'}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '16px',
      textAlign: 'center',
    }}>
      <div style={{ color: '#92400e', marginBottom: '8px' }}>{icon}</div>
      <div style={{
        color: '#1a1a2e',
        fontSize: '20px',
        fontWeight: 600,
        marginBottom: '2px',
      }}>
        {value}
      </div>
      <div style={{
        color: '#6b7280',
        fontSize: '12px',
        textTransform: 'uppercase' as const,
      }}>
        {title}
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{
        color: '#6b7280',
        fontSize: '12px',
        fontWeight: 600,
        textTransform: 'uppercase' as const,
        marginBottom: '2px',
      }}>
        {label}
      </div>
      <div style={{
        color: '#1a1a2e',
        fontSize: '14px',
      }}>
        {value}
      </div>
    </div>
  );
}
