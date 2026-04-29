"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  Settings,
  Link2,
  BarChart3,
  Users,
  Globe,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface MediaKitData {
  mediaKit: {
    id: string;
    slug: string;
    isPublic: boolean;
    settings: any;
    updatedAt: string;
  };
}

interface PublicViewData {
  mediaKit: {
    slug: string;
    isPublic: boolean;
    settings: any;
  };
  creator: {
    id: string;
    name: string;
    handle: string;
    bio: string;
    niche: string;
    location: string;
    website: string;
    rateRange: string;
  };
  liveMetrics: {
    totalFollowers: number;
    totalFollowing: number;
    avgEngagementRate: string;
    totalImpressions: number;
    totalEngagement: number;
    platforms: Array<{
      platform: string;
      username: string;
      followers: number;
      engagementRate: number;
    }>;
  };
  audienceDemographics: Record<string, Array<{ label: string; percentage: number }>>;
  pastCampaigns: Array<any>;
}

export default function CreatorMediaKitPage() {
  const router = useRouter();
  const [mediaKit, setMediaKit] = useState<MediaKitData | null>(null);
  const [publicData, setPublicData] = useState<PublicViewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [settings, setSettings] = useState({
    showPastCampaigns: true,
    showPricing: true,
    showAudienceDemographics: true,
    showLiveMetrics: true,
    theme: "light",
    accentColor: "#C19A5B",
  });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("builder");

  const fetchMediaKit = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/creators/media-kit");
      if (!res.ok) throw new Error("Failed to fetch media kit");
      const data = await res.json();
      setMediaKit(data);
      setSlug(data.mediaKit.slug);
      setIsPublic(data.mediaKit.isPublic);
      if (data.mediaKit.settings) {
        setSettings(data.mediaKit.settings);
      }
    } catch (error) {
      console.error("Media kit fetch error:", error);
      toast({
        title: "Error",
        description: "Failed to load media kit",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchPublicView = useCallback(async (slug: string) => {
    try {
      const res = await fetch(`/api/media-kits/${slug}`);
      if (!res.ok) return;
      const data = await res.json();
      setPublicData(data);
    } catch (error) {
      console.error("Public view fetch error:", error);
    }
  }, []);

  useEffect(() => {
    fetchMediaKit();
  }, [fetchMediaKit]);

  useEffect(() => {
    if (slug && isPublic) {
      fetchPublicView(slug);
    }
  }, [slug, isPublic, fetchPublicView]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await fetch("/api/creators/media-kit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          isPublic,
          settings,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save");
      }

      const data = await res.json();
      setMediaKit(data);
      toast({
        title: "Success",
        description: "Media kit updated successfully",
      });

      // Refresh public view if now public
      if (isPublic) {
        fetchPublicView(slug);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const copyShareLink = () => {
    const url = `${window.location.origin}/m/${slug}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "Share this link with brands",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <BarChart3 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const publicUrl = `${window.location.origin}/m/${slug}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#3A3941]">Media Kit Builder</h1>
          <p className="text-muted-foreground mt-1">
            Create your dynamic, API-connected media kit
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {isPublic && (
            <Button
              variant="outline"
              onClick={copyShareLink}
              className="border-[#C19A5B] text-[#C19A5B]"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
          )}
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#C19A5B] hover:bg-[#C19A5B]/90 text-white"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Status Card */}
      <Card className="border-border/50 bg-[#F8F7F4]">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isPublic ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              )}
              <div>
                <div className="font-medium text-[#3A3941]">
                  {isPublic ? "Public" : "Private"}
                </div>
                <div className="text-sm text-muted-foreground">
                  {isPublic
                    ? "Your media kit is visible to brands"
                    : "Enable public access to share your kit"}
                </div>
              </div>
            </div>
            {isPublic && (
              <a
                href={`/m/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-[#C19A5B] hover:underline"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Preview
              </a>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="builder">
            <Settings className="h-4 w-4 mr-2" />
            Builder
          </TabsTrigger>
          <TabsTrigger value="preview">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-6">
          {/* Slug & URL Settings */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-[#3A3941] flex items-center space-x-2">
                <Link2 className="h-5 w-5" />
                <span>Shareable Link</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="slug">Custom Slug</Label>
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">
                    {window.location.origin}/m/
                  </span>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    className="max-w-xs"
                    placeholder="your-handle"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="public"
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                />
                <Label htmlFor="public">Make media kit public</Label>
              </div>
            </CardContent>
          </Card>

          {/* Display Settings */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-[#3A3941] flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Display Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-[#3A3941]">Past Campaigns</div>
                  <div className="text-sm text-muted-foreground">
                    Show your campaign history to brands
                  </div>
                </div>
                <Switch
                  checked={settings.showPastCampaigns}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, showPastCampaigns: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-[#3A3941]">Pricing Info</div>
                  <div className="text-sm text-muted-foreground">
                    Display your rate range
                  </div>
                </div>
                <Switch
                  checked={settings.showPricing}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, showPricing: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-[#3A3941]">Audience Demographics</div>
                  <div className="text-sm text-muted-foreground">
                    Show age, gender, and location breakdown
                  </div>
                </div>
                <Switch
                  checked={settings.showAudienceDemographics}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, showAudienceDemographics: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-[#3A3941]">Live Metrics</div>
                  <div className="text-sm text-muted-foreground">
                    Display real-time follower counts and engagement
                  </div>
                </div>
                <Switch
                  checked={settings.showLiveMetrics}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, showLiveMetrics: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Theme Settings */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-[#3A3941] flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>Theme Customization</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Accent Color</Label>
                <div className="flex items-center space-x-2">
                  {["#C19A5B", "#3A3941", "#635BFF", "#10B981", "#EF4444"].map(
                    (color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full border-2 ${
                          settings.accentColor === color
                            ? "border-[#3A3941]"
                            : "border-transparent"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() =>
                          setSettings({ ...settings, accentColor: color })
                        }
                      />
                    )
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          {publicData ? (
            <PublicMediaKitView data={publicData} />
          ) : (
            <Card className="border-border/50">
              <CardContent className="pt-6 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {isPublic
                    ? "Loading preview..."
                    : "Make your media kit public to see the preview"}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PublicMediaKitView({ data }: { data: PublicViewData }) {
  const { creator, liveMetrics, audienceDemographics, pastCampaigns } = data;

  return (
    <div className="bg-white border border-border/50 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-[#3A3941] text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">{creator.name}</h1>
          <p className="text-lg opacity-80">@{creator.handle}</p>
          {creator.bio && (
            <p className="mt-4 text-sm opacity-70">{creator.bio}</p>
          )}
          <div className="flex items-center space-x-4 mt-4 text-sm opacity-70">
            {creator.location && <span>{creator.location}</span>}
            {creator.website && (
              <a href={creator.website} className="hover:underline">
                {creator.website}
              </a>
            )}
            {creator.niche && <Badge className="bg-white/20">{creator.niche}</Badge>}
          </div>
        </div>
      </div>

      <div className="p-8 max-w-4xl mx-auto space-y-8">
        {/* Live Metrics */}
        {data.mediaKit.settings?.showLiveMetrics && (
          <section>
            <h2 className="text-xl font-bold text-[#3A3941] mb-4">Live Metrics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard
                label="Total Followers"
                value={liveMetrics.totalFollowers.toLocaleString()}
                icon={<Users className="h-4 w-4" />}
              />
              <MetricCard
                label="Avg Engagement"
                value={`${liveMetrics.avgEngagementRate}%`}
                icon={<BarChart3 className="h-4 w-4" />}
              />
              <MetricCard
                label="Impressions (30d)"
                value={liveMetrics.totalImpressions.toLocaleString()}
                icon={<Eye className="h-4 w-4" />}
              />
              <MetricCard
                label="Engagement (30d)"
                value={liveMetrics.totalEngagement.toLocaleString()}
                icon={<BarChart3 className="h-4 w-4" />}
              />
            </div>

            {/* Platform Breakdown */}
            <div className="mt-6 space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Platform Breakdown
              </h3>
              {liveMetrics.platforms.map((platform) => (
                <div
                  key={platform.platform}
                  className="flex items-center justify-between p-4 bg-[#F8F7F4] rounded-lg"
                >
                  <div>
                    <div className="font-medium text-[#3A3941]">
                      {platform.platform}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      @{platform.username}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-[#3A3941]">
                      {platform.followers.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {platform.engagementRate}% engagement
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <Separator />

        {/* Audience Demographics */}
        {data.mediaKit.settings?.showAudienceDemographics &&
          audienceDemographics && (
            <section>
              <h2 className="text-xl font-bold text-[#3A3941] mb-4">
                Audience Demographics
              </h2>
              {Object.entries(audienceDemographics).map(
                ([type, demos]: [string, any]) =>
                  demos.length > 0 && (
                    <div key={type} className="mb-6">
                      <h3 className="text-sm font-medium text-muted-foreground mb-3">
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </h3>
                      <div className="space-y-2">
                        {demos.map((demo: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between"
                          >
                            <span className="text-sm text-[#3A3941]">
                              {demo.label}
                            </span>
                            <div className="flex items-center space-x-2">
                              <div className="w-32 h-2 bg-gray-200 rounded-full">
                                <div
                                  className="h-full bg-[#C19A5B] rounded-full"
                                  style={{ width: `${demo.percentage}%` }}
                                />
                              </div>
                              <span className="text-sm font-mono text-muted-foreground w-12 text-right">
                                {demo.percentage}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
              )}
            </section>
          )}

        <Separator />

        {/* Past Campaigns */}
        {data.mediaKit.settings?.showPastCampaigns && pastCampaigns && pastCampaigns.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-[#3A3941] mb-4">
              Past Campaigns
            </h2>
            <div className="space-y-4">
              {pastCampaigns.map((campaign: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 bg-[#F8F7F4] rounded-lg flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-[#3A3941]">
                      {campaign.campaignTitle}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {campaign.brandName}
                    </div>
                  </div>
                  {campaign.performance && (
                    <div className="text-right text-sm">
                      <div className="font-mono text-[#3A3941]">
                        {campaign.performance.impressions?.toLocaleString() || 0} imp
                      </div>
                      <div className="text-muted-foreground">
                        {campaign.performance.clicks?.toLocaleString() || 0} clicks
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Pricing */}
        {data.mediaKit.settings?.showPricing && creator.rateRange && (
          <>
            <Separator />
            <section>
              <h2 className="text-xl font-bold text-[#3A3941] mb-4">
                Partnership Rates
              </h2>
              <div className="p-6 bg-[#F8F7F4] rounded-lg text-center">
                <div className="text-sm text-muted-foreground mb-2">
                  Typical Rate Range
                </div>
                <div className="text-3xl font-bold text-[#C19A5B] font-mono">
                  {creator.rateRange}
                </div>
              </div>
            </section>
          </>
        )}

      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="border-border/50">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">{label}</span>
          <div className="text-[#C19A5B]">{icon}</div>
        </div>
        <div className="text-2xl font-bold text-[#3A3941] font-mono">
          {value}
        </div>
      </CardContent>
    </Card>
  );
}
