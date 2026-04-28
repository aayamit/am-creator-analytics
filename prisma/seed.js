const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  const hashedPassword = await bcrypt.hash("test123456", 10);

  // Create Brand user
  const brandUser = await prisma.user.upsert({
    where: { email: "brand@amcreator.com" },
    update: {},
    create: {
      email: "brand@amcreator.com",
      name: "Acme Corp",
      role: "BRAND",
      accounts: {
        create: {
          type: "credentials",
          provider: "credentials",
          providerAccountId: "brand@amcreator.com",
        },
      },
      brandProfile: {
        create: {
          companyName: "Acme Corporation",
          industry: "Technology",
          website: "https://acme.example.com",
        },
      },
    },
  });

  // Create Creator user (Alex Tech)
  const creatorUser = await prisma.user.upsert({
    where: { email: "creator@amcreator.com" },
    update: {},
    create: {
      email: "creator@amcreator.com",
      name: "Alex Tech",
      role: "CREATOR",
      accounts: {
        create: {
          type: "credentials",
          provider: "credentials",
          providerAccountId: "creator@amcreator.com",
        },
      },
      creatorProfile: {
        create: {
          displayName: "Alex Tech",
          niche: "Tech",
          bio: "Tech creator focused on SaaS, APIs, and developer tools.",
          website: "https://alextech.example.com",
          pricing: { cpm: 2400, cpe: 50, perPost: 2400 },
          socialAccounts: {
            create: [
              {
                platform: "YOUTUBE",
                platformId: "UC123456789",
                username: "@alextech",
                accessToken: "dummy-youtube-token",
                profileUrl: "https://youtube.com/@alextech",
                metrics: {
                  create: [
                    { type: "FOLLOWERS", value: 26800, date: new Date("2026-06-01") },
                    { type: "ENGAGEMENT_RATE", value: 5.8, date: new Date("2026-06-01") },
                    { type: "VIEWS", value: 48000, date: new Date("2026-06-01") },
                  ],
                },
              },
              {
                platform: "LINKEDIN",
                platformId: "linkedin-alextech",
                username: "alextech",
                accessToken: "dummy-linkedin-token",
                profileUrl: "https://linkedin.com/in/alextech",
              },
            ],
          },
          audienceDemographics: {
            create: [
              { type: "AGE", label: "18-24", percentage: 35 },
              { type: "AGE", label: "25-34", percentage: 40 },
              { type: "AGE", label: "35-44", percentage: 15 },
              { type: "AGE", label: "45+", percentage: 10 },
              { type: "GENDER", label: "Male", percentage: 78 },
              { type: "GENDER", label: "Female", percentage: 22 },
            ],
          },
          mediaKit: {
            create: {
              slug: "alex-tech-media-kit",
              isPublic: true,
              settings: { showPastCampaigns: true, showPricing: true },
            },
          },
        },
      },
    },
  });

  // Create additional creators
  const creators = [
    {
      email: "financeguru@example.com",
      name: "Finance Guru",
      displayName: "Finance Guru",
      niche: "Finance",
      platform: "LINKEDIN",
      platformId: "linkedin-finance",
      followers: 128000,
      engagement: 6.2,
    },
    {
      email: "saasweekly@example.com",
      name: "SaaS Weekly",
      displayName: "SaaS Weekly",
      niche: "SaaS",
      platform: "YOUTUBE",
      platformId: "UC987654321",
      followers: 89000,
      engagement: 7.1,
    },
  ];

  for (const c of creators) {
    await prisma.user.upsert({
      where: { email: c.email },
      update: {},
      create: {
        email: c.email,
        name: c.name,
        role: "CREATOR",
        accounts: {
          create: {
            type: "credentials",
            provider: "credentials",
            providerAccountId: c.email,
          },
        },
        creatorProfile: {
          create: {
            displayName: c.displayName,
            niche: c.niche,
            socialAccounts: {
              create: [
                {
                  platform: c.platform,
                  platformId: c.platformId,
                  username: c.displayName.toLowerCase().replace(" ", ""),
                  accessToken: `dummy-token-${c.email}`,
                  metrics: {
                    create: [
                      { type: "FOLLOWERS", value: c.followers, date: new Date() },
                      { type: "ENGAGEMENT_RATE", value: c.engagement, date: new Date() },
                    ],
                  },
                },
              ],
            },
          },
        },
      },
    });
  }

  // Create sample campaign
  const brandProfile = await prisma.brandProfile.findUnique({
    where: { userId: brandUser.id },
  });

  const creatorProfile = await prisma.creatorProfile.findUnique({
    where: { userId: creatorUser.id },
  });

  let sampleCampaign;
  if (brandProfile && creatorProfile) {
    sampleCampaign = await prisma.campaign.upsert({
      where: { id: "sample-campaign-1" },
      update: {},
      create: {
        id: "sample-campaign-1",
        brandId: brandProfile.id,
        title: "Summer SaaS Launch",
        description: "Promote our new SaaS product to tech creators",
        budget: 12000,
        spent: 4500,
        startDate: new Date("2026-06-01"),
        endDate: new Date("2026-08-31"),
        status: "ACTIVE",
        campaignCreators: {
          create: {
            creatorId: creatorProfile.id,
            rate: 2400,
            paymentStatus: "PAID",
            deliverables: { posts: 3, stories: 5 },
          },
        },
      },
    });

    // Create sample notifications
    const notifications = [
      {
        userId: creatorUser.id,
        type: "CAMPAIGN_INVITE",
        title: "New Campaign Invite",
        message: "Acme Corporation has invited you to join \"Summer SaaS Launch\"",
        link: "/creators/campaigns/sample-campaign-1",
        read: false,
      },
      {
        userId: creatorUser.id,
        type: "PAYMENT_RECEIVED",
        title: "Payment Received",
        message: "You received payment of $2,400 for campaign deliverables",
        link: "/creators/campaigns/sample-campaign-1",
        read: true,
      },
      {
        userId: brandUser.id,
        type: "CAMPAIGN_UPDATE",
        title: "Campaign Update",
        message: "Campaign \"Summer SaaS Launch\" has started",
        link: "/brands/campaigns/sample-campaign-1",
        read: false,
      },
      {
        userId: creatorUser.id,
        type: "SYSTEM",
        title: "Welcome to AM Creator Analytics",
        message: "Complete your profile to get discovered by top brands",
        link: "/creators/settings",
        read: false,
      },
    ];

    for (const notif of notifications) {
      await prisma.notification.create({
        data: notif,
      });
    }
  }

  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
