import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import JsonLd from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "About | AM Creator Analytics",
  description:
    "Learn how AM Creator Analytics is building India's operating system for performance-led creator campaigns.",
};

const principles = [
  {
    title: "Workflow ownership",
    description:
      "Creator campaigns should not depend on scattered chats, spreadsheets, PDFs, and payment screenshots.",
  },
  {
    title: "Measurable creator ROI",
    description:
      "Brands need attribution, revenue visibility, reusable UGC, and payout records they can actually act on.",
  },
  {
    title: "Creator professionalism",
    description:
      "Creators need verified profiles, fairer workflows, contract clarity, and better payment visibility.",
  },
  {
    title: "Founding-stage honesty",
    description:
      "We are building with early brands and creators, not pretending to be a finished marketplace with inflated claims.",
  },
];

const audience = [
  "Brands that want measurable creator ROI and less agency dependency",
  "D2C teams that need structured campaign execution and reusable UGC",
  "Agencies that want to scale delivery without operational chaos",
  "Creators who want a verified profile, better briefs, and transparent payout tracking",
];

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AM Creator Analytics",
  url: "https://amcreatoranalytics.com/about",
  description:
    "AM Creator Analytics is building India's operating system for performance-led creator campaigns.",
  founder: {
    "@type": "Person",
    name: "Amit Kumar",
  },
  foundingDate: "2025",
  industry: "Creator commerce infrastructure",
};

export default function AboutPage() {
  return (
    <main className="bg-background text-foreground">
      <JsonLd data={organizationSchema} />

      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#92400e]">
            About AM Creator Analytics
          </p>
          <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
            Building India&apos;s operating system for performance-led creator
            campaigns.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            AM Creator Analytics is being built for brands, creators, agencies,
            and D2C teams that want creator marketing to behave more like an
            accountable growth function and less like a scattered coordination
            layer.
          </p>
        </div>
      </section>

      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[1fr_0.95fr] lg:px-8">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Why we are building this
            </h2>
            <div className="mt-6 space-y-5 text-base leading-8 text-muted-foreground">
              <p>
                Creator marketing has already become a meaningful budget line,
                but the operating layer behind it is still fragmented. Teams
                discover creators in one tool, negotiate in WhatsApp, track
                approvals in sheets, send contracts elsewhere, and reconcile
                payouts through screenshots and finance threads.
              </p>
              <p>
                That fragmentation makes it difficult to measure creator ROI,
                enforce usage rights, preserve campaign history, or build repeat
                programs across teams. It also leaves creators handling briefs,
                rates, contracts, and payment follow-up through inconsistent
                workflows.
              </p>
              <p>
                We think the next layer of the market needs creator campaign
                infrastructure: verified creator profiles, campaign CRM,
                contracts and usage rights, attribution and ROI, payout and
                compliance tracking, and a reusable UGC rights vault.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#92400e]">
              Current stage
            </p>
            <div className="mt-5 grid gap-3">
              {[
                "Onboarding founding brand partners, agencies, and creators",
                "Shaping the workflow with pilot users before broader rollout",
                "Prioritizing measurable creator ROI, payout clarity, and reusable UGC operations",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-lg border border-border bg-background px-4 py-4"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#92400e]" />
                  <p className="text-sm leading-7 text-muted-foreground">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#92400e]">
              Principles
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              The product is being shaped around a few simple operating
              principles.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {principles.map((item) => (
              <div
                key={item.title}
                className="rounded-lg border border-border bg-card px-5 py-5"
              >
                <h3 className="text-xl font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#92400e]">
              Who it is for
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Built for teams that want a stronger operating layer around
              creator commerce.
            </h2>
          </div>

          <div className="grid gap-3">
            {audience.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-lg border border-border bg-background px-5 py-4"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#92400e]" />
                <p className="text-sm leading-7 text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#101827] text-white">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
            Founding access
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Want to help shape the product roadmap?
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-300">
            We are onboarding a limited number of founding brand partners,
            agencies, and creators who want to shape the next version of the
            workflow.
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#92400e] px-5 py-3 text-sm font-semibold text-white no-underline shadow-sm transition hover:bg-[#7c360c] hover:no-underline"
            >
              Contact the team
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
