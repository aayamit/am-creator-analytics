"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  DollarSign,
  Users,
  FileText,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Creator {
  id: string;
  name: string;
  platform: string;
  followers: string;
  engagement: string;
  pricing: string;
}

export default function CreateCampaignPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [campaignData, setCampaignData] = useState({
    title: "",
    description: "",
    budget: "",
    startDate: "",
    endDate: "",
    objectives: [] as string[],
    selectedCreators: [] as Creator[],
  });

  const toggleObjective = (obj: string) => {
    setCampaignData((prev) => ({
      ...prev,
      objectives: prev.objectives.includes(obj)
        ? prev.objectives.filter((o) => o !== obj)
        : [...prev.objectives, obj],
    }));
  };

  const handleCreate = async () => {
    try {
      const response = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: campaignData.title,
          description: campaignData.description,
          budget: parseFloat(campaignData.budget),
          startDate: campaignData.startDate,
          endDate: campaignData.endDate,
          objectives: campaignData.objectives,
          creatorIds: campaignData.selectedCreators.map((c) => c.id),
        }),
      });

      if (response.ok) {
        router.push("/brands/campaigns");
      }
    } catch (error) {
      console.error("Failed to create campaign:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground font-heading">
          Create New Campaign
        </h1>
        <p className="text-muted-foreground mt-2">
          Set up your campaign in 3 simple steps
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4">
        {["Basics", "Objectives", "Creators", "Review"].map((label, i) => (
          <div key={label} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step > i + 1
                  ? "bg-accent text-accent-foreground"
                  : step === i + 1
                  ? "border-2 border-accent text-accent"
                  : "border-2 border-muted text-muted-foreground"
              }`}
            >
              {step > i + 1 ? "✓" : i + 1}
            </div>
            {i < 3 && (
              <ChevronRight className="w-4 h-4 text-muted-foreground mx-2" />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Campaign Basics */}
      {step === 1 && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-accent" />
              <span>Campaign Basics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="title">Campaign Title</Label>
              <Input
                id="title"
                placeholder="e.g., Summer SaaS Launch"
                value={campaignData.title}
                onChange={(e) =>
                  setCampaignData((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your campaign goals and deliverables..."
                value={campaignData.description}
                onChange={(e) =>
                  setCampaignData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={4}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="budget">Budget ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="budget"
                    type="number"
                    placeholder="12000"
                    className="pl-10"
                    value={campaignData.budget}
                    onChange={(e) =>
                      setCampaignData((prev) => ({
                        ...prev,
                        budget: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div>
                <Label>Timeline</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="date"
                      className="pl-10"
                      value={campaignData.startDate}
                      onChange={(e) =>
                        setCampaignData((prev) => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="date"
                      className="pl-10"
                      value={campaignData.endDate}
                      onChange={(e) =>
                        setCampaignData((prev) => ({
                          ...prev,
                          endDate: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => setStep(2)}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Next Step
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Objectives */}
      {step === 2 && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-accent" />
              <span>Campaign Objectives</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Select all that apply to your campaign:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Brand Awareness",
                "Lead Generation",
                "Sales Conversion",
                "Product Launch",
                "Content Creation",
                "Community Engagement",
              ].map((obj) => (
                <button
                  key={obj}
                  type="button"
                  onClick={() => toggleObjective(obj)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    campaignData.objectives.includes(obj)
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-accent/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{obj}</span>
                    {campaignData.objectives.includes(obj) && (
                      <Badge className="bg-accent/10 text-accent">
                        Selected
                      </Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Next Step
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Select Creators */}
      {step === 3 && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-accent" />
              <span>Select Creators</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search */}
            <Input placeholder="Search creators..." className="max-w-sm" />

            {/* Selected Creators */}
            {campaignData.selectedCreators.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">
                  Selected ({campaignData.selectedCreators.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {campaignData.selectedCreators.map((creator) => (
                    <Badge
                      key={creator.id}
                      variant="secondary"
                      className="bg-accent/10 text-accent pl-3 pr-1 py-1.5"
                    >
                      {creator.name}
                      <button
                        onClick={() =>
                          setCampaignData((prev) => ({
                            ...prev,
                            selectedCreators: prev.selectedCreators.filter(
                              (c) => c.id !== creator.id
                            ),
                          }))
                        }
                        className="ml-2 hover:text-red-500"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Creator List (Mock for now, will connect to API) */}
            <div className="space-y-3">
              {[
                {
                  id: "creator-1",
                  name: "Alex Tech",
                  platform: "YouTube",
                  followers: "26.8K",
                  engagement: "5.8%",
                  pricing: "$2,400",
                },
                {
                  id: "creator-2",
                  name: "Finance Guru",
                  platform: "LinkedIn",
                  followers: "128K",
                  engagement: "6.2%",
                  pricing: "$1,800",
                },
              ].map((creator) => (
                <div
                  key={creator.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    campaignData.selectedCreators.some((c) => c.id === creator.id)
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-accent/50"
                  }`}
                  onClick={() => {
                    setCampaignData((prev) => {
                      const exists = prev.selectedCreators.some(
                        (c) => c.id === creator.id
                      );
                      return {
                        ...prev,
                        selectedCreators: exists
                          ? prev.selectedCreators.filter((c) => c.id !== creator.id)
                          : [...prev.selectedCreators, creator],
                      };
                    });
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">
                          {creator.name}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {creator.platform}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <p className="font-mono font-bold text-foreground">
                          {creator.followers}
                        </p>
                        <p className="text-muted-foreground">Followers</p>
                      </div>
                      <div className="text-center">
                        <p className="font-mono font-bold text-accent">
                          {creator.engagement}
                        </p>
                        <p className="text-muted-foreground">Engagement</p>
                      </div>
                      <div className="text-center">
                        <p className="font-mono font-bold text-foreground">
                          {creator.pricing}
                        </p>
                        <p className="text-muted-foreground">Rate</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button
                onClick={() => setStep(4)}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                disabled={campaignData.selectedCreators.length === 0}
              >
                Next Step
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Review & Create */}
      {step === 4 && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Review Campaign</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Campaign Details
                </h4>
                <div className="mt-2 space-y-2">
                  <p className="text-foreground">
                    <strong>Title:</strong> {campaignData.title}
                  </p>
                  <p className="text-foreground">
                    <strong>Budget:</strong> ${campaignData.budget}
                  </p>
                  <p className="text-foreground">
                    <strong>Duration:</strong> {campaignData.startDate} to{" "}
                    {campaignData.endDate}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Objectives
                </h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {campaignData.objectives.map((obj) => (
                    <Badge key={obj} className="bg-accent/10 text-accent">
                      {obj}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Selected Creators ({campaignData.selectedCreators.length})
                </h4>
                <div className="mt-2 space-y-2">
                  {campaignData.selectedCreators.map((creator) => (
                    <div
                      key={creator.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <span className="font-medium text-foreground">
                        {creator.name}
                      </span>
                      <span className="text-muted-foreground">
                        {creator.platform}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(3)}>
                Back
              </Button>
              <Button
                onClick={handleCreate}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Create Campaign
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
