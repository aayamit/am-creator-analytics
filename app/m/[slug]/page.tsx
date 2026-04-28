"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  BarChart3,
  Eye,
  Globe,
  Link2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PublicKitData {
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

export default function PublicMediaKitPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [data, setData] = useState<PublicKitData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchKit = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/media-kits/${slug}`);
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || "Media kit not found");
        }
        const kitData = await res.json();
        setData(kitData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchKit();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-red-600 mb-2">Error: {error || "Media kit not found"}</p>
            <p className="text-sm text-muted-foreground">
              This media kit may be private or doesn't exist.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { creator, liveMetrics, audienceDemographics, pastCampaigns, mediaKit } = data;

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      {/* Header */}
      <div className="bg-[#3A3941] text-white p-8 md:px-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{creator.name}</h1>
              <p className="text-lg opacity-80">@{creator.handle}</p>
              {creator.bio && (
                <p className="mt-4 text-sm opacity-70 max-w-2xl">{creator.bio}</p>
              )}
              <div className="flex items-center space-x-4 mt-4 text-sm opacity-70">
                {creator.location && <span>{creator.location}</span>}
                {creator.website && (
                  <a
                    href={creator.website}
                    className="hover:underline flex items-center"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Link2 className="h-3 w-3 mr-1" />
                    {creator.website}
                  </a>
                )}
                {creator.niche && (
                  <Badge className="bg-white/20 hover:bg-white/30">
                    {creator.niche}
                  </Badge>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-8 md:px-16 space-y-8">
        {/* Live Metrics */}
        {mediaKit.settings?.showLiveMetrics && (
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
                  className="flex items-center justify-between p-4 bg-white rounded-lg border border-border/50"
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
        {mediaKit.settings?.showAudienceDemographics &&
          audienceDemographics &&
          Object.keys(audienceDemographics).length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-[#3A3941] mb-4">
                Audience Demographics
              </h2>
              {Object.entries(audienceDemographics).map(
                ([type, demos]: [string, any]) =>
                  demos && demos.length > 0 ? (
                    <div key={type} className="mb-6">
                      <h3 className="text-sm font-medium text-muted-foreground mb-3 capitalize">
                        {type}
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
                  ) : null
              )}
            </section>
          )}

        <Separator />

        {/* Past Campaigns */}
        {mediaKit.settings?.showPastCampaigns &&
          pastCampaigns &&
          pastCampaigns.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-[#3A3941] mb-4">
                Past Campaigns
              </h2>
              <div className="space-y-4">
                {pastCampaigns.map((campaign: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 bg-white rounded-lg border border-border/50 flex items-center justify-between"
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
                          {campaign.performance.impressions?.toLocaleString() || 0}{" "}
                          imp
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
        {mediaKit.settings?.showPricing && creator.rateRange && (
          <>
            <Separator />
            <section>
              <h2 className="text-xl font-bold text-[#3A3941] mb-4">
                Partnership Rates
              </h2>
              <div className="p-6 bg-white rounded-lg border border-border/50 text-center">
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

        {/* Footer */}
        <div className="pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground">
            Powered by{" "}
            <span className="font-semibold text-[#3A3941]">AM Creator Analytics</span>
          </p>
        </div>
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
