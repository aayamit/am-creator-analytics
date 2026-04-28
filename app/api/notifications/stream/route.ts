import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/nextauth';
import { notificationEmitter } from '@/lib/notification-events';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const userId = session.user.id;
  
  // Create a ReadableStream for SSE
  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection established message
      const encoder = new TextEncoder();
      const initialData = {
        type: 'connected',
        unreadCount: 0, // Will be updated below
      };
      
      // Get initial unread count
      prisma.notification.count({
        where: { userId, read: false },
      }).then(count => {
        initialData.unreadCount = count;
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(initialData)}\n\n`));
      });
      
      // Listen for new notifications for this user
      const notificationHandler = (data: any) => {
        if (data.userId === userId) {
          const event = {
            type: 'notification',
            notification: data.notification,
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        }
      };
      
      notificationEmitter.on('new-notification', notificationHandler);
      
      // Send heartbeat every 30 seconds to keep connection alive
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: heartbeat\n\n`));
        } catch (e) {
          clearInterval(heartbeat);
        }
      }, 30000);
      
      // Clean up on close
      request.signal.addEventListener('abort', () => {
        notificationEmitter.off('new-notification', notificationHandler);
        clearInterval(heartbeat);
        try {
          controller.close();
        } catch (e) {
          // Already closed
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
