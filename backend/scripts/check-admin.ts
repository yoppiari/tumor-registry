import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAdmin() {
  console.log('🔍 Memeriksa status admin user...\n');

  try {
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@inamsos.go.id' },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true
                  }
                }
              }
            }
          }
        },
        center: true
      }
    });

    if (!admin) {
      console.log('❌ Admin user tidak ditemukan!');
      return;
    }

    console.log('📋 ADMIN USER INFO:');
    console.log('─'.repeat(60));
    console.log(`ID           : ${admin.id}`);
    console.log(`Email        : ${admin.email}`);
    console.log(`Name         : ${admin.name}`);
    console.log(`Username     : ${admin.username || 'N/A'}`);
    console.log(`IsActive     : ${admin.isActive}`);
    console.log(`IsLocked     : ${admin.isLocked}`);
    console.log(`CenterId     : ${admin.centerId || 'NULL (tidak ada center)'}`);
    console.log(`Center       : ${admin.center?.name || 'NULL'}`);
    console.log(`Password Hash: ${admin.passwordHash ? admin.passwordHash.substring(0, 20) + '...' : 'MISSING!'}`);
    console.log(`Created At   : ${admin.createdAt}`);
    console.log(`Updated At   : ${admin.updatedAt}`);
    console.log('');

    console.log('🔑 USER ROLES:');
    console.log('─'.repeat(60));
    if (admin.userRoles.length === 0) {
      console.log('❌ TIDAK ADA ROLE! User admin tidak memiliki role!');
    } else {
      admin.userRoles.forEach((ur, idx) => {
        console.log(`${idx + 1}. Role: ${ur.role.name} (${ur.role.code})`);
        console.log(`   IsActive: ${ur.isActive}`);
        console.log(`   Permissions: ${ur.role.permissions.length} permissions`);
      });
    }
    console.log('');

    // Check if password is bcrypt hash
    const isBcryptHash = admin.passwordHash && admin.passwordHash.startsWith('$2');
    console.log('🔐 PASSWORD CHECK:');
    console.log('─'.repeat(60));
    console.log(`Has Password : ${admin.passwordHash ? 'YES' : 'NO'}`);
    console.log(`Is Bcrypt    : ${isBcryptHash ? 'YES' : 'NO'}`);
    console.log('');

    console.log('📊 SUMMARY:');
    console.log('─'.repeat(60));
    const issues = [];
    if (!admin.passwordHash) issues.push('❌ Password tidak ada');
    if (!isBcryptHash) issues.push('❌ Password bukan bcrypt hash');
    if (admin.userRoles.length === 0) issues.push('❌ Tidak ada role');
    if (!admin.isActive) issues.push('❌ User tidak aktif');
    if (admin.isLocked) issues.push('❌ User terkunci');

    if (issues.length === 0) {
      console.log('✅ Admin user OK - siap digunakan');
    } else {
      console.log('❌ ADA MASALAH:');
      issues.forEach(issue => console.log(`   ${issue}`));
    }

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmin()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
