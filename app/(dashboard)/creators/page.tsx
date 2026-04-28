"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Eye, Heart, DollarSign } from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface CreatorData {
  profile: any;
  analytics: any;
  loading: boolean;
}

export default function CreatorDashboard() {
  const [data, setData] = useState<CreatorData>({
    profile: null,
    analytics: null,
    loading: true,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch current user profile
        const meRes = await fetch("/api/me");
        const meData = await meRes.json();

        if (!meData.profile?.id) {
          console.error("No creator profile found");
          return;
        }

        // Fetch analytics
        const analyticsRes = await fetch(
          `/api/creators/${meData.profile.id}/analytics`
        );
        const analyticsData = await analyticsRes.json();

        setData({
          profile: meData.profile,
          analytics: analyticsData,
          loading: false,
        });
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setData((prev) => ({ ...prev, loading: false }));
      }
    }

    fetchData();
  }, []);

  if (data.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading your dashboard...</div>
      </div>
    );
  }

  const profile = data.profile;
  const analytics = data.analytics;

  // Transform API data for charts
  const followerData = analytics?.followers || [];
  const engagementData = analytics?.engagement || [];
  const demographics = analytics?.demographics || [];

  const COLORS = ["#C19A5B", "#3A3941", "#64748B", "#94A3B8"];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground font-heading">
          Welcome back, {profile?.displayName || "Creator"}
        </h1>
        <p className="text-muted-foreground mt-2">
          Here&apos;s your performance overview for the last 30 days.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Followers"
          value={analytics?.summary?.totalFollowers?.toLocaleString() || "0"}
          change="+9.3%"
          trend="up"
          icon={<Users className="h-5 w-5" />}
        />
        <MetricCard
          title="Engagement Rate"
          value={`${analytics?.summary?.avgEngagement?.toFixed(1) || "0"}%`}
          change="+0.5%"
          trend="up"
          icon={<Heart className="h-5 w-5" />}
        />
        <MetricCard
          title="Profile Views"
          value="48.2K"
          change="+12.1%"
          trend="up"
          icon={<Eye className="h-5 w-5" />}
        />
        <MetricCard
          title="Est. Earnings"
          value="$3,200"
          change="+18.5%"
          trend="up"
          icon={<DollarSign className="h-5 w-5" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Follower Growth */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Follower Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={followerData}>
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C19A5B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#C19A5B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e0db" />
                <XAxis
                  dataKey="date"
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) =>
                    `${(value / 1000).toFixed(0)}k`
                  }
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#F8F7F4",
                    border: "1px solid #E2E0DB",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#C19A5B"
                  strokeWidth={2}
                  fill="url(#gradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Engagement Rate */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Engagement Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e0db" />
                <XAxis
                  dataKey="date"
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#F8F7F4",
                    border: "1px solid #E2E0DB",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => [`${value ?? 0}%`, "Engagement"]}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3A3941"
                  strokeWidth={2}
                  dot={{ fill: "#3A3941", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Audience Demographics */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Audience Age
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={demographics}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {demographics.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#F8F7F4",
                    border: "1px solid #E2E0DB",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {demographics.map((item: any, index: number) => (
                <div
                  key={item.label}
                  className="flex items-center space-x-2"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {item.label} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Content - Mock for now, will connect to API later */}
        <Card className="border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Top Performing Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "How to Build a SaaS MVP in 2026",
                  platform: "YouTube",
                  views: "12.4K",
                  engagement: "8.2%",
                },
                {
                  title: "3 Investment Strategies for Q2",
                  platform: "LinkedIn",
                  views: "8.7K",
                  engagement: "6.5%",
                },
                {
                  title: "React vs Vue: The Data",
                  platform: "YouTube",
                  views: "15.1K",
                  engagement: "7.1%",
                },
              ].map((post, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/5 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">
                      {post.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {post.platform}
                    </p>
                  </div>
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="text-center">
                      <p className="font-mono font-medium text-foreground">
                        {post.views}
                      </p>
                      <p className="text-muted-foreground">Views</p>
                    </div>
                    <div className="text-center">
                      <p className="font-mono font-medium text-accent">
                        {post.engagement}
                      </p>
                      <p className="text-muted-foreground">Engagement</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  change,
  trend,
  icon,
}: {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ReactNode;
}) {
  return (
    <Card className="border-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-muted-foreground">
            {title}
          </span>
          <div className="text-muted-foreground">{icon}</div>
        </div>
        <div className="flex items-end justify-between">
          <span className="text-3xl font-bold text-foreground font-mono">
            {value}
          </span>
          <span
            className={`text-sm font-medium ${
              trend === "up" ? "text-green-600" : "text-red-600"
            }`}
          >
            {change}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
