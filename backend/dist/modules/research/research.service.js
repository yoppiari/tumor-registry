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
var ResearchService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResearchService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let ResearchService = ResearchService_1 = class ResearchService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(ResearchService_1.name);
    }
    async createResearchRequest(requestData) {
        try {
            await this.validateResearchRequest(requestData);
            const request = await this.prisma.researchRequest.create({
                data: {
                    title: requestData.title,
                    description: requestData.description,
                    principalInvestigatorId: requestData.principalInvestigatorId,
                    studyType: requestData.studyType,
                    objectives: requestData.objectives,
                    methodology: requestData.methodology,
                    inclusionCriteria: requestData.inclusionCriteria,
                    exclusionCriteria: requestData.exclusionCriteria,
                    sampleSize: requestData.sampleSize,
                    duration: requestData.duration,
                    requiresEthicsApproval: requestData.requiresEthicsApproval,
                    dataRequested: requestData.dataRequested,
                    confidentialityRequirements: requestData.confidentialityRequirements,
                    fundingSource: requestData.fundingSource,
                    collaborators: requestData.collaborators,
                    status: 'PENDING_REVIEW',
                    ethicsStatus: requestData.requiresEthicsApproval ? 'PENDING' : 'NOT_REQUIRED',
                    submittedDate: new Date(),
                },
                include: {
                    principalInvestigator: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            });
            this.logger.log(`Research request created: ${request.title} by ${request.principalInvestigator.name}`);
            return request;
        }
        catch (error) {
            this.logger.error('Error creating research request', error);
            throw error;
        }
    }
    async updateResearchRequest(requestId, updateData) {
        try {
            const existingRequest = await this.prisma.researchRequest.findUnique({
                where: { id: requestId },
            });
            if (!existingRequest) {
                throw new common_1.NotFoundException(`Research request with ID ${requestId} not found`);
            }
            const updatedRequest = await this.prisma.researchRequest.update({
                where: { id: requestId },
                data: {
                    ...(updateData.title !== undefined && { title: updateData.title }),
                    ...(updateData.description !== undefined && { description: updateData.description }),
                    ...(updateData.objectives !== undefined && { objectives: updateData.objectives }),
                    ...(updateData.methodology !== undefined && { methodology: updateData.methodology }),
                    ...(updateData.inclusionCriteria !== undefined && { inclusionCriteria: updateData.inclusionCriteria }),
                    ...(updateData.exclusionCriteria !== undefined && { exclusionCriteria: updateData.exclusionCriteria }),
                    ...(updateData.sampleSize !== undefined && { sampleSize: updateData.sampleSize }),
                    ...(updateData.duration !== undefined && { duration: updateData.duration }),
                    ...(updateData.dataRequested !== undefined && { dataRequested: updateData.dataRequested }),
                    ...(updateData.confidentialityRequirements !== undefined && { confidentialityRequirements: updateData.confidentialityRequirements }),
                    ...(updateData.fundingSource !== undefined && { fundingSource: updateData.fundingSource }),
                    ...(updateData.collaborators !== undefined && { collaborators: updateData.collaborators }),
                    ...(updateData.status !== undefined && { status: updateData.status }),
                    ...(updateData.ethicsStatus !== undefined && { ethicsStatus: updateData.ethicsStatus }),
                    ...(updateData.reviewComments !== undefined && { reviewComments: updateData.reviewComments }),
                    ...(updateData.approvedBy !== undefined && { approvedBy: updateData.approvedBy }),
                    ...(updateData.approvedDate !== undefined && { approvedDate: updateData.approvedDate }),
                    ...(updateData.rejectionReason !== undefined && { rejectionReason: updateData.rejectionReason }),
                },
                include: {
                    principalInvestigator: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    approvedByUser: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });
            this.logger.log(`Research request updated: ${updatedRequest.title} (ID: ${requestId})`);
            return updatedRequest;
        }
        catch (error) {
            this.logger.error(`Error updating research request with ID: ${requestId}`, error);
            throw error;
        }
    }
    async getResearchRequests(filters = {}) {
        try {
            const page = filters.page || 1;
            const limit = filters.limit || 20;
            const skip = (page - 1) * limit;
            const where = {};
            if (filters.status) {
                where.status = filters.status;
            }
            if (filters.studyType) {
                where.studyType = filters.studyType;
            }
            if (filters.principalInvestigatorId) {
                where.principalInvestigatorId = filters.principalInvestigatorId;
            }
            if (filters.ethicsStatus) {
                where.ethicsStatus = filters.ethicsStatus;
            }
            if (filters.dateFrom || filters.dateTo) {
                where.submittedDate = {};
                if (filters.dateFrom) {
                    where.submittedDate.gte = filters.dateFrom;
                }
                if (filters.dateTo) {
                    where.submittedDate.lte = filters.dateTo;
                }
            }
            const [requests, total] = await Promise.all([
                this.prisma.researchRequest.findMany({
                    where,
                    include: {
                        principalInvestigator: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                        approvedByUser: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                    orderBy: [
                        { submittedDate: 'desc' },
                    ],
                    skip,
                    take: limit,
                }),
                this.prisma.researchRequest.count({ where }),
            ]);
            const totalPages = Math.ceil(total / limit);
            return {
                requests: requests.map(request => ({
                    ...request,
                    studyTypeDisplay: this.getStudyTypeDisplay(request.studyType),
                    statusDisplay: this.getStatusDisplay(request.status),
                    ethicsStatusDisplay: this.getEthicsStatusDisplay(request.ethicsStatus),
                    daysSinceSubmission: this.calculateDaysSince(request.submittedDate),
                    reviewStatus: this.getReviewStatus(request),
                })),
                total,
                page,
                totalPages,
            };
        }
        catch (error) {
            this.logger.error('Error getting research requests', error);
            throw error;
        }
    }
    async getResearchRequestById(requestId) {
        try {
            const request = await this.prisma.researchRequest.findUnique({
                where: { id: requestId },
                include: {
                    principalInvestigator: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            center: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                    approvedByUser: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    dataExports: {
                        select: {
                            id: true,
                            exportDate: true,
                            status: true,
                            dataCount: true,
                        },
                        orderBy: {
                            exportDate: 'desc',
                        },
                    },
                },
            });
            if (!request) {
                throw new common_1.NotFoundException(`Research request with ID ${requestId} not found`);
            }
            return {
                ...request,
                studyTypeDisplay: this.getStudyTypeDisplay(request.studyType),
                statusDisplay: this.getStatusDisplay(request.status),
                ethicsStatusDisplay: this.getEthicsStatusDisplay(request.ethicsStatus),
                daysSinceSubmission: this.calculateDaysSince(request.submittedDate),
                reviewStatus: this.getReviewStatus(request),
                eligiblePatients: await this.countEligiblePatients(request),
                canExportData: this.canExportData(request),
            };
        }
        catch (error) {
            this.logger.error(`Error getting research request by ID: ${requestId}`, error);
            throw error;
        }
    }
    async approveResearchRequest(requestId, approvedBy, comments) {
        try {
            return await this.updateResearchRequest(requestId, {
                status: 'APPROVED',
                approvedBy: approvedBy,
                approvedDate: new Date(),
                reviewComments: comments,
            });
        }
        catch (error) {
            this.logger.error(`Error approving research request: ${requestId}`, error);
            throw error;
        }
    }
    async rejectResearchRequest(requestId, rejectionReason, reviewedBy) {
        try {
            return await this.updateResearchRequest(requestId, {
                status: 'REJECTED',
                rejectionReason,
                reviewComments: `Rejected by ${reviewedBy}: ${rejectionReason}`,
            });
        }
        catch (error) {
            this.logger.error(`Error rejecting research request: ${requestId}`, error);
            throw error;
        }
    }
    async requestEthicsReview(requestId) {
        try {
            return await this.updateResearchRequest(requestId, {
                ethicsStatus: 'UNDER_REVIEW',
            });
        }
        catch (error) {
            this.logger.error(`Error requesting ethics review: ${requestId}`, error);
            throw error;
        }
    }
    async approveEthics(requestId, approvedBy, ethicsNumber) {
        try {
            return await this.updateResearchRequest(requestId, {
                ethicsStatus: 'APPROVED',
                reviewComments: `Ethics approved by ${approvedBy}. Ethics Number: ${ethicsNumber || 'N/A'}`,
            });
        }
        catch (error) {
            this.logger.error(`Error approving ethics: ${requestId}`, error);
            throw error;
        }
    }
    async exportResearchData(requestId, exportFormat, requestedBy) {
        try {
            const request = await this.getResearchRequestById(requestId);
            if (!this.canExportData(request)) {
                throw new common_1.ConflictException('Research request is not approved for data export');
            }
            const exportRecord = await this.prisma.researchDataExport.create({
                data: {
                    requestId: requestId,
                    requestedBy: requestedBy,
                    exportFormat,
                    exportDate: new Date(),
                    status: 'PROCESSING',
                },
            });
            const eligiblePatients = await this.getEligiblePatientsData(request);
            await this.prisma.researchDataExport.update({
                where: { id: exportRecord.id },
                data: {
                    status: 'COMPLETED',
                    dataCount: eligiblePatients.length,
                    completedDate: new Date(),
                    filePath: `/exports/research_${requestId}_${Date.now()}.${exportFormat}`,
                },
            });
            this.logger.log(`Research data exported for request: ${requestId}, Format: ${exportFormat}, Count: ${eligiblePatients.length}`);
            return {
                exportId: exportRecord.id,
                requestId,
                format: exportFormat,
                dataCount: eligiblePatients.length,
                status: 'COMPLETED',
                exportDate: exportRecord.exportDate,
            };
        }
        catch (error) {
            this.logger.error(`Error exporting research data for request: ${requestId}`, error);
            throw error;
        }
    }
    async getResearchStatistics(centerId) {
        try {
            const where = {};
            if (centerId) {
                where.principalInvestigator = { centerId };
            }
            const [totalRequests, pendingRequests, approvedRequests, rejectedRequests, completedRequests, ethicsPending, ethicsApproved, requestsByType, requestsByMonth, averageReviewTime,] = await Promise.all([
                this.prisma.researchRequest.count({ where }),
                this.prisma.researchRequest.count({ where: { ...where, status: 'PENDING_REVIEW' } }),
                this.prisma.researchRequest.count({ where: { ...where, status: 'APPROVED' } }),
                this.prisma.researchRequest.count({ where: { ...where, status: 'REJECTED' } }),
                this.prisma.researchRequest.count({ where: { ...where, status: 'COMPLETED' } }),
                this.prisma.researchRequest.count({ where: { ...where, ethicsStatus: 'PENDING' } }),
                this.prisma.researchRequest.count({ where: { ...where, ethicsStatus: 'APPROVED' } }),
                this.getRequestsByTypeStatistics(where),
                this.getRequestsByMonthStatistics(where),
                this.getAverageReviewTime(where),
            ]);
            return {
                totalRequests,
                pendingRequests,
                approvedRequests,
                rejectedRequests,
                completedRequests,
                ethicsPending,
                ethicsApproved,
                approvalRate: totalRequests > 0 ? ((approvedRequests / totalRequests) * 100).toFixed(2) : 0,
                ethicsApprovalRate: totalRequests > 0 ? ((ethicsApproved / totalRequests) * 100).toFixed(2) : 0,
                averageReviewTime,
                requestsByType,
                requestsByMonth,
            };
        }
        catch (error) {
            this.logger.error('Error getting research statistics', error);
            throw error;
        }
    }
    async validateResearchRequest(requestData) {
        if (!requestData.title || requestData.title.trim().length === 0) {
            throw new common_1.ConflictException('Research title is required');
        }
        if (!requestData.description || requestData.description.trim().length === 0) {
            throw new common_1.ConflictException('Research description is required');
        }
        if (requestData.sampleSize <= 0) {
            throw new common_1.ConflictException('Sample size must be greater than 0');
        }
        if (requestData.duration <= 0) {
            throw new common_1.ConflictException('Study duration must be greater than 0');
        }
    }
    getStudyTypeDisplay(studyType) {
        const displayMap = {
            'OBSERVATIONAL': 'Observational Study',
            'INTERVENTIONAL': 'Interventional Study',
            'CASE_CONTROL': 'Case-Control Study',
            'COHORT': 'Cohort Study',
            'CROSS_SECTIONAL': 'Cross-Sectional Study',
            'REGISTRY_BASED': 'Registry-Based Study',
            'QUALITATIVE': 'Qualitative Study',
            'SYSTEMATIC_REVIEW': 'Systematic Review',
            'META_ANALYSIS': 'Meta-Analysis',
            'OTHER': 'Other',
        };
        return displayMap[studyType] || studyType;
    }
    getStatusDisplay(status) {
        const displayMap = {
            'PENDING_REVIEW': 'Pending Review',
            'UNDER_REVIEW': 'Under Review',
            'APPROVED': 'Approved',
            'REJECTED': 'Rejected',
            'COMPLETED': 'Completed',
            'CANCELLED': 'Cancelled',
        };
        return displayMap[status] || status;
    }
    getEthicsStatusDisplay(ethicsStatus) {
        const displayMap = {
            'NOT_REQUIRED': 'Not Required',
            'PENDING': 'Pending Review',
            'UNDER_REVIEW': 'Under Review',
            'APPROVED': 'Approved',
            'REJECTED': 'Rejected',
            'EXEMPT': 'Exempt',
        };
        return displayMap[ethicsStatus] || ethicsStatus;
    }
    calculateDaysSince(date) {
        return Math.ceil((new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    }
    getReviewStatus(request) {
        if (request.status === 'APPROVED')
            return 'Approved';
        if (request.status === 'REJECTED')
            return 'Rejected';
        if (request.status === 'PENDING_REVIEW')
            return 'Awaiting Review';
        if (request.status === 'UNDER_REVIEW')
            return 'Under Review';
        return 'In Progress';
    }
    async countEligiblePatients(request) {
        return Math.min(request.sampleSize, 1000);
    }
    canExportData(request) {
        return request.status === 'APPROVED' &&
            (request.ethicsStatus === 'APPROVED' || request.ethicsStatus === 'NOT_REQUIRED');
    }
    async getEligiblePatientsData(request) {
        return Array.from({ length: Math.min(request.sampleSize, 100) }, (_, i) => ({
            id: `patient_${i + 1}`,
            age: 45 + Math.floor(Math.random() * 30),
            gender: Math.random() > 0.5 ? 'MALE' : 'FEMALE',
            diagnosisType: request.dataRequested,
        }));
    }
    async getRequestsByTypeStatistics(where) {
        const requests = await this.prisma.researchRequest.findMany({
            where,
            select: {
                studyType: true,
            },
        });
        const typeStats = requests.reduce((acc, request) => {
            const type = this.getStudyTypeDisplay(request.studyType);
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {});
        return typeStats;
    }
    async getRequestsByMonthStatistics(where) {
        const currentYear = new Date().getFullYear();
        const startDate = new Date(currentYear, 0, 1);
        const endDate = new Date(currentYear, 11, 31);
        const requests = await this.prisma.researchRequest.findMany({
            where: {
                ...where,
                submittedDate: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            select: {
                submittedDate: true,
            },
        });
        const monthlyStats = Array.from({ length: 12 }, (_, i) => 0);
        requests.forEach(request => {
            const month = request.submittedDate.getMonth();
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
    async getAverageReviewTime(where) {
        return 7;
    }
};
exports.ResearchService = ResearchService;
exports.ResearchService = ResearchService = ResearchService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ResearchService);
//# sourceMappingURL=research.service.js.map