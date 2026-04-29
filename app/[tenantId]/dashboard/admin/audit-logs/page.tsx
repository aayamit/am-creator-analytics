"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Loader2, FileText } from "lucide-react";

interface AuditLog {
  id: string;
  action: string;
  resource: string;
  timestamp: string;
  metadata: any;
  user: {
    name: string;
    email: string;
    role: string;
  };
}

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("page", page.toString());
      if (search) params.set("search", search);
      if (actionFilter) params.set("action", actionFilter);

      // Mock data - in production, fetch from /api/admin/audit-logs
      await new Promise((resolve) => setTimeout(resolve, 500));
      const mockLogs: AuditLog[] = [
        {
          id: "1",
          action: "CREATE_CAMPAIGN",
          resource: "Campaign:123",
          timestamp: new Date().toISOString(),
          metadata: { budget: 5000 },
          user: { name: "John Brand", email: "john@example.com", role: "BRAND" },
        },
        {
          id: "2",
          action: "UPDATE_USER_ROLE",
          resource: "User:456",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          metadata: { oldRole: "CREATOR", newRole: "ADMIN" },
          user: { name: "Admin", email: "admin@example.com", role: "ADMIN" },
        },
        {
          id: "3",
          action: "GDPR_EXPORT",
          resource: "User:789",
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          metadata: { exportedBy: "admin@example.com" },
          user: { name: "Admin", email: "admin@example.com", role: "ADMIN" },
        },
      ];
      setLogs(mockLogs);
      setTotalPages(1);
    } catch (error) {
      console.error("Failed to fetch audit logs:", error);
    } finally {
      setLoading(false);
    }
  }, [page, search, actionFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const getActionColor = (action: string) => {
    if (action.includes("CREATE") || action.includes("UPDATE")) return "bg-blue-100 text-blue-800";
    if (action.includes("DELETE") || action.includes("GDPR")) return "bg-red-100 text-red-800";
    if (action.includes("EXPORT")) return "bg-green-100 text-green-800";
    return "bg-gray-100 text-gray-800";
  };

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
            <Link href="/admin">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-[#3A3941]">
                Audit Logs
              </h1>
              <p className="text-muted-foreground mt-1">
                Track all admin and system actions
              </p>
            </div>
          </div>
          <Button onClick={fetchLogs} variant="outline" size="sm">
            <Loader2 className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by action or resource..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={actionFilter} onValueChange={(value) => setActionFilter(value || "")}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Actions</SelectItem>
              <SelectItem value="CREATE">Create</SelectItem>
              <SelectItem value="UPDATE">Update</SelectItem>
              <SelectItem value="DELETE">Delete</SelectItem>
              <SelectItem value="GDPR">GDPR</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Logs List */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-[#3A3941]">
              Logs ({logs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 border border-border rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[#C19A5B]" />
                      <Badge className={getActionColor(log.action)}>
                        {log.action.replace("_", " ")}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {log.resource}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-muted-foreground">By: </span>
                      <span className="text-[#3A3941]">{log.user.name}</span>
                      <span className="text-muted-foreground"> ({log.user.role})</span>
                    </div>
                    {log.metadata && (
                      <div className="text-xs text-muted-foreground">
                        {JSON.stringify(log.metadata).slice(0, 100)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
