import { PrismaClient } from '@prisma/client';

export const whoSoftTissueTumors = [
  // Adipocytic tumors
  { category: 'Adipocytic', subcategory: 'Benign', diagnosis: 'Lipoma', isMalignant: false, sortOrder: 1 },
  { category: 'Adipocytic', subcategory: 'Benign', diagnosis: 'Lipomatosis', isMalignant: false, sortOrder: 2 },
  { category: 'Adipocytic', subcategory: 'Benign', diagnosis: 'Lipoblastoma', isMalignant: false, sortOrder: 3 },
  { category: 'Adipocytic', subcategory: 'Benign', diagnosis: 'Angiolipoma', isMalignant: false, sortOrder: 4 },
  { category: 'Adipocytic', subcategory: 'Benign', diagnosis: 'Hibernoma', isMalignant: false, sortOrder: 5 },
  { category: 'Adipocytic', subcategory: 'Intermediate', diagnosis: 'Atypical lipomatous tumor/Well-differentiated liposarcoma', isMalignant: false, sortOrder: 6 },
  { category: 'Adipocytic', subcategory: 'Malignant', diagnosis: 'Dedifferentiated liposarcoma', isMalignant: true, sortOrder: 7 },
  { category: 'Adipocytic', subcategory: 'Malignant', diagnosis: 'Myxoid liposarcoma', isMalignant: true, sortOrder: 8 },
  { category: 'Adipocytic', subcategory: 'Malignant', diagnosis: 'Pleomorphic liposarcoma', isMalignant: true, sortOrder: 9 },

  // Fibroblastic and myofibroblastic tumors
  { category: 'Fibroblastic/Myofibroblastic', subcategory: 'Benign', diagnosis: 'Nodular fasciitis', isMalignant: false, sortOrder: 10 },
  { category: 'Fibroblastic/Myofibroblastic', subcategory: 'Benign', diagnosis: 'Fibroma of tendon sheath', isMalignant: false, sortOrder: 11 },
  { category: 'Fibroblastic/Myofibroblastic', subcategory: 'Benign', diagnosis: 'Elastofibroma', isMalignant: false, sortOrder: 12 },
  { category: 'Fibroblastic/Myofibroblastic', subcategory: 'Benign', diagnosis: 'Fibrous hamartoma of infancy', isMalignant: false, sortOrder: 13 },
  { category: 'Fibroblastic/Myofibroblastic', subcategory: 'Benign', diagnosis: 'Myofibroma/Myofibromatosis', isMalignant: false, sortOrder: 14 },
  { category: 'Fibroblastic/Myofibroblastic', subcategory: 'Intermediate', diagnosis: 'Palmar/Plantar fibromatosis', isMalignant: false, sortOrder: 15 },
  { category: 'Fibroblastic/Myofibroblastic', subcategory: 'Intermediate', diagnosis: 'Desmoid-type fibromatosis', isMalignant: false, sortOrder: 16 },
  { category: 'Fibroblastic/Myofibroblastic', subcategory: 'Intermediate', diagnosis: 'Lipofibromatosis', isMalignant: false, sortOrder: 17 },
  { category: 'Fibroblastic/Myofibroblastic', subcategory: 'Malignant', diagnosis: 'Solitary fibrous tumor, malignant', isMalignant: true, sortOrder: 18 },
  { category: 'Fibroblastic/Myofibroblastic', subcategory: 'Malignant', diagnosis: 'Fibrosarcoma', isMalignant: true, sortOrder: 19 },
  { category: 'Fibroblastic/Myofibroblastic', subcategory: 'Malignant', diagnosis: 'Myxofibrosarcoma', isMalignant: true, sortOrder: 20 },
  { category: 'Fibroblastic/Myofibroblastic', subcategory: 'Malignant', diagnosis: 'Low-grade fibromyxoid sarcoma', isMalignant: true, sortOrder: 21 },

  // So-called fibrohistiocytic tumors
  { category: 'Fibrohistiocytic', subcategory: 'Benign', diagnosis: 'Tenosynovial giant cell tumor', isMalignant: false, sortOrder: 30 },
  { category: 'Fibrohistiocytic', subcategory: 'Benign', diagnosis: 'Deep benign fibrous histiocytoma', isMalignant: false, sortOrder: 31 },
  { category: 'Fibrohistiocytic', subcategory: 'Intermediate', diagnosis: 'Plexiform fibrohistiocytic tumor', isMalignant: false, sortOrder: 32 },
  { category: 'Fibrohistiocytic', subcategory: 'Malignant', diagnosis: 'Pleomorphic malignant fibrous histiocytoma (undifferentiated pleomorphic sarcoma)', isMalignant: true, sortOrder: 33 },

  // Smooth muscle tumors
  { category: 'Smooth Muscle', subcategory: 'Benign', diagnosis: 'Leiomyoma', isMalignant: false, sortOrder: 40 },
  { category: 'Smooth Muscle', subcategory: 'Malignant', diagnosis: 'Leiomyosarcoma', isMalignant: true, sortOrder: 41 },

  // Pericytic (perivascular) tumors
  { category: 'Pericytic', subcategory: 'Benign', diagnosis: 'Glomus tumor', isMalignant: false, sortOrder: 50 },
  { category: 'Pericytic', subcategory: 'Malignant', diagnosis: 'Malignant glomus tumor', isMalignant: true, sortOrder: 51 },

  // Skeletal muscle tumors
  { category: 'Skeletal Muscle', subcategory: 'Benign', diagnosis: 'Rhabdomyoma', isMalignant: false, sortOrder: 60 },
  { category: 'Skeletal Muscle', subcategory: 'Malignant', diagnosis: 'Embryonal rhabdomyosarcoma', isMalignant: true, sortOrder: 61 },
  { category: 'Skeletal Muscle', subcategory: 'Malignant', diagnosis: 'Alveolar rhabdomyosarcoma', isMalignant: true, sortOrder: 62 },
  { category: 'Skeletal Muscle', subcategory: 'Malignant', diagnosis: 'Pleomorphic rhabdomyosarcoma', isMalignant: true, sortOrder: 63 },
  { category: 'Skeletal Muscle', subcategory: 'Malignant', diagnosis: 'Spindle cell/sclerosing rhabdomyosarcoma', isMalignant: true, sortOrder: 64 },

  // Vascular tumors
  { category: 'Vascular', subcategory: 'Benign', diagnosis: 'Hemangioma', isMalignant: false, sortOrder: 70 },
  { category: 'Vascular', subcategory: 'Benign', diagnosis: 'Epithelioid hemangioma', isMalignant: false, sortOrder: 71 },
  { category: 'Vascular', subcategory: 'Benign', diagnosis: 'Angiomatosis', isMalignant: false, sortOrder: 72 },
  { category: 'Vascular', subcategory: 'Benign', diagnosis: 'Lymphangioma', isMalignant: false, sortOrder: 73 },
  { category: 'Vascular', subcategory: 'Intermediate', diagnosis: 'Kaposiform hemangioendothelioma', isMalignant: false, sortOrder: 74 },
  { category: 'Vascular', subcategory: 'Intermediate', diagnosis: 'Retiform hemangioendothelioma', isMalignant: false, sortOrder: 75 },
  { category: 'Vascular', subcategory: 'Malignant', diagnosis: 'Epithelioid hemangioendothelioma', isMalignant: true, sortOrder: 76 },
  { category: 'Vascular', subcategory: 'Malignant', diagnosis: 'Angiosarcoma', isMalignant: true, sortOrder: 77 },

  // Peripheral nerve sheath tumors
  { category: 'Nerve Sheath', subcategory: 'Benign', diagnosis: 'Schwannoma', isMalignant: false, sortOrder: 80 },
  { category: 'Nerve Sheath', subcategory: 'Benign', diagnosis: 'Neurofibroma', isMalignant: false, sortOrder: 81 },
  { category: 'Nerve Sheath', subcategory: 'Benign', diagnosis: 'Perineurioma', isMalignant: false, sortOrder: 82 },
  { category: 'Nerve Sheath', subcategory: 'Benign', diagnosis: 'Granular cell tumor', isMalignant: false, sortOrder: 83 },
  { category: 'Nerve Sheath', subcategory: 'Malignant', diagnosis: 'Malignant peripheral nerve sheath tumor (MPNST)', isMalignant: true, sortOrder: 84 },
  { category: 'Nerve Sheath', subcategory: 'Malignant', diagnosis: 'Malignant Triton tumor', isMalignant: true, sortOrder: 85 },

  // Chondro-osseous tumors
  { category: 'Chondro-osseous', subcategory: 'Benign', diagnosis: 'Soft tissue chondroma', isMalignant: false, sortOrder: 90 },
  { category: 'Chondro-osseous', subcategory: 'Malignant', diagnosis: 'Extraskeletal osteosarcoma', isMalignant: true, sortOrder: 91 },

  // Gastrointestinal stromal tumors
  { category: 'GIST', subcategory: 'Malignant', diagnosis: 'Gastrointestinal stromal tumor (GIST)', isMalignant: true, sortOrder: 100 },

  // Tumors of uncertain differentiation
  { category: 'Uncertain Differentiation', subcategory: 'Benign', diagnosis: 'Myxoma', isMalignant: false, sortOrder: 110 },
  { category: 'Uncertain Differentiation', subcategory: 'Intermediate', diagnosis: 'Hemosiderotic fibrolipomatous tumor', isMalignant: false, sortOrder: 111 },
  { category: 'Uncertain Differentiation', subcategory: 'Malignant', diagnosis: 'Synovial sarcoma', isMalignant: true, sortOrder: 112 },
  { category: 'Uncertain Differentiation', subcategory: 'Malignant', diagnosis: 'Epithelioid sarcoma', isMalignant: true, sortOrder: 113 },
  { category: 'Uncertain Differentiation', subcategory: 'Malignant', diagnosis: 'Alveolar soft part sarcoma', isMalignant: true, sortOrder: 114 },
  { category: 'Uncertain Differentiation', subcategory: 'Malignant', diagnosis: 'Clear cell sarcoma', isMalignant: true, sortOrder: 115 },
  { category: 'Uncertain Differentiation', subcategory: 'Malignant', diagnosis: 'Extraskeletal myxoid chondrosarcoma', isMalignant: true, sortOrder: 116 },
  { category: 'Uncertain Differentiation', subcategory: 'Malignant', diagnosis: 'Desmoplastic small round cell tumor', isMalignant: true, sortOrder: 117 },
  { category: 'Uncertain Differentiation', subcategory: 'Malignant', diagnosis: 'Extrarenal rhabdoid tumor', isMalignant: true, sortOrder: 118 },
  { category: 'Uncertain Differentiation', subcategory: 'Malignant', diagnosis: 'PEComa (perivascular epithelioid cell tumor)', isMalignant: true, sortOrder: 119 },
  { category: 'Uncertain Differentiation', subcategory: 'Malignant', diagnosis: 'Intimal sarcoma', isMalignant: true, sortOrder: 120 },

  // Undifferentiated/unclassified sarcomas
  { category: 'Undifferentiated', subcategory: 'Malignant', diagnosis: 'Undifferentiated spindle cell sarcoma', isMalignant: true, sortOrder: 130 },
  { category: 'Undifferentiated', subcategory: 'Malignant', diagnosis: 'Undifferentiated pleomorphic sarcoma', isMalignant: true, sortOrder: 131 },
  { category: 'Undifferentiated', subcategory: 'Malignant', diagnosis: 'Undifferentiated round cell sarcoma', isMalignant: true, sortOrder: 132 },
  { category: 'Undifferentiated', subcategory: 'Malignant', diagnosis: 'Undifferentiated epithelioid sarcoma', isMalignant: true, sortOrder: 133 },
];

export async function seedWhoSoftTissueTumors(prisma: PrismaClient) {
  try {
    console.log('💪 Seeding WHO soft tissue tumor classifications (68 types)...');

    for (const tumor of whoSoftTissueTumors) {
      await prisma.whoSoftTissueTumorClassification.upsert({
        where: {
          category_diagnosis: {
            diagnosis: tumor.diagnosis,
            category: tumor.category,
          },
        },
        update: {},
        create: {
          category: tumor.category,
          subcategory: tumor.subcategory,
          diagnosis: tumor.diagnosis,
          icdO3Code: tumor.icdO3Code,
          isMalignant: tumor.isMalignant,
          sortOrder: tumor.sortOrder,
        },
      });
    }

    console.log('✅ All 68 WHO soft tissue tumor classifications seeded!');
  } catch (error) {
    console.error('❌ Error seeding WHO soft tissue tumors:', error);
    throw error;
  }
}
