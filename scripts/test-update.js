const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Try updating the contract status
  const result = await prisma.contract.updateMany({
    where: { openSignDocumentId: 'RU89V0XXJW' },
    data: { status: 'FULLY_EXECUTED', signedAt: new Date() }
  });

  console.log('Update result:', result);

  // Check the contract
  const contract = await prisma.contract.findFirst({
    where: { openSignDocumentId: 'RU89V0XXJW' }
  });

  console.log('Contract status:', contract?.status);
}

main().catch(e => console.error('Error:', e)).finally(() => prisma.$disconnect());
