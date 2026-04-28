import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// SSE endpoint for real-time notifications
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message with unread count
      const sendUnreadCount = async () => {
        try {
          const unreadCount = await prisma.notification.count({
            where: {
              userId: session.user.id,
              read: false,
            },
          });

          const data = JSON.stringify({
            type: "connected",
            unreadCount,
          });
          controller.enqueue(`data: ${data}\n\n`);
        } catch (error) {
          console.error("SSE unread count error:", error);
        }
      };

      sendUnreadCount();

      // Poll for new notifications every 5 seconds
      const interval = setInterval(async () => {
        try {
          const latestNotification = await prisma.notification.findFirst({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
          });

          if (latestNotification) {
            const data = JSON.stringify({
              type: "notification",
              notification: {
                id: latestNotification.id,
                type: latestNotification.type,
                title: latestNotification.title,
                message: latestNotification.message,
                read: latestNotification.read,
                link: latestNotification.link,
                createdAt: latestNotification.createdAt.toISOString(),
              },
            });
            controller.enqueue(`data: ${data}\n\n`);
          }
        } catch (error) {
          console.error("SSE poll error:", error);
        }
      }, 5000);

      // Cleanup on close
      request.signal?.addEventListener("abort", () => {
        clearInterval(interval);
      });
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
