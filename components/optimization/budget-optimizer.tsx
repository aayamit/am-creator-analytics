/**
 * Budget Optimizer Component
 * Quantum-inspired budget allocation
 * Bloomberg × McKinsey design
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface Allocation {
  creatorId: string;
  creatorName: string;
  budget: number;
  expectedEngagement: number;
}

export default function BudgetOptimizer({ campaignId, creators }: {
  campaignId: string;
  creators: { id: string; name: string; rate: number }[];
}) {
  const [totalBudget, setTotalBudget] = useState(100000); // ₹1L default
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    allocation: Allocation[];
    totalExpectedEngagement: number;
  } | null>(null);

  const optimize = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/optimize/budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId, totalBudget }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        alert(data.error || 'Optimization failed');
      }
    } catch (error) {
      console.error('Optimization error:', error);
      alert('Failed to optimize budget');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle style={{ fontSize: '18px', color: '#1a1a2e' }}>
          ⚛️ Quantum Budget Optimizer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#6b7280' }}>
            Total Budget (₹)
          </label>
          <input
            type="number"
            value={totalBudget}
            onChange={(e) => setTotalBudget(Number(e.target.value))}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
            }}
          />
        </div>

        <Button
          onClick={optimize}
          disabled={loading || creators.length === 0}
          style={{
            backgroundColor: '#92400e',
            color: '#F8F7F4',
            width: '100%',
            marginBottom: '16px',
          }}
        >
          {loading ? (
            <>
              <Loader2 size={16} style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }} />
              Optimizing...
            </>
          ) : (
            '⚛️ Optimize Budget (Quantum-Inspired)'
          )}
        </Button>

        {result && (
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: '#1a1a2e' }}>
              Optimal Allocation
            </h3>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
              Total Expected Engagement: <strong style={{ color: '#16a34a' }}>
                {result.totalExpectedEngagement.toFixed(0)} engagements
              </strong>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {result.allocation.map((a) => (
                <div
                  key={a.creatorId}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '6px',
                    fontSize: '14px',
                  }}
                >
                  <span style={{ color: '#1a1a2e' }}>{a.creatorName}</span>
                  <span style={{ color: '#92400e', fontWeight: 600 }}>
                    ₹{a.budget.toLocaleString()} → {a.expectedEngagement.toFixed(0)} engagements
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {creators.length === 0 && (
          <div style={{ fontSize: '14px', color: '#6b7280', textAlign: 'center', padding: '16px' }}>
            No creators added to this campaign yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
