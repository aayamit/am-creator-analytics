import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing | AM Creator Analytics",
  description:
    "Explore early-access pricing for brands, agencies, and creators using AM Creator Analytics.",
};

const brandPlans = [
  {
    name: "Starter",
    price: "₹4,999",
    cadence: "/month",
    description: "For pilot teams that want structure before campaign volume scales.",
    features: [
      "Creator campaign workspace for early pilots",
      "Shortlists, briefs, and approval workflows",
      "Founding partner onboarding support",
    ],
  },
  {
    name: "Growth",
    price: "₹19,999",
    cadence: "/month",
    description: "For in-house growth teams building repeatable creator programs.",
    features: [
      "Campaign CRM across multiple briefs",
      "Contracts, usage-rights tracking, and payout records",
      "Attribution and ROI reporting for performance-led campaigns",
    ],
    featured: true,
  },
  {
    name: "Scale",
    price: "₹49,999",
    cadence: "/month",
    description: "For brands running creator programs across teams, geographies, or business units.",
    features: [
      "Deeper workflow standardization and reporting layers",
      "Stronger finance and compliance visibility",
      "Priority support for rollout planning",
    ],
  },
  {
    name: "Enterprise / Agency",
    price: "Custom",
    cadence: "",
    description: "For agencies, large operators, and complex rollout requirements.",
    features: [
      "Custom workflow design and onboarding",
      "Agency and multi-team operating models",
      "Commercial terms aligned to rollout scope",
    ],
  },
];

const creatorPlans = [
  {
    name: "Free",
    description: "For creators joining the founding network and setting up a verified presence.",
    features: [
      "Basic profile and free media kit",
      "Apply to briefs during early access",
      "Visibility into contracts and payment tracking",
    ],
  },
  {
    name: "Creator Pro",
    description: "Coming soon for creators who want richer profile, pricing, and workflow tools.",
    features: [
      "Advanced media kit upgrades",
      "More workflow and pricing utilities",
      "Founding creators get early access first",
    ],
  },
  {
    name: "Creator Elite",
    description: "Coming soon for high-intent creators who want a premium operating layer.",
    features: [
      "Expanded profile and portfolio tooling",
      "Higher-touch workflow support",
      "Early roadmap access for founding creators",
    ],
  },
];

export default function PricingPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center lg:px-8 lg:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#92400e]">
            Pricing
          </p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
            Pricing for teams building creator programs with real operating
            ownership.
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            AM Creator Analytics is still in early access. Founding partner
            pricing is available for brands, agencies, and D2C teams that want
            to help shape the product while running live creator workflows.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#92400e] px-5 py-3 text-sm font-semibold text-white no-underline shadow-sm transition hover:bg-[#7c360c] hover:no-underline"
            >
              Book a Demo
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/marketing#founding-partners"
              className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground no-underline transition hover:bg-muted hover:no-underline"
            >
              Founding partner pricing available
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#92400e]">
              Brand plans
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Designed for brands and agencies that want measurable creator ROI,
              not lightweight discovery access.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 xl:grid-cols-4">
            {brandPlans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-lg border px-5 py-6 ${
                  plan.featured
                    ? "border-[#92400e] bg-card shadow-sm"
                    : "border-border bg-background"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#92400e]">
                  {plan.name}
                </p>
                <div className="mt-4 flex items-end gap-1">
                  <p className="text-3xl font-semibold text-foreground">{plan.price}</p>
                  {plan.cadence ? (
                    <p className="pb-1 text-sm text-muted-foreground">{plan.cadence}</p>
                  ) : null}
                </div>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  {plan.description}
                </p>
                <div className="mt-6 grid gap-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#92400e]" />
                      <p className="text-sm leading-7 text-muted-foreground">
                        {feature}
                      </p>
                    </div>
                  ))}
                </div>
                <Link
                  href="/contact"
                  className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-[#92400e] px-4 py-2.5 text-sm font-semibold text-white no-underline transition hover:bg-[#7c360c] hover:no-underline"
                >
                  Book a Demo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#92400e]">
              Creator plans
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Creators can start free, with more tools rolling out through
              founding access.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {creatorPlans.map((plan) => (
              <div
                key={plan.name}
                className="rounded-lg border border-border bg-card px-5 py-6"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#92400e]">
                  {plan.name}
                </p>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  {plan.description}
                </p>
                <div className="mt-6 grid gap-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#92400e]" />
                      <p className="text-sm leading-7 text-muted-foreground">
                        {feature}
                      </p>
                    </div>
                  ))}
                </div>
                <Link
                  href="/for-creators"
                  className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground no-underline transition hover:bg-muted hover:no-underline"
                >
                  Learn more
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#101827] text-white">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
            Early access
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Need pricing shaped around a live rollout?
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-300">
            Founding brand partners and agencies can work with us on rollout
            scope, onboarding, and commercial structure while the product is
            still being shaped.
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#92400e] px-5 py-3 text-sm font-semibold text-white no-underline shadow-sm transition hover:bg-[#7c360c] hover:no-underline"
            >
              Talk to the team
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
