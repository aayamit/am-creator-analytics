import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendEmail, PasswordResetEmail } from "@/lib/email";
import { render } from "@react-email/render";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

const prisma = new PrismaClient();

// GET /api/auth/verify - Verify email with token
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      return NextResponse.redirect(
        new URL("/login?error=invalid_verification_link", process.env.NEXTAUTH_URL)
      );
    }

    // Find and validate token
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        token,
        identifier: email,
        expires: { gt: new Date() },
      },
    });

    if (!verificationToken) {
      return NextResponse.redirect(
        new URL("/login?error=invalid_or_expired_token", process.env.NEXTAUTH_URL)
      );
    }

    // Update user's emailVerified
    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    });

    // Delete used token
    await prisma.verificationToken.delete({
      where: { identifier_token: { identifier: email, token } },
    });

    // Redirect to success page
    return NextResponse.redirect(
      new URL("/login?verified=true", process.env.NEXTAUTH_URL)
    );
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.redirect(
      new URL("/login?error=verification_failed", process.env.NEXTAUTH_URL)
    );
  }
}

// POST /api/auth/forgot-password - Request password reset
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

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({ success: true, message: "If the email exists, a reset link has been sent" });
    }

    // Generate reset token
    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store token (using VerificationToken model for simplicity)
    await prisma.verificationToken.create({
      data: {
        identifier: `reset:${email}`,
        token,
        expires,
      },
    });

    // Create reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    // Send reset email
    const emailHtml = await render(PasswordResetEmail({
      name: user.name || "User",
      resetUrl,
    }));

    await sendEmail({
      to: email,
      subject: "Reset your password - AM Creator Analytics",
      html: emailHtml,
    });

    return NextResponse.json({
      success: true,
      message: "If the email exists, a reset link has been sent",
    });
  } catch (error) {
    console.error("Password reset request error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
