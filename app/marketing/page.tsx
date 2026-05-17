import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BarChart3, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Performance-Led Creator Campaigns | AM Creator Analytics",
  description:
    "Run creator campaigns like a performance channel with one workflow for discovery, contracts, attribution, payouts, and reusable UGC.",
};

const painPoints = [
  "Creator discovery tools give profiles, not replies.",
  "Agencies hide creator rates, markups, and performance data.",
  "Campaigns run across WhatsApp, Excel, Drive, PDFs, and payment screenshots.",
  "Brands still measure reach when they need revenue, CAC, ROAS, and reusable UGC.",
  "Contracts, disclosures, payout records, and usage rights are usually managed too late.",
];

const workflowSteps = [
  {
    step: "01",
    title: "Discover",
    description:
      "Find creators by niche, city, language, audience, platform, and content style.",
  },
  {
    step: "02",
    title: "Shortlist",
    description: "Build campaign-ready creator lists for each brief.",
  },
  {
    step: "03",
    title: "Pitch",
    description: "Send structured invites and follow-ups.",
  },
  {
    step: "04",
    title: "Contract",
    description:
      "Lock deliverables, timelines, disclosures, fees, and usage rights.",
  },
  {
    step: "05",
    title: "Ship Product",
    description: "Track seeding and dispatch status.",
  },
  {
    step: "06",
    title: "Approve Content",
    description: "Manage drafts, revisions, captions, and final approvals.",
  },
  {
    step: "07",
    title: "Track Sales",
    description:
      "Use links, promo codes, orders, CAC, ROAS, and revenue per creator.",
  },
  {
    step: "08",
    title: "Pay",
    description: "Track invoices, payout status, GST/TDS-ready records.",
  },
  {
    step: "09",
    title: "Reuse UGC",
    description:
      "Store approved creator assets with usage rights and expiry windows.",
  },
];

const modules = [
  {
    eyebrow: "Creator Discovery & Verification",
    title: "Find creator-brand fit with more than follower count.",
    description:
      "Filter creators by category, audience, location, language, platform, engagement quality, and brand fit.",
  },
  {
    eyebrow: "Campaign CRM",
    title: "Run every creator relationship inside one campaign pipeline.",
    description:
      "Manage each creator from shortlisted to live campaign without losing context across spreadsheets, chats, and PDFs.",
  },
  {
    eyebrow: "Contracts & Usage Rights",
    title: "Lock terms before content goes live.",
    description:
      "Generate creator agreements with deliverables, payment terms, exclusivity, disclosure rules, and UGC usage rights.",
  },
  {
    eyebrow: "Attribution & ROI",
    title: "Measure revenue, not just reach.",
    description:
      "Track sales through links, codes, cart events, purchases, creator revenue, CAC, and ROAS.",
  },
  {
    eyebrow: "Payout & Compliance Workspace",
    title: "Keep payment ops and compliance in one place.",
    description:
      "Manage invoices, payout status, GST/TDS-ready records, and payment proof without a separate finance trail.",
  },
  {
    eyebrow: "UGC Vault",
    title: "Turn approved creator content into a reusable asset library.",
    description:
      "Store creator videos, captions, thumbnails, approvals, and usage-rights expiry dates for paid media reuse.",
  },
];

const whyNow = [
  "Creator commerce is becoming performance-led.",
  "Regional and micro-creators are becoming more important.",
  "Brands need transparency around rates, deliverables, usage rights, and ROI.",
  "Compliance and disclosure expectations are increasing.",
  "UGC is becoming a reusable paid media asset, not just a one-time post.",
];

const foundingPartnerBenefits = [
  "Early access to creator discovery and campaign CRM",
  "Pilot campaign support",
  "Input into product roadmap",
  "Preferential founding partner pricing",
  "Opportunity to shape attribution, WhatsApp, contracts, and payout workflows",
];

function PrimaryLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#92400e] px-5 py-3 text-sm font-semibold text-white no-underline shadow-sm transition hover:bg-[#7c360c] hover:no-underline"
    >
      {children}
    </Link>
  );
}

function SecondaryLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white no-underline transition hover:bg-white/10 hover:no-underline"
    >
      {children}
    </Link>
  );
}

export default function MarketingPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="border-b border-white/10 bg-[#101827] text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <div className="mb-6 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-300/90">
              <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1">
                India&apos;s creator campaign operating system
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                Founding brand access open
              </span>
            </div>

            <h1 className="mb-6 max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Run creator campaigns like a performance channel.
            </h1>

            <p className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Discover verified Indian creators, manage briefs, contracts,
              content approvals, sales attribution, UGC rights, WhatsApp
              updates, and payouts from one platform.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <PrimaryLink href="/contact">
                Book a Demo
                <ArrowRight className="h-4 w-4" />
              </PrimaryLink>
              <SecondaryLink href="#founding-partners">
                Join as Founding Partner
              </SecondaryLink>
            </div>

            <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-400">
              Built for D2C brands, agencies, and growth teams that want
              measurable creator ROI without agency dependency.
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/95 p-6 text-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Campaign Control Room
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                  One workflow from brief to payout
                </h2>
              </div>
              <div className="rounded-lg bg-slate-950 px-3 py-2 text-right text-white">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-300">
                  Focus
                </p>
                <p className="mt-1 flex items-center gap-2 text-sm font-semibold">
                  <BarChart3 className="h-4 w-4 text-amber-400" />
                  Measurable creator ROI
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {[
                "Verified creator profiles and campaign shortlists",
                "Contracts, deliverables, and usage rights in one workspace",
                "Attribution, payouts, and reusable UGC tracked together",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-lg border border-slate-200 px-4 py-3"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#92400e]" />
                  <p className="text-sm leading-6 text-slate-700">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { label: "For brands", value: "Pipeline ownership" },
                { label: "For creators", value: "Professional workflow" },
                { label: "For finance", value: "Clean payout records" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg bg-slate-50 px-4 py-4 ring-1 ring-slate-200"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-900">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#92400e]">
              The pain
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Influencer marketing is growing. Execution is still broken.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {painPoints.map((item) => (
              <div
                key={item}
                className="rounded-lg border border-border bg-card px-5 py-5"
              >
                <p className="text-base leading-7 text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#92400e]">
              The AM workflow
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              One workflow from creator discovery to creator revenue.
            </h2>
          </div>

          <div className="mt-6 flex flex-wrap gap-2 text-sm text-muted-foreground">
            {[
              "Discover",
              "Shortlist",
              "Pitch",
              "Contract",
              "Ship Product",
              "Approve Content",
              "Track Sales",
              "Pay",
              "Reuse UGC",
            ].map((item, index) => (
              <div
                key={item}
                className="rounded-full border border-border bg-background px-3 py-2"
              >
                {index < 8 ? `${item} ->` : item}
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {workflowSteps.map((item) => (
              <div
                key={item.step}
                className="rounded-lg border border-border bg-background px-5 py-5"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#92400e]">
                  Step {item.step}
                </p>
                <h3 className="mt-3 text-xl font-semibold text-foreground">
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

      <section id="modules" className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#92400e]">
              Core product modules
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              The product is designed to own the workflow, not just discovery.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {modules.map((item) => (
              <div
                key={item.eyebrow}
                className="rounded-lg border border-border bg-card px-5 py-5"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#92400e]">
                  {item.eyebrow}
                </p>
                <h3 className="mt-3 text-xl font-semibold text-foreground">
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

      <section className="border-b border-white/10 bg-[#111827] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
              Why now
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Creator marketing is moving from vanity metrics to measurable
              commerce.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-300">
              Brands are shifting from one-off influencer posts to structured
              creator programs. The next layer of the market needs verified
              creator data, repeatable workflows, attribution, compliance, and
              payout infrastructure.
            </p>
          </div>

          <div className="grid gap-3">
            {whyNow.map((item) => (
              <div
                key={item}
                className="rounded-lg border border-white/10 bg-white/5 px-5 py-4"
              >
                <p className="text-sm leading-7 text-slate-200">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="founding-partners"
        className="border-b border-border bg-background"
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#92400e]">
              Founding partner access
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Become a founding brand partner.
            </h2>
            <p className="mt-5 text-base leading-8 text-muted-foreground">
              We are onboarding a limited set of early brands, agencies, and
              D2C teams to shape the platform, run pilot campaigns, and access
              the founding creator network before public launch.
            </p>
            <div className="mt-8">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#92400e] px-5 py-3 text-sm font-semibold text-white no-underline shadow-sm transition hover:bg-[#7c360c] hover:no-underline"
              >
                Apply as Founding Partner
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="grid gap-3">
            {foundingPartnerBenefits.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-lg border border-border bg-card px-5 py-4"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#92400e]" />
                <p className="text-sm leading-7 text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#92400e]">
              For creators
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Your Instagram is not your media kit.
            </h2>
            <p className="mt-5 text-base leading-8 text-muted-foreground">
              Creators can build a verified profile, showcase audience quality,
              list rates, receive relevant brand briefs, sign contracts, and
              track payments in one professional workspace.
            </p>
            <div className="mt-8">
              <Link
                href="/for-creators"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground no-underline transition hover:bg-muted hover:no-underline"
              >
                Join as Creator
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#92400e]">
              Creator workspace
            </p>
            <div className="mt-5 grid gap-3">
              {[
                "Verified creator profile and live media kit",
                "Relevant briefs instead of cold outreach chaos",
                "Contract, payout, and usage-rights visibility in one place",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-lg border border-border bg-background px-4 py-4"
                >
                  <p className="text-sm leading-7 text-muted-foreground">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#101827] text-white">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
            Final CTA
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Ready to make creator marketing measurable?
          </h2>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <PrimaryLink href="/contact">
              Book a Demo
              <ArrowRight className="h-4 w-4" />
            </PrimaryLink>
            <SecondaryLink href="/for-creators#founding-creator-program">
              Join Founding Creator Network
            </SecondaryLink>
          </div>
        </div>
      </section>
    </main>
  );
}
