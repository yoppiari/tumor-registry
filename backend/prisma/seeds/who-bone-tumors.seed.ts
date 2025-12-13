import { PrismaClient } from '@prisma/client';

export const whoBoneTumors = [
  // Chondrogenic tumors
  { category: 'Chondrogenic', subcategory: 'Benign', diagnosis: 'Osteochondroma', icdO3Code: 'D16', isMalignant: false, sortOrder: 1 },
  { category: 'Chondrogenic', subcategory: 'Benign', diagnosis: 'Enchondroma', icdO3Code: 'D16', isMalignant: false, sortOrder: 2 },
  { category: 'Chondrogenic', subcategory: 'Benign', diagnosis: 'Periosteal chondroma', icdO3Code: 'D16', isMalignant: false, sortOrder: 3 },
  { category: 'Chondrogenic', subcategory: 'Benign', diagnosis: 'Chondromyxoid fibroma', icdO3Code: 'D16', isMalignant: false, sortOrder: 4 },
  { category: 'Chondrogenic', subcategory: 'Benign', diagnosis: 'Osteochondromyxoma', icdO3Code: 'D16', isMalignant: false, sortOrder: 5 },
  { category: 'Chondrogenic', subcategory: 'Benign', diagnosis: 'Subungual exostosis', icdO3Code: 'D16', isMalignant: false, sortOrder: 6 },
  { category: 'Chondrogenic', subcategory: 'Benign', diagnosis: 'Bizarre parosteal osteochondromatous proliferation', icdO3Code: 'D16', isMalignant: false, sortOrder: 7 },
  { category: 'Chondrogenic', subcategory: 'Benign', diagnosis: 'Synovial chondromatosis', icdO3Code: 'D16', isMalignant: false, sortOrder: 8 },
  { category: 'Chondrogenic', subcategory: 'Benign', diagnosis: 'Chondroblastoma', icdO3Code: 'D16', isMalignant: false, sortOrder: 9 },

  { category: 'Chondrogenic', subcategory: 'Malignant', diagnosis: 'Chondrosarcoma Grade I', icdO3Code: 'C41', isMalignant: true, sortOrder: 10 },
  { category: 'Chondrogenic', subcategory: 'Malignant', diagnosis: 'Chondrosarcoma Grade II', icdO3Code: 'C41', isMalignant: true, sortOrder: 11 },
  { category: 'Chondrogenic', subcategory: 'Malignant', diagnosis: 'Chondrosarcoma Grade III', icdO3Code: 'C41', isMalignant: true, sortOrder: 12 },
  { category: 'Chondrogenic', subcategory: 'Malignant', diagnosis: 'Atypical cartilaginous tumor (ACT)', icdO3Code: 'C41', isMalignant: true, sortOrder: 13 },
  { category: 'Chondrogenic', subcategory: 'Malignant', diagnosis: 'Periosteal chondrosarcoma', icdO3Code: 'C41', isMalignant: true, sortOrder: 14 },
  { category: 'Chondrogenic', subcategory: 'Malignant', diagnosis: 'Dedifferentiated chondrosarcoma', icdO3Code: 'C41', isMalignant: true, sortOrder: 15 },
  { category: 'Chondrogenic', subcategory: 'Malignant', diagnosis: 'Mesenchymal chondrosarcoma', icdO3Code: 'C41', isMalignant: true, sortOrder: 16 },
  { category: 'Chondrogenic', subcategory: 'Malignant', diagnosis: 'Clear cell chondrosarcoma', icdO3Code: 'C41', isMalignant: true, sortOrder: 17 },

  // Osteogenic tumors
  { category: 'Osteogenic', subcategory: 'Benign', diagnosis: 'Osteoma', icdO3Code: 'D16', pageReference: '276', isMalignant: false, sortOrder: 20 },
  { category: 'Osteogenic', subcategory: 'Benign', diagnosis: 'Osteoid osteoma', icdO3Code: 'D16', pageReference: '277', isMalignant: false, sortOrder: 21 },
  { category: 'Osteogenic', subcategory: 'Benign', diagnosis: 'Osteoblastoma', icdO3Code: 'D16', pageReference: '279', isMalignant: false, sortOrder: 22 },

  { category: 'Osteogenic', subcategory: 'Malignant', diagnosis: 'Low-grade central osteosarcoma', icdO3Code: 'C41', pageReference: '281', isMalignant: true, sortOrder: 23 },
  { category: 'Osteogenic', subcategory: 'Malignant', diagnosis: 'Conventional osteosarcoma', icdO3Code: 'C41', pageReference: '282', isMalignant: true, sortOrder: 24 },
  { category: 'Osteogenic', subcategory: 'Malignant', diagnosis: 'Telangiectatic osteosarcoma', icdO3Code: 'C41', pageReference: '289', isMalignant: true, sortOrder: 25 },
  { category: 'Osteogenic', subcategory: 'Malignant', diagnosis: 'Small cell osteosarcoma', icdO3Code: 'C41', pageReference: '291', isMalignant: true, sortOrder: 26 },
  { category: 'Osteogenic', subcategory: 'Malignant', diagnosis: 'Parosteal osteosarcoma', icdO3Code: 'C41', pageReference: '292', isMalignant: true, sortOrder: 27 },
  { category: 'Osteogenic', subcategory: 'Malignant', diagnosis: 'Periosteal osteosarcoma', icdO3Code: 'C41', pageReference: '294', isMalignant: true, sortOrder: 28 },
  { category: 'Osteogenic', subcategory: 'Malignant', diagnosis: 'High-grade surface osteosarcoma', icdO3Code: 'C41', isMalignant: true, sortOrder: 29 },

  // Fibrogenic tumors
  { category: 'Fibrogenic', subcategory: 'Benign', diagnosis: 'Desmoplastic fibroma of bone', icdO3Code: 'D16', pageReference: '298', isMalignant: false, sortOrder: 30 },
  { category: 'Fibrogenic', subcategory: 'Malignant', diagnosis: 'Fibrosarcoma of bone', icdO3Code: 'C41', isMalignant: true, sortOrder: 31 },

  // Fibrohistiocytic tumors
  { category: 'Fibrohistiocytic', subcategory: 'Benign', diagnosis: 'Non-ossifying fibroma', icdO3Code: 'D16', isMalignant: false, sortOrder: 32 },
  { category: 'Fibrohistiocytic', subcategory: 'Benign', diagnosis: 'Benign fibrous histiocytoma of bone', icdO3Code: 'D16', isMalignant: false, sortOrder: 33 },

  // Ewing Sarcoma
  { category: 'Ewing Sarcoma', subcategory: 'Malignant', diagnosis: 'Ewing Sarcoma', icdO3Code: 'C41', isMalignant: true, sortOrder: 40 },

  // Hematopoietic neoplasms
  { category: 'Hematopoietic', subcategory: 'Malignant', diagnosis: 'Plasma cell myeloma', icdO3Code: 'C41', pageReference: '312', isMalignant: true, sortOrder: 50 },
  { category: 'Hematopoietic', subcategory: 'Malignant', diagnosis: 'Solitary plasmacytoma of bone', icdO3Code: 'C41', pageReference: '315', isMalignant: true, sortOrder: 51 },
  { category: 'Hematopoietic', subcategory: 'Malignant', diagnosis: 'Primary non-Hodgkin lymphoma of bone', icdO3Code: 'C41', isMalignant: true, sortOrder: 52 },

  // Osteoclastic giant cell-rich tumors
  { category: 'Giant Cell', subcategory: 'Intermediate', diagnosis: 'Giant cell lesion of small bones', icdO3Code: 'D16', pageReference: '320', isMalignant: false, sortOrder: 60 },
  { category: 'Giant Cell', subcategory: 'Intermediate', diagnosis: 'Giant cell tumor of bone', icdO3Code: 'D48', isMalignant: false, sortOrder: 61 },

  // Notochordal tumors
  { category: 'Notochordal', subcategory: 'Benign', diagnosis: 'Benign notochordal cell tumor', icdO3Code: 'D16', pageReference: '326', isMalignant: false, sortOrder: 70 },
  { category: 'Notochordal', subcategory: 'Malignant', diagnosis: 'Chordoma', icdO3Code: 'C41', isMalignant: true, sortOrder: 71 },

  // Vascular tumors
  { category: 'Vascular', subcategory: 'Benign', diagnosis: 'Haemangioma', icdO3Code: 'D16', pageReference: '332', isMalignant: false, sortOrder: 80 },
  { category: 'Vascular', subcategory: 'Benign', diagnosis: 'Epithelioid haemangioma', icdO3Code: 'D16', pageReference: '333', isMalignant: false, sortOrder: 81 },
  { category: 'Vascular', subcategory: 'Malignant', diagnosis: 'Epithelioid haemangioendothelioma', icdO3Code: 'C41', pageReference: '335', isMalignant: true, sortOrder: 82 },
  { category: 'Vascular', subcategory: 'Malignant', diagnosis: 'Angiosarcoma', icdO3Code: 'C41', isMalignant: true, sortOrder: 83 },

  // Myogenic, lipogenic, epithelial
  { category: 'Other', subcategory: 'Malignant', diagnosis: 'Leiomyosarcoma', icdO3Code: 'C41', pageReference: '340', isMalignant: true, sortOrder: 90 },
  { category: 'Other', subcategory: 'Benign', diagnosis: 'Lipoma', icdO3Code: 'D16', pageReference: '341', isMalignant: false, sortOrder: 91 },
  { category: 'Other', subcategory: 'Malignant', diagnosis: 'Liposarcoma', icdO3Code: 'C41', pageReference: '342', isMalignant: true, sortOrder: 92 },
  { category: 'Other', subcategory: 'Malignant', diagnosis: 'Adamantinoma', icdO3Code: 'C41', isMalignant: true, sortOrder: 93 },
  { category: 'Other', subcategory: 'Malignant', diagnosis: 'Synovial sarcoma', icdO3Code: 'C41', isMalignant: true, sortOrder: 94 },
  { category: 'Other', subcategory: 'Malignant', diagnosis: 'Hemangioendothelioma', icdO3Code: 'C41', isMalignant: true, sortOrder: 95 },
  { category: 'Other', subcategory: 'Malignant', diagnosis: 'Solitary fibrous tumor of bone', icdO3Code: 'C41', isMalignant: true, sortOrder: 96 },

  // Tumor-like lesions
  { category: 'Tumor-like', subcategory: 'Benign', diagnosis: 'Aneurysmal bone cyst', icdO3Code: 'D16', pageReference: '348', isMalignant: false, sortOrder: 100 },
  { category: 'Tumor-like', subcategory: 'Benign', diagnosis: 'Simple bone cyst', icdO3Code: 'D16', pageReference: '350', isMalignant: false, sortOrder: 101 },
  { category: 'Tumor-like', subcategory: 'Benign', diagnosis: 'Fibrous dysplasia', icdO3Code: 'D16', pageReference: '352', isMalignant: false, sortOrder: 102 },
  { category: 'Tumor-like', subcategory: 'Benign', diagnosis: 'Osteofibrous dysplasia', icdO3Code: 'D16', pageReference: '354', isMalignant: false, sortOrder: 103 },
  { category: 'Tumor-like', subcategory: 'Benign', diagnosis: 'Langerhans cell histiocytosis', icdO3Code: 'D16', pageReference: '356', isMalignant: false, sortOrder: 104 },
  { category: 'Tumor-like', subcategory: 'Benign', diagnosis: 'Erdheim-Chester disease', icdO3Code: 'D16', pageReference: '358', isMalignant: false, sortOrder: 105 },
  { category: 'Tumor-like', subcategory: 'Benign', diagnosis: 'Chondromesenchymal hamartoma', icdO3Code: 'D16', pageReference: '360', isMalignant: false, sortOrder: 106 },
  { category: 'Tumor-like', subcategory: 'Benign', diagnosis: 'Rosai-Dorfman disease', icdO3Code: 'D16', isMalignant: false, sortOrder: 107 },
];

export async function seedWhoBoneTumors(prisma: PrismaClient) {
  try {
    console.log('🦴 Seeding WHO bone tumor classifications (57 types)...');

    for (const tumor of whoBoneTumors) {
      await prisma.whoBoneTumorClassification.upsert({
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
          pageReference: tumor.pageReference || null,
          isMalignant: tumor.isMalignant,
          sortOrder: tumor.sortOrder,
        },
      });
    }

    console.log('✅ All 57 WHO bone tumor classifications seeded!');
  } catch (error) {
    console.error('❌ Error seeding WHO bone tumors:', error);
    throw error;
  }
}
