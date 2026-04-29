'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, X, CheckCheck } from 'lucide-react';
import Link from 'next/link';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export default function NotificationBell({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Fetch initial notifications
  useEffect(() => {
    fetchNotifications();
    setupSSE();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/notifications?limit=10');
      const data = await res.json();
      if (data.notifications) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupSSE = () => {
    const eventSource = new EventSource('/api/notifications/stream');
    eventSourceRef.current = eventSource;

    eventSource.addEventListener('notification', (event) => {
      const notification = JSON.parse(event.data);
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    eventSource.addEventListener('unread-count', (event) => {
      const data = JSON.parse(event.data);
      setUnreadCount(data.count);
    });

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      eventSource.close();
      // Attempt to reconnect after 5 seconds
      setTimeout(setupSSE, 5000);
    };
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId }),
      });
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllAsRead: true }),
      });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
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
    <div style={{ position: 'relative' }}>
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          position: 'relative',
          padding: '8px',
          borderRadius: '6px',
          backgroundColor: isOpen ? '#f1f5f9' : 'transparent',
          color: '#1a1a2e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            backgroundColor: '#dc2626',
            color: '#F8F7F4',
            fontSize: '10px',
            fontWeight: 600,
            minWidth: '16px',
            height: '16px',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 4px',
          }}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '8px',
          width: '360px',
          maxHeight: '480px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
          zIndex: 1000,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Header */}
          <div style={{
            padding: '16px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <h3 style={{
              margin: 0,
              color: '#1a1a2e',
              fontSize: '16px',
              fontWeight: 600,
            }}>
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#92400e',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <CheckCheck size={14} /> Mark all read
              </button>
            )}
          </div>

          {/* Notification List */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
          }}>
            {loading ? (
              <div style={{
                padding: '32px',
                textAlign: 'center',
                color: '#6b7280',
                fontSize: '14px',
              }}>
                Loading...
              </div>
            ) : notifications.length === 0 ? (
              <div style={{
                padding: '32px',
                textAlign: 'center',
                color: '#6b7280',
                fontSize: '14px',
              }}>
                No notifications yet.
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => {
                    if (!notification.isRead) {
                      markAsRead(notification.id);
                    }
                    if (notification.link) {
                      window.location.href = notification.link;
                    }
                  }}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #f1f5f9',
                    backgroundColor: notification.isRead ? 'transparent' : '#f9fafb',
                    cursor: notification.link ? 'pointer' : 'default',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.backgroundColor = '#f9fafb';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.backgroundColor = notification.isRead ? 'transparent' : '#f9fafb';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start',
                  }}>
                    <span style={{ fontSize: '20px' }}>
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        color: '#1a1a2e',
                        fontSize: '14px',
                        fontWeight: notification.isRead ? 400 : 600,
                        marginBottom: '2px',
                      }}>
                        {notification.title}
                      </div>
                      <div style={{
                        color: '#6b7280',
                        fontSize: '12px',
                        lineHeight: '1.4',
                      }}>
                        {notification.message}
                      </div>
                      <div style={{
                        color: '#9ca3af',
                        fontSize: '11px',
                        marginTop: '4px',
                      }}>
                        {formatTimeAgo(notification.createdAt)}
                      </div>
                    </div>
                    {!notification.isRead && (
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#92400e',
                        flexShrink: 0,
                        marginTop: '4px',
                      }} />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div style={{
            padding: '12px 16px',
            borderTop: '1px solid #e5e7eb',
            textAlign: 'center',
          }}>
            <Link
              href="/notifications"
              style={{
                color: '#92400e',
                fontSize: '12px',
                textDecoration: 'none',
                fontWeight: 500,
              }}
              onClick={() => setIsOpen(false)}
            >
              View all notifications →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
