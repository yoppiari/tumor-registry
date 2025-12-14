import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function fixAdminPassword() {
  console.log('🔧 Memperbaiki password admin...\n');

  try {
    const adminEmail = 'admin@inamsos.go.id';
    const defaultPassword = 'admin123';

    // Check if admin exists
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

    console.log('📋 ADMIN USER SEBELUM PERBAIKAN:');
    console.log('─'.repeat(60));
    console.log(`Email        : ${admin.email}`);
    console.log(`Name         : ${admin.name}`);
    console.log(`Password     : ${admin.passwordHash ? 'EXISTS' : 'MISSING!'}`);
    console.log(`Role         : ${admin.userRoles[0]?.role?.name || 'No role'}`);
    console.log('');

    // Hash the password
    console.log('🔐 Membuat password hash...');
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);
    console.log(`✅ Password hash dibuat: ${hashedPassword.substring(0, 20)}...`);
    console.log('');

    // Update the user
    console.log('💾 Mengupdate password admin...');
    const updatedAdmin = await prisma.user.update({
      where: { email: adminEmail },
      data: {
        passwordHash: hashedPassword,
        isActive: true,
        isLocked: false,
        failedLoginAttempts: 0,
        lockedUntil: null
      },
      include: {
        userRoles: {
          include: { role: true }
        }
      }
    });

    console.log('✅ Password admin berhasil diupdate!');
    console.log('');

    console.log('📋 ADMIN USER SETELAH PERBAIKAN:');
    console.log('─'.repeat(60));
    console.log(`Email        : ${updatedAdmin.email}`);
    console.log(`Name         : ${updatedAdmin.name}`);
    console.log(`Password     : ${updatedAdmin.passwordHash ? 'EXISTS' : 'MISSING!'}`);
    console.log(`IsActive     : ${updatedAdmin.isActive}`);
    console.log(`IsLocked     : ${updatedAdmin.isLocked}`);
    console.log(`Role         : ${updatedAdmin.userRoles[0]?.role?.name || 'No role'}`);
    console.log('');

    console.log('✅ PERBAIKAN SELESAI!');
    console.log('─'.repeat(60));
    console.log(`📧 Email    : ${adminEmail}`);
    console.log(`🔑 Password : ${defaultPassword}`);
    console.log('─'.repeat(60));
    console.log('');
    console.log('✅ Silakan login kembali dengan credentials di atas.');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

fixAdminPassword()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
