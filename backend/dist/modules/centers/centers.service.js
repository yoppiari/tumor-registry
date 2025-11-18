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
var CentersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CentersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let CentersService = CentersService_1 = class CentersService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(CentersService_1.name);
    }
    async findAll(includeInactive = false) {
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
        }
        catch (error) {
            this.logger.error('Error finding all centers', error);
            throw error;
        }
    }
    async findById(id, includeUsers = false) {
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
                throw new common_1.NotFoundException(`Center with ID ${id} not found`);
            }
            return {
                ...center,
                userCount: center._count.users,
                _count: undefined,
            };
        }
        catch (error) {
            this.logger.error(`Error finding center by ID: ${id}`, error);
            throw error;
        }
    }
    async findByCode(code) {
        try {
            const center = await this.prisma.center.findUnique({
                where: { code },
            });
            if (!center) {
                throw new common_1.NotFoundException(`Center with code ${code} not found`);
            }
            return center;
        }
        catch (error) {
            this.logger.error(`Error finding center by code: ${code}`, error);
            throw error;
        }
    }
    async create(centerData) {
        try {
            const existingCenter = await this.prisma.center.findUnique({
                where: { code: centerData.code.toUpperCase() },
            });
            if (existingCenter) {
                throw new common_1.ConflictException(`Center with code ${centerData.code} already exists`);
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
        }
        catch (error) {
            this.logger.error(`Error creating center: ${centerData.name}`, error);
            throw error;
        }
    }
    async update(id, updateData) {
        try {
            const existingCenter = await this.findById(id);
            if (existingCenter.code === 'DEFAULT' && updateData.isActive !== undefined) {
                throw new common_1.ConflictException('Cannot modify active status of default center');
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
        }
        catch (error) {
            this.logger.error(`Error updating center with ID: ${id}`, error);
            throw error;
        }
    }
    async delete(id) {
        try {
            const center = await this.findById(id);
            if (center.code === 'DEFAULT') {
                throw new common_1.ConflictException('Cannot delete default center');
            }
            const userCount = await this.prisma.user.count({
                where: {
                    centerId: id,
                    isActive: true,
                },
            });
            if (userCount > 0) {
                throw new common_1.ConflictException(`Cannot delete center with ${userCount} active users`);
            }
            await this.prisma.center.delete({
                where: { id },
            });
            this.logger.log(`Center deleted: ${center.name} (${center.code})`);
        }
        catch (error) {
            this.logger.error(`Error deleting center with ID: ${id}`, error);
            throw error;
        }
    }
    async deactivate(id) {
        try {
            const center = await this.findById(id);
            if (center.code === 'DEFAULT') {
                throw new common_1.ConflictException('Cannot deactivate default center');
            }
            const deactivatedCenter = await this.prisma.center.update({
                where: { id },
                data: { isActive: false },
            });
            this.logger.log(`Center deactivated: ${deactivatedCenter.name} (${deactivatedCenter.code})`);
            return deactivatedCenter;
        }
        catch (error) {
            this.logger.error(`Error deactivating center with ID: ${id}`, error);
            throw error;
        }
    }
    async activate(id) {
        try {
            const activatedCenter = await this.prisma.center.update({
                where: { id },
                data: { isActive: true },
            });
            this.logger.log(`Center activated: ${activatedCenter.name} (${activatedCenter.code})`);
            return activatedCenter;
        }
        catch (error) {
            this.logger.error(`Error activating center with ID: ${id}`, error);
            throw error;
        }
    }
    async getStatistics() {
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
        }
        catch (error) {
            this.logger.error('Error getting center statistics', error);
            throw error;
        }
    }
    async getCenterUsers(centerId) {
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
        }
        catch (error) {
            this.logger.error(`Error getting users for center ${centerId}`, error);
            throw error;
        }
    }
};
exports.CentersService = CentersService;
exports.CentersService = CentersService = CentersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CentersService);
//# sourceMappingURL=centers.service.js.map