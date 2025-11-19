import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Center } from '@prisma/client';

@Injectable()
export class CentersService {
  private readonly logger = new Logger(CentersService.name);

  constructor(private prisma: PrismaService) {}

  async findAll(includeInactive = false): Promise<Center[]> {
    try {
      const centers = await this.prisma.center.findMany({
        where: {
          ...(includeInactive === false && { isActive: true }),
        },
        include: {
          _count: {
            select: {
              users: {
                where: {
                  isActive: true,
                },
              },
            },
          },
        },
        orderBy: [
          { name: 'asc' },
        ],
      });

      return centers;
    } catch (error) {
      this.logger.error('Error finding all centers', error);
      throw error;
    }
  }

  async findById(id: string, includeUsers = false): Promise<any> {
    try {
      const center = await this.prisma.center.findUnique({
        where: { id },
        include: {
          ...(includeUsers && {
            users: {
              where: {
                isActive: true,
              },
              select: {
                id: true,
                email: true,
                name: true,
                kolegiumId: true,
                isActive: true,
                createdAt: true,
                userRoles: {
                  include: {
                    role: true,
                  },
                },
              },
              orderBy: {
                name: 'asc',
              },
            },
          }),
          _count: {
            select: {
              users: {
                where: {
                  isActive: true,
                },
              },
            },
          },
        },
      });

      if (!center) {
        throw new NotFoundException(`Center with ID ${id} not found`);
      }

      return {
        ...center,
        userCount: center._count.users,
        _count: undefined,
      };
    } catch (error) {
      this.logger.error(`Error finding center by ID: ${id}`, error);
      throw error;
    }
  }

  async findByCode(code: string): Promise<Center> {
    try {
      const center = await this.prisma.center.findUnique({
        where: { code },
      });

      if (!center) {
        throw new NotFoundException(`Center with code ${code} not found`);
      }

      return center;
    } catch (error) {
      this.logger.error(`Error finding center by code: ${code}`, error);
      throw error;
    }
  }

  async create(centerData: {
    name: string;
    code: string;
    province: string;
    regency?: string;
    address?: string;
  }): Promise<Center> {
    try {
      // Check if center code already exists
      const existingCenter = await this.prisma.center.findUnique({
        where: { code: centerData.code.toUpperCase() },
      });

      if (existingCenter) {
        throw new ConflictException(`Center with code ${centerData.code} already exists`);
      }

      const center = await this.prisma.center.create({
        data: {
          name: centerData.name,
          code: centerData.code.toUpperCase(),
          province: centerData.province,
          regency: centerData.regency,
          address: centerData.address,
        },
      });

      this.logger.log(`Center created: ${center.name} (${center.code})`);
      return center;
    } catch (error) {
      this.logger.error(`Error creating center: ${centerData.name}`, error);
      throw error;
    }
  }

  async update(
    id: string,
    updateData: {
      name?: string;
      province?: string;
      regency?: string;
      address?: string;
      isActive?: boolean;
    },
  ): Promise<Center> {
    try {
      // Check if center exists
      const existingCenter = await this.findById(id);

      // Prevent updating the default center's active status
      if (existingCenter.code === 'DEFAULT' && updateData.isActive !== undefined) {
        throw new ConflictException('Cannot modify active status of default center');
      }

      const updatedCenter = await this.prisma.center.update({
        where: { id },
        data: {
          ...(updateData.name && { name: updateData.name }),
          ...(updateData.province && { province: updateData.province }),
          ...(updateData.regency !== undefined && { regency: updateData.regency }),
          ...(updateData.address !== undefined && { address: updateData.address }),
          ...(updateData.isActive !== undefined && { isActive: updateData.isActive }),
        },
      });

      this.logger.log(`Center updated: ${updatedCenter.name} (${updatedCenter.code})`);
      return updatedCenter;
    } catch (error) {
      this.logger.error(`Error updating center with ID: ${id}`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const center = await this.findById(id);

      // Prevent deleting the default center
      if (center.code === 'DEFAULT') {
        throw new ConflictException('Cannot delete default center');
      }

      // Check if center has active users
      const userCount = await this.prisma.user.count({
        where: {
          centerId: id,
          isActive: true,
        },
      });

      if (userCount > 0) {
        throw new ConflictException(`Cannot delete center with ${userCount} active users`);
      }

      await this.prisma.center.delete({
        where: { id },
      });

      this.logger.log(`Center deleted: ${center.name} (${center.code})`);
    } catch (error) {
      this.logger.error(`Error deleting center with ID: ${id}`, error);
      throw error;
    }
  }

  async deactivate(id: string): Promise<Center> {
    try {
      const center = await this.findById(id);

      // Prevent deactivating the default center
      if (center.code === 'DEFAULT') {
        throw new ConflictException('Cannot deactivate default center');
      }

      const deactivatedCenter = await this.prisma.center.update({
        where: { id },
        data: { isActive: false },
      });

      this.logger.log(`Center deactivated: ${deactivatedCenter.name} (${deactivatedCenter.code})`);
      return deactivatedCenter;
    } catch (error) {
      this.logger.error(`Error deactivating center with ID: ${id}`, error);
      throw error;
    }
  }

  async activate(id: string): Promise<Center> {
    try {
      const activatedCenter = await this.prisma.center.update({
        where: { id },
        data: { isActive: true },
      });

      this.logger.log(`Center activated: ${activatedCenter.name} (${activatedCenter.code})`);
      return activatedCenter;
    } catch (error) {
      this.logger.error(`Error activating center with ID: ${id}`, error);
      throw error;
    }
  }

  async getStatistics(): Promise<any> {
    try {
      const [totalCenters, activeCenters, inactiveCenters] = await Promise.all([
        this.prisma.center.count(),
        this.prisma.center.count({
          where: { isActive: true },
        }),
        this.prisma.center.count({
          where: { isActive: false },
        }),
      ]);

      // Get user statistics per center
      const centerUserStats = await this.prisma.center.findMany({
        select: {
          id: true,
          name: true,
          code: true,
          _count: {
            select: {
              users: {
                where: {
                  isActive: true,
                },
              },
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      });

      return {
        totalCenters,
        activeCenters,
        inactiveCenters,
        centerUserStats: centerUserStats.map(center => ({
          id: center.id,
          name: center.name,
          code: center.code,
          userCount: center._count.users,
        })),
      };
    } catch (error) {
      this.logger.error('Error getting center statistics', error);
      throw error;
    }
  }

  async getCenterUsers(centerId: string): Promise<any[]> {
    try {
      const users = await this.prisma.user.findMany({
        where: {
          centerId,
          isActive: true,
        },
        select: {
          id: true,
          email: true,
          name: true,
          kolegiumId: true,
          isActive: true,
          createdAt: true,
          userRoles: {
            include: {
              role: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      });

      return users.map(user => ({
        ...user,
        roles: user.userRoles.map(ur => ur.role),
        userRoles: undefined,
      }));
    } catch (error) {
      this.logger.error(`Error getting users for center ${centerId}`, error);
      throw error;
    }
  }
}