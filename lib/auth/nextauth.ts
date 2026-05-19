import type { NextAuthOptions } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import type { OAuthConfig } from "next-auth/providers/oauth";
import { SocialPlatform, UserRole } from "@prisma/client";
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

interface InstagramBusinessProfile extends Record<string, unknown> {
  id?: string;
  user_id?: string;
  username?: string;
  account_type?: string;
  media_count?: number;
}

type AuthDbUser = {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  role: UserRole;
};

function toAdapterUser(user: AuthDbUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email ?? "",
    emailVerified: user.emailVerified,
    image: null,
    role: user.role,
  };
}

const authAdapter: Adapter = {
  async createUser(data) {
    const user = await prisma.user.create({
      data: {
        id: data.id ?? crypto.randomUUID(),
        name: data.name ?? null,
        email: data.email ?? null,
        emailVerified: data.emailVerified ?? null,
        role:
          "role" in data && data.role === UserRole.BRAND
            ? UserRole.BRAND
            : "role" in data && data.role === UserRole.ADMIN
              ? UserRole.ADMIN
              : UserRole.CREATOR,
        updatedAt: new Date(),
      },
    });

    return toAdapterUser(user);
  },
  async getUser(id) {
    const user = await prisma.user.findUnique({ where: { id } });
    return user ? toAdapterUser(user) : null;
  },
  async getUserByEmail(email) {
    const user = await prisma.user.findUnique({ where: { email } });
    return user ? toAdapterUser(user) : null;
  },
  async getUserByAccount(provider_providerAccountId) {
    const account = await prisma.account.findUnique({
      where: { provider_providerAccountId },
      include: { User: true },
    });

    return account?.User ? toAdapterUser(account.User) : null;
  },
  async updateUser(data) {
    const user = await prisma.user.update({
      where: { id: data.id },
      data: {
        name: data.name === undefined ? undefined : data.name,
        email: data.email === undefined ? undefined : data.email,
        emailVerified:
          data.emailVerified === undefined ? undefined : data.emailVerified,
        updatedAt: new Date(),
      },
    });

    return toAdapterUser(user);
  },
  async deleteUser(id) {
    const user = await prisma.user.delete({ where: { id } });
    return toAdapterUser(user);
  },
  async linkAccount(data) {
    await prisma.account.upsert({
      where: {
        provider_providerAccountId: {
          provider: data.provider,
          providerAccountId: data.providerAccountId,
        },
      },
      update: {
        userId: data.userId,
        type: data.type,
      },
      create: {
        id: crypto.randomUUID(),
        userId: data.userId,
        type: data.type,
        provider: data.provider,
        providerAccountId: data.providerAccountId,
      },
    });
  },
  async unlinkAccount(provider_providerAccountId) {
    await prisma.account.delete({ where: { provider_providerAccountId } });
  },
  async getSessionAndUser(sessionToken) {
    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { User: true },
    });

    if (!session) {
      return null;
    }

    const { User, ...sessionData } = session;
    return {
      session: sessionData,
      user: toAdapterUser(User),
    };
  },
  async createSession(data) {
    return prisma.session.create({
      data: {
        id: data.id ?? crypto.randomUUID(),
        sessionToken: data.sessionToken,
        userId: data.userId,
        expires: data.expires,
      },
    });
  },
  async updateSession(data) {
    return prisma.session.update({
      where: { sessionToken: data.sessionToken },
      data: {
        expires: data.expires,
        userId: data.userId === undefined ? undefined : data.userId,
      },
    });
  },
  async deleteSession(sessionToken) {
    await prisma.session.delete({ where: { sessionToken } });
  },
  async createVerificationToken(data) {
    return prisma.verificationToken.create({ data });
  },
  async useVerificationToken(identifier_token) {
    try {
      return await prisma.verificationToken.delete({
        where: { identifier_token },
      });
    } catch {
      return null;
    }
  },
};

// Creator login/linking only needs profile-level access. Keep the auth scope
// minimal so the onboarding flow is not blocked on later-stage permissions.
const INSTAGRAM_BUSINESS_SCOPE = "instagram_business_basic";

function buildInstagramPlaceholderEmail(profile: InstagramBusinessProfile) {
  const rawId =
    (typeof profile.id === "string" && profile.id) ||
    (typeof profile.user_id === "string" && profile.user_id) ||
    crypto.randomUUID();
  const rawUsername =
    (typeof profile.username === "string" && profile.username.toLowerCase()) ||
    "creator";
  const normalizedUsername =
    rawUsername.replace(/[^a-z0-9._-]/g, "") || "creator";

  return `instagram-${normalizedUsername}-${rawId}@users.amcreatoranalytics.invalid`;
}

function InstagramBusinessProvider(options: {
  clientId: string;
  clientSecret: string;
}): OAuthConfig<InstagramBusinessProfile> {
  return {
    id: "instagram",
    name: "Instagram",
    type: "oauth",
    authorization: {
      url: "https://www.instagram.com/oauth/authorize",
      params: {
        response_type: "code",
        scope: INSTAGRAM_BUSINESS_SCOPE,
      },
    },
    token: {
      url: "https://api.instagram.com/oauth/access_token",
      async request(context) {
        const { provider, params: { code }, client } = context;
        
        console.log("=== INSTAGRAM TOKEN EXCHANGE START ===");
        console.log("1. provider.callbackUrl (NextAuth default):", provider.callbackUrl);
        
        const body = new URLSearchParams({
          client_id: provider.clientId as string,
          client_secret: provider.clientSecret as string,
          grant_type: "authorization_code",
          redirect_uri: provider.callbackUrl,
          code: code as string,
        });

        console.log("4. Body being sent:", body.toString());

        const response = await fetch("https://api.instagram.com/oauth/access_token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: body.toString(),
        });

        const tokens = await response.json();

        if (!response.ok) {
          console.error("=== INSTAGRAM TOKEN EXCHANGE FAILED ===");
          console.error("Response:", tokens);
          throw new Error(`Instagram token exchange failed: ${JSON.stringify(tokens)}`);
        }

        console.log("=== INSTAGRAM TOKEN EXCHANGE SUCCESS ===");
        return { tokens };
      }
    },
    userinfo: {
      async request({ tokens }) {
        const url = new URL("https://graph.instagram.com/me");
        url.searchParams.set(
          "fields",
          "id,username,account_type,media_count"
        );
        url.searchParams.set("access_token", tokens.access_token ?? "");

        const response = await fetch(url.toString());
        const profile = (await response.json()) as InstagramBusinessProfile & {
          error?: { message?: string };
        };

        if (!response.ok) {
          throw new Error(
            profile.error?.message || "Instagram profile lookup failed"
          );
        }

        return profile;
      },
    },
    client: {
      token_endpoint_auth_method: "client_secret_post",
    },
    async profile(profile) {
      const profileId =
        (typeof profile.id === "string" && profile.id) ||
        (typeof profile.user_id === "string" && profile.user_id) ||
        crypto.randomUUID();

      return {
        id: profileId,
        name:
          (typeof profile.username === "string" && profile.username) ||
          "Instagram Creator",
        email: buildInstagramPlaceholderEmail({ ...profile, id: profileId }),
        image: null,
        role: UserRole.CREATOR,
      };
    },
    style: {
      logo: "/instagram.svg",
      bg: "#fff",
      text: "#000",
    },
    options,
  };
}

type CreatorOauthUser = {
  id?: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
  role?: UserRole;
};

type CreatorOauthAccount = {
  provider?: string;
  access_token?: string | null;
  refresh_token?: string | null;
  expires_at?: number | null;
  providerAccountId?: string | null;
};

async function syncCreatorOauthAccount({
  user,
  account,
  profile,
}: {
  user: CreatorOauthUser;
  account: CreatorOauthAccount;
  profile?: Record<string, unknown> | null;
}) {
  const provider = account.provider;

  if (
    provider !== "google" &&
    provider !== "linkedin" &&
    provider !== "instagram"
  ) {
    return;
  }

  const dbUser =
    (user.id
      ? await prisma.user.findUnique({
          where: { id: user.id },
        })
      : null) ??
    (user.email
      ? await prisma.user.findUnique({
          where: { email: user.email },
        })
      : null);

  if (!dbUser) {
    return;
  }

  if (dbUser.role !== UserRole.CREATOR) {
    await prisma.user.update({
      where: { id: dbUser.id },
      data: { role: UserRole.CREATOR },
    });
  }

  const creatorProfile = await prisma.creatorProfile.upsert({
    where: { userId: dbUser.id },
    update: {
      displayName: user.name || dbUser.name || "New Creator",
      updatedAt: new Date(),
    },
    create: {
      id: crypto.randomUUID(),
      userId: dbUser.id,
      displayName: user.name || dbUser.name || "New Creator",
      updatedAt: new Date(),
    },
  });

  const profileData = (profile ?? {}) as Record<string, unknown>;
  const tokenExpiresAt = account.expires_at
    ? new Date(account.expires_at * 1000)
    : null;

  if (provider === "instagram") {
    const accountId =
      (typeof profileData.username === "string" && profileData.username) ||
      (typeof profileData.id === "string" && profileData.id) ||
      account.providerAccountId ||
      dbUser.id;

    await prisma.socialAccount.upsert({
      where: {
        creatorId_platform_accountId: {
          creatorId: creatorProfile.id,
          platform: SocialPlatform.INSTAGRAM,
          accountId,
        },
      },
      update: {
        accessToken: account.access_token ?? null,
        refreshToken: account.refresh_token ?? null,
        tokenExpiresAt,
        username:
          (typeof profileData.username === "string" && profileData.username) ||
          user.name ||
          null,
        accountType:
          (typeof profileData.account_type === "string" &&
            profileData.account_type) ||
          null,
        mediaCount:
          typeof profileData.media_count === "number"
            ? profileData.media_count
            : 0,
        isConnected: true,
        connectedAt: new Date(),
      },
      create: {
        creatorId: creatorProfile.id,
        platform: SocialPlatform.INSTAGRAM,
        accountId,
        accessToken: account.access_token ?? null,
        refreshToken: account.refresh_token ?? null,
        tokenExpiresAt,
        username:
          (typeof profileData.username === "string" && profileData.username) ||
          user.name ||
          null,
        accountType:
          (typeof profileData.account_type === "string" &&
            profileData.account_type) ||
          null,
        mediaCount:
          typeof profileData.media_count === "number"
            ? profileData.media_count
            : 0,
        isConnected: true,
        connectedAt: new Date(),
      },
    });

    return;
  }

  if (provider === "google") {
    const accountId =
      (typeof profileData.sub === "string" && profileData.sub) ||
      account.providerAccountId ||
      user.email ||
      dbUser.id;

    await prisma.socialAccount.upsert({
      where: {
        creatorId_platform_accountId: {
          creatorId: creatorProfile.id,
          platform: SocialPlatform.YOUTUBE,
          accountId,
        },
      },
      update: {
        accessToken: account.access_token ?? null,
        refreshToken: account.refresh_token ?? null,
        tokenExpiresAt,
        accountId,
        username: user.email?.split("@")[0] || user.name || null,
        email: user.email ?? null,
        channelId:
          (typeof profileData.sub === "string" && profileData.sub) || null,
        profilePictureUrl: user.image ?? null,
        isConnected: true,
        connectedAt: new Date(),
      },
      create: {
        creatorId: creatorProfile.id,
        platform: SocialPlatform.YOUTUBE,
        accountId,
        accessToken: account.access_token ?? null,
        refreshToken: account.refresh_token ?? null,
        tokenExpiresAt,
        username: user.email?.split("@")[0] || user.name || null,
        email: user.email ?? null,
        channelId:
          (typeof profileData.sub === "string" && profileData.sub) || null,
        profilePictureUrl: user.image ?? null,
        isConnected: true,
        connectedAt: new Date(),
      },
    });

    return;
  }

  const accountId =
    (typeof profileData.id === "string" && profileData.id) ||
    account.providerAccountId ||
    user.email ||
    dbUser.id;

  await prisma.socialAccount.upsert({
    where: {
      creatorId_platform_accountId: {
        creatorId: creatorProfile.id,
        platform: SocialPlatform.LINKEDIN,
        accountId,
      },
    },
    update: {
      accessToken: account.access_token ?? null,
      refreshToken: account.refresh_token ?? null,
      tokenExpiresAt,
      username: user.name ?? null,
      firstName:
        (typeof profileData.localizedFirstName === "string" &&
          profileData.localizedFirstName) ||
        null,
      lastName:
        (typeof profileData.localizedLastName === "string" &&
          profileData.localizedLastName) ||
        null,
      email: user.email ?? null,
      profileId:
        (typeof profileData.id === "string" && profileData.id) || null,
      profilePictureUrl: user.image ?? null,
      isConnected: true,
      connectedAt: new Date(),
    },
    create: {
      creatorId: creatorProfile.id,
      platform: SocialPlatform.LINKEDIN,
      accountId,
      accessToken: account.access_token ?? null,
      refreshToken: account.refresh_token ?? null,
      tokenExpiresAt,
      username: user.name ?? null,
      firstName:
        (typeof profileData.localizedFirstName === "string" &&
          profileData.localizedFirstName) ||
        null,
      lastName:
        (typeof profileData.localizedLastName === "string" &&
          profileData.localizedLastName) ||
        null,
      email: user.email ?? null,
      profileId:
        (typeof profileData.id === "string" && profileData.id) || null,
      profilePictureUrl: user.image ?? null,
      isConnected: true,
      connectedAt: new Date(),
    },
  });
}

export const authOptions: NextAuthOptions = {
  adapter: authAdapter,
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
          role: UserRole.CREATOR,
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
          role: UserRole.CREATOR,
        };
      },
    }),
    InstagramBusinessProvider({
      clientId: process.env.INSTAGRAM_CLIENT_ID!,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        console.log("=== AUTHORIZE CALLED - SIMPLIFIED ===");
        console.log("Email:", credentials?.email);
        console.log("Role:", credentials?.role);

        if (!credentials?.email) {
          return null;
        }

        const roleMap: Record<string, string> = {
          BRAND: "BRAND",
          CREATOR: "CREATOR",
          ADMIN: "ADMIN",
        };

        const selectedRole = roleMap[credentials.role as string] || "CREATOR";

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
      if (
        account?.provider === "google" ||
        account?.provider === "linkedin" ||
        account?.provider === "instagram"
      ) {
        await syncCreatorOauthAccount({
          user,
          account,
          profile,
        });
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
  events: {
    async linkAccount({ user, account, profile }) {
      await syncCreatorOauthAccount({
        user,
        account,
        profile,
      });
    },
  },
};

export default authOptions;
