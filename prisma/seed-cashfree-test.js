const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

/**
 * Cashfree Integration Test Seeds
 * Creates mock profiles for testing subscriptions:
 * - Admin (no subscription)
 * - Brand (Professional ₹299/mo)
 * - Creator Pro (₹29/mo)
 * - Creator Elite (₹99/mo)
 *
 * Run: node prisma/seed-cashfree-test.js
 */

async function main() {
  console.log("🌱 Starting Cashfree test seed...");

  const hashedPassword = await bcrypt.hash("test123456", 10);

  // ========== 1. ADMIN ==========
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@amcreator.com" },
    update: {},
    create: {
      email: "admin@amcreator.com",
      name: "Amit Kumar",
      role: "ADMIN",
      accounts: {
        create: {
          type: "credentials",
          provider: "credentials",
          providerAccountId: "admin@amcreator.com",
        },
      },
    },
  });
  console.log("✅ Admin created:", adminUser.email);

  // ========== 1.5 ADMIN Subscription (None - Internal) ==========
  // Admin doesn't need a subscription - skip

  // ========== 2. BRAND (Professional Plan ₹299/mo) ==========
  const brandUser = await prisma.user.upsert({
    where: { email: "brand-test@amcreator.com" },
    update: {},
    create: {
      email: "brand-test@amcreator.com",
      name: "TechCorp Inc.",
      role: "BRAND",
      accounts: {
        create: {
          type: "credentials",
          provider: "credentials",
          providerAccountId: "brand-test@amcreator.com",
        },
      },
      brandProfile: {
        create: {
          companyName: "TechCorp Inc.",
          industry: "Technology / SaaS",
          website: "https://techcorp.example.com",
          description: "Leading SaaS platform for creator analytics and influencer marketing.",
          address: "123 Innovation Drive, Palo Alto, CA 94301",
          taxId: "12-3456789",
        },
      },
    },
  });
  console.log("✅ Brand (Professional) created:", brandUser.email);

  // ========== 3. CREATOR PRO (₹29/mo) ==========
  const creatorProUser = await prisma.user.upsert({
    where: { email: "creator-pro@amcreator.com" },
    update: {},
    create: {
      email: "creator-pro@amcreator.com",
      name: "Alex Techreview",
      role: "CREATOR",
      accounts: {
        create: {
          type: "credentials",
          provider: "credentials",
          providerAccountId: "creator-pro@amcreator.com",
        },
      },
      creatorProfile: {
        create: {
          displayName: "Alex Techreview",
          niche: "Tech",
          bio: "Tech reviewer with 200K+ subscribers. Focused on SaaS, APIs, and developer tools. Helping brands reach tech audiences.",
          website: "https://alextech.example.com",
          pricing: { cpm: 2400, cpe: 50, perPost: 2400 },
          socialAccounts: {
            create: [
              {
                platform: "YOUTUBE",
                platformId: "UC_techreviewer_pro",
                username: "@alextechreviewer",
                accessToken: "dummy-youtube-token-pro",
                profileUrl: "https://youtube.com/@alextechreviewer",
                metrics: {
                  create: [
                    { type: "FOLLOWERS", value: 215000, date: new Date("2026-06-01") },
                    { type: "ENGAGEMENT_RATE", value: 6.8, date: new Date("2026-06-01") },
                    { type: "VIEWS", value: 4800000, date: new Date("2026-06-01") },
                  ],
                },
              },
              {
                platform: "LINKEDIN",
                platformId: "linkedin-alextech-pro",
                username: "alextechreviewer",
                accessToken: "dummy-linkedin-token-pro",
                profileUrl: "https://linkedin.com/in/alextechreviewer",
              },
            ],
          },
          audienceDemographics: {
            create: [
              { type: "AGE", label: "18-24", percentage: 25 },
              { type: "AGE", label: "25-34", percentage: 45 },
              { type: "AGE", label: "35-44", percentage: 20 },
              { type: "AGE", label: "45+", percentage: 10 },
              { type: "GENDER", label: "Male", percentage: 82 },
              { type: "GENDER", label: "Female", percentage: 18 },
              { type: "INCOME_BRACKET", label: "₹10L+", percentage: 65 },
              { type: "INCOME_BRACKET", label: "₹5-10L", percentage: 25 },
              { type: "INCOME_BRACKET", label: "₹5L", percentage: 10 },
            ],
          },
          mediaKit: {
            create: {
              slug: "alex-techreview-pro",
              isPublic: true,
              settings: { showPastCampaigns: true, showPricing: true },
            },
          },
        },
      },
    },
  });
  console.log("✅ Creator Pro (₹29/mo) created:", creatorProUser.email);

  // ========== 4. CREATOR ELITE (₹99/mo) ==========
  const creatorEliteUser = await prisma.user.upsert({
    where: { email: "creator-elite@amcreator.com" },
    update: {},
    create: {
      email: "creator-elite@amcreator.com",
      name: "Priya FinanceGuru",
      role: "CREATOR",
      accounts: {
        create: {
          type: "credentials",
          provider: "credentials",
          providerAccountId: "creator-elite@amcreator.com",
        },
      },
      creatorProfile: {
        create: {
          displayName: "Priya FinanceGuru",
          niche: "Finance",
          bio: "Chartered Financial Analyst (CFA) with 500K+ followers. Specializing in investment strategies, market analysis, and fintech reviews.",
          website: "https://priyafinance.example.com",
          pricing: { cpm: 5000, cpe: 80, perPost: 5000 },
          socialAccounts: {
            create: [
              {
                platform: "YOUTUBE",
                platformId: "UC_finance_elite",
                username: "@priyafinance",
                accessToken: "dummy-youtube-token-elite",
                profileUrl: "https://youtube.com/@priyafinance",
                metrics: {
                  create: [
                    { type: "FOLLOWERS", value: 520000, date: new Date("2026-06-01") },
                    { type: "ENGAGEMENT_RATE", value: 7.5, date: new Date("2026-06-01") },
                    { type: "VIEWS", value: 12000000, date: new Date("2026-06-01") },
                  ],
                },
              },
              {
                platform: "INSTAGRAM",
                platformId: "instagram-priya-finance",
                username: "priyafinance",
                accessToken: "dummy-instagram-token-elite",
                profileUrl: "https://instagram.com/priyafinance",
              },
              {
                platform: "LINKEDIN",
                platformId: "linkedin-priya-finance",
                username: "priyafinanceguru",
                accessToken: "dummy-linkedin-token-elite",
                profileUrl: "https://linkedin.com/in/priyafinanceguru",
              },
            ],
          },
          audienceDemographics: {
            create: [
              { type: "AGE", label: "25-34", percentage: 40 },
              { type: "AGE", label: "35-44", percentage: 35 },
              { type: "AGE", label: "45-54", percentage: 20 },
              { type: "AGE", label: "55+", percentage: 5 },
              { type: "GENDER", label: "Male", percentage: 70 },
              { type: "GENDER", label: "Female", percentage: 30 },
              { type: "INCOME_BRACKET", label: "₹10L+", percentage: 80 },
              { type: "INCOME_BRACKET", label: "₹5-10L", percentage: 15 },
              { type: "INCOME_BRACKET", label: "₹5L", percentage: 5 },
              { type: "INTEREST", label: "Investing", percentage: 60 },
              { type: "INTEREST", label: "Mutual Funds", percentage: 50 },
              { type: "INTEREST", label: "Stock Trading", percentage: 45 },
            ],
          },
          mediaKit: {
            create: {
              slug: "priya-finance-elite",
              isPublic: true,
              settings: { showPastCampaigns: true, showPricing: true, custombranding: true },
            },
          },
        },
      },
    },
  });
  console.log("✅ Creator Elite (₹99/mo) created:", creatorEliteUser.email);

  // ========== 5. Sample Campaign (Brand → Creator Pro) ==========
  const brandProfile = await prisma.brandProfile.findUnique({
    where: { userId: brandUser.id },
  });

  const creatorProProfile = await prisma.creatorProfile.findUnique({
    where: { userId: creatorProUser.id },
  });

  if (brandProfile && creatorProProfile) {
    const campaign = await prisma.campaign.upsert({
      where: { id: "cashfree-test-campaign-1" },
      update: {},
      create: {
        id: "cashfree-test-campaign-1",
        brandId: brandProfile.id,
        title: "SaaS Launch - Creator Pro",
        description: "Promote our new SaaS analytics dashboard to tech creators.",
        budget: 50000,
        spent: 15000,
        startDate: new Date("2026-07-01"),
        endDate: new Date("2026-08-31"),
        status: "ACTIVE",
        campaignCreators: {
          create: {
            creatorId: creatorProProfile.id,
            deliverables: { posts: 5, stories: 10, reels: 3 },
            rate: 25000,
            paymentStatus: "PAID",
            performance: { impressions: 450000, clicks: 12000, conversions: 350 },
          },
        },
      },
      include: {
        campaignCreators: true,
      },
    });

    // Create invoice for the first campaign creator
    if (campaign.campaignCreators.length > 0) {
      await prisma.invoice.upsert({
        where: { campaignCreatorId: campaign.campaignCreators[0].id },
        update: {},
        create: {
          campaignCreatorId: campaign.campaignCreators[0].id,
          amount: 25000,
          status: "PAID",
          dueDate: new Date("2026-07-15"),
          paidAt: new Date("2026-07-10"),
        },
      });
    }

    console.log("✅ Sample campaign created:", campaign.title);
  }

  // ========== 6. Notifications for all users ==========
  const notifications = [
    // Admin notifications
    { userId: adminUser.id, type: "SYSTEM", title: "System Update", message: "Cashfree integration endpoints are now live.", read: false },
    { userId: adminUser.id, type: "SYSTEM", title: "New User Signed Up", message: "Brand TechCorp Inc. just created an account.", read: false },

    // Brand notifications
    { userId: brandUser.id, type: "CAMPAIGN_UPDATE", title: "Campaign Started", message: "Your campaign 'SaaS Launch' is now active.", link: "/brands/campaigns/cashfree-test-campaign-1", read: false },
    { userId: brandUser.id, type: "PAYMENT_RECEIVED", title: "Subscription Active", message: "Your Professional plan subscription is now active.", read: false },

    // Creator Pro notifications
    { userId: creatorProUser.id, type: "CAMPAIGN_INVITE", title: "New Campaign Invite", message: "TechCorp Inc. invited you to 'SaaS Launch'.", link: "/creators/campaigns/cashfree-test-campaign-1", read: false },
    { userId: creatorProUser.id, type: "PAYMENT_RECEIVED", title: "Payment Received", message: "You received ₹25,000 for campaign deliverables.", link: "/creators/campaigns/cashfree-test-campaign-1", read: true },
    { userId: creatorProUser.id, type: "MILESTONE_REACHED", title: "Subscriber Milestone", message: "Congrats! You've crossed 200K subscribers.", read: false },

    // Creator Elite notifications
    { userId: creatorEliteUser.id, type: "SYSTEM", title: "Welcome to Elite", message: "You now have access to 1:1 strategy sessions and priority support.", read: false },
    { userId: creatorEliteUser.id, type: "MILESTONE_REACHED", title: "Brand Interest", message: "3 brands viewed your media kit this week.", read: false },
  ];

  for (const notif of notifications) {
    await prisma.notification.create({ data: notif });
  }
  console.log("✅ Notifications created");

  // ========== 7. Create Mock Subscriptions (Simulating Cashfree) ==========
  // These simulate what Cashfree webhooks would create

  // Brand Professional Subscription (₹299/mo)
  await prisma.subscription.upsert({
    where: { cashfreeSubId: "sub_mock_brand_professional" },
    update: {},
    create: {
      userId: brandUser.id,
      cashfreeSubId: "sub_mock_brand_professional",
      cashfreeCustomerId: "customer_mock_brand_123",
      planId: "plan_brand_professional",
      planName: "Professional",
      planTier: "professional",
      amount: 299,
      currency: "INR",
      interval: "MONTH",
      status: "ACTIVE",
      currentPeriodStart: new Date("2026-04-01"),
      currentPeriodEnd: new Date("2026-05-01"),
      lastPaymentAt: new Date("2026-04-01"),
    },
  });
  console.log("✅ Brand subscription created (Professional ₹299/mo)");

  // Creator Pro Subscription (₹29/mo)
  await prisma.subscription.upsert({
    where: { cashfreeSubId: "sub_mock_creator_pro" },
    update: {},
    create: {
      userId: creatorProUser.id,
      cashfreeSubId: "sub_mock_creator_pro",
      cashfreeCustomerId: "customer_mock_creator_pro_456",
      planId: "plan_creator_pro",
      planName: "Creator Pro",
      planTier: "creator_pro",
      amount: 29,
      currency: "INR",
      interval: "MONTH",
      status: "ACTIVE",
      currentPeriodStart: new Date("2026-04-15"),
      currentPeriodEnd: new Date("2026-05-15"),
      lastPaymentAt: new Date("2026-04-15"),
    },
  });
  console.log("✅ Creator Pro subscription created (₹29/mo)");

  // Creator Elite Subscription (₹99/mo)
  await prisma.subscription.upsert({
    where: { cashfreeSubId: "sub_mock_creator_elite" },
    update: {},
    create: {
      userId: creatorEliteUser.id,
      cashfreeSubId: "sub_mock_creator_elite",
      cashfreeCustomerId: "customer_mock_creator_elite_789",
      planId: "plan_creator_elite",
      planName: "Creator Elite",
      planTier: "creator_elite",
      amount: 99,
      currency: "INR",
      interval: "MONTH",
      status: "ACTIVE",
      currentPeriodStart: new Date("2026-04-20"),
      currentPeriodEnd: new Date("2026-05-20"),
      lastPaymentAt: new Date("2026-04-20"),
    },
  });
  console.log("✅ Creator Elite subscription created (₹99/mo)");

  console.log("\n🎉 Cashfree test seed completed!\n");
  console.log("📋 Test Profiles Created:");
  console.log("  1. Admin: admin@amcreator.com / test123456");
  console.log("  2. Brand (Professional ₹299/mo): brand-test@amcreator.com / test123456");
  console.log("  3. Creator Pro (₹29/mo): creator-pro@amcreator.com / test123456");
  console.log("  4. Creator Elite (₹99/mo): creator-elite@amcreator.com / test123456");
  console.log("\n💳 To test Cashfree, sign in as any user and visit /pricing");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
