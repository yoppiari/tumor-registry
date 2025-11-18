import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { Patient, Gender, BloodType, MaritalStatus } from '@prisma/client';

@Injectable()
export class PatientsService {
  private readonly logger = new Logger(PatientsService.name);

  constructor(private prisma: PrismaService) {}

  async findAll(
    centerId?: string,
    includeInactive = false,
    page = 1,
    limit = 50,
    search?: string
  ): Promise<{ patients: any[], total: number, page: number, totalPages: number }> {
    try {
      const skip = (page - 1) * limit;

      const where: any = {
        ...(centerId && { centerId }),
        ...(includeInactive === false && { isActive: true }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { nik: { contains: search, mode: 'insensitive' } },
            { medicalRecordNumber: { contains: search, mode: 'insensitive' } },
            { phoneNumber: { contains: search, mode: 'insensitive' } },
          ],
        }),
      };

      const [patients, total] = await Promise.all([
        this.prisma.patient.findMany({
          where,
          include: {
            center: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
            _count: {
              select: {
                diagnoses: {
                  where: {
                    status: 'ACTIVE',
                  },
                },
                medications: {
                  where: {
                    isActive: true,
                  },
                },
                visits: true,
              },
            },
          },
          orderBy: [
            { name: 'asc' },
          ],
          skip,
          take: limit,
        }),
        this.prisma.patient.count({ where }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        patients: patients.map(patient => ({
          ...patient,
          activeDiagnoses: patient._count.diagnoses,
          activeMedications: patient._count.medications,
          totalVisits: patient._count.visits,
          _count: undefined,
        })),
        total,
        page,
        totalPages,
      };
    } catch (error) {
      this.logger.error('Error finding all patients', error);
      throw error;
    }
  }

  async findById(id: string, includeMedicalHistory = false): Promise<any> {
    try {
      const patient = await this.prisma.patient.findUnique({
        where: { id },
        include: {
          center: true,
          ...(includeMedicalHistory && {
            diagnoses: {
              where: {
                status: 'ACTIVE',
              },
              orderBy: {
                createdAt: 'desc',
              },
            },
            allergies: {
              where: {
                status: 'ACTIVE',
              },
              orderBy: {
                createdAt: 'desc',
              },
            },
            medications: {
              where: {
                isActive: true,
              },
              orderBy: {
                createdAt: 'desc',
              },
            },
            vitalSigns: {
              orderBy: {
                recordedAt: 'desc',
              },
              take: 10,
            },
            visits: {
              orderBy: {
                visitDate: 'desc',
              },
              take: 5,
            },
            insuranceInfos: {
              where: {
                isActive: true,
              },
            },
          }),
          _count: {
            select: {
              diagnoses: {
                where: {
                  status: 'ACTIVE',
                },
              },
              medications: {
                where: {
                  isActive: true,
                },
              },
              visits: true,
              vitalSigns: true,
            },
          },
        },
      });

      if (!patient) {
        throw new NotFoundException(`Patient with ID ${id} not found`);
      }

      // Calculate age
      const age = this.calculateAge(patient.dateOfBirth, patient.dateOfDeath);

      return {
        ...patient,
        age,
        ageGroup: this.getAgeGroup(age),
        _count: undefined,
      };
    } catch (error) {
      this.logger.error(`Error finding patient by ID: ${id}`, error);
      throw error;
    }
  }

  async findByNIK(nik: string): Promise<Patient> {
    try {
      const patient = await this.prisma.patient.findUnique({
        where: { nik },
      });

      if (!patient) {
        throw new NotFoundException(`Patient with NIK ${nik} not found`);
      }

      return patient;
    } catch (error) {
      this.logger.error(`Error finding patient by NIK: ${nik}`, error);
      throw error;
    }
  }

  async findByMedicalRecordNumber(mrn: string): Promise<Patient> {
    try {
      const patient = await this.prisma.patient.findUnique({
        where: { medicalRecordNumber: mrn },
      });

      if (!patient) {
        throw new NotFoundException(`Patient with MRN ${mrn} not found`);
      }

      return patient;
    } catch (error) {
      this.logger.error(`Error finding patient by MRN: ${mrn}`, error);
      throw error;
    }
  }

  async create(patientData: {
    name: string;
    nik: string;
    dateOfBirth: Date;
    placeOfBirth?: string;
    gender: Gender;
    bloodType?: BloodType;
    religion?: string;
    maritalStatus?: MaritalStatus;
    occupation?: string;
    education?: string;
    phoneNumber?: string;
    email?: string;
    address?: string;
    province?: string;
    regency?: string;
    district?: string;
    village?: string;
    postalCode?: string;
    emergencyContact?: any;
    centerId: string;
  }): Promise<Patient> {
    try {
      // Check if NIK already exists
      const existingPatientByNik = await this.prisma.patient.findUnique({
        where: { nik: patientData.nik },
      });

      if (existingPatientByNik) {
        throw new ConflictException(`Patient with NIK ${patientData.nik} already exists`);
      }

      // Generate medical record number
      const medicalRecordNumber = await this.generateMedicalRecordNumber(patientData.centerId);

      const patient = await this.prisma.patient.create({
        data: {
          name: patientData.name,
          nik: patientData.nik,
          medicalRecordNumber,
          dateOfBirth: patientData.dateOfBirth,
          placeOfBirth: patientData.placeOfBirth,
          gender: patientData.gender,
          bloodType: patientData.bloodType,
          religion: patientData.religion,
          maritalStatus: patientData.maritalStatus,
          occupation: patientData.occupation,
          education: patientData.education,
          phoneNumber: patientData.phoneNumber,
          email: patientData.email,
          address: patientData.address,
          province: patientData.province,
          regency: patientData.regency,
          district: patientData.district,
          village: patientData.village,
          postalCode: patientData.postalCode,
          emergencyContact: patientData.emergencyContact,
          centerId: patientData.centerId,
        },
      });

      this.logger.log(`Patient created: ${patient.name} (${patient.medicalRecordNumber})`);
      return patient;
    } catch (error) {
      this.logger.error(`Error creating patient: ${patientData.name}`, error);
      throw error;
    }
  }

  async update(
    id: string,
    updateData: {
      name?: string;
      phoneNumber?: string;
      email?: string;
      address?: string;
      province?: string;
      regency?: string;
      district?: string;
      village?: string;
      postalCode?: string;
      emergencyContact?: any;
      bloodType?: BloodType;
      religion?: string;
      maritalStatus?: MaritalStatus;
      occupation?: string;
      education?: string;
      isActive?: boolean;
      isDeceased?: boolean;
      dateOfDeath?: Date;
      causeOfDeath?: string;
    },
  ): Promise<Patient> {
    try {
      const existingPatient = await this.findById(id);

      const updatedPatient = await this.prisma.patient.update({
        where: { id },
        data: {
          ...(updateData.name && { name: updateData.name }),
          ...(updateData.phoneNumber !== undefined && { phoneNumber: updateData.phoneNumber }),
          ...(updateData.email !== undefined && { email: updateData.email }),
          ...(updateData.address !== undefined && { address: updateData.address }),
          ...(updateData.province && { province: updateData.province }),
          ...(updateData.regency !== undefined && { regency: updateData.regency }),
          ...(updateData.district !== undefined && { district: updateData.district }),
          ...(updateData.village !== undefined && { village: updateData.village }),
          ...(updateData.postalCode !== undefined && { postalCode: updateData.postalCode }),
          ...(updateData.emergencyContact !== undefined && { emergencyContact: updateData.emergencyContact }),
          ...(updateData.bloodType && { bloodType: updateData.bloodType }),
          ...(updateData.religion !== undefined && { religion: updateData.religion }),
          ...(updateData.maritalStatus && { maritalStatus: updateData.maritalStatus }),
          ...(updateData.occupation !== undefined && { occupation: updateData.occupation }),
          ...(updateData.education !== undefined && { education: updateData.education }),
          ...(updateData.isActive !== undefined && { isActive: updateData.isActive }),
          ...(updateData.isDeceased !== undefined && { isDeceased: updateData.isDeceased }),
          ...(updateData.dateOfDeath !== undefined && { dateOfDeath: updateData.dateOfDeath }),
          ...(updateData.causeOfDeath !== undefined && { causeOfDeath: updateData.causeOfDeath }),
        },
      });

      this.logger.log(`Patient updated: ${updatedPatient.name} (${updatedPatient.medicalRecordNumber})`);
      return updatedPatient;
    } catch (error) {
      this.logger.error(`Error updating patient with ID: ${id}`, error);
      throw error;
    }
  }

  async getPatientStatistics(centerId?: string): Promise<any> {
    try {
      const where = centerId ? { centerId } : {};

      const [
        totalPatients,
        activePatients,
        deceasedPatients,
        genderStats,
        ageStats,
        bloodTypeStats,
      ] = await Promise.all([
        this.prisma.patient.count({ where }),
        this.prisma.patient.count({
          where: { ...where, isActive: true, isDeceased: false },
        }),
        this.prisma.patient.count({
          where: { ...where, isDeceased: true },
        }),
        this.getGenderStatistics(where),
        this.getAgeStatistics(where),
        this.getBloodTypeStatistics(where),
      ]);

      return {
        totalPatients,
        activePatients,
        deceasedPatients,
        genderStats,
        ageStats,
        bloodTypeStats,
      };
    } catch (error) {
      this.logger.error('Error getting patient statistics', error);
      throw error;
    }
  }

  async searchPatients(query: {
    search?: string;
    centerId?: string;
    gender?: Gender;
    bloodType?: BloodType;
    maritalStatus?: MaritalStatus;
    isDeceased?: boolean;
    dateOfBirthFrom?: Date;
    dateOfBirthTo?: Date;
    page?: number;
    limit?: number;
  }): Promise<{ patients: any[], total: number, page: number, totalPages: number }> {
    try {
      const page = query.page || 1;
      const limit = query.limit || 50;
      const skip = (page - 1) * limit;

      const where: any = {
        ...(query.centerId && { centerId: query.centerId }),
        ...(query.gender && { gender: query.gender }),
        ...(query.bloodType && { bloodType: query.bloodType }),
        ...(query.maritalStatus && { maritalStatus: query.maritalStatus }),
        ...(query.isDeceased !== undefined && { isDeceased: query.isDeceased }),
        ...(query.dateOfBirthFrom || query.dateOfBirthTo ? {
          dateOfBirth: {
            ...(query.dateOfBirthFrom && { gte: query.dateOfBirthFrom }),
            ...(query.dateOfBirthTo && { lte: query.dateOfBirthTo }),
          },
        } : {}),
        ...(query.search && {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' } },
            { nik: { contains: query.search, mode: 'insensitive' } },
            { medicalRecordNumber: { contains: query.search, mode: 'insensitive' } },
            { phoneNumber: { contains: query.search, mode: 'insensitive' } },
          ],
        }),
      };

      const [patients, total] = await Promise.all([
        this.prisma.patient.findMany({
          where,
          include: {
            center: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
          orderBy: [
            { name: 'asc' },
          ],
          skip,
          take: limit,
        }),
        this.prisma.patient.count({ where }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        patients: patients.map(patient => ({
          ...patient,
          age: this.calculateAge(patient.dateOfBirth, patient.dateOfDeath),
        })),
        total,
        page,
        totalPages,
      };
    } catch (error) {
      this.logger.error('Error searching patients', error);
      throw error;
    }
  }

  private async generateMedicalRecordNumber(centerId: string): Promise<string> {
    try {
      const center = await this.prisma.center.findUnique({
        where: { id: centerId },
      });

      if (!center) {
        throw new NotFoundException('Center not found');
      }

      const currentYear = new Date().getFullYear();
      const prefix = `${center.code}${currentYear}`;

      // Find the latest MRN with this prefix
      const latestPatient = await this.prisma.patient.findMany({
        where: {
          medicalRecordNumber: {
            startsWith: prefix,
          },
        },
        orderBy: {
          medicalRecordNumber: 'desc',
        },
        take: 1,
      });

      let sequence = 1;
      if (latestPatient.length > 0) {
        const latestMRN = latestPatient[0].medicalRecordNumber;
        const latestSequence = parseInt(latestMRN.slice(-6));
        if (!isNaN(latestSequence)) {
          sequence = latestSequence + 1;
        }
      }

      return `${prefix}${sequence.toString().padStart(6, '0')}`;
    } catch (error) {
      this.logger.error('Error generating medical record number', error);
      throw error;
    }
  }

  private calculateAge(dateOfBirth: Date, dateOfDeath?: Date): number {
    const endDate = dateOfDeath || new Date();
    let age = endDate.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = endDate.getMonth() - dateOfBirth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && endDate.getDate() < dateOfBirth.getDate())) {
      age--;
    }

    return age;
  }

  private getAgeGroup(age: number): string {
    if (age < 1) return 'Infant';
    if (age < 12) return 'Child';
    if (age < 18) return 'Adolescent';
    if (age < 40) return 'Adult';
    if (age < 60) return 'Middle-Aged';
    return 'Elderly';
  }

  private async getGenderStatistics(where: any) {
    const stats = await this.prisma.patient.groupBy({
      by: ['gender'],
      where,
      _count: {
        gender: true,
      },
    });

    return stats.reduce((acc, stat) => {
      acc[stat.gender] = stat._count.gender;
      return acc;
    }, {});
  }

  private async getAgeStatistics(where: any) {
    const patients = await this.prisma.patient.findMany({
      where,
      select: {
        dateOfBirth: true,
        dateOfDeath: true,
      },
    });

    const ageGroups = patients.reduce((acc, patient) => {
      const age = this.calculateAge(patient.dateOfBirth, patient.dateOfDeath);
      const group = this.getAgeGroup(age);
      acc[group] = (acc[group] || 0) + 1;
      return acc;
    }, {});

    return ageGroups;
  }

  private async getBloodTypeStatistics(where: any) {
    const stats = await this.prisma.patient.groupBy({
      by: ['bloodType'],
      where: {
        ...where,
        bloodType: {
          not: null,
        },
      },
      _count: {
        bloodType: true,
      },
    });

    return stats.reduce((acc, stat) => {
      acc[stat.bloodType!] = stat._count.bloodType;
      return acc;
    }, {});
  }
}