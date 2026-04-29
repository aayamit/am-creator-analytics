"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  BarChart3,
  Pause,
  Play,
  Square,
  Edit3,
  Send,
  FileText,
  CheckCircle2,
  AlertCircle,
  Plus,
  Eye,
  Trash2,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

interface Campaign {
  id: string;
  title: string;
  description: string;
  status: string;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  objectives: string;
  creators: {
    id: string;
    displayName: string;
    handle: string;
    rate: number;
    paymentStatus: string;
    deliverables: any;
  }[];
  invites: {
    id: string;
    creatorId: string;
    creator: {
      displayName: string;
      user: { name: string; email: string };
    };
    status: string;
    createdAt: string;
    respondedAt: string;
  }[];
  deliverables: {
    id: string;
    type: string;
    title: string;
    status: string;
    platform: string;
    dueDate: string;
    contentUrl: string;
  }[];
  contracts: {
    id: string;
    status: string;
    type: string;
    creatorSignedAt: string;
    brandSignedAt: string;
  }[];
}

export default function CampaignDetailPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Invite modal state
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteCreatorId, setInviteCreatorId] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");
  const [inviteDeliverables, setInviteDeliverables] = useState(
    JSON.stringify({ posts: 3, stories: 5, rate: 500 }, null, 2)
  );
  const [sendingInvite, setSendingInvite] = useState(false);

  const fetchCampaign = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch campaign details
      const campaignRes = await fetch(`/api/campaigns/${campaignId}`);
      if (!campaignRes.ok) throw new Error("Failed to fetch campaign");
      const campaignData = await campaignRes.json();

      // Fetch invites
      const invitesRes = await fetch(
        `/api/campaigns/${campaignId}/invites`
      );
      const invitesData = invitesRes.ok ? await invitesRes.json() : { invites: [] };

      // Fetch deliverables (through campaign creators)
      // For now, we'll include this in the campaign response
      setCampaign({
        ...campaignData.campaign,
        invites: invitesData.invites || [],
        deliverables: [], // Will be populated from campaign creators
        contracts: [], // Will be populated from campaign creators
      });
    } catch (error) {
      console.error("Failed to fetch campaign:", error);
      toast({
        title: "Error",
        description: "Failed to load campaign",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    if (campaignId) fetchCampaign();
  }, [campaignId, fetchCampaign]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      const res = await fetch(`/api/campaigns/${campaignId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setCampaign((prev) =>
        prev ? { ...prev, status: newStatus } : null
      );
      toast({
        title: "Success",
        description: `Campaign ${newStatus.toLowerCase()}d`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handleSendInvite = async () => {
    if (!inviteCreatorId) {
      toast({
        title: "Error",
        description: "Please select a creator",
        variant: "destructive",
      });
      return;
    }

    try {
      setSendingInvite(true);
      const res = await fetch(`/api/campaigns/${campaignId}/invites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorId: inviteCreatorId,
          message: inviteMessage,
          deliverables: JSON.parse(inviteDeliverables),
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to send invite");
      }

      toast({
        title: "Success",
        description: "Invite sent successfully",
      });
      setShowInviteModal(false);
      fetchCampaign();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSendingInvite(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "DRAFT":
        return "bg-gray-100 text-gray-800";
      case "PAUSED":
        return "bg-yellow-100 text-yellow-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const calculateProgress = () => {
    if (!campaign) return 0;
    const now = new Date();
    const start = new Date(campaign.startDate);
    const end = new Date(campaign.endDate);
    const total = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        Loading campaign...
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Campaign not found
      </div>
    );
  }

  const budgetUsed = campaign.budget > 0
    ? (campaign.spent / campaign.budget) * 100
    : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-[#3A3941] font-heading">
              {campaign.title}
            </h1>
            <Badge className={getStatusColor(campaign.status)}>
              {campaign.status}
            </Badge>
          </div>
          <p className="text-muted-foreground">{campaign.description}</p>
        </div>
        <div className="flex gap-2">
          {campaign.status === "ACTIVE" ? (
            <Button
              variant="outline"
              onClick={() => handleStatusChange("PAUSED")}
            >
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          ) : campaign.status === "PAUSED" ? (
            <Button
              className="bg-[#C19A5B] hover:bg-[#C19A5B]/90 text-white"
              onClick={() => handleStatusChange("ACTIVE")}
            >
              <Play className="h-4 w-4 mr-2" />
              Resume
            </Button>
          ) : null}
          {campaign.status === "ACTIVE" && (
            <Button
              variant="outline"
              onClick={() => handleStatusChange("COMPLETED")}
            >
              <Square className="h-4 w-4 mr-2" />
              Complete
            </Button>
          )}
          <Button variant="outline">
            <Edit3 className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">
                Budget
              </span>
              <DollarSign className="h-5 w-5 text-[#C19A5B]" />
            </div>
            <p className="text-3xl font-bold text-[#3A3941] font-mono">
              ${campaign.budget.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">
                Spent
              </span>
              <TrendingUp className="h-5 w-5 text-[#C19A5B]" />
            </div>
            <p className="text-3xl font-bold text-[#3A3941] font-mono">
              ${campaign.spent.toLocaleString()}
            </p>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>{Math.round(budgetUsed)}% used</span>
                <span>${campaign.budget - campaign.spent} remaining</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#C19A5B] rounded-full"
                  style={{ width: `${Math.min(100, budgetUsed)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">
                Progress
              </span>
              <BarChart3 className="h-5 w-5 text-[#C19A5B]" />
            </div>
            <p className="text-3xl font-bold text-[#3A3941] font-mono">
              {Math.round(calculateProgress())}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {campaign.startDate} to {campaign.endDate}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 lg:w-[600px]">
          <TabsTrigger value="overview">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="creators">
            <Users className="h-4 w-4 mr-2" />
            Creators
          </TabsTrigger>
          <TabsTrigger value="invites">
            <Send className="h-4 w-4 mr-2" />
            Invites
          </TabsTrigger>
          <TabsTrigger value="deliverables">
            <FileText className="h-4 w-4 mr-2" />
            Deliverables
          </TabsTrigger>
          <TabsTrigger value="contracts">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Contracts
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Objectives */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#3A3941]">
                <BarChart3 className="h-5 w-5" />
                Objectives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {campaign.objectives ? (
                  JSON.parse(campaign.objectives).map((obj: string) => (
                    <Badge
                      key={obj}
                      className="bg-[#C19A5B]/10 text-[#C19A5B]"
                    >
                      {obj}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground">No objectives set</span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#3A3941]">
                <CheckCircle2 className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => {
                    setShowInviteModal(true);
                    setActiveTab("invites");
                  }}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Invite Creator
                </Button>
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => router.push("/brands/funding")}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Add Funds
                </Button>
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => window.open(`/api/campaigns/${campaignId}/export`, "_blank")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Creators Tab */}
        <TabsContent value="creators" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-[#3A3941]">
                  <Users className="h-5 w-5" />
                  Creators ({campaign.creators.length})
                </CardTitle>
                <Button
                  className="bg-[#C19A5B] hover:bg-[#C19A5B]/90 text-white"
                  onClick={() => setShowInviteModal(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Creator
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaign.creators.map((creator) => (
                  <div
                    key={creator.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#C19A5B]/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-[#C19A5B]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-[#3A3941]">
                          {creator.displayName}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          @{creator.handle} • Rate: ${creator.rate.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        className={
                          creator.paymentStatus === "PAID"
                            ? "bg-green-100 text-green-800"
                            : creator.paymentStatus === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }
                      >
                        {creator.paymentStatus}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Work
                      </Button>
                    </div>
                  </div>
                ))}
                {campaign.creators.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No creators added yet. Invite creators to get started.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invites Tab */}
        <TabsContent value="invites" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-[#3A3941]">
                  <Send className="h-5 w-5" />
                  Invites ({campaign.invites.length})
                </CardTitle>
                <Button
                  className="bg-[#C19A5B] hover:bg-[#C19A5B]/90 text-white"
                  onClick={() => setShowInviteModal(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Send Invite
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaign.invites.map((invite) => (
                  <div
                    key={invite.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#C19A5B]/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-[#C19A5B]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-[#3A3941]">
                          {invite.creator.displayName}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {invite.creator.user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        className={
                          invite.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : invite.status === "ACCEPTED"
                            ? "bg-green-100 text-green-800"
                            : invite.status === "DECLINED"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {invite.status}
                      </Badge>
                      {invite.status === "PENDING" && (
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Resend
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                {campaign.invites.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No invites sent yet.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deliverables Tab */}
        <TabsContent value="deliverables" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#3A3941]">
                <FileText className="h-5 w-5" />
                Deliverables Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {["PENDING", "IN_PROGRESS", "SUBMITTED", "COMPLETED"].map(
                  (status) => (
                    <div key={status} className="space-y-3">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        {status.replace("_", " ")}
                      </h3>
                      <div className="space-y-2">
                        {campaign.deliverables
                          .filter((d) => d.status === status)
                          .map((deliverable) => (
                            <div
                              key={deliverable.id}
                              className="p-3 bg-[#F8F7F4] rounded-lg"
                            >
                              <div className="font-medium text-sm text-[#3A3941]">
                                {deliverable.title || deliverable.type}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {deliverable.platform} • Due: {deliverable.dueDate}
                              </div>
                              {deliverable.contentUrl && (
                                <a
                                  href={deliverable.contentUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-[#C19A5B] hover:underline mt-2 block"
                                >
                                  View Content
                                </a>
                              )}
                            </div>
                          ))}
                        {campaign.deliverables.filter((d) => d.status === status)
                          .length === 0 && (
                          <div className="text-xs text-muted-foreground text-center py-4">
                            No deliverables
                          </div>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contracts Tab */}
        <TabsContent value="contracts" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-[#3A3941]">
                  <CheckCircle2 className="h-5 w-5" />
                  Contracts ({campaign.contracts.length})
                </CardTitle>
                <Button
                  className="bg-[#C19A5B] hover:bg-[#C19A5B]/90 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Generate Contract
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaign.contracts.map((contract) => (
                  <div
                    key={contract.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          contract.status === "FULLY_EXECUTED"
                            ? "bg-green-100"
                            : contract.status === "DRAFT"
                            ? "bg-gray-100"
                            : "bg-yellow-100"
                        }`}
                      >
                        <CheckCircle2
                          className={`h-5 w-5 ${
                            contract.status === "FULLY_EXECUTED"
                              ? "text-green-600"
                              : contract.status === "DRAFT"
                              ? "text-gray-600"
                              : "text-yellow-600"
                          }`}
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-[#3A3941]">
                          {contract.type} Contract
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {contract.creatorSignedAt && contract.brandSignedAt
                            ? "Fully Signed"
                            : contract.creatorSignedAt
                            ? "Pending Brand Signature"
                            : "Draft"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        className={
                          contract.status === "FULLY_EXECUTED"
                            ? "bg-green-100 text-green-800"
                            : contract.status === "DRAFT"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {contract.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
                {campaign.contracts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No contracts generated yet.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-[#3A3941] mb-4">
              Invite Creator
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="creatorId">Creator ID</Label>
                <Input
                  id="creatorId"
                  value={inviteCreatorId}
                  onChange={(e) => setInviteCreatorId(e.target.value)}
                  placeholder="Enter creator ID"
                />
                {/* In production, this would be a searchable dropdown */}
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea
                  id="message"
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  placeholder="Tell the creator why you'd like them to join..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliverables">Deliverables (JSON)</Label>
                <Textarea
                  id="deliverables"
                  value={inviteDeliverables}
                  onChange={(e) => setInviteDeliverables(e.target.value)}
                  rows={4}
                  className="font-mono text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowInviteModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendInvite}
                disabled={sendingInvite}
                className="bg-[#C19A5B] hover:bg-[#C19A5B]/90 text-white"
              >
                {sendingInvite ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Invite
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
