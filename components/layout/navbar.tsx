"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, LogOut, Settings, Bell } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import NotificationBell from "@/components/notifications/notification-bell";

export default function Navbar() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <BarChart3 className="h-6 w-6 text-accent" />
          <span className="text-lg font-semibold tracking-tight text-foreground font-heading">
            AM Creator Analytics
          </span>
        </Link>

        {/* Navigation Links - Only show when not authenticated */}
        {!isAuthenticated && (
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/about" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link 
              href="/market-opportunity" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Market
            </Link>
            <Link 
              href="/features" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link 
              href="/pricing" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link 
              href="/blog" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Blog
            </Link>
            <Link 
              href="/contact" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </Link>
          </nav>
        )}

        {/* Right Side - CTA or User Menu */}
        <div className="flex items-center space-x-3">
          {isLoading ? (
            <div className="h-10 w-20 bg-muted animate-pulse rounded" />
          ) : isAuthenticated ? (
            <>
              {/* Notification Bell */}
              <NotificationBell />
              
              {/* User Menu */}
              <Button
                variant="ghost"
                size="sm"
                asChild
              >
                <Link href={session?.user?.role === "BRAND" ? "/brands/settings" : "/creators/settings/payouts"}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline"
                asChild
                className="font-medium hover:border-accent/50 hover:text-accent transition-all duration-200"
              >
                <Link href="/login?role=BRAND">Brand Login</Link>
              </Button>
              <Button 
                asChild
                className="font-medium bg-white text-foreground hover:bg-white/90 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <Link href="/login?role=CREATOR">
                  Creator Login
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
