import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, HelpCircle } from "lucide-react";
import JsonLd from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Pricing | AM Creator Analytics",
  description:
    "Transparent pricing for brands and creators. Free tier available. Scale your creator marketing with premium analytics and authentic partnership tools.",
  openGraph: {
    title: "Pricing - AM Creator Analytics",
    description: "Transparent pricing for brands and creators. Free tier available.",
  },
};

const brandPlans = [
  {
    name: "Starter",
    description: "For brands testing the waters",
    price: "$0",
    period: "forever",
    features: [
      { name: "Up to 5 creator discoveries", included: true },
      { name: "Basic audience demographics", included: true },
      { name: "1 active campaign", included: true },
      { name: "Email support", included: true },
      { name: "Advanced fraud detection", included: false },
      { name: "API access", included: false },
      { name: "Dedicated account manager", included: false },
    ],
    cta: "Start Free",
    href: "/api/auth/signin?role=brand",
    featured: false,
  },
  {
    name: "Professional",
    description: "For growing brand teams",
    price: "$299",
    period: "per month",
    features: [
      { name: "Unlimited creator discoveries", included: true },
      { name: "Deep audience demographics", included: true },
      { name: "Up to 10 active campaigns", included: true },
      { name: "Priority support", included: true },
      { name: "Advanced fraud detection", included: true },
      { name: "API access", included: true },
      { name: "Dedicated account manager", included: false },
    ],
    cta: "Start Free Trial",
    href: "/api/auth/signin?role=brand",
    featured: true,
  },
  {
    name: "Enterprise",
    description: "For large-scale operations",
    price: "Custom",
    period: "tailored pricing",
    features: [
      { name: "Unlimited everything", included: true },
      { name: "Custom audience insights", included: true },
      { name: "Unlimited campaigns", included: true },
      { name: "24/7 phone support", included: true },
      { name: "White-glove onboarding", included: true },
      { name: "Full API + webhooks", included: true },
      { name: "Dedicated account manager", included: true },
    ],
    cta: "Contact Sales",
    href: "/contact?type=enterprise",
    featured: false,
  },
];

const creatorPlans = [
  {
    name: "Creator Free",
    description: "Showcase your value",
    price: "$0",
    period: "forever",
    features: [
      { name: "1 dynamic media kit", included: true },
      { name: "Basic analytics dashboard", included: true },
      { name: "Up to 3 social accounts", included: true },
      { name: "Community support", included: true },
      { name: "Pricing calculator", included: false },
      { name: "Brand discovery visibility", included: false },
      { name: "Priority verification", included: false },
    ],
    cta: "Create Free Account",
    href: "/api/auth/signin?role=creator",
    featured: false,
  },
  {
    name: "Creator Pro",
    description: "Maximize your partnerships",
    price: "$29",
    period: "per month",
    features: [
      { name: "Unlimited media kits", included: true },
      { name: "Advanced analytics + benchmarks", included: true },
      { name: "Unlimited social accounts", included: true },
      { name: "Priority support", included: true },
      { name: "Pricing calculator", included: true },
      { name: "Brand discovery visibility", included: true },
      { name: "Priority verification", included: false },
    ],
    cta: "Start Free Trial",
    href: "/api/auth/signin?role=creator",
    featured: true,
  },
  {
    name: "Creator Elite",
    description: "For top-tier creators",
    price: "$99",
    period: "per month",
    features: [
      { name: "Everything in Pro", included: true },
      { name: "Custom branding on media kits", included: true },
      { name: "Direct brand introductions", included: true },
      { name: "1:1 strategy session", included: true },
      { name: "Early access to features", included: true },
      { name: "Revenue share opportunities", included: true },
      { name: "Priority verification badge", included: true },
    ],
    cta: "Go Elite",
    href: "/api/auth/signin?role=creator",
    featured: false,
  },
];

const pricingSchema = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  name: "AM Creator Analytics Pricing",
  itemListElement: [
    {
      "@type": "Offer",
      name: "Starter Plan",
      price: "0",
      priceCurrency: "USD",
      description: "Free tier for brands testing the platform",
    },
    {
      "@type": "Offer",
      name: "Professional Plan",
      price: "299",
      priceCurrency: "USD",
      description: "Professional tier for growing brand teams",
    },
    {
      "@type": "Offer",
      name: "Creator Free Plan",
      price: "0",
      priceCurrency: "USD",
      description: "Free tier for creators to showcase value",
    },
    {
      "@type": "Offer",
      name: "Creator Pro Plan",
      price: "29",
      priceCurrency: "USD",
      description: "Pro tier for creators maximizing partnerships",
    },
  ],
};

function PricingCard({ plan }: { plan: any }) {
  return (
    <Card
      className={`p-8 relative ${
        plan.featured
          ? "border-accent bg-accent/5 overflow-visible"
          : "bg-card border-border/50"
      }`}
    >
      {plan.featured && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground">
          Most Popular
        </Badge>
      )}
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
        <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
        <div className="text-4xl font-bold text-foreground font-mono">
          {plan.price}
          {plan.period !== "forever" && plan.period !== "tailored pricing" && (
            <span className="text-base font-normal text-muted-foreground">
              /mo
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">{plan.period}</p>
      </div>

      <ul className="space-y-3 mb-8">
        {plan.features.map((feature: any, index: number) => (
          <li key={index} className="flex items-start space-x-3">
            {feature.included ? (
              <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
            ) : (
              <X className="h-5 w-5 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
            )}
            <span
              className={`text-sm ${
                feature.included
                  ? "text-foreground"
                  : "text-muted-foreground/50 line-through"
              }`}
            >
              {feature.name}
            </span>
          </li>
        ))}
      </ul>

      <Button
        asChild
        className={`w-full ${
          plan.featured
            ? "bg-accent text-accent-foreground hover:bg-accent/90"
            : ""
        }`}
        variant={plan.featured ? "default" : "outline"}
      >
        <a href={plan.href}>{plan.cta}</a>
      </Button>
    </Card>
  );
}

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background">
      <JsonLd data={pricingSchema} />

      {/* Hero Section */}
      <section className="border-b border-border">
        <div className="container mx-auto px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground font-heading mb-6">
              Transparent Pricing for Every Scale
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              No hidden fees, no vanity traps. Choose the plan that fits your
              goals — from testing the waters to enterprise-scale operations.
            </p>
          </div>
        </div>
      </section>

      {/* Brand Plans */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground font-heading text-center mb-4">
              For Brands
            </h2>
            <p className="text-lg text-muted-foreground text-center mb-16">
              Discover authentic creators and track real campaign ROI
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {brandPlans.map((plan, index) => (
                <PricingCard key={index} plan={plan} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Creator Plans */}
      <section className="border-t border-border bg-muted/30 py-24 md:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground font-heading text-center mb-4">
              For Creators
            </h2>
            <p className="text-lg text-muted-foreground text-center mb-16">
              Showcase your true value with dynamic media kits
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {creatorPlans.map((plan, index) => (
                <PricingCard key={index} plan={plan} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t border-border py-24 md:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground font-heading text-center mb-16">
              Frequently Asked Questions
            </h2>
            <div className="space-y-8">
              {[
                {
                  question: "Can I switch plans anytime?",
                  answer:
                    "Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of the next billing cycle.",
                },
                {
                  question: "What payment methods do you accept?",
                  answer:
                    "We accept all major credit cards, PayPal, and wire transfers for Enterprise plans.",
                },
                {
                  question: "Is there a free trial for paid plans?",
                  answer:
                    "Yes, all paid plans come with a 14-day free trial. No credit card required to start.",
                },
                {
                  question: "How does the fraud detection work?",
                  answer:
                    "Our proprietary algorithm analyzes follower patterns, engagement quality, and audience authenticity to flag suspicious activity.",
                },
              ].map((faq, index) => (
                <div key={index} className="border-b border-border pb-8 last:border-0">
                  <h3 className="text-lg font-semibold text-foreground mb-3 flex items-start space-x-2">
                    <HelpCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>{faq.question}</span>
                  </h3>
                  <p className="text-muted-foreground leading-relaxed ml-7">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-muted/30 py-24 md:py-32">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground font-heading mb-6">
            Ready to Move Beyond Vanity Metrics?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Join the brands and creators who've transformed their strategy with
            data-driven insights.
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
