const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Get brand and creator profiles
  const brandProfile = await prisma.brandProfile.findFirst({
    where: { user: { email: 'brand-test@amcreator.com' } }
  });

  const creatorProfile = await prisma.creatorProfile.findFirst({
    where: { user: { email: 'creator-pro@amcreator.com' } }
  });

  if (!brandProfile || !creatorProfile) {
    console.log('Brand or creator profile not found');
    return;
  }

  console.log('Brand Profile:', brandProfile.id);
  console.log('Creator Profile:', creatorProfile.id);

  // Create a test campaign
  const campaign = await prisma.campaign.create({
    data: {
      title: 'Test Campaign Q2 2026',
      status: 'ACTIVE',
      startDate: new Date(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      budget: 500000,
      brandId: brandProfile.id,
      tenantId: 'cmojiqbw80000h6f000mf7jkx',
    }
  });

  console.log('Campaign created:', campaign.id);

  // Create campaign-creator assignment
  const campaignCreator = await prisma.campaignCreator.create({
    data: {
      campaignId: campaign.id,
      creatorId: creatorProfile.id,
      rate: 50000,
    }
  });

  console.log('CampaignCreator created:', campaignCreator.id);
  console.log(JSON.stringify({
    campaignId: campaign.id,
    creatorId: creatorProfile.id,
    campaignCreatorId: campaignCreator.id,
  }));
}

main().catch(console.error).finally(() => prisma.$disconnect());
