const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const tenantId = 'cmojiqbw80000h6f000mf7jkx';

  // Create Brand user
  const brandUser = await prisma.user.create({
    data: {
      email: 'brand-test@amcreator.com',
      name: 'Test Brand',
      role: 'BRAND',
      tenantId: tenantId,
      brandProfile: {
        create: {
          companyName: 'Test Brand Co.',
          industry: 'Technology',
          website: 'https://testbrand.com',
        }
      }
    }
  });
  console.log('Brand user created:', brandUser.id);

  // Create Creator user
  const creatorUser = await prisma.user.create({
    data: {
      email: 'creator-test@amcreator.com',
      name: 'Test Creator',
      role: 'CREATOR',
      tenantId: tenantId,
      creatorProfile: {
        create: {
          displayName: 'Test Creator',
          followerCount: 25000, // Eligible for signing bonus (<50K)
          niche: 'Tech Reviews',
        }
      }
    }
  });
  console.log('Creator user created:', creatorUser.id);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
