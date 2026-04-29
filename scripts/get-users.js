const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    where: { tenantId: 'cmojiqbw80000h6f000mf7jkx' },
    include: { brandProfile: true, creatorProfile: true }
  });

  users.forEach(u => {
    console.log(JSON.stringify({
      id: u.id,
      email: u.email,
      role: u.role,
      hasBrand: !!u.brandProfile,
      hasCreator: !!u.creatorProfile,
      brandId: u.brandProfile?.id,
      creatorId: u.creatorProfile?.id,
    }));
  });
}

main().finally(() => prisma.$disconnect());
