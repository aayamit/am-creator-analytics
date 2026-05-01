const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const contracts = await prisma.contract.findMany({ 
    take: 5,
    select: { 
      id: true, 
      status: true, 
      openSignDocumentId: true,
      bonusPaidAt: true,
      bonusAmount: true,
      signedAt: true
    }
  });
  
  console.log('Contracts:', JSON.stringify(contracts, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
