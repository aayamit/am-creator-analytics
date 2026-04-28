import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { randomBytes } from "crypto";
import { sendEmail, VerificationEmail } from "@/lib/email";
import { render } from "@react-email/render";

const prisma = new PrismaClient();

// POST /api/auth/verify-request - Request email verification
export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { message: "Email already verified" },
        { status: 200 }
      );
    }

    // Generate verification token
    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store token in VerificationToken model
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    // Create verification URL
    const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify?token=${token}&email=${encodeURIComponent(email)}`;

    // Send verification email
    const emailHtml = await render(VerificationEmail({
      name: user.name || "Creator",
      verificationUrl,
    }));

    await sendEmail({
      to: email,
      subject: "Verify your email - AM Creator Analytics",
      html: emailHtml,
    });

    return NextResponse.json({
      success: true,
      message: "Verification email sent",
    });
  } catch (error) {
    console.error("Verification request error:", error);
    return NextResponse.json(
      { error: "Failed to send verification email" },
      { status: 500 }
    );
  }
}
