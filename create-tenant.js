
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.create({
    data: {
      name: 'AM Creator Analytics',
      type: 'AGENCY',
      domain: 'localhost',
    },
  });
  console.log('Created tenant:', JSON.stringify(tenant));
  console.log('Tenant ID:', tenant.id);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
