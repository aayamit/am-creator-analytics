import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "For Creators | AM Creator Analytics",
  description:
    "Build a verified creator profile, create a live media kit, receive relevant briefs, and track contracts and payments in one workspace.",
};

const creatorBenefits = [
  {
    title: "Get discovered by serious brands",
    description:
      "Your profile becomes searchable by brands looking for creators in your niche, city, language, and audience category.",
  },
  {
    title: "Build a live media kit",
    description:
      "Replace outdated PDF media kits with a verified profile showing your audience, engagement, content samples, rates, and past collaborations.",
  },
  {
    title: "Receive relevant briefs",
    description:
      "Get brand opportunities that match your category, location, language, audience, and content style.",
  },
  {
    title: "Know what to charge",
    description:
      "Get pricing guidance based on your niche, audience, engagement, content format, and campaign history.",
  },
  {
    title: "Sign contracts easily",
    description:
      "Review deliverables, timelines, payment terms, usage rights, and disclosure expectations before accepting campaigns.",
  },
  {
    title: "Track payments",
    description:
      "See invoice status, payout status, and expected payment timeline in one place.",
  },
];

const steps = [
  "Create profile",
  "Connect Instagram or upload insights",
  "Add rates and collaboration preferences",
  "Receive relevant brand briefs",
  "Sign, deliver, and get paid",
];

const foundingBenefits = [
  "Founding creator badge",
  "Priority visibility to early brand partners",
  "Free media kit tools during early access",
  "Brand brief access",
  "Pricing and collaboration guidance",
  "WhatsApp updates with opt-in",
];

const creatorTools = [
  "Media kit generator",
  "Rate calculator",
  "Brand pitch generator",
  "Contract checklist",
  "Invoice generator",
  "Collaboration tracker",
];

const trustBullets = [
  "You decide which campaigns to accept.",
  "Your rates and preferences stay under your control.",
  "Brands do not get private data without consent.",
  "AM does not post content on your behalf.",
  "WhatsApp updates are opt-in.",
  "Contracts and payouts are tracked transparently.",
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

export default function ForCreatorsPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="border-b border-border bg-background">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <div className="mb-6 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#92400e]">
              <span className="rounded-full border border-[#92400e]/15 bg-[#92400e]/8 px-3 py-1">
                Founding creator program
              </span>
              <span className="rounded-full border border-border bg-card px-3 py-1 text-muted-foreground">
                Early access onboarding
              </span>
            </div>

            <h1 className="mb-6 max-w-4xl text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Your Instagram is not your media kit.
            </h1>

            <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
              Create a verified creator profile that brands can trust. Showcase
              your audience, content, rates, past collaborations, and
              collaboration preferences in one professional link.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <PrimaryLink href="/signup?role=CREATOR">
                Create Free Media Kit
                <ArrowRight className="h-4 w-4" />
              </PrimaryLink>
              <Link
                href="#founding-creator-program"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground no-underline transition hover:bg-muted hover:no-underline"
              >
                Join Founding Creator Program
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#92400e]">
              Creator workspace
            </p>
            <div className="mt-5 grid gap-3">
              {[
                "Verified profile and live media kit",
                "Relevant briefs matched to your category and audience",
                "Contracts, payouts, and collaboration tracking in one place",
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

      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#92400e]">
              Why creators join AM
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Build a professional presence that helps brands take you
              seriously.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {creatorBenefits.map((item, index) => (
              <div
                key={item.title}
                className="rounded-lg border border-border bg-background px-5 py-5"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#92400e]">
                  0{index + 1}
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

      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#92400e]">
              How it works
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Five steps from profile setup to payout tracking.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {steps.map((item, index) => (
              <div
                key={item}
                className="rounded-lg border border-border bg-card px-5 py-5"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#92400e]">
                  Step {index + 1}
                </p>
                <p className="mt-3 text-base font-medium leading-7 text-foreground">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="founding-creator-program"
        className="border-b border-white/10 bg-[#111827] text-white"
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
              Founding creator program
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Join the founding creator network.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-300">
              We are onboarding early creators across beauty, fashion, food,
              fitness, travel, tech, parenting, and regional content categories.
              Founding creators get priority visibility, early access to brand
              briefs, verified profile tools, and pricing guidance.
            </p>
            <div className="mt-8">
              <PrimaryLink href="/signup?role=CREATOR">
                Join Founding Creator Program
                <ArrowRight className="h-4 w-4" />
              </PrimaryLink>
            </div>
          </div>

          <div className="grid gap-3">
            {foundingBenefits.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 px-5 py-4"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                <p className="text-sm leading-7 text-slate-200">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#92400e]">
              Free creator tools
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Start with practical tools, then grow into the full creator
              workspace.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {creatorTools.map((item) => (
              <div
                key={item}
                className="rounded-lg border border-border bg-card px-5 py-5"
              >
                <p className="text-base font-medium leading-7 text-foreground">
                  {item}
                </p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Early access tools are being rolled out with the founding
                  creator network.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#92400e]">
              Trust and control
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              AM is not an agency. Creators stay in control.
            </h2>
            <p className="mt-5 text-base leading-8 text-muted-foreground">
              AM is built to make creator work more professional and measurable
              without taking ownership away from creators.
            </p>
          </div>

          <div className="grid gap-3">
            {trustBullets.map((item) => (
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

      <section className="bg-background">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#92400e]">
            Final CTA
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Create your free verified media kit in 3 minutes.
          </h2>
          <div className="mt-8">
            <PrimaryLink href="/signup?role=CREATOR">
              Create Free Media Kit
              <ArrowRight className="h-4 w-4" />
            </PrimaryLink>
          </div>
        </div>
      </section>
    </main>
  );
}
