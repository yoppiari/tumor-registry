import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User, UserProfile, UpdateProfileDto, ChangePasswordDto } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  // Mock database - akan diganti dengan Prisma nanti
  private users: User[] = [
    {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'admin@inamsos.id',
      passwordHash: '$2b$10$N.zmdr9k7uOCQb376NoUnuTJ8iKVjzieMwkOmANgNOgKQNNBDvAGK', // admin123
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
      passwordHash: '$2b$10$N.zmdr9k7uOCQb376NoUnuTJ8iKVjzieMwkOmANgNOgKQNNBDvAGK', // admin123
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
      passwordHash: '$2b$10$N.zmdr9k7uOCQb376NoUnuTJ8iKVjzieMwkOmANgNOgKQNNBDvAGK', // admin123
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

  // Mock centers data for center name lookup
  private centers = [
    { id: '00000000-0000-0000-0000-000000000001', name: 'Rumah Sakit Kanker Dharmais' },
    { id: '00000000-0000-0000-0000-000000000002', name: 'Rumah Sakit Cipto Mangunkusumo' },
  ];

  async getProfile(userId: string): Promise<UserProfile> {
    const user = this.users.find(u => u.id === userId);

    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    const center = this.centers.find(c => c.id === user.centerId);

    const userProfile: UserProfile = {
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

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<UserProfile> {
    const userIndex = this.users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      throw new NotFoundException('User tidak ditemukan');
    }

    const user = this.users[userIndex];

    // Update user data
    const updatedUser: User = {
      ...user,
      ...updateProfileDto,
      updatedAt: new Date(),
    };

    this.users[userIndex] = updatedUser;

    return this.getProfile(userId);
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<void> {
    const user = this.users.find(u => u.id === userId);

    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.passwordHash,
    );

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Password saat ini tidak sesuai');
    }

    // Check if new password and confirmation match
    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new BadRequestException('Password baru dan konfirmasi tidak cocok');
    }

    // Check if new password is same as current password
    const isSamePassword = await bcrypt.compare(
      changePasswordDto.newPassword,
      user.passwordHash,
    );

    if (isSamePassword) {
      throw new BadRequestException('Password baru tidak boleh sama dengan password saat ini');
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(changePasswordDto.newPassword, 10);

    // Update password
    user.passwordHash = newPasswordHash;
    user.updatedAt = new Date();
  }

  async deactivateAccount(userId: string): Promise<void> {
    const userIndex = this.users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      throw new NotFoundException('User tidak ditemukan');
    }

    const user = this.users[userIndex];

    // Don't allow deactivation of admin users
    if (user.role === 'admin' || user.role === 'national_stakeholder') {
      throw new BadRequestException('Tidak dapat menonaktifkan akun admin atau national stakeholder');
    }

    // Deactivate user
    user.isActive = false;
    user.updatedAt = new Date();
  }

  async updateLastLogin(userId: string): Promise<void> {
    const user = this.users.find(u => u.id === userId);

    if (user) {
      user.lastLoginAt = new Date();
      user.updatedAt = new Date();
    }
  }

  async getUsersByCenter(centerId: string, page: number = 1, limit: number = 10): Promise<{
    users: UserProfile[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
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
      } as UserProfile;
    });

    return {
      users: paginatedUsers,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async getUserStatistics(): Promise<{
    total: number;
    active: number;
    inactive: number;
    emailVerified: number;
    byRole: Record<string, number>;
    byCenter: Record<string, number>;
  }> {
    const total = this.users.length;
    const active = this.users.filter(u => u.isActive).length;
    const inactive = total - active;
    const emailVerified = this.users.filter(u => u.emailVerified).length;

    const byRole = this.users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byCenter = this.users
      .filter(u => u.centerId)
      .reduce((acc, user) => {
        const centerName = this.centers.find(c => c.id === user.centerId)?.name || 'Unknown';
        acc[centerName] = (acc[centerName] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    return {
      total,
      active,
      inactive,
      emailVerified,
      byRole,
      byCenter,
    };
  }
}