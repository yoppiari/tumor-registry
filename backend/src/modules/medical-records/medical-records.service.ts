import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { MedicalRecord, RecordType } from '@prisma/client';

@Injectable()
export class MedicalRecordsService {
  private readonly logger = new Logger(MedicalRecordsService.name);

  constructor(private prisma: PrismaService) {}

  async createMedicalRecord(recordData: {
    patientId: string;
    recordType: RecordType;
    providerId: string;
    chiefComplaint?: string;
    historyOfPresent?: string;
    pastMedical?: any;
    surgicalHistory?: any;
    familyHistory?: any;
    socialHistory?: any;
    reviewOfSystems?: any;
    physicalExam?: any;
    assessment?: string;
    plan?: string;
    notes?: string;
    isConfidential?: boolean;
  }): Promise<MedicalRecord> {
    try {
      // Generate record number
      const recordNumber = await this.generateRecordNumber(
        recordData.patientId,
        recordData.recordType
      );

      const medicalRecord = await this.prisma.medicalRecord.create({
        data: {
          patientId: recordData.patientId,
          recordType: recordData.recordType,
          recordNumber,
          providerId: recordData.providerId,
          chiefComplaint: recordData.chiefComplaint,
          historyOfPresent: recordData.historyOfPresent,
          pastMedical: recordData.pastMedical,
          surgicalHistory: recordData.surgicalHistory,
          familyHistory: recordData.familyHistory,
          socialHistory: recordData.socialHistory,
          reviewOfSystems: recordData.reviewOfSystems,
          physicalExam: recordData.physicalExam,
          assessment: recordData.assessment,
          plan: recordData.plan,
          notes: recordData.notes,
          isConfidential: recordData.isConfidential || false,
        },
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              medicalRecordNumber: true,
            },
          },
        },
      });

      this.logger.log(`Medical record created: ${medicalRecord.recordNumber} for patient ${medicalRecord.patient.name}`);
      return medicalRecord;
    } catch (error) {
      this.logger.error('Error creating medical record', error);
      throw error;
    }
  }

  async findByPatientId(
    patientId: string,
    recordType?: RecordType,
    page = 1,
    limit = 20
  ): Promise<{ records: any[], total: number, page: number, totalPages: number }> {
    try {
      const skip = (page - 1) * limit;

      const where: any = {
        patientId,
        ...(recordType && { recordType }),
      };

      const [records, total] = await Promise.all([
        this.prisma.medicalRecord.findMany({
          where,
          include: {
            patient: {
              select: {
                id: true,
                name: true,
                medicalRecordNumber: true,
              },
            },
          },
          orderBy: [
            { createdAt: 'desc' },
          ],
          skip,
          take: limit,
        }),
        this.prisma.medicalRecord.count({ where }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        records,
        total,
        page,
        totalPages,
      };
    } catch (error) {
      this.logger.error(`Error finding medical records for patient: ${patientId}`, error);
      throw error;
    }
  }

  async findById(id: string): Promise<any> {
    try {
      const record = await this.prisma.medicalRecord.findUnique({
        where: { id },
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              medicalRecordNumber: true,
              dateOfBirth: true,
              gender: true,
            },
          },
        },
      });

      if (!record) {
        throw new NotFoundException(`Medical record with ID ${id} not found`);
      }

      return record;
    } catch (error) {
      this.logger.error(`Error finding medical record by ID: ${id}`, error);
      throw error;
    }
  }

  async findByRecordNumber(recordNumber: string): Promise<MedicalRecord> {
    try {
      const record = await this.prisma.medicalRecord.findFirst({
        where: { recordNumber },
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              medicalRecordNumber: true,
            },
          },
        },
      });

      if (!record) {
        throw new NotFoundException(`Medical record with number ${recordNumber} not found`);
      }

      return record;
    } catch (error) {
      this.logger.error(`Error finding medical record by number: ${recordNumber}`, error);
      throw error;
    }
  }

  async updateMedicalRecord(
    id: string,
    updateData: {
      chiefComplaint?: string;
      historyOfPresent?: string;
      pastMedical?: any;
      surgicalHistory?: any;
      familyHistory?: any;
      socialHistory?: any;
      reviewOfSystems?: any;
      physicalExam?: any;
      assessment?: string;
      plan?: string;
      notes?: string;
      isConfidential?: boolean;
    },
    providerId: string
  ): Promise<MedicalRecord> {
    try {
      await this.findById(id); // Check if record exists

      const updatedRecord = await this.prisma.medicalRecord.update({
        where: { id },
        data: {
          ...(updateData.chiefComplaint !== undefined && { chiefComplaint: updateData.chiefComplaint }),
          ...(updateData.historyOfPresent !== undefined && { historyOfPresent: updateData.historyOfPresent }),
          ...(updateData.pastMedical !== undefined && { pastMedical: updateData.pastMedical }),
          ...(updateData.surgicalHistory !== undefined && { surgicalHistory: updateData.surgicalHistory }),
          ...(updateData.familyHistory !== undefined && { familyHistory: updateData.familyHistory }),
          ...(updateData.socialHistory !== undefined && { socialHistory: updateData.socialHistory }),
          ...(updateData.reviewOfSystems !== undefined && { reviewOfSystems: updateData.reviewOfSystems }),
          ...(updateData.physicalExam !== undefined && { physicalExam: updateData.physicalExam }),
          ...(updateData.assessment !== undefined && { assessment: updateData.assessment }),
          ...(updateData.plan !== undefined && { plan: updateData.plan }),
          ...(updateData.notes !== undefined && { notes: updateData.notes }),
          ...(updateData.isConfidential !== undefined && { isConfidential: updateData.isConfidential }),
        },
      });

      this.logger.log(`Medical record updated: ${updatedRecord.recordNumber}`);
      return updatedRecord;
    } catch (error) {
      this.logger.error(`Error updating medical record with ID: ${id}`, error);
      throw error;
    }
  }

  async getMedicalRecordStatistics(centerId?: string, providerId?: string): Promise<any> {
    try {
      const where: any = {};

      if (centerId || providerId) {
        where.patient = {};
        if (centerId) {
          where.patient.centerId = centerId;
        }
      }

      if (providerId) {
        where.providerId = providerId;
      }

      const [
        totalRecords,
        recordsByType,
        recordsByMonth,
        confidentialRecords,
      ] = await Promise.all([
        this.prisma.medicalRecord.count({ where }),
        this.getRecordsByTypeStatistics(where),
        this.getRecordsByMonthStatistics(where),
        this.prisma.medicalRecord.count({
          where: {
            ...where,
            isConfidential: true,
          },
        }),
      ]);

      return {
        totalRecords,
        confidentialRecords,
        recordsByType,
        recordsByMonth,
      };
    } catch (error) {
      this.logger.error('Error getting medical record statistics', error);
      throw error;
    }
  }

  async searchMedicalRecords(query: {
    search?: string;
    patientId?: string;
    providerId?: string;
    recordType?: RecordType;
    isConfidential?: boolean;
    dateFrom?: Date;
    dateTo?: Date;
    page?: number;
    limit?: number;
  }): Promise<{ records: any[], total: number, page: number, totalPages: number }> {
    try {
      const page = query.page || 1;
      const limit = query.limit || 20;
      const skip = (page - 1) * limit;

      const where: any = {
        ...(query.patientId && { patientId: query.patientId }),
        ...(query.providerId && { providerId: query.providerId }),
        ...(query.recordType && { recordType: query.recordType }),
        ...(query.isConfidential !== undefined && { isConfidential: query.isConfidential }),
        ...(query.dateFrom || query.dateTo ? {
          createdAt: {
            ...(query.dateFrom && { gte: query.dateFrom }),
            ...(query.dateTo && { lte: query.dateTo }),
          },
        } : {}),
        ...(query.search && {
          OR: [
            { recordNumber: { contains: query.search, mode: 'insensitive' } },
            { chiefComplaint: { contains: query.search, mode: 'insensitive' } },
            { assessment: { contains: query.search, mode: 'insensitive' } },
            { plan: { contains: query.search, mode: 'insensitive' } },
            { notes: { contains: query.search, mode: 'insensitive' } },
          ],
        }),
      };

      const [records, total] = await Promise.all([
        this.prisma.medicalRecord.findMany({
          where,
          include: {
            patient: {
              select: {
                id: true,
                name: true,
                medicalRecordNumber: true,
              },
            },
          },
          orderBy: [
            { createdAt: 'desc' },
          ],
          skip,
          take: limit,
        }),
        this.prisma.medicalRecord.count({ where }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        records,
        total,
        page,
        totalPages,
      };
    } catch (error) {
      this.logger.error('Error searching medical records', error);
      throw error;
    }
  }

  private async generateRecordNumber(patientId: string, recordType: RecordType): Promise<string> {
    try {
      const patient = await this.prisma.patient.findUnique({
        where: { id: patientId },
        select: {
          medicalRecordNumber: true,
        },
      });

      if (!patient) {
        throw new NotFoundException('Patient not found');
      }

      const currentYear = new Date().getFullYear();
      const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');

      // Find the latest record number for this patient and type
      const latestRecord = await this.prisma.medicalRecord.findMany({
        where: {
          patientId,
          recordType,
          recordNumber: {
            startsWith: `${patient.medicalRecordNumber}-${recordType}-${currentYear}${currentMonth}`,
          },
        },
        orderBy: {
          recordNumber: 'desc',
        },
        take: 1,
      });

      let sequence = 1;
      if (latestRecord.length > 0) {
        const latestRecordNumber = latestRecord[0].recordNumber;
        const parts = latestRecordNumber.split('-');
        const latestSequence = parseInt(parts[parts.length - 1]);
        if (!isNaN(latestSequence)) {
          sequence = latestSequence + 1;
        }
      }

      return `${patient.medicalRecordNumber}-${recordType}-${currentYear}${currentMonth}-${sequence.toString().padStart(3, '0')}`;
    } catch (error) {
      this.logger.error('Error generating record number', error);
      throw error;
    }
  }

  private async getRecordsByTypeStatistics(where: any): Promise<any> {
    const stats = await this.prisma.medicalRecord.groupBy({
      by: ['recordType'],
      where,
      _count: {
        recordType: true,
      },
    });

    return stats.reduce((acc, stat) => {
      acc[stat.recordType] = stat._count.recordType;
      return acc;
    }, {});
  }

  private async getRecordsByMonthStatistics(where: any): Promise<any> {
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1); // January 1st of current year
    const endDate = new Date(currentYear, 11, 31); // December 31st of current year

    const records = await this.prisma.medicalRecord.findMany({
      where: {
        ...where,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        createdAt: true,
      },
    });

    const monthlyStats = Array.from({ length: 12 }, (_, i) => 0);

    records.forEach(record => {
      const month = record.createdAt.getMonth();
      monthlyStats[month]++;
    });

    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    return monthNames.map((month, index) => ({
      month,
      count: monthlyStats[index],
    }));
  }
}