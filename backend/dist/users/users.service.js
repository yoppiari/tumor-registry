"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    constructor() {
        this.users = [
            {
                id: '00000000-0000-0000-0000-000000000001',
                email: 'admin@inamsos.id',
                passwordHash: '$2b$10$N.zmdr9k7uOCQb376NoUnuTJ8iKVjzieMwkOmANgNOgKQNNBDvAGK',
                name: 'System Administrator',
                role: 'national_stakeholder',
                centerId: '00000000-0000-0000-0000-000000000001',
                isActive: true,
                emailVerified: true,
                phone: '+628123456789',
                avatar: null,
                department: 'IT Department',
                licenseNumber: 'ADMIN-001',
                specialization: ['System Administration', 'Network Security'],
                bio: 'System administrator for INAMSOS platform',
                lastLoginAt: new Date(),
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2024-01-01'),
            },
            {
                id: '00000000-0000-0000-0000-000000000002',
                email: 'dataentry@rscm.co.id',
                passwordHash: '$2b$10$N.zmdr9k7uOCQb376NoUnuTJ8iKVjzieMwkOmANgNOgKQNNBDvAGK',
                name: 'Dr. Ahmad Wijaya',
                role: 'data_entry',
                centerId: '00000000-0000-0000-0000-000000000001',
                isActive: true,
                emailVerified: true,
                phone: '+628987654321',
                avatar: null,
                department: 'Oncology Department',
                licenseNumber: 'SIP-123456',
                specialization: ['Oncology', 'Medical Records'],
                bio: 'Oncologist with 10 years of experience in cancer data management',
                lastLoginAt: new Date(),
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2024-01-01'),
            },
            {
                id: '00000000-0000-0000-0000-000000000003',
                email: 'researcher@rscm.co.id',
                passwordHash: '$2b$10$N.zmdr9k7uOCQb376NoUnuTJ8iKVjzieMwkOmANgNOgKQNNBDvAGK',
                name: 'Dr. Sarah Putri',
                role: 'researcher',
                centerId: '00000000-0000-0000-0000-000000000002',
                isActive: true,
                emailVerified: true,
                phone: '+628765432109',
                avatar: null,
                department: 'Research Division',
                licenseNumber: 'SIP-789012',
                specialization: ['Cancer Research', 'Clinical Trials'],
                bio: 'Cancer researcher focused on breast cancer and lymphoma studies',
                lastLoginAt: null,
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2024-01-01'),
            },
        ];
        this.centers = [
            { id: '00000000-0000-0000-0000-000000000001', name: 'Rumah Sakit Kanker Dharmais' },
            { id: '00000000-0000-0000-0000-000000000002', name: 'Rumah Sakit Cipto Mangunkusumo' },
        ];
    }
    async getProfile(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) {
            throw new common_1.NotFoundException('User tidak ditemukan');
        }
        const center = this.centers.find(c => c.id === user.centerId);
        const userProfile = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            centerId: user.centerId,
            centerName: center?.name,
            isActive: user.isActive,
            emailVerified: user.emailVerified,
            phone: user.phone,
            avatar: user.avatar,
            department: user.department,
            licenseNumber: user.licenseNumber,
            specialization: user.specialization,
            bio: user.bio,
            lastLoginAt: user.lastLoginAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
        return userProfile;
    }
    async updateProfile(userId, updateProfileDto) {
        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex === -1) {
            throw new common_1.NotFoundException('User tidak ditemukan');
        }
        const user = this.users[userIndex];
        const updatedUser = {
            ...user,
            ...updateProfileDto,
            updatedAt: new Date(),
        };
        this.users[userIndex] = updatedUser;
        return this.getProfile(userId);
    }
    async changePassword(userId, changePasswordDto) {
        const user = this.users.find(u => u.id === userId);
        if (!user) {
            throw new common_1.NotFoundException('User tidak ditemukan');
        }
        const isCurrentPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, user.passwordHash);
        if (!isCurrentPasswordValid) {
            throw new common_1.UnauthorizedException('Password saat ini tidak sesuai');
        }
        if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
            throw new common_1.BadRequestException('Password baru dan konfirmasi tidak cocok');
        }
        const isSamePassword = await bcrypt.compare(changePasswordDto.newPassword, user.passwordHash);
        if (isSamePassword) {
            throw new common_1.BadRequestException('Password baru tidak boleh sama dengan password saat ini');
        }
        const newPasswordHash = await bcrypt.hash(changePasswordDto.newPassword, 10);
        user.passwordHash = newPasswordHash;
        user.updatedAt = new Date();
    }
    async deactivateAccount(userId) {
        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex === -1) {
            throw new common_1.NotFoundException('User tidak ditemukan');
        }
        const user = this.users[userIndex];
        if (user.role === 'admin' || user.role === 'national_stakeholder') {
            throw new common_1.BadRequestException('Tidak dapat menonaktifkan akun admin atau national stakeholder');
        }
        user.isActive = false;
        user.updatedAt = new Date();
    }
    async updateLastLogin(userId) {
        const user = this.users.find(u => u.id === userId);
        if (user) {
            user.lastLoginAt = new Date();
            user.updatedAt = new Date();
        }
    }
    async getUsersByCenter(centerId, page = 1, limit = 10) {
        const centerUsers = this.users.filter(u => u.centerId === centerId && u.isActive);
        const total = centerUsers.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedUsers = centerUsers.slice(startIndex, endIndex).map(user => {
            const center = this.centers.find(c => c.id === user.centerId);
            return {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                centerId: user.centerId,
                centerName: center?.name,
                isActive: user.isActive,
                emailVerified: user.emailVerified,
                phone: user.phone,
                avatar: user.avatar,
                department: user.department,
                licenseNumber: user.licenseNumber,
                specialization: user.specialization,
                bio: user.bio,
                lastLoginAt: user.lastLoginAt,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            };
        });
        return {
            users: paginatedUsers,
            total,
            page,
            limit,
            totalPages,
        };
    }
    async getUserStatistics() {
        const total = this.users.length;
        const active = this.users.filter(u => u.isActive).length;
        const inactive = total - active;
        const emailVerified = this.users.filter(u => u.emailVerified).length;
        const byRole = this.users.reduce((acc, user) => {
            acc[user.role] = (acc[user.role] || 0) + 1;
            return acc;
        }, {});
        const byCenter = this.users
            .filter(u => u.centerId)
            .reduce((acc, user) => {
            const centerName = this.centers.find(c => c.id === user.centerId)?.name || 'Unknown';
            acc[centerName] = (acc[centerName] || 0) + 1;
            return acc;
        }, {});
        return {
            total,
            active,
            inactive,
            emailVerified,
            byRole,
            byCenter,
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)()
], UsersService);
//# sourceMappingURL=users.service.js.map