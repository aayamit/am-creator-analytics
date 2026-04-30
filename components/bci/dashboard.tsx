/**
 * BCI Dashboard Component
 * Brain-Computer Interface (simulated)
 * Bloomberg × McKinsey design
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface BrainWave {
  alpha: number;
  beta: number;
  theta: number;
  delta: number;
}

export default function BCIDashboard() {
  const [isConnected, setIsConnected] = useState(false);
  const [brainWave, setBrainWave] = useState<BrainWave | null>(null);
  const [command, setCommand] = useState('');
  const [emotion, setEmotion] = useState('');
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const connectBCI = () => {
    setIsConnected(true);
    
    // Simulate real-time brain wave reading
    const id = setInterval(async () => {
      try {
        const res = await fetch('/api/bci/interpret', { method: 'POST' });
        const data = await res.json();
        setBrainWave(data.brainWave);
        setCommand(data.interpretedCommand);
        setEmotion(data.detectedEmotion);
      } catch (error) {
        console.error('BCI fetch error:', error);
      }
    }, 2000);
    
    setIntervalId(id);
  };

  const disconnectBCI = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsConnected(false);
    setBrainWave(null);
    setCommand('');
    setEmotion('');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  const getCommandEmoji = (cmd: string) => {
    switch (cmd) {
      case 'CREATE_CAMPAIGN': return '📝';
      case 'NAVIGATE_DASHBOARD': return '🧭';
      case 'VIEW_CREATORS': return '👥';
      case 'SEND_PAYMENT': return '💸';
      case 'CALM_DOWN': return '😌';
      case 'FOCUS_MODE': return '🎯';
      default: return '🤔';
    }
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
          🧠 Brain-Computer Interface (BCI)
          {isConnected && (
            <span style={{ 
              fontSize: '12px', 
              backgroundColor: '#16a34a', 
              color: '#F8F7F4',
              padding: '2px 8px',
              borderRadius: '12px',
            }}>
              Connected
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isConnected ? (
          <Button 
            onClick={connectBCI}
            style={{ backgroundColor: '#92400e', color: '#F8F7F4' }}
          >
            🔌 Connect BCI Headset (Simulated)
          </Button>
        ) : (
          <div>
            <Button 
              onClick={disconnectBCI}
              variant="outline"
              style={{ marginBottom: '16px' }}
            >
              Disconnect
            </Button>

            {brainWave && (
              <div style={{ marginTop: '16px' }}>
                <h3 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
                  📊 Brain Wave Readings
                </h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(2, 1fr)', 
                  gap: '8px',
                  marginBottom: '16px',
                }}>
                  {[
                    { label: 'Alpha (relaxation)', value: brainWave.alpha, color: '#16a34a' },
                    { label: 'Beta (thinking)', value: brainWave.beta, color: '#92400e' },
                    { label: 'Theta (drowsiness)', value: brainWave.theta, color: '#dc2626' },
                    { label: 'Delta (deep sleep)', value: brainWave.delta, color: '#6b7280' },
                  ].map(item => (
                    <div 
                      key={item.label}
                      style={{ 
                        padding: '8px 12px', 
                        backgroundColor: '#f9fafb', 
                        borderRadius: '6px',
                        fontSize: '12px',
                      }}
                    >
                      <div style={{ color: '#6b7280' }}>{item.label}</div>
                      <div style={{ 
                        fontSize: '18px', 
                        fontWeight: 600, 
                        color: item.color,
                      }}>
                        {item.value.toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ 
                  padding: '12px', 
                  backgroundColor: '#f9fafb', 
                  borderRadius: '6px',
                  marginBottom: '12px',
                }}>
                  <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                    Detected Emotion
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#1a1a2e' }}>
                    {emotion}
                  </div>
                </div>

                <div style={{ 
                  padding: '12px', 
                  backgroundColor: '#92400e' + '10', 
                  borderRadius: '6px',
                  border: '1px solid #92400e',
                }}>
                  <div style={{ fontSize: '14px', color: '#92400e', marginBottom: '4px' }}>
                    Interpreted Command
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 600, color: '#1a1a2e' }}>
                    {getCommandEmoji(command)} {command}
                  </div>
                </div>
              </div>
            )}

            <div style={{ 
              fontSize: '12px', 
              color: '#6b7280', 
              textAlign: 'center',
              marginTop: '16px',
              fontStyle: 'italic',
            }}>
              🔬 This is a simulated BCI. In production, connect to OpenBCI or Neuralink API.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
