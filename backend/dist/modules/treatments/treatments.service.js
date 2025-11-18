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
var TreatmentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreatmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let TreatmentsService = TreatmentsService_1 = class TreatmentsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(TreatmentsService_1.name);
    }
    async createTreatment(treatmentData) {
        try {
            await this.validateTreatmentData(treatmentData);
            const treatment = await this.prisma.patientProcedure.create({
                data: {
                    patientId: treatmentData.patientId,
                    procedureName: treatmentData.procedureName,
                    procedureCode: treatmentData.procedureCode,
                    indication: treatmentData.indication,
                    description: treatmentData.description,
                    startDate: treatmentData.startDate,
                    endDate: treatmentData.endDate,
                    status: treatmentData.status,
                    performedBy: treatmentData.performedBy,
                    notes: treatmentData.notes,
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
            this.logger.log(`Treatment created: ${treatment.procedureName} for patient ${treatment.patient.name}`);
            return treatment;
        }
        catch (error) {
            this.logger.error('Error creating treatment', error);
            throw error;
        }
    }
    async findByPatientId(patientId, status, page = 1, limit = 20) {
        try {
            const skip = (page - 1) * limit;
            const where = {
                patientId,
                ...(status && { status }),
            };
            const [treatments, total] = await Promise.all([
                this.prisma.patientProcedure.findMany({
                    where,
                    include: {},
                    orderBy: [
                        { startDate: 'desc' },
                    ],
                    skip,
                    take: limit,
                }),
                this.prisma.patientProcedure.count({ where }),
            ]);
            const totalPages = Math.ceil(total / limit);
            return {
                treatments: treatments.map(treatment => ({
                    ...treatment,
                    duration: this.calculateTreatmentDuration(treatment),
                    status: this.getTreatmentStatus(treatment),
                })),
                total,
                page,
                totalPages,
            };
        }
        catch (error) {
            this.logger.error(`Error finding treatments for patient: ${patientId}`, error);
            throw error;
        }
    }
    async findById(id) {
        try {
            const treatment = await this.prisma.patientProcedure.findUnique({
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
            if (!treatment) {
                throw new common_1.NotFoundException(`Treatment with ID ${id} not found`);
            }
            return {
                ...treatment,
                duration: this.calculateTreatmentDuration(treatment),
                status: this.getTreatmentStatus(treatment),
                patientAge: this.calculatePatientAge(treatment.patient.dateOfBirth),
                treatmentType: this.getTreatmentType(treatment.procedureName),
            };
        }
        catch (error) {
            this.logger.error(`Error finding treatment by ID: ${id}`, error);
            throw error;
        }
    }
    async updateTreatment(id, updateData) {
        try {
            await this.findById(id);
            const updatedTreatment = await this.prisma.patientProcedure.update({
                where: { id },
                data: {
                    ...(updateData.procedureName !== undefined && { procedureName: updateData.procedureName }),
                    ...(updateData.procedureCode !== undefined && { procedureCode: updateData.procedureCode }),
                    ...(updateData.indication !== undefined && { indication: updateData.indication }),
                    ...(updateData.description !== undefined && { description: updateData.description }),
                    ...(updateData.startDate !== undefined && { startDate: updateData.startDate }),
                    ...(updateData.endDate !== undefined && { endDate: updateData.endDate }),
                    ...(updateData.status !== undefined && { status: updateData.status }),
                    ...(updateData.outcome !== undefined && { outcome: updateData.outcome }),
                    ...(updateData.complications !== undefined && { complications: updateData.complications }),
                    ...(updateData.notes !== undefined && { notes: updateData.notes }),
                },
            });
            this.logger.log(`Treatment updated: ${updatedTreatment.procedureName} (ID: ${id})`);
            return updatedTreatment;
        }
        catch (error) {
            this.logger.error(`Error updating treatment with ID: ${id}`, error);
            throw error;
        }
    }
    async scheduleTreatment(id, startDate, endDate) {
        try {
            const updatedTreatment = await this.prisma.patientProcedure.update({
                where: { id },
                data: {
                    status: 'SCHEDULED',
                    startDate,
                    endDate,
                },
            });
            this.logger.log(`Treatment scheduled: ${updatedTreatment.procedureName} (ID: ${id})`);
            return updatedTreatment;
        }
        catch (error) {
            this.logger.error(`Error scheduling treatment with ID: ${id}`, error);
            throw error;
        }
    }
    async startTreatment(id) {
        try {
            const updatedTreatment = await this.prisma.patientProcedure.update({
                where: { id },
                data: {
                    status: 'IN_PROGRESS',
                },
            });
            this.logger.log(`Treatment started: ${updatedTreatment.procedureName} (ID: ${id})`);
            return updatedTreatment;
        }
        catch (error) {
            this.logger.error(`Error starting treatment with ID: ${id}`, error);
            throw error;
        }
    }
    async completeTreatment(id, outcome, complications) {
        try {
            const updateData = {
                status: 'COMPLETED',
            };
            if (outcome) {
                updateData.outcome = outcome;
            }
            if (complications) {
                updateData.complications = complications;
                updateData.status = 'COMPLICATION';
            }
            const updatedTreatment = await this.prisma.patientProcedure.update({
                where: { id },
                data: updateData,
            });
            this.logger.log(`Treatment completed: ${updatedTreatment.procedureName} (ID: ${id})`);
            return updatedTreatment;
        }
        catch (error) {
            this.logger.error(`Error completing treatment with ID: ${id}`, error);
            throw error;
        }
    }
    async cancelTreatment(id, reason) {
        try {
            const updateData = {
                status: 'CANCELLED',
            };
            if (reason) {
                updateData.notes = `CANCELLED: ${reason}`;
            }
            const updatedTreatment = await this.prisma.patientProcedure.update({
                where: { id },
                data: updateData,
            });
            this.logger.log(`Treatment cancelled: ${updatedTreatment.procedureName} (ID: ${id}) - Reason: ${reason}`);
            return updatedTreatment;
        }
        catch (error) {
            this.logger.error(`Error cancelling treatment with ID: ${id}`, error);
            throw error;
        }
    }
    async getTreatmentStatistics(centerId, providerId) {
        try {
            const where = {};
            if (centerId || providerId) {
                where.patient = {};
                if (centerId) {
                    where.patient.centerId = centerId;
                }
            }
            if (providerId) {
                where.performedBy = providerId;
            }
            const [totalTreatments, scheduledTreatments, inProgressTreatments, completedTreatments, cancelledTreatments, treatmentsWithComplications, treatmentsByType, treatmentsByMonth,] = await Promise.all([
                this.prisma.patientProcedure.count({ where }),
                this.prisma.patientProcedure.count({
                    where: { ...where, status: 'SCHEDULED' },
                }),
                this.prisma.patientProcedure.count({
                    where: { ...where, status: 'IN_PROGRESS' },
                }),
                this.prisma.patientProcedure.count({
                    where: { ...where, status: 'COMPLETED' },
                }),
                this.prisma.patientProcedure.count({
                    where: { ...where, status: 'CANCELLED' },
                }),
                this.prisma.patientProcedure.count({
                    where: { ...where, status: 'COMPLICATION' },
                }),
                this.getTreatmentsByTypeStatistics(where),
                this.getTreatmentsByMonthStatistics(where),
            ]);
            return {
                totalTreatments,
                scheduledTreatments,
                inProgressTreatments,
                completedTreatments,
                cancelledTreatments,
                treatmentsWithComplications,
                treatmentsByType,
                treatmentsByMonth,
            };
        }
        catch (error) {
            this.logger.error('Error getting treatment statistics', error);
            throw error;
        }
    }
    async searchTreatments(query) {
        try {
            const page = query.page || 1;
            const limit = query.limit || 20;
            const skip = (page - 1) * limit;
            const where = {
                ...(query.patientId && { patientId: query.patientId }),
                ...(query.providerId && { performedBy: query.providerId }),
                ...(query.status && { status: query.status }),
                ...(query.dateFrom || query.dateTo ? {
                    startDate: {
                        ...(query.dateFrom && { gte: query.dateFrom }),
                        ...(query.dateTo && { lte: query.dateTo }),
                    },
                } : {}),
                ...(query.search && {
                    OR: [
                        { procedureName: { contains: query.search, mode: 'insensitive' } },
                        { procedureCode: { contains: query.search, mode: 'insensitive' } },
                        { indication: { contains: query.search, mode: 'insensitive' } },
                        { description: { contains: query.search, mode: 'insensitive' } },
                        { notes: { contains: query.search, mode: 'insensitive' } },
                    ],
                }),
            };
            const [treatments, total] = await Promise.all([
                this.prisma.patientProcedure.findMany({
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
                        { startDate: 'desc' },
                    ],
                    skip,
                    take: limit,
                }),
                this.prisma.patientProcedure.count({ where }),
            ]);
            const totalPages = Math.ceil(total / limit);
            return {
                treatments: treatments.map(treatment => ({
                    ...treatment,
                    duration: this.calculateTreatmentDuration(treatment),
                    status: this.getTreatmentStatus(treatment),
                    treatmentType: this.getTreatmentType(treatment.procedureName),
                })),
                total,
                page,
                totalPages,
            };
        }
        catch (error) {
            this.logger.error('Error searching treatments', error);
            throw error;
        }
    }
    async getActiveTreatmentsByPatient(patientId) {
        try {
            const treatments = await this.prisma.patientProcedure.findMany({
                where: {
                    patientId,
                    status: {
                        in: ['SCHEDULED', 'IN_PROGRESS'],
                    },
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
                orderBy: [
                    { startDate: 'asc' },
                ],
            });
            return treatments.map(treatment => ({
                ...treatment,
                duration: this.calculateTreatmentDuration(treatment),
                status: this.getTreatmentStatus(treatment),
                treatmentType: this.getTreatmentType(treatment.procedureName),
            }));
        }
        catch (error) {
            this.logger.error(`Error getting active treatments for patient: ${patientId}`, error);
            throw error;
        }
    }
    async getUpcomingTreatments(days = 7, centerId) {
        try {
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() + days);
            const where = {
                status: 'SCHEDULED',
                startDate: {
                    gte: new Date(),
                    lte: targetDate,
                },
            };
            if (centerId) {
                where.patient = {
                    centerId,
                };
            }
            const treatments = await this.prisma.patientProcedure.findMany({
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
                    { startDate: 'asc' },
                ],
            });
            return treatments.map(treatment => ({
                ...treatment,
                daysUntilTreatment: Math.ceil((treatment.startDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
                treatmentType: this.getTreatmentType(treatment.procedureName),
            }));
        }
        catch (error) {
            this.logger.error('Error getting upcoming treatments', error);
            throw error;
        }
    }
    async validateTreatmentData(treatmentData) {
        if (treatmentData.startDate && treatmentData.endDate) {
            if (treatmentData.endDate <= treatmentData.startDate) {
                throw new common_1.ConflictException('End date must be after start date');
            }
        }
    }
    calculateTreatmentDuration(treatment) {
        if (!treatment.startDate) {
            return null;
        }
        const endDate = treatment.endDate || new Date();
        const duration = endDate.getTime() - treatment.startDate.getTime();
        const days = Math.floor(duration / (1000 * 60 * 60 * 24));
        if (days < 1) {
            return 'Same day';
        }
        else if (days < 7) {
            return `${days} days`;
        }
        else if (days < 30) {
            const weeks = Math.floor(days / 7);
            return `${weeks} weeks`;
        }
        else {
            const months = Math.floor(days / 30);
            return `${months} months`;
        }
    }
    getTreatmentStatus(treatment) {
        const now = new Date();
        if (treatment.status === 'COMPLETED') {
            return 'Completed';
        }
        if (treatment.status === 'CANCELLED') {
            return 'Cancelled';
        }
        if (treatment.status === 'COMPLICATION') {
            return 'Completed with Complications';
        }
        if (treatment.status === 'SCHEDULED') {
            if (treatment.startDate > now) {
                return 'Scheduled';
            }
            else {
                return 'Overdue';
            }
        }
        if (treatment.status === 'IN_PROGRESS') {
            return 'In Progress';
        }
        return treatment.status;
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
    getTreatmentType(procedureName) {
        const name = procedureName.toLowerCase();
        if (name.includes('chemotherapy') || name.includes('chemo')) {
            return 'Chemotherapy';
        }
        if (name.includes('radiotherapy') || name.includes('radiation')) {
            return 'Radiotherapy';
        }
        if (name.includes('surgery') || name.includes('operative')) {
            return 'Surgery';
        }
        if (name.includes('immunotherapy') || name.includes('immuno')) {
            return 'Immunotherapy';
        }
        if (name.includes('hormone') || name.includes('endocrine')) {
            return 'Hormone Therapy';
        }
        if (name.includes('targeted') || name.includes('molecular')) {
            return 'Targeted Therapy';
        }
        if (name.includes('palliative') || name.includes('supportive')) {
            return 'Palliative Care';
        }
        return 'Other';
    }
    async getTreatmentsByTypeStatistics(where) {
        const treatments = await this.prisma.patientProcedure.findMany({
            where,
            select: {
                procedureName: true,
            },
        });
        const typeStats = treatments.reduce((acc, treatment) => {
            const type = this.getTreatmentType(treatment.procedureName);
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {});
        return typeStats;
    }
    async getTreatmentsByMonthStatistics(where) {
        const currentYear = new Date().getFullYear();
        const startDate = new Date(currentYear, 0, 1);
        const endDate = new Date(currentYear, 11, 31);
        const treatments = await this.prisma.patientProcedure.findMany({
            where: {
                ...where,
                startDate: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            select: {
                startDate: true,
            },
        });
        const monthlyStats = Array.from({ length: 12 }, (_, i) => 0);
        treatments.forEach(treatment => {
            const month = treatment.startDate.getMonth();
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
exports.TreatmentsService = TreatmentsService;
exports.TreatmentsService = TreatmentsService = TreatmentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TreatmentsService);
//# sourceMappingURL=treatments.service.js.map