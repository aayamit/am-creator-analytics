import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email") || "admin@amcreator.com";
    
    console.log("=== TEST LOGIN API ===");
    console.log("Looking for email:", email);
    
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        brandProfile: true,
        creatorProfile: true,
      },
    });
    
    console.log("User found:", user?.email || "NULL");
    console.log("User ID:", user?.id || "NULL");
    
    return NextResponse.json({
      found: !!user,
      email: user?.email || null,
      id: user?.id || null,
      role: user?.role || null,
    });
  } catch (error: any) {
    console.error("Test login error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
