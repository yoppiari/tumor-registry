import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import {
  CreateResearcherProfileDto,
  UpdateResearcherProfileDto,
  CreateResearchProjectDto,
  UpdateResearchProjectDto,
  AddProjectMemberDto,
  UpdateProjectMemberDto,
  CreateAnnotationDto,
  UpdateAnnotationDto,
  FindExpertsDto,
} from '../dto/collaboration.dto';

@Injectable()
export class CollaborationService {
  private readonly logger = new Logger(CollaborationService.name);

  constructor(private prisma: PrismaService) {}

  // Researcher Profile Management

  async createResearcherProfile(createDto: CreateResearcherProfileDto) {
    try {
      // Check if profile already exists
      const existing = await this.prisma.researcherProfile.findUnique({
        where: { userId: createDto.userId },
      });

      if (existing) {
        throw new ConflictException(`Researcher profile already exists for user ${createDto.userId}`);
      }

      const profile = await this.prisma.researcherProfile.create({
        data: createDto,
      });

      this.logger.log(`Researcher profile created for user: ${createDto.userId}`);
      return profile;
    } catch (error) {
      this.logger.error('Error creating researcher profile', error);
      throw error;
    }
  }

  async getResearcherProfile(userId: string) {
    try {
      const profile = await this.prisma.researcherProfile.findUnique({
        where: { userId },
        include: {
          projectMemberships: {
            include: {
              project: {
                select: {
                  id: true,
                  name: true,
                  status: true,
                },
              },
            },
          },
        },
      });

      if (!profile) {
        throw new NotFoundException(`Researcher profile not found for user ${userId}`);
      }

      return profile;
    } catch (error) {
      this.logger.error(`Error retrieving researcher profile for user: ${userId}`, error);
      throw error;
    }
  }

  async updateResearcherProfile(userId: string, updateDto: UpdateResearcherProfileDto) {
    try {
      const profile = await this.prisma.researcherProfile.update({
        where: { userId },
        data: updateDto,
      });

      this.logger.log(`Researcher profile updated for user: ${userId}`);
      return profile;
    } catch (error) {
      this.logger.error(`Error updating researcher profile for user: ${userId}`, error);
      throw error;
    }
  }

  async searchResearcherProfiles(filters: {
    keywords?: string[];
    institution?: string;
    expertise?: string[];
    isAvailableForCollab?: boolean;
    page?: number;
    limit?: number;
  }) {
    try {
      const { page = 1, limit = 20 } = filters;
      const skip = (page - 1) * limit;

      const where: any = { isPublic: true };

      if (filters.institution) {
        where.institution = { contains: filters.institution, mode: 'insensitive' };
      }

      if (filters.expertise && filters.expertise.length > 0) {
        where.expertise = { hasSome: filters.expertise };
      }

      if (filters.isAvailableForCollab !== undefined) {
        where.isAvailableForCollab = filters.isAvailableForCollab;
      }

      if (filters.keywords && filters.keywords.length > 0) {
        where.OR = [
          { researchInterests: { hasSome: filters.keywords } },
          { expertise: { hasSome: filters.keywords } },
        ];
      }

      const [profiles, total] = await Promise.all([
        this.prisma.researcherProfile.findMany({
          where,
          skip,
          take: limit,
          orderBy: [
            { publications: 'desc' },
            { hIndex: 'desc' },
          ],
        }),
        this.prisma.researcherProfile.count({ where }),
      ]);

      return {
        profiles,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error('Error searching researcher profiles', error);
      throw error;
    }
  }

  // Expert Matching Algorithm

  async findExperts(userId: string, findExpertsDto: FindExpertsDto) {
    try {
      const { researchArea, keywords = [], minMatchScore = 50, maxResults = 10 } = findExpertsDto;

      // Get all public researcher profiles except the requesting user
      const profiles = await this.prisma.researcherProfile.findMany({
        where: {
          isPublic: true,
          isAvailableForCollab: true,
          userId: { not: userId },
        },
      });

      // Calculate match scores for each profile
      const matches = profiles
        .map(profile => {
          const matchScore = this.calculateExpertMatchScore(profile, researchArea, keywords);
          const matchReason = this.generateMatchReason(profile, researchArea, keywords);

          return {
            profile,
            matchScore,
            matchReason,
            basedOn: {
              researchInterests: profile.researchInterests,
              expertise: profile.expertise,
              publications: profile.publications,
              hIndex: profile.hIndex,
            },
          };
        })
        .filter(match => match.matchScore >= minMatchScore)
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, maxResults);

      // Save expert matches for future reference
      for (const match of matches) {
        await this.prisma.expertMatch.upsert({
          where: {
            id: `${userId}_${match.profile.userId}_${researchArea}`,
          },
          update: {
            matchScore: match.matchScore,
            matchReason: match.matchReason,
            basedOn: match.basedOn,
            updatedAt: new Date(),
          },
          create: {
            userId,
            expertUserId: match.profile.userId,
            matchScore: match.matchScore,
            matchReason: match.matchReason,
            researchArea,
            basedOn: match.basedOn,
          },
        });
      }

      this.logger.log(`Found ${matches.length} expert matches for user ${userId} in area: ${researchArea}`);
      return matches;
    } catch (error) {
      this.logger.error('Error finding experts', error);
      throw error;
    }
  }

  private calculateExpertMatchScore(
    profile: any,
    researchArea: string,
    keywords: string[]
  ): number {
    let score = 0;
    const lowerArea = researchArea.toLowerCase();
    const lowerKeywords = keywords.map(k => k.toLowerCase());

    // Check research interests (40 points max)
    const matchingInterests = profile.researchInterests.filter((interest: string) =>
      interest.toLowerCase().includes(lowerArea) ||
      lowerKeywords.some(k => interest.toLowerCase().includes(k))
    );
    score += Math.min(40, matchingInterests.length * 10);

    // Check expertise (40 points max)
    const matchingExpertise = profile.expertise.filter((exp: string) =>
      exp.toLowerCase().includes(lowerArea) ||
      lowerKeywords.some(k => exp.toLowerCase().includes(k))
    );
    score += Math.min(40, matchingExpertise.length * 10);

    // Publications count (10 points max)
    score += Math.min(10, (profile.publications || 0) / 10);

    // H-index (10 points max)
    score += Math.min(10, (profile.hIndex || 0) / 2);

    return Math.min(100, Math.round(score));
  }

  private generateMatchReason(profile: any, researchArea: string, keywords: string[]): string {
    const reasons: string[] = [];

    const lowerArea = researchArea.toLowerCase();
    const matchingInterests = profile.researchInterests.filter((i: string) =>
      i.toLowerCase().includes(lowerArea)
    );
    const matchingExpertise = profile.expertise.filter((e: string) =>
      e.toLowerCase().includes(lowerArea)
    );

    if (matchingInterests.length > 0) {
      reasons.push(`Research interests in ${matchingInterests.join(', ')}`);
    }

    if (matchingExpertise.length > 0) {
      reasons.push(`Expertise in ${matchingExpertise.join(', ')}`);
    }

    if (profile.publications > 20) {
      reasons.push(`Highly published (${profile.publications} publications)`);
    }

    if (profile.hIndex > 10) {
      reasons.push(`High impact (h-index: ${profile.hIndex})`);
    }

    return reasons.join('; ');
  }

  // Research Project Management

  async createResearchProject(userId: string, createDto: CreateResearchProjectDto) {
    try {
      const project = await this.prisma.researchProject.create({
        data: {
          ...createDto,
          createdBy: userId,
        },
      });

      this.logger.log(`Research project created: ${project.name} by user ${userId}`);
      return project;
    } catch (error) {
      this.logger.error('Error creating research project', error);
      throw error;
    }
  }

  async getResearchProject(id: string) {
    try {
      const project = await this.prisma.researchProject.findUnique({
        where: { id },
        include: {
          members: {
            include: {
              researcher: true,
            },
          },
          annotations: {
            orderBy: { createdAt: 'desc' },
            take: 50,
          },
          researchRequest: {
            select: {
              id: true,
              title: true,
              status: true,
            },
          },
        },
      });

      if (!project) {
        throw new NotFoundException(`Research project with ID ${id} not found`);
      }

      return project;
    } catch (error) {
      this.logger.error(`Error retrieving research project: ${id}`, error);
      throw error;
    }
  }

  async updateResearchProject(id: string, userId: string, updateDto: UpdateResearchProjectDto) {
    try {
      const project = await this.getResearchProject(id);

      // Check if user has permission to update (owner or lead member)
      const isOwner = project.createdBy === userId;
      const isLead = project.members.some(
        m => m.researcher.userId === userId && m.role === 'LEAD'
      );

      if (!isOwner && !isLead) {
        throw new NotFoundException(`Research project with ID ${id} not found`);
      }

      const updated = await this.prisma.researchProject.update({
        where: { id },
        data: updateDto,
      });

      this.logger.log(`Research project updated: ${id}`);
      return updated;
    } catch (error) {
      this.logger.error(`Error updating research project: ${id}`, error);
      throw error;
    }
  }

  async getUserProjects(userId: string, filters?: {
    status?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const { page = 1, limit = 20, status } = filters || {};
      const skip = (page - 1) * limit;

      // First get researcher profile
      const profile = await this.prisma.researcherProfile.findUnique({
        where: { userId },
      });

      if (!profile) {
        return { projects: [], total: 0, page, totalPages: 0 };
      }

      const where: any = {
        OR: [
          { createdBy: userId },
          {
            members: {
              some: {
                researcherProfileId: profile.id,
                status: 'ACTIVE',
              },
            },
          },
        ],
      };

      if (status) {
        where.status = status;
      }

      const [projects, total] = await Promise.all([
        this.prisma.researchProject.findMany({
          where,
          include: {
            members: {
              include: {
                researcher: {
                  select: {
                    id: true,
                    userId: true,
                    title: true,
                    institution: true,
                  },
                },
              },
            },
          },
          skip,
          take: limit,
          orderBy: { updatedAt: 'desc' },
        }),
        this.prisma.researchProject.count({ where }),
      ]);

      return {
        projects,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error('Error retrieving user projects', error);
      throw error;
    }
  }

  // Project Team Management

  async addProjectMember(projectId: string, invitedBy: string, addMemberDto: AddProjectMemberDto) {
    try {
      const member = await this.prisma.projectMember.create({
        data: {
          projectId,
          researcherProfileId: addMemberDto.researcherProfileId,
          role: addMemberDto.role,
          permissions: addMemberDto.permissions,
          invitedBy,
        },
        include: {
          researcher: true,
        },
      });

      this.logger.log(`Member added to project ${projectId}: ${member.researcher.userId}`);
      return member;
    } catch (error) {
      this.logger.error('Error adding project member', error);
      throw error;
    }
  }

  async updateProjectMember(
    projectId: string,
    memberId: string,
    updateDto: UpdateProjectMemberDto
  ) {
    try {
      const member = await this.prisma.projectMember.update({
        where: { id: memberId },
        data: updateDto,
      });

      this.logger.log(`Project member updated: ${memberId}`);
      return member;
    } catch (error) {
      this.logger.error(`Error updating project member: ${memberId}`, error);
      throw error;
    }
  }

  async removeProjectMember(projectId: string, memberId: string) {
    try {
      await this.prisma.projectMember.delete({
        where: { id: memberId },
      });

      this.logger.log(`Member removed from project: ${memberId}`);
      return { message: 'Member removed successfully' };
    } catch (error) {
      this.logger.error(`Error removing project member: ${memberId}`, error);
      throw error;
    }
  }

  // Dataset Annotations

  async createAnnotation(projectId: string, userId: string, createDto: CreateAnnotationDto) {
    try {
      const annotation = await this.prisma.datasetAnnotation.create({
        data: {
          projectId,
          ...createDto,
          createdBy: userId,
        },
      });

      this.logger.log(`Annotation created for project ${projectId}`);
      return annotation;
    } catch (error) {
      this.logger.error('Error creating annotation', error);
      throw error;
    }
  }

  async getAnnotations(projectId: string, filters?: {
    datasetType?: string;
    datasetId?: string;
    annotationType?: string;
    isResolved?: boolean;
  }) {
    try {
      const where: any = { projectId };

      if (filters?.datasetType) {
        where.datasetType = filters.datasetType;
      }

      if (filters?.datasetId) {
        where.datasetId = filters.datasetId;
      }

      if (filters?.annotationType) {
        where.annotationType = filters.annotationType;
      }

      if (filters?.isResolved !== undefined) {
        where.isResolved = filters.isResolved;
      }

      const annotations = await this.prisma.datasetAnnotation.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      return annotations;
    } catch (error) {
      this.logger.error('Error retrieving annotations', error);
      throw error;
    }
  }

  async updateAnnotation(id: string, userId: string, updateDto: UpdateAnnotationDto) {
    try {
      const annotation = await this.prisma.datasetAnnotation.findUnique({
        where: { id },
      });

      if (!annotation) {
        throw new NotFoundException(`Annotation with ID ${id} not found`);
      }

      const updated = await this.prisma.datasetAnnotation.update({
        where: { id },
        data: {
          ...updateDto,
          ...(updateDto.isResolved && { resolvedBy: userId, resolvedAt: new Date() }),
        },
      });

      this.logger.log(`Annotation updated: ${id}`);
      return updated;
    } catch (error) {
      this.logger.error(`Error updating annotation: ${id}`, error);
      throw error;
    }
  }

  async deleteAnnotation(id: string, userId: string) {
    try {
      const annotation = await this.prisma.datasetAnnotation.findUnique({
        where: { id },
      });

      if (!annotation) {
        throw new NotFoundException(`Annotation with ID ${id} not found`);
      }

      // Only creator can delete
      if (annotation.createdBy !== userId) {
        throw new NotFoundException(`Annotation with ID ${id} not found`);
      }

      await this.prisma.datasetAnnotation.delete({
        where: { id },
      });

      this.logger.log(`Annotation deleted: ${id}`);
      return { message: 'Annotation deleted successfully' };
    } catch (error) {
      this.logger.error(`Error deleting annotation: ${id}`, error);
      throw error;
    }
  }
}
