"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

interface NotificationPreference {
  id: string;
  type: string;
  label: string;
  description: string;
  emailEnabled: boolean;
  inAppEnabled: boolean;
  pushEnabled: boolean;
}

export default function NotificationPreferencesPage() {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [browserPushEnabled, setBrowserPushEnabled] = useState(false);

  useEffect(() => {
    fetchPreferences();
    checkBrowserPushPermission();
  }, []);

  const fetchPreferences = async () => {
    try {
      // Mock data - in production, fetch from API
      const mockPreferences: NotificationPreference[] = [
        {
          id: "1",
          type: "CAMPAIGN_INVITE",
          label: "Campaign Invites",
          description: "When a brand invites you to a campaign",
          emailEnabled: true,
          inAppEnabled: true,
          pushEnabled: true,
        },
        {
          id: "2",
          type: "CAMPAIGN_UPDATE",
          label: "Campaign Updates",
          description: "Status changes, new deliverables, etc.",
          emailEnabled: true,
          inAppEnabled: true,
          pushEnabled: false,
        },
        {
          id: "3",
          type: "CONTRACT_SIGNED",
          label: "Contract Signed",
          description: "When a contract is signed by a party",
          emailEnabled: true,
          inAppEnabled: true,
          pushEnabled: true,
        },
        {
          id: "4",
          type: "PAYMENT_RECEIVED",
          label: "Payment Received",
          description: "When you receive a payment",
          emailEnabled: true,
          inAppEnabled: true,
          pushEnabled: true,
        },
        {
          id: "5",
          type: "MILESTONE_REACHED",
          label: "Milestones",
          description: "When campaign milestones are reached",
          emailEnabled: false,
          inAppEnabled: true,
          pushEnabled: false,
        },
        {
          id: "6",
          type: "SYSTEM_ALERT",
          label: "System Alerts",
          description: "Important system notifications",
          emailEnabled: true,
          inAppEnabled: true,
          pushEnabled: true,
        },
      ];
      setPreferences(mockPreferences);
    } catch (error) {
      console.error("Failed to fetch preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkBrowserPushPermission = () => {
    if ("Notification" in window) {
      setBrowserPushEnabled(Notification.permission === "granted");
    }
  };

  const togglePreference = async (
    id: string,
    channel: "email" | "inApp" | "push"
  ) => {
    try {
      setSaving(id + channel);
      setPreferences((prev) =>
        prev.map((pref) => {
          if (pref.id === id) {
            const updated = { ...pref };
            if (channel === "email") updated.emailEnabled = !pref.emailEnabled;
            if (channel === "inApp") updated.inAppEnabled = !pref.inAppEnabled;
            if (channel === "push") updated.pushEnabled = !pref.pushEnabled;
            return updated;
          }
          return pref;
        })
      );

      // In production, save to API
      await new Promise((resolve) => setTimeout(resolve, 500));

      toast({
        title: "Preference Updated",
        description: "Your notification preferences have been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update preference.",
        variant: "destructive",
      });
    } finally {
      setSaving(null);
    }
  };

  const enableBrowserPush = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setBrowserPushEnabled(true);
        toast({
          title: "Push Notifications Enabled",
          description: "You'll now receive browser notifications.",
        });
      }
    } catch (error) {
      console.error("Push permission error:", error);
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
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Notification Preferences
          </h1>
          <p className="text-muted-foreground mt-1">
            Choose how you receive notifications
          </p>
        </div>

        {/* Browser Push Notification Settings */}
        <Card className="border-border/50 mb-6">
          <CardHeader>
            <CardTitle className="text-[#3A3941]">
              Browser Push Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">
                  Desktop Notifications
                </p>
                <p className="text-sm text-muted-foreground">
                  Receive notifications even when the app is closed
                </p>
              </div>
              {browserPushEnabled ? (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Enabled
                </Badge>
              ) : (
                <Button onClick={enableBrowserPush} variant="outline" size="sm">
                  Enable
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notification Type Preferences */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-[#3A3941]">
              Notification Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Header */}
              <div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground">
                <div>Type</div>
                <div className="text-center">Email</div>
                <div className="text-center">In-App</div>
                <div className="text-center">Push</div>
              </div>

              <Separator />

              {/* Preferences List */}
              {preferences.map((pref) => (
                <div key={pref.id}>
                  <div className="grid grid-cols-4 gap-4 items-center py-3">
                    <div>
                      <p className="font-medium text-foreground">
                        {pref.label}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {pref.description}
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <Switch
                        checked={pref.emailEnabled}
                        onCheckedChange={() =>
                          togglePreference(pref.id, "email")
                        }
                        disabled={saving === pref.id + "email"}
                      />
                    </div>
                    <div className="flex justify-center">
                      <Switch
                        checked={pref.inAppEnabled}
                        onCheckedChange={() =>
                          togglePreference(pref.id, "inApp")
                        }
                        disabled={saving === pref.id + "inApp"}
                      />
                    </div>
                    <div className="flex justify-center">
                      <Switch
                        checked={pref.pushEnabled}
                        onCheckedChange={() =>
                          togglePreference(pref.id, "push")
                        }
                        disabled={
                          saving === pref.id + "push" ||
                          !browserPushEnabled
                        }
                      />
                    </div>
                  </div>
                  <Separator />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
