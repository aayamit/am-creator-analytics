/**
 * Creator Connections Page
 * Manage social media connections
 */

import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link2, Plus, CheckCircle, AlertCircle, Instagram, Youtube, TikTok, Linkedin } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/nextauth';

export const metadata: Metadata = {
  title: 'Connections | Creator | AM Creator Analytics',
  description: 'Manage your social media connections',
};

export default async function CreatorConnectionsPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <div>Unauthorized</div>;
  }

  // Fetch creator profile with social profiles
  const creatorProfile = await prisma.creatorProfile.findFirst({
    where: { userId: session.user.id },
    include: { socialProfiles: true },
  });

  const socialProfiles = creatorProfile?.socialProfiles || [];

  // Platform status
  const platforms = [
    {
      name: 'Instagram',
      key: 'INSTAGRAM',
      icon: <Instagram size={20} />,
      connected: socialProfiles.some(p => p.platform === 'INSTAGRAM'),
      profile: socialProfiles.find(p => p.platform === 'INSTAGRAM'),
    },
    {
      name: 'YouTube',
      key: 'YOUTUBE',
      icon: <Youtube size={20} />,
      connected: socialProfiles.some(p => p.platform === 'YOUTUBE'),
      profile: socialProfiles.find(p => p.platform === 'YOUTUBE'),
    },
    {
      name: 'TikTok',
      key: 'TIKTOK',
      icon: <TikTok size={20} />,
      connected: socialProfiles.some(p => p.platform === 'TIKTOK'),
      profile: socialProfiles.find(p => p.platform === 'TIKTOK'),
    },
    {
      name: 'LinkedIn',
      key: 'LINKEDIN',
      icon: <Linkedin size={20} />,
      connected: socialProfiles.some(p => p.platform === 'LINKEDIN'),
      profile: socialProfiles.find(p => p.platform === 'LINKEDIN'),
    },
  ];

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
            Connections
          </h1>
          <p style={{
            color: '#92400e',
            fontSize: '14px',
            margin: 0,
          }}>
            Manage your social media connections
          </p>
        </div>
      </div>

      {/* Platform Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '16px',
        '@media (min-width: 768px)': {
          gridTemplateColumns: 'repeat(2, 1fr)',
        },
      }}>
        {platforms.map((platform) => (
          <Card key={platform.key} style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}>
            <CardContent style={{ padding: '24px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}>
                  <span style={{ color: '#92400e' }}>{platform.icon}</span>
                  <div>
                    <div style={{
                      color: '#1a1a2e',
                      fontSize: '16px',
                      fontWeight: 600,
                    }}>
                      {platform.name}
                    </div>
                    {platform.profile && (
                      <div style={{
                        color: '#6b7280',
                        fontSize: '12px',
                      }}>
                        {platform.profile.profileUrl ? 'Connected' : 'Not connected'}
                      </div>
                    )}
                  </div>
                </div>
                {platform.connected ? (
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: '#16a34a',
                    fontSize: '12px',
                    fontWeight: 500,
                  }}>
                    <CheckCircle size={14} /> Connected
                  </span>
                ) : (
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: '#92400e',
                    fontSize: '12px',
                    fontWeight: 500,
                  }}>
                    <AlertCircle size={14} /> Not Connected
                  </span>
                )}
              </div>

              {platform.connected ? (
                <div>
                  {platform.profile?.handle && (
                    <div style={{
                      color: '#374151',
                      fontSize: '14px',
                      marginBottom: '8px',
                    }}>
                      Handle: @{platform.profile.handle}
                    </div>
                  )}
                  {platform.profile?.followerCount && (
                    <div style={{
                      color: '#374151',
                      fontSize: '14px',
                      marginBottom: '16px',
                    }}>
                      Followers: {platform.profile.followerCount.toLocaleString('en-IN')}
                    </div>
                  )}
                  <button style={{
                    backgroundColor: '#f1f5f9',
                    color: '#1a1a2e',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid #e5e7eb',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    width: '100%',
                  }}>
                    Disconnect
                  </button>
                </div>
              ) : (
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
                }}>
                  <Link2 size={16} /> Connect {platform.name}
                </button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Card */}
      <Card style={{
        backgroundColor: '#fef3c7',
        border: '1px solid #f59e0b',
        borderRadius: '8px',
        marginTop: '24px',
      }}>
        <CardContent style={{ padding: '16px' }}>
          <div style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start',
          }}>
            <AlertCircle size={20} style={{ color: '#92400e', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{
                color: '#92400e',
                fontSize: '14px',
                fontWeight: 600,
                marginBottom: '4px',
              }}>
                Why connect your accounts?
              </div>
              <p style={{
                color: '#92400e',
                fontSize: '12px',
                lineHeight: '1.5',
                margin: 0,
              }}>
                Connecting your social accounts allows us to automatically sync your follower count,
                engagement rate, and media kit information. This helps brands discover you and
                provides accurate analytics for your campaigns.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
