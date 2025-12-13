import { PrismaClient } from '@prisma/client';

export const tumorSyndromes = [
  {
    name: 'Li-Fraumeni Syndrome',
    geneticMarker: 'TP53',
    description: 'Autosomal dominant cancer predisposition syndrome',
    associatedTumors: 'Osteosarcoma, Soft tissue sarcoma, Breast cancer, Brain tumors, Adrenocortical carcinoma'
  },
  {
    name: 'Neurofibromatosis Type 1 (NF1)',
    geneticMarker: 'NF1',
    description: 'Autosomal dominant disorder affecting multiple systems',
    associatedTumors: 'Malignant peripheral nerve sheath tumor (MPNST), Neurofibroma, Optic glioma'
  },
  {
    name: 'Ollier Disease',
    geneticMarker: 'IDH1, IDH2 somatic mutations',
    description: 'Non-hereditary disorder with multiple enchondromas',
    associatedTumors: 'Enchondroma, Chondrosarcoma (malignant transformation risk)'
  },
  {
    name: 'Maffucci Syndrome',
    geneticMarker: 'IDH1, IDH2 somatic mutations',
    description: 'Ollier disease with associated soft tissue hemangiomas',
    associatedTumors: 'Enchondroma, Chondrosarcoma, Hemangioma'
  },
  {
    name: 'Multiple Hereditary Exostoses (MHE)',
    geneticMarker: 'EXT1, EXT2',
    description: 'Autosomal dominant disorder with multiple osteochondromas',
    associatedTumors: 'Osteochondroma, Chondrosarcoma (1-5% malignant transformation)'
  },
  {
    name: 'Retinoblastoma (Hereditary)',
    geneticMarker: 'RB1',
    description: 'Germline RB1 mutation predisposing to second malignancies',
    associatedTumors: 'Retinoblastoma, Osteosarcoma, Soft tissue sarcoma'
  },
  {
    name: 'Rothmund-Thomson Syndrome',
    geneticMarker: 'RECQL4',
    description: 'Rare autosomal recessive disorder',
    associatedTumors: 'Osteosarcoma, Skin cancer'
  },
  {
    name: 'Werner Syndrome',
    geneticMarker: 'WRN',
    description: 'Premature aging syndrome',
    associatedTumors: 'Osteosarcoma, Soft tissue sarcoma, Various malignancies'
  },
  {
    name: 'Bloom Syndrome',
    geneticMarker: 'BLM',
    description: 'Chromosomal instability syndrome',
    associatedTumors: 'Osteosarcoma, Leukemia, Lymphoma, Various solid tumors'
  },
  {
    name: 'Paget Disease of Bone',
    geneticMarker: 'SQSTM1 (some cases)',
    description: 'Metabolic bone disease with increased sarcoma risk',
    associatedTumors: 'Osteosarcoma (secondary), Giant cell tumor'
  },
  {
    name: 'Fibrous Dysplasia',
    geneticMarker: 'GNAS somatic mutation',
    description: 'Benign bone disorder with rare malignant transformation',
    associatedTumors: 'Osteosarcoma (rare transformation), Chondrosarcoma (rare)'
  },
  {
    name: 'McCune-Albright Syndrome',
    geneticMarker: 'GNAS somatic mutation',
    description: 'Fibrous dysplasia with endocrine abnormalities',
    associatedTumors: 'Same as fibrous dysplasia'
  },
  {
    name: 'Gardner Syndrome',
    geneticMarker: 'APC',
    description: 'Familial adenomatous polyposis variant',
    associatedTumors: 'Osteoma, Desmoid tumor, Colon cancer'
  },
  {
    name: 'Tuberous Sclerosis',
    geneticMarker: 'TSC1, TSC2',
    description: 'Autosomal dominant neurocutaneous disorder',
    associatedTumors: 'Subependymal giant cell astrocytoma, Angiomyolipoma, Renal cell carcinoma'
  },
  {
    name: 'DICER1 Syndrome',
    geneticMarker: 'DICER1',
    description: 'Pleuropulmonary blastoma familial tumor syndrome',
    associatedTumors: 'Pleuropulmonary blastoma, Ovarian Sertoli-Leydig cell tumor, Various sarcomas'
  },
];

export async function seedTumorSyndromes(prisma: PrismaClient) {
  try {
    console.log('🧬 Seeding tumor syndromes (15 genetic syndromes)...');

    for (const syndrome of tumorSyndromes) {
      await prisma.tumorSyndrome.upsert({
        where: { name: syndrome.name },
        update: {},
        create: {
          name: syndrome.name,
          geneticMarker: syndrome.geneticMarker,
          description: syndrome.description,
          associatedTumors: syndrome.associatedTumors,
        },
      });
    }

    console.log('✅ All 15 tumor syndromes seeded!');
  } catch (error) {
    console.error('❌ Error seeding tumor syndromes:', error);
    throw error;
  }
}
