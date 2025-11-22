import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = 'password123';
  const passwordHash = await bcrypt.hash(password, 12);

  // Try to find existing user first
  const existingUser = await prisma.user.findUnique({
    where: { email: 'admin@test.com' },
  });

  let result;
  if (existingUser) {
    // Update existing user
    result = await prisma.user.update({
      where: {
        email: 'admin@test.com',
      },
      data: {
        passwordHash: passwordHash,
        isEmailVerified: true,
        isActive: true,
      },
    });
    console.log('User updated:', result.email);
  } else {
    // Get default center
    const defaultCenter = await prisma.center.findFirst({
      where: { code: 'DEFAULT' },
    });

    if (!defaultCenter) {
      throw new Error('Default center not found');
    }

    // Create new user
    result = await prisma.user.create({
      data: {
        email: 'admin@test.com',
        name: 'Admin User',
        passwordHash: passwordHash,
        isEmailVerified: true,
        isActive: true,
        centerId: defaultCenter.id,
      },
    });
    console.log('User created:', result.email);

    // Get or create super_admin role
    let superAdminRole = await prisma.role.findUnique({
      where: { name: 'super_admin' },
    });

    if (!superAdminRole) {
      superAdminRole = await prisma.role.create({
        data: {
          name: 'super_admin',
          code: 'SUPER_ADMIN',
          description: 'Super Administrator',
          isActive: true,
        },
      });
    }

    // Assign role to user
    await prisma.userRole.create({
      data: {
        userId: result.id,
        roleId: superAdminRole.id,
        isActive: true,
      },
    });
  }

  console.log('Email verified:', result.isEmailVerified);
  console.log('Is active:', result.isActive);
  console.log('\nYou can now login with:');
  console.log('Email: admin@test.com');
  console.log('Password: password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
