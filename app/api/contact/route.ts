import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, type, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // In production, you would:
    // 1. Send email via SendGrid/Resend
    // 2. Save to database
    // 3. Create a ticket in Zendesk/Intercom

    // For now, log to console and save to audit log
    console.log("Contact form submission:", {
      name,
      email,
      subject,
      type,
      message,
    });

    // Save to audit log
    await prisma.auditLog.create({
      data: {
        action: "CONTACT_FORM_SUBMISSION",
        resource: `Contact:${type || "general"}`,
        metadata: {
          name,
          email,
          subject,
          message: message.substring(0, 200), // Truncate for safety
        },
      },
    });

    return NextResponse.json(
      { success: true, message: "Thank you for contacting us! We'll respond within 24 hours." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
