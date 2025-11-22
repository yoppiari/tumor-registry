import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const centers = await prisma.center.findMany({
    select: {
      id: true,
      name: true,
      code: true,
      isActive: true,
    },
  });

  console.log('Centers:', centers);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
