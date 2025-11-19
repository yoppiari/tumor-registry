import { Injectable, Logger, NotFoundException, BadRequestException, ConflictException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { AuditLogService } from '@/audit/audit.service';
import { EmailService } from '@/auth/email.service';
import {
  ResearchRequestStatus,
  StudyType,
  EthicsStatus,
  ResearchPriority,
  ApprovalLevel,
  ApprovalStatus,
  CollaborationStatus,
  DataAccessLevel,
  SessionType,
  ComplianceStatus,
  PublicationType,
  ImpactMetricType,
  DataQuality
} from '@prisma/client';

@Injectable()
export class ResearchSprint3Service {
  private readonly logger = new Logger(ResearchSprint3Service.name);

  constructor(
    private prisma: PrismaService,
    private auditLogService: AuditLogService,
    private emailService: EmailService
  ) {}

  // ========== RESEARCH REQUESTS ==========
  async createResearchRequest(requestData: any, userId: string) {
    try {
      // Validate user permissions and data
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
          priority: requestData.priority || ResearchPriority.MEDIUM,
          status: ResearchRequestStatus.PENDING_REVIEW,
          ethicsStatus: requestData.requiresEthicsApproval ? EthicsStatus.PENDING : EthicsStatus.NOT_REQUIRED,
          submittedAt: new Date(),
          expiresAt: new Date(Date.now() + (365 * 24 * 60 * 60 * 1000)), // 1 year
          createdBy: userId,
        },
        include: {
          principalInvestigator: true,
          creator: true,
          approvals: true,
        },
      });

      // Create collaborations if provided
      if (requestData.collaborationDetails && requestData.collaborationDetails.length > 0) {
        for (const collab of requestData.collaborationDetails) {
          await this.createCollaboration({
            researchRequestId: request.id,
            ...collab,
          }, userId);
        }
      }

      // Initialize approval workflow
      await this.initializeApprovalWorkflow(request.id, userId);

      // Send notifications
      await this.notifyNewResearchRequest(request);

      await this.auditLogService.log({
        userId,
        action: 'CREATE_RESEARCH_REQUEST',
        resource: 'research_request',
        resourceId: request.id,
        details: { title: request.title, studyType: request.studyType },
      });

      return request;
    } catch (error) {
      this.logger.error(`Error creating research request: ${error.message}`);
      throw error;
    }
  }

  async getResearchRequests(searchDto: any, userId: string) {
    try {
      const where: any = {};

      if (searchDto.search) {
        where.OR = [
          { title: { contains: searchDto.search, mode: 'insensitive' } },
          { description: { contains: searchDto.search, mode: 'insensitive' } },
          { objectives: { contains: searchDto.search, mode: 'insensitive' } },
        ];
      }

      if (searchDto.status) where.status = searchDto.status;
      if (searchDto.studyType) where.studyType = searchDto.studyType;
      if (searchDto.ethicsStatus) where.ethicsStatus = searchDto.ethicsStatus;
      if (searchDto.priority) where.priority = searchDto.priority;
      if (searchDto.principalInvestigatorId) where.principalInvestigatorId = searchDto.principalInvestigatorId;
      if (searchDto.createdBy) where.createdBy = searchDto.createdBy;
      if (searchDto.fundingSource) where.fundingSource = { contains: searchDto.fundingSource, mode: 'insensitive' };
      if (searchDto.requiresEthicsApproval !== undefined) where.requiresEthicsApproval = searchDto.requiresEthicsApproval;

      if (searchDto.minSampleSize || searchDto.maxSampleSize) {
        where.sampleSize = {};
        if (searchDto.minSampleSize) where.sampleSize.gte = searchDto.minSampleSize;
        if (searchDto.maxSampleSize) where.sampleSize.lte = searchDto.maxSampleSize;
      }

      if (searchDto.minDuration || searchDto.maxDuration) {
        where.duration = {};
        if (searchDto.minDuration) where.duration.gte = searchDto.minDuration;
        if (searchDto.maxDuration) where.duration.lte = searchDto.maxDuration;
      }

      if (searchDto.submittedAfter || searchDto.submittedBefore) {
        where.submittedAt = {};
        if (searchDto.submittedAfter) where.submittedAt.gte = new Date(searchDto.submittedAfter);
        if (searchDto.submittedBefore) where.submittedAt.lte = new Date(searchDto.submittedBefore);
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
    } catch (error) {
      this.logger.error(`Error fetching research requests: ${error.message}`);
      throw error;
    }
  }

  async getResearchRequestById(id: string, userId: string) {
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
        throw new NotFoundException('Research request not found');
      }

      // Check access permissions
      await this.checkResearchRequestAccess(request, userId);

      return request;
    } catch (error) {
      this.logger.error(`Error fetching research request ${id}: ${error.message}`);
      throw error;
    }
  }

  // ========== APPROVAL WORKFLOW ==========
  async createApproval(approvalData: any, userId: string) {
    try {
      // Verify research request exists
      const researchRequest = await this.prisma.researchRequest.findUnique({
        where: { id: approvalData.researchRequestId },
      });

      if (!researchRequest) {
        throw new NotFoundException('Research request not found');
      }

      // Check if user has permission to approve at this level
      await this.checkApprovalPermission(approvalData.level, userId);

      // Check if approval already exists for this level
      const existingApproval = await this.prisma.researchApproval.findFirst({
        where: {
          researchRequestId: approvalData.researchRequestId,
          level: approvalData.level,
        },
      });

      if (existingApproval) {
        throw new ConflictException('Approval already exists for this level');
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
          approvedAt: approvalData.status === ApprovalStatus.APPROVED ? new Date() : null,
          createdBy: userId,
        },
        include: {
          researchRequest: true,
          approver: true,
          delegatedTo: true,
        },
      });

      // Update research request status based on approval
      await this.updateResearchRequestStatusAfterApproval(approval);

      // Send notifications
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
    } catch (error) {
      this.logger.error(`Error creating approval: ${error.message}`);
      throw error;
    }
  }

  async getApprovalsByResearchRequest(researchRequestId: string, userId: string) {
    try {
      // Check access to research request
      const researchRequest = await this.prisma.researchRequest.findUnique({
        where: { id: researchRequestId },
      });

      if (!researchRequest) {
        throw new NotFoundException('Research request not found');
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
    } catch (error) {
      this.logger.error(`Error fetching approvals for research request ${researchRequestId}: ${error.message}`);
      throw error;
    }
  }

  // ========== COLLABORATION MANAGEMENT ==========
  async createCollaboration(collaborationData: any, userId: string) {
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
          dataAccessLevel: collaborationData.dataAccessLevel || DataAccessLevel.LIMITED,
          status: CollaborationStatus.PENDING,
          invitedAt: new Date(),
          createdBy: userId,
        },
        include: {
          researchRequest: true,
          collaborator: true,
        },
      });

      // Send invitation to collaborator
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
    } catch (error) {
      this.logger.error(`Error creating collaboration: ${error.message}`);
      throw error;
    }
  }

  async updateCollaborationStatus(id: string, status: CollaborationStatus, userId: string) {
    try {
      const collaboration = await this.prisma.researchCollaboration.findUnique({
        where: { id },
        include: {
          researchRequest: true,
        },
      });

      if (!collaboration) {
        throw new NotFoundException('Collaboration not found');
      }

      // Check if user is the collaborator
      if (collaboration.collaboratorId !== userId) {
        throw new UnauthorizedException('Only the collaborator can update their status');
      }

      const updateData: any = { status };
      if (status === CollaborationStatus.ACCEPTED) {
        updateData.acceptedAt = new Date();
      } else if (status === CollaborationStatus.DECLINED) {
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

      // Notify research team
      await this.notifyCollaborationStatusUpdate(updatedCollaboration);

      await this.auditLogService.log({
        userId,
        action: 'UPDATE_COLLABORATION_STATUS',
        resource: 'research_collaboration',
        resourceId: id,
        details: { status },
      });

      return updatedCollaboration;
    } catch (error) {
      this.logger.error(`Error updating collaboration status: ${error.message}`);
      throw error;
    }
  }

  // ========== DATA ACCESS MANAGEMENT ==========
  async createDataAccessSession(sessionData: any, userId: string) {
    try {
      // Verify research request and access permissions
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
    } catch (error) {
      this.logger.error(`Error creating data access session: ${error.message}`);
      throw error;
    }
  }

  async endDataAccessSession(id: string, endTime: Date, dataAccessed: any, queriesExecuted: any, userId: string) {
    try {
      const session = await this.prisma.dataAccessSession.findUnique({
        where: { id },
      });

      if (!session) {
        throw new NotFoundException('Data access session not found');
      }

      // Check if user can end this session
      if (session.userId !== userId && !await this.isAdmin(userId)) {
        throw new UnauthorizedException('Unauthorized to end this session');
      }

      const duration = Math.floor((endTime.getTime() - session.startTime.getTime()) / (1000 * 60)); // in minutes

      // Perform compliance checking
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

      // Log compliance violations if any
      if (complianceResult.status !== ComplianceStatus.COMPLIANT) {
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
    } catch (error) {
      this.logger.error(`Error ending data access session: ${error.message}`);
      throw error;
    }
  }

  // ========== AGGREGATE DATA AND STATISTICS ==========
  async getAggregateStatistics(queryDto: any, userId: string) {
    try {
      // Check user permissions for aggregate data access
      await this.checkAggregateDataAccess(userId);

      // Build privacy-safe query
      const query = await this.buildAggregateQuery(queryDto);

      // Execute query with privacy controls
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
    } catch (error) {
      this.logger.error(`Error getting aggregate statistics: ${error.message}`);
      throw error;
    }
  }

  async getGeographicData(geoDto: any, userId: string) {
    try {
      // Check user permissions for geographic data access
      await this.checkGeographicDataAccess(userId);

      const where: any = {};

      if (geoDto.province) where.province = geoDto.province;
      if (geoDto.regency) where.regency = geoDto.regency;
      if (geoDto.cancerType) where.cancerType = geoDto.cancerType;
      if (geoDto.stage) where.stage = geoDto.stage;
      if (geoDto.year) where.year = geoDto.year;
      if (geoDto.month) where.month = geoDto.month;
      if (geoDto.gender) where.gender = geoDto.gender;
      if (geoDto.ageGroup) where.ageGroup = geoDto.ageGroup;
      if (geoDto.urbanRural) where.urbanRural = geoDto.urbanRural;

      if (geoDto.minCount || geoDto.maxCount) {
        where.count = {};
        if (geoDto.minCount) where.count.gte = geoDto.minCount;
        if (geoDto.maxCount) where.count.lte = geoDto.maxCount;
      }

      // Apply privacy filtering
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

      // Filter for privacy - only include records above threshold
      const filteredData = data.filter(item =>
        item.count >= (geoDto.privacyThreshold || 5)
      );

      // Process coordinates for map visualization
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
    } catch (error) {
      this.logger.error(`Error getting geographic data: ${error.message}`);
      throw error;
    }
  }

  // ========== RESEARCH IMPACT TRACKING ==========
  async createImpactMetric(metricData: any, userId: string) {
    try {
      // Verify research request exists and user has access
      const researchRequest = await this.prisma.researchRequest.findUnique({
        where: { id: metricData.researchRequestId },
      });

      if (!researchRequest) {
        throw new NotFoundException('Research request not found');
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
    } catch (error) {
      this.logger.error(`Error creating impact metric: ${error.message}`);
      throw error;
    }
  }

  async getImpactMetrics(searchDto: any, userId: string) {
    try {
      const where: any = {};

      if (searchDto.researchRequestId) where.researchRequestId = searchDto.researchRequestId;
      if (searchDto.metricType) where.metricType = searchDto.metricType;
      if (searchDto.category) where.category = { contains: searchDto.category, mode: 'insensitive' };
      if (searchDto.isVerified !== undefined) where.isVerified = searchDto.isVerified;

      if (searchDto.dateFrom || searchDto.dateTo) {
        where.date = {};
        if (searchDto.dateFrom) where.date.gte = new Date(searchDto.dateFrom);
        if (searchDto.dateTo) where.date.lte = new Date(searchDto.dateTo);
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
    } catch (error) {
      this.logger.error(`Error fetching impact metrics: ${error.message}`);
      throw error;
    }
  }

  // ========== PRIVATE HELPER METHODS ==========
  private async validateResearchRequest(requestData: any, userId: string) {
    // Validate principal investigator exists and is active
    const pi = await this.prisma.user.findUnique({
      where: { id: requestData.principalInvestigatorId },
    });

    if (!pi || !pi.isActive) {
      throw new BadRequestException('Principal investigator not found or inactive');
    }

    // Validate sample size and duration
    if (requestData.sampleSize <= 0) {
      throw new BadRequestException('Sample size must be greater than 0');
    }

    if (requestData.duration <= 0 || requestData.duration > 120) {
      throw new BadRequestException('Duration must be between 1 and 120 months');
    }

    // Check if user has permission to create research requests
    const hasPermission = await this.checkUserPermission(userId, 'RESEARCH_CREATE');
    if (!hasPermission) {
      throw new UnauthorizedException('Insufficient permissions to create research requests');
    }
  }

  private async initializeApprovalWorkflow(researchRequestId: string, userId: string) {
    const researchRequest = await this.prisma.researchRequest.findUnique({
      where: { id: researchRequestId },
    });

    if (!researchRequest) {
      throw new NotFoundException('Research request not found');
    }

    // Determine required approval levels based on research characteristics
    const requiredLevels = this.determineRequiredApprovalLevels(researchRequest);

    for (const level of requiredLevels) {
      await this.prisma.researchApproval.create({
        data: {
          researchRequestId,
          level,
          status: ApprovalStatus.PENDING,
          reviewedAt: new Date(),
          createdBy: userId,
        },
      });
    }
  }

  private determineRequiredApprovalLevels(request: any): ApprovalLevel[] {
    const levels: ApprovalLevel[] = [];

    // Always need center director approval
    levels.push(ApprovalLevel.CENTER_DIRECTOR);

    // Data steward approval for data access
    if (JSON.parse(request.dataRequested || '[]').length > 0) {
      levels.push(ApprovalLevel.DATA_STEWARD);
    }

    // Privacy officer for sensitive data
    if (request.confidentialityRequirements || request.dataRetentionPeriod) {
      levels.push(ApprovalLevel.PRIVACY_OFFICER);
    }

    // Ethics committee for research requiring ethics approval
    if (request.requiresEthicsApproval) {
      levels.push(ApprovalLevel.ETHICS_COMMITTEE);
    }

    // National admin for multi-center or large studies
    if (request.sampleSize > 1000 || request.collaborators) {
      levels.push(ApprovalLevel.NATIONAL_ADMIN);
    }

    return levels;
  }

  private async checkApprovalPermission(level: ApprovalLevel, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { userRoles: { include: { role: { include: { permissions: true } } } } },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const hasPermission = user.userRoles.some(userRole =>
      userRole.role.permissions.some(permission =>
        permission.code === `APPROVE_${level}` || permission.code === 'ADMIN_ALL'
      )
    );

    if (!hasPermission) {
      throw new ForbiddenException(`Insufficient permissions for approval level: ${level}`);
    }
  }

  private async checkResearchRequestAccess(request: any, userId: string) {
    // User can access if:
    // 1. They are the creator
    // 2. They are the principal investigator
    // 3. They are a collaborator
    // 4. They are an approver
    // 5. They have admin permissions

    if (request.createdBy === userId || request.principalInvestigatorId === userId) {
      return;
    }

    const isCollaborator = await this.prisma.researchCollaboration.findFirst({
      where: {
        researchRequestId: request.id,
        collaboratorId: userId,
        status: CollaborationStatus.ACCEPTED,
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

    throw new UnauthorizedException('Access denied to this research request');
  }

  private async validateDataAccessPermission(researchRequestId: string, userId: string, accessLevel: DataAccessLevel) {
    const request = await this.prisma.researchRequest.findUnique({
      where: { id: researchRequestId },
      include: {
        approvals: true,
        collaborations: {
          where: {
            collaboratorId: userId,
            status: CollaborationStatus.ACCEPTED,
          },
        },
      },
    });

    if (!request) {
      throw new NotFoundException('Research request not found');
    }

    // Check if request is approved
    const isApproved = request.approvals.some(approval => approval.status === ApprovalStatus.APPROVED);
    if (!isApproved) {
      throw new ForbiddenException('Research request is not approved for data access');
    }

    // Check if user is PI, creator, or approved collaborator
    const hasAccess =
      request.principalInvestigatorId === userId ||
      request.createdBy === userId ||
      request.collaborations.length > 0;

    if (!hasAccess) {
      throw new UnauthorizedException('No access to this research request data');
    }

    // Check if access level is permitted for this user
    if (accessLevel === DataAccessLevel.FULL_ACCESS) {
      const hasFullAccessPermission = await this.checkUserPermission(userId, 'DATA_ACCESS_FULL');
      if (!hasFullAccessPermission) {
        throw new ForbiddenException('Insufficient permissions for full data access');
      }
    }
  }

  private async checkAggregateDataAccess(userId: string) {
    const hasPermission = await this.checkUserPermission(userId, 'DATA_ACCESS_AGGREGATE');
    if (!hasPermission) {
      throw new UnauthorizedException('Insufficient permissions for aggregate data access');
    }
  }

  private async checkGeographicDataAccess(userId: string) {
    const hasPermission = await this.checkUserPermission(userId, 'DATA_ACCESS_GEOGRAPHIC');
    if (!hasPermission) {
      throw new UnauthorizedException('Insufficient permissions for geographic data access');
    }
  }

  private async checkUserPermission(userId: string, permissionCode: string): Promise<boolean> {
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

    return user.userRoles.some(userRole =>
      userRole.role.permissions.some(permission =>
        permission.code === permissionCode || permission.code === 'ADMIN_ALL'
      )
    );
  }

  private async isAdmin(userId: string): Promise<boolean> {
    return await this.checkUserPermission(userId, 'ADMIN_ALL');
  }

  private async buildAggregateQuery(queryDto: any) {
    // Build a privacy-safe aggregate query based on parameters
    // This is a simplified version - in production, you'd want more sophisticated query building

    const query: any = {
      select: {
        cancerType: true,
        year: true,
        // Add other aggregated fields based on query parameters
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

  private async executeAggregateQuery(query: any, privacyThreshold: number) {
    // Execute query with privacy filtering
    const results = await this.prisma.cancerAggregateStats.findMany({
      ...query,
    });

    // Filter results below privacy threshold
    return results.filter(result => {
      if (result.totalCases && result.totalCases < privacyThreshold) return false;
      if (result.maleCases && result.maleCases < privacyThreshold) return false;
      if (result.femaleCases && result.femaleCases < privacyThreshold) return false;
      return true;
    });
  }

  private async performComplianceCheck(session: any, dataAccessed: any, queriesExecuted: any) {
    // Automated compliance checking logic
    let status = ComplianceStatus.COMPLIANT;
    let violationReason = null;

    // Check for suspicious access patterns
    const accessCount = Array.isArray(dataAccessed) ? dataAccessed.length : 0;
    const queryCount = Array.isArray(queriesExecuted) ? queriesExecuted.length : 0;

    if (accessCount > 1000) {
      status = ComplianceStatus.WARNING;
      violationReason = 'High volume data access detected';
    }

    if (session.duration && session.duration > 480) { // 8 hours
      status = ComplianceStatus.WARNING;
      violationReason = 'Extended session duration detected';
    }

    // Check for prohibited data access
    if (dataAccessed && JSON.stringify(dataAccessed).includes('SSN')) {
      status = ComplianceStatus.VIOLATION;
      violationReason = 'Attempted access to prohibited data fields';
    }

    return { status, violationReason };
  }

  private async handleComplianceViolation(session: any, complianceResult: any) {
    // Log compliance violation
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

    // Send alert to administrators
    // This would integrate with your notification system
    this.logger.warn(`Compliance violation detected: ${complianceResult.violationReason}`, {
      sessionId: session.id,
      userId: session.userId,
    });
  }

  private async updateResearchRequestStatusAfterApproval(approval: any) {
    const request = await this.prisma.researchRequest.findUnique({
      where: { id: approval.researchRequestId },
      include: { approvals: true },
    });

    if (!request) return;

    // Check if all required approvals are complete
    const allApprovals = request.approvals;
    const approvedCount = allApprovals.filter(a => a.status === ApprovalStatus.APPROVED).length;
    const rejectedCount = allApprovals.filter(a => a.status === ApprovalStatus.REJECTED).length;

    if (rejectedCount > 0) {
      // Any rejection means the request is rejected
      await this.prisma.researchRequest.update({
        where: { id: request.id },
        data: {
          status: ResearchRequestStatus.REJECTED,
          rejectedAt: new Date(),
        },
      });
    } else if (approvedCount === allApprovals.length) {
      // All approvals received
      await this.prisma.researchRequest.update({
        where: { id: request.id },
        data: {
          status: ResearchRequestStatus.APPROVED,
          approvedAt: new Date(),
        },
      });
    } else {
      // Some approvals pending
      await this.prisma.researchRequest.update({
        where: { id: request.id },
        data: { status: ResearchRequestStatus.UNDER_REVIEW },
      });
    }
  }

  // Notification methods (simplified)
  private async notifyNewResearchRequest(request: any) {
    // Send notification to relevant administrators and reviewers
    await this.emailService.sendNotification({
      to: ['admin@inamsos.go.id'], // Would fetch actual admin emails
      subject: `New Research Request: ${request.title}`,
      template: 'research-request-created',
      data: request,
    });
  }

  private async notifyApprovalUpdate(approval: any) {
    // Send notification to research team about approval status
    await this.emailService.sendNotification({
      to: [approval.researchRequest.creator.email], // Would fetch actual email
      subject: `Approval Update: ${approval.researchRequest.title}`,
      template: 'approval-update',
      data: approval,
    });
  }

  private async sendCollaborationInvitation(collaboration: any) {
    // Send invitation email to collaborator
    await this.emailService.sendNotification({
      to: [collaboration.collaborator.email], // Would fetch actual email
      subject: `Research Collaboration Invitation: ${collaboration.researchRequest.title}`,
      template: 'collaboration-invitation',
      data: collaboration,
    });
  }

  private async notifyCollaborationStatusUpdate(collaboration: any) {
    // Notify research team about collaboration status update
    await this.emailService.sendNotification({
      to: [collaboration.researchRequest.creator.email], // Would fetch actual email
      subject: `Collaboration Status Update: ${collaboration.collaborator.name}`,
      template: 'collaboration-status-update',
      data: collaboration,
    });
  }

  // ========== ADDITIONAL SERVICE METHODS FOR CONTROLLER ==========
  async updateResearchRequest(id: string, updateData: any, userId: string) {
    try {
      const existingRequest = await this.prisma.researchRequest.findUnique({
        where: { id },
      });

      if (!existingRequest) {
        throw new NotFoundException('Research request not found');
      }

      // Check if user can update this request
      if (existingRequest.createdBy !== userId && existingRequest.principalInvestigatorId !== userId) {
        const hasAdminPermission = await this.checkUserPermission(userId, 'RESEARCH_UPDATE_ALL');
        if (!hasAdminPermission) {
          throw new UnauthorizedException('Cannot update this research request');
        }
      }

      // Only allow updates on certain statuses
      const allowedStatuses = [ResearchRequestStatus.DRAFT, ResearchRequestStatus.PENDING_REVIEW];
      if (!allowedStatuses.includes(existingRequest.status)) {
        throw new BadRequestException('Cannot update research request in current status');
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
    } catch (error) {
      this.logger.error(`Error updating research request ${id}: ${error.message}`);
      throw error;
    }
  }

  async updateApproval(id: string, updateData: any, userId: string) {
    try {
      const existingApproval = await this.prisma.researchApproval.findUnique({
        where: { id },
      });

      if (!existingApproval) {
        throw new NotFoundException('Approval not found');
      }

      // Check if user can update this approval
      if (existingApproval.approverId !== userId) {
        const hasAdminPermission = await this.checkUserPermission(userId, 'RESEARCH_APPROVE_ALL');
        if (!hasAdminPermission) {
          throw new UnauthorizedException('Cannot update this approval');
        }
      }

      const updatedApproval = await this.prisma.researchApproval.update({
        where: { id },
        data: {
          ...updateData,
          approvedAt: updateData.status === ApprovalStatus.APPROVED ? new Date() : existingApproval.approvedAt,
        },
        include: {
          researchRequest: true,
          approver: true,
          delegatedTo: true,
        },
      });

      // Update research request status after approval update
      await this.updateResearchRequestStatusAfterApproval(updatedApproval);

      await this.auditLogService.log({
        userId,
        action: 'UPDATE_APPROVAL',
        resource: 'research_approval',
        resourceId: id,
        details: updateData,
      });

      return updatedApproval;
    } catch (error) {
      this.logger.error(`Error updating approval ${id}: ${error.message}`);
      throw error;
    }
  }

  async getMyApprovals(query: any, userId: string) {
    try {
      const where: any = { approverId: userId };
      if (query.status) where.status = query.status;

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
    } catch (error) {
      this.logger.error(`Error fetching my approvals: ${error.message}`);
      throw error;
    }
  }

  async getCollaborations(researchRequestId: string, searchDto: any, userId: string) {
    try {
      // Check access to research request
      const researchRequest = await this.prisma.researchRequest.findUnique({
        where: { id: researchRequestId },
      });

      if (!researchRequest) {
        throw new NotFoundException('Research request not found');
      }

      await this.checkResearchRequestAccess(researchRequest, userId);

      const where: any = { researchRequestId };
      if (searchDto.status) where.status = searchDto.status;
      if (searchDto.role) where.role = searchDto.role;

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
    } catch (error) {
      this.logger.error(`Error fetching collaborations: ${error.message}`);
      throw error;
    }
  }

  async getMyCollaborations(query: any, userId: string) {
    try {
      const where: any = { collaboratorId: userId };
      if (query.status) where.status = query.status;

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
    } catch (error) {
      this.logger.error(`Error fetching my collaborations: ${error.message}`);
      throw error;
    }
  }

  async getDataAccessSessions(searchDto: any, userId: string) {
    try {
      const hasAuditPermission = await this.checkUserPermission(userId, 'DATA_ACCESS_AUDIT_ALL');
      const where: any = {};

      if (!hasAuditPermission) {
        where.userId = userId;
      }

      if (searchDto.researchRequestId) where.researchRequestId = searchDto.researchRequestId;
      if (searchDto.userId && hasAuditPermission) where.userId = searchDto.userId;
      if (searchDto.sessionType) where.sessionType = searchDto.sessionType;
      if (searchDto.accessLevel) where.accessLevel = searchDto.accessLevel;
      if (searchDto.complianceStatus) where.complianceStatus = searchDto.complianceStatus;
      if (searchDto.ipAddress) where.ipAddress = { contains: searchDto.ipAddress };

      if (searchDto.dateFrom || searchDto.dateTo) {
        where.startTime = {};
        if (searchDto.dateFrom) where.startTime.gte = new Date(searchDto.dateFrom);
        if (searchDto.dateTo) where.startTime.lte = new Date(searchDto.dateTo);
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
    } catch (error) {
      this.logger.error(`Error fetching data access sessions: ${error.message}`);
      throw error;
    }
  }

  async getMyDataAccessSessions(query: any, userId: string) {
    try {
      const where: any = { userId };
      if (query.sessionType) where.sessionType = query.sessionType;
      if (query.complianceStatus) where.complianceStatus = query.complianceStatus;

      const sessions = await this.prisma.dataAccessSession.findMany({
        where,
        include: {
          researchRequest: true,
        },
        orderBy: { startTime: 'desc' },
      });

      return sessions;
    } catch (error) {
      this.logger.error(`Error fetching my data access sessions: ${error.message}`);
      throw error;
    }
  }

  async getImpactMetrics(researchRequestId: string, searchDto: any, userId: string) {
    try {
      // Check access to research request
      const researchRequest = await this.prisma.researchRequest.findUnique({
        where: { id: researchRequestId },
      });

      if (!researchRequest) {
        throw new NotFoundException('Research request not found');
      }

      await this.checkResearchRequestAccess(researchRequest, userId);

      const where: any = { researchRequestId };
      if (searchDto.metricType) where.metricType = searchDto.metricType;
      if (searchDto.category) where.category = { contains: searchDto.category, mode: 'insensitive' };
      if (searchDto.isVerified !== undefined) where.isVerified = searchDto.isVerified;

      if (searchDto.dateFrom || searchDto.dateTo) {
        where.date = {};
        if (searchDto.dateFrom) where.date.gte = new Date(searchDto.dateFrom);
        if (searchDto.dateTo) where.date.lte = new Date(searchDto.dateTo);
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
    } catch (error) {
      this.logger.error(`Error fetching impact metrics: ${error.message}`);
      throw error;
    }
  }

  async createPublication(publicationData: any, userId: string) {
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
    } catch (error) {
      this.logger.error(`Error creating publication: ${error.message}`);
      throw error;
    }
  }

  async getPublications(researchRequestId: string, searchDto: any, userId: string) {
    try {
      // Check access to research request
      const researchRequest = await this.prisma.researchRequest.findUnique({
        where: { id: researchRequestId },
      });

      if (!researchRequest) {
        throw new NotFoundException('Research request not found');
      }

      await this.checkResearchRequestAccess(researchRequest, userId);

      const where: any = { researchRequestId };
      if (searchDto.publicationType) where.publicationType = searchDto.publicationType;
      if (searchDto.journal) where.journal = { contains: searchDto.journal, mode: 'insensitive' };
      if (searchDto.doi) where.doi = { contains: searchDto.doi };
      if (searchDto.pmid) where.pmid = { contains: searchDto.pmid };
      if (searchDto.openAccess !== undefined) where.openAccess = searchDto.openAccess;

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
    } catch (error) {
      this.logger.error(`Error fetching publications: ${error.message}`);
      throw error;
    }
  }

  async getDashboardOverview(userId: string) {
    try {
      const [
        totalRequests,
        pendingRequests,
        approvedRequests,
        myRequests,
        myApprovals,
        activeCollaborations,
        recentPublications,
      ] = await Promise.all([
        this.prisma.researchRequest.count({}),
        this.prisma.researchRequest.count({ where: { status: ResearchRequestStatus.PENDING_REVIEW } }),
        this.prisma.researchRequest.count({ where: { status: ResearchRequestStatus.APPROVED } }),
        this.prisma.researchRequest.count({ where: { createdBy: userId } }),
        this.prisma.researchApproval.count({ where: { approverId: userId, status: ApprovalStatus.PENDING } }),
        this.prisma.researchCollaboration.count({ where: { collaboratorId: userId, status: CollaborationStatus.ACTIVE } }),
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
    } catch (error) {
      this.logger.error(`Error fetching dashboard overview: ${error.message}`);
      throw error;
    }
  }

  async getWorkflowAnalytics(query: any, userId: string) {
    try {
      const hasAnalyticsPermission = await this.checkUserPermission(userId, 'RESEARCH_ANALYTICS');
      if (!hasAnalyticsPermission) {
        throw new UnauthorizedException('Insufficient permissions for workflow analytics');
      }

      const dateRange = query.dateRange || '30'; // Default to last 30 days
      const fromDate = new Date(Date.now() - parseInt(dateRange) * 24 * 60 * 60 * 1000);

      const [
        requestsByStatus,
        requestsByType,
        averageApprovalTime,
        complianceRate,
      ] = await Promise.all([
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
    } catch (error) {
      this.logger.error(`Error fetching workflow analytics: ${error.message}`);
      throw error;
    }
  }

  async getComplianceAnalytics(query: any, userId: string) {
    try {
      const hasAuditPermission = await this.checkUserPermission(userId, 'DATA_ACCESS_AUDIT_ALL');
      if (!hasAuditPermission) {
        throw new UnauthorizedException('Insufficient permissions for compliance analytics');
      }

      const dateRange = query.dateRange || '30';
      const fromDate = new Date(Date.now() - parseInt(dateRange) * 24 * 60 * 60 * 1000);

      const [
        sessionsByStatus,
        totalSessions,
        violationCount,
      ] = await Promise.all([
        this.prisma.dataAccessSession.groupBy({
          by: ['complianceStatus'],
          where: { startTime: { gte: fromDate } },
          _count: { complianceStatus: true },
        }),
        this.prisma.dataAccessSession.count({ where: { startTime: { gte: fromDate } } }),
        this.prisma.dataAccessSession.count({
          where: {
            startTime: { gte: fromDate },
            complianceStatus: { in: [ComplianceStatus.VIOLATION, ComplianceStatus.WARNING] },
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
    } catch (error) {
      this.logger.error(`Error fetching compliance analytics: ${error.message}`);
      throw error;
    }
  }

  async getResearchStats(userId: string) {
    try {
      const stats = await this.prisma.researchRequest.aggregate({
        _count: { id: true },
        where: {
          createdAt: { gte: new Date(new Date().getFullYear(), 0, 1) }, // Current year
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
    } catch (error) {
      this.logger.error(`Error fetching research stats: ${error.message}`);
      throw error;
    }
  }

  async exportCleanData(query: any, res: any, userId: string) {
    try {
      await this.validateDataAccessPermission(query.researchRequestId, userId, DataAccessLevel.AGGREGATE_ONLY);

      // Implement data export logic based on format
      const format = query.format || 'csv';

      // Set appropriate headers
      res.setHeader('Content-Type', this.getContentType(format));
      res.setHeader('Content-Disposition', `attachment; filename="research-data-${Date.now()}.${format}"`);

      // Stream the data
      // This is a placeholder - you'd implement actual data export logic here
      res.end('Data export functionality to be implemented');
    } catch (error) {
      this.logger.error(`Error exporting research data: ${error.message}`);
      throw error;
    }
  }

  async validateResearchRequest(requestData: any, userId: string) {
    try {
      const validationErrors: string[] = [];

      // Validate required fields
      if (!requestData.title?.trim()) validationErrors.push('Title is required');
      if (!requestData.description?.trim()) validationErrors.push('Description is required');
      if (!requestData.objectives?.trim()) validationErrors.push('Objectives are required');
      if (!requestData.methodology?.trim()) validationErrors.push('Methodology is required');
      if (!requestData.principalInvestigatorId) validationErrors.push('Principal investigator is required');
      if (!requestData.studyType) validationErrors.push('Study type is required');

      // Validate numerical values
      if (!requestData.sampleSize || requestData.sampleSize <= 0) {
        validationErrors.push('Sample size must be greater than 0');
      }
      if (!requestData.duration || requestData.duration <= 0 || requestData.duration > 120) {
        validationErrors.push('Duration must be between 1 and 120 months');
      }

      // Validate principal investigator
      if (requestData.principalInvestigatorId) {
        const pi = await this.prisma.user.findUnique({
          where: { id: requestData.principalInvestigatorId },
        });
        if (!pi || !pi.isActive) {
          validationErrors.push('Principal investigator not found or inactive');
        }
      }

      // Validate data requested format
      if (requestData.dataRequested) {
        try {
          JSON.parse(requestData.dataRequested);
        } catch {
          validationErrors.push('Data requested must be valid JSON');
        }
      }

      return {
        isValid: validationErrors.length === 0,
        errors: validationErrors,
      };
    } catch (error) {
      this.logger.error(`Error validating research request: ${error.message}`);
      throw error;
    }
  }

  // ========== PRIVATE HELPER METHODS FOR EXTENDED FUNCTIONALITY ==========
  private async getAverageApprovalTime(fromDate: Date) {
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

    if (approvals.length === 0) return 0;

    const totalDays = approvals.reduce((sum, approval) => {
      const days = Math.ceil(
        (approval.approvedAt!.getTime() - approval.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      );
      return sum + days;
    }, 0);

    return Math.round(totalDays / approvals.length);
  }

  private async getComplianceRate(fromDate: Date) {
    const [total, compliant] = await Promise.all([
      this.prisma.dataAccessSession.count({
        where: { startTime: { gte: fromDate } },
      }),
      this.prisma.dataAccessSession.count({
        where: {
          startTime: { gte: fromDate },
          complianceStatus: ComplianceStatus.COMPLIANT,
        },
      }),
    ]);

    return total > 0 ? (compliant / total) * 100 : 100;
  }

  private getContentType(format: string): string {
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
}