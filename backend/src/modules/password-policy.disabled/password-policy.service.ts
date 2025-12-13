import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/common/database/prisma.service';
import { CreatePasswordPolicyDto, UpdatePasswordPolicyDto, ValidatePasswordDto } from './dto/password-policy.dto';
import * as bcrypt from 'bcrypt';
import * as zxcvbn from 'zxcvbn';

@Injectable()
export class PasswordPolicyService {
  constructor(private prisma: PrismaService) {}

  async createPolicy(centerId: string, dto: CreatePasswordPolicyDto, userId: string) {
    const policy = await this.prisma.passwordPolicy.create({
      data: {
        centerId,
        ...dto,
        createdById: userId,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'PASSWORD_POLICY_CREATED',
        resource: 'PASSWORD_POLICY',
        details: { ...dto, resourceId: policy.id },
        ipAddress: '',
        userAgent: '',
      },
    });

    return policy;
  }

  async getPolicy(centerId: string) {
    return this.prisma.passwordPolicy.findFirst({
      where: { centerId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updatePolicy(id: string, dto: UpdatePasswordPolicyDto, userId: string) {
    const policy = await this.prisma.passwordPolicy.update({
      where: { id },
      data: dto,
    });

    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'PASSWORD_POLICY_UPDATED',
        resource: 'PASSWORD_POLICY',
        details: { ...dto, resourceId: id },
        ipAddress: '',
        userAgent: '',
      },
    });

    return policy;
  }

  async validatePassword(dto: ValidatePasswordDto): Promise<any> {
    const policy = await this.getPolicy(dto.centerId);

    if (!policy) {
      return {
        valid: true,
        message: 'No password policy configured',
      };
    }

    const errors: string[] = [];

    // Check minimum length
    if (dto.password.length < policy.minLength) {
      errors.push(`Password must be at least ${policy.minLength} characters long`);
    }

    // Check maximum length
    if (policy.maxLength && dto.password.length > policy.maxLength) {
      errors.push(`Password must not exceed ${policy.maxLength} characters`);
    }

    // Check uppercase requirement
    if (policy.requireUppercase && !/[A-Z]/.test(dto.password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    // Check lowercase requirement
    if (policy.requireLowercase && !/[a-z]/.test(dto.password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    // Check number requirement
    if (policy.requireNumbers && !/\d/.test(dto.password)) {
      errors.push('Password must contain at least one number');
    }

    // Check special character requirement
    if (policy.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(dto.password)) {
      errors.push('Password must contain at least one special character');
    }

    // Check for common passwords
    if (policy.preventCommonPasswords) {
      const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein', 'welcome'];
      if (commonPasswords.includes(dto.password.toLowerCase())) {
        errors.push('Password is too common. Please choose a more secure password');
      }
    }

    // Check password strength using zxcvbn
    if (policy.minStrengthScore) {
      const strength = zxcvbn(dto.password);
      if (strength.score < policy.minStrengthScore) {
        errors.push(`Password strength is too weak (score: ${strength.score}/${policy.minStrengthScore}). ${strength.feedback.warning || ''}`);
      }
    }

    // Check for sequential characters
    if (policy.preventSequential && this.hasSequentialChars(dto.password)) {
      errors.push('Password contains sequential characters (e.g., abc, 123)');
    }

    // Check for repeated characters
    if (policy.preventRepeating && this.hasRepeatingChars(dto.password, 3)) {
      errors.push('Password contains too many repeating characters');
    }

    // Check password history
    if (policy.passwordHistory > 0 && dto.userId) {
      const isReused = await this.checkPasswordHistory(dto.userId, dto.password, policy.passwordHistory);
      if (isReused) {
        errors.push(`Password cannot be the same as your last ${policy.passwordHistory} passwords`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      strength: zxcvbn(dto.password),
    };
  }

  async recordPasswordChange(userId: string, passwordHash: string) {
    await this.prisma.passwordHistory.create({
      data: {
        userId,
        passwordHash,
      },
    });

    // Clean up old password history beyond the retention period
    const policy = await this.prisma.passwordPolicy.findFirst({
      where: { isActive: true },
    });

    if (policy && policy.passwordHistory > 0) {
      const histories = await this.prisma.passwordHistory.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: policy.passwordHistory,
      });

      if (histories.length > 0) {
        await this.prisma.passwordHistory.deleteMany({
          where: {
            id: { in: histories.map((h) => h.id) },
          },
        });
      }
    }
  }

  async checkPasswordExpiry(userId: string): Promise<{ expired: boolean; daysUntilExpiry: number; mustChange: boolean }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { center: true },
    });

    if (!user || !user.centerId) {
      return { expired: false, daysUntilExpiry: 999, mustChange: false };
    }

    const policy = await this.getPolicy(user.centerId);

    if (!policy || !policy.expiryDays) {
      return { expired: false, daysUntilExpiry: 999, mustChange: false };
    }

    const lastPasswordHistory = await this.prisma.passwordHistory.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (!lastPasswordHistory) {
      return { expired: false, daysUntilExpiry: policy.expiryDays, mustChange: false };
    }

    const daysSinceChange = Math.floor((Date.now() - lastPasswordHistory.createdAt.getTime()) / (1000 * 60 * 60 * 24));
    const daysUntilExpiry = policy.expiryDays - daysSinceChange;
    const expired = daysUntilExpiry <= 0;

    return {
      expired,
      daysUntilExpiry: Math.max(0, daysUntilExpiry),
      mustChange: expired,
    };
  }

  async getPasswordPolicyForUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { center: true },
    });

    if (!user || !user.centerId) {
      return null;
    }

    return this.getPolicy(user.centerId);
  }

  async trackFailedLogin(userId: string, ipAddress: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { center: true },
    });

    if (!user || !user.centerId) {
      return;
    }

    const policy = await this.getPolicy(user.centerId);

    if (!policy) {
      return;
    }

    // Record failed login attempt
    await this.prisma.failedLoginAttempt.create({
      data: {
        userId,
        ipAddress,
      },
    });

    // Check if account should be locked
    if (policy.lockoutAttempts > 0) {
      const recentAttempts = await this.prisma.failedLoginAttempt.count({
        where: {
          userId,
          createdAt: {
            gte: new Date(Date.now() - 30 * 60 * 1000), // Last 30 minutes
          },
        },
      });

      if (recentAttempts >= policy.lockoutAttempts) {
        await this.prisma.user.update({
          where: { id: userId },
          data: {
            isLocked: true,
            lockedUntil: new Date(Date.now() + (policy.lockoutDuration || 30) * 60 * 1000),
          },
        });

        // Send notification
        await this.prisma.notification.create({
          data: {
            userId,
            type: 'ACCOUNT_LOCKED',
            title: 'Account Locked',
            message: `Your account has been locked due to ${recentAttempts} failed login attempts. It will be unlocked after ${policy.lockoutDuration} minutes.`,
            channel: 'EMAIL',
          },
        });
      }
    }
  }

  async resetFailedLoginAttempts(userId: string) {
    await this.prisma.failedLoginAttempt.deleteMany({
      where: { userId },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isLocked: false,
        lockedUntil: null,
      },
    });
  }

  private async checkPasswordHistory(userId: string, newPassword: string, historyCount: number): Promise<boolean> {
    const histories = await this.prisma.passwordHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: historyCount,
    });

    for (const history of histories) {
      const isMatch = await bcrypt.compare(newPassword, history.passwordHash);
      if (isMatch) {
        return true;
      }
    }

    return false;
  }

  private hasSequentialChars(password: string): boolean {
    const sequences = ['abc', '123', 'xyz', '789', 'qwerty', 'asdfgh'];
    const lowerPassword = password.toLowerCase();

    for (const seq of sequences) {
      if (lowerPassword.includes(seq)) {
        return true;
      }
    }

    // Check for numeric sequences
    for (let i = 0; i < password.length - 2; i++) {
      const char1 = password.charCodeAt(i);
      const char2 = password.charCodeAt(i + 1);
      const char3 = password.charCodeAt(i + 2);

      if (char2 === char1 + 1 && char3 === char2 + 1) {
        return true;
      }
    }

    return false;
  }

  private hasRepeatingChars(password: string, maxRepeats: number): boolean {
    let count = 1;
    for (let i = 1; i < password.length; i++) {
      if (password[i] === password[i - 1]) {
        count++;
        if (count >= maxRepeats) {
          return true;
        }
      } else {
        count = 1;
      }
    }
    return false;
  }
}
