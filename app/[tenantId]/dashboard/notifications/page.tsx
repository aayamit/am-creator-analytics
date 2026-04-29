/**
 * Notifications Page
 * Full list of all notifications
 */

import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, CheckCheck, Filter } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/nextauth';

export const metadata: Metadata = {
  title: 'Notifications | AM Creator Analytics',
  description: 'View all your notifications',
};

export default async function NotificationsPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <div>Unauthorized</div>;
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'CONTRACT_SIGNED': return '✅';
      case 'PAYOUT_COMPLETED': return '💰';
      case 'CAMPAIGN_CREATED': return '📢';
      case 'DPDPA_REQUEST': return '🔒';
      default: return '🔔';
    }
  };

  return (
    <div style={{
      backgroundColor: '#F8F7F4',
      minHeight: '100vh',
      padding: '16px',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      '@media (min-width: 768px)': {
        padding: '32px',
      },
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginBottom: '24px',
        '@media (min-width: 768px)': {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
      }}>
        <div>
          <h1 style={{
            color: '#1a1a2e',
            fontSize: '24px',
            fontWeight: 600,
            marginBottom: '4px',
            '@media (min-width: 768px)': {
              fontSize: '28px',
            },
          }}>
            Notifications
          </h1>
          <p style={{
            color: '#92400e',
            fontSize: '14px',
            margin: 0,
          }}>
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          style={{
            backgroundColor: '#f1f5f9',
            color: '#1a1a2e',
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid #e5e7eb',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            width: '100%',
            justifyContent: 'center',
            '@media (min-width: 768px)': {
              width: 'auto',
            },
          }}
        >
          <CheckCheck size={16} /> Mark All as Read
        </button>
      </div>

      {/* Notifications List */}
      <Card style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        overflow: 'hidden',
      }}>
        {notifications.length === 0 ? (
          <CardContent style={{
            padding: '48px 24px',
            textAlign: 'center',
            color: '#6b7280',
          }}>
            <Bell size={48} style={{ color: '#d1d5db', marginBottom: '16px' }} />
            <p style={{ fontSize: '16px', marginBottom: '8px' }}>No notifications yet</p>
            <p style={{ fontSize: '14px' }}>When you get notifications, they'll appear here.</p>
          </CardContent>
        ) : (
          <div>
            {notifications.map((notification, index) => (
              <div
                key={notification.id}
                style={{
                  padding: '16px',
                  borderBottom: index < notifications.length - 1 ? '1px solid #f1f5f9' : 'none',
                  backgroundColor: notification.isRead ? 'transparent' : '#f9fafb',
                  transition: 'background-color 0.2s',
                }}
              >
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                }}>
                  <span style={{ fontSize: '24px' }}>
                    {getNotificationIcon(notification.type)}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '4px',
                    }}>
                      <span style={{
                        color: '#1a1a2e',
                        fontSize: '14px',
                        fontWeight: notification.isRead ? 400 : 600,
                      }}>
                        {notification.title}
                      </span>
                      <span style={{
                        color: '#9ca3af',
                        fontSize: '11px',
                        whiteSpace: 'nowrap' as const,
                        marginLeft: '8px',
                      }}>
                        {formatTimeAgo(notification.createdAt)}
                      </span>
                    </div>
                    <p style={{
                      color: '#6b7280',
                      fontSize: '13px',
                      lineHeight: '1.5',
                      margin: '0 0 4px 0',
                    }}>
                      {notification.message}
                    </p>
                    {!notification.isRead && (
                      <span style={{
                        fontSize: '11px',
                        color: '#92400e',
                        fontWeight: 600,
                      }}>
                        New
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
