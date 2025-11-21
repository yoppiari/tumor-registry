import { Injectable, Logger, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/common/database/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordPolicyService {
  private readonly logger = new Logger(PasswordPolicyService.name);

  constructor(private prisma: PrismaService) {}

  async createPasswordPolicy(data: {
    name: string;
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
    preventReuse?: number;
    maxAge?: number;
    lockoutThreshold?: number;
    lockoutDuration?: number;
    organizationId?: string;
    roleId?: string;
    isActive?: boolean;
  }) {
    try {
      const policy = await this.prisma.passwordPolicy.create({
        data: {
          ...data,
          isActive: data.isActive ?? true,
        },
      });

      this.logger.log(`Password policy created: ${policy.name}`);
      return policy;
    } catch (error) {
      this.logger.error('Failed to create password policy', error);
      throw new ConflictException('Password policy with this name already exists');
    }
  }

  async validatePassword(password: string, policyId?: string, userId?: string): Promise<{
    isValid: boolean;
    errors: string[];
    score: number;
  }> {
    const errors: string[] = [];
    let score = 0;

    // Get applicable policy
    const policy = await this.getApplicablePolicy(policyId, userId);

    if (!policy) {
      // Default validation
      return this.defaultPasswordValidation(password);
    }

    // Length validation
    if (policy.minLength && password.length < policy.minLength) {
      errors.push(`Password must be at least ${policy.minLength} characters long`);
    } else {
      score += 20;
    }

    // Character complexity
    if (policy.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    } else if (policy.requireUppercase) {
      score += 15;
    }

    if (policy.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    } else if (policy.requireLowercase) {
      score += 15;
    }

    if (policy.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    } else if (policy.requireNumbers) {
      score += 15;
    }

    if (policy.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    } else if (policy.requireSpecialChars) {
      score += 15;
    }

    // Pattern validation (prevent common patterns)
    if (this.hasCommonPatterns(password)) {
      errors.push('Password contains common patterns that are not allowed');
    } else {
      score += 10;
    }

    // Check password history if user and policy specified
    if (userId && policy.preventReuse && policy.preventReuse > 0) {
      const isReused = await this.isPasswordReused(userId, password, policy.preventReuse);
      if (isReused) {
        errors.push(`Cannot reuse last ${policy.preventReuse} passwords`);
      } else {
        score += 10;
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      score: Math.min(score, 100),
    };
  }

  async isPasswordExpired(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        passwordChangedAt: true,
        center: { select: { organizationId: true } }
      }
    });

    if (!user || !user.passwordChangedAt) {
      return true;
    }

    const policy = await this.getApplicablePolicy(undefined, userId);

    if (!policy || !policy.maxAge) {
      return false;
    }

    const now = new Date();
    const passwordAge = Math.floor(
      (now.getTime() - user.passwordChangedAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    return passwordAge > policy.maxAge;
  }

  async checkAccountLockout(userId: string): Promise<{
    isLocked: boolean;
    remainingAttempts?: number;
    lockoutUntil?: Date;
  }> {
    const policy = await this.getApplicablePolicy(undefined, userId);

    if (!policy || !policy.lockoutThreshold || !policy.lockoutDuration) {
      return { isLocked: false };
    }

    const failedAttempts = await this.getFailedAttempts(userId);
    const lockoutUntil = await this.getLockoutUntil(userId);

    if (lockoutUntil && lockoutUntil > new Date()) {
      return {
        isLocked: true,
        lockoutUntil,
      };
    }

    const remainingAttempts = Math.max(0, policy.lockoutThreshold - failedAttempts);

    return {
      isLocked: false,
      remainingAttempts,
    };
  }

  async recordFailedAttempt(userId: string): Promise<void> {
    const policy = await this.getApplicablePolicy(undefined, userId);

    if (!policy || !policy.lockoutThreshold || !policy.lockoutDuration) {
      return;
    }

    await this.prisma.failedLoginAttempt.create({
      data: {
        userId,
        timestamp: new Date(),
      },
    });

    const failedAttempts = await this.getFailedAttempts(userId);

    if (failedAttempts >= policy.lockoutThreshold) {
      await this.lockAccount(userId, policy.lockoutDuration);
    }
  }

  async recordSuccessfulAttempt(userId: string): Promise<void> {
    // Clear failed attempts on successful login
    await this.prisma.failedLoginAttempt.deleteMany({
      where: { userId },
    });
  }

  async getComplianceReport(organizationId?: string): Promise<{
    totalUsers: number;
    compliantPasswords: number;
    expiredPasswords: number;
    weakPasswords: number;
    complianceScore: number;
  }> {
    const whereClause = organizationId
      ? { center: { organizationId } }
      : {};

    const totalUsers = await this.prisma.user.count({ where: whereClause });

    const expiredPasswords = await this.getUsersWithExpiredPasswords(organizationId);
    const weakPasswords = await this.getUsersWithWeakPasswords(organizationId);

    const compliantPasswords = totalUsers - expiredPasswords.length - weakPasswords.length;
    const complianceScore = totalUsers > 0 ? (compliantPasswords / totalUsers) * 100 : 0;

    return {
      totalUsers,
      compliantPasswords,
      expiredPasswords: expiredPasswords.length,
      weakPasswords: weakPasswords.length,
      complianceScore,
    };
  }

  private async getApplicablePolicy(policyId?: string, userId?: string) {
    if (policyId) {
      return this.prisma.passwordPolicy.findUnique({
        where: { id: policyId, isActive: true },
      });
    }

    if (userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          roles: true,
          center: {
            include: { organization: true }
          }
        },
      });

      if (user) {
        // Check role-specific policies first
        for (const role of user.roles) {
          const rolePolicy = await this.prisma.passwordPolicy.findFirst({
            where: { roleId: role.id, isActive: true },
          });
          if (rolePolicy) return rolePolicy;
        }

        // Then organization policies
        if (user.center?.organizationId) {
          const orgPolicy = await this.prisma.passwordPolicy.findFirst({
            where: { organizationId: user.center.organizationId, isActive: true },
          });
          if (orgPolicy) return orgPolicy;
        }
      }
    }

    // Return default system policy
    return this.prisma.passwordPolicy.findFirst({
      where: { organizationId: null, roleId: null, isActive: true },
    });
  }

  private defaultPasswordValidation(password: string): {
    isValid: boolean;
    errors: string[];
    score: number;
  } {
    const errors: string[] = [];
    let score = 0;

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    } else {
      score += 30;
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    } else {
      score += 25;
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    } else {
      score += 25;
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    } else {
      score += 20;
    }

    return {
      isValid: errors.length === 0,
      errors,
      score,
    };
  }

  private hasCommonPatterns(password: string): boolean {
    const commonPatterns = [
      /123456/i,
      /password/i,
      /qwerty/i,
      /abc123/i,
      /admin/i,
      /(.)\1{2,}/, // Repeated characters
      /012345/i,
      /111111/i,
    ];

    return commonPatterns.some(pattern => pattern.test(password));
  }

  private async isPasswordReused(userId: string, newPassword: string, preventReuse: number): Promise<boolean> {
    const passwordHashes = await this.prisma.passwordHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: preventReuse,
      select: { passwordHash: true },
    });

    for (const history of passwordHashes) {
      const isMatch = await bcrypt.compare(newPassword, history.passwordHash);
      if (isMatch) return true;
    }

    return false;
  }

  private async getFailedAttempts(userId: string): Promise<number> {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    return this.prisma.failedLoginAttempt.count({
      where: {
        userId,
        timestamp: { gte: twentyFourHoursAgo },
      },
    });
  }

  private async getLockoutUntil(userId: string): Promise<Date | null> {
    const lockout = await this.prisma.accountLockout.findFirst({
      where: { userId },
      orderBy: { lockedUntil: 'desc' },
    });

    return lockout?.lockedUntil || null;
  }

  private async lockAccount(userId: string, durationMinutes: number): Promise<void> {
    const lockoutUntil = new Date(Date.now() + durationMinutes * 60 * 1000);

    await this.prisma.accountLockout.create({
      data: {
        userId,
        lockedUntil,
        reason: 'Too many failed login attempts',
      },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });

    this.logger.warn(`Account locked for user ${userId} until ${lockoutUntil}`);
  }

  private async getUsersWithExpiredPasswords(organizationId?: string): Promise<Array<{ id: string }>> {
    const whereClause: any = {
      passwordChangedAt: {
        lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
      },
    };

    if (organizationId) {
      whereClause.center = { organizationId };
    }

    return this.prisma.user.findMany({
      where: whereClause,
      select: { id: true },
    });
  }

  private async getUsersWithWeakPasswords(organizationId?: string): Promise<Array<{ id: string }>> {
    // This would require checking actual password hashes
    // For now, return empty array
    return [];
  }
}