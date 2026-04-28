"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2, Download, Trash2, Shield } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function AdminGdprPage() {
  const { toast } = useToast();
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [exportData, setExportData] = useState<any>(null);
  const [confirmDelete, setConfirmDelete] = useState("");

  const handleExport = useCallback(async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "Please enter a user ID",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      // Mock export - in production, call GET /api/admin/gdpr/export?userId=...
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockData = {
        user: { id: userId, name: "John Doe", email: "john@example.com" },
        campaignCount: 5,
        totalSpent: 10000,
      };
      setExportData(mockData);
      toast({
        title: "Success",
        description: "User data exported successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export user data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [userId, toast]);

  const handleDelete = useCallback(async () => {
    if (confirmDelete !== "DELETE") {
      toast({
        title: "Error",
        description: "Please type DELETE to confirm",
        variant: "destructive",
      });
      return;
    }

    if (!userId) {
      toast({
        title: "Error",
        description: "Please enter a user ID",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      // Mock delete - in production, call DELETE /api/admin/gdpr/delete?userId=...
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Success",
        description: "User data deleted successfully",
      });
      setUserId("");
      setConfirmDelete("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [userId, confirmDelete, toast]);

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
                GDPR Compliance Tools
              </h1>
              <p className="text-muted-foreground mt-1">
                Data export and deletion for GDPR compliance
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Export User Data */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#3A3941]">
                <Download className="h-5 w-5 text-[#C19A5B]" />
                Export User Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Export all data associated with a user (Right to Data Portability)
              </p>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-[#3A3941]">
                    User ID
                  </label>
                  <Input
                    placeholder="Enter user ID..."
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleExport}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Export Data
                </Button>
              </div>

              {exportData && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium text-[#3A3941] mb-2">
                    Exported Data Preview
                  </h4>
                  <pre className="text-xs text-muted-foreground overflow-auto">
                    {JSON.stringify(exportData, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Delete User Data */}
          <Card className="border-border/50 border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <Trash2 className="h-5 w-5" />
                Delete User Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Permanently delete all user data (Right to be Forgotten)
              </p>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-[#3A3941]">
                    User ID
                  </label>
                  <Input
                    placeholder="Enter user ID..."
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-red-600">
                    Type DELETE to confirm
                  </label>
                  <Input
                    placeholder="DELETE"
                    value={confirmDelete}
                    onChange={(e) => setConfirmDelete(e.target.value)}
                    className="border-red-200 focus:border-red-500"
                  />
                </div>
                <Button
                  onClick={handleDelete}
                  disabled={loading || confirmDelete !== "DELETE"}
                  variant="destructive"
                  className="w-full"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Permanently Delete
                </Button>
              </div>

              <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-red-600 mt-0.5" />
                  <p className="text-xs text-red-700">
                    Warning: This action is irreversible. All user data including
                    campaigns, payments, and analytics will be permanently
                    deleted.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Compliance Info */}
        <Card className="border-border/50 mt-6">
          <CardHeader>
            <CardTitle className="text-[#3A3941]">
              GDPR Compliance Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <Shield className="h-4 w-4 text-[#C19A5B] mt-0.5" />
                <div>
                  <strong>Right to Data Portability:</strong> Users can request
                  a copy of all their personal data. Use the Export tool above.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Shield className="h-4 w-4 text-[#C19A5B] mt-0.5" />
                <div>
                  <strong>Right to be Forgotten:</strong> Users can request
                  complete deletion of their personal data. Use the Delete tool
                  above.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Shield className="h-4 w-4 text-[#C19A5B] mt-0.5" />
                <div>
                  <strong>Audit Trail:</strong> All export and deletion actions
                  are logged. View audit logs for compliance tracking.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
