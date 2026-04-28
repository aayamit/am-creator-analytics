import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BarChart3, Target, Shield, TrendingUp } from "lucide-react";
import JsonLd from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "About Us | AM Creator Analytics",
  description:
    "Learn about AM Creator Analytics - our mission to transform creator marketing by eliminating vanity metrics and providing authentic, data-driven insights for brands and creators.",
  openGraph: {
    title: "About AM Creator Analytics",
    description:
      "Transforming creator marketing with authentic data. Move beyond vanity metrics.",
  },
};

const teamMembers = [
  {
    name: "Amit Kumar",
    role: "Founder & CEO",
    bio: "Former semiconductor presales consultant turned entrepreneur. Building tools that bridge the gap between creators and brands with data integrity.",
    image: "/team/amit.jpg",
  },
  // Add more team members as needed
];

const values = [
  {
    icon: BarChart3,
    title: "Data Integrity",
    description:
      "We believe in the truth of numbers. No inflated metrics, no vanity traps - just authentic data that drives real business decisions.",
  },
  {
    icon: Target,
    title: "Precision Focus",
    description:
      "Like a Bloomberg Terminal for creator analytics, we provide the exact metrics that matter for ROI-driven marketing campaigns.",
  },
  {
    icon: Shield,
    title: "Transparency",
    description:
      "Open algorithms, clear methodology, and honest reporting. We never hide how we calculate audience quality scores.",
  },
  {
    icon: TrendingUp,
    title: "Growth Partnership",
    description:
      "We succeed when our brands and creators succeed. Our platform is designed to foster long-term, mutually beneficial partnerships.",
  },
];

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AM Creator Analytics",
  url: "https://amcreatoranalytics.com/about",
  description:
    "Premium creator data platform eliminating vanity metrics for brands and creators.",
  founder: {
    "@type": "Person",
    name: "Amit Kumar",
  },
  foundingDate: "2025",
  industry: "SaaS / Creator Economy",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <JsonLd data={organizationSchema} />

      {/* Hero Section */}
      <section className="border-b border-border">
        <div className="container mx-auto px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground font-heading mb-6">
              Beyond Vanity Metrics
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We're on a mission to transform creator marketing by eliminating
              fake followers, static PDFs, and superficial engagement. Welcome to
              data-driven partnerships.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground font-heading mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    AM Creator Analytics was born from a simple observation: brands
                    were wasting millions on creators with fake followers, while
                    authentic creators struggled to prove their true value.
                  </p>
                  <p>
                    Traditional influencer marketing relies on vanity metrics —
                    follower counts, likes, and superficial engagement that don't
                    translate to business results. We built a platform that cuts
                    through the noise.
                  </p>
                  <p>
                    Our dynamic media kits, real-time analytics, and audience
                    quality scoring give both brands and creators the transparency
                    they need for authentic partnerships.
                  </p>
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-8">
                <div className="text-center space-y-6">
                  <div className="text-5xl font-bold text-accent font-mono">
                    40%
                  </div>
                  <p className="text-muted-foreground">
                    of followers on major platforms are estimated to be bots or
                    inactive accounts
                  </p>
                  <div className="border-t border-border pt-6">
                    <div className="text-5xl font-bold text-accent font-mono">
                      72h
                    </div>
                    <p className="text-muted-foreground">
                      average time for a static PDF media kit to become outdated
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="border-t border-border bg-muted/30 py-24 md:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground font-heading text-center mb-16">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <Card
                  key={index}
                  className="p-6 border-border/50 bg-card hover:border-accent/50 transition-colors"
                >
                  <div className="flex space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <value.icon className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {value.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="border-t border-border py-24 md:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground font-heading text-center mb-16">
              Leadership Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <Card
                  key={index}
                  className="p-6 border-border/50 bg-card text-center"
                >
                  <div className="w-24 h-24 rounded-full bg-accent/10 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-accent">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm text-accent mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {member.bio}
                  </p>
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
            Join the Data Revolution
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Whether you're a brand seeking authentic partnerships or a creator
            ready to showcase your true value — we're here to transform how you
            measure success.
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
