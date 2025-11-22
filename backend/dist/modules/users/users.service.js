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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/database/prisma.service");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userData) {
        const { email, name, kolegiumId, passwordHash, phone, nik, role = 'STAFF', centerId } = userData;
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        let userCenterId = centerId;
        if (!centerId) {
            const center = await this.prisma.center.create({
                data: {
                    name: 'Default Center',
                    code: 'DEFAULT',
                    province: 'DKI Jakarta',
                },
            });
            userCenterId = center.id;
        }
        const userRole = await this.prisma.role.findUnique({
            where: { code: role },
        });
        if (!userRole) {
            throw new common_1.NotFoundException(`Role ${role} not found`);
        }
        const user = await this.prisma.user.create({
            data: {
                email,
                name,
                kolegiumId,
                passwordHash,
                phone,
                nik,
                centerId: userCenterId,
                userRoles: {
                    create: {
                        roleId: userRole.id,
                        isActive: true,
                    },
                },
            },
            include: {
                center: true,
                userRoles: {
                    include: {
                        role: true,
                    },
                },
            },
        });
        return this.findById(user.id);
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                center: true,
                userRoles: {
                    where: { isActive: true },
                    include: {
                        role: true,
                    },
                },
            },
        });
        return user;
    }
    async findByEmail(email) {
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: {
                center: true,
                userRoles: {
                    where: { isActive: true },
                    include: {
                        role: true,
                    },
                },
            },
        });
        return user;
    }
    async update(id, updateData) {
        const user = await this.prisma.user.update({
            where: { id },
            data: updateData,
            include: {
                center: true,
                userRoles: {
                    where: { isActive: true },
                    include: {
                        role: true,
                    },
                },
            },
        });
        return user;
    }
    async getUserRole(userId) {
        const userRole = await this.prisma.userRole.findFirst({
            where: {
                userId,
                isActive: true,
            },
            include: {
                role: true,
            },
        });
        return userRole?.role.code || 'STAFF';
    }
    async getUserPermissions(userId) {
        const userRoles = await this.prisma.userRole.findMany({
            where: {
                userId,
                isActive: true,
            },
            include: {
                role: {
                    include: {
                        permissions: {
                            include: {
                                permission: true,
                            },
                        },
                    },
                },
            },
        });
        const permissionsMap = new Map();
        for (const userRole of userRoles) {
            for (const rolePermission of userRole.role.permissions) {
                const permission = rolePermission.permission;
                if (!permissionsMap.has(permission.code)) {
                    permissionsMap.set(permission.code, {
                        code: permission.code,
                        name: permission.name,
                        resource: permission.resource,
                        action: permission.action,
                    });
                }
            }
        }
        return Array.from(permissionsMap.values());
    }
    async findAll() {
        const users = await this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                isActive: true,
                isEmailVerified: true,
                createdAt: true,
                center: {
                    select: {
                        name: true,
                    },
                },
                userRoles: {
                    where: { isActive: true },
                    select: {
                        role: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return users;
    }
    async updateRole(userId, roleCode) {
        const newRole = await this.prisma.role.findUnique({
            where: { code: roleCode },
        });
        if (!newRole) {
            throw new common_1.NotFoundException(`Role ${roleCode} not found`);
        }
        await this.prisma.userRole.updateMany({
            where: { userId },
            data: { isActive: false },
        });
        await this.prisma.userRole.create({
            data: {
                userId,
                roleId: newRole.id,
                isActive: true,
            },
        });
        await this.prisma.auditLog.create({
            data: {
                userId,
                action: 'ROLE_UPDATE',
                resource: 'user',
                details: {
                    old_role: 'updated',
                    new_role: roleCode,
                },
            },
        });
        return this.findById(userId);
    }
    async validatePassword(plainPassword, hashedPassword) {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
    async hashPassword(plainPassword) {
        return bcrypt.hash(plainPassword, 12);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map