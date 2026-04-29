"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface ChartData {
  month: string;
  revenue: number;
  margin: number;
  creators: number;
}

interface RevenueChartProps {
  data: ChartData[];
}

export function RevenueMarginChart({ data }: RevenueChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1a1a2e" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#1a1a2e" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorMargin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#92400e" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#92400e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="month" stroke="#e5e7eb" />
        <YAxis stroke="#e5e7eb" />
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1a1a2e',
            color: '#F8F7F4',
            border: 'none',
            borderRadius: '8px',
          }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#1a1a2e"
          fillOpacity={1}
          fill="url(#colorRevenue)"
          name="Revenue (₹)"
        />
        <Area
          type="monotone"
          dataKey="margin"
          stroke="#92400e"
          fillOpacity={1}
          fill="url(#colorMargin)"
          name="Margin (₹)"
        />
        <Legend />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function CreatorGrowthChart({ data }: RevenueChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="month" stroke="#e5e7eb" />
        <YAxis stroke="#e5e7eb" />
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1a1a2e',
            color: '#F8F7F4',
            border: 'none',
            borderRadius: '8px',
          }}
        />
        <Bar
          dataKey="creators"
          fill="#1a1a2e"
          name="Active Creators"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
