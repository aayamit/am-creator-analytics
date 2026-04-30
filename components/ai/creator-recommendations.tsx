/**
 * AI Creator Recommendations Component
 * Shows AI-powered creator suggestions for a campaign
 * Uses Groq API (free tier) for inference
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Star, TrendingUp, Users, Lightbulb } from 'lucide-react';

interface CreatorRecommendation {
  id: string;
  name: string;
  handle: string;
  platform: string;
  followers: number;
  engagementRate: number;
  pastROI: number;
  score: number;
  reasoning: string;
}

interface AIRecommendationsProps {
  campaignId: string;
  budget?: number;
  platform?: string;
}

export default function AIRecommendations({
  campaignId,
  budget,
  platform,
}: AIRecommendationsProps) {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<CreatorRecommendation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/recommend-creators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId,
          budget,
          platform,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ backgroundColor: '#FFFFFF', border: '1px solid #e5e7eb' }}>
      <CardHeader>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lightbulb size={20} style={{ color: '#92400e' }} />
            AI Creator Recommendations
          </CardTitle>
          <Button
            onClick={fetchRecommendations}
            disabled={loading}
            size="sm"
            style={{ backgroundColor: '#1a1a2e', color: '#F8F7F4' }}
          >
            {loading ? (
              <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <>
                <Star size={16} style={{ marginRight: '4px' }} />
                Get Recommendations
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#FEE2E2',
            border: '1px solid #FECACA',
            borderRadius: '6px',
            color: '#991B1B',
            fontSize: '14px',
            marginBottom: '16px',
          }}>
            Error: {error}. Please try again.
          </div>
        )}

        {recommendations.length === 0 && !loading && (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#92400e',
            opacity: 0.8,
          }}>
            <Lightbulb size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <p style={{ fontSize: '16px', fontWeight: 500, marginBottom: '8px' }}>
              No recommendations yet
            </p>
            <p style={{ fontSize: '14px' }}>
              Click "Get Recommendations" to get AI-powered creator suggestions.
            </p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {recommendations.map((creator) => (
            <div
              key={creator.id}
              style={{
                padding: '16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                backgroundColor: expandedId === creator.id ? '#F8F7F4' : '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onClick={() => setExpandedId(expandedId === creator.id ? null : creator.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#1a1a2e',
                    color: '#F8F7F4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    fontSize: '16px',
                  }}>
                    {creator.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 style={{
                      margin: 0,
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#1a1a2e',
                    }}>
                      {creator.name}
                    </h4>
                    <p style={{
                      margin: 0,
                      fontSize: '12px',
                      color: '#92400e',
                      opacity: 0.8,
                    }}>
                      @{creator.handle} • {creator.platform}
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Badge style={{
                    backgroundColor: creator.score > 80 ? '#DCFCE7' : creator.score > 60 ? '#FEF9C3' : '#FEE2E2',
                    color: creator.score > 80 ? '#166534' : creator.score > 60 ? '#854D0E' : '#991B1B',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}>
                    Score: {creator.score}/100
                  </Badge>
                </div>
              </div>

              {expandedId === creator.id && (
                <div style={{
                  marginTop: '12px',
                  padding: '12px',
                  backgroundColor: '#F8F7F4',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                }}>
                  <h5 style={{
                    margin: '0 0 8px 0',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#1a1a2e',
                    textTransform: 'uppercase' as const,
                  }}>
                    AI Reasoning
                  </h5>
                  <p style={{
                    margin: 0,
                    fontSize: '14px',
                    color: '#1a1a2e',
                    lineHeight: 1.6,
                  }}>
                    {creator.reasoning}
                  </p>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '12px',
                    marginTop: '12px',
                  }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '11px', color: '#92400e', textTransform: 'uppercase' as const }}>
                        Followers
                      </p>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#1a1a2e' }}>
                        {(creator.followers || 0).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '11px', color: '#92400e', textTransform: 'uppercase' as const }}>
                        Engagement
                      </p>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#1a1a2e' }}>
                        {creator.engagementRate}%
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '11px', color: '#92400e', textTransform: 'uppercase' as const }}>
                        Past ROI
                      </p>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#16a34a' }}>
                        {creator.pastROI}%
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
