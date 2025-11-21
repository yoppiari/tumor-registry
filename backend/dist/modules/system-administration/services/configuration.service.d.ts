import { PrismaService } from '@/common/database/prisma.service';
import { SystemConfigurationData } from '../interfaces/system-administration.interface';
import { CreateConfigDto } from '../dto/create-config.dto';
export declare class ConfigurationService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(createConfigDto: CreateConfigDto): Promise<any>;
    findAll(filters?: {
        category?: string;
        environment?: string;
        centerId?: string;
        isActive?: boolean;
    }): Promise<any[]>;
    findOne(id: string): Promise<any>;
    findByCategoryAndKey(category: string, key: string, centerId?: string): Promise<any>;
    update(id: string, updateData: Partial<SystemConfigurationData>): Promise<any>;
    remove(id: string): Promise<void>;
    exportConfigurations(filters?: {
        category?: string;
        environment?: string;
        centerId?: string;
    }): Promise<any>;
    importConfigurations(configurations: any[], options?: {
        overwrite?: boolean;
        validateOnly?: boolean;
    }): Promise<any>;
    private encryptValue;
    private decryptValue;
}
