import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/database/prisma.service';
import * as crypto from 'crypto';
import * as UAParser from 'ua-parser-js';

@Injectable()
export class SessionManagementService {
  constructor(private prisma: PrismaService) {}

  async createSession(userId: string, ipAddress: string, userAgent: string, token: string) {
    const parser = new UAParser(userAgent);
    const ua = parser.getResult();

    const deviceFingerprint = this.generateDeviceFingerprint(ipAddress, userAgent);

    // Check concurrent session limits
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { center: true },
    });

    if (user?.centerId) {
      const policy = await this.prisma.passwordPolicy.findFirst({
        where: { centerId: user.centerId, isActive: true },
      });

      if (policy?.maxConcurrentSessions) {
        const activeSessions = await this.prisma.userSession.count({
          where: {
            userId,
            isActive: true,
            expiresAt: { gt: new Date() },
          },
        });

        if (activeSessions >= policy.maxConcurrentSessions) {
          // Terminate oldest session
          const oldestSession = await this.prisma.userSession.findFirst({
            where: {
              userId,
              isActive: true,
            },
            orderBy: { createdAt: 'asc' },
          });

          if (oldestSession) {
            await this.terminateSession(oldestSession.id, userId);
          }
        }
      }
    }

    const session = await this.prisma.userSession.create({
      data: {
        userId,
        token,
        ipAddress,
        userAgent,
        deviceType: ua.device.type || 'desktop',
        deviceName: `${ua.browser.name} on ${ua.os.name}`,
        browser: ua.browser.name,
        os: ua.os.name,
        deviceFingerprint,
        location: await this.getLocationFromIP(ipAddress),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        isActive: true,
      },
    });

    // Check for anomalies
    await this.detectSessionAnomaly(userId, session);

    return session;
  }

  async getUserSessions(userId: string) {
    return this.prisma.userSession.findMany({
      where: {
        userId,
        isActive: true,
        expiresAt: { gt: new Date() },
      },
      orderBy: { lastActivityAt: 'desc' },
    });
  }

  async getSessionById(id: string) {
    return this.prisma.userSession.findUnique({
      where: { id },
    });
  }

  async updateSessionActivity(sessionId: string) {
    return this.prisma.userSession.update({
      where: { id: sessionId },
      data: {
        lastActivityAt: new Date(),
      },
    });
  }

  async terminateSession(sessionId: string, userId: string) {
    const session = await this.prisma.userSession.update({
      where: { id: sessionId },
      data: {
        isActive: false,
        terminatedAt: new Date(),
      },
    });

    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'SESSION_TERMINATED',
        resourceType: 'SESSION',
        resourceId: sessionId,
        details: { sessionId },
        ipAddress: '',
        userAgent: '',
      },
    });

    return session;
  }

  async terminateAllSessions(userId: string, exceptSessionId?: string) {
    const where: any = {
      userId,
      isActive: true,
    };

    if (exceptSessionId) {
      where.id = { not: exceptSessionId };
    }

    await this.prisma.userSession.updateMany({
      where,
      data: {
        isActive: false,
        terminatedAt: new Date(),
      },
    });

    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'ALL_SESSIONS_TERMINATED',
        resourceType: 'SESSION',
        resourceId: userId,
        details: { exceptSessionId },
        ipAddress: '',
        userAgent: '',
      },
    });

    return { message: 'All sessions terminated successfully' };
  }

  async detectSessionAnomaly(userId: string, newSession: any) {
    // Get recent sessions
    const recentSessions = await this.prisma.userSession.findMany({
      where: {
        userId,
        id: { not: newSession.id },
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const anomalies: string[] = [];

    // Check for new device
    const knownFingerprints = recentSessions.map((s) => s.deviceFingerprint);
    if (!knownFingerprints.includes(newSession.deviceFingerprint)) {
      anomalies.push('NEW_DEVICE');
    }

    // Check for unusual location
    const knownLocations = recentSessions.map((s) => s.location);
    if (newSession.location && !knownLocations.includes(newSession.location)) {
      anomalies.push('NEW_LOCATION');
    }

    // Check for rapid location change
    const lastSession = recentSessions[0];
    if (lastSession && lastSession.location && newSession.location) {
      const timeDiff = newSession.createdAt.getTime() - lastSession.createdAt.getTime();
      if (timeDiff < 60 * 60 * 1000 && lastSession.location !== newSession.location) {
        // Different location within 1 hour
        anomalies.push('RAPID_LOCATION_CHANGE');
      }
    }

    // Check for multiple concurrent sessions from different devices
    const activeSessionCount = await this.prisma.userSession.count({
      where: {
        userId,
        isActive: true,
        deviceFingerprint: { not: newSession.deviceFingerprint },
      },
    });

    if (activeSessionCount >= 2) {
      anomalies.push('MULTIPLE_CONCURRENT_SESSIONS');
    }

    if (anomalies.length > 0) {
      // Create security alert
      await this.prisma.securityAlert.create({
        data: {
          userId,
          type: 'SESSION_ANOMALY',
          severity: 'MEDIUM',
          description: `Session anomalies detected: ${anomalies.join(', ')}`,
          details: {
            anomalies,
            sessionId: newSession.id,
            ipAddress: newSession.ipAddress,
            location: newSession.location,
            device: newSession.deviceName,
          },
          isResolved: false,
        },
      });

      // Send notification
      await this.prisma.notification.create({
        data: {
          userId,
          type: 'SECURITY_ALERT',
          title: 'Unusual Login Detected',
          message: `We detected a login from a ${anomalies.includes('NEW_DEVICE') ? 'new device' : 'different location'}. If this wasn't you, please secure your account immediately.`,
          channel: 'EMAIL',
        },
      });
    }

    return anomalies;
  }

  async cleanupExpiredSessions() {
    const result = await this.prisma.userSession.updateMany({
      where: {
        expiresAt: { lt: new Date() },
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    return { cleaned: result.count };
  }

  private generateDeviceFingerprint(ipAddress: string, userAgent: string): string {
    return crypto
      .createHash('sha256')
      .update(`${ipAddress}-${userAgent}`)
      .digest('hex')
      .substring(0, 16);
  }

  private async getLocationFromIP(ipAddress: string): Promise<string> {
    // In production, use a IP geolocation service like MaxMind or ipapi
    // For now, return a placeholder
    if (ipAddress.startsWith('192.168.') || ipAddress === '127.0.0.1') {
      return 'Local Network';
    }
    return 'Unknown';
  }
}
