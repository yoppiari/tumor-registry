import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyClean() {
  console.log('🔍 Memverifikasi kebersihan database...\n');

  try {
    const tables = [
      'pathologyReport',
      'medicalImage',
      'patientVisit',
      'patientConsent',
      'patientProcedure',
      'radiologyResult',
      'laboratoryResult',
      'vitalSign',
      'patientMedication',
      'patientAllergy',
      'patientDiagnosis',
      'medicalRecord',
      'patient',
    ];

    let allClean = true;

    for (const table of tables) {
      const count = await (prisma as any)[table].count();
      const status = count === 0 ? '✅' : '❌';
      console.log(`${status} ${table}: ${count} records`);

      if (count !== 0) {
        allClean = false;
      }
    }

    console.log('\n' + '='.repeat(50));
    if (allClean) {
      console.log('✅ DATABASE BERSIH - Semua tabel pasien kosong!');
      console.log('✅ Siap untuk registrasi pasien baru dengan form INAMSOS 100%');
    } else {
      console.log('❌ MASIH ADA DATA - Beberapa tabel belum bersih');
    }
    console.log('='.repeat(50) + '\n');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

verifyClean()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
