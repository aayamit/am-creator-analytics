import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, BarChart3, Code, Database, Zap } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:48px_48px]" />
      
      <div className="container mx-auto px-6 lg:px-8 pt-32 pb-40 md:pt-40 md:pb-48 relative">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-accent/10 text-accent px-4 py-1.5 rounded-full text-sm font-medium mb-8">
            <TrendingUp className="h-4 w-4" />
            <span>Open-Source CRM Integration via Nango</span>
          </div>

          {/* Main Headline - Nango style: bold, large, clear */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-foreground font-heading mb-8 leading-[1.1]">
            Premium Creator<br />
            <span className="text-accent">Analytics Platform</span>
          </h1>

          {/* Value Prop - Clear, concise, like Nango's "Connect your product & AI agents" */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
            Replace static PDF media kits with <strong className="text-foreground">real-time, API-connected dashboards</strong>. 
            Track authentic engagement, eliminate vanity metrics, and prove your audience value.
          </p>

          {/* CTAs - Nango style: primary + secondary with clear labels */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              asChild
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-medium px-10 h-14 text-lg"
            >
              <Link href="/api/auth/signin?role=brand">
                Start Brand Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="font-medium px-10 h-14 text-lg border-2"
            >
              <Link href="/api/auth/signin?role=creator">
                Create Creator Account
              </Link>
            </Button>
          </div>

          {/* Trust Indicators - Nango style: prominent stats */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-12 border-t border-border/50">
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <BarChart3 className="h-6 w-6 text-accent mr-2" />
                <span className="text-3xl md:text-4xl font-bold text-foreground font-mono">
                  500+
                </span>
              </div>
              <p className="text-sm text-muted-foreground font-medium">Premium Creators</p>
            </div>
            <div className="text-center border-x border-border/50">
              <div className="flex items-center justify-center mb-3">
                <Database className="h-6 w-6 text-accent mr-2" />
                <span className="text-3xl md:text-4xl font-bold text-foreground font-mono">
                  $2M+
                </span>
              </div>
              <p className="text-sm text-muted-foreground font-medium">Campaign Spend</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <Zap className="h-6 w-6 text-accent mr-2" />
                <span className="text-3xl md:text-4xl font-bold text-foreground font-mono">
                  98%
                </span>
              </div>
              <p className="text-sm text-muted-foreground font-medium">Client Retention</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
