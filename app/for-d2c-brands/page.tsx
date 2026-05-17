import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "For D2C Brands | AM Creator Analytics",
  description:
    "Launch performance-led creator campaigns without managing everything through agencies, spreadsheets, and scattered WhatsApp threads.",
};

const problems = [
  "Campaign execution lives across WhatsApp, Excel, Drive, and approval screenshots.",
  "Creator selection, rates, and usage rights stay opaque when agencies control the workflow.",
  "UGC, discount codes, and sales attribution are rarely tied back to creator-level ROI.",
];

const outcomes = [
  "Build structured creator pipelines for each campaign",
  "Track briefs, contracts, approvals, seeding, and payouts in one place",
  "Measure links, codes, CAC, revenue, and reusable UGC performance",
];

export default function ForD2CBrandsPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#92400e]">
            For D2C brands
          </p>
          <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
            Launch creator campaigns without managing everything through
            WhatsApp, Excel, and agencies.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            AM Creator Analytics gives D2C teams a creator campaign operating
            system for discovery, campaign CRM, contracts and usage rights,
            attribution and ROI, payout tracking, and reusable UGC.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
              Apply as Founding Partner
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              What usually breaks
            </h2>
            <div className="mt-8 grid gap-4">
              {problems.map((item) => (
                <div
                  key={item}
                  className="rounded-lg border border-border bg-background px-5 py-5"
                >
                  <p className="text-sm leading-7 text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              What founding partners get
            </h2>
            <div className="mt-8 grid gap-3">
              {outcomes.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-lg border border-border bg-background px-5 py-4"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#92400e]" />
                  <p className="text-sm leading-7 text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm leading-7 text-muted-foreground">
              Founding partner access is opening in limited batches for brands
              that want measurable creator ROI and tighter workflow ownership.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
