import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyAndFixAdmin() {
  console.log('🔧 Memverifikasi dan memperbaiki admin user...\n');

  try {
    const adminEmail = 'admin@inamsos.go.id';

    // Check current status
    const admin = await prisma.user.findUnique({
      where: { email: adminEmail },
      include: {
        userRoles: {
          include: { role: true }
        }
      }
    });

    if (!admin) {
      console.log('❌ Admin user tidak ditemukan!');
      return;
    }

    console.log('📋 STATUS SEBELUM PERBAIKAN:');
    console.log('─'.repeat(60));
    console.log(`Email             : ${admin.email}`);
    console.log(`Name              : ${admin.name}`);
    console.log(`IsActive          : ${admin.isActive}`);
    console.log(`IsEmailVerified   : ${admin.isEmailVerified} ${!admin.isEmailVerified ? '❌ HARUS TRUE!' : '✅'}`);
    console.log(`IsLocked          : ${admin.isLocked}`);
    console.log(`Password Hash     : ${admin.passwordHash ? 'EXISTS ✅' : 'MISSING ❌'}`);
    console.log(`Role              : ${admin.userRoles[0]?.role?.name || 'No role'}`);
    console.log('');

    // Fix admin user
    if (!admin.isEmailVerified || admin.isLocked || !admin.isActive) {
      console.log('🔧 Memperbaiki admin user...');

      const updatedAdmin = await prisma.user.update({
        where: { email: adminEmail },
        data: {
          isActive: true,
          isEmailVerified: true,
          isLocked: false,
          lockedUntil: null
        }
      });

      console.log('✅ Admin user berhasil diperbaiki!');
      console.log('');

      console.log('📋 STATUS SETELAH PERBAIKAN:');
      console.log('─'.repeat(60));
      console.log(`Email             : ${updatedAdmin.email}`);
      console.log(`IsActive          : ${updatedAdmin.isActive} ✅`);
      console.log(`IsEmailVerified   : ${updatedAdmin.isEmailVerified} ✅`);
      console.log(`IsLocked          : ${updatedAdmin.isLocked} ✅`);
      console.log('');
    } else {
      console.log('✅ Admin user sudah OK - tidak perlu perbaikan');
      console.log('');
    }

    console.log('✅ SIAP LOGIN:');
    console.log('─'.repeat(60));
    console.log(`📧 Email    : ${adminEmail}`);
    console.log(`🔑 Password : admin123`);
    console.log('─'.repeat(60));

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

verifyAndFixAdmin()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
