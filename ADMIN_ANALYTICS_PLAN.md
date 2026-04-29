# Admin Analytics Dashboard Plan

## 📊 Overview
Build **advanced admin analytics** for agency owners:
- **Revenue forecasting** (predictive analytics)
- **Creator retention curves** (cohort analysis)
- **Campaign ROI heatmaps** (visualize performance)
- **Real-time activity feed** (WebSocket-powered)

**Value**: Justifies ₹999/month Elite plan!

## 🚀 Features to Build

### 1. Revenue Forecasting
```typescript
// lib/revenue-forecast.ts
export function forecastRevenue(
  historicalData: { month: string; revenue: number }[],
  monthsAhead: number = 6
): { month: string; predicted: number; confidence: number }[] {
  // Simple linear regression for now
  // TODO: Replace with ML model (TensorFlow.js)
  
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
    const predicted = slope * x + intercept;
    forecast.push({
      month: `Month ${x + 1}`,
      predicted: Math.max(0, predicted),
      confidence: 0.85, // TODO: Calculate actual confidence
    });
  }

  return forecast;
}
```

### 2. Creator Retention Curves
```tsx
// components/analytics/retention-curve.tsx
'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function RetentionCurve({ tenantId }: { tenantId: string }) {
  // Mock data - replace with API call
  const data = [
    { month: 'Jan', cohort100: 100, month1: 85, month2: 72, month3: 65 },
    { month: 'Feb', cohort100: 100, month1: 88, month2: 75 },
    { month: 'Mar', cohort100: 100, month1: 82 },
  ];

  return (
    <div style={{ height: '400px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Line type="monotone" dataKey="month1" stroke="#92400e" name="Month 1" />
          <Line type="monotone" dataKey="month2" stroke="#22c55e" name="Month 2" />
          <Line type="monotone" dataKey="month3" stroke="#3b82f6" name="Month 3" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

### 3. Campaign ROI Heatmap
```tsx
// components/analytics/roi-heatmap.tsx
'use client';

import { Heatmap } from 'recharts-heatmap'; // Or use custom SVG

export default function ROIHeatmap({ tenantId }: { tenantId: string }) {
  // Mock data: campaigns x metrics
  const data = [
    { campaign: 'Summer Collection', platform: 'Instagram', roi: 3.2 },
    { campaign: 'Summer Collection', platform: 'YouTube', roi: 2.8 },
    { campaign: 'Festival Sale', platform: 'Instagram', roi: 4.1 },
    // ... more data
  ];

  return (
    <div>
      {/* Use recharts or custom SVG heatmap */}
      <p>ROI Heatmap (TODO: Implement with Recharts or D3)</p>
    </div>
  );
}
```

### 4. Real-time Activity Feed
```tsx
// components/analytics/activity-feed.tsx
'use client';

import { useWebSocket } from '@/hooks/use-websocket';

export default function ActivityFeed({ userId, tenantId }: { userId: string; tenantId: string }) {
  const [activities, setActivities] = useState<any[]>([]);

  useWebSocket({
    url: `ws://localhost:3000?userId=${userId}&tenantId=${tenantId}`,
    onMessage: (data) => {
      if (data.type === 'ACTIVITY') {
        setActivities(prev => [data.activity, ...prev.slice(0, 49)]); // Keep last 50
      }
    },
  });

  return (
    <div>
      <h3>Live Activity Feed</h3>
      {activities.map((activity, i) => (
        <div key={i} style={{
          padding: '12px',
          borderBottom: '1px solid #e5e7eb',
        }}>
          <p style={{ margin: 0, fontSize: '14px' }}>{activity.message}</p>
          <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
            {new Date(activity.timestamp).toLocaleTimeString()}
          </p>
        </div>
      ))}
    </div>
  );
}
```

## 📈 Advanced Charts to Build

1. **Revenue Forecast Chart** (Line chart with prediction interval)
2. **Creator Churn Rate** (Area chart)
3. **Campaign Performance Matrix** (Bubble chart: budget vs ROI vs creators)
4. **Platform Distribution** (Pie/Doughnut chart)
5. **Engagement Trends** (Multi-line chart)

## 🚀 Build Order

1. **Create lib/revenue-forecast.ts** (predictive model)
2. **Create components/analytics/retention-curve.tsx**
3. **Create components/analytics/roi-heatmap.tsx**
4. **Create components/analytics/activity-feed.tsx**
5. **Update app/[tenantId]/dashboard/admin/page.tsx** (add new charts)
6. **Add WebSocket events** for real-time activity
7. **Commit & continue**

## 💰 Value Proposition

| Feature | Elite Plan Value |
|---------|-------------------|
| Revenue Forecasting | Plan budgets better |
| Retention Curves | Reduce churn |
| ROI Heatmaps | Optimize campaigns |
| Live Activity | Instant insights |

**Justifies ₹999/month pricing!**

## 📊 Data Sources

1. **Prisma queries** (historical data)
2. **WebSocket events** (real-time activity)
3. **MeiliSearch** (fast aggregation)
4. **Redis cache** (performance)

---

**Ready to build advanced analytics? Say "analytics now" and I'll start!** 📊
