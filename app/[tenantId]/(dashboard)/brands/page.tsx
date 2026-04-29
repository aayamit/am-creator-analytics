"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, TrendingUp, Users, DollarSign, BarChart3 } from "lucide-react";

interface Creator {
  id: string;
  name: string;
  niche: string;
  platform: string;
  followers: string;
  engagement: string;
  audienceQuality: number;
  avgViews: string;
  pricing: string;
  image: string | null;
}

export default function BrandDashboard() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchCreators() {
      try {
        const response = await fetch("/api/creators?limit=20");
        const data = await response.json();
        setCreators(data.creators || []);
      } catch (error) {
        console.error("Failed to fetch creators:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCreators();
  }, []);

  const filteredCreators = creators.filter((creator) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      creator.name.toLowerCase().includes(query) ||
      creator.niche?.toLowerCase().includes(query) ||
      creator.platform.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground font-heading">
          Discover Creators
        </h1>
        <p className="text-muted-foreground mt-2">
          Find creators with verified, high-value audiences for your campaigns.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">
                Active Campaigns
              </span>
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
            <span className="text-3xl font-bold text-foreground font-mono">
              3
            </span>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">
                Total Spend
              </span>
              <DollarSign className="h-5 w-5 text-accent" />
            </div>
            <span className="text-3xl font-bold text-foreground font-mono">
              $12.4K
            </span>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">
                Creators Engaged
              </span>
              <Users className="h-5 w-5 text-accent" />
            </div>
            <span className="text-3xl font-bold text-foreground font-mono">
              {creators.length}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search creators by name, niche, or platform..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="shrink-0">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Active Filters */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary" className="bg-accent/10 text-accent">
          Tech
        </Badge>
        <Badge variant="secondary" className="bg-accent/10 text-accent">
          Finance
        </Badge>
        <Badge variant="secondary" className="bg-accent/10 text-accent">
          YouTube
        </Badge>
      </div>

      {/* Creator Cards */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading creators...
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCreators.map((creator) => (
            <Card
              key={creator.id}
              className="border-border hover:border-accent/50 transition-all cursor-pointer group"
            >
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Creator Info */}
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                        {creator.name}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        {creator.niche && (
                          <Badge variant="outline" className="text-xs">
                            {creator.niche}
                          </Badge>
                        )}
                        <span className="text-sm text-muted-foreground">
                          {creator.platform}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-4 gap-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Followers</p>
                      <p className="font-mono font-bold text-foreground">
                        {creator.followers}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Engagement</p>
                      <p className="font-mono font-bold text-accent">
                        {creator.engagement}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Quality</p>
                      <p className="font-mono font-bold text-foreground">
                        {creator.audienceQuality}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Rate</p>
                      <p className="font-mono font-bold text-foreground">
                        {creator.pricing}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <a
                    href={`/brands/creators/${creator.id}`}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "shrink-0"
                    )}
                  >
                    View Profile
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
