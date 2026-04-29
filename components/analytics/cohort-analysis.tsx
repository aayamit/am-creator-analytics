/**
 * Advanced Analytics Component: Cohort Analysis
 * Creator retention by signup month
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';

interface CohortData {
  month: string;
  signedUp: number;
  activeMonth1: number; // % still active after 1 month
  activeMonth3: number;
  activeMonth6: number;
}

export default function CohortAnalysis({ tenantId }: { tenantId: string }) {
  const [cohortData] = useState<CohortData[]>([
    { month: '2026-01', signedUp: 45, activeMonth1: 82, activeMonth3: 65, activeMonth6: 48 },
    { month: '2026-02', signedUp: 52, activeMonth1: 79, activeMonth3: 61, activeMonth6: 0 },
    { month: '2026-03', signedUp: 61, activeMonth1: 85, activeMonth3: 0, activeMonth6: 0 },
    { month: '2026-04', signedUp: 38, activeMonth1: 0, activeMonth3: 0, activeMonth6: 0 },
  ]);

  return (
    <Card style={{ backgroundColor: 'white', border: '1px solid rgba(26,26,46,0.1)' }}>
      <CardHeader>
        <CardTitle style={{ fontSize: '18px', color: '#1a1a2e' }}>
          <BarChart3 size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Cohort Analysis — Creator Retention
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p style={{ fontSize: '14px', color: '#92400e', marginBottom: '16px' }}>
          Track creator retention by signup month (premium feature)
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(26,26,46,0.1)' }}>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', color: '#92400e' }}>Month</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', color: '#92400e' }}>Signed Up</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', color: '#92400e' }}>Active (1 mo)</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', color: '#92400e' }}>Active (3 mo)</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', color: '#92400e' }}>Active (6 mo)</th>
              </tr>
            </thead>
            <tbody>
              {cohortData.map((cohort, index) => (
                <tr key={index} style={{ borderBottom: '1px solid rgba(26,26,46,0.05)' }}>
                  <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 500, color: '#1a1a2e' }}>
                    {cohort.month}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#1a1a2e' }}>
                    {cohort.signedUp}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      backgroundColor: cohort.activeMonth1 >= 80 ? '#dcfce7' : cohort.activeMonth1 >= 60 ? '#fef3c7' : '#fee2e2',
                      color: '#1a1a2e',
                    }}>
                      {cohort.activeMonth1}%
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      backgroundColor: cohort.activeMonth3 >= 70 ? '#dcfce7' : cohort.activeMonth3 >= 50 ? '#fef3c7' : '#fee2e2',
                      color: '#1a1a2e',
                    }}>
                      {cohort.activeMonth3 || '-'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      backgroundColor: cohort.activeMonth6 >= 50 ? '#dcfce7' : cohort.activeMonth6 >= 30 ? '#fef3c7' : '#fee2e2',
                      color: '#1a1a2e',
                    }}>
                      {cohort.activeMonth6 || '-'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f8f7f4', borderRadius: '6px' }}>
          <p style={{ fontSize: '12px', color: '#92400e' }}>
            <strong>Insight:</strong> Creator retention is strongest in January cohort (48% after 6 months). 
            Focus on onboarding quality for new creators.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
