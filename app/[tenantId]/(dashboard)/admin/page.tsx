"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  BarChart3,
  FileText,
  Shield,
  Loader2,
  ArrowLeft,
  Search,
  Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface DashboardStats {
  totalUsers: number;
  totalBrands: number;
  totalCreators: number;
  totalCampaigns: number;
  activeCampaigns: number;
  totalRevenue: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      // Mock data - in production, fetch from API
      const mockStats: DashboardStats = {
        totalUsers: 1250,
        totalBrands: 150,
        totalCreators: 1100,
        totalCampaigns: 89,
        activeCampaigns: 34,
        totalRevenue: 125000,
      };
      await new Promise((resolve) => setTimeout(resolve, 500));
      setStats(mockStats);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-[#3A3941]">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Platform management and compliance
              </p>
            </div>
          </div>
          <Button onClick={fetchStats} variant="outline" size="sm">
            <Loader2 className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <StatCard
            title="Total Users"
            value={stats?.totalUsers.toLocaleString() || "0"}
            icon={<Users className="h-5 w-5" />}
          />
          <StatCard
            title="Brands"
            value={stats?.totalBrands.toLocaleString() || "0"}
            icon={<Shield className="h-5 w-5" />}
          />
          <StatCard
            title="Creators"
            value={stats?.totalCreators.toLocaleString() || "0"}
            icon={<Users className="h-5 w-5" />}
          />
          <StatCard
            title="Campaigns"
            value={stats?.totalCampaigns.toLocaleString() || "0"}
            icon={<BarChart3 className="h-5 w-5" />}
          />
          <StatCard
            title="Active"
            value={stats?.activeCampaigns.toLocaleString() || "0"}
            icon={<BarChart3 className="h-5 w-5" />}
          />
          <StatCard
            title="Revenue"
            value={`$${stats?.totalRevenue.toLocaleString() || "0"}`}
            icon={<BarChart3 className="h-5 w-5" />}
            highlight
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/admin/users">
            <Card className="border-border/50 hover:border-[#C19A5B]/50 transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-[#3A3941]">
                    User Management
                  </h3>
                  <Users className="h-6 w-6 text-[#C19A5B]" />
                </div>
                <p className="text-sm text-muted-foreground">
                  View, edit, and manage user accounts
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/audit-logs">
            <Card className="border-border/50 hover:border-[#C19A5B]/50 transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-[#3A3941]">
                    Audit Logs
                  </h3>
                  <FileText className="h-6 w-6 text-[#C19A5B]" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Track all admin and system actions
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/gdpr">
            <Card className="border-border/50 hover:border-[#C19A5B]/50 transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-[#3A3941]">
                    GDPR Tools
                  </h3>
                  <Shield className="h-6 w-6 text-[#C19A5B]" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Data export and deletion tools
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, highlight = false }: { title: string; value: string; icon: React.ReactNode; highlight?: boolean }) {
  return (
    <Card className={`border-border/50 ${highlight ? "bg-[#C19A5B]/5" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">{title}</span>
          <div className={highlight ? "text-[#C19A5B]" : "text-muted-foreground"}>
            {icon}
          </div>
        </div>
        <div
          className={`text-2xl font-bold font-mono ${highlight ? "text-[#C19A5B]" : "text-[#3A3941]"}`}
        >
          {value}
        </div>
      </CardContent>
    </Card>
  );
}
