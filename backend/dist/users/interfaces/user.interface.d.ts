export interface User {
    id: string;
    email: string;
    passwordHash: string;
    name: string;
    role: 'data_entry' | 'researcher' | 'admin' | 'national_stakeholder';
    centerId?: string;
    isActive: boolean;
    emailVerified: boolean;
    phone?: string;
    avatar?: string;
    department?: string;
    licenseNumber?: string;
    specialization?: string[];
    bio?: string;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface UserProfile {
    id: string;
    email: string;
    name: string;
    role: string;
    centerId?: string;
    centerName?: string;
    isActive: boolean;
    emailVerified: boolean;
    phone?: string;
    avatar?: string;
    department?: string;
    licenseNumber?: string;
    specialization?: string[];
    bio?: string;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface UpdateProfileDto {
    name?: string;
    phone?: string;
    avatar?: string;
    department?: string;
    licenseNumber?: string;
    specialization?: string[];
    bio?: string;
}
export interface ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}
