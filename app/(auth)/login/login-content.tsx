"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BarChart3, Building2, User, CheckCircle, Mail, AlertCircle, AlertTriangle } from "lucide-react";

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

    // Check for verification messages
    if (searchParams.get("verified") === "true") {
      setSuccessMessage("Email verified successfully! You can now sign in.");
    }
    if (searchParams.get("verification") === "sent") {
      setSuccessMessage("Account created! Please check your email to verify your account.");
    }

    // Check for errors
    const errorParam = searchParams.get("error");
    if (errorParam) {
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
      }
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
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-6">
      {/* Logo */}
      <div className="mb-8 text-center">
        <Link href="/" className="inline-flex items-center space-x-2">
          <BarChart3 className="h-8 w-8 text-accent" />
          <span className="text-2xl font-bold text-foreground">
            AM Creator Analytics
          </span>
        </Link>
        <p className="text-muted-foreground mt-2">
          Sign in to your {role === "BRAND" ? "Brand" : "Creator"} account
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <Alert className="w-full max-w-sm mb-6 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert variant="destructive" className="w-full max-w-sm mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Role Selector */}
      <div className="w-full max-w-sm mb-6">
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant={role === "CREATOR" ? "default" : "outline"}
            className={`h-12 flex-col gap-1 transition-all duration-200 ${
              role === "CREATOR" 
                ? "shadow-md hover:shadow-lg hover:-translate-y-0.5" 
                : "hover:border-accent/50"
            }`}
            onClick={() => setRole("CREATOR")}
          >
            <User className={`h-5 w-5 ${role === "CREATOR" ? "text-accent-foreground" : "text-muted-foreground"}`} />
            <span className={role === "CREATOR" ? "text-accent-foreground" : "text-muted-foreground"}>
              Creator
            </span>
          </Button>
          <Button
            type="button"
            variant={role === "BRAND" ? "default" : "outline"}
            className={`h-12 flex-col gap-1 transition-all duration-200 ${
              role === "BRAND" 
                ? "shadow-md hover:shadow-lg hover:-translate-y-0.5" 
                : "hover:border-accent/50"
            }`}
            onClick={() => setRole("BRAND")}
          >
            <Building2 className={`h-5 w-5 ${role === "BRAND" ? "text-accent-foreground" : "text-muted-foreground"}`} />
            <span className={role === "BRAND" ? "text-accent-foreground" : "text-muted-foreground"}>
              Brand
            </span>
          </Button>
        </div>
      </div>

      {/* Login Form */}
      <div className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        {/* Resend Verification */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={handleResendVerification}
            className="text-sm text-muted-foreground hover:text-accent"
          >
            <Mail className="h-4 w-4 inline mr-1" />
            Resend verification email
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-accent hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
