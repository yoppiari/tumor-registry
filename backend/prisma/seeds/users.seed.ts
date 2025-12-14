import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function seedUsers() {
  console.log('🌱 Seeding users...');

  const centers = await prisma.center.findMany();
  const roles = await prisma.role.findMany();

  const systemAdminRole = roles.find(r => r.code === 'SYSTEM_ADMIN');
  const nationalAdminRole = roles.find(r => r.code === 'NATIONAL_ADMIN');
  const centerAdminRole = roles.find(r => r.code === 'CENTER_ADMIN');
  const researcherRole = roles.find(r => r.code === 'RESEARCHER');
  const medicalOfficerRole = roles.find(r => r.code === 'MEDICAL_OFFICER');
  const dataEntryRole = roles.find(r => r.code === 'DATA_ENTRY');

  if (!systemAdminRole || !nationalAdminRole || !centerAdminRole || !researcherRole || !medicalOfficerRole || !dataEntryRole) {
    throw new Error('Required roles not found. Please seed roles first.');
  }

  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = [
    // System Admin (1)
    {
      email: 'admin@inamsos.go.id',
      password: hashedPassword,
      name: 'Super Administrator',
      roleId: systemAdminRole.id,
      centerId: null,
      isActive: true,
    },

    // National Admin (2)
    {
      email: 'national.admin@inamsos.go.id',
      password: hashedPassword,
      name: 'Dr. Ahmad Hidayat',
      roleId: nationalAdminRole.id,
      centerId: null,
      isActive: true,
    },

    // Center Admins (3 major centers)
    {
      email: 'admin.rscm@inamsos.go.id',
      password: hashedPassword,
      name: 'Dr. Budi Santoso',
      roleId: centerAdminRole.id,
      centerId: centers.find(c => c.name.includes('Cipto Mangunkusumo'))?.id || centers[0].id,
      isActive: true,
    },
    {
      email: 'admin.sardjito@inamsos.go.id',
      password: hashedPassword,
      name: 'Dr. Dewi Ratnasari',
      roleId: centerAdminRole.id,
      centerId: centers.find(c => c.name.includes('Sardjito'))?.id || centers[1].id,
      isActive: true,
    },
    {
      email: 'admin.soetomo@inamsos.go.id',
      password: hashedPassword,
      name: 'Dr. Eko Prasetyo',
      roleId: centerAdminRole.id,
      centerId: centers.find(c => c.name.includes('Soetomo'))?.id || centers[2].id,
      isActive: true,
    },

    // Researchers (3)
    {
      email: 'researcher1@inamsos.go.id',
      password: hashedPassword,
      name: 'Dr. Fajar Nugroho',
      roleId: researcherRole.id,
      centerId: centers[0].id,
      isActive: true,
    },
    {
      email: 'researcher2@inamsos.go.id',
      password: hashedPassword,
      name: 'Dr. Indah Lestari',
      roleId: researcherRole.id,
      centerId: centers[1].id,
      isActive: true,
    },

    // Medical Officers (4)
    {
      email: 'medical.officer@inamsos.go.id',
      password: hashedPassword,
      name: 'Dr. Hendra Wijaya',
      roleId: medicalOfficerRole.id,
      centerId: centers[0].id,
      isActive: true,
    },
    {
      email: 'dr.kusuma@inamsos.go.id',
      password: hashedPassword,
      name: 'Dr. Joko Kusuma',
      roleId: medicalOfficerRole.id,
      centerId: centers[1].id,
      isActive: true,
    },
    {
      email: 'dr.wati@inamsos.go.id',
      password: hashedPassword,
      name: 'Dr. Nina Rahmawati',
      roleId: medicalOfficerRole.id,
      centerId: centers[2].id,
      isActive: true,
    },
    {
      email: 'dr.saputra@inamsos.go.id',
      password: hashedPassword,
      name: 'Dr. Agus Saputra',
      roleId: medicalOfficerRole.id,
      centerId: centers[3].id,
      isActive: true,
    },

    // Data Entry Staff (4)
    {
      email: 'dataentry1@inamsos.go.id',
      password: hashedPassword,
      name: 'Ratna Susanti',
      roleId: dataEntryRole.id,
      centerId: centers[0].id,
      isActive: true,
    },
    {
      email: 'dataentry2@inamsos.go.id',
      password: hashedPassword,
      name: 'Sari Hartono',
      roleId: dataEntryRole.id,
      centerId: centers[1].id,
      isActive: true,
    },
    {
      email: 'dataentry3@inamsos.go.id',
      password: hashedPassword,
      name: 'Tuti Firmansyah',
      roleId: dataEntryRole.id,
      centerId: centers[2].id,
      isActive: true,
    },
    {
      email: 'dataentry4@inamsos.go.id',
      password: hashedPassword,
      name: 'Wati Setiawan',
      roleId: dataEntryRole.id,
      centerId: centers[3].id,
      isActive: true,
    },
  ];

  const createdUsers = [];
  for (const userData of users) {
    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (!existing) {
      const created = await prisma.user.create({
        data: userData,
      });
      createdUsers.push(created);
    }
  }

  console.log(`✅ Created ${createdUsers.length} users`);
  return createdUsers;
}
