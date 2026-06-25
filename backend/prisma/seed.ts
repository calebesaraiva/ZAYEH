import { PrismaClient } from '../src/generated/prisma';
import { ensureStoreBootstrap } from '../src/lib/bootstrapStore';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');
  await ensureStoreBootstrap(prisma);
  console.log('✅ Seed complete!');
  console.log('👤 Admin: admin@zayeh.com.br / zayeh@2026');
  console.log('👤 Nexus: nexus@zayeh.com.br / nexus@2026');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
