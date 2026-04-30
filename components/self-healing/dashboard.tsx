/**
 * Self-Healing Dashboard Component
 * Paste error logs, get healing suggestions
 * Bloomberg × McKinsey design
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface HealingResult {
  success: boolean;
  error?: string;
  suggestion?: string;
  patch?: string;
  autoFixAvailable?: boolean;
  message?: string;
}

export default function SelfHealingDashboard() {
  const [errorLog, setErrorLog] = useState('');
  const [result, setResult] = useState<HealingResult | null>(null);
  const [loading, setLoading] = useState(false);

  const heal = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/heal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ errorLog }),
      });
      
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error('Healing failed:', error);
      setResult({
        success: false,
        message: 'Failed to connect to healing service',
      });
    } finally {
      setLoading(false);
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
          🏥 Self-Healing Code
          <span style={{ 
            fontSize: '12px', 
            backgroundColor: '#16a34a' + '20', 
            color: '#16a34a',
            padding: '2px 8px',
            borderRadius: '12px',
          }}>
            AI-Powered
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <textarea
          value={errorLog}
          onChange={(e) => setErrorLog(e.target.value)}
          placeholder="Paste error log here... (e.g., 'Cannot read properties of undefined reading map')"
          style={{
            width: '100%',
            minHeight: '120px',
            padding: '8px 12px',
            marginBottom: '12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            fontFamily: 'monospace',
            resize: 'vertical',
          }}
        />
        
        <Button
          onClick={heal}
          disabled={loading || !errorLog}
          style={{
            backgroundColor: '#16a34a',
            color: '#F8F7F4',
            width: '100%',
            marginBottom: '16px',
          }}
        >
          {loading ? (
            <>
              <Loader2 size={16} style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }} />
              Healing...
            </>
          ) : (
            '🏥 Heal Code'
          )}
        </Button>
        
        {result && (
          <div>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: 600, 
              marginBottom: '12px',
              color: result.success ? '#16a34a' : '#dc2626',
            }}>
              {result.success ? '✅ Healing Suggestion' : '❌ Healing Failed'}
            </h3>
            
            {result.error && (
              <div style={{ 
                fontSize: '12px', 
                color: '#6b7280',
                marginBottom: '8px',
                fontFamily: 'monospace',
                backgroundColor: '#f9fafb',
                padding: '8px',
                borderRadius: '4px',
              }}>
                Error: {result.error}
              </div>
            )}
            
            {result.suggestion && (
              <div style={{ 
                fontSize: '14px', 
                color: '#1a1a2e',
                marginBottom: '12px',
                padding: '8px 12px',
                backgroundColor: '#92400e' + '10',
                borderRadius: '6px',
                border: '1px solid #92400e' + '30',
              }}>
                <strong>Suggestion:</strong> {result.suggestion}
              </div>
            )}
            
            {result.patch && (
              <div style={{ 
                fontSize: '12px', 
                color: '#6b7280',
                marginBottom: '8px',
              }}>
                <strong>Suggested Fix:</strong>
              </div>
            )}
            
            {result.patch && (
              <pre style={{ 
                backgroundColor: '#1a1a2e',
                color: '#F8F7F4',
                padding: '12px',
                borderRadius: '6px',
                fontSize: '12px',
                overflow: 'auto',
                fontFamily: 'monospace',
              }}>
                {result.patch}
              </pre>
            )}
            
            {result.autoFixAvailable && (
              <div style={{ 
                fontSize: '12px', 
                color: '#16a34a',
                marginTop: '12px',
                fontStyle: 'italic',
              }}>
                ✅ Auto-fix available! Apply patch to heal your code.
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
