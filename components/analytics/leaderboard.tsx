/**
 * Creator Leaderboard Component
 * Rank creators by performance (premium feature)
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, TrendingUp, Users, BarChart3 } from 'lucide-react';
import { useState } from 'react';

interface CreatorRanking {
  id: string;
  name: string;
  avatar?: string;
  platform: string;
  followers: number;
  engagementRate: number;
  roi: number;
  earnings: number;
  rank: number;
}

export default function CreatorLeaderboard({ tenantId }: { tenantId: string }) {
  const [leaderboard] = useState<CreatorRanking[]>([
    {
      id: '1',
      name: 'Priya Sharma',
      platform: 'Instagram',
      followers: 125000,
      engagementRate: 4.8,
      roi: 450,
      earnings: 125000,
      rank: 1,
    },
    {
      id: '2',
      name: 'Arjun Patel',
      platform: 'YouTube',
      followers: 89000,
      engagementRate: 5.2,
      roi: 380,
      earnings: 98000,
      rank: 2,
    },
    {
      id: '3',
      name: 'Sneha Reddy',
      platform: 'Instagram',
      followers: 156000,
      engagementRate: 3.9,
      roi: 320,
      earnings: 89000,
      rank: 3,
    },
    {
      id: '4',
      name: 'Vikram Singh',
      platform: 'TikTok',
      followers: 230000,
      engagementRate: 6.1,
      roi: 510,
      earnings: 156000,
      rank: 4,
    },
    {
      id: '5',
      name: 'Ananya Gupta',
      platform: 'YouTube',
      followers: 67000,
      engagementRate: 4.5,
      roi: 290,
      earnings: 67000,
      rank: 5,
    },
  ]);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { emoji: '🥇', color: '#fbbf24', bg: '#fef3c7' };
    if (rank === 2) return { emoji: '🥈', color: '#94a3b8', bg: '#f1f5f9' };
    if (rank === 3) return { emoji: '🥉', color: '#cd7c2e', bg: '#fef3c7' };
    return { emoji: `#${rank}`, color: '#1a1a2e', bg: '#f8f7f4' };
  };

  const formatNumber = (num: number): string => {
    if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
    if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <Card style={{ backgroundColor: 'white', border: '1px solid rgba(26,26,46,0.1)' }}>
      <CardHeader>
        <CardTitle style={{ fontSize: '18px', color: '#1a1a2e' }}>
          <Trophy size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Creator Leaderboard — Top Performers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p style={{ fontSize: '14px', color: '#92400e', marginBottom: '16px' }}>
          Ranked by ROI + engagement (premium feature for Elite plan)
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(26,26,46,0.1)' }}>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', color: '#92400e' }}>Rank</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', color: '#92400e' }}>Creator</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', color: '#92400e' }}>Platform</th>
                <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '12px', color: '#92400e' }}>Followers</th>
                <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '12px', color: '#92400e' }}>Engagement</th>
                <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '12px', color: '#92400e' }}>ROI</th>
                <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '12px', color: '#92400e' }}>Earnings</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((creator) => {
                const badge = getRankBadge(creator.rank);
                return (
                  <tr key={creator.id} style={{ borderBottom: '1px solid rgba(26,26,46,0.05)' }}>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: badge.bg,
                        color: badge.color,
                        fontWeight: 600,
                        fontSize: '14px',
                      }}>
                        {badge.emoji}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: '#e5e7eb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px',
                          fontWeight: 600,
                          color: '#1a1a2e',
                        }}>
                          {creator.name.charAt(0)}
                        </div>
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: 500, color: '#1a1a2e', margin: 0 }}>
                            {creator.name}
                          </p>
                          <p style={{ fontSize: '12px', color: '#92400e', margin: 0 }}>
                            {creator.platform}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#1a1a2e' }}>
                      {creator.platform}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#1a1a2e', textAlign: 'right' }}>
                      {formatNumber(creator.followers)}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: creator.engagementRate > 5 ? '#16a34a' : '#dc2626', textAlign: 'right' }}>
                      {creator.engagementRate}%
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 600, color: '#16a34a', textAlign: 'right' }}>
                      {creator.roi}%
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 600, color: '#1a1a2e', textAlign: 'right' }}>
                      ₹{formatNumber(creator.earnings)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f8f7f4', borderRadius: '6px' }}>
          <p style={{ fontSize: '12px', color: '#92400e', margin: 0 }}>
            <strong>Insight:</strong> Top creators have 5%+ engagement rates. 
            Consider increasing budgets for ranks 1-3.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
