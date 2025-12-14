import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateResearchRequestDto, UpdateResearchRequestDto, ApproveResearchRequestDto } from './dto/create-research-request.dto';
import { calculateSensitivityScore, isAutoApprovalEligible } from './helpers/sensitivity-scorer';
import { estimatePatientCount, validateFilters } from './helpers/patient-estimator';

@Injectable()
export class ResearchRequestsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create new research request (draft)
   */
  async create(userId: string, dto: CreateResearchRequestDto) {
    // Validate filters
    const filterErrors = validateFilters(dto.dataFilters);
    if (filterErrors.length > 0) {
      throw new BadRequestException(`Invalid filters: ${filterErrors.join(', ')}`);
    }

    // Calculate sensitivity score
    const sensitivityScore = calculateSensitivityScore(dto.requestedDataFields);

    // Check auto-approval eligibility
    const autoApproval = isAutoApprovalEligible(
      dto.requestedDataFields,
      dto.irbStatus === 'APPROVED'
    );

    // Estimate patient count
    const estimatedCount = await estimatePatientCount(this.prisma, dto.dataFilters);

    // Generate request number (RR-YYYY-NNN)
    const year = new Date().getFullYear();
    const count = await this.prisma.researchRequest.count({
      where: { requestNumber: { startsWith: `RR-${year}` } }
    });
    const requestNumber = `RR-${year}-${String(count + 1).padStart(3, '0')}`;

    // Create research request
    const request = await this.prisma.researchRequest.create({
      data: {
        requestNumber,
        title: dto.title,
        description: dto.researchAbstract,
        researchAbstract: dto.researchAbstract,
        objectives: dto.objectives,
        researcherPhone: dto.researcherPhone,
        researcherInstitution: dto.researcherInstitution,
        studyType: dto.researchType as any,
        methodology: '', // Can be derived from researchAbstract
        inclusionCriteria: '', // Can be derived from dataFilters
        exclusionCriteria: '',
        sampleSize: estimatedCount,
        duration: dto.accessDurationMonths,
        requiresEthicsApproval: dto.irbStatus !== 'APPROVED',
        dataRequested: JSON.stringify(dto.requestedDataFields),
        status: 'DRAFT',
        ethicsStatus: dto.irbStatus === 'APPROVED' ? 'APPROVED' : 'PENDING',
        ethicsApprovalNumber: dto.ethicsApprovalNumber,
        ethicsApprovalDate: dto.ethicsApprovalDate ? new Date(dto.ethicsApprovalDate) : null,
        priority: 'MEDIUM',
        requestedDataFields: dto.requestedDataFields as any,
        dataFilters: dto.dataFilters as any,
        estimatedPatientCount: estimatedCount,
        dataSensitivityScore: sensitivityScore,
        isAutoApprovalEligible: autoApproval,
        needsEthicsReview: dto.irbStatus !== 'APPROVED',
        irbCertificateUrl: dto.irbCertificateUrl,
        protocolUrl: dto.protocolUrl,
        proposalUrl: dto.proposalUrl,
        cvUrl: dto.cvUrl,
        agreementSigned: dto.agreementSigned,
        agreementDate: dto.agreementDate ? new Date(dto.agreementDate) : null,
        createdBy: userId,
        principalInvestigatorId: userId,
      },
      include: {
        creator: { select: { id: true, name: true, email: true } },
      },
    });

    // Log activity
    await this.logActivity(request.id, userId, 'CREATED', null, 'DRAFT', 'Research request created');

    return request;
  }

  /**
   * Update draft research request
   */
  async update(id: string, userId: string, dto: UpdateResearchRequestDto) {
    const request = await this.findOne(id, userId);

    // Only allow update if status is DRAFT or NEED_MORE_INFO
    if (!['DRAFT', 'NEED_MORE_INFO'].includes(request.status)) {
      throw new ForbiddenException('Can only update draft or requests needing more info');
    }

    // Recalculate if data fields changed
    let updates: any = { ...dto };

    if (dto.requestedDataFields) {
      const sensitivityScore = calculateSensitivityScore(dto.requestedDataFields);
      updates.dataSensitivityScore = sensitivityScore;
      updates.isAutoApprovalEligible = isAutoApprovalEligible(
        dto.requestedDataFields,
        request.ethicsStatus === 'APPROVED'
      );
    }

    if (dto.dataFilters) {
      const estimatedCount = await estimatePatientCount(this.prisma, dto.dataFilters);
      updates.estimatedPatientCount = estimatedCount;
    }

    const updated = await this.prisma.researchRequest.update({
      where: { id },
      data: updates,
      include: {
        creator: { select: { id: true, name: true, email: true } },
      },
    });

    await this.logActivity(id, userId, 'UPDATED', request.status, request.status, 'Research request updated');

    return updated;
  }

  /**
   * Submit research request for approval
   */
  async submit(id: string, userId: string) {
    const request = await this.findOne(id, userId);

    if (request.status !== 'DRAFT') {
      throw new BadRequestException('Can only submit draft requests');
    }

    if (!request.agreementSigned) {
      throw new BadRequestException('Data protection agreement must be signed before submission');
    }

    const updated = await this.prisma.researchRequest.update({
      where: { id },
      data: {
        status: 'SUBMITTED',
        submittedAt: new Date(),
      },
    });

    await this.logActivity(id, userId, 'SUBMITTED', 'DRAFT', 'SUBMITTED', 'Research request submitted for review');

    // TODO: Send notification to admins

    return updated;
  }

  /**
   * Get all research requests (for researcher)
   */
  async findAll(userId: string, filters?: any) {
    return this.prisma.researchRequest.findMany({
      where: {
        createdBy: userId,
        ...filters,
      },
      include: {
        creator: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get pending research requests (for admin)
   */
  async findPending() {
    return this.prisma.researchRequest.findMany({
      where: {
        status: { in: ['SUBMITTED', 'PENDING_REVIEW', 'UNDER_REVIEW'] },
      },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        principalInvestigator: { select: { id: true, name: true, email: true } },
      },
      orderBy: [
        { priority: 'desc' },
        { submittedAt: 'asc' },
      ],
    });
  }

  /**
   * Get single research request
   */
  async findOne(id: string, userId?: string) {
    const request = await this.prisma.researchRequest.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        principalInvestigator: { select: { id: true, name: true, email: true } },
        activities: {
          include: { actor: { select: { name: true, email: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!request) {
      throw new NotFoundException('Research request not found');
    }

    // Check permission: owner or admin
    if (userId && request.createdBy !== userId) {
      // TODO: Check if user is admin
      // For now, allow access
    }

    return request;
  }

  /**
   * Admin approve/reject research request
   */
  async approveOrReject(id: string, adminId: string, dto: ApproveResearchRequestDto) {
    const request = await this.findOne(id);

    if (!['SUBMITTED', 'PENDING_REVIEW', 'UNDER_REVIEW'].includes(request.status)) {
      throw new BadRequestException('Request cannot be reviewed in current status');
    }

    let newStatus: string;
    let actionLog: string;

    switch (dto.decision) {
      case 'APPROVE':
        newStatus = 'APPROVED';
        actionLog = 'Research request approved';
        break;
      case 'APPROVE_WITH_CONDITIONS':
        newStatus = 'APPROVED_WITH_CONDITIONS';
        actionLog = `Research request approved with conditions: ${dto.conditions}`;
        break;
      case 'REJECT':
        newStatus = 'REJECTED';
        actionLog = `Research request rejected: ${dto.notes}`;
        break;
      case 'REQUEST_MORE_INFO':
        newStatus = 'NEED_MORE_INFO';
        actionLog = `More information requested: ${dto.notes}`;
        break;
      default:
        throw new BadRequestException('Invalid decision');
    }

    const updated = await this.prisma.researchRequest.update({
      where: { id },
      data: {
        status: newStatus as any,
        reviewedAt: new Date(),
        ...(dto.decision.includes('APPROVE') && {
          approvedAt: new Date(),
          expiresAt: new Date(Date.now() + (dto.reducedAccessDuration || request.duration) * 30 * 24 * 60 * 60 * 1000),
        }),
        ...(dto.decision === 'REJECT' && {
          rejectedAt: new Date(),
        }),
        notes: dto.notes,
      },
    });

    await this.logActivity(id, adminId, dto.decision, request.status, newStatus, actionLog);

    // TODO: Send notification to researcher
    // TODO: If approved, generate data export

    return updated;
  }

  /**
   * Delete draft research request
   */
  async remove(id: string, userId: string) {
    const request = await this.findOne(id, userId);

    if (request.status !== 'DRAFT') {
      throw new ForbiddenException('Can only delete draft requests');
    }

    await this.prisma.researchRequest.delete({ where: { id } });

    return { message: 'Research request deleted successfully' };
  }

  /**
   * Log activity for audit trail
   */
  private async logActivity(
    requestId: string,
    actorId: string,
    action: string,
    statusFrom: string | null,
    statusTo: string,
    notes?: string,
  ) {
    await this.prisma.researchRequestActivity.create({
      data: {
        researchRequestId: requestId,
        actorId,
        action,
        statusFrom,
        statusTo,
        notes,
      },
    });
  }
}
