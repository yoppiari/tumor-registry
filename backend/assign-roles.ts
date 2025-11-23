import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const userRoleMapping = [
  { email: 'admin@inamsos.go.id', roleCode: 'SYSTEM_ADMIN' },
  { email: 'national.admin@inamsos.go.id', roleCode: 'NATIONAL_ADMIN' },
  { email: 'center.admin@inamsos.go.id', roleCode: 'CENTER_ADMIN' },
  { email: 'researcher@inamsos.go.id', roleCode: 'RESEARCHER' },
  { email: 'medical.officer@inamsos.go.id', roleCode: 'MEDICAL_OFFICER' },
  { email: 'staff@inamsos.go.id', roleCode: 'DATA_ENTRY' },
];

async function assignRoles() {
  for (const mapping of userRoleMapping) {
    const user = await prisma.user.findUnique({ where: { email: mapping.email } });
    const role = await prisma.role.findUnique({ where: { code: mapping.roleCode } });

    if (!user || !role) {
      console.log(`⚠️  User or role not found for ${mapping.email}`);
      continue;
    }

    const existing = await prisma.userRole.findFirst({
      where: { userId: user.id, roleId: role.id }
    });

    if (!existing) {
      await prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: role.id,
          isActive: true
        }
      });
      console.log(`✅ Role assigned: ${mapping.email} → ${mapping.roleCode}`);
    } else {
      console.log(`✓  Role already exists: ${mapping.email} → ${mapping.roleCode}`);
    }
  }

  console.log('\n✅ All user roles assigned!');
  await prisma.$disconnect();
}

assignRoles();
