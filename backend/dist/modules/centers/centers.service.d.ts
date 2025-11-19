import { PrismaService } from '../../database/prisma.service';
import { Center } from '@prisma/client';
export declare class CentersService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    findAll(includeInactive?: boolean): Promise<Center[]>;
    findById(id: string, includeUsers?: boolean): Promise<any>;
    findByCode(code: string): Promise<Center>;
    create(centerData: {
        name: string;
        code: string;
        province: string;
        regency?: string;
        address?: string;
    }): Promise<Center>;
    update(id: string, updateData: {
        name?: string;
        province?: string;
        regency?: string;
        address?: string;
        isActive?: boolean;
    }): Promise<Center>;
    delete(id: string): Promise<void>;
    deactivate(id: string): Promise<Center>;
    activate(id: string): Promise<Center>;
    getStatistics(): Promise<any>;
    getCenterUsers(centerId: string): Promise<any[]>;
}
