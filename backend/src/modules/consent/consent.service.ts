import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { PatientConsent, ConsentType } from '@prisma/client';

@Injectable()
export class ConsentService {
  private readonly logger = new Logger(ConsentService.name);

  constructor(private prisma: PrismaService) {}

  async createConsent(consentData: {
    patientId: string;
    consentType: ConsentType;
    description: string;
    isConsented: boolean;
    consentDate: Date;
    expiredDate?: Date;
    guardianName?: string;
    guardianRelation?: string;
    providerId: string;
    notes?: string;
  }): Promise<PatientConsent> {
    try {
      // Validate consent requirements
      await this.validateConsentRequirements(consentData);

      const consent = await this.prisma.patientConsent.create({
        data: {
          patientId: consentData.patientId,
          consentType: consentData.consentType,
          description: consentData.description,
          isConsented: consentData.isConsented,
          consentDate: consentData.consentDate,
          expiredDate: consentData.expiredDate,
          guardianName: consentData.guardianName,
          guardianRelation: consentData.guardianRelation,
          providerId: consentData.providerId,
          notes: consentData.notes,
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

      this.logger.log(`Consent created: ${consent.consentType} for patient ${consent.patient.name}`);
      return consent;
    } catch (error) {
      this.logger.error('Error creating consent', error);
      throw error;
    }
  }

  async findByPatientId(
    patientId: string,
    consentType?: ConsentType,
    includeExpired = false,
    page = 1,
    limit = 20
  ): Promise<{ consents: any[], total: number, page: number, totalPages: number }> {
    try {
      const skip = (page - 1) * limit;

      const where: any = {
        patientId,
        ...(consentType && { consentType }),
        ...(includeExpired === false && {
          OR: [
            { expiredDate: null },
            { expiredDate: { gt: new Date() } },
          ],
        }),
      };

      const [consents, total] = await Promise.all([
        this.prisma.patientConsent.findMany({
          where,
          include: {
            patient: {
              select: {
                id: true,
                name: true,
                dateOfBirth: true,
              },
            },
          },
          orderBy: [
            { consentDate: 'desc' },
          ],
          skip,
          take: limit,
        }),
        this.prisma.patientConsent.count({ where }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        consents: consents.map(consent => ({
          ...consent,
          isActive: this.isConsentActive(consent),
        })),
        total,
        page,
        totalPages,
      };
    } catch (error) {
      this.logger.error(`Error finding consents for patient: ${patientId}`, error);
      throw error;
    }
  }

  async findById(id: string): Promise<any> {
    try {
      const consent = await this.prisma.patientConsent.findUnique({
        where: { id },
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              medicalRecordNumber: true,
              dateOfBirth: true,
            },
          },
        },
      });

      if (!consent) {
        throw new NotFoundException(`Consent with ID ${id} not found`);
      }

      return {
        ...consent,
        isActive: this.isConsentActive(consent),
        patientAge: this.calculateAge(consent.patient.dateOfBirth),
        requiresGuardian: this.requiresGuardian(consent.patient.dateOfBirth),
      };
    } catch (error) {
      this.logger.error(`Error finding consent by ID: ${id}`, error);
      throw error;
    }
  }

  async updateConsent(
    id: string,
    updateData: {
      description?: string;
      isConsented?: boolean;
      consentDate?: Date;
      expiredDate?: Date;
      guardianName?: string;
      guardianRelation?: string;
      notes?: string;
    },
    providerId: string
  ): Promise<PatientConsent> {
    try {
      await this.findById(id); // Check if consent exists

      const updatedConsent = await this.prisma.patientConsent.update({
        where: { id },
        data: {
          ...(updateData.description !== undefined && { description: updateData.description }),
          ...(updateData.isConsented !== undefined && { isConsented: updateData.isConsented }),
          ...(updateData.consentDate && { consentDate: updateData.consentDate }),
          ...(updateData.expiredDate !== undefined && { expiredDate: updateData.expiredDate }),
          ...(updateData.guardianName !== undefined && { guardianName: updateData.guardianName }),
          ...(updateData.guardianRelation !== undefined && { guardianRelation: updateData.guardianRelation }),
          ...(updateData.notes !== undefined && { notes: updateData.notes }),
        },
      });

      this.logger.log(`Consent updated: ${updatedConsent.consentType} (ID: ${id})`);
      return updatedConsent;
    } catch (error) {
      this.logger.error(`Error updating consent with ID: ${id}`, error);
      throw error;
    }
  }

  async revokeConsent(id: string, reason: string, providerId: string): Promise<PatientConsent> {
    try {
      const consent = await this.findById(id);

      if (!consent.isConsented) {
        throw new BadRequestException('Consent is already not consented');
      }

      const revokedConsent = await this.prisma.patientConsent.update({
        where: { id },
        data: {
          isConsented: false,
          expiredDate: new Date(),
          notes: `REVOKED: ${reason}. ${consent.notes || ''}`,
        },
      });

      this.logger.log(`Consent revoked: ${revokedConsent.consentType} (ID: ${id}) - Reason: ${reason}`);
      return revokedConsent;
    } catch (error) {
      this.logger.error(`Error revoking consent with ID: ${id}`, error);
      throw error;
    }
  }

  async checkConsent(
    patientId: string,
    consentType: ConsentType,
    requireActive = true
  ): Promise<{ hasConsent: boolean; consent?: any }> {
    try {
      const where: any = {
        patientId,
        consentType,
        isConsented: true,
      };

      if (requireActive) {
        where.OR = [
          { expiredDate: null },
          { expiredDate: { gt: new Date() } },
        ];
      }

      const consent = await this.prisma.patientConsent.findFirst({
        where,
        orderBy: [
          { consentDate: 'desc' },
        ],
      });

      return {
        hasConsent: !!consent,
        consent: consent ? {
          ...consent,
          isActive: this.isConsentActive(consent),
        } : undefined,
      };
    } catch (error) {
      this.logger.error(`Error checking consent for patient: ${patientId}`, error);
      throw error;
    }
  }

  async getConsentStatistics(centerId?: string): Promise<any> {
    try {
      const where: any = {};

      if (centerId) {
        where.patient = {
          centerId,
        };
      }

      const [
        totalConsents,
        activeConsents,
        expiredConsents,
        consentsByType,
        consentsByMonth,
        guardianRequiredConsents,
      ] = await Promise.all([
        this.prisma.patientConsent.count({ where }),
        this.getActiveConsentsCount(where),
        this.getExpiredConsentsCount(where),
        this.getConsentsByTypeStatistics(where),
        this.getConsentsByMonthStatistics(where),
        this.getGuardianRequiredConsentsCount(where),
      ]);

      return {
        totalConsents,
        activeConsents,
        expiredConsents,
        guardianRequiredConsents,
        consentsByType,
        consentsByMonth,
      };
    } catch (error) {
      this.logger.error('Error getting consent statistics', error);
      throw error;
    }
  }

  async getExpiringConsents(days = 30, centerId?: string): Promise<any[]> {
    try {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + days);

      const where: any = {
        isConsented: true,
        OR: [
          { expiredDate: { lte: targetDate, gte: new Date() } },
          { expiredDate: null }, // Include consents without expiry that might need review
        ],
      };

      if (centerId) {
        where.patient = {
          centerId,
        };
      }

      const consents = await this.prisma.patientConsent.findMany({
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
          { expiredDate: 'asc' },
        ],
      });

      return consents.map(consent => ({
        ...consent,
        daysUntilExpiry: consent.expiredDate
          ? Math.ceil((consent.expiredDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
          : null,
        isActive: this.isConsentActive(consent),
      }));
    } catch (error) {
      this.logger.error('Error getting expiring consents', error);
      throw error;
    }
  }

  private async validateConsentRequirements(consentData: any): Promise<void> {
    const patient = await this.prisma.patient.findUnique({
      where: { id: consentData.patientId },
      select: { dateOfBirth: true },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const needsGuardian = this.requiresGuardian(patient.dateOfBirth);

    if (needsGuardian && (!consentData.guardianName || !consentData.guardianRelation)) {
      throw new BadRequestException('Guardian information is required for minor patients');
    }

    if (!needsGuardian && (consentData.guardianName || consentData.guardianRelation)) {
      throw new BadRequestException('Guardian information should not be provided for adult patients');
    }
  }

  private isConsentActive(consent: Pick<PatientConsent, 'isConsented' | 'expiredDate'>): boolean {
    if (!consent.isConsented) {
      return false;
    }

    if (!consent.expiredDate) {
      return true; // No expiry date = perpetual consent
    }

    return consent.expiredDate > new Date();
  }

  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
      age--;
    }

    return age;
  }

  private requiresGuardian(dateOfBirth: Date): boolean {
    const age = this.calculateAge(dateOfBirth);
    return age < 18; // Under 18 requires guardian consent
  }

  private async getActiveConsentsCount(where: any): Promise<number> {
    const consents = await this.prisma.patientConsent.findMany({
      where,
      select: {
        isConsented: true,
        expiredDate: true,
      },
    });

    return consents.filter(consent => this.isConsentActive(consent)).length;
  }

  private async getExpiredConsentsCount(where: any): Promise<number> {
    const consents = await this.prisma.patientConsent.findMany({
      where,
      select: {
        isConsented: true,
        expiredDate: true,
      },
    });

    return consents.filter(consent =>
      consent.isConsented &&
      consent.expiredDate &&
      consent.expiredDate <= new Date()
    ).length;
  }

  private async getConsentsByTypeStatistics(where: any): Promise<any> {
    const stats = await this.prisma.patientConsent.groupBy({
      by: ['consentType'],
      where,
      _count: {
        consentType: true,
      },
    });

    return stats.reduce((acc, stat) => {
      acc[stat.consentType] = stat._count.consentType;
      return acc;
    }, {});
  }

  private async getConsentsByMonthStatistics(where: any): Promise<any> {
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear, 11, 31);

    const consents = await this.prisma.patientConsent.findMany({
      where: {
        ...where,
        consentDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        consentDate: true,
      },
    });

    const monthlyStats = Array.from({ length: 12 }, (_, i) => 0);

    consents.forEach(consent => {
      const month = consent.consentDate.getMonth();
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

  private async getGuardianRequiredConsentsCount(where: any): Promise<number> {
    const consentsWithPatients = await this.prisma.patientConsent.findMany({
      where,
      include: {
        patient: {
          select: {
            dateOfBirth: true,
          },
        },
      },
    });

    return consentsWithPatients.filter(consent =>
      this.requiresGuardian(consent.patient.dateOfBirth)
    ).length;
  }
}