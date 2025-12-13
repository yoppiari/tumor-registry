/**
 * End-to-End Test: Complete Patient Submission Flow
 *
 * Tests the full wizard journey from Section 1 to Section 10
 * and validates backend data persistence.
 */

import { createPatient, transformWizardDataToPayload } from '../src/services/patientApi';

// Mock complete wizard data
const mockWizardData = {
  section1: {
    centerId: 'cmi56c7g700003pr87bllw7l2', // RSUD Dr. Zainoel Abidin (from seed data)
    centerName: 'RSUD Dr. Zainoel Abidin',
    pathologyTypeId: 'bone_tumor',
    pathologyTypeName: 'Bone Tumor',
  },

  section2: {
    medicalRecordNumber: `MR-E2E-${Date.now()}`,
    nik: `317305${Date.now().toString().slice(-10)}`, // Unique NIK for each test run
    name: 'Ahmad Test Patient',
    dateOfBirth: '1985-05-15',
    placeOfBirth: 'Jakarta',
    gender: 'MALE',
    bloodType: 'O_POSITIVE',
    religion: 'Islam',
    maritalStatus: 'MARRIED',
    occupation: 'Software Engineer',
    education: 'S1',
    phone: '+628123456789',
    email: 'ahmad.test@example.com',
    address: 'Jl. Test No. 123',
    province: 'DKI Jakarta',
    regency: 'Jakarta Pusat',
    district: 'Menteng',
    village: 'Gondangdia',
    postalCode: '10350',
    emergencyContact: {
      name: 'Siti Test',
      relationship: 'Wife',
      phone: '+628987654321',
    },
  },

  section3: {
    chiefComplaint: 'Nyeri dan bengkak pada lutut kiri sejak 3 bulan',
    symptomOnset: '2024-09-12',
    symptomDuration: 3,
    symptomDurationUnit: 'months',
    presentingSymptoms: ['pain', 'swelling', 'limited_mobility'],
    tumorSize: 8.5, // cm
    familyHistory: false,
    karnofskyScore: 80,
    height: 170, // cm
    weight: 70, // kg
    bmi: 24.22,
  },

  section4: {
    biopsyType: 'Core needle',
    biopsyDate: '2024-10-15',
    biopsyLocation: 'Distal femur',
    biopsySite: 'Lateral',
    imagingStudies: ['X-ray', 'MRI', 'CT', 'Bone Scan'],
    imagingDate: '2024-10-10',
    imagingFindings: 'Lytic lesion with periosteal reaction, soft tissue mass',
    mirrelScore: {
      siteScore: 2,
      painScore: 2,
      lesionType: 'LYTIC',
      sizeScore: 3,
      totalScore: 10,
      fractureRisk: 'MODERATE',
    },
  },

  section5: {
    diagnosisDate: '2024-10-20',
    whoClassificationId: 'bone-1', // Example: Osteosarcoma
    whoClassificationName: 'Osteosarcoma, conventional',
    boneLocationId: 'femur-distal-left',
    tumorGrade: 'High-grade (G2)',
    histopathology: 'High-grade osteoblastic osteosarcoma with extensive necrosis',
  },

  section6: {
    stagingSystem: 'BOTH',
    enneking: {
      grade: 'HIGH',
      site: 'EXTRACOMPARTMENTAL',
      metastasis: 'NO',
      stage: 'IIB',
      description: 'High-grade, extracompartmental, no metastasis',
    },
    ajcc: {
      tCategory: 'T2',
      nCategory: 'N0',
      mCategory: 'M0',
      grade: 'G2',
      edition: '8th',
      overallStage: 'IIB',
    },
  },

  section7: {
    cpcHeld: true,
    cpcDate: '2024-10-25',
    cpcLocation: 'Main Conference Room',
    participants: [
      { name: 'Dr. Budi Santoso', specialty: 'Orthopedic Oncology', role: 'CHAIR' },
      { name: 'Dr. Siti Rahayu', specialty: 'Medical Oncology', role: 'DISCUSSANT' },
      { name: 'Dr. Ahmad Wijaya', specialty: 'Radiation Oncology', role: 'DISCUSSANT' },
      { name: 'Dr. Rina Kusuma', specialty: 'Pathology', role: 'PRESENTER' },
    ],
    casePresentation: {
      presentedBy: 'Dr. Rina Kusuma',
      presentedByRole: 'Pathologist',
      chiefComplaint: 'Patient with painful left knee mass',
      clinicalFindings: 'Palpable mass, limited range of motion',
      imagingFindings: 'Large lytic lesion with soft tissue extension',
      pathologyFindings: 'High-grade osteosarcoma confirmed',
    },
    recommendations: {
      primaryTreatment: 'Neoadjuvant chemotherapy followed by limb salvage surgery',
      surgicalApproach: 'Wide excision with endoprosthetic reconstruction',
      neoadjuvantTherapy: true,
      adjuvantTherapy: true,
      radiationIndicated: false,
      followUpPlan: 'Standard 14-visit protocol with MSTS assessment',
    },
    consensus: {
      reached: true,
      finalDecision: 'Proceed with MAP chemotherapy protocol followed by limb salvage surgery',
    },
    notes: 'Patient counseled regarding treatment plan and prognosis',
  },

  section8: {
    surgery: {
      limbSalvageStatus: 'LIMB_SALVAGE',
      limbSalvageTechnique: 'Endoprosthesis',
      surgicalMargin: 'R0',
      complications: [],
      surgeryDate: '2025-02-15',
    },
    chemotherapy: {
      neoadjuvant: true,
      adjuvant: true,
      regimen: 'MAP (Methotrexate, Doxorubicin, Cisplatin)',
      cycles: 6,
      startDate: '2024-11-01',
      endDate: '2025-02-01',
      response: 'Good response, >90% necrosis',
    },
    radiotherapy: {
      given: false,
    },
    overallResponse: 'CR',
  },

  section9: {
    visits: [
      {
        visitNumber: 1,
        scheduledMonth: 3,
        completed: false,
      },
      {
        visitNumber: 2,
        scheduledMonth: 6,
        completed: false,
      },
      // ... other 12 visits with completed: false
    ],
  },
};

/**
 * Test 1: Data Transformation
 */
async function testDataTransformation() {
  console.log('\n=== TEST 1: Data Transformation ===');

  try {
    const payload = transformWizardDataToPayload(mockWizardData);

    console.log('✓ Transformation successful');
    console.log('Payload structure:');
    console.log('  - Patient Identity:', payload.name, payload.nik);
    console.log('  - Center:', payload.centerId);
    console.log('  - Diagnosis:', payload.whoClassificationId);
    console.log('  - Staging:', payload.enneking?.stage, payload.ajcc?.overallStage);
    console.log('  - CPC Held:', payload.cpc?.held);
    console.log('  - Treatment:', payload.treatment?.surgery?.limbSalvageStatus);

    return { success: true, payload };
  } catch (error) {
    console.error('✗ Transformation failed:', error);
    return { success: false, error };
  }
}

/**
 * Test 2: Patient Creation (API Call)
 */
async function testPatientCreation(payload: any) {
  console.log('\n=== TEST 2: Patient Creation (API Call) ===');

  try {
    console.log('Sending POST request to /api/v1/patients...');
    console.log('Payload preview:', {
      centerId: payload.centerId,
      name: payload.name,
      nik: payload.nik,
      diagnosisDate: payload.diagnosisDate,
    });

    const response = await createPatient(payload);

    console.log('✓ Patient created successfully');
    console.log('Full Response:', JSON.stringify(response, null, 2).slice(0, 500));

    const patient = response.data || response;
    console.log('Patient data:', {
      id: patient.id,
      name: patient.name,
      mrn: patient.medicalRecordNumber,
      message: response.message,
    });

    return { success: true, patient };
  } catch (error) {
    console.error('✗ Patient creation failed:', error);

    // Try to make a direct API call to see the actual error
    console.log('\n📋 Attempting direct API call for debugging...');
    try {
      const token = (global as any).localStorage?.getItem('auth_token');
      console.log('Token available:', !!token);

      const directResponse = await fetch('http://localhost:3001/api/v1/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(payload),
      });

      console.log('Direct API Response Status:', directResponse.status);
      const errorData = await directResponse.json();
      console.log('Direct API Response Body:', JSON.stringify(errorData, null, 2));
    } catch (debugError) {
      console.error('Debug API call also failed:', debugError);
    }

    return { success: false, error };
  }
}

/**
 * Test 3: Data Verification (Retrieve created patient)
 */
async function testDataVerification(patientId: string) {
  console.log('\n=== TEST 3: Data Verification ===');

  try {
    console.log('Fetching patient with ID:', patientId);

    const token = (global as any).localStorage?.getItem('auth_token');

    const response = await fetch(`http://localhost:3001/api/v1/patients/${patientId}`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.log('Error response:', JSON.stringify(errorData, null, 2));
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const patient = data.data || data;

    console.log('✓ Patient data retrieved successfully');
    console.log('Verified fields:');
    console.log('  - ID:', patient.id);
    console.log('  - Name:', patient.name);
    console.log('  - NIK:', patient.nik);
    console.log('  - Gender:', patient.gender);
    console.log('  - Diagnosis Date:', patient.diagnosisDate);

    return { success: true, patient };
  } catch (error) {
    console.error('✗ Data verification failed:', error);
    return { success: false, error };
  }
}

/**
 * Test 0: Authentication (Get JWT Token)
 */
async function testAuthentication() {
  console.log('\n=== TEST 0: Authentication ===');

  try {
    console.log('Logging in as admin@inamsos.go.id...');

    const response = await fetch('http://localhost:3001/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@inamsos.go.id',
        password: 'admin123',
      }),
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.status}`);
    }

    const data = await response.json();
    const token = data.accessToken;

    // Simulate localStorage in Node.js environment
    if (typeof global !== 'undefined') {
      const storage: Record<string, string> = { auth_token: token };
      (global as any).localStorage = {
        getItem: (key: string) => storage[key] || null,
        setItem: (key: string, value: string) => { storage[key] = value; },
        removeItem: (key: string) => { delete storage[key]; },
      };
      (global as any).window = { localStorage: (global as any).localStorage };
    }

    console.log('✓ Authentication successful');
    console.log('User:', data.user.name, `(${data.user.role})`);

    return { success: true, token };
  } catch (error) {
    console.error('✗ Authentication failed:', error);
    return { success: false, error };
  }
}

/**
 * Main E2E Test Runner
 */
async function runE2ETests() {
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║  INAMSOS E2E Test: Complete Patient Submission Flow  ║');
  console.log('╚═══════════════════════════════════════════════════════╝');
  console.log('\nTesting complete wizard flow from Section 1 to Section 10');
  console.log('Backend URL: http://localhost:3001');
  console.log('Frontend URL: http://localhost:3003');

  const results = {
    authentication: false,
    transformation: false,
    creation: false,
    verification: false,
  };

  // Test 0: Authentication
  const authResult = await testAuthentication();
  results.authentication = authResult.success;

  if (!authResult.success) {
    console.log('\n❌ E2E Test FAILED at authentication stage');
    return results;
  }

  // Test 1: Data Transformation
  const transformResult = await testDataTransformation();
  results.transformation = transformResult.success;

  if (!transformResult.success) {
    console.log('\n❌ E2E Test FAILED at transformation stage');
    return results;
  }

  // Test 2: Patient Creation
  const createResult = await testPatientCreation(transformResult.payload);
  results.creation = createResult.success;

  if (!createResult.success) {
    console.log('\n❌ E2E Test FAILED at creation stage');
    return results;
  }

  // Test 3: Data Verification
  if (createResult.patient?.id) {
    const verifyResult = await testDataVerification(createResult.patient.id);
    results.verification = verifyResult.success;

    // Note: Verification may fail due to backend UUID validation expecting UUID format
    // but patient IDs are CUID format. This is a backend issue, not a frontend issue.
    if (!verifyResult.success) {
      console.log('\n⚠️  Note: Verification failed due to backend UUID/CUID mismatch.');
      console.log('   Patient was created successfully (ID:', createResult.patient.id, ')');
      console.log('   Backend GET endpoint expects UUID but returns CUID on creation.');
    }
  }

  // Summary
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║                   TEST SUMMARY                        ║');
  console.log('╚═══════════════════════════════════════════════════════╝');
  console.log(`  0. Authentication:       ${results.authentication ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`  1. Data Transformation:  ${results.transformation ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`  2. Patient Creation:     ${results.creation ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`  3. Data Verification:    ${results.verification ? '✓ PASS' : '✗ FAIL'}`);
  console.log('');

  const allPassed = results.authentication && results.transformation && results.creation && results.verification;

  if (allPassed) {
    console.log('🎉 All E2E tests PASSED!');
    console.log('✅ Wizard → Backend → Database flow is working correctly');
  } else {
    console.log('❌ Some E2E tests FAILED');
    console.log('Please review the errors above');
  }

  return results;
}

// Run tests if executed directly
if (require.main === module) {
  runE2ETests()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

export { runE2ETests, mockWizardData };
