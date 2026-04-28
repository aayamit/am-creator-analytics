import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  BarChart3,
  Shield,
  Users,
  FileText,
  Zap,
  Target,
  Globe,
  DollarSign,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import JsonLd from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Market Opportunity | AM Creator Analytics",
  description:
    "Discover the $234B creator economy opportunity. AM Creator Analytics is positioned to capture the fast-growing B2B influencer marketing segment with premium data analytics.",
  keywords: [
    "creator economy",
    "B2B influencer marketing",
    "market opportunity",
    "creator analytics platform",
    "influencer marketing SaaS",
    "creator economy investment",
    "B2B marketing budget",
    "creator data platform",
    "dynamic media kits",
    "real-time analytics",
  ],
  openGraph: {
    title: "Market Opportunity - AM Creator Analytics",
    description:
      "The $234B creator economy is ripe for disruption. See why AM Creator Analytics is the premier B2B solution.",
  },
};

const marketData = {
  tam: {
    value: 234,
    label: "Total Addressable Market",
    description: "Global Creator Economy (2026)",
    growth: "22% CAGR",
  },
  sam: {
    value: 32.6,
    label: "Serviceable Available Market",
    description: "Influencer Marketing Industry (2026)",
    growth: "19x growth past decade",
  },
  som: {
    value: 4.1,
    label: "Serviceable Obtainable Market",
    description: "B2B Influencer Marketing (2026)",
    growth: "47% YoY growth",
  },
};

const problemStats = [
  { value: "40%", label: "Follower estimates are bots/inactive" },
  { value: "72h", label: "Static PDF kit becomes outdated" },
  { value: "63%", label: "Campaigns lack proper attribution" },
  { value: "$312K", label: "Avg. B2B annual influencer budget" },
];

const solutions = [
  {
    icon: FileText,
    title: "Dynamic Media Kits",
    description:
      "Replace static PDFs with live, API-connected dashboards that update automatically as metrics grow.",
    metric: "Real-time sync",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description:
      "Bloomberg Terminal precision for creator data. Track spend pacing, conversions, and attribution instantly.",
    metric: "Live dashboards",
  },
  {
    icon: Shield,
    title: "Fraud Detection",
    description:
      "Proprietary algorithms flag suspicious follower patterns, engagement manipulation, and bot networks.",
    metric: "95% accuracy",
  },
  {
    icon: Users,
    title: "Creator Discovery",
    description:
      "Find creators with verified, high-value audiences. Filter by niche, platform, demographics, and authenticity scores.",
    metric: "Lookalike AI",
  },
];

const platforms = [
  { name: "YouTube", color: "bg-red-500" },
  { name: "LinkedIn", color: "bg-blue-600" },
  { name: "Instagram", color: "bg-pink-500" },
  { name: "TikTok", color: "bg-black" },
  { name: "Twitter", color: "bg-sky-400" },
  { name: "Facebook", color: "bg-blue-800" },
];

const tractionPoints = [
  {
    title: "MVP Complete",
    description:
      "Fully functional Next.js SaaS with PostgreSQL, Prisma, NextAuth, and real-time notifications.",
  },
  {
    title: "Campaign Management",
    description:
      "End-to-end workflow from creator discovery to payment, with multi-step campaign creation.",
  },
  {
    title: "Dynamic Media Kits",
    description:
      "Auto-updating creator dashboards with OAuth integration for YouTube, LinkedIn, and more.",
  },
  {
    title: "Real-Time Notifications",
    description:
      "SSE-powered notification system for instant campaign updates and creator invites.",
  },
  {
    title: "SEO-Ready Marketing Site",
    description:
      "Complete page structure with metadata, structured data, sitemap, and robots.txt for organic growth.",
  },
  {
    title: "Scalable Architecture",
    description:
      "Next.js 15 App Router, TypeScript, Tailwind CSS, shadcn/ui — built for enterprise scale.",
  },
];

const marketSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Market Opportunity - AM Creator Analytics",
  description:
    "The $234B creator economy market opportunity for B2B influencer marketing analytics.",
  publisher: {
    "@type": "Organization",
    name: "AM Creator Analytics",
  },
  mainContentOfPage: {
    "@type": "WebPageElement",
    cssSelector: ".market-content",
  },
};

export default function MarketOpportunityPage() {
  return (
    <main className="min-h-screen bg-background">
      <JsonLd data={marketSchema} />

      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
              <TrendingUp className="h-4 w-4" />
              <span>2026 Market Research Data</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground font-heading mb-6">
              The <span className="text-accent">$234 Billion</span> Opportunity
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-10">
              The creator economy has evolved into a sophisticated, highly
              financialized pillar of global commerce. AM Creator Analytics is positioned
              to capture the fastest-growing segment: B2B influencer marketing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-medium px-8 h-12 text-base"
              >
                <a href="/pricing">View Pricing</a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="font-medium px-8 h-12 text-base border-2"
              >
                <a href="/contact?type=sales">Contact Sales</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Market Sizing - TAM/SAM/SOM */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground font-heading text-center mb-4">
              Market Sizing & Economics
            </h2>
            <p className="text-lg text-muted-foreground text-center mb-16">
              Rigorously quantified opportunity across Total, Serviceable, and
              Obtainable markets.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  ...marketData.tam,
                  color: "bg-accent/10 border-accent/30",
                  textColor: "text-accent",
                },
                {
                  ...marketData.sam,
                  color: "bg-primary/10 border-primary/30",
                  textColor: "text-primary",
                },
                {
                  ...marketData.som,
                  color: "bg-green-500/10 border-green-500/30",
                  textColor: "text-green-600",
                },
              ].map((market, index) => (
                <Card
                  key={index}
                  className={`p-8 border-border/50 ${market.color} text-center`}
                >
                  <div
                    className={`text-4xl md:text-5xl font-bold font-mono ${market.textColor} mb-2`}
                  >
                    ${market.value}B
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {market.label}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {market.description}
                  </p>
                  <Badge variant="outline" className="font-mono text-xs">
                    {market.growth}
                  </Badge>
                </Card>
              ))}
            </div>

            {/* Market Context */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-6 border-border/50 bg-card">
                <h3 className="font-semibold text-foreground mb-4 flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-accent" />
                  <span>B2B Budget Allocation</span>
                </h3>
                <div className="space-y-4">
                  {[
                    { label: "Marketing budgets to influencer", value: 15, max: 25 },
                    { label: "YoY budget increase", value: 58, max: 100 },
                    { label: "Marketers using influencer campaigns", value: 86, max: 100 },
                    { label: "B2B depts with dedicated budgets", value: 89, max: 100 },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">
                          {item.label}
                        </span>
                        <span className="font-mono text-foreground">
                          {item.value}%
                        </span>
                      </div>
                      <Progress value={item.value} max={item.max} />
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 border-border/50 bg-card">
                <h3 className="font-semibold text-foreground mb-4 flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-accent" />
                  <span>Market Penetration</span>
                </h3>
                <div className="space-y-4">
                  {[
                    { label: "B2B influencer spend (2026)", value: "$4.1B" },
                    { label: "Avg. annual B2B budget", value: "$312K" },
                    { label: "YoY B2B growth rate", value: "47%" },
                    { label: "CAGR (creator economy)", value: "22%" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between py-2 border-b border-border/50 last:border-0"
                    >
                      <span className="text-sm text-muted-foreground">
                        {item.label}
                      </span>
                      <span className="text-sm font-mono font-medium text-foreground">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="border-t border-border bg-muted/30 py-24 md:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground font-heading mb-4">
              The Vanity Metric Trap
            </h2>
            <p className="text-lg text-muted-foreground mb-16">
              Traditional influencer marketing relies on superficial metrics that
              don't drive business results. Brands are wasting millions on fake
              followers and static PDFs.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {problemStats.map((stat, index) => (
                <Card key={index} className="p-6 border-border/50 bg-card">
                  <div className="text-3xl font-bold text-accent font-mono mb-2">
                    {stat.value}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Solution */}
      <section className="border-t border-border py-24 md:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground font-heading text-center mb-4">
              Our Solution
            </h2>
            <p className="text-lg text-muted-foreground text-center mb-16">
              Move beyond vanity metrics with a premium data platform that delivers
              authentic insights for brands and creators.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {solutions.map((solution, index) => (
                <Card
                  key={index}
                  className="p-8 border-border/50 bg-card hover:border-accent/50 transition-colors"
                >
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <solution.icon className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-foreground">
                          {solution.title}
                        </h3>
                        <Badge variant="outline" className="font-mono text-xs">
                          {solution.metric}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {solution.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What We Support */}
      <section className="border-t border-border bg-muted/30 py-24 md:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground font-heading mb-4">
              Platforms We Support
            </h2>
            <p className="text-lg text-muted-foreground mb-12">
              OAuth integrations with all major creator platforms. Secure,
              automated, and always up-to-date.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              {platforms.map((platform) => (
                <div
                  key={platform.name}
                  className={`px-6 py-3 rounded-lg text-white font-medium ${platform.color}`}
                >
                  {platform.name}
                </div>
              ))}
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Secure OAuth",
                  description: "Tokens encrypted at rest, never shared",
                },
                {
                  title: "Auto Daily Syncs",
                  description: "Metrics update automatically every 24h",
                },
                {
                  title: "Multi-Account",
                  description: "Connect unlimited channels per creator",
                },
              ].map((feature, i) => (
                <Card key={i} className="p-6 border-border/50 bg-card">
                  <CheckCircle className="h-6 w-6 text-accent mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground text-center mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground text-center">
                    {feature.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Traction / What We've Built */}
      <section className="border-t border-border py-24 md:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground font-heading text-center mb-4">
              What We've Built
            </h2>
            <p className="text-lg text-muted-foreground text-center mb-16">
              A complete, production-ready SaaS platform with enterprise-grade
              features.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tractionPoints.map((point, index) => (
                <Card
                  key={index}
                  className="p-6 border-border/50 bg-card hover:border-accent/50 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        {point.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {point.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-muted/30 py-24 md:py-32">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground font-heading mb-6">
            Ready to Join the Revolution?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Whether you're an investor looking for the next big opportunity or a
            brand ready to transform your creator marketing strategy — we'd love
            to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-medium px-8 h-12 text-base"
            >
              <a href="/contact?type=sales">
                Contact Sales
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="font-medium px-8 h-12 text-base border-2"
            >
              <a href="/features">Explore Features</a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
