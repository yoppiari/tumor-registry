import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ResearchService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    const requests = await this.prisma.researchRequest.findMany({
      where: {
        createdBy: userId,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        principalInvestigator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform to match frontend format
    return requests.map((req) => ({
      id: req.id,
      title: req.title,
      description: req.description,
      status: req.status,
      studyType: req.studyType,
      submittedAt: req.submittedAt,
      createdAt: req.createdAt,
      creator: req.creator,
      principalInvestigator: req.principalInvestigator,
    }));
  }

  async findById(id: string, userId: string) {
    return this.prisma.researchRequest.findFirst({
      where: {
        id,
        createdBy: userId,
      },
      include: {
        creator: true,
        principalInvestigator: true,
      },
    });
  }

  async create(data: any, userId: string) {
    return this.prisma.researchRequest.create({
      data: {
        title: data.title,
        description: data.description,
        principalInvestigatorId: userId,
        studyType: data.studyType || 'OBSERVATIONAL',
        objectives: data.objectives || '',
        methodology: data.methodology || '',
        inclusionCriteria: data.inclusionCriteria || '',
        exclusionCriteria: data.exclusionCriteria || '',
        sampleSize: data.sampleSize || 100,
        duration: data.duration || 12,
        dataRequested: data.dataRequested || '',
        createdBy: userId,
      },
      include: {
        creator: true,
        principalInvestigator: true,
      },
    });
  }

  async update(id: string, data: any, userId: string) {
    return this.prisma.researchRequest.update({
      where: {
        id,
        createdBy: userId,
      },
      data: {
        title: data.title,
        description: data.description,
        objectives: data.objectives,
        methodology: data.methodology,
        status: data.status,
        updatedAt: new Date(),
      },
      include: {
        creator: true,
        principalInvestigator: true,
      },
    });
  }

  async delete(id: string, userId: string) {
    return this.prisma.researchRequest.delete({
      where: {
        id,
        createdBy: userId,
      },
    });
  }
}
