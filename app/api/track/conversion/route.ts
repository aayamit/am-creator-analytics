import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

// 1x1 transparent PNG (base64)
const PIXEL_PNG_BASE64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
const PIXEL_BUFFER = Buffer.from(PIXEL_PNG_BASE64, "base64");

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    // Extract tracking parameters
    const type = searchParams.get("type") || "PAGE_VIEW";
    const leadId = searchParams.get("leadId") || undefined;
    const campaignId = searchParams.get("campaignId") || undefined;
    const creatorId = searchParams.get("creatorId") || undefined;
    
    // Attribution data
    const utmSource = searchParams.get("utm_source") || undefined;
    const utmMedium = searchParams.get("utm_medium") || undefined;
    const utmCampaign = searchParams.get("utm_campaign") || undefined;
    const utmContent = searchParams.get("utm_content") || undefined;
    const referrer = searchParams.get("referrer") || req.headers.get("referer") || undefined;
    
    // Identity resolution
    const email = searchParams.get("email") || undefined;
    const fingerprint = searchParams.get("fp") || undefined;
    
    // Conversion value
    const value = searchParams.get("value") ? parseFloat(searchParams.get("value")!) : undefined;
    
    // Preserve original attribution (critical for CRM contact merges)
    const originalEmail = searchParams.get("original_email") || email;
    const originalSource = searchParams.get("original_source") || utmSource;
    
    // Get IP and hash it for privacy
    const ipAddress = req.headers.get("x-forwarded-for") || 
                     req.headers.get("x-real-ip") || 
                     "unknown";
    const hashedIp = crypto.createHash("sha256").update(ipAddress).digest("hex");
    
    // Get user agent
    const userAgent = req.headers.get("user-agent") || undefined;
    
    // Multi-touch attribution: increment touch point
    let touchPoint = 1;
    if (leadId) {
      const lastTouch = await prisma.trackingEvent.findFirst({
        where: { leadId },
        orderBy: { touchPoint: "desc" },
      });
      if (lastTouch) {
        touchPoint = lastTouch.touchPoint + 1;
      }
    }
    
    // Validate event type
    const validTypes = ["PAGE_VIEW", "FORM_FILL", "DEMO_REQUEST", "DEAL_CLOSED", "CLICK", "CONVERSION"];
    const eventType = validTypes.includes(type) ? type : "PAGE_VIEW";
    
    // Store tracking event
    await prisma.trackingEvent.create({
      data: {
        leadId,
        campaignId,
        creatorId,
        type: eventType,
        url: url.pathname + url.search,
        referrer,
        utmSource,
        utmMedium,
        utmCampaign,
        utmContent,
        originalEmail,
        originalSource,
        touchPoint,
        ipAddress: hashedIp, // Store only hashed IP
        userAgent,
        fingerprint,
        value: value ? value : undefined,
        metadata: {
          method: "PIXEL",
          timestamp: new Date().toISOString(),
        },
      },
    });
    
    // Update lead's lastTouchAt if leadId provided
    if (leadId) {
      await prisma.lead.update({
        where: { id: leadId },
        data: { lastTouchAt: new Date() },
      }).catch((err) => {
        console.error("Failed to update lead lastTouchAt:", err);
      });
    }
    
  } catch (error) {
    console.error("Tracking pixel error:", error);
    // Still return pixel even on error (don't break client pages)
  }
  
  // Always return 1x1 transparent PNG
  return new NextResponse(PIXEL_BUFFER, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Content-Length": PIXEL_BUFFER.length.toString(),
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
      "Access-Control-Allow-Origin": "*", // Allow from any domain
    },
  });
}

// Also support POST for programmatic tracking (no pixel needed)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const {
      type = "CONVERSION",
      leadId,
      campaignId,
      creatorId,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      email,
      fingerprint,
      value,
      original_email,
      original_source,
      url,
      metadata,
    } = body;
    
    // Hash IP
    const ipAddress = req.headers.get("x-forwarded-for") || "unknown";
    const hashedIp = crypto.createHash("sha256").update(ipAddress).digest("hex");
    
    // Multi-touch attribution
    let touchPoint = 1;
    if (leadId) {
      const lastTouch = await prisma.trackingEvent.findFirst({
        where: { leadId },
        orderBy: { touchPoint: "desc" },
      });
      if (lastTouch) {
        touchPoint = lastTouch.touchPoint + 1;
      }
    }
    
    const event = await prisma.trackingEvent.create({
      data: {
        leadId,
        campaignId,
        creatorId,
        type,
        url,
        referrer: req.headers.get("referer") || undefined,
        utmSource: utm_source,
        utmMedium: utm_medium,
        utmCampaign: utm_campaign,
        utmContent: utm_content,
        originalEmail: original_email || email,
        originalSource: original_source || utm_source,
        touchPoint,
        ipAddress: hashedIp,
        userAgent: req.headers.get("user-agent") || undefined,
        fingerprint,
        value: value ? parseFloat(value) : undefined,
        metadata: metadata || { method: "POST" },
      },
    });
    
    return NextResponse.json({ success: true, eventId: event.id });
    
  } catch (error) {
    console.error("Tracking POST error:", error);
    return NextResponse.json({ error: "Tracking failed" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
