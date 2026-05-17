"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, Clock3, Mail, MessageSquare, Users } from "lucide-react";
import JsonLd from "@/components/seo/json-ld";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    details: "partnerships@amcreatoranalytics.com",
    subtext: "Best for demos, founding partner interest, and roadmap conversations.",
  },
  {
    icon: Clock3,
    title: "Response window",
    details: "Typically within 1 business day",
    subtext: "We are still onboarding early users in focused batches.",
  },
  {
    icon: Users,
    title: "Who should reach out",
    details: "Brands, creators, agencies, and D2C teams",
    subtext: "Especially if you want measurable creator ROI or cleaner operating workflows.",
  },
  {
    icon: MessageSquare,
    title: "Best use",
    details: "Book a demo or apply for founding access",
    subtext: "We can also discuss creator onboarding, contracts, payouts, and attribution priorities.",
  },
];

const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact AM Creator Analytics",
  description:
    "Reach AM Creator Analytics for demos, founding partner access, creator onboarding, and product conversations.",
  mainEntity: {
    "@type": "Organization",
    name: "AM Creator Analytics",
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: "partnerships@amcreatoranalytics.com",
      },
      {
        "@type": "ContactPoint",
        contactType: "partnerships",
        email: "partnerships@amcreatoranalytics.com",
      },
    ],
  },
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    type: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitStatus("success");
        setSubmitMessage(
          data.message ||
            "Thanks. We have your note and will get back to you shortly."
        );
        setFormData({ name: "", email: "", subject: "", type: "", message: "" });
      } else {
        setSubmitStatus("error");
        setSubmitMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setSubmitStatus("error");
      setSubmitMessage("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-background text-foreground">
      <JsonLd data={contactPageSchema} />

      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center lg:px-8 lg:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#92400e]">
            Contact
          </p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
            Talk to the team about demos, founding access, or creator onboarding.
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            Reach out if you are a brand, creator, agency, or D2C team that
            wants a more measurable and operationally clean way to run creator
            campaigns.
          </p>
        </div>
      </section>

      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {contactInfo.map((info) => (
              <Card key={info.title} className="rounded-lg border border-border bg-background p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#92400e]/10 text-[#92400e]">
                    <info.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-foreground">
                      {info.title}
                    </h2>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {info.details}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {info.subtext}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#92400e]">
                What to include
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                The more context you share, the better we can help.
              </h2>
              <div className="mt-8 grid gap-3">
                {[
                  "What kind of team you are: brand, creator, agency, or D2C operator",
                  "What workflow problem you want to solve first",
                  "Whether you are exploring early access, a pilot, or founding partner pricing",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-lg border border-border bg-card px-5 py-4"
                  >
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#92400e]" />
                    <p className="text-sm leading-7 text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <Card className="rounded-lg border border-border bg-card p-8">
              {submitStatus === "success" ? (
                <div className="py-10 text-center">
                  <CheckCircle className="mx-auto h-14 w-14 text-[#92400e]" />
                  <h3 className="mt-4 text-2xl font-semibold text-foreground">
                    Thanks for reaching out.
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {submitMessage}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Amit Kumar"
                        required
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@company.com"
                        required
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="Founding partner conversation"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Inquiry Type</Label>
                    <select
                      id="type"
                      name="type"
                      required
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
                    >
                      <option value="">Select an option</option>
                      <option value="brand_demo">Brand demo</option>
                      <option value="founding_partner">Founding partner</option>
                      <option value="creator_program">Creator program</option>
                      <option value="agency_inquiry">Agency inquiry</option>
                      <option value="support">Support</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us what you are trying to solve, what stage you are at, and what kind of workflow you need."
                      rows={6}
                      required
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </div>

                  {submitStatus === "error" ? (
                    <p className="text-sm text-destructive">{submitMessage}</p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#92400e] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#7c360c] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? "Sending..." : "Send message"}
                    {!isSubmitting ? <ArrowRight className="h-4 w-4" /> : null}
                  </button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
