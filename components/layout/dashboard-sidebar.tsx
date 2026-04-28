'use client';

import Link from "next/link";
import { LayoutDashboard, Users, BarChart3, FileText, Settings, LogOut, TrendingUp, Link2, Bell, Contact, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import NotificationBell from "@/components/notifications/notification-bell";

interface DashboardSidebarProps {
  role: "BRAND" | "CREATOR";
}

export default function DashboardSidebar({ role }: DashboardSidebarProps) {
  const creatorNav = [
    { href: "/creators", label: "Dashboard", icon: LayoutDashboard },
    { href: "/creators/campaigns", label: "My Campaigns", icon: TrendingUp },
    { href: "/creators/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/creators/media-kit", label: "Media Kit", icon: FileText },
    { href: "/creators/connections", label: "Connections", icon: Link2 },
    { href: "/creators/settings/payouts", label: "Payout Settings", icon: Wallet },
    { href: "/notifications/preferences", label: "Notification Settings", icon: Bell },
  ];

  const brandNav = [
    { href: "/brands", label: "Dashboard", icon: LayoutDashboard },
    { href: "/brands/campaigns", label: "Campaigns", icon: TrendingUp },
    { href: "/brands/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/brands/discover", label: "Discover", icon: Users },
    { href: "/brands/crm", label: "CRM", icon: Contact },
    { href: "/brands/funding", label: "Funding", icon: Wallet },
    { href: "/brands/settings", label: "Settings", icon: Settings },
    { href: "/notifications/preferences", label: "Notification Settings", icon: Bell },
  ];
  const navItems = role === "CREATOR" ? creatorNav : brandNav;

  return (
    <aside className="w-64 bg-card border-r border-border h-screen flex flex-col">
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/5 transition-colors group"
          >
            <item.icon className="h-5 w-5 group-hover:text-accent transition-colors" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-border space-y-1">
        <NotificationBell />
        
        <Link
          href="/settings"
          className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/5 transition-colors"
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={() => {
            // Sign out logic
          }}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
