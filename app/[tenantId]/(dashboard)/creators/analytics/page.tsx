// @ts-nocheck
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  Users,
  BarChart3,
  RefreshCw,
  Download,
  FileText,
  FileSpreadsheet,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useSession } from "next-auth/react";

const COLORS = ["#C19A5B", "#3A3941", "#635BFF", "#02042B", "#10B981"];

export default function CreatorAnalyticsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [exporting, setExporting] = useState(null);
  const [creatorId, setCreatorId] = useState(null);

  // First, get the creator profile ID
  useEffect(() => {
    if (session?.user?.role === "CREATOR") {
      fetch("/api/creators?userId=" + session.user.id)
        .then((res) => res.json())
        .then((data) => {
          if (data[0]?.id) {
            setCreatorId(data[0].id);
          }
        })
        .catch((err) => console.error("Failed to fetch creator profile:", err));
    }
  }, [session]);

  const fetchAnalytics = useCallback(async () => {
    if (!creatorId) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/creators/${creatorId}/analytics`);
      if (!res.ok) throw new Error("Failed to fetch analytics");
      const data = await res.json();
      setAnalytics(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [creatorId]);

  useEffect(() => {
    if (creatorId) {
      fetchAnalytics();
    }
  }, [fetchAnalytics, creatorId]);

  const handleExport = async (format: "csv" | "pdf") => {
    if (!creatorId) return;

    try {
      setExporting(format);
      const params = new URLSearchParams();
      params.set("format", format);
      params.set("type", "creator");
      params.set("creatorId", creatorId);

      const res = await fetch(`/api/analytics/export?${params}`);
      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `creator_analytics_${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Export error:", err);
      alert("Export failed. Please try again.");
    } finally {
      setExporting(null);
    }
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading session...</p>
      </div>
    );
  }

  if (!creatorId && session?.user?.role === "CREATOR") {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error: {error}</p>
        <Button onClick={fetchAnalytics} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  if (!analytics) return null;

  const { followers, engagement, demographics, summary } = analytics;

  // Calculate trends (compare first half to second half of data)
  const calculateTrend = (data) => {
    if (!data || data.length < 2) return { value: 0, isUp: true };
    const mid = Math.floor(data.length / 2);
    const firstHalf = data.slice(0, mid).reduce((sum, d) => sum + d.value, 0) / mid;
    const secondHalf = data.slice(mid).reduce((sum, d) => sum + d.value, 0) / (data.length - mid);
    const change = ((secondHalf - firstHalf) / firstHalf) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      isUp: change >= 0,
    };
  };

  const followerTrend = calculateTrend(followers);
  const engagementTrend = calculateTrend(engagement);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#3A3941]">
            My Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your audience growth and engagement across platforms
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => handleExport("csv")}
            variant="outline"
            size="sm"
            disabled={!!exporting}
          >
            {exporting === "csv" ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <FileSpreadsheet className="h-4 w-4 mr-2" />
            )}
            Export CSV
          </Button>
          <Button
            onClick={() => handleExport("pdf")}
            variant="outline"
            size="sm"
            disabled={!!exporting}
          >
            {exporting === "pdf" ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <FileText className="h-4 w-4 mr-2" />
            )}
            Export PDF
          </Button>
          <Button
            onClick={fetchAnalytics}
            variant="outline"
            className="border-[#C19A5B] text-[#C19A5B] hover:bg-[#C19A5B]/10"
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Followers"
          value={summary?.totalFollowers?.toLocaleString() || "0"}
          subtitle={`${followerTrend.value}% ${followerTrend.isUp ? "increase" : "decrease"}`}
          icon={<Users className="h-5 w-5" />}
          trend={followerTrend.isUp ? "up" : "down"}
          highlight
        />
        <MetricCard
          title="Avg Engagement"
          value={`${summary?.avgEngagement?.toFixed(2) || "0"}%`}
          subtitle={`${engagementTrend.value}% ${engagementTrend.isUp ? "increase" : "decrease"}`}
          icon={<TrendingUp className="h-5 w-5" />}
          trend={engagementTrend.isUp ? "up" : "down"}
        />
        <MetricCard
          title="Audience Quality"
          value={`${summary?.audienceQuality || 0}%`}
          subtitle="Quality score"
          icon={<BarChart3 className="h-5 w-5" />}
          trend="up"
        />
        <MetricCard
          title="Campaigns"
          value="0"
          subtitle="Active campaigns"
          icon={<DollarSign className="h-5 w-5" />}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="overview">Growth</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Follower Growth Chart */}
          <Card className="border-border/50 bg-[#F8F7F4]">
            <CardHeader>
              <CardTitle className="text-[#3A3941]">
                Follower Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              {followers && followers.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={followers}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="date" stroke="#3A3941" />
                    <YAxis stroke="#3A3941" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#3A3941",
                        border: "none",
                        color: "#F8F7F4",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#C19A5B"
                      strokeWidth={2}
                      name="Followers"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  No follower data available yet
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          {/* Engagement Rate Chart */}
          <Card className="border-border/50 bg-[#F8F7F4]">
            <CardHeader>
              <CardTitle className="text-[#3A3941]">
                Engagement Rate Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              {engagement && engagement.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={engagement}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="date" stroke="#3A3941" />
                    <YAxis stroke="#3A3941" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#3A3941",
                        border: "none",
                        color: "#F8F7F4",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#3A3941"
                      strokeWidth={2}
                      name="Engagement Rate"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  No engagement data available yet
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          {demographics && demographics.length > 0 && (
            <>
              {/* Age Groups / Demographics Pie Chart */}
              <Card className="border-border/50 bg-[#F8F7F4]">
                <CardHeader>
                  <CardTitle className="text-[#3A3941]">
                    Audience Demographics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={demographics}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.label}: ${entry.value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {demographics.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#3A3941",
                          border: "none",
                          color: "#F8F7F4",
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Demographics Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {demographics.map((demo, index) => (
                  <Card key={index} className="border-border/50">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">{demo.label}</span>
                        <span className="text-2xl font-bold text-[#3A3941] font-mono">
                          {demo.value}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-full bg-[#C19A5B] rounded-full"
                          style={{ width: `${demo.value}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MetricCard({ title, value, subtitle, icon, trend = undefined as any, highlight = false }) {
  return (
    <Card
      className={`border-border/50 ${highlight ? "bg-[#C19A5B]/5 border-[#C19A5B]/20" : ""}`}
    >
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">{title}</span>
          <div
            className={`${highlight ? "text-[#C19A5B]" : "text-muted-foreground"}`}
          >
            {icon}
          </div>
        </div>
        <div
          className={`text-2xl font-bold mb-1 ${highlight ? "text-[#C19A5B]" : "text-[#3A3941]"} font-mono`}
        >
          {value}
        </div>
        <div className="flex items-center text-xs text-muted-foreground">
          {trend && (
            <>
              {trend === "up" ? (
                <ArrowUpRight className="h-3 w-3 mr-1 text-green-600" />
              ) : (
                <ArrowDownRight className="h-3 w-3 mr-1 text-red-600" />
              )}
            </>
          )}
          {subtitle}
        </div>
      </CardContent>
    </Card>
  );
}
