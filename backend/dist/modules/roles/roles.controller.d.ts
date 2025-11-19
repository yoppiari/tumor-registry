import { RolesService } from './roles.service';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    findAll(includePermissions?: string): Promise<any[]>;
    getHierarchy(): Promise<any[]>;
    getAllPermissions(): Promise<any[]>;
    findById(id: string, includePermissions?: string): Promise<any>;
    getRolePermissions(id: string): Promise<any[]>;
    create(createRoleDto: {
        name: string;
        code: string;
        description?: string;
        level: number;
        permissionCodes?: string[];
    }): Promise<{
        description: string | null;
        name: string;
        id: string;
        code: string;
        level: number;
    }>;
    update(id: string, updateRoleDto: {
        name?: string;
        description?: string;
        level?: number;
        permissionCodes?: string[];
    }): Promise<{
        description: string | null;
        name: string;
        id: string;
        code: string;
        level: number;
    }>;
    updateRolePermissions(id: string, updatePermissionsDto: {
        permissionCodes: string[];
    }): Promise<{
        message: string;
    }>;
    delete(id: string): Promise<void>;
}
