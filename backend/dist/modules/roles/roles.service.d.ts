import { PrismaService } from '@/database/prisma.service';
import { Role } from '@prisma/client';
export declare class RolesService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    findAll(includePermissions?: boolean): Promise<any[]>;
    findById(id: string, includePermissions?: boolean): Promise<any>;
    findByCode(code: string): Promise<Role>;
    create(roleData: {
        name: string;
        code: string;
        description?: string;
        level: number;
        permissionCodes?: string[];
    }): Promise<Role>;
    update(id: string, updateData: {
        name?: string;
        description?: string;
        level?: number;
        permissionCodes?: string[];
    }): Promise<Role>;
    delete(id: string): Promise<void>;
    assignPermissions(roleId: string, permissionCodes: string[]): Promise<void>;
    updateRolePermissions(roleId: string, permissionCodes: string[]): Promise<void>;
    getRolePermissions(roleId: string): Promise<any[]>;
    getAllPermissions(): Promise<any[]>;
    getRoleHierarchy(): Promise<any[]>;
}
