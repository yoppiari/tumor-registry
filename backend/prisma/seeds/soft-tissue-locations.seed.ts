import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const softTissueLocations = [
  // Head and Neck
  { code: 'ST_HEAD_NECK_FACE', anatomicalRegion: 'Head and Neck', specificLocation: 'Face', sortOrder: 1 },
  { code: 'ST_HEAD_NECK_SCALP', anatomicalRegion: 'Head and Neck', specificLocation: 'Scalp', sortOrder: 2 },
  { code: 'ST_HEAD_NECK_NECK', anatomicalRegion: 'Head and Neck', specificLocation: 'Neck', sortOrder: 3 },
  { code: 'ST_HEAD_NECK_ORBIT', anatomicalRegion: 'Head and Neck', specificLocation: 'Orbit', sortOrder: 4 },
  { code: 'ST_HEAD_NECK_PAROTID', anatomicalRegion: 'Head and Neck', specificLocation: 'Parotid region', sortOrder: 5 },

  // Trunk
  { code: 'ST_TRUNK_CHEST_WALL', anatomicalRegion: 'Trunk', specificLocation: 'Chest wall', sortOrder: 10 },
  { code: 'ST_TRUNK_BREAST', anatomicalRegion: 'Trunk', specificLocation: 'Breast', sortOrder: 11 },
  { code: 'ST_TRUNK_ABD_WALL', anatomicalRegion: 'Trunk', specificLocation: 'Abdominal wall', sortOrder: 12 },
  { code: 'ST_TRUNK_BACK', anatomicalRegion: 'Trunk', specificLocation: 'Back', sortOrder: 13 },
  { code: 'ST_TRUNK_FLANK', anatomicalRegion: 'Trunk', specificLocation: 'Flank', sortOrder: 14 },
  { code: 'ST_TRUNK_PELVIS', anatomicalRegion: 'Trunk', specificLocation: 'Pelvic wall', sortOrder: 15 },
  { code: 'ST_TRUNK_GLUTEAL', anatomicalRegion: 'Trunk', specificLocation: 'Gluteal region', sortOrder: 16 },
  { code: 'ST_TRUNK_PERITONEAL', anatomicalRegion: 'Trunk', specificLocation: 'Peritoneal/retroperitoneal', sortOrder: 17 },

  // Upper Limb
  { code: 'ST_UL_SHOULDER', anatomicalRegion: 'Upper Limb', specificLocation: 'Shoulder', sortOrder: 20 },
  { code: 'ST_UL_ARM_ANT', anatomicalRegion: 'Upper Limb', specificLocation: 'Arm anterior', sortOrder: 21 },
  { code: 'ST_UL_ARM_POST', anatomicalRegion: 'Upper Limb', specificLocation: 'Arm posterior', sortOrder: 22 },
  { code: 'ST_UL_ELBOW', anatomicalRegion: 'Upper Limb', specificLocation: 'Elbow', sortOrder: 23 },
  { code: 'ST_UL_FOREARM_ANT', anatomicalRegion: 'Upper Limb', specificLocation: 'Forearm anterior', sortOrder: 24 },
  { code: 'ST_UL_FOREARM_POST', anatomicalRegion: 'Upper Limb', specificLocation: 'Forearm posterior', sortOrder: 25 },
  { code: 'ST_UL_WRIST', anatomicalRegion: 'Upper Limb', specificLocation: 'Wrist', sortOrder: 26 },
  { code: 'ST_UL_HAND_PALM', anatomicalRegion: 'Upper Limb', specificLocation: 'Hand palmar', sortOrder: 27 },
  { code: 'ST_UL_HAND_DORSAL', anatomicalRegion: 'Upper Limb', specificLocation: 'Hand dorsal', sortOrder: 28 },

  // Lower Limb
  { code: 'ST_LL_HIP', anatomicalRegion: 'Lower Limb', specificLocation: 'Hip', sortOrder: 30 },
  { code: 'ST_LL_THIGH_ANT', anatomicalRegion: 'Lower Limb', specificLocation: 'Thigh anterior', sortOrder: 31 },
  { code: 'ST_LL_THIGH_POST', anatomicalRegion: 'Lower Limb', specificLocation: 'Thigh posterior', sortOrder: 32 },
  { code: 'ST_LL_THIGH_MED', anatomicalRegion: 'Lower Limb', specificLocation: 'Thigh medial', sortOrder: 33 },
  { code: 'ST_LL_THIGH_LAT', anatomicalRegion: 'Lower Limb', specificLocation: 'Thigh lateral', sortOrder: 34 },
  { code: 'ST_LL_KNEE', anatomicalRegion: 'Lower Limb', specificLocation: 'Knee', sortOrder: 35 },
  { code: 'ST_LL_LEG_ANT', anatomicalRegion: 'Lower Limb', specificLocation: 'Leg anterior', sortOrder: 36 },
  { code: 'ST_LL_LEG_POST', anatomicalRegion: 'Lower Limb', specificLocation: 'Leg posterior', sortOrder: 37 },
  { code: 'ST_LL_LEG_LAT', anatomicalRegion: 'Lower Limb', specificLocation: 'Leg lateral', sortOrder: 38 },
  { code: 'ST_LL_ANKLE', anatomicalRegion: 'Lower Limb', specificLocation: 'Ankle', sortOrder: 39 },
  { code: 'ST_LL_FOOT_DORSAL', anatomicalRegion: 'Lower Limb', specificLocation: 'Foot dorsal', sortOrder: 40 },
  { code: 'ST_LL_FOOT_PLANTAR', anatomicalRegion: 'Lower Limb', specificLocation: 'Foot plantar', sortOrder: 41 },

  // Visceral
  { code: 'ST_VISCERAL_GI', anatomicalRegion: 'Visceral', specificLocation: 'Gastrointestinal tract', sortOrder: 50 },
  { code: 'ST_VISCERAL_GU', anatomicalRegion: 'Visceral', specificLocation: 'Genitourinary', sortOrder: 51 },
  { code: 'ST_VISCERAL_MEDIASTINUM', anatomicalRegion: 'Visceral', specificLocation: 'Mediastinum', sortOrder: 52 },
];

export async function seedSoftTissueLocations(prisma: PrismaClient) {
  try {
    console.log('📍 Seeding soft tissue anatomical locations (36 regions)...');

    for (const location of softTissueLocations) {
      await prisma.softTissueLocation.upsert({
        where: { code: location.code },
        update: {},
        create: {
          code: location.code,
          anatomicalRegion: location.anatomicalRegion,
          specificLocation: location.specificLocation,
          sortOrder: location.sortOrder,
        },
      });
    }

    console.log('✅ All 36 soft tissue locations seeded!');
  } catch (error) {
    console.error('❌ Error seeding soft tissue locations:', error);
    throw error;
  }
}
