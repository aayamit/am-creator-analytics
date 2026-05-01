import { PrismaClient } from "@prisma/client";
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed for DEMO...");

  const hashedPassword = await bcrypt.hash("test123456", 10);

  // Create Admin user (simple - only what's needed for login)
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@amcreator.com" },
    update: {},
    create: {
      email: "admin@amcreator.com",
      name: "Admin User",
      role: "ADMIN",
      accounts: {
        create: {
          type: "credentials",
          provider: "credentials",
          providerAccountId: "admin@amcreator.com",
        },
      },
    },
  });

  console.log("Admin user created:", adminUser.email);

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
    },
  });

  console.log("Brand user created:", brandUser.email);

  // Create Creator user (Pro)
  const creatorPro = await prisma.user.upsert({
    where: { email: "creator-pro@amcreator.com" },
    update: {},
    create: {
      email: "creator-pro@amcreator.com",
      name: "Alex Tech",
      role: "CREATOR",
      accounts: {
        create: {
          type: "credentials",
          provider: "credentials",
          providerAccountId: "creator-pro@amcreator.com",
        },
      },
    },
  });

  console.log("Creator Pro user created:", creatorPro.email);

  // Create Creator user (Elite)
  const creatorElite = await prisma.user.upsert({
    where: { email: "creator-elite@amcreator.com" },
    update: {},
    create: {
      email: "creator-elite@amcreator.com",
      name: "Priya Sharma",
      role: "CREATOR",
      accounts: {
        create: {
          type: "credentials",
          provider: "credentials",
          providerAccountId: "creator-elite@amcreator.com",
        },
      },
    },
  });

  console.log("Creator Elite user created:", creatorElite.email);

  console.log("✅ Demo seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
