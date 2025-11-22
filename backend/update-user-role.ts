import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@test.com';
  
  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      userRoles: {
        include: {
          role: true
        }
      }
    }
  });

  if (!user) {
    throw new Error('User not found');
  }

  console.log('Current user:', user.email);
  console.log('Current roles:', user.userRoles.map(ur => ur.role.code));

  // Get SYSTEM_ADMIN role
  const superAdminRole = await prisma.role.findUnique({
    where: { code: 'SYSTEM_ADMIN' }
  });

  if (!superAdminRole) {
    throw new Error('SYSTEM_ADMIN role not found');
  }

  // Deactivate all existing roles
  await prisma.userRole.updateMany({
    where: { userId: user.id },
    data: { isActive: false }
  });

  // Check if user already has SUPER_ADMIN role
  const existingRole = await prisma.userRole.findFirst({
    where: {
      userId: user.id,
      roleId: superAdminRole.id
    }
  });

  if (existingRole) {
    // Reactivate existing role
    await prisma.userRole.update({
      where: { id: existingRole.id },
      data: { isActive: true }
    });
  } else {
    // Create new role assignment
    await prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: superAdminRole.id,
        isActive: true
      }
    });
  }

  console.log('✓ User role updated to SYSTEM_ADMIN');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
