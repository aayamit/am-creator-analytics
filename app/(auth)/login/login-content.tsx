"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  Building2,
  CheckCircle,
  Mail,
  User,
} from "lucide-react";

import BrandMark from "@/components/BrandMark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"BRAND" | "CREATOR">("CREATOR");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam === "BRAND" || roleParam === "CREATOR") {
      setRole(roleParam);
    }

    if (searchParams.get("verified") === "true") {
      setSuccessMessage("Email verified successfully! You can now sign in.");
    }

    if (searchParams.get("verification") === "sent") {
      setSuccessMessage(
        "Account created! Please check your email to verify your account.",
      );
    }

    const errorParam = searchParams.get("error");
    if (!errorParam) {
      return;
    }

    switch (errorParam) {
      case "invalid_verification_link":
        setError("Invalid verification link. Please request a new one.");
        break;
      case "invalid_or_expired_token":
        setError("This verification link has expired. Please request a new one.");
        break;
      case "verification_failed":
        setError("Email verification failed. Please try again.");
        break;
      default:
        setError("An error occurred. Please try again.");
        break;
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        role,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials");
      } else {
        router.push(role === "BRAND" ? "/brands" : "/creators");
      }
    } catch {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setError("Please enter your email address first.");
      return;
    }

    try {
      const res = await fetch("/api/auth/verify-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSuccessMessage("Verification email sent! Please check your inbox.");
      } else {
        setError("Failed to send verification email.");
      }
    } catch {
      setError("Failed to send verification email.");
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
                  Sign in to your {role === "BRAND" ? "brand" : "creator"} account
                </span>
              </div>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Track real campaign outcomes, not vanity metrics.
            </p>
          </div>

          {successMessage && (
            <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200">
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{successMessage}</p>
              </div>
            </div>
          )}

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
                className="h-12 rounded-xl border-border bg-background/80 px-4 shadow-none focus-visible:ring-ring/30"
              />
            </div>

            <Button
              type="submit"
              className="h-12 w-full rounded-xl text-sm font-semibold"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleResendVerification}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Mail className="h-4 w-4" />
              Resend verification email
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-accent no-underline hover:text-accent/80"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
