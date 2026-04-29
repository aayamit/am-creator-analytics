"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Wallet,
  Banknote,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Loader2,
} from "lucide-react";

interface PayoutAccount {
  id: string;
  provider: "STRIPE" | "RAZORPAY";
  status: string;
  kycVerified: boolean;
  onboardingComplete: boolean;
  dashboardUrl?: string;
}

export default function CreatorPayoutSettings() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("stripe");
  const [stripeAccount, setStripeAccount] = useState<PayoutAccount | null>(null);
  const [razorpayAccount, setRazorpayAccount] = useState<PayoutAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      // Fetch Stripe account
      const stripeRes = await fetch("/api/payments/stripe/connect");
      const stripeData = await stripeRes.json();
      if (stripeData.exists) {
        setStripeAccount(stripeData.account);
      }

      // Fetch Razorpay account
      const razorpayRes = await fetch("/api/payments/razorpay/connect");
      const razorpayData = await razorpayRes.json();
      if (razorpayData.exists) {
        setRazorpayAccount(razorpayData.account);
      }
    } catch (error) {
      console.error("Failed to fetch payout accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStripeConnect = async () => {
    setConnecting(true);
    try {
      const res = await fetch("/api/payments/stripe/connect", {
        method: "POST",
      });
      const data = await res.json();

      if (data.onboardingUrl) {
        window.location.href = data.onboardingUrl;
      } else if (data.account?.dashboardUrl) {
        window.open(data.account.dashboardUrl, "_blank");
      }
    } catch (error) {
      console.error("Stripe Connect error:", error);
      alert("Failed to connect Stripe account");
    } finally {
      setConnecting(false);
    }
  };

  const handleRazorpayConnect = async () => {
    setConnecting(true);
    try {
      // In real implementation, collect name/email/phone from a form
      const res = await fetch("/api/payments/razorpay/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Creator Name", // Should come from profile
          email: "creator@example.com",
        }),
      });
      const data = await res.json();

      if (data.success) {
        alert("Razorpay account created! Complete onboarding via dashboard.");
        fetchAccounts();
      }
    } catch (error) {
      console.error("Razorpay Connect error:", error);
      alert("Failed to connect Razorpay account");
    } finally {
      setConnecting(false);
    }
  };

  const getStatusBadge = (account: PayoutAccount | null) => {
    if (!account) {
      return <Badge variant="outline">Not Connected</Badge>;
    }

    if (account.status === "ACTIVE" && account.kycVerified) {
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    } else if (account.onboardingComplete) {
      return <Badge className="bg-yellow-100 text-yellow-800">Pending Verification</Badge>;
    } else {
      return <Badge className="bg-gray-100 text-gray-800">Setup Required</Badge>;
    }
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
        <h1 className="text-3xl font-bold text-[#3A3941]">Payout Settings</h1>
        <p className="text-muted-foreground mt-2">
          Set up your payout method to receive payments from brands
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stripe">
            <Wallet className="h-4 w-4 mr-2" />
            Stripe Connect (Global)
          </TabsTrigger>
          <TabsTrigger value="razorpay">
            <Banknote className="h-4 w-4 mr-2" />
            Razorpay (India)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stripe" className="space-y-4">
          <Card className="border-border/50 bg-[#F8F7F4]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Wallet className="h-5 w-5 text-[#C19A5B]" />
                  <span>Stripe Connect</span>
                </CardTitle>
                {getStatusBadge(stripeAccount)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Connect your Stripe account to receive payouts in USD, EUR, GBP, and 135+ currencies.
              </p>

              {stripeAccount ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Account ID: {stripeAccount.id}</span>
                  </div>
                  {stripeAccount.dashboardUrl && (
                    <Button
                      variant="outline"
                      onClick={() => window.open(stripeAccount.dashboardUrl, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Stripe Dashboard
                    </Button>
                  )}
                </div>
              ) : (
                  <Button
                  onClick={handleStripeConnect}
                  disabled={connecting}
                  className="bg-[#635BFF] hover:bg-[#635BFF]/90 text-white"
                >
                  {connecting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Wallet className="h-4 w-4 mr-2" />
                      Connect with Stripe
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="razorpay" className="space-y-4">
          <Card className="border-border/50 bg-[#F8F7F4]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Banknote className="h-5 w-5 text-[#C19A5B]" />
                  <span>Razorpay</span>
                </CardTitle>
                {getStatusBadge(razorpayAccount)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Use Razorpay for INR payouts within India. Supports UPI, NEFT, RTGS, and IMPS.
              </p>

              {razorpayAccount ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Contact ID: {razorpayAccount.id}</span>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={handleRazorpayConnect}
                  disabled={connecting}
                  className="bg-[#02042B] hover:bg-[#02042B]/90 text-white"
                >
                  {connecting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Banknote className="h-4 w-4 mr-2" />
                      Connect with Razorpay
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">About Payouts</h3>
              <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
                <li>Stripe Connect: Best for international creators (2% platform fee)</li>
                <li>Razorpay: Best for Indian creators (3% platform fee for INR)</li>
                <li>KYC verification required before first payout</li>
                <li>Payouts processed within 2-7 business days</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
