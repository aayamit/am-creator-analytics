import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BarChart3, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="max-w-lg w-full p-12 border-border/50 bg-card text-center">
        <div className="mb-8">
          <BarChart3 className="h-16 w-16 text-accent mx-auto mb-4" />
          <h1 className="text-6xl font-bold text-foreground font-mono">404</h1>
        </div>
        
        <h2 className="text-2xl font-bold text-foreground font-heading mb-4">
          Page Not Found
        </h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track with your analytics.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="default" size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/contact">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Contact Support
            </Link>
          </Button>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">
            Popular pages:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { href: "/features", label: "Features" },
              { href: "/pricing", label: "Pricing" },
              { href: "/blog", label: "Blog" },
              { href: "/about", label: "About" },
            ].map((link) => (
              <Button key={link.href} asChild variant="link" size="sm">
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
          </div>
        </div>
      </Card>
    </main>
  );
}
