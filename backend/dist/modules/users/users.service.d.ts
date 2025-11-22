import { PrismaService } from '@/common/database/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userData: {
        email: string;
        name: string;
        kolegiumId?: string;
        passwordHash: string;
        phone?: string;
        nik?: string;
        role?: string;
        centerId?: string;
    }): Promise<{
        center: {
            id: string;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            province: string;
            regency: string | null;
            address: string | null;
        };
        userRoles: ({
            role: {
                id: string;
                name: string;
                code: string;
                description: string | null;
                level: number;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            roleId: string;
            userId: string;
        })[];
    } & {
        id: string;
        email: string;
        name: string;
        kolegiumId: string | null;
        passwordHash: string;
        phone: string | null;
        nik: string | null;
        isActive: boolean;
        isEmailVerified: boolean;
        mfaEnabled: boolean;
        mfaSecret: string | null;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        centerId: string;
    }>;
    findById(id: string): Promise<{
        center: {
            id: string;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            province: string;
            regency: string | null;
            address: string | null;
        };
        userRoles: ({
            role: {
                id: string;
                name: string;
                code: string;
                description: string | null;
                level: number;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            roleId: string;
            userId: string;
        })[];
    } & {
        id: string;
        email: string;
        name: string;
        kolegiumId: string | null;
        passwordHash: string;
        phone: string | null;
        nik: string | null;
        isActive: boolean;
        isEmailVerified: boolean;
        mfaEnabled: boolean;
        mfaSecret: string | null;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        centerId: string;
    }>;
    findByEmail(email: string): Promise<{
        center: {
            id: string;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            province: string;
            regency: string | null;
            address: string | null;
        };
        userRoles: ({
            role: {
                id: string;
                name: string;
                code: string;
                description: string | null;
                level: number;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            roleId: string;
            userId: string;
        })[];
    } & {
        id: string;
        email: string;
        name: string;
        kolegiumId: string | null;
        passwordHash: string;
        phone: string | null;
        nik: string | null;
        isActive: boolean;
        isEmailVerified: boolean;
        mfaEnabled: boolean;
        mfaSecret: string | null;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        centerId: string;
    }>;
    update(id: string, updateData: Partial<{
        name: string;
        phone: string;
        nik: string;
        isActive: boolean;
        isEmailVerified: boolean;
        mfaEnabled: boolean;
        mfaSecret: string;
        lastLoginAt: Date;
    }>): Promise<{
        center: {
            id: string;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            province: string;
            regency: string | null;
            address: string | null;
        };
        userRoles: ({
            role: {
                id: string;
                name: string;
                code: string;
                description: string | null;
                level: number;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            roleId: string;
            userId: string;
        })[];
    } & {
        id: string;
        email: string;
        name: string;
        kolegiumId: string | null;
        passwordHash: string;
        phone: string | null;
        nik: string | null;
        isActive: boolean;
        isEmailVerified: boolean;
        mfaEnabled: boolean;
        mfaSecret: string | null;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        centerId: string;
    }>;
    getUserRole(userId: string): Promise<string>;
    getUserPermissions(userId: string): Promise<any[]>;
    findAll(): Promise<{
        id: string;
        email: string;
        name: string;
        isActive: boolean;
        isEmailVerified: boolean;
        createdAt: Date;
        center: {
            name: string;
        };
        userRoles: {
            role: {
                name: string;
            };
        }[];
    }[]>;
    updateRole(userId: string, roleCode: string): Promise<{
        center: {
            id: string;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            province: string;
            regency: string | null;
            address: string | null;
        };
        userRoles: ({
            role: {
                id: string;
                name: string;
                code: string;
                description: string | null;
                level: number;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            roleId: string;
            userId: string;
        })[];
    } & {
        id: string;
        email: string;
        name: string;
        kolegiumId: string | null;
        passwordHash: string;
        phone: string | null;
        nik: string | null;
        isActive: boolean;
        isEmailVerified: boolean;
        mfaEnabled: boolean;
        mfaSecret: string | null;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        centerId: string;
    }>;
    validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
    hashPassword(plainPassword: string): Promise<string>;
}
