"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  DollarSign,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface Campaign {
  id: string;
  title: string;
  budget: number;
  spent: number;
  status: string;
  creators: {
    id: string;
    creator: {
      displayName: string;
    };
    rate: number;
    paymentStatus: string;
  }[];
}

export default function BrandCampaignFunding() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [funding, setFunding] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch("/api/brands/campaigns"); // Assuming this endpoint exists
      const data = await res.json();
      if (data.campaigns) {
        setCampaigns(data.campaigns);
      }
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFunds = async (campaignId: string, amount: number) => {
    setFunding(true);
    try {
      const res = await fetch(`/api/payments/fund`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId, amount }),
      });

      if (res.ok) {
        alert("Funds added successfully!");
        fetchCampaigns();
      }
    } catch (error) {
      console.error("Failed to add funds:", error);
      alert("Failed to add funds");
    } finally {
      setFunding(false);
    }
  };

  const handlePayCreator = async (campaignCreatorId: string) => {
    try {
      const res = await fetch(`/api/payments/payout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignCreatorId }),
      });

      if (res.ok) {
        alert("Payout initiated!");
        fetchCampaigns();
      }
    } catch (error) {
      console.error("Failed to pay creator:", error);
      alert("Failed to pay creator");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      "DRAFT": { color: "bg-gray-100 text-gray-800", text: "Draft" },
      "ACTIVE": { color: "bg-green-100 text-green-800", text: "Active" },
      "PAUSED": { color: "bg-yellow-100 text-yellow-800", text: "Paused" },
      "COMPLETED": { color: "bg-blue-100 text-blue-800", text: "Completed" },
      "CANCELLED": { color: "bg-red-100 text-red-800", text: "Cancelled" },
    };
    const config = statusMap[status] || { color: "bg-gray-100 text-gray-800", text: status };
    return <Badge className={config.color}>{config.text}</Badge>;
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      "PENDING": { color: "bg-yellow-100 text-yellow-800", text: "Pending" },
      "PROCESSING": { color: "bg-blue-100 text-blue-800", text: "Processing" },
      "PAID": { color: "bg-green-100 text-green-800", text: "Paid" },
      "FAILED": { color: "bg-red-100 text-red-800", text: "Failed" },
    };
    const config = statusMap[status] || { color: "bg-gray-100 text-gray-800", text: status };
    return <Badge className={config.color}>{config.text}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#3A3941]">Campaign Funding</h1>
        <p className="text-muted-foreground mt-2">
          Manage campaign budgets and pay creators
        </p>
      </div>

      {campaigns.length === 0 ? (
        <Card className="bg-muted/50">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No campaigns yet. Create one to start funding.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="border-border/50 bg-[#F8F7F4]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <span>{campaign.title}</span>
                    {getStatusBadge(campaign.status)}
                  </CardTitle>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className="text-2xl font-mono font-bold text-[#C19A5B]">
                      ${campaign.budget.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Budget Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Spent</span>
                    <span className="font-mono">
                      ${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#C19A5B] h-full rounded-full transition-all"
                      style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Creator Payouts */}
                {campaign.creators.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-3">Creator Payouts</h4>
                    <div className="space-y-2">
                      {campaign.creators.map((cc) => (
                        <div
                          key={cc.id}
                          className="flex items-center justify-between p-3 border border-border/30 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-sm">{cc.creator.displayName}</p>
                            <p className="text-xs text-muted-foreground font-mono">
                              ${cc.rate.toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-3">
                            {getPaymentStatusBadge(cc.paymentStatus)}
                            {cc.paymentStatus === "PENDING" && (
                              <Button
                                size="sm"
                                onClick={() => handlePayCreator(cc.id)}
                                className="bg-[#C19A5B] hover:bg-[#C19A5B]/90 text-white"
                              >
                                <DollarSign className="h-4 w-4 mr-1" />
                                Pay Now
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Funds Button */}
                <div className="flex justify-end">
                  <Button
                    onClick={() => handleAddFunds(campaign.id, 1000)}
                    disabled={funding}
                  >
                    {funding ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Wallet className="h-4 w-4 mr-2" />
                        Add Funds
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">About Campaign Funding</h3>
              <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
                <li>Add funds to campaign budget before activating</li>
                <li>Creators are paid after campaign milestones are met</li>
                <li>Platform fee: 5% for Stripe, 6% for Razorpay</li>
                <li>All payouts are tracked for tax/audit compliance</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
