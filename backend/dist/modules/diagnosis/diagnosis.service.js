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
var DiagnosisService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiagnosisService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let DiagnosisService = DiagnosisService_1 = class DiagnosisService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(DiagnosisService_1.name);
    }
    async createDiagnosis(diagnosisData) {
        try {
            this.validateIcd10Code(diagnosisData.diagnosisCode);
            const existingDiagnosis = await this.prisma.patientDiagnosis.findFirst({
                where: {
                    patientId: diagnosisData.patientId,
                    diagnosisCode: diagnosisData.diagnosisCode,
                    status: 'ACTIVE',
                },
            });
            if (existingDiagnosis) {
                throw new common_1.ConflictException(`Active diagnosis with code ${diagnosisData.diagnosisCode} already exists for this patient`);
            }
            if (diagnosisData.isPrimary) {
                await this.unmarkPrimaryDiagnoses(diagnosisData.patientId, diagnosisData.diagnosisType);
            }
            const diagnosis = await this.prisma.patientDiagnosis.create({
                data: {
                    patientId: diagnosisData.patientId,
                    diagnosisCode: diagnosisData.diagnosisCode,
                    diagnosisName: diagnosisData.diagnosisName,
                    diagnosisType: diagnosisData.diagnosisType,
                    severity: diagnosisData.severity,
                    status: diagnosisData.status,
                    onsetDate: diagnosisData.onsetDate,
                    resolutionDate: diagnosisData.resolutionDate,
                    notes: diagnosisData.notes,
                    isPrimary: diagnosisData.isPrimary || false,
                    providerId: diagnosisData.providerId,
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
            this.logger.log(`Diagnosis created: ${diagnosis.diagnosisCode} - ${diagnosis.diagnosisName} for patient ${diagnosis.patient.name}`);
            return diagnosis;
        }
        catch (error) {
            this.logger.error('Error creating diagnosis', error);
            throw error;
        }
    }
    async findByPatientId(patientId, diagnosisType, status, includeInactive = false, page = 1, limit = 20) {
        try {
            const skip = (page - 1) * limit;
            const where = {
                patientId,
                ...(diagnosisType && { diagnosisType }),
                ...(status && { status }),
                ...(includeInactive === false && { status: 'ACTIVE' }),
            };
            const [diagnoses, total] = await Promise.all([
                this.prisma.patientDiagnosis.findMany({
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
                        { isPrimary: 'desc' },
                        { createdAt: 'desc' },
                    ],
                    skip,
                    take: limit,
                }),
                this.prisma.patientDiagnosis.count({ where }),
            ]);
            const totalPages = Math.ceil(total / limit);
            return {
                diagnoses: diagnoses.map(diagnosis => ({
                    ...diagnosis,
                    duration: this.calculateDiagnosisDuration(diagnosis),
                })),
                total,
                page,
                totalPages,
            };
        }
        catch (error) {
            this.logger.error(`Error finding diagnoses for patient: ${patientId}`, error);
            throw error;
        }
    }
    async findById(id) {
        try {
            const diagnosis = await this.prisma.patientDiagnosis.findUnique({
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
                    provider: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            });
            if (!diagnosis) {
                throw new common_1.NotFoundException(`Diagnosis with ID ${id} not found`);
            }
            return {
                ...diagnosis,
                duration: this.calculateDiagnosisDuration(diagnosis),
                patientAge: this.calculatePatientAge(diagnosis.patient.dateOfBirth),
                icd10Category: this.getIcd10Category(diagnosis.diagnosisCode),
            };
        }
        catch (error) {
            this.logger.error(`Error finding diagnosis by ID: ${id}`, error);
            throw error;
        }
    }
    async updateDiagnosis(id, updateData, providerId) {
        try {
            const existingDiagnosis = await this.findById(id);
            if (updateData.isPrimary === true && !existingDiagnosis.isPrimary) {
                await this.unmarkPrimaryDiagnoses(existingDiagnosis.patientId, existingDiagnosis.diagnosisType);
            }
            const updatedDiagnosis = await this.prisma.patientDiagnosis.update({
                where: { id },
                data: {
                    ...(updateData.diagnosisName !== undefined && { diagnosisName: updateData.diagnosisName }),
                    ...(updateData.severity !== undefined && { severity: updateData.severity }),
                    ...(updateData.status !== undefined && { status: updateData.status }),
                    ...(updateData.onsetDate !== undefined && { onsetDate: updateData.onsetDate }),
                    ...(updateData.resolutionDate !== undefined && { resolutionDate: updateData.resolutionDate }),
                    ...(updateData.notes !== undefined && { notes: updateData.notes }),
                    ...(updateData.isPrimary !== undefined && { isPrimary: updateData.isPrimary }),
                },
            });
            this.logger.log(`Diagnosis updated: ${updatedDiagnosis.diagnosisCode} (ID: ${id})`);
            return updatedDiagnosis;
        }
        catch (error) {
            this.logger.error(`Error updating diagnosis with ID: ${id}`, error);
            throw error;
        }
    }
    async resolveDiagnosis(id, resolutionDate, notes) {
        try {
            const updatedDiagnosis = await this.prisma.patientDiagnosis.update({
                where: { id },
                data: {
                    status: 'RESOLVED',
                    resolutionDate,
                    ...(notes && { notes: `${notes}\n${notes}` }),
                },
            });
            this.logger.log(`Diagnosis resolved: ${updatedDiagnosis.diagnosisCode} (ID: ${id})`);
            return updatedDiagnosis;
        }
        catch (error) {
            this.logger.error(`Error resolving diagnosis with ID: ${id}`, error);
            throw error;
        }
    }
    async getDiagnosisStatistics(centerId, providerId) {
        try {
            const where = {};
            if (centerId || providerId) {
                where.patient = {};
                if (centerId) {
                    where.patient.centerId = centerId;
                }
            }
            if (providerId) {
                where.providerId = providerId;
            }
            const [totalDiagnoses, activeDiagnoses, resolvedDiagnoses, primaryDiagnoses, diagnosesByType, diagnosesBySeverity, topDiagnoses, diagnosesByMonth,] = await Promise.all([
                this.prisma.patientDiagnosis.count({ where }),
                this.prisma.patientDiagnosis.count({
                    where: { ...where, status: 'ACTIVE' },
                }),
                this.prisma.patientDiagnosis.count({
                    where: { ...where, status: 'RESOLVED' },
                }),
                this.prisma.patientDiagnosis.count({
                    where: { ...where, isPrimary: true },
                }),
                this.getDiagnosesByTypeStatistics(where),
                this.getDiagnosesBySeverityStatistics(where),
                this.getTopDiagnoses(where),
                this.getDiagnosesByMonthStatistics(where),
            ]);
            return {
                totalDiagnoses,
                activeDiagnoses,
                resolvedDiagnoses,
                primaryDiagnoses,
                diagnosesByType,
                diagnosesBySeverity,
                topDiagnoses,
                diagnosesByMonth,
            };
        }
        catch (error) {
            this.logger.error('Error getting diagnosis statistics', error);
            throw error;
        }
    }
    async searchDiagnoses(query) {
        try {
            const page = query.page || 1;
            const limit = query.limit || 20;
            const skip = (page - 1) * limit;
            const where = {
                ...(query.patientId && { patientId: query.patientId }),
                ...(query.providerId && { providerId: query.providerId }),
                ...(query.diagnosisType && { diagnosisType: query.diagnosisType }),
                ...(query.severity && { severity: query.severity }),
                ...(query.status && { status: query.status }),
                ...(query.isPrimary !== undefined && { isPrimary: query.isPrimary }),
                ...(query.dateFrom || query.dateTo ? {
                    createdAt: {
                        ...(query.dateFrom && { gte: query.dateFrom }),
                        ...(query.dateTo && { lte: query.dateTo }),
                    },
                } : {}),
                ...(query.search && {
                    OR: [
                        { diagnosisCode: { contains: query.search, mode: 'insensitive' } },
                        { diagnosisName: { contains: query.search, mode: 'insensitive' } },
                        { notes: { contains: query.search, mode: 'insensitive' } },
                    ],
                }),
            };
            const [diagnoses, total] = await Promise.all([
                this.prisma.patientDiagnosis.findMany({
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
                        { createdAt: 'desc' },
                    ],
                    skip,
                    take: limit,
                }),
                this.prisma.patientDiagnosis.count({ where }),
            ]);
            const totalPages = Math.ceil(total / limit);
            return {
                diagnoses: diagnoses.map(diagnosis => ({
                    ...diagnosis,
                    duration: this.calculateDiagnosisDuration(diagnosis),
                    icd10Category: this.getIcd10Category(diagnosis.diagnosisCode),
                })),
                total,
                page,
                totalPages,
            };
        }
        catch (error) {
            this.logger.error('Error searching diagnoses', error);
            throw error;
        }
    }
    async getActiveDiagnosesByPatient(patientId) {
        try {
            const diagnoses = await this.prisma.patientDiagnosis.findMany({
                where: {
                    patientId,
                    status: 'ACTIVE',
                },
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
                    { isPrimary: 'desc' },
                    { createdAt: 'desc' },
                ],
            });
            return diagnoses.map(diagnosis => ({
                ...diagnosis,
                duration: this.calculateDiagnosisDuration(diagnosis),
                icd10Category: this.getIcd10Category(diagnosis.diagnosisCode),
            }));
        }
        catch (error) {
            this.logger.error(`Error getting active diagnoses for patient: ${patientId}`, error);
            throw error;
        }
    }
    async getPrimaryDiagnosesByPatient(patientId) {
        try {
            const diagnoses = await this.prisma.patientDiagnosis.findMany({
                where: {
                    patientId,
                    isPrimary: true,
                },
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
                    { diagnosisType: 'asc' },
                    { createdAt: 'desc' },
                ],
            });
            return diagnoses.map(diagnosis => ({
                ...diagnosis,
                duration: this.calculateDiagnosisDuration(diagnosis),
                icd10Category: this.getIcd10Category(diagnosis.diagnosisCode),
            }));
        }
        catch (error) {
            this.logger.error(`Error getting primary diagnoses for patient: ${patientId}`, error);
            throw error;
        }
    }
    validateIcd10Code(code) {
        const icd10Pattern = /^[A-Z]\d{2}(\.\d{1,2})?$/;
        if (!icd10Pattern.test(code)) {
            throw new common_1.ConflictException(`Invalid ICD-10 code format: ${code}`);
        }
    }
    async unmarkPrimaryDiagnoses(patientId, diagnosisType) {
        await this.prisma.patientDiagnosis.updateMany({
            where: {
                patientId,
                diagnosisType,
                isPrimary: true,
            },
            data: {
                isPrimary: false,
            },
        });
    }
    calculateDiagnosisDuration(diagnosis) {
        if (!diagnosis.onsetDate) {
            return null;
        }
        const endDate = diagnosis.resolutionDate || new Date();
        const duration = endDate.getTime() - diagnosis.onsetDate.getTime();
        const days = Math.floor(duration / (1000 * 60 * 60 * 24));
        if (days < 30) {
            return `${days} days`;
        }
        else if (days < 365) {
            const months = Math.floor(days / 30);
            return `${months} months`;
        }
        else {
            const years = Math.floor(days / 365);
            const remainingDays = days % 365;
            const remainingMonths = Math.floor(remainingDays / 30);
            return remainingMonths > 0 ? `${years} years, ${remainingMonths} months` : `${years} years`;
        }
    }
    calculatePatientAge(dateOfBirth) {
        const today = new Date();
        let age = today.getFullYear() - dateOfBirth.getFullYear();
        const monthDiff = today.getMonth() - dateOfBirth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
            age--;
        }
        return age;
    }
    getIcd10Category(code) {
        if (code.startsWith('A00-B99'))
            return 'Infectious and Parasitic Diseases';
        if (code.startsWith('C00-D48'))
            return 'Neoplasms';
        if (code.startsWith('D50-D89'))
            return 'Diseases of Blood and Blood-Forming Organs';
        if (code.startsWith('E00-E90'))
            return 'Endocrine, Nutritional, and Metabolic Diseases';
        if (code.startsWith('F00-F99'))
            return 'Mental and Behavioural Disorders';
        if (code.startsWith('G00-G99'))
            return 'Diseases of the Nervous System';
        if (code.startsWith('H00-H59'))
            return 'Diseases of the Eye and Adnexa';
        if (code.startsWith('H60-H95'))
            return 'Diseases of the Ear and Mastoid Process';
        if (code.startsWith('I00-I99'))
            return 'Diseases of the Circulatory System';
        if (code.startsWith('J00-J99'))
            return 'Diseases of the Respiratory System';
        if (code.startsWith('K00-K93'))
            return 'Diseases of the Digestive System';
        if (code.startsWith('L00-L99'))
            return 'Diseases of the Skin and Subcutaneous Tissue';
        if (code.startsWith('M00-M99'))
            return 'Diseases of the Musculoskeletal System and Connective Tissue';
        if (code.startsWith('N00-N99'))
            return 'Diseases of the Genitourinary System';
        if (code.startsWith('O00-O99'))
            return 'Pregnancy, Childbirth, and the Puerperium';
        if (code.startsWith('P00-P96'))
            return 'Certain Conditions originating in the Perinatal Period';
        if (code.startsWith('Q00-Q99'))
            return 'Congenital Malformations, Deformations and Chromosomal Abnormalities';
        if (code.startsWith('R00-R99'))
            return 'Symptoms, Signs and Abnormal Clinical and Laboratory Findings';
        if (code.startsWith('S00-T98'))
            return 'Injury, Poisoning and Certain Other Consequences of External Causes';
        if (code.startsWith('V01-Y98'))
            return 'External Causes of Morbidity and Mortality';
        if (code.startsWith('Z00-Z99'))
            return 'Factors Influencing Health Status and Contact with Health Services';
        return 'Other';
    }
    async getDiagnosesByTypeStatistics(where) {
        const stats = await this.prisma.patientDiagnosis.groupBy({
            by: ['diagnosisType'],
            where,
            _count: {
                diagnosisType: true,
            },
        });
        return stats.reduce((acc, stat) => {
            acc[stat.diagnosisType] = stat._count.diagnosisType;
            return acc;
        }, {});
    }
    async getDiagnosesBySeverityStatistics(where) {
        const stats = await this.prisma.patientDiagnosis.groupBy({
            by: ['severity'],
            where: {
                ...where,
                severity: {
                    not: null,
                },
            },
            _count: {
                severity: true,
            },
        });
        return stats.reduce((acc, stat) => {
            acc[stat.severity] = stat._count.severity;
            return acc;
        }, {});
    }
    async getTopDiagnoses(where, limit = 10) {
        const diagnoses = await this.prisma.patientDiagnosis.groupBy({
            by: ['diagnosisCode', 'diagnosisName'],
            where,
            _count: {
                diagnosisCode: true,
            },
            orderBy: {
                _count: {
                    diagnosisCode: 'desc',
                },
            },
            take: limit,
        });
        return diagnoses.map(stat => ({
            diagnosisCode: stat.diagnosisCode,
            diagnosisName: stat.diagnosisName,
            count: stat._count.diagnosisCode,
            category: this.getIcd10Category(stat.diagnosisCode),
        }));
    }
    async getDiagnosesByMonthStatistics(where) {
        const currentYear = new Date().getFullYear();
        const startDate = new Date(currentYear, 0, 1);
        const endDate = new Date(currentYear, 11, 31);
        const diagnoses = await this.prisma.patientDiagnosis.findMany({
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
        diagnoses.forEach(diagnosis => {
            const month = diagnosis.createdAt.getMonth();
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
};
exports.DiagnosisService = DiagnosisService;
exports.DiagnosisService = DiagnosisService = DiagnosisService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DiagnosisService);
//# sourceMappingURL=diagnosis.service.js.map