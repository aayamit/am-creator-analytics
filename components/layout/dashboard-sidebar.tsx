'use client';

import Link from 'next/link';
import { LayoutDashboard, Users, BarChart3, FileText, Settings, LogOut, TrendingUp, Link2, Bell, Contact, Wallet, Shield, Send, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NotificationBell from '@/components/notifications/notification-bell';
import { signOut, useSession } from 'next-auth/react';

interface DashboardSidebarProps {
  role: "BRAND" | "CREATOR" | "AGENCY" | "ADMIN";
  tenantId?: string;
  tenantName?: string;
  tenantType?: string;
}

export default function DashboardSidebar({ role, tenantId, tenantName, tenantType }: DashboardSidebarProps) {
  const { data: session } = useSession();
  const hasTenantScope = Boolean(tenantId);
  const tenantDashboardBase = tenantId ? `/${tenantId}/dashboard` : null;

  const creatorNav = hasTenantScope
    ? [
        { href: `${tenantDashboardBase}`, label: 'Dashboard', icon: LayoutDashboard },
        { href: `${tenantDashboardBase}/campaigns`, label: 'My Campaigns', icon: TrendingUp },
        { href: `${tenantDashboardBase}/analytics`, label: 'Analytics', icon: BarChart3 },
        { href: `${tenantDashboardBase}/media-kit`, label: 'Media Kit', icon: FileText },
        { href: `${tenantDashboardBase}/connections`, label: 'Connections', icon: Link2 },
        { href: `${tenantDashboardBase}/payouts`, label: 'Payouts', icon: Wallet },
        { href: `${tenantDashboardBase}/notifications`, label: 'Notifications', icon: Bell },
      ]
    : [
        { href: '/creators', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/creators/campaigns', label: 'My Campaigns', icon: TrendingUp },
        { href: '/creators/analytics', label: 'Analytics', icon: BarChart3 },
        { href: '/creators/media-kit', label: 'Media Kit', icon: FileText },
        { href: '/creators/connections', label: 'Connections', icon: Link2 },
        { href: '/creators/pitch', label: 'Pitch to Brand', icon: Send },
        { href: '/creators/settings/payouts', label: 'Payouts', icon: Wallet },
        { href: '/notifications', label: 'Notifications', icon: Bell },
      ];

  const brandNav = hasTenantScope
    ? [
        { href: `${tenantDashboardBase}`, label: 'Dashboard', icon: LayoutDashboard },
        { href: `${tenantDashboardBase}/campaigns`, label: 'Campaigns', icon: TrendingUp },
        { href: `${tenantDashboardBase}/analytics`, label: 'Analytics', icon: BarChart3 },
        { href: `${tenantDashboardBase}/creators`, label: 'Discover', icon: Users },
        { href: `${tenantDashboardBase}/crm`, label: 'CRM', icon: Contact },
        { href: `${tenantDashboardBase}/pitches`, label: 'Pitch Inbox', icon: Inbox },
        { href: `${tenantDashboardBase}/funding`, label: 'Funding', icon: Wallet },
        { href: `${tenantDashboardBase}/notifications`, label: 'Notifications', icon: Bell },
      ]
    : [
        { href: '/brands', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/brands/campaigns/create', label: 'Campaigns', icon: TrendingUp },
        { href: '/brands/analytics', label: 'Analytics', icon: BarChart3 },
        { href: '/brands', label: 'Discover', icon: Users },
        { href: '/brands/crm', label: 'CRM', icon: Contact },
        { href: '/brands/pitches', label: 'Pitch Inbox', icon: Inbox },
        { href: '/brands/funding', label: 'Funding', icon: Wallet },
        { href: '/notifications', label: 'Notifications', icon: Bell },
      ];

  const adminNav = hasTenantScope
    ? [
        { href: `${tenantDashboardBase}/admin`, label: 'Admin', icon: LayoutDashboard },
        { href: `${tenantDashboardBase}/admin/users`, label: 'Users', icon: Users },
        { href: `${tenantDashboardBase}/admin/audit-logs`, label: 'Audit Logs', icon: FileText },
        { href: `${tenantDashboardBase}/admin/gdpr`, label: 'GDPR', icon: Shield },
        { href: `${tenantDashboardBase}/notifications`, label: 'Notifications', icon: Bell },
      ]
    : [
        { href: '/admin', label: 'Admin', icon: LayoutDashboard },
        { href: '/admin/users', label: 'Users', icon: Users },
        { href: '/admin/audit-logs', label: 'Audit Logs', icon: FileText },
        { href: '/admin/gdpr', label: 'GDPR', icon: Shield },
        { href: '/notifications', label: 'Notifications', icon: Bell },
      ];

  const navItems = role === "CREATOR" ? creatorNav : role === "BRAND" ? brandNav : adminNav;
  const settingsHref = hasTenantScope
    ? `${tenantDashboardBase}/settings`
    : role === "CREATOR"
      ? "/creators/settings/payouts"
      : role === "BRAND"
        ? "/brands"
        : "/admin";

  return (
    <aside style={{
      width: '250px',
      height: '100vh',
      backgroundColor: '#1a1a2e',
      color: '#F8F7F4',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      overflowY: 'auto',
    }}>
      {/* Tenant Header */}
      {tenantName && (
        <div style={{
          padding: '0 8px',
          marginBottom: '16px',
          borderBottom: '1px solid #4b5563',
          paddingBottom: '16px',
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            margin: 0,
            marginBottom: '4px',
          }}>
            {tenantName}
          </h2>
          {tenantType && (
            <p style={{
              fontSize: '12px',
              color: '#9ca3af',
              margin: 0,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.05em',
            }}>
              {tenantType}
            </p>
          )}
        </div>
      )}

      {/* Logo if no tenant name */}
      {!tenantName && (
        <div style={{
          padding: '0 8px',
          marginBottom: '32px',
          fontSize: '20px',
          fontWeight: 700,
          letterSpacing: '-0.02em',
        }}>
          AM Creator
        </div>
      )}

      {/* Navigation */}
      <nav style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        flex: 1,
      }}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 12px',
              borderRadius: '6px',
              color: '#F8F7F4',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#92400e')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <item.icon size={20} />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div style={{
        borderTop: '1px solid #4b5563',
        paddingTop: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        {/* Notification Bell */}
        {session?.user?.id && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '8px 0',
          }}>
            <NotificationBell userId={session.user.id} />
          </div>
        )}

        <Link
          href={settingsHref}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 12px',
            borderRadius: '6px',
            color: '#F8F7F4',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 500,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#92400e')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Settings size={20} />
          Settings
        </Link>

        <Button
          variant="ghost"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 12px',
            borderRadius: '6px',
            color: '#F8F7F4',
            fontSize: '14px',
            fontWeight: 500,
            justifyContent: 'flex-start',
            width: '100%',
          }}
          onClick={() => {
            void signOut({ callbackUrl: "/login" });
          }}
        >
          <LogOut size={20} />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
