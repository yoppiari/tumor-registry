import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearUsers() {
  console.log('🗑️  Menghapus semua user kecuali admin@inamsos.go.id...');

  try {
    // Get admin user first to preserve
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@inamsos.go.id' },
    });

    if (!adminUser) {
      console.log('⚠️  Warning: admin@inamsos.go.id tidak ditemukan!');
    } else {
      console.log(`✅ Admin user ditemukan: ${adminUser.email} (ID: ${adminUser.id})`);
    }

    // Count total users before deletion
    const totalUsers = await prisma.user.count();
    console.log(`📊 Total users sebelum penghapusan: ${totalUsers}`);

    // Delete all users except admin@inamsos.go.id
    const deletedUsers = await prisma.user.deleteMany({
      where: {
        email: {
          not: 'admin@inamsos.go.id',
        },
      },
    });

    console.log(`✅ Berhasil menghapus ${deletedUsers.count} user(s)`);

    // Verify deletion
    const remainingUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        userRoles: {
          select: {
            role: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    console.log('\n📋 User yang tersisa:');
    remainingUsers.forEach((user) => {
      const roles = user.userRoles.map(ur => ur.role.name).join(', ');
      console.log(`  - ${user.email} (${user.name}) - ${roles}`);
    });

    console.log(`\n✅ Total user tersisa: ${remainingUsers.length}`);
    console.log('✅ Cleanup selesai!');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

clearUsers()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
