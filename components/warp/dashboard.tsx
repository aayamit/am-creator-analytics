/**
 * Warp Drive Dashboard Component
 * Control panel for faster-than-light campaign processing
 * Bloomberg × McKinsey design with sci-fi flair
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rocket, Zap, AlertTriangle } from 'lucide-react';

type WarpSpeed = 'IMPULSE' | 'WARP_1' | 'WARP_5' | 'WARP_9' | 'TRANSPORTER';

export default function WarpDriveDashboard() {
  const [warpStatus, setWarpStatus] = useState<'OFF' | 'CHARGING' | 'ENGAGED'>('OFF');
  const [warpFactor, setWarpFactor] = useState(0);
  const [selectedSpeed, setSelectedSpeed] = useState<WarpSpeed>('WARP_5');

  const engageWarp = async (speed: WarpSpeed) => {
    setSelectedSpeed(speed);
    setWarpStatus('CHARGING');
    
    // Simulate warp charging
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      const res = await fetch('/api/warp/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ speed, campaignCount: 100 }),
      });
      
      const data = await res.json();
      if (data.success) {
        setWarpStatus('ENGAGED');
        setWarpFactor(data.warpFactor);
      }
    } catch (error) {
      console.error('Warp engage failed:', error);
      setWarpStatus('OFF');
    }
  };

  const disengageWarp = () => {
    setWarpStatus('OFF');
    setWarpFactor(0);
  };

  const getWarpColor = (speed: WarpSpeed): string => {
    const colors: Record<WarpSpeed, string> = {
      'IMPULSE': '#6b7280',
      'WARP_1': '#3b82f6',
      'WARP_5': '#92400e',
      'WARP_9': '#16a34a',
      'TRANSPORTER': '#dc2626',
    };
    return colors[speed];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle style={{ 
          fontSize: '18px', 
          color: '#1a1a2e',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          🚀 Warp Drive Control
          {warpStatus === 'ENGAGED' && (
            <span style={{ 
              fontSize: '12px', 
              backgroundColor: '#16a34a', 
              color: '#F8F7F4',
              padding: '2px 8px',
              borderRadius: '12px',
            }}>
              WARP {warpFactor} ENGAGED
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {warpStatus === 'OFF' && (
          <div style={{ 
            padding: '24px',
            textAlign: 'center',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            marginBottom: '16px',
          }}>
            <Rocket size={48} style={{ color: '#92400e', marginBottom: '12px' }} />
            <p style={{ fontSize: '14px', color: '#6b7280' }}>
              Warp drive offline. Select speed to engage.
            </p>
          </div>
        )}

        {warpStatus === 'CHARGING' && (
          <div style={{ textAlign: 'center', padding: '24px', color: '#92400e' }}>
            <Rocket size={48} style={{ animation: 'spin 1s linear infinite', marginBottom: '12px' }} />
            <p style={{ fontSize: '16px', fontWeight: 600 }}>Charging warp drive...</p>
            <p style={{ fontSize: '12px', color: '#6b7280' }}>Please wait, initializing faster-than-light sequence</p>
          </div>
        )}

        {warpStatus === 'ENGAGED' && (
          <div style={{ 
            padding: '16px',
            backgroundColor: '#92400e' + '10',
            borderRadius: '8px',
            border: '1px solid #92400e',
            marginBottom: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Zap size={20} style={{ color: '#92400e' }} />
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#92400e' }}>
                Warp {warpFactor} Engaged!
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#6b7280' }}>
              Campaigns processing at {warpFactor === 9001 ? 'OVER 9000' : warpFactor}x light speed!
            </p>
          </div>
        )}

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
          gap: '8px',
          marginBottom: '16px',
        }}>
          {(['IMPULSE', 'WARP_1', 'WARP_5', 'WARP_9', 'TRANSPORTER'] as WarpSpeed[]).map(speed => (
            <Button
              key={speed}
              onClick={() => engageWarp(speed)}
              disabled={warpStatus === 'CHARGING'}
              style={{
                backgroundColor: warpStatus === 'ENGAGED' && selectedSpeed === speed 
                  ? '#16a34a' 
                  : getWarpColor(speed),
                color: '#F8F7F4',
                opacity: warpStatus === 'CHARGING' ? 0.5 : 1,
              }}
            >
              {speed === 'TRANSPORTER' ? '🖖 TRANSPORTER' : `🚀 ${speed}`}
            </Button>
          ))}
        </div>

        {warpStatus === 'ENGAGED' && (
          <Button
            onClick={disengageWarp}
            variant="outline"
            style={{ width: '100%', borderColor: '#dc2626', color: '#dc2626' }}
          >
            ⚠️ Disengage Warp Drive
          </Button>
        )}

        <div style={{ 
          marginTop: '16px',
          fontSize: '12px',
          color: '#6b7280',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          <AlertTriangle size={12} />
          Do not exceed Warp 9.995 or you'll create a temporal vortex!
        </div>
      </CardContent>
    </Card>
  );
}
