import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/common/database/prisma.service';
import { AdminDashboardData, SystemMetrics } from '../interfaces/system-administration.interface';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getDashboardData(centerId?: string): Promise<AdminDashboardData> {
    const [
      systemMetrics,
      recentActivities,
      activeAlerts,
      scheduledTasks,
      backupStatus,
      performanceMetrics,
      complianceStatus,
    ] = await Promise.all([
      this.getSystemMetrics(centerId),
      this.getRecentActivities(centerId),
      this.getActiveAlerts(centerId),
      this.getScheduledTasks(centerId),
      this.getBackupStatus(centerId),
      this.getPerformanceMetrics(centerId),
      this.getComplianceStatus(),
    ]);

    return {
      systemMetrics,
      recentActivities,
      activeAlerts,
      scheduledTasks,
      backupStatus,
      performanceMetrics,
      complianceStatus,
    };
  }

  private async getSystemMetrics(centerId?: string): Promise<SystemMetrics> {
    const userWhere = centerId ? { centerId } : {};
    const patientWhere = centerId ? { centerId } : {};

    const [
      totalUsers,
      activeUsers,
      totalPatients,
      totalCenters,
      activeReports,
      scheduledReports,
      backupJobs,
      healthChecks,
      integrationsCount,
      activeAlerts,
    ] = await Promise.all([
      this.prisma.user.count({ where: { ...userWhere, isActive: true } }),
      this.prisma.user.count({
        where: {
          ...userWhere,
          isActive: true,
          lastLoginAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
      }),
      this.prisma.patient.count({ where: { ...patientWhere, isActive: true } }),
      this.prisma.center.count(),
      this.prisma.generatedReport.count({
        where: {
          status: { in: ['PENDING', 'GENERATING'] },
          template: centerId ? { centerId } : undefined,
        },
      }),
      this.prisma.scheduledReport.count({
        where: {
          isActive: true,
          template: centerId ? { centerId } : undefined,
        },
      }),
      this.prisma.backupJob.count({
        where: {
          isActive: true,
          centerId: centerId || null,
        },
      }),
      this.prisma.healthCheck.count({
        where: {
          isActive: true,
        },
      }),
      this.prisma.externalIntegration.count({
        where: {
          isActive: true,
          centerId: centerId || null,
        },
      }),
      this.prisma.systemAlert.count({
        where: {
          isActive: true,
          severity: { in: ['HIGH', 'CRITICAL'] },
        },
      }),
    ]);

    // Get system performance metrics
    const latestMetrics = await this.prisma.performanceMetric.findMany({
      where: {
        timestamp: {
          gte: new Date(Date.now() - 5 * 60 * 1000), // Last 5 minutes
        },
      },
      orderBy: { timestamp: 'desc' },
      take: 100,
    });

    const cpuUsage = this.getLatestMetricValue(latestMetrics, 'CPU_USAGE');
    const memoryUsage = this.getLatestMetricValue(latestMetrics, 'MEMORY_USAGE');
    const diskUsage = this.getLatestMetricValue(latestMetrics, 'DISK_USAGE');
    const databaseConnections = this.getLatestMetricValue(latestMetrics, 'DATABASE_CONNECTIONS');

    return {
      totalUsers,
      activeUsers,
      totalPatients,
      totalCenters,
      systemUptime: this.calculateSystemUptime(),
      cpuUsage: cpuUsage || 0,
      memoryUsage: memoryUsage || 0,
      diskUsage: diskUsage || 0,
      databaseConnections: databaseConnections || 0,
      activeReports,
      scheduledReports,
      backupJobs,
      healthChecks,
      alertsCount: activeAlerts,
      integrationsCount,
    };
  }

  private async getRecentActivities(centerId?: string): Promise<any[]> {
    const activities = await this.prisma.userActivityLog.findMany({
      where: {
        ...(centerId && {
          user: { centerId },
        }),
        timestamp: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { timestamp: 'desc' },
      take: 20,
    });

    return activities.map(activity => ({
      id: activity.id,
      type: activity.activityType,
      activity: activity.activity,
      resource: activity.resource,
      details: activity.details,
      user: activity.user,
      timestamp: activity.timestamp,
      success: activity.success,
      riskScore: activity.riskScore,
    }));
  }

  private async getActiveAlerts(centerId?: string): Promise<any[]> {
    const alerts = await this.prisma.systemAlert.findMany({
      where: {
        isActive: true,
        severity: { in: ['MEDIUM', 'HIGH', 'CRITICAL'] },
      },
      orderBy: [
        { severity: 'desc' },
        { triggeredAt: 'desc' },
      ],
      take: 10,
    });

    return alerts.map(alert => ({
      id: alert.id,
      type: alert.alertType,
      severity: alert.severity,
      title: alert.title,
      description: alert.description,
      source: alert.source,
      triggeredAt: alert.triggeredAt,
      isAcknowledged: alert.isAcknowledged,
      acknowledgedBy: alert.acknowledgedBy,
      acknowledgedAt: alert.acknowledgedAt,
    }));
  }

  private async getScheduledTasks(centerId?: string): Promise<any[]> {
    const tasks = await this.prisma.scheduledTask.findMany({
      where: {
        isActive: true,
        centerId: centerId || null,
      },
      include: {
        _count: {
          select: {
            executions: {
              where: {
                startTime: {
                  gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
                },
              },
            },
          },
        },
      },
      orderBy: { nextRun: 'asc' },
      take: 10,
    });

    return tasks.map(task => ({
      id: task.id,
      name: task.name,
      taskType: task.taskType,
      schedule: task.schedule,
      nextRun: task.nextRun,
      lastRun: task.lastRun,
      successCount: task.successCount,
      failureCount: task.failureCount,
      recentExecutions: task._count.executions,
    }));
  }

  private async getBackupStatus(centerId?: string): Promise<any> {
    const [totalJobs, recentExecutions] = await Promise.all([
      this.prisma.backupJob.count({
        where: {
          isActive: true,
          centerId: centerId || null,
        },
      }),
      this.prisma.backupExecution.findMany({
        where: {
          executionTime: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
          backupJob: {
            centerId: centerId || null,
          },
        },
        include: {
          backupJob: true,
        },
        orderBy: { executionTime: 'desc' },
        take: 10,
      }),
    ]);

    const successfulBackups = recentExecutions.filter(exec => exec.status === 'COMPLETED').length;
    const failedBackups = recentExecutions.filter(exec => exec.status === 'FAILED').length;

    return {
      totalJobs,
      recentExecutions: recentExecutions.length,
      successfulBackups,
      failedBackups,
      successRate: recentExecutions.length > 0 ? (successfulBackups / recentExecutions.length) * 100 : 0,
      lastBackup: recentExecutions[0]?.executionTime || null,
      nextBackup: await this.getNextScheduledBackup(centerId),
    };
  }

  private async getPerformanceMetrics(centerId?: string): Promise<any[]> {
    const metrics = await this.prisma.performanceMetric.findMany({
      where: {
        centerId: centerId || null,
        timestamp: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
      orderBy: { timestamp: 'desc' },
      take: 50,
    });

    return metrics.map(metric => ({
      id: metric.id,
      type: metric.metricType,
      name: metric.metricName,
      value: metric.value,
      unit: metric.unit,
      timestamp: metric.timestamp,
      source: metric.source,
      service: metric.service,
    }));
  }

  private async getComplianceStatus(): Promise<any> {
    const [totalAudits, pendingAudits, failedAudits] = await Promise.all([
      this.prisma.complianceAudit.count(),
      this.prisma.complianceAudit.count({
        where: { status: 'PENDING' },
      }),
      this.prisma.complianceAudit.count({
        where: { status: 'FAILED' },
      }),
    ]);

    const latestAudits = await this.prisma.complianceAudit.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        auditType: true,
        framework: true,
        status: true,
        riskLevel: true,
        score: true,
        scheduledDate: true,
      },
    });

    return {
      totalAudits,
      pendingAudits,
      failedAudits,
      complianceScore: await this.calculateComplianceScore(),
      recentAudits: latestAudits,
    };
  }

  private getLatestMetricValue(metrics: any[], metricType: string): number {
    const metric = metrics.find(m => m.metricType === metricType);
    return metric ? metric.value : 0;
  }

  private calculateSystemUptime(): number {
    // This would typically come from a monitoring service
    // For now, return a mock value
    return 99.9;
  }

  private async getNextScheduledBackup(centerId?: string): Promise<Date | null> {
    const nextBackup = await this.prisma.backupJob.findFirst({
      where: {
        isActive: true,
        nextBackup: {
          not: null,
        },
        centerId: centerId || null,
      },
      orderBy: { nextBackup: 'asc' },
    });

    return nextBackup?.nextBackup || null;
  }

  private async calculateComplianceScore(): Promise<number> {
    const recentAudits = await this.prisma.complianceAudit.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // Last 90 days
        },
        score: {
          not: null,
        },
      },
      select: { score: true },
    });

    if (recentAudits.length === 0) return 100;

    const totalScore = recentAudits.reduce((sum, audit) => sum + audit.score!, 0);
    return Math.round(totalScore / recentAudits.length);
  }
}