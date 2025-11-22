import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const roles = await prisma.role.findMany({
    select: {
      id: true,
      name: true,
      code: true,
      description: true,
      level: true
    }
  });

  console.log('Available roles:');
  console.table(roles);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
