import { PrismaClient } from '@prisma/client';

interface BoneLocationData {
  code: string;
  level: number;
  region: string;
  boneName: string | null;
  segment: string | null;
  parentCode?: string;
  sortOrder: number;
}

export const boneLocationsData: BoneLocationData[] = [
  // ============================================
  // UPPER EXTREMITY - LEVEL 1 (REGION)
  // ============================================
  {
    code: 'UE',
    level: 1,
    region: 'Upper Extremity',
    boneName: null,
    segment: null,
    sortOrder: 1,
  },

  // ============================================
  // UPPER EXTREMITY - LEVEL 2 (BONES)
  // ============================================
  {
    code: 'UE_HUMERUS',
    level: 2,
    region: 'Upper Extremity',
    boneName: 'Humerus',
    segment: null,
    parentCode: 'UE',
    sortOrder: 11,
  },
  {
    code: 'UE_RADIUS',
    level: 2,
    region: 'Upper Extremity',
    boneName: 'Radius',
    segment: null,
    parentCode: 'UE',
    sortOrder: 12,
  },
  {
    code: 'UE_ULNA',
    level: 2,
    region: 'Upper Extremity',
    boneName: 'Ulna',
    segment: null,
    parentCode: 'UE',
    sortOrder: 13,
  },
  {
    code: 'UE_SCAPULA',
    level: 2,
    region: 'Upper Extremity',
    boneName: 'Scapula',
    segment: null,
    parentCode: 'UE',
    sortOrder: 14,
  },
  {
    code: 'UE_CLAVICLE',
    level: 2,
    region: 'Upper Extremity',
    boneName: 'Clavicle',
    segment: null,
    parentCode: 'UE',
    sortOrder: 15,
  },
  {
    code: 'UE_HAND',
    level: 2,
    region: 'Upper Extremity',
    boneName: 'Hand bones',
    segment: null,
    parentCode: 'UE',
    sortOrder: 16,
  },

  // ============================================
  // HUMERUS - LEVEL 3 (SEGMENTS)
  // ============================================
  {
    code: 'UE_HUMERUS_PROX',
    level: 3,
    region: 'Upper Extremity',
    boneName: 'Humerus',
    segment: 'Proximal',
    parentCode: 'UE_HUMERUS',
    sortOrder: 111,
  },
  {
    code: 'UE_HUMERUS_MID',
    level: 3,
    region: 'Upper Extremity',
    boneName: 'Humerus',
    segment: 'Midshaft',
    parentCode: 'UE_HUMERUS',
    sortOrder: 112,
  },
  {
    code: 'UE_HUMERUS_DIST',
    level: 3,
    region: 'Upper Extremity',
    boneName: 'Humerus',
    segment: 'Distal',
    parentCode: 'UE_HUMERUS',
    sortOrder: 113,
  },

  // ============================================
  // RADIUS - LEVEL 3 (SEGMENTS)
  // ============================================
  {
    code: 'UE_RADIUS_PROX',
    level: 3,
    region: 'Upper Extremity',
    boneName: 'Radius',
    segment: 'Proximal',
    parentCode: 'UE_RADIUS',
    sortOrder: 121,
  },
  {
    code: 'UE_RADIUS_MID',
    level: 3,
    region: 'Upper Extremity',
    boneName: 'Radius',
    segment: 'Midshaft',
    parentCode: 'UE_RADIUS',
    sortOrder: 122,
  },
  {
    code: 'UE_RADIUS_DIST',
    level: 3,
    region: 'Upper Extremity',
    boneName: 'Radius',
    segment: 'Distal',
    parentCode: 'UE_RADIUS',
    sortOrder: 123,
  },

  // ============================================
  // ULNA - LEVEL 3 (SEGMENTS)
  // ============================================
  {
    code: 'UE_ULNA_PROX',
    level: 3,
    region: 'Upper Extremity',
    boneName: 'Ulna',
    segment: 'Proximal',
    parentCode: 'UE_ULNA',
    sortOrder: 131,
  },
  {
    code: 'UE_ULNA_MID',
    level: 3,
    region: 'Upper Extremity',
    boneName: 'Ulna',
    segment: 'Midshaft',
    parentCode: 'UE_ULNA',
    sortOrder: 132,
  },
  {
    code: 'UE_ULNA_DIST',
    level: 3,
    region: 'Upper Extremity',
    boneName: 'Ulna',
    segment: 'Distal',
    parentCode: 'UE_ULNA',
    sortOrder: 133,
  },

  // ============================================
  // SCAPULA - LEVEL 3 (SEGMENTS)
  // ============================================
  {
    code: 'UE_SCAPULA_BODY',
    level: 3,
    region: 'Upper Extremity',
    boneName: 'Scapula',
    segment: 'Body',
    parentCode: 'UE_SCAPULA',
    sortOrder: 141,
  },
  {
    code: 'UE_SCAPULA_SPINE',
    level: 3,
    region: 'Upper Extremity',
    boneName: 'Scapula',
    segment: 'Spine',
    parentCode: 'UE_SCAPULA',
    sortOrder: 142,
  },
  {
    code: 'UE_SCAPULA_ACROMION',
    level: 3,
    region: 'Upper Extremity',
    boneName: 'Scapula',
    segment: 'Acromion',
    parentCode: 'UE_SCAPULA',
    sortOrder: 143,
  },

  // ============================================
  // CLAVICLE - LEVEL 3 (SEGMENTS)
  // ============================================
  {
    code: 'UE_CLAVICLE_PROX',
    level: 3,
    region: 'Upper Extremity',
    boneName: 'Clavicle',
    segment: 'Proximal',
    parentCode: 'UE_CLAVICLE',
    sortOrder: 151,
  },
  {
    code: 'UE_CLAVICLE_MID',
    level: 3,
    region: 'Upper Extremity',
    boneName: 'Clavicle',
    segment: 'Midshaft',
    parentCode: 'UE_CLAVICLE',
    sortOrder: 152,
  },
  {
    code: 'UE_CLAVICLE_DIST',
    level: 3,
    region: 'Upper Extremity',
    boneName: 'Clavicle',
    segment: 'Distal',
    parentCode: 'UE_CLAVICLE',
    sortOrder: 153,
  },

  // ============================================
  // HAND BONES - LEVEL 3 (SEGMENTS)
  // ============================================
  {
    code: 'UE_HAND_CARPALS',
    level: 3,
    region: 'Upper Extremity',
    boneName: 'Hand bones',
    segment: 'Carpals',
    parentCode: 'UE_HAND',
    sortOrder: 161,
  },
  {
    code: 'UE_HAND_METACARPALS',
    level: 3,
    region: 'Upper Extremity',
    boneName: 'Hand bones',
    segment: 'Metacarpals',
    parentCode: 'UE_HAND',
    sortOrder: 162,
  },
  {
    code: 'UE_HAND_PHALANGES',
    level: 3,
    region: 'Upper Extremity',
    boneName: 'Hand bones',
    segment: 'Phalanges',
    parentCode: 'UE_HAND',
    sortOrder: 163,
  },

  // ============================================
  // LOWER EXTREMITY - LEVEL 1 (REGION)
  // ============================================
  {
    code: 'LE',
    level: 1,
    region: 'Lower Extremity',
    boneName: null,
    segment: null,
    sortOrder: 2,
  },

  // ============================================
  // LOWER EXTREMITY - LEVEL 2 (BONES)
  // ============================================
  {
    code: 'LE_FEMUR',
    level: 2,
    region: 'Lower Extremity',
    boneName: 'Femur',
    segment: null,
    parentCode: 'LE',
    sortOrder: 21,
  },
  {
    code: 'LE_TIBIA',
    level: 2,
    region: 'Lower Extremity',
    boneName: 'Tibia',
    segment: null,
    parentCode: 'LE',
    sortOrder: 22,
  },
  {
    code: 'LE_FIBULA',
    level: 2,
    region: 'Lower Extremity',
    boneName: 'Fibula',
    segment: null,
    parentCode: 'LE',
    sortOrder: 23,
  },
  {
    code: 'LE_PATELLA',
    level: 2,
    region: 'Lower Extremity',
    boneName: 'Patella',
    segment: null,
    parentCode: 'LE',
    sortOrder: 24,
  },
  {
    code: 'LE_PELVIS',
    level: 2,
    region: 'Lower Extremity',
    boneName: 'Pelvis',
    segment: null,
    parentCode: 'LE',
    sortOrder: 25,
  },
  {
    code: 'LE_FOOT',
    level: 2,
    region: 'Lower Extremity',
    boneName: 'Foot bones',
    segment: null,
    parentCode: 'LE',
    sortOrder: 26,
  },

  // ============================================
  // FEMUR - LEVEL 3 (SEGMENTS)
  // ============================================
  {
    code: 'LE_FEMUR_PROX',
    level: 3,
    region: 'Lower Extremity',
    boneName: 'Femur',
    segment: 'Proximal',
    parentCode: 'LE_FEMUR',
    sortOrder: 211,
  },
  {
    code: 'LE_FEMUR_MID',
    level: 3,
    region: 'Lower Extremity',
    boneName: 'Femur',
    segment: 'Midshaft',
    parentCode: 'LE_FEMUR',
    sortOrder: 212,
  },
  {
    code: 'LE_FEMUR_DIST',
    level: 3,
    region: 'Lower Extremity',
    boneName: 'Femur',
    segment: 'Distal',
    parentCode: 'LE_FEMUR',
    sortOrder: 213,
  },

  // ============================================
  // TIBIA - LEVEL 3 (SEGMENTS)
  // ============================================
  {
    code: 'LE_TIBIA_PROX',
    level: 3,
    region: 'Lower Extremity',
    boneName: 'Tibia',
    segment: 'Proximal',
    parentCode: 'LE_TIBIA',
    sortOrder: 221,
  },
  {
    code: 'LE_TIBIA_MID',
    level: 3,
    region: 'Lower Extremity',
    boneName: 'Tibia',
    segment: 'Midshaft',
    parentCode: 'LE_TIBIA',
    sortOrder: 222,
  },
  {
    code: 'LE_TIBIA_DIST',
    level: 3,
    region: 'Lower Extremity',
    boneName: 'Tibia',
    segment: 'Distal',
    parentCode: 'LE_TIBIA',
    sortOrder: 223,
  },

  // ============================================
  // FIBULA - LEVEL 3 (SEGMENTS)
  // ============================================
  {
    code: 'LE_FIBULA_PROX',
    level: 3,
    region: 'Lower Extremity',
    boneName: 'Fibula',
    segment: 'Proximal',
    parentCode: 'LE_FIBULA',
    sortOrder: 231,
  },
  {
    code: 'LE_FIBULA_MID',
    level: 3,
    region: 'Lower Extremity',
    boneName: 'Fibula',
    segment: 'Midshaft',
    parentCode: 'LE_FIBULA',
    sortOrder: 232,
  },
  {
    code: 'LE_FIBULA_DIST',
    level: 3,
    region: 'Lower Extremity',
    boneName: 'Fibula',
    segment: 'Distal',
    parentCode: 'LE_FIBULA',
    sortOrder: 233,
  },

  // ============================================
  // PATELLA - LEVEL 3 (SEGMENTS)
  // ============================================
  {
    code: 'LE_PATELLA_BODY',
    level: 3,
    region: 'Lower Extremity',
    boneName: 'Patella',
    segment: 'Body',
    parentCode: 'LE_PATELLA',
    sortOrder: 241,
  },

  // ============================================
  // PELVIS - LEVEL 3 (SEGMENTS)
  // ============================================
  {
    code: 'LE_PELVIS_ILIUM',
    level: 3,
    region: 'Lower Extremity',
    boneName: 'Pelvis',
    segment: 'Ilium',
    parentCode: 'LE_PELVIS',
    sortOrder: 251,
  },
  {
    code: 'LE_PELVIS_ISCHIUM',
    level: 3,
    region: 'Lower Extremity',
    boneName: 'Pelvis',
    segment: 'Ischium',
    parentCode: 'LE_PELVIS',
    sortOrder: 252,
  },
  {
    code: 'LE_PELVIS_PUBIS',
    level: 3,
    region: 'Lower Extremity',
    boneName: 'Pelvis',
    segment: 'Pubis',
    parentCode: 'LE_PELVIS',
    sortOrder: 253,
  },

  // ============================================
  // FOOT BONES - LEVEL 3 (SEGMENTS)
  // ============================================
  {
    code: 'LE_FOOT_TARSALS',
    level: 3,
    region: 'Lower Extremity',
    boneName: 'Foot bones',
    segment: 'Tarsals',
    parentCode: 'LE_FOOT',
    sortOrder: 261,
  },
  {
    code: 'LE_FOOT_METATARSALS',
    level: 3,
    region: 'Lower Extremity',
    boneName: 'Foot bones',
    segment: 'Metatarsals',
    parentCode: 'LE_FOOT',
    sortOrder: 262,
  },
  {
    code: 'LE_FOOT_PHALANGES',
    level: 3,
    region: 'Lower Extremity',
    boneName: 'Foot bones',
    segment: 'Phalanges',
    parentCode: 'LE_FOOT',
    sortOrder: 263,
  },

  // ============================================
  // AXIAL SKELETON - LEVEL 1 (REGION)
  // ============================================
  {
    code: 'AXIAL',
    level: 1,
    region: 'Axial',
    boneName: null,
    segment: null,
    sortOrder: 3,
  },

  // ============================================
  // AXIAL SKELETON - LEVEL 2 (BONES)
  // ============================================
  {
    code: 'AXIAL_SPINE_CERV',
    level: 2,
    region: 'Axial',
    boneName: 'Cervical Spine',
    segment: null,
    parentCode: 'AXIAL',
    sortOrder: 31,
  },
  {
    code: 'AXIAL_SPINE_THOR',
    level: 2,
    region: 'Axial',
    boneName: 'Thoracic Spine',
    segment: null,
    parentCode: 'AXIAL',
    sortOrder: 32,
  },
  {
    code: 'AXIAL_SPINE_LUMB',
    level: 2,
    region: 'Axial',
    boneName: 'Lumbar Spine',
    segment: null,
    parentCode: 'AXIAL',
    sortOrder: 33,
  },
  {
    code: 'AXIAL_SACRUM',
    level: 2,
    region: 'Axial',
    boneName: 'Sacrum',
    segment: null,
    parentCode: 'AXIAL',
    sortOrder: 34,
  },
  {
    code: 'AXIAL_RIBS',
    level: 2,
    region: 'Axial',
    boneName: 'Ribs',
    segment: null,
    parentCode: 'AXIAL',
    sortOrder: 35,
  },
  {
    code: 'AXIAL_STERNUM',
    level: 2,
    region: 'Axial',
    boneName: 'Sternum',
    segment: null,
    parentCode: 'AXIAL',
    sortOrder: 36,
  },
  {
    code: 'AXIAL_SKULL',
    level: 2,
    region: 'Axial',
    boneName: 'Skull',
    segment: null,
    parentCode: 'AXIAL',
    sortOrder: 37,
  },

  // ============================================
  // CERVICAL SPINE - LEVEL 3 (SEGMENTS)
  // ============================================
  {
    code: 'AXIAL_SPINE_CERV_C1',
    level: 3,
    region: 'Axial',
    boneName: 'Cervical Spine',
    segment: 'C1 (Atlas)',
    parentCode: 'AXIAL_SPINE_CERV',
    sortOrder: 311,
  },
  {
    code: 'AXIAL_SPINE_CERV_C2',
    level: 3,
    region: 'Axial',
    boneName: 'Cervical Spine',
    segment: 'C2 (Axis)',
    parentCode: 'AXIAL_SPINE_CERV',
    sortOrder: 312,
  },
  {
    code: 'AXIAL_SPINE_CERV_C3_C7',
    level: 3,
    region: 'Axial',
    boneName: 'Cervical Spine',
    segment: 'C3-C7',
    parentCode: 'AXIAL_SPINE_CERV',
    sortOrder: 313,
  },

  // ============================================
  // THORACIC SPINE - LEVEL 3 (SEGMENTS)
  // ============================================
  {
    code: 'AXIAL_SPINE_THOR_UPPER',
    level: 3,
    region: 'Axial',
    boneName: 'Thoracic Spine',
    segment: 'Upper (T1-T4)',
    parentCode: 'AXIAL_SPINE_THOR',
    sortOrder: 321,
  },
  {
    code: 'AXIAL_SPINE_THOR_MID',
    level: 3,
    region: 'Axial',
    boneName: 'Thoracic Spine',
    segment: 'Mid (T5-T8)',
    parentCode: 'AXIAL_SPINE_THOR',
    sortOrder: 322,
  },
  {
    code: 'AXIAL_SPINE_THOR_LOWER',
    level: 3,
    region: 'Axial',
    boneName: 'Thoracic Spine',
    segment: 'Lower (T9-T12)',
    parentCode: 'AXIAL_SPINE_THOR',
    sortOrder: 323,
  },

  // ============================================
  // LUMBAR SPINE - LEVEL 3 (SEGMENTS)
  // ============================================
  {
    code: 'AXIAL_SPINE_LUMB_L1',
    level: 3,
    region: 'Axial',
    boneName: 'Lumbar Spine',
    segment: 'L1',
    parentCode: 'AXIAL_SPINE_LUMB',
    sortOrder: 331,
  },
  {
    code: 'AXIAL_SPINE_LUMB_L2',
    level: 3,
    region: 'Axial',
    boneName: 'Lumbar Spine',
    segment: 'L2',
    parentCode: 'AXIAL_SPINE_LUMB',
    sortOrder: 332,
  },
  {
    code: 'AXIAL_SPINE_LUMB_L3',
    level: 3,
    region: 'Axial',
    boneName: 'Lumbar Spine',
    segment: 'L3',
    parentCode: 'AXIAL_SPINE_LUMB',
    sortOrder: 333,
  },
  {
    code: 'AXIAL_SPINE_LUMB_L4',
    level: 3,
    region: 'Axial',
    boneName: 'Lumbar Spine',
    segment: 'L4',
    parentCode: 'AXIAL_SPINE_LUMB',
    sortOrder: 334,
  },
  {
    code: 'AXIAL_SPINE_LUMB_L5',
    level: 3,
    region: 'Axial',
    boneName: 'Lumbar Spine',
    segment: 'L5',
    parentCode: 'AXIAL_SPINE_LUMB',
    sortOrder: 335,
  },

  // ============================================
  // SACRUM - LEVEL 3 (SEGMENTS)
  // ============================================
  {
    code: 'AXIAL_SACRUM_BODY',
    level: 3,
    region: 'Axial',
    boneName: 'Sacrum',
    segment: 'Body',
    parentCode: 'AXIAL_SACRUM',
    sortOrder: 341,
  },

  // ============================================
  // RIBS - LEVEL 3 (SEGMENTS)
  // ============================================
  {
    code: 'AXIAL_RIBS_1_6',
    level: 3,
    region: 'Axial',
    boneName: 'Ribs',
    segment: 'Ribs 1-6',
    parentCode: 'AXIAL_RIBS',
    sortOrder: 351,
  },
  {
    code: 'AXIAL_RIBS_7_12',
    level: 3,
    region: 'Axial',
    boneName: 'Ribs',
    segment: 'Ribs 7-12',
    parentCode: 'AXIAL_RIBS',
    sortOrder: 352,
  },

  // ============================================
  // STERNUM - LEVEL 3 (SEGMENTS)
  // ============================================
  {
    code: 'AXIAL_STERNUM_MANUBRIUM',
    level: 3,
    region: 'Axial',
    boneName: 'Sternum',
    segment: 'Manubrium',
    parentCode: 'AXIAL_STERNUM',
    sortOrder: 361,
  },
  {
    code: 'AXIAL_STERNUM_BODY',
    level: 3,
    region: 'Axial',
    boneName: 'Sternum',
    segment: 'Body',
    parentCode: 'AXIAL_STERNUM',
    sortOrder: 362,
  },
  {
    code: 'AXIAL_STERNUM_XIPHOID',
    level: 3,
    region: 'Axial',
    boneName: 'Sternum',
    segment: 'Xiphoid process',
    parentCode: 'AXIAL_STERNUM',
    sortOrder: 363,
  },

  // ============================================
  // SKULL - LEVEL 3 (SEGMENTS)
  // ============================================
  {
    code: 'AXIAL_SKULL_CRANIUM',
    level: 3,
    region: 'Axial',
    boneName: 'Skull',
    segment: 'Cranium',
    parentCode: 'AXIAL_SKULL',
    sortOrder: 371,
  },
  {
    code: 'AXIAL_SKULL_FACIAL',
    level: 3,
    region: 'Axial',
    boneName: 'Skull',
    segment: 'Facial bones',
    parentCode: 'AXIAL_SKULL',
    sortOrder: 372,
  },
  {
    code: 'AXIAL_SKULL_MANDIBLE',
    level: 3,
    region: 'Axial',
    boneName: 'Skull',
    segment: 'Mandible',
    parentCode: 'AXIAL_SKULL',
    sortOrder: 373,
  },
];

/**
 * Seeds bone locations taxonomy into the database
 * Hierarchy: Region (Level 1) -> Bone (Level 2) -> Segment (Level 3)
 */
export async function seedBoneLocations(prisma: PrismaClient) {
  try {
    console.log('🦴 Seeding bone location taxonomy (95 locations, 3 levels)...');

    // Create a map to store created locations by code for parent references
    const createdLocations: Map<string, any> = new Map();

    // ============================================
    // STEP 1: Create Level 1 (Regions) First
    // ============================================
    console.log('\n[STEP 1] Creating Level 1 (Regions)...');
    const level1Items = boneLocationsData.filter((item) => item.level === 1);

    for (const item of level1Items) {
      const existing = await prisma.boneLocation.findUnique({
        where: { code: item.code },
      });

      if (!existing) {
        const created = await prisma.boneLocation.create({
          data: {
            code: item.code,
            level: item.level,
            region: item.region,
            boneName: item.boneName,
            segment: item.segment,
            sortOrder: item.sortOrder,
            // Level 1 items have no parent
          },
        });
        createdLocations.set(item.code, created);
        console.log(`  Created: ${item.code} - ${item.region}`);
      } else {
        createdLocations.set(item.code, existing);
        console.log(`  Already exists: ${item.code} - ${item.region}`);
      }
    }

    // ============================================
    // STEP 2: Create Level 2 (Bones) with Parent References
    // ============================================
    console.log('\n[STEP 2] Creating Level 2 (Bones)...');
    const level2Items = boneLocationsData.filter((item) => item.level === 2);

    for (const item of level2Items) {
      const existing = await prisma.boneLocation.findUnique({
        where: { code: item.code },
      });

      if (!existing) {
        if (!item.parentCode) {
          throw new Error(
            `Level 2 item ${item.code} is missing parentCode reference`,
          );
        }

        const parent = createdLocations.get(item.parentCode);
        if (!parent) {
          throw new Error(
            `Parent ${item.parentCode} not found for ${item.code}`,
          );
        }

        const created = await prisma.boneLocation.create({
          data: {
            code: item.code,
            level: item.level,
            region: item.region,
            boneName: item.boneName,
            segment: item.segment,
            parentId: parent.id,
            sortOrder: item.sortOrder,
          },
        });
        createdLocations.set(item.code, created);
        console.log(
          `  Created: ${item.code} - ${item.boneName} (Parent: ${item.parentCode})`,
        );
      } else {
        createdLocations.set(item.code, existing);
        console.log(
          `  Already exists: ${item.code} - ${item.boneName} (Parent: ${item.parentCode})`,
        );
      }
    }

    // ============================================
    // STEP 3: Create Level 3 (Segments) with Parent References
    // ============================================
    console.log('\n[STEP 3] Creating Level 3 (Segments)...');
    const level3Items = boneLocationsData.filter((item) => item.level === 3);

    for (const item of level3Items) {
      const existing = await prisma.boneLocation.findUnique({
        where: { code: item.code },
      });

      if (!existing) {
        if (!item.parentCode) {
          throw new Error(
            `Level 3 item ${item.code} is missing parentCode reference`,
          );
        }

        const parent = createdLocations.get(item.parentCode);
        if (!parent) {
          throw new Error(
            `Parent ${item.parentCode} not found for ${item.code}`,
          );
        }

        const created = await prisma.boneLocation.create({
          data: {
            code: item.code,
            level: item.level,
            region: item.region,
            boneName: item.boneName,
            segment: item.segment,
            parentId: parent.id,
            sortOrder: item.sortOrder,
          },
        });
        createdLocations.set(item.code, created);
        console.log(
          `  Created: ${item.code} - ${item.boneName} / ${item.segment} (Parent: ${item.parentCode})`,
        );
      } else {
        createdLocations.set(item.code, existing);
        console.log(
          `  Already exists: ${item.code} - ${item.boneName} / ${item.segment}`,
        );
      }
    }

    // ============================================
    // Validation & Summary
    // ============================================
    const totalCount = await prisma.boneLocation.count();
    const level1Count = await prisma.boneLocation.count({
      where: { level: 1 },
    });
    const level2Count = await prisma.boneLocation.count({
      where: { level: 2 },
    });
    const level3Count = await prisma.boneLocation.count({
      where: { level: 3 },
    });

    console.log('✅ All 95 bone locations seeded successfully!');
    console.log(`   Level 1 (Regions): ${level1Count}`);
    console.log(`   Level 2 (Bones): ${level2Count}`);
    console.log(`   Level 3 (Segments): ${level3Count}`);
  } catch (error) {
    console.error('❌ Error seeding bone locations:', error);
    throw error;
  }
}
