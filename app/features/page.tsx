import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  BarChart3,
  Users,
  FileText,
  Shield,
  Zap,
  TrendingUp,
  Link2,
  Bell,
  Target,
  Globe,
} from "lucide-react";
import JsonLd from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Features | AM Creator Analytics",
  description:
    "Explore AM Creator Analytics features: real-time analytics, dynamic media kits, fraud detection, campaign ROI tracking, and authentic creator discovery.",
  openGraph: {
    title: "Features - AM Creator Analytics",
    description:
      "Real-time analytics, dynamic media kits, fraud detection, and more.",
  },
};

const brandFeatures = [
  {
    icon: Users,
    title: "Deep Creator Discovery",
    description:
      "Find creators with verified, high-value audiences. Filter by niche, platform, audience demographics, and authenticity scores.",
    benefits: [
      "Lookalike audience matching",
      "Fraud detection scoring",
      "Income bracket filtering",
      "Professional interest mapping",
    ],
  },
  {
    icon: BarChart3,
    title: "Real-Time Campaign ROI",
    description:
      "Track spend pacing, conversions, and attribution with Bloomberg-terminal precision. Know exactly what's working.",
    benefits: [
      "Live budget tracking",
      "Conversion attribution",
      "Custom ROI dashboards",
      "Exportable reports",
    ],
  },
  {
    icon: Shield,
    title: "Fraud Detection Engine",
    description:
      "Proprietary algorithm flags suspicious follower patterns, engagement manipulation, and bot networks automatically.",
    benefits: [
      "Bot detection algorithms",
      "Engagement authenticity scores",
      "Historical trend analysis",
      "Risk assessment reports",
    ],
  },
  {
    icon: Target,
    title: "Campaign Management",
    description:
      "End-to-end campaign workflow from discovery to payment. Manage creators, deliverables, and budgets in one place.",
    benefits: [
      "Multi-creator campaigns",
      "Milestone tracking",
      "Automated payments",
      "Performance analytics",
    ],
  },
];

const creatorFeatures = [
  {
    icon: FileText,
    title: "Dynamic Media Kits",
    description:
      "Replace static PDFs with live, API-connected dashboards that update automatically as your metrics grow.",
    benefits: [
      "Auto-syncs with platforms",
      "Custom branding options",
      "Shareable public links",
      "Embeddable widgets",
    ],
  },
  {
    icon: TrendingUp,
    title: "Cross-Platform Analytics",
    description:
      "Unified dashboard showing performance across YouTube, LinkedIn, Instagram, and more — all in one view.",
    benefits: [
      "Multi-platform aggregation",
      "Audience quality scoring",
      "Growth trend analysis",
      "Benchmark comparisons",
    ],
  },
  {
    icon: Zap,
    title: "Pricing Calculator",
    description:
      "Data-driven rate suggestions based on CPM, CPE benchmarks from your specific niche and audience quality.",
    benefits: [
      "Niche-specific benchmarks",
      "Audience value scoring",
      "Rate negotiation insights",
      "Historical pricing trends",
    ],
  },
  {
    icon: Link2,
    title: "OAuth Integrations",
    description:
      "Connect YouTube, LinkedIn, and other platforms via secure OAuth. Your data stays fresh without manual updates.",
    benefits: [
      "One-click connections",
      "Secure token storage",
      "Automatic daily syncs",
      "Multi-account support",
    ],
  },
];

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "AM Creator Analytics",
  operatingSystem: "Web",
  applicationCategory: "BusinessApplication",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Creator discovery with fraud detection",
    "Real-time campaign ROI tracking",
    "Dynamic media kit generation",
    "Cross-platform analytics",
    "Audience demographics analysis",
    "Automated payment processing",
  ],
  screenshot: "https://amcreatoranalytics.com/screenshots/dashboard.jpg",
  softwareHelp: {
    "@type": "CreativeWork",
    url: "https://amcreatoranalytics.com/help",
  },
};

function FeatureCard({ feature, index }: { feature: any; index: number }) {
  return (
    <Card className="p-8 border-border/50 bg-card hover:border-accent/50 transition-colors">
      <div className="flex items-start space-x-4 mb-6">
        <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
          <feature.icon className="h-6 w-6 text-accent" />
        </div>
        <div>
          <span className="text-sm font-mono text-accent">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="text-xl font-semibold text-foreground mt-1">
            {feature.title}
          </h3>
        </div>
      </div>
      <p className="text-muted-foreground leading-relaxed mb-6">
        {feature.description}
      </p>
      <ul className="space-y-2">
        {feature.benefits.map((benefit: string, i: number) => (
          <li key={i} className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0" />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-background">
      <JsonLd data={softwareSchema} />

      {/* Hero Section */}
      <section className="border-b border-border">
        <div className="container mx-auto px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground font-heading mb-6">
              Features Built for Results
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Every feature is designed to eliminate vanity metrics and focus on
              what drives real business outcomes.
            </p>
          </div>
        </div>
      </section>

      {/* Brand Features */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground font-heading mb-4">
                For Brands
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover authentic creators, track real ROI, and eliminate
                wasteful spending.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {brandFeatures.map((feature, index) => (
                <FeatureCard key={index} feature={feature} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Creator Features */}
      <section className="border-t border-border bg-muted/30 py-24 md:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground font-heading mb-4">
                For Creators
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Prove your value with data, secure premium partnerships, and
                grow your audience strategically.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {creatorFeatures.map((feature, index) => (
                <FeatureCard key={index} feature={feature} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="border-t border-border py-24 md:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Globe className="h-12 w-12 text-accent mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-foreground font-heading mb-4">
              Integrations That Just Work
            </h2>
            <p className="text-lg text-muted-foreground mb-12">
              Connect your favorite platforms with secure OAuth. Data syncs
              automatically.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {["YouTube", "LinkedIn", "Instagram", "TikTok", "Twitter"].map(
                (platform) => (
                  <div
                    key={platform}
                    className="px-6 py-3 bg-card border border-border/50 rounded-lg text-foreground font-medium"
                  >
                    {platform}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-muted/30 py-24 md:py-32">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground font-heading mb-6">
            Ready to See It in Action?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Start your free trial today. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-medium px-8 h-12 text-base"
            >
              <a href="/api/auth/signin?role=brand">Start Brand Trial</a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="font-medium px-8 h-12 text-base border-2"
            >
              <a href="/api/auth/signin?role=creator">Create Creator Account</a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
