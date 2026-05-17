"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Building2, User } from "lucide-react";

import BrandMark from "@/components/BrandMark";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"BRAND" | "CREATOR">("CREATOR");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!termsAccepted || !privacyAccepted) {
      setError("You must accept the Terms of Service and Privacy Policy");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name,
          role,
          termsAccepted: true,
          privacyAccepted: true,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Signup failed");
        setLoading(false);
        return;
      }

      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      });

      router.push("/login?verification=sent");
    } catch {
      setError("An error occurred");
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(26,26,46,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(26,26,46,0.08)_1px,transparent_1px)] [background-size:40px_40px] dark:opacity-40 dark:[background-image:linear-gradient(rgba(248,250,252,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(248,250,252,0.08)_1px,transparent_1px)]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-10rem)] max-w-5xl items-center justify-center px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="w-full max-w-md rounded-2xl border border-border/80 bg-background/90 p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm sm:p-8 dark:bg-card/90 dark:shadow-[0_24px_80px_-40px_rgba(0,0,0,0.75)]">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-3 no-underline hover:no-underline"
            >
              <BrandMark className="h-11 w-11 sm:h-12 sm:w-12" priority />
              <div>
                <span className="block text-lg font-semibold text-foreground sm:text-xl">
                  AM Creator Analytics
                </span>
                <span className="block text-sm text-muted-foreground">
                  Create your account
                </span>
              </div>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Set up your workspace and start measuring revenue from creator partnerships.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-700 dark:bg-red-500/15 dark:text-red-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{error}</p>
              </div>
            </div>
          )}

          <div className="mb-6 grid grid-cols-2 gap-3 rounded-xl border border-border/70 bg-muted/40 p-2">
            <button
              type="button"
              onClick={() => setRole("CREATOR")}
              className={`rounded-lg border px-4 py-3 text-left transition-colors ${
                role === "CREATOR"
                  ? "border-accent bg-background text-foreground shadow-sm"
                  : "border-transparent bg-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <User
                className={`mb-2 h-5 w-5 ${
                  role === "CREATOR" ? "text-accent" : "text-muted-foreground"
                }`}
              />
              <span className="block text-sm font-medium">Creator</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("BRAND")}
              className={`rounded-lg border px-4 py-3 text-left transition-colors ${
                role === "BRAND"
                  ? "border-primary bg-background text-foreground shadow-sm"
                  : "border-transparent bg-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Building2
                className={`mb-2 h-5 w-5 ${
                  role === "BRAND" ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <span className="block text-sm font-medium">Brand</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-12 rounded-xl border-border bg-background/80 px-4 shadow-none focus-visible:ring-ring/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-xl border-border bg-background/80 px-4 shadow-none focus-visible:ring-ring/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="h-12 rounded-xl border-border bg-background/80 px-4 shadow-none focus-visible:ring-ring/30"
              />
            </div>

            <div className="space-y-3 rounded-xl border border-border/70 bg-muted/30 p-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                  className="mt-1 border-border"
                />
                <Label
                  htmlFor="terms"
                  className="text-sm font-normal leading-relaxed text-muted-foreground"
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="font-medium text-accent no-underline hover:text-accent/80"
                  >
                    Terms of Service
                  </Link>
                </Label>
              </div>
              <div className="flex items-start gap-3">
                <Checkbox
                  id="privacy"
                  checked={privacyAccepted}
                  onCheckedChange={(checked) => setPrivacyAccepted(checked as boolean)}
                  className="mt-1 border-border"
                />
                <Label
                  htmlFor="privacy"
                  className="text-sm font-normal leading-relaxed text-muted-foreground"
                >
                  I agree to the{" "}
                  <Link
                    href="/privacy"
                    className="font-medium text-accent no-underline hover:text-accent/80"
                  >
                    Privacy Policy
                  </Link>
                </Label>
              </div>
            </div>

            <Button
              type="submit"
              className="h-12 w-full rounded-xl text-sm font-semibold"
              disabled={loading || !termsAccepted || !privacyAccepted}
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-accent no-underline hover:text-accent/80"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
