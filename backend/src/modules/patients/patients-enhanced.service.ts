import { Injectable, Logger, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/common/database/prisma.service';
import { CreatePatientDto, UpdatePatientDto } from './dto';

@Injectable()
export class PatientsEnhancedService {
  private readonly logger = new Logger(PatientsEnhancedService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Create a new patient with musculoskeletal tumor data
   */
  async create(createDto: CreatePatientDto) {
    try {
      // Validate center exists
      const center = await this.prisma.center.findUnique({
        where: { id: createDto.centerId },
      });
      if (!center) {
        throw new NotFoundException('Center not found');
      }

      // Validate NIK uniqueness
      const existingNik = await this.prisma.patient.findUnique({
        where: { nik: createDto.nik },
      });
      if (existingNik) {
        throw new ConflictException('Patient with this NIK already exists');
      }

      // Validate MRN uniqueness
      const existingMrn = await this.prisma.patient.findUnique({
        where: { medicalRecordNumber: createDto.medicalRecordNumber },
      });
      if (existingMrn) {
        throw new ConflictException('Patient with this Medical Record Number already exists');
      }

      // Validate pathology type-specific fields
      if (createDto.pathologyType === 'bone_tumor') {
        if (createDto.whoBoneTumorId) {
          const boneTumor = await this.prisma.whoBoneTumorClassification.findUnique({
            where: { id: createDto.whoBoneTumorId },
          });
          if (!boneTumor) {
            throw new BadRequestException('Invalid WHO Bone Tumor Classification ID');
          }
        }
        if (createDto.boneLocationId) {
          const boneLocation = await this.prisma.boneLocation.findUnique({
            where: { id: createDto.boneLocationId },
          });
          if (!boneLocation) {
            throw new BadRequestException('Invalid Bone Location ID');
          }
        }
      } else if (createDto.pathologyType === 'soft_tissue_tumor') {
        if (createDto.whoSoftTissueTumorId) {
          const softTissueTumor = await this.prisma.whoSoftTissueTumorClassification.findUnique({
            where: { id: createDto.whoSoftTissueTumorId },
          });
          if (!softTissueTumor) {
            throw new BadRequestException('Invalid WHO Soft Tissue Tumor Classification ID');
          }
        }
        if (createDto.softTissueLocationId) {
          const softTissueLocation = await this.prisma.softTissueLocation.findUnique({
            where: { id: createDto.softTissueLocationId },
          });
          if (!softTissueLocation) {
            throw new BadRequestException('Invalid Soft Tissue Location ID');
          }
        }
      }

      // Validate tumor syndrome if provided
      if (createDto.tumorSyndromeId) {
        const syndrome = await this.prisma.tumorSyndrome.findUnique({
          where: { id: createDto.tumorSyndromeId },
        });
        if (!syndrome) {
          throw new BadRequestException('Invalid Tumor Syndrome ID');
        }
      }

      // Create patient
      const { dateOfBirth, onsetDate, biopsyDate, ...rest } = createDto;
      const patient = await this.prisma.patient.create({
        data: {
          ...rest,
          dateOfBirth: new Date(dateOfBirth),
          onsetDate: onsetDate ? new Date(onsetDate) : undefined,
          biopsyDate: biopsyDate ? new Date(biopsyDate) : undefined,
          isActive: rest.isActive !== undefined ? rest.isActive : true,
        } as any,
        include: {
          Center: true,
          whoBoneTumor: true,
          whoSoftTissueTumor: true,
          boneLocation: true,
          softTissueLocation: true,
          tumorSyndrome: true,
        },
      });

      this.logger.log(`Patient created: ${patient.id} - ${patient.name}`);
      return patient;
    } catch (error) {
      this.logger.error('Error creating patient', error);
      throw error;
    }
  }

  /**
   * Find all patients with pagination and filtering
   */
  async findAll(
    centerId?: string,
    pathologyType?: string,
    includeInactive = false,
    page = 1,
    limit = 50,
    search?: string,
  ) {
    try {
      const skip = (page - 1) * limit;

      const where: any = {
        ...(centerId && { centerId }),
        ...(pathologyType && { pathologyType }),
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
            Center: {
              select: {
                id: true,
                name: true,
                code: true,
                regency: true,
                province: true,
              },
            },
            whoBoneTumor: {
              select: {
                id: true,
                diagnosis: true,
                category: true,
                subcategory: true,
                isMalignant: true,
              },
            },
            whoSoftTissueTumor: {
              select: {
                id: true,
                diagnosis: true,
                category: true,
                subcategory: true,
                isMalignant: true,
              },
            },
            boneLocation: {
              select: {
                id: true,
                code: true,
                level: true,
                region: true,
                boneName: true,
                segment: true,
              },
            },
            softTissueLocation: {
              select: {
                id: true,
                code: true,
                anatomicalRegion: true,
                specificLocation: true,
              },
            },
            tumorSyndrome: true,
            _count: {
              select: {
                mstsScores: true,
                followUpVisits: true,
                treatments: true,
                cpcConferences: true,
              },
            },
          },
          orderBy: [{ createdAt: 'desc' }],
          skip,
          take: limit,
        }),
        this.prisma.patient.count({ where }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        patients: patients.map((patient) => ({
          ...patient,
          mstsScoreCount: (patient as any)._count?.mstsScores || 0,
          followUpVisitCount: (patient as any)._count?.followUpVisits || 0,
          treatmentCount: (patient as any)._count?.treatments || 0,
          cpcConferenceCount: (patient as any)._count?.cpcConferences || 0,
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

  /**
   * Find patient by ID with comprehensive musculoskeletal data
   */
  async findById(id: string, includeFullHistory = false) {
    try {
      const patient = await this.prisma.patient.findUnique({
        where: { id },
        include: {
          Center: true,
          whoBoneTumor: true,
          whoSoftTissueTumor: true,
          boneLocation: {
            include: {
              parent: true,
              children: true,
            },
          },
          softTissueLocation: true,
          tumorSyndrome: true,
          ...(includeFullHistory && {
            mstsScores: {
              orderBy: { assessmentDate: 'desc' },
            },
            followUpVisits: {
              orderBy: { scheduledDate: 'desc' },
            },
            treatments: {
              orderBy: { createdAt: 'desc' },
            },
            cpcConferences: {
              orderBy: { conferenceDate: 'desc' },
            },
          }),
          _count: {
            select: {
              mstsScores: true,
              followUpVisits: true,
              treatments: true,
              cpcConferences: true,
            },
          },
        },
      });

      if (!patient) {
        throw new NotFoundException('Patient not found');
      }

      return patient;
    } catch (error) {
      this.logger.error(`Error finding patient ${id}`, error);
      throw error;
    }
  }

  /**
   * Find patient by NIK
   */
  async findByNIK(nik: string) {
    try {
      const patient = await this.prisma.patient.findUnique({
        where: { nik },
        include: {
          Center: true,
          whoBoneTumor: true,
          whoSoftTissueTumor: true,
          boneLocation: true,
          softTissueLocation: true,
          tumorSyndrome: true,
        },
      });

      if (!patient) {
        throw new NotFoundException('Patient not found');
      }

      return patient;
    } catch (error) {
      this.logger.error(`Error finding patient by NIK ${nik}`, error);
      throw error;
    }
  }

  /**
   * Find patient by Medical Record Number
   */
  async findByMRN(mrn: string) {
    try {
      const patient = await this.prisma.patient.findUnique({
        where: { medicalRecordNumber: mrn },
        include: {
          Center: true,
          whoBoneTumor: true,
          whoSoftTissueTumor: true,
          boneLocation: true,
          softTissueLocation: true,
          tumorSyndrome: true,
        },
      });

      if (!patient) {
        throw new NotFoundException('Patient not found');
      }

      return patient;
    } catch (error) {
      this.logger.error(`Error finding patient by MRN ${mrn}`, error);
      throw error;
    }
  }

  /**
   * Update patient
   */
  async update(id: string, updateDto: UpdatePatientDto) {
    try {
      // Ensure patient exists
      await this.findById(id);

      // Validate pathology type-specific fields if updating
      if (updateDto.pathologyType === 'bone_tumor') {
        if (updateDto.whoBoneTumorId) {
          const boneTumor = await this.prisma.whoBoneTumorClassification.findUnique({
            where: { id: updateDto.whoBoneTumorId },
          });
          if (!boneTumor) {
            throw new BadRequestException('Invalid WHO Bone Tumor Classification ID');
          }
        }
        if (updateDto.boneLocationId) {
          const boneLocation = await this.prisma.boneLocation.findUnique({
            where: { id: updateDto.boneLocationId },
          });
          if (!boneLocation) {
            throw new BadRequestException('Invalid Bone Location ID');
          }
        }
      } else if (updateDto.pathologyType === 'soft_tissue_tumor') {
        if (updateDto.whoSoftTissueTumorId) {
          const softTissueTumor = await this.prisma.whoSoftTissueTumorClassification.findUnique({
            where: { id: updateDto.whoSoftTissueTumorId },
          });
          if (!softTissueTumor) {
            throw new BadRequestException('Invalid WHO Soft Tissue Tumor Classification ID');
          }
        }
        if (updateDto.softTissueLocationId) {
          const softTissueLocation = await this.prisma.softTissueLocation.findUnique({
            where: { id: updateDto.softTissueLocationId },
          });
          if (!softTissueLocation) {
            throw new BadRequestException('Invalid Soft Tissue Location ID');
          }
        }
      }

      const { dateOfBirth, onsetDate, biopsyDate, dateOfDeath, ...updateRest } = updateDto;
      const patient = await this.prisma.patient.update({
        where: { id },
        data: {
          ...updateRest,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
          onsetDate: onsetDate ? new Date(onsetDate) : undefined,
          biopsyDate: biopsyDate ? new Date(biopsyDate) : undefined,
          dateOfDeath: dateOfDeath ? new Date(dateOfDeath) : undefined,
        } as any,
        include: {
          Center: true,
          whoBoneTumor: true,
          whoSoftTissueTumor: true,
          boneLocation: true,
          softTissueLocation: true,
          tumorSyndrome: true,
        },
      });

      this.logger.log(`Patient updated: ${patient.id} - ${patient.name}`);
      return patient;
    } catch (error) {
      this.logger.error(`Error updating patient ${id}`, error);
      throw error;
    }
  }

  /**
   * Soft delete patient (set isActive = false)
   */
  async remove(id: string) {
    try {
      const patient = await this.prisma.patient.update({
        where: { id },
        data: { isActive: false },
      });

      this.logger.log(`Patient soft deleted: ${patient.id} - ${patient.name}`);
      return patient;
    } catch (error) {
      this.logger.error(`Error removing patient ${id}`, error);
      throw error;
    }
  }

  /**
   * Get comprehensive patient summary with all musculoskeletal data
   */
  async getPatientSummary(id: string) {
    try {
      const patient = await this.findById(id, true);

      const summary = {
        patient: {
          id: patient.id,
          mrn: patient.medicalRecordNumber,
          nik: patient.nik,
          name: patient.name,
          age: this.calculateAge(patient.dateOfBirth),
          gender: patient.gender,
          center: patient.Center.name,
        },
        diagnosis: {
          pathologyType: patient.pathologyType,
          whoBoneTumor: patient.whoBoneTumor,
          whoSoftTissueTumor: patient.whoSoftTissueTumor,
          boneLocation: patient.boneLocation,
          softTissueLocation: patient.softTissueLocation,
          histopathologyGrade: patient.histopathologyGrade,
          ennekingStage: patient.ennekingStage,
          ajccStage: patient.ajccStage,
          metastasisPresent: patient.metastasisPresent,
        },
        clinical: {
          chiefComplaint: patient.chiefComplaint,
          symptomDuration: patient.symptomDuration,
          tumorSize: patient.tumorSizeAtPresentation,
          karnofskysScore: patient.karnofskysScore,
          biopsyResult: patient.biopsyResult,
        },
        mstsScores: {
          total: patient._count.mstsScores,
          latest: patient.mstsScores?.[0],
          average: this.calculateAverageMstsScore(patient.mstsScores),
        },
        followUps: {
          total: patient._count.followUpVisits,
          completed: patient.followUpVisits?.filter((v) => v.status === 'Completed').length || 0,
          scheduled: patient.followUpVisits?.filter((v) => v.status === 'Scheduled').length || 0,
          missed: patient.followUpVisits?.filter((v) => v.status === 'Missed').length || 0,
          recurrenceDetected: patient.followUpVisits?.some((v) => v.localRecurrence || v.distantMetastasis) || false,
        },
        treatments: {
          total: patient._count.treatments,
          byType: this.groupTreatmentsByType(patient.treatments),
          activeTreatments: patient.treatments?.filter((t) => t.status === 'Ongoing').length || 0,
        },
        cpcConferences: {
          total: patient._count.cpcConferences,
          latest: patient.cpcConferences?.[0],
        },
      };

      return summary;
    } catch (error) {
      this.logger.error(`Error getting patient summary ${id}`, error);
      throw error;
    }
  }

  /**
   * Get patient statistics for a center or system-wide
   */
  async getPatientStatistics(centerId?: string) {
    try {
      const where: any = {
        isActive: true,
        ...(centerId && { centerId }),
      };

      const [
        total,
        byPathologyType,
        byGender,
        deceased,
        withMetastasis,
        avgAge,
      ] = await Promise.all([
        this.prisma.patient.count({ where }),
        this.prisma.patient.groupBy({
          by: ['pathologyType'],
          where,
          _count: true,
        }),
        this.prisma.patient.groupBy({
          by: ['gender'],
          where,
          _count: true,
        }),
        this.prisma.patient.count({ where: { ...where, isDeceased: true } }),
        this.prisma.patient.count({ where: { ...where, metastasisPresent: true } }),
        this.prisma.patient.aggregate({
          where,
          _avg: {
            karnofskysScore: true,
          },
        }),
      ]);

      return {
        total,
        byPathologyType: byPathologyType.reduce((acc, item) => {
          acc[item.pathologyType || 'unknown'] = item._count;
          return acc;
        }, {}),
        byGender: byGender.reduce((acc, item) => {
          acc[item.gender] = item._count;
          return acc;
        }, {}),
        deceased,
        withMetastasis,
        avgKarnofskysScore: avgAge._avg.karnofskysScore || 0,
      };
    } catch (error) {
      this.logger.error('Error getting patient statistics', error);
      throw error;
    }
  }

  /**
   * Search patients with advanced filters
   */
  async searchPatients(filters: any) {
    try {
      const {
        search,
        centerId,
        pathologyType,
        gender,
        ennekingStage,
        ajccStage,
        isDeceased,
        metastasisPresent,
        page = 1,
        limit = 50,
      } = filters;

      const skip = (page - 1) * limit;

      const where: any = {
        ...(centerId && { centerId }),
        ...(pathologyType && { pathologyType }),
        ...(gender && { gender }),
        ...(ennekingStage && { ennekingStage }),
        ...(ajccStage && { ajccStage }),
        ...(isDeceased !== undefined && { isDeceased }),
        ...(metastasisPresent !== undefined && { metastasisPresent }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { nik: { contains: search, mode: 'insensitive' } },
            { medicalRecordNumber: { contains: search, mode: 'insensitive' } },
          ],
        }),
      };

      const [patients, total] = await Promise.all([
        this.prisma.patient.findMany({
          where,
          include: {
            Center: true,
            whoBoneTumor: true,
            whoSoftTissueTumor: true,
            boneLocation: true,
            softTissueLocation: true,
          },
          orderBy: [{ createdAt: 'desc' }],
          skip,
          take: limit,
        }),
        this.prisma.patient.count({ where }),
      ]);

      return {
        patients,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error('Error searching patients', error);
      throw error;
    }
  }

  // Helper methods

  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  private calculateAverageMstsScore(scores: any[] | undefined): number {
    if (!scores || scores.length === 0) return 0;
    const sum = scores.reduce((acc, score) => acc + score.totalScore, 0);
    return Math.round((sum / scores.length) * 10) / 10;
  }

  private groupTreatmentsByType(treatments: any[] | undefined) {
    if (!treatments) return {};
    return treatments.reduce((acc, treatment) => {
      const type = treatment.treatmentType;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
  }
}
