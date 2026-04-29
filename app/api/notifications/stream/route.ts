/**
 * Notification SSE (Server-Sent Events) Route
 * Real-time notification stream
 */

import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/nextauth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const userId = session.user.id;
  const encoder = new TextEncoder();
  let closed = false;

  const stream = new ReadableStream({
    async start(controller) {
      // Send initial unread count
      const unreadCount = await prisma.notification.count({
        where: { userId, isRead: false },
      });
      controller.enqueue(encoder.encode(`event: unread-count\ndata: ${JSON.stringify({ count: unreadCount })}\n\n`));

      // Poll for new notifications every 5 seconds
      const interval = setInterval(async () => {
        if (closed) {
          clearInterval(interval);
          return;
        }

        try {
          const latestNotification = await prisma.notification.findFirst({
            where: { userId, isRead: false },
            orderBy: { createdAt: 'desc' },
          });

          if (latestNotification) {
            controller.enqueue(encoder.encode(`event: notification\ndata: ${JSON.stringify(latestNotification)}\n\n`));
          }

          const newUnreadCount = await prisma.notification.count({
            where: { userId, isRead: false },
          });

          controller.enqueue(encoder.encode(`event: unread-count\ndata: ${JSON.stringify({ count: newUnreadCount })}\n\n`));
        } catch (error) {
          console.error('SSE error:', error);
        }
      }, 5000);

      // Cleanup on close
      request.signal?.addEventListener('abort', () => {
        closed = true;
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
