import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);

  constructor(private prisma: PrismaService) {}

  async findAll(includePermissions = false): Promise<any[]> {
    try {
      const roles = await this.prisma.role.findMany({
        include: {
          ...(includePermissions && {
            permissions: {
              include: {
                permission: true,
              },
            },
          }),
          _count: {
            select: {
              userRoles: {
                where: {
                  isActive: true,
                },
              },
            },
          },
        },
        orderBy: {
          level: 'asc',
        },
      });

      return roles.map(role => ({
        ...role,
        userCount: role._count.userRoles,
        ...(includePermissions && {
          permissions: role.permissions.map(rp => rp.permission),
          permissionCount: role.permissions.length,
        }),
        _count: undefined,
      }));
    } catch (error) {
      this.logger.error('Error finding all roles', error);
      throw error;
    }
  }

  async findById(id: string, includePermissions = false): Promise<any> {
    try {
      const role = await this.prisma.role.findUnique({
        where: { id },
        include: {
          ...(includePermissions && {
            permissions: {
              include: {
                permission: true,
              },
            },
          }),
          _count: {
            select: {
              userRoles: {
                where: {
                  isActive: true,
                },
              },
            },
          },
        },
      });

      if (!role) {
        throw new NotFoundException(`Role with ID ${id} not found`);
      }

      return {
        ...role,
        userCount: role._count.userRoles,
        ...(includePermissions && {
          permissions: role.permissions.map(rp => rp.permission),
          permissionCount: role.permissions.length,
        }),
        _count: undefined,
      };
    } catch (error) {
      this.logger.error(`Error finding role by ID: ${id}`, error);
      throw error;
    }
  }

  async findByCode(code: string): Promise<Role> {
    try {
      const role = await this.prisma.role.findUnique({
        where: { code },
      });

      if (!role) {
        throw new NotFoundException(`Role with code ${code} not found`);
      }

      return role;
    } catch (error) {
      this.logger.error(`Error finding role by code: ${code}`, error);
      throw error;
    }
  }

  async create(roleData: {
    name: string;
    code: string;
    description?: string;
    level: number;
    permissionCodes?: string[];
  }): Promise<Role> {
    try {
      const role = await this.prisma.role.create({
        data: {
          name: roleData.name,
          code: roleData.code.toUpperCase(),
          description: roleData.description,
          level: roleData.level,
        },
      });

      // Assign permissions if provided
      if (roleData.permissionCodes && roleData.permissionCodes.length > 0) {
        await this.assignPermissions(role.id, roleData.permissionCodes);
      }

      this.logger.log(`Role created: ${role.name} (${role.code})`);
      return role;
    } catch (error) {
      this.logger.error(`Error creating role: ${roleData.name}`, error);
      throw error;
    }
  }

  async update(
    id: string,
    updateData: {
      name?: string;
      description?: string;
      level?: number;
      permissionCodes?: string[];
    },
  ): Promise<Role> {
    try {
      // Check if role exists
      const existingRole = await this.findById(id);

      // Prevent modifying system roles
      if (['SYSTEM_ADMIN', 'NATIONAL_ADMIN'].includes(existingRole.code)) {
        throw new ForbiddenException('Cannot modify system administrator roles');
      }

      const updatedRole = await this.prisma.role.update({
        where: { id },
        data: {
          ...(updateData.name && { name: updateData.name }),
          ...(updateData.description !== undefined && { description: updateData.description }),
          ...(updateData.level !== undefined && { level: updateData.level }),
        },
      });

      // Update permissions if provided
      if (updateData.permissionCodes !== undefined) {
        await this.updateRolePermissions(id, updateData.permissionCodes);
      }

      this.logger.log(`Role updated: ${updatedRole.name} (${updatedRole.code})`);
      return updatedRole;
    } catch (error) {
      this.logger.error(`Error updating role with ID: ${id}`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const role = await this.findById(id);

      // Prevent deleting system roles
      if (['SYSTEM_ADMIN', 'NATIONAL_ADMIN'].includes(role.code)) {
        throw new ForbiddenException('Cannot delete system administrator roles');
      }

      // Check if role has active users
      const userCount = await this.prisma.userRole.count({
        where: {
          roleId: id,
          isActive: true,
        },
      });

      if (userCount > 0) {
        throw new ForbiddenException(`Cannot delete role with ${userCount} active users`);
      }

      await this.prisma.role.delete({
        where: { id },
      });

      this.logger.log(`Role deleted: ${role.name} (${role.code})`);
    } catch (error) {
      this.logger.error(`Error deleting role with ID: ${id}`, error);
      throw error;
    }
  }

  async assignPermissions(roleId: string, permissionCodes: string[]): Promise<void> {
    try {
      // Get permissions by codes
      const permissions = await this.prisma.permission.findMany({
        where: {
          code: {
            in: permissionCodes,
          },
        },
      });

      if (permissions.length !== permissionCodes.length) {
        throw new NotFoundException('Some permissions not found');
      }

      // Create role-permission relationships
      const rolePermissions = permissions.map(permission => ({
        roleId,
        permissionId: permission.id,
      }));

      await this.prisma.rolePermission.createMany({
        data: rolePermissions,
        skipDuplicates: true,
      });

      this.logger.log(`Assigned ${permissions.length} permissions to role ${roleId}`);
    } catch (error) {
      this.logger.error(`Error assigning permissions to role ${roleId}`, error);
      throw error;
    }
  }

  async updateRolePermissions(roleId: string, permissionCodes: string[]): Promise<void> {
    try {
      await this.prisma.$transaction(async (tx) => {
        // Remove existing permissions
        await tx.rolePermission.deleteMany({
          where: {
            roleId,
          },
        });

        // Add new permissions if provided
        if (permissionCodes.length > 0) {
          const permissions = await tx.permission.findMany({
            where: {
              code: {
                in: permissionCodes,
              },
            },
          });

          if (permissions.length !== permissionCodes.length) {
            throw new NotFoundException('Some permissions not found');
          }

          const rolePermissions = permissions.map(permission => ({
            roleId,
            permissionId: permission.id,
          }));

          await tx.rolePermission.createMany({
            data: rolePermissions,
          });
        }
      });

      this.logger.log(`Updated permissions for role ${roleId} with ${permissionCodes.length} permissions`);
    } catch (error) {
      this.logger.error(`Error updating permissions for role ${roleId}`, error);
      throw error;
    }
  }

  async getRolePermissions(roleId: string): Promise<any[]> {
    try {
      const rolePermissions = await this.prisma.rolePermission.findMany({
        where: {
          roleId,
        },
        include: {
          permission: true,
        },
      });

      return rolePermissions.map(rp => rp.permission);
    } catch (error) {
      this.logger.error(`Error getting permissions for role ${roleId}`, error);
      throw error;
    }
  }

  async getAllPermissions(): Promise<any[]> {
    try {
      const permissions = await this.prisma.permission.findMany({
        orderBy: [
          {
            resource: 'asc',
          },
          {
            action: 'asc',
          },
        ],
      });

      // Group by resource
      const grouped = permissions.reduce((acc, permission) => {
        if (!acc[permission.resource]) {
          acc[permission.resource] = [];
        }
        acc[permission.resource].push(permission);
        return acc;
      }, {});

      return Object.entries(grouped).map(([resource, perms]) => ({
        resource,
        permissions: perms,
      }));
    } catch (error) {
      this.logger.error('Error getting all permissions', error);
      throw error;
    }
  }

  async getRoleHierarchy(): Promise<any[]> {
    try {
      const roles = await this.prisma.role.findMany({
        include: {
          _count: {
            select: {
              userRoles: {
                where: {
                  isActive: true,
                },
              },
            },
          },
        },
        orderBy: {
          level: 'asc',
        },
      });

      return roles.map(role => ({
        id: role.id,
        name: role.name,
        code: role.code,
        level: role.level,
        description: role.description,
        userCount: role._count.userRoles,
      }));
    } catch (error) {
      this.logger.error('Error getting role hierarchy', error);
      throw error;
    }
  }
}