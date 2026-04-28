"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Send,
  FileText,
  CheckCircle2,
  AlertCircle,
  Eye,
  Plus,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  Clock,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Campaign {
  id: string;
  title: string;
  status: string;
  brand: {
    companyName: string;
  };
  campaignCreators: {
    id: string;
    rate: number;
    deliverables: any;
    contract: {
      id: string;
      status: string;
    } | null;
  }[];
}

interface Invite {
  id: string;
  campaign: {
    id: string;
    title: string;
    brand: {
      companyName: string;
    };
  };
  status: string;
  message: string;
  createdAt: string;
  deliverables: any;
}

export default function CreatorCampaignsPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("campaigns");
  const [respondingInvite, setRespondingInvite] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch campaigns
      const campaignsRes = await fetch("/api/creators/campaigns");
      const campaignsData = campaignsRes.ok ? await campaignsRes.json() : { campaigns: [] };

      // Fetch invites
      const invitesRes = await fetch("/api/creators/invites");
      const invitesData = invitesRes.ok ? await invitesRes.json() : { invites: [] };

      setCampaigns(campaignsData.campaigns || []);
      setInvites(invitesData.invites || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRespondToInvite = async (inviteId: string, accept: boolean) => {
    try {
      setRespondingInvite(inviteId);
      const method = accept ? "PUT" : "PATCH";
      const res = await fetch(`/api/campaigns/invites/${inviteId}/accept`, {
        method,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to respond");
      }

      toast({
        title: accept ? "Invite Accepted!" : "Invite Declined",
        description: accept
          ? "You've been added to the campaign"
          : "Invite has been declined",
      });

      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setRespondingInvite(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "DRAFT":
        return "bg-gray-100 text-gray-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        Loading campaigns...
      </div>
    );
  }

  const pendingInvites = invites.filter((inv) => inv.status === "PENDING");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#3A3941] font-heading">
          My Campaigns
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your campaign participation, invites, and deliverables
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="campaigns">
            <Users className="h-4 w-4 mr-2" />
            Campaigns ({campaigns.length})
          </TabsTrigger>
          <TabsTrigger value="invites">
            <Send className="h-4 w-4 mr-2" />
            Invites ({pendingInvites.length})
          </TabsTrigger>
        </TabsList>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-6">
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#C19A5B]/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-[#C19A5B]" />
                      </div>
                      <div>
                        <h3 className="font-medium text-[#3A3941]">
                          {campaign.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {campaign.brand.companyName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </div>
                  {campaign.campaignCreators.map((cc) => (
                    <div
                      key={cc.id}
                      className="mt-4 pt-4 border-t border-border"
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Rate:{" "}
                          <span className="font-mono text-[#3A3941]">
                            ${cc.rate?.toLocaleString()}
                          </span>
                        </span>
                        {cc.contract && (
                          <Badge
                            className={
                              cc.contract.status === "FULLY_EXECUTED"
                                ? "bg-green-100 text-green-800"
                                : cc.contract.status === "SIGNED_BY_CREATOR"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            {cc.contract.status}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
            {campaigns.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>You haven't joined any campaigns yet.</p>
                <p className="text-sm mt-2">
                  Check your invites or browse available campaigns.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Invites Tab */}
        <TabsContent value="invites" className="space-y-6">
          <div className="space-y-4">
            {invites.map((invite) => (
              <Card key={invite.id} className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          invite.status === "PENDING"
                            ? "bg-yellow-100"
                            : invite.status === "ACCEPTED"
                            ? "bg-green-100"
                            : "bg-red-100"
                        }`}
                      >
                        {invite.status === "PENDING" ? (
                          <Clock className="h-5 w-5 text-yellow-600" />
                        ) : invite.status === "ACCEPTED" ? (
                          <ThumbsUp className="h-5 w-5 text-green-600" />
                        ) : (
                          <ThumbsDown className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-[#3A3941]">
                          {invite.campaign.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          From: {invite.campaign.brand.companyName}
                        </p>
                        {invite.message && (
                          <p className="text-sm text-muted-foreground mt-1">
                            &quot;{invite.message}&quot;
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          invite.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : invite.status === "ACCEPTED"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {invite.status}
                      </Badge>
                      {invite.status === "PENDING" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-[#C19A5B] hover:bg-[#C19A5B]/90 text-white"
                            onClick={() =>
                              handleRespondToInvite(invite.id, true)
                            }
                            disabled={respondingInvite === invite.id}
                          >
                            {respondingInvite === invite.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <ThumbsUp className="h-4 w-4 mr-2" />
                                Accept
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleRespondToInvite(invite.id, false)
                            }
                            disabled={respondingInvite === invite.id}
                          >
                            <ThumbsDown className="h-4 w-4 mr-2" />
                            Decline
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  {invite.deliverables && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        Deliverables:{" "}
                        {JSON.stringify(invite.deliverables)}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            {invites.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Send className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No invites yet.</p>
                <p className="text-sm mt-2">
                  Brands will send you invites when they want to collaborate.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
