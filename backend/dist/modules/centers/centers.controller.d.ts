import { CentersService } from './centers.service';
export declare class CentersController {
    private readonly centersService;
    constructor(centersService: CentersService);
    findAll(includeInactive?: string): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        province: string;
        regency: string | null;
        address: string | null;
    }[]>;
    getStatistics(): Promise<any>;
    findById(id: string, includeUsers?: string): Promise<any>;
    getCenterUsers(id: string): Promise<any[]>;
    create(createCenterDto: {
        name: string;
        code: string;
        province: string;
        regency?: string;
        address?: string;
    }): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        province: string;
        regency: string | null;
        address: string | null;
    }>;
    update(id: string, updateCenterDto: {
        name?: string;
        province?: string;
        regency?: string;
        address?: string;
        isActive?: boolean;
    }): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        province: string;
        regency: string | null;
        address: string | null;
    }>;
    activate(id: string): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        province: string;
        regency: string | null;
        address: string | null;
    }>;
    deactivate(id: string): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        province: string;
        regency: string | null;
        address: string | null;
    }>;
    delete(id: string): Promise<void>;
}
