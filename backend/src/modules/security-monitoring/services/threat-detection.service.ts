import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/database/prisma.service';

@Injectable()
export class ThreatDetectionService {
  constructor(private prisma: PrismaService) {}

  async getThreatIntelligence() {
    // Get threat intelligence from recent security events
    const recentThreats = await this.prisma.threatScan.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const threatTypes = await this.prisma.threatScan.groupBy({
      by: ['threatType'],
      _count: true,
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });

    return {
      recent: recentThreats,
      byType: threatTypes.map((t) => ({
        type: t.threatType,
        count: t._count,
      })),
      summary: {
        totalThreats: recentThreats.length,
        criticalThreats: recentThreats.filter((t) => t.severity === 'CRITICAL').length,
        lastScan: recentThreats[0]?.createdAt || null,
      },
    };
  }

  async scanForThreats(userId?: string) {
    const threats: any[] = [];

    // Scan for SQL injection attempts
    const sqlInjectionAttempts = await this.detectSQLInjectionAttempts(userId);
    threats.push(...sqlInjectionAttempts);

    // Scan for brute force attempts
    const bruteForceAttempts = await this.detectBruteForceAttempts(userId);
    threats.push(...bruteForceAttempts);

    // Scan for unauthorized access attempts
    const unauthorizedAccess = await this.detectUnauthorizedAccess(userId);
    threats.push(...unauthorizedAccess);

    // Scan for data exfiltration
    const dataExfiltration = await this.detectDataExfiltration(userId);
    threats.push(...dataExfiltration);

    // Record scan
    await this.prisma.threatScan.create({
      data: {
        userId,
        threatType: 'COMPREHENSIVE',
        severity: threats.length > 0 ? 'HIGH' : 'LOW',
        threatsFound: threats.length,
        details: { threats },
      },
    });

    return {
      threatsFound: threats.length,
      threats,
      scanTime: new Date(),
    };
  }

  private async detectSQLInjectionAttempts(userId?: string): Promise<any[]> {
    const sqlPatterns = ['SELECT', 'DROP', 'INSERT', 'UPDATE', 'DELETE', '--', ';--', 'OR 1=1', 'UNION'];

    // Check audit logs for suspicious patterns
    const suspiciousLogs = await this.prisma.auditLog.findMany({
      where: {
        userId,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
      take: 1000,
    });

    const threats: any[] = [];

    for (const log of suspiciousLogs) {
      const detailsStr = JSON.stringify(log.details).toUpperCase();
      const foundPatterns = sqlPatterns.filter((pattern) => detailsStr.includes(pattern));

      if (foundPatterns.length >= 2) {
        threats.push({
          type: 'SQL_INJECTION_ATTEMPT',
          severity: 'HIGH',
          userId: log.userId,
          timestamp: log.createdAt,
          details: {
            action: log.action,
            patterns: foundPatterns,
          },
        });
      }
    }

    return threats;
  }

  private async detectBruteForceAttempts(userId?: string): Promise<any[]> {
    const threats: any[] = [];

    // Check for multiple failed login attempts from same IP
    const failedAttempts = await this.prisma.failedLoginAttempt.groupBy({
      by: ['userId', 'ipAddress'],
      where: {
        userId,
        createdAt: {
          gte: new Date(Date.now() - 60 * 60 * 1000), // Last hour
        },
      },
      _count: true,
      having: {
        userId: {
          _count: {
            gt: 5,
          },
        },
      },
    });

    for (const attempt of failedAttempts) {
      threats.push({
        type: 'BRUTE_FORCE_ATTEMPT',
        severity: 'CRITICAL',
        userId: attempt.userId,
        ipAddress: attempt.ipAddress,
        attempts: attempt._count,
        timestamp: new Date(),
      });
    }

    return threats;
  }

  private async detectUnauthorizedAccess(userId?: string): Promise<any[]> {
    const threats: any[] = [];

    // Check for access to unauthorized resources
    const unauthorizedLogs = await this.prisma.auditLog.findMany({
      where: {
        userId,
        action: {
          contains: 'UNAUTHORIZED',
        },
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    });

    for (const log of unauthorizedLogs) {
      threats.push({
        type: 'UNAUTHORIZED_ACCESS',
        severity: 'HIGH',
        userId: log.userId,
        resource: log.resourceType,
        timestamp: log.createdAt,
      });
    }

    return threats;
  }

  private async detectDataExfiltration(userId?: string): Promise<any[]> {
    const threats: any[] = [];

    // Check for large data exports
    const largeExports = await this.prisma.auditLog.findMany({
      where: {
        userId,
        action: {
          in: ['DATA_EXPORT', 'REPORT_GENERATED', 'BULK_DOWNLOAD'],
        },
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
      take: 100,
    });

    // Group by user and count
    const exportsByUser = largeExports.reduce((acc: any, log) => {
      acc[log.userId] = (acc[log.userId] || 0) + 1;
      return acc;
    }, {});

    for (const [uid, count] of Object.entries(exportsByUser)) {
      if ((count as number) > 10) {
        threats.push({
          type: 'POTENTIAL_DATA_EXFILTRATION',
          severity: 'MEDIUM',
          userId: uid,
          exportCount: count,
          timestamp: new Date(),
        });
      }
    }

    return threats;
  }
}
