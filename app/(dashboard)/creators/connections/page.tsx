"use client";

import { useState, useEffect } from "react";
import { signIn, signOut, getSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Link2, Unlink, Video, Globe } from "lucide-react";

interface SocialAccount {
  platform: string;
  platformId: string;
  username: string;
  profileUrl: string;
  connected: boolean;
}

export default function ConnectionsPage() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([
    {
      platform: "YOUTUBE",
      platformId: "",
      username: "",
      profileUrl: "",
      connected: false,
    },
    {
      platform: "LINKEDIN",
      platformId: "",
      username: "",
      profileUrl: "",
      connected: false,
    },
  ]);

  useEffect(() => {
    async function fetchAccounts() {
      const session = await getSession();
      if (!session?.user?.id) return;

      // In real implementation, fetch from /api/creators/[id] to get social accounts
      // For now, check if Account table has entries for this user
      // We'll do a simple check via API
      try {
        const res = await fetch(`/api/creators/${(session.user as any).id}`);
        const data = await res.json();
        if (data.socialAccounts) {
          setAccounts((prev) =>
            prev.map((acc) => {
              const found = data.socialAccounts.find(
                (sa: any) => sa.platform === acc.platform
              );
              if (found) {
                return { ...acc, ...found, connected: true };
              }
              return acc;
            })
          );
        }
      } catch (error) {
        console.error("Failed to fetch accounts:", error);
      }
    }

    fetchAccounts();
  }, []);

  const handleConnect = (platform: string) => {
    if (platform === "YOUTUBE") {
      signIn("google", { callbackUrl: "/creators/connections" });
    } else if (platform === "LINKEDIN") {
      signIn("linkedin", { callbackUrl: "/creators/connections" });
    }
  };

  const handleDisconnect = async (platform: string) => {
    if (!confirm(`Disconnect ${platform} account?`)) return;

    try {
      // Call API to disconnect
      await fetch(`/api/social-accounts/${platform}`, {
        method: "DELETE",
      });
      // Update local state
      setAccounts((prev) =>
        prev.map((acc) =>
          acc.platform === platform ? { ...acc, connected: false } : acc
        )
      );
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground font-heading">
          Social Account Connections
        </h1>
        <p className="text-muted-foreground mt-2">
          Connect your social accounts to automatically sync analytics and
          populate your dynamic media kit.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* YouTube / Google */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Video className="h-5 w-5 text-red-500" />
                <span>YouTube</span>
              </CardTitle>
              {accounts[0].connected ? (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="outline">Not Connected</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {accounts[0].connected ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Channel</p>
                  <p className="font-medium text-foreground">
                    {accounts[0].username || "Connected"}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => handleDisconnect("YOUTUBE")}
                >
                  <Unlink className="h-4 w-4 mr-2" />
                  Disconnect
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Connect your YouTube channel to automatically sync
                  subscriber count, view counts, and engagement metrics.
                </p>
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => handleConnect("YOUTUBE")}
                >
                  <Link2 className="h-4 w-4 mr-2" />
                  Connect YouTube
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* LinkedIn */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-blue-600" />
                <span>LinkedIn</span>
              </CardTitle>
              {accounts[1].connected ? (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="outline">Not Connected</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {accounts[1].connected ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Profile</p>
                  <p className="font-medium text-foreground">
                    {accounts[1].username || "Connected"}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => handleDisconnect("LINKEDIN")}
                >
                  <Unlink className="h-4 w-4 mr-2" />
                  Disconnect
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Connect your LinkedIn profile to sync professional
                  audience demographics and engagement data.
                </p>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => handleConnect("LINKEDIN")}
                >
                  <Link2 className="h-4 w-4 mr-2" />
                  Connect LinkedIn
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Info Section */}
      <Card className="border-border bg-muted/30">
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-2">
            Why connect your accounts?
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-accent" />
              <span>
                <strong>Real-time metrics:</strong> Your media kit automatically
                updates with the latest data from your social platforms.
              </span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-accent" />
              <span>
                <strong>Verified audience data:</strong> Brands can trust your
                metrics because they come directly from the platforms.
              </span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-accent" />
              <span>
                <strong>Save time:</strong> No more manually updating PDFs or
                spreadsheets — everything syncs automatically.
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
