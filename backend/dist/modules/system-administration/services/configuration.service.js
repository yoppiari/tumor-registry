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
var ConfigurationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../common/database/prisma.service");
const crypto = require("crypto");
let ConfigurationService = ConfigurationService_1 = class ConfigurationService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(ConfigurationService_1.name);
    }
    async create(createConfigDto) {
        try {
            const encryptedValue = createConfigDto.isEncrypted
                ? this.encryptValue(JSON.stringify(createConfigDto.value))
                : createConfigDto.value;
            const config = await this.prisma.systemConfiguration.create({
                data: {
                    ...createConfigDto,
                    value: encryptedValue,
                },
            });
            this.logger.log(`Configuration created: ${config.category}.${config.key}`);
            return config;
        }
        catch (error) {
            if (error.code === 'P2002') {
                throw new common_1.ConflictException('Configuration with this category and key already exists');
            }
            throw error;
        }
    }
    async findAll(filters) {
        const where = {};
        if (filters?.category)
            where.category = filters.category;
        if (filters?.environment)
            where.environment = filters.environment;
        if (filters?.centerId)
            where.centerId = filters.centerId;
        if (filters?.isActive !== undefined)
            where.isActive = filters.isActive;
        const configs = await this.prisma.systemConfiguration.findMany({
            where,
            include: {
                center: true,
            },
            orderBy: [
                { category: 'asc' },
                { key: 'asc' },
            ],
        });
        return configs.map(config => ({
            ...config,
            value: config.isEncrypted ? JSON.parse(this.decryptValue(config.value)) : config.value,
        }));
    }
    async findOne(id) {
        const config = await this.prisma.systemConfiguration.findUnique({
            where: { id },
            include: {
                center: true,
            },
        });
        if (!config) {
            throw new common_1.NotFoundException('Configuration not found');
        }
        return {
            ...config,
            value: config.isEncrypted ? JSON.parse(this.decryptValue(config.value)) : config.value,
        };
    }
    async findByCategoryAndKey(category, key, centerId) {
        const config = await this.prisma.systemConfiguration.findFirst({
            where: {
                category,
                key,
                centerId: centerId || null,
                isActive: true,
            },
        });
        if (!config) {
            throw new common_1.NotFoundException('Configuration not found');
        }
        return {
            ...config,
            value: config.isEncrypted ? JSON.parse(this.decryptValue(config.value)) : config.value,
        };
    }
    async update(id, updateData) {
        const existingConfig = await this.prisma.systemConfiguration.findUnique({
            where: { id },
        });
        if (!existingConfig) {
            throw new common_1.NotFoundException('Configuration not found');
        }
        let value = updateData.value;
        if (updateData.value !== undefined && existingConfig.isEncrypted) {
            value = this.encryptValue(JSON.stringify(updateData.value));
        }
        const config = await this.prisma.systemConfiguration.update({
            where: { id },
            data: {
                ...updateData,
                value,
                lastModifiedBy: updateData.lastModifiedBy || null,
            },
            include: {
                center: true,
            },
        });
        this.logger.log(`Configuration updated: ${config.category}.${config.key}`);
        return {
            ...config,
            value: config.isEncrypted ? JSON.parse(this.decryptValue(config.value)) : config.value,
        };
    }
    async remove(id) {
        const config = await this.prisma.systemConfiguration.findUnique({
            where: { id },
        });
        if (!config) {
            throw new common_1.NotFoundException('Configuration not found');
        }
        await this.prisma.systemConfiguration.delete({
            where: { id },
        });
        this.logger.log(`Configuration deleted: ${config.category}.${config.key}`);
    }
    async exportConfigurations(filters) {
        const configs = await this.findAll(filters);
        return {
            exportedAt: new Date().toISOString(),
            totalConfigurations: configs.length,
            configurations: configs.map(config => ({
                category: config.category,
                key: config.key,
                value: config.value,
                description: config.description,
                environment: config.environment,
                centerId: config.centerId,
            })),
        };
    }
    async importConfigurations(configurations, options) {
        const results = {
            success: 0,
            failed: 0,
            skipped: 0,
            errors: [],
        };
        for (const configData of configurations) {
            try {
                const existing = await this.prisma.systemConfiguration.findFirst({
                    where: {
                        category: configData.category,
                        key: configData.key,
                        centerId: configData.centerId || null,
                    },
                });
                if (existing && !options?.overwrite) {
                    results.skipped++;
                    continue;
                }
                if (options?.validateOnly) {
                    results.success++;
                    continue;
                }
                const encryptedValue = typeof configData.value === 'string' && configData.value.startsWith('encrypted:')
                    ? configData.value
                    : JSON.stringify(configData.value);
                await this.prisma.systemConfiguration.upsert({
                    where: {
                        id: existing?.id || '',
                    },
                    create: {
                        category: configData.category,
                        key: configData.key,
                        value: encryptedValue,
                        description: configData.description,
                        environment: configData.environment,
                        centerId: configData.centerId,
                        isEncrypted: configData.value.startsWith('encrypted:'),
                    },
                    update: {
                        value: encryptedValue,
                        description: configData.description,
                        environment: configData.environment,
                        isEncrypted: configData.value.startsWith('encrypted:'),
                    },
                });
                results.success++;
            }
            catch (error) {
                results.failed++;
                results.errors.push(`Failed to import ${configData.category}.${configData.key}: ${error.message}`);
            }
        }
        return results;
    }
    encryptValue(value) {
        const key = process.env.ENCRYPTION_KEY || 'default-key-change-in-production';
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipher('aes-256-cbc', key);
        let encrypted = cipher.update(value, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return `encrypted:${iv.toString('hex')}:${encrypted}`;
    }
    decryptValue(encryptedValue) {
        if (!encryptedValue.startsWith('encrypted:')) {
            return encryptedValue;
        }
        const key = process.env.ENCRYPTION_KEY || 'default-key-change-in-production';
        const parts = encryptedValue.split(':');
        if (parts.length !== 3) {
            throw new Error('Invalid encrypted value format');
        }
        const iv = Buffer.from(parts[1], 'hex');
        const encrypted = parts[2];
        const decipher = crypto.createDecipher('aes-256-cbc', key);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
};
exports.ConfigurationService = ConfigurationService;
exports.ConfigurationService = ConfigurationService = ConfigurationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ConfigurationService);
//# sourceMappingURL=configuration.service.js.map