
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create test tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: 'AM Creator Analytics',
      type: 'AGENCY',
      domain: 'localhost',
      subscriptionPlan: 'Agency Pro',
      dataResidency: 'IN',
    },
  });
  console.log('Created tenant:', JSON.stringify(tenant));
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
