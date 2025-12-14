import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetToZero() {
  console.log('🔄 RESET DATABASE - Menghapus semua data operasional...\n');
  console.log('⚠️  PERHATIAN: Script ini akan menghapus:');
  console.log('   ❌ Semua patients dan data klinis');
  console.log('   ❌ Semua centers');
  console.log('   ❌ Semua users KECUALI admin@inamsos.go.id');
  console.log('   ❌ Semua audit logs');
  console.log('');
  console.log('✅ TETAP DIPERTAHANKAN:');
  console.log('   ✓ User admin@inamsos.go.id');
  console.log('   ✓ Roles & Permissions');
  console.log('   ✓ Reference data (WHO, locations, syndromes)');
  console.log('\n' + '='.repeat(60) + '\n');

  try {
    // ========================================
    // STEP 1: Delete all patient-related data
    // ========================================
    console.log('📋 STEP 1: Menghapus semua data pasien...');

    console.log('  → Menghapus pathology reports...');
    await prisma.pathologyReport.deleteMany({});

    console.log('  → Menghapus medical images...');
    await prisma.medicalImage.deleteMany({});

    console.log('  → Menghapus patient visits...');
    await prisma.patientVisit.deleteMany({});

    console.log('  → Menghapus patient consents...');
    await prisma.patientConsent.deleteMany({});

    console.log('  → Menghapus patient procedures...');
    await prisma.patientProcedure.deleteMany({});

    console.log('  → Menghapus radiology results...');
    await prisma.radiologyResult.deleteMany({});

    console.log('  → Menghapus laboratory results...');
    await prisma.laboratoryResult.deleteMany({});

    console.log('  → Menghapus vital signs...');
    await prisma.vitalSign.deleteMany({});

    console.log('  → Menghapus patient medications...');
    await prisma.patientMedication.deleteMany({});

    console.log('  → Menghapus patient allergies...');
    await prisma.patientAllergy.deleteMany({});

    console.log('  → Menghapus patient diagnoses...');
    await prisma.patientDiagnosis.deleteMany({});

    console.log('  → Menghapus medical records...');
    await prisma.medicalRecord.deleteMany({});

    console.log('  → Menghapus patients...');
    const deletedPatients = await prisma.patient.deleteMany({});
    console.log(`  ✅ ${deletedPatients.count} patients dihapus\n`);

    // ========================================
    // STEP 2: Delete audit logs
    // ========================================
    console.log('📋 STEP 2: Menghapus audit logs...');
    const deletedLogs = await prisma.auditLog.deleteMany({});
    console.log(`  ✅ ${deletedLogs.count} audit logs dihapus\n`);

    // ========================================
    // STEP 3: Delete all users EXCEPT admin@inamsos.go.id
    // ========================================
    console.log('📋 STEP 3: Menghapus users (kecuali admin@inamsos.go.id)...');

    // First, delete user roles for users that will be deleted
    const usersToDelete = await prisma.user.findMany({
      where: {
        email: {
          not: 'admin@inamsos.go.id'
        }
      },
      select: { id: true, email: true }
    });

    console.log(`  → Ditemukan ${usersToDelete.length} users yang akan dihapus`);

    // Delete user roles
    console.log('  → Menghapus user roles...');
    await prisma.userRole.deleteMany({
      where: {
        userId: {
          in: usersToDelete.map(u => u.id)
        }
      }
    });

    // Delete users
    console.log('  → Menghapus users...');
    const deletedUsers = await prisma.user.deleteMany({
      where: {
        email: {
          not: 'admin@inamsos.go.id'
        }
      }
    });
    console.log(`  ✅ ${deletedUsers.count} users dihapus`);
    console.log(`  ✅ admin@inamsos.go.id TETAP ADA (tidak dihapus)\n`);

    // ========================================
    // STEP 4: Delete system/administrative data
    // ========================================
    console.log('📋 STEP 4: Menghapus data sistem dan administratif...');

    // Delete all offline queue data
    console.log('  → Menghapus offline queue...');
    await prisma.offlineDataQueue.deleteMany({});

    // Delete performance metrics
    console.log('  → Menghapus performance metrics...');
    await prisma.performanceMetric.deleteMany({});

    // Delete scheduled tasks
    console.log('  → Menghapus scheduled tasks...');
    await prisma.scheduledTask.deleteMany({});

    // Delete external integrations
    console.log('  → Menghapus external integrations...');
    await prisma.externalIntegration.deleteMany({});

    // Delete system configuration
    console.log('  → Menghapus system configuration...');
    await prisma.systemConfiguration.deleteMany({});

    // Delete analytics metrics
    console.log('  → Menghapus analytics metrics...');
    await prisma.analyticsPerformanceMetric.deleteMany({});
    await prisma.centerBenchmark.deleteMany({});

    // Delete report templates
    console.log('  → Menghapus report templates...');
    await prisma.reportTemplate.deleteMany({});

    // Update admin user centerId to null before deleting centers
    console.log('  → Mengupdate admin user (set centerId to null)...');
    await prisma.user.updateMany({
      where: { email: 'admin@inamsos.go.id' },
      data: { centerId: null }
    });

    // Now we can safely delete all centers
    console.log('  → Menghapus centers...');
    const deletedCenters = await prisma.center.deleteMany({});
    console.log(`  ✅ ${deletedCenters.count} centers dihapus\n`);

    // ========================================
    // STEP 5: Verify what remains
    // ========================================
    console.log('📋 STEP 5: Verifikasi data yang tersisa...\n');

    const remainingPatients = await prisma.patient.count();
    const remainingUsers = await prisma.user.count();
    const remainingCenters = await prisma.center.count();
    const remainingLogs = await prisma.auditLog.count();
    const remainingRoles = await prisma.role.count();
    const remainingPermissions = await prisma.permission.count();

    // Check admin user
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@inamsos.go.id' },
      include: {
        userRoles: {
          include: {
            role: true
          }
        }
      }
    });

    console.log('📊 RINGKASAN DATA TERSISA:');
    console.log('─'.repeat(60));
    console.log(`  Patients         : ${remainingPatients} (harus 0)`);
    console.log(`  Users            : ${remainingUsers} (harus 1)`);
    console.log(`  Centers          : ${remainingCenters} (harus 0)`);
    console.log(`  Audit Logs       : ${remainingLogs} (harus 0)`);
    console.log(`  Roles            : ${remainingRoles} (tetap ada)`);
    console.log(`  Permissions      : ${remainingPermissions} (tetap ada)`);
    console.log('');

    if (adminUser) {
      console.log('✅ USER ADMIN:');
      console.log(`  Email  : ${adminUser.email}`);
      console.log(`  Name   : ${adminUser.name}`);
      console.log(`  Role   : ${adminUser.userRoles[0]?.role?.name || 'No role'}`);
      console.log(`  Active : ${adminUser.isActive ? 'Yes' : 'No'}`);
    } else {
      console.log('❌ ERROR: admin@inamsos.go.id TIDAK DITEMUKAN!');
    }

    console.log('\n' + '='.repeat(60));

    if (remainingPatients === 0 && remainingUsers === 1 && remainingCenters === 0 && adminUser) {
      console.log('✅ DATABASE BERHASIL DI-RESET!');
      console.log('✅ Siap untuk mulai dari nol dengan admin@inamsos.go.id');
    } else {
      console.log('⚠️  PERHATIAN: Ada data yang tidak sesuai!');
      if (remainingPatients !== 0) console.log(`   ❌ Masih ada ${remainingPatients} patients`);
      if (remainingUsers !== 1) console.log(`   ❌ Jumlah users: ${remainingUsers} (seharusnya 1)`);
      if (remainingCenters !== 0) console.log(`   ❌ Masih ada ${remainingCenters} centers`);
      if (!adminUser) console.log('   ❌ admin@inamsos.go.id tidak ditemukan');
    }
    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

resetToZero()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
