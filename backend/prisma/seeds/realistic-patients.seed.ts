import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to generate random date within range
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Helper function to generate Indonesian name
function generateIndonesianName(gender: string): string {
  const maleFirstNames = ['Ahmad', 'Budi', 'Dedi', 'Eko', 'Fajar', 'Hadi', 'Iwan', 'Joko', 'Andi', 'Rudi', 'Agus', 'Bambang', 'Doni', 'Faisal', 'Hendra'];
  const femaleFirstNames = ['Ani', 'Dewi', 'Eka', 'Fitri', 'Lia', 'Nina', 'Ratna', 'Sari', 'Tuti', 'Wati', 'Ayu', 'Dian', 'Indah', 'Lestari', 'Maya'];
  const lastNames = ['Santoso', 'Wijaya', 'Prasetyo', 'Kusuma', 'Nugroho', 'Saputra', 'Rahmawati', 'Susanto', 'Hartono', 'Firmansyah', 'Setiawan', 'Kurniawan', 'Hidayat', 'Pratama', 'Utomo'];

  const firstNames = gender === 'MALE' ? maleFirstNames : femaleFirstNames;
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

  return `${firstName} ${lastName}`;
}

// Helper to generate NIK (Indonesian ID number)
function generateNIK(): string {
  const digits = Math.floor(1000000000000000 + Math.random() * 9000000000000000);
  return digits.toString();
}

// Helper to generate MR number
function generateMRNumber(index: number, centerId: string): string {
  const year = new Date().getFullYear();
  const centerCode = centerId.substring(0, 3).toUpperCase();
  return `${centerCode}-${year}-${String(index).padStart(4, '0')}`;
}

// Helper to get random phone number
function generatePhone(): string {
  return `08${Math.floor(10000000000 + Math.random() * 90000000000)}`;
}

// Tumor type distribution (realistic for musculoskeletal)
const TUMOR_TYPES = [
  { name: 'Osteosarcoma', count: 18, ageRange: [10, 25], commonLocations: ['femur_distal', 'tibia_proximal', 'humerus_proximal'] },
  { name: 'Ewing Sarcoma', count: 10, ageRange: [5, 20], commonLocations: ['femur_diaphysis', 'tibia_diaphysis', 'pelvis'] },
  { name: 'Chondrosarcoma', count: 8, ageRange: [30, 60], commonLocations: ['femur_proximal', 'pelvis', 'ribs'] },
  { name: 'Giant Cell Tumor', count: 6, ageRange: [20, 40], commonLocations: ['femur_distal', 'tibia_proximal', 'radius_distal'] },
  { name: 'Soft Tissue Sarcoma', count: 8, ageRange: [15, 65], commonLocations: ['thigh', 'arm', 'trunk'] },
];

export async function seedRealisticPatients() {
  console.log('🌱 Seeding realistic patients...');

  // Get all centers
  const centers = await prisma.center.findMany();
  if (centers.length === 0) {
    throw new Error('No centers found. Please seed centers first.');
  }

  // Get WHO classifications
  const boneTumors = await prisma.whoBoneTumorClassification.findMany();
  const softTissueTumors = await prisma.whoSoftTissueTumorClassification.findMany();

  let patientIndex = 0;
  const patients = [];

  for (const tumorType of TUMOR_TYPES) {
    for (let i = 0; i < tumorType.count; i++) {
      patientIndex++;

      // Random center
      const center = centers[Math.floor(Math.random() * centers.length)];

      // Random gender (60% male for musculoskeletal tumors)
      const gender = Math.random() < 0.6 ? 'MALE' : 'FEMALE';

      // Age based on tumor type
      const age = Math.floor(tumorType.ageRange[0] + Math.random() * (tumorType.ageRange[1] - tumorType.ageRange[0]));
      const dateOfBirth = new Date();
      dateOfBirth.setFullYear(dateOfBirth.getFullYear() - age);

      // Diagnosis date (2020-2025)
      const diagnosisDate = randomDate(new Date('2020-01-01'), new Date('2025-12-01'));

      // First visit date (same or slightly after diagnosis)
      const firstVisitDate = new Date(diagnosisDate);
      firstVisitDate.setDate(firstVisitDate.getDate() + Math.floor(Math.random() * 14));

      // Treatment status based on how long ago diagnosis was
      const daysSinceDiagnosis = (new Date().getTime() - diagnosisDate.getTime()) / (1000 * 60 * 60 * 24);
      let treatmentStatus = 'NEW';
      if (daysSinceDiagnosis > 730) treatmentStatus = 'COMPLETED'; // >2 years
      else if (daysSinceDiagnosis > 180) treatmentStatus = 'ONGOING'; // >6 months
      else if (daysSinceDiagnosis > 60) treatmentStatus = 'ONGOING';

      // Random deceased (5% mortality)
      const isDeceased = Math.random() < 0.05;
      const dateOfDeath = isDeceased ? randomDate(diagnosisDate, new Date()) : null;

      // Get random WHO classification for this tumor type
      let whoClassificationId = null;
      if (tumorType.name === 'Soft Tissue Sarcoma') {
        const randomSTS = softTissueTumors[Math.floor(Math.random() * softTissueTumors.length)];
        whoClassificationId = randomSTS.id;
      } else {
        // Find matching bone tumor
        const matchingBoneTumor = boneTumors.find(bt => bt.diagnosis.includes(tumorType.name));
        if (matchingBoneTumor) {
          whoClassificationId = matchingBoneTumor.id;
        } else {
          whoClassificationId = boneTumors[Math.floor(Math.random() * boneTumors.length)].id;
        }
      }

      const patient = {
        // Basic patient info
        name: generateIndonesianName(gender),
        dateOfBirth,
        gender,
        nik: generateNIK(),
        medicalRecordNumber: generateMRNumber(patientIndex, center.id),
        phoneNumber: generatePhone(),
        email: Math.random() > 0.5 ? `patient${patientIndex}@example.com` : null,

        // Address fields
        address: `Jl. Kenangan No. ${Math.floor(Math.random() * 100)}`,
        village: `Desa ${['Sukamaju', 'Makmur', 'Sejahtera', 'Bahagia'][Math.floor(Math.random() * 4)]}`,
        district: `Kec. ${['Tengah', 'Utara', 'Selatan', 'Timur'][Math.floor(Math.random() * 4)]}`,
        regency: center.city,
        province: center.province,
        postalCode: String(10000 + Math.floor(Math.random() * 90000)),

        // Emergency contact as JSON
        emergencyContact: {
          name: generateIndonesianName(gender === 'MALE' ? 'FEMALE' : 'MALE'),
          relationship: ['PARENT', 'SPOUSE', 'SIBLING'][Math.floor(Math.random() * 3)],
          phone: generatePhone(),
        },

        // Demographics
        bloodType: ['A_POSITIVE', 'B_POSITIVE', 'AB_POSITIVE', 'O_POSITIVE', 'A_NEGATIVE', 'B_NEGATIVE'][Math.floor(Math.random() * 6)] as any,
        occupation: ['Pelajar', 'Mahasiswa', 'Karyawan', 'Wiraswasta', 'PNS', 'Guru', 'Petani'][Math.floor(Math.random() * 7)],
        education: ['SD', 'SMP', 'SMA', 'D3', 'S1'][Math.floor(Math.random() * 5)],
        maritalStatus: age > 20 ? (['SINGLE', 'MARRIED', 'MARRIED'][Math.floor(Math.random() * 3)] as any) : 'SINGLE',

        // Musculoskeletal tumor specific
        centerId: center.id,
        pathologyType: tumorType.name === 'Soft Tissue Sarcoma' ? 'soft_tissue_tumor' : 'bone_tumor',
        isDeceased,
        dateOfDeath,

        // Clinical data
        karnofskysScore: Math.floor(50 + Math.random() * 50), // 50-100
        onsetDate: diagnosisDate,

        // Diagnosis & Location
        whoBoneTumorId: tumorType.name === 'Soft Tissue Sarcoma' ? null : whoClassificationId,
        whoSoftTissueTumorId: tumorType.name === 'Soft Tissue Sarcoma' ? whoClassificationId : null,
        laterality: ['Left', 'Right', 'Bilateral', 'Midline'][Math.floor(Math.random() * 4)],
        histopathologyGrade: tumorType.name.includes('Sarcoma') ? 'High grade' : (['Low grade', 'High grade'][Math.floor(Math.random() * 2)]),

        // Staging
        ennekingStage: ['IA', 'IB', 'IIA', 'IIB', 'III'][Math.floor(Math.random() * 5)],
        ajccStage: ['IA', 'IB', 'IIA', 'IIB', 'III', 'IVA', 'IVB'][Math.floor(Math.random() * 7)],
        metastasisPresent: Math.random() > 0.85,
      };

      patients.push(patient);
    }
  }

  // Bulk create patients
  const createdPatients = [];
  for (const patientData of patients) {
    const created = await prisma.patient.create({
      data: patientData,
    });
    createdPatients.push(created);
  }

  console.log(`✅ Created ${createdPatients.length} realistic patients`);
  return createdPatients;
}
