import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 py-12">
        <Link href="/signup">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Signup
          </Button>
        </Link>

        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <FileText className="h-8 w-8 text-[#C19A5B]" />
              <CardTitle className="text-3xl font-bold text-[#3A3941]">
                Terms of Service
              </CardTitle>
            </div>
            <p className="text-muted-foreground">Last updated: January 1, 2026</p>
          </CardHeader>
          <CardContent className="prose prose-slate max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using AM Creator Analytics ("the Service"), you agree to be bound by these
              Terms of Service. If you disagree with any part of these terms, you may not access the Service.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              AM Creator Analytics provides a platform for brands and creators to connect, manage campaigns,
              and analyze performance metrics. The Service includes access to analytics dashboards, media kit
              generation, and campaign management tools.
            </p>

            <h2>3. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and for all
              activities under your account. You agree to notify us immediately of any unauthorized use.
            </p>

            <h2>4. Privacy & Data</h2>
            <p>
              Your privacy is important to us. Please review our <Link href="/privacy" className="text-[#C19A5B] hover:underline">Privacy Policy</Link> to understand how we collect, use, and protect your information.
            </p>

            <h2>5. Payment Terms</h2>
            <p>
              Certain features of the Service may require payment. All fees are non-refundable unless
              otherwise stated. We use third-party payment processors (Stripe, Razorpay) and do not store
              your payment card information.
            </p>

            <h2>6. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are owned by AM Creator Analytics
              and are protected by international copyright, trademark, and other intellectual property laws.
            </p>

            <h2>7. Limitation of Liability</h2>
            <p>
              In no event shall AM Creator Analytics be liable for any indirect, incidental, special,
              consequential, or punitive damages resulting from your use of the Service.
            </p>

            <h2>8. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at{" "}
              <a href="mailto:legal@amcreatoranalytics.com" className="text-[#C19A5B] hover:underline">
                legal@amcreatoranalytics.com
              </a>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
