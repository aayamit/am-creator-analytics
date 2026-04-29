"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Search, Loader2, Shield, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  createdAt: string;
  _count: {
    brandProfile: number;
    creatorProfile: number;
    auditLogs: number;
  };
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("page", page.toString());
      if (search) params.set("search", search);
      if (roleFilter !== "ALL") params.set("role", roleFilter);

      // Mock data - in production, fetch from /api/admin/users
      await new Promise((resolve) => setTimeout(resolve, 500));
      const mockUsers: User[] = [
        {
          id: "1",
          name: "John Brand",
          email: "john@techcorp.com",
          role: "BRAND",
          emailVerified: true,
          createdAt: new Date().toISOString(),
          _count: { brandProfile: 1, creatorProfile: 0, auditLogs: 5 },
        },
        {
          id: "2",
          name: "Sarah Creator",
          email: "sarah@example.com",
          role: "CREATOR",
          emailVerified: true,
          createdAt: new Date().toISOString(),
          _count: { brandProfile: 0, creatorProfile: 1, auditLogs: 12 },
        },
        {
          id: "3",
          name: "Admin User",
          email: "admin@amcreator.com",
          role: "ADMIN",
          emailVerified: true,
          createdAt: new Date().toISOString(),
          _count: { brandProfile: 0, creatorProfile: 0, auditLogs: 45 },
        },
      ];
      setUsers(mockUsers);
      setTotalPages(1);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId: string, newRole: string | null) => {
    if (!newRole) return;
    try {
      // In production, call PATCH /api/admin/users
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }
    try {
      // In production, call DELETE /api/admin/users?userId=...
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
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
                User Management
              </h1>
              <p className="text-muted-foreground mt-1">
                View and manage user accounts
              </p>
            </div>
          </div>
          <Button onClick={fetchUsers} variant="outline" size="sm">
            <Loader2 className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <Card className="border-border/50 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value || "ALL")}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Roles</SelectItem>
                  <SelectItem value="BRAND">Brands</SelectItem>
                  <SelectItem value="CREATOR">Creators</SelectItem>
                  <SelectItem value="ADMIN">Admins</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-[#3A3941]">
              Users ({users.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#C19A5B]/10 flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-[#C19A5B]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#3A3941]">
                          {user.name}
                        </span>
                        <Badge
                          className={
                            user.role === "ADMIN"
                              ? "bg-red-100 text-red-800"
                              : user.role === "BRAND"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }
                        >
                          {user.role}
                        </Badge>
                        {user.emailVerified && (
                          <Badge variant="outline" className="text-green-600">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Joined {new Date(user.createdAt).toLocaleDateString()} •
                        {user._count.brandProfile > 0 && " Has Brand Profile •"}
                        {user._count.creatorProfile > 0 && " Has Creator Profile •"}
                        {user._count.auditLogs} audit logs
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      defaultValue={user.role}
                      onValueChange={(value) => handleRoleChange(user.id, value)}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BRAND">Brand</SelectItem>
                        <SelectItem value="CREATOR">Creator</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </Button>
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
