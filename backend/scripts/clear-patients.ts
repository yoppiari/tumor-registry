import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearPatients() {
  console.log('🗑️  Menghapus semua data pasien...');

  try {
    // Delete in correct order (child tables first, respect foreign keys)
    console.log('Menghapus pathology reports...');
    await prisma.pathologyReport.deleteMany({});

    console.log('Menghapus medical images...');
    await prisma.medicalImage.deleteMany({});

    console.log('Menghapus patient visits...');
    await prisma.patientVisit.deleteMany({});

    console.log('Menghapus patient consents...');
    await prisma.patientConsent.deleteMany({});

    console.log('Menghapus patient procedures...');
    await prisma.patientProcedure.deleteMany({});

    console.log('Menghapus radiology results...');
    await prisma.radiologyResult.deleteMany({});

    console.log('Menghapus laboratory results...');
    await prisma.laboratoryResult.deleteMany({});

    console.log('Menghapus vital signs...');
    await prisma.vitalSign.deleteMany({});

    console.log('Menghapus patient medications...');
    await prisma.patientMedication.deleteMany({});

    console.log('Menghapus patient allergies...');
    await prisma.patientAllergy.deleteMany({});

    console.log('Menghapus patient diagnoses...');
    await prisma.patientDiagnosis.deleteMany({});

    console.log('Menghapus medical records...');
    await prisma.medicalRecord.deleteMany({});

    console.log('Menghapus patients...');
    const deletedPatients = await prisma.patient.deleteMany({});

    console.log(`✅ Berhasil menghapus ${deletedPatients.count} pasien dan semua data terkait`);
    
    // Verify deletion
    const remainingPatients = await prisma.patient.count();
    console.log(`✅ Jumlah pasien tersisa: ${remainingPatients}`);
    console.log('✅ Database bersih - siap mulai dari awal!');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

clearPatients()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
