import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { ResearchRequestStatus, StudyType, EthicsStatus } from '@prisma/client';

@Injectable()
export class ResearchService {
  private readonly logger = new Logger(ResearchService.name);

  constructor(private prisma: PrismaService) {}

  async createResearchRequest(requestData: {
    title: string;
    description: string;
    principalInvestigatorId: string;
    studyType: StudyType;
    objectives: string;
    methodology: string;
    inclusionCriteria: string;
    exclusionCriteria: string;
    sampleSize: number;
    duration: number; // in months
    requiresEthicsApproval: boolean;
    dataRequested: string;
    confidentialityRequirements?: string;
    fundingSource?: string;
    collaborators?: string;
  }) {
    try {
      // Validate research request data
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
          submittedAt: new Date(),
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
    } catch (error) {
      this.logger.error('Error creating research request', error);
      throw error;
    }
  }

  async updateResearchRequest(requestId: string, updateData: {
    title?: string;
    description?: string;
    objectives?: string;
    methodology?: string;
    inclusionCriteria?: string;
    exclusionCriteria?: string;
    sampleSize?: number;
    duration?: number;
    dataRequested?: string;
    confidentialityRequirements?: string;
    fundingSource?: string;
    collaborators?: string;
    status?: ResearchRequestStatus;
    ethicsStatus?: EthicsStatus;
    reviewComments?: string;
    approvedBy?: string;
    approvedDate?: Date;
    rejectionReason?: string;
  }) {
    try {
      const existingRequest = await this.prisma.researchRequest.findUnique({
        where: { id: requestId },
      });

      if (!existingRequest) {
        throw new NotFoundException(`Research request with ID ${requestId} not found`);
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
          // approvedByUser: { // Field doesn't exist in ResearchRequest model
          //   select: {
          //     id: true,
          //     name: true,
          //   },
          // },
        },
      });

      this.logger.log(`Research request updated: ${updatedRequest.title} (ID: ${requestId})`);
      return updatedRequest;
    } catch (error) {
      this.logger.error(`Error updating research request with ID: ${requestId}`, error);
      throw error;
    }
  }

  async getResearchRequests(filters: {
    status?: ResearchRequestStatus;
    studyType?: StudyType;
    principalInvestigatorId?: string;
    ethicsStatus?: EthicsStatus;
    dateFrom?: Date;
    dateTo?: Date;
    page?: number;
    limit?: number;
  } = {}) {
    try {
      const page = filters.page || 1;
      const limit = filters.limit || 20;
      const skip = (page - 1) * limit;

      const where: any = {};

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
        where.submittedAt = {};
        if (filters.dateFrom) {
          where.submittedAt.gte = filters.dateFrom;
        }
        if (filters.dateTo) {
          where.submittedAt.lte = filters.dateTo;
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
            // approvedByUser: { // Field doesn't exist in ResearchRequest model
            //   select: {
            //     id: true,
            //     name: true,
            //   },
            // },
          },
          orderBy: [
            { submittedAt: 'desc' },
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
          daysSinceSubmission: this.calculateDaysSince(request.submittedAt),
          reviewStatus: this.getReviewStatus(request),
        })),
        total,
        page,
        totalPages,
      };
    } catch (error) {
      this.logger.error('Error getting research requests', error);
      throw error;
    }
  }

  async getResearchRequestById(requestId: string) {
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
          // approvedByUser: { // Field doesn't exist in ResearchRequest model
          //   select: {
          //     id: true,
          //     name: true,
          //   },
          // },
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
        throw new NotFoundException(`Research request with ID ${requestId} not found`);
      }

      return {
        ...request,
        studyTypeDisplay: this.getStudyTypeDisplay(request.studyType),
        statusDisplay: this.getStatusDisplay(request.status),
        ethicsStatusDisplay: this.getEthicsStatusDisplay(request.ethicsStatus),
        daysSinceSubmission: this.calculateDaysSince(request.submittedAt),
        reviewStatus: this.getReviewStatus(request),
        eligiblePatients: await this.countEligiblePatients(request),
        canExportData: this.canExportData(request),
      };
    } catch (error) {
      this.logger.error(`Error getting research request by ID: ${requestId}`, error);
      throw error;
    }
  }

  async approveResearchRequest(requestId: string, approvedBy: string, comments?: string) {
    try {
      return await this.updateResearchRequest(requestId, {
        status: 'APPROVED',
        approvedBy: approvedBy,
        approvedDate: new Date(),
        reviewComments: comments,
      });
    } catch (error) {
      this.logger.error(`Error approving research request: ${requestId}`, error);
      throw error;
    }
  }

  async rejectResearchRequest(requestId: string, rejectionReason: string, reviewedBy: string) {
    try {
      return await this.updateResearchRequest(requestId, {
        status: 'REJECTED',
        rejectionReason,
        reviewComments: `Rejected by ${reviewedBy}: ${rejectionReason}`,
      });
    } catch (error) {
      this.logger.error(`Error rejecting research request: ${requestId}`, error);
      throw error;
    }
  }

  async requestEthicsReview(requestId: string) {
    try {
      return await this.updateResearchRequest(requestId, {
        ethicsStatus: 'UNDER_REVIEW',
      });
    } catch (error) {
      this.logger.error(`Error requesting ethics review: ${requestId}`, error);
      throw error;
    }
  }

  async approveEthics(requestId: string, approvedBy: string, ethicsNumber?: string) {
    try {
      return await this.updateResearchRequest(requestId, {
        ethicsStatus: 'APPROVED',
        reviewComments: `Ethics approved by ${approvedBy}. Ethics Number: ${ethicsNumber || 'N/A'}`,
      });
    } catch (error) {
      this.logger.error(`Error approving ethics: ${requestId}`, error);
      throw error;
    }
  }

  async exportResearchData(requestId: string, exportFormat: 'json' | 'csv' | 'excel', requestedBy: string) {
    try {
      const request = await this.getResearchRequestById(requestId);

      if (!this.canExportData(request)) {
        throw new ConflictException('Research request is not approved for data export');
      }

      // Create data export record
      const exportRecord = await this.prisma.researchDataExport.create({
        data: {
          requestId: requestId,
          requestedBy: requestedBy,
          exportFormat,
          exportDate: new Date(),
          status: 'PROCESSING',
        },
      });

      // In a real implementation, this would trigger an async job to export the data
      // For now, we'll simulate the export
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
    } catch (error) {
      this.logger.error(`Error exporting research data for request: ${requestId}`, error);
      throw error;
    }
  }

  async getResearchStatistics(centerId?: string): Promise<any> {
    try {
      const where: any = {};
      if (centerId) {
        where.principalInvestigator = { centerId };
      }

      const [
        totalRequests,
        pendingRequests,
        approvedRequests,
        rejectedRequests,
        completedRequests,
        ethicsPending,
        ethicsApproved,
        requestsByType,
        requestsByMonth,
        averageReviewTime,
      ] = await Promise.all([
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
    } catch (error) {
      this.logger.error('Error getting research statistics', error);
      throw error;
    }
  }

  private async validateResearchRequest(requestData: any): Promise<void> {
    if (!requestData.title || requestData.title.trim().length === 0) {
      throw new ConflictException('Research title is required');
    }

    if (!requestData.description || requestData.description.trim().length === 0) {
      throw new ConflictException('Research description is required');
    }

    if (requestData.sampleSize <= 0) {
      throw new ConflictException('Sample size must be greater than 0');
    }

    if (requestData.duration <= 0) {
      throw new ConflictException('Study duration must be greater than 0');
    }

    // Additional validations can be added here
  }

  private getStudyTypeDisplay(studyType: StudyType): string {
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

  private getStatusDisplay(status: ResearchRequestStatus): string {
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

  private getEthicsStatusDisplay(ethicsStatus: EthicsStatus): string {
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

  private calculateDaysSince(date: Date): number {
    return Math.ceil((new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  }

  private getReviewStatus(request: any): string {
    if (request.status === 'APPROVED') return 'Approved';
    if (request.status === 'REJECTED') return 'Rejected';
    if (request.status === 'PENDING_REVIEW') return 'Awaiting Review';
    if (request.status === 'UNDER_REVIEW') return 'Under Review';
    return 'In Progress';
  }

  private async countEligiblePatients(request: any): Promise<number> {
    // Simplified logic - in real implementation this would parse inclusion/exclusion criteria
    return Math.min(request.sampleSize, 1000); // Placeholder
  }

  private canExportData(request: any): boolean {
    return request.status === 'APPROVED' &&
           (request.ethicsStatus === 'APPROVED' || request.ethicsStatus === 'NOT_REQUIRED');
  }

  private async getEligiblePatientsData(request: any): Promise<any[]> {
    // Placeholder for actual patient data retrieval based on criteria
    return Array.from({ length: Math.min(request.sampleSize, 100) }, (_, i) => ({
      id: `patient_${i + 1}`,
      age: 45 + Math.floor(Math.random() * 30),
      gender: Math.random() > 0.5 ? 'MALE' : 'FEMALE',
      diagnosisType: request.dataRequested,
    }));
  }

  private async getRequestsByTypeStatistics(where: any): Promise<any> {
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

  private async getRequestsByMonthStatistics(where: any): Promise<any[]> {
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear, 11, 31);

    const requests = await this.prisma.researchRequest.findMany({
      where: {
        ...where,
        submittedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        submittedAt: true,
      },
    });

    const monthlyStats = Array.from({ length: 12 }, (_, i) => 0);

    requests.forEach(request => {
      const month = request.submittedAt.getMonth();
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

  private async getAverageReviewTime(where: any): Promise<number> {
    // Simplified calculation
    return 7; // days
  }
}