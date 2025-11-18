"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RolesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let RolesService = RolesService_1 = class RolesService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(RolesService_1.name);
    }
    async findAll(includePermissions = false) {
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
        }
        catch (error) {
            this.logger.error('Error finding all roles', error);
            throw error;
        }
    }
    async findById(id, includePermissions = false) {
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
                throw new common_1.NotFoundException(`Role with ID ${id} not found`);
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
        }
        catch (error) {
            this.logger.error(`Error finding role by ID: ${id}`, error);
            throw error;
        }
    }
    async findByCode(code) {
        try {
            const role = await this.prisma.role.findUnique({
                where: { code },
            });
            if (!role) {
                throw new common_1.NotFoundException(`Role with code ${code} not found`);
            }
            return role;
        }
        catch (error) {
            this.logger.error(`Error finding role by code: ${code}`, error);
            throw error;
        }
    }
    async create(roleData) {
        try {
            const role = await this.prisma.role.create({
                data: {
                    name: roleData.name,
                    code: roleData.code.toUpperCase(),
                    description: roleData.description,
                    level: roleData.level,
                },
            });
            if (roleData.permissionCodes && roleData.permissionCodes.length > 0) {
                await this.assignPermissions(role.id, roleData.permissionCodes);
            }
            this.logger.log(`Role created: ${role.name} (${role.code})`);
            return role;
        }
        catch (error) {
            this.logger.error(`Error creating role: ${roleData.name}`, error);
            throw error;
        }
    }
    async update(id, updateData) {
        try {
            const existingRole = await this.findById(id);
            if (['SYSTEM_ADMIN', 'NATIONAL_ADMIN'].includes(existingRole.code)) {
                throw new common_1.ForbiddenException('Cannot modify system administrator roles');
            }
            const updatedRole = await this.prisma.role.update({
                where: { id },
                data: {
                    ...(updateData.name && { name: updateData.name }),
                    ...(updateData.description !== undefined && { description: updateData.description }),
                    ...(updateData.level !== undefined && { level: updateData.level }),
                },
            });
            if (updateData.permissionCodes !== undefined) {
                await this.updateRolePermissions(id, updateData.permissionCodes);
            }
            this.logger.log(`Role updated: ${updatedRole.name} (${updatedRole.code})`);
            return updatedRole;
        }
        catch (error) {
            this.logger.error(`Error updating role with ID: ${id}`, error);
            throw error;
        }
    }
    async delete(id) {
        try {
            const role = await this.findById(id);
            if (['SYSTEM_ADMIN', 'NATIONAL_ADMIN'].includes(role.code)) {
                throw new common_1.ForbiddenException('Cannot delete system administrator roles');
            }
            const userCount = await this.prisma.userRole.count({
                where: {
                    roleId: id,
                    isActive: true,
                },
            });
            if (userCount > 0) {
                throw new common_1.ForbiddenException(`Cannot delete role with ${userCount} active users`);
            }
            await this.prisma.role.delete({
                where: { id },
            });
            this.logger.log(`Role deleted: ${role.name} (${role.code})`);
        }
        catch (error) {
            this.logger.error(`Error deleting role with ID: ${id}`, error);
            throw error;
        }
    }
    async assignPermissions(roleId, permissionCodes) {
        try {
            const permissions = await this.prisma.permission.findMany({
                where: {
                    code: {
                        in: permissionCodes,
                    },
                },
            });
            if (permissions.length !== permissionCodes.length) {
                throw new common_1.NotFoundException('Some permissions not found');
            }
            const rolePermissions = permissions.map(permission => ({
                roleId,
                permissionId: permission.id,
            }));
            await this.prisma.rolePermission.createMany({
                data: rolePermissions,
                skipDuplicates: true,
            });
            this.logger.log(`Assigned ${permissions.length} permissions to role ${roleId}`);
        }
        catch (error) {
            this.logger.error(`Error assigning permissions to role ${roleId}`, error);
            throw error;
        }
    }
    async updateRolePermissions(roleId, permissionCodes) {
        try {
            await this.prisma.$transaction(async (tx) => {
                await tx.rolePermission.deleteMany({
                    where: {
                        roleId,
                    },
                });
                if (permissionCodes.length > 0) {
                    const permissions = await tx.permission.findMany({
                        where: {
                            code: {
                                in: permissionCodes,
                            },
                        },
                    });
                    if (permissions.length !== permissionCodes.length) {
                        throw new common_1.NotFoundException('Some permissions not found');
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
        }
        catch (error) {
            this.logger.error(`Error updating permissions for role ${roleId}`, error);
            throw error;
        }
    }
    async getRolePermissions(roleId) {
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
        }
        catch (error) {
            this.logger.error(`Error getting permissions for role ${roleId}`, error);
            throw error;
        }
    }
    async getAllPermissions() {
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
        }
        catch (error) {
            this.logger.error('Error getting all permissions', error);
            throw error;
        }
    }
    async getRoleHierarchy() {
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
        }
        catch (error) {
            this.logger.error('Error getting role hierarchy', error);
            throw error;
        }
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = RolesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RolesService);
//# sourceMappingURL=roles.service.js.map