import { NextRequest, NextResponse } from "next/server";
import { sign } from "jsonwebtoken";

/**
 * DEMO ONLY - Quick login bypass for demo tomorrow
 * POST /api/demo-login
 * Body: { "email": "admin@amcreator.com" }
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body.email;

    // Hardcoded users for demo
    const users: Record<string, any> = {
      "admin@amcreator.com": {
        id: "demo-admin-1",
        email: "admin@amcreator.com",
        name: "Demo Admin",
        role: "ADMIN",
      },
      "brand-test@amcreator.com": {
        id: "demo-brand-1",
        email: "brand-test@amcreator.com",
        name: "Demo Brand",
        role: "BRAND",
      },
      "creator-pro@amcreator.com": {
        id: "demo-creator-pro-1",
        email: "creator-pro@amcreator.com",
        name: "Demo Creator Pro",
        role: "CREATOR",
      },
      "creator-elite@amcreator.com": {
        id: "demo-creator-elite-1",
        email: "creator-elite@amcreator.com",
        name: "Demo Creator Elite",
        role: "CREATOR",
      },
    };

    const user = users[email];
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create a simple JWT token (demo only)
    const secret = process.env.NEXTAUTH_SECRET || "demo-secret-123";
    const token = sign(user, secret, { expiresIn: "1d" });

    // Set cookie
    const response = NextResponse.json({ success: true, user });
    response.cookies.set("demo-session", token, {
      httpOnly: true,
      maxAge: 86400, // 1 day
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Demo login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
