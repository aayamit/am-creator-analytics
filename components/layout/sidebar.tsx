import { LayoutDashboard, FileText, BarChart3, Wallet, Users, Settings, Bell } from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/dashboard' },
    { icon: <Users size={20} />, label: 'Creators', href: '/dashboard/creators' },
    { icon: <FileText size={20} />, label: 'Campaigns', href: '/dashboard/campaigns' },
    { icon: <BarChart3 size={20} />, label: 'Analytics', href: '/dashboard/analytics' },
    { icon: <Wallet size={20} />, label: 'Earnings', href: '/dashboard/earnings' },
    { icon: <Bell size={20} />, label: 'Notifications', href: '/dashboard/notifications' },
    { icon: <Settings size={20} />, label: 'Settings', href: '/dashboard/settings' },
  ];

  return (
    <div style={{
      width: '250px',
      height: '100vh',
      backgroundColor: '#1a1a2e',
      color: '#F8F7F4',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    }}>
      {/* Logo */}
      <div style={{
        padding: '0 8px',
        marginBottom: '32px',
        fontSize: '20px',
        fontWeight: 700,
        letterSpacing: '-0.02em',
      }}>
        AM Creator
      </div>

      {/* Nav Items */}
      <nav style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        flex: 1,
      }}>
        {navItems.map((item, index) => (
          <a
            key={index}
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
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#92400e'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {item.icon}
            {item.label}
          </a>
        ))}
      </nav>

      {/* User Profile */}
      <div style={{
        borderTop: '1px solid #4b5563',
        paddingTop: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: '#92400e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: 600,
        }}>
          A
        </div>
        <div>
          <div style={{
            fontSize: '14px',
            fontWeight: 500,
          }}>
            Admin
          </div>
          <div style={{
            fontSize: '12px',
            color: '#9ca3af',
          }}>
            admin@amcreator.com
          </div>
        </div>
      </div>
    </div>
  );
}
