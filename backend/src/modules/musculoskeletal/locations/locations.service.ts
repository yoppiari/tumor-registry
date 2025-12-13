import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/database/prisma.service';

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

  // ==================== BONE LOCATIONS ====================

  async findAllBoneLocations(level?: number, region?: string, includeChildren = false) {
    const where: any = { isActive: true };
    if (level) where.level = level;
    if (region) where.region = region;

    return this.prisma.boneLocation.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
      include: includeChildren
        ? {
            children: {
              where: { isActive: true },
              orderBy: { sortOrder: 'asc' },
              include: {
                children: {
                  where: { isActive: true },
                  orderBy: { sortOrder: 'asc' },
                },
              },
            },
          }
        : undefined,
    });
  }

  async findBoneLocationById(id: string) {
    const location = await this.prisma.boneLocation.findUnique({
      where: { id },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
        parent: true,
      },
    });

    if (!location) {
      throw new NotFoundException(`Bone location not found`);
    }

    return location;
  }

  async findBoneLocationsByParentId(parentId: string) {
    return this.prisma.boneLocation.findMany({
      where: { parentId, isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  // ==================== SOFT TISSUE LOCATIONS ====================

  async findAllSoftTissueLocations(anatomicalRegion?: string) {
    const where: any = { isActive: true };
    if (anatomicalRegion) where.anatomicalRegion = anatomicalRegion;

    return this.prisma.softTissueLocation.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findSoftTissueLocationById(id: string) {
    const location = await this.prisma.softTissueLocation.findUnique({
      where: { id },
    });

    if (!location) {
      throw new NotFoundException(`Soft tissue location not found`);
    }

    return location;
  }

  // ==================== UTILITY ====================

  async getBoneRegions() {
    const regions = await this.prisma.boneLocation.findMany({
      where: { level: 1, isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    return regions;
  }

  async getSoftTissueRegions() {
    const regions = await this.prisma.softTissueLocation.groupBy({
      by: ['anatomicalRegion'],
      where: { isActive: true },
      orderBy: { anatomicalRegion: 'asc' },
    });
    return regions.map((r) => r.anatomicalRegion);
  }
}
