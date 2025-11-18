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
var MedicalRecordsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalRecordsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let MedicalRecordsService = MedicalRecordsService_1 = class MedicalRecordsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(MedicalRecordsService_1.name);
    }
    async createMedicalRecord(recordData) {
        try {
            const recordNumber = await this.generateRecordNumber(recordData.patientId, recordData.recordType);
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
        }
        catch (error) {
            this.logger.error('Error creating medical record', error);
            throw error;
        }
    }
    async findByPatientId(patientId, recordType, page = 1, limit = 20) {
        try {
            const skip = (page - 1) * limit;
            const where = {
                patientId,
                ...(recordType && { recordType }),
            };
            const [records, total] = await Promise.all([
                this.prisma.medicalRecord.findMany({
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
        }
        catch (error) {
            this.logger.error(`Error finding medical records for patient: ${patientId}`, error);
            throw error;
        }
    }
    async findById(id) {
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
                    provider: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            });
            if (!record) {
                throw new common_1.NotFoundException(`Medical record with ID ${id} not found`);
            }
            return record;
        }
        catch (error) {
            this.logger.error(`Error finding medical record by ID: ${id}`, error);
            throw error;
        }
    }
    async findByRecordNumber(recordNumber) {
        try {
            const record = await this.prisma.medicalRecord.findUnique({
                where: { recordNumber },
                include: {
                    patient: true,
                    provider: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            });
            if (!record) {
                throw new common_1.NotFoundException(`Medical record with number ${recordNumber} not found`);
            }
            return record;
        }
        catch (error) {
            this.logger.error(`Error finding medical record by number: ${recordNumber}`, error);
            throw error;
        }
    }
    async updateMedicalRecord(id, updateData, providerId) {
        try {
            await this.findById(id);
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
        }
        catch (error) {
            this.logger.error(`Error updating medical record with ID: ${id}`, error);
            throw error;
        }
    }
    async getMedicalRecordStatistics(centerId, providerId) {
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
            const [totalRecords, recordsByType, recordsByMonth, confidentialRecords,] = await Promise.all([
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
        }
        catch (error) {
            this.logger.error('Error getting medical record statistics', error);
            throw error;
        }
    }
    async searchMedicalRecords(query) {
        try {
            const page = query.page || 1;
            const limit = query.limit || 20;
            const skip = (page - 1) * limit;
            const where = {
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
                this.prisma.medicalRecord.count({ where }),
            ]);
            const totalPages = Math.ceil(total / limit);
            return {
                records,
                total,
                page,
                totalPages,
            };
        }
        catch (error) {
            this.logger.error('Error searching medical records', error);
            throw error;
        }
    }
    async generateRecordNumber(patientId, recordType) {
        try {
            const patient = await this.prisma.patient.findUnique({
                where: { id: patientId },
                select: {
                    medicalRecordNumber: true,
                },
            });
            if (!patient) {
                throw new common_1.NotFoundException('Patient not found');
            }
            const currentYear = new Date().getFullYear();
            const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
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
        }
        catch (error) {
            this.logger.error('Error generating record number', error);
            throw error;
        }
    }
    async getRecordsByTypeStatistics(where) {
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
    async getRecordsByMonthStatistics(where) {
        const currentYear = new Date().getFullYear();
        const startDate = new Date(currentYear, 0, 1);
        const endDate = new Date(currentYear, 11, 31);
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
};
exports.MedicalRecordsService = MedicalRecordsService;
exports.MedicalRecordsService = MedicalRecordsService = MedicalRecordsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MedicalRecordsService);
//# sourceMappingURL=medical-records.service.js.map