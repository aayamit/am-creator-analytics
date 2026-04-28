import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { sendEmail, WelcomeEmail } from "@/lib/email";
import { render } from "@react-email/render";
import { randomBytes } from "crypto";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, role, termsAccepted, privacyAccepted } = body;

    // Validate input
    if (!email || !password || !role) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!termsAccepted || !privacyAccepted) {
      return NextResponse.json(
        { message: "You must accept the Terms of Service and Privacy Policy" },
        { status: 400 }
      );
    }

    if (role !== "BRAND" && role !== "CREATOR") {
      return NextResponse.json(
        { message: "Invalid role" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email,
          name,
          role,
        },
      });

      // Create account with credentials
      await tx.account.create({
        data: {
          userId: user.id,
          type: "credentials",
          provider: "credentials",
          providerAccountId: user.id,
        },
      });

      // Store terms acceptance (store in a simple way - could be a separate model)
      // For now, we'll store in a simple log
      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: "TERMS_ACCEPTED",
          resource: `User:${user.id}`,
          metadata: {
            termsVersion: "1.0",
            privacyVersion: "1.0",
            acceptedAt: new Date().toISOString(),
          },
        },
      });

      // Create role-specific profile
      if (role === "BRAND") {
        await tx.brandProfile.create({
          data: {
            userId: user.id,
            companyName: name || "New Company",
          },
        });
      } else {
        await tx.creatorProfile.create({
          data: {
            userId: user.id,
            displayName: name || "New Creator",
          },
        });
      }

      return user;
    });

    // Generate verification token
    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    // Send verification email
    const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify?token=${token}&email=${encodeURIComponent(email)}`;
    const emailHtml = await render(VerificationEmail({
      name: name || "Creator",
      verificationUrl,
    }));

    await sendEmail({
      to: email,
      subject: "Verify your email - AM Creator Analytics",
      html: emailHtml,
    });

    return NextResponse.json(
      {
        message: "User created successfully. Please check your email to verify your account.",
        userId: result.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
