"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ConsentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let ConsentService = ConsentService_1 = class ConsentService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(ConsentService_1.name);
    }
    async createConsent(consentData) {
        try {
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
        }
        catch (error) {
            this.logger.error('Error creating consent', error);
            throw error;
        }
    }
    async findByPatientId(patientId, consentType, includeExpired = false, page = 1, limit = 20) {
        try {
            const skip = (page - 1) * limit;
            const where = {
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
                        provider: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
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
        }
        catch (error) {
            this.logger.error(`Error finding consents for patient: ${patientId}`, error);
            throw error;
        }
    }
    async findById(id) {
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
                    provider: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            });
            if (!consent) {
                throw new common_1.NotFoundException(`Consent with ID ${id} not found`);
            }
            return {
                ...consent,
                isActive: this.isConsentActive(consent),
                patientAge: this.calculateAge(consent.patient.dateOfBirth),
                requiresGuardian: this.requiresGuardian(consent.patient.dateOfBirth),
            };
        }
        catch (error) {
            this.logger.error(`Error finding consent by ID: ${id}`, error);
            throw error;
        }
    }
    async updateConsent(id, updateData, providerId) {
        try {
            await this.findById(id);
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
        }
        catch (error) {
            this.logger.error(`Error updating consent with ID: ${id}`, error);
            throw error;
        }
    }
    async revokeConsent(id, reason, providerId) {
        try {
            const consent = await this.findById(id);
            if (!consent.isConsented) {
                throw new common_1.BadRequestException('Consent is already not consented');
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
        }
        catch (error) {
            this.logger.error(`Error revoking consent with ID: ${id}`, error);
            throw error;
        }
    }
    async checkConsent(patientId, consentType, requireActive = true) {
        try {
            const where = {
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
        }
        catch (error) {
            this.logger.error(`Error checking consent for patient: ${patientId}`, error);
            throw error;
        }
    }
    async getConsentStatistics(centerId) {
        try {
            const where = {};
            if (centerId) {
                where.patient = {
                    centerId,
                };
            }
            const [totalConsents, activeConsents, expiredConsents, consentsByType, consentsByMonth, guardianRequiredConsents,] = await Promise.all([
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
        }
        catch (error) {
            this.logger.error('Error getting consent statistics', error);
            throw error;
        }
    }
    async getExpiringConsents(days = 30, centerId) {
        try {
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() + days);
            const where = {
                isConsented: true,
                OR: [
                    { expiredDate: { lte: targetDate, gte: new Date() } },
                    { expiredDate: null },
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
                    provider: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
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
        }
        catch (error) {
            this.logger.error('Error getting expiring consents', error);
            throw error;
        }
    }
    async validateConsentRequirements(consentData) {
        const patient = await this.prisma.patient.findUnique({
            where: { id: consentData.patientId },
            select: { dateOfBirth: true },
        });
        if (!patient) {
            throw new common_1.NotFoundException('Patient not found');
        }
        const needsGuardian = this.requiresGuardian(patient.dateOfBirth);
        if (needsGuardian && (!consentData.guardianName || !consentData.guardianRelation)) {
            throw new common_1.BadRequestException('Guardian information is required for minor patients');
        }
        if (!needsGuardian && (consentData.guardianName || consentData.guardianRelation)) {
            throw new common_1.BadRequestException('Guardian information should not be provided for adult patients');
        }
    }
    isConsentActive(consent) {
        if (!consent.isConsented) {
            return false;
        }
        if (!consent.expiredDate) {
            return true;
        }
        return consent.expiredDate > new Date();
    }
    calculateAge(dateOfBirth) {
        const today = new Date();
        let age = today.getFullYear() - dateOfBirth.getFullYear();
        const monthDiff = today.getMonth() - dateOfBirth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
            age--;
        }
        return age;
    }
    requiresGuardian(dateOfBirth) {
        const age = this.calculateAge(dateOfBirth);
        return age < 18;
    }
    async getActiveConsentsCount(where) {
        const consents = await this.prisma.patientConsent.findMany({
            where,
            select: {
                isConsented: true,
                expiredDate: true,
            },
        });
        return consents.filter(consent => this.isConsentActive(consent)).length;
    }
    async getExpiredConsentsCount(where) {
        const consents = await this.prisma.patientConsent.findMany({
            where,
            select: {
                isConsented: true,
                expiredDate: true,
            },
        });
        return consents.filter(consent => consent.isConsented &&
            consent.expiredDate &&
            consent.expiredDate <= new Date()).length;
    }
    async getConsentsByTypeStatistics(where) {
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
    async getConsentsByMonthStatistics(where) {
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
    async getGuardianRequiredConsentsCount(where) {
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
        return consentsWithPatients.filter(consent => this.requiresGuardian(consent.patient.dateOfBirth)).length;
    }
};
exports.ConsentService = ConsentService;
exports.ConsentService = ConsentService = ConsentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ConsentService);
//# sourceMappingURL=consent.service.js.map