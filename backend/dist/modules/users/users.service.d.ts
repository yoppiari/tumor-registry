import { PrismaService } from '../../database/prisma.service';
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
            name: string;
            id: string;
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
                description: string | null;
                name: string;
                id: string;
                code: string;
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
        email: string;
        name: string;
        kolegiumId: string | null;
        passwordHash: string;
        phone: string | null;
        nik: string | null;
        centerId: string;
        id: string;
        isActive: boolean;
        isEmailVerified: boolean;
        mfaEnabled: boolean;
        mfaSecret: string | null;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findById(id: string): Promise<{
        center: {
            name: string;
            id: string;
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
                description: string | null;
                name: string;
                id: string;
                code: string;
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
        email: string;
        name: string;
        kolegiumId: string | null;
        passwordHash: string;
        phone: string | null;
        nik: string | null;
        centerId: string;
        id: string;
        isActive: boolean;
        isEmailVerified: boolean;
        mfaEnabled: boolean;
        mfaSecret: string | null;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findByEmail(email: string): Promise<{
        center: {
            name: string;
            id: string;
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
                description: string | null;
                name: string;
                id: string;
                code: string;
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
        email: string;
        name: string;
        kolegiumId: string | null;
        passwordHash: string;
        phone: string | null;
        nik: string | null;
        centerId: string;
        id: string;
        isActive: boolean;
        isEmailVerified: boolean;
        mfaEnabled: boolean;
        mfaSecret: string | null;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
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
            name: string;
            id: string;
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
                description: string | null;
                name: string;
                id: string;
                code: string;
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
        email: string;
        name: string;
        kolegiumId: string | null;
        passwordHash: string;
        phone: string | null;
        nik: string | null;
        centerId: string;
        id: string;
        isActive: boolean;
        isEmailVerified: boolean;
        mfaEnabled: boolean;
        mfaSecret: string | null;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getUserRole(userId: string): Promise<string>;
    findAll(): Promise<{
        center: {
            name: string;
        };
        email: string;
        name: string;
        id: string;
        isActive: boolean;
        isEmailVerified: boolean;
        createdAt: Date;
        userRoles: {
            role: {
                name: string;
            };
        }[];
    }[]>;
    updateRole(userId: string, roleCode: string): Promise<{
        center: {
            name: string;
            id: string;
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
                description: string | null;
                name: string;
                id: string;
                code: string;
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
        email: string;
        name: string;
        kolegiumId: string | null;
        passwordHash: string;
        phone: string | null;
        nik: string | null;
        centerId: string;
        id: string;
        isActive: boolean;
        isEmailVerified: boolean;
        mfaEnabled: boolean;
        mfaSecret: string | null;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
    hashPassword(plainPassword: string): Promise<string>;
}
