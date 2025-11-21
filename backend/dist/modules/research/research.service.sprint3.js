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
var ResearchSprint3Service_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResearchSprint3Service = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/database/prisma.service");
const audit_service_1 = require("../audit/audit.service");
const email_service_1 = require("../auth/email.service");
const client_1 = require("@prisma/client");
let ResearchSprint3Service = ResearchSprint3Service_1 = class ResearchSprint3Service {
    constructor(prisma, auditLogService, emailService) {
        this.prisma = prisma;
        this.auditLogService = auditLogService;
        this.emailService = emailService;
        this.logger = new common_1.Logger(ResearchSprint3Service_1.name);
    }
    async createResearchRequest(requestData, userId) {
        try {
            await this.validateResearchRequest(requestData, userId);
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
                    expectedOutcomes: requestData.expectedOutcomes,
                    riskAssessment: requestData.riskAssessment,
                    dataRetentionPeriod: requestData.dataRetentionPeriod,
                    priority: requestData.priority || client_1.ResearchPriority.MEDIUM,
                    status: client_1.ResearchRequestStatus.PENDING_REVIEW,
                    ethicsStatus: requestData.requiresEthicsApproval ? client_1.EthicsStatus.PENDING : client_1.EthicsStatus.NOT_REQUIRED,
                    submittedAt: new Date(),
                    expiresAt: new Date(Date.now() + (365 * 24 * 60 * 60 * 1000)),
                    createdBy: userId,
                },
                include: {
                    principalInvestigator: true,
                    creator: true,
                    approvals: true,
                },
            });
            if (requestData.collaborationDetails && requestData.collaborationDetails.length > 0) {
                for (const collab of requestData.collaborationDetails) {
                    await this.createCollaboration({
                        researchRequestId: request.id,
                        ...collab,
                    }, userId);
                }
            }
            await this.initializeApprovalWorkflow(request.id, userId);
            await this.notifyNewResearchRequest(request);
            await this.auditLogService.log({
                userId,
                action: 'CREATE_RESEARCH_REQUEST',
                resource: 'research_request',
                resourceId: request.id,
                details: { title: request.title, studyType: request.studyType },
            });
            return request;
        }
        catch (error) {
            this.logger.error(`Error creating research request: ${error.message}`);
            throw error;
        }
    }
    async getResearchRequests(searchDto, userId) {
        try {
            const where = {};
            if (searchDto.search) {
                where.OR = [
                    { title: { contains: searchDto.search, mode: 'insensitive' } },
                    { description: { contains: searchDto.search, mode: 'insensitive' } },
                    { objectives: { contains: searchDto.search, mode: 'insensitive' } },
                ];
            }
            if (searchDto.status)
                where.status = searchDto.status;
            if (searchDto.studyType)
                where.studyType = searchDto.studyType;
            if (searchDto.ethicsStatus)
                where.ethicsStatus = searchDto.ethicsStatus;
            if (searchDto.priority)
                where.priority = searchDto.priority;
            if (searchDto.principalInvestigatorId)
                where.principalInvestigatorId = searchDto.principalInvestigatorId;
            if (searchDto.createdBy)
                where.createdBy = searchDto.createdBy;
            if (searchDto.fundingSource)
                where.fundingSource = { contains: searchDto.fundingSource, mode: 'insensitive' };
            if (searchDto.requiresEthicsApproval !== undefined)
                where.requiresEthicsApproval = searchDto.requiresEthicsApproval;
            if (searchDto.minSampleSize || searchDto.maxSampleSize) {
                where.sampleSize = {};
                if (searchDto.minSampleSize)
                    where.sampleSize.gte = searchDto.minSampleSize;
                if (searchDto.maxSampleSize)
                    where.sampleSize.lte = searchDto.maxSampleSize;
            }
            if (searchDto.minDuration || searchDto.maxDuration) {
                where.duration = {};
                if (searchDto.minDuration)
                    where.duration.gte = searchDto.minDuration;
                if (searchDto.maxDuration)
                    where.duration.lte = searchDto.maxDuration;
            }
            if (searchDto.submittedAfter || searchDto.submittedBefore) {
                where.submittedAt = {};
                if (searchDto.submittedAfter)
                    where.submittedAt.gte = new Date(searchDto.submittedAfter);
                if (searchDto.submittedBefore)
                    where.submittedAt.lte = new Date(searchDto.submittedBefore);
            }
            const skip = (searchDto.page - 1) * searchDto.limit;
            const orderBy = { [searchDto.sortBy]: searchDto.sortOrder };
            const [requests, total] = await Promise.all([
                this.prisma.researchRequest.findMany({
                    where,
                    skip,
                    take: searchDto.limit,
                    orderBy,
                    include: {
                        principalInvestigator: true,
                        creator: true,
                        approvals: true,
                        collaborations: true,
                        publications: true,
                        impactMetrics: true,
                    },
                }),
                this.prisma.researchRequest.count({ where }),
            ]);
            return {
                requests,
                pagination: {
                    page: searchDto.page,
                    limit: searchDto.limit,
                    total,
                    totalPages: Math.ceil(total / searchDto.limit),
                },
            };
        }
        catch (error) {
            this.logger.error(`Error fetching research requests: ${error.message}`);
            throw error;
        }
    }
    async getResearchRequestById(id, userId) {
        try {
            const request = await this.prisma.researchRequest.findUnique({
                where: { id },
                include: {
                    principalInvestigator: true,
                    creator: true,
                    approvals: {
                        include: {
                            approver: true,
                            delegatedTo: true,
                        },
                    },
                    collaborations: {
                        include: {
                            collaborator: true,
                        },
                    },
                    dataAccessSessions: true,
                    publications: true,
                    impactMetrics: {
                        include: {
                            verifier: true,
                        },
                    },
                },
            });
            if (!request) {
                throw new common_1.NotFoundException('Research request not found');
            }
            await this.checkResearchRequestAccess(request, userId);
            return request;
        }
        catch (error) {
            this.logger.error(`Error fetching research request ${id}: ${error.message}`);
            throw error;
        }
    }
    async createApproval(approvalData, userId) {
        try {
            const researchRequest = await this.prisma.researchRequest.findUnique({
                where: { id: approvalData.researchRequestId },
            });
            if (!researchRequest) {
                throw new common_1.NotFoundException('Research request not found');
            }
            await this.checkApprovalPermission(approvalData.level, userId);
            const existingApproval = await this.prisma.researchApproval.findFirst({
                where: {
                    researchRequestId: approvalData.researchRequestId,
                    level: approvalData.level,
                },
            });
            if (existingApproval) {
                throw new common_1.ConflictException('Approval already exists for this level');
            }
            const approval = await this.prisma.researchApproval.create({
                data: {
                    researchRequestId: approvalData.researchRequestId,
                    approverId: userId,
                    level: approvalData.level,
                    status: approvalData.status,
                    comments: approvalData.comments,
                    conditions: approvalData.conditions,
                    isFinal: approvalData.isFinal || false,
                    delegationAllowed: approvalData.delegationAllowed || false,
                    delegatedToId: approvalData.delegatedToId,
                    reviewedAt: new Date(),
                    approvedAt: approvalData.status === client_1.ApprovalStatus.APPROVED ? new Date() : null,
                    createdBy: userId,
                },
                include: {
                    researchRequest: true,
                    approver: true,
                    delegatedTo: true,
                },
            });
            await this.updateResearchRequestStatusAfterApproval(approval);
            await this.notifyApprovalUpdate(approval);
            await this.auditLogService.log({
                userId,
                action: 'CREATE_APPROVAL',
                resource: 'research_approval',
                resourceId: approval.id,
                details: {
                    researchRequestId: approval.researchRequestId,
                    level: approval.level,
                    status: approval.status,
                },
            });
            return approval;
        }
        catch (error) {
            this.logger.error(`Error creating approval: ${error.message}`);
            throw error;
        }
    }
    async getApprovalsByResearchRequest(researchRequestId, userId) {
        try {
            const researchRequest = await this.prisma.researchRequest.findUnique({
                where: { id: researchRequestId },
            });
            if (!researchRequest) {
                throw new common_1.NotFoundException('Research request not found');
            }
            await this.checkResearchRequestAccess(researchRequest, userId);
            const approvals = await this.prisma.researchApproval.findMany({
                where: { researchRequestId },
                include: {
                    approver: true,
                    delegatedTo: true,
                    creator: true,
                },
                orderBy: { level: 'asc' },
            });
            return approvals;
        }
        catch (error) {
            this.logger.error(`Error fetching approvals for research request ${researchRequestId}: ${error.message}`);
            throw error;
        }
    }
    async createCollaboration(collaborationData, userId) {
        try {
            const collaboration = await this.prisma.researchCollaboration.create({
                data: {
                    researchRequestId: collaborationData.researchRequestId,
                    collaboratorId: collaborationData.collaboratorId,
                    role: collaborationData.role,
                    responsibilities: collaborationData.responsibilities,
                    affiliation: collaborationData.affiliation,
                    email: collaborationData.email,
                    phone: collaborationData.phone,
                    expertise: collaborationData.expertise,
                    conflictOfInterest: collaborationData.conflictOfInterest,
                    dataAccessLevel: collaborationData.dataAccessLevel || client_1.DataAccessLevel.LIMITED,
                    status: client_1.CollaborationStatus.PENDING,
                    invitedAt: new Date(),
                    createdBy: userId,
                },
                include: {
                    researchRequest: true,
                    collaborator: true,
                },
            });
            await this.sendCollaborationInvitation(collaboration);
            await this.auditLogService.log({
                userId,
                action: 'CREATE_COLLABORATION',
                resource: 'research_collaboration',
                resourceId: collaboration.id,
                details: {
                    researchRequestId: collaboration.researchRequestId,
                    collaboratorId: collaboration.collaboratorId,
                    role: collaboration.role,
                },
            });
            return collaboration;
        }
        catch (error) {
            this.logger.error(`Error creating collaboration: ${error.message}`);
            throw error;
        }
    }
    async updateCollaborationStatus(id, status, userId) {
        try {
            const collaboration = await this.prisma.researchCollaboration.findUnique({
                where: { id },
                include: {
                    researchRequest: true,
                },
            });
            if (!collaboration) {
                throw new common_1.NotFoundException('Collaboration not found');
            }
            if (collaboration.collaboratorId !== userId) {
                throw new common_1.UnauthorizedException('Only the collaborator can update their status');
            }
            const updateData = { status };
            if (status === client_1.CollaborationStatus.ACCEPTED) {
                updateData.acceptedAt = new Date();
            }
            else if (status === client_1.CollaborationStatus.DECLINED) {
                updateData.declinedAt = new Date();
            }
            const updatedCollaboration = await this.prisma.researchCollaboration.update({
                where: { id },
                data: updateData,
                include: {
                    researchRequest: true,
                    collaborator: true,
                },
            });
            await this.notifyCollaborationStatusUpdate(updatedCollaboration);
            await this.auditLogService.log({
                userId,
                action: 'UPDATE_COLLABORATION_STATUS',
                resource: 'research_collaboration',
                resourceId: id,
                details: { status },
            });
            return updatedCollaboration;
        }
        catch (error) {
            this.logger.error(`Error updating collaboration status: ${error.message}`);
            throw error;
        }
    }
    async createDataAccessSession(sessionData, userId) {
        try {
            await this.validateDataAccessPermission(sessionData.researchRequestId, userId, sessionData.accessLevel);
            const session = await this.prisma.dataAccessSession.create({
                data: {
                    researchRequestId: sessionData.researchRequestId,
                    userId: sessionData.userId,
                    sessionType: sessionData.sessionType,
                    accessLevel: sessionData.accessLevel,
                    ipAddress: sessionData.ipAddress,
                    userAgent: sessionData.userAgent,
                    purpose: sessionData.purpose,
                    approvalReference: sessionData.approvalReference,
                    automatedMonitoring: sessionData.automatedMonitoring !== false,
                    startTime: new Date(),
                    createdBy: userId,
                },
                include: {
                    researchRequest: true,
                    user: true,
                },
            });
            await this.auditLogService.log({
                userId,
                action: 'CREATE_DATA_ACCESS_SESSION',
                resource: 'data_access_session',
                resourceId: session.id,
                details: {
                    researchRequestId: session.researchRequestId,
                    accessLevel: session.accessLevel,
                    sessionType: session.sessionType,
                },
            });
            return session;
        }
        catch (error) {
            this.logger.error(`Error creating data access session: ${error.message}`);
            throw error;
        }
    }
    async endDataAccessSession(id, endTime, dataAccessed, queriesExecuted, userId) {
        try {
            const session = await this.prisma.dataAccessSession.findUnique({
                where: { id },
            });
            if (!session) {
                throw new common_1.NotFoundException('Data access session not found');
            }
            if (session.userId !== userId && !await this.isAdmin(userId)) {
                throw new common_1.UnauthorizedException('Unauthorized to end this session');
            }
            const duration = Math.floor((endTime.getTime() - session.startTime.getTime()) / (1000 * 60));
            const complianceResult = await this.performComplianceCheck(session, dataAccessed, queriesExecuted);
            const updatedSession = await this.prisma.dataAccessSession.update({
                where: { id },
                data: {
                    endTime,
                    duration,
                    dataAccessed: JSON.stringify(dataAccessed),
                    queriesExecuted: JSON.stringify(queriesExecuted),
                    complianceStatus: complianceResult.status,
                    violationReason: complianceResult.violationReason,
                },
            });
            if (complianceResult.status !== client_1.ComplianceStatus.COMPLIANT) {
                await this.handleComplianceViolation(updatedSession, complianceResult);
            }
            await this.auditLogService.log({
                userId,
                action: 'END_DATA_ACCESS_SESSION',
                resource: 'data_access_session',
                resourceId: id,
                details: {
                    duration,
                    complianceStatus: complianceResult.status,
                    violationReason: complianceResult.violationReason,
                },
            });
            return updatedSession;
        }
        catch (error) {
            this.logger.error(`Error ending data access session: ${error.message}`);
            throw error;
        }
    }
    async getAggregateStatistics(queryDto, userId) {
        try {
            await this.checkAggregateDataAccess(userId);
            const query = await this.buildAggregateQuery(queryDto);
            const results = await this.executeAggregateQuery(query, queryDto.privacyThreshold);
            return {
                data: results,
                metadata: {
                    queryParameters: queryDto,
                    privacyThreshold: queryDto.privacyThreshold,
                    totalRecords: results.length,
                    generatedAt: new Date(),
                },
            };
        }
        catch (error) {
            this.logger.error(`Error getting aggregate statistics: ${error.message}`);
            throw error;
        }
    }
    async getGeographicData(geoDto, userId) {
        try {
            await this.checkGeographicDataAccess(userId);
            const where = {};
            if (geoDto.province)
                where.province = geoDto.province;
            if (geoDto.regency)
                where.regency = geoDto.regency;
            if (geoDto.cancerType)
                where.cancerType = geoDto.cancerType;
            if (geoDto.stage)
                where.stage = geoDto.stage;
            if (geoDto.year)
                where.year = geoDto.year;
            if (geoDto.month)
                where.month = geoDto.month;
            if (geoDto.gender)
                where.gender = geoDto.gender;
            if (geoDto.ageGroup)
                where.ageGroup = geoDto.ageGroup;
            if (geoDto.urbanRural)
                where.urbanRural = geoDto.urbanRural;
            if (geoDto.minCount || geoDto.maxCount) {
                where.count = {};
                if (geoDto.minCount)
                    where.count.gte = geoDto.minCount;
                if (geoDto.maxCount)
                    where.count.lte = geoDto.maxCount;
            }
            const skip = (geoDto.page - 1) * geoDto.limit;
            const [data, total] = await Promise.all([
                this.prisma.cancerGeographicData.findMany({
                    where,
                    skip,
                    take: geoDto.limit,
                    orderBy: [{ year: 'desc' }, { count: 'desc' }],
                }),
                this.prisma.cancerGeographicData.count({ where }),
            ]);
            const filteredData = data.filter(item => item.count >= (geoDto.privacyThreshold || 5));
            const processedData = filteredData.map(item => ({
                ...item,
                hasCoordinates: !!item.coordinates,
                mapReady: geoDto.includeCoordinates && item.coordinates,
            }));
            return {
                data: processedData,
                metadata: {
                    queryParameters: geoDto,
                    privacyThreshold: geoDto.privacyThreshold || 5,
                    totalRecords: total,
                    filteredRecords: processedData.length,
                    generatedAt: new Date(),
                },
                pagination: {
                    page: geoDto.page,
                    limit: geoDto.limit,
                    total,
                    totalPages: Math.ceil(total / geoDto.limit),
                },
            };
        }
        catch (error) {
            this.logger.error(`Error getting geographic data: ${error.message}`);
            throw error;
        }
    }
    async createImpactMetric(metricData, userId) {
        try {
            const researchRequest = await this.prisma.researchRequest.findUnique({
                where: { id: metricData.researchRequestId },
            });
            if (!researchRequest) {
                throw new common_1.NotFoundException('Research request not found');
            }
            await this.checkResearchRequestAccess(researchRequest, userId);
            const metric = await this.prisma.researchImpactMetric.create({
                data: {
                    researchRequestId: metricData.researchRequestId,
                    metricType: metricData.metricType,
                    value: metricData.value,
                    unit: metricData.unit,
                    description: metricData.description,
                    date: metricData.date,
                    source: metricData.source,
                    methodology: metricData.methodology,
                    baseline: metricData.baseline,
                    target: metricData.target,
                    category: metricData.category,
                    tags: metricData.tags,
                    notes: metricData.notes,
                    isVerified: false,
                    createdBy: userId,
                },
            });
            await this.auditLogService.log({
                userId,
                action: 'CREATE_IMPACT_METRIC',
                resource: 'research_impact_metric',
                resourceId: metric.id,
                details: {
                    researchRequestId: metric.researchRequestId,
                    metricType: metric.metricType,
                    value: metric.value,
                },
            });
            return metric;
        }
        catch (error) {
            this.logger.error(`Error creating impact metric: ${error.message}`);
            throw error;
        }
    }
    async getImpactMetrics(searchDto, userId) {
        try {
            const where = {};
            if (searchDto.researchRequestId)
                where.researchRequestId = searchDto.researchRequestId;
            if (searchDto.metricType)
                where.metricType = searchDto.metricType;
            if (searchDto.category)
                where.category = { contains: searchDto.category, mode: 'insensitive' };
            if (searchDto.isVerified !== undefined)
                where.isVerified = searchDto.isVerified;
            if (searchDto.dateFrom || searchDto.dateTo) {
                where.date = {};
                if (searchDto.dateFrom)
                    where.date.gte = new Date(searchDto.dateFrom);
                if (searchDto.dateTo)
                    where.date.lte = new Date(searchDto.dateTo);
            }
            const skip = (searchDto.page - 1) * searchDto.limit;
            const [metrics, total] = await Promise.all([
                this.prisma.researchImpactMetric.findMany({
                    where,
                    skip,
                    take: searchDto.limit,
                    orderBy: { date: 'desc' },
                    include: {
                        researchRequest: true,
                        verifier: true,
                        creator: true,
                    },
                }),
                this.prisma.researchImpactMetric.count({ where }),
            ]);
            return {
                metrics,
                pagination: {
                    page: searchDto.page,
                    limit: searchDto.limit,
                    total,
                    totalPages: Math.ceil(total / searchDto.limit),
                },
            };
        }
        catch (error) {
            this.logger.error(`Error fetching impact metrics: ${error.message}`);
            throw error;
        }
    }
    async validateResearchRequest(requestData, userId) {
        const pi = await this.prisma.user.findUnique({
            where: { id: requestData.principalInvestigatorId },
        });
        if (!pi || !pi.isActive) {
            throw new common_1.BadRequestException('Principal investigator not found or inactive');
        }
        if (requestData.sampleSize <= 0) {
            throw new common_1.BadRequestException('Sample size must be greater than 0');
        }
        if (requestData.duration <= 0 || requestData.duration > 120) {
            throw new common_1.BadRequestException('Duration must be between 1 and 120 months');
        }
        const hasPermission = await this.checkUserPermission(userId, 'RESEARCH_CREATE');
        if (!hasPermission) {
            throw new common_1.UnauthorizedException('Insufficient permissions to create research requests');
        }
    }
    async initializeApprovalWorkflow(researchRequestId, userId) {
        const researchRequest = await this.prisma.researchRequest.findUnique({
            where: { id: researchRequestId },
        });
        if (!researchRequest) {
            throw new common_1.NotFoundException('Research request not found');
        }
        const requiredLevels = this.determineRequiredApprovalLevels(researchRequest);
        for (const level of requiredLevels) {
            await this.prisma.researchApproval.create({
                data: {
                    researchRequestId,
                    level,
                    status: client_1.ApprovalStatus.PENDING,
                    reviewedAt: new Date(),
                    createdBy: userId,
                },
            });
        }
    }
    determineRequiredApprovalLevels(request) {
        const levels = [];
        levels.push(client_1.ApprovalLevel.CENTER_DIRECTOR);
        if (JSON.parse(request.dataRequested || '[]').length > 0) {
            levels.push(client_1.ApprovalLevel.DATA_STEWARD);
        }
        if (request.confidentialityRequirements || request.dataRetentionPeriod) {
            levels.push(client_1.ApprovalLevel.PRIVACY_OFFICER);
        }
        if (request.requiresEthicsApproval) {
            levels.push(client_1.ApprovalLevel.ETHICS_COMMITTEE);
        }
        if (request.sampleSize > 1000 || request.collaborators) {
            levels.push(client_1.ApprovalLevel.NATIONAL_ADMIN);
        }
        return levels;
    }
    async checkApprovalPermission(level, userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { userRoles: { include: { role: { include: { permissions: true } } } } },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const hasPermission = user.userRoles.some(userRole => userRole.role.permissions.some(permission => permission.code === `APPROVE_${level}` || permission.code === 'ADMIN_ALL'));
        if (!hasPermission) {
            throw new common_1.ForbiddenException(`Insufficient permissions for approval level: ${level}`);
        }
    }
    async checkResearchRequestAccess(request, userId) {
        if (request.createdBy === userId || request.principalInvestigatorId === userId) {
            return;
        }
        const isCollaborator = await this.prisma.researchCollaboration.findFirst({
            where: {
                researchRequestId: request.id,
                collaboratorId: userId,
                status: client_1.CollaborationStatus.ACCEPTED,
            },
        });
        if (isCollaborator) {
            return;
        }
        const isApprover = await this.prisma.researchApproval.findFirst({
            where: {
                researchRequestId: request.id,
                approverId: userId,
            },
        });
        if (isApprover) {
            return;
        }
        const hasAdminPermission = await this.checkUserPermission(userId, 'RESEARCH_VIEW_ALL');
        if (hasAdminPermission) {
            return;
        }
        throw new common_1.UnauthorizedException('Access denied to this research request');
    }
    async validateDataAccessPermission(researchRequestId, userId, accessLevel) {
        const request = await this.prisma.researchRequest.findUnique({
            where: { id: researchRequestId },
            include: {
                approvals: true,
                collaborations: {
                    where: {
                        collaboratorId: userId,
                        status: client_1.CollaborationStatus.ACCEPTED,
                    },
                },
            },
        });
        if (!request) {
            throw new common_1.NotFoundException('Research request not found');
        }
        const isApproved = request.approvals.some(approval => approval.status === client_1.ApprovalStatus.APPROVED);
        if (!isApproved) {
            throw new common_1.ForbiddenException('Research request is not approved for data access');
        }
        const hasAccess = request.principalInvestigatorId === userId ||
            request.createdBy === userId ||
            request.collaborations.length > 0;
        if (!hasAccess) {
            throw new common_1.UnauthorizedException('No access to this research request data');
        }
        if (accessLevel === client_1.DataAccessLevel.FULL_ACCESS) {
            const hasFullAccessPermission = await this.checkUserPermission(userId, 'DATA_ACCESS_FULL');
            if (!hasFullAccessPermission) {
                throw new common_1.ForbiddenException('Insufficient permissions for full data access');
            }
        }
    }
    async checkAggregateDataAccess(userId) {
        const hasPermission = await this.checkUserPermission(userId, 'DATA_ACCESS_AGGREGATE');
        if (!hasPermission) {
            throw new common_1.UnauthorizedException('Insufficient permissions for aggregate data access');
        }
    }
    async checkGeographicDataAccess(userId) {
        const hasPermission = await this.checkUserPermission(userId, 'DATA_ACCESS_GEOGRAPHIC');
        if (!hasPermission) {
            throw new common_1.UnauthorizedException('Insufficient permissions for geographic data access');
        }
    }
    async checkUserPermission(userId, permissionCode) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                userRoles: {
                    include: {
                        role: {
                            include: {
                                permissions: true,
                            },
                        },
                    },
                },
            },
        });
        if (!user) {
            return false;
        }
        return user.userRoles.some(userRole => userRole.role.permissions.some(permission => permission.code === permissionCode || permission.code === 'ADMIN_ALL'));
    }
    async isAdmin(userId) {
        return await this.checkUserPermission(userId, 'ADMIN_ALL');
    }
    async buildAggregateQuery(queryDto) {
        const query = {
            select: {
                cancerType: true,
                year: true,
            },
        };
        if (queryDto.groupBy) {
            query.groupBy = [queryDto.groupBy];
        }
        if (queryDto.aggregateFunction && queryDto.aggregateFunction !== 'sum') {
            query._sum = { count: true };
            query._avg = { incidenceRate: true };
        }
        return query;
    }
    async executeAggregateQuery(query, privacyThreshold) {
        const results = await this.prisma.cancerAggregateStats.findMany({
            ...query,
        });
        return results.filter(result => {
            if (result.totalCases && result.totalCases < privacyThreshold)
                return false;
            if (result.maleCases && result.maleCases < privacyThreshold)
                return false;
            if (result.femaleCases && result.femaleCases < privacyThreshold)
                return false;
            return true;
        });
    }
    async performComplianceCheck(session, dataAccessed, queriesExecuted) {
        let status = client_1.ComplianceStatus.COMPLIANT;
        let violationReason = null;
        const accessCount = Array.isArray(dataAccessed) ? dataAccessed.length : 0;
        const queryCount = Array.isArray(queriesExecuted) ? queriesExecuted.length : 0;
        if (accessCount > 1000) {
            status = client_1.ComplianceStatus.WARNING;
            violationReason = 'High volume data access detected';
        }
        if (session.duration && session.duration > 480) {
            status = client_1.ComplianceStatus.WARNING;
            violationReason = 'Extended session duration detected';
        }
        if (dataAccessed && JSON.stringify(dataAccessed).includes('SSN')) {
            status = client_1.ComplianceStatus.VIOLATION;
            violationReason = 'Attempted access to prohibited data fields';
        }
        return { status, violationReason };
    }
    async handleComplianceViolation(session, complianceResult) {
        await this.auditLogService.log({
            userId: session.userId,
            action: 'COMPLIANCE_VIOLATION',
            resource: 'data_access_session',
            resourceId: session.id,
            details: {
                violationReason: complianceResult.violationReason,
                sessionId: session.id,
            },
        });
        this.logger.warn(`Compliance violation detected: ${complianceResult.violationReason}`, {
            sessionId: session.id,
            userId: session.userId,
        });
    }
    async updateResearchRequestStatusAfterApproval(approval) {
        const request = await this.prisma.researchRequest.findUnique({
            where: { id: approval.researchRequestId },
            include: { approvals: true },
        });
        if (!request)
            return;
        const allApprovals = request.approvals;
        const approvedCount = allApprovals.filter(a => a.status === client_1.ApprovalStatus.APPROVED).length;
        const rejectedCount = allApprovals.filter(a => a.status === client_1.ApprovalStatus.REJECTED).length;
        if (rejectedCount > 0) {
            await this.prisma.researchRequest.update({
                where: { id: request.id },
                data: {
                    status: client_1.ResearchRequestStatus.REJECTED,
                    rejectedAt: new Date(),
                },
            });
        }
        else if (approvedCount === allApprovals.length) {
            await this.prisma.researchRequest.update({
                where: { id: request.id },
                data: {
                    status: client_1.ResearchRequestStatus.APPROVED,
                    approvedAt: new Date(),
                },
            });
        }
        else {
            await this.prisma.researchRequest.update({
                where: { id: request.id },
                data: { status: client_1.ResearchRequestStatus.UNDER_REVIEW },
            });
        }
    }
    async notifyNewResearchRequest(request) {
        await this.emailService.sendNotification({
            to: ['admin@inamsos.go.id'],
            subject: `New Research Request: ${request.title}`,
            template: 'research-request-created',
            data: request,
        });
    }
    async notifyApprovalUpdate(approval) {
        await this.emailService.sendNotification({
            to: [approval.researchRequest.creator.email],
            subject: `Approval Update: ${approval.researchRequest.title}`,
            template: 'approval-update',
            data: approval,
        });
    }
    async sendCollaborationInvitation(collaboration) {
        await this.emailService.sendNotification({
            to: [collaboration.collaborator.email],
            subject: `Research Collaboration Invitation: ${collaboration.researchRequest.title}`,
            template: 'collaboration-invitation',
            data: collaboration,
        });
    }
    async notifyCollaborationStatusUpdate(collaboration) {
        await this.emailService.sendNotification({
            to: [collaboration.researchRequest.creator.email],
            subject: `Collaboration Status Update: ${collaboration.collaborator.name}`,
            template: 'collaboration-status-update',
            data: collaboration,
        });
    }
    async updateResearchRequest(id, updateData, userId) {
        try {
            const existingRequest = await this.prisma.researchRequest.findUnique({
                where: { id },
            });
            if (!existingRequest) {
                throw new common_1.NotFoundException('Research request not found');
            }
            if (existingRequest.createdBy !== userId && existingRequest.principalInvestigatorId !== userId) {
                const hasAdminPermission = await this.checkUserPermission(userId, 'RESEARCH_UPDATE_ALL');
                if (!hasAdminPermission) {
                    throw new common_1.UnauthorizedException('Cannot update this research request');
                }
            }
            const allowedStatuses = [client_1.ResearchRequestStatus.DRAFT, client_1.ResearchRequestStatus.PENDING_REVIEW];
            if (!allowedStatuses.includes(existingRequest.status)) {
                throw new common_1.BadRequestException('Cannot update research request in current status');
            }
            const updatedRequest = await this.prisma.researchRequest.update({
                where: { id },
                data: updateData,
                include: {
                    principalInvestigator: true,
                    creator: true,
                    approvals: true,
                    collaborations: true,
                },
            });
            await this.auditLogService.log({
                userId,
                action: 'UPDATE_RESEARCH_REQUEST',
                resource: 'research_request',
                resourceId: id,
                details: updateData,
            });
            return updatedRequest;
        }
        catch (error) {
            this.logger.error(`Error updating research request ${id}: ${error.message}`);
            throw error;
        }
    }
    async updateApproval(id, updateData, userId) {
        try {
            const existingApproval = await this.prisma.researchApproval.findUnique({
                where: { id },
            });
            if (!existingApproval) {
                throw new common_1.NotFoundException('Approval not found');
            }
            if (existingApproval.approverId !== userId) {
                const hasAdminPermission = await this.checkUserPermission(userId, 'RESEARCH_APPROVE_ALL');
                if (!hasAdminPermission) {
                    throw new common_1.UnauthorizedException('Cannot update this approval');
                }
            }
            const updatedApproval = await this.prisma.researchApproval.update({
                where: { id },
                data: {
                    ...updateData,
                    approvedAt: updateData.status === client_1.ApprovalStatus.APPROVED ? new Date() : existingApproval.approvedAt,
                },
                include: {
                    researchRequest: true,
                    approver: true,
                    delegatedTo: true,
                },
            });
            await this.updateResearchRequestStatusAfterApproval(updatedApproval);
            await this.auditLogService.log({
                userId,
                action: 'UPDATE_APPROVAL',
                resource: 'research_approval',
                resourceId: id,
                details: updateData,
            });
            return updatedApproval;
        }
        catch (error) {
            this.logger.error(`Error updating approval ${id}: ${error.message}`);
            throw error;
        }
    }
    async getMyApprovals(query, userId) {
        try {
            const where = { approverId: userId };
            if (query.status)
                where.status = query.status;
            const approvals = await this.prisma.researchApproval.findMany({
                where,
                include: {
                    researchRequest: {
                        include: {
                            principalInvestigator: true,
                            creator: true,
                        },
                    },
                },
                orderBy: { reviewedAt: 'desc' },
            });
            return approvals;
        }
        catch (error) {
            this.logger.error(`Error fetching my approvals: ${error.message}`);
            throw error;
        }
    }
    async getCollaborations(researchRequestId, searchDto, userId) {
        try {
            const researchRequest = await this.prisma.researchRequest.findUnique({
                where: { id: researchRequestId },
            });
            if (!researchRequest) {
                throw new common_1.NotFoundException('Research request not found');
            }
            await this.checkResearchRequestAccess(researchRequest, userId);
            const where = { researchRequestId };
            if (searchDto.status)
                where.status = searchDto.status;
            if (searchDto.role)
                where.role = searchDto.role;
            const skip = (searchDto.page - 1) * searchDto.limit;
            const [collaborations, total] = await Promise.all([
                this.prisma.researchCollaboration.findMany({
                    where,
                    skip,
                    take: searchDto.limit,
                    include: {
                        collaborator: true,
                    },
                    orderBy: { createdAt: 'desc' },
                }),
                this.prisma.researchCollaboration.count({ where }),
            ]);
            return {
                collaborations,
                pagination: {
                    page: searchDto.page,
                    limit: searchDto.limit,
                    total,
                    totalPages: Math.ceil(total / searchDto.limit),
                },
            };
        }
        catch (error) {
            this.logger.error(`Error fetching collaborations: ${error.message}`);
            throw error;
        }
    }
    async getMyCollaborations(query, userId) {
        try {
            const where = { collaboratorId: userId };
            if (query.status)
                where.status = query.status;
            const collaborations = await this.prisma.researchCollaboration.findMany({
                where,
                include: {
                    researchRequest: {
                        include: {
                            principalInvestigator: true,
                            creator: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            });
            return collaborations;
        }
        catch (error) {
            this.logger.error(`Error fetching my collaborations: ${error.message}`);
            throw error;
        }
    }
    async getDataAccessSessions(searchDto, userId) {
        try {
            const hasAuditPermission = await this.checkUserPermission(userId, 'DATA_ACCESS_AUDIT_ALL');
            const where = {};
            if (!hasAuditPermission) {
                where.userId = userId;
            }
            if (searchDto.researchRequestId)
                where.researchRequestId = searchDto.researchRequestId;
            if (searchDto.userId && hasAuditPermission)
                where.userId = searchDto.userId;
            if (searchDto.sessionType)
                where.sessionType = searchDto.sessionType;
            if (searchDto.accessLevel)
                where.accessLevel = searchDto.accessLevel;
            if (searchDto.complianceStatus)
                where.complianceStatus = searchDto.complianceStatus;
            if (searchDto.ipAddress)
                where.ipAddress = { contains: searchDto.ipAddress };
            if (searchDto.dateFrom || searchDto.dateTo) {
                where.startTime = {};
                if (searchDto.dateFrom)
                    where.startTime.gte = new Date(searchDto.dateFrom);
                if (searchDto.dateTo)
                    where.startTime.lte = new Date(searchDto.dateTo);
            }
            const skip = (searchDto.page - 1) * searchDto.limit;
            const [sessions, total] = await Promise.all([
                this.prisma.dataAccessSession.findMany({
                    where,
                    skip,
                    take: searchDto.limit,
                    include: {
                        researchRequest: true,
                        user: true,
                    },
                    orderBy: { startTime: 'desc' },
                }),
                this.prisma.dataAccessSession.count({ where }),
            ]);
            return {
                sessions,
                pagination: {
                    page: searchDto.page,
                    limit: searchDto.limit,
                    total,
                    totalPages: Math.ceil(total / searchDto.limit),
                },
            };
        }
        catch (error) {
            this.logger.error(`Error fetching data access sessions: ${error.message}`);
            throw error;
        }
    }
    async getMyDataAccessSessions(query, userId) {
        try {
            const where = { userId };
            if (query.sessionType)
                where.sessionType = query.sessionType;
            if (query.complianceStatus)
                where.complianceStatus = query.complianceStatus;
            const sessions = await this.prisma.dataAccessSession.findMany({
                where,
                include: {
                    researchRequest: true,
                },
                orderBy: { startTime: 'desc' },
            });
            return sessions;
        }
        catch (error) {
            this.logger.error(`Error fetching my data access sessions: ${error.message}`);
            throw error;
        }
    }
    async getImpactMetrics(researchRequestId, searchDto, userId) {
        try {
            const researchRequest = await this.prisma.researchRequest.findUnique({
                where: { id: researchRequestId },
            });
            if (!researchRequest) {
                throw new common_1.NotFoundException('Research request not found');
            }
            await this.checkResearchRequestAccess(researchRequest, userId);
            const where = { researchRequestId };
            if (searchDto.metricType)
                where.metricType = searchDto.metricType;
            if (searchDto.category)
                where.category = { contains: searchDto.category, mode: 'insensitive' };
            if (searchDto.isVerified !== undefined)
                where.isVerified = searchDto.isVerified;
            if (searchDto.dateFrom || searchDto.dateTo) {
                where.date = {};
                if (searchDto.dateFrom)
                    where.date.gte = new Date(searchDto.dateFrom);
                if (searchDto.dateTo)
                    where.date.lte = new Date(searchDto.dateTo);
            }
            const skip = (searchDto.page - 1) * searchDto.limit;
            const [metrics, total] = await Promise.all([
                this.prisma.researchImpactMetric.findMany({
                    where,
                    skip,
                    take: searchDto.limit,
                    include: {
                        verifier: true,
                        creator: true,
                    },
                    orderBy: { date: 'desc' },
                }),
                this.prisma.researchImpactMetric.count({ where }),
            ]);
            return {
                metrics,
                pagination: {
                    page: searchDto.page,
                    limit: searchDto.limit,
                    total,
                    totalPages: Math.ceil(total / searchDto.limit),
                },
            };
        }
        catch (error) {
            this.logger.error(`Error fetching impact metrics: ${error.message}`);
            throw error;
        }
    }
    async createPublication(publicationData, userId) {
        try {
            const publication = await this.prisma.researchPublication.create({
                data: {
                    researchRequestId: publicationData.researchRequestId,
                    title: publicationData.title,
                    abstract: publicationData.abstract,
                    authors: publicationData.authors,
                    journal: publicationData.journal,
                    publicationDate: publicationData.publicationDate,
                    volume: publicationData.volume,
                    issue: publicationData.issue,
                    pages: publicationData.pages,
                    doi: publicationData.doi,
                    pmid: publicationData.pmid,
                    publicationType: publicationData.publicationType,
                    keywords: publicationData.keywords,
                    openAccess: publicationData.openAccess,
                    license: publicationData.license,
                    fundingAcknowledged: publicationData.fundingAcknowledged,
                    dataAvailability: publicationData.dataAvailability,
                    ethicalConsiderations: publicationData.ethicalConsiderations,
                    limitations: publicationData.limitations,
                    conflictsOfInterest: publicationData.conflictsOfInterest,
                    createdBy: userId,
                },
            });
            await this.auditLogService.log({
                userId,
                action: 'CREATE_PUBLICATION',
                resource: 'research_publication',
                resourceId: publication.id,
                details: {
                    researchRequestId: publication.researchRequestId,
                    title: publication.title,
                },
            });
            return publication;
        }
        catch (error) {
            this.logger.error(`Error creating publication: ${error.message}`);
            throw error;
        }
    }
    async getPublications(researchRequestId, searchDto, userId) {
        try {
            const researchRequest = await this.prisma.researchRequest.findUnique({
                where: { id: researchRequestId },
            });
            if (!researchRequest) {
                throw new common_1.NotFoundException('Research request not found');
            }
            await this.checkResearchRequestAccess(researchRequest, userId);
            const where = { researchRequestId };
            if (searchDto.publicationType)
                where.publicationType = searchDto.publicationType;
            if (searchDto.journal)
                where.journal = { contains: searchDto.journal, mode: 'insensitive' };
            if (searchDto.doi)
                where.doi = { contains: searchDto.doi };
            if (searchDto.pmid)
                where.pmid = { contains: searchDto.pmid };
            if (searchDto.openAccess !== undefined)
                where.openAccess = searchDto.openAccess;
            if (searchDto.year) {
                where.publicationDate = {
                    gte: new Date(`${searchDto.year}-01-01`),
                    lte: new Date(`${searchDto.year}-12-31`),
                };
            }
            const skip = (searchDto.page - 1) * searchDto.limit;
            const [publications, total] = await Promise.all([
                this.prisma.researchPublication.findMany({
                    where,
                    skip,
                    take: searchDto.limit,
                    orderBy: { createdAt: 'desc' },
                }),
                this.prisma.researchPublication.count({ where }),
            ]);
            return {
                publications,
                pagination: {
                    page: searchDto.page,
                    limit: searchDto.limit,
                    total,
                    totalPages: Math.ceil(total / searchDto.limit),
                },
            };
        }
        catch (error) {
            this.logger.error(`Error fetching publications: ${error.message}`);
            throw error;
        }
    }
    async getDashboardOverview(userId) {
        try {
            const [totalRequests, pendingRequests, approvedRequests, myRequests, myApprovals, activeCollaborations, recentPublications,] = await Promise.all([
                this.prisma.researchRequest.count({}),
                this.prisma.researchRequest.count({ where: { status: client_1.ResearchRequestStatus.PENDING_REVIEW } }),
                this.prisma.researchRequest.count({ where: { status: client_1.ResearchRequestStatus.APPROVED } }),
                this.prisma.researchRequest.count({ where: { createdBy: userId } }),
                this.prisma.researchApproval.count({ where: { approverId: userId, status: client_1.ApprovalStatus.PENDING } }),
                this.prisma.researchCollaboration.count({ where: { collaboratorId: userId, status: client_1.CollaborationStatus.ACTIVE } }),
                this.prisma.researchPublication.count({ where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } }),
            ]);
            return {
                overview: {
                    totalRequests,
                    pendingRequests,
                    approvedRequests,
                    myRequests,
                    myApprovals,
                    activeCollaborations,
                    recentPublications,
                },
            };
        }
        catch (error) {
            this.logger.error(`Error fetching dashboard overview: ${error.message}`);
            throw error;
        }
    }
    async getWorkflowAnalytics(query, userId) {
        try {
            const hasAnalyticsPermission = await this.checkUserPermission(userId, 'RESEARCH_ANALYTICS');
            if (!hasAnalyticsPermission) {
                throw new common_1.UnauthorizedException('Insufficient permissions for workflow analytics');
            }
            const dateRange = query.dateRange || '30';
            const fromDate = new Date(Date.now() - parseInt(dateRange) * 24 * 60 * 60 * 1000);
            const [requestsByStatus, requestsByType, averageApprovalTime, complianceRate,] = await Promise.all([
                this.prisma.researchRequest.groupBy({
                    by: ['status'],
                    where: { createdAt: { gte: fromDate } },
                    _count: { status: true },
                }),
                this.prisma.researchRequest.groupBy({
                    by: ['studyType'],
                    where: { createdAt: { gte: fromDate } },
                    _count: { studyType: true },
                }),
                this.getAverageApprovalTime(fromDate),
                this.getComplianceRate(fromDate),
            ]);
            return {
                dateRange,
                requestsByStatus,
                requestsByType,
                averageApprovalTime,
                complianceRate,
            };
        }
        catch (error) {
            this.logger.error(`Error fetching workflow analytics: ${error.message}`);
            throw error;
        }
    }
    async getComplianceAnalytics(query, userId) {
        try {
            const hasAuditPermission = await this.checkUserPermission(userId, 'DATA_ACCESS_AUDIT_ALL');
            if (!hasAuditPermission) {
                throw new common_1.UnauthorizedException('Insufficient permissions for compliance analytics');
            }
            const dateRange = query.dateRange || '30';
            const fromDate = new Date(Date.now() - parseInt(dateRange) * 24 * 60 * 60 * 1000);
            const [sessionsByStatus, totalSessions, violationCount,] = await Promise.all([
                this.prisma.dataAccessSession.groupBy({
                    by: ['complianceStatus'],
                    where: { startTime: { gte: fromDate } },
                    _count: { complianceStatus: true },
                }),
                this.prisma.dataAccessSession.count({ where: { startTime: { gte: fromDate } } }),
                this.prisma.dataAccessSession.count({
                    where: {
                        startTime: { gte: fromDate },
                        complianceStatus: { in: [client_1.ComplianceStatus.VIOLATION, client_1.ComplianceStatus.WARNING] },
                    },
                }),
            ]);
            return {
                dateRange,
                totalSessions,
                violationCount,
                complianceRate: totalSessions > 0 ? ((totalSessions - violationCount) / totalSessions) * 100 : 0,
                sessionsByStatus,
            };
        }
        catch (error) {
            this.logger.error(`Error fetching compliance analytics: ${error.message}`);
            throw error;
        }
    }
    async getResearchStats(userId) {
        try {
            const stats = await this.prisma.researchRequest.aggregate({
                _count: { id: true },
                where: {
                    createdAt: { gte: new Date(new Date().getFullYear(), 0, 1) },
                },
            });
            const statusBreakdown = await this.prisma.researchRequest.groupBy({
                by: ['status'],
                _count: { status: true },
                where: {
                    createdAt: { gte: new Date(new Date().getFullYear(), 0, 1) },
                },
            });
            return {
                totalThisYear: stats._count.id,
                statusBreakdown,
            };
        }
        catch (error) {
            this.logger.error(`Error fetching research stats: ${error.message}`);
            throw error;
        }
    }
    async exportCleanData(query, res, userId) {
        try {
            await this.validateDataAccessPermission(query.researchRequestId, userId, client_1.DataAccessLevel.AGGREGATE_ONLY);
            const format = query.format || 'csv';
            res.setHeader('Content-Type', this.getContentType(format));
            res.setHeader('Content-Disposition', `attachment; filename="research-data-${Date.now()}.${format}"`);
            res.end('Data export functionality to be implemented');
        }
        catch (error) {
            this.logger.error(`Error exporting research data: ${error.message}`);
            throw error;
        }
    }
    async validateResearchRequest(requestData, userId) {
        try {
            const validationErrors = [];
            if (!requestData.title?.trim())
                validationErrors.push('Title is required');
            if (!requestData.description?.trim())
                validationErrors.push('Description is required');
            if (!requestData.objectives?.trim())
                validationErrors.push('Objectives are required');
            if (!requestData.methodology?.trim())
                validationErrors.push('Methodology is required');
            if (!requestData.principalInvestigatorId)
                validationErrors.push('Principal investigator is required');
            if (!requestData.studyType)
                validationErrors.push('Study type is required');
            if (!requestData.sampleSize || requestData.sampleSize <= 0) {
                validationErrors.push('Sample size must be greater than 0');
            }
            if (!requestData.duration || requestData.duration <= 0 || requestData.duration > 120) {
                validationErrors.push('Duration must be between 1 and 120 months');
            }
            if (requestData.principalInvestigatorId) {
                const pi = await this.prisma.user.findUnique({
                    where: { id: requestData.principalInvestigatorId },
                });
                if (!pi || !pi.isActive) {
                    validationErrors.push('Principal investigator not found or inactive');
                }
            }
            if (requestData.dataRequested) {
                try {
                    JSON.parse(requestData.dataRequested);
                }
                catch {
                    validationErrors.push('Data requested must be valid JSON');
                }
            }
            return {
                isValid: validationErrors.length === 0,
                errors: validationErrors,
            };
        }
        catch (error) {
            this.logger.error(`Error validating research request: ${error.message}`);
            throw error;
        }
    }
    async getAverageApprovalTime(fromDate) {
        const approvals = await this.prisma.researchApproval.findMany({
            where: {
                createdAt: { gte: fromDate },
                approvedAt: { not: null },
            },
            select: {
                createdAt: true,
                approvedAt: true,
            },
        });
        if (approvals.length === 0)
            return 0;
        const totalDays = approvals.reduce((sum, approval) => {
            const days = Math.ceil((approval.approvedAt.getTime() - approval.createdAt.getTime()) / (1000 * 60 * 60 * 24));
            return sum + days;
        }, 0);
        return Math.round(totalDays / approvals.length);
    }
    async getComplianceRate(fromDate) {
        const [total, compliant] = await Promise.all([
            this.prisma.dataAccessSession.count({
                where: { startTime: { gte: fromDate } },
            }),
            this.prisma.dataAccessSession.count({
                where: {
                    startTime: { gte: fromDate },
                    complianceStatus: client_1.ComplianceStatus.COMPLIANT,
                },
            }),
        ]);
        return total > 0 ? (compliant / total) * 100 : 100;
    }
    getContentType(format) {
        switch (format.toLowerCase()) {
            case 'csv':
                return 'text/csv';
            case 'json':
                return 'application/json';
            case 'xlsx':
                return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            default:
                return 'text/csv';
        }
    }
};
exports.ResearchSprint3Service = ResearchSprint3Service;
exports.ResearchSprint3Service = ResearchSprint3Service = ResearchSprint3Service_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditLogService,
        email_service_1.EmailService])
], ResearchSprint3Service);
//# sourceMappingURL=research.service.sprint3.js.map