import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting simple seed...');
  
  const hashedPassword = await bcrypt.hash('test123456', 10);
  
  // Create Brand user
  const brandUser = await prisma.user.upsert({
    where: { email: 'brand-test@amcreator.com' },
    update: {},
    create: {
      email: 'brand-test@amcreator.com',
      name: 'Test Brand Corp',
      role: 'BRAND',
    },
  });
  
  // Create Brand Profile
  const brandProfile = await prisma.brandProfile.upsert({
    where: { userId: brandUser.id },
    update: {},
    create: {
      userId: brandUser.id,
      companyName: 'Test Brand Corp',
      industry: 'Technology',
      website: 'https://testbrand.example.com',
    },
  });
  
  // Create Creator user
  const creatorUser = await prisma.user.upsert({
    where: { email: 'creator-pro@amcreator.com' },
    update: {},
    create: {
      email: 'creator-pro@amcreator.com',
      name: 'Test Creator',
      role: 'CREATOR',
    },
  });
  
  // Create Creator Profile
  const creatorProfile = await prisma.creatorProfile.upsert({
    where: { userId: creatorUser.id },
    update: {},
    create: {
      userId: creatorUser.id,
      displayName: 'Test Creator',
      niche: 'Tech',
      bio: 'A test creator for AM Creator Analytics',
      followerCount: 50000,
      engagementRate: 3.5,
    },
  });
  
  // Create Campaign
  const campaign = await prisma.campaign.upsert({
    where: { id: 'test-campaign-1' },
    update: {},
    create: {
      id: 'test-campaign-1',
      brandId: brandProfile.id,
      title: 'Test Influencer Campaign',
      budget: 100000,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'ACTIVE',
    },
  });
  
  console.log('Seed completed!');
  console.log('Brand ID:', brandProfile.id);
  console.log('Creator ID:', creatorProfile.id);
  console.log('Campaign ID:', campaign.id);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
