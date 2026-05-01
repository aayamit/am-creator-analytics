const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const campaigns = await prisma.campaign.findMany({ 
    take: 3, 
    select: { id: true, title: true, budget: true } 
  });
  
  const creators = await prisma.creatorProfile.findMany({ 
    take: 3, 
    select: { id: true, displayName: true, userId: true } 
  });
  
  console.log('Campaigns:', JSON.stringify(campaigns, null, 2));
  console.log('\nCreators:', JSON.stringify(creators, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
