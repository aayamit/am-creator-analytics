"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { BarChart3, Building2, User } from "lucide-react";
import { signIn } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";

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
      // Call API to create user
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

      // Show success message
      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      });

      // Redirect to login with verification message
      router.push("/login?verification=sent");
    } catch {
      setError("An error occurred");
      setLoading(false);
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
        <p className="text-muted-foreground mt-2">Create your account</p>
      </div>

      {/* Role Selector */}
      <div className="w-full max-w-sm mb-6">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole("CREATOR")}
            className={`p-4 rounded-lg border-2 transition-all ${
              role === "CREATOR"
                ? "border-accent bg-accent/5"
                : "border-border hover:border-accent/50"
            }`}
          >
            <User
              className={`h-6 w-6 mx-auto mb-2 ${
                role === "CREATOR" ? "text-accent" : "text-muted-foreground"
              }`}
            />
            <span
              className={`text-sm font-medium ${
                role === "CREATOR" ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Creator
            </span>
          </button>
          <button
            type="button"
            onClick={() => setRole("BRAND")}
            className={`p-4 rounded-lg border-2 transition-all ${
              role === "BRAND"
                ? "border-accent bg-accent/5"
                : "border-border hover:border-accent/50"
            }`}
          >
            <Building2
              className={`h-6 w-6 mx-auto mb-2 ${
                role === "BRAND" ? "text-accent" : "text-muted-foreground"
              }`}
            />
            <span
              className={`text-sm font-medium ${
                role === "BRAND" ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Brand
            </span>
          </button>
        </div>
      </div>

      {/* Signup Form */}
      <div className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
              minLength={8}
            />
          </div>

          {/* Terms & Privacy */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm font-normal leading-relaxed">
                I agree to the{" "}
                <Link href="/terms" className="text-accent hover:underline">
                  Terms of Service
                </Link>
              </Label>
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox
                id="privacy"
                checked={privacyAccepted}
                onCheckedChange={(checked) => setPrivacyAccepted(checked as boolean)}
              />
              <Label htmlFor="privacy" className="text-sm font-normal leading-relaxed">
                I agree to the{" "}
                <Link href="/privacy" className="text-accent hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <Button
            type="submit"
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
            disabled={loading || !termsAccepted || !privacyAccepted}
          >
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-accent hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
