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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  Eye,
  MousePointer,
  Target,
  Percent,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  FileText,
  FileSpreadsheet,
  Calendar,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const COLORS = ["#C19A5B", "#3A3941", "#635BFF", "#02042B", "#10B981"];
export default function BrandAnalyticsPage() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [streamData, setStreamData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });
  const [exporting, setExporting] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (dateRange.start) params.set("startDate", dateRange.start);
      if (dateRange.end) params.set("endDate", dateRange.end);

      const res = await fetch(`/api/brands/analytics/overview?${params}`);
      if (!res.ok) throw new Error("Failed to fetch analytics");
      const data = await res.json();
      setAnalytics(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  const fetchRoiData = useCallback(async () => {
    try {
      const res = await fetch("/api/brands/analytics/roi");
      if (!res.ok) throw new Error("Failed to fetch ROI data");
      const data = await res.json();
      setAnalytics((prev) => (prev ? { ...prev, ...data } : null));
    } catch (err) {
      console.error("Failed to fetch ROI data:", err);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
    fetchRoiData();
  }, [fetchAnalytics, fetchRoiData]);

  // SSE connection for real-time updates
  useEffect(() => {
    const eventSource = new EventSource("/api/brands/analytics/stream");

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.timestamp) {
          setStreamData(data);
        }
      } catch (err) {
        console.error("SSE parse error:", err);
      }
    };

    eventSource.onerror = () => {
      console.log("SSE connection lost, reconnecting...");
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const handleExport = async (format: "csv" | "pdf") => {
    try {
      setExporting(format);
      const params = new URLSearchParams();
      params.set("format", format);
      params.set("type", activeTab);
      if (dateRange.start) params.set("startDate", dateRange.start);
      if (dateRange.end) params.set("endDate", dateRange.end);

      const res = await fetch(`/api/analytics/export?${params}`);
      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `analytics_${activeTab}_${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setExporting(null);
    }
  };

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

  const { overview, dailySpend, spendByCampaign, topCreators, roiData, summary } =
    analytics;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#3A3941]">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Real-time campaign performance and ROI tracking
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

      {/* Date Range Filter */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <Label htmlFor="start">From:</Label>
              <Input
                id="start"
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, start: e.target.value }))
                }
                className="w-auto"
              />
              <Label htmlFor="end">To:</Label>
              <Input
                id="end"
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, end: e.target.value }))
                }
                className="w-auto"
              />
              <Button onClick={fetchAnalytics} size="sm">
                Apply
              </Button>
              {(dateRange.start || dateRange.end) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setDateRange({ start: "", end: "" });
                    fetchAnalytics();
                  }}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Indicator */}
      {streamData && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-green-800">
              Live: {streamData.activeCampaigns} active campaigns
            </span>
          </div>
          <div className="text-sm text-green-700 font-mono">
            Today&apos;s spend: ${streamData.todaySpend.toFixed(2)}
          </div>
        </div>
      )}
      
      {/* SSE Disconnected Warning */}
      {!streamData && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <span className="text-sm text-red-800">
              ⚠️ Real-time updates disconnected. Retrying...
            </span>
          </div>
          <Button
            onClick={fetchAnalytics}
            variant="outline"
            size="sm"
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        </div>
      )}

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border/50 bg-[#C19A5B]/5">
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Avg ROAS</div>
              <div className="text-2xl font-bold text-[#C19A5B] font-mono">
                {summary.averageRoas.toFixed(2)}x
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-[#C19A5B]/5">
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Avg ROI</div>
              <div className="text-2xl font-bold text-[#C19A5B] font-mono">
                {summary.averageRoi.toFixed(1)}%
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-[#C19A5B]/5">
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Total Revenue</div>
              <div className="text-2xl font-bold text-[#3A3941] font-mono">
                ${summary.totalRevenue.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Spend"
          value={`$${overview.totalSpent.toLocaleString()}`}
          subtitle={`of $${overview.totalBudget.toLocaleString()} budget`}
          icon={<DollarSign className="h-5 w-5" />}
          trend={overview.totalSpent / overview.totalBudget > 0.5 ? "up" : "down"}
          highlight={false}
        />
        <MetricCard
          title="ROAS"
          value={`${overview.roas}x`}
          subtitle={`$${(overview.estimatedRevenue).toLocaleString()} revenue`}
          icon={<TrendingUp className="h-5 w-5" />}
          trend={overview.roas > 2 ? "up" : "down"}
          highlight
        />
        <MetricCard
          title="Impressions"
          value={overview.totalImpressions.toLocaleString()}
          subtitle={`CPM: $${overview.cpm}`}
          icon={<Eye className="h-5 w-5" />}
          highlight={false}
        />
        <MetricCard
          title="Conversions"
          value={overview.totalConversions.toLocaleString()}
          subtitle={`Rate: ${overview.conversionRate}%`}
          icon={<Target className="h-5 w-5" />}
          trend="up"
          highlight={false}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="roi">ROI Analysis</TabsTrigger>
          <TabsTrigger value="creators">Creators</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Daily Spend Chart */}
          <Card className="border-border/50 bg-[#F8F7F4]">
            <CardHeader>
              <CardTitle className="text-[#3A3941]">
                Daily Spend (Last 30 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailySpend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => new Date(date).toLocaleDateString()}
                    stroke="#3A3941"
                  />
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
                    dataKey="spend"
                    stroke="#C19A5B"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "CTR", value: `${overview.ctr}%` },
              { label: "CPC", value: `$${overview.cpc}` },
              { label: "CPA", value: `$${overview.cpa}` },
              { label: "CPM", value: `$${overview.cpm}` },
            ].map((kpi) => (
              <Card key={kpi.label} className="border-border/50">
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground">{kpi.label}</div>
                  <div className="text-2xl font-bold text-[#3A3941] font-mono">
                    {kpi.value}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          {/* Spend by Campaign */}
          <Card className="border-border/50 bg-[#F8F7F4]">
            <CardHeader>
              <CardTitle className="text-[#3A3941]">
                Budget Allocation by Campaign
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={spendByCampaign}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="title" stroke="#3A3941" />
                  <YAxis stroke="#3A3941" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#3A3941",
                      border: "none",
                      color: "#F8F7F4",
                    }}
                  />
                  <Bar dataKey="spent" fill="#C19A5B" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="budget" fill="#3A3941" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roi" className="space-y-6">
          {/* ROI Analysis */}
          {roiData && roiData.length > 0 && (
            <>
              <Card className="border-border/50 bg-[#F8F7F4]">
                <CardHeader>
                  <CardTitle className="text-[#3A3941]">
                    ROI by Campaign
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {roiData.map((campaign) => (
                      <div
                        key={campaign.campaignId}
                        className="p-4 bg-white rounded-lg border border-border hover:border-[#C19A5B]/50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <a
                            href={`/campaigns/${campaign.campaignId}`}
                            className="font-medium text-[#3A3941] hover:text-[#C19A5B] transition-colors cursor-pointer"
                          >
                            {campaign.campaignTitle}
                          </a>
                          <Badge
                            className={
                              campaign.metrics.roi > 0
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            ROI: {campaign.metrics.roi}%
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">ROAS:</span>
                            <span className="ml-2 font-mono text-[#C19A5B]">
                              {campaign.metrics.roas}x
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Revenue:</span>
                            <span className="ml-2 font-mono text-[#3A3941]">
                              ${campaign.revenue.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">CPA:</span>
                            <span className="ml-2 font-mono text-[#3A3941]">
                              ${campaign.metrics.cpa}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Conv Rate:</span>
                            <span className="ml-2 font-mono text-[#3A3941]">
                              {campaign.metrics.conversionRate}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="creators" className="space-y-6">
          {/* Top Creators */}
          <Card className="border-border/50 bg-[#F8F7F4]">
            <CardHeader>
              <CardTitle className="text-[#3A3941]">
                Top Creators by Clicks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={topCreators.slice(0, 10)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis type="number" stroke="#3A3941" />
                  <YAxis
                    type="category"
                    dataKey="creatorName"
                    width={100}
                    stroke="#3A3941"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#3A3941",
                      border: "none",
                      color: "#F8F7F4",
                    }}
                  />
                  <Bar
                    dataKey="clicks"
                    fill="#C19A5B"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
              
              {/* Clickable Creator List */}
              <div className="mt-6 space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground mb-3">
                  Creator Details (click to view profile)
                </h4>
                {topCreators.slice(0, 10).map((creator) => (
                  <a
                    key={creator.creatorId}
                    href={`/creators/${creator.creatorId}`}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-border hover:border-[#C19A5B]/50 hover:bg-[#C19A5B]/5 transition-colors cursor-pointer"
                  >
                    <span className="font-medium text-[#3A3941] hover:text-[#C19A5B]">
                      {creator.creatorName}
                    </span>
                    <span className="text-sm text-muted-foreground font-mono">
                      {creator.clicks?.toLocaleString() || 0} clicks
                    </span>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
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
