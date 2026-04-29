'use client';

import Link from 'next/link';
import { LayoutDashboard, Users, BarChart3, FileText, Settings, LogOut, TrendingUp, Link2, Bell, Contact, Wallet, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NotificationBell from '@/components/notifications/notification-bell';

interface DashboardSidebarProps {
  role: "BRAND" | "CREATOR" | "AGENCY" | "ADMIN";
  tenantId: string;
  tenantName?: string;
  tenantType?: string;
}

export default function DashboardSidebar({ role, tenantId, tenantName, tenantType }: DashboardSidebarProps) {
  const basePath = `/${tenantId}`;
  
  const creatorNav = [
    { href: `${basePath}/dashboard`, label: 'Dashboard', icon: LayoutDashboard },
    { href: `${basePath}/dashboard/campaigns`, label: 'My Campaigns', icon: TrendingUp },
    { href: `${basePath}/dashboard/analytics`, label: 'Analytics', icon: BarChart3 },
    { href: `${basePath}/dashboard/media-kit`, label: 'Media Kit', icon: FileText },
    { href: `${basePath}/dashboard/connections`, label: 'Connections', icon: Link2 },
    { href: `${basePath}/dashboard/settings/payouts`, label: 'Payout Settings', icon: Wallet },
    { href: `${basePath}/notifications/preferences`, label: 'Notification Settings', icon: Bell },
  ];

  const brandNav = [
    { href: `${basePath}/dashboard`, label: 'Dashboard', icon: LayoutDashboard },
    { href: `${basePath}/dashboard/campaigns`, label: 'Campaigns', icon: TrendingUp },
    { href: `${basePath}/dashboard/analytics`, label: 'Analytics', icon: BarChart3 },
    { href: `${basePath}/dashboard/creators`, label: 'Discover', icon: Users },
    { href: `${basePath}/dashboard/crm`, label: 'CRM', icon: Contact },
    { href: `${basePath}/dashboard/funding`, label: 'Funding', icon: Wallet },
    { href: `${basePath}/dashboard/settings`, label: 'Settings', icon: Settings },
    { href: `${basePath}/notifications/preferences`, label: 'Notification Settings', icon: Bell },
  ];

  const adminNav = [
    { href: `${basePath}/dashboard/admin`, label: 'Admin', icon: LayoutDashboard },
    { href: `${basePath}/dashboard/admin/users`, label: 'Users', icon: Users },
    { href: `${basePath}/dashboard/admin/audit-logs`, label: 'Audit Logs', icon: FileText },
    { href: `${basePath}/dashboard/admin/gdpr`, label: 'GDPR', icon: Shield },
  ];

  const navItems = role === "CREATOR" ? creatorNav : role === "BRAND" ? brandNav : adminNav;

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
          marginBottom: '32px',
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
        <NotificationBell />
        
        <Link
          href={`${basePath}/dashboard/settings`}
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
            // Sign out logic
          }}
        >
          <LogOut size={20} />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
