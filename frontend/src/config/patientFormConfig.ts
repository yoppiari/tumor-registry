/**
 * Patient Form Configuration
 * Defines the two-layer form structure:
 * - Close Questions: For national analytics database
 * - Open Questions: For local center detailed records
 */

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'radio' | 'textarea' | 'tel' | 'email';
  required: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: (value: any) => { isValid: boolean; error?: string };
  helpText?: string;
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
}

// ============================================
// SECTION 1: CLOSE QUESTIONS (National Analytics)
// ============================================
// These fields feed into the national cancer database for analytics

export const closeQuestionsConfig: FormSection[] = [
  {
    id: 'basic-info',
    title: 'Informasi Dasar Pasien',
    description: 'Data identitas utama pasien',
    fields: [
      {
        name: 'medicalRecordNumber',
        label: 'Nomor Rekam Medis (MRN)',
        type: 'text',
        required: false,
        placeholder: 'RM-XXXXXX',
        helpText: 'Nomor rekam medis unik pasien di rumah sakit Anda',
      },
      {
        name: 'name',
        label: 'Nama Lengkap Pasien',
        type: 'text',
        required: false,
        placeholder: 'Nama lengkap sesuai KTP',
      },
      {
        name: 'dateOfBirth',
        label: 'Tanggal Lahir',
        type: 'date',
        required: false,
      },
      {
        name: 'gender',
        label: 'Jenis Kelamin',
        type: 'radio',
        required: false,
        options: [
          { value: 'male', label: 'Laki-laki' },
          { value: 'female', label: 'Perempuan' },
        ],
      },
    ],
  },
  {
    id: 'cancer-diagnosis',
    title: 'Diagnosis Kanker',
    description: 'Informasi diagnosis kanker primer',
    fields: [
      {
        name: 'primarySite',
        label: 'Lokasi Kanker Primer',
        type: 'select',
        required: false,
        options: [
          { value: 'C50', label: 'Payudara (Breast)' },
          { value: 'C53', label: 'Serviks / Leher Rahim (Cervix)' },
          { value: 'C56', label: 'Ovarium' },
          { value: 'C34', label: 'Paru-paru (Lung)' },
          { value: 'C22', label: 'Hati (Liver)' },
          { value: 'C16', label: 'Lambung (Stomach)' },
          { value: 'C18', label: 'Kolon (Colon)' },
          { value: 'C20', label: 'Rektum (Rectum)' },
          { value: 'C11', label: 'Nasofaring (Nasopharynx)' },
          { value: 'C73', label: 'Tiroid (Thyroid)' },
          { value: 'C61', label: 'Prostat (Prostate)' },
          { value: 'C67', label: 'Kandung Kemih (Bladder)' },
          { value: 'C00-C97', label: 'Lainnya' },
        ],
        helpText: 'Pilih lokasi anatomis kanker primer berdasarkan ICD-O-3',
      },
      {
        name: 'laterality',
        label: 'Lateralitas',
        type: 'radio',
        required: false,
        options: [
          { value: 'left', label: 'Kiri' },
          { value: 'right', label: 'Kanan' },
          { value: 'bilateral', label: 'Bilateral' },
          { value: 'midline', label: 'Midline' },
          { value: 'unknown', label: 'Tidak Diketahui' },
        ],
      },
      {
        name: 'dateOfDiagnosis',
        label: 'Tanggal Diagnosis',
        type: 'date',
        required: false,
        helpText: 'Tanggal pertama kali diagnosis kanker ditegakkan',
      },
    ],
  },
  {
    id: 'staging',
    title: 'Stadium & Grading',
    description: 'Klasifikasi stadium dan grade tumor',
    fields: [
      {
        name: 'cancerStage',
        label: 'Stadium Kanker (Clinical Stage)',
        type: 'radio',
        required: false,
        options: [
          { value: 'I', label: 'Stadium I' },
          { value: 'II', label: 'Stadium II' },
          { value: 'III', label: 'Stadium III' },
          { value: 'IV', label: 'Stadium IV' },
        ],
        helpText: 'Stadium klinis berdasarkan TNM classification',
      },
      {
        name: 'cancerGrade',
        label: 'Grade Tumor (Histological Grade)',
        type: 'radio',
        required: false,
        options: [
          { value: 'G1', label: 'G1 (Well differentiated)' },
          { value: 'G2', label: 'G2 (Moderately differentiated)' },
          { value: 'G3', label: 'G3 (Poorly differentiated)' },
          { value: 'G4', label: 'G4 (Undifferentiated)' },
        ],
      },
      {
        name: 'tnm_t',
        label: 'T (Tumor Size/Extent)',
        type: 'select',
        required: false,
        options: [
          { value: 'TX', label: 'TX - Tumor tidak dapat dinilai' },
          { value: 'T0', label: 'T0 - Tidak ada bukti tumor primer' },
          { value: 'Tis', label: 'Tis - Carcinoma in situ' },
          { value: 'T1', label: 'T1' },
          { value: 'T2', label: 'T2' },
          { value: 'T3', label: 'T3' },
          { value: 'T4', label: 'T4' },
        ],
      },
      {
        name: 'tnm_n',
        label: 'N (Regional Lymph Nodes)',
        type: 'select',
        required: false,
        options: [
          { value: 'NX', label: 'NX - Tidak dapat dinilai' },
          { value: 'N0', label: 'N0 - Tidak ada metastasis ke kelenjar getah bening' },
          { value: 'N1', label: 'N1' },
          { value: 'N2', label: 'N2' },
          { value: 'N3', label: 'N3' },
        ],
      },
      {
        name: 'tnm_m',
        label: 'M (Distant Metastasis)',
        type: 'select',
        required: false,
        options: [
          { value: 'M0', label: 'M0 - Tidak ada metastasis jauh' },
          { value: 'M1', label: 'M1 - Ada metastasis jauh' },
          { value: 'MX', label: 'MX - Tidak dapat dinilai' },
        ],
      },
    ],
  },
  {
    id: 'treatment',
    title: 'Status Pengobatan',
    description: 'Informasi pengobatan dan treatment center',
    fields: [
      {
        name: 'treatmentStatus',
        label: 'Status Pengobatan',
        type: 'radio',
        required: false,
        options: [
          { value: 'new', label: 'Pasien Baru (Belum Terapi)' },
          { value: 'ongoing', label: 'Sedang Dalam Pengobatan' },
          { value: 'completed', label: 'Pengobatan Selesai' },
          { value: 'palliative', label: 'Terapi Paliatif' },
          { value: 'lost_to_followup', label: 'Lost to Follow-up' },
        ],
      },
      {
        name: 'treatmentCenter',
        label: 'Pusat Pengobatan',
        type: 'text',
        required: false,
        placeholder: 'Nama rumah sakit/pusat kanker',
        helpText: 'Rumah sakit/pusat kanker tempat pasien menjalani pengobatan',
      },
      {
        name: 'dateOfFirstVisit',
        label: 'Tanggal Kunjungan Pertama',
        type: 'date',
        required: false,
      },
    ],
  },
  {
    id: 'geography',
    title: 'Data Geografis',
    description: 'Lokasi geografis untuk analytics distribusi nasional',
    fields: [
      {
        name: 'province',
        label: 'Provinsi',
        type: 'select',
        required: false,
        options: [
          { value: 'DKI Jakarta', label: 'DKI Jakarta' },
          { value: 'Jawa Barat', label: 'Jawa Barat' },
          { value: 'Jawa Tengah', label: 'Jawa Tengah' },
          { value: 'Jawa Timur', label: 'Jawa Timur' },
          { value: 'Banten', label: 'Banten' },
          { value: 'DI Yogyakarta', label: 'DI Yogyakarta' },
          { value: 'Bali', label: 'Bali' },
          { value: 'Sumatera Utara', label: 'Sumatera Utara' },
          { value: 'Sumatera Barat', label: 'Sumatera Barat' },
          { value: 'Sumatera Selatan', label: 'Sumatera Selatan' },
          { value: 'Kalimantan Timur', label: 'Kalimantan Timur' },
          { value: 'Sulawesi Selatan', label: 'Sulawesi Selatan' },
          { value: 'Papua', label: 'Papua' },
        ],
      },
      {
        name: 'city',
        label: 'Kota/Kabupaten',
        type: 'text',
        required: false,
        placeholder: 'Nama kota/kabupaten',
      },
    ],
  },
];

// ============================================
// SECTION 2: OPEN QUESTIONS (Local Detail Data)
// ============================================
// These fields are for detailed local center records

export const openQuestionsConfig: FormSection[] = [
  {
    id: 'detailed-identity',
    title: 'Identitas Lengkap',
    description: 'Data identitas detail pasien',
    fields: [
      {
        name: 'identityNumber',
        label: 'Nomor Identitas (NIK)',
        type: 'text',
        required: false,
        placeholder: '16 digit NIK',
      },
      {
        name: 'bloodType',
        label: 'Golongan Darah',
        type: 'select',
        required: false,
        options: [
          { value: 'A', label: 'A' },
          { value: 'B', label: 'B' },
          { value: 'AB', label: 'AB' },
          { value: 'O', label: 'O' },
        ],
      },
      {
        name: 'rhFactor',
        label: 'Rhesus Factor',
        type: 'radio',
        required: false,
        options: [
          { value: 'positive', label: 'Positif (+)' },
          { value: 'negative', label: 'Negatif (-)' },
        ],
      },
      {
        name: 'maritalStatus',
        label: 'Status Pernikahan',
        type: 'radio',
        required: false,
        options: [
          { value: 'single', label: 'Belum Menikah' },
          { value: 'married', label: 'Menikah' },
          { value: 'divorced', label: 'Cerai' },
          { value: 'widowed', label: 'Janda/Duda' },
        ],
      },
      {
        name: 'occupation',
        label: 'Pekerjaan',
        type: 'text',
        required: false,
        placeholder: 'Pekerjaan pasien',
      },
      {
        name: 'educationLevel',
        label: 'Pendidikan Terakhir',
        type: 'select',
        required: false,
        options: [
          { value: 'SD', label: 'SD' },
          { value: 'SMP', label: 'SMP' },
          { value: 'SMA', label: 'SMA' },
          { value: 'D3', label: 'Diploma (D3)' },
          { value: 'S1', label: 'Sarjana (S1)' },
          { value: 'S2', label: 'Magister (S2)' },
          { value: 'S3', label: 'Doktor (S3)' },
        ],
      },
    ],
  },
  {
    id: 'contact-info',
    title: 'Informasi Kontak',
    description: 'Data kontak dan alamat lengkap',
    fields: [
      {
        name: 'phone',
        label: 'Nomor Telepon',
        type: 'tel',
        required: false,
        placeholder: '081234567890',
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        required: false,
        placeholder: 'email@example.com',
      },
      {
        name: 'address',
        label: 'Alamat Lengkap',
        type: 'textarea',
        required: false,
        placeholder: 'Jalan, RT/RW, Kelurahan, Kecamatan',
      },
      {
        name: 'postalCode',
        label: 'Kode Pos',
        type: 'text',
        required: false,
        placeholder: '12345',
      },
    ],
  },
  {
    id: 'emergency-contact',
    title: 'Kontak Darurat',
    description: 'Informasi keluarga/kontak darurat',
    fields: [
      {
        name: 'emergencyContactName',
        label: 'Nama Kontak Darurat',
        type: 'text',
        required: false,
        placeholder: 'Nama lengkap keluarga/kontak darurat',
      },
      {
        name: 'emergencyContactRelationship',
        label: 'Hubungan dengan Pasien',
        type: 'select',
        required: false,
        options: [
          { value: 'spouse', label: 'Suami/Istri' },
          { value: 'parent', label: 'Orang Tua' },
          { value: 'child', label: 'Anak' },
          { value: 'sibling', label: 'Saudara Kandung' },
          { value: 'other', label: 'Lainnya' },
        ],
      },
      {
        name: 'emergencyContactPhone',
        label: 'Nomor Telepon Kontak Darurat',
        type: 'tel',
        required: false,
        placeholder: '081234567890',
      },
    ],
  },
  {
    id: 'medical-history',
    title: 'Riwayat Medis',
    description: 'Riwayat penyakit dan keluarga',
    fields: [
      {
        name: 'comorbidities',
        label: 'Komorbiditas / Penyakit Penyerta',
        type: 'textarea',
        required: false,
        placeholder: 'Daftar penyakit lain yang diderita (diabetes, hipertensi, dll)',
        helpText: 'Pisahkan dengan koma jika ada lebih dari satu',
      },
      {
        name: 'familyHistory',
        label: 'Riwayat Kanker dalam Keluarga',
        type: 'textarea',
        required: false,
        placeholder: 'Anggota keluarga yang pernah/sedang menderita kanker',
      },
      {
        name: 'smokingHistory',
        label: 'Riwayat Merokok',
        type: 'radio',
        required: false,
        options: [
          { value: 'never', label: 'Tidak Pernah' },
          { value: 'former', label: 'Mantan Perokok' },
          { value: 'current', label: 'Perokok Aktif' },
        ],
      },
      {
        name: 'alcoholHistory',
        label: 'Riwayat Konsumsi Alkohol',
        type: 'radio',
        required: false,
        options: [
          { value: 'never', label: 'Tidak Pernah' },
          { value: 'occasional', label: 'Kadang-kadang' },
          { value: 'regular', label: 'Rutin' },
        ],
      },
    ],
  },
  {
    id: 'clinical-notes',
    title: 'Catatan Klinis',
    description: 'Catatan tambahan dari dokter',
    fields: [
      {
        name: 'morphologyCode',
        label: 'Kode Morfologi (ICD-O-3)',
        type: 'text',
        required: false,
        placeholder: 'Contoh: 8500/3',
        helpText: 'Kode morfologi tumor berdasarkan ICD-O-3',
      },
      {
        name: 'histologyReport',
        label: 'Hasil Histopatologi',
        type: 'textarea',
        required: false,
        placeholder: 'Ringkasan hasil pemeriksaan histopatologi',
      },
      {
        name: 'clinicalNotes',
        label: 'Catatan Dokter',
        type: 'textarea',
        required: false,
        placeholder: 'Catatan klinis tambahan dari dokter yang merawat',
      },
    ],
  },
];

// Helper function to get all field names for a mode
export const getFieldsForMode = (mode: 'quick' | 'full'): string[] => {
  if (mode === 'quick') {
    return closeQuestionsConfig.flatMap(section =>
      section.fields.map(field => field.name)
    );
  }

  return [
    ...closeQuestionsConfig.flatMap(section => section.fields.map(field => field.name)),
    ...openQuestionsConfig.flatMap(section => section.fields.map(field => field.name)),
  ];
};

// Helper function to validate a field
export const validateField = (field: FormField, value: any): { isValid: boolean; error?: string } => {
  // Check required fields
  if (field.required && (!value || value === '')) {
    return { isValid: false, error: `${field.label} wajib diisi` };
  }

  // Custom validation if provided
  if (field.validation && value) {
    return field.validation(value);
  }

  return { isValid: true };
};

// Helper function to validate a section
export const validateSection = (section: FormSection, formData: Record<string, any>): Record<string, string> => {
  const errors: Record<string, string> = {};

  section.fields.forEach(field => {
    const validation = validateField(field, formData[field.name]);
    if (!validation.isValid && validation.error) {
      errors[field.name] = validation.error;
    }
  });

  return errors;
};
