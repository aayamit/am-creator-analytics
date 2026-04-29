'use client';

import Link from "next/link";
import { LayoutDashboard, Users, BarChart3, FileText, Settings, LogOut, TrendingUp, Link2, Bell, Contact, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import NotificationBell from "@/components/notifications/notification-bell";

interface DashboardSidebarProps {
  role: "BRAND" | "CREATOR" | "AGENCY" | "ADMIN";
  tenantId: string;
  tenantName?: string;
  tenantType?: string;
}

export default function DashboardSidebar({ role, tenantId, tenantName, tenantType }: DashboardSidebarProps) {
  const basePath = `/${tenantId}`;
  
  const creatorNav = [
    { href: `${basePath}/dashboard`, label: "Dashboard", icon: LayoutDashboard },
    { href: `${basePath}/dashboard/campaigns`, label: "My Campaigns", icon: TrendingUp },
    { href: `${basePath}/dashboard/analytics`, label: "Analytics", icon: BarChart3 },
    { href: `${basePath}/dashboard/media-kit`, label: "Media Kit", icon: FileText },
    { href: `${basePath}/dashboard/connections`, label: "Connections", icon: Link2 },
    { href: `${basePath}/dashboard/settings/payouts`, label: "Payout Settings", icon: Wallet },
    { href: `${basePath}/notifications/preferences`, label: "Notification Settings", icon: Bell },
  ];

  const brandNav = [
    { href: `${basePath}/dashboard`, label: "Dashboard", icon: LayoutDashboard },
    { href: `${basePath}/dashboard/campaigns`, label: "Campaigns", icon: TrendingUp },
    { href: `${basePath}/dashboard/analytics`, label: "Analytics", icon: BarChart3 },
    { href: `${basePath}/dashboard/creators`, label: "Discover", icon: Users },
    { href: `${basePath}/dashboard/crm`, label: "CRM", icon: Contact },
    { href: `${basePath}/dashboard/funding`, label: "Funding", icon: Wallet },
    { href: `${basePath}/dashboard/settings`, label: "Settings", icon: Settings },
    { href: `${basePath}/notifications/preferences`, label: "Notification Settings", icon: Bell },
  ];

  const adminNav = [
    { href: `${basePath}/dashboard/admin`, label: "Admin", icon: LayoutDashboard },
    { href: `${basePath}/dashboard/admin/users`, label: "Users", icon: Users },
    { href: `${basePath}/dashboard/admin/audit-logs`, label: "Audit Logs", icon: FileText },
    { href: `${basePath}/dashboard/admin/gdpr`, label: "GDPR", icon: Settings },
  ];

  const navItems = role === "CREATOR" ? creatorNav : role === "BRAND" ? brandNav : adminNav;

  return (
    <aside className="w-64 bg-card border-r border-border h-screen flex flex-col">
      {/* Tenant Header */}
      {tenantName && (
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-bold">{tenantName}</h2>
          {tenantType && <p className="text-xs text-muted-foreground">{tenantType}</p>}
        </div>
      )}
      
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
          href={`${basePath}/settings`}
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
