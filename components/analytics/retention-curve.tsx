/**
 * Creator Retention Curve Component
 * Cohort analysis for creator retention
 */

'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

// Mock cohort data (replace with API call)
const cohortData = [
  { month: 'Jan', cohort100: 100, month1: 85, month2: 72, month3: 65, month4: 60, month5: 56 },
  { month: 'Feb', cohort100: 100, month1: 88, month2: 75, month3: 68, month4: 62 },
  { month: 'Mar', cohort100: 100, month1: 82, month2: 70, month3: 64 },
  { month: 'Apr', cohort100: 100, month1: 90, month2: 78 },
  { month: 'May', cohort100: 100, month1: 86 },
];

export default function RetentionCurve({ tenantId }: { tenantId: string }) {
  return (
    <Card style={{ backgroundColor: 'white', border: '1px solid rgba(26,26,46,0.1)' }}>
      <CardHeader>
        <CardTitle style={{ fontSize: '18px', color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={20} />
          Creator Retention Curve
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cohortData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,26,46,0.1)" />
              <XAxis dataKey="month" tick={{ fill: '#92400e', fontSize: '12px' }} />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: '#92400e', fontSize: '12px' }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                formatter={(value: any) => [`${value}%`, 'Retention']}
                labelFormatter={(label) => `Cohort: ${label}`}
                contentStyle={{ backgroundColor: 'white', border: '1px solid rgba(26,26,46,0.1)' }}
              />
              <Legend
                wrapperStyle={{ fontSize: '12px', color: '#92400e' }}
              />
              <Line type="monotone" dataKey="month1" stroke="#92400e" strokeWidth={2} name="Month 1" />
              <Line type="monotone" dataKey="month2" stroke="#22c55e" strokeWidth={2} name="Month 2" />
              <Line type="monotone" dataKey="month3" stroke="#3b82f6" strokeWidth={2} name="Month 3" />
              <Line type="monotone" dataKey="month4" stroke="#a855f7" strokeWidth={2} name="Month 4" />
              <Line type="monotone" dataKey="month5" stroke="#ec4899" strokeWidth={2} name="Month 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ marginTop: '16px', fontSize: '12px', color: '#92400e', opacity: 0.8 }}>
          Shows what % of creators from each month's cohort remain active after N months.
          Lower retention = higher churn risk.
        </div>
      </CardContent>
    </Card>
  );
}
