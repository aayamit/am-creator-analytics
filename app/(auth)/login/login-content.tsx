"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BarChart3, Building2, User, CheckCircle, Mail, AlertCircle } from "lucide-react";

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
      setSuccessMessage("Account created! Please check your email to verify your account.");
    }

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
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#F8F7F4', color: '#1a1a2e' }}>
      {/* Bloomberg-style grid background */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(26,26,46,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(26,26,46,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          pointerEvents: 'none'
        }}
      />

      {/* Subtle gradient orb - Instagram-inspired */}
      <div 
        style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(146,64,14,0.08) 0%, rgba(26,26,46,0.03) 50%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(60px)'
        }}
      />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col justify-center items-center min-h-screen px-6">
        {/* Logo - Facebook/Instagram inspired clean layout */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center space-x-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(146,64,14,0.1)' }}>
              <BarChart3 className="h-8 w-8 text-accent" />
            </div>
            <div>
              <span className="text-2xl font-bold text-foreground block" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                AM Creator
              </span>
              <span className="text-sm text-muted-foreground">Analytics</span>
            </div>
          </Link>
          <p className="text-muted-foreground mt-3" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            Sign in to your {role === "BRAND" ? "Brand" : "Creator"} account
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="w-full max-w-sm mb-6 p-4 border border-green-200 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <p className="text-sm text-green-800">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="w-full max-w-sm mb-6 p-4 border border-red-200 bg-red-50 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Role Selector - NO HOVER EFFECTS */}
        <div className="w-full max-w-sm mb-6">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("CREATOR")}
              className={`p-4 rounded-lg border-2 transition-none
                ${role === "CREATOR" 
                  ? "border-accent bg-accent/5" 
                  : "border-border bg-white"
                }`}
            >
              <User className={`h-6 w-6 mx-auto mb-2 ${role === "CREATOR" ? "text-accent" : "text-muted-foreground"}`} />
              <span className={`text-sm font-medium ${role === "CREATOR" ? "text-foreground" : "text-muted-foreground"}`} style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                Creator
              </span>
            </button>
            <button
              type="button"
              onClick={() => setRole("BRAND")}
              className={`p-4 rounded-lg border-2 transition-none
                ${role === "BRAND" 
                  ? "border-primary bg-primary/5" 
                  : "border-border bg-white"
                }`}
            >
              <Building2 className={`h-6 w-6 mx-auto mb-2 ${role === "BRAND" ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`text-sm font-medium ${role === "BRAND" ? "text-foreground" : "text-muted-foreground"}`} style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                Brand
              </span>
            </button>
          </div>
        </div>

        {/* Login Form - Facebook-inspired clean design */}
        <div className="w-full max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-foreground" style={{ fontFamily: 'JetBrains Mono, monospace' }}>Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 border-2 focus:border-accent"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-foreground" style={{ fontFamily: 'JetBrains Mono, monospace' }}>Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 border-2 focus:border-accent"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-accent text-accent-foreground font-semibold rounded-lg"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Resend Verification - NO HOVER */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleResendVerification}
              className="text-sm text-muted-foreground"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              <Mail className="h-4 w-4 inline mr-1" />
              Resend verification email
            </button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-accent font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
