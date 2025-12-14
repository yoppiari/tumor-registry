import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/database/prisma.service';

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

  // ==================== BONE LOCATIONS ====================

  /**
   * Format bone location display name
   */
  private formatBoneLocationName(location: any): string {
    if (location.level === 1) {
      return location.region; // e.g., "Upper Extremity"
    } else if (location.level === 2) {
      return location.boneName; // e.g., "Humerus"
    } else if (location.level === 3) {
      return location.segment
        ? `${location.boneName} - ${location.segment}`
        : location.boneName; // e.g., "Humerus - Proximal"
    }
    return location.code;
  }

  async findAllBoneLocations(level?: number, region?: string, includeChildren = false) {
    const where: any = { isActive: true };
    if (level) where.level = level;
    if (region) where.region = region;

    const locations = await this.prisma.boneLocation.findMany({
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

    // Add formatted name to each location
    return locations.map(loc => ({
      ...loc,
      name: this.formatBoneLocationName(loc),
      children: loc.children?.map(child => ({
        ...child,
        name: this.formatBoneLocationName(child),
        children: child.children?.map(grandchild => ({
          ...grandchild,
          name: this.formatBoneLocationName(grandchild),
        })),
      })),
    }));
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

    return {
      ...location,
      name: this.formatBoneLocationName(location),
      children: location.children?.map(child => ({
        ...child,
        name: this.formatBoneLocationName(child),
      })),
      parent: location.parent ? {
        ...location.parent,
        name: this.formatBoneLocationName(location.parent),
      } : null,
    };
  }

  async findBoneLocationsByParentId(parentId: string) {
    const locations = await this.prisma.boneLocation.findMany({
      where: { parentId, isActive: true },
      orderBy: { sortOrder: 'asc' },
    });

    return locations.map(loc => ({
      ...loc,
      name: this.formatBoneLocationName(loc),
    }));
  }

  // ==================== SOFT TISSUE LOCATIONS ====================

  /**
   * Format soft tissue location display name
   */
  private formatSoftTissueLocationName(location: any): string {
    if (location.specificLocation) {
      return location.specificLocation; // e.g., "Face", "Scalp", "Thigh"
    }
    return location.code;
  }

  async findAllSoftTissueLocations(anatomicalRegion?: string) {
    const where: any = { isActive: true };
    if (anatomicalRegion) where.anatomicalRegion = anatomicalRegion;

    const locations = await this.prisma.softTissueLocation.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });

    // Add formatted name to each location
    return locations.map(loc => ({
      ...loc,
      name: this.formatSoftTissueLocationName(loc),
    }));
  }

  async findSoftTissueLocationById(id: string) {
    const location = await this.prisma.softTissueLocation.findUnique({
      where: { id },
    });

    if (!location) {
      throw new NotFoundException(`Soft tissue location not found`);
    }

    return {
      ...location,
      name: this.formatSoftTissueLocationName(location),
    };
  }

  // ==================== UTILITY ====================

  async getBoneRegions() {
    const regions = await this.prisma.boneLocation.findMany({
      where: { level: 1, isActive: true },
      orderBy: { sortOrder: 'asc' },
    });

    return regions.map(loc => ({
      ...loc,
      name: this.formatBoneLocationName(loc),
    }));
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
