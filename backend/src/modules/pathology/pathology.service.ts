import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { CreatePathologyReportDto, UpdatePathologyReportDto } from './dto';

@Injectable()
export class PathologyService {
  private readonly logger = new Logger(PathologyService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Create new pathology report
   */
  async create(createDto: CreatePathologyReportDto): Promise<any> {
    try {
      // Check if report number already exists
      const existing = await this.prisma.pathologyReport.findUnique({
        where: { reportNumber: createDto.reportNumber },
      });

      if (existing) {
        throw new ConflictException('Pathology report number already exists');
      }

      // Validate patient exists
      const patient = await this.prisma.patient.findUnique({
        where: { id: createDto.patientId },
      });

      if (!patient) {
        throw new NotFoundException('Patient not found');
      }

      const report = await this.prisma.pathologyReport.create({
        data: {
          patientId: createDto.patientId,
          reportNumber: createDto.reportNumber,
          biopsyType: createDto.biopsyType,
          biopsyDate: new Date(createDto.biopsyDate),
          specimenReceivedDate: createDto.specimenReceivedDate
            ? new Date(createDto.specimenReceivedDate)
            : undefined,
          specimenSite: createDto.specimenSite,
          specimenDescription: createDto.specimenDescription,
          grossDescription: createDto.grossDescription,
          microscopicDescription: createDto.microscopicDescription,
          diagnosis: createDto.diagnosis,
          tumorGrade: createDto.tumorGrade,
          mitosisCount: createDto.mitosisCount,
          necrosisPercentage: createDto.necrosisPercentage,
          cellularity: createDto.cellularity,
          immunohistochemistry: createDto.immunohistochemistry,
          molecularFindings: createDto.molecularFindings,
          marginsStatus: createDto.marginsStatus,
          isMalignant: createDto.isMalignant,
          status: createDto.status,
          comments: createDto.comments,
          pathologistId: createDto.pathologistId,
          reportDate: createDto.reportDate ? new Date(createDto.reportDate) : undefined,
          specialStains: createDto.specialStains || [],
          ihcMarkers: createDto.ihcMarkers || [],
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

      this.logger.log(`Pathology report created: ${report.reportNumber} for patient ${patient.name}`);
      return report;
    } catch (error) {
      this.logger.error('Error creating pathology report', error);
      throw error;
    }
  }

  /**
   * Get all pathology reports with filters
   */
  async findAll(
    patientId?: string,
    status?: string,
    isMalignant?: boolean,
    page = 1,
    limit = 50,
  ): Promise<{ reports: any[]; total: number; page: number; totalPages: number }> {
    try {
      const skip = (page - 1) * limit;

      const where: any = {
        ...(patientId && { patientId }),
        ...(status && { status }),
        ...(isMalignant !== undefined && { isMalignant }),
      };

      const [reports, total] = await Promise.all([
        this.prisma.pathologyReport.findMany({
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
          orderBy: [{ biopsyDate: 'desc' }],
          skip,
          take: limit,
        }),
        this.prisma.pathologyReport.count({ where }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return { reports, total, page, totalPages };
    } catch (error) {
      this.logger.error('Error finding pathology reports', error);
      throw error;
    }
  }

  /**
   * Get pathology report by ID
   */
  async findById(id: string): Promise<any> {
    try {
      const report = await this.prisma.pathologyReport.findUnique({
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

      if (!report) {
        throw new NotFoundException(`Pathology report with ID ${id} not found`);
      }

      return report;
    } catch (error) {
      this.logger.error(`Error finding pathology report ${id}`, error);
      throw error;
    }
  }

  /**
   * Get pathology report by report number
   */
  async findByReportNumber(reportNumber: string): Promise<any> {
    try {
      const report = await this.prisma.pathologyReport.findUnique({
        where: { reportNumber },
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

      if (!report) {
        throw new NotFoundException(`Pathology report ${reportNumber} not found`);
      }

      return report;
    } catch (error) {
      this.logger.error(`Error finding pathology report ${reportNumber}`, error);
      throw error;
    }
  }

  /**
   * Get all pathology reports for a patient
   */
  async findByPatient(patientId: string): Promise<any[]> {
    try {
      return this.prisma.pathologyReport.findMany({
        where: { patientId },
        orderBy: [{ biopsyDate: 'desc' }],
      });
    } catch (error) {
      this.logger.error(`Error finding pathology reports for patient ${patientId}`, error);
      throw error;
    }
  }

  /**
   * Update pathology report
   */
  async update(id: string, updateDto: UpdatePathologyReportDto): Promise<any> {
    try {
      const existing = await this.findById(id);

      const updated = await this.prisma.pathologyReport.update({
        where: { id },
        data: {
          ...(updateDto.grossDescription !== undefined && {
            grossDescription: updateDto.grossDescription,
          }),
          ...(updateDto.microscopicDescription !== undefined && {
            microscopicDescription: updateDto.microscopicDescription,
          }),
          ...(updateDto.diagnosis !== undefined && { diagnosis: updateDto.diagnosis }),
          ...(updateDto.tumorGrade !== undefined && { tumorGrade: updateDto.tumorGrade }),
          ...(updateDto.mitosisCount !== undefined && { mitosisCount: updateDto.mitosisCount }),
          ...(updateDto.necrosisPercentage !== undefined && {
            necrosisPercentage: updateDto.necrosisPercentage,
          }),
          ...(updateDto.cellularity !== undefined && { cellularity: updateDto.cellularity }),
          ...(updateDto.immunohistochemistry !== undefined && {
            immunohistochemistry: updateDto.immunohistochemistry,
          }),
          ...(updateDto.molecularFindings !== undefined && {
            molecularFindings: updateDto.molecularFindings,
          }),
          ...(updateDto.marginsStatus !== undefined && { marginsStatus: updateDto.marginsStatus }),
          ...(updateDto.isMalignant !== undefined && { isMalignant: updateDto.isMalignant }),
          ...(updateDto.status !== undefined && { status: updateDto.status }),
          ...(updateDto.comments !== undefined && { comments: updateDto.comments }),
          ...(updateDto.reportDate !== undefined && {
            reportDate: new Date(updateDto.reportDate),
          }),
          ...(updateDto.specialStains !== undefined && { specialStains: updateDto.specialStains }),
          ...(updateDto.ihcMarkers !== undefined && { ihcMarkers: updateDto.ihcMarkers }),
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

      this.logger.log(`Pathology report updated: ${id}`);
      return updated;
    } catch (error) {
      this.logger.error(`Error updating pathology report ${id}`, error);
      throw error;
    }
  }

  /**
   * Delete pathology report
   */
  async delete(id: string): Promise<any> {
    try {
      const existing = await this.findById(id);

      const deleted = await this.prisma.pathologyReport.delete({
        where: { id },
      });

      this.logger.log(`Pathology report deleted: ${id}`);
      return deleted;
    } catch (error) {
      this.logger.error(`Error deleting pathology report ${id}`, error);
      throw error;
    }
  }

  /**
   * Get malignant reports count
   */
  async getMalignantCount(centerId?: string): Promise<number> {
    try {
      const where: any = { isMalignant: true };
      if (centerId) {
        where.patient = { centerId };
      }

      return this.prisma.pathologyReport.count({ where });
    } catch (error) {
      this.logger.error('Error getting malignant count', error);
      throw error;
    }
  }

  /**
   * Get statistics
   */
  async getStatistics(centerId?: string): Promise<any> {
    try {
      const where: any = {};
      if (centerId) {
        where.patient = { centerId };
      }

      const [
        totalReports,
        malignantReports,
        pendingReports,
        completedReports,
        reportsByBiopsyType,
      ] = await Promise.all([
        this.prisma.pathologyReport.count({ where }),
        this.prisma.pathologyReport.count({ where: { ...where, isMalignant: true } }),
        this.prisma.pathologyReport.count({ where: { ...where, status: 'PENDING' } }),
        this.prisma.pathologyReport.count({ where: { ...where, status: 'COMPLETED' } }),
        this.getReportsByBiopsyType(where),
      ]);

      return {
        totalReports,
        malignantReports,
        benignReports: totalReports - malignantReports,
        pendingReports,
        completedReports,
        reportsByBiopsyType,
      };
    } catch (error) {
      this.logger.error('Error getting pathology statistics', error);
      throw error;
    }
  }

  /**
   * Helper: Get reports by biopsy type
   */
  private async getReportsByBiopsyType(where: any): Promise<any> {
    const stats = await this.prisma.pathologyReport.groupBy({
      by: ['biopsyType'],
      where,
      _count: {
        biopsyType: true,
      },
    });

    return stats.reduce((acc, stat) => {
      acc[stat.biopsyType] = stat._count.biopsyType;
      return acc;
    }, {} as Record<string, number>);
  }
}
