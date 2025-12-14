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

  async getUserPermissions(userId: string) {
    const userRoles = await this.prisma.userRole.findMany({
      where: {
        userId,
        isActive: true,
      },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    // Extract all unique permissions from all user roles
    const permissions = userRoles.flatMap(ur =>
      ur.role.permissions?.map(rp => rp.permission.code) || []
    );

    return [...new Set(permissions)]; // Return unique permissions
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

  /**
   * Create a new user with role assignment
   * @param createUserDto - User creation data
   * @param createdById - ID of the user creating this user
   * @returns The created user with relations
   */
  async createUser(
    createUserDto: {
      email: string;
      name: string;
      password: string;
      kolegiumId?: string;
      phone?: string;
      nik?: string;
      centerId: string;
      role: string;
      isActive?: boolean;
    },
    createdById: string,
  ) {
    const { password, role, isActive = true, ...userData } = createUserDto;

    // Hash the password
    const passwordHash = await this.hashPassword(password);

    // Validate center exists
    const center = await this.prisma.center.findUnique({
      where: { id: userData.centerId },
    });

    if (!center) {
      throw new NotFoundException(`Center with ID ${userData.centerId} not found`);
    }

    // Validate role exists
    const userRole = await this.prisma.role.findUnique({
      where: { code: role },
    });

    if (!userRole) {
      throw new NotFoundException(`Role ${role} not found`);
    }

    // Create user with role assignment
    const user = await this.prisma.user.create({
      data: {
        ...userData,
        passwordHash,
        isActive,
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
          where: { isActive: true },
          include: {
            role: true,
          },
        },
      },
    });

    // Log audit trail
    await this.prisma.auditLog.create({
      data: {
        userId: createdById,
        action: 'USER_CREATE',
        resource: 'user',
        details: {
          created_user_id: user.id,
          created_user_email: user.email,
          role: role,
        },
      },
    });

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Update an existing user
   * @param id - User ID to update
   * @param updateUserDto - User update data
   * @param updatedById - ID of the user performing the update
   * @returns The updated user
   */
  async updateUser(
    id: string,
    updateUserDto: {
      name?: string;
      email?: string;
      kolegiumId?: string;
      phone?: string;
      nik?: string;
      centerId?: string;
      role?: string;
      isActive?: boolean;
      password?: string;
    },
    updatedById: string,
  ) {
    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
      include: {
        userRoles: {
          where: { isActive: true },
          include: { role: true },
        },
      },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const { password, role, centerId, email, ...updateData } = updateUserDto;

    // Validate email uniqueness if changing email
    if (email && email !== existingUser.email) {
      const emailExists = await this.prisma.user.findUnique({
        where: { email },
      });

      if (emailExists) {
        throw new ConflictException('Email is already in use by another user');
      }
    }

    // Validate center if changing
    if (centerId) {
      const center = await this.prisma.center.findUnique({
        where: { id: centerId },
      });

      if (!center) {
        throw new NotFoundException(`Center with ID ${centerId} not found`);
      }
    }

    // Hash password if provided
    let passwordHash: string | undefined;
    if (password) {
      passwordHash = await this.hashPassword(password);
    }

    // Update user
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...updateData,
        ...(email && { email }),
        ...(centerId && { centerId }),
        ...(passwordHash && { passwordHash }),
      },
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

    // Update role if provided
    if (role) {
      await this.updateRole(id, role);
    }

    // Log audit trail
    await this.prisma.auditLog.create({
      data: {
        userId: updatedById,
        action: 'USER_UPDATE',
        resource: 'user',
        details: {
          updated_user_id: id,
          updated_fields: Object.keys(updateUserDto),
        },
      },
    });

    return this.findById(id);
  }

  /**
   * Soft delete a user by setting isActive to false
   * @param id - User ID to delete
   * @param deletedById - ID of the user performing the deletion
   * @returns Success message
   */
  async deleteUser(id: string, deletedById: string) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Prevent self-deletion
    if (id === deletedById) {
      throw new ConflictException('You cannot delete your own account');
    }

    // Soft delete by setting isActive to false
    await this.prisma.user.update({
      where: { id },
      data: {
        isActive: false,
      },
    });

    // Deactivate all user roles
    await this.prisma.userRole.updateMany({
      where: { userId: id },
      data: { isActive: false },
    });

    // Log audit trail
    await this.prisma.auditLog.create({
      data: {
        userId: deletedById,
        action: 'USER_DELETE',
        resource: 'user',
        details: {
          deleted_user_id: id,
          deleted_user_email: user.email,
        },
      },
    });

    return { message: 'User deleted successfully' };
  }

  /**
   * Toggle user active status
   * @param id - User ID
   * @param isActive - New active status
   * @param updatedById - ID of the user performing the update
   * @returns The updated user
   */
  async toggleUserStatus(id: string, isActive: boolean, updatedById: string) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Prevent self-deactivation
    if (id === updatedById && !isActive) {
      throw new ConflictException('You cannot deactivate your own account');
    }

    // Update user status
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { isActive },
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

    // Log audit trail
    await this.prisma.auditLog.create({
      data: {
        userId: updatedById,
        action: 'USER_STATUS_TOGGLE',
        resource: 'user',
        details: {
          user_id: id,
          new_status: isActive ? 'active' : 'inactive',
        },
      },
    });

    return updatedUser;
  }
}