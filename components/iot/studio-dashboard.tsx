/**
 * Studio Dashboard (IoT)
 * Shows smart studio device status
 * Bloomberg × McKinsey design
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Camera, Thermometer, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Device {
  id: string;
  name: string;
  type: 'light' | 'camera' | 'sensor';
  online: boolean;
  status?: string;
  temp?: number;
}

export default function StudioDashboard() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/iot/studio/status')
      .then(res => res.json())
      .then(data => {
        setDevices(data.devices || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch IoT status:', err);
        setLoading(false);
      });
  }, []);

  const sendCommand = async (deviceId: string, command: string) => {
    try {
      const res = await fetch(`/api/iot/device/${deviceId}/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command }),
      });
      
      if (res.ok) {
        // Refresh status
        const statusRes = await fetch('/api/iot/studio/status');
        const data = await statusRes.json();
        setDevices(data.devices || []);
      }
    } catch (error) {
      console.error('Failed to send command:', error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'light': return <Lightbulb size={20} />;
      case 'camera': return <Camera size={20} />;
      case 'sensor': return <Thermometer size={20} />;
      default: return null;
    }
  };

  if (loading) {
    return <div style={{ padding: '24px', color: '#6b7280' }}>Loading studio devices...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#1a1a2e' }}>
          🏠 Smart Studio Dashboard
        </h2>
        <Button
          onClick={() => {
            fetch('/api/iot/studio/status')
              .then(res => res.json())
              .then(data => setDevices(data.devices || []));
          }}
          style={{ backgroundColor: '#92400e', color: '#F8F7F4' }}
        >
          Refresh
        </Button>
      </div>

      {devices.length === 0 ? (
        <div style={{ 
          padding: '48px', 
          textAlign: 'center', 
          backgroundColor: '#f9fafb', 
          borderRadius: '8px',
          color: '#6b7280'
        }}>
          <p style={{ fontSize: '18px', marginBottom: '8px' }}>No IoT devices configured</p>
          <p style={{ fontSize: '14px' }}>Connect your smart studio devices to see them here</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '16px' 
        }}>
          {devices.map(device => (
            <Card key={device.id} style={{ 
              border: `1px solid ${device.online ? '#16a34a' : '#dc2626'}`,
              opacity: device.online ? 1 : 0.6,
            }}>
              <CardHeader>
                <CardTitle style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '16px'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {getIcon(device.type)}
                    {device.name}
                  </span>
                  {device.online ? 
                    <Wifi size={16} style={{ color: '#16a34a' }} /> : 
                    <WifiOff size={16} style={{ color: '#dc2626' }} />
                  }
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
                  Status: <strong style={{ color: device.online ? '#16a34a' : '#dc2626' }}>
                    {device.online ? '🟢 Online' : '🔴 Offline'}
                  </strong>
                </div>
                {device.status && (
                  <div style={{ fontSize: '14px', color: '#1a1a2e', marginBottom: '8px' }}>
                    Mode: <strong>{device.status}</strong>
                  </div>
                )}
                {device.temp && (
                  <div style={{ fontSize: '14px', color: '#1a1a2e', marginBottom: '8px' }}>
                    Temperature: <strong>{device.temp}°C</strong>
                  </div>
                )}
                {device.online && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <Button
                      size="sm"
                      onClick={() => sendCommand(device.id, 'toggle')}
                      style={{ backgroundColor: '#92400e', color: '#F8F7F4' }}
                    >
                      Toggle
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => sendCommand(device.id, 'status')}
                    >
                      Check Status
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
