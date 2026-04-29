/**
 * Revenue Forecast Component
 * Predictive analytics for Elite plan (₹999/month)
 */

'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';

// Simple linear regression for revenue forecasting
function calculateForecast(historicalData: { month: string; revenue: number }[], monthsAhead: number = 6) {
  const n = historicalData.length;
  if (n < 2) return [];

  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

  historicalData.forEach((d, i) => {
    sumX += i;
    sumY += d.revenue;
    sumXY += i * d.revenue;
    sumX2 += i * i;
  });

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const forecast = [];
  for (let i = 1; i <= monthsAhead; i++) {
    const x = n + i - 1;
    const predicted = Math.max(0, slope * x + intercept);
    forecast.push({
      month: `Month ${x + 1}`,
      predicted: Math.round(predicted),
      lowerBound: Math.round(predicted * 0.85), // 85% confidence
      upperBound: Math.round(predicted * 1.15), // 115% confidence
    });
  }

  return forecast;
}

export default function RevenueForecast({ tenantId }: { tenantId: string }) {
  const [historicalData, setHistoricalData] = useState<{ month: string; revenue: number }[]>([
    { month: 'Jan', revenue: 125000 },
    { month: 'Feb', revenue: 142000 },
    { month: 'Mar', revenue: 158000 },
    { month: 'Apr', revenue: 175000 },
    { month: 'May', revenue: 192000 },
  ]);

  const [forecast, setForecast] = useState<any[]>([]);

  useEffect(() => {
    // TODO: Fetch historical data from API
    const forecastData = calculateForecast(historicalData, 6);
    setForecast(forecastData);
  }, [historicalData]);

  const chartData = [
    ...historicalData.map(d => ({ ...d, predicted: null, lowerBound: null, upperBound: null })),
    ...forecast,
  ];

  return (
    <Card style={{ backgroundColor: 'white', border: '1px solid rgba(26,26,46,0.1)' }}>
      <CardHeader>
        <CardTitle style={{ fontSize: '18px', color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={20} />
          Revenue Forecast (6 Months)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,26,46,0.1)" />
              <XAxis dataKey="month" tick={{ fill: '#92400e', fontSize: '12px' }} />
              <YAxis
                tick={{ fill: '#92400e', fontSize: '12px' }}
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip
                formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, 'Revenue']}
                labelFormatter={(label) => `Month: ${label}`}
                contentStyle={{ backgroundColor: 'white', border: '1px solid rgba(26,26,46,0.1)' }}
              />
              {/* Historical revenue */}
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#1a1a2e"
                strokeWidth={2}
                dot={{ fill: '#1a1a2e', r: 4 }}
                activeDot={{ r: 6 }}
              />
              {/* Predicted revenue */}
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#92400e"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#92400e', r: 4 }}
              />
              {/* Confidence interval */}
              <Line type="monotone" dataKey="upperBound" stroke="transparent" />
              <Line type="monotone" dataKey="lowerBound" stroke="transparent" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ marginTop: '16px', fontSize: '12px', color: '#92400e', opacity: 0.8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#1a1a2e', borderRadius: '2px' }} />
            Historical Revenue
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#92400e', borderRadius: '2px' }} />
            Predicted Revenue (85-115% confidence)
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
