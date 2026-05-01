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
            Create your account
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="w-full max-w-sm mb-6 p-4 border border-red-200 bg-red-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 text-red-600">⚠</div>
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

        {/* Signup Form - Facebook-inspired clean design */}
        <div className="w-full max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-foreground" style={{ fontFamily: 'JetBrains Mono, monospace' }}>Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-12 border-2 focus:border-accent"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              />
            </div>
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
                minLength={8}
                className="h-12 border-2 focus:border-accent"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              />
            </div>

            {/* Terms & Privacy - NO HOVER */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm font-normal leading-relaxed" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  I agree to the{" "}
                  <Link href="/terms" className="text-accent font-medium">
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
                <Label htmlFor="privacy" className="text-sm font-normal leading-relaxed" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  I agree to the{" "}
                  <Link href="/privacy" className="text-accent font-medium">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-accent text-accent-foreground font-semibold rounded-lg"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
              disabled={loading || !termsAccepted || !privacyAccepted}
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            Already have an account?{" "}
            <Link href="/login" className="text-accent font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
