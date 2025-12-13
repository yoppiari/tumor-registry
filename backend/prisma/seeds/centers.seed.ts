import { PrismaClient } from '@prisma/client';

export const musculoskeletalCenters = [
  { code: 'ACEH001', name: 'RSUD Dr. Zainoel Abidin', province: 'Aceh', regency: 'Kota Banda Aceh' },
  { code: 'SUMUT001', name: 'RSUP H Adam Malik', province: 'Sumatera Utara', regency: 'Kota Medan' },
  { code: 'SUMBAR001', name: 'RSUP Dr. M. Djamil', province: 'Sumatera Barat', regency: 'Kota Padang' },
  { code: 'SUMSEL001', name: 'RSUP Dr. Mohammad Hoesin', province: 'Sumatera Selatan', regency: 'Kota Palembang' },
  { code: 'RIAU001', name: 'RSUD Arifin Achmad', province: 'Riau', regency: 'Kota Pekanbaru' },
  { code: 'DKI001', name: 'RSUPN Dr. Cipto Mangunkusumo', province: 'DKI Jakarta', regency: 'Jakarta Pusat' },
  { code: 'DKI002', name: 'RSUP Fatmawati', province: 'DKI Jakarta', regency: 'Jakarta Selatan' },
  { code: 'DKI003', name: 'RSUP Kanker Dharmais', province: 'DKI Jakarta', regency: 'Jakarta Barat' },
  { code: 'DKI004', name: 'RSUP Persahabatan', province: 'DKI Jakarta', regency: 'Jakarta Timur' },
  { code: 'JABAR001', name: 'RS Universitas Indonesia', province: 'Jawa Barat', regency: 'Kota Depok' },
  { code: 'BANTEN001', name: 'RSUD Provinsi Banten', province: 'Banten', regency: 'Kota Serang' },
  { code: 'JABAR002', name: 'RSUP Dr. Hasan Sadikin', province: 'Jawa Barat', regency: 'Kota Bandung' },
  { code: 'DIY001', name: 'RSUP Dr. Sardjito', province: 'DI Yogyakarta', regency: 'Kota Yogyakarta' },
  { code: 'JATENG001', name: 'RSOP Prof. Dr. Soeharso', province: 'Jawa Tengah', regency: 'Kota Surakarta' },
  { code: 'JATENG002', name: 'RSUD Dr. Moewardhi', province: 'Jawa Tengah', regency: 'Kota Surakarta' },
  { code: 'JATIM001', name: 'RSUD Dr. Soetomo', province: 'Jawa Timur', regency: 'Kota Surabaya' },
  { code: 'JATIM002', name: 'RS Universitas Airlangga', province: 'Jawa Timur', regency: 'Kota Surabaya' },
  { code: 'JATIM003', name: 'RSUD Dr. Syaiful Anwar', province: 'Jawa Timur', regency: 'Kota Malang' },
  { code: 'KALSEL001', name: 'RSUD Ulin', province: 'Kalimantan Selatan', regency: 'Kota Banjarmasin' },
  { code: 'BALI001', name: 'RSUP Prof. Dr. I.G.N.G. Ngoerah', province: 'Bali', regency: 'Kota Denpasar' },
  { code: 'SULSEL001', name: 'RSUP Dr. Wahidin Sudirohusodo', province: 'Sulawesi Selatan', regency: 'Kota Makassar' },
];

export async function seedMusculoskeletalCenters(prisma: PrismaClient) {
  try {
    console.log('🏥 Seeding 21 musculoskeletal tumor centers...');

    for (const center of musculoskeletalCenters) {
      const existingCenter = await prisma.center.findUnique({
        where: { code: center.code },
      });

      if (!existingCenter) {
        await prisma.center.create({
          data: {
            code: center.code,
            name: center.name,
            province: center.province,
            regency: center.regency,
          },
        });
        console.log(`  ✅ ${center.code} - ${center.name}`);
      } else {
        console.log(`  ⏩ ${center.code} - ${center.name} (exists)`);
      }
    }

    console.log('✅ All 21 musculoskeletal tumor centers seeded!');
  } catch (error) {
    console.error('❌ Error seeding centers:', error);
    throw error;
  }
}
