import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ROLES = [
  {
    code: 'SYSTEM_ADMIN',
    name: 'System Administrator',
    description: 'Full system access with all permissions',
    level: 4,
  },
  {
    code: 'NATIONAL_ADMIN',
    name: 'National Administrator',
    description: 'National oversight with cross-center access',
    level: 3,
  },
  {
    code: 'CENTER_ADMIN',
    name: 'Center Administrator',
    description: 'Center-level management and oversight',
    level: 2,
  },
  {
    code: 'RESEARCHER',
    name: 'Researcher',
    description: 'Research data access and analytics',
    level: 2,
  },
  {
    code: 'DATA_ENTRY',
    name: 'Data Entry Staff',
    description: 'Patient data entry and quality assurance',
    level: 1,
  },
  {
    code: 'MEDICAL_OFFICER',
    name: 'Medical Officer',
    description: 'Medical validation and case review',
    level: 2,
  },
];

const PERMISSIONS = [
  // User Management Permissions
  { name: 'Create Users', code: 'USERS_CREATE', resource: 'users', action: 'create', description: 'Create new users' },
  { name: 'Read Users', code: 'USERS_READ', resource: 'users', action: 'read', description: 'View user information' },
  { name: 'Update Users', code: 'USERS_UPDATE', resource: 'users', action: 'update', description: 'Update user accounts' },
  { name: 'Delete Users', code: 'USERS_DELETE', resource: 'users', action: 'delete', description: 'Delete user accounts' },
  { name: 'Read All Users', code: 'USERS_READ_ALL', resource: 'users', action: 'read_all', description: 'View all users across centers' },

  // Center Management Permissions
  { name: 'Create Centers', code: 'CENTERS_CREATE', resource: 'centers', action: 'create', description: 'Create new centers' },
  { name: 'Read Centers', code: 'CENTERS_READ', resource: 'centers', action: 'read', description: 'View center information' },
  { name: 'Update Centers', code: 'CENTERS_UPDATE', resource: 'centers', action: 'update', description: 'Update center details' },
  { name: 'Delete Centers', code: 'CENTERS_DELETE', resource: 'centers', action: 'delete', description: 'Delete centers' },
  { name: 'Read All Centers', code: 'CENTERS_READ_ALL', resource: 'centers', action: 'read_all', description: 'View all centers' },

  // Patient Data Permissions
  { name: 'Create Patients', code: 'PATIENTS_CREATE', resource: 'patients', action: 'create', description: 'Create patient records' },
  { name: 'Read Patients', code: 'PATIENTS_READ', resource: 'patients', action: 'read', description: 'View patient data' },
  { name: 'Update Patients', code: 'PATIENTS_UPDATE', resource: 'patients', action: 'update', description: 'Update patient records' },
  { name: 'Delete Patients', code: 'PATIENTS_DELETE', resource: 'patients', action: 'delete', description: 'Delete patient records' },
  { name: 'Export Patients', code: 'PATIENTS_EXPORT', resource: 'patients', action: 'export', description: 'Export patient data' },
  { name: 'Read All Patients', code: 'PATIENTS_READ_ALL', resource: 'patients', action: 'read_all', description: 'View all patient data across centers' },

  // Medical Records Permissions
  { name: 'Create Medical Records', code: 'MEDICAL_RECORDS_CREATE', resource: 'medical_records', action: 'create', description: 'Create medical records' },
  { name: 'Read Medical Records', code: 'MEDICAL_RECORDS_READ', resource: 'medical_records', action: 'read', description: 'View medical records' },
  { name: 'Update Medical Records', code: 'MEDICAL_RECORDS_UPDATE', resource: 'medical_records', action: 'update', description: 'Update medical records' },
  { name: 'Delete Medical Records', code: 'MEDICAL_RECORDS_DELETE', resource: 'medical_records', action: 'delete', description: 'Delete medical records' },

  // Diagnosis Management Permissions
  { name: 'Create Diagnosis', code: 'DIAGNOSIS_CREATE', resource: 'diagnosis', action: 'create', description: 'Create patient diagnosis' },
  { name: 'Read Diagnosis', code: 'DIAGNOSIS_READ', resource: 'diagnosis', action: 'read', description: 'View patient diagnosis' },
  { name: 'Update Diagnosis', code: 'DIAGNOSIS_UPDATE', resource: 'diagnosis', action: 'update', description: 'Update patient diagnosis' },
  { name: 'Delete Diagnosis', code: 'DIAGNOSIS_DELETE', resource: 'diagnosis', action: 'delete', description: 'Delete patient diagnosis' },

  // Treatment Management Permissions
  { name: 'Create Treatments', code: 'TREATMENTS_CREATE', resource: 'treatments', action: 'create', description: 'Create patient treatments' },
  { name: 'Read Treatments', code: 'TREATMENTS_READ', resource: 'treatments', action: 'read', description: 'View patient treatments' },
  { name: 'Update Treatments', code: 'TREATMENTS_UPDATE', resource: 'treatments', action: 'update', description: 'Update patient treatments' },
  { name: 'Delete Treatments', code: 'TREATMENTS_DELETE', resource: 'treatments', action: 'delete', description: 'Delete patient treatments' },

  // Vital Signs Monitoring Permissions
  { name: 'Create Vital Signs', code: 'VITAL_SIGNS_CREATE', resource: 'vital_signs', action: 'create', description: 'Record patient vital signs' },
  { name: 'Read Vital Signs', code: 'VITAL_SIGNS_READ', resource: 'vital_signs', action: 'read', description: 'View patient vital signs' },
  { name: 'Update Vital Signs', code: 'VITAL_SIGNS_UPDATE', resource: 'vital_signs', action: 'update', description: 'Update patient vital signs' },
  { name: 'Delete Vital Signs', code: 'VITAL_SIGNS_DELETE', resource: 'vital_signs', action: 'delete', description: 'Delete patient vital signs' },
  { name: 'Manage Alerts', code: 'VITAL_SIGNS_ALERTS', resource: 'vital_signs', action: 'manage_alerts', description: 'Manage vital signs alerts' },

  // Laboratory Management Permissions
  { name: 'Create Lab Orders', code: 'LABORATORY_CREATE', resource: 'laboratory', action: 'create', description: 'Create laboratory test orders' },
  { name: 'Read Lab Orders', code: 'LABORATORY_READ', resource: 'laboratory', action: 'read', description: 'View laboratory test orders and results' },
  { name: 'Update Lab Orders', code: 'LABORATORY_UPDATE', resource: 'laboratory', action: 'update', description: 'Update laboratory test orders and results' },
  { name: 'Delete Lab Orders', code: 'LABORATORY_DELETE', resource: 'laboratory', action: 'delete', description: 'Delete laboratory test orders' },

  // Radiology Management Permissions
  { name: 'Create Radiology Orders', code: 'RADIOLOGY_CREATE', resource: 'radiology', action: 'create', description: 'Create radiology imaging orders' },
  { name: 'Read Radiology Orders', code: 'RADIOLOGY_READ', resource: 'radiology', action: 'read', description: 'View radiology imaging orders and reports' },
  { name: 'Update Radiology Orders', code: 'RADIOLOGY_UPDATE', resource: 'radiology', action: 'update', description: 'Update radiology imaging orders and reports' },
  { name: 'Delete Radiology Orders', code: 'RADIOLOGY_DELETE', resource: 'radiology', action: 'delete', description: 'Delete radiology imaging orders' },

  // Cancer Registry Analytics Permissions
  { name: 'Read Cancer Registry', code: 'CANCER_REGISTRY_READ', resource: 'cancer_registry', action: 'read', description: 'View cancer registry analytics and reports' },
  { name: 'Export Cancer Registry', code: 'CANCER_REGISTRY_EXPORT', resource: 'cancer_registry', action: 'export', description: 'Export cancer registry data and reports' },

  // Research Management Permissions
  { name: 'Create Research', code: 'RESEARCH_CREATE', resource: 'research', action: 'create', description: 'Create research protocols and requests' },
  { name: 'Read Research', code: 'RESEARCH_READ', resource: 'research', action: 'read', description: 'View research protocols and requests' },
  { name: 'Update Research', code: 'RESEARCH_UPDATE', resource: 'research', action: 'update', description: 'Update research protocols and requests' },
  { name: 'Approve Research', code: 'RESEARCH_APPROVE', resource: 'research', action: 'approve', description: 'Approve research requests and protocols' },
  { name: 'Export Research', code: 'RESEARCH_EXPORT', resource: 'research', action: 'export', description: 'Export research data and reports' },

  // Population Health Analytics Permissions
  { name: 'Read Population Health', code: 'POPULATION_HEALTH_READ', resource: 'population_health', action: 'read', description: 'View population health analytics and reports' },
  { name: 'Export Population Health', code: 'POPULATION_HEALTH_EXPORT', resource: 'population_health', action: 'export', description: 'Export population health data and reports' },

  // Predictive Analytics Permissions
  { name: 'Read Predictive Analytics', code: 'PREDICTIVE_ANALYTICS_READ', resource: 'predictive_analytics', action: 'read', description: 'View predictive analytics and ML insights' },
  { name: 'Use Predictive Analytics', code: 'PREDICTIVE_ANALYTICS_USE', resource: 'predictive_analytics', action: 'use', description: 'Use predictive analytics for patient care' },

  // Analytics Permissions
  { name: 'View Analytics', code: 'ANALYTICS_VIEW', resource: 'analytics', action: 'read', description: 'View analytics dashboards' },

  // Role Management Permissions
  { name: 'Create Roles', code: 'ROLES_CREATE', resource: 'roles', action: 'create', description: 'Create new roles' },
  { name: 'Read Roles', code: 'ROLES_READ', resource: 'roles', action: 'read', description: 'View role information' },
  { name: 'Update Roles', code: 'ROLES_UPDATE', resource: 'roles', action: 'update', description: 'Update role details and permissions' },
  { name: 'Delete Roles', code: 'ROLES_DELETE', resource: 'roles', action: 'delete', description: 'Delete roles' },
  { name: 'Read Permissions', code: 'PERMISSIONS_READ', resource: 'permissions', action: 'read', description: 'View permission information' },

  // System Administration Permissions
  { name: 'Read Audit', code: 'AUDIT_READ', resource: 'audit', action: 'read', description: 'View audit logs' },
  { name: 'Update Config', code: 'CONFIG_UPDATE', resource: 'config', action: 'update', description: 'Update system configuration' },
  { name: 'Create Backup', code: 'BACKUP_CREATE', resource: 'backup', action: 'create', description: 'Create system backups' },
  { name: 'Monitor System', code: 'SYSTEM_MONITOR', resource: 'system', action: 'monitor', description: 'Monitor system health' },
];

async function seedRolesAndPermissions() {
  console.log('🌱 Seeding roles and permissions...');

  try {
    // Clear existing roles and permissions
    await prisma.rolePermission.deleteMany();
    await prisma.role.deleteMany();
    await prisma.permission.deleteMany();

    // Insert roles
    console.log('📋 Creating roles...');
    for (const role of ROLES) {
      await prisma.role.create({
        data: role,
      });
      console.log(`✅ Role created: ${role.name} (${role.code})`);
    }

    // Insert permissions
    console.log('📋 Creating permissions...');
    for (const permission of PERMISSIONS) {
      await prisma.permission.create({
        data: permission,
      });
      console.log(`✅ Permission created: ${permission.code} - ${permission.description}`);
    }

    // Assign permissions to roles based on healthcare compliance
    console.log('🔐 Assigning permissions to roles...');

    // SYSTEM_ADMIN - All permissions
    const systemAdmin = await prisma.role.findUnique({ where: { code: 'SYSTEM_ADMIN' } });
    const allPermissions = await prisma.permission.findMany();
    for (const permission of allPermissions) {
      await prisma.rolePermission.create({
        data: {
          roleId: systemAdmin.id,
          permissionId: permission.id,
        },
      });
    }

    // NATIONAL_ADMIN - Cross-center access
    const nationalAdmin = await prisma.role.findUnique({ where: { code: 'NATIONAL_ADMIN' } });
    const nationalPermissions = allPermissions.filter(p =>
      p.code.includes('READ') ||
      p.code.includes('UPDATE') ||
      p.code.includes('APPROVE') ||
      p.code.includes('MONITOR') ||
      p.code === 'SYSTEM_MONITOR'
    );
    for (const permission of nationalPermissions) {
      await prisma.rolePermission.create({
        data: {
          roleId: nationalAdmin.id,
          permissionId: permission.id,
        },
      });
    }

    // CENTER_ADMIN - Center-level management
    const centerAdmin = await prisma.role.findUnique({ where: { code: 'CENTER_ADMIN' } });
    const centerPermissions = allPermissions.filter(p =>
      p.resource === 'centers' ||
      p.resource === 'users' ||
      (p.resource === 'patients' && p.action !== 'delete') ||
      (p.resource === 'medical_records' && p.action !== 'delete') ||
      (p.resource === 'diagnosis' && p.action !== 'delete') ||
      (p.resource === 'treatments' && p.action !== 'delete') ||
      (p.resource === 'vital_signs' && p.action !== 'delete') ||
      (p.resource === 'laboratory' && p.action !== 'delete') ||
      (p.resource === 'radiology' && p.action !== 'delete') ||
      (p.resource === 'cancer_registry') ||
      (p.resource === 'research' && p.action !== 'delete') ||
      (p.resource === 'population_health') ||
      (p.resource === 'predictive_analytics' && p.action !== 'delete') ||
      p.resource === 'analytics' ||
      p.resource === 'data_migration' ||
      p.resource === 'backups' ||
      p.resource === 'monitoring' ||
      p.resource === 'alerts' ||
      p.resource === 'audit_logs' ||
      p.code === 'SYSTEM_MONITOR'
    );
    for (const permission of centerPermissions) {
      await prisma.rolePermission.create({
        data: {
          roleId: centerAdmin.id,
          permissionId: permission.id,
        },
      });
    }

    // RESEARCHER - Research and analytics access
    const researcher = await prisma.role.findUnique({ where: { code: 'RESEARCHER' } });
    const researchPermissions = allPermissions.filter(p =>
      p.resource === 'research' ||
      p.resource === 'analytics' ||
      p.resource === 'cancer_registry' ||
      p.resource === 'population_health' ||
      p.resource === 'predictive_analytics' ||
      (p.resource === 'patients' && (p.action === 'read' || p.action === 'read_all' || p.action === 'export')) ||
      (p.resource === 'medical_records' && p.action === 'read') ||
      (p.resource === 'diagnosis' && p.action === 'read') ||
      (p.resource === 'treatments' && p.action === 'read') ||
      (p.resource === 'vital_signs' && p.action === 'read') ||
      (p.resource === 'laboratory' && p.action === 'read') ||
      (p.resource === 'radiology' && p.action === 'read')
    );
    for (const permission of researchPermissions) {
      await prisma.rolePermission.create({
        data: {
          roleId: researcher.id,
          permissionId: permission.id,
        },
      });
    }

    // DATA_ENTRY - Patient data management
    const dataEntry = await prisma.role.findUnique({ where: { code: 'DATA_ENTRY' } });
    const dataEntryPermissions = allPermissions.filter(p =>
      p.resource === 'patients' &&
      (p.action === 'create' || p.action === 'read' || p.action === 'update')
    );
    for (const permission of dataEntryPermissions) {
      await prisma.rolePermission.create({
        data: {
          roleId: dataEntry.id,
          permissionId: permission.id,
        },
      });
    }

    // MEDICAL_OFFICER - Medical validation and case review
    const medicalOfficer = await prisma.role.findUnique({ where: { code: 'MEDICAL_OFFICER' } });
    const medicalPermissions = allPermissions.filter(p =>
      (p.resource === 'patients' && (p.action === 'read' || p.action === 'update' || p.action === 'read_all')) ||
      (p.resource === 'medical_records' && (p.action === 'create' || p.action === 'read' || p.action === 'update')) ||
      (p.resource === 'diagnosis' && (p.action === 'create' || p.action === 'read' || p.action === 'update')) ||
      (p.resource === 'treatments' && (p.action === 'create' || p.action === 'read' || p.action === 'update')) ||
      (p.resource === 'vital_signs' && (p.action === 'create' || p.action === 'read' || p.action === 'update' || p.action === 'manage_alerts')) ||
      (p.resource === 'laboratory' && (p.action === 'create' || p.action === 'read' || p.action === 'update')) ||
      (p.resource === 'radiology' && (p.action === 'create' || p.action === 'read' || p.action === 'update')) ||
      (p.resource === 'cancer_registry') ||
      (p.resource === 'research' && (p.action === 'read' || p.action === 'create')) ||
      (p.resource === 'population_health') ||
      (p.resource === 'predictive_analytics' && (p.action === 'read' || p.action === 'use')) ||
      p.resource === 'analytics'
    );
    for (const permission of medicalPermissions) {
      await prisma.rolePermission.create({
        data: {
          roleId: medicalOfficer.id,
          permissionId: permission.id,
        },
      });
    }

    console.log('✅ Roles and permissions seeded successfully!');

    // Display role summary
    const rolesWithPermissionCounts = await prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    console.log('\n📊 Role Permission Summary:');
    for (const role of rolesWithPermissionCounts) {
      console.log(`${role.name} (${role.code}): ${role.permissions.length} permissions - Level ${role.level}`);
    }

  } catch (error) {
    console.error('❌ Error seeding roles and permissions:', error);
    throw error;
  }
}

async function seedDefaultCenter() {
  console.log('🏥 Creating default center...');

  try {
    // Check if center already exists
    const existingCenter = await prisma.center.findFirst();
    if (existingCenter) {
      console.log('✅ Default center already exists');
      return;
    }

    const center = await prisma.center.create({
      data: {
        name: 'Default Center',
        code: 'DEFAULT',
        province: 'DKI Jakarta',
        regency: 'Jakarta Pusat',
        address: 'Jl. Default Center No. 1, Jakarta Pusat',
        isActive: true,
      },
    });

    console.log(`✅ Default center created: ${center.name} (${center.code})`);
    return center;

  } catch (error) {
    console.error('❌ Error creating default center:', error);
    throw error;
  }
}

async function seedDemoUsers() {
  console.log('👥 Creating demo users...');

  try {
    const defaultCenter = await prisma.center.findFirst({
      where: { code: 'DEFAULT' }
    });

    if (!defaultCenter) {
      throw new Error('Default center not found');
    }

    const demoUsers = [
      {
        email: 'admin@inamsos.go.id',
        name: 'System Administrator',
        password: 'admin123',
        role: 'SYSTEM_ADMIN',
        kolegiumId: 'ADMIN001',
      },
      {
        email: 'national.admin@inamsos.go.id',
        name: 'National Administrator',
        password: 'national123',
        role: 'NATIONAL_ADMIN',
        kolegiumId: 'NATIONAL001',
      },
      {
        email: 'center.admin@inamsos.go.id',
        name: 'Center Administrator',
        password: 'center123',
        role: 'CENTER_ADMIN',
        kolegiumId: 'CENTER001',
      },
      {
        email: 'researcher@inamsos.go.id',
        name: 'Cancer Researcher',
        password: 'research123',
        role: 'RESEARCHER',
        kolegiumId: 'RESEARCH001',
      },
      {
        email: 'medical.officer@inamsos.go.id',
        name: 'Medical Officer',
        password: 'medical123',
        role: 'MEDICAL_OFFICER',
        kolegiumId: 'MEDICAL001',
      },
      {
        email: 'staff@inamsos.go.id',
        name: 'Data Entry Staff',
        password: 'staff123',
        role: 'DATA_ENTRY',
        kolegiumId: null,
      },
    ];

    for (const demoUser of demoUsers) {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: demoUser.email }
      });

      if (existingUser) {
        console.log(`✅ Demo user already exists: ${demoUser.email}`);
        continue;
      }

      // Hash password
      const passwordHash = await require('bcrypt').hash(demoUser.password, 12);

      // Create user
      const user = await prisma.user.create({
        data: {
          email: demoUser.email,
          name: demoUser.name,
          passwordHash,
          kolegiumId: demoUser.kolegiumId,
          isEmailVerified: true,
          isActive: true,
          centerId: defaultCenter.id,
        },
      });

      // Assign role
      if (demoUser.role) {
        const role = await prisma.role.findUnique({ where: { code: demoUser.role } });
        if (role) {
          await prisma.userRole.create({
            data: {
              userId: user.id,
              roleId: role.id,
              isActive: true,
            },
          });
        }
      }

      console.log(`✅ Demo user created: ${demoUser.email} (${demoUser.role})`);
    }

    console.log('\n📊 Demo Users Created:');
    console.log('🔹 admin@inamsos.go.id / admin123 (System Admin)');
    console.log('🔹 national.admin@inamsos.go.id / national123 (National Admin)');
    console.log('🔹 center.admin@inamsos.go.id / center123 (Center Admin)');
    console.log('🔹 researcher@inamsos.go.id / research123 (Researcher)');
    console.log('🔹 medical.officer@inamsos.go.id / medical123 (Medical Officer)');
    console.log('🔹 staff@inamsos.go.id / staff123 (Data Entry Staff)');

  } catch (error) {
    console.error('❌ Error creating demo users:', error);
    throw error;
  }
}

async function main() {
  try {
    console.log('🚀 Starting database seeding...');

    await seedDefaultCenter();
    await seedRolesAndPermissions();
    await seedDemoUsers();

    console.log('\n✅ Database seeding completed successfully!');

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();