import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/database/prisma.service';
import { ThreatDetectionService } from './services/threat-detection.service';
import { BehavioralAnalyticsService } from './services/behavioral-analytics.service';

@Injectable()
export class SecurityMonitoringService {
  constructor(
    private prisma: PrismaService,
    private threatDetection: ThreatDetectionService,
    private behavioralAnalytics: BehavioralAnalyticsService,
  ) {}

  async getSecurityAlerts(userId?: string, limit = 50) {
    const where: any = { isResolved: false };
    if (userId) {
      where.userId = userId;
    }

    return this.prisma.securityAlert.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async getSecurityAlert(id: string) {
    return this.prisma.securityAlert.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  }

  async resolveAlert(id: string, userId: string, resolution: string) {
    const alert = await this.prisma.securityAlert.update({
      where: { id },
      data: {
        isResolved: true,
        resolvedAt: new Date(),
        resolvedById: userId,
        resolution,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'SECURITY_ALERT_RESOLVED',
        resourceType: 'SECURITY_ALERT',
        resourceId: id,
        details: { resolution },
        ipAddress: '',
        userAgent: '',
      },
    });

    return alert;
  }

  async createSecurityIncident(userId: string, type: string, severity: string, description: string, details: any) {
    const incident = await this.prisma.securityIncident.create({
      data: {
        userId,
        type,
        severity,
        description,
        details,
        status: 'OPEN',
        priority: this.calculatePriority(severity),
      },
    });

    // Auto-assign based on severity
    if (severity === 'CRITICAL' || severity === 'HIGH') {
      // In production, assign to security team
      await this.prisma.notification.create({
        data: {
          userId: 'security-team', // Replace with actual security team ID
          type: 'SECURITY_INCIDENT',
          title: `${severity} Security Incident`,
          message: description,
          channel: 'EMAIL',
        },
      });
    }

    return incident;
  }

  async getSecurityIncidents(status?: string, severity?: string) {
    const where: any = {};
    if (status) where.status = status;
    if (severity) where.severity = severity;

    return this.prisma.securityIncident.findMany({
      where,
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async updateIncidentStatus(id: string, status: string, userId: string) {
    return this.prisma.securityIncident.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date(),
      },
    });
  }

  async getThreatIntelligence() {
    return this.threatDetection.getThreatIntelligence();
  }

  async scanForThreats(userId?: string) {
    return this.threatDetection.scanForThreats(userId);
  }

  async analyzeBehavior(userId: string) {
    return this.behavioralAnalytics.analyzeUserBehavior(userId);
  }

  async getSecurityMetrics(days = 30) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [totalAlerts, resolvedAlerts, openIncidents, criticalIncidents, threatScans] = await Promise.all([
      this.prisma.securityAlert.count({ where: { createdAt: { gte: since } } }),
      this.prisma.securityAlert.count({ where: { createdAt: { gte: since }, isResolved: true } }),
      this.prisma.securityIncident.count({ where: { status: 'OPEN' } }),
      this.prisma.securityIncident.count({ where: { severity: 'CRITICAL', status: { not: 'RESOLVED' } } }),
      this.prisma.threatScan.count({ where: { createdAt: { gte: since } } }),
    ]);

    const alertsByType = await this.prisma.securityAlert.groupBy({
      by: ['type'],
      where: { createdAt: { gte: since } },
      _count: true,
    });

    const incidentsBySeverity = await this.prisma.securityIncident.groupBy({
      by: ['severity'],
      where: { createdAt: { gte: since } },
      _count: true,
    });

    return {
      summary: {
        totalAlerts,
        resolvedAlerts,
        openIncidents,
        criticalIncidents,
        threatScans,
        alertResolutionRate: totalAlerts > 0 ? (resolvedAlerts / totalAlerts) * 100 : 0,
      },
      alertsByType: alertsByType.map((a) => ({
        type: a.type,
        count: a._count,
      })),
      incidentsBySeverity: incidentsBySeverity.map((i) => ({
        severity: i.severity,
        count: i._count,
      })),
    };
  }

  private calculatePriority(severity: string): number {
    const priorities: any = {
      CRITICAL: 1,
      HIGH: 2,
      MEDIUM: 3,
      LOW: 4,
    };
    return priorities[severity] || 5;
  }
}
