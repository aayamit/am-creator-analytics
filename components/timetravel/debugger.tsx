/**
 * Time Travel Debugger Component
 * Fix bugs in past commits (temporal debugging)
 * Bloomberg × McKinsey design with sci-fi elements
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, ArrowLeft, Bug, Zap, Eye } from 'lucide-react';

type TimetravelAction = 'INSPECT' | 'FIX' | 'RESTORE';

export default function TimetravelDebugger() {
  const [targetCommit, setTargetCommit] = useState('');
  const [action, setAction] = useState<TimetravelAction>('INSPECT');
  const [fixPatch, setFixPatch] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const executeTimeTravel = async () => {
    setLoading(true);
    try {
      const body: any = { targetCommit, action };
      if (action === 'FIX') {
        body.fixPatch = fixPatch;
      }

      const res = await fetch('/api/timetravel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error('Time travel failed:', error);
      setResult({
        success: false,
        error: 'Temporal anomaly detected!',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadTimeline = async () => {
    try {
      const res = await fetch('/api/timetravel');
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error('Failed to load timeline:', error);
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
          🕰️ Time Travel Debugger
          <span style={{ 
            fontSize: '12px', 
            backgroundColor: '#92400e' + '20', 
            color: '#92400e',
            padding: '2px 8px',
            borderRadius: '12px',
          }}>
            Temporal
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '4px', 
            fontSize: '14px', 
            color: '#6b7280' 
          }}>
            Target Commit Hash
          </label>
          <input
            type="text"
            value={targetCommit}
            onChange={(e) => setTargetCommit(e.target.value)}
            placeholder="e.g., abc123def456"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              fontFamily: 'monospace',
            }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '4px', 
            fontSize: '14px', 
            color: '#6b7280' 
          }}>
            Action
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['INSPECT', 'FIX', 'RESTORE'] as TimetravelAction[]).map(act => (
              <Button
                key={act}
                onClick={() => setAction(act)}
                variant={action === act ? 'default' : 'outline'}
                style={{
                  backgroundColor: action === act ? '#92400e' : 'transparent',
                  color: action === act ? '#F8F7F4' : '#92400e',
                  fontSize: '12px',
                }}
              >
                {act === 'INSPECT' && <Eye size={14} style={{ marginRight: '4px' }} />}
                {act === 'FIX' && <Bug size={14} style={{ marginRight: '4px' }} />}
                {act === 'RESTORE' && <ArrowLeft size={14} style={{ marginRight: '4px' }} />}
                {act}
              </Button>
            ))}
          </div>
        </div>

        {action === 'FIX' && (
          <div style={{ marginBottom: '12px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '4px', 
              fontSize: '14px', 
              color: '#6b7280' 
            }}>
              Fix Patch (code)
            </label>
            <textarea
              value={fixPatch}
              onChange={(e) => setFixPatch(e.target.value)}
              placeholder="// Paste fix code here..."
              style={{
                width: '100%',
                minHeight: '80px',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '12px',
                fontFamily: 'monospace',
                resize: 'vertical',
              }}
            />
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <Button
            onClick={executeTimeTravel}
            disabled={loading || !targetCommit}
            style={{
              backgroundColor: '#92400e',
              color: '#F8F7F4',
              flex: 1,
            }}
          >
            {loading ? (
              <>
                <Zap size={16} style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }} />
                Traveling through time...
              </>
            ) : (
              <>
                <Clock size={16} style={{ marginRight: '8px' }} />
                ⏳ Execute Time Travel
              </>
            )}
          </Button>

          <Button
            onClick={loadTimeline}
            variant="outline"
            style={{ borderColor: '#92400e', color: '#92400e' }}
          >
            Load Timeline
          </Button>
        </div>

        {result && (
          <div>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: 600, 
              marginBottom: '12px',
              color: result.success ? '#16a34a' : '#dc2626',
            }}>
              {result.success ? '✅ Time Travel Successful' : '❌ Temporal Anomaly'}
            </h3>
            
            {result.temporalWarning && (
              <div style={{ 
                fontSize: '12px', 
                color: '#92400e',
                backgroundColor: '#92400e' + '10',
                padding: '8px 12px',
                borderRadius: '6px',
                marginBottom: '12px',
                border: '1px solid #92400e' + '30',
              }}>
                ⚠️ {result.temporalWarning}
              </div>
            )}

            <pre style={{ 
              backgroundColor: '#1a1a2e',
              color: '#F8F7F4',
              padding: '12px',
              borderRadius: '6px',
              fontSize: '12px',
              overflow: 'auto',
              fontFamily: 'monospace',
            }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div style={{ 
          marginTop: '16px',
          fontSize: '12px', 
          color: '#6b7280',
          fontStyle: 'italic',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          <Zap size={12} />
          Warning: Modifying past commits may create temporal paradox!
        </div>
      </CardContent>
    </Card>
  );
}
