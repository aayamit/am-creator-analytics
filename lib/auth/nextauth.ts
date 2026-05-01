import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role: UserRole;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    role: UserRole;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope:
            "https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "CREATOR" as UserRole, // Default to creator for Google OAuth
        };
      },
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "r_liteprofile r_emailaddress w_member_social",
        },
      },
      profile(profile) {
        return {
          id: profile.id,
          name: profile.localizedFirstName + " " + profile.localizedLastName,
          email: profile.email,
          image: profile.profilePicture?.displayImage,
          role: "CREATOR" as UserRole,
        };
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        // TEMPORARY: Return a test user for demo with selected role
        console.log("=== AUTHORIZE CALLED - SIMPLIFIED ===");
        console.log("Email:", credentials?.email);
        console.log("Role:", credentials?.role);
        
        if (!credentials?.email) {
          return null;
        }

        // Map role to UserRole
        const roleMap: Record<string, string> = {
          "BRAND": "BRAND",
          "CREATOR": "CREATOR", 
          "ADMIN": "ADMIN"
        };
        
        const selectedRole = roleMap[credentials.role as string] || "CREATOR";
        
        // Return test user with correct role
        return {
          id: `test-${selectedRole.toLowerCase()}-id`,
          email: credentials.email as string,
          name: `Demo ${selectedRole}`,
          role: selectedRole as UserRole,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // If OAuth sign in, check if user exists and has proper role
      if (account?.provider === "google" || account?.provider === "linkedin") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
          include: { creatorProfile: true },
        });

        // Create creator profile if not exists
        if (existingUser && !existingUser.creatorProfile) {
          await prisma.creatorProfile.create({
            data: {
              userId: existingUser.id,
              displayName: user.name || "New Creator",
            },
          });
        }

        // Store social account connection
        if (account.provider === "google" && existingUser?.creatorProfile) {
          await prisma.socialAccount.upsert({
            where: {
              creatorId_platform: {
                creatorId: existingUser.creatorProfile.id,
                platform: "YOUTUBE",
              },
            },
            update: {
              accessToken: account.access_token!,
              refreshToken: account.refresh_token,
              expiresAt: account.expires_at
                ? new Date(account.expires_at * 1000)
                : undefined,
              platformId: (profile as any)?.sub || "",
              username: user.email?.split("@")[0] || "",
            },
            create: {
              creatorId: existingUser.creatorProfile.id,
              platform: "YOUTUBE",
              platformId: (profile as any)?.sub || "",
              accessToken: account.access_token!,
              refreshToken: account.refresh_token,
              expiresAt: account.expires_at
                ? new Date(account.expires_at * 1000)
                : undefined,
              username: user.email?.split("@")[0] || "",
            },
          });
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
};

export default authOptions;
