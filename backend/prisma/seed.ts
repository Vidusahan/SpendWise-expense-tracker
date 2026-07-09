import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { DEFAULT_CATEGORIES } from '../src/config/constants';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Password123!', 10);

  const user = await prisma.user.upsert({
    where: { email: 'demo@spendwise.dev' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@spendwise.dev',
      passwordHash,
    },
  });

  for (const category of DEFAULT_CATEGORIES) {
    await prisma.category.upsert({
      where: { userId_name: { userId: user.id, name: category.name } },
      update: {},
      create: {
        userId: user.id,
        name: category.name,
        color: category.color,
        icon: category.icon,
      },
    });
  }

  // eslint-disable-next-line no-console
  console.log(`Seeded user ${user.email} with ${DEFAULT_CATEGORIES.length} default categories.`);
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
