import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Protect dashboard routes
    if (path.startsWith("/brands") && token?.role !== "BRAND") {
      return NextResponse.redirect(new URL("/login?role=BRAND", req.url));
    }

    if (path.startsWith("/creators") && token?.role !== "CREATOR") {
      return NextResponse.redirect(new URL("/login?role=CREATOR", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/brands/:path*", "/creators/:path*"],
};
