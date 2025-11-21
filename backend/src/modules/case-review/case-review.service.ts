import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateCaseReviewDto } from './dto/create-case-review.dto';
import { AssignReviewDto } from './dto/assign-review.dto';
import { AddCommentDto } from './dto/add-comment.dto';

@Injectable()
export class CaseReviewService {
  private readonly logger = new Logger(CaseReviewService.name);

  constructor(private prisma: PrismaService) {}

  async createCaseReview(createDto: CreateCaseReviewDto, userId: string): Promise<any> {
    try {
      // Verify patient exists
      const patient = await this.prisma.patient.findUnique({
        where: { id: createDto.patientId },
      });

      if (!patient) {
        throw new NotFoundException(`Patient with ID ${createDto.patientId} not found`);
      }

      // Create case review
      const caseReview = await this.prisma.caseReview.create({
        data: {
          patientId: createDto.patientId,
          caseType: createDto.caseType,
          complexity: createDto.complexity || 'STANDARD',
          flagReason: createDto.flagReason,
          description: createDto.description,
          clinicalData: createDto.clinicalData,
          diagnosisIds: createDto.diagnosisIds || [],
          findings: createDto.findings,
          recommendedActions: createDto.recommendedActions,
          specialty: createDto.specialty,
          priority: createDto.priority || 'MEDIUM',
          status: 'PENDING',
          flaggedBy: userId,
          dueDate: createDto.dueDate ? new Date(createDto.dueDate) : undefined,
          tags: createDto.tags || [],
        },
        include: {
          assignments: true,
          comments: true,
        },
      });

      // Find similar cases
      const similarCases = await this.findSimilarCases(caseReview.id, createDto.patientId, createDto.caseType);

      if (similarCases.length > 0) {
        await this.prisma.caseReview.update({
          where: { id: caseReview.id },
          data: { similarCases },
        });
      }

      // Log audit
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: 'CREATE_CASE_REVIEW',
          resource: 'CaseReview',
          details: {
            caseReviewId: caseReview.id,
            patientId: createDto.patientId,
            caseType: createDto.caseType,
            complexity: createDto.complexity,
          },
        },
      });

      this.logger.log(`Case review created: ${caseReview.id} for patient ${createDto.patientId}`);

      return caseReview;
    } catch (error) {
      this.logger.error('Error creating case review', error);
      throw error;
    }
  }

  async findAll(
    status?: string,
    specialty?: string,
    priority?: string,
    assignedTo?: string,
    page = 1,
    limit = 50,
  ): Promise<any> {
    try {
      const skip = (page - 1) * limit;

      const where: any = {
        isActive: true,
        ...(status && { status }),
        ...(specialty && { specialty }),
        ...(priority && { priority }),
      };

      // If filtering by assignedTo, we need to join assignments
      let caseReviews;
      let total;

      if (assignedTo) {
        [caseReviews, total] = await Promise.all([
          this.prisma.caseReview.findMany({
            where: {
              ...where,
              assignments: {
                some: {
                  assignedTo,
                  isActive: true,
                },
              },
            },
            include: {
              assignments: {
                where: { isActive: true },
              },
              _count: {
                select: {
                  comments: true,
                  assignments: true,
                },
              },
            },
            orderBy: [
              { priority: 'desc' },
              { flaggedAt: 'desc' },
            ],
            skip,
            take: limit,
          }),
          this.prisma.caseReview.count({
            where: {
              ...where,
              assignments: {
                some: {
                  assignedTo,
                  isActive: true,
                },
              },
            },
          }),
        ]);
      } else {
        [caseReviews, total] = await Promise.all([
          this.prisma.caseReview.findMany({
            where,
            include: {
              assignments: {
                where: { isActive: true },
              },
              _count: {
                select: {
                  comments: true,
                  assignments: true,
                },
              },
            },
            orderBy: [
              { priority: 'desc' },
              { flaggedAt: 'desc' },
            ],
            skip,
            take: limit,
          }),
          this.prisma.caseReview.count({ where }),
        ]);
      }

      const totalPages = Math.ceil(total / limit);

      return {
        caseReviews,
        total,
        page,
        totalPages,
      };
    } catch (error) {
      this.logger.error('Error finding case reviews', error);
      throw error;
    }
  }

  async findById(id: string): Promise<any> {
    try {
      const caseReview = await this.prisma.caseReview.findUnique({
        where: { id },
        include: {
          assignments: {
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
          },
          comments: {
            where: { isDeleted: false },
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      if (!caseReview) {
        throw new NotFoundException(`Case review with ID ${id} not found`);
      }

      if (!caseReview.isActive) {
        throw new NotFoundException(`Case review with ID ${id} is not active`);
      }

      return caseReview;
    } catch (error) {
      this.logger.error(`Error finding case review by ID: ${id}`, error);
      throw error;
    }
  }

  async assignReview(caseReviewId: string, assignDto: AssignReviewDto, userId: string): Promise<any> {
    try {
      const caseReview = await this.findById(caseReviewId);

      const assignment = await this.prisma.reviewAssignment.create({
        data: {
          caseReviewId,
          assignedTo: assignDto.assignedTo,
          assignedBy: userId,
          specialty: assignDto.specialty,
          role: assignDto.role,
          priority: assignDto.priority || caseReview.priority,
          dueDate: assignDto.dueDate ? new Date(assignDto.dueDate) : caseReview.dueDate,
          notes: assignDto.notes,
        },
      });

      // Update case review status
      await this.prisma.caseReview.update({
        where: { id: caseReviewId },
        data: { status: 'ASSIGNED' },
      });

      // Log audit
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: 'ASSIGN_CASE_REVIEW',
          resource: 'CaseReview',
          details: {
            caseReviewId,
            assignedTo: assignDto.assignedTo,
            specialty: assignDto.specialty,
          },
        },
      });

      this.logger.log(`Case review ${caseReviewId} assigned to ${assignDto.assignedTo}`);

      return assignment;
    } catch (error) {
      this.logger.error(`Error assigning case review ${caseReviewId}`, error);
      throw error;
    }
  }

  async addComment(caseReviewId: string, commentDto: AddCommentDto, userId: string): Promise<any> {
    try {
      const caseReview = await this.findById(caseReviewId);

      // If parent comment exists, verify it belongs to this case review
      if (commentDto.parentId) {
        const parentComment = await this.prisma.reviewComment.findUnique({
          where: { id: commentDto.parentId },
        });

        if (!parentComment || parentComment.caseReviewId !== caseReviewId) {
          throw new BadRequestException('Invalid parent comment');
        }
      }

      const comment = await this.prisma.reviewComment.create({
        data: {
          caseReviewId,
          parentId: commentDto.parentId,
          userId,
          comment: commentDto.comment,
          commentType: commentDto.commentType || 'GENERAL',
          isInternal: commentDto.isInternal || false,
          mentions: commentDto.mentions || [],
          attachments: commentDto.attachments,
        },
        include: {
          replies: true,
        },
      });

      // Log audit
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: 'ADD_CASE_REVIEW_COMMENT',
          resource: 'CaseReview',
          details: {
            caseReviewId,
            commentId: comment.id,
            commentType: commentDto.commentType,
          },
        },
      });

      this.logger.log(`Comment added to case review ${caseReviewId}`);

      return comment;
    } catch (error) {
      this.logger.error(`Error adding comment to case review ${caseReviewId}`, error);
      throw error;
    }
  }

  async updateStatus(caseReviewId: string, status: string, userId: string): Promise<any> {
    try {
      const caseReview = await this.findById(caseReviewId);

      const updated = await this.prisma.caseReview.update({
        where: { id: caseReviewId },
        data: {
          status,
          ...(status === 'IN_PROGRESS' && !caseReview.reviewedBy && { reviewedBy: userId, reviewedAt: new Date() }),
          ...(status === 'COMPLETED' && { completedAt: new Date() }),
        },
      });

      // Log audit
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: 'UPDATE_CASE_REVIEW_STATUS',
          resource: 'CaseReview',
          details: {
            caseReviewId,
            oldStatus: caseReview.status,
            newStatus: status,
          },
        },
      });

      this.logger.log(`Case review ${caseReviewId} status updated to ${status}`);

      return updated;
    } catch (error) {
      this.logger.error(`Error updating status for case review ${caseReviewId}`, error);
      throw error;
    }
  }

  async completeReview(
    caseReviewId: string,
    reviewNotes: string,
    outcome: string,
    resolution?: string,
    userId?: string,
  ): Promise<any> {
    try {
      const caseReview = await this.findById(caseReviewId);

      const completed = await this.prisma.caseReview.update({
        where: { id: caseReviewId },
        data: {
          status: 'COMPLETED',
          reviewNotes,
          outcome,
          resolution,
          completedAt: new Date(),
          ...(userId && { reviewedBy: userId, reviewedAt: new Date() }),
        },
      });

      // Complete all active assignments
      await this.prisma.reviewAssignment.updateMany({
        where: {
          caseReviewId,
          isActive: true,
          status: { not: 'COMPLETED' },
        },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
        },
      });

      // Log audit
      await this.prisma.auditLog.create({
        data: {
          userId: userId || caseReview.flaggedBy,
          action: 'COMPLETE_CASE_REVIEW',
          resource: 'CaseReview',
          details: {
            caseReviewId,
            outcome,
          },
        },
      });

      this.logger.log(`Case review ${caseReviewId} completed with outcome: ${outcome}`);

      return completed;
    } catch (error) {
      this.logger.error(`Error completing case review ${caseReviewId}`, error);
      throw error;
    }
  }

  async getQueueStatistics(specialty?: string, userId?: string): Promise<any> {
    try {
      const where: any = { isActive: true };
      if (specialty) {
        where.specialty = specialty;
      }

      const [
        totalPending,
        totalInReview,
        totalAssigned,
        totalCompleted,
        byPriority,
        byComplexity,
      ] = await Promise.all([
        this.prisma.caseReview.count({ where: { ...where, status: 'PENDING' } }),
        this.prisma.caseReview.count({ where: { ...where, status: 'IN_REVIEW' } }),
        this.prisma.caseReview.count({ where: { ...where, status: 'ASSIGNED' } }),
        this.prisma.caseReview.count({ where: { ...where, status: 'COMPLETED' } }),
        this.getPriorityStatistics(where),
        this.getComplexityStatistics(where),
      ]);

      let myAssignments = 0;
      if (userId) {
        myAssignments = await this.prisma.reviewAssignment.count({
          where: {
            assignedTo: userId,
            isActive: true,
            status: { in: ['ASSIGNED', 'ACCEPTED', 'IN_PROGRESS'] },
          },
        });
      }

      return {
        totalPending,
        totalInReview,
        totalAssigned,
        totalCompleted,
        myAssignments,
        byPriority,
        byComplexity,
      };
    } catch (error) {
      this.logger.error('Error getting queue statistics', error);
      throw error;
    }
  }

  private async findSimilarCases(currentCaseId: string, patientId: string, caseType: string): Promise<any[]> {
    try {
      // Find cases with similar type from the same patient
      const similarCases = await this.prisma.caseReview.findMany({
        where: {
          id: { not: currentCaseId },
          patientId,
          caseType,
          isActive: true,
        },
        select: {
          id: true,
          caseType: true,
          flagReason: true,
          status: true,
          outcome: true,
          flaggedAt: true,
        },
        take: 5,
        orderBy: { flaggedAt: 'desc' },
      });

      return similarCases;
    } catch (error) {
      this.logger.warn('Error finding similar cases', error);
      return [];
    }
  }

  private async getPriorityStatistics(where: any): Promise<any> {
    const stats = await this.prisma.caseReview.groupBy({
      by: ['priority'],
      where,
      _count: { priority: true },
    });

    return stats.reduce((acc, stat) => {
      acc[stat.priority] = stat._count.priority;
      return acc;
    }, {});
  }

  private async getComplexityStatistics(where: any): Promise<any> {
    const stats = await this.prisma.caseReview.groupBy({
      by: ['complexity'],
      where,
      _count: { complexity: true },
    });

    return stats.reduce((acc, stat) => {
      acc[stat.complexity] = stat._count.complexity;
      return acc;
    }, {});
  }
}
