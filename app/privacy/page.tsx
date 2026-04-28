import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import JsonLd from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Privacy Policy | AM Creator Analytics",
  description:
    "Privacy Policy for AM Creator Analytics. Learn how we collect, use, and protect your personal information.",
  robots: {
    index: true,
    follow: true,
  },
};

const privacySchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Privacy Policy",
  description: "How AM Creator Analytics collects, uses, and protects your data.",
  publisher: {
    "@type": "Organization",
    name: "AM Creator Analytics",
  },
  datePublished: "2025-01-01",
  dateModified: "2026-04-28",
};

const sections = [
  {
    title: "1. Information We Collect",
    content: `We collect the following types of information:

Personal Information:
• Name, email address, billing information
• Profile information (for creators: niche, bio, social accounts)
• Payment information (processed securely via Stripe)

Usage Data:
• Log data (IP address, browser type, pages visited)
• Device information
• Cookies and similar tracking technologies

Platform Data:
• Social media metrics (followers, engagement rates)
• Audience demographics
• Campaign performance data`,
  },
  {
    title: "2. How We Use Your Information",
    content: `We use the collected information for:
• Providing and maintaining our Platform
• Processing payments and managing subscriptions
• Sending you service-related notifications
• Improving our algorithms and fraud detection
• Communicating with you about updates or issues
• Analyzing usage patterns to enhance user experience

We never sell your personal data to third parties.`,
  },
  {
    title: "3. Data Sharing and Disclosure",
    content: `We may share your information in these limited circumstances:

With Your Consent:
• When you connect social accounts via OAuth
• When you share your media kit with brands

Service Providers:
• Payment processors (Stripe)
• Cloud hosting (Vercel)
• Analytics providers (in aggregate only)

Legal Requirements:
• To comply with applicable laws
• To respond to valid legal requests
• To protect our rights or safety

Business Transfers:
• In case of merger, acquisition, or asset sale`,
  },
  {
    title: "4. Data Security",
    content: `We implement industry-standard security measures:
• Encryption in transit (TLS 1.3) and at rest (AES-256)
• Regular security audits and penetration testing
• Access controls and employee training
• Secure OAuth token storage

However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.`,
  },
  {
    title: "5. Your Rights and Choices",
    content: `Depending on your location, you may have rights to:
• Access the personal data we hold about you
• Correct inaccurate or incomplete data
• Request deletion of your data ("Right to be Forgotten")
• Object to certain data processing
• Data portability (receive your data in a structured format)
• Withdraw consent where processing is based on consent

To exercise these rights, contact us at privacy@amcreatoranalytics.com.`,
  },
  {
    title: "6. Cookies and Tracking",
    content: `We use cookies and similar technologies to:
• Keep you logged in (essential cookies)
• Remember your preferences
• Analyze site traffic (analytics cookies)
• Provide personalized experiences

You can control cookies through your browser settings. Note that disabling certain cookies may limit Platform functionality.`,
  },
  {
    title: "7. Third-Party Links",
    content: `Our Platform may contain links to third-party sites (e.g., YouTube, LinkedIn). We are not responsible for the privacy practices of these sites. We encourage you to read their privacy policies before providing any personal information.`,
  },
  {
    title: "8. Children's Privacy",
    content: `Our Platform is not intended for children under 16. We do not knowingly collect personal information from children under 16. If you are a parent and believe your child has provided us with personal information, please contact us immediately.`,
  },
  {
    title: "9. Contact Us",
    content: `For privacy-related questions or to exercise your rights:
    
Email: privacy@amcreatoranalytics.com
Address: 123 Innovation Drive, Palo Alto, CA 94301
Phone: +1 (555) 123-4567

Data Protection Officer: dpo@amcreatoranalytics.com`,
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background">
      <JsonLd data={privacySchema} />

      <section className="border-b border-border">
        <div className="container mx-auto px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground font-heading mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">
              Last updated: April 28, 2026
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {sections.map((section, index) => (
              <Card key={index} className="p-8 border-border/50 bg-card">
                <h2 className="text-2xl font-bold text-foreground font-heading mb-4">
                  {section.title}
                </h2>
                <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
