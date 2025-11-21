import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/common/database/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(userData: {
    email: string;
    name: string;
    kolegiumId?: string;
    passwordHash: string;
    phone?: string;
    nik?: string;
    role?: string;
    centerId?: string;
  }) {
    const { email, name, kolegiumId, passwordHash, phone, nik, role = 'STAFF', centerId } = userData;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Get or create center
    let userCenterId = centerId;
    if (!centerId) {
      // Create default center for new users
      const center = await this.prisma.center.create({
        data: {
          name: 'Default Center',
          code: 'DEFAULT',
          province: 'DKI Jakarta',
        },
      });
      userCenterId = center.id;
    }

    // Get role
    const userRole = await this.prisma.role.findUnique({
      where: { code: role },
    });

    if (!userRole) {
      throw new NotFoundException(`Role ${role} not found`);
    }

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        kolegiumId,
        passwordHash,
        phone,
        nik,
        centerId: userCenterId,
        userRoles: {
          create: {
            roleId: userRole.id,
            isActive: true,
          },
        },
      },
      include: {
        center: true,
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    return this.findById(user.id);
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        center: true,
        userRoles: {
          where: { isActive: true },
          include: {
            role: true,
          },
        },
      },
    });

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        center: true,
        userRoles: {
          where: { isActive: true },
          include: {
            role: true,
          },
        },
      },
    });

    return user;
  }

  async update(id: string, updateData: Partial<{
    name: string;
    phone: string;
    nik: string;
    isActive: boolean;
    isEmailVerified: boolean;
    mfaEnabled: boolean;
    mfaSecret: string;
    lastLoginAt: Date;
  }>) {
    const user = await this.prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        center: true,
        userRoles: {
          where: { isActive: true },
          include: {
            role: true,
          },
        },
      },
    });

    return user;
  }

  async getUserRole(userId: string) {
    const userRole = await this.prisma.userRole.findFirst({
      where: {
        userId,
        isActive: true,
      },
      include: {
        role: true,
      },
    });

    return userRole?.role.code || 'STAFF';
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        isEmailVerified: true,
        createdAt: true,
        center: {
          select: {
            name: true,
          },
        },
        userRoles: {
          where: { isActive: true },
          select: {
            role: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return users;
  }

  async updateRole(userId: string, roleCode: string) {
    // Get new role
    const newRole = await this.prisma.role.findUnique({
      where: { code: roleCode },
    });

    if (!newRole) {
      throw new NotFoundException(`Role ${roleCode} not found`);
    }

    // Deactivate existing roles
    await this.prisma.userRole.updateMany({
      where: { userId },
      data: { isActive: false },
    });

    // Assign new role
    await this.prisma.userRole.create({
      data: {
        userId,
        roleId: newRole.id,
        isActive: true,
      },
    });

    // Log audit
    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'ROLE_UPDATE',
        resource: 'user',
        details: {
          old_role: 'updated',
          new_role: roleCode,
        },
      },
    });

    return this.findById(userId);
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async hashPassword(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, 12);
  }
}