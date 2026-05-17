import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "For Agencies | AM Creator Analytics",
  description:
    "Manage more creator campaigns, approvals, contracts, reporting, and payouts without operational chaos.",
};

const agencyNeeds = [
  "More creator campaigns without more spreadsheet debt",
  "Clear approval flows across briefs, drafts, revisions, and final assets",
  "Contract, payout, and reporting infrastructure that clients can trust",
];

const agencyBenefits = [
  "Campaign CRM for every creator relationship in flight",
  "Contracts and usage-rights tracking before content is published",
  "Attribution, ROI, and payout visibility for internal teams and clients",
];

export default function ForAgenciesPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#92400e]">
            For agencies
          </p>
          <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
            Manage more creator campaigns, approvals, reporting, contracts, and
            payouts without operational chaos.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            AM Creator Analytics helps agency teams standardize creator campaign
            workflows so client delivery does not depend on scattered chats,
            manual trackers, and delayed payout reconciliation.
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
              What agency teams need
            </h2>
            <div className="mt-8 grid gap-4">
              {agencyNeeds.map((item) => (
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
              What AM helps standardize
            </h2>
            <div className="mt-8 grid gap-3">
              {agencyBenefits.map((item) => (
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
              Founding partner access is opening soon for agencies that want to
              scale delivery quality and keep more workflow ownership in-house.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
