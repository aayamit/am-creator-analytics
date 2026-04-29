/**
 * Updated NotificationBell with WebSocket Support
 * Real-time notifications via WebSocket
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useWebSocket } from '@/hooks/use-websocket';

interface NotificationBellProps {
  userId: string;
  tenantId: string;
}

export default function NotificationBell({ userId, tenantId }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  // WebSocket connection for real-time notifications
  const { isConnected, send } = useWebSocket({
    url: `ws://${window.location.host}/ws?userId=${userId}&tenantId=${tenantId}`,
    onMessage: (data) => {
      console.log('📧 WebSocket message:', data);

      if (data.type === 'NOTIFICATION') {
        // Add new notification to list
        setNotifications(prev => [data.notification, ...prev]);
        setUnreadCount(prev => prev + 1);

        // Show browser notification if supported
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(data.notification.title, {
            body: data.notification.message,
            icon: '/icon.png',
          });
        }
      } else if (data.type === 'NOTIFICATION_READ') {
        // Update notification as read
        setNotifications(prev =>
          prev.map(n =>
            n.id === data.notificationId ? { ...n, read: true } : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } else if (data.type === 'WELCOME') {
        console.log('📧 WebSocket:', data.message);
      }
    },
    onConnect: () => {
      console.log('📧 WebSocket connected');
      // Request initial notifications
      send({ type: 'GET_NOTIFICATIONS' });
    },
    onDisconnect: () => {
      console.log('📧 WebSocket disconnected');
    },
  });

  // Fetch initial notifications (fallback if WebSocket fails)
  useEffect(() => {
    if (!open || notifications.length > 0) return;

    fetch(`/api/notifications?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      })
      .catch(err => console.error('Error fetching notifications:', err));
  }, [open, userId, notifications.length]);

  const markAsRead = async (notificationId: string) => {
    try {
      // Optimistic update
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));

      // Send via WebSocket (real-time to other clients)
      if (isConnected) {
        send({ type: 'MARK_NOTIFICATION_READ', notificationId });
      }

      // Also update via REST API
      await fetch(`/api/notifications`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId }),
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // Optimistic update
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);

      // Send via WebSocket
      if (isConnected) {
        send({ type: 'MARK_ALL_READ' });
      }

      // Also update via REST API
      await fetch(`/api/notifications?userId=${userId}&markAllRead=true`, {
        method: 'PATCH',
      });
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'CONTRACT_SIGNED':
        return '✅';
      case 'PAYOUT_SENT':
        return '💰';
      case 'CAMPAIGN_INVITE':
        return '📢';
      default:
        return '🔔';
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          style={{ color: '#F8F7F4' }}
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '8px',
                height: '8px',
                backgroundColor: '#ef4444',
                borderRadius: '50%',
              }}
            />
          )}
          {/* Connection indicator */}
          <span
            style={{
              position: 'absolute',
              bottom: '4px',
              right: '4px',
              width: '6px',
              height: '6px',
              backgroundColor: isConnected ? '#22c55e' : '#ef4444',
              borderRadius: '50%',
            }}
            title={isConnected ? 'Real-time connected' : 'Disconnected'}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0"
        style={{ backgroundColor: 'white', border: '1px solid rgba(26,26,46,0.1)' }}
      >
        <div className="flex items-center justify-between p-4 pb-2">
          <h4 className="font-medium text-sm" style={{ color: '#1a1a2e' }}>
            Notifications
          </h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-auto p-0 text-xs"
              style={{ color: '#92400e' }}
            >
              <CheckCheck size={14} className="mr-1" />
              Mark all read
            </Button>
          )}
        </div>
        <div className="border-t" style={{ borderColor: 'rgba(26,26,46,0.1)' }} />
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm" style={{ color: '#92400e', opacity: 0.6 }}>
            No notifications yet
          </div>
        ) : (
          <ScrollArea className="h-80">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  'p-4 border-b transition-colors hover:bg-gray-50',
                  !notification.read && 'bg-blue-50'
                )}
                style={{
                  borderColor: 'rgba(26,26,46,0.05)',
                  cursor: 'pointer',
                }}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium" style={{ color: '#1a1a2e' }}>
                      {notification.title}
                    </p>
                    <p className="text-xs" style={{ color: '#92400e', opacity: 0.8 }}>
                      {notification.message}
                    </p>
                    <p className="text-xs" style={{ color: '#92400e', opacity: 0.5 }}>
                      {formatTimeAgo(notification.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
}
