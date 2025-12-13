import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { CreateLabResultDto, UpdateLabResultDto, LabTestType, LabResultStatus } from './dto';

@Injectable()
export class LaboratoryService {
  private readonly logger = new Logger(LaboratoryService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Create new laboratory result
   */
  async create(createDto: CreateLabResultDto): Promise<any> {
    try {
      // Validate patient exists
      const patient = await this.prisma.patient.findUnique({
        where: { id: createDto.patientId },
      });

      if (!patient) {
        throw new NotFoundException('Patient not found');
      }

      const labResult = await this.prisma.laboratoryResult.create({
        data: {
          patientId: createDto.patientId,
          testType: createDto.testType,
          testName: createDto.testName,
          result: createDto.result,
          normalRange: createDto.normalRange,
          unit: createDto.unit,
          status: createDto.status,
          notes: createDto.notes,
          orderedBy: createDto.orderedBy,
          performedAt: createDto.performedAt ? new Date(createDto.performedAt) : undefined,
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

      this.logger.log(`Lab result created: ${labResult.testName} for patient ${patient.name}`);
      return labResult;
    } catch (error) {
      this.logger.error('Error creating lab result', error);
      throw error;
    }
  }

  /**
   * Get all lab results with filters and pagination
   */
  async findAll(
    patientId?: string,
    testType?: string,
    status?: string,
    page = 1,
    limit = 50,
  ): Promise<{ results: any[]; total: number; page: number; totalPages: number }> {
    try {
      const skip = (page - 1) * limit;

      const where: any = {
        ...(patientId && { patientId }),
        ...(testType && { testType }),
        ...(status && { status }),
      };

      const [results, total] = await Promise.all([
        this.prisma.laboratoryResult.findMany({
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
          orderBy: [{ performedAt: 'desc' }, { createdAt: 'desc' }],
          skip,
          take: limit,
        }),
        this.prisma.laboratoryResult.count({ where }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        results: results.map(result => ({
          ...result,
          isAbnormal: this.checkIfAbnormal(result.result, result.normalRange),
        })),
        total,
        page,
        totalPages,
      };
    } catch (error) {
      this.logger.error('Error finding lab results', error);
      throw error;
    }
  }

  /**
   * Get lab result by ID
   */
  async findById(id: string): Promise<any> {
    try {
      const result = await this.prisma.laboratoryResult.findUnique({
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

      if (!result) {
        throw new NotFoundException(`Lab result with ID ${id} not found`);
      }

      return {
        ...result,
        isAbnormal: this.checkIfAbnormal(result.result, result.normalRange),
        patientAge: this.calculateAge(result.patient.dateOfBirth),
      };
    } catch (error) {
      this.logger.error(`Error finding lab result ${id}`, error);
      throw error;
    }
  }

  /**
   * Get all lab results for a patient
   */
  async findByPatient(patientId: string, testType?: string): Promise<any[]> {
    try {
      const where: any = {
        patientId,
        ...(testType && { testType }),
      };

      const results = await this.prisma.laboratoryResult.findMany({
        where,
        orderBy: [{ performedAt: 'desc' }, { createdAt: 'desc' }],
      });

      return results.map(result => ({
        ...result,
        isAbnormal: this.checkIfAbnormal(result.result, result.normalRange),
      }));
    } catch (error) {
      this.logger.error(`Error finding lab results for patient ${patientId}`, error);
      throw error;
    }
  }

  /**
   * Get tumor markers for a patient (specific to musculoskeletal tumors)
   */
  async getTumorMarkers(patientId: string): Promise<any> {
    try {
      const tumorMarkers = await this.prisma.laboratoryResult.findMany({
        where: {
          patientId,
          testType: 'TUMOR_MARKER',
        },
        orderBy: { performedAt: 'desc' },
      });

      // Group by test name to show trends
      const markerTrends: Record<string, any[]> = {};
      tumorMarkers.forEach(marker => {
        if (!markerTrends[marker.testName]) {
          markerTrends[marker.testName] = [];
        }
        markerTrends[marker.testName].push({
          date: marker.performedAt,
          value: marker.result,
          unit: marker.unit,
          status: marker.status,
          isAbnormal: this.checkIfAbnormal(marker.result, marker.normalRange),
        });
      });

      return {
        markers: tumorMarkers,
        trends: markerTrends,
      };
    } catch (error) {
      this.logger.error(`Error getting tumor markers for patient ${patientId}`, error);
      throw error;
    }
  }

  /**
   * Update lab result
   */
  async update(id: string, updateDto: UpdateLabResultDto): Promise<any> {
    try {
      const existing = await this.findById(id);

      const updated = await this.prisma.laboratoryResult.update({
        where: { id },
        data: {
          ...(updateDto.result !== undefined && { result: updateDto.result }),
          ...(updateDto.normalRange !== undefined && { normalRange: updateDto.normalRange }),
          ...(updateDto.unit !== undefined && { unit: updateDto.unit }),
          ...(updateDto.status !== undefined && { status: updateDto.status }),
          ...(updateDto.notes !== undefined && { notes: updateDto.notes }),
          ...(updateDto.performedAt !== undefined && {
            performedAt: new Date(updateDto.performedAt),
          }),
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

      this.logger.log(`Lab result updated: ${id}`);
      return updated;
    } catch (error) {
      this.logger.error(`Error updating lab result ${id}`, error);
      throw error;
    }
  }

  /**
   * Delete lab result
   */
  async delete(id: string): Promise<any> {
    try {
      const existing = await this.findById(id);

      const deleted = await this.prisma.laboratoryResult.delete({
        where: { id },
      });

      this.logger.log(`Lab result deleted: ${id}`);
      return deleted;
    } catch (error) {
      this.logger.error(`Error deleting lab result ${id}`, error);
      throw error;
    }
  }

  /**
   * Get abnormal results for a patient
   */
  async getAbnormalResults(patientId: string): Promise<any[]> {
    try {
      const results = await this.prisma.laboratoryResult.findMany({
        where: {
          patientId,
          status: { in: ['ABNORMAL', 'CRITICAL'] },
        },
        orderBy: { performedAt: 'desc' },
      });

      return results.map(result => ({
        ...result,
        isAbnormal: true,
      }));
    } catch (error) {
      this.logger.error(`Error getting abnormal results for patient ${patientId}`, error);
      throw error;
    }
  }

  /**
   * Get lab statistics
   */
  async getStatistics(centerId?: string): Promise<any> {
    try {
      const where: any = {};
      if (centerId) {
        where.patient = { centerId };
      }

      const [
        totalTests,
        pendingTests,
        abnormalTests,
        criticalTests,
        testsByType,
      ] = await Promise.all([
        this.prisma.laboratoryResult.count({ where }),
        this.prisma.laboratoryResult.count({ where: { ...where, status: 'PENDING' } }),
        this.prisma.laboratoryResult.count({ where: { ...where, status: 'ABNORMAL' } }),
        this.prisma.laboratoryResult.count({ where: { ...where, status: 'CRITICAL' } }),
        this.getTestsByType(where),
      ]);

      return {
        totalTests,
        pendingTests,
        abnormalTests,
        criticalTests,
        testsByType,
      };
    } catch (error) {
      this.logger.error('Error getting lab statistics', error);
      throw error;
    }
  }

  /**
   * Helper: Check if result is abnormal
   */
  private checkIfAbnormal(result: string, normalRange?: string): boolean {
    if (!normalRange) return false;

    try {
      // Parse numeric result
      const numericResult = parseFloat(result);
      if (isNaN(numericResult)) return false;

      // Parse normal range (e.g., "30-120" or "<50" or ">100")
      if (normalRange.includes('-')) {
        const [min, max] = normalRange.split('-').map(v => parseFloat(v.trim()));
        return numericResult < min || numericResult > max;
      } else if (normalRange.startsWith('<')) {
        const max = parseFloat(normalRange.substring(1).trim());
        return numericResult >= max;
      } else if (normalRange.startsWith('>')) {
        const min = parseFloat(normalRange.substring(1).trim());
        return numericResult <= min;
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Helper: Calculate patient age
   */
  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
      age--;
    }

    return age;
  }

  /**
   * Helper: Get tests by type
   */
  private async getTestsByType(where: any): Promise<any> {
    const stats = await this.prisma.laboratoryResult.groupBy({
      by: ['testType'],
      where,
      _count: {
        testType: true,
      },
    });

    return stats.reduce((acc, stat) => {
      acc[stat.testType] = stat._count.testType;
      return acc;
    }, {} as Record<string, number>);
  }
}
