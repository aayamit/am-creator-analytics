import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// SSE endpoint for real-time analytics updates
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const brand = await prisma.brandProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!brand) {
      return NextResponse.json({ error: "Brand profile not found" }, { status: 404 });
    }

    // Create SSE stream
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        // Send initial data
        const initialData = await getAnalyticsSnapshot(brand.id);
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(initialData)}\n\n`)
        );

        // Poll for updates every 30 seconds
        const interval = setInterval(async () => {
          try {
            const updateData = await getAnalyticsSnapshot(brand.id);
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(updateData)}\n\n`)
            );
          } catch (error) {
            console.error("SSE update error:", error);
          }
        }, 30000);

        // Keep connection alive with heartbeat
        const heartbeat = setInterval(() => {
          try {
            controller.enqueue(encoder.encode(`: heartbeat\n\n`));
          } catch (error) {
            clearInterval(heartbeat);
            clearInterval(interval);
          }
        }, 15000);

        // Cleanup on close
        request.signal?.addEventListener("abort", () => {
          clearInterval(interval);
          clearInterval(heartbeat);
          controller.close();
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
  } catch (error) {
    console.error("SSE error:", error);
    return NextResponse.json(
      { error: "Failed to establish SSE connection" },
      { status: 500 }
    );
  }
}

async function getAnalyticsSnapshot(brandId) {
  // Get recent tracking events (last 5 minutes)
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

  const recentEvents = await prisma.trackingEvent.findMany({
    where: {
      campaign: {
        brandId: brandId,
      },
      timestamp: {
        gte: fiveMinutesAgo,
      },
    },
    orderBy: {
      timestamp: "desc",
    },
    take: 100,
  });

  // Get active campaigns count
  const activeCampaigns = await prisma.campaign.count({
    where: {
      brandId: brandId,
      status: "ACTIVE",
    },
  });

  // Get today's spend
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaySpend = await prisma.payoutTransaction.aggregate({
    where: {
      brandId: brandId,
      createdAt: {
        gte: today,
      },
      status: "PAID",
    },
    _sum: {
      amount: true,
    },
  });

  // Calculate event counts by type
  const eventCounts = recentEvents.reduce(
    (acc, event) => {
      acc[event.eventType] = (acc[event.eventType] || 0) + 1;
      return acc;
    },
    {}
  );

  return {
    timestamp: new Date().toISOString(),
    activeCampaigns,
    todaySpend: todaySpend._sum.amount || 0,
    recentEvents: eventCounts,
    totalRecentEvents: recentEvents.length,
  };
}
