import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  Patient,
  CreatePatientDto,
  UpdatePatientDto,
  PatientSearchDto,
  PatientListResponse,
  PatientStatistics,
  QuickPatientEntryDto,
  PatientEntrySession,
  ChatMessage,
} from './interfaces/patient.interface';

@Injectable()
export class PatientsService {
  // Mock database - akan diganti dengan Prisma nanti
  private patients: Patient[] = [
    {
      id: uuidv4(),
      medicalRecordNumber: 'RM20240001',
      identityNumber: '3201011234560001',
      name: 'Sarah Permata',
      dateOfBirth: new Date('1985-03-15'),
      gender: 'female',
      bloodType: 'A',
      rhFactor: 'positive',
      phone: '+62812345678',
      email: 'sarah.permata@email.com',
      address: {
        street: 'Jl. Sudirman No. 123',
        village: 'Kelurahan Senayan',
        district: 'Kecamatan Kebayoran Baru',
        city: 'Jakarta Selatan',
        province: 'DKI Jakarta',
        postalCode: '12190',
        country: 'Indonesia',
        coordinates: { latitude: -6.2246, longitude: 106.8150 }
      },
      emergencyContact: {
        name: 'Ahmad Wijaya',
        relationship: 'spouse',
        phone: '+628987654321',
        address: 'Jl. Sudirman No. 123'
      },
      occupation: 'Teacher',
      educationLevel: 'S1',
      maritalStatus: 'married',
      religion: 'islam',
      primaryCancerDiagnosis: {
        primarySite: 'Breast',
        laterality: 'right',
        morphology: '8500/3',
        behavior: 'invasive',
        grade: 'G2'
      },
      cancerStage: 'II',
      cancerGrade: 'G2',
      tnmClassification: {
        t: 'T2',
        n: 'N1',
        m: 'M0',
        clinicalStage: 'IIB'
      },
      histology: 'Invasive Ductal Carcinoma',
      molecularMarkers: [
        {
          name: 'ER',
          result: 'positive',
          testDate: new Date('2024-01-15'),
          methodology: 'IHC'
        },
        {
          name: 'PR',
          result: 'positive',
          testDate: new Date('2024-01-15'),
          methodology: 'IHC'
        },
        {
          name: 'HER2',
          result: 'negative',
          testDate: new Date('2024-01-15'),
          methodology: 'IHC'
        }
      ],
      treatmentStatus: 'ongoing',
      dateOfDiagnosis: new Date('2024-01-10'),
      dateOfFirstVisit: new Date('2024-01-15'),
      lastVisitDate: new Date('2024-01-20'),
      treatmentCenter: '00000000-0000-0000-0000-000000000001',
      isActive: true,
      isDeceased: false,
      createdBy: '00000000-0000-0000-0000-000000000002',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
      lastActivityAt: new Date('2024-01-20')
    },
    {
      id: uuidv4(),
      medicalRecordNumber: 'RM20240002',
      identityNumber: '3301022345670002',
      name: 'Budi Santoso',
      dateOfBirth: new Date('1978-07-22'),
      gender: 'male',
      bloodType: 'O',
      rhFactor: 'positive',
      phone: '+62823456789',
      address: {
        street: 'Jl. Diponegoro No. 456',
        village: 'Kelurahan Gondokusuman',
        district: 'Kecamatan Gondokusuman',
        city: 'Yogyakarta',
        province: 'DI Yogyakarta',
        postalCode: '55221',
        country: 'Indonesia',
        coordinates: { latitude: -7.7956, longitude: 110.3695 }
      },
      emergencyContact: {
        name: 'Dewi Lestari',
        relationship: 'spouse',
        phone: '+628345678901'
      },
      occupation: 'Engineer',
      educationLevel: 'S1',
      maritalStatus: 'married',
      religion: 'islam',
      primaryCancerDiagnosis: {
        primarySite: 'Lung',
        laterality: 'left',
        morphology: '8046/3',
        behavior: 'invasive',
        grade: 'G3'
      },
      cancerStage: 'III',
      cancerGrade: 'G3',
      tnmClassification: {
        t: 'T3',
        n: 'N2',
        m: 'M1',
        clinicalStage: 'IIIC'
      },
      histology: 'Adenocarcinoma',
      molecularMarkers: [
        {
          name: 'EGFR',
          result: 'positive',
          testDate: new Date('2024-02-20'),
          methodology: 'PCR'
        }
      ],
      treatmentStatus: 'ongoing',
      dateOfDiagnosis: new Date('2024-02-15'),
      dateOfFirstVisit: new Date('2024-02-20'),
      lastVisitDate: new Date('2024-02-25'),
      treatmentCenter: '00000000-0000-0000-0000-000000000002',
      isActive: true,
      isDeceased: false,
      createdBy: '00000000-0000-0000-0000-000000000003',
      createdAt: new Date('2024-02-20'),
      updatedAt: new Date('2024-02-25'),
      lastActivityAt: new Date('2024-02-25')
    },
    {
      id: uuidv4(),
      medicalRecordNumber: 'RM20240003',
      identityNumber: '3401033456780003',
      name: 'Maya Putri',
      dateOfBirth: new Date('1992-11-08'),
      gender: 'female',
      bloodType: 'B',
      rhFactor: 'negative',
      phone: '+628345678912',
      address: {
        street: 'Jl. Malioboro No. 789',
        district: 'Kecamatan Gondomanan',
        city: 'Yogyakarta',
        province: 'DI Yogyakarta',
        postalCode: '55222',
        country: 'Indonesia'
      },
      emergencyContact: {
        name: 'Riyadi',
        relationship: 'parent',
        phone: '+628456789012'
      },
      occupation: 'Student',
      educationLevel: 'S1',
      maritalStatus: 'single',
      religion: 'islam',
      primaryCancerDiagnosis: {
        primarySite: 'Cervix',
        laterality: 'unknown',
        morphology: '8010/3',
        behavior: 'invasive'
      },
      cancerStage: 'I',
      cancerGrade: 'G2',
      tnmClassification: {
        t: 'T1b',
        n: 'N0',
        m: 'M0',
        clinicalStage: 'IB1'
      },
      histology: 'Squamous Cell Carcinoma',
      treatmentStatus: 'completed',
      dateOfDiagnosis: new Date('2023-12-01'),
      dateOfFirstVisit: new Date('2023-12-05'),
      lastVisitDate: new Date('2024-01-15'),
      treatmentCenter: '00000000-0000-0000-0000-000000000002',
      isActive: true,
      isDeceased: false,
      createdBy: '00000000-0000-0000-0000-000000000003',
      createdAt: new Date('2023-12-05'),
      updatedAt: new Date('2024-01-15'),
      lastActivityAt: new Date('2024-01-15')
    }
  ];

  // Mock entry sessions for WhatsApp-inspired interface
  private entrySessions: Map<string, PatientEntrySession> = new Map();

  async create(createPatientDto: CreatePatientDto, createdBy: string): Promise<Patient> {
    // Check if medical record number already exists
    const existingMRN = this.patients.find(p => p.medicalRecordNumber === createPatientDto.medicalRecordNumber);
    if (existingMRN) {
      throw new ConflictException('Medical record number already exists');
    }

    // Check if identity number already exists
    if (createPatientDto.identityNumber) {
      const existingNIK = this.patients.find(p => p.identityNumber === createPatientDto.identityNumber);
      if (existingNIK) {
        throw new ConflictException('Identity number already exists');
      }
    }

    const patient: Patient = {
      id: uuidv4(),
      ...createPatientDto,
      dateOfBirth: new Date(createPatientDto.dateOfBirth),
      dateOfDiagnosis: createPatientDto.dateOfDiagnosis ? new Date(createPatientDto.dateOfDiagnosis) : undefined,
      dateOfFirstVisit: createPatientDto.dateOfFirstVisit ? new Date(createPatientDto.dateOfFirstVisit) : undefined,
      dateOfDeath: undefined,
      isActive: true,
      isDeceased: false,
      createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastActivityAt: new Date(),
    };

    this.patients.push(patient);
    return this.findById(patient.id);
  }

  async findById(id: string): Promise<Patient> {
    const patient = this.patients.find(p => p.id === id);
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    return patient;
  }

  async findByMedicalRecordNumber(mrn: string): Promise<Patient> {
    const patient = this.patients.find(p => p.medicalRecordNumber === mrn);
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    return patient;
  }

  async findAll(searchDto: PatientSearchDto): Promise<PatientListResponse> {
    let filteredPatients = [...this.patients];

    // Apply filters
    if (searchDto.query) {
      const query = searchDto.query.toLowerCase();
      filteredPatients = filteredPatients.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.medicalRecordNumber.toLowerCase().includes(query) ||
        p.phone?.includes(query) ||
        p.identityNumber?.includes(query)
      );
    }

    if (searchDto.medicalRecordNumber) {
      filteredPatients = filteredPatients.filter(p =>
        p.medicalRecordNumber.toLowerCase().includes(searchDto.medicalRecordNumber.toLowerCase())
      );
    }

    if (searchDto.name) {
      filteredPatients = filteredPatients.filter(p =>
        p.name.toLowerCase().includes(searchDto.name.toLowerCase())
      );
    }

    if (searchDto.cancerStage) {
      filteredPatients = filteredPatients.filter(p => p.cancerStage === searchDto.cancerStage);
    }

    if (searchDto.treatmentStatus) {
      filteredPatients = filteredPatients.filter(p => p.treatmentStatus === searchDto.treatmentStatus);
    }

    if (searchDto.primarySite) {
      filteredPatients = filteredPatients.filter(p =>
        p.primaryCancerDiagnosis?.primarySite.toLowerCase().includes(searchDto.primarySite.toLowerCase())
      );
    }

    if (searchDto.treatmentCenter) {
      filteredPatients = filteredPatients.filter(p => p.treatmentCenter === searchDto.treatmentCenter);
    }

    if (searchDto.isDeceased !== undefined) {
      filteredPatients = filteredPatients.filter(p => p.isDeceased === searchDto.isDeceased);
    }

    // Date range filters
    if (searchDto.dateOfBirthFrom) {
      const fromDate = new Date(searchDto.dateOfBirthFrom);
      filteredPatients = filteredPatients.filter(p => p.dateOfBirth >= fromDate);
    }

    if (searchDto.dateOfBirthTo) {
      const toDate = new Date(searchDto.dateOfBirthTo);
      filteredPatients = filteredPatients.filter(p => p.dateOfBirth <= toDate);
    }

    if (searchDto.dateOfDiagnosisFrom) {
      const fromDate = new Date(searchDto.dateOfDiagnosisFrom);
      filteredPatients = filteredPatients.filter(p =>
        p.dateOfDiagnosis && p.dateOfDiagnosis >= fromDate
      );
    }

    if (searchDto.dateOfDiagnosisTo) {
      const toDate = new Date(searchDto.dateOfDiagnosisTo);
      filteredPatients = filteredPatients.filter(p =>
        p.dateOfDiagnosis && p.dateOfDiagnosis <= toDate
      );
    }

    // Sorting
    const sortBy = searchDto.sortBy || 'createdAt';
    const sortOrder = searchDto.sortOrder || 'desc';

    filteredPatients.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Patient];
      let bValue: any = b[sortBy as keyof Patient];

      if (aValue instanceof Date) aValue = aValue.getTime();
      if (bValue instanceof Date) bValue = bValue.getTime();

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Pagination
    const page = searchDto.page || 1;
    const limit = searchDto.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPatients = filteredPatients.slice(startIndex, endIndex);

    return {
      patients: paginatedPatients,
      total: filteredPatients.length,
      page,
      limit,
      totalPages: Math.ceil(filteredPatients.length / limit),
      hasNext: endIndex < filteredPatients.length,
      hasPrevious: page > 1,
    };
  }

  async update(id: string, updatePatientDto: UpdatePatientDto, updatedBy: string): Promise<Patient> {
    const patientIndex = this.patients.findIndex(p => p.id === id);
    if (patientIndex === -1) {
      throw new NotFoundException('Patient not found');
    }

    const patient = this.patients[patientIndex];

    // Update patient data
    const updatedPatient: Patient = {
      ...patient,
      ...updatePatientDto,
      dateOfDeath: updatePatientDto.dateOfDeath ? new Date(updatePatientDto.dateOfDeath) : patient.dateOfDeath,
      updatedBy,
      updatedAt: new Date(),
      lastActivityAt: new Date(),
    };

    this.patients[patientIndex] = updatedPatient;
    return updatedPatient;
  }

  async softDelete(id: string): Promise<void> {
    const patientIndex = this.patients.findIndex(p => p.id === id);
    if (patientIndex === -1) {
      throw new NotFoundException('Patient not found');
    }

    this.patients[patientIndex].isActive = false;
    this.patients[patientIndex].updatedAt = new Date();
    this.patients[patientIndex].lastActivityAt = new Date();
  }

  async markAsDeceased(id: string, dateOfDeath: Date, causeOfDeath?: string, updatedBy?: string): Promise<Patient> {
    const patient = await this.findById(id);

    if (patient.isDeceased) {
      throw new BadRequestException('Patient is already marked as deceased');
    }

    return this.update(id, {
      isDeceased: true,
      dateOfDeath: dateOfDeath.toISOString(),
      causeOfDeath,
      treatmentStatus: 'deceased'
    }, updatedBy || 'system');
  }

  async getStatistics(): Promise<PatientStatistics> {
    const activePatients = this.patients.filter(p => p.isActive);
    const deceasedPatients = activePatients.filter(p => p.isDeceased);
    const lostToFollowUp = activePatients.filter(p => p.treatmentStatus === 'lost_to_followup');
    const newCases = activePatients.filter(p => p.treatmentStatus === 'new');

    const currentYear = new Date().getFullYear();
    const currentYearPatients = activePatients.filter(p =>
      p.createdAt.getFullYear() === currentYear
    );

    // Age groups
    const now = new Date();
    const byAgeGroup = {
      '0-17': 0,
      '18-35': 0,
      '36-50': 0,
      '51-65': 0,
      '65+': 0,
    };

    activePatients.forEach(patient => {
      const age = now.getFullYear() - patient.dateOfBirth.getFullYear();
      if (age <= 17) byAgeGroup['0-17']++;
      else if (age <= 35) byAgeGroup['18-35']++;
      else if (age <= 50) byAgeGroup['36-50']++;
      else if (age <= 65) byAgeGroup['51-65']++;
      else byAgeGroup['65+']++;
    });

    // By cancer stage
    const byCancerStage = activePatients.reduce((acc, patient) => {
      if (patient.cancerStage) {
        acc[patient.cancerStage] = (acc[patient.cancerStage] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // By treatment status
    const byTreatmentStatus = activePatients.reduce((acc, patient) => {
      acc[patient.treatmentStatus] = (acc[patient.treatmentStatus] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // By primary site
    const byPrimarySite = activePatients.reduce((acc, patient) => {
      const site = patient.primaryCancerDiagnosis?.primarySite || 'Unknown';
      acc[site] = (acc[site] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // By province
    const byProvince = activePatients.reduce((acc, patient) => {
      const province = patient.address.province || 'Unknown';
      acc[province] = (acc[province] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Monthly registrations (last 12 months)
    const monthlyRegistrations = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthYear = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      const count = currentYearPatients.filter(p =>
        p.createdAt.getMonth() === date.getMonth()
      ).length;
      monthlyRegistrations.push({ month: monthYear, count });
    }

    // Recent registrations
    const recentRegistrations = [...activePatients]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);

    return {
      total: activePatients.length,
      active: activePatients.filter(p => !p.isDeceased).length,
      deceased: deceasedPatients.length,
      lostToFollowUp: lostToFollowUp.length,
      newCases: newCases.length,
      byGender: {
        male: activePatients.filter(p => p.gender === 'male').length,
        female: activePatients.filter(p => p.gender === 'female').length,
      },
      byAgeGroup,
      byCancerStage,
      byTreatmentStatus,
      byPrimarySite,
      byProvince,
      monthlyRegistrations,
      recentRegistrations,
    };
  }

  // WhatsApp-inspired quick entry
  async quickEntry(quickEntryDto: QuickPatientEntryDto, createdBy: string): Promise<Patient> {
    const medicalRecordNumber = quickEntryDto.medicalRecordNumber || this.generateMedicalRecordNumber();

    const createPatientDto: CreatePatientDto = {
      medicalRecordNumber,
      name: quickEntryDto.name,
      dateOfBirth: quickEntryDto.dateOfBirth || new Date(),
      gender: quickEntryDto.gender || 'female',
      phone: quickEntryDto.phone,
      address: {
        street: '',
        village: '',
        district: '',
        city: '',
        province: '',
        postalCode: '',
        country: 'Indonesia',
      },
      emergencyContact: {
        name: '',
        relationship: 'other',
        phone: quickEntryDto.phone || '',
      },
      primaryCancerDiagnosis: quickEntryDto.primarySite ? {
        primarySite: quickEntryDto.primarySite,
        laterality: 'unknown',
        morphology: '',
        behavior: 'invasive',
      } : undefined,
      cancerStage: quickEntryDto.cancerStage,
      treatmentStatus: quickEntryDto.treatmentStatus,
      treatmentCenter: '00000000-0000-0000-0000-000000000001', // Default center
    };

    return this.create(createPatientDto, createdBy);
  }

  private generateMedicalRecordNumber(): string {
    const year = new Date().getFullYear();
    const sequence = this.patients.length + 1;
    return `RM${year}${sequence.toString().padStart(4, '0')}`;
  }

  // Chat session management
  async createEntrySession(userId: string): Promise<PatientEntrySession> {
    const sessionId = uuidv4();
    const session: PatientEntrySession = {
      id: sessionId,
      status: 'in_progress',
      currentStep: 0,
      totalSteps: 8, // Total steps in the form
      messages: [
        {
          id: uuidv4(),
          type: 'system',
          content: '👋 Selamat datang di sistem input data pasien INAMSOS. Mari kita mulai dengan nama pasien.',
          timestamp: new Date(),
        }
      ],
      formData: {},
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: userId,
    };

    this.entrySessions.set(sessionId, session);
    return session;
  }

  async getSession(sessionId: string): Promise<PatientEntrySession> {
    const session = this.entrySessions.get(sessionId);
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    return session;
  }

  async updateSession(sessionId: string, content: string, fieldName?: string, formData?: any): Promise<PatientEntrySession> {
    const session = await this.getSession(sessionId);

    // Update form data
    if (fieldName && formData) {
      session.formData[fieldName] = formData;
    }

    // Add message
    const message: ChatMessage = {
      id: uuidv4(),
      type: 'user',
      content,
      timestamp: new Date(),
      fieldName,
    };

    session.messages.push(message);
    session.updatedAt = new Date();

    // Generate system response
    const response = await this.generateSystemResponse(session);
    session.messages.push(response);

    // Update current step
    session.currentStep = Math.floor(session.messages.filter(m => m.type === 'user').length / 2);

    // Check if session is complete
    if (session.currentStep >= session.totalSteps) {
      session.status = 'completed';
    }

    this.entrySessions.set(sessionId, session);
    return session;
  }

  private async generateSystemResponse(session: PatientEntrySession): Promise<ChatMessage> {
    const userMessages = session.messages.filter(m => m.type === 'user');
    const step = userMessages.length;

    const responses = [
      {
        content: '👋 Baik, sekarang tolong masukkan tanggal lahir pasien (format: YYYY-MM-DD).',
        fieldName: 'dateOfBirth'
      },
      {
        content: '📞 Apakah ada nomor telepon pasien?',
        fieldName: 'phone',
        options: ['Ada', 'Tidak ada']
      },
      {
        content: '🎂 Berapa usia pasien?',
        fieldName: 'age'
      },
      {
        content: '👫 Jenis kelamin pasien?',
        fieldName: 'gender',
        options: ['Laki-laki', 'Perempuan']
      },
      {
        content: '🏥 Dimana lokasi kanker utama?',
        fieldName: 'primarySite'
      },
      {
        content: '📊 Berapa stadium kanker?',
        fieldName: 'cancerStage',
        options: ['Stage I', 'Stage II', 'Stage III', 'Stage IV']
      },
      {
        content: '💊 Status pengobatan saat ini?',
        fieldName: 'treatmentStatus',
        options: ['Baru', 'Sedang berlangsung', 'Selesai', 'Paliatif']
      },
      {
        content: '✅ Terima kasih! Data pasien telah berhasil disimpan. Nomor rekam medis: RM20240004',
        fieldName: 'complete',
        completed: true
      }
    ];

    const response = responses[Math.min(step, responses.length - 1)];

    return {
      id: uuidv4(),
      type: 'system',
      content: response.content,
      timestamp: new Date(),
      fieldName: response.fieldName,
      options: response.options,
      completed: response.completed || false,
    };
  }
}