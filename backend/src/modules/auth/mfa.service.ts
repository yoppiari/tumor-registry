import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import * as speakeasy from 'speakeasy';

@Injectable()
export class MfaService {
  private readonly logger = new Logger(MfaService.name);

  constructor(private prisma: PrismaService) {}

  async generateSecret(userId: string): Promise<{ secret: string; manualEntryKey: string }> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { email: true }
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const secret = speakeasy.generateSecret({
        name: `INAMSOS (${user.email})`,
        issuer: 'INAMSOS - Indonesia National Cancer Database',
        length: 32,
      });

      this.logger.log(`MFA secret generated for user ${user.email}`);

      return {
        secret: secret.base32!,
        manualEntryKey: secret.base32!,
      };
    } catch (error) {
      this.logger.error(`Error generating MFA secret for user ${userId}`, error);
      throw error;
    }
  }

  async verifyToken(userId: string, token: string): Promise<boolean> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { mfaSecret: true, email: true }
      });

      if (!user || !user.mfaSecret) {
        throw new NotFoundException('MFA not set up for user');
      }

      const verified = speakeasy.totp.verify({
        secret: user.mfaSecret,
        encoding: 'base32',
        token,
        window: 2,
      });

      if (!verified) {
        this.logger.warn(`Invalid MFA token for user ${user.email}`);
      }

      return verified;
    } catch (error) {
      this.logger.error(`Error verifying MFA token for user ${userId}`, error);
      throw error;
    }
  }

  async enableMfa(userId: string, secret: string, token: string): Promise<{ success: boolean; backupCodes: string[] }> {
    try {
      const verified = speakeasy.totp.verify({
        secret,
        encoding: 'base32',
        token,
        window: 2,
      });

      if (!verified) {
        throw new BadRequestException('Invalid verification token');
      }

      const backupCodes = await this.generateBackupCodes();

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          mfaSecret: secret,
          mfaEnabled: true,
        },
      });

      this.logger.log(`MFA enabled for user ${userId}`);

      return {
        success: true,
        backupCodes,
      };
    } catch (error) {
      this.logger.error(`Error enabling MFA for user ${userId}`, error);
      throw error;
    }
  }

  async disableMfa(userId: string, password: string, token?: string): Promise<boolean> {
    try {
      if (token) {
        const user = await this.prisma.user.findUnique({
          where: { id: userId },
          select: { mfaSecret: true }
        });

        if (user?.mfaSecret) {
          const verified = speakeasy.totp.verify({
            secret: user.mfaSecret,
            encoding: 'base32',
            token,
            window: 2,
          });

          if (!verified) {
            throw new BadRequestException('Invalid verification token');
          }
        }
      }

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          mfaSecret: null,
          mfaEnabled: false,
        },
      });

      this.logger.log(`MFA disabled for user ${userId}`);

      return true;
    } catch (error) {
      this.logger.error(`Error disabling MFA for user ${userId}`, error);
      throw error;
    }
  }

  async verifyBackupCode(userId: string, backupCode: string): Promise<boolean> {
    try {
      // For now, we'll implement simple backup code verification
      // In production, this should use proper encryption and storage
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { email: true }
      });

      if (!user) {
        return false;
      }

      // Simple validation - backup codes should be 8 characters alphanumeric
      const isValidFormat = /^[A-Z0-9]{8}$/.test(backupCode);

      if (!isValidFormat) {
        return false;
      }

      this.logger.log(`Backup code verification attempted for user ${userId}`);
      return false; // Always return false for now until proper implementation
    } catch (error) {
      this.logger.error(`Error verifying backup code for user ${userId}`, error);
      return false;
    }
  }

  private async generateBackupCodes(): Promise<string[]> {
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      codes.push(
        Math.random()
          .toString(36)
          .substring(2, 10)
          .toUpperCase(),
      );
    }
    return codes;
  }

  async isMfaRequired(userId: string): Promise<boolean> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          mfaEnabled: true,
          lastLoginAt: true,
        },
      });

      if (!user || !user.mfaEnabled) {
        return false;
      }

      const timeSinceLastLogin = user.lastLoginAt
        ? Date.now() - user.lastLoginAt.getTime()
        : Infinity;

      return timeSinceLastLogin > 24 * 60 * 60 * 1000; // 24 hours
    } catch (error) {
      this.logger.error(`Error checking MFA requirement for user ${userId}`, error);
      return false;
    }
  }

  async regenerateBackupCodes(userId: string, token: string): Promise<string[]> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { mfaSecret: true, email: true }
      });

      if (!user || !user.mfaSecret) {
        throw new NotFoundException('MFA not set up for user');
      }

      const verified = speakeasy.totp.verify({
        secret: user.mfaSecret,
        encoding: 'base32',
        token,
        window: 2,
      });

      if (!verified) {
        throw new BadRequestException('Invalid verification token');
      }

      const backupCodes = await this.generateBackupCodes();

      this.logger.log(`Backup codes regenerated for user ${userId}`);

      return backupCodes;
    } catch (error) {
      this.logger.error(`Error regenerating backup codes for user ${userId}`, error);
      throw error;
    }
  }
}