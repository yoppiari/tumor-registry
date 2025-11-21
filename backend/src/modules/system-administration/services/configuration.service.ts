import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/common/database/prisma.service';
import { SystemConfigurationData } from '../interfaces/system-administration.interface';
import { CreateConfigDto } from '../dto/create-config.dto';
import * as crypto from 'crypto';

@Injectable()
export class ConfigurationService {
  private readonly logger = new Logger(ConfigurationService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createConfigDto: CreateConfigDto): Promise<any> {
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
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Configuration with this category and key already exists');
      }
      throw error;
    }
  }

  async findAll(filters?: {
    category?: string;
    environment?: string;
    centerId?: string;
    isActive?: boolean;
  }): Promise<any[]> {
    const where: any = {};

    if (filters?.category) where.category = filters.category;
    if (filters?.environment) where.environment = filters.environment;
    if (filters?.centerId) where.centerId = filters.centerId;
    if (filters?.isActive !== undefined) where.isActive = filters.isActive;

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

  async findOne(id: string): Promise<any> {
    const config = await this.prisma.systemConfiguration.findUnique({
      where: { id },
      include: {
        center: true,
      },
    });

    if (!config) {
      throw new NotFoundException('Configuration not found');
    }

    return {
      ...config,
      value: config.isEncrypted ? JSON.parse(this.decryptValue(config.value)) : config.value,
    };
  }

  async findByCategoryAndKey(category: string, key: string, centerId?: string): Promise<any> {
    const config = await this.prisma.systemConfiguration.findFirst({
      where: {
        category,
        key,
        centerId: centerId || null,
        isActive: true,
      },
    });

    if (!config) {
      throw new NotFoundException('Configuration not found');
    }

    return {
      ...config,
      value: config.isEncrypted ? JSON.parse(this.decryptValue(config.value)) : config.value,
    };
  }

  async update(id: string, updateData: Partial<SystemConfigurationData>): Promise<any> {
    const existingConfig = await this.prisma.systemConfiguration.findUnique({
      where: { id },
    });

    if (!existingConfig) {
      throw new NotFoundException('Configuration not found');
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

  async remove(id: string): Promise<void> {
    const config = await this.prisma.systemConfiguration.findUnique({
      where: { id },
    });

    if (!config) {
      throw new NotFoundException('Configuration not found');
    }

    await this.prisma.systemConfiguration.delete({
      where: { id },
    });

    this.logger.log(`Configuration deleted: ${config.category}.${config.key}`);
  }

  async exportConfigurations(filters?: {
    category?: string;
    environment?: string;
    centerId?: string;
  }): Promise<any> {
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

  async importConfigurations(configurations: any[], options?: {
    overwrite?: boolean;
    validateOnly?: boolean;
  }): Promise<any> {
    const results = {
      success: 0,
      failed: 0,
      skipped: 0,
      errors: [] as string[],
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
      } catch (error) {
        results.failed++;
        results.errors.push(`Failed to import ${configData.category}.${configData.key}: ${error.message}`);
      }
    }

    return results;
  }

  private encryptValue(value: string): string {
    const key = process.env.ENCRYPTION_KEY || 'default-key-change-in-production';
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher('aes-256-cbc', key);
    let encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `encrypted:${iv.toString('hex')}:${encrypted}`;
  }

  private decryptValue(encryptedValue: string): string {
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
}